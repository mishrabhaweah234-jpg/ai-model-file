import { products, arrivalIds } from '@/data/products';
import { useStore } from '@/store/useStore';
import { Link } from 'react-router-dom';

const NewArrivals = () => {
  const { addToBag, setTryOn } = useStore();
  const arrivals = arrivalIds.map((id) => products.find((p) => p.id === id)!).filter(Boolean);

  return (
    <section id="new-arrivals" className="glass-surface !rounded-[2rem] p-6 md:p-10 mt-5">
      <div className="flex justify-between items-end mb-8 flex-wrap gap-3">
        <div>
          <p className="eyebrow">New arrivals</p>
          <h3 className="font-display text-3xl md:text-4xl tracking-tight mt-1">Trending <em className="text-gradient-hero not-italic">edit</em></h3>
        </div>
        <span className="text-sm text-muted-foreground flex items-center gap-2">
          <span className="w-8 h-px bg-foreground/20" />
          Scroll to explore →
        </span>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-3 no-scrollbar snap-x snap-mandatory -mx-2 px-2">
        {arrivals.map((p) => (
          <article key={p.id} className="glass-surface !rounded-[1.5rem] min-w-[260px] flex-shrink-0 overflow-hidden group card-hover snap-start">
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
