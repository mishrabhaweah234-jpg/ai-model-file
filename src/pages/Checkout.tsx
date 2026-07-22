import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { products } from '@/data/products';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from '@/hooks/use-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const { bag, bagTotal, removeFromBag } = useStore();
  const items = bag
    .map((item, index) => ({ item, index, product: products.find(p => p.id === item.id) }))
    .filter(x => x.product);

  const subtotal = bagTotal();
  const shipping = items.length > 0 ? 150 : 0;
  const total = subtotal + shipping;

  const handlePlaceOrder = () => {
    if (items.length === 0) return;
    toast({ title: 'Order placed', description: `Total Rs ${total.toLocaleString()} — thank you!` });
    navigate('/');
  };

  return (
    <>
      <div className="w-full max-w-[1320px] mx-auto px-4">
        <Navbar />

        <div className="mt-4 mb-6">
          <p className="eyebrow">Checkout</p>
          <h1 className="font-display text-3xl lg:text-4xl">Review your order</h1>
        </div>

        {items.length === 0 ? (
          <div className="glass-surface !rounded-3xl p-10 text-center">
            <p className="text-muted-foreground mb-4">Your bag is empty.</p>
            <Link to="/" className="btn-primary text-sm !py-2.5 !px-6 inline-block">Continue shopping</Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_380px] gap-6">
            {/* Items list */}
            <section className="glass-surface !rounded-3xl p-6">
              <h2 className="font-display text-xl mb-4">Items ({items.length})</h2>
              <div className="space-y-3">
                {items.map(({ item, index, product: p }) => {
                  const linePrice = item.price ?? p!.price;
                  return (
                    <article key={`${p!.id}-${index}`} className="flex items-center gap-4 glass-surface !rounded-2xl p-4">
                      <img
                        src={p!.image}
                        alt={p!.name}
                        className="w-20 h-20 rounded-xl flex-shrink-0 object-contain bg-muted/30"
                        loading="lazy"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-muted-foreground">{p!.brand}</span>
                        </div>
                        <strong className="text-base block truncate">{p!.name}</strong>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          {item.size && (
                            <span className="text-xs font-semibold px-2 py-1 rounded-md bg-muted text-foreground">
                              Size {item.size}
                            </span>
                          )}
                          {item.color && (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-md bg-muted text-foreground">
                              <span
                                className="w-3 h-3 rounded-full border border-border"
                                style={{ background: item.colorValue ?? p!.color }}
                              />
                              {item.color}
                            </span>
                          )}
                          <span className="text-xs font-semibold px-2 py-1 rounded-md bg-muted text-foreground">
                            Qty 1
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <strong className="text-base whitespace-nowrap">Rs {linePrice.toLocaleString()}</strong>
                        <button
                          onClick={() => removeFromBag(index)}
                          className="text-xs text-muted-foreground hover:text-destructive"
                        >
                          Remove
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            {/* Summary */}
            <aside className="glass-surface !rounded-3xl p-6 h-fit lg:sticky lg:top-6">
              <h2 className="font-display text-xl mb-4">Order summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>Rs {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>Rs {shipping.toLocaleString()}</span>
                </div>
                <div className="border-t border-border my-3" />
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold">Total</span>
                  <strong className="text-xl">Rs {total.toLocaleString()}</strong>
                </div>
              </div>
              <button onClick={handlePlaceOrder} className="btn-primary w-full text-sm !py-3 mt-5">
                Place order
              </button>
              <Link to="/" className="btn-secondary w-full text-sm !py-3 mt-2 inline-block text-center">
                Continue shopping
              </Link>
            </aside>
          </div>
        )}

        <Footer />
      </div>
    </>
  );
};

export default Checkout;
