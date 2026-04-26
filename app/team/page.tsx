"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SiteLayout from "@/components/site/SiteLayout";
import { useTranslations } from "@/components/site/LocaleProvider";
import TeamGate from "@/components/team/TeamGate";
import MagazineView from "@/components/team/MagazineView";
import HallOfFameView from "@/components/team/HallOfFameView";
import CreditsTickerView from "@/components/team/CreditsTickerView";
import CardDeckView from "@/components/team/CardDeckView";
import OrbClusterView from "@/components/team/OrbClusterView";
import MarqueeWallView from "@/components/team/MarqueeWallView";
import PolaroidWallView from "@/components/team/PolaroidWallView";
import TypographyGridView from "@/components/team/TypographyGridView";
import ScrollStoryView from "@/components/team/ScrollStoryView";
import InteractiveTreeView from "@/components/team/InteractiveTreeView";
import MinimalWallView from "@/components/team/MinimalWallView";

const TABS = [
  { id: "magazine", label: "مجلة", en: "Magazine", Component: MagazineView },
  { id: "hall", label: "قاعة المشاهير", en: "Hall of Fame", Component: HallOfFameView },
  { id: "credits", label: "تتر النهاية", en: "Credits", Component: CreditsTickerView },
  { id: "deck", label: "كروت", en: "Card Deck", Component: CardDeckView },
  { id: "orb", label: "دوائر", en: "Orbs", Component: OrbClusterView },
  { id: "marquee", label: "جدار", en: "Marquee", Component: MarqueeWallView },
  { id: "polaroid", label: "بولارويد", en: "Polaroid", Component: PolaroidWallView },
  { id: "typography", label: "تايبوغرافي", en: "Typography", Component: TypographyGridView },
  { id: "scroll", label: "قصة", en: "Scroll Story", Component: ScrollStoryView },
  { id: "tree", label: "شجرة", en: "Tree", Component: InteractiveTreeView },
  { id: "minimal", label: "بسيط", en: "Minimal", Component: MinimalWallView },
];

export default function TeamPage() {
  const { locale } = useTranslations();
  const [active, setActive] = useState(TABS[0].id);
  const activeTab = TABS.find((t) => t.id === active) || TABS[0];
  const ActiveComponent = activeTab.Component;

  return (
    <TeamGate>
    <SiteLayout>
      <div
        className="bg-[#070d15] min-h-screen"
        dir={locale === "en" ? "ltr" : "rtl"}
      >
        {/* Page header */}
        <div className="pt-20 pb-8 px-6 text-center">
          <div className="text-[10px] uppercase tracking-[0.4em] text-[#91b149] font-bold mb-3">
            · The Team ·
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-black text-white mb-4">
            {locale === "en" ? "Waha Team" : "فريق واحة"}
          </h1>
          <p className="text-white/50 text-sm max-w-md mx-auto">
            {locale === "en"
              ? "Pick a view style — 11 different team layouts"
              : "اختر طريقة العرض — 11 تصميم مختلف للفريق"}
          </p>
        </div>

        {/* Tab bar */}
        <div className="sticky top-16 z-40 bg-[#070d15]/90 backdrop-blur border-y border-white/10">
          <div className="max-w-[1400px] mx-auto px-4">
            <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActive(tab.id)}
                  className={`relative flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-bold transition-colors ${
                    active === tab.id
                      ? "text-[#0a0f14]"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  {active === tab.id && (
                    <motion.div
                      layoutId="tab-active"
                      className="absolute inset-0 bg-[#91b149] rounded-full"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative flex items-center gap-2">
                    <span>{locale === "en" ? tab.en : tab.label}</span>
                    <span className="text-[9px] uppercase tracking-widest opacity-60">
                      {locale === "en" ? tab.label : tab.en}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* View content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <ActiveComponent />
          </motion.div>
        </AnimatePresence>

        {/* Footer caption */}
        <div className="py-10 text-center text-[10px] uppercase tracking-[0.3em] text-white/30">
          ✦ WAHA · 2026 · 23 members ✦
        </div>
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </SiteLayout>
    </TeamGate>
  );
}
