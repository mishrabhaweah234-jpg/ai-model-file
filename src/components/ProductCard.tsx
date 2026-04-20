import type { Product } from '@/data/products';
import { useStore } from '@/store/useStore';
import { Link } from 'react-router-dom';

interface Props {
  product: Product;
  feminine?: boolean;
}

const ProductCard = ({ product, feminine }: Props) => {
  const { addToBag, setTryOn } = useStore();

  const handleTryOn = () => {
    setTryOn(product.category.toLowerCase(), product.id);
    document.getElementById('studio')?.scrollIntoView({ behavior: 'smooth' });
  };

  const discount = Math.round((1 - product.price / product.originalPrice) * 100);

  return (
    <article className="glass-surface !rounded-[1.5rem] overflow-hidden group card-hover">
      <Link to={`/product/${product.id}`}>
        <div className="relative h-56 flex items-center justify-center p-4 overflow-hidden" style={{ background: product.background }}>
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="badge-tag absolute top-3 left-3 text-[11px] !py-1.5 !px-3 z-10 backdrop-blur-md bg-card/80">{product.badge}</span>
          {discount > 0 && (
            <span className="absolute top-3 right-3 text-[11px] font-bold px-2.5 py-1 rounded-full bg-primary text-primary-foreground z-10 shadow-lg">
              -{discount}%
            </span>
          )}
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            width={512}
            height={512}
            className="w-40 h-40 object-contain group-hover:scale-110 group-hover:-rotate-2 transition-transform duration-700 ease-out drop-shadow-2xl relative"
          />
        </div>
      </Link>
      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <Link to={`/product/${product.id}`}>
              <h4 className="font-display text-lg hover:text-primary transition-colors truncate tracking-tight">{product.name}</h4>
            </Link>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">{product.brand}</span>
          </div>
          <span
            className="inline-flex items-center gap-0.5 text-xs font-semibold shrink-0 px-2 py-1 rounded-full"
            style={{ background: feminine ? 'hsl(var(--pink) / 0.35)' : 'hsl(var(--lavender) / 0.5)' }}
          >
            ★ {product.rating}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">{product.description}</p>
        <div className="flex items-baseline gap-2 mt-4">
          <strong className="text-xl font-display tracking-tight">Rs {product.price.toLocaleString()}</strong>
          <span className="text-sm line-through text-muted-foreground">Rs {product.originalPrice.toLocaleString()}</span>
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={handleTryOn} className="btn-secondary flex-1 text-sm !py-2.5 !px-3 !rounded-xl">Try On</button>
          <button onClick={() => addToBag(product.id)} className="btn-primary flex-1 text-sm !py-2.5 !px-3 !rounded-xl">Add to Bag</button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
