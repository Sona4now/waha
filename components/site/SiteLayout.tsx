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
      <Navbar />
      <ReadingProgress />
      <main>{children}</main>
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
    </div>
  );
}
