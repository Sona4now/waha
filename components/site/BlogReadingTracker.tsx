"use client";

import { useEffect } from "react";

const STORAGE_KEY = "waaha_blog_progress";

interface Props {
  postId: string;
}

/**
 * Mounted on blog post pages. Tracks max scroll % reached and persists it
 * per-post in localStorage. The blog list page (and the blog cards there)
 * reads this back to show "60% قُرئ — كمل من حيث وقفت" instead of just
 * "اقرأ" — a small but real retention nudge for casual readers.
 */
export default function BlogReadingTracker({ postId }: Props) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    let max = 0;

    // Throttled via rAF to keep scroll handler cheap on long posts.
    let pending = false;
    function update() {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        pending = false;
        const total =
          document.documentElement.scrollHeight -
          document.documentElement.clientHeight;
        if (total <= 0) return;
        const pct = Math.min(
          100,
          Math.max(0, ((window.scrollY || 0) / total) * 100),
        );
        if (pct > max) max = pct;
      });
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    // Persist on unmount and on visibilitychange (covers tab close on iOS).
    function persist() {
      if (max < 5) return; // ignore noise — any read counts as ≥5%
      try {
        const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
        const prev = data[postId] || 0;
        if (Math.round(max) > prev) {
          data[postId] = Math.round(max);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        }
      } catch {
        /* localStorage disabled */
      }
    }
    function onVisibility() {
      if (document.visibilityState === "hidden") persist();
    }
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      document.removeEventListener("visibilitychange", onVisibility);
      persist();
    };
  }, [postId]);

  return null;
}

/**
 * Public reader for blog list cards. Returns the max scroll % the user
 * has ever reached on this post. SSR-safe (returns null).
 */
export function getBlogProgress(postId: string): number | null {
  if (typeof window === "undefined") return null;
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const v = data[postId];
    return typeof v === "number" ? v : null;
  } catch {
    return null;
  }
}
