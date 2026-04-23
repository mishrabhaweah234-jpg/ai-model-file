import { useRef, useState, useCallback, useEffect, ReactNode } from 'react';

interface DraggablePanelProps {
  children: ReactNode;
  /** Initial position in CSS, e.g. { top: '50%', left: '1rem', transform: 'translateY(-50%)' } */
  initial: React.CSSProperties;
  className?: string;
  /** Optional extra classes for the drag handle bar */
  handleClassName?: string;
  /** Container ref to constrain dragging within (defaults to offsetParent) */
  boundsRef?: React.RefObject<HTMLElement>;
}

/**
 * Wraps content in an absolutely-positioned panel with a small drag handle (⋮⋮)
 * that lets the user reposition it within its containing element.
 */
const DraggablePanel = ({
  children,
  initial,
  className = '',
  handleClassName = '',
  boundsRef,
}: DraggablePanelProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);
  const dragState = useRef<{ startX: number; startY: number; origLeft: number; origTop: number } | null>(null);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (!panelRef.current) return;
    const parent = boundsRef?.current || (panelRef.current.offsetParent as HTMLElement | null);
    if (!parent) return;

    const panelRect = panelRef.current.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();

    dragState.current = {
      startX: e.clientX,
      startY: e.clientY,
      origLeft: panelRect.left - parentRect.left,
      origTop: panelRect.top - parentRect.top,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    e.preventDefault();
  }, [boundsRef]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragState.current || !panelRef.current) return;
    const parent = boundsRef?.current || (panelRef.current.offsetParent as HTMLElement | null);
    if (!parent) return;

    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;
    const panelRect = panelRef.current.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();

    const maxLeft = parentRect.width - panelRect.width;
    const maxTop = parentRect.height - panelRect.height;

    const nextLeft = Math.min(Math.max(dragState.current.origLeft + dx, 0), Math.max(0, maxLeft));
    const nextTop = Math.min(Math.max(dragState.current.origTop + dy, 0), Math.max(0, maxTop));

    setPos({ left: nextLeft, top: nextTop });
  }, [boundsRef]);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    dragState.current = null;
    try { (e.target as HTMLElement).releasePointerCapture(e.pointerId); } catch { /* ignore */ }
  }, []);

  // Reset to initial when window resizes significantly so it doesn't escape bounds
  useEffect(() => {
    const handler = () => setPos(null);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const style: React.CSSProperties = pos
    ? { position: 'absolute', left: pos.left, top: pos.top }
    : { position: 'absolute', ...initial };

  return (
    <div ref={panelRef} className={`z-10 ${className}`} style={style}>
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className={`flex items-center justify-center cursor-grab active:cursor-grabbing select-none text-muted-foreground hover:text-foreground transition touch-none ${handleClassName}`}
        title="Drag to move"
        aria-label="Drag handle"
      >
        <span className="text-[10px] leading-none tracking-widest">⋮⋮</span>
      </div>
      {children}
    </div>
  );
};

export default DraggablePanel;
