"use client";

import { motion } from "framer-motion";
import { TEAM_MEMBERS } from "@/data/team";
import { useTranslations } from "@/components/site/LocaleProvider";

const COLORS = [
  "from-[#91b149] to-[#6a8435]",
  "from-[#1d5770] to-[#0d2a39]",
  "from-[#0d9488] to-[#065f46]",
  "from-[#92400e] to-[#b45309]",
  "from-[#7c3aed] to-[#5b21b6]",
  "from-[#dc2626] to-[#991b1b]",
];

// Deterministic rotation + offset per card
const ROTATIONS = [
  -6, 4, -3, 8, -5, 2, 7, -4, 3, -7, 5, -2,
  6, -8, 4, -3, 9, -6, 2, -5, 7, -4, 5,
];

export default function PolaroidWallView() {
  const { locale } = useTranslations();
  return (
    <div
      className="py-16 md:py-24 relative overflow-hidden"
      style={{
        background:
          "repeating-linear-gradient(45deg, #8b6f47 0 2px, #7a5f3a 2px 40px), #7a5f3a",
      }}
    >
      {/* Wood texture overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#6b4a28]/50 via-transparent to-[#4a2f18]/60" />

      <div className="relative max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-14">
          <div className="text-[10px] uppercase tracking-[0.4em] text-[#fff8e7] font-bold mb-3">
            · Polaroid Wall ·
          </div>
          <h2
            className="font-display text-3xl md:text-4xl font-black text-[#fff8e7]"
            style={{ textShadow: "2px 2px 6px rgba(0,0,0,0.5)" }}
          >
            {locale === "en" ? "Our memories" : "ذكرياتنا"}
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-12">
          {TEAM_MEMBERS.map((m, i) => {
            const rotation = ROTATIONS[i] || 0;
            const color = COLORS[i % COLORS.length];
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 30, rotate: 0 }}
                whileInView={{ opacity: 1, y: 0, rotate: rotation }}
                whileHover={{ rotate: 0, scale: 1.08, y: -8, zIndex: 10 }}
                transition={{ delay: i * 0.05, type: "spring", stiffness: 150 }}
                viewport={{ once: true }}
                className="bg-white p-3 pb-10 shadow-2xl cursor-pointer relative"
              >
                {/* Pin */}
                <div className="absolute top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-red-500 shadow-md z-10" />
                {/* Photo area */}
                <div
                  className={`aspect-square bg-gradient-to-br ${color} flex items-center justify-center`}
                >
                  <span className="text-white font-display font-black text-5xl">
                    {m.initial}
                  </span>
                </div>
                {/* Caption (handwritten style) */}
                <div
                  className="mt-3 text-center text-[#333] text-sm font-bold"
                  style={{ fontFamily: "Reem Kufi, Cairo, sans-serif" }}
                >
                  {m.name}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
