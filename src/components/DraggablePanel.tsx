import { useRef, useState, useCallback, useEffect, ReactNode, forwardRef, useImperativeHandle } from 'react';

interface DraggablePanelProps {
  children: ReactNode;
  /** Initial position in CSS, e.g. { top: '50%', left: '1rem', transform: 'translateY(-50%)' } */
  initial: React.CSSProperties;
  className?: string;
  handleClassName?: string;
  boundsRef?: React.RefObject<HTMLElement>;
  /** Snap panel to nearest horizontal edge after drop. */
  snapToEdge?: boolean;
  /** Padding from container edge when snapping. */
  snapPadding?: number;
}

export interface DraggablePanelHandle {
  reset: () => void;
}

/**
 * Absolutely-positioned panel with a drag handle (⋮⋮) that lets the user
 * reposition it within its containing element. Optional snap-to-edge.
 */
const DraggablePanel = forwardRef<DraggablePanelHandle, DraggablePanelProps>(({
  children,
  initial,
  className = '',
  handleClassName = '',
  boundsRef,
  snapToEdge = false,
  snapPadding = 12,
}, ref) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);
  const dragState = useRef<{ startX: number; startY: number; origLeft: number; origTop: number; moved: boolean } | null>(null);

  useImperativeHandle(ref, () => ({ reset: () => setPos(null) }), []);

  const getParent = useCallback((): HTMLElement | null => {
    if (boundsRef?.current) return boundsRef.current;
    return (panelRef.current?.offsetParent as HTMLElement | null) ?? null;
  }, [boundsRef]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (!panelRef.current) return;
    const parent = getParent();
    if (!parent) return;

    const panelRect = panelRef.current.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();

    dragState.current = {
      startX: e.clientX,
      startY: e.clientY,
      origLeft: panelRect.left - parentRect.left,
      origTop: panelRect.top - parentRect.top,
      moved: false,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    e.preventDefault();
  }, [getParent]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragState.current || !panelRef.current) return;
    const parent = getParent();
    if (!parent) return;

    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;
    if (Math.abs(dx) + Math.abs(dy) > 2) dragState.current.moved = true;

    const panelRect = panelRef.current.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();

    const maxLeft = parentRect.width - panelRect.width;
    const maxTop = parentRect.height - panelRect.height;

    const nextLeft = Math.min(Math.max(dragState.current.origLeft + dx, 0), Math.max(0, maxLeft));
    const nextTop = Math.min(Math.max(dragState.current.origTop + dy, 0), Math.max(0, maxTop));

    setPos({ left: nextLeft, top: nextTop });
  }, [getParent]);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    const parent = getParent();
    if (snapToEdge && dragState.current?.moved && panelRef.current && parent) {
      const panelRect = panelRef.current.getBoundingClientRect();
      const parentRect = parent.getBoundingClientRect();
      setPos(prev => {
        if (!prev) return prev;
        const center = prev.left + panelRect.width / 2;
        const snappedLeft = center < parentRect.width / 2
          ? snapPadding
          : Math.max(snapPadding, parentRect.width - panelRect.width - snapPadding);
        const clampedTop = Math.min(
          Math.max(prev.top, snapPadding),
          Math.max(snapPadding, parentRect.height - panelRect.height - snapPadding)
        );
        return { left: snappedLeft, top: clampedTop };
      });
    }
    dragState.current = null;
    try { (e.target as HTMLElement).releasePointerCapture(e.pointerId); } catch { /* ignore */ }
  }, [getParent, snapToEdge, snapPadding]);

  // Reset on window resize so panels don't escape bounds
  useEffect(() => {
    const handler = () => setPos(null);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const style: React.CSSProperties = pos
    ? {
        position: 'absolute',
        left: pos.left,
        top: pos.top,
        transition: snapToEdge && !dragState.current ? 'left 0.2s ease, top 0.2s ease' : undefined,
      }
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
});

DraggablePanel.displayName = 'DraggablePanel';

export default DraggablePanel;
