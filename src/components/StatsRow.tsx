import { useStore } from '@/store/useStore';
import { products, heroSlides } from '@/data/products';

const stats = [
  { icon: '📦', gradient: false },
  { icon: '👗', gradient: false },
  { icon: '💰', gradient: false },
  { icon: '✨', gradient: true },
];

const StatsRow = () => {
  const { searchQuery, tryOn, bagTotal } = useStore();
  const query = searchQuery.toLowerCase();
  const count = products.filter(p =>
    !query || `${p.name} ${p.brand} ${p.audience} ${p.category}`.toLowerCase().includes(query)
  ).length;
  const activePieces = Object.values(tryOn).filter(Boolean).length;

  const data = [
    { label: 'Products live', value: String(count) },
    { label: 'Try-on looks', value: activePieces ? `${activePieces} piece look` : 'Studio ready' },
    { label: 'Bag total', value: `Rs ${bagTotal().toLocaleString()}` },
    { label: 'Featured theme', value: heroSlides[0].title },
  ];

  return (
    <div className="flex gap-4 mt-5 flex-wrap">
      {data.map((stat, i) => (
        <article
          key={stat.label}
          className={`glass-surface flex-1 min-w-[180px] !rounded-3xl p-5 hover:-translate-y-1 transition-all duration-300 group ${
            stats[i].gradient ? 'relative overflow-hidden' : ''
          }`}
        >
          {stats[i].gradient && (
            <div className="absolute inset-0 bg-gradient-to-br from-sun/20 to-transparent pointer-events-none" />
          )}
          <div className="flex items-center gap-2 relative">
            <span className="text-lg">{stats[i].icon}</span>
            <span className="eyebrow">{stat.label}</span>
          </div>
          <strong className="block mt-2 text-2xl font-display relative group-hover:text-primary transition-colors">{stat.value}</strong>
        </article>
      ))}
    </div>
  );
};

export default StatsRow;
