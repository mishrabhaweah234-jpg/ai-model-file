import { products, arrivalIds } from '@/data/products';
import { useStore } from '@/store/useStore';

const NewArrivals = () => {
  const { addToBag, setTryOn } = useStore();
  const arrivals = arrivalIds.map((id) => products.find((p) => p.id === id)!).filter(Boolean);

  return (
    <section id="new-arrivals" className="glass-surface !rounded-3xl p-6 mt-4">
      <div className="flex justify-between items-start mb-5">
        <div>
          <p className="eyebrow">New arrivals</p>
          <h3 className="font-display text-2xl">Trending edit</h3>
        </div>
        <p className="text-sm text-muted-foreground">Horizontal scroll for quick discovery.</p>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
        {arrivals.map((p) => (
          <article key={p.id} className="glass-surface !rounded-3xl min-w-[240px] flex-shrink-0 overflow-hidden group">
            <div className="h-36 flex items-center justify-center relative overflow-hidden" style={{ background: p.background }}>
              <span className="badge-tag absolute top-3 left-3 text-xs z-10">Fresh Arrival</span>
              <img
                src={p.image}
                alt={p.name}
                loading="lazy"
                width={512}
                height={512}
                className="w-24 h-24 object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-lg"
              />
            </div>
            <div className="p-4">
              <h4 className="font-display text-base">{p.name}</h4>
              <p className="text-xs text-muted-foreground">{p.audience} | {p.brand}</p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => {
                    setTryOn(p.category.toLowerCase(), p.id);
                    document.getElementById('studio')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="btn-secondary flex-1 text-xs !py-2"
                >
                  Try On
                </button>
                <button onClick={() => addToBag(p.id)} className="btn-primary flex-1 text-xs !py-2">Add</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default NewArrivals;
