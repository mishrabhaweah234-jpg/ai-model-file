import { useParams, useNavigate, Link } from 'react-router-dom';
import { products } from '@/data/products';
import { useStore } from '@/store/useStore';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartSidebar from '@/components/CartSidebar';
import AuthModal from '@/components/AuthModal';
import { useState } from 'react';

const defaultSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToBag, setTryOn } = useStore();
  const product = products.find(p => p.id === id);
  const availableSizes = product?.sizes ?? defaultSizes;
  const availableColors = product?.colors;
  const [selectedSize, setSelectedSize] = useState(availableSizes[Math.min(2, availableSizes.length - 1)]);
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [imageZoomed, setImageZoomed] = useState(false);

  if (!product) {
    return (
      <div className="w-full max-w-[1320px] mx-auto px-4">
        <Navbar />
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
          <h2 className="font-display text-2xl">Product not found</h2>
          <button onClick={() => navigate('/')} className="btn-primary text-sm !py-2.5 !px-6">Back to Shop</button>
        </div>
        <Footer />
      </div>
    );
  }

  const priceDelta = availableColors?.[selectedColorIdx]?.priceDelta ?? 0;
  const displayPrice = product.price + priceDelta;
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  // Related products: same audience, different id, max 4
  const related = products
    .filter(p => p.audience === product.audience && p.id !== product.id)
    .slice(0, 4);

  // Same category alternatives
  const categoryAlts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleTryOn = () => {
    setTryOn(product.category.toLowerCase(), product.id);
    navigate('/');
    setTimeout(() => {
      document.getElementById('studio')?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  return (
    <>
      <div className="page-glow top-24 -left-36" style={{ background: product.color + '44' }} />
      <div className="page-glow top-[28rem] -right-32" style={{ background: 'rgba(20,108,127,0.24)' }} />

      <div className="w-full max-w-[1320px] mx-auto px-4">
        <Navbar />

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mt-2 mb-4">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <Link to={`/#${product.audience.toLowerCase()}`} className="hover:text-foreground transition-colors">{product.audience}</Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        {/* Main Product Grid */}
        <div className="glass-surface !rounded-3xl p-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left — Image */}
            <div className="space-y-4">
              <div
                className={`relative rounded-3xl overflow-hidden cursor-zoom-in transition-all duration-500 ${imageZoomed ? 'lg:scale-105' : ''}`}
                style={{ background: product.background }}
                onClick={() => setImageZoomed(!imageZoomed)}
              >
                <span className="badge-tag absolute top-4 left-4 text-xs z-10">{product.badge}</span>
                <div className="flex items-center justify-center p-8 min-h-[400px] lg:min-h-[500px]">
                  <img
                    src={product.image}
                    alt={product.name}
                    width={512}
                    height={512}
                    className={`object-contain drop-shadow-xl transition-transform duration-500 ${imageZoomed ? 'scale-125' : 'w-72 h-72 lg:w-96 lg:h-96'}`}
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center">Click image to zoom</p>
            </div>

            {/* Right — Details */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-muted-foreground">{product.brand}</span>
                  <span className="badge-tag text-[10px] !py-0.5 !px-2" style={{ background: product.audience === 'Women' ? 'rgba(248,200,216,0.55)' : 'rgba(223,231,255,0.7)' }}>
                    {product.audience}
                  </span>
                </div>
                <h1 className="font-display text-3xl lg:text-4xl mb-2">{product.name}</h1>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map(star => (
                      <span key={star} className={`text-lg ${star <= Math.round(product.rating) ? 'text-accent' : 'text-muted'}`}>★</span>
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">{product.rating} rating</span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3 mb-6">
                  <strong className="text-3xl">Rs {displayPrice.toLocaleString()}</strong>
                  <span className="text-lg line-through text-muted-foreground">Rs {product.originalPrice.toLocaleString()}</span>
                  <span className="badge-tag text-xs !py-1 !px-2.5 !bg-secondary !text-secondary-foreground">
                    {discount}% OFF
                  </span>
                </div>

                {/* Description */}
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {product.description} Crafted with premium materials for a perfect fit and lasting comfort.
                  Ideal for both casual outings and styled occasions.
                </p>

                {/* Category */}
                <div className="mb-6">
                  <span className="eyebrow">Category</span>
                  <p className="text-sm mt-1">{product.category}</p>
                </div>

                {/* Size Selector */}
                <div className="mb-6">
                  <span className="eyebrow">Select size</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {availableSizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-12 h-12 px-3 rounded-2xl border-2 text-sm font-semibold transition-all ${
                          selectedSize === size
                            ? 'border-primary bg-primary/10 text-primary scale-105'
                            : 'border-border bg-card hover:bg-muted text-foreground'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Size guide available in store</p>
                </div>

                {/* Color swatch */}
                <div className="mb-6">
                  <span className="eyebrow">Color{availableColors ? ` — ${availableColors[selectedColorIdx].name}` : ''}</span>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    {availableColors ? (
                      availableColors.map((c, i) => (
                        <button
                          key={c.name}
                          onClick={() => setSelectedColorIdx(i)}
                          title={c.name + (c.priceDelta ? ` (+Rs ${c.priceDelta})` : '')}
                          className={`w-9 h-9 rounded-full border-2 transition-all ${
                            i === selectedColorIdx ? 'border-primary ring-2 ring-primary/30 scale-110' : 'border-border hover:scale-105'
                          }`}
                          style={{ background: c.value }}
                          aria-label={c.name}
                        />
                      ))
                    ) : (
                      <div
                        className="w-8 h-8 rounded-full border-2 border-primary ring-2 ring-primary/30"
                        style={{ background: product.color }}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <div className="flex gap-3">
                  <button
                    onClick={() => addToBag(product.id)}
                    className="btn-primary flex-1 text-sm !py-3"
                  >
                    🛒 Add to Bag — {selectedSize}{availableColors ? ` · ${availableColors[selectedColorIdx].name}` : ''} · Rs {displayPrice.toLocaleString()}
                  </button>
                </div>
                <button
                  onClick={handleTryOn}
                  className="btn-secondary w-full text-sm !py-3"
                >
                  👗 Try On in Studio
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related from same category */}
        {categoryAlts.length > 0 && (
          <section className="glass-surface !rounded-3xl p-6 mt-6">
            <p className="eyebrow">More in {product.category}</p>
            <h3 className="font-display text-xl mb-4">You might also like</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {categoryAlts.map(p => (
                <Link key={p.id} to={`/product/${p.id}`} className="group">
                  <div className="rounded-2xl overflow-hidden" style={{ background: p.background }}>
                    <div className="flex items-center justify-center p-4 h-40">
                      <img src={p.image} alt={p.name} loading="lazy" width={512} height={512} className="w-24 h-24 object-contain group-hover:scale-110 transition-transform duration-500" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <h4 className="font-display text-sm truncate">{p.name}</h4>
                    <div className="flex items-baseline gap-2">
                      <strong className="text-sm">Rs {p.price.toLocaleString()}</strong>
                      <span className="text-xs line-through text-muted-foreground">Rs {p.originalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Related from same audience */}
        {related.length > 0 && (
          <section className="glass-surface !rounded-3xl p-6 mt-6">
            <p className="eyebrow">Recommended for {product.audience}</p>
            <h3 className="font-display text-xl mb-4">Complete your look</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {related.map(p => (
                <Link key={p.id} to={`/product/${p.id}`} className="group">
                  <div className="rounded-2xl overflow-hidden" style={{ background: p.background }}>
                    <div className="flex items-center justify-center p-4 h-40">
                      <img src={p.image} alt={p.name} loading="lazy" width={512} height={512} className="w-24 h-24 object-contain group-hover:scale-110 transition-transform duration-500" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <h4 className="font-display text-sm truncate">{p.name}</h4>
                    <div className="flex items-baseline gap-2">
                      <strong className="text-sm">Rs {p.price.toLocaleString()}</strong>
                      <span className="text-xs line-through text-muted-foreground">Rs {p.originalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <Footer />
      </div>

      <CartSidebar />
      <AuthModal />
    </>
  );
};

export default ProductDetail;
