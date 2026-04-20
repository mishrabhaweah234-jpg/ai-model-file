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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
      {data.map((stat, i) => (
        <article
          key={stat.label}
          className={`glass-surface !rounded-2xl p-5 card-hover group relative overflow-hidden`}
        >
          {stats[i].gradient && (
            <div className="absolute inset-0 bg-gradient-to-br from-sun/25 via-transparent to-transparent pointer-events-none" />
          )}
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-primary/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex items-center gap-2 relative">
            <span className="text-base opacity-80">{stats[i].icon}</span>
            <span className="eyebrow !text-[10px]">{stat.label}</span>
          </div>
          <strong className="block mt-2 text-xl lg:text-2xl font-display relative group-hover:text-primary transition-colors tracking-tight">{stat.value}</strong>
        </article>
      ))}
    </div>
  );
};

export default StatsRow;
