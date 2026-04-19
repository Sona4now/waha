"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

const STORAGE_KEY = "waaha_cookie_consent";
const HIDDEN_PATHS = ["/", "/gate"];

/**
 * Minimal cookie / data-use consent banner.
 * Shows once per device. Persists acceptance in localStorage.
 */
export default function CookieConsent() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (HIDDEN_PATHS.includes(pathname)) return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) setVisible(true);
    } catch {
      /* localStorage disabled — no banner */
    }
  }, [pathname]);

  const accept = () => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ accepted: true, at: Date.now() }),
      );
    } catch {}
    setVisible(false);
  };

  if (HIDDEN_PATHS.includes(pathname)) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 26 }}
          className="fixed bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-[95] no-print"
          dir="rtl"
          role="dialog"
          aria-label="موافقة استخدام الكوكيز"
        >
          <div className="bg-[#12394d] dark:bg-[#162033] text-white rounded-2xl shadow-[0_20px_60px_-12px_rgba(0,0,0,0.5)] border border-white/10 p-5">
            <div className="flex items-start gap-3 mb-4">
              <span className="text-2xl" aria-hidden>
                🍪
              </span>
              <div className="flex-1">
                <h3 className="font-display font-bold text-base mb-1.5">
                  نستخدم بيانات بسيطة
                </h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  موقعنا بيستخدم تحليلات Vercel وتخزين محلي (localStorage)
                  لتحسين تجربتك. مفيش trackers إعلانية.{" "}
                  <Link
                    href="/privacy"
                    className="text-[#91b149] underline hover:text-[#a3c45a]"
                  >
                    اقرأ السياسة
                  </Link>
                </p>
              </div>
            </div>
            <button
              onClick={accept}
              className="w-full py-2.5 bg-[#91b149] hover:bg-[#a3c45a] text-[#0a0f14] font-bold text-sm rounded-full transition-colors"
            >
              تمام، استمرّ
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
