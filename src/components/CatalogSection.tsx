import { products } from '@/data/products';
import { useStore } from '@/store/useStore';
import ProductCard from './ProductCard';

interface Props {
  audience: 'Men' | 'Women';
  eyebrow: string;
  title: string;
  subtitle: string;
}

const CatalogSection = ({ audience, eyebrow, title, subtitle }: Props) => {
  const { searchQuery } = useStore();
  const query = searchQuery.toLowerCase();
  const filtered = products.filter(
    (p) => p.audience === audience && (!query || `${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(query))
  );

  return (
    <section id={audience.toLowerCase()} className="glass-surface !rounded-[2rem] p-6 md:p-10 mt-5">
      <div className="flex justify-between items-end mb-8 flex-wrap gap-3">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h3 className="font-display text-3xl md:text-4xl tracking-tight mt-1">{title}</h3>
        </div>
        <p className="text-sm text-muted-foreground max-w-[260px] sm:text-right leading-relaxed">{subtitle}</p>
      </div>
      <div className="divider-soft mb-8" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} feminine={audience === 'Women'} />
        ))}
      </div>
    </section>
  );
};

export default CatalogSection;
