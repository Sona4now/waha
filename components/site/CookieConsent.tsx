"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useTranslations } from "@/components/site/LocaleProvider";

const STORAGE_KEY = "waaha_cookie_consent";
const HIDDEN_PATHS = ["/", "/gate", "/therapy-room", "/map"];

/**
 * Cookie / data-use consent banner with granular categories.
 *
 * Three categories the user can opt in/out of:
 *   - essential: required for the site to work (auth, comparison tray,
 *     theme). Always on, can't be toggled.
 *   - analytics: Vercel Analytics + Speed Insights. Aggregate-only, no
 *     personal data, but the user should still be able to refuse.
 *   - features: localStorage-based UX features (saved profile in the
 *     lead form, blog reading progress, recommendation memory). Refusing
 *     this disables the personalised features but the site still works.
 *
 * The choice is persisted as JSON so we (and the rest of the codebase)
 * can read what was accepted later — see `getConsent()` below.
 */

export interface ConsentChoice {
  essential: true;
  analytics: boolean;
  features: boolean;
  acceptedAt: number;
}

const DEFAULT_CHOICE: ConsentChoice = {
  essential: true,
  analytics: true,
  features: true,
  acceptedAt: 0,
};

/** Read consent state from localStorage. SSR-safe. */
export function getConsent(): ConsentChoice {
  if (typeof window === "undefined") return DEFAULT_CHOICE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CHOICE;
    const parsed = JSON.parse(raw);
    if (typeof parsed === "object" && parsed !== null) {
      return {
        essential: true,
        analytics: parsed.analytics !== false,
        features: parsed.features !== false,
        acceptedAt: parsed.acceptedAt || parsed.at || 0,
      };
    }
  } catch {}
  return DEFAULT_CHOICE;
}

export default function CookieConsent() {
  const pathname = usePathname();
  const { locale } = useTranslations();
  const [visible, setVisible] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [features, setFeatures] = useState(true);

  useEffect(() => {
    if (HIDDEN_PATHS.includes(pathname)) return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) setVisible(true);
    } catch {
      /* localStorage disabled — no banner */
    }
  }, [pathname]);

  function persist(choice: { analytics: boolean; features: boolean }) {
    const payload: ConsentChoice = {
      essential: true,
      analytics: choice.analytics,
      features: choice.features,
      acceptedAt: Date.now(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {}
    setVisible(false);
  }

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
          dir={locale === "en" ? "ltr" : "rtl"}
          role="dialog"
          aria-label={locale === "en" ? "Cookie consent" : "موافقة استخدام الكوكيز"}
        >
          <div className="bg-[#12394d] dark:bg-[#162033] text-white rounded-2xl shadow-[0_20px_60px_-12px_rgba(0,0,0,0.5)] border border-white/10 p-5">
            <div className="flex items-start gap-3 mb-4">
              <span className="text-2xl" aria-hidden>
                🍪
              </span>
              <div className="flex-1">
                <h3 className="font-display font-bold text-base mb-1.5">
                  {locale === "en" ? "We use basic data" : "نستخدم بيانات بسيطة"}
                </h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  {locale === "en"
                    ? "Our site uses Vercel Analytics and localStorage to improve your experience. No ad trackers."
                    : "موقعنا بيستخدم تحليلات Vercel و localStorage لتحسين تجربتك. مفيش trackers إعلانية."}{" "}
                  <Link
                    href="/privacy"
                    className="text-[#91b149] underline hover:text-[#a3c45a]"
                  >
                    {locale === "en" ? "Read the policy" : "اقرأ السياسة"}
                  </Link>
                </p>
              </div>
            </div>

            <AnimatePresence initial={false}>
              {showCustomize && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-3 mb-4 pt-3 border-t border-white/10">
                    <ConsentRow
                      label={locale === "en" ? "Essential" : "ضرورية"}
                      hint={
                        locale === "en"
                          ? "Sign-in, comparison, theme — can't be turned off"
                          : "تسجيل الدخول، المقارنة، الـ theme — مش ممكن تتعطل"
                      }
                      alwaysLabel={locale === "en" ? "(always)" : "(دائماً)"}
                      checked
                      disabled
                      onChange={() => {}}
                    />
                    <ConsentRow
                      label={locale === "en" ? "Analytics" : "تحليلات"}
                      hint={
                        locale === "en"
                          ? "Vercel Analytics — counts only, no personal data"
                          : "Vercel Analytics — أعداد فقط، بدون بيانات شخصية"
                      }
                      alwaysLabel={locale === "en" ? "(always)" : "(دائماً)"}
                      checked={analytics}
                      onChange={(v) => setAnalytics(v)}
                    />
                    <ConsentRow
                      label={locale === "en" ? "Personal features" : "مميزات شخصية"}
                      hint={
                        locale === "en"
                          ? "Save your preferences, reading progress, booking form"
                          : "حفظ تفضيلاتك، تقدم القراءة، فورم الحجز"
                      }
                      alwaysLabel={locale === "en" ? "(always)" : "(دائماً)"}
                      checked={features}
                      onChange={(v) => setFeatures(v)}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-col gap-2">
              <button
                onClick={() =>
                  persist({
                    analytics: showCustomize ? analytics : true,
                    features: showCustomize ? features : true,
                  })
                }
                className="w-full py-2.5 bg-[#91b149] hover:bg-[#a3c45a] text-[#0a0f14] font-bold text-sm rounded-full transition-colors"
              >
                {showCustomize
                  ? locale === "en"
                    ? "Save my preferences"
                    : "احفظ تفضيلاتي"
                  : locale === "en"
                    ? "OK, continue"
                    : "تمام، استمرّ"}
              </button>
              {!showCustomize ? (
                <button
                  onClick={() => setShowCustomize(true)}
                  className="text-[11px] text-white/60 hover:text-white underline-offset-2 hover:underline"
                >
                  {locale === "en" ? "Customize preferences" : "اضبط التفضيلات"}
                </button>
              ) : (
                <button
                  onClick={() =>
                    persist({ analytics: false, features: false })
                  }
                  className="text-[11px] text-white/60 hover:text-white underline-offset-2 hover:underline"
                >
                  {locale === "en"
                    ? "Reject all non-essential"
                    : "ارفض كل ما هو غير ضروري"}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ConsentRow({
  label,
  hint,
  checked,
  disabled,
  onChange,
  alwaysLabel,
}: {
  label: string;
  hint: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (v: boolean) => void;
  alwaysLabel?: string;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`flex-shrink-0 w-9 h-5 rounded-full transition-colors relative ${
          checked
            ? disabled
              ? "bg-white/20"
              : "bg-[#91b149]"
            : "bg-white/15"
        } ${disabled ? "cursor-not-allowed" : ""}`}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
            checked ? "right-0.5" : "right-[18px]"
          }`}
        />
      </button>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-bold text-white">
          {label}
          {disabled && (
            <span className="ml-1 text-[10px] text-white/40">{alwaysLabel ?? "(always)"}</span>
          )}
        </div>
        <div className="text-[10px] text-white/50 leading-relaxed">
          {hint}
        </div>
      </div>
    </label>
  );
}
