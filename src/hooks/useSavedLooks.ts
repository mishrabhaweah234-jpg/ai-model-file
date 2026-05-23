import { useCallback, useEffect, useState } from 'react';

export interface SavedLook {
  id: string;
  image: string;
  name: string;
  productIds: string[];
  savedAt: number;
}

const KEY = 'tryon:saved-looks';

const read = (): SavedLook[] => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as SavedLook[]) : [];
  } catch {
    return [];
  }
};

const write = (looks: SavedLook[]) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(looks));
  } catch {
    /* quota exceeded — silently drop */
  }
};

export const useSavedLooks = () => {
  const [looks, setLooks] = useState<SavedLook[]>(() => read());

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setLooks(read());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const save = useCallback((look: Omit<SavedLook, 'id' | 'savedAt'>) => {
    const entry: SavedLook = {
      ...look,
      id: crypto.randomUUID(),
      savedAt: Date.now(),
    };
    setLooks((prev) => {
      const next = [entry, ...prev].slice(0, 24);
      write(next);
      return next;
    });
    return entry;
  }, []);

  const remove = useCallback((id: string) => {
    setLooks((prev) => {
      const next = prev.filter((l) => l.id !== id);
      write(next);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setLooks([]);
    write([]);
  }, []);

  return { looks, save, remove, clear };
};
