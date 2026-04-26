/**
 * Server-side counterpart to lib/i18n.ts.
 *
 * Reads the locale cookie at request time (only valid in server components,
 * Route Handlers, and Server Actions) and returns a `t()` function the
 * caller can use to localise strings during SSR.
 *
 * Use this from server components like Footer / page metadata. Client
 * components keep using the `useTranslations()` hook from
 * components/site/LocaleProvider.
 */

import { cookies } from "next/headers";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  getTranslation,
  normaliseLocale,
  type Locale,
} from "./i18n";

export async function getServerLocale(): Promise<Locale> {
  try {
    const cookieStore = await cookies();
    return normaliseLocale(cookieStore.get(LOCALE_COOKIE)?.value);
  } catch {
    // Outside a request scope (build-time generation, etc.) — default.
    return DEFAULT_LOCALE;
  }
}

export async function getServerTranslations() {
  const locale = await getServerLocale();
  return {
    locale,
    t: (key: string) => getTranslation(locale, key),
  };
}
