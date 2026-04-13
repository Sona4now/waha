"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const ENVIRONMENTS = [
  {
    id: "sea",
    name: "بحر سفاجا",
    emoji: "🌊",
    gradient: "from-[#0c4a6e] via-[#1d5770] to-[#0a3d5c]",
    waveColor: "rgba(56, 189, 248, 0.15)",
    particleColor: "#38bdf8",
    sound: "أمواج البحر الهادئة",
    tips: [
      "تنفس مع إيقاع الأمواج... شهيق مع الموجة القادمة",
      "مياه البحر الأحمر غنية بالمعادن اللي بتشفي الجلد",
      "الملح الطبيعي بيخفف التهاب المفاصل بنسبة 70%",
      "استرخي... خلّي جسمك يطفو على سطح المياه",
      "أشعة الشمس المعتدلة بتعزز فيتامين D في جسمك",
    ],
  },
  {
    id: "desert",
    name: "صحراء سيوة",
    emoji: "🏜️",
    gradient: "from-[#78350f] via-[#92400e] to-[#451a03]",
    waveColor: "rgba(251, 191, 36, 0.1)",
    particleColor: "#fbbf24",
    sound: "رياح الصحراء والصمت",
    tips: [
      "الصمت في الصحراء بيعالج التوتر المزمن",
      "الهواء الجاف النقي بيساعد مرضى الربو والحساسية",
      "الرمال الدافئة بتنشط الدورة الدموية",
      "تأمل تحت سماء سيوة الصافية... ملايين النجوم",
      "العيون الكبريتية الساخنة بتريح العضلات والمفاصل",
    ],
  },
  {
    id: "mountain",
    name: "جبال سيناء",
    emoji: "⛰️",
    gradient: "from-[#1c1917] via-[#44403c] to-[#292524]",
    waveColor: "rgba(168, 162, 158, 0.1)",
    particleColor: "#a8a29e",
    sound: "هواء الجبل والطيور",
    tips: [
      "الهواء الجبلي النقي بيملأ رئتيك بالأكسجين",
      "المشي في الجبال بيقوي القلب ويحسن المزاج",
      "الأعشاب البرية في سيناء ليها خصائص علاجية فريدة",
      "حمام موسى الساخن بيعالج آلام الظهر والمفاصل",
      "الارتفاع بيخفض ضغط الدم ويهدي الأعصاب",
    ],
  },
  {
    id: "oasis",
    name: "واحة الفيوم",
    emoji: "🌴",
    gradient: "from-[#064e3b] via-[#065f46] to-[#022c22]",
    waveColor: "rgba(52, 211, 153, 0.1)",
    particleColor: "#34d399",
    sound: "مياه جارية وعصافير",
    tips: [
      "صوت المياه الجارية بيهدي الجهاز العصبي",
      "الطبيعة الخضراء بتخفض هرمون الكورتيزول",
      "الفيوم أقرب واحة للقاهرة — ساعة ونصف بس",
      "بحيرة قارون مصدر هدوء نفسي مذهل",
      "الهواء حوالين النخيل مليان أيونات سالبة مفيدة",
    ],
  },
];

/* ── Breathing circle ── */
function BreathingCircle({ phase }: { phase: "in" | "hold" | "out" }) {
  const label = phase === "in" ? "شهيق" : phase === "hold" ? "إمسك" : "زفير";
  const scale = phase === "in" ? 1.6 : phase === "hold" ? 1.6 : 1;

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer glow rings */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute w-56 h-56 rounded-full border border-white/10"
      />
      <motion.div
        animate={{ scale: [1.1, 1.25, 1.1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute w-72 h-72 rounded-full border border-white/5"
      />

      {/* Main breathing circle */}
      <motion.div
        animate={{ scale }}
        transition={{ duration: 4, ease: "easeInOut" }}
        className="w-40 h-40 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center"
      >
        <motion.div
          animate={{ scale }}
          transition={{ duration: 4, ease: "easeInOut" }}
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

/* ── Floating particles ── */
function Particles({ color }: { color: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -Math.random() * 0.5 - 0.1,
      alpha: Math.random() * 0.5 + 0.1,
    }));

    let frame: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = color.replace(")", `, ${p.alpha})`).replace("rgb", "rgba");
        ctx.fill();
      });
      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, [color]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-10" />;
}

/* ── Main page ── */
export default function TherapyRoomPage() {
  const [selectedEnv, setSelectedEnv] = useState<string | null>(null);
  const [sessionActive, setSessionActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [breathPhase, setBreathPhase] = useState<"in" | "hold" | "out">("in");
  const [currentTip, setCurrentTip] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const env = ENVIRONMENTS.find((e) => e.id === selectedEnv);

  // Session timer
  useEffect(() => {
    if (!sessionActive) return;
    timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timerRef.current!);
  }, [sessionActive]);

  // Breathing cycle: 4s in, 2s hold, 4s out
  useEffect(() => {
    if (!sessionActive) return;
    const cycle = () => {
      setBreathPhase("in");
      setTimeout(() => setBreathPhase("hold"), 4000);
      setTimeout(() => setBreathPhase("out"), 6000);
    };
    cycle();
    const interval = setInterval(cycle, 10000);
    return () => clearInterval(interval);
  }, [sessionActive]);

  // Rotate tips every 15s
  useEffect(() => {
    if (!sessionActive || !env) return;
    const interval = setInterval(() => {
      setCurrentTip((t) => (t + 1) % env.tips.length);
    }, 15000);
    return () => clearInterval(interval);
  }, [sessionActive, env]);

  const startSession = useCallback((envId: string) => {
    setSelectedEnv(envId);
    setSessionActive(true);
    setSeconds(0);
    setCurrentTip(0);
  }, []);

  const endSession = useCallback(() => {
    setSessionActive(false);
    setSelectedEnv(null);
    setSeconds(0);
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${String(sec).padStart(2, "0")}`;
  };

  // ── Selection screen ──
  if (!sessionActive) {
    return (
      <div className="min-h-screen bg-[#070d15] flex flex-col items-center justify-center px-4" dir="rtl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="text-[10px] uppercase tracking-[0.5em] text-[#91b149] font-bold mb-3">
            · Therapy Room ·
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-black text-white mb-4">
            غرفة العلاج الافتراضية
          </h1>
          <p className="text-white/40 text-sm max-w-md mx-auto">
            اختر بيئتك العلاجية — هنحولك لجوا المكان مع تمارين تنفس وتأمل حقيقية
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl w-full">
          {ENVIRONMENTS.map((e, i) => (
            <motion.button
              key={e.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              onClick={() => startSession(e.id)}
              className={`group relative rounded-2xl p-6 bg-gradient-to-br ${e.gradient} border border-white/10 hover:border-white/30 text-center transition-all hover:scale-105 hover:shadow-2xl`}
            >
              <div className="text-4xl mb-3">{e.emoji}</div>
              <div className="text-white font-bold font-display text-sm mb-1">
                {e.name}
              </div>
              <div className="text-white/40 text-[10px]">{e.sound}</div>
            </motion.button>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12"
        >
          <Link
            href="/home"
            className="text-white/30 hover:text-white/60 text-sm no-underline transition-colors"
          >
            ← العودة للرئيسية
          </Link>
        </motion.div>
      </div>
    );
  }

  // ── Immersive session ──
  return (
    <div
      className={`fixed inset-0 bg-gradient-to-b ${env!.gradient} flex flex-col items-center justify-center overflow-hidden`}
      dir="rtl"
    >
      <Particles color={env!.particleColor} />

      {/* Ambient wave effect */}
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
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-4 sm:p-6">
        <button
          onClick={endSession}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur rounded-full text-white text-sm font-bold transition-colors border border-white/10"
        >
          إنهاء الجلسة ✕
        </button>
        <div className="text-white/60 text-sm font-mono bg-white/10 backdrop-blur px-4 py-2 rounded-full border border-white/10">
          {env!.emoji} {env!.name}
        </div>
        <div className="text-white font-mono text-lg font-bold bg-white/10 backdrop-blur px-4 py-2 rounded-full border border-white/10">
          {formatTime(seconds)}
        </div>
      </div>

      {/* Center breathing circle */}
      <div className="relative z-20">
        <BreathingCircle phase={breathPhase} />
      </div>

      {/* Tip */}
      <div className="absolute bottom-24 sm:bottom-16 left-0 right-0 z-20 text-center px-6">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentTip}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-white/70 text-sm sm:text-base max-w-lg mx-auto leading-relaxed"
          >
            {env!.tips[currentTip]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Phase label at bottom */}
      <div className="absolute bottom-6 left-0 right-0 z-20 text-center">
        <span className="text-white/30 text-[10px] uppercase tracking-[0.3em]">
          جلسة {env!.sound}
        </span>
      </div>
    </div>
  );
}
