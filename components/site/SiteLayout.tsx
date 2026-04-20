import dynamic from "next/dynamic";
import Navbar from "./Navbar";
import Footer from "./Footer";
import BottomNav from "./BottomNav";
import ReadingProgress from "./ReadingProgress";

/**
 * Widgets that are NOT on the critical path.
 * Lazy-loaded on the client after hydration so they don't bloat the
 * initial JS bundle. `ssr: false` means they render nothing on the
 * server → zero markup cost, zero initial JS cost.
 *
 * Heuristic for what goes here:
 *   - Floats, toasts, drawers, command palettes
 *   - Anything that only renders in response to a user gesture or timer
 *   - Anything gated on browser APIs (matchMedia, localStorage, geolocation)
 */
const ChatWidget = dynamic(() => import("./ChatWidget"), { ssr: false });
const SearchCommand = dynamic(() => import("./SearchCommand"), { ssr: false });
const ComparisonTray = dynamic(() => import("./ComparisonTray"), { ssr: false });
const SmartWelcome = dynamic(() => import("./SmartWelcome"), { ssr: false });
const ToastContainer = dynamic(() => import("./Toast"), { ssr: false });
const WellnessTip = dynamic(() => import("./WellnessTip"), { ssr: false });
const AchievementListener = dynamic(
  () => import("./AchievementListener"),
  { ssr: false },
);
const VisitTracker = dynamic(() => import("./VisitTracker"), { ssr: false });
// DesktopOnlyCursor is a tiny (~20-line) shell that gates CursorFollower
// behind `(hover: hover) and (pointer: fine)` — so touch devices never
// download the motion-spring code path at all.
const DesktopOnlyCursor = dynamic(
  () => import("./DesktopOnlyCursor"),
  { ssr: false },
);

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen bg-[#f5f8fa] dark:bg-[#0a151f] text-[#12394d] dark:text-white font-[Cairo,sans-serif] overflow-x-hidden transition-colors duration-300 pb-16 md:pb-0"
      dir="rtl"
    >
      {/* Skip to main content — accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:right-4 focus:z-[200] focus:bg-[#91b149] focus:text-[#0a0f14] focus:px-4 focus:py-2 focus:rounded-lg focus:font-bold focus:text-sm"
      >
        تخطي إلى المحتوى الرئيسي
      </a>
      <Navbar />
      <ReadingProgress />
      <main id="main-content">{children}</main>
      <Footer />
      <BottomNav />
      {/* — Lazy widgets — */}
      <ChatWidget />
      <SearchCommand />
      <ComparisonTray />
      <SmartWelcome />
      <ToastContainer />
      <WellnessTip />
      <AchievementListener />
      <VisitTracker />
      <DesktopOnlyCursor />
    </div>
  );
}
