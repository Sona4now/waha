"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "@/components/site/LocaleProvider";

interface Props {
  title: string;
}

/**
 * Small "share" affordance on blog post pages. Tries Web Share API on mobile
 * (which gives the native share sheet — WhatsApp / Telegram / iMessage / etc.)
 * and falls back to copy-to-clipboard with a confirmation toast on desktop.
 */
export default function BlogShareButton({ title }: Props) {
  const { locale } = useTranslations();
  const isEn = locale === "en";
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    if (typeof window === "undefined") return;
    const url = window.location.href;

    // Web Share API — preferred on mobile/iOS
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({
          title,
          url,
        });
        return;
      } catch {
        // User cancelled — fall through to clipboard fallback
      }
    }

    // Clipboard fallback
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Old browsers without clipboard API — pop a prompt as last resort
      window.prompt(isEn ? "Copy the link:" : "انسخ الرابط:", url);
    }
  }

  return (
    <div className="relative inline-flex">
      <button
        onClick={handleShare}
        className="inline-flex items-center gap-2 rounded-full bg-[#1d5770] hover:bg-[#174860] text-white px-5 py-2.5 text-sm font-display font-bold transition-colors"
        aria-label={isEn ? "Share article" : "مشاركة المقال"}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
        <span>{isEn ? "Share article" : "مشاركة المقال"}</span>
      </button>

      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#91b149] px-3 py-1.5 text-xs font-bold text-white shadow-lg pointer-events-none"
          >
            {isEn ? "✓ Link copied" : "✓ تم نسخ الرابط"}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
