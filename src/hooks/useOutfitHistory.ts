import { useCallback, useEffect, useRef, useState } from 'react';

export interface OutfitHistoryEntry {
  id: string;
  image: string;
  name: string;
  productIds: string[];
  createdAt: number;
}

const KEY = 'tryon:history';
const LIMIT = 6;

const read = (): OutfitHistoryEntry[] => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as OutfitHistoryEntry[]) : [];
  } catch {
    return [];
  }
};

const write = (items: OutfitHistoryEntry[]) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    /* quota — drop oldest until fits */
    try {
      localStorage.setItem(KEY, JSON.stringify(items.slice(0, Math.max(1, items.length - 2))));
    } catch {
      /* ignore */
    }
  }
};

export const useOutfitHistory = () => {
  const [items, setItems] = useState<OutfitHistoryEntry[]>(() => read());
  const lastImageRef = useRef<string | null>(null);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setItems(read());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const push = useCallback((entry: Omit<OutfitHistoryEntry, 'id' | 'createdAt'>) => {
    if (!entry.image || lastImageRef.current === entry.image) return;
    lastImageRef.current = entry.image;
    setItems((prev) => {
      const next: OutfitHistoryEntry[] = [
        { ...entry, id: crypto.randomUUID(), createdAt: Date.now() },
        ...prev.filter((p) => p.image !== entry.image),
      ].slice(0, LIMIT);
      write(next);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setItems([]);
    write([]);
  }, []);

  return { items, push, clear };
};
