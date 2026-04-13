"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import SiteLayout from "@/components/site/SiteLayout";
import { DESTINATIONS } from "@/data/siteData";

/* ── Quiz questions ── */
const QUESTIONS = [
  {
    id: "pain",
    text: "وين أكتر مكان بيوجعك؟",
    options: [
      { label: "المفاصل والعضلات", value: "joints", emoji: "🦴" },
      { label: "الجلد والبشرة", value: "skin", emoji: "🧴" },
      { label: "الصدر والتنفس", value: "chest", emoji: "🫁" },
      { label: "الأعصاب والتوتر", value: "stress", emoji: "🧠" },
    ],
  },
  {
    id: "environment",
    text: "أي بيئة بتحس فيها بالراحة؟",
    options: [
      { label: "البحر والمياه", value: "sea", emoji: "🌊" },
      { label: "الصحراء والصمت", value: "desert", emoji: "🏜️" },
      { label: "الجبال والهواء", value: "mountain", emoji: "⛰️" },
      { label: "الخضرة والطبيعة", value: "green", emoji: "🌴" },
    ],
  },
  {
    id: "energy",
    text: "مستوى طاقتك إزاي عادةً؟",
    options: [
      { label: "منخفض — محتاج تنشيط", value: "low", emoji: "🔋" },
      { label: "متوسط — بس بتعب بسرعة", value: "mid", emoji: "⚡" },
      { label: "عالي — بس مش مركز", value: "high", emoji: "💥" },
      { label: "متقلب — يوم كويس ويوم لأ", value: "varying", emoji: "🎭" },
    ],
  },
  {
    id: "time",
    text: "إمتى بتحس بأسوأ حالاتك؟",
    options: [
      { label: "الصبح — مش قادر أبدأ يومي", value: "morning", emoji: "🌅" },
      { label: "بالليل — مش قادر أنام", value: "night", emoji: "🌙" },
      { label: "طول اليوم — مفيش راحة", value: "allday", emoji: "☀️" },
      { label: "مواسم معينة", value: "seasonal", emoji: "🍂" },
    ],
  },
  {
    id: "goal",
    text: "إيه هدفك الأساسي؟",
    options: [
      { label: "علاج ألم مزمن", value: "heal", emoji: "💊" },
      { label: "استرخاء وتجديد", value: "relax", emoji: "🧘" },
      { label: "تحسين البشرة", value: "skin", emoji: "✨" },
      { label: "اكتشاف ومغامرة", value: "explore", emoji: "🗺️" },
    ],
  },
];

/* ── DNA Canvas Art ── */
function DNACanvas({
  answers,
  size = 300,
}: {
  answers: Record<string, string>;
  size?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const time = Date.now() * 0.001;

    // Derive colors from answers
    const envColors: Record<string, string[]> = {
      sea: ["#0ea5e9", "#38bdf8", "#1d5770"],
      desert: ["#f59e0b", "#fbbf24", "#92400e"],
      mountain: ["#78716c", "#a8a29e", "#44403c"],
      green: ["#34d399", "#10b981", "#065f46"],
    };
    const painColors: Record<string, string> = {
      joints: "#ef4444",
      skin: "#f97316",
      chest: "#3b82f6",
      stress: "#a855f7",
    };

    const env = answers.environment || "sea";
    const pain = answers.pain || "joints";
    const colors = envColors[env] || envColors.sea;
    const accentColor = painColors[pain] || "#ef4444";

    // Clear
    ctx.fillStyle = "#0a151f";
    ctx.fillRect(0, 0, size, size);

    // Draw concentric DNA rings
    const rings = 8;
    for (let r = 0; r < rings; r++) {
      const radius = 30 + r * 16;
      const segments = 60 + r * 10;
      const speed = (r % 2 === 0 ? 1 : -1) * (0.3 + r * 0.05);

      for (let i = 0; i < segments; i++) {
        const angle = (i / segments) * Math.PI * 2 + time * speed;
        const wobble = Math.sin(angle * 3 + time * 2) * 4;
        const x = cx + Math.cos(angle) * (radius + wobble);
        const y = cy + Math.sin(angle) * (radius + wobble);

        const alpha = 0.3 + Math.sin(angle * 2 + time) * 0.2;
        const colorIdx = (r + i) % colors.length;
        const dotSize = 1 + Math.sin(angle * 4 + time * 3) * 0.8;

        ctx.beginPath();
        ctx.arc(x, y, dotSize, 0, Math.PI * 2);
        ctx.fillStyle =
          r < 3
            ? colors[colorIdx]
            : r < 6
              ? `${accentColor}`
              : colors[0];
        ctx.globalAlpha = alpha;
        ctx.fill();
      }
    }

    // Center glow
    ctx.globalAlpha = 1;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 35);
    grad.addColorStop(0, colors[0] + "40");
    grad.addColorStop(1, "transparent");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, 35, 0, Math.PI * 2);
    ctx.fill();

    // Center icon
    ctx.globalAlpha = 1;
    ctx.fillStyle = "white";
    ctx.font = "bold 28px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const envEmojis: Record<string, string> = {
      sea: "🌊",
      desert: "🏜️",
      mountain: "⛰️",
      green: "🌴",
    };
    ctx.fillText(envEmojis[env] || "🌿", cx, cy);

    // Outer border glow
    ctx.globalAlpha = 0.2;
    ctx.strokeStyle = colors[0];
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, size / 2 - 10, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }, [answers, size]);

  return (
    <canvas
      ref={canvasRef}
      className="rounded-full"
      style={{ width: size, height: size }}
    />
  );
}

/* ── Score calculator ── */
function calculateResults(answers: Record<string, string>) {
  const scores: Record<string, number> = {};
  DESTINATIONS.forEach((d) => (scores[d.id] = 0));

  // Pain → treatments
  const painMap: Record<string, string[]> = {
    joints: ["مفاصل"],
    skin: ["جلد"],
    chest: ["تنفس"],
    stress: ["توتر", "استرخاء"],
  };
  const painTreatments = painMap[answers.pain] || [];
  DESTINATIONS.forEach((d) => {
    painTreatments.forEach((t) => {
      if (d.treatments.includes(t)) scores[d.id] += 30;
    });
  });

  // Environment preference
  const envMap: Record<string, string[]> = {
    sea: ["safaga"],
    desert: ["siwa", "bahariya"],
    mountain: ["sinai"],
    green: ["fayoum", "siwa"],
  };
  (envMap[answers.environment] || []).forEach((id) => {
    if (scores[id] !== undefined) scores[id] += 25;
  });

  // Goal bonus
  if (answers.goal === "heal") {
    scores["safaga"] += 15;
    scores["bahariya"] += 10;
  }
  if (answers.goal === "relax") {
    scores["siwa"] += 15;
    scores["fayoum"] += 10;
  }
  if (answers.goal === "skin") {
    scores["safaga"] += 20;
  }
  if (answers.goal === "explore") {
    scores["sinai"] += 15;
    scores["bahariya"] += 10;
  }

  // Normalize to percentages
  const max = Math.max(...Object.values(scores), 1);
  const results = DESTINATIONS.map((d) => ({
    dest: d,
    score: Math.round((scores[d.id] / max) * 100),
  })).sort((a, b) => b.score - a.score);

  return results;
}

/* ── Main page ── */
export default function HealingDNAPage() {
  const [step, setStep] = useState(0); // 0-4 = questions, 5 = generating, 6 = result
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<
    { dest: (typeof DESTINATIONS)[0]; score: number }[]
  >([]);

  const handleAnswer = (questionId: string, value: string) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    if (step < QUESTIONS.length - 1) {
      setTimeout(() => setStep((s) => s + 1), 400);
    } else {
      // Last question → generate
      setStep(QUESTIONS.length);
      setTimeout(() => {
        setResults(calculateResults(newAnswers));
        setStep(QUESTIONS.length + 1);
      }, 3000);
    }
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setResults([]);
  };

  const question = QUESTIONS[step];
  const isGenerating = step === QUESTIONS.length;
  const isResult = step === QUESTIONS.length + 1;
  const top = results[0];

  return (
    <SiteLayout>
      <div className="min-h-screen bg-[#070d15] relative overflow-hidden" dir="rtl">
        {/* Ambient */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(145,177,73,0.05)_0%,_transparent_60%)]" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-20">
          {/* Header */}
          {!isResult && !isGenerating && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <div className="text-[10px] uppercase tracking-[0.5em] text-[#91b149] font-bold mb-3">
                · Healing DNA ·
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-black text-white mb-4">
                بصمتك العلاجية
              </h1>
              <p className="text-white/40 text-sm">
                5 أسئلة سريعة — وهنولّد لك بصمة شفاء فريدة
              </p>

              {/* Progress */}
              <div className="flex gap-2 justify-center mt-8">
                {QUESTIONS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      i < step
                        ? "w-8 bg-[#91b149]"
                        : i === step
                          ? "w-8 bg-[#91b149]/50"
                          : "w-4 bg-white/10"
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Question */}
          <AnimatePresence mode="wait">
            {question && !isGenerating && !isResult && (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ type: "spring", stiffness: 200, damping: 22 }}
                className="max-w-lg mx-auto"
              >
                <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-8 font-display">
                  {question.text}
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {question.options.map((opt) => (
                    <motion.button
                      key={opt.value}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleAnswer(question.id, opt.value)}
                      className={`p-5 rounded-2xl border text-center transition-all ${
                        answers[question.id] === opt.value
                          ? "bg-[#91b149]/20 border-[#91b149] text-white"
                          : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className="text-3xl mb-2">{opt.emoji}</div>
                      <div className="text-sm font-bold">{opt.label}</div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Generating animation */}
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="w-32 h-32 rounded-full border-2 border-[#91b149]/30 border-t-[#91b149] mb-8"
              />
              <h2 className="text-xl font-bold text-white font-display mb-2">
                بنولّد بصمتك العلاجية...
              </h2>
              <p className="text-white/40 text-sm">بنحلل إجاباتك ونطابقها مع الوجهات</p>
            </motion.div>
          )}

          {/* Results */}
          {isResult && top && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* DNA Art + Title */}
              <div className="flex flex-col items-center mb-10">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.3 }}
                >
                  <DNACanvas answers={answers} size={240} />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="text-center mt-6"
                >
                  <div className="text-[10px] uppercase tracking-[0.4em] text-[#91b149] font-bold mb-2">
                    بصمتك العلاجية الفريدة
                  </div>
                  <h2 className="text-3xl font-display font-black text-white mb-1">
                    أنت شخصية{" "}
                    <span className="text-[#91b149]">{top.dest.name}</span>
                  </h2>
                  <p className="text-white/40 text-sm">
                    نسبة التوافق: {top.score}%
                  </p>
                </motion.div>
              </div>

              {/* Score bars */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="bg-[#162033] border border-[#1e3a5f] rounded-2xl p-6 mb-6"
              >
                <h3 className="text-sm font-bold text-white/50 mb-4">
                  نسبة التوافق مع كل وجهة
                </h3>
                <div className="space-y-3">
                  {results.map((r, i) => (
                    <div key={r.dest.id} className="flex items-center gap-3">
                      <span className="text-lg w-8 text-center">
                        {r.dest.envIcon}
                      </span>
                      <span className="text-sm text-white font-bold w-24 truncate">
                        {r.dest.name}
                      </span>
                      <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${r.score}%` }}
                          transition={{ delay: 1.4 + i * 0.15, duration: 0.8 }}
                          className={`h-full rounded-full ${
                            i === 0
                              ? "bg-gradient-to-l from-[#91b149] to-[#6a8435]"
                              : "bg-white/20"
                          }`}
                        />
                      </div>
                      <span className="text-sm font-mono text-white/50 w-10 text-left">
                        {r.score}%
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <Link
                  href={`/destination/${top.dest.id}`}
                  className="flex-1 text-center py-3.5 bg-gradient-to-l from-[#91b149] to-[#6a8435] text-white font-bold rounded-full no-underline text-sm hover:shadow-[0_8px_24px_rgba(145,177,73,0.4)] transition-shadow"
                >
                  اكتشف {top.dest.name} ←
                </Link>
                <button
                  onClick={reset}
                  className="flex-1 py-3.5 bg-white/10 hover:bg-white/15 text-white font-bold rounded-full text-sm border border-white/10 transition-colors"
                >
                  أعد الاختبار
                </button>
                <Link
                  href="/body-scanner"
                  className="flex-1 text-center py-3.5 bg-white/5 hover:bg-white/10 text-white/70 font-bold rounded-full no-underline text-sm border border-white/10 transition-colors"
                >
                  جرب الجسم التفاعلي
                </Link>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}
