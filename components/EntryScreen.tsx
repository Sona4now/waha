"use client";

import { motion } from "framer-motion";
import Particles from "./Particles";
import { useTranslations } from "@/components/site/LocaleProvider";

interface Props {
  onStart: () => void;
  onSkip: () => void;
}

export default function EntryScreen({ onStart, onSkip }: Props) {
  const { locale } = useTranslations();
  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2 }}
    >
      {/* Background with slow zoom */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center will-change-transform"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=1920&q=80')",
        }}
        initial={{ scale: 1.15 }}
        animate={{ scale: 1 }}
        transition={{ duration: 12, ease: "easeOut" }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />

      {/* Particles */}
      <Particles type="dust" count={40} color="rgba(255,255,255,0.3)" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 md:gap-8 px-6 text-center max-w-xl">
        {/* Logo */}
        <motion.img
          src="/logo.png"
          alt={locale === "en" ? "Waha" : "واحة"}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
          className="w-28 h-28 md:w-36 md:h-36 object-contain rounded-full bg-white/90 p-1 shadow-[0_0_40px_rgba(145,177,73,0.2)] border border-white/20"
        />

        {/* Tag */}
        <motion.span
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="text-[0.7rem] tracking-[0.35em] text-[#91b149]/70 uppercase font-light"
        >
          {locale === "en" ? "Healing Tourism · Egypt" : "السياحة الاستشفائية · مصر"}
        </motion.span>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 1.2, ease: "easeOut" }}
          className="font-display text-4xl md:text-7xl font-bold text-white leading-tight"
        >
          {locale === "en" ? "Begin your healing journey" : "ابدأ رحلة الشفاء"}
        </motion.h1>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 2.2, duration: 1, ease: "easeInOut" }}
          className="w-20 h-px bg-[#91b149]/40"
        />

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.6, duration: 0.9 }}
          className="flex flex-col items-center gap-3.5 w-full max-w-xs"
        >
          <button
            onClick={onStart}
            className="w-full py-4 px-8 bg-[#91b149] hover:bg-[#a3c45a] text-[#0a0f14] font-bold text-base rounded-full transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-[0_4px_30px_rgba(145,177,73,0.3)]"
          >
            {locale === "en" ? "Begin the experience" : "ابدأ التجربة"}
          </button>
          <button
            onClick={onSkip}
            className="w-full py-3.5 px-8 border border-white/20 hover:border-white/50 text-white/50 hover:text-white/80 text-sm rounded-full transition-all duration-300"
          >
            {locale === "en" ? "Skip to site" : "ادخل للموقع مباشرة"}
          </button>
        </motion.div>
      </div>

      {/* Bottom subtle brand */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.2, duration: 1 }}
        className="absolute bottom-6 text-white/10 text-[0.65rem] tracking-[0.3em] uppercase"
      >
        {locale === "en" ? "Waha" : "واحة"}
      </motion.div>
    </motion.div>
  );
}
