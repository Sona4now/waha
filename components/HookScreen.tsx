"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Particles from "./Particles";
import { useTranslations } from "@/components/site/LocaleProvider";
import { useIntroVoice } from "@/hooks/useIntroVoice";

interface Props {
  onDone: () => void;
}

const LINES_AR = [
  "مش كل علاج بيبدأ من دواء",
  "أحياناً... يبدأ من مكان",
];

const LINES_EN = [
  "Not every cure starts with medicine",
  "Sometimes… it starts with a place",
];

export default function HookScreen({ onDone }: Props) {
  const { locale } = useTranslations();
  const lines = locale === "en" ? LINES_EN : LINES_AR;
  const [lineIndex, setLineIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  // VO timing matches the visual timing: line 1 enters at 0ms,
  // line 2 enters at 3300ms. Voice clips kick off ~200ms after the
  // text fades in so the spoken word feels in sync with what the
  // user is seeing.
  useIntroVoice(lineIndex === 0 ? "hook-1" : null, { delay: 200 });
  useIntroVoice(lineIndex === 1 ? "hook-2" : null, { delay: 200 });

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Line 0 visible for 2.5s
    timers.push(setTimeout(() => setVisible(false), 2500));
    // Switch to line 1
    timers.push(
      setTimeout(() => {
        setLineIndex(1);
        setVisible(true);
      }, 3300)
    );
    // Fade out line 1
    timers.push(setTimeout(() => setVisible(false), 5800));
    // Done
    timers.push(setTimeout(onDone, 6600));

    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-[#050a10] grain"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <Particles type="stars" count={60} color="rgba(255,255,255,0.4)" />

      <AnimatePresence mode="wait">
        {visible && (
          <motion.p
            key={lineIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="font-display text-xl sm:text-2xl md:text-4xl text-white/85 font-light text-center px-6 sm:px-8 max-w-2xl leading-relaxed"
            style={{
              textShadow: "0 0 80px rgba(145,177,73,0.08)",
            }}
          >
            {lines[lineIndex]}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
