"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import type { DestinationFull } from "@/data/siteData";
import type { TherapeuticSite } from "@/lib/therapeuticSites";
import {
  NEED_LABELS,
  ENVIRONMENT_LABELS,
  type Recommendation,
} from "@/hooks/useRecommendation";

export type Act =
  | "welcome"
  | "context"
  | "fly-to"
  | "reveal"
  | "sites"
  | "compare"
  | "explore";

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
 * Never asks them for information they already gave in the cinematic intro —
 * it plays their answers back to them.
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
  const needLabel = recommendation.need
    ? NEED_LABELS[recommendation.need] || "الشفاء"
    : "الشفاء";
  const envLabel = recommendation.environment
    ? ENVIRONMENT_LABELS[recommendation.environment] || "الطبيعة"
    : "الطبيعة";

  // Auto-advance early acts so the user doesn't have to tap constantly.
  useEffect(() => {
    const autoAdvance: Partial<Record<Act, { to: Act; delay: number }>> = {
      welcome: { to: "context", delay: 2800 },
      context: { to: "fly-to", delay: 3500 },
      "fly-to": { to: "reveal", delay: 2400 },
    };
    const next = autoAdvance[act];
    if (!next) return;
    const t = setTimeout(() => onActChange(next.to), next.delay);
    return () => clearTimeout(t);
  }, [act, onActChange]);

  return (
    <AnimatePresence mode="wait">
      {act === "welcome" && (
        <OverlayCard key="welcome">
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-[0.4em] text-[#91b149] font-bold mb-3">
              Your Healing Map
            </div>
            <div className="text-6xl mb-4">🗺️</div>
            <h2 className="text-2xl md:text-3xl font-display font-black text-white mb-2">
              أهلاً بك من جديد
            </h2>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs mx-auto">
              إحنا فاكرين رحلتك — خلينا نوريك الخريطة من زاوية مختلفة المرة دي
            </p>
          </div>
        </OverlayCard>
      )}

      {act === "context" && (
        <OverlayCard key="context">
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-[0.4em] text-[#91b149] font-bold mb-3">
              من إجاباتك السابقة
            </div>
            <div className="flex flex-col gap-2 mb-5">
              <StatLine label="كنت بتدور على" value={needLabel} />
              <StatLine label="في بيئة" value={envLabel} />
              <StatLine label="لقيناك وجهة" value={destination.name} />
            </div>
            <p className="text-white/50 text-xs">دلوقتي هنطير ليها على الخريطة…</p>
          </div>
        </OverlayCard>
      )}

      {act === "fly-to" && (
        <OverlayCard key="fly-to" small>
          <div className="text-center">
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
              className="text-4xl mb-2"
            >
              {destination.envIcon}
            </motion.div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-[#91b149] font-bold mb-1">
              نطير إلى
            </div>
            <div className="text-xl font-display font-black text-white">
              {destination.name}
            </div>
          </div>
        </OverlayCard>
      )}

      {act === "reveal" && (
        <OverlayCard key="reveal">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#91b149]/20 border border-[#91b149]/40 flex items-center justify-center text-2xl">
                {destination.envIcon}
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-[#91b149] font-bold">
                  وجهتك
                </div>
                <div className="text-xl font-display font-black text-white">
                  {destination.name}
                </div>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-4">
              {destination.pitch || destination.description}
            </p>
            <div className="flex flex-wrap gap-1.5 mb-5">
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
                ورّيني المواقع العلاجية جوّاها
              </button>
              <Link
                href={`/destination/${destination.id}`}
                className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full text-sm no-underline text-center transition-colors"
              >
                اكتشف {destination.name} بالكامل
              </Link>
            </div>
          </div>
        </OverlayCard>
      )}

      {act === "sites" && (
        <OverlayCard key="sites">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-[#91b149] font-bold mb-2">
              مواقع {destination.name} العلاجية
            </div>
            <h3 className="text-lg font-display font-black text-white mb-4">
              {focusedSubSites.length} موقع تقدر تزوره
            </h3>
            {focusedSubSites.length > 0 ? (
              <div className="max-h-56 overflow-y-auto space-y-2 pr-1 mb-4 custom-scroll">
                {focusedSubSites.map((site) => (
                  <div
                    key={site.id}
                    className="flex items-start gap-3 p-2.5 rounded-xl bg-white/5 border border-white/5"
                  >
                    <span className="text-xl flex-shrink-0 w-7 text-center">
                      {site.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-bold text-sm leading-tight">
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
              <p className="text-white/50 text-xs mb-4">
                لسه بنوثق المواقع الداخلية للوجهة دي — قريباً.
              </p>
            )}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => onActChange("compare")}
                className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full text-sm transition-colors"
              >
                قارن مع وجهات تانية مناسبة
              </button>
              <button
                onClick={onSkip}
                className="w-full py-2 text-white/40 hover:text-white/70 text-xs transition-colors"
              >
                اسكتف الخريطة بحرية
              </button>
            </div>
          </div>
        </OverlayCard>
      )}

      {act === "compare" && (
        <OverlayCard key="compare">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-[#91b149] font-bold mb-2">
              مقارنة
            </div>
            <h3 className="text-lg font-display font-black text-white mb-4">
              وجهات تانية مناسبة لحالتك
            </h3>
            <div className="space-y-2 mb-4">
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
                    <div className="text-white font-bold text-sm">{d.name}</div>
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
              className="w-full py-2 text-white/40 hover:text-white/70 text-xs transition-colors"
            >
              استكشف الخريطة بحرية
            </button>
          </div>
        </OverlayCard>
      )}
    </AnimatePresence>
  );
}

/* ─ helpers ─ */

function OverlayCard({
  children,
  small = false,
}: {
  children: React.ReactNode;
  small?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`pointer-events-auto bg-[#12394d]/95 dark:bg-[#0a151f]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_20px_60px_-12px_rgba(0,0,0,0.5)] p-5 ${
        small ? "max-w-xs" : "max-w-sm"
      }`}
      dir="rtl"
    >
      {children}
    </motion.div>
  );
}

function StatLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 bg-white/5 border border-white/5 rounded-lg px-3 py-2">
      <span className="text-[11px] text-white/50">{label}</span>
      <span className="text-sm text-white font-bold">{value}</span>
    </div>
  );
}
