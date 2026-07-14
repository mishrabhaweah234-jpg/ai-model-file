import { useStore } from '@/store/useStore';
import { products } from '@/data/products';

const CartSidebar = () => {
  const { bag, cartOpen, setCartOpen, removeFromBag, bagTotal } = useStore();
  const bagItems = bag.map(item => ({ item, product: products.find(p => p.id === item.id) })).filter(x => x.product);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-foreground/30 z-40 transition-opacity duration-200 ${cartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setCartOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-screen w-full max-w-[420px] glass-surface !rounded-none z-50 p-5 grid grid-rows-[auto_1fr_auto] gap-4 transition-transform duration-300 ${
          cartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center">
          <div>
            <p className="eyebrow">Your bag</p>
            <h3 className="font-display text-xl">Shopping bag</h3>
          </div>
          <button onClick={() => setCartOpen(false)} className="btn-secondary !py-2 !px-3 text-sm">✕</button>
        </div>

        <div className="overflow-y-auto space-y-3">
          {bagItems.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-10">Your bag is empty right now.</p>
          ) : (
            bagItems.map(({ item, product: p }, i) => {
              const linePrice = item.price ?? p!.price;
              const meta = [item.size, item.color].filter(Boolean).join(' · ');
              return (
                <article key={`${p!.id}-${i}`} className="flex items-center gap-3 glass-surface !rounded-2xl p-3">
                  <img src={p!.image} alt={p!.name} className="w-12 h-12 rounded-xl flex-shrink-0 object-contain bg-muted/30" loading="lazy" />
                  <div className="flex-1 min-w-0">
                    <strong className="text-sm block truncate">{p!.name}</strong>
                    <p className="text-xs text-muted-foreground truncate">{p!.brand}{meta ? ` · ${meta}` : ''} · Qty 1</p>
                  </div>
                  <strong className="text-sm whitespace-nowrap">Rs {linePrice.toLocaleString()}</strong>
                  <button onClick={() => removeFromBag(i)} className="text-xs text-muted-foreground hover:text-destructive">✕</button>
                </article>
              );
            })
          )}
        </div>

        <div className="glass-surface !rounded-2xl p-4">
          <div className="flex justify-between items-center mb-3">
            <span>Total</span>
            <strong className="text-lg">Rs {bagTotal()}</strong>
          </div>
          <button className="btn-primary w-full text-sm">Checkout</button>
        </div>
      </aside>
    </>
  );
};

export default CartSidebar;
