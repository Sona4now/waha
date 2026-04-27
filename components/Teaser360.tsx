"use client";

import { motion } from "framer-motion";
import { useRef, useState, useCallback, useEffect } from "react";
import { Destination } from "@/data/destinations";
import { useTranslations } from "@/components/site/LocaleProvider";

interface Props {
  destination: Destination;
  onContinue: () => void;
}

export default function Teaser360({ destination, onContinue }: Props) {
  const { locale } = useTranslations();
  const containerRef = useRef<HTMLDivElement>(null);
  const [bgPos, setBgPos] = useState(50); // 0-100 percentage
  const [isDragging, setIsDragging] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const lastX = useRef(0);

  // Auto-pan when not dragging
  useEffect(() => {
    if (!autoPlay) return;
    let pos = bgPos;
    let direction = 1;
    const interval = setInterval(() => {
      pos += direction * 0.15;
      if (pos >= 100) direction = -1;
      if (pos <= 0) direction = 1;
      setBgPos(pos);
    }, 30);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    setIsDragging(true);
    setAutoPlay(false);
    lastX.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      const delta = e.clientX - lastX.current;
      lastX.current = e.clientX;
      setBgPos((prev) => {
        const next = prev - delta * 0.15;
        return Math.max(0, Math.min(100, next));
      });
    },
    [isDragging]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
    // Resume auto-play after 3s
    setTimeout(() => setAutoPlay(true), 3000);
  }, []);

  // Touch support
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setAutoPlay(false);
    setIsDragging(true);
    lastX.current = e.touches[0].clientX;
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging) return;
      const delta = e.touches[0].clientX - lastX.current;
      lastX.current = e.touches[0].clientX;
      setBgPos((prev) => {
        const next = prev - delta * 0.15;
        return Math.max(0, Math.min(100, next));
      });
    },
    [isDragging]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    setTimeout(() => setAutoPlay(true), 3000);
  }, []);

  return (
    <motion.div
      ref={containerRef}
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden select-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
    >
      {/* Panoramic background - controlled by drag */}
      <div
        className="absolute inset-0 bg-cover"
        style={{
          backgroundImage: `url('${destination.panorama}')`,
          backgroundSize: "220% auto",
          backgroundPosition: `${bgPos}% 50%`,
          transition: isDragging ? "none" : "background-position 0.1s linear",
        }}
      />
      <div className="absolute inset-0 bg-black/50" />

      {/* Scan line */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(transparent 0%, rgba(145,177,73,0.02) 50%, transparent 100%)",
        }}
        animate={{ y: ["-100%", "100%"] }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
      />

      {/* 360 badge */}
      <motion.div
        className="absolute top-10 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 180 }}
      >
        <div className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#91b149]/40 bg-black/50 backdrop-blur-sm">
          <motion.span
            className="text-xl font-bold text-[#91b149] tracking-widest"
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            360°
          </motion.span>
          <span className="text-white/50 text-xs font-display">
            {locale === "en" ? "Panoramic tour" : "جولة بانورامية"}
          </span>
        </div>
      </motion.div>

      {/* Drag hint */}
      <motion.div
        className="absolute top-24 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ duration: 4, delay: 1 }}
      >
        <div className="flex items-center gap-2 text-white/30 text-xs">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
          {locale === "en" ? "Drag to explore" : "اسحب لاستكشاف"}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: "scaleX(-1)" }}>
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-7 px-6 text-center pointer-events-none">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="font-display text-2xl sm:text-3xl md:text-5xl font-bold text-white"
        >
          {locale === "en" ? `${destination.name} from every angle` : `${destination.name} من كل زاوية`}
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="text-white/40 text-sm max-w-sm font-display"
        >
          {locale === "en" ? "Drag left and right to explore the place" : "اسحب يميناً ويساراً لاستكشاف المكان"}
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7, duration: 0.6 }}
          onClick={onContinue}
          className="mt-4 py-4 px-10 bg-[#91b149] hover:bg-[#a3c45a] text-[#0a0f14] font-bold text-sm rounded-full transition-all duration-300 hover:scale-[1.03] active:scale-95 pointer-events-auto"
        >
          {locale === "en" ? "Continue the journey" : "متابعة الرحلة"}
        </motion.button>
      </div>
    </motion.div>
  );
}
