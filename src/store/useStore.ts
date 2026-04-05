import { create } from 'zustand';
import { products, type Product } from '@/data/products';

interface TryOn {
  top: string | null;
  bottom: string | null;
  shoes: string | null;
  bag: string | null;
}

interface AppState {
  bag: string[];
  tryOn: TryOn;
  selectedTone: string;
  selectedBackdrop: string;
  cartOpen: boolean;
  authOpen: boolean;
  authMode: 'login' | 'signup';
  searchQuery: string;

  addToBag: (id: string) => void;
  removeFromBag: (id: string) => void;
  setTryOn: (category: string, id: string | null) => void;
  setTone: (tone: string) => void;
  setBackdrop: (id: string) => void;
  setCartOpen: (open: boolean) => void;
  setAuthOpen: (open: boolean) => void;
  setAuthMode: (mode: 'login' | 'signup') => void;
  setSearchQuery: (q: string) => void;
  surpriseMe: () => void;
  bagTotal: () => number;
  findProduct: (id: string) => Product | undefined;
}

export const useStore = create<AppState>((set, get) => ({
  bag: [],
  tryOn: { top: null, bottom: null, shoes: null, bag: null },
  selectedTone: '#d8ab8f',
  selectedBackdrop: 'sunrise',
  cartOpen: false,
  authOpen: false,
  authMode: 'login',
  searchQuery: '',

  addToBag: (id) => set((s) => ({ bag: [id, ...s.bag], cartOpen: true })),
  removeFromBag: (id) => set((s) => ({ bag: s.bag.filter((b) => b !== id) })),
  setTryOn: (category, id) => set((s) => ({ tryOn: { ...s.tryOn, [category]: id } })),
  setTone: (tone) => set({ selectedTone: tone }),
  setBackdrop: (id) => set({ selectedBackdrop: id }),
  setCartOpen: (open) => set({ cartOpen: open }),
  setAuthOpen: (open) => set({ authOpen: open }),
  setAuthMode: (mode) => set({ authMode: mode }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  surpriseMe: () => {
    const tops = products.filter(p => p.category === 'Top');
    const bottoms = products.filter(p => p.category === 'Bottom');
    const shoes = products.filter(p => p.category === 'Shoes');
    const bags = products.filter(p => p.category === 'Bag');
    const rand = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
    set({
      tryOn: {
        top: rand(tops).id,
        bottom: rand(bottoms).id,
        shoes: rand(shoes).id,
        bag: rand(bags).id,
      }
    });
  },
  bagTotal: () => get().bag.reduce((t, id) => t + (products.find(p => p.id === id)?.price || 0), 0),
  findProduct: (id) => products.find(p => p.id === id),
}));
