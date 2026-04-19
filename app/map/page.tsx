"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import SiteLayout from "@/components/site/SiteLayout";
import { DESTINATIONS } from "@/data/siteData";
import {
  useRecommendation,
  NEED_TO_TREATMENTS,
} from "@/hooks/useRecommendation";
import { THERAPEUTIC_SITES } from "@/lib/therapeuticSites";
import StoryOverlay, {
  type Act,
} from "@/components/map/StoryOverlay";
import { playChime } from "@/lib/meditation/chimes";

// Leaflet only runs in the browser.
const StoryMap = dynamic(() => import("@/components/map/StoryMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#1a2332] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-[3px] border-[#91b149] border-t-transparent rounded-full animate-spin" />
        <span className="text-white/60 text-sm">جاري تحضير الخريطة…</span>
      </div>
    </div>
  ),
});

export default function MapPage() {
  const { recommendation, loaded } = useRecommendation();
  const [act, setAct] = useState<Act>("welcome");
  const [freeExplore, setFreeExplore] = useState(false);
  const [manualHighlight, setManualHighlight] = useState<string | null>(null);

  const recommendedDest = useMemo(() => {
    if (!recommendation) return null;
    return (
      DESTINATIONS.find((d) => d.id === recommendation.destinationId) ?? null
    );
  }, [recommendation]);

  /**
   * Destinations that match the user's stored treatment need.
   * Used both to dim "irrelevant" pins and to suggest alternatives.
   */
  const compatibleDestinations = useMemo(() => {
    if (!recommendation?.need) return DESTINATIONS;
    const needTreatments = NEED_TO_TREATMENTS[recommendation.need] || [];
    return DESTINATIONS.filter((d) =>
      d.treatments.some((t) => needTreatments.includes(t)),
    );
  }, [recommendation]);

  const alternateCompatible = useMemo(() => {
    return compatibleDestinations.filter(
      (d) => d.id !== recommendedDest?.id,
    );
  }, [compatibleDestinations, recommendedDest]);

  // What the camera and sub-site layer focus on right now.
  const highlighted = useMemo(() => {
    if (freeExplore) return manualHighlight;
    if (act === "welcome" || act === "context") return null;
    return recommendedDest?.id ?? null;
  }, [freeExplore, manualHighlight, act, recommendedDest]);

  const showSubSites = !freeExplore && (act === "sites" || act === "reveal");

  const focusedSubSites = useMemo(() => {
    if (!highlighted) return [];
    return THERAPEUTIC_SITES.filter((s) => s.destinationId === highlighted);
  }, [highlighted]);

  const handleSelectDestination = useCallback((id: string) => {
    setFreeExplore(true);
    setManualHighlight(id);
  }, []);

  const skipToExplore = useCallback(() => {
    setFreeExplore(true);
    setManualHighlight(null);
  }, []);

  const restartStory = useCallback(() => {
    setFreeExplore(false);
    setManualHighlight(null);
    setAct("welcome");
  }, []);

  // Play a soft chime when the user crosses into a new narrative act.
  // Different frequencies for different "feelings" of the acts.
  const prevActRef = useRef<Act>(act);
  useEffect(() => {
    if (prevActRef.current === act) return;
    prevActRef.current = act;
    if (freeExplore) return;
    const freqByAct: Record<Act, number> = {
      welcome: 659.25, // E5 — inviting
      context: 587.33, // D5 — settled
      "fly-to": 783.99, // G5 — uplifting
      reveal: 880.0, // A5 — resolved
      sites: 523.25, // C5 — grounded
      compare: 493.88, // B4 — reflective
    };
    playChime(freqByAct[act], 0.15, 1.4);
  }, [act, freeExplore]);

  // Before the localStorage check resolves, keep the shell silent.
  if (!loaded) {
    return (
      <SiteLayout>
        <div className="fixed inset-0 bg-[#0a151f]" />
      </SiteLayout>
    );
  }

  // ── No recommendation → friendly prompt, never the same quiz ──
  if (!recommendation || !recommendedDest) {
    return (
      <SiteLayout>
        <NoRecommendationScreen />
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div
        className="relative w-full bg-[#0a151f]"
        style={{ height: "calc(100vh - 72px)" }}
        dir="rtl"
      >
        {/* Map fills the screen as a canvas */}
        <div className="absolute inset-0">
          <StoryMap
            destinations={DESTINATIONS}
            subSites={THERAPEUTIC_SITES}
            recommendation={recommendation}
            highlighted={highlighted}
            showSubSites={showSubSites}
            onSelectDestination={handleSelectDestination}
          />
        </div>

        {/* Soft vignette — only during the welcome act so the rest of
            the story keeps the map fully readable. */}
        {!freeExplore && act === "welcome" && (
          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-700"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 25%, rgba(10,21,31,0.40) 80%, rgba(10,21,31,0.65) 100%)",
            }}
          />
        )}

        {/* Top bar — respects iOS safe-area notch */}
        <div
          className="absolute right-3 left-3 z-[1000] flex items-center justify-between gap-2 pointer-events-none"
          style={{
            top: "max(12px, env(safe-area-inset-top))",
          }}
        >
          <Link
            href="/home"
            className="pointer-events-auto inline-flex items-center gap-1.5 bg-[#12394d]/90 backdrop-blur-md px-3 h-9 rounded-full text-white text-xs font-bold border border-white/15 hover:bg-[#12394d] no-underline transition-colors shadow-[0_4px_12px_rgba(0,0,0,0.25)]"
            aria-label="العودة للرئيسية"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="9 18 15 12 9 6" />
            </svg>
            <span className="hidden xs:inline sm:inline">الرئيسية</span>
          </Link>
          {freeExplore ? (
            <button
              onClick={restartStory}
              className="pointer-events-auto bg-[#91b149] hover:bg-[#a3c45a] px-3 h-9 rounded-full text-[#0a0f14] text-xs font-bold border border-white/10 transition-colors inline-flex items-center gap-1.5 shadow-[0_4px_12px_rgba(145,177,73,0.3)]"
              aria-label="إعادة القصة"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
              </svg>
              <span>إعادة القصة</span>
            </button>
          ) : null}
        </div>

        {/* Narrative overlay (bottom-right on desktop, bottom on mobile) */}
        {!freeExplore && (
          <div className="absolute bottom-4 right-4 left-4 md:left-auto md:right-6 md:bottom-6 md:max-w-sm z-[1000] pointer-events-none">
            <StoryOverlay
              act={act}
              onActChange={setAct}
              recommendation={recommendation}
              destination={recommendedDest}
              compatibleDestinations={alternateCompatible}
              focusedSubSites={focusedSubSites}
              onSkip={skipToExplore}
            />
          </div>
        )}

        {/* Free-explore mini-panel */}
        {freeExplore && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-4 right-4 left-4 md:left-auto md:right-6 md:max-w-sm z-[1000] bg-[#12394d]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-[0_20px_60px_-12px_rgba(0,0,0,0.5)]"
          >
            <div className="text-[10px] uppercase tracking-[0.3em] text-[#91b149] font-bold mb-2">
              وضع الاستكشاف الحر
            </div>
            {manualHighlight ? (
              <>
                <div className="font-display font-black text-white text-lg mb-1">
                  {DESTINATIONS.find((d) => d.id === manualHighlight)?.name}
                </div>
                <p className="text-white/60 text-xs leading-relaxed mb-3">
                  {DESTINATIONS.find((d) => d.id === manualHighlight)?.pitch ||
                    DESTINATIONS.find((d) => d.id === manualHighlight)?.description}
                </p>
                <Link
                  href={`/destination/${manualHighlight}`}
                  className="block w-full py-2.5 bg-gradient-to-l from-[#91b149] to-[#6a8435] text-white font-bold text-sm rounded-full no-underline text-center hover:shadow-[0_6px_18px_rgba(145,177,73,0.4)] transition-shadow"
                >
                  اكتشف المزيد
                </Link>
              </>
            ) : (
              <p className="text-white/60 text-xs leading-relaxed">
                اضغط على أي pin لتعرف أكتر عن الوجهة.
              </p>
            )}
          </motion.div>
        )}
      </div>
    </SiteLayout>
  );
}

/* ─────────────────────────────────────────────────────────
   Fallback shown when the user hasn't completed the intro yet
   ───────────────────────────────────────────────────────── */

function NoRecommendationScreen() {
  return (
    <div
      className="min-h-[calc(100vh-72px)] bg-[#070d15] flex items-center justify-center px-4 py-16"
      dir="rtl"
    >
      <div className="max-w-md text-center">
        <div className="text-[10px] uppercase tracking-[0.4em] text-[#91b149] font-bold mb-3">
          Your Healing Map
        </div>
        <div className="text-6xl mb-6">🗺️</div>
        <h1 className="font-display text-3xl font-black text-white mb-3">
          الخريطة بتحكي قصتك
        </h1>
        <p className="text-white/60 text-sm leading-relaxed mb-8">
          عشان نوريك الخريطة بشكل مخصص، محتاجين نعرف إحساسك الأول.
          خد الرحلة القصيرة (دقيقتين) وهنحكيلك القصة من جديد.
        </p>
        <div className="flex flex-col gap-3 max-w-xs mx-auto">
          <Link
            href="/"
            className="w-full py-3 bg-gradient-to-l from-[#91b149] to-[#6a8435] text-white font-bold rounded-full no-underline hover:shadow-[0_8px_24px_rgba(145,177,73,0.4)] transition-shadow"
          >
            ابدأ الرحلة
          </Link>
          <Link
            href="/destinations"
            className="w-full py-3 bg-white/10 hover:bg-white/15 text-white font-bold rounded-full no-underline border border-white/10 transition-colors"
          >
            تصفح كل الوجهات يدوياً
          </Link>
        </div>
      </div>
    </div>
  );
}
