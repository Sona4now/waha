"use client";

import { useCallback } from "react";
import { motion } from "framer-motion";
import { useFavorites, type FavoriteType } from "@/hooks/useFavorites";

interface Props {
  type: FavoriteType;
  id: string;
  /** "chip" = rounded pill used on cards; "icon" = 40px circle for hero/nav. */
  variant?: "chip" | "icon";
  /** Extra tailwind classes for positioning. */
  className?: string;
  /** Stops click event bubbling to parent (e.g. card links). Default: true. */
  stopPropagation?: boolean;
}

/**
 * Unified ❤️ button used on destination cards, blog cards, tour cards.
 *
 * - Reads from the shared useFavorites hook so the state is consistent across
 *   the whole site.
 * - Absorbs clicks by default — you can drop this inside a <Link> card without
 *   the tap turning into a navigation.
 * - Haptic + scale animation make the toggle feel deliberate.
 */
export default function FavoriteButton({
  type,
  id,
  variant = "icon",
  className = "",
  stopPropagation = true,
}: Props) {
  const { isFavorite, toggle } = useFavorites();
  const active = isFavorite(type, id);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (stopPropagation) {
        e.preventDefault();
        e.stopPropagation();
      }
      // Haptic only on the "add" direction — users already know when they're
      // removing, but adding is the action we want to celebrate a little.
      if (!active) {
        try {
          navigator.vibrate?.(15);
        } catch {
          /* no haptic */
        }
      }
      toggle(type, id);
    },
    [active, toggle, type, id, stopPropagation],
  );

  const label = active ? "إزالة من المفضلة" : "أضف للمفضلة";

  if (variant === "chip") {
    return (
      <motion.button
        onClick={handleClick}
        whileTap={{ scale: 0.92 }}
        aria-label={label}
        aria-pressed={active}
        className={`inline-flex items-center gap-1.5 px-2.5 h-8 rounded-full text-xs font-bold transition-colors ${
          active
            ? "bg-rose-500/15 text-rose-500 border border-rose-500/30"
            : "bg-white/80 dark:bg-white/5 text-[#7b7c7d] dark:text-white/60 border border-[#d1d5db] dark:border-[#1e3a5f] hover:text-rose-500 hover:border-rose-400/40"
        } ${className}`}
      >
        <span className="text-sm leading-none">{active ? "❤️" : "🤍"}</span>
        <span>{active ? "محفوظ" : "احفظ"}</span>
      </motion.button>
    );
  }

  // icon variant (circle)
  return (
    <motion.button
      onClick={handleClick}
      whileTap={{ scale: 0.88 }}
      aria-label={label}
      aria-pressed={active}
      className={`flex items-center justify-center w-9 h-9 rounded-full backdrop-blur-md transition-all ${
        active
          ? "bg-rose-500/20 text-rose-400 border border-rose-400/40 shadow-[0_4px_16px_rgba(244,63,94,0.25)]"
          : "bg-black/30 text-white/70 border border-white/15 hover:bg-black/50 hover:text-white"
      } ${className}`}
    >
      <span className="text-base leading-none" aria-hidden="true">
        {active ? "❤️" : "🤍"}
      </span>
    </motion.button>
  );
}
