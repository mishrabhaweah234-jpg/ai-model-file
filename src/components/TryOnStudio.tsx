import { useRef, useCallback, useState } from 'react';
import { useStore } from '@/store/useStore';
import { products, skinTones, backdrops } from '@/data/products';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const TryOnStudio = () => {
  const {
    tryOn, setTryOn, selectedTone, setTone, selectedBackdrop, setBackdrop,
    userPhoto, setUserPhoto, isGenerating, setIsGenerating, generatedImage, setGeneratedImage,
  } = useStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const top = tryOn.top ? products.find(p => p.id === tryOn.top) : null;
  const bottom = tryOn.bottom ? products.find(p => p.id === tryOn.bottom) : null;
  const shoes = tryOn.shoes ? products.find(p => p.id === tryOn.shoes) : null;
  const bag = tryOn.bag ? products.find(p => p.id === tryOn.bag) : null;
  const selected = [top, bottom, shoes, bag].filter(Boolean);

  const backdrop = backdrops.find(b => b.id === selectedBackdrop) || backdrops[0];

  const selectionItems = products.map(p => ({
    ...p,
    active: tryOn[p.category.toLowerCase() as keyof typeof tryOn] === p.id,
  }));

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
      alert('Camera access denied. Please allow camera permissions.');
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
    setUserPhoto(canvas.toDataURL('image/jpeg', 0.9));
    // Stop camera
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

  const handleGenerateTryOn = () => {
    if (!userPhoto || selected.length === 0) return;
    setIsGenerating(true);
    setGeneratedImage(null);
    // Simulate AI generation (replace with real AI call later)
    setTimeout(() => {
      setGeneratedImage(userPhoto); // placeholder — real AI would return a modified image
      setIsGenerating(false);
    }, 2500);
  };

  const canGenerate = !!userPhoto && selected.length > 0;

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
                {selected.length ? selected.map(i => i!.name).join(' + ') : 'Select clothes to preview'}
              </h4>
            </div>
            {canGenerate && (
              <button
                onClick={handleGenerateTryOn}
                disabled={isGenerating}
                className="btn-primary text-sm !py-2.5 !px-5 disabled:opacity-50"
              >
                {isGenerating ? '✨ Generating...' : '🪄 Generate Try-On'}
              </button>
            )}
          </div>

          {/* Preview Area */}
          <div className="rounded-3xl min-h-[400px] p-6 relative flex flex-col items-center justify-center overflow-hidden" style={{ background: backdrop.style }}>
            {/* View tabs */}
            <div className="flex gap-2 absolute top-4 left-4 z-10">
              {['Front View', 'Fit Overlay', 'Color Match'].map((v, i) => (
                <button key={v} className={`badge-tag text-xs !py-1.5 !px-3 ${i === 0 ? '!bg-navy !text-primary-foreground' : ''}`}>
                  {v}
                </button>
              ))}
            </div>

            {isGenerating ? (
              /* Loading State */
              <div className="flex flex-col items-center gap-4 animate-pulse">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-peach to-coral flex items-center justify-center text-4xl">
                  ✨
                </div>
                <div className="text-center">
                  <strong className="font-display text-lg block">AI is working its magic...</strong>
                  <p className="text-sm text-muted-foreground mt-1">Generating your virtual try-on image</p>
                </div>
                <div className="flex gap-1 mt-2">
                  {[0, 1, 2].map(i => (
                    <div
                      key={i}
                      className="w-3 h-3 rounded-full bg-primary"
                      style={{ animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }}
                    />
                  ))}
                </div>
              </div>
            ) : generatedImage ? (
              /* Generated Result */
              <div className="relative w-full h-full flex flex-col items-center">
                <div className="relative mt-8">
                  <img src={generatedImage} alt="AI Try-On Result" className="max-h-[340px] rounded-2xl object-cover shadow-lg" />
                  {/* Overlay clothing labels */}
                  <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5">
                    {selected.map(p => (
                      <span key={p!.id} className="badge-tag text-[10px] !py-1 !px-2 backdrop-blur-sm bg-card/80">
                        {p!.name}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3 text-center italic">
                  🔮 AI-generated preview — connect backend for real results
                </p>
              </div>
            ) : !userPhoto ? (
              /* Empty — No photo */
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="w-20 h-20 rounded-full bg-muted/50 grid place-items-center text-4xl">👤</div>
                <strong className="font-display text-lg">Upload your photo first</strong>
                <p className="text-sm text-muted-foreground max-w-[280px]">
                  Take a full-body photo or upload one, then select the clothes you want to try on.
                </p>
              </div>
            ) : selected.length === 0 ? (
              /* Photo uploaded but no clothes selected */
              <div className="flex flex-col items-center gap-3 text-center">
                <img src={userPhoto} alt="Your photo" className="w-32 h-40 rounded-2xl object-cover opacity-60" />
                <strong className="font-display text-lg">Now pick your outfit</strong>
                <p className="text-sm text-muted-foreground max-w-[280px]">
                  Select clothes from the panel on the left, then hit "Generate Try-On" to see the magic.
                </p>
              </div>
            ) : (
              /* Photo + clothes selected but not yet generated */
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
    </section>
  );
};

export default TryOnStudio;
