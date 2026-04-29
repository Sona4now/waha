"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

/**
 * Client-only widget island.
 *
 * Critical widgets mount immediately (chat, search, toast, PWA).
 * Secondary/cosmetic widgets are deferred until the browser is idle so
 * they don't compete with first-interaction paint.
 */

const ChatWidget       = dynamic(() => import("./ChatWidget"),       { ssr: false });
const SearchCommand    = dynamic(() => import("./SearchCommand"),    { ssr: false });
const ToastContainer   = dynamic(() => import("./Toast"),           { ssr: false });
const PWAInstallPrompt = dynamic(() => import("./PWAInstallPrompt"),{ ssr: false });
const WhatsAppButton   = dynamic(() => import("./WhatsAppButton"),  { ssr: false });

// Secondary — deferred until idle
const SmartWelcome       = dynamic(() => import("./SmartWelcome"),       { ssr: false });
const WellnessTip        = dynamic(() => import("./WellnessTip"),        { ssr: false });
const AchievementListener = dynamic(() => import("./AchievementListener"), { ssr: false });
const VisitTracker       = dynamic(() => import("./VisitTracker"),       { ssr: false });
const DesktopOnlyCursor  = dynamic(() => import("./DesktopOnlyCursor"),  { ssr: false });

/** Mounts children only after the browser reports an idle period (max 2 s). */
function IdleMount({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof requestIdleCallback !== "undefined") {
      const id = requestIdleCallback(() => setReady(true), { timeout: 2000 });
      return () => cancelIdleCallback(id);
    }
    // Fallback for Safari < 16 which lacks requestIdleCallback
    const id = setTimeout(() => setReady(true), 800);
    return () => clearTimeout(id);
  }, []);

  return ready ? <>{children}</> : null;
}

export default function ClientWidgets() {
  return (
    <>
      {/* Critical — load immediately */}
      <ChatWidget />
      <SearchCommand />
      <ToastContainer />
      <WhatsAppButton />
      <PWAInstallPrompt />

      {/* Secondary — wait for idle */}
      <IdleMount>
        <SmartWelcome />
        <WellnessTip />
        <AchievementListener />
        <VisitTracker />
        <DesktopOnlyCursor />
      </IdleMount>
    </>
  );
}
