"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Achievement } from "@/lib/achievements";

export default function AchievementListener() {
  const [current, setCurrent] = useState<Achievement | null>(null);

  useEffect(() => {
    function onAchievement(e: Event) {
      const achievements = (e as CustomEvent<Achievement[]>).detail;
      if (achievements && achievements.length > 0) {
        setCurrent(achievements[0]);
        setTimeout(() => setCurrent(null), 5000);
      }
    }
    window.addEventListener("waaha_achievement", onAchievement);
    return () =>
      window.removeEventListener("waaha_achievement", onAchievement);
  }, []);

  return (
    <AnimatePresence>
      {current && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-[140] no-print"
        >
          <div className="bg-gradient-to-l from-[#91b149] to-[#6a8435] text-white rounded-2xl shadow-2xl p-5 min-w-[300px] max-w-sm relative overflow-hidden">
            {/* Sparkle decoration */}
            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-white/10 blur-2xl" />

            <div className="relative flex items-center gap-4">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl flex-shrink-0"
              >
                {current.icon}
              </motion.div>
              <div className="flex-1">
                <div className="text-[10px] uppercase tracking-wider text-white/70 font-bold mb-1">
                  ✨ إنجاز جديد
                </div>
                <h3 className="font-bold font-display text-lg leading-tight">
                  {current.title}
                </h3>
                <p className="text-xs text-white/80 mt-0.5">
                  {current.description}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
