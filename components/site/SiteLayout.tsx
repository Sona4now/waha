"use client";

import Navbar from "./Navbar";
import Footer from "./Footer";
import ChatWidget from "./ChatWidget";
import BottomNav from "./BottomNav";
import SearchCommand from "./SearchCommand";
import ComparisonTray from "./ComparisonTray";
import SmartWelcome from "./SmartWelcome";
import ToastContainer from "./Toast";
import ReadingProgress from "./ReadingProgress";
import WellnessTip from "./WellnessTip";
import AchievementListener from "./AchievementListener";
import VisitTracker from "./VisitTracker";
import CursorFollower from "./CursorFollower";
import CookieConsent from "./CookieConsent";

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
      <ChatWidget />
      <BottomNav />
      <SearchCommand />
      <ComparisonTray />
      <SmartWelcome />
      <ToastContainer />
      <WellnessTip />
      <AchievementListener />
      <VisitTracker />
      <CursorFollower />
      <CookieConsent />
    </div>
  );
}
