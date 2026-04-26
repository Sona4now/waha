"use client";

import dynamic from "next/dynamic";

/**
 * Client-only widget island.
 *
 * Server components can't use `dynamic(..., { ssr: false })`, so this
 * tiny client wrapper owns every lazy widget. Mounting cost on the
 * server: ~0 (just the wrapper boundary). On the client, each widget
 * chunk streams in after the main content is interactive.
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
const DesktopOnlyCursor = dynamic(
  () => import("./DesktopOnlyCursor"),
  { ssr: false },
);
const WhatsAppButton = dynamic(() => import("./WhatsAppButton"), {
  ssr: false,
});
const CookieConsent = dynamic(() => import("./CookieConsent"), { ssr: false });

export default function ClientWidgets() {
  return (
    <>
      <ChatWidget />
      <SearchCommand />
      <ComparisonTray />
      <SmartWelcome />
      <ToastContainer />
      <WellnessTip />
      <AchievementListener />
      <VisitTracker />
      <DesktopOnlyCursor />
      <WhatsAppButton />
      <CookieConsent />
    </>
  );
}
