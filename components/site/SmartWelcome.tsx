"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { DESTINATIONS } from "@/data/siteData";

interface VisitData {
  count: number;
  lastVisit: number;
  recommendationId?: string;
}

const STORAGE_KEY = "waaha_visits";
const DISMISS_KEY = "waaha_welcome_dismissed";

export default function SmartWelcome() {
  const [show, setShow] = useState(false);
  const [visitData, setVisitData] = useState<VisitData | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if dismissed in this session
    const dismissed = sessionStorage.getItem(DISMISS_KEY);
    if (dismissed) return;

    // Load visit data
    let data: VisitData = { count: 0, lastVisit: 0 };
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) data = JSON.parse(saved);
    } catch {}

    // Load recommendation if exists
    try {
      const rec = localStorage.getItem("waaha_recommendation");
      if (rec) {
        const parsed = JSON.parse(rec);
        data.recommendationId = parsed.destinationId;
      }
    } catch {}

    // Only show for return visitors (2+ visits) and if there's a recommendation
    const now = Date.now();
    const isReturn = data.count >= 1;
    const hasRecentActivity =
      data.lastVisit && now - data.lastVisit < 30 * 24 * 60 * 60 * 1000;

    // Update counter
    data.count += 1;
    data.lastVisit = now;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

    // Show welcome for returning users with recommendation
    if (isReturn && hasRecentActivity && data.recommendationId) {
      setVisitData(data);
      setTimeout(() => setShow(true), 1500);
    }
  }, []);

  function handleDismiss() {
    setShow(false);
    sessionStorage.setItem(DISMISS_KEY, "1");
  }

  if (!visitData?.recommendationId) return null;

  const dest = DESTINATIONS.find((d) => d.id === visitData.recommendationId);
  if (!dest) return null;

  const visitLabel =
    visitData.count === 2
      ? "أهلاً بك مرة تانية 👋"
      : visitData.count === 3
        ? "سعداء برجوعك 🌿"
        : visitData.count < 10
          ? "مرحباً بك من جديد ✨"
          : "زائر مُخلص 💚";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 260, damping: 25 }}
          className="fixed bottom-20 md:bottom-6 right-6 md:right-auto md:left-24 z-[80] w-[calc(100%-3rem)] md:w-[360px]"
        >
          <div className="relative bg-white dark:bg-[#162033] rounded-2xl shadow-[0_20px_60px_-12px_rgba(29,87,112,0.35)] border border-[#d0dde4] dark:border-[#1e3a5f] overflow-hidden">
            {/* Close */}
            <button
              onClick={handleDismiss}
              className="absolute top-2 left-2 w-7 h-7 rounded-full hover:bg-[#f5f8fa] dark:hover:bg-[#0a151f] text-[#7b7c7d] flex items-center justify-center transition-colors z-10"
              aria-label="إغلاق"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Accent bar */}
            <div className="h-1 bg-gradient-to-l from-[#91b149] via-[#1d5770] to-[#91b149]" />

            <div className="p-5">
              {/* Header */}
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-[#f5f8fa] dark:bg-[#0a151f] flex items-center justify-center text-2xl flex-shrink-0">
                  🌿
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-[#91b149] font-bold mb-0.5">
                    {visitLabel}
                  </div>
                  <p className="text-sm font-bold text-[#12394d] dark:text-white leading-snug">
                    وجهتك اللي اخترتها هنا:
                  </p>
                </div>
              </div>

              {/* Destination card */}
              <Link
                href={`/destination/${dest.id}`}
                className="block relative rounded-xl overflow-hidden group mb-3 no-underline"
                onClick={handleDismiss}
              >
                <div
                  className="h-24 bg-cover bg-center"
                  style={{ backgroundImage: `url('${dest.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-2 right-3">
                  <div className="text-white font-bold font-display text-base">
                    {dest.name}
                  </div>
                  <div className="text-white/70 text-[10px]">
                    {dest.environment}
                  </div>
                </div>
                <div className="absolute top-2 left-2 bg-white/90 rounded-full px-2 py-0.5 text-[9px] font-bold text-[#1d5770]">
                  {dest.envIcon} المقترحة
                </div>
              </Link>

              {/* Action */}
              <Link
                href={`/destination/${dest.id}`}
                onClick={handleDismiss}
                className="block w-full text-center py-2.5 bg-gradient-to-l from-[#91b149] to-[#6a8435] text-white font-bold text-xs rounded-full no-underline hover:shadow-lg transition-all"
              >
                متابعة استكشاف {dest.name} →
              </Link>

              {/* Dismiss link */}
              <button
                onClick={handleDismiss}
                className="w-full mt-2 text-[10px] text-[#7b7c7d] hover:text-[#1d5770] transition-colors"
              >
                استكشف وجهات أخرى
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
