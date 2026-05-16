import { forwardRef, useImperativeHandle, useRef, useState, useEffect, useCallback } from 'react';
import type { Product } from '@/data/products';

export interface OverlayComposerHandle {
  exportPNG: () => Promise<string | null>;
}

interface OverlayItem {
  product: Product;
  // percentages relative to the photo box
  x: number; // center x (%)
  y: number; // center y (%)
  scale: number; // 1 = default width
  rotation: number; // degrees
}

interface Props {
  userPhoto: string;
  items: Product[];
  zoom: number;
}

// Default placements per category (centered on a portrait body shot)
const DEFAULTS: Record<Product['category'], { x: number; y: number; scale: number }> = {
  Top: { x: 50, y: 36, scale: 1.0 },
  Bottom: { x: 50, y: 62, scale: 0.95 },
  Shoes: { x: 50, y: 88, scale: 0.55 },
  Bag: { x: 72, y: 52, scale: 0.45 },
};

// Width of an overlay at scale=1, as % of the photo width
const BASE_WIDTH_PCT: Record<Product['category'], number> = {
  Top: 55,
  Bottom: 45,
  Shoes: 30,
  Bag: 22,
};

const OverlayComposer = forwardRef<OverlayComposerHandle, Props>(({ userPhoto, items, zoom }, ref) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const [overlays, setOverlays] = useState<OverlayItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Sync overlays with item selection, preserving existing transforms.
  useEffect(() => {
    setOverlays(prev => {
      const byId = new Map(prev.map(o => [o.product.id, o]));
      return items.map(p => byId.get(p.id) ?? {
        product: p,
        ...DEFAULTS[p.category],
        rotation: 0,
      });
    });
  }, [items]);

  const updateOverlay = (id: string, patch: Partial<OverlayItem>) => {
    setOverlays(prev => prev.map(o => o.product.id === id ? { ...o, ...patch } : o));
  };

  // Drag handling (pointer-based)
  const dragState = useRef<{ id: string; startX: number; startY: number; origX: number; origY: number; w: number; h: number } | null>(null);

  const onPointerDown = (e: React.PointerEvent, item: OverlayItem) => {
    e.stopPropagation();
    const box = boxRef.current;
    if (!box) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    const rect = box.getBoundingClientRect();
    dragState.current = {
      id: item.product.id,
      startX: e.clientX, startY: e.clientY,
      origX: item.x, origY: item.y,
      w: rect.width, h: rect.height,
    };
    setActiveId(item.product.id);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const s = dragState.current;
    if (!s) return;
    const dx = ((e.clientX - s.startX) / s.w) * 100;
    const dy = ((e.clientY - s.startY) / s.h) * 100;
    updateOverlay(s.id, {
      x: Math.max(0, Math.min(100, s.origX + dx)),
      y: Math.max(0, Math.min(100, s.origY + dy)),
    });
  };

  const onPointerUp = () => { dragState.current = null; };

  const resetItem = (id: string) => {
    const o = overlays.find(o => o.product.id === id);
    if (!o) return;
    updateOverlay(id, { ...DEFAULTS[o.product.category], rotation: 0 });
  };

  // Export composited PNG via canvas
  const exportPNG = useCallback(async () => {
    const box = boxRef.current;
    if (!box) return null;
    const rect = box.getBoundingClientRect();
    const W = Math.round(rect.width * 2);
    const H = Math.round(rect.height * 2);
    const canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const loadImg = (src: string) => new Promise<HTMLImageElement>((res, rej) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => res(img);
      img.onerror = rej;
      img.src = src;
    });

    try {
      const base = await loadImg(userPhoto);
      // cover-fit
      const scale = Math.max(W / base.width, H / base.height);
      const dw = base.width * scale, dh = base.height * scale;
      ctx.drawImage(base, (W - dw) / 2, (H - dh) / 2, dw, dh);

      for (const o of overlays) {
        const img = await loadImg(o.product.image);
        const baseW = (BASE_WIDTH_PCT[o.product.category] / 100) * W * o.scale;
        const ratio = img.height / img.width;
        const drawW = baseW;
        const drawH = baseW * ratio;
        const cx = (o.x / 100) * W;
        const cy = (o.y / 100) * H;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate((o.rotation * Math.PI) / 180);
        ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
        ctx.restore();
      }
      return canvas.toDataURL('image/png');
    } catch (e) {
      console.error('export failed', e);
      return null;
    }
  }, [overlays, userPhoto]);

  useImperativeHandle(ref, () => ({ exportPNG }), [exportPNG]);

  return (
    <div
      ref={boxRef}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onClick={() => setActiveId(null)}
      className="relative w-full max-w-[420px] aspect-[3/4] rounded-2xl overflow-hidden shadow-lg bg-muted/30 select-none touch-none mx-auto"
      style={{ transform: `scale(${zoom})`, transformOrigin: 'center top', transition: 'transform 200ms ease-out' }}
    >
      <img
        src={userPhoto}
        alt="Your photo"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        draggable={false}
      />

      {overlays.map(o => {
        const widthPct = BASE_WIDTH_PCT[o.product.category] * o.scale;
        const isActive = activeId === o.product.id;
        return (
          <div
            key={o.product.id}
            onPointerDown={(e) => onPointerDown(e, o)}
            className={`absolute cursor-grab active:cursor-grabbing transition-shadow ${isActive ? 'ring-2 ring-primary rounded-lg' : ''}`}
            style={{
              left: `${o.x}%`,
              top: `${o.y}%`,
              width: `${widthPct}%`,
              transform: `translate(-50%, -50%) rotate(${o.rotation}deg)`,
              touchAction: 'none',
            }}
          >
            <img
              src={o.product.image}
              alt={o.product.name}
              draggable={false}
              className="w-full h-auto pointer-events-none"
              style={{ filter: 'drop-shadow(0 6px 14px rgba(0,0,0,.25))' }}
            />
            {isActive && (
              <div
                className="absolute -top-9 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-card/95 backdrop-blur rounded-full px-1.5 py-1 shadow border border-border/50 text-[11px]"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => updateOverlay(o.product.id, { scale: Math.max(0.3, o.scale - 0.1) })}
                  className="w-5 h-5 rounded-full hover:bg-muted grid place-items-center"
                  title="Smaller"
                >−</button>
                <button
                  onClick={() => updateOverlay(o.product.id, { scale: Math.min(2, o.scale + 0.1) })}
                  className="w-5 h-5 rounded-full hover:bg-muted grid place-items-center"
                  title="Bigger"
                >+</button>
                <button
                  onClick={() => updateOverlay(o.product.id, { rotation: o.rotation - 10 })}
                  className="w-5 h-5 rounded-full hover:bg-muted grid place-items-center"
                  title="Rotate left"
                >↺</button>
                <button
                  onClick={() => updateOverlay(o.product.id, { rotation: o.rotation + 10 })}
                  className="w-5 h-5 rounded-full hover:bg-muted grid place-items-center"
                  title="Rotate right"
                >↻</button>
                <button
                  onClick={() => resetItem(o.product.id)}
                  className="px-1.5 rounded-full hover:bg-muted"
                  title="Reset"
                >reset</button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
});

OverlayComposer.displayName = 'OverlayComposer';
export default OverlayComposer;
