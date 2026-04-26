/**
 * Lightweight bilingual core for واحة.
 *
 * Why custom (not next-intl):
 *   We picked cookie-based locale switching (no URL change) to avoid
 *   refactoring 30+ pages into `app/[locale]/...`. Next-intl mandates
 *   the locale-segment routing, so a custom layer is simpler for our
 *   scope: same URLs, locale toggled via cookie + reload.
 *
 * Trade-off: SEO for English is weak — Google can only index one
 * version per URL. When/if that becomes a priority, the path is
 * straightforward: add a per-locale subdirectory and render the
 * existing components inside it.
 */

import arMessages from "@/messages/ar.json";
import enMessages from "@/messages/en.json";

export type Locale = "ar" | "en";
export const DEFAULT_LOCALE: Locale = "ar";
export const SUPPORTED_LOCALES: Locale[] = ["ar", "en"];
export const LOCALE_COOKIE = "waaha_locale";

type Messages = typeof arMessages;

const messagesByLocale: Record<Locale, Messages> = {
  ar: arMessages,
  en: enMessages as Messages,
};

/** Type-guard a string into a Locale; falls back to default. */
export function normaliseLocale(value: unknown): Locale {
  return SUPPORTED_LOCALES.includes(value as Locale)
    ? (value as Locale)
    : DEFAULT_LOCALE;
}

/** Direction for a given locale (RTL for Arabic, LTR for English). */
export function localeDir(locale: Locale): "rtl" | "ltr" {
  return locale === "ar" ? "rtl" : "ltr";
}

/**
 * Look up a deeply-nested translation key with dot notation:
 *   t("nav.home") → "الرئيسية" | "Home"
 *
 * If a key is missing in the active locale, falls back to Arabic
 * (the source language) so we never render a raw key in the UI.
 * If the key is missing everywhere, returns the key itself — useful
 * during development to spot orphans.
 */
export function getTranslation(locale: Locale, key: string): string {
  const lookup = (msgs: Messages): unknown =>
    key.split(".").reduce<unknown>(
      (acc, segment) =>
        acc && typeof acc === "object" && segment in (acc as Record<string, unknown>)
          ? (acc as Record<string, unknown>)[segment]
          : undefined,
      msgs,
    );

  const direct = lookup(messagesByLocale[locale]);
  if (typeof direct === "string") return direct;

  // Fallback: Arabic (always populated as the source language)
  if (locale !== DEFAULT_LOCALE) {
    const fallback = lookup(messagesByLocale[DEFAULT_LOCALE]);
    if (typeof fallback === "string") return fallback;
  }

  return key;
}
