"use client";

import { motion } from "framer-motion";
import Particles from "./Particles";
import { LOCALE_COOKIE, type Locale } from "@/lib/i18n";

interface Props {
  onPicked: (locale: Locale) => void;
}

/**
 * Two-button choice screen shown before the cinematic intro starts.
 *
 * Flow:
 * 1. User lands on /
 * 2. If they have no `waaha_locale` cookie yet → this gate appears
 * 3. They pick AR or EN
 * 4. We write the cookie and hard-reload so SSR re-renders with the
 *    chosen locale (metadata, dir, lang, all schema.org)
 * 5. After reload the gate is skipped (cookie now exists) and the
 *    Entry screen appears in the right language
 *
 * The reload is intentional — it's the simplest way to flip every
 * server-rendered surface (root layout's html lang/dir, page metadata,
 * structured data) atomically. The user only sees it once per browser.
 */
export default function LanguageGate({ onPicked }: Props) {
  function pick(locale: Locale) {
    // Write a 1-year cookie matching the rest of the i18n stack.
    if (typeof document !== "undefined") {
      document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${
        60 * 60 * 24 * 365
      }; SameSite=Lax`;
    }
    onPicked(locale);
    // Hard reload so server-rendered surfaces (html lang/dir + metadata)
    // pick up the new locale before the cinematic begins.
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  }

  return (
    <motion.div
      key="language-gate"
      className="fixed inset-0 flex items-center justify-center bg-[#050a10] grain"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <Particles type="stars" count={50} color="rgba(255,255,255,0.35)" />

      <div className="relative z-10 max-w-md w-full px-6 text-center flex flex-col items-center gap-10">
        {/* Subtle brand mark */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-[0.7rem] tracking-[0.5em] text-[#91b149]/70 uppercase"
        >
          Waaha · واحة
        </motion.div>

        {/* Bilingual prompt — same meaning, both languages, side by side */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.9 }}
          className="font-display text-2xl md:text-3xl text-white/90 leading-relaxed"
        >
          <span className="block">Choose your language</span>
          <span className="block mt-2 text-white/60 text-lg md:text-xl">
            اختر لغتك
          </span>
        </motion.h1>

        {/* Two buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.9 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full"
        >
          <button
            type="button"
            onClick={() => pick("ar")}
            className="group relative px-6 py-5 rounded-2xl bg-white/[0.04] border border-white/15 hover:bg-[#91b149]/15 hover:border-[#91b149]/60 transition-all duration-300"
          >
            <div className="font-display text-2xl text-white mb-1">العربية</div>
            <div className="text-xs text-white/50 group-hover:text-[#91b149] transition-colors">
              Arabic
            </div>
          </button>

          <button
            type="button"
            onClick={() => pick("en")}
            className="group relative px-6 py-5 rounded-2xl bg-white/[0.04] border border-white/15 hover:bg-[#91b149]/15 hover:border-[#91b149]/60 transition-all duration-300"
          >
            <div className="font-display text-2xl text-white mb-1">English</div>
            <div className="text-xs text-white/50 group-hover:text-[#91b149] transition-colors">
              الإنجليزية
            </div>
          </button>
        </motion.div>

        {/* Quiet hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1 }}
          className="text-[10px] tracking-[0.3em] text-white/30 uppercase"
        >
          You can change this later · يمكنك تغييرها لاحقاً
        </motion.p>
      </div>
    </motion.div>
  );
}
