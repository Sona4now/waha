"use client";

import Navbar from "./Navbar";
import Footer from "./Footer";
import BottomNav from "./BottomNav";
import ReadingProgress from "./ReadingProgress";
import ClientWidgets from "./ClientWidgets";
import { useTranslations } from "./LocaleProvider";

/**
 * Page shell. Mounts Navbar, Footer, BottomNav, ReadingProgress, and the
 * lazy ClientWidgets island.
 *
 * Why client: most pages that wrap their content in SiteLayout are client
 * components ("use client" + useState/useEffect for filters/quizzes/etc).
 * Next.js requires that any component imported by a client component must
 * also live in the client bundle, which means SiteLayout can't use
 * next/headers directly. Locale + direction come through the LocaleProvider
 * context (set up at the root layout from the cookie value).
 *
 * The outer div repeats `dir` for two reasons:
 *   1) html `dir` is set on the server, so the first paint is correct;
 *   2) this outer div tracks locale changes after the user toggles
 *      languages, before the cookie-driven full-reload finishes.
 */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { locale } = useTranslations();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <div
      className="min-h-screen bg-[#f5f8fa] dark:bg-[#0a151f] text-[#12394d] dark:text-white font-[Cairo,sans-serif] overflow-x-hidden transition-colors duration-300 pb-16 md:pb-0"
      dir={dir}
    >
      {/* Skip to main content — accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:right-4 focus:z-[200] focus:bg-[#91b149] focus:text-[#0a0f14] focus:px-4 focus:py-2 focus:rounded-lg focus:font-bold focus:text-sm"
      >
        {locale === "ar" ? "تخطي إلى المحتوى الرئيسي" : "Skip to main content"}
      </a>
      <Navbar />
      <ReadingProgress />
      <main id="main-content">{children}</main>
      <Footer />
      <BottomNav />
      <ClientWidgets />
    </div>
  );
}
