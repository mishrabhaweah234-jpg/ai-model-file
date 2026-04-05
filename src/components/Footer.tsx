import { useStore } from '@/store/useStore';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { bag, tryOn, bagTotal } = useStore();
  const wishlistCount = Object.values(tryOn).filter(Boolean).length;

  return (
    <>
      <div className="flex gap-4 mt-4 flex-wrap">
        {[
          { label: 'Wishlist', value: `${wishlistCount} items` },
          { label: 'Bag value', value: `Rs ${bagTotal()}` },
          { label: 'Bag items', value: `${bag.length} products` },
        ].map(s => (
          <article key={s.label} className="glass-surface flex-1 min-w-[180px] !rounded-3xl p-4">
            <span className="eyebrow">{s.label}</span>
            <strong className="block mt-1 text-lg font-display">{s.value}</strong>
          </article>
        ))}
      </div>

      <footer className="glass-surface !rounded-3xl p-6 mt-4 mb-8">
        <div className="grid sm:grid-cols-3 gap-6">
          <div>
            <h3 className="font-display text-xl mb-2">ModeMuse</h3>
            <p className="text-sm text-muted-foreground">
              Built as a concept storefront with virtual try-on, cart interactions, and premium product cards.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-2">Quick links</h4>
            <nav className="space-y-1 text-sm">
              <Link to="/about" className="block text-muted-foreground hover:text-foreground transition-colors">About</Link>
              <Link to="/help" className="block text-muted-foreground hover:text-foreground transition-colors">Help</Link>
              <Link to="/terms" className="block text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
            </nav>
          </div>
          <div>
            <h4 className="font-bold mb-2">Follow</h4>
            <div className="flex gap-3">
              {['Instagram', 'Twitter', 'Pinterest'].map(s => (
                <span key={s} className="badge-tag text-xs !py-1.5 !px-3 cursor-pointer hover:scale-105 transition-transform">{s}</span>
              ))}
            </div>
          </div>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-6">© 2026 ModeMuse. Concept storefront — no real transactions.</p>
      </footer>
    </>
  );
};

export default Footer;
