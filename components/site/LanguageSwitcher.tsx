"use client";

import { useTranslations } from "./LocaleProvider";
import type { Locale } from "@/lib/i18n";

/**
 * Compact AR | EN toggle for the navbar.
 *
 * Click → setLocale → cookie write → window.reload(). Reload is
 * intentional: server components read the cookie, so we want them to
 * re-render with the new locale (metadata, schema, html dir/lang etc).
 */
export default function LanguageSwitcher() {
  const { locale, setLocale } = useTranslations();

  const next: Locale = locale === "ar" ? "en" : "ar";
  const label = locale === "ar" ? "EN" : "ع";
  // The hint text is shown in the OPPOSITE language so it's legible
  // in both states ("Switch to English" when AR, "العربية" when EN).
  const tooltip =
    locale === "ar" ? "Switch to English" : "التحويل للعربية";

  return (
    <button
      onClick={() => setLocale(next)}
      title={tooltip}
      aria-label={tooltip}
      className="inline-flex items-center justify-center min-w-9 h-9 px-2.5 rounded-full font-bold text-xs bg-[#f5f8fa] dark:bg-[#162033] text-[#12394d] dark:text-white border border-[#d0dde4] dark:border-[#1e3a5f] hover:border-[#1d5770] hover:bg-[#1d5770] hover:text-white dark:hover:bg-[#91b149] dark:hover:text-[#0a0f14] dark:hover:border-[#91b149] transition-colors"
    >
      {label}
    </button>
  );
}
