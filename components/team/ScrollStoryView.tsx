"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { TEAM_MEMBERS } from "@/data/team";
import { useTranslations } from "@/components/site/LocaleProvider";

const GRADIENTS = [
  "from-[#91b149] via-[#6a8435] to-[#12394d]",
  "from-[#1d5770] via-[#0d2a39] to-[#070d15]",
  "from-[#0d9488] via-[#065f46] to-[#0a151f]",
  "from-[#92400e] via-[#b45309] to-[#1a0f08]",
  "from-[#7c3aed] via-[#5b21b6] to-[#1e1136]",
];

function Section({
  index,
  total,
  name,
  initial,
}: {
  index: number;
  total: number;
  name: string;
  initial: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1.05, 0.9]);
  const gradient = GRADIENTS[index % GRADIENTS.length];

  return (
    <div
      ref={ref}
      className={`relative min-h-[70vh] flex items-center justify-center bg-gradient-to-br ${gradient} overflow-hidden`}
    >
      <motion.div
        style={{ y, scale }}
        className="relative flex flex-col items-center text-center px-6"
      >
        <div className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-white/50 font-bold mb-4">
          № {String(index + 1).padStart(2, "0")} / {total}
        </div>
        <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-white/10 backdrop-blur border border-white/30 flex items-center justify-center mb-8">
          <span className="text-white font-display font-black text-5xl md:text-6xl">
            {initial}
          </span>
        </div>
        <h3 className="font-display text-4xl md:text-6xl font-black text-white max-w-2xl">
          {name}
        </h3>
        <div className="mt-6 w-20 h-px bg-white/40" />
        <div className="mt-4 text-[10px] uppercase tracking-[0.3em] text-white/40">
          WAHA · TEAM MEMBER
        </div>
      </motion.div>
    </div>
  );
}

export default function ScrollStoryView() {
  const { locale } = useTranslations();
  return (
    <div className="bg-[#070d15]">
      {/* Intro */}
      <div className="min-h-[50vh] flex items-center justify-center bg-[#070d15]">
        <div className="text-center">
          <div className="text-[10px] uppercase tracking-[0.4em] text-[#91b149] font-bold mb-3">
            · Scroll Story ·
          </div>
          <h2 className="font-display text-4xl md:text-6xl font-black text-white mb-4">
            {locale === "en" ? "Scroll to meet them" : "اسكرول لتعرفهم"}
          </h2>
          <p className="text-white/50 text-sm">
            {locale === "en" ? "↓ Begin the journey ↓" : "↓ ابدأ الرحلة ↓"}
          </p>
        </div>
      </div>

      {TEAM_MEMBERS.map((m, i) => (
        <Section
          key={m.id}
          index={i}
          total={TEAM_MEMBERS.length}
          name={m.name}
          initial={m.initial}
        />
      ))}

      <div className="min-h-[40vh] flex items-center justify-center bg-[#070d15]">
        <div className="text-center text-white/30 text-xs uppercase tracking-[0.3em]">
          {locale === "en" ? "— End of story —" : "— نهاية القصة —"}
        </div>
      </div>
    </div>
  );
}
