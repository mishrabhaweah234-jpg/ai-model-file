import { useState, useEffect, useRef } from 'react';
import CompareSlider from './CompareSlider';
import { usePinchZoom } from '@/hooks/usePinchZoom';
import type { Angle } from './types';

interface ResultCanvasProps {
  image: string;
  originalPhoto: string;
  angle: Angle;
  zoom: number;
  setZoom: (updater: (z: number) => number) => void;
  loadingAngle: Angle | null;
  compareMode: boolean;
}

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3;

const ResultCanvas = ({
  image, originalPhoto, angle, zoom, setZoom, loadingAngle, compareMode,
}: ResultCanvasProps) => {
  const [displayed, setDisplayed] = useState(image);
  const [opacity, setOpacity] = useState(1);
  const prevImage = useRef(image);

  // Crossfade when image changes
  useEffect(() => {
    if (image === prevImage.current) return;
    setOpacity(0);
    const t = setTimeout(() => {
      setDisplayed(image);
      requestAnimationFrame(() => setOpacity(1));
      prevImage.current = image;
    }, 180);
    return () => clearTimeout(t);
  }, [image]);

  const pinchHandlers = usePinchZoom((factor) => {
    setZoom((z) => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, z * factor)));
  });

  if (compareMode) {
    return (
      <div className="relative mt-8 w-full max-w-[420px] aspect-[3/4] rounded-2xl overflow-hidden">
        <CompareSlider before={originalPhoto} after={image} alt={`Try-on ${angle}`} />
      </div>
    );
  }

  return (
    <div
      className="relative mt-8 overflow-hidden rounded-2xl max-h-[340px] touch-none"
      {...pinchHandlers}
    >
      <img
        src={displayed}
        alt={`AI Try-On Result — ${angle} view`}
        className="max-h-[340px] rounded-2xl object-cover shadow-lg will-change-transform"
        style={{
          transform: `scale(${zoom})`,
          opacity,
          transition: 'transform 250ms ease-out, opacity 200ms ease-out',
        }}
      />
      {loadingAngle && (
        <div className="absolute inset-0 bg-background/70 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center gap-2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-peach to-coral flex items-center justify-center text-2xl animate-pulse">
            ✨
          </div>
          <span className="text-xs font-medium">Generating {loadingAngle} view…</span>
        </div>
      )}
    </div>
  );
};

export default ResultCanvas;
