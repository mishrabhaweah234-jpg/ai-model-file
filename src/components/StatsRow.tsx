import { useStore } from '@/store/useStore';
import { products, heroSlides } from '@/data/products';

const StatsRow = () => {
  const { searchQuery, tryOn, bagTotal } = useStore();
  const query = searchQuery.toLowerCase();
  const count = products.filter(p =>
    !query || `${p.name} ${p.brand} ${p.audience} ${p.category}`.toLowerCase().includes(query)
  ).length;
  const activePieces = Object.values(tryOn).filter(Boolean).length;

  return (
    <div className="flex gap-4 mt-4 flex-wrap">
      {[
        { label: 'Products live', value: String(count) },
        { label: 'Try-on looks', value: activePieces ? `${activePieces} piece look` : 'Studio ready' },
        { label: 'Bag total', value: `Rs ${bagTotal()}` },
        { label: 'Featured theme', value: heroSlides[0].title, accent: true },
      ].map((stat) => (
        <article
          key={stat.label}
          className={`glass-surface flex-1 min-w-[200px] !rounded-3xl p-5 ${stat.accent ? 'bg-gradient-to-br from-sun/40 to-card' : ''}`}
        >
          <span className="eyebrow">{stat.label}</span>
          <strong className="block mt-1 text-2xl font-display">{stat.value}</strong>
        </article>
      ))}
    </div>
  );
};

export default StatsRow;
