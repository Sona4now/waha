"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  type Locale,
  getTranslation,
  normaliseLocale,
} from "@/lib/i18n";

interface LocaleContextValue {
  locale: Locale;
  t: (key: string) => string;
  setLocale: (next: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: DEFAULT_LOCALE,
  t: (k) => k,
  setLocale: () => {},
});

interface Props {
  /** Locale resolved on the server from the cookie. Passed once at mount. */
  initialLocale: Locale;
  children: React.ReactNode;
}

/**
 * Provides the current locale + a `t()` function to descendants.
 *
 * The server resolves the locale once (via cookie) and passes it down as
 * a prop. The provider exposes a stable t() that's bound to the current
 * locale, plus a setLocale() that writes the cookie and reloads the page
 * — a full reload is the simplest way to flip every server-rendered
 * surface (metadata, html dir/lang, schema.org) at once.
 */
export default function LocaleProvider({ initialLocale, children }: Props) {
  const value = useMemo<LocaleContextValue>(() => {
    const locale = normaliseLocale(initialLocale);
    return {
      locale,
      t: (key: string) => getTranslation(locale, key),
      setLocale: (next: Locale) => {
        if (typeof document === "undefined") return;
        // 1 year, root path, lax SameSite — same defaults as the auth cookie.
        document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
        // Hard reload so server components re-render with the new locale.
        window.location.reload();
      },
    };
  }, [initialLocale]);

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

/** Hook for client components to read locale + t() + setLocale. */
export function useTranslations() {
  return useContext(LocaleContext);
}

/** Convenience: just the t() function. */
export function useT() {
  const { t } = useContext(LocaleContext);
  return useCallback((key: string) => t(key), [t]);
}
