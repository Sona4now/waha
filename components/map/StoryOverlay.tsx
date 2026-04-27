"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import type { DestinationFull } from "@/data/siteData";
import type { TherapeuticSite } from "@/lib/therapeuticSites";
import {
  NEED_LABELS,
  ENVIRONMENT_LABELS,
  type Recommendation,
} from "@/hooks/useRecommendation";
import { useTranslations } from "@/components/site/LocaleProvider";

export type Act =
  | "welcome"
  | "context"
  | "fly-to"
  | "reveal"
  | "sites"
  | "compare";

const ACT_ORDER: Act[] = [
  "welcome",
  "context",
  "fly-to",
  "reveal",
  "sites",
  "compare",
];

/**
 * Auto-advance timings for the narrative acts. Longer than the first
 * draft so Arabic readers have time to read each line comfortably.
 * `null` means "wait for user interaction".
 */
const AUTO_ADVANCE_MS: Partial<Record<Act, number>> = {
  welcome: 4000,
  context: 5000,
  "fly-to": 3200,
  // `reveal`, `sites`, `compare` require the user to act.
};

interface Props {
  act: Act;
  onActChange: (act: Act) => void;
  recommendation: Recommendation;
  destination: DestinationFull;
  compatibleDestinations: DestinationFull[];
  focusedSubSites: TherapeuticSite[];
  onSkip: () => void;
}

/**
 * Narrative overlay that guides the user through the map story.
 * Plays the user's cinematic-intro answers back at them — never asks again.
 *
 * Additions over v1:
 *   · progress dots (●○○○) + step counter
 *   · Prev / Next controls with keyboard arrows
 *   · collapse/expand on mobile so the map stays visible
 *   · RTL-native slide direction
 *   · aria-live region so screen readers announce act changes
 */
export default function StoryOverlay({
  act,
  onActChange,
  recommendation,
  destination,
  compatibleDestinations,
  focusedSubSites,
  onSkip,
}: Props) {
  const { locale } = useTranslations();
  const [collapsed, setCollapsed] = useState(false);

  const needLabel = recommendation.need
    ? NEED_LABELS[recommendation.need] || (locale === "en" ? "Healing" : "الشفاء")
    : (locale === "en" ? "Healing" : "الشفاء");
  const envLabel = recommendation.environment
    ? ENVIRONMENT_LABELS[recommendation.environment] || (locale === "en" ? "Nature" : "الطبيعة")
    : (locale === "en" ? "Nature" : "الطبيعة");

  const stepIndex = useMemo(() => ACT_ORDER.indexOf(act), [act]);
  const canGoPrev = stepIndex > 0;
  const canGoNext = stepIndex >= 0 && stepIndex < ACT_ORDER.length - 1;

  const goPrev = () => canGoPrev && onActChange(ACT_ORDER[stepIndex - 1]);
  const goNext = () => canGoNext && onActChange(ACT_ORDER[stepIndex + 1]);

  // Auto-advance early acts — but only when not collapsed.
  useEffect(() => {
    if (collapsed) return;
    const ms = AUTO_ADVANCE_MS[act];
    if (!ms) return;
    const t = setTimeout(goNext, ms);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [act, collapsed]);

  // Keyboard: ← Prev, → Next, Esc Skip (RTL-friendly)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goNext();
      } else if (e.key === "Escape") {
        e.preventDefault();
        onSkip();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex]);

  return (
    <div className="pointer-events-auto">
      {/* Collapsed stub — shown when the user minimizes the overlay.
          Lets them scan the map freely but keeps a way back to the story. */}
      {collapsed ? (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={() => setCollapsed(false)}
          dir={locale === "en" ? "ltr" : "rtl"}
          className="flex items-center gap-2 bg-[#12394d]/95 backdrop-blur-xl border border-white/15 rounded-full px-4 py-2.5 shadow-[0_10px_30px_-8px_rgba(0,0,0,0.5)] text-white text-sm font-bold"
          aria-label={locale === "en" ? "Open story" : "فتح القصة"}
        >
          <span className="text-base">{destination.envIcon}</span>
          <span>{destination.name}</span>
          <span className="text-white/50 text-xs">{locale === "en" ? "· back to story" : "· رجّع القصة"}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </motion.button>
      ) : (
        <OverlayCard
          act={act}
          stepIndex={stepIndex}
          locale={locale}
          onCollapse={() => setCollapsed(true)}
          onPrev={canGoPrev ? goPrev : undefined}
          onNext={canGoNext ? goNext : undefined}
          onSkip={onSkip}
        >
          <AnimatePresence mode="wait">
            {act === "welcome" && (
              <ActSlide key="welcome">
                <div className="text-center">
                  <div className="text-[10px] uppercase tracking-[0.4em] text-[#91b149] font-bold mb-3">
                    Your Healing Map
                  </div>
                  <div className="text-5xl mb-4" aria-hidden="true">🗺️</div>
                  <h2 className="text-xl md:text-2xl font-display font-black text-white mb-2">
                    {locale === "en" ? "Welcome back" : "أهلاً بك من جديد"}
                  </h2>
                  <p className="text-white/65 text-sm leading-relaxed max-w-xs mx-auto">
                    {locale === "en"
                      ? "We remember your journey — let us show you the map from a new angle"
                      : "إحنا فاكرين رحلتك — خلينا نوريك الخريطة من زاوية مختلفة"}
                  </p>
                </div>
              </ActSlide>
            )}

            {act === "context" && (
              <ActSlide key="context">
                <div className="text-center">
                  <div className="text-[10px] uppercase tracking-[0.4em] text-[#91b149] font-bold mb-3">
                    {locale === "en" ? "From your previous answers" : "من إجاباتك السابقة"}
                  </div>
                  <div className="flex flex-col gap-2 mb-3">
                    <StatLine label={locale === "en" ? "You were looking for" : "كنت بتدور على"} value={needLabel} />
                    <StatLine label={locale === "en" ? "In an environment" : "في بيئة"} value={envLabel} />
                    <StatLine label={locale === "en" ? "We found your destination" : "لقيناك وجهة"} value={destination.name} />
                  </div>
                  <p className="text-white/50 text-xs">
                    {locale === "en" ? "Now we'll fly there on the map…" : "دلوقتي هنطير ليها على الخريطة…"}
                  </p>
                </div>
              </ActSlide>
            )}

            {act === "fly-to" && (
              <ActSlide key="fly-to" small>
                <div className="text-center">
                  <motion.div
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 1.4, repeat: Infinity }}
                    className="text-3xl mb-2"
                    aria-hidden="true"
                  >
                    {destination.envIcon}
                  </motion.div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-[#91b149] font-bold mb-1">
                    {locale === "en" ? "Flying to" : "نطير إلى"}
                  </div>
                  <div className="text-lg font-display font-black text-white">
                    {destination.name}
                  </div>
                </div>
              </ActSlide>
            )}

            {act === "reveal" && (
              <ActSlide key="reveal">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#91b149]/20 border border-[#91b149]/40 flex items-center justify-center text-2xl">
                    {destination.envIcon}
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.3em] text-[#91b149] font-bold">
                      {locale === "en" ? "Your destination ⭐" : "وجهتك ⭐"}
                    </div>
                    <div className="text-lg font-display font-black text-white">
                      {destination.name}
                    </div>
                  </div>
                </div>
                <p className="text-white/70 text-sm leading-relaxed mb-3">
                  {destination.pitch || destination.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {destination.treatments.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/10 text-white/80 border border-white/10"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => onActChange("sites")}
                    className="w-full py-2.5 bg-gradient-to-l from-[#91b149] to-[#6a8435] text-white font-bold rounded-full text-sm hover:shadow-[0_6px_18px_rgba(145,177,73,0.4)] transition-shadow"
                  >
                    {locale === "en" ? "Show me the therapeutic sites inside" : "ورّيني المواقع العلاجية جوّاها"}
                  </button>
                  <Link
                    href={`/destination/${destination.id}`}
                    className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full text-sm no-underline text-center transition-colors"
                  >
                    {locale === "en" ? `Discover all of ${destination.name}` : `اكتشف ${destination.name} بالكامل`}
                  </Link>
                </div>
              </ActSlide>
            )}

            {act === "sites" && (
              <ActSlide key="sites">
                <div className="text-[10px] uppercase tracking-[0.3em] text-[#91b149] font-bold mb-2">
                  {locale === "en" ? `${destination.name} therapeutic sites` : `مواقع ${destination.name} العلاجية`}
                </div>
                <h3 className="text-base font-display font-black text-white mb-3">
                  {locale === "en"
                    ? `${focusedSubSites.length} sites you can visit`
                    : `${focusedSubSites.length} موقع تقدر تزوره`}
                </h3>
                {focusedSubSites.length > 0 ? (
                  <div className="max-h-48 overflow-y-auto space-y-2 pr-1 mb-3 custom-scroll">
                    {focusedSubSites.map((site) => (
                      <div
                        key={site.id}
                        className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/5"
                      >
                        <span className="text-lg flex-shrink-0 w-7 text-center" aria-hidden="true">
                          {site.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-bold text-[13px] leading-tight">
                            {site.name}
                          </div>
                          <div className="text-white/50 text-[11px] mb-1">
                            {site.subtitle}
                          </div>
                          <div className="flex gap-1 flex-wrap">
                            {site.treatments.map((t) => (
                              <span
                                key={t}
                                className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#91b149]/20 text-[#91b149] font-bold"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-white/50 text-xs mb-3">
                    {locale === "en"
                      ? "We're still documenting the inner sites for this destination — coming soon."
                      : "لسه بنوثق المواقع الداخلية للوجهة دي — قريباً."}
                  </p>
                )}
                <button
                  onClick={() => onActChange("compare")}
                  className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full text-sm transition-colors"
                >
                  {locale === "en" ? "Compare with other suitable destinations" : "قارن مع وجهات تانية مناسبة"}
                </button>
              </ActSlide>
            )}

            {act === "compare" && (
              <ActSlide key="compare">
                <div className="text-[10px] uppercase tracking-[0.3em] text-[#91b149] font-bold mb-2">
                  {locale === "en" ? "Comparison" : "مقارنة"}
                </div>
                <h3 className="text-base font-display font-black text-white mb-3">
                  {locale === "en" ? "Other destinations suitable for you" : "وجهات تانية مناسبة لحالتك"}
                </h3>
                <div className="space-y-2 mb-3">
                  {compatibleDestinations.slice(0, 3).map((d) => (
                    <Link
                      key={d.id}
                      href={`/destination/${d.id}`}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 no-underline transition-colors"
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                        style={{ background: `${d.color}25` }}
                      >
                        {d.envIcon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-bold text-sm">
                          {d.name}
                        </div>
                        <div className="text-white/50 text-[11px] line-clamp-1">
                          {d.pitch || d.description}
                        </div>
                      </div>
                      <span className="text-white/40 text-xs">←</span>
                    </Link>
                  ))}
                </div>
                <button
                  onClick={onSkip}
                  className="w-full py-2 text-white/60 hover:text-white text-xs font-bold transition-colors"
                >
                  {locale === "en" ? "Explore the map freely" : "استكشف الخريطة بحرية"}
                </button>
              </ActSlide>
            )}
          </AnimatePresence>
        </OverlayCard>
      )}
    </div>
  );
}

/* ─ Layout pieces ─ */

function OverlayCard({
  act,
  stepIndex,
  locale,
  children,
  onCollapse,
  onPrev,
  onNext,
  onSkip,
}: {
  act: Act;
  stepIndex: number;
  locale: string;
  children: React.ReactNode;
  onCollapse: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  onSkip: () => void;
}) {
  return (
    <div
      className="bg-[#12394d]/95 dark:bg-[#0a151f]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_20px_60px_-12px_rgba(0,0,0,0.5)] overflow-hidden w-full max-w-sm flex flex-col max-h-[min(72vh,520px)]"
      dir={locale === "en" ? "ltr" : "rtl"}
      role="region"
      aria-label={locale === "en" ? "Map story" : "قصة الخريطة"}
    >
      {/* Header: progress dots + collapse */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5">
        <div className="flex items-center gap-1.5" aria-label={locale === "en" ? `Step ${stepIndex + 1} of ${ACT_ORDER.length}` : `الخطوة ${stepIndex + 1} من ${ACT_ORDER.length}`}>
          {ACT_ORDER.map((a, i) => (
            <span
              key={a}
              className={`h-1.5 rounded-full transition-all ${
                i === stepIndex
                  ? "w-6 bg-[#91b149]"
                  : i < stepIndex
                    ? "w-1.5 bg-white/40"
                    : "w-1.5 bg-white/15"
              }`}
              aria-hidden="true"
            />
          ))}
        </div>
        <button
          onClick={onCollapse}
          aria-label={locale === "en" ? "Minimize" : "تصغير"}
          className="text-white/50 hover:text-white p-1 rounded transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>

      {/* Body — announced to screen readers when act changes */}
      <div
        className="p-5 flex-1 overflow-y-auto overscroll-contain"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {children}
      </div>

      {/* Footer: Prev / Skip / Next */}
      <div className="flex items-center justify-between gap-2 px-4 py-2.5 border-t border-white/5 bg-black/20">
        <button
          onClick={onPrev}
          disabled={!onPrev}
          aria-label={locale === "en" ? "Previous step" : "الخطوة السابقة"}
          className="text-white/60 hover:text-white disabled:text-white/15 disabled:cursor-not-allowed text-xs font-bold flex items-center gap-1.5 transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <span>{locale === "en" ? "Previous" : "السابق"}</span>
        </button>
        <button
          onClick={onSkip}
          className="text-white/40 hover:text-white/80 text-[11px] font-bold transition-colors"
        >
          {locale === "en" ? "Skip story" : "تخطي القصة"}
        </button>
        <button
          onClick={onNext}
          disabled={!onNext}
          aria-label={locale === "en" ? "Next step" : "الخطوة التالية"}
          className="text-[#91b149] hover:text-[#a3c45a] disabled:text-white/15 disabled:cursor-not-allowed text-xs font-bold flex items-center gap-1.5 transition-colors"
        >
          <span>{locale === "en" ? "Next" : "التالي"}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      </div>

      <span className="sr-only">
        {locale === "en"
          ? `Step ${stepIndex + 1} of ${ACT_ORDER.length} — ${act}`
          : `الخطوة ${stepIndex + 1} من ${ACT_ORDER.length} — ${act}`}
      </span>
    </div>
  );
}

/**
 * Slides in from the RTL-natural direction (right → left).
 */
function ActSlide({
  children,
  small = false,
}: {
  children: React.ReactNode;
  small?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={small ? "max-w-xs mx-auto" : ""}
    >
      {children}
    </motion.div>
  );
}

function StatLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 bg-white/5 border border-white/5 rounded-lg px-3 py-2">
      <span className="text-[11px] text-white/55">{label}</span>
      <span className="text-sm text-white font-bold">{value}</span>
    </div>
  );
}
