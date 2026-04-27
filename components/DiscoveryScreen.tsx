"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslations } from "@/components/site/LocaleProvider";

interface Props {
  onDone: () => void;
}

const panels = [
  {
    word: "البحر",
    wordEn: "The sea",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80",
    color: "#0e7490",
  },
  {
    word: "الصحراء",
    wordEn: "The desert",
    image:
      "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1920&q=80",
    color: "#d97706",
  },
  {
    word: "الجبال",
    wordEn: "The mountains",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80",
    color: "#78716c",
  },
  {
    word: "الواحات",
    wordEn: "The oases",
    image:
      "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1920&q=80",
    color: "#16a34a",
  },
];

export default function DiscoveryScreen({ onDone }: Props) {
  const { locale } = useTranslations();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = 2400;
    const timers: ReturnType<typeof setTimeout>[] = [];

    panels.forEach((_, i) => {
      if (i > 0) timers.push(setTimeout(() => setCurrent(i), i * interval));
    });

    timers.push(setTimeout(onDone, panels.length * interval + 400));

    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          style={{ backgroundImage: `url('${panels[current].image}')` }}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </AnimatePresence>

      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70 pointer-events-none" />

      {/* Word */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`word-${current}`}
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <span
            className="font-display text-4xl sm:text-5xl md:text-7xl font-bold text-white/90 tracking-wide"
            style={{
              textShadow: `0 0 60px ${panels[current].color}66, 0 4px 30px rgba(0,0,0,0.7)`,
            }}
          >
            {locale === "en" ? panels[current].wordEn : panels[current].word}
          </span>
        </motion.div>
      </AnimatePresence>

      {/* Progress dots */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
        {panels.map((_, i) => (
          <motion.div
            key={i}
            className="h-1 rounded-full"
            animate={{
              width: i === current ? 28 : 8,
              backgroundColor:
                i === current ? "#91b149" : "rgba(255,255,255,0.25)",
            }}
            transition={{ duration: 0.4 }}
          />
        ))}
      </div>
    </motion.div>
  );
}
