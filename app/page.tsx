import { cookies } from "next/headers";
import { LOCALE_COOKIE } from "@/lib/i18n";
import CinematicExperience from "./CinematicExperience";

/**
 * Server-rendered shell for the cinematic intro.
 *
 * Reads the locale cookie at request time so we can decide whether to
 * show the language gate before any client JS runs. This avoids the
 * flash you'd otherwise get from a client-side cookie check (SSR renders
 * one screen, then hydration swaps to another).
 *
 * - No cookie → first-time visitor → render the gate first
 * - Cookie present → returning visitor → skip the gate, render Entry
 */
export default async function HomePage() {
  const cookieStore = await cookies();
  const hasLocaleCookie = cookieStore.has(LOCALE_COOKIE);

  return <CinematicExperience showLanguageGate={!hasLocaleCookie} />;
}
