"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { DESTINATIONS } from "@/data/siteData";

/* ═══════════════════════════════════════════════
   BREATH ANALYSIS ENGINE
   ═══════════════════════════════════════════════ */

interface BreathData {
  bpm: number; // breaths per minute
  depth: number; // 0-1 average depth
  regularity: number; // 0-1 how consistent
  peaks: number[]; // timestamps of detected breaths
}

function analyzeBreath(data: BreathData) {
  const { bpm, depth, regularity } = data;

  // Classification
  let pattern: string;
  let stressLevel: number; // 0-100
  let analysis: string;

  if (bpm > 20) {
    pattern = "سريع وسطحي";
    stressLevel = 85;
    analysis = "تنفسك سريع وسطحي — ده علامة واضحة على توتر مزمن أو قلق. جسمك في وضع \"الهروب أو المواجهة\" وبيستهلك طاقة زيادة.";
  } else if (bpm > 16) {
    pattern = "أسرع من الطبيعي";
    stressLevel = 60;
    analysis = "تنفسك أسرع شوية من المعدل الطبيعي. ممكن يكون ضغط يومي أو إرهاق متراكم. جسمك محتاج يتباطأ.";
  } else if (bpm >= 12) {
    pattern = "طبيعي ومتوازن";
    stressLevel = 25;
    analysis = "تنفسك في المعدل الطبيعي — ده كويس! بس ممكن يكون أعمق. العلاج الطبيعي هيرفع جودة تنفسك لمستوى تاني.";
  } else {
    pattern = "عميق وهادي";
    stressLevel = 10;
    analysis = "تنفسك عميق وهادي — ده ممتاز! جسمك مرتاح. السياحة الاستشفائية هتاخدك لمستوى أعلى من الرااحة.";
  }

  if (depth < 0.3) {
    analysis += " عمق التنفس ضعيف — حاول تاخد أنفاس من البطن مش من الصدر.";
  }

  // Destination recommendation based on breath pattern
  const scores: Record<string, number> = {
    safaga: 50,
    siwa: 50,
    sinai: 50,
    fayoum: 50,
    bahariya: 50,
  };

  if (stressLevel > 60) {
    scores.siwa += 40; // extreme calm needed
    scores.fayoum += 30;
    scores.sinai += 10;
  } else if (stressLevel > 30) {
    scores.fayoum += 30;
    scores.siwa += 25;
    scores.bahariya += 20;
  } else {
    scores.safaga += 35; // ready for active healing
    scores.bahariya += 30;
    scores.sinai += 25;
  }

  if (depth < 0.4) {
    scores.sinai += 25; // mountain air for deeper breathing
    scores.bahariya += 15;
  }

  const sorted = DESTINATIONS.map((d) => ({
    dest: d,
    score: scores[d.id] || 50,
  })).sort((a, b) => b.score - a.score);

  const max = Math.max(...sorted.map((s) => s.score));
  const results = sorted.map((s) => ({
    ...s,
    percent: Math.round((s.score / max) * 100),
  }));

  // Personalized prophecy-like message
  const messages: Record<string, string> = {
    safaga: "مياه البحر الأحمر ستعلّم رئتيك إيقاعاً جديداً — أعمق وأبطأ. الملح والمعادن هيشفوا جسمك من جوا.",
    siwa: "صمت الصحراء هو الدواء اللي جسمك بيصرخ يطلبه. في سيوة هتتعلم تتنفس كأنك بتتنفس لأول مرة.",
    sinai: "هواء الجبال النقي هيملأ رئتيك بأكسجين لم تعرفه من قبل. كل نَفَس في سيناء بيساوي عشرة في المدينة.",
    fayoum: "الطبيعة الخضراء والمياه الهادئة هتعيد لجهازك العصبي التوازن. في الفيوم هتلاقي الهدوء اللي بتدور عليه.",
    bahariya: "الرمال الدافئة والينابيع الساخنة هيريحوا كل عضلة في جسمك. هتتنفس ببطء وعمق زي ما الصحراء بتتنفس.",
  };

  return {
    bpm: Math.round(bpm),
    pattern,
    stressLevel,
    analysis,
    results,
    top: results[0],
    message: messages[results[0].dest.id] || messages.siwa,
  };
}

/* ═══════════════════════════════════════════════
   WAVEFORM VISUALIZER (Canvas)
   ═══════════════════════════════════════════════ */

function BreathVisualizer({
  analyserRef,
  isListening,
  colorHue,
}: {
  analyserRef: React.MutableRefObject<AnalyserNode | null>;
  isListening: boolean;
  colorHue: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const historyRef = useRef<number[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio, 2);
    const w = (canvas.width = window.innerWidth * dpr);
    const h = (canvas.height = window.innerHeight * dpr);
    ctx.scale(dpr, dpr);
    const cw = window.innerWidth;
    const ch = window.innerHeight;

    let frame: number;
    const particles: { x: number; y: number; vx: number; vy: number; life: number; size: number }[] = [];

    const animate = () => {
      // Dark fade (trail effect)
      ctx.fillStyle = "rgba(5, 8, 12, 0.08)";
      ctx.fillRect(0, 0, cw, ch);

      const analyser = analyserRef.current;
      let amplitude = 0;

      if (analyser && isListening) {
        const data = new Uint8Array(analyser.fftSize);
        analyser.getByteTimeDomainData(data);

        // Calculate RMS amplitude
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
          const v = (data[i] - 128) / 128;
          sum += v * v;
        }
        amplitude = Math.sqrt(sum / data.length);
        historyRef.current.push(amplitude);
        if (historyRef.current.length > 400) historyRef.current.shift();
      }

      const history = historyRef.current;
      const time = Date.now() * 0.001;

      // ── MAIN WAVEFORM ──
      if (history.length > 2) {
        ctx.beginPath();
        ctx.moveTo(0, ch / 2);

        for (let i = 0; i < history.length; i++) {
          const x = (i / history.length) * cw;
          const amp = history[i] * ch * 1.2;
          const y = ch / 2 + Math.sin(i * 0.03 + time) * amp * 80;
          ctx.lineTo(x, y);
        }

        // Gradient stroke
        const grad = ctx.createLinearGradient(0, 0, cw, 0);
        const hue = colorHue;
        grad.addColorStop(0, `hsla(${hue}, 70%, 50%, 0.05)`);
        grad.addColorStop(0.3, `hsla(${hue}, 80%, 55%, 0.4)`);
        grad.addColorStop(0.7, `hsla(${hue}, 90%, 60%, 0.6)`);
        grad.addColorStop(1, `hsla(${hue}, 80%, 55%, 0.3)`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Mirrored wave (thinner, lower opacity)
        ctx.beginPath();
        ctx.moveTo(0, ch / 2);
        for (let i = 0; i < history.length; i++) {
          const x = (i / history.length) * cw;
          const amp = history[i] * ch * 1.2;
          const y = ch / 2 - Math.sin(i * 0.03 + time) * amp * 60;
          ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `hsla(${hue}, 70%, 50%, 0.15)`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // ── PARTICLES (spawn on exhale peaks) ──
      if (amplitude > 0.05 && Math.random() > 0.6) {
        const count = Math.floor(amplitude * 8);
        for (let i = 0; i < count; i++) {
          particles.push({
            x: cw * 0.7 + Math.random() * cw * 0.3,
            y: ch / 2 + (Math.random() - 0.5) * amplitude * ch,
            vx: (Math.random() - 0.3) * 2,
            vy: (Math.random() - 0.5) * 1.5,
            life: 1,
            size: Math.random() * 3 + 1,
          });
        }
      }

      // Update & draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy -= 0.02; // float up
        p.life -= 0.01;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${colorHue}, 80%, 65%, ${p.life * 0.5})`;
        ctx.fill();
      }

      // ── BREATHING CIRCLE (center) ──
      const breathSize = 80 + amplitude * 300;
      const breathAlpha = 0.05 + amplitude * 0.15;

      // Outer glow
      const glow = ctx.createRadialGradient(cw / 2, ch / 2, 0, cw / 2, ch / 2, breathSize * 1.5);
      glow.addColorStop(0, `hsla(${colorHue}, 80%, 60%, ${breathAlpha})`);
      glow.addColorStop(0.5, `hsla(${colorHue}, 70%, 50%, ${breathAlpha * 0.3})`);
      glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cw / 2, ch / 2, breathSize * 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Inner circle
      ctx.strokeStyle = `hsla(${colorHue}, 80%, 60%, ${0.1 + amplitude * 0.3})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cw / 2, ch / 2, breathSize, 0, Math.PI * 2);
      ctx.stroke();

      // Tiny inner circle
      ctx.beginPath();
      ctx.arc(cw / 2, ch / 2, breathSize * 0.4, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(${colorHue}, 70%, 55%, ${0.05 + amplitude * 0.15})`;
      ctx.stroke();

      frame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(frame);
  }, [isListening, colorHue, analyserRef]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0"
      style={{ width: "100vw", height: "100vh" }}
    />
  );
}

/* ═══════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════ */

type Stage = "intro" | "permission" | "listening" | "analyzing" | "result";

export default function BreathePage() {
  const [stage, setStage] = useState<Stage>("intro");
  const [seconds, setSeconds] = useState(30);
  const [breathData, setBreathData] = useState<BreathData | null>(null);
  const [result, setResult] = useState<ReturnType<typeof analyzeBreath> | null>(null);
  const [colorHue, setColorHue] = useState(160); // starts teal

  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const peaksRef = useRef<number[]>([]);
  const amplitudesRef = useRef<number[]>([]);
  const lastPeakRef = useRef(0);
  const isListeningRef = useRef(false);

  // Countdown timer
  useEffect(() => {
    if (stage !== "listening") return;
    if (seconds <= 0) {
      finishListening();
      return;
    }
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [stage, seconds]);

  // Real-time breath detection
  useEffect(() => {
    if (stage !== "listening") return;
    isListeningRef.current = true;

    const detect = () => {
      if (!isListeningRef.current || !analyserRef.current) return;
      const analyser = analyserRef.current;
      const data = new Uint8Array(analyser.fftSize);
      analyser.getByteTimeDomainData(data);

      // RMS
      let sum = 0;
      for (let i = 0; i < data.length; i++) {
        const v = (data[i] - 128) / 128;
        sum += v * v;
      }
      const rms = Math.sqrt(sum / data.length);
      amplitudesRef.current.push(rms);

      // Peak detection (breath = amplitude spike)
      const now = Date.now();
      if (rms > 0.04 && now - lastPeakRef.current > 1500) {
        peaksRef.current.push(now);
        lastPeakRef.current = now;
      }

      // Color shift based on amplitude
      const hue = 160 + rms * 400; // teal → green → yellow on strong breath
      setColorHue(hue);

      requestAnimationFrame(detect);
    };
    detect();

    return () => {
      isListeningRef.current = false;
    };
  }, [stage]);

  const requestMic = useCallback(async () => {
    setStage("permission");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.8;
      source.connect(analyser);
      analyserRef.current = analyser;

      // Reset
      peaksRef.current = [];
      amplitudesRef.current = [];
      lastPeakRef.current = 0;
      setSeconds(30);

      setStage("listening");
    } catch {
      setStage("intro");
    }
  }, []);

  const finishListening = useCallback(() => {
    isListeningRef.current = false;
    setStage("analyzing");

    // Stop mic
    streamRef.current?.getTracks().forEach((t) => t.stop());

    // Calculate breath data
    const peaks = peaksRef.current;
    const amps = amplitudesRef.current;
    const duration = 30; // seconds
    const breathCount = peaks.length;
    const bpm = (breathCount / duration) * 60;
    const avgAmp = amps.length > 0 ? amps.reduce((a, b) => a + b, 0) / amps.length : 0;
    const depth = Math.min(avgAmp * 10, 1);

    // Regularity: how consistent are intervals between peaks
    let regularity = 0.5;
    if (peaks.length > 2) {
      const intervals = [];
      for (let i = 1; i < peaks.length; i++) {
        intervals.push(peaks[i] - peaks[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const variance = intervals.reduce((sum, v) => sum + (v - avgInterval) ** 2, 0) / intervals.length;
      const stdDev = Math.sqrt(variance);
      regularity = Math.max(0, 1 - stdDev / avgInterval);
    }

    const data: BreathData = { bpm, depth, regularity, peaks };
    setBreathData(data);

    // Analyze after dramatic pause
    setTimeout(() => {
      setResult(analyzeBreath(data));
      setStage("result");
    }, 3000);
  }, []);

  const restart = useCallback(() => {
    setStage("intro");
    setBreathData(null);
    setResult(null);
    setColorHue(160);
    peaksRef.current = [];
    amplitudesRef.current = [];
  }, []);

  return (
    <div className="fixed inset-0 bg-[#050810] text-white overflow-y-auto" dir="rtl">
      {/* Visualizer runs during listening */}
      <BreathVisualizer
        analyserRef={analyserRef}
        isListening={stage === "listening"}
        colorHue={colorHue}
      />

      <AnimatePresence mode="wait">
        {/* ── INTRO ── */}
        {stage === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6"
          >
            {/* Subtle ambient circles */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.03, 0.06, 0.03] }}
                transition={{ duration: 6, repeat: Infinity }}
                className="w-80 h-80 rounded-full border border-white/5"
              />
              <motion.div
                animate={{ scale: [1.2, 1.5, 1.2], opacity: [0.02, 0.05, 0.02] }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute w-[500px] h-[500px] rounded-full border border-white/5"
              />
            </div>

            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="text-center relative"
            >
              {/* Breathing icon */}
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-teal-500/20 to-emerald-500/10 border border-teal-400/20 flex items-center justify-center"
              >
                <span className="text-4xl">🫁</span>
              </motion.div>

              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black mb-4 bg-gradient-to-l from-teal-300 via-emerald-400 to-teal-300 bg-clip-text text-transparent">
                نَفَسَك
              </h1>
              <p className="text-white/40 text-base sm:text-lg max-w-md mx-auto mb-3 leading-relaxed">
                نَفَسك يحكي عنك أكتر مما تتخيل
              </p>
              <p className="text-white/25 text-sm max-w-sm mx-auto mb-10 leading-relaxed">
                هنسمع تنفسك لمدة 30 ثانية — ونحلل حالتك الجسدية والنفسية — ونرشحلك الوجهة العلاجية المثالية
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={requestMic}
                className="px-10 py-4 bg-gradient-to-l from-teal-500 to-emerald-600 text-white font-bold rounded-full text-sm shadow-[0_0_40px_rgba(20,184,166,0.3)] hover:shadow-[0_0_60px_rgba(20,184,166,0.5)] transition-shadow"
              >
                🎤 ابدأ الاستماع
              </motion.button>

              <div className="mt-6 text-white/15 text-[11px]">
                سنستخدم المايكروفون فقط لتحليل التنفس — لا يتم تسجيل أو حفظ أي صوت
              </div>
            </motion.div>

            <Link
              href="/home"
              className="absolute bottom-8 text-white/20 hover:text-white/40 text-xs no-underline transition-colors"
            >
              ← العودة
            </Link>
          </motion.div>
        )}

        {/* ── PERMISSION (brief loading) ── */}
        {stage === "permission" && (
          <motion.div
            key="permission"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 min-h-screen flex items-center justify-center"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-2 border-teal-400/30 border-t-teal-400 rounded-full mx-auto mb-4"
              />
              <p className="text-white/50 text-sm">جاري الاتصال بالمايكروفون...</p>
            </div>
          </motion.div>
        )}

        {/* ── LISTENING ── */}
        {stage === "listening" && (
          <motion.div
            key="listening"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6"
          >
            {/* Timer */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-center"
            >
              <div className="text-white/30 text-xs uppercase tracking-[0.4em] mb-4">
                🎤 بنسمع تنفسك
              </div>

              {/* Big countdown */}
              <div className="relative w-40 h-40 mx-auto mb-8">
                {/* Progress ring */}
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50" cy="50" r="44"
                    fill="none"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="2"
                  />
                  <motion.circle
                    cx="50" cy="50" r="44"
                    fill="none"
                    stroke="url(#timerGrad)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeDasharray={276.5}
                    initial={{ strokeDashoffset: 0 }}
                    animate={{ strokeDashoffset: 276.5 }}
                    transition={{ duration: 30, ease: "linear" }}
                  />
                  <defs>
                    <linearGradient id="timerGrad">
                      <stop offset="0%" stopColor="#14b8a6" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-5xl font-mono font-bold text-white">
                    {seconds}
                  </span>
                </div>
              </div>

              <p className="text-white/50 text-sm mb-2">
                تنفس بطبيعية... لا تغيّر شيئاً
              </p>
              <p className="text-white/25 text-xs">
                أنفاس تم رصدها: {peaksRef.current.length}
              </p>

              {/* Skip button */}
              {seconds < 20 && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={finishListening}
                  className="mt-8 text-white/20 hover:text-white/40 text-xs underline transition-colors"
                >
                  كفاية — حلل دلوقتي
                </motion.button>
              )}
            </motion.div>
          </motion.div>
        )}

        {/* ── ANALYZING ── */}
        {stage === "analyzing" && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 min-h-screen flex items-center justify-center"
          >
            <div className="text-center">
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-5xl mb-6"
              >
                🫁
              </motion.div>
              <h2 className="text-xl font-bold text-white mb-2 font-display">
                بنحلل نَفَسك...
              </h2>
              <p className="text-white/40 text-sm">
                {breathData && `رصدنا ${breathData.peaks.length} نَفَس في 30 ثانية`}
              </p>
            </div>
          </motion.div>
        )}

        {/* ── RESULT ── */}
        {stage === "result" && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-10 min-h-screen flex items-center justify-center py-16 px-4"
          >
            <div className="w-full max-w-lg">
              {/* Header */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-center mb-8"
              >
                <div className="text-xs uppercase tracking-[0.4em] text-teal-400/60 mb-2">
                  تحليل نَفَسك
                </div>
                <h2 className="text-3xl font-display font-black text-white">
                  نتيجة التحليل
                </h2>
              </motion.div>

              {/* Breath stats */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-6"
              >
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-teal-400 font-mono">{result.bpm}</div>
                    <div className="text-[10px] text-white/40 mt-1">نَفَس/دقيقة</div>
                    <div className="text-[9px] text-white/20">(طبيعي: 12-16)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white font-mono">
                      {result.stressLevel}%
                    </div>
                    <div className="text-[10px] text-white/40 mt-1">مستوى التوتر</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-white leading-tight mt-1">
                      {result.pattern}
                    </div>
                    <div className="text-[10px] text-white/40 mt-1">نمط التنفس</div>
                  </div>
                </div>

                {/* Stress bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-[10px] text-white/30 mb-1">
                    <span>مرتاح</span>
                    <span>متوتر</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${result.stressLevel}%` }}
                      transition={{ delay: 0.8, duration: 1.5 }}
                      className="h-full rounded-full"
                      style={{
                        background: `linear-gradient(90deg, #10b981, #f59e0b ${Math.min(result.stressLevel * 1.5, 100)}%, #ef4444)`,
                      }}
                    />
                  </div>
                </div>

                <p className="text-white/60 text-sm leading-relaxed">
                  {result.analysis}
                </p>
              </motion.div>

              {/* Recommendation */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-br from-teal-500/10 to-emerald-600/5 border border-teal-400/20 rounded-2xl p-6 mb-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-2xl flex-shrink-0">
                    {result.top.dest.envIcon}
                  </div>
                  <div>
                    <div className="text-[10px] text-teal-400/60 uppercase tracking-wider">
                      جسمك يحتاج
                    </div>
                    <div className="text-xl font-display font-black text-white">
                      {result.top.dest.name}
                    </div>
                    <div className="text-xs text-white/40">
                      توافق {result.top.percent}%
                    </div>
                  </div>
                </div>

                <p className="text-white/60 text-sm leading-relaxed mb-4 italic">
                  &ldquo;{result.message}&rdquo;
                </p>

                {/* All scores */}
                <div className="space-y-2">
                  {result.results.map((r, i) => (
                    <div key={r.dest.id} className="flex items-center gap-2">
                      <span className="text-sm w-6 text-center">{r.dest.envIcon}</span>
                      <span className="text-white/50 text-[11px] w-20 truncate">{r.dest.name}</span>
                      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${r.percent}%` }}
                          transition={{ delay: 1 + i * 0.12, duration: 0.8 }}
                          className={`h-full rounded-full ${i === 0 ? "bg-gradient-to-l from-teal-400 to-emerald-500" : "bg-white/15"}`}
                        />
                      </div>
                      <span className="text-white/30 text-[10px] w-8 text-left font-mono">{r.percent}%</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Actions */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <Link
                  href={`/destination/${result.top.dest.id}`}
                  className="flex-1 text-center py-3.5 bg-gradient-to-l from-teal-500 to-emerald-600 text-white font-bold rounded-full no-underline text-sm hover:shadow-[0_8px_24px_rgba(20,184,166,0.4)] transition-shadow"
                >
                  اكتشف {result.top.dest.name} ←
                </Link>
                <button
                  onClick={restart}
                  className="flex-1 py-3.5 bg-white/5 hover:bg-white/10 text-white/70 font-bold rounded-full text-sm border border-white/10 transition-colors"
                >
                  أعد التحليل
                </button>
                <Link
                  href="/therapy-room"
                  className="flex-1 text-center py-3.5 bg-white/5 hover:bg-white/10 text-white/70 font-bold rounded-full no-underline text-sm border border-white/10 transition-colors"
                >
                  جرب تمرين تنفس
                </Link>
              </motion.div>

              <div className="mt-6 text-center text-white/15 text-[10px]">
                هذا التحليل تقريبي وليس بديلاً عن استشارة طبية
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
