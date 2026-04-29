"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";
import { Destination } from "@/data/destinations";
import { useTranslations } from "@/components/site/LocaleProvider";

interface Props {
  destination: Destination;
  answers: { need?: string; environment?: string; journeyStyle?: string };
  onClose: () => void;
}

const NEED_LABELS_AR: Record<string, string> = {
  body: "راحة جسدية",
  mind: "صفاء نفسي",
  relax: "استرخاء",
};
const NEED_LABELS_EN: Record<string, string> = {
  body: "Physical relief",
  mind: "Mental clarity",
  relax: "Relaxation",
};

const ENV_LABELS_AR: Record<string, string> = {
  sea: "البحر",
  desert: "الصحراء",
  mountains: "الجبال",
  oasis: "الواحات",
};
const ENV_LABELS_EN: Record<string, string> = {
  sea: "The sea",
  desert: "The desert",
  mountains: "The mountains",
  oasis: "The oases",
};

const STYLE_LABELS_AR: Record<string, string> = {
  calm: "هادئة",
  exploratory: "استكشافية",
  deep: "عميقة",
};
const STYLE_LABELS_EN: Record<string, string> = {
  calm: "Calm",
  exploratory: "Exploratory",
  deep: "Deep",
};

export default function ShareCard({ destination, answers, onClose }: Props) {
  const { locale } = useTranslations();
  const cardRef = useRef<HTMLDivElement>(null);
  const NEED_LABELS = locale === "en" ? NEED_LABELS_EN : NEED_LABELS_AR;
  const ENV_LABELS = locale === "en" ? ENV_LABELS_EN : ENV_LABELS_AR;
  const STYLE_LABELS =
    locale === "en" ? STYLE_LABELS_EN : STYLE_LABELS_AR;
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const text =
      locale === "en"
        ? `🌿 My therapeutic destination: ${destination.name}\n"${destination.poem}"\n\nDiscover your destination on Waaha — therapeutic tourism in Egypt`
        : `🌿 وجهتي الاستشفائية: ${destination.name}\n"${destination.poem}"\n\nاكتشف وجهتك على واحة — السياحة الاستشفائية في مصر`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: locale === "en" ? `Waaha — ${destination.name}` : `واحة — ${destination.name}`,
          text,
        });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="w-full max-w-sm"
      >
        {/* Card */}
        <div
          ref={cardRef}
          className="relative overflow-hidden rounded-3xl bg-[#0a1118] border border-white/10"
        >
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url('${destination.panorama}')` }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, ${destination.color}44 0%, #0a111899 50%, #0a1118 100%)`,
            }}
          />

          {/* Content */}
          <div className="relative z-10 p-8 flex flex-col items-center gap-5 text-center">
            {/* Logo */}
            <Image
              src="/logo.png"
              alt={locale === "en" ? "Waha" : "واحة"}
              width={56}
              height={56}
              className="w-14 h-14 rounded-full bg-white/90 p-0.5"
            />

            {/* Title */}
            <div>
              <p className="text-[#91b149]/70 text-xs tracking-widest mb-2">
                {locale === "en" ? "Your healing destination" : "وجهتك الاستشفائية"}
              </p>
              <h2 className="font-display text-3xl font-bold text-white">
                {destination.name}
              </h2>
              <p className="text-white/50 text-sm mt-1 font-display">
                {destination.subtitle}
              </p>
            </div>

            {/* Poem */}
            <p className="text-white/35 text-sm italic">
              &ldquo;{destination.poem}&rdquo;
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 justify-center" dir={locale === "en" ? "ltr" : "rtl"}>
              {answers.need && (
                <span className="px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-white/50 text-xs">
                  {NEED_LABELS[answers.need]}
                </span>
              )}
              {answers.environment && (
                <span className="px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-white/50 text-xs">
                  {ENV_LABELS[answers.environment]}
                </span>
              )}
              {answers.journeyStyle && (
                <span className="px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-white/50 text-xs">
                  {locale === "en" ? `${STYLE_LABELS[answers.journeyStyle]} journey` : `رحلة ${STYLE_LABELS[answers.journeyStyle]}`}
                </span>
              )}
            </div>

            {/* Divider */}
            <div className="w-12 h-px bg-[#91b149]/20" />

            {/* Brand */}
            <p className="text-white/15 text-[0.6rem] tracking-[0.3em] uppercase">
              {locale === "en" ? "Waha · Healing Tourism" : "واحة · السياحة الاستشفائية"}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={handleShare}
            className="flex-1 py-3.5 bg-[#91b149] hover:bg-[#a3c45a] text-[#0a0f14] font-bold text-sm rounded-full transition-all duration-300 flex items-center justify-center gap-2"
          >
            {copied ? (
              locale === "en" ? "Copied ✓" : "تم النسخ ✓"
            ) : (
              <>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
                {locale === "en" ? "Share result" : "مشاركة النتيجة"}
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="py-3.5 px-6 border border-white/20 hover:border-white/40 text-white/60 hover:text-white/80 text-sm rounded-full transition-all duration-300"
          >
            {locale === "en" ? "Close" : "إغلاق"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
