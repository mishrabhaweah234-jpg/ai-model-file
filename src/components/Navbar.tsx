import { useStore } from '@/store/useStore';
import logo from '@/assets/logo.jpeg';

const Navbar = () => {
  const { bag, setCartOpen, setAuthOpen, searchQuery, setSearchQuery } = useStore();

  return (
    <header className="glass-surface sticky top-4 z-20 w-full max-w-[1320px] mx-auto px-5 py-4 rounded-3xl flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-3">
        <img src={logo} alt="ModeMuse Logo" className="w-12 h-12 rounded-2xl object-cover" />
        <div>
          <p className="eyebrow !mb-0">Future fashion retail</p>
          <h1 className="text-xl font-bold font-display m-0">ModeMuse</h1>
        </div>
      </div>

      <nav className="hidden md:flex gap-5 font-bold" aria-label="Primary">
        <a href="#men" className="relative hover:text-primary transition-colors">Men</a>
        <a href="#women" className="relative hover:text-primary transition-colors">Women</a>
        <a href="#new-arrivals" className="relative hover:text-primary transition-colors">New Arrivals</a>
        <a href="#studio" className="text-primary font-extrabold">Try-On Studio</a>
      </nav>

      <div className="flex items-center gap-3">
        <label className="hidden sm:grid gap-1 min-w-[200px] lg:min-w-[280px]">
          <input
            type="search"
            placeholder="oversized tee, denim, heels..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-border bg-card/80 rounded-2xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          />
        </label>
        <button
          onClick={() => setCartOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full font-extrabold text-sm bg-navy text-primary-foreground"
        >
          Bag
          <strong className="inline-grid place-items-center min-w-[28px] h-7 rounded-full bg-primary-foreground/20 text-xs">
            {bag.length}
          </strong>
        </button>
        <button
          onClick={() => setAuthOpen(true)}
          className="btn-secondary !py-2.5 !px-4 text-sm rounded-full"
        >
          Login
        </button>
      </div>
    </header>
  );
};

export default Navbar;
