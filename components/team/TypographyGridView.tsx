"use client";

import { motion } from "framer-motion";
import { TEAM_MEMBERS } from "@/data/team";
import { useTranslations } from "@/components/site/LocaleProvider";

// Varied size classes and colors for a magazine-style collage
const SIZES = [
  "text-6xl md:text-8xl",
  "text-4xl md:text-5xl",
  "text-5xl md:text-7xl",
  "text-3xl md:text-4xl",
  "text-5xl md:text-6xl",
  "text-4xl md:text-6xl",
];

const COLORS = [
  "text-white",
  "text-[#91b149]",
  "text-white/40",
  "text-white",
  "text-[#91b149]",
  "text-white/60",
];

const ALIGN = ["text-right", "text-left", "text-center"];

export default function TypographyGridView() {
  const { locale } = useTranslations();
  return (
    <div className="bg-[#070d15] py-16 md:py-24 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="text-center mb-14">
          <div className="text-[10px] uppercase tracking-[0.4em] text-[#91b149] font-bold mb-3">
            · Typography Grid ·
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-black text-white">
            {locale === "en" ? "Names as design" : "الأسماء كتصميم"}
          </h2>
        </div>

        <div className="flex flex-wrap items-baseline justify-center gap-x-6 gap-y-3 md:gap-x-10 md:gap-y-5">
          {TEAM_MEMBERS.map((m, i) => {
            const size = SIZES[i % SIZES.length];
            const color = COLORS[i % COLORS.length];
            const align = ALIGN[i % ALIGN.length];
            return (
              <motion.span
                key={m.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, color: "#91b149" }}
                className={`font-display font-black leading-none cursor-pointer transition-colors ${size} ${color} ${align}`}
              >
                {m.name}
              </motion.span>
            );
          })}
        </div>

        <div className="mt-16 text-center text-[10px] uppercase tracking-[0.3em] text-white/30">
          23 NAMES · ONE VISION
        </div>
      </div>
    </div>
  );
}
