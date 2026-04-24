import { useEffect, useState, useCallback } from 'react';
import type { AngleViews } from '@/components/tryon/types';

/**
 * Caches generated angle views in localStorage, keyed by a stable signature
 * of the source photo + selected outfit. Prevents redundant AI calls when
 * the user refreshes or returns later with the same combo.
 */

const STORAGE_KEY = 'tryon:cache:v1';
const MAX_ENTRIES = 8; // keep cache bounded

interface CacheEntry {
  signature: string;
  views: AngleViews;
  updatedAt: number;
}

const hashString = (s: string): string => {
  // Cheap djb2 — enough for a cache key, not security
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h) ^ s.charCodeAt(i);
  return (h >>> 0).toString(36);
};

export const buildSignature = (userPhoto: string | null, itemIds: string[]): string | null => {
  if (!userPhoto || itemIds.length === 0) return null;
  // Photo data URLs can be huge — hash a prefix slice for speed.
  const photoKey = hashString(userPhoto.slice(0, 4096));
  return `${photoKey}|${[...itemIds].sort().join(',')}`;
};

const readAll = (): CacheEntry[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeAll = (entries: CacheEntry[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES)));
  } catch {
    // quota exceeded — drop oldest and retry once
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, 2)));
    } catch {
      /* give up silently */
    }
  }
};

export const useTryOnCache = (signature: string | null) => {
  const [views, setViews] = useState<AngleViews>({});

  // Hydrate when signature changes
  useEffect(() => {
    if (!signature) {
      setViews({});
      return;
    }
    const entries = readAll();
    const match = entries.find(e => e.signature === signature);
    setViews(match?.views ?? {});
  }, [signature]);

  // Persist whenever views change
  useEffect(() => {
    if (!signature || Object.keys(views).length === 0) return;
    const entries = readAll().filter(e => e.signature !== signature);
    entries.unshift({ signature, views, updatedAt: Date.now() });
    writeAll(entries);
  }, [signature, views]);

  const setAngleImage = useCallback((angle: string, image: string) => {
    setViews(prev => ({ ...prev, [angle]: image }));
  }, []);

  const clear = useCallback(() => {
    setViews({});
    if (!signature) return;
    const entries = readAll().filter(e => e.signature !== signature);
    writeAll(entries);
  }, [signature]);

  return { views, setAngleImage, clear, setViews };
};
