"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TEAM_MEMBERS } from "@/data/team";
import { useTranslations } from "@/components/site/LocaleProvider";

// Precomputed pseudo-random orbit positions in a 100x100 canvas
const POSITIONS = [
  { x: 50, y: 50, size: 1.4 },
  { x: 22, y: 28, size: 1.0 },
  { x: 78, y: 30, size: 1.1 },
  { x: 18, y: 70, size: 0.95 },
  { x: 82, y: 72, size: 1.05 },
  { x: 50, y: 18, size: 0.9 },
  { x: 50, y: 82, size: 1.0 },
  { x: 32, y: 50, size: 0.85 },
  { x: 68, y: 50, size: 0.85 },
  { x: 38, y: 20, size: 0.8 },
  { x: 62, y: 20, size: 0.8 },
  { x: 38, y: 80, size: 0.8 },
  { x: 62, y: 80, size: 0.8 },
  { x: 12, y: 48, size: 0.75 },
  { x: 88, y: 48, size: 0.75 },
  { x: 28, y: 40, size: 0.7 },
  { x: 72, y: 40, size: 0.7 },
  { x: 28, y: 60, size: 0.7 },
  { x: 72, y: 60, size: 0.7 },
  { x: 44, y: 34, size: 0.65 },
  { x: 56, y: 34, size: 0.65 },
  { x: 44, y: 66, size: 0.65 },
  { x: 56, y: 66, size: 0.65 },
];

const COLORS = [
  "bg-[#91b149]",
  "bg-[#1d5770]",
  "bg-[#0d9488]",
  "bg-[#b45309]",
  "bg-[#7c3aed]",
  "bg-[#dc2626]",
];

export default function OrbClusterView() {
  const { locale } = useTranslations();
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="bg-[#070d15] py-16 md:py-20 min-h-[700px] flex flex-col items-center justify-center relative overflow-hidden">
      <div className="text-[10px] uppercase tracking-[0.4em] text-[#91b149] font-bold mb-3">
        · Orb Cluster ·
      </div>
      <h2 className="font-display text-3xl md:text-4xl font-black text-white mb-10">
        {locale === "en" ? "The dancing team" : "الفريق المتراقص"}
      </h2>

      <div className="relative w-full max-w-[720px] h-[560px]">
        {TEAM_MEMBERS.map((m, i) => {
          const pos = POSITIONS[i] || POSITIONS[0];
          const color = COLORS[i % COLORS.length];
          const isHovered = hovered === m.id;
          const baseSize = 72 * pos.size;
          return (
            <motion.div
              key={m.id}
              className="absolute flex items-center justify-center cursor-pointer"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                width: baseSize,
                height: baseSize,
                marginLeft: -baseSize / 2,
                marginTop: -baseSize / 2,
              }}
              animate={{
                y: [0, -8, 0, 6, 0],
                x: [0, 4, 0, -4, 0],
              }}
              transition={{
                duration: 6 + (i % 4),
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.15,
              }}
              onHoverStart={() => setHovered(m.id)}
              onHoverEnd={() => setHovered(null)}
            >
              <motion.div
                whileHover={{ scale: 1.25 }}
                className={`relative w-full h-full rounded-full ${color} shadow-[0_0_30px_rgba(145,177,73,0.3)] flex items-center justify-center border border-white/20`}
              >
                <span className="text-white font-display font-black text-2xl">
                  {m.initial}
                </span>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -bottom-8 whitespace-nowrap bg-white text-[#12394d] text-[11px] font-bold px-3 py-1 rounded-full shadow-lg z-10"
                  >
                    {m.name}
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
