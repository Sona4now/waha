"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Section {
  id: string;
  label: string;
  icon: string;
}

const SECTIONS: Section[] = [
  { id: "overview", label: "نبذة", icon: "📖" },
  { id: "benefits", label: "الفوائد", icon: "💊" },
  { id: "timing", label: "الوقت", icon: "🌡️" },
  { id: "day", label: "الرحلة", icon: "🗓️" },
  { id: "gallery", label: "الصور", icon: "🖼️" },
  { id: "faq", label: "أسئلة", icon: "❓" },
];

interface Props {
  /** Sections to render — defaults to all */
  sections?: Section[];
}

/**
 * Horizontal sticky section nav — appears after user scrolls past hero.
 * Lets user jump between sections and always know where they are.
 */
export default function SectionNav({ sections = SECTIONS }: Props) {
  const [visible, setVisible] = useState(false);
  const [activeId, setActiveId] = useState(sections[0].id);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 500);

      // Find which section is currently in view
      let current = sections[0].id;
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top < 150) current = s.id;
      }
      setActiveId(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [sections]);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 100;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="fixed top-[72px] left-0 right-0 z-40 bg-white/95 dark:bg-[#0d1b2a]/95 backdrop-blur-xl border-b border-[#d0dde4] dark:border-[#1e3a5f] no-print"
          dir="rtl"
        >
          <div className="max-w-6xl mx-auto px-4 overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-1 py-2.5">
              {sections.map((s) => {
                const isActive = activeId === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => handleClick(s.id)}
                    className={`relative flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-colors ${
                      isActive
                        ? "text-white"
                        : "text-[#7b7c7d] dark:text-white/50 hover:text-[#1d5770] dark:hover:text-white"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="section-active"
                        className="absolute inset-0 bg-[#1d5770] dark:bg-[#91b149] rounded-full"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                    <span className="relative z-10">{s.icon}</span>
                    <span className="relative z-10">{s.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
