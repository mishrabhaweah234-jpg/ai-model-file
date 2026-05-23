import { useRef, useCallback, useState, useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { products, skinTones, backdrops } from '@/data/products';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import DraggablePanel, { type DraggablePanelHandle } from './DraggablePanel';
import AngleSelector from './tryon/AngleSelector';
import FloatingControls from './tryon/FloatingControls';
import ResultCanvas from './tryon/ResultCanvas';
import { downloadImage, shareImage } from './tryon/imageActions';
import { useTryOnCache, buildSignature } from '@/hooks/useTryOnCache';
import { useSavedLooks } from '@/hooks/useSavedLooks';
import { useOutfitHistory } from '@/hooks/useOutfitHistory';
import GenerationProgress from './tryon/GenerationProgress';
import LooksGallery from './tryon/LooksGallery';
import type { Angle } from './tryon/types';

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3;

const TryOnStudio = () => {
  const {
    tryOn, setTryOn, selectedTone, setTone, selectedBackdrop, setBackdrop,
    userPhoto, setUserPhoto, isGenerating, setIsGenerating, generatedImage, setGeneratedImage,
    addToBag,
  } = useStore();

  const isMobile = useIsMobile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const zoomPanelRef = useRef<DraggablePanelHandle>(null);
  const anglePanelRef = useRef<DraggablePanelHandle>(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [zoom, setZoomState] = useState(1);
  const [angle, setAngle] = useState<Angle>('front');
  const [loadingAngle, setLoadingAngle] = useState<Angle | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [compareMode, setCompareMode] = useState(false);

  const top = tryOn.top ? products.find(p => p.id === tryOn.top) : null;
  const bottom = tryOn.bottom ? products.find(p => p.id === tryOn.bottom) : null;
  const shoes = tryOn.shoes ? products.find(p => p.id === tryOn.shoes) : null;
  const bag = tryOn.bag ? products.find(p => p.id === tryOn.bag) : null;
  const selected = useMemo(() => [top, bottom, shoes, bag].filter(Boolean), [top, bottom, shoes, bag]);

  const backdrop = backdrops.find(b => b.id === selectedBackdrop) || backdrops[0];

  const selectionItems = products.map(p => ({
    ...p,
    active: tryOn[p.category.toLowerCase() as keyof typeof tryOn] === p.id,
  }));

  // Persistent cache keyed by photo + outfit
  const signature = useMemo(
    () => buildSignature(userPhoto, selected.map(p => p!.id)),
    [userPhoto, selected]
  );
  const { views: angleViews, setAngleImage, clear: clearCache, setViews } = useTryOnCache(signature);
  const { looks: savedLooks, save: saveLook, remove: removeSavedLook } = useSavedLooks();
  const { items: history, push: pushHistory } = useOutfitHistory();

  const restoreLook = useCallback((image: string, productIds: string[]) => {
    // Restore outfit selection from a saved/history entry
    const tryOnState: Record<string, string | null> = { top: null, bottom: null, shoes: null, bag: null };
    productIds.forEach((id) => {
      const p = products.find((x) => x.id === id);
      if (p) tryOnState[p.category.toLowerCase()] = id;
    });
    Object.entries(tryOnState).forEach(([cat, id]) => setTryOn(cat, id));
    setGeneratedImage(image);
    setAngle('front');
    toast({ title: 'Look restored', description: 'Outfit and preview loaded.' });
  }, [setTryOn, setGeneratedImage]);

  const setZoom = useCallback((updater: (z: number) => number) => {
    setZoomState((z) => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, updater(z))));
  }, []);

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setUserPhoto(e.target?.result as string);
      setCameraActive(false);
    };
    reader.readAsDataURL(file);
  }, [setUserPhoto]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      setCameraActive(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 100);
    } catch {
      toast({ title: 'Camera blocked', description: 'Please allow camera permissions in your browser.', variant: 'destructive' });
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
    setUserPhoto(canvas.toDataURL('image/jpeg', 0.9));
    const stream = videoRef.current.srcObject as MediaStream;
    stream?.getTracks().forEach(t => t.stop());
    setCameraActive(false);
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
    }
    setCameraActive(false);
  };

  const handleGenerateTryOn = async (force = false) => {
    if (!userPhoto || selected.length === 0) return;

    // Use cached front view if available unless forcing regeneration
    if (!force && angleViews.front) {
      setGeneratedImage(angleViews.front);
      setAngle('front');
      toast({ title: 'Loaded from cache', description: 'Tap "Regenerate" to make a new one.' });
      return;
    }

    setIsGenerating(true);
    setGeneratedImage(null);
    setViews({});
    setAngle('front');
    setZoomState(1);
    setCompareMode(false);

    try {
      const selectedItems = selected.map(p => ({
        name: p!.name,
        category: p!.category,
        description: p!.description,
      }));

      const { data, error } = await supabase.functions.invoke('generate-tryon', {
        body: { userPhoto, selectedItems, angle: 'front' },
      });

      if (error) throw new Error(error.message || 'Generation failed');
      if (data?.error) {
        toast({ title: 'Try-On Error', description: data.error, variant: 'destructive' });
        return;
      }
      if (data?.image) {
        setGeneratedImage(data.image);
        setAngleImage('front', data.image);
        pushHistory({
          image: data.image,
          name: selected.map((p) => p!.name).join(' + '),
          productIds: selected.map((p) => p!.id),
        });
        toast({ title: '✨ Try-On Ready!', description: 'Your AI-generated outfit preview is ready.' });
      } else {
        toast({ title: 'No image generated', description: 'AI could not produce an image. Try a clearer full-body photo.', variant: 'destructive' });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      console.error('Try-on generation error:', err);
      toast({ title: 'Generation Failed', description: msg, variant: 'destructive' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateAngle = async (targetAngle: Exclude<Angle, 'front'>, force = false) => {
    if (!generatedImage || !userPhoto || selected.length === 0) return;
    if (!force && angleViews[targetAngle]) {
      setAngle(targetAngle);
      return;
    }
    setLoadingAngle(targetAngle);
    try {
      const selectedItems = selected.map(p => ({
        name: p!.name,
        category: p!.category,
        description: p!.description,
      }));
      const { data, error } = await supabase.functions.invoke('generate-tryon', {
        body: {
          userPhoto,
          selectedItems,
          angle: targetAngle,
          baseImage: angleViews.front || generatedImage,
        },
      });
      if (error) throw new Error(error.message || 'Angle generation failed');
      if (data?.error) {
        toast({ title: 'Angle Error', description: data.error, variant: 'destructive' });
        return;
      }
      if (data?.image) {
        setAngleImage(targetAngle, data.image);
        setAngle(targetAngle);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong.';
      toast({ title: 'Angle Failed', description: msg, variant: 'destructive' });
    } finally {
      setLoadingAngle(null);
    }
  };

  const currentImage = angleViews[angle] || generatedImage;
  const canGenerate = !!userPhoto && selected.length > 0;

  const outfitName = selected.length ? selected.map(i => i!.name).join(' + ') : 'try-on';

  const handleBuyLook = () => {
    if (selected.length === 0) return;
    selected.forEach(p => addToBag(p!.id));
    toast({ title: '🛍️ Added to bag', description: `${selected.length} item${selected.length > 1 ? 's' : ''} from this look added.` });
  };

  const resetPanels = () => {
    zoomPanelRef.current?.reset();
    anglePanelRef.current?.reset();
  };

  return (
    <section id="studio" className="glass-surface !rounded-3xl p-6 mt-4">
      <div className="flex justify-between items-start mb-5 flex-wrap gap-2">
        <div>
          <p className="eyebrow">AI-Powered</p>
          <h3 className="font-display text-2xl">Virtual Try-On Studio</h3>
        </div>
        <span className="text-xs text-muted-foreground max-w-[300px] text-right">
          Upload your photo, select clothes, and AI will generate you wearing the outfit.
        </span>
      </div>

      <div className="grid lg:grid-cols-[340px_1fr] gap-4">
        {/* Left Panel — Upload & Selection */}
        <div className="space-y-4">
          {/* Photo Upload */}
          <div className="glass-surface !rounded-3xl p-4">
            <span className="eyebrow">Step 1 — Your photo</span>

            {cameraActive ? (
              <div className="mt-3 rounded-3xl overflow-hidden relative">
                <video ref={videoRef} className="w-full rounded-3xl" autoPlay playsInline muted />
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                  <button onClick={capturePhoto} className="btn-primary text-xs !py-2 !px-5">📸 Capture</button>
                  <button onClick={stopCamera} className="btn-secondary text-xs !py-2 !px-4">Cancel</button>
                </div>
              </div>
            ) : userPhoto ? (
              <div className="mt-3 relative group">
                <img src={userPhoto} alt="Your photo" className="w-full rounded-3xl object-cover max-h-[240px]" />
                <div className="absolute inset-0 bg-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl flex items-center justify-center gap-2">
                  <button onClick={() => setUserPhoto(null)} className="btn-secondary text-xs !py-2">Remove</button>
                  <button onClick={() => fileInputRef.current?.click()} className="btn-primary text-xs !py-2">Change</button>
                </div>
              </div>
            ) : (
              <div
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onClick={() => fileInputRef.current?.click()}
                className={`mt-3 min-h-[180px] rounded-3xl border-2 border-dashed cursor-pointer
                  flex flex-col items-center justify-center text-center p-4 transition-all
                  ${dragOver
                    ? 'border-primary bg-primary/10 scale-[1.02]'
                    : 'border-foreground/20 bg-gradient-to-b from-lavender/50 to-card hover:border-primary/50'
                  }`}
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-peach/30 to-coral/20 grid place-items-center text-3xl mb-3">
                  📷
                </div>
                <strong className="text-sm">Upload your photo</strong>
                <p className="text-xs text-muted-foreground mt-1">
                  Drag & drop or click to browse. Full body photos work best.
                </p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            />

            {!cameraActive && !userPhoto && (
              <div className="flex gap-2 mt-3">
                <button onClick={() => fileInputRef.current?.click()} className="btn-secondary flex-1 text-xs !py-2.5">
                  📁 Upload Image
                </button>
                <button onClick={openCamera} className="btn-secondary flex-1 text-xs !py-2.5">
                  📹 Open Camera
                </button>
              </div>
            )}
          </div>

          {/* Clothing Selector */}
          <div className="glass-surface !rounded-3xl p-4">
            <span className="eyebrow">Step 2 — Pick your outfit</span>
            <div className="grid grid-cols-2 gap-2 mt-3">
              {selectionItems.map(p => (
                <button
                  key={p.id}
                  onClick={() => setTryOn(p.category.toLowerCase(), p.active ? null : p.id)}
                  className={`rounded-2xl p-2.5 text-left text-xs border transition-all ${
                    p.active
                      ? 'border-primary bg-primary/10 ring-2 ring-primary/30'
                      : 'border-border bg-card hover:bg-muted'
                  }`}
                >
                  <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg mb-1.5 object-contain" loading="lazy" />
                  <strong className="block truncate">{p.name}</strong>
                  <span className="text-muted-foreground">{p.category}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel — AI Preview */}
        <div className="glass-surface !rounded-3xl p-5">
          <div className="flex justify-between items-start mb-4 flex-wrap gap-2">
            <div>
              <span className="eyebrow">Step 3 — AI Preview</span>
              <h4 className="font-display text-lg mt-1">
                {selected.length ? outfitName : 'Select clothes to preview'}
              </h4>
            </div>
            {canGenerate && (
              <div className="flex gap-2">
                {generatedImage && (
                  <button
                    onClick={() => handleGenerateTryOn(true)}
                    disabled={isGenerating}
                    className="btn-secondary text-xs !py-2.5 !px-3 disabled:opacity-50"
                    title="Generate a new try-on from scratch"
                  >
                    🔄 Regenerate
                  </button>
                )}
                <button
                  onClick={() => handleGenerateTryOn(false)}
                  disabled={isGenerating}
                  className="btn-primary text-sm !py-2.5 !px-5 disabled:opacity-50"
                >
                  {isGenerating ? '✨ Generating...' : generatedImage ? '✨ Try-On' : '🪄 Generate Try-On'}
                </button>
              </div>
            )}
          </div>

          {/* Preview Area */}
          <div
            ref={previewRef}
            className="rounded-3xl min-h-[400px] p-6 relative flex flex-col items-center justify-center overflow-hidden"
            style={{ background: backdrop.style }}
          >
            {/* View tabs */}
            <div className="flex gap-2 absolute top-4 left-4 z-10">
              {['Front View', 'Fit Overlay', 'Color Match'].map((v, i) => (
                <button key={v} className={`badge-tag text-xs !py-1.5 !px-3 ${i === 0 ? '!bg-navy !text-primary-foreground' : ''}`}>
                  {v}
                </button>
              ))}
            </div>

            {isGenerating ? (
              <GenerationProgress />
            ) : generatedImage && currentImage && userPhoto ? (
              <div className="relative w-full h-full flex flex-col items-center">
                <ResultCanvas
                  image={currentImage}
                  originalPhoto={userPhoto}
                  angle={angle}
                  zoom={zoom}
                  setZoom={setZoom}
                  loadingAngle={loadingAngle}
                  compareMode={compareMode}
                />

                {/* Desktop: floating draggable panels */}
                {!isMobile && (
                  <>
                    <DraggablePanel
                      ref={zoomPanelRef}
                      initial={{ top: '1rem', right: '1rem' }}
                      className="bg-card/80 backdrop-blur-md rounded-2xl p-1.5 shadow-md border border-border/50"
                      handleClassName="h-3 -mb-0.5"
                      boundsRef={previewRef}
                      snapToEdge
                    >
                      <FloatingControls
                        onZoomIn={() => setZoom(z => z + 0.25)}
                        onZoomOut={() => setZoom(z => z - 0.25)}
                        onResetZoom={() => setZoomState(1)}
                        onFullscreen={() => setFullscreen(true)}
                        onToggleCompare={() => setCompareMode(c => !c)}
                        compareActive={compareMode}
                        orientation="vertical"
                      />
                    </DraggablePanel>

                    <DraggablePanel
                      ref={anglePanelRef}
                      initial={{ top: '50%', left: '1rem', transform: 'translateY(-50%)' }}
                      className="bg-card/80 backdrop-blur-md rounded-2xl px-1.5 pb-2 shadow-md border border-border/50"
                      handleClassName="h-3 -mb-0.5"
                      boundsRef={previewRef}
                      snapToEdge
                    >
                      <AngleSelector
                        current={angle}
                        views={angleViews}
                        loadingAngle={loadingAngle}
                        onSelect={setAngle}
                        onGenerate={handleGenerateAngle}
                        orientation="vertical"
                      />
                    </DraggablePanel>

                    <button
                      onClick={resetPanels}
                      className="absolute bottom-3 left-3 z-10 text-[10px] uppercase tracking-widest bg-card/70 backdrop-blur px-2.5 py-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-card transition border border-border/50"
                      title="Reset panel positions"
                    >
                      ↺ Reset layout
                    </button>
                  </>
                )}
              </div>
            ) : !userPhoto ? (
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="w-20 h-20 rounded-full bg-muted/50 grid place-items-center text-4xl">👤</div>
                <strong className="font-display text-lg">Upload your photo first</strong>
                <p className="text-sm text-muted-foreground max-w-[280px]">
                  Take a full-body photo or upload one, then select the clothes you want to try on.
                </p>
              </div>
            ) : selected.length === 0 ? (
              <div className="flex flex-col items-center gap-3 text-center">
                <img src={userPhoto} alt="Your photo" className="w-32 h-40 rounded-2xl object-cover opacity-60" />
                <strong className="font-display text-lg">Now pick your outfit</strong>
                <p className="text-sm text-muted-foreground max-w-[280px]">
                  Select clothes from the panel on the left, then hit "Generate Try-On" to see the magic.
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="relative">
                  <img src={userPhoto} alt="Your photo" className="w-36 h-44 rounded-2xl object-cover" />
                  <div className="absolute -right-4 -bottom-2 flex -space-x-2">
                    {selected.slice(0, 3).map(p => (
                      <div key={p!.id} className="w-10 h-10 rounded-xl border-2 border-card" style={{ background: p!.background }} />
                    ))}
                  </div>
                </div>
                <strong className="font-display text-lg mt-2">Ready to generate!</strong>
                <p className="text-sm text-muted-foreground max-w-[280px]">
                  {selected.length} item{selected.length > 1 ? 's' : ''} selected. Click "Generate Try-On" above to see yourself in this outfit.
                </p>
              </div>
            )}
          </div>

          {/* Mobile bottom sheet — angle picker + zoom + actions */}
          {isMobile && generatedImage && currentImage && (
            <div className="mt-3 glass-surface !rounded-2xl p-3 space-y-3">
              <AngleSelector
                current={angle}
                views={angleViews}
                loadingAngle={loadingAngle}
                onSelect={setAngle}
                onGenerate={handleGenerateAngle}
                orientation="horizontal"
              />
              <div className="flex items-center justify-between gap-2">
                <FloatingControls
                  onZoomIn={() => setZoom(z => z + 0.25)}
                  onZoomOut={() => setZoom(z => z - 0.25)}
                  onResetZoom={() => setZoomState(1)}
                  onFullscreen={() => setFullscreen(true)}
                  onToggleCompare={() => setCompareMode(c => !c)}
                  compareActive={compareMode}
                  orientation="horizontal"
                />
              </div>
            </div>
          )}

          {/* Action bar — download, share, buy the look */}
          {generatedImage && currentImage && (
            <div className="flex flex-wrap gap-2 mt-3">
              <button
                onClick={() => downloadImage(currentImage, outfitName)}
                className="btn-secondary text-xs !py-2 !px-4"
              >
                ⬇ Download
              </button>
              <button
                onClick={() => shareImage(currentImage, outfitName)}
                className="btn-secondary text-xs !py-2 !px-4"
              >
                🔗 Share
              </button>
              <button
                onClick={() => {
                  if (!currentImage) return;
                  saveLook({
                    image: currentImage,
                    name: outfitName,
                    productIds: selected.map((p) => p!.id),
                  });
                  toast({ title: '💖 Saved to My Looks', description: 'Find it in the gallery below.' });
                }}
                className="btn-secondary text-xs !py-2 !px-4"
              >
                💖 Save look
              </button>
              <button
                onClick={clearCache}
                className="btn-secondary text-xs !py-2 !px-4"
                title="Clear cached angles for this outfit"
              >
                🧹 Clear cache
              </button>
              <button
                onClick={handleBuyLook}
                className="btn-primary text-xs !py-2 !px-4 ml-auto"
              >
                🛍️ Buy this look ({selected.length})
              </button>
            </div>
          )}

          {/* Controls */}
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <div className="glass-surface !rounded-2xl p-3">
              <span className="eyebrow">Skin tone</span>
              <div className="flex gap-2 mt-2">
                {skinTones.map(t => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    className={`w-9 h-9 rounded-full border-2 transition-all ${selectedTone === t ? 'border-primary scale-110' : 'border-transparent'}`}
                    style={{ background: t }}
                  />
                ))}
              </div>
            </div>
            <div className="glass-surface !rounded-2xl p-3">
              <span className="eyebrow">Backdrop mood</span>
              <div className="flex gap-2 mt-2 flex-wrap">
                {backdrops.map(b => (
                  <button
                    key={b.id}
                    onClick={() => setBackdrop(b.id)}
                    className={`badge-tag text-xs !py-1.5 !px-3 ${selectedBackdrop === b.id ? '!bg-navy !text-primary-foreground' : ''}`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Outfit history + saved looks */}
      <LooksGallery
        history={history}
        saved={savedLooks}
        onRestore={restoreLook}
        onRemoveSaved={removeSavedLook}
        onShare={shareImage}
      />



      {/* Fullscreen lightbox */}
      {fullscreen && currentImage && (
        <div
          className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-md flex items-center justify-center p-6"
          onClick={() => setFullscreen(false)}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setFullscreen(false); }}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-card/80 backdrop-blur-md border border-border/50 grid place-items-center hover:bg-muted transition text-foreground text-lg"
            aria-label="Close fullscreen"
          >
            ✕
          </button>
          <img
            src={currentImage}
            alt={`AI Try-On Result — ${angle} view (fullscreen)`}
            className="max-h-[92vh] max-w-[92vw] object-contain rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); downloadImage(currentImage, outfitName); }}
              className="btn-secondary text-xs !py-2 !px-4"
            >
              ⬇ Download
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); shareImage(currentImage, outfitName); }}
              className="btn-secondary text-xs !py-2 !px-4"
            >
              🔗 Share
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default TryOnStudio;
