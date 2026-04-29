"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Theme = "light" | "dark";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  const applyTheme = (t: Theme) => {
    if (t === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
    }
  };

  // Initialize theme on mount. applyTheme only touches the DOM (no captured
  // state/props), so it's safe to omit from the dep array.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setMounted(true);
    const saved = (localStorage.getItem("waaha_theme") as Theme | null) || null;
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial: Theme = saved ?? (systemPrefersDark ? "dark" : "light");
    setTheme(initial);
    applyTheme(initial);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("waaha_theme", next);
    applyTheme(next);
  };

  if (!mounted) {
    return (
      <button
        className="w-9 h-9 rounded-full flex items-center justify-center"
        aria-hidden="true"
      />
    );
  }

  return (
    <button
      onClick={toggle}
      aria-label={theme === "light" ? "تفعيل الوضع الليلي" : "تفعيل الوضع النهاري"}
      title={theme === "light" ? "الوضع الليلي" : "الوضع النهاري"}
      className="w-9 h-9 rounded-full flex items-center justify-center text-[#12394d] dark:text-white hover:bg-[#e4edf2] dark:hover:bg-[#162033] transition-colors"
    >
      <AnimatePresence mode="wait">
        {theme === "light" ? (
          <motion.svg
            key="moon"
            initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
            transition={{ duration: 0.25 }}
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </motion.svg>
        ) : (
          <motion.svg
            key="sun"
            initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
            transition={{ duration: 0.25 }}
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </motion.svg>
        )}
      </AnimatePresence>
    </button>
  );
}
