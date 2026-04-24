interface FloatingControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onFullscreen: () => void;
  onToggleCompare: () => void;
  compareActive: boolean;
  orientation?: 'vertical' | 'horizontal';
}

const FloatingControls = ({
  onZoomIn, onZoomOut, onResetZoom, onFullscreen, onToggleCompare, compareActive,
  orientation = 'vertical',
}: FloatingControlsProps) => {
  const wrap = orientation === 'vertical' ? 'flex-col' : 'flex-row';
  const btn = 'w-8 h-8 rounded-full grid place-items-center hover:bg-muted transition text-foreground';
  return (
    <div className={`flex ${wrap} gap-1`}>
      <button onClick={onZoomIn} className={`${btn} font-bold text-lg leading-none`} aria-label="Zoom in" title="Zoom in">+</button>
      <button onClick={onZoomOut} className={`${btn} font-bold text-lg leading-none`} aria-label="Zoom out" title="Zoom out">−</button>
      <button onClick={onResetZoom} className={`${btn} text-xs`} aria-label="Reset zoom" title="Reset zoom">⟲</button>
      <button
        onClick={onToggleCompare}
        className={`${btn} text-sm ${compareActive ? 'bg-primary/20 text-primary' : ''}`}
        aria-label="Toggle compare"
        title="Compare with original"
      >↔</button>
      <button onClick={onFullscreen} className={`${btn} text-sm`} aria-label="Fullscreen" title="Fullscreen">⛶</button>
    </div>
  );
};

export default FloatingControls;
