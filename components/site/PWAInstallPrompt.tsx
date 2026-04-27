"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useTranslations } from "@/components/site/LocaleProvider";

const STORAGE_KEY = "waaha_pwa_dismissed_until";
const HIDDEN_PATHS = ["/", "/gate", "/therapy-room"];

/**
 * How long to suppress the prompt after the user closes it.
 *
 * 30 days is a sweet spot for "don't pester them" without forgetting them
 * forever — most users who said no once will say no again the same week,
 * but might warm up to the idea after a month of repeat visits.
 */
const DISMISS_MS = 30 * 24 * 60 * 60 * 1000;

/**
 * Type for the `beforeinstallprompt` event Chrome/Edge fire when the PWA is
 * installable. The DOM lib doesn't include this since it's still a draft.
 */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/**
 * Custom "Add to Home Screen" prompt.
 *
 * Browsers fire `beforeinstallprompt` automatically if the site meets PWA
 * criteria (manifest + service worker + HTTPS). The default browser prompt
 * is unobtrusive to a fault — most users miss it. This card surfaces the
 * install option clearly after the user has spent ≥45 seconds on the site
 * (so we don't shove it in their face on first paint).
 */
export default function PWAInstallPrompt() {
  const { locale } = useTranslations();
  const pathname = usePathname();
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (HIDDEN_PATHS.includes(pathname)) return;

    // Already dismissed within the last DISMISS_MS — skip.
    try {
      const until = parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10);
      if (!Number.isNaN(until) && until > Date.now()) return;
    } catch {}

    // Already installed (running as PWA)
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // iOS Safari uses navigator.standalone
      (window.navigator as unknown as { standalone?: boolean }).standalone ===
        true;
    if (isStandalone) return;

    function handleBeforeInstall(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Wait 45s so the prompt isn't the user's first impression.
      setTimeout(() => setVisible(true), 45000);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    return () =>
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
  }, [pathname]);

  function handleDismiss() {
    setVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, String(Date.now() + DISMISS_MS));
    } catch {}
  }

  async function handleInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setVisible(false);
      setDeferredPrompt(null);
    } else {
      handleDismiss();
    }
  }

  if (HIDDEN_PATHS.includes(pathname)) return null;

  return (
    <AnimatePresence>
      {visible && deferredPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ type: "spring", stiffness: 280, damping: 26 }}
          className="fixed bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-[88] no-print"
          dir={locale === "en" ? "ltr" : "rtl"}
          role="dialog"
        >
          <div className="bg-gradient-to-br from-[#12394d] to-[#1d5770] dark:from-[#0a151f] dark:to-[#162033] text-white rounded-2xl shadow-[0_20px_60px_-12px_rgba(0,0,0,0.5)] border border-white/10 p-5">
            <div className="flex items-start gap-3 mb-4">
              <span className="text-3xl flex-shrink-0">📱</span>
              <div className="flex-1">
                <h3 className="font-display font-bold text-base mb-1">
                  {locale === "en"
                    ? "Add WAHA to your home screen"
                    : "ضيف واحة على شاشتك الرئيسية"}
                </h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  {locale === "en"
                    ? "Open the app in one second — works even on poor connections."
                    : "افتح التطبيق في ثانية واحدة، شغّال حتى لو الإنترنت ضعيف."}
                </p>
              </div>
              <button
                onClick={handleDismiss}
                className="flex-shrink-0 w-7 h-7 rounded-full hover:bg-white/15 text-white/60 hover:text-white flex items-center justify-center text-sm transition-colors"
                aria-label={locale === "en" ? "Close" : "إغلاق"}
              >
                ✕
              </button>
            </div>
            <button
              onClick={handleInstall}
              className="w-full py-2.5 bg-[#91b149] hover:bg-[#a3c45a] text-[#0a0f14] font-bold text-sm rounded-full transition-colors"
            >
              {locale === "en" ? "Add to home screen" : "أضف للشاشة الرئيسية"}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
