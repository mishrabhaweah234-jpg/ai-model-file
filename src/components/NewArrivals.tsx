import { products, arrivalIds } from '@/data/products';
import { useStore } from '@/store/useStore';
import { Link } from 'react-router-dom';

const NewArrivals = () => {
  const { addToBag, setTryOn } = useStore();
  const arrivals = arrivalIds.map((id) => products.find((p) => p.id === id)!).filter(Boolean);

  return (
    <section id="new-arrivals" className="glass-surface !rounded-3xl p-6 md:p-8 mt-5">
      <div className="flex justify-between items-end mb-6">
        <div>
          <p className="eyebrow">New arrivals</p>
          <h3 className="font-display text-2xl md:text-3xl">Trending edit</h3>
        </div>
        <span className="text-sm text-muted-foreground">Scroll to explore →</span>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-3 no-scrollbar snap-x snap-mandatory">
        {arrivals.map((p) => (
          <article key={p.id} className="glass-surface !rounded-3xl min-w-[260px] flex-shrink-0 overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 snap-start">
            <Link to={`/product/${p.id}`}>
              <div className="h-40 flex items-center justify-center relative overflow-hidden" style={{ background: p.background }}>
                <span className="badge-tag absolute top-3 left-3 text-xs z-10">🔥 Fresh</span>
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  width={512}
                  height={512}
                  className="w-28 h-28 object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-xl"
                />
              </div>
            </Link>
            <div className="p-4">
              <Link to={`/product/${p.id}`}>
                <h4 className="font-display text-base hover:text-primary transition-colors">{p.name}</h4>
              </Link>
              <p className="text-xs text-muted-foreground mt-0.5">{p.audience} · {p.brand}</p>
              <strong className="block mt-2 text-lg font-display">Rs {p.price.toLocaleString()}</strong>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => {
                    setTryOn(p.category.toLowerCase(), p.id);
                    document.getElementById('studio')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="btn-secondary flex-1 text-xs !py-2 !rounded-xl"
                >
                  Try On
                </button>
                <button onClick={() => addToBag(p.id)} className="btn-primary flex-1 text-xs !py-2 !rounded-xl">Add</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default NewArrivals;
