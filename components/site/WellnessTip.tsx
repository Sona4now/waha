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
          className="fixed top-28 left-1/2 -translate-x-1/2 z-[128] no-print"
          role="status"
          aria-live="polite"
          dir="rtl"
        >
          <div className="relative flex items-center gap-2.5 pr-4 pl-2 py-2 bg-[#1d5770]/95 backdrop-blur-md text-white rounded-full shadow-[0_8px_30px_-8px_rgba(29,87,112,0.55)] border border-white/10 max-w-[92vw]">
            {/* Progress bar — thin ring under the pill */}
            <div className="absolute bottom-0 left-4 right-4 h-[2px] overflow-hidden rounded-full">
              <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: AUTO_DISMISS_MS / 1000, ease: "linear" }}
                className="h-full bg-[#91b149] origin-right"
              />
            </div>

            <span className="text-base leading-none flex-shrink-0" aria-hidden>
              {tip.icon}
            </span>

            <p className="text-xs font-medium leading-none flex-1 line-clamp-1 whitespace-nowrap overflow-hidden text-ellipsis max-w-[55vw] md:max-w-sm">
              {tip.text}
            </p>

            {tip.destId && (
              <Link
                href={`/destination/${tip.destId}`}
                onClick={handleDismiss}
                className="flex-shrink-0 text-[10px] font-bold text-[#91b149] hover:text-white hover:bg-[#91b149]/20 rounded-full px-2.5 py-1 transition-colors no-underline leading-none"
              >
                اكتشف ←
              </Link>
            )}

            <button
              onClick={handleDismiss}
              className="flex-shrink-0 w-6 h-6 rounded-full hover:bg-white/15 text-white/60 hover:text-white flex items-center justify-center transition-colors text-xs leading-none"
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
