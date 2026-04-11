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
    text: "التعرض للشمس لمدة 10-20 دقيقة يومياً بيساعد جسمك ينتج فيتامين D3 اللي بينظم المناعة",
    source: "دراسة أكاديمية",
    destId: "safaga",
  },
  {
    icon: "🧂",
    text: "الطفو في المياه الغنية بالملح بيقلل الضغط على المفاصل بنسبة تصل لـ 90%",
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
    text: "مشاهدة شروق الشمس بتحسّن إيقاع النوم وتقلل أعراض الاكتئاب الموسمي",
    source: "علم الأحياء الزمني",
  },
  {
    icon: "🌴",
    text: "الأعشاب الصحراوية زي الشيح واليانسون البري بتساعد على الهضم والاسترخاء",
    source: "الطب التقليدي",
    destId: "siwa",
  },
  {
    icon: "🔥",
    text: "الدفن في الرمال الساخنة لمدة 15-30 دقيقة بيخفف آلام الروماتيزم بنسبة تحسّن 70%",
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
const DELAY_MS = 20000; // Show after 20 seconds
const HIDDEN_PATHS = ["/", "/gate"];

function getTipForToday(): Tip {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  return TIPS[dayOfYear % TIPS.length];
}

export default function WellnessTip() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const [tip, setTip] = useState<Tip | null>(null);

  useEffect(() => {
    if (HIDDEN_PATHS.includes(pathname)) return;

    // Check if dismissed today
    const today = new Date().toDateString();
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed === today) return;

    // Load tip
    setTip(getTipForToday());

    // Show after delay
    const timer = setTimeout(() => setShow(true), DELAY_MS);
    return () => clearTimeout(timer);
  }, [pathname]);

  function handleDismiss() {
    setShow(false);
    localStorage.setItem(STORAGE_KEY, new Date().toDateString());
  }

  if (!tip || HIDDEN_PATHS.includes(pathname)) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 260, damping: 25 }}
          className="fixed bottom-20 md:bottom-8 right-6 z-[85] w-[calc(100%-3rem)] md:w-[340px] no-print"
        >
          <div className="relative bg-gradient-to-br from-white to-[#f5f8fa] dark:from-[#162033] dark:to-[#0a151f] rounded-2xl shadow-[0_20px_60px_-12px_rgba(29,87,112,0.35)] border border-[#d0dde4] dark:border-[#1e3a5f] overflow-hidden">
            {/* Accent bar */}
            <div className="h-1 bg-gradient-to-l from-[#91b149] via-[#6a8435] to-[#91b149]" />

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

            <div className="p-5 pl-10">
              {/* Header */}
              <div className="flex items-center gap-2 mb-2">
                <div className="text-[10px] uppercase tracking-wider text-[#91b149] font-bold">
                  نصيحة اليوم
                </div>
                <div className="flex-1 h-px bg-[#d0dde4] dark:bg-[#1e3a5f]" />
              </div>

              {/* Tip */}
              <div className="flex items-start gap-3 mb-3">
                <div className="text-3xl flex-shrink-0">{tip.icon}</div>
                <p className="text-sm text-[#12394d] dark:text-white leading-relaxed font-medium">
                  {tip.text}
                </p>
              </div>

              {/* Source */}
              <p className="text-[10px] text-[#7b7c7d] dark:text-white/40 italic mb-3">
                — {tip.source}
              </p>

              {/* CTA */}
              {tip.destId && (
                <Link
                  href={`/destination/${tip.destId}`}
                  onClick={handleDismiss}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1d5770] dark:text-[#91b149] hover:gap-2 transition-all no-underline"
                >
                  اكتشف الوجهة المناسبة
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15 19l-7-7 7-7" />
                  </svg>
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
