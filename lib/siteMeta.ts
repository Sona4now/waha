/**
 * Central site constants. Import from here instead of hardcoding URLs.
 */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://wahaeg.com";

export const SITE_NAME = "واحة — WAHA";

export const SITE_DESCRIPTION =
  "منصة محتوى رقمية للتوعية حول السياحة البيئية والاستشفاء من الطبيعة في مصر.";

export const DEFAULT_OG_IMAGE =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80";

/**
 * Contact channels. Edit here once and it propagates to: the WhatsApp
 * floating button, the per-destination lead capture form, the contact
 * page, the AI chat system prompt, and Schema.org markup.
 *
 * Phone format: E.164 without + or spaces — required by wa.me URLs.
 */
export const CONTACT_PHONE_INTL = "201015871193";
export const CONTACT_PHONE_DISPLAY = "+20 101 587 1193";
export const CONTACT_EMAIL = "info@wahaeg.com";

/**
 * Social media profiles. Used by:
 *   - Schema.org Organization.sameAs → tells Google these accounts
 *     belong to the same entity (helps Knowledge Graph, brand SERP)
 *   - Footer + Contact page social bar
 *
 * Order = display order. Each entry has the bare URL plus a stable key
 * the rendering side uses to pick the right SVG icon.
 */
export const SOCIAL_LINKS = [
  {
    key: "instagram" as const,
    label: "Instagram",
    handle: "@waha.eg",
    url: "https://www.instagram.com/waha.eg",
  },
  {
    key: "tiktok" as const,
    label: "TikTok",
    handle: "@waha.eg",
    url: "https://www.tiktok.com/@waha.eg",
  },
  {
    key: "facebook" as const,
    label: "Facebook",
    handle: "wahaeg",
    url: "https://www.facebook.com/wahaeg",
  },
  {
    key: "youtube" as const,
    label: "YouTube",
    handle: "@wahaeg",
    url: "https://www.youtube.com/@wahaeg",
  },
] as const;

export type SocialKey = (typeof SOCIAL_LINKS)[number]["key"];
