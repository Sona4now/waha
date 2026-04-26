/**
 * Reusable social-icon row.
 *
 * Server component (no "use client") so the icons render in the SSR HTML.
 * That matters because the Footer is a server component too — and because
 * search engines see the links on first paint, which feeds back into the
 * Organization.sameAs signal.
 *
 * Icons are inlined SVG paths (no external dep). Each platform gets its
 * official brand colour on hover.
 */
import type { ReactElement } from "react";
import { SOCIAL_LINKS, type SocialKey } from "@/lib/siteMeta";

interface Props {
  /** Visual size of each icon button. */
  size?: "sm" | "md";
  /** Accent style — "muted" for footer, "white" for dark hero overlays. */
  variant?: "muted" | "white";
  className?: string;
}

const ICON_BY_KEY: Record<SocialKey, ReactElement> = {
  instagram: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 0 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.1z" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
};

/** Brand-accurate hover colour per platform. */
const HOVER_BG: Record<SocialKey, string> = {
  instagram: "hover:bg-[#E4405F]",
  tiktok: "hover:bg-[#010101]",
  facebook: "hover:bg-[#1877F2]",
  youtube: "hover:bg-[#FF0000]",
};

export default function SocialBar({
  size = "md",
  variant = "muted",
  className = "",
}: Props) {
  const dim = size === "sm" ? "w-8 h-8" : "w-10 h-10";
  const iconSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";

  const baseColors =
    variant === "white"
      ? "bg-white/10 text-white border-white/15"
      : "bg-white/[0.04] text-white/65 border-white/10";

  return (
    <div className={`inline-flex items-center gap-2 ${className}`} dir="ltr">
      {SOCIAL_LINKS.map((s) => (
        <a
          key={s.key}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${s.label} — ${s.handle}`}
          title={`${s.label} — ${s.handle}`}
          className={`${dim} flex items-center justify-center rounded-full border ${baseColors} ${HOVER_BG[s.key]} hover:text-white hover:border-transparent transition-colors no-underline`}
        >
          <span className={iconSize}>{ICON_BY_KEY[s.key]}</span>
        </a>
      ))}
    </div>
  );
}
