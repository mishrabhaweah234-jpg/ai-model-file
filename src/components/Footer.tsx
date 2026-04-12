import { useStore } from '@/store/useStore';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { bag, tryOn, bagTotal } = useStore();
  const wishlistCount = Object.values(tryOn).filter(Boolean).length;

  const summaryCards = [
    { icon: '❤️', label: 'Wishlist', value: `${wishlistCount} items` },
    { icon: '🛍️', label: 'Bag value', value: `Rs ${bagTotal().toLocaleString()}` },
    { icon: '📦', label: 'Bag items', value: `${bag.length} products` },
  ];

  return (
    <>
      <div className="flex gap-4 mt-5 flex-wrap">
        {summaryCards.map(s => (
          <article key={s.label} className="glass-surface flex-1 min-w-[180px] !rounded-3xl p-5 hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-center gap-2">
              <span className="text-lg">{s.icon}</span>
              <span className="eyebrow">{s.label}</span>
            </div>
            <strong className="block mt-2 text-xl font-display group-hover:text-primary transition-colors">{s.value}</strong>
          </article>
        ))}
      </div>

      <footer className="glass-surface !rounded-3xl p-8 mt-5 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="grid sm:grid-cols-3 gap-8 relative">
          <div>
            <h3 className="font-display text-2xl mb-3">ModeMuse</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Built as a concept storefront with virtual try-on, cart interactions, and premium product cards.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-3 text-sm eyebrow">Quick links</h4>
            <nav className="space-y-2 text-sm">
              {[
                { to: '/about', label: 'About' },
                { to: '/help', label: 'Help Center' },
                { to: '/terms', label: 'Terms & Privacy' },
              ].map(link => (
                <Link key={link.to} to={link.to} className="block text-muted-foreground hover:text-primary transition-colors">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <div>
            <h4 className="font-bold mb-3 text-sm eyebrow">Connect</h4>
            <div className="flex gap-2 flex-wrap">
              {['Instagram', 'Twitter', 'Pinterest'].map(s => (
                <span key={s} className="badge-tag text-xs !py-2 !px-3.5 cursor-pointer hover:scale-105 hover:shadow-md transition-all duration-200">{s}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-5">
          <p className="text-center text-xs text-muted-foreground">© 2026 ModeMuse. Concept storefront — no real transactions.</p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
