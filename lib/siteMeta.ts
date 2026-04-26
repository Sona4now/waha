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
