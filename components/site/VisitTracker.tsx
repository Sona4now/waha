"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  trackAction,
  trackDestinationVisit,
  checkNewAchievements,
} from "@/lib/achievements";

const HIDDEN_PATHS = ["/gate"];

export default function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (HIDDEN_PATHS.includes(pathname)) return;

    // Track visit count once per session
    const sessionKey = "waaha_tracked_visit";
    if (!sessionStorage.getItem(sessionKey)) {
      trackAction("visitCount");
      sessionStorage.setItem(sessionKey, "1");
    }

    // Track destination visits
    if (pathname.startsWith("/destination/")) {
      const destId = pathname.split("/")[2];
      if (destId) trackDestinationVisit(destId);
    }

    // Track specific pages
    if (pathname === "/symptoms") {
      trackAction("symptomCheckerUsed");
    }

    if (pathname === "/tours") {
      // Tours tracked separately when user interacts
    }

    // Always check achievements on navigation
    checkNewAchievements();
  }, [pathname]);

  return null;
}
