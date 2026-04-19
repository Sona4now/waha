"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import SiteLayout from "@/components/site/SiteLayout";
import { DESTINATIONS } from "@/data/siteData";
import {
  useRecommendation,
  NEED_TO_TREATMENTS,
} from "@/hooks/useRecommendation";
import { THERAPEUTIC_SITES } from "@/lib/therapeuticSites";
import StoryOverlay, { type Act } from "@/components/map/StoryOverlay";
import MapToolbar from "@/components/map/MapToolbar";
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
  const searchParams = useSearchParams();
  const router = useRouter();

  const [act, setAct] = useState<Act>("welcome");
  const [freeExplore, setFreeExplore] = useState(false);
  const [manualHighlight, setManualHighlight] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [treatmentFilter, setTreatmentFilter] = useState<string | null>(null);
  // On mobile, the overlay/info card is a bottom sheet that can collapse.
  const [sheetCollapsed, setSheetCollapsed] = useState(false);

  // ── Deep-link: read URL params on first load ──
  useEffect(() => {
    const destId = searchParams.get("d");
    const q = searchParams.get("q");
    const f = searchParams.get("f");
    if (destId && DESTINATIONS.some((d) => d.id === destId)) {
      setFreeExplore(true);
      setManualHighlight(destId);
    }
    if (q) setSearchQuery(q);
    if (f) setTreatmentFilter(f);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Deep-link: write state back to URL (shallow, no reload) ──
  useEffect(() => {
    if (!loaded) return;
    const params = new URLSearchParams();
    if (freeExplore && manualHighlight) params.set("d", manualHighlight);
    if (searchQuery) params.set("q", searchQuery);
    if (treatmentFilter) params.set("f", treatmentFilter);
    const qs = params.toString();
    const newUrl = qs ? `/map?${qs}` : "/map";
    window.history.replaceState(null, "", newUrl);
  }, [loaded, freeExplore, manualHighlight, searchQuery, treatmentFilter]);

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
    return compatibleDestinations.filter((d) => d.id !== recommendedDest?.id);
  }, [compatibleDestinations, recommendedDest]);

  // What the camera and sub-site layer focus on right now.
  const highlighted = useMemo(() => {
    if (freeExplore) return manualHighlight;
    if (act === "welcome" || act === "context") return null;
    return recommendedDest?.id ?? null;
  }, [freeExplore, manualHighlight, act, recommendedDest]);

  // Show sub-sites when:
  // - Story is at sites/reveal acts, OR
  // - Free-exploring a destination (user clicked a pin) — big UX win!
  const showSubSites =
    (!freeExplore && (act === "sites" || act === "reveal")) ||
    (freeExplore && manualHighlight !== null);

  const focusedSubSites = useMemo(() => {
    if (!highlighted) return [];
    return THERAPEUTIC_SITES.filter((s) => s.destinationId === highlighted);
  }, [highlighted]);

  const handleSelectDestination = useCallback((id: string) => {
    setFreeExplore(true);
    setManualHighlight(id);
    setSheetCollapsed(false);
  }, []);

  const skipToExplore = useCallback(() => {
    setFreeExplore(true);
    setManualHighlight(null);
  }, []);

  const restartStory = useCallback(() => {
    setFreeExplore(false);
    setManualHighlight(null);
    setSearchQuery("");
    setTreatmentFilter(null);
    setAct("welcome");
    router.replace("/map");
  }, [router]);

  const handleShare = useCallback(async () => {
    const shareUrl = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: "خريطتي العلاجية — واحة",
          text: manualHighlight
            ? `اكتشف ${DESTINATIONS.find((d) => d.id === manualHighlight)?.name} على خريطة واحة`
            : "اكتشف خريطة الوجهات الاستشفائية في مصر",
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
      }
    } catch {
      /* user canceled or clipboard denied — silent */
    }
  }, [manualHighlight]);

  // Play a soft chime when the user crosses into a new narrative act.
  const prevActRef = useRef<Act>(act);
  useEffect(() => {
    if (prevActRef.current === act) return;
    prevActRef.current = act;
    if (freeExplore) return;
    const freqByAct: Record<Act, number> = {
      welcome: 659.25,
      context: 587.33,
      "fly-to": 783.99,
      reveal: 880.0,
      sites: 523.25,
      compare: 493.88,
    };
    playChime(freqByAct[act], 0.15, 1.4);
  }, [act, freeExplore]);

  if (!loaded) {
    return (
      <SiteLayout>
        <div className="fixed inset-0 bg-[#0a151f]" />
      </SiteLayout>
    );
  }

  if (!recommendation || !recommendedDest) {
    return (
      <SiteLayout>
        <NoRecommendationScreen />
      </SiteLayout>
    );
  }

  const highlightedDest = manualHighlight
    ? DESTINATIONS.find((d) => d.id === manualHighlight)
    : null;

  return (
    <SiteLayout>
      <div
        className="map-shell relative w-full bg-[#0a151f] touch-manipulation"
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
            treatmentFilter={treatmentFilter}
            searchQuery={searchQuery}
          />
        </div>

        {/* Soft vignette — only during welcome so the rest of the story
            keeps the map readable. */}
        {!freeExplore && act === "welcome" && (
          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-700"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 25%, rgba(10,21,31,0.40) 80%, rgba(10,21,31,0.65) 100%)",
            }}
          />
        )}

        {/* Top bar — home + restart + share */}
        <div
          className="absolute right-3 left-3 z-[1001] flex items-center justify-between gap-2 pointer-events-none"
          style={{ top: "max(12px, env(safe-area-inset-top))" }}
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

          <div className="flex items-center gap-2">
            {/* Share */}
            <button
              onClick={handleShare}
              className="pointer-events-auto bg-[#12394d]/90 backdrop-blur-md w-9 h-9 rounded-full text-white text-xs font-bold border border-white/15 hover:bg-[#12394d] transition-colors shadow-[0_4px_12px_rgba(0,0,0,0.25)] flex items-center justify-center"
              aria-label="شارك الخريطة"
              title="شارك"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
            </button>

            {freeExplore && (
              <button
                onClick={restartStory}
                className="pointer-events-auto bg-[#91b149] hover:bg-[#a3c45a] px-3 h-9 rounded-full text-[#0a0f14] text-xs font-bold border border-white/10 transition-colors inline-flex items-center gap-1.5 shadow-[0_4px_12px_rgba(145,177,73,0.3)]"
                aria-label="إعادة القصة"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="1 4 1 10 7 10" />
                  <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                </svg>
                <span className="hidden xs:inline">إعادة</span>
              </button>
            )}
          </div>
        </div>

        {/* Search + filter toolbar — only in free-explore mode so it doesn't
            compete with the narrative cards during the story. */}
        {freeExplore && (
          <MapToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            treatmentFilter={treatmentFilter}
            onFilterChange={setTreatmentFilter}
            onSearchFocus={() => setSheetCollapsed(true)}
          />
        )}

        {/* Narrative overlay (story mode) — collapsible bottom sheet on mobile */}
        {!freeExplore && (
          <BottomSheet
            collapsed={sheetCollapsed}
            onToggle={() => setSheetCollapsed((v) => !v)}
            collapsedLabel={`${recommendedDest.envIcon} ${recommendedDest.name}`}
          >
            <StoryOverlay
              act={act}
              onActChange={setAct}
              recommendation={recommendation}
              destination={recommendedDest}
              compatibleDestinations={alternateCompatible}
              focusedSubSites={focusedSubSites}
              onSkip={skipToExplore}
            />
          </BottomSheet>
        )}

        {/* Free-explore info sheet (destination pitch + sub-sites list) */}
        {freeExplore && (
          <BottomSheet
            collapsed={sheetCollapsed}
            onToggle={() => setSheetCollapsed((v) => !v)}
            collapsedLabel={
              highlightedDest
                ? `${highlightedDest.envIcon} ${highlightedDest.name}`
                : "وضع الاستكشاف الحر"
            }
          >
            <FreeExplorePanel
              highlightedDest={highlightedDest ?? null}
              subSites={focusedSubSites}
            />
          </BottomSheet>
        )}
      </div>
    </SiteLayout>
  );
}

/* ─────────────────────────────────────────────────────────
   Collapsible bottom-sheet wrapper used for both the story
   overlay and the free-explore info panel.

   · Desktop: floats as a fixed-size card in bottom-right.
   · Mobile: full-width at bottom with a drag-handle / chevron
     that toggles between expanded and a minimized pill.
   ───────────────────────────────────────────────────────── */

function BottomSheet({
  collapsed,
  onToggle,
  collapsedLabel,
  children,
}: {
  collapsed: boolean;
  onToggle: () => void;
  collapsedLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="absolute z-[1000] pointer-events-none"
      style={{
        bottom: "max(12px, env(safe-area-inset-bottom))",
        right: 0,
        left: 0,
      }}
      dir="rtl"
    >
      <AnimatePresence initial={false} mode="wait">
        {collapsed ? (
          <motion.div
            key="collapsed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            className="flex justify-center md:justify-end md:pr-6 px-4 pointer-events-none"
          >
            <button
              onClick={onToggle}
              dir="rtl"
              className="pointer-events-auto inline-flex items-center gap-2 bg-[#12394d]/95 backdrop-blur-xl border border-white/15 rounded-full px-4 py-2.5 shadow-[0_10px_30px_-8px_rgba(0,0,0,0.5)] text-white text-sm font-bold hover:bg-[#12394d]"
              aria-expanded="false"
              aria-label="فتح اللوحة"
            >
              <span>{collapsedLabel}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="18 15 12 9 6 15" />
              </svg>
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="px-4 md:px-0 md:pr-6 pointer-events-none"
          >
            <div className="md:max-w-sm md:mr-auto md:ml-0 mx-auto w-full pointer-events-auto relative">
              {/* Drag handle / collapse */}
              <button
                onClick={onToggle}
                className="md:hidden absolute -top-2 left-1/2 -translate-x-1/2 z-10 bg-[#12394d]/95 backdrop-blur-md w-12 h-5 rounded-full border border-white/15 flex items-center justify-center shadow-md hover:bg-[#12394d] transition-colors"
                aria-label="تصغير اللوحة"
              >
                <div className="w-8 h-1 bg-white/40 rounded-full" />
              </button>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Panel shown inside the bottom-sheet during free-explore.
   When a destination is selected it lists the sub-sites.
   ───────────────────────────────────────────────────────── */

function FreeExplorePanel({
  highlightedDest,
  subSites,
}: {
  highlightedDest: (typeof DESTINATIONS)[number] | null;
  subSites: typeof THERAPEUTIC_SITES;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-[#12394d]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-[0_20px_60px_-12px_rgba(0,0,0,0.5)] max-h-[min(62vh,480px)] overflow-y-auto"
      dir="rtl"
    >
      <div className="text-[10px] uppercase tracking-[0.3em] text-[#91b149] font-bold mb-2">
        وضع الاستكشاف الحر
      </div>
      {highlightedDest ? (
        <>
          <div className="font-display font-black text-white text-lg mb-1">
            {highlightedDest.envIcon} {highlightedDest.name}
          </div>
          <p className="text-white/60 text-xs leading-relaxed mb-3">
            {highlightedDest.pitch || highlightedDest.description}
          </p>

          {subSites.length > 0 && (
            <div className="mb-3">
              <div className="text-[10px] font-bold text-white/50 mb-2">
                {subSites.length} موقع علاجي داخل {highlightedDest.name}
              </div>
              <div className="space-y-1.5">
                {subSites.slice(0, 5).map((site) => (
                  <div
                    key={site.id}
                    className="flex items-start gap-2 p-2 rounded-lg bg-white/5 border border-white/5"
                  >
                    <span className="text-base flex-shrink-0" aria-hidden="true">
                      {site.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-bold text-xs leading-tight truncate">
                        {site.name}
                      </div>
                      <div className="text-white/50 text-[10px] truncate">
                        {site.subtitle}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Link
            href={`/destination/${highlightedDest.id}`}
            className="block w-full py-2.5 bg-gradient-to-l from-[#91b149] to-[#6a8435] text-white font-bold text-sm rounded-full no-underline text-center hover:shadow-[0_6px_18px_rgba(145,177,73,0.4)] transition-shadow"
          >
            اكتشف المزيد ←
          </Link>
        </>
      ) : (
        <p className="text-white/60 text-xs leading-relaxed">
          اضغط على أي pin لتعرف أكتر عن الوجهة — أو استخدم البحث والفلاتر فوق.
        </p>
      )}
    </motion.div>
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
          عشان نوريك الخريطة بشكل مخصص، محتاجين نعرف إحساسك الأول. خد الرحلة
          القصيرة (دقيقتين) وهنحكيلك القصة من جديد.
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
