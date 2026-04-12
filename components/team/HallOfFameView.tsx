"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TEAM_MEMBERS } from "@/data/team";

const GRADIENTS = [
  "from-[#91b149] to-[#6a8435]",
  "from-[#1d5770] to-[#0d2a39]",
  "from-[#0d9488] to-[#065f46]",
  "from-[#92400e] to-[#b45309]",
  "from-[#7c3aed] to-[#5b21b6]",
];

export default function HallOfFameView() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="bg-gradient-to-b from-[#f5f8fa] to-white dark:from-[#0a151f] dark:to-[#0d1b2a] py-16 md:py-24">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-[#91b149] font-bold mb-3">
            <span className="w-8 h-px bg-[#91b149]" />
            Hall of Fame
            <span className="w-8 h-px bg-[#91b149]" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-black text-[#12394d] dark:text-white mb-2">
            قاعة المشاهير
          </h2>
          <p className="text-[#7b7c7d] text-sm">
            الأعضاء الذين صنعوا واحة — 23 بطلاً
          </p>
        </div>

        {/* Avatars Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6 md:gap-8 max-w-5xl mx-auto">
          {TEAM_MEMBERS.map((member, i) => {
            const gradient = GRADIENTS[i % GRADIENTS.length];
            const isHovered = hovered === member.id;
            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: i * 0.05,
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                }}
                onHoverStart={() => setHovered(member.id)}
                onHoverEnd={() => setHovered(null)}
                className="flex flex-col items-center gap-3 cursor-pointer"
              >
                <motion.div
                  whileHover={{ scale: 1.15, y: -6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  className={`relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center shadow-xl ring-4 ring-white dark:ring-[#0d1b2a] group-hover:ring-[#91b149]`}
                >
                  <span className="text-white font-display font-black text-2xl md:text-3xl">
                    {member.initial}
                  </span>
                  {/* Shimmer ring on hover */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ scale: 1, opacity: 0.8 }}
                        animate={{ scale: 1.4, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="absolute inset-0 rounded-full border-2 border-[#91b149]"
                      />
                    )}
                  </AnimatePresence>
                </motion.div>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={isHovered ? "hover" : "default"}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className={`text-xs text-center leading-tight transition-colors font-semibold ${
                      isHovered
                        ? "text-[#91b149]"
                        : "text-[#12394d] dark:text-white/70"
                    }`}
                  >
                    {member.name}
                  </motion.span>
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
