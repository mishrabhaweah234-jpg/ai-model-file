import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark' | 'midnight' | 'warm' | 'ocean';

interface ThemeState {
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
}

export const themes: { id: ThemeMode; label: string; icon: string }[] = [
  { id: 'light', label: 'Light', icon: '☀️' },
  { id: 'dark', label: 'Dark', icon: '🌙' },
  { id: 'midnight', label: 'Midnight', icon: '🌌' },
  { id: 'warm', label: 'Warm Sand', icon: '🏖️' },
  { id: 'ocean', label: 'Ocean', icon: '🌊' },
];

const getInitialTheme = (): ThemeMode => {
  if (typeof window === 'undefined') return 'light';
  return (localStorage.getItem('modemuse-theme') as ThemeMode) || 'light';
};

export const useThemeStore = create<ThemeState>((set) => ({
  theme: getInitialTheme(),
  setTheme: (t) => {
    // Remove all theme classes, add new one
    const root = document.documentElement;
    themes.forEach(th => root.classList.remove(th.id));
    if (t !== 'light') root.classList.add(t);
    // dark class needed for Tailwind darkMode
    if (t === 'dark' || t === 'midnight') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('modemuse-theme', t);
    set({ theme: t });
  },
}));

// Apply theme on load
if (typeof window !== 'undefined') {
  const saved = getInitialTheme();
  if (saved !== 'light') {
    document.documentElement.classList.add(saved);
    if (saved === 'dark' || saved === 'midnight') {
      document.documentElement.classList.add('dark');
    }
  }
}
