"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import SiteLayout from "@/components/site/SiteLayout";
import PageHero from "@/components/site/PageHero";
import Reveal from "@/components/site/Reveal";
import { DESTINATIONS } from "@/data/siteData";

interface Symptom {
  id: string;
  label: string;
  icon: string;
  keywords: string[];
  severity: "low" | "medium" | "high";
}

const SYMPTOMS: Symptom[] = [
  { id: "joints", label: "آلام المفاصل", icon: "🦴", keywords: ["مفاصل"], severity: "high" },
  { id: "rheumatism", label: "الروماتيزم", icon: "🦴", keywords: ["مفاصل", "استرخاء"], severity: "high" },
  { id: "psoriasis", label: "الصدفية", icon: "✨", keywords: ["جلد"], severity: "high" },
  { id: "eczema", label: "الإكزيما", icon: "✨", keywords: ["جلد"], severity: "medium" },
  { id: "back-pain", label: "آلام الظهر", icon: "🧍", keywords: ["مفاصل", "استرخاء"], severity: "medium" },
  { id: "stress", label: "التوتر والضغط", icon: "😰", keywords: ["توتر", "استرخاء"], severity: "medium" },
  { id: "insomnia", label: "صعوبة النوم", icon: "🌙", keywords: ["توتر", "استرخاء"], severity: "medium" },
  { id: "breathing", label: "مشاكل التنفس", icon: "🫁", keywords: ["تنفس"], severity: "high" },
  { id: "asthma", label: "الربو", icon: "🫁", keywords: ["تنفس"], severity: "high" },
  { id: "sinus", label: "الجيوب الأنفية", icon: "👃", keywords: ["تنفس"], severity: "medium" },
  { id: "fatigue", label: "الإرهاق المزمن", icon: "😴", keywords: ["توتر", "استرخاء"], severity: "medium" },
  { id: "muscle-pain", label: "آلام العضلات", icon: "💪", keywords: ["مفاصل", "استرخاء"], severity: "medium" },
];

function calculateMatch(
  selectedKeywords: string[],
  destTreatments: string[]
): number {
  if (selectedKeywords.length === 0) return 0;
  const matched = selectedKeywords.filter((kw) =>
    destTreatments.some((t) => t.includes(kw) || kw.includes(t))
  );
  return Math.round((matched.length / selectedKeywords.length) * 100);
}

export default function SymptomsPage() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showResults, setShowResults] = useState(false);

  const toggle = (id: string) => {
    const newSet = new Set(selected);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelected(newSet);
  };

  const selectedKeywords = useMemo(() => {
    const keywords = new Set<string>();
    selected.forEach((id) => {
      const symptom = SYMPTOMS.find((s) => s.id === id);
      symptom?.keywords.forEach((k) => keywords.add(k));
    });
    return Array.from(keywords);
  }, [selected]);

  const results = useMemo(() => {
    if (selected.size === 0) return [];
    return DESTINATIONS.map((d) => ({
      ...d,
      score: calculateMatch(selectedKeywords, d.treatments),
    }))
      .filter((d) => d.score > 0)
      .sort((a, b) => b.score - a.score);
  }, [selected, selectedKeywords]);

  function handleAnalyze() {
    setShowResults(true);
    setTimeout(() => {
      document
        .getElementById("results-section")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  function handleReset() {
    setSelected(new Set());
    setShowResults(false);
  }

  return (
    <SiteLayout>
      <PageHero
        title="اكتشف وجهتك حسب حالتك"
        subtitle="اختار الأعراض اللي عندك وخلينا نرشحلك الوجهة المناسبة"
        breadcrumb={[
          { label: "الرئيسية", href: "/home" },
          { label: "فاحص الأعراض" },
        ]}
      />

      <section className="max-w-4xl mx-auto px-4 md:px-6 py-12">
        {/* Step indicator */}
        <Reveal>
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  selected.size > 0
                    ? "bg-[#91b149] text-white"
                    : "bg-[#1d5770] text-white"
                }`}
              >
                1
              </div>
              <span className="text-sm font-semibold text-[#12394d] dark:text-white">
                اختار الأعراض
              </span>
            </div>
            <div className="w-12 h-px bg-[#d0dde4]" />
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  showResults
                    ? "bg-[#91b149] text-white"
                    : "bg-[#d0dde4] dark:bg-[#1e3a5f] text-[#7b7c7d]"
                }`}
              >
                2
              </div>
              <span
                className={`text-sm ${
                  showResults
                    ? "font-semibold text-[#12394d] dark:text-white"
                    : "text-[#7b7c7d]"
                }`}
              >
                النتائج
              </span>
            </div>
          </div>
        </Reveal>

        {/* Symptoms grid */}
        <Reveal delay={0.1}>
          <div className="bg-white dark:bg-[#162033] rounded-2xl border border-[#d0dde4] dark:border-[#1e3a5f] p-6 md:p-8 mb-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-[#12394d] dark:text-white font-display">
                  ما الأعراض اللي بتحس بيها؟
                </h2>
                <p className="text-xs text-[#7b7c7d] mt-0.5">
                  اختار كل اللي ينطبق عليك
                </p>
              </div>
              <span className="text-xs text-[#7b7c7d]">
                {selected.size} مختار
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {SYMPTOMS.map((symptom) => {
                const isSelected = selected.has(symptom.id);
                return (
                  <motion.button
                    key={symptom.id}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => toggle(symptom.id)}
                    className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-300 ${
                      isSelected
                        ? "border-[#91b149] bg-[#91b149]/10 scale-[1.02]"
                        : "border-[#d0dde4] dark:border-[#1e3a5f] bg-[#f5f8fa] dark:bg-[#0a151f] hover:border-[#1d5770]/40"
                    }`}
                  >
                    <span className="text-3xl">{symptom.icon}</span>
                    <span className="text-xs font-semibold text-[#12394d] dark:text-white text-center">
                      {symptom.label}
                    </span>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2 left-2 w-5 h-5 rounded-full bg-[#91b149] flex items-center justify-center"
                      >
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAnalyze}
                disabled={selected.size === 0}
                className={`flex-1 py-3.5 rounded-full font-bold text-sm transition-all ${
                  selected.size > 0
                    ? "bg-gradient-to-l from-[#91b149] to-[#6a8435] text-white hover:shadow-lg hover:scale-[1.02]"
                    : "bg-[#d0dde4] dark:bg-[#1e3a5f] text-[#7b7c7d] cursor-not-allowed"
                }`}
              >
                حلل حالتي واقترح وجهة ({selected.size})
              </button>
              {selected.size > 0 && (
                <button
                  onClick={handleReset}
                  className="px-5 py-3.5 rounded-full border border-[#d0dde4] dark:border-[#1e3a5f] text-[#7b7c7d] hover:text-[#1d5770] hover:border-[#1d5770] text-sm font-semibold transition-all"
                >
                  مسح
                </button>
              )}
            </div>
          </div>
        </Reveal>

        {/* Results */}
        <AnimatePresence>
          {showResults && results.length > 0 && (
            <motion.div
              id="results-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#91b149]/10 text-[#91b149] text-xs font-bold mb-3">
                  <span className="w-2 h-2 rounded-full bg-[#91b149] animate-pulse" />
                  تم التحليل
                </div>
                <h2 className="text-2xl font-bold font-display text-[#12394d] dark:text-white mb-1">
                  الوجهات المناسبة لحالتك
                </h2>
                <p className="text-sm text-[#7b7c7d]">
                  مرتبة حسب التوافق مع أعراضك
                </p>
              </div>

              {results.map((dest, i) => (
                <motion.div
                  key={dest.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={`/destination/${dest.id}`}
                    className={`block rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                      i === 0
                        ? "ring-2 ring-[#91b149] shadow-xl bg-white dark:bg-[#162033]"
                        : "bg-white dark:bg-[#162033] border border-[#d0dde4] dark:border-[#1e3a5f]"
                    }`}
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="relative h-48 md:h-auto md:w-48 flex-shrink-0">
                        <Image
                          src={dest.image}
                          alt={dest.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 200px"
                          className="object-cover"
                        />
                        {i === 0 && (
                          <div className="absolute top-3 right-3 bg-[#91b149] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md">
                            ⭐ الأفضل لحالتك
                          </div>
                        )}
                      </div>
                      <div className="flex-1 p-5">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div>
                            <h3 className="text-xl font-bold font-display text-[#12394d] dark:text-white">
                              {dest.name}
                            </h3>
                            <p className="text-xs text-[#7b7c7d]">
                              {dest.environment} · {dest.nameEn}
                            </p>
                          </div>
                          <div className="text-left">
                            <div className="text-2xl font-black text-[#91b149]">
                              {dest.score}%
                            </div>
                            <div className="text-[9px] text-[#7b7c7d] uppercase">
                              توافق
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-[#7b7c7d] dark:text-white/60 mb-3 line-clamp-2">
                          {dest.description}
                        </p>

                        {/* Progress bar */}
                        <div className="h-1.5 bg-[#e4edf2] dark:bg-[#1e3a5f] rounded-full overflow-hidden mb-3">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${dest.score}%` }}
                            transition={{ delay: i * 0.1 + 0.3, duration: 0.8 }}
                            className="h-full bg-gradient-to-l from-[#91b149] to-[#6a8435]"
                          />
                        </div>

                        {/* Matched treatments */}
                        <div className="flex flex-wrap gap-1.5">
                          {dest.treatments.map((t) => {
                            const isMatched = selectedKeywords.some(
                              (k) => t.includes(k) || k.includes(t)
                            );
                            return (
                              <span
                                key={t}
                                className={`text-[10px] px-2 py-0.5 rounded-full ${
                                  isMatched
                                    ? "bg-[#91b149] text-white font-bold"
                                    : "bg-[#f5f8fa] dark:bg-[#0a151f] text-[#7b7c7d]"
                                }`}
                              >
                                {isMatched && "✓ "}
                                {t}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}

              {/* Medical disclaimer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-xl p-4 text-center"
              >
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  ⚠️ هذه التوصيات إرشادية. يُنصح باستشارة طبيب مختص قبل بدء أي علاج
                  طبيعي.
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </SiteLayout>
  );
}
