import type { SavedLook } from '@/hooks/useSavedLooks';
import type { OutfitHistoryEntry } from '@/hooks/useOutfitHistory';

interface LooksGalleryProps {
  history: OutfitHistoryEntry[];
  saved: SavedLook[];
  onRestore: (image: string, productIds: string[]) => void;
  onRemoveSaved: (id: string) => void;
  onShare: (image: string, name: string) => void;
}

const LooksGallery = ({ history, saved, onRestore, onRemoveSaved, onShare }: LooksGalleryProps) => {
  if (history.length === 0 && saved.length === 0) return null;

  return (
    <div className="mt-4 space-y-4">
      {history.length > 0 && (
        <div className="glass-surface !rounded-2xl p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="eyebrow">Recently tried</span>
            <span className="text-[10px] text-muted-foreground">{history.length} look{history.length > 1 ? 's' : ''}</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 snap-x">
            {history.map((h) => (
              <button
                key={h.id}
                onClick={() => onRestore(h.image, h.productIds)}
                className="shrink-0 snap-start group relative"
                title={h.name}
              >
                <img
                  src={h.image}
                  alt={h.name}
                  className="w-16 h-20 rounded-xl object-cover border border-border group-hover:border-primary transition"
                />
                <span className="absolute inset-0 rounded-xl bg-foreground/0 group-hover:bg-foreground/30 transition flex items-center justify-center text-[10px] font-semibold text-primary-foreground opacity-0 group-hover:opacity-100">
                  Restore
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {saved.length > 0 && (
        <div className="glass-surface !rounded-2xl p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="eyebrow">My looks</span>
            <span className="text-[10px] text-muted-foreground">{saved.length} saved</span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {saved.map((l) => (
              <div key={l.id} className="relative group">
                <img
                  src={l.image}
                  alt={l.name}
                  className="w-full aspect-[4/5] rounded-xl object-cover border border-border"
                />
                <div className="absolute inset-0 rounded-xl bg-foreground/50 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-1 p-1">
                  <button
                    onClick={() => onRestore(l.image, l.productIds)}
                    className="text-[10px] bg-card/90 px-2 py-1 rounded-full font-semibold w-full"
                  >
                    Restore
                  </button>
                  <button
                    onClick={() => onShare(l.image, l.name)}
                    className="text-[10px] bg-card/90 px-2 py-1 rounded-full font-semibold w-full"
                  >
                    🔗 Share
                  </button>
                  <button
                    onClick={() => onRemoveSaved(l.id)}
                    className="text-[10px] bg-card/90 px-2 py-1 rounded-full font-semibold w-full text-destructive"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LooksGallery;
