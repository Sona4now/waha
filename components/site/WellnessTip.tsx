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
    text: "التعرض للشمس لمدة 10-20 دقيقة يومياً بيساعد جسمك ينتج فيتامين D3",
    source: "دراسة أكاديمية",
    destId: "safaga",
  },
  {
    icon: "🧂",
    text: "الطفو في المياه الغنية بالملح بيقلل الضغط على المفاصل بنسبة 90%",
    source: "علاج Halotherapy",
    destId: "siwa",
  },
  {
    icon: "🏊",
    text: "السباحة في مياه البحر المالحة بتحسّن البشرة وبتخفف أعراض الصدفية",
    source: "دراسة طبية",
    destId: "safaga",
  },
  {
    icon: "🧘",
    text: "قضاء وقت في الصحراء بيحسّن التركيز الذهني ويقلل التوتر المزمن",
    source: "Environmental Psychology",
    destId: "bahariya",
  },
  {
    icon: "💧",
    text: "المياه الكبريتية الدافئة بتنشّط الدورة الدموية وتقلل آلام المفاصل",
    source: "علاج البلنيولوجيا",
    destId: "sinai",
  },
  {
    icon: "🌅",
    text: "مشاهدة شروق الشمس بتحسّن إيقاع النوم وتقلل الاكتئاب الموسمي",
    source: "علم الأحياء الزمني",
  },
  {
    icon: "🌴",
    text: "الأعشاب الصحراوية زي الشيح واليانسون البري بتساعد على الاسترخاء",
    source: "الطب التقليدي",
    destId: "siwa",
  },
  {
    icon: "🔥",
    text: "الدفن في الرمال الساخنة بيخفف آلام الروماتيزم بنسبة تحسّن 70%",
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
const AUTO_DISMISS_MS = 6000;
const HIDDEN_PATHS = ["/", "/gate", "/therapy-room"];

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

  // Auto-dismiss after showing
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
          initial={{ opacity: 0, y: -30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-[128] w-[calc(100%-2rem)] max-w-lg no-print"
        >
          <div className="relative flex items-center gap-3 px-4 py-3 bg-[#1d5770] text-white rounded-2xl shadow-[0_12px_40px_-8px_rgba(29,87,112,0.5)] border border-white/10">
            {/* Progress bar (auto-dismiss indicator) */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden rounded-b-2xl">
              <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: AUTO_DISMISS_MS / 1000, ease: "linear" }}
                className="h-full bg-[#91b149] origin-right"
              />
            </div>

            {/* Icon */}
            <span className="text-xl flex-shrink-0">{tip.icon}</span>

            {/* Text */}
            <p className="text-sm font-medium leading-snug flex-1 line-clamp-2">
              {tip.text}
            </p>

            {/* CTA link */}
            {tip.destId && (
              <Link
                href={`/destination/${tip.destId}`}
                onClick={handleDismiss}
                className="flex-shrink-0 text-[10px] font-bold text-[#91b149] hover:text-white border border-[#91b149]/40 rounded-full px-3 py-1 transition-colors no-underline"
              >
                اكتشف
              </Link>
            )}

            {/* Close */}
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 w-6 h-6 rounded-full hover:bg-white/15 text-white/60 hover:text-white flex items-center justify-center transition-colors"
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
