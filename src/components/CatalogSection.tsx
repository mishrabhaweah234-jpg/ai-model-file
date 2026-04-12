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
    <section id={audience.toLowerCase()} className="glass-surface !rounded-3xl p-6 md:p-8 mt-5">
      <div className="flex justify-between items-end mb-6 flex-wrap gap-2">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h3 className="font-display text-2xl md:text-3xl">{title}</h3>
        </div>
        <p className="text-sm text-muted-foreground max-w-[200px] text-right">{subtitle}</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} feminine={audience === 'Women'} />
        ))}
      </div>
    </section>
  );
};

export default CatalogSection;
