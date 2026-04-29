"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { showToast } from "@/components/site/Toast";
import { useTranslations } from "@/components/site/LocaleProvider";

interface Props {
  destName: string;
  destId: string;
}

/**
 * Sticky bottom action bar — visible on scroll.
 * Ensures user always knows what to do next,
 * regardless of where they are on the page.
 */
export default function StickyBottomBar({ destName, destId }: Props) {
  const { locale } = useTranslations();
  const [visible, setVisible] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Show after user scrolls 400px (past hero)
    const onScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const id = setTimeout(() => {
      try {
        const favs: string[] = JSON.parse(
          localStorage.getItem("waaha_favorites") || "[]",
        );
        setSaved(favs.includes(destId));
      } catch {}
    }, 0);
    return () => clearTimeout(id);
  }, [destId]);

  const toggleSave = () => {
    try {
      const favs: string[] = JSON.parse(
        localStorage.getItem("waaha_favorites") || "[]",
      );
      let updated: string[];
      if (favs.includes(destId)) {
        updated = favs.filter((id) => id !== destId);
        setSaved(false);
        showToast(
          locale === "en"
            ? `Removed ${destName} from favorites`
            : `تم حذف ${destName} من المفضلة`,
          "info"
        );
      } else {
        updated = [...favs, destId];
        setSaved(true);
        showToast(
          locale === "en"
            ? `Saved ${destName} to favorites`
            : `تم حفظ ${destName} للمفضلة`,
          "success"
        );
      }
      localStorage.setItem("waaha_favorites", JSON.stringify(updated));
    } catch {}
  };

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const shareData = {
      title: locale === "en" ? `${destName} — WAHA` : `${destName} — واحة`,
      text:
        locale === "en"
          ? `Discover ${destName} — a wellness destination on WAHA`
          : `اكتشف ${destName} — وجهة استشفائية على موقع واحة`,
      url,
    };
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        /* cancelled */
      }
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url);
        showToast(locale === "en" ? "Link copied" : "تم نسخ الرابط", "success");
      } catch {}
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="fixed bottom-16 md:bottom-6 left-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-auto z-[70] no-print"
          dir={locale === "en" ? "ltr" : "rtl"}
        >
          <div className="flex items-center gap-2 bg-[#12394d]/95 dark:bg-[#0a151f]/95 backdrop-blur-xl border border-white/10 rounded-full shadow-[0_12px_40px_-8px_rgba(0,0,0,0.5)] p-2">
            {/* Save */}
            <button
              onClick={toggleSave}
              className={`flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
                saved
                  ? "bg-[#91b149] text-white"
                  : "bg-white/10 hover:bg-white/20 text-white/70"
              }`}
              aria-label={
                saved
                  ? locale === "en"
                    ? "Remove from favorites"
                    : "إزالة من المفضلة"
                  : locale === "en"
                    ? "Save to favorites"
                    : "حفظ للمفضلة"
              }
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill={saved ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="flex-shrink-0 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white/70 flex items-center justify-center transition-colors"
              aria-label={locale === "en" ? "Share" : "مشاركة"}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
            </button>

            {/* Ask AI — secondary */}
            <Link
              href="/ai-guide"
              className="px-4 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors no-underline"
            >
              <span>💬</span>
              <span className="hidden sm:inline">{locale === "en" ? "Ask AI" : "اسأل AI"}</span>
            </Link>

            {/* Plan trip — primary CTA */}
            <Link
              href="/ai-guide"
              className="px-5 h-11 rounded-full bg-gradient-to-l from-[#91b149] to-[#6a8435] text-white text-xs sm:text-sm font-bold flex items-center gap-2 no-underline shadow-[0_4px_12px_rgba(145,177,73,0.4)] hover:shadow-[0_6px_20px_rgba(145,177,73,0.6)] transition-shadow"
            >
              <span>🗺️</span>
              <span>{locale === "en" ? "Plan trip" : "اخطط الرحلة"}</span>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
