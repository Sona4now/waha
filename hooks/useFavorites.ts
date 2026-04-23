"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Unified favorites hook — one source of truth for the ❤️ on destinations,
 * blog posts, and tours. Stored in localStorage only; no network, no account.
 *
 * Separate `type` field lets us store all three in one array while still
 * filtering cleanly (`list("dest")`, `list("blog")`).
 *
 * NOTE: Meditation sessions have their own independent favorites inside
 * `useSessionHistory` — we don't try to unify those because the meditation
 * room saves them tied to its own settings schema (volumeAmbient, skipIntro,
 * etc.). Keeping them separate keeps both simpler.
 */

export type FavoriteType = "dest" | "blog" | "tour";

export interface Favorite {
  type: FavoriteType;
  id: string;
  addedAt: number; // epoch ms
}

const STORAGE_KEY = "waaha_favorites";

function readFavorites(): Favorite[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Tolerate older format: if an entry is missing addedAt, default to 0
    // so sorting still works.
    return parsed
      .filter(
        (f): f is Favorite =>
          f && typeof f.id === "string" && typeof f.type === "string",
      )
      .map((f) => ({ ...f, addedAt: f.addedAt ?? 0 }));
  } catch (err) {
    console.warn("[waaha] failed to parse favorites", err);
    return [];
  }
}

function writeFavorites(favs: Favorite[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
  } catch (err) {
    console.warn("[waaha] failed to persist favorites", err);
  }
}

const EVENT = "waaha:favorites-changed";

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setFavorites(readFavorites());
    setLoaded(true);
    const onChange = () => setFavorites(readFavorites());
    // Cross-component sync: when any component modifies favorites, everyone
    // else re-reads.
    window.addEventListener(EVENT, onChange);
    // Also sync across tabs.
    window.addEventListener("storage", (e) => {
      if (e.key === STORAGE_KEY) setFavorites(readFavorites());
    });
    return () => window.removeEventListener(EVENT, onChange);
  }, []);

  const isFavorite = useCallback(
    (type: FavoriteType, id: string) =>
      favorites.some((f) => f.type === type && f.id === id),
    [favorites],
  );

  const toggle = useCallback(
    (type: FavoriteType, id: string) => {
      const next = favorites.some((f) => f.type === type && f.id === id)
        ? favorites.filter((f) => !(f.type === type && f.id === id))
        : [...favorites, { type, id, addedAt: Date.now() }];
      writeFavorites(next);
      setFavorites(next);
      window.dispatchEvent(new Event(EVENT));
    },
    [favorites],
  );

  const list = useCallback(
    (type?: FavoriteType): Favorite[] => {
      const filtered = type ? favorites.filter((f) => f.type === type) : favorites;
      // Most recently added first
      return [...filtered].sort((a, b) => b.addedAt - a.addedAt);
    },
    [favorites],
  );

  const count = useCallback(
    (type?: FavoriteType) => {
      return type
        ? favorites.filter((f) => f.type === type).length
        : favorites.length;
    },
    [favorites],
  );

  return { loaded, favorites, isFavorite, toggle, list, count };
}
