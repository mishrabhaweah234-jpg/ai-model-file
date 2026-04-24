import { ANGLES, type Angle, type AngleViews } from './types';

interface AngleSelectorProps {
  current: Angle;
  views: AngleViews;
  loadingAngle: Angle | null;
  onSelect: (angle: Angle) => void;
  onGenerate: (angle: Exclude<Angle, 'front'>) => void;
  /** Layout: vertical stacks for desktop side panel, horizontal for mobile bottom sheet. */
  orientation?: 'vertical' | 'horizontal';
}

const AngleSelector = ({
  current,
  views,
  loadingAngle,
  onSelect,
  onGenerate,
  orientation = 'vertical',
}: AngleSelectorProps) => {
  const isVertical = orientation === 'vertical';
  return (
    <div className={`flex ${isVertical ? 'flex-col items-stretch' : 'flex-row items-center justify-center'} gap-1`}>
      {ANGLES.map(opt => {
        const isActive = current === opt.id;
        const hasView = !!views[opt.id];
        const isLoading = loadingAngle === opt.id;
        return (
          <button
            key={opt.id}
            disabled={!!loadingAngle}
            onClick={() => {
              if (opt.id === 'front' || hasView) onSelect(opt.id);
              else onGenerate(opt.id as Exclude<Angle, 'front'>);
            }}
            className={`text-xs px-3 py-1.5 rounded-full transition-all whitespace-nowrap disabled:opacity-50 ${
              isActive
                ? 'bg-primary text-primary-foreground font-medium'
                : 'text-foreground hover:bg-muted'
            }`}
            title={hasView ? `${opt.label} view` : `Generate ${opt.label} view`}
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                {opt.label}
              </span>
            ) : (
              <>{opt.label}{!hasView && opt.id !== 'front' ? ' ✨' : ''}</>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default AngleSelector;
