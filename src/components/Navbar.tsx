import { useState } from 'react';
import { useStore } from '@/store/useStore';
import logo from '@/assets/logo.jpeg';

const Navbar = () => {
  const { bag, setCartOpen, setAuthOpen, searchQuery, setSearchQuery } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="glass-surface sticky top-4 z-20 w-full max-w-[1320px] mx-auto px-5 py-4 rounded-3xl">
      <div className="flex items-center justify-between gap-4">
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
            className="hidden sm:block btn-secondary !py-2.5 !px-4 text-sm rounded-full"
          >
            Login
          </button>
          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2"
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-[300px] mt-4' : 'max-h-0'}`}>
        <nav className="flex flex-col gap-3 font-bold pb-2" aria-label="Mobile">
          <input
            type="search"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="sm:hidden w-full border border-border bg-card/80 rounded-2xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          />
          <a href="#men" onClick={() => setMenuOpen(false)} className="hover:text-primary transition-colors py-1">Men</a>
          <a href="#women" onClick={() => setMenuOpen(false)} className="hover:text-primary transition-colors py-1">Women</a>
          <a href="#new-arrivals" onClick={() => setMenuOpen(false)} className="hover:text-primary transition-colors py-1">New Arrivals</a>
          <a href="#studio" onClick={() => setMenuOpen(false)} className="text-primary font-extrabold py-1">Try-On Studio</a>
          <button
            onClick={() => { setAuthOpen(true); setMenuOpen(false); }}
            className="sm:hidden btn-secondary text-sm !py-2.5 w-full"
          >
            Login
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
