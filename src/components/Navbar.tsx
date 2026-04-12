import { useState } from 'react';
import { useStore } from '@/store/useStore';
import logo from '@/assets/logo.jpeg';
import ThemeSwitcher from './ThemeSwitcher';

const Navbar = () => {
  const { bag, setCartOpen, setAuthOpen, searchQuery, setSearchQuery } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="glass-surface sticky top-4 z-20 w-full max-w-[1320px] mx-auto px-5 py-3.5 rounded-3xl transition-shadow duration-300 hover:shadow-lg">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 group cursor-pointer">
          <img src={logo} alt="ModeMuse Logo" className="w-11 h-11 rounded-2xl object-cover ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all" />
          <div>
            <p className="eyebrow !mb-0 !text-[10px]">Future fashion retail</p>
            <h1 className="text-lg font-bold font-display m-0 tracking-tight">ModeMuse</h1>
          </div>
        </div>

        <nav className="hidden md:flex gap-1 font-semibold text-sm" aria-label="Primary">
          {[
            { href: '#men', label: 'Men' },
            { href: '#women', label: 'Women' },
            { href: '#new-arrivals', label: 'New Arrivals' },
          ].map(link => (
            <a key={link.href} href={link.href} className="px-3.5 py-2 rounded-xl hover:bg-muted/60 hover:text-primary transition-all duration-200">
              {link.label}
            </a>
          ))}
          <a href="#studio" className="px-3.5 py-2 rounded-xl bg-primary/10 text-primary font-bold">
            Try-On Studio
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <label className={`hidden sm:grid gap-1 transition-all duration-300 ${searchFocused ? 'min-w-[280px] lg:min-w-[320px]' : 'min-w-[180px] lg:min-w-[240px]'}`}>
            <div className="relative">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="w-full border border-border bg-card/80 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all"
              />
            </div>
          </label>
          <button
            onClick={() => setCartOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm bg-foreground text-background hover:opacity-90 transition-opacity"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            Bag
            {bag.length > 0 && (
              <strong className="inline-grid place-items-center min-w-[22px] h-[22px] rounded-full bg-primary text-primary-foreground text-[11px]">
                {bag.length}
              </strong>
            )}
          </button>
          <button
            onClick={() => setAuthOpen(true)}
            className="hidden sm:flex items-center gap-2 btn-secondary !py-2.5 !px-4 text-sm rounded-xl"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
            Login
          </button>
          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2"
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-0.5 bg-foreground rounded-full transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[4px]' : ''}`} />
            <span className={`block w-5 h-0.5 bg-foreground rounded-full transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-foreground rounded-full transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[4px]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-[300px] mt-4' : 'max-h-0'}`}>
        <nav className="flex flex-col gap-1 font-semibold pb-2" aria-label="Mobile">
          <input
            type="search"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="sm:hidden w-full border border-border bg-card/80 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 mb-2"
          />
          {[
            { href: '#men', label: 'Men' },
            { href: '#women', label: 'Women' },
            { href: '#new-arrivals', label: 'New Arrivals' },
          ].map(link => (
            <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="px-3 py-2.5 rounded-xl hover:bg-muted/60 transition-colors">
              {link.label}
            </a>
          ))}
          <a href="#studio" onClick={() => setMenuOpen(false)} className="px-3 py-2.5 rounded-xl bg-primary/10 text-primary font-bold">
            Try-On Studio
          </a>
          <button
            onClick={() => { setAuthOpen(true); setMenuOpen(false); }}
            className="sm:hidden btn-secondary text-sm !py-2.5 w-full mt-1"
          >
            Login
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
