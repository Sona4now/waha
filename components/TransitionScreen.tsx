"use client";

import { motion } from "framer-motion";
import { Destination } from "@/data/destinations";

interface Props {
  destination: Destination;
  onEnter: () => void;
}

export default function TransitionScreen({ destination, onEnter }: Props) {
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
        initial={{ scale: 1 }}
        animate={{ scale: 1.05 }}
        transition={{ duration: 8, ease: "easeIn" }}
      />
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />

      {/* Radial glow */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at center, ${destination.color}18 0%, transparent 65%)`,
        }}
        animate={{ opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 3.5, repeat: Infinity }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-7 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="text-[#91b149]/40 text-lg"
        >
          &#10022;
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1.2, ease: "easeOut" }}
          className="font-display text-3xl sm:text-4xl md:text-6xl font-bold text-white leading-tight"
        >
          رحلتك بدأت من هنا
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="font-display text-white/40 text-lg font-light"
        >
          {destination.name} تنتظرك
        </motion.p>

        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2, duration: 0.7 }}
          onClick={onEnter}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="mt-4 md:mt-6 py-3.5 px-10 md:py-4 md:px-14 bg-white/[0.07] hover:bg-white/[0.14] border border-white/20 hover:border-white/50 text-white text-base md:text-lg font-semibold rounded-full backdrop-blur-sm transition-all duration-400"
        >
          ادخل إلى الموقع
        </motion.button>
      </div>

      {/* Bottom brand */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.6, duration: 1 }}
        className="absolute bottom-7 text-white/[0.12] text-[0.6rem] tracking-[0.35em] uppercase"
      >
        واحة · السياحة الاستشفائية
      </motion.div>
    </motion.div>
  );
}
