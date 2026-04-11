import { useThemeStore, themes } from '@/store/useThemeStore';
import { useState, useRef, useEffect } from 'react';

const ThemeSwitcher = () => {
  const { theme, setTheme } = useThemeStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = themes.find(t => t.id === theme) || themes[0];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-lg hover:scale-110 transition-transform"
        aria-label="Switch theme"
        title={`Theme: ${current.label}`}
      >
        {current.icon}
      </button>
      {open && (
        <div className="absolute right-0 top-12 glass-surface !rounded-2xl p-2 min-w-[160px] z-50 animate-fade-in">
          {themes.map(t => (
            <button
              key={t.id}
              onClick={() => { setTheme(t.id); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                theme === t.id ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
              }`}
            >
              <span className="text-lg">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;
