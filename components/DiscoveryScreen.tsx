"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslations } from "@/components/site/LocaleProvider";
import { useIntroVoice } from "@/hooks/useIntroVoice";
import type { IntroVoId } from "@/lib/introAudio";

interface Props {
  onDone: (environment: string) => void;
}

const panels: {
  id: string;
  word: string;
  wordEn: string;
  voId: IntroVoId;
  image: string;
  color: string;
}[] = [
  {
    id: "sea",
    word: "البحر",
    wordEn: "The sea",
    voId: "discovery-sea",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80",
    color: "#0e7490",
  },
  {
    id: "desert",
    word: "الصحراء",
    wordEn: "The desert",
    voId: "discovery-desert",
    image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1920&q=80",
    color: "#d97706",
  },
  {
    id: "mountains",
    word: "الجبال",
    wordEn: "The mountains",
    voId: "discovery-mountains",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80",
    color: "#78716c",
  },
  {
    id: "oasis",
    word: "الواحات",
    wordEn: "The oases",
    voId: "discovery-oasis",
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1920&q=80",
    color: "#16a34a",
  },
];

export default function DiscoveryScreen({ onDone }: Props) {
  const { locale } = useTranslations();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [flash, setFlash] = useState(false);
  // Only announce the environment the user explicitly picks — not on every auto-cycle tick.
  const [voiceId, setVoiceId] = useState<IntroVoId | null>(null);
  useIntroVoice(voiceId, { delay: 200 });

  // Auto-cycle backgrounds so the user sees all options even before tapping.
  useEffect(() => {
    if (selected) return;
    const t = setInterval(() => {
      setCurrent((c) => (c + 1) % panels.length);
    }, 2600);
    return () => clearInterval(t);
  }, [selected]);

  function handleSelect(id: string) {
    if (selected) return;
    const idx = panels.findIndex((p) => p.id === id);
    setSelected(id);
    setCurrent(idx);
    setFlash(true);
    setVoiceId(panels[idx].voId);
    setTimeout(() => setFlash(false), 350);
    setTimeout(() => onDone(id), 700);
  }

  const activePanel = panels[current];

  return (
    <motion.div
      className="fixed inset-0 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background crossfade */}
      <AnimatePresence mode="sync">
        <motion.div
          key={current}
          className="absolute inset-0 bg-cover bg-center will-change-transform"
          style={{ backgroundImage: `url('${activePanel.image}')` }}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </AnimatePresence>

      {/* Selection flash */}
      <AnimatePresence>
        {flash && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ background: activePanel.color }}
            initial={{ opacity: 0.35 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          />
        )}
      </AnimatePresence>

      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/75 pointer-events-none" />

      {/* Label */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-[0.65rem] tracking-[0.35em] text-white/40 uppercase text-center"
        >
          {locale === "en" ? "Where do you find peace?" : "أين تجد راحتك؟"}
        </motion.p>
      </div>

      {/* Big word */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`word-${current}`}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <span
            className="font-display text-4xl sm:text-5xl md:text-7xl font-bold text-white/90 tracking-wide"
            style={{
              textShadow: `0 0 60px ${activePanel.color}66, 0 4px 30px rgba(0,0,0,0.7)`,
            }}
          >
            {locale === "en" ? activePanel.wordEn : activePanel.word}
          </span>
        </motion.div>
      </AnimatePresence>

      {/* Choice buttons */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2.5"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.7 }}
      >
        {panels.map((p) => {
          const isActive = p.id === panels[current].id;
          const isSelected = p.id === selected;
          return (
            <motion.button
              key={p.id}
              onClick={() => handleSelect(p.id)}
              disabled={!!selected}
              animate={{
                scale: isActive ? 1.08 : 1,
                opacity: selected && !isSelected ? 0.35 : 1,
              }}
              transition={{ duration: 0.3 }}
              className={`
                px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all duration-300 border
                ${isActive
                  ? "bg-white/20 border-white/60 text-white"
                  : "bg-white/[0.06] border-white/20 text-white/55 hover:bg-white/15 hover:text-white/80"}
              `}
              style={isSelected ? { background: `${p.color}cc`, borderColor: p.color, color: "#fff" } : {}}
            >
              {locale === "en" ? p.wordEn : p.word}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Tap hint — fades out once a selection is made */}
      <AnimatePresence>
        {!selected && (
          <motion.p
            className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[0.6rem] text-white/25 tracking-widest"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1.5 }}
          >
            {locale === "en" ? "tap to choose" : "اضغط للاختيار"}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
