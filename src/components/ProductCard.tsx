import type { Product } from '@/data/products';
import { useStore } from '@/store/useStore';

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

  return (
    <article className="glass-surface !rounded-3xl overflow-hidden group">
      <div className="relative h-48 flex items-center justify-center p-4 overflow-hidden" style={{ background: product.background }}>
        <span className="badge-tag absolute top-3 left-3 text-xs z-10">{product.badge}</span>
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={512}
          height={512}
          className="w-32 h-32 object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-lg"
        />
      </div>
      <div className="p-5">
        <h4 className="font-display text-lg">{product.name}</h4>
        <span className="text-xs text-muted-foreground">{product.brand}</span>
        <p className="text-sm text-muted-foreground mt-2">{product.description}</p>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-baseline gap-2">
            <strong className="text-lg">Rs {product.price}</strong>
            <span className="text-sm line-through text-muted-foreground">Rs {product.originalPrice}</span>
          </div>
          <span
            className="badge-tag text-xs !py-1.5 !px-3"
            style={{ background: feminine ? 'rgba(248,200,216,0.55)' : 'rgba(223,231,255,0.7)' }}
          >
            {product.rating} ★
          </span>
        </div>
        <div className="flex gap-3 mt-4">
          <button onClick={handleTryOn} className="btn-secondary flex-1 text-sm !py-2.5">Try On</button>
          <button onClick={() => addToBag(product.id)} className="btn-primary flex-1 text-sm !py-2.5">Add to Bag</button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
