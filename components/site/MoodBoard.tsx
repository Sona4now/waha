"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "@/components/site/LocaleProvider";

interface Mood {
  id: string;
  labelAr: string;
  labelEn: string;
  emoji: string;
  descriptionAr: string;
  descriptionEn: string;
  destId: string;
  color: string;
}

const MOODS: Mood[] = [
  {
    id: "calm",
    labelAr: "هادئ",
    labelEn: "Calm",
    emoji: "😌",
    descriptionAr: "بحتاج استرخاء وسكينة",
    descriptionEn: "I need relaxation and peace",
    destId: "fayoum",
    color: "#0d9488",
  },
  {
    id: "stressed",
    labelAr: "متوتر",
    labelEn: "Stressed",
    emoji: "😰",
    descriptionAr: "بحتاج هدوء وصفاء ذهن",
    descriptionEn: "I need quiet and clarity",
    destId: "siwa",
    color: "#7c3aed",
  },
  {
    id: "tired",
    labelAr: "مُتعب",
    labelEn: "Tired",
    emoji: "💪",
    descriptionAr: "بحتاج تجدد نشاط",
    descriptionEn: "I need a refresh of energy",
    destId: "safaga",
    color: "#0284c7",
  },
  {
    id: "sick",
    labelAr: "عياّن",
    labelEn: "Unwell",
    emoji: "🤒",
    descriptionAr: "بحتاج علاج طبيعي",
    descriptionEn: "I need natural therapy",
    destId: "safaga",
    color: "#dc2626",
  },
  {
    id: "meditative",
    labelAr: "متأمل",
    labelEn: "Meditative",
    emoji: "🧘",
    descriptionAr: "بحتاج صمت وتأمل",
    descriptionEn: "I need silence and reflection",
    destId: "bahariya",
    color: "#b45309",
  },
  {
    id: "energetic",
    labelAr: "نشيط",
    labelEn: "Energetic",
    emoji: "⚡",
    descriptionAr: "بحتاج مغامرة",
    descriptionEn: "I need an adventure",
    destId: "sinai",
    color: "#ea580c",
  },
];

export default function MoodBoard() {
  const router = useRouter();
  const { locale } = useTranslations();
  const [selected, setSelected] = useState<Mood | null>(null);

  function handleSelect(mood: Mood) {
    setSelected(mood);
    setTimeout(() => {
      router.push(`/destination/${mood.destId}`);
    }, 800);
  }

  return (
    <div className="bg-gradient-to-br from-white to-[#f5f8fa] dark:from-[#162033] dark:to-[#0a151f] rounded-3xl border border-[#d0dde4] dark:border-[#1e3a5f] p-6 md:p-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[#91b149] font-bold mb-3">
          <span className="w-6 h-px bg-[#91b149]" />
          Mood Board
          <span className="w-6 h-px bg-[#91b149]" />
        </div>
        <h3 className="text-2xl md:text-3xl font-bold font-display text-[#12394d] dark:text-white mb-2">
          {locale === "en" ? "How are you feeling today?" : "إنت حاسس إزاي النهاردة؟"}
        </h3>
        <p className="text-sm text-[#7b7c7d] max-w-md mx-auto">
          {locale === "en"
            ? "Pick your mood and we'll suggest the right destination"
            : "اختار مزاجك وخلينا نرشحلك الوجهة المناسبة"}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {MOODS.map((mood, i) => {
          const isSelected = selected?.id === mood.id;
          return (
            <motion.button
              key={mood.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelect(mood)}
              disabled={selected !== null}
              className={`group relative p-6 rounded-2xl transition-all duration-500 overflow-hidden ${
                isSelected
                  ? "ring-4 ring-[#91b149] scale-105"
                  : "bg-white dark:bg-[#162033] border border-[#d0dde4] dark:border-[#1e3a5f] hover:shadow-xl"
              }`}
              style={{
                background: isSelected
                  ? `linear-gradient(135deg, ${mood.color}20, ${mood.color}05)`
                  : undefined,
              }}
            >
              {/* Background blob */}
              <div
                className="absolute -top-10 -left-10 w-32 h-32 rounded-full opacity-10 blur-2xl transition-opacity duration-500 group-hover:opacity-30"
                style={{ backgroundColor: mood.color }}
              />

              <div className="relative">
                <motion.div
                  className="text-5xl mb-3 inline-block"
                  animate={
                    isSelected
                      ? { scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] }
                      : {}
                  }
                  transition={{ duration: 0.6 }}
                >
                  {mood.emoji}
                </motion.div>
                <div
                  className="font-bold font-display text-lg mb-1 transition-colors"
                  style={{ color: isSelected ? mood.color : undefined }}
                >
                  {locale === "en" ? mood.labelEn : mood.labelAr}
                </div>
                <p className="text-[11px] text-[#7b7c7d] dark:text-white/50 leading-relaxed">
                  {locale === "en" ? mood.descriptionEn : mood.descriptionAr}
                </p>
              </div>

              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute inset-x-0 bottom-2 text-[10px] font-bold"
                    style={{ color: mood.color }}
                  >
                    {locale === "en" ? "Routing..." : "جاري التوجيه..."}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
