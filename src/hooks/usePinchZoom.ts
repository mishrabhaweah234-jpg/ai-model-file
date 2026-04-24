import { useRef, useCallback } from 'react';

/**
 * Pointer-event-based pinch zoom. Tracks two simultaneous pointers and reports
 * a multiplicative scale factor to the consumer, which can apply it to its own
 * zoom state (clamped however it likes).
 */
export const usePinchZoom = (onPinch: (factor: number) => void) => {
  const pointers = useRef<Map<number, { x: number; y: number }>>(new Map());
  const lastDistance = useRef<number | null>(null);

  const distance = () => {
    const pts = Array.from(pointers.current.values());
    if (pts.length < 2) return null;
    const [a, b] = pts;
    return Math.hypot(a.x - b.x, a.y - b.y);
  };

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      lastDistance.current = distance();
    }
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size !== 2) return;
    const d = distance();
    if (d == null || lastDistance.current == null) return;
    if (lastDistance.current > 0) {
      const factor = d / lastDistance.current;
      // Throttle micro-jitter
      if (Math.abs(factor - 1) > 0.005) {
        onPinch(factor);
        lastDistance.current = d;
      }
    }
  }, [onPinch]);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) lastDistance.current = null;
  }, []);

  return { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp };
};
