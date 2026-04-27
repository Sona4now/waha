"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { CONTACT_PHONE_INTL } from "@/lib/siteMeta";
import { useTranslations } from "./LocaleProvider";

const HIDDEN_PATHS = ["/", "/gate", "/therapy-room", "/map"];
const STORAGE_KEY = "waaha_wa_hint_dismissed";

/**
 * Pretty Arabic name for each destination ID — kept inline (small list,
 * doesn't justify a data-file import for the hot path of a footer FAB).
 */
const DESTINATION_NAMES: Record<string, string> = {
  safaga: "سفاجا",
  siwa: "سيوة",
  sinai: "سيناء",
  fayoum: "الفيوم",
  bahariya: "الواحات البحرية",
  "wadi-degla": "وادي دجلة",
  "shagie-farms": "مزارع شجيع",
};

const DESTINATION_NAMES_EN: Record<string, string> = {
  safaga: "Safaga",
  siwa: "Siwa",
  sinai: "Sinai",
  fayoum: "Fayoum",
  bahariya: "Bahariya",
  "wadi-degla": "Wadi Degla",
  "shagie-farms": "Shagie Farms",
};

function buildContextualMessage(path: string): string {
  // /destination/safaga → "صفحة سفاجا"
  const destMatch = path.match(/^\/destination\/([\w-]+)/);
  if (destMatch) {
    const name = DESTINATION_NAMES[destMatch[1]] || destMatch[1];
    return `أهلاً، أنا على صفحة ${name} وعايز أعرف الباقات وأحجز رحلتي.`;
  }
  // /blog/some-slug → "قريت مقالكم"
  if (path.startsWith("/blog/")) {
    return "أهلاً، قريت مقالكم في المدونة وعايز أستفسر عن السياحة الاستشفائية في مصر.";
  }
  // /tours → ".. شفت جولات الـ 360"
  if (path.startsWith("/tours")) {
    return "أهلاً، شفت جولات 360° على موقعكم وعايز أحجز زيارة فعلية.";
  }
  // /destinations
  if (path.startsWith("/destinations")) {
    return "أهلاً، بتفرج في الوجهات وعايز نصيحة لاختيار الأنسب لحالتي.";
  }
  // /symptoms → quiz user
  if (path.startsWith("/symptoms")) {
    return "أهلاً، عملت فاحص الأعراض وعايز نتكلم عن التوصية.";
  }
  // /compare
  if (path.startsWith("/compare")) {
    return "أهلاً، بقارن بين وجهات على الموقع وعايز رأيكم.";
  }
  // /calendar
  if (path.startsWith("/calendar")) {
    return "أهلاً، بشوف التقويم وعايز أحجز رحلة في الموسم القادم.";
  }
  // Generic
  return "أهلاً، عايز أعرف أكتر عن السياحة الاستشفائية في مصر.";
}

function buildContextualMessageEn(path: string): string {
  const destMatch = path.match(/^\/destination\/([\w-]+)/);
  if (destMatch) {
    const name = DESTINATION_NAMES_EN[destMatch[1]] || destMatch[1];
    return `Hi, I'm on the ${name} page and would like to learn about packages and book a trip.`;
  }
  if (path.startsWith("/blog/")) {
    return "Hi, I just read one of your blog posts and would like to ask about wellness tourism in Egypt.";
  }
  if (path.startsWith("/tours")) {
    return "Hi, I checked the 360° virtual tours on your site and would like to book a real visit.";
  }
  if (path.startsWith("/destinations")) {
    return "Hi, I'm browsing the destinations and would like advice on which is best for my case.";
  }
  if (path.startsWith("/symptoms")) {
    return "Hi, I just took the symptom checker and want to talk through the recommendation.";
  }
  if (path.startsWith("/compare")) {
    return "Hi, I'm comparing destinations on your site and would value your input.";
  }
  if (path.startsWith("/calendar")) {
    return "Hi, I'm looking at the calendar and want to book a trip for the upcoming season.";
  }
  return "Hi, I'd like to know more about wellness tourism in Egypt.";
}

/**
 * Floating WhatsApp CTA — the single most effective conversion tool for
 * Egyptian users. Shows a small contextual hint bubble on first visit
 * ("سؤال؟ اسأل واتساب") that fades on click or after 8s.
 *
 * The deep-link prefills a message that includes the current page path so
 * the operator on the other end knows what the user is asking about.
 */
export default function WhatsAppButton() {
  const pathname = usePathname();
  const { t, locale } = useTranslations();
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (HIDDEN_PATHS.includes(pathname)) return;
    if (typeof window === "undefined") return;
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) return;
    } catch {
      /* sessionStorage disabled — show hint anyway */
    }
    // Wait a beat so the hint isn't the first thing the user sees.
    const t = setTimeout(() => setShowHint(true), 4000);
    const dismiss = setTimeout(() => dismissHint(), 12000);
    return () => {
      clearTimeout(t);
      clearTimeout(dismiss);
    };
  }, [pathname]);

  function dismissHint() {
    setShowHint(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {}
  }

  /**
   * Build a context-aware opening message.
   *
   * The operator on the other end sees a meaningful first message instead
   * of a generic greeting — they know which destination/article/action
   * the user is asking about and can skip the discovery phase.
   */
  function buildHref() {
    const path = pathname || "/";
    // English users get a one-line English opener so the operator on the
    // other end knows which language to start in.
    const message =
      locale === "en"
        ? buildContextualMessageEn(path)
        : buildContextualMessage(path);
    return `https://wa.me/${CONTACT_PHONE_INTL}?text=${encodeURIComponent(
      message,
    )}`;
  }

  if (HIDDEN_PATHS.includes(pathname)) return null;

  return (
    <div
      // bottom-20 on mobile keeps it above the BottomNav. md+ pulls it down.
      // The chat widget FAB sits at bottom-left so we anchor right.
      className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-[90] no-print"
      dir={locale === "en" ? "ltr" : "rtl"}
    >
      <AnimatePresence>
        {showHint && (
          <motion.button
            key="hint"
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            onClick={dismissHint}
            className="absolute bottom-full mb-3 right-0 whitespace-nowrap bg-white dark:bg-[#162033] rounded-2xl shadow-[0_10px_30px_-8px_rgba(0,0,0,0.25)] border border-gray-100 dark:border-[#1e3a5f] px-4 py-2.5 text-sm text-[#12394d] dark:text-white"
            aria-label={t("common.close")}
          >
            <span className="font-bold">{t("whatsapp.hintTitle")}</span>{" "}
            <span className="text-[#7b7c7d] dark:text-white/60">
              {t("whatsapp.hintBody")}
            </span>
            {/* Triangle pointing down to the FAB */}
            <span className="absolute -bottom-1.5 right-6 w-3 h-3 rotate-45 bg-white dark:bg-[#162033] border-r border-b border-gray-100 dark:border-[#1e3a5f]" />
          </motion.button>
        )}
      </AnimatePresence>

      <motion.a
        href={buildHref()}
        target="_blank"
        rel="noopener noreferrer"
        onClick={dismissHint}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#1da851] shadow-[0_8px_24px_-6px_rgba(37,211,102,0.55)] transition-colors no-underline"
        aria-label={t("whatsapp.label")}
      >
        {/* Pulse ring */}
        <span
          className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20"
          aria-hidden
        />
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="white"
          aria-hidden
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.693.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </motion.a>
    </div>
  );
}
