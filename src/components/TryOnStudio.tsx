import { useRef, useCallback, useState, useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { products, skinTones, backdrops } from '@/data/products';
import { toast } from '@/hooks/use-toast';
import OverlayComposer, { type OverlayComposerHandle } from './tryon/OverlayComposer';
import { downloadImage, shareImage } from './tryon/imageActions';

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2;

const TryOnStudio = () => {
  const {
    tryOn, setTryOn, selectedTone, setTone, selectedBackdrop, setBackdrop,
    userPhoto, setUserPhoto,
    addToBag,
  } = useStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const composerRef = useRef<OverlayComposerHandle>(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);

  const top = tryOn.top ? products.find(p => p.id === tryOn.top) : null;
  const bottom = tryOn.bottom ? products.find(p => p.id === tryOn.bottom) : null;
  const shoes = tryOn.shoes ? products.find(p => p.id === tryOn.shoes) : null;
  const bag = tryOn.bag ? products.find(p => p.id === tryOn.bag) : null;
  const selected = useMemo(
    () => [top, bottom, shoes, bag].filter(Boolean) as NonNullable<typeof top>[],
    [top, bottom, shoes, bag]
  );

  const backdrop = backdrops.find(b => b.id === selectedBackdrop) || backdrops[0];

  const selectionItems = products.map(p => ({
    ...p,
    active: tryOn[p.category.toLowerCase() as keyof typeof tryOn] === p.id,
  }));

  const clampZoom = (z: number) => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, z));

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

  const canCompose = !!userPhoto && selected.length > 0;
  const outfitName = selected.length ? selected.map(i => i.name).join(' + ') : 'try-on';

  const handleDownload = async () => {
    const dataUrl = await composerRef.current?.exportPNG();
    if (dataUrl) downloadImage(dataUrl, outfitName);
    else toast({ title: 'Download failed', description: 'Could not export the composite.', variant: 'destructive' });
  };

  const handleShare = async () => {
    const dataUrl = await composerRef.current?.exportPNG();
    if (dataUrl) shareImage(dataUrl, outfitName);
  };

  const handleBuyLook = () => {
    if (selected.length === 0) return;
    selected.forEach(p => addToBag(p.id));
    toast({ title: '🛍️ Added to bag', description: `${selected.length} item${selected.length > 1 ? 's' : ''} from this look added.` });
  };

  return (
    <section id="studio" className="glass-surface !rounded-3xl p-6 mt-4">
      <div className="flex justify-between items-start mb-5 flex-wrap gap-2">
        <div>
          <p className="eyebrow">Image-based</p>
          <h3 className="font-display text-2xl">Virtual Try-On Studio</h3>
        </div>
        <span className="text-xs text-muted-foreground max-w-[320px] text-right">
          Upload your photo, pick items, and drag each piece into place to compose your look.
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
            <p className="text-[11px] text-muted-foreground mt-3">
              Tip: click any item on your photo to resize, rotate, or reset it.
            </p>
          </div>
        </div>

        {/* Right Panel — Composer */}
        <div className="glass-surface !rounded-3xl p-5">
          <div className="flex justify-between items-start mb-4 flex-wrap gap-2">
            <div>
              <span className="eyebrow">Step 3 — Compose your look</span>
              <h4 className="font-display text-lg mt-1">
                {selected.length ? outfitName : 'Select clothes to preview'}
              </h4>
            </div>
            {canCompose && (
              <div className="flex gap-1.5 items-center bg-card/70 backdrop-blur rounded-full p-1 border border-border/50">
                <button
                  onClick={() => setZoom(z => clampZoom(z - 0.1))}
                  className="w-7 h-7 rounded-full hover:bg-muted grid place-items-center text-sm"
                  title="Zoom out"
                >−</button>
                <span className="text-xs w-10 text-center">{Math.round(zoom * 100)}%</span>
                <button
                  onClick={() => setZoom(z => clampZoom(z + 0.1))}
                  className="w-7 h-7 rounded-full hover:bg-muted grid place-items-center text-sm"
                  title="Zoom in"
                >+</button>
                <button
                  onClick={() => setZoom(1)}
                  className="px-2 h-7 rounded-full hover:bg-muted text-[10px] uppercase tracking-wider"
                  title="Reset zoom"
                >reset</button>
                <button
                  onClick={() => setFullscreen(true)}
                  className="w-7 h-7 rounded-full hover:bg-muted grid place-items-center text-sm"
                  title="Fullscreen"
                >⛶</button>
              </div>
            )}
          </div>

          {/* Preview Area */}
          <div
            ref={previewRef}
            className="rounded-3xl min-h-[460px] p-6 relative flex flex-col items-center justify-center overflow-hidden"
            style={{ background: backdrop.style }}
          >
            {canCompose ? (
              <OverlayComposer
                ref={composerRef}
                userPhoto={userPhoto!}
                items={selected}
                zoom={zoom}
              />
            ) : !userPhoto ? (
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="w-20 h-20 rounded-full bg-muted/50 grid place-items-center text-4xl">👤</div>
                <strong className="font-display text-lg">Upload your photo first</strong>
                <p className="text-sm text-muted-foreground max-w-[280px]">
                  Take a full-body photo or upload one, then select the clothes you want to try on.
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 text-center">
                <img src={userPhoto} alt="Your photo" className="w-32 h-40 rounded-2xl object-cover opacity-60" />
                <strong className="font-display text-lg">Now pick your outfit</strong>
                <p className="text-sm text-muted-foreground max-w-[280px]">
                  Select clothes from the panel on the left to start composing your look.
                </p>
              </div>
            )}
          </div>

          {/* Action bar */}
          {canCompose && (
            <div className="flex flex-wrap gap-2 mt-3">
              <button onClick={handleDownload} className="btn-secondary text-xs !py-2 !px-4">⬇ Download</button>
              <button onClick={handleShare} className="btn-secondary text-xs !py-2 !px-4">🔗 Share</button>
              <button onClick={handleBuyLook} className="btn-primary text-xs !py-2 !px-4 ml-auto">
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

      {/* Fullscreen lightbox */}
      {fullscreen && canCompose && (
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
          <div onClick={(e) => e.stopPropagation()} className="max-h-[92vh] max-w-[92vw]">
            <OverlayComposer
              userPhoto={userPhoto!}
              items={selected}
              zoom={1}
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default TryOnStudio;
