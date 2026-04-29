"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SiteLayout from "@/components/site/SiteLayout";
import PageHero from "@/components/site/PageHero";
import Reveal from "@/components/site/Reveal";
import {
  ACHIEVEMENTS,
  getUnlockedAchievements,
  getUserState,
  type UserState,
} from "@/lib/achievements";
import { useTranslations } from "@/components/site/LocaleProvider";

export default function AchievementsPage() {
  const { t, locale } = useTranslations();
  const [unlocked] = useState<string[]>(() => getUnlockedAchievements());
  const [state] = useState<UserState | null>(() => getUserState());

  const unlockedSet = new Set(unlocked);
  const progress = Math.round(
    (unlocked.length / ACHIEVEMENTS.length) * 100
  );

  return (
    <SiteLayout>
      <PageHero
        title={t("achievementsPage.title")}
        subtitle={t("achievementsPage.subtitle")}
        breadcrumb={[
          { label: t("nav.home"), href: "/home" },
          { label: t("nav.achievements") },
        ]}
      />

      <section
        className="py-16 bg-white dark:bg-[#0d1b2a]"
        dir={locale === "en" ? "ltr" : "rtl"}
      >
        <div className="max-w-5xl mx-auto px-6">
          {/* Progress Summary */}
          <Reveal>
            <div className="bg-gradient-to-br from-[#1d5770] via-[#12394d] to-[#0d2a39] rounded-3xl p-8 md:p-10 text-white mb-12 relative overflow-hidden">
              <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-[#91b149]/10 blur-3xl" />
              <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-[#91b149]/10 blur-3xl" />

              <div className="relative text-center">
                <div className="text-6xl mb-3">🏆</div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-[#91b149] font-bold mb-2">
                  {locale === "en" ? "Your progress" : "تقدمك"}
                </div>
                <div className="flex items-baseline justify-center gap-2 mb-4">
                  <span className="text-6xl md:text-7xl font-black">
                    {unlocked.length}
                  </span>
                  <span className="text-2xl text-white/50">
                    / {ACHIEVEMENTS.length}
                  </span>
                </div>
                <p className="text-white/70 mb-6">
                  {locale === "en" ? "achievements unlocked" : "إنجاز مفتوح"}
                </p>

                {/* Progress bar */}
                <div className="max-w-md mx-auto">
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{
                        duration: 1.2,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="h-full bg-gradient-to-l from-[#91b149] to-[#a3c45a] rounded-full"
                    />
                  </div>
                  <div className="mt-2 text-sm text-white/60">
                    {locale === "en"
                      ? `${progress}% complete`
                      : `${progress}% مكتمل`}
                  </div>
                </div>

                {state && state.visitCount > 0 && (
                  <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs">
                    <span className="px-3 py-1 rounded-full bg-white/10">
                      {locale === "en"
                        ? `Visits: ${state.visitCount}`
                        : `زيارات: ${state.visitCount}`}
                    </span>
                    {state.destinationsVisited.length > 0 && (
                      <span className="px-3 py-1 rounded-full bg-white/10">
                        {locale === "en"
                          ? `Destinations: ${state.destinationsVisited.length}/5`
                          : `وجهات: ${state.destinationsVisited.length}/5`}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Reveal>

          {/* Achievements Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {ACHIEVEMENTS.map((achievement, i) => {
              const isUnlocked = unlockedSet.has(achievement.id);
              return (
                <Reveal key={achievement.id} delay={i * 0.06}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className={`relative rounded-2xl p-6 border-2 transition-all h-full ${
                      isUnlocked
                        ? "bg-gradient-to-br from-[#91b149]/10 to-[#1d5770]/10 dark:from-[#91b149]/15 dark:to-[#1d5770]/15 border-[#91b149]/30 hover:border-[#91b149]/60"
                        : "bg-[#f5f8fa] dark:bg-[#162033] border-[#d0dde4] dark:border-[#1e3a5f] opacity-60"
                    }`}
                  >
                    {/* Lock overlay */}
                    {!isUnlocked && (
                      <div className="absolute top-3 left-3 w-7 h-7 rounded-full bg-[#12394d]/10 dark:bg-white/10 flex items-center justify-center">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-[#7b7c7d]"
                        >
                          <rect
                            x="3"
                            y="11"
                            width="18"
                            height="11"
                            rx="2"
                            ry="2"
                          />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                      </div>
                    )}

                    {/* Unlocked check */}
                    {isUnlocked && (
                      <div className="absolute top-3 left-3 w-7 h-7 rounded-full bg-[#91b149] flex items-center justify-center shadow-md">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    )}

                    <div
                      className={`text-5xl mb-4 ${isUnlocked ? "" : "grayscale"}`}
                    >
                      {achievement.icon}
                    </div>
                    <h3 className="font-bold font-display text-lg text-[#12394d] dark:text-white mb-1">
                      {locale === "en"
                        ? achievement.titleEn ?? achievement.title
                        : achievement.title}
                    </h3>
                    <p className="text-sm text-[#7b7c7d] dark:text-white/60 leading-relaxed">
                      {locale === "en"
                        ? achievement.descriptionEn ?? achievement.description
                        : achievement.description}
                    </p>
                  </motion.div>
                </Reveal>
              );
            })}
          </div>

          {/* Empty state */}
          {unlocked.length === 0 && (
            <Reveal delay={0.5}>
              <div className="mt-8 text-center p-6 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-2xl">
                <p className="text-sm text-amber-700 dark:text-amber-400">
                  {locale === "en"
                    ? "💡 Start exploring the site to unlock your first achievements"
                    : "💡 ابدأ استكشاف الموقع لفتح إنجازاتك الأولى"}
                </p>
              </div>
            </Reveal>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
