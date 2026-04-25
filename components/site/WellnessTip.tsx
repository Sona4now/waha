"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

interface Tip {
  icon: string;
  text: string;
  source: string;
  destId?: string;
}

const TIPS: Tip[] = [
  {
    icon: "🌿",
    text: "15 دقيقة مشي في الطبيعة بتخفض هرمون الكورتيزول بنسبة 20%",
    source: "دراسة من جامعة ستانفورد",
  },
  {
    icon: "☀️",
    text: "التعرض للشمس 10-20 دقيقة يومياً بينتج فيتامين D3",
    source: "دراسة أكاديمية",
    destId: "safaga",
  },
  {
    icon: "🧂",
    text: "الطفو في المياه المالحة بيقلل الضغط على المفاصل 90%",
    source: "علاج Halotherapy",
    destId: "siwa",
  },
  {
    icon: "🏊",
    text: "السباحة في البحر المالح بتحسّن البشرة وتخفف الصدفية",
    source: "دراسة طبية",
    destId: "safaga",
  },
  {
    icon: "🧘",
    text: "وقت في الصحراء بيحسّن التركيز ويقلل التوتر المزمن",
    source: "Environmental Psychology",
    destId: "bahariya",
  },
  {
    icon: "💧",
    text: "المياه الكبريتية الدافئة بتنشّط الدورة الدموية",
    source: "علاج البلنيولوجيا",
    destId: "sinai",
  },
  {
    icon: "🌅",
    text: "مشاهدة الشروق بتحسّن إيقاع النوم وتقلل الاكتئاب",
    source: "علم الأحياء الزمني",
  },
  {
    icon: "🌴",
    text: "الأعشاب الصحراوية زي الشيح بتساعد على الاسترخاء",
    source: "الطب التقليدي",
    destId: "siwa",
  },
  {
    icon: "🔥",
    text: "الدفن في الرمال الساخنة بيخفف الروماتيزم 70%",
    source: "دراسات ميدانية",
    destId: "safaga",
  },
  {
    icon: "🏜️",
    text: "الهواء الجاف في الصحراء بيساعد مرضى الحساسية والربو",
    source: "Climatotherapy",
    destId: "fayoum",
  },
];

const STORAGE_KEY = "waaha_tip_dismissed";
const DELAY_MS = 20000;
const AUTO_DISMISS_MS = 5000;
const HIDDEN_PATHS = ["/", "/gate", "/therapy-room", "/map"];

function getTipForToday(): Tip {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24),
  );
  return TIPS[dayOfYear % TIPS.length];
}

export default function WellnessTip() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const [tip, setTip] = useState<Tip | null>(null);

  useEffect(() => {
    if (HIDDEN_PATHS.includes(pathname)) return;

    const today = new Date().toDateString();
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed === today) return;

    setTip(getTipForToday());

    const showTimer = setTimeout(() => setShow(true), DELAY_MS);
    return () => clearTimeout(showTimer);
  }, [pathname]);

  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(() => handleDismiss(), AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [show]);

  function handleDismiss() {
    setShow(false);
    localStorage.setItem(STORAGE_KEY, new Date().toDateString());
  }

  if (!tip || HIDDEN_PATHS.includes(pathname)) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="fixed left-3 right-3 md:left-1/2 md:right-auto md:-translate-x-1/2 z-[128] no-print"
          // top-28 was a fixed value that drifted under the navbar on iOS Safari
          // because of the dynamic-viewport quirk. Use a safe-area-aware offset
          // so the tip always sits cleanly below the navbar (72px).
          style={{ top: "calc(env(safe-area-inset-top, 0px) + 88px)" }}
          role="status"
          aria-live="polite"
          dir="rtl"
        >
          {/*
            Card layout (NOT a pill): the previous design tried to cram the
            whole tip into a single line with text-ellipsis, which on mobile
            cut tips like "15 دقيقة مشي في الطبيعة بتخفض هرمون الكورتيزول
            بنسبة 20%" down to "15 دقيقة مشي في..." — making the feature
            useless. Now the icon + text get a 2-row layout on mobile and the
            text breathes naturally.
          */}
          <div className="relative flex items-start gap-3 px-4 py-3 bg-[#1d5770]/95 backdrop-blur-md text-white rounded-2xl shadow-[0_8px_30px_-8px_rgba(29,87,112,0.55)] border border-white/10 max-w-md md:max-w-lg mx-auto">
            {/* Progress bar — thin line under the card */}
            <div className="absolute bottom-0 left-4 right-4 h-[2px] overflow-hidden rounded-full">
              <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: AUTO_DISMISS_MS / 1000, ease: "linear" }}
                className="h-full bg-[#91b149] origin-right"
              />
            </div>

            <span
              className="text-2xl leading-none flex-shrink-0 mt-0.5"
              aria-hidden
            >
              {tip.icon}
            </span>

            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium leading-relaxed text-white">
                {tip.text}
              </p>
              <div className="flex items-center gap-3 mt-2">
                {tip.destId && (
                  <Link
                    href={`/destination/${tip.destId}`}
                    onClick={handleDismiss}
                    className="text-[11px] font-bold text-[#91b149] hover:text-white hover:bg-[#91b149]/15 rounded-full px-2.5 py-1 transition-colors no-underline"
                  >
                    اكتشف ←
                  </Link>
                )}
                <span className="text-[10px] text-white/45 truncate">
                  {tip.source}
                </span>
              </div>
            </div>

            <button
              onClick={handleDismiss}
              className="flex-shrink-0 w-7 h-7 rounded-full hover:bg-white/15 text-white/60 hover:text-white flex items-center justify-center transition-colors text-sm leading-none -mt-0.5"
              aria-label="إغلاق"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
