import { useStore } from '@/store/useStore';
import { products, skinTones, backdrops } from '@/data/products';

const TryOnStudio = () => {
  const { tryOn, setTryOn, selectedTone, setTone, selectedBackdrop, setBackdrop } = useStore();

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

  return (
    <section id="studio" className="glass-surface !rounded-3xl p-6 mt-4">
      <div className="flex justify-between items-start mb-5 flex-wrap gap-2">
        <div>
          <p className="eyebrow">Main highlight</p>
          <h3 className="font-display text-2xl">Virtual Try-On Studio</h3>
        </div>
        <span className="text-xs text-muted-foreground">UI-only concept with upload, camera, selection and preview placeholders.</span>
      </div>

      <div className="grid lg:grid-cols-[340px_1fr] gap-4">
        {/* Tools */}
        <div className="space-y-4">
          <div className="glass-surface !rounded-3xl p-4">
            <span className="eyebrow">Upload or capture</span>
            <div className="mt-3 min-h-[160px] rounded-3xl border border-dashed border-foreground/20 bg-gradient-to-b from-lavender/50 to-card flex flex-col items-center justify-center text-center p-4">
              <div className="w-14 h-14 rounded-full bg-muted grid place-items-center text-2xl mb-2">+</div>
              <strong className="text-sm">Upload your photo</strong>
              <p className="text-xs text-muted-foreground mt-1">Drag and drop image here or open camera preview.</p>
            </div>
            <div className="flex gap-2 mt-3">
              <button className="btn-secondary flex-1 text-xs !py-2">Upload Image</button>
              <button className="btn-secondary flex-1 text-xs !py-2">Open Camera</button>
            </div>
          </div>

          <div className="glass-surface !rounded-3xl p-4">
            <span className="eyebrow">Clothing selector</span>
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
                  <div className="w-8 h-8 rounded-lg mb-1.5" style={{ background: p.background }} />
                  <strong className="block truncate">{p.name}</strong>
                  <span className="text-muted-foreground">{p.category}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="glass-surface !rounded-3xl p-5">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="eyebrow">Preview</span>
              <h4 className="font-display text-lg mt-1">
                {selected.length ? selected.map(i => i!.name).join(' + ') : 'No outfit loaded yet'}
              </h4>
            </div>
            <span className="text-xs text-muted-foreground max-w-[200px] text-right">
              {selected.length
                ? `Virtual preview active with ${selected.length} selected piece${selected.length > 1 ? 's' : ''}.`
                : 'Start with a top, bottom, shoes, or bag to build the look.'}
            </span>
          </div>

          <div className="rounded-3xl min-h-[360px] p-6 relative flex flex-col items-center justify-center" style={{ background: backdrop.style }}>
            <div className="flex gap-2 absolute top-4 left-4">
              {['Front View', 'Fit Overlay', 'Color Match'].map((v, i) => (
                <button key={v} className={`badge-tag text-xs !py-1.5 !px-3 ${i === 0 ? '!bg-navy !text-primary-foreground' : ''}`}>
                  {v}
                </button>
              ))}
            </div>

            {/* Avatar */}
            <div className="flex flex-col items-center gap-1 mt-8">
              <div className="w-16 h-16 rounded-full" style={{ background: selectedTone }} />
              <div className="w-24 h-28 rounded-2xl transition-all duration-300" style={{ background: top ? top.background : `${selectedTone}44`, opacity: top ? 1 : 0.3 }} />
              <div className="w-20 h-24 rounded-2xl transition-all duration-300" style={{ background: bottom ? bottom.background : `${selectedTone}33`, opacity: bottom ? 1 : 0.3 }} />
              <div className="w-16 h-10 rounded-xl transition-all duration-300" style={{ background: shoes ? shoes.background : `${selectedTone}22`, opacity: shoes ? 1 : 0.3 }} />
              {bag && (
                <div className="absolute right-8 top-1/2 w-12 h-14 rounded-xl" style={{ background: bag.background }} />
              )}
            </div>
          </div>

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
