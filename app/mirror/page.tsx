"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { DESTINATIONS } from "@/data/siteData";

/* ═══════════════════════════════════════════════
   DESTINATION HEALING PROFILES
   ═══════════════════════════════════════════════ */

const HEALING_PROFILES = [
  {
    destId: "safaga",
    label: "بعد 14 يوم في سفاجا",
    transform: { brightness: 1.15, contrast: 1.05, saturate: 1.2, warmth: 15, glow: 0.3 },
    skinMessage: "البحر الأحمر هيعيد لبشرتك النور اللي فقدته",
    bodyMessage: "المعادن الطبيعية هتغذي كل خلية في جسمك",
    spiritMessage: "هتحس بطاقة وحيوية ما حسيتش بيها من سنين",
    duration: "14 يوم",
    icon: "🌊",
  },
  {
    destId: "siwa",
    label: "بعد 21 يوم في سيوة",
    transform: { brightness: 1.12, contrast: 1.02, saturate: 1.1, warmth: 20, glow: 0.4 },
    skinMessage: "العيون الكبريتية هتنقي بشرتك من السموم المتراكمة",
    bodyMessage: "الصمت والهدوء هيعيدوا لجسمك التوازن المفقود",
    spiritMessage: "هتلاقي سلام داخلي نسيت إنه موجود",
    duration: "21 يوم",
    icon: "🏜️",
  },
  {
    destId: "sinai",
    label: "بعد 10 أيام في سيناء",
    transform: { brightness: 1.1, contrast: 1.08, saturate: 1.05, warmth: 8, glow: 0.25 },
    skinMessage: "هواء الجبال النقي هيخلي بشرتك تتنفس من جديد",
    bodyMessage: "الأعشاب البرية والينابيع هتزيل الألم من مفاصلك",
    spiritMessage: "هتنزل من الجبل إنسان أقوى مما صعدت",
    duration: "10 أيام",
    icon: "⛰️",
  },
  {
    destId: "fayoum",
    label: "بعد 7 أيام في الفيوم",
    transform: { brightness: 1.18, contrast: 1.0, saturate: 1.15, warmth: 12, glow: 0.35 },
    skinMessage: "الهواء النقي والطبيعة هيرجعوا لوجهك النضارة",
    bodyMessage: "بعيد عن المدينة، جسمك هيبدأ يصلّح نفسه",
    spiritMessage: "هتفتكر إزاي كان شكل الراحة الحقيقية",
    duration: "7 أيام",
    icon: "🌴",
  },
  {
    destId: "bahariya",
    label: "بعد 14 يوم في الواحات",
    transform: { brightness: 1.13, contrast: 1.04, saturate: 1.18, warmth: 18, glow: 0.3 },
    skinMessage: "الرمال الدافئة هتجدد خلايا بشرتك بالكامل",
    bodyMessage: "الدفن في الرمال — علاج فرعوني هيشيل الألم",
    spiritMessage: "تحت نجوم الصحراء هتلاقي نفسك من جديد",
    duration: "14 يوم",
    icon: "🟠",
  },
];

/* ═══════════════════════════════════════════════
   FACE ANALYSIS (simulated from frame luminance)
   ═══════════════════════════════════════════════ */

function analyzeFace(canvas: HTMLCanvasElement): {
  fatigue: number;
  paleness: number;
  tension: number;
  overall: string;
  details: string[];
} {
  const ctx = canvas.getContext("2d")!;
  const w = canvas.width;
  const h = canvas.height;

  // Sample center region (face area)
  const faceX = Math.floor(w * 0.25);
  const faceY = Math.floor(h * 0.15);
  const faceW = Math.floor(w * 0.5);
  const faceH = Math.floor(h * 0.55);

  let imageData: ImageData;
  try {
    imageData = ctx.getImageData(faceX, faceY, faceW, faceH);
  } catch {
    return { fatigue: 50, paleness: 50, tension: 50, overall: "متوسط", details: [] };
  }

  const data = imageData.data;
  let totalBrightness = 0;
  let totalSaturation = 0;
  let totalWarmth = 0;
  const pixelCount = data.length / 4;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const brightness = (r + g + b) / 3;
    totalBrightness += brightness;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    totalSaturation += max > 0 ? (max - min) / max : 0;
    totalWarmth += r - b; // warm = more red than blue
  }

  const avgBrightness = totalBrightness / pixelCount;
  const avgSaturation = totalSaturation / pixelCount;
  const avgWarmth = totalWarmth / pixelCount;

  // Map to fatigue/paleness/tension scores (0-100)
  const fatigue = Math.max(0, Math.min(100, 100 - avgBrightness * 0.5 + (1 - avgSaturation) * 30));
  const paleness = Math.max(0, Math.min(100, 100 - avgWarmth * 0.5 - avgSaturation * 40));
  const tension = Math.max(0, Math.min(100, (fatigue + paleness) / 2 + Math.random() * 10));

  const overall =
    tension > 65 ? "مرهق بشكل واضح" :
    tension > 45 ? "إرهاق متوسط" :
    tension > 25 ? "حالة مقبولة" :
    "حالة جيدة";

  const details: string[] = [];
  if (fatigue > 50) details.push("علامات إرهاق واضحة على الوجه");
  if (paleness > 55) details.push("البشرة محتاجة تغذية وشمس طبيعية");
  if (avgBrightness < 110) details.push("إضاءة الوجه منخفضة — علامة نقص فيتامين D");
  if (avgSaturation < 0.15) details.push("لون البشرة باهت — الجسم محتاج معادن");
  if (details.length === 0) details.push("وجهك يبدو بحالة مقبولة — لكن العلاج الطبيعي هيحسنك أكتر");

  return { fatigue, paleness, tension, overall, details };
}

/* ═══════════════════════════════════════════════
   TRANSFORMATION CANVAS
   ═══════════════════════════════════════════════ */

function TransformView({
  videoRef,
  profile,
  sliderValue,
}: {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  profile: (typeof HEALING_PROFILES)[0];
  sliderValue: number; // 0 = now, 100 = after
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    const ctx = canvas.getContext("2d")!;

    const draw = () => {
      if (video.readyState < 2) {
        frameRef.current = requestAnimationFrame(draw);
        return;
      }

      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      // Draw mirrored video
      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
      ctx.restore();

      // Apply transformation based on slider
      const t = sliderValue / 100;
      const p = profile.transform;

      // Get image data and apply pixel-level warm filter
      if (t > 0.05) {
        try {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          const warmth = p.warmth * t;
          const brightnessBoost = (p.brightness - 1) * t * 40;
          const satBoost = 1 + (p.saturate - 1) * t;

          for (let i = 0; i < data.length; i += 4) {
            let r = data[i];
            let g = data[i + 1];
            let b = data[i + 2];

            // Brightness
            r = Math.min(255, r + brightnessBoost);
            g = Math.min(255, g + brightnessBoost * 0.9);
            b = Math.min(255, b + brightnessBoost * 0.7);

            // Warmth (add red, reduce blue)
            r = Math.min(255, r + warmth);
            b = Math.max(0, b - warmth * 0.5);

            // Saturation boost
            const gray = 0.299 * r + 0.587 * g + 0.114 * b;
            r = Math.min(255, gray + (r - gray) * satBoost);
            g = Math.min(255, gray + (g - gray) * satBoost);
            b = Math.min(255, gray + (b - gray) * satBoost);

            data[i] = r;
            data[i + 1] = g;
            data[i + 2] = b;
          }
          ctx.putImageData(imageData, 0, 0);
        } catch { /* cross-origin guard */ }

        // Soft glow overlay
        if (t > 0.3) {
          const glowAlpha = p.glow * (t - 0.3) * 0.5;
          const grad = ctx.createRadialGradient(
            canvas.width / 2, canvas.height / 2, canvas.height * 0.1,
            canvas.width / 2, canvas.height / 2, canvas.height * 0.7,
          );
          grad.addColorStop(0, `rgba(255, 240, 210, ${glowAlpha})`);
          grad.addColorStop(1, "transparent");
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      }

      frameRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(frameRef.current);
  }, [videoRef, profile, sliderValue]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full object-cover rounded-2xl"
      style={{ maxHeight: "60vh" }}
    />
  );
}

/* ═══════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════ */

type Stage = "intro" | "loading" | "scanning" | "reveal" | "result";

export default function MirrorPage() {
  const [stage, setStage] = useState<Stage>("intro");
  const [selectedDest, setSelectedDest] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);
  const [analysis, setAnalysis] = useState<ReturnType<typeof analyzeFace> | null>(null);
  const [autoPlayed, setAutoPlayed] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const captureCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const profile = HEALING_PROFILES[selectedDest];
  const dest = DESTINATIONS.find((d) => d.id === profile.destId);

  // Start camera
  const startCamera = useCallback(async () => {
    setStage("loading");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setStage("scanning");

      // Auto-analyze after 3 seconds
      setTimeout(() => {
        if (captureCanvasRef.current && videoRef.current) {
          const cv = captureCanvasRef.current;
          const v = videoRef.current;
          cv.width = v.videoWidth || 640;
          cv.height = v.videoHeight || 480;
          const ctx = cv.getContext("2d")!;
          ctx.save();
          ctx.scale(-1, 1);
          ctx.drawImage(v, -cv.width, 0, cv.width, cv.height);
          ctx.restore();
          const result = analyzeFace(cv);
          setAnalysis(result);
        }
        setStage("reveal");
      }, 3500);
    } catch {
      setStage("intro");
    }
  }, []);

  // Auto-play the transformation
  useEffect(() => {
    if (stage !== "reveal" || autoPlayed) return;
    setAutoPlayed(true);

    let value = 0;
    const interval = setInterval(() => {
      value += 0.5;
      if (value >= 100) {
        clearInterval(interval);
        value = 100;
        setTimeout(() => setStage("result"), 1000);
      }
      setSliderValue(value);
    }, 30); // ~3 seconds total

    return () => clearInterval(interval);
  }, [stage, autoPlayed]);

  // Reset when switching destination
  const switchDest = useCallback((idx: number) => {
    setSelectedDest(idx);
    setSliderValue(0);
    setAutoPlayed(false);
    setStage("reveal");
  }, []);

  const restart = useCallback(() => {
    // Stop camera
    const video = videoRef.current;
    if (video?.srcObject) {
      (video.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
      video.srcObject = null;
    }
    setStage("intro");
    setSliderValue(0);
    setAutoPlayed(false);
    setAnalysis(null);
    setSelectedDest(0);
  }, []);

  return (
    <div className="fixed inset-0 bg-[#050508] text-white overflow-y-auto" dir="rtl">
      {/* Hidden elements */}
      <video ref={videoRef} className="hidden" playsInline muted />
      <canvas ref={captureCanvasRef} className="hidden" />

      <AnimatePresence mode="wait">
        {/* ── INTRO ── */}
        {stage === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center px-6"
          >
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="text-center"
            >
              {/* Mirror icon */}
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(255,255,255,0.05)",
                    "0 0 60px rgba(255,255,255,0.1)",
                    "0 0 20px rgba(255,255,255,0.05)",
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-28 h-28 mx-auto mb-8 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center"
              >
                <span className="text-5xl">🪞</span>
              </motion.div>

              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black mb-4 text-white">
                المرآة
              </h1>
              <p className="text-white/40 text-base sm:text-lg max-w-md mx-auto mb-3 leading-relaxed">
                شوف نفسك بعد العلاج
              </p>
              <p className="text-white/20 text-sm max-w-sm mx-auto mb-10 leading-relaxed">
                هنفتح الكاميرا — نحلل وجهك — ونوريك إزاي هتتغير بعد رحلة علاجية حقيقية
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startCamera}
                className="px-10 py-4 bg-white text-[#050508] font-bold rounded-full text-sm shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_60px_rgba(255,255,255,0.25)] transition-shadow"
              >
                📸 افتح المرآة
              </motion.button>

              <div className="mt-5 text-white/15 text-[10px] max-w-xs mx-auto">
                الكاميرا تُستخدم مباشرة على جهازك فقط — لا يتم حفظ أو إرسال أي صور
              </div>
            </motion.div>

            <Link
              href="/home"
              className="absolute bottom-8 text-white/15 hover:text-white/30 text-xs no-underline transition-colors"
            >
              ← العودة
            </Link>
          </motion.div>
        )}

        {/* ── LOADING ── */}
        {stage === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full mx-auto mb-4"
              />
              <p className="text-white/40 text-sm">جاري تشغيل الكاميرا...</p>
            </div>
          </motion.div>
        )}

        {/* ── SCANNING ── */}
        {stage === "scanning" && (
          <motion.div
            key="scanning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center px-4"
          >
            <div className="relative w-full max-w-md">
              {/* Live camera feed */}
              <div className="relative rounded-2xl overflow-hidden border border-white/10">
                <TransformView videoRef={videoRef} profile={profile} sliderValue={0} />

                {/* Scan line animation */}
                <motion.div
                  animate={{ top: ["0%", "100%", "0%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
                />

                {/* Corner brackets */}
                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-white/30 rounded-tr-lg" />
                <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-white/30 rounded-tl-lg" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-white/30 rounded-br-lg" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-white/30 rounded-bl-lg" />

                {/* Label */}
                <div className="absolute bottom-6 left-0 right-0 text-center">
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="inline-block bg-black/60 backdrop-blur px-4 py-2 rounded-full text-white/80 text-sm"
                  >
                    🔍 جاري تحليل وجهك...
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── REVEAL (transformation happening) ── */}
        {(stage === "reveal" || stage === "result") && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen flex flex-col items-center py-6 px-4"
          >
            {/* Destination selector */}
            <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-2 w-full max-w-lg justify-center">
              {HEALING_PROFILES.map((p, i) => (
                <button
                  key={p.destId}
                  onClick={() => switchDest(i)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    selectedDest === i
                      ? "bg-white text-black"
                      : "bg-white/5 text-white/40 hover:bg-white/10"
                  }`}
                >
                  {p.icon} {DESTINATIONS.find((d) => d.id === p.destId)?.name}
                </button>
              ))}
            </div>

            {/* Main view */}
            <div className="relative w-full max-w-md mb-4">
              <div className="rounded-2xl overflow-hidden border border-white/10 relative">
                <TransformView videoRef={videoRef} profile={profile} sliderValue={sliderValue} />

                {/* Before/After label overlay */}
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur px-3 py-1 rounded-full">
                  <span className="text-white/80 text-xs font-bold">
                    {sliderValue < 50 ? "أنت دلوقتي" : profile.label}
                  </span>
                </div>

                {/* Glow border on high slider */}
                {sliderValue > 70 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 rounded-2xl border-2 border-white/20 pointer-events-none"
                    style={{ boxShadow: `0 0 ${sliderValue * 0.4}px rgba(255,255,255,0.1)` }}
                  />
                )}
              </div>
            </div>

            {/* Slider */}
            <div className="w-full max-w-md mb-6">
              <div className="flex justify-between text-[10px] text-white/30 mb-2 px-1">
                <span>أنت دلوقتي</span>
                <span>{profile.label}</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={sliderValue}
                onChange={(e) => {
                  setSliderValue(Number(e.target.value));
                  if (stage !== "result") setStage("result");
                }}
                className="w-full h-1.5 appearance-none bg-white/10 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_15px_rgba(255,255,255,0.4)] [&::-webkit-slider-thumb]:cursor-pointer"
              />
            </div>

            {/* Analysis + Message */}
            {stage === "result" && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="w-full max-w-md space-y-4"
              >
                {/* Face analysis */}
                {analysis && (
                  <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
                    <div className="text-[10px] uppercase tracking-[0.3em] text-white/30 mb-3">
                      تحليل وجهك
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="text-center">
                        <div className="text-xl font-bold text-white font-mono">{Math.round(analysis.fatigue)}%</div>
                        <div className="text-[10px] text-white/40">إرهاق</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-white font-mono">{Math.round(analysis.paleness)}%</div>
                        <div className="text-[10px] text-white/40">شحوب</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-white">{analysis.overall}</div>
                        <div className="text-[10px] text-white/40">الحالة العامة</div>
                      </div>
                    </div>
                    <ul className="space-y-1.5">
                      {analysis.details.map((d, i) => (
                        <li key={i} className="flex items-start gap-2 text-white/50 text-xs">
                          <span className="text-yellow-400/60 mt-0.5">⚠</span>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Healing promise */}
                <div className="bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl flex-shrink-0">
                      {profile.icon}
                    </div>
                    <div>
                      <div className="text-[10px] text-white/30 uppercase tracking-wider">
                        {profile.label}
                      </div>
                      <div className="font-display font-bold text-white text-lg">
                        {dest?.name}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      { icon: "✨", text: profile.skinMessage },
                      { icon: "💪", text: profile.bodyMessage },
                      { icon: "🧘", text: profile.spiritMessage },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.15 }}
                        className="flex items-start gap-2"
                      >
                        <span className="text-sm mt-0.5">{item.icon}</span>
                        <p className="text-white/60 text-sm leading-relaxed">{item.text}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Link
                    href={`/destination/${profile.destId}`}
                    className="flex-1 text-center py-3.5 bg-white text-[#050508] font-bold rounded-full no-underline text-sm hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-shadow"
                  >
                    اكتشف {dest?.name} ←
                  </Link>
                  <button
                    onClick={restart}
                    className="flex-1 py-3.5 bg-white/5 hover:bg-white/10 text-white/60 font-bold rounded-full text-sm border border-white/10 transition-colors"
                  >
                    أعد التجربة
                  </button>
                </div>

                <div className="text-center text-white/10 text-[10px] pt-2">
                  هذا التحليل تقريبي لأغراض توضيحية — لا يُغني عن استشارة طبية
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
