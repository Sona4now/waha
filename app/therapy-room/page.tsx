"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { showToast } from "@/components/site/Toast";

/* ═══════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════ */

const ENVIRONMENTS = [
  {
    id: "sea",
    name: "بحر سفاجا",
    emoji: "🌊",
    particleColor: "#38bdf8",
    waveColor: "rgba(56, 189, 248, 0.15)",
    soundUrl: "https://cdn.freesound.org/previews/527/527415_2485975-lq.mp3",
    soundLabel: "أمواج البحر",
    tips: [
      "تنفس مع إيقاع الأمواج... شهيق مع الموجة القادمة",
      "مياه البحر الأحمر غنية بالمعادن اللي بتشفي الجلد",
      "الملح الطبيعي بيخفف التهاب المفاصل بنسبة 70%",
      "استرخي... خلّي جسمك يطفو على سطح المياه",
      "أشعة الشمس المعتدلة بتعزز فيتامين D في جسمك",
    ],
    gradients: {
      dawn: "from-[#1e3a5a] via-[#2d6187] to-[#0c4a6e]",
      day: "from-[#0c4a6e] via-[#1d5770] to-[#0a3d5c]",
      sunset: "from-[#7c2d12] via-[#1d5770] to-[#0c4a6e]",
      night: "from-[#020617] via-[#0c2d48] to-[#0a1628]",
    },
  },
  {
    id: "desert",
    name: "صحراء سيوة",
    emoji: "🏜️",
    particleColor: "#fbbf24",
    waveColor: "rgba(251, 191, 36, 0.1)",
    soundUrl: "https://cdn.freesound.org/previews/370/370293_4397472-lq.mp3",
    soundLabel: "رياح الصحراء",
    tips: [
      "الصمت في الصحراء بيعالج التوتر المزمن",
      "الهواء الجاف النقي بيساعد مرضى الربو والحساسية",
      "الرمال الدافئة بتنشط الدورة الدموية",
      "تأمل تحت سماء سيوة الصافية... ملايين النجوم",
      "العيون الكبريتية الساخنة بتريح العضلات والمفاصل",
    ],
    gradients: {
      dawn: "from-[#92400e] via-[#b45309] to-[#78350f]",
      day: "from-[#78350f] via-[#92400e] to-[#451a03]",
      sunset: "from-[#9a3412] via-[#c2410c] to-[#78350f]",
      night: "from-[#1c1917] via-[#292524] to-[#0c0a09]",
    },
  },
  {
    id: "mountain",
    name: "جبال سيناء",
    emoji: "⛰️",
    particleColor: "#a8a29e",
    waveColor: "rgba(168, 162, 158, 0.1)",
    soundUrl: "https://cdn.freesound.org/previews/398/398632_1648170-lq.mp3",
    soundLabel: "طيور الجبل",
    tips: [
      "الهواء الجبلي النقي بيملأ رئتيك بالأكسجين",
      "المشي في الجبال بيقوي القلب ويحسن المزاج",
      "الأعشاب البرية في سيناء ليها خصائص علاجية فريدة",
      "حمام موسى الساخن بيعالج آلام الظهر والمفاصل",
      "الارتفاع بيخفض ضغط الدم ويهدي الأعصاب",
    ],
    gradients: {
      dawn: "from-[#44403c] via-[#57534e] to-[#292524]",
      day: "from-[#1c1917] via-[#44403c] to-[#292524]",
      sunset: "from-[#78350f] via-[#44403c] to-[#1c1917]",
      night: "from-[#0c0a09] via-[#1c1917] to-[#0a0a0a]",
    },
  },
  {
    id: "oasis",
    name: "واحة الفيوم",
    emoji: "🌴",
    particleColor: "#34d399",
    waveColor: "rgba(52, 211, 153, 0.1)",
    soundUrl: "https://cdn.freesound.org/previews/531/531952_10600515-lq.mp3",
    soundLabel: "مياه وعصافير",
    tips: [
      "صوت المياه الجارية بيهدي الجهاز العصبي",
      "الطبيعة الخضراء بتخفض هرمون الكورتيزول",
      "الفيوم أقرب واحة للقاهرة — ساعة ونصف بس",
      "بحيرة قارون مصدر هدوء نفسي مذهل",
      "الهواء حوالين النخيل مليان أيونات سالبة مفيدة",
    ],
    gradients: {
      dawn: "from-[#065f46] via-[#047857] to-[#064e3b]",
      day: "from-[#064e3b] via-[#065f46] to-[#022c22]",
      sunset: "from-[#92400e] via-[#065f46] to-[#022c22]",
      night: "from-[#022c22] via-[#0a1f1a] to-[#0a0f0d]",
    },
  },
];

/* ── Exercise modes ── */
type ExerciseMode = "breathe" | "box" | "478" | "bodyscan" | "guided";

const EXERCISE_MODES = [
  { id: "breathe" as ExerciseMode, label: "تنفس عادي", desc: "4-2-4", emoji: "🌬️" },
  { id: "box" as ExerciseMode, label: "تنفس مربع", desc: "4-4-4-4", emoji: "⬜" },
  { id: "478" as ExerciseMode, label: "تنفس 4-7-8", desc: "للنوم العميق", emoji: "🌙" },
  { id: "bodyscan" as ExerciseMode, label: "مسح الجسم", desc: "تأمل موجه", emoji: "🧘" },
  { id: "guided" as ExerciseMode, label: "تأمل حر", desc: "استرخاء كامل", emoji: "✨" },
];

const BODY_SCAN_STEPS = [
  "أغمض عينيك... خذ نفس عميق",
  "ركز على قدميك... حس بملمس الأرض تحتك",
  "اصعد ببطء... ركز على ركبك وساقيك",
  "حس بوزن جسمك على الكرسي... ظهرك مرتخي",
  "ركز على بطنك... لاحظ حركة التنفس",
  "ارخِ كتفيك... خليهم ينزلوا لتحت",
  "ركز على رقبتك... حس بالتوتر بيروح",
  "وجهك مرتخي... جبينك... عيونك... فكك",
  "دلوقتي جسمك كله مرتخي... تنفس بهدوء",
  "ابقى في السكون ده لحظة... أنت في أمان",
];

const GUIDED_STEPS = [
  "تخيل إنك واقف على شاطئ هادي...",
  "حس بالنسمة على وجهك... دافئة ولطيفة",
  "اسمع صوت المياه... بتيجي وتروح بإيقاع ثابت",
  "كل موجة بتاخد معاها شوية من التوتر",
  "تخيل النور الدافئ بيملأ جسمك من فوق",
  "النور بينزل في كتفيك... صدرك... بطنك",
  "حس بالدفا والراحة بتملأ كل خلية",
  "أنت خفيف... مرتخي... في سلام",
  "خذ نفس عميق أخير... ابتسم من جوا",
  "افتح عينيك ببطء... أنت مستعد ليوم جديد",
];

/* ═══════════════════════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════════════════════ */

/* ── Enhanced Particles with environment-specific effects ── */
function EnhancedParticles({ envId, color }: { envId: string; color: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const w = (canvas.width = window.innerWidth);
    const h = (canvas.height = window.innerHeight);

    // Environment-specific particles
    const count = envId === "oasis" ? 40 : envId === "desert" ? 30 : 50;
    const particles = Array.from({ length: count }, () => {
      const isFirefly = envId === "oasis";
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        r: isFirefly ? Math.random() * 3 + 1 : Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * (isFirefly ? 0.8 : 0.3),
        vy: isFirefly
          ? (Math.random() - 0.5) * 0.5
          : envId === "desert"
            ? Math.random() * 0.3
            : -Math.random() * 0.5 - 0.1,
        alpha: Math.random() * 0.5 + 0.1,
        pulse: Math.random() * Math.PI * 2,
      };
    });

    let frame: number;
    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      const time = Date.now() * 0.001;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        if (p.y > h + 10) { p.y = -10; p.x = Math.random() * w; }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;

        // Firefly glow for oasis
        if (envId === "oasis") {
          const glow = (Math.sin(time * 2 + p.pulse) + 1) / 2;
          ctx.shadowColor = color;
          ctx.shadowBlur = 10 * glow;
          ctx.globalAlpha = 0.2 + glow * 0.6;
        } else {
          ctx.shadowBlur = 0;
          ctx.globalAlpha = p.alpha + Math.sin(time + p.pulse) * 0.1;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      });

      // Aurora effect for mountain
      if (envId === "mountain") {
        ctx.globalAlpha = 0.03;
        for (let i = 0; i < 3; i++) {
          const y = h * 0.15 + i * 30;
          ctx.beginPath();
          ctx.moveTo(0, y);
          for (let x = 0; x < w; x += 10) {
            const wave = Math.sin(x * 0.005 + time * 0.5 + i) * 40;
            ctx.lineTo(x, y + wave);
          }
          ctx.lineTo(w, h);
          ctx.lineTo(0, h);
          ctx.closePath();
          const grad = ctx.createLinearGradient(0, y - 50, 0, y + 100);
          grad.addColorStop(0, "transparent");
          grad.addColorStop(0.5, i === 0 ? "#22d3ee" : i === 1 ? "#a855f7" : "#34d399");
          grad.addColorStop(1, "transparent");
          ctx.fillStyle = grad;
          ctx.fill();
        }
      }

      // Water ripples for sea
      if (envId === "sea") {
        ctx.globalAlpha = 0.04;
        for (let i = 0; i < 5; i++) {
          const centerX = w / 2 + Math.sin(time * 0.3 + i) * 100;
          const centerY = h * 0.7 + i * 20;
          const radius = 50 + Math.sin(time + i * 0.5) * 30 + i * 40;
          ctx.beginPath();
          ctx.ellipse(centerX, centerY, radius * 1.5, radius * 0.3, 0, 0, Math.PI * 2);
          ctx.strokeStyle = "#38bdf8";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, [envId, color]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-10" />;
}

/* ── Breathing Circle with mode support ── */
function BreathingCircle({
  phase,
  mode,
  bodyScanStep,
  guidedStep,
}: {
  phase: string;
  mode: ExerciseMode;
  bodyScanStep?: string;
  guidedStep?: string;
}) {
  if (mode === "bodyscan" || mode === "guided") {
    const text = mode === "bodyscan" ? bodyScanStep : guidedStep;
    return (
      <div className="relative flex items-center justify-center px-6">
        <motion.div
          animate={{ scale: [1, 1.05, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute w-72 h-72 rounded-full border border-white/10"
        />
        <motion.div
          key={text}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="text-center max-w-sm"
        >
          <div className="text-3xl mb-4">{mode === "bodyscan" ? "🧘" : "✨"}</div>
          <p className="text-white text-lg sm:text-xl font-display leading-relaxed">
            {text}
          </p>
        </motion.div>
      </div>
    );
  }

  const labels: Record<string, string> = {
    in: "شهيق",
    hold: "إمسك",
    out: "زفير",
    hold2: "إمسك",
  };
  const label = labels[phase] || "شهيق";
  const isExpanded = phase === "in" || phase === "hold";
  const scale = isExpanded ? 1.5 : 1;

  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        animate={{ scale: [1, 1.12, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute w-56 h-56 rounded-full border border-white/10"
      />
      <motion.div
        animate={{ scale: [1.1, 1.22, 1.1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute w-72 h-72 rounded-full border border-white/5"
      />
      <motion.div
        animate={{ scale }}
        transition={{ duration: phase === "hold" || phase === "hold2" ? 0.3 : 4, ease: "easeInOut" }}
        className="w-40 h-40 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-[0_0_60px_rgba(255,255,255,0.05)]"
      >
        <motion.div
          animate={{ scale }}
          transition={{ duration: phase === "hold" || phase === "hold2" ? 0.3 : 4, ease: "easeInOut" }}
          className="w-24 h-24 rounded-full bg-white/10 border border-white/20 flex items-center justify-center"
        >
          <span className="text-white text-lg font-bold font-display">
            {label}
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ── Volume control ── */
function VolumeSlider({ volume, onChange }: { volume: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-3 py-1.5 border border-white/10">
      <span className="text-white/60 text-xs">{volume === 0 ? "🔇" : "🔊"}</span>
      <input
        type="range"
        min={0}
        max={100}
        value={volume}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-16 h-1 appearance-none bg-white/20 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
      />
    </div>
  );
}

/* ── Session Summary ── */
function SessionSummary({
  seconds,
  breathCycles,
  envName,
  mode,
  onClose,
  onRestart,
}: {
  seconds: number;
  breathCycles: number;
  envName: string;
  mode: ExerciseMode;
  onClose: () => void;
  onRestart: () => void;
}) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const modeLabel = EXERCISE_MODES.find((m) => m.id === mode)?.label || "";

  // Achievement check
  const achievement =
    seconds >= 600
      ? { emoji: "🏆", text: "ماستر التأمل — 10 دقائق!" }
      : seconds >= 300
        ? { emoji: "🥇", text: "متأمل محترف — 5 دقائق!" }
        : seconds >= 120
          ? { emoji: "🥈", text: "بداية قوية — دقيقتين!" }
          : { emoji: "🌱", text: "أول خطوة في رحلة الشفاء" };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-[#070d15]/95 backdrop-blur-xl flex items-center justify-center z-50 px-4"
      dir="rtl"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="bg-[#162033] border border-[#1e3a5f] rounded-3xl p-8 max-w-sm w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="text-6xl mb-4"
        >
          {achievement.emoji}
        </motion.div>
        <h2 className="text-2xl font-display font-black text-white mb-2">
          أحسنت!
        </h2>
        <p className="text-[#91b149] text-sm font-bold mb-6">
          {achievement.text}
        </p>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white/5 rounded-xl p-3">
            <div className="text-2xl font-bold text-white font-mono">
              {mins}:{String(secs).padStart(2, "0")}
            </div>
            <div className="text-[10px] text-white/40">المدة</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <div className="text-2xl font-bold text-white">{breathCycles}</div>
            <div className="text-[10px] text-white/40">دورة تنفس</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <div className="text-lg font-bold text-white truncate">{envName}</div>
            <div className="text-[10px] text-white/40">البيئة</div>
          </div>
        </div>

        <div className="text-[10px] text-white/30 mb-6">
          {modeLabel} · جلسة علاجية افتراضية
        </div>

        <div className="flex gap-3">
          <button
            onClick={onRestart}
            className="flex-1 py-3 bg-gradient-to-l from-[#91b149] to-[#6a8435] text-white font-bold rounded-full text-sm"
          >
            جلسة جديدة
          </button>
          <Link
            href="/home"
            onClick={onClose}
            className="flex-1 py-3 bg-white/10 text-white font-bold rounded-full text-sm no-underline text-center border border-white/10"
          >
            العودة
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════ */

export default function TherapyRoomPage() {
  const [selectedEnv, setSelectedEnv] = useState<string | null>(null);
  const [mode, setMode] = useState<ExerciseMode>("breathe");
  const [sessionActive, setSessionActive] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [breathCycles, setBreathCycles] = useState(0);
  const [breathPhase, setBreathPhase] = useState("in");
  const [currentTip, setCurrentTip] = useState(0);
  const [volume, setVolume] = useState(50);
  const [scanStep, setScanStep] = useState(0);
  const [guidedStepIdx, setGuidedStepIdx] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const env = ENVIRONMENTS.find((e) => e.id === selectedEnv);

  // Time-of-day gradient
  const getTimeGradient = useCallback(() => {
    if (!env) return "";
    const m = Math.floor(seconds / 60);
    if (m < 2) return env.gradients.dawn;
    if (m < 5) return env.gradients.day;
    if (m < 8) return env.gradients.sunset;
    return env.gradients.night;
  }, [env, seconds]);

  // Audio
  useEffect(() => {
    if (!sessionActive || !env) return;
    const audio = new Audio(env.soundUrl);
    audio.loop = true;
    audio.volume = volume / 100;
    audio.play().catch(() => {});
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, [sessionActive, env?.id]);

  // Volume change
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume / 100;
  }, [volume]);

  // Timer
  useEffect(() => {
    if (!sessionActive) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [sessionActive]);

  // Breathing cycles
  useEffect(() => {
    if (!sessionActive || mode === "bodyscan" || mode === "guided") return;

    const timings: Record<string, number[]> = {
      breathe: [4000, 2000, 4000, 0], // in, hold, out, hold2
      box: [4000, 4000, 4000, 4000],
      "478": [4000, 7000, 8000, 0],
    };
    const t = timings[mode] || timings.breathe;
    const totalCycle = t[0] + t[1] + t[2] + t[3];

    const cycle = () => {
      setBreathPhase("in");
      setTimeout(() => setBreathPhase("hold"), t[0]);
      setTimeout(() => setBreathPhase("out"), t[0] + t[1]);
      if (t[3] > 0) setTimeout(() => setBreathPhase("hold2"), t[0] + t[1] + t[2]);
      setBreathCycles((c) => c + 1);
    };
    cycle();
    const interval = setInterval(cycle, totalCycle);
    return () => clearInterval(interval);
  }, [sessionActive, mode]);

  // Body scan steps
  useEffect(() => {
    if (!sessionActive || mode !== "bodyscan") return;
    const interval = setInterval(() => {
      setScanStep((s) => {
        if (s >= BODY_SCAN_STEPS.length - 1) return s;
        return s + 1;
      });
    }, 10000);
    return () => clearInterval(interval);
  }, [sessionActive, mode]);

  // Guided steps
  useEffect(() => {
    if (!sessionActive || mode !== "guided") return;
    const interval = setInterval(() => {
      setGuidedStepIdx((s) => {
        if (s >= GUIDED_STEPS.length - 1) return s;
        return s + 1;
      });
    }, 12000);
    return () => clearInterval(interval);
  }, [sessionActive, mode]);

  // Tips rotation
  useEffect(() => {
    if (!sessionActive || !env || mode === "bodyscan" || mode === "guided") return;
    const interval = setInterval(() => {
      setCurrentTip((t) => (t + 1) % env.tips.length);
    }, 15000);
    return () => clearInterval(interval);
  }, [sessionActive, env, mode]);

  // Haptic on breath phase change
  useEffect(() => {
    if (sessionActive && navigator.vibrate && mode !== "bodyscan" && mode !== "guided") {
      navigator.vibrate(30);
    }
  }, [breathPhase]);

  const startSession = useCallback((envId: string, exerciseMode: ExerciseMode) => {
    setSelectedEnv(envId);
    setMode(exerciseMode);
    setSessionActive(true);
    setSeconds(0);
    setBreathCycles(0);
    setCurrentTip(0);
    setScanStep(0);
    setGuidedStepIdx(0);
    setShowSummary(false);
  }, []);

  const endSession = useCallback(() => {
    setSessionActive(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    setShowSummary(true);
  }, []);

  const fullReset = useCallback(() => {
    setShowSummary(false);
    setSelectedEnv(null);
    setSeconds(0);
    setBreathCycles(0);
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${String(sec).padStart(2, "0")}`;
  };

  /* ── Selection screen ── */
  if (!sessionActive && !showSummary) {
    return (
      <div className="min-h-screen bg-[#070d15] flex flex-col items-center justify-center px-4 py-20" dir="rtl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="text-[10px] uppercase tracking-[0.5em] text-[#91b149] font-bold mb-3">· Therapy Room ·</div>
          <h1 className="font-display text-3xl sm:text-5xl font-black text-white mb-4">غرفة العلاج الافتراضية</h1>
          <p className="text-white/40 text-sm max-w-md mx-auto">اختر بيئتك ونوع التمرين — هنحولك لتجربة علاجية حقيقية</p>
        </motion.div>

        {/* Step 1: Environment */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mb-10 w-full max-w-3xl">
          <h3 className="text-white/50 text-sm font-bold mb-4 text-center">① اختر البيئة</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {ENVIRONMENTS.map((e, i) => (
              <motion.button
                key={e.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                onClick={() => setSelectedEnv(e.id)}
                className={`relative rounded-2xl p-5 bg-gradient-to-br ${e.gradients.day} border text-center transition-all hover:scale-105 ${
                  selectedEnv === e.id ? "border-[#91b149] shadow-[0_0_30px_rgba(145,177,73,0.3)] scale-105" : "border-white/10 hover:border-white/30"
                }`}
              >
                {selectedEnv === e.id && (
                  <div className="absolute top-2 left-2 w-5 h-5 bg-[#91b149] rounded-full flex items-center justify-center text-[10px] text-white font-bold">✓</div>
                )}
                <div className="text-3xl mb-2">{e.emoji}</div>
                <div className="text-white font-bold font-display text-sm">{e.name}</div>
                <div className="text-white/40 text-[10px] mt-1">🔊 {e.soundLabel}</div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Step 2: Exercise mode */}
        {selectedEnv && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 w-full max-w-3xl">
            <h3 className="text-white/50 text-sm font-bold mb-4 text-center">② اختر التمرين</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {EXERCISE_MODES.map((m, i) => (
                <motion.button
                  key={m.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => startSession(selectedEnv!, m.id)}
                  className="rounded-xl p-4 bg-white/5 hover:bg-[#91b149]/15 border border-white/10 hover:border-[#91b149]/40 text-center transition-all group"
                >
                  <div className="text-2xl mb-1">{m.emoji}</div>
                  <div className="text-white text-xs font-bold group-hover:text-[#91b149] transition-colors">{m.label}</div>
                  <div className="text-white/30 text-[10px] mt-0.5">{m.desc}</div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        <Link href="/home" className="text-white/30 hover:text-white/60 text-sm no-underline transition-colors mt-6">← العودة للرئيسية</Link>
      </div>
    );
  }

  /* ── Summary ── */
  if (showSummary && env) {
    return (
      <SessionSummary
        seconds={seconds}
        breathCycles={breathCycles}
        envName={env.name}
        mode={mode}
        onClose={fullReset}
        onRestart={() => { setShowSummary(false); setSelectedEnv(null); }}
      />
    );
  }

  /* ── Immersive session ── */
  const gradient = getTimeGradient();

  return (
    <motion.div
      key={gradient}
      className={`fixed inset-0 bg-gradient-to-b ${gradient} flex flex-col items-center justify-center overflow-hidden transition-colors duration-[5000ms]`}
      dir="rtl"
    >
      <EnhancedParticles envId={env!.id} color={env!.particleColor} />

      {/* Waves */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 overflow-hidden z-0">
        <motion.div
          animate={{ x: ["-10%", "10%", "-10%"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-[50%] opacity-30"
          style={{ background: env!.waveColor, top: "30%", scale: 1.5 }}
        />
        <motion.div
          animate={{ x: ["10%", "-10%", "10%"] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-[50%] opacity-20"
          style={{ background: env!.waveColor, top: "50%", scale: 1.8 }}
        />
      </div>

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-3 sm:p-5 gap-2">
        <button onClick={endSession} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 backdrop-blur rounded-full text-white text-xs sm:text-sm font-bold transition-colors border border-white/10">
          إنهاء ✕
        </button>
        <VolumeSlider volume={volume} onChange={setVolume} />
        <div className="text-white/60 text-xs font-mono bg-white/10 backdrop-blur px-3 py-1.5 rounded-full border border-white/10 hidden sm:block">
          {env!.emoji} {EXERCISE_MODES.find((m) => m.id === mode)?.label}
        </div>
        <div className="text-white font-mono text-sm sm:text-lg font-bold bg-white/10 backdrop-blur px-3 sm:px-4 py-1.5 rounded-full border border-white/10">
          {formatTime(seconds)}
        </div>
      </div>

      {/* Center */}
      <div className="relative z-20">
        <BreathingCircle
          phase={breathPhase}
          mode={mode}
          bodyScanStep={BODY_SCAN_STEPS[scanStep]}
          guidedStep={GUIDED_STEPS[guidedStepIdx]}
        />
      </div>

      {/* Tips (only for breathing modes) */}
      {mode !== "bodyscan" && mode !== "guided" && (
        <div className="absolute bottom-20 sm:bottom-14 left-0 right-0 z-20 text-center px-6">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentTip}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-white/60 text-sm sm:text-base max-w-lg mx-auto leading-relaxed"
            >
              {env!.tips[currentTip]}
            </motion.p>
          </AnimatePresence>
        </div>
      )}

      {/* Bottom label */}
      <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 z-20 text-center">
        <span className="text-white/20 text-[9px] uppercase tracking-[0.3em]">
          {env!.soundLabel} · {EXERCISE_MODES.find((m) => m.id === mode)?.label}
        </span>
      </div>
    </motion.div>
  );
}
