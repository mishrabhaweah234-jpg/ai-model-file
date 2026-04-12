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
    <article className="glass-surface !rounded-3xl overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <Link to={`/product/${product.id}`}>
        <div className="relative h-52 flex items-center justify-center p-4 overflow-hidden" style={{ background: product.background }}>
          <span className="badge-tag absolute top-3 left-3 text-xs z-10">{product.badge}</span>
          {discount > 0 && (
            <span className="absolute top-3 right-3 text-[11px] font-bold px-2.5 py-1 rounded-full bg-primary text-primary-foreground z-10">
              -{discount}%
            </span>
          )}
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            width={512}
            height={512}
            className="w-36 h-36 object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-xl"
          />
        </div>
      </Link>
      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <Link to={`/product/${product.id}`}>
              <h4 className="font-display text-lg hover:text-primary transition-colors truncate">{product.name}</h4>
            </Link>
            <span className="text-xs text-muted-foreground">{product.brand}</span>
          </div>
          <span
            className="badge-tag text-xs !py-1.5 !px-2.5 shrink-0"
            style={{ background: feminine ? 'hsl(var(--pink) / 0.4)' : 'hsl(var(--lavender) / 0.5)' }}
          >
            {product.rating} ★
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{product.description}</p>
        <div className="flex items-baseline gap-2 mt-3">
          <strong className="text-xl font-display">Rs {product.price.toLocaleString()}</strong>
          <span className="text-sm line-through text-muted-foreground">Rs {product.originalPrice.toLocaleString()}</span>
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={handleTryOn} className="btn-secondary flex-1 text-sm !py-2.5 !rounded-xl">Try On</button>
          <button onClick={() => addToBag(product.id)} className="btn-primary flex-1 text-sm !py-2.5 !rounded-xl">Add to Bag</button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
