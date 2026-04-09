"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Question } from "@/data/questions";

interface Props {
  question: Question;
  stepIndex: number;
  totalSteps: number;
  onAnswer: (id: string) => void;
}

const bgImages: Record<string, string> = {
  sea: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80",
  desert:
    "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1920&q=80",
  mountains:
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80",
  oasis:
    "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1920&q=80",
  body: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&q=80",
  mind: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1920&q=80",
  relax:
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80",
  calm: "https://images.unsplash.com/photo-1439853949212-36089b2db9d3?w=1920&q=80",
  exploratory:
    "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1920&q=80",
  deep: "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=1920&q=80",
};

export default function QuestionStep({
  question,
  stepIndex,
  totalSteps,
  onAnswer,
}: Props) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const activeBg = hovered || selected;

  function handleSelect(id: string) {
    if (selected) return;
    setSelected(id);
    setTimeout(() => onAnswer(id), 600);
  }

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Dynamic background */}
      <AnimatePresence mode="sync">
        {activeBg && bgImages[activeBg] ? (
          <motion.div
            key={activeBg}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${bgImages[activeBg]}')` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        ) : (
          <motion.div
            key="default-bg"
            className="absolute inset-0 bg-gradient-to-br from-[#0a1118] to-[#141e2a]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/65 pointer-events-none" />

      <div className="relative z-10 w-full max-w-xl px-6 flex flex-col items-center gap-6 md:gap-10">
        {/* Progress */}
        <div className="flex items-center gap-3" dir="rtl">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <motion.div
              key={i}
              className="h-[3px] rounded-full"
              animate={{
                width: i < stepIndex ? 28 : i === stepIndex ? 44 : 14,
                backgroundColor:
                  i < stepIndex
                    ? "#91b149"
                    : i === stepIndex
                      ? "#91b149"
                      : "rgba(255,255,255,0.15)",
              }}
              transition={{ duration: 0.4 }}
            />
          ))}
          <span className="text-white/30 text-xs tracking-widest mr-2">
            {stepIndex + 1}/{totalSteps}
          </span>
        </div>

        {/* Question */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7 }}
          className="font-display text-2xl sm:text-3xl md:text-5xl font-bold text-white text-center leading-snug"
        >
          {question.text}
        </motion.h2>

        {/* Options */}
        <div
          className={`w-full grid gap-3 ${
            question.options.length === 4
              ? "grid-cols-2"
              : "grid-cols-1 sm:grid-cols-3"
          }`}
          dir="rtl"
        >
          {question.options.map((opt, i) => {
            const isSelected = selected === opt.id;
            const isHovered = hovered === opt.id;

            return (
              <motion.button
                key={opt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.08, duration: 0.5 }}
                onClick={() => handleSelect(opt.id)}
                onMouseEnter={() => !selected && setHovered(opt.id)}
                onMouseLeave={() => setHovered(null)}
                disabled={!!selected}
                className={`
                  relative py-4 px-5 md:py-5 md:px-6 rounded-2xl border text-base md:text-lg font-semibold
                  transition-all duration-300
                  ${
                    isSelected
                      ? "bg-[#91b149]/90 border-[#91b149] text-[#0a0f14]"
                      : isHovered
                        ? "bg-white/12 border-white/40 text-white"
                        : "bg-white/[0.04] border-white/15 text-white/75"
                  }
                `}
                whileHover={!selected ? { scale: 1.03 } : undefined}
                whileTap={!selected ? { scale: 0.97 } : undefined}
              >
                {opt.label}
                {isSelected && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl border-2 border-[#91b149]/60"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
