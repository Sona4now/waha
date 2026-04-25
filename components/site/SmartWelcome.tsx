"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { DESTINATIONS } from "@/data/siteData";

interface VisitData {
  count: number;
  lastVisit: number;
  recommendationId?: string;
}

const STORAGE_KEY = "waaha_visits";
const DISMISS_KEY = "waaha_welcome_dismissed";
const AUTO_DISMISS_MS = 6000;
const HIDDEN_PATHS = ["/", "/gate", "/therapy-room", "/map"];

export default function SmartWelcome() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const [visitData, setVisitData] = useState<VisitData | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (HIDDEN_PATHS.includes(pathname)) return;

    const dismissed = sessionStorage.getItem(DISMISS_KEY);
    if (dismissed) return;

    let data: VisitData = { count: 0, lastVisit: 0 };
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) data = JSON.parse(saved);
    } catch {}

    try {
      const rec = localStorage.getItem("waaha_recommendation");
      if (rec) {
        const parsed = JSON.parse(rec);
        data.recommendationId = parsed.destinationId;
      }
    } catch {}

    const now = Date.now();
    const isReturn = data.count >= 1;
    const hasRecentActivity =
      data.lastVisit && now - data.lastVisit < 30 * 24 * 60 * 60 * 1000;

    data.count += 1;
    data.lastVisit = now;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

    if (isReturn && hasRecentActivity && data.recommendationId) {
      setVisitData(data);
      setTimeout(() => setShow(true), 1500);
    }
  }, [pathname]);

  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(() => handleDismiss(), AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [show]);

  function handleDismiss() {
    setShow(false);
    sessionStorage.setItem(DISMISS_KEY, "1");
  }

  if (HIDDEN_PATHS.includes(pathname)) return null;
  if (!visitData?.recommendationId) return null;

  const dest = DESTINATIONS.find((d) => d.id === visitData.recommendationId);
  if (!dest) return null;

  const visitLabel =
    visitData.count === 2
      ? "أهلاً بعودتك 👋"
      : visitData.count === 3
        ? "سعداء برجوعك 🌿"
        : visitData.count < 10
          ? "مرحباً بك ✨"
          : "زائر مُخلص 💚";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="fixed bottom-16 md:bottom-0 left-0 right-0 z-[75] no-print"
          // The bottom-16 keeps it above the BottomNav on mobile. On iOS, also
          // respect the home-indicator safe area so the close button isn't
          // jammed against the device edge.
          style={{
            paddingBottom: "env(safe-area-inset-bottom, 0px)",
          }}
          role="status"
          aria-live="polite"
        >
          <div className="relative bg-gradient-to-l from-[#12394d] to-[#1d5770] border-t border-white/10 shadow-[0_-8px_30px_rgba(0,0,0,0.3)]">
            <div className="absolute top-0 left-0 right-0 h-[2px] overflow-hidden">
              <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: AUTO_DISMISS_MS / 1000, ease: "linear" }}
                className="h-full bg-[#91b149] origin-right"
              />
            </div>

            {/* Mobile: stacked rows so neither the visit label nor the
                destination name gets truncated. Desktop: original inline layout. */}
            <div className="max-w-3xl mx-auto flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 px-4 py-3 sm:py-2.5">
              <span className="text-[11px] font-bold text-[#91b149] flex-shrink-0">
                {visitLabel}
              </span>

              <span className="text-white/30 hidden sm:inline">|</span>

              <Link
                href={`/destination/${dest.id}`}
                onClick={handleDismiss}
                className="flex-1 text-sm font-bold text-white hover:text-[#91b149] transition-colors no-underline pr-8 sm:pr-0"
              >
                وجهتك المقترحة: {dest.name} ←
              </Link>

              <button
                onClick={handleDismiss}
                className="absolute top-2 left-2 sm:static flex-shrink-0 w-7 h-7 rounded-full hover:bg-white/10 text-white/50 hover:text-white flex items-center justify-center transition-colors"
                aria-label="إغلاق"
              >
                ✕
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
