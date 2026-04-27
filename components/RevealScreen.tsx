"use client";

import { motion } from "framer-motion";
import { Destination } from "@/data/destinations";
import Particles from "./Particles";
import { useTranslations } from "@/components/site/LocaleProvider";
import { useIntroVoice } from "@/hooks/useIntroVoice";
import type { IntroVoId } from "@/lib/introAudio";

interface Props {
  destination: Destination;
  onExplore: () => void;
  on360: () => void;
  onShare: () => void;
}

export default function RevealScreen({ destination, onExplore, on360, onShare }: Props) {
  const { locale } = useTranslations();

  // Play the destination's reveal VO once the screen mounts. The
  // 1200ms delay matches the heading's animation timing — the spoken
  // name lands as the visual name finishes its fade-in.
  useIntroVoice(`reveal-${destination.id}` as IntroVoId, { delay: 1200 });

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2 }}
    >
      {/* Background */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center will-change-transform"
        style={{ backgroundImage: `url('${destination.panorama}')` }}
        initial={{ scale: 1.15 }}
        animate={{ scale: 1 }}
        transition={{ duration: 8, ease: "easeOut" }}
      />
      <div
        className={`absolute inset-0 bg-gradient-to-b ${destination.gradient} opacity-70`}
      />
      <div className="absolute inset-0 bg-black/45" />
      <Particles type="dust" count={35} color="rgba(255,255,255,0.25)" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-4 md:gap-5 px-5 md:px-6 text-center max-w-2xl">
        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-[0.7rem] tracking-[0.4em] text-[#91b149]/70 uppercase"
        >
          {locale === "en" ? "Your suggested destination" : "وجهتك المقترحة"}
        </motion.p>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1, duration: 1.2, ease: "easeOut" }}
          className="font-display text-3xl sm:text-5xl md:text-8xl font-bold text-white leading-tight"
          style={{
            textShadow: `0 0 100px ${destination.color}88`,
          }}
        >
          {locale === "en" ? `Your journey begins from ${destination.name}` : `رحلتك تبدأ من ${destination.name}`}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
          className="font-display text-base md:text-xl text-white/60 font-light"
        >
          {destination.subtitle}
        </motion.p>

        {/* Poem */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 1 }}
          className="text-sm text-white/40 italic"
        >
          &ldquo;{destination.poem}&rdquo;
        </motion.p>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 2.5, duration: 0.8 }}
          className="w-14 h-px bg-[#91b149]/30 my-1"
        />

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.8, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-3 w-full max-w-sm"
          dir={locale === "en" ? "ltr" : "rtl"}
        >
          <button
            onClick={onExplore}
            className="flex-1 py-4 px-6 bg-[#91b149] hover:bg-[#a3c45a] text-[#0a0f14] font-bold text-sm rounded-full transition-all duration-300 hover:scale-[1.03] active:scale-95"
          >
            {locale === "en" ? "Explore the journey" : "استكشف الرحلة"}
          </button>
          <button
            onClick={on360}
            className="flex-1 py-4 px-6 border border-white/30 hover:border-white/60 text-white/80 hover:text-white text-sm rounded-full transition-all duration-300 hover:bg-white/[0.06] flex items-center justify-center gap-2"
          >
            <span className="text-xs font-bold tracking-wider text-[#91b149]">
              360°
            </span>
            {locale === "en" ? "Watch" : "شاهد"}
          </button>
        </motion.div>

        {/* Share button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.3, duration: 0.6 }}
          onClick={onShare}
          className="mt-1 text-white/30 hover:text-white/60 text-xs flex items-center gap-1.5 transition-colors duration-300"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
          {locale === "en" ? "Share your result" : "شارك نتيجتك"}
        </motion.button>
      </div>
    </motion.div>
  );
}
