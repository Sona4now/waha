"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import Particles from "./Particles";
import { useTranslations } from "@/components/site/LocaleProvider";

interface Props {
  onDone: () => void;
}

export default function ProcessingScreen({ onDone }: Props) {
  const { locale } = useTranslations();
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center bg-[#060b12] grain"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <Particles type="stars" count={45} color="rgba(145,177,73,0.3)" />

      {/* Animated rings */}
      <div className="relative w-28 h-28 mb-12">
        <motion.div
          className="absolute inset-0 rounded-full border border-[#91b149]/20"
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute inset-3 rounded-full border border-[#91b149]/35"
          animate={{ scale: [1, 1.3, 1], opacity: [0.7, 0.15, 0.7] }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.35,
          }}
        />
        <motion.div
          className="absolute inset-9 rounded-full bg-[#91b149]/60"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Text */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7 }}
        className="font-display text-2xl md:text-3xl text-white/75 font-light text-center"
      >
        {locale === "en" ? "Mapping your journey..." : "نرسم لك رحلتك..."}
      </motion.p>

      {/* Dots */}
      <div className="flex gap-1.5 mt-6">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-[#91b149]/50"
            animate={{ y: [0, -6, 0], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.18 }}
          />
        ))}
      </div>
    </motion.div>
  );
}
