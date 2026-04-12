"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TEAM_MEMBERS } from "@/data/team";

const GRADIENTS = [
  "from-[#91b149] to-[#6a8435]",
  "from-[#1d5770] to-[#0d2a39]",
  "from-[#0d9488] to-[#065f46]",
  "from-[#92400e] to-[#b45309]",
  "from-[#7c3aed] to-[#5b21b6]",
];

export default function CardDeckView() {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % TEAM_MEMBERS.length);
    }, 3000);
    return () => clearInterval(t);
  }, [isPaused]);

  const next = () => setIndex((i) => (i + 1) % TEAM_MEMBERS.length);
  const prev = () =>
    setIndex((i) => (i - 1 + TEAM_MEMBERS.length) % TEAM_MEMBERS.length);

  return (
    <div
      className="bg-gradient-to-br from-[#0a151f] via-[#12394d] to-[#0a151f] py-20 md:py-28 flex flex-col items-center justify-center min-h-[720px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="text-[10px] uppercase tracking-[0.4em] text-[#91b149] font-bold mb-3">
        · Card Deck ·
      </div>
      <h2 className="font-display text-3xl md:text-4xl font-black text-white mb-12">
        وجوه الفريق
      </h2>

      <div className="relative w-[280px] md:w-[340px] h-[400px] md:h-[460px]">
        {TEAM_MEMBERS.map((m, i) => {
          const offset = (i - index + TEAM_MEMBERS.length) % TEAM_MEMBERS.length;
          if (offset > 4) return null;
          const gradient = GRADIENTS[m.id % GRADIENTS.length];
          return (
            <motion.div
              key={m.id}
              initial={false}
              animate={{
                y: offset * -8,
                x: offset * 6,
                scale: 1 - offset * 0.04,
                rotate: offset * 2,
                opacity: 1 - offset * 0.2,
                zIndex: 10 - offset,
              }}
              transition={{ type: "spring", stiffness: 180, damping: 22 }}
              className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${gradient} shadow-2xl border border-white/20 flex flex-col items-center justify-center p-8`}
            >
              <div className="text-[10px] uppercase tracking-[0.3em] text-white/60 mb-4">
                № {String(m.id).padStart(2, "0")} / 23
              </div>
              <div className="w-24 h-24 rounded-full bg-white/15 backdrop-blur flex items-center justify-center mb-6 border border-white/30">
                <span className="text-white text-5xl font-display font-black">
                  {m.initial}
                </span>
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-black text-white text-center leading-tight">
                {m.name}
              </h3>
              <div className="mt-6 w-16 h-px bg-white/40" />
              <div className="mt-3 text-[10px] uppercase tracking-[0.2em] text-white/60">
                WAHA · TEAM
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6 mt-10">
        <button
          onClick={prev}
          className="w-12 h-12 rounded-full bg-white/10 hover:bg-[#91b149] border border-white/20 text-white flex items-center justify-center transition-all"
        >
          ←
        </button>
        <div className="text-white/50 font-mono text-sm min-w-[60px] text-center">
          {String(index + 1).padStart(2, "0")} / 23
        </div>
        <button
          onClick={next}
          className="w-12 h-12 rounded-full bg-white/10 hover:bg-[#91b149] border border-white/20 text-white flex items-center justify-center transition-all"
        >
          →
        </button>
      </div>
    </div>
  );
}
