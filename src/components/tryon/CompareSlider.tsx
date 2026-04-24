import { useRef, useState, useCallback } from 'react';

interface CompareSliderProps {
  before: string;
  after: string;
  alt?: string;
}

/**
 * Before/after image comparison with a draggable vertical divider.
 * Pure CSS clip-path — no extra deps.
 */
const CompareSlider = ({ before, after, alt = 'Comparison' }: CompareSliderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(50);
  const dragging = useRef(false);

  const updateFromEvent = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPct(Math.max(0, Math.min(100, next)));
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full select-none touch-none rounded-2xl overflow-hidden"
      onPointerDown={(e) => {
        dragging.current = true;
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        updateFromEvent(e.clientX);
      }}
      onPointerMove={(e) => {
        if (!dragging.current) return;
        updateFromEvent(e.clientX);
      }}
      onPointerUp={(e) => {
        dragging.current = false;
        try { (e.target as HTMLElement).releasePointerCapture(e.pointerId); } catch { /* ignore */ }
      }}
    >
      {/* After image (full) */}
      <img
        src={after}
        alt={`${alt} – after`}
        draggable={false}
        className="absolute inset-0 w-full h-full object-contain"
      />
      {/* Before image (clipped) */}
      <img
        src={before}
        alt={`${alt} – before`}
        draggable={false}
        className="absolute inset-0 w-full h-full object-contain"
        style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}
      />
      {/* Divider */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-primary-foreground shadow-[0_0_8px_hsl(var(--primary)/0.6)]"
        style={{ left: `${pct}%`, transform: 'translateX(-50%)' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-primary text-primary-foreground grid place-items-center shadow-lg cursor-ew-resize text-xs font-bold">
          ↔
        </div>
      </div>
      {/* Labels */}
      <span className="absolute top-3 left-3 text-[10px] uppercase tracking-widest bg-background/80 backdrop-blur px-2 py-1 rounded-full text-foreground">
        Before
      </span>
      <span className="absolute top-3 right-3 text-[10px] uppercase tracking-widest bg-primary/90 px-2 py-1 rounded-full text-primary-foreground">
        After
      </span>
    </div>
  );
};

export default CompareSlider;
