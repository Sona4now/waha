"use client";

import { motion } from "framer-motion";
import { useTranslations } from "@/components/site/LocaleProvider";
import type { Destination } from "@/data/destinations";

interface Props {
  destination: Destination;
  onContinue: () => void;
  onRestart: () => void;
}

export default function ReturningScreen({ destination, onContinue, onRestart }: Props) {
  const { locale } = useTranslations();

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      {/* Background */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${destination.panorama}')` }}
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 8, ease: "easeOut" }}
      />
      <div className={`absolute inset-0 bg-gradient-to-b ${destination.gradient} opacity-60`} />
      <div className="absolute inset-0 bg-black/55" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-5 px-6 text-center max-w-md">
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-[0.65rem] tracking-[0.4em] text-[#91b149]/70 uppercase"
        >
          {locale === "en" ? "Welcome back" : "مرحباً بعودتك"}
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 1, ease: "easeOut" }}
          className="font-display text-3xl sm:text-5xl font-bold text-white"
          style={{ textShadow: `0 0 80px ${destination.color}88` }}
        >
          {locale === "en" ? destination.nameEn ?? destination.name : destination.name}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.9 }}
          className="text-sm text-white/55 leading-relaxed"
        >
          {locale === "en"
            ? "Your journey awaits. Continue from where you left off, or explore a new path."
            : "رحلتك في انتظارك. كمّل من حيث توقفت، أو اكتشف طريقاً جديداً."}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-3 w-full"
          dir={locale === "en" ? "ltr" : "rtl"}
        >
          <button
            onClick={onContinue}
            className="flex-1 py-4 px-6 bg-[#91b149] hover:bg-[#a3c45a] text-[#0a0f14] font-bold text-sm rounded-full transition-all duration-300 hover:scale-[1.03] active:scale-95"
          >
            {locale === "en" ? "Continue journey" : "كمّل رحلتك"}
          </button>
          <button
            onClick={onRestart}
            className="flex-1 py-4 px-6 border border-white/25 hover:border-white/50 text-white/65 hover:text-white text-sm rounded-full transition-all duration-300 hover:bg-white/[0.06]"
          >
            {locale === "en" ? "Start fresh" : "ابدأ من جديد"}
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
