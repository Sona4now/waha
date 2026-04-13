"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import SiteLayout from "@/components/site/SiteLayout";
import { DESTINATIONS } from "@/data/siteData";

/* ── Body zones mapped to treatments & destinations ── */
const ZONES = [
  {
    id: "head",
    label: "الرأس والأعصاب",
    symptoms: ["صداع مزمن", "توتر", "أرق"],
    treatments: ["توتر", "استرخاء"],
    path: "M200,45 C200,20 160,8 150,8 C140,8 100,20 100,45 C100,75 120,95 150,95 C180,95 200,75 200,45Z",
    center: [150, 50],
    destIds: ["siwa", "fayoum"],
  },
  {
    id: "chest",
    label: "الصدر والتنفس",
    symptoms: ["ضيق تنفس", "حساسية", "ربو"],
    treatments: ["تنفس"],
    path: "M110,100 L190,100 L200,170 L185,185 L150,190 L115,185 L100,170Z",
    center: [150, 145],
    destIds: ["sinai", "bahariya"],
  },
  {
    id: "skin",
    label: "الجلد والبشرة",
    symptoms: ["صدفية", "إكزيما", "حساسية جلدية"],
    treatments: ["جلد"],
    path: "M100,170 L80,155 L60,175 L65,210 L85,220 L100,200Z M200,170 L220,155 L240,175 L235,210 L215,220 L200,200Z",
    center: [70, 190],
    destIds: ["safaga"],
  },
  {
    id: "spine",
    label: "الظهر والعمود الفقري",
    symptoms: ["آلام الظهر", "انزلاق غضروفي", "تيبس"],
    treatments: ["مفاصل"],
    path: "M140,100 L160,100 L162,200 L155,250 L145,250 L138,200Z",
    center: [150, 175],
    destIds: ["safaga", "bahariya"],
  },
  {
    id: "joints",
    label: "المفاصل والركب",
    symptoms: ["روماتيزم", "آلام مفاصل", "التهاب"],
    treatments: ["مفاصل"],
    path: "M95,250 L80,310 L90,315 L110,260Z M205,250 L220,310 L210,315 L190,260Z",
    center: [88, 280],
    destIds: ["safaga", "siwa", "bahariya"],
  },
  {
    id: "stomach",
    label: "المعدة والهضم",
    symptoms: ["اضطراب هضمي", "قولون عصبي", "حموضة"],
    treatments: ["استرخاء"],
    path: "M125,190 L175,190 L178,230 L170,245 L130,245 L122,230Z",
    center: [150, 218],
    destIds: ["siwa", "fayoum"],
  },
  {
    id: "feet",
    label: "القدمين والأطراف",
    symptoms: ["تورم", "آلام مزمنة", "ضعف الدورة الدموية"],
    treatments: ["مفاصل", "استرخاء"],
    path: "M78,315 L60,380 L55,395 L85,395 L95,380 L95,320Z M222,315 L240,380 L245,395 L215,395 L205,380 L205,320Z",
    center: [75, 360],
    destIds: ["safaga", "bahariya"],
  },
];

/* ── Particle system for the body outline ── */
function BodyParticles({
  activeZone,
  onZoneClick,
}: {
  activeZone: string | null;
  onZoneClick: (id: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<
    { x: number; y: number; ox: number; oy: number; zone: string; vx: number; vy: number }[]
  >([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animRef = useRef<number>(0);

  const initParticles = useCallback(() => {
    const particles: typeof particlesRef.current = [];
    // Generate particles along body paths
    ZONES.forEach((zone) => {
      const path = new Path2D(zone.path);
      // Scatter particles inside zone areas
      for (let i = 0; i < 120; i++) {
        const cx = zone.center[0];
        const cy = zone.center[1];
        const rx = 35 + Math.random() * 20;
        const ry = 45 + Math.random() * 25;
        const angle = Math.random() * Math.PI * 2;
        const r = Math.sqrt(Math.random());
        const x = cx + Math.cos(angle) * r * rx;
        const y = cy + Math.sin(angle) * r * ry;
        particles.push({
          x, y, ox: x, oy: y, zone: zone.id,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
        });
      }
    });
    particlesRef.current = particles;
  }, []);

  useEffect(() => {
    initParticles();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio, 2);
    canvas.width = 300 * dpr;
    canvas.height = 420 * dpr;
    ctx.scale(dpr, dpr);

    const animate = () => {
      ctx.clearRect(0, 0, 300, 420);
      const time = Date.now() * 0.001;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      particlesRef.current.forEach((p) => {
        // Breathing motion
        const breathe = Math.sin(time * 1.5 + p.ox * 0.02) * 1.5;
        let targetX = p.ox + breathe;
        let targetY = p.oy + Math.cos(time * 1.2 + p.oy * 0.02) * 1.2;

        // Mouse repulsion
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 50) {
          const force = (50 - dist) / 50;
          targetX += (dx / dist) * force * 20;
          targetY += (dy / dist) * force * 20;
        }

        // Spring back
        p.x += (targetX - p.x) * 0.08;
        p.y += (targetY - p.y) * 0.08;

        // Color based on zone state
        const isActive = activeZone === p.zone;
        const isHovered = dist < 60 && !activeZone;
        const zoneData = ZONES.find((z) => z.id === p.zone);

        if (isActive) {
          ctx.fillStyle = "#91b149";
          ctx.shadowColor = "#91b149";
          ctx.shadowBlur = 8;
          const s = 2.5 + Math.sin(time * 3 + p.ox) * 0.8;
          ctx.beginPath();
          ctx.arc(p.x, p.y, s, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        } else if (isHovered) {
          ctx.fillStyle = "rgba(255, 100, 100, 0.9)";
          ctx.shadowColor = "rgba(255, 80, 80, 0.6)";
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        } else {
          const alpha = 0.3 + Math.sin(time + p.ox * 0.1) * 0.15;
          ctx.fillStyle = `rgba(145, 177, 73, ${alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw connections between nearby particles
      ctx.strokeStyle = "rgba(145, 177, 73, 0.06)";
      ctx.lineWidth = 0.5;
      const pts = particlesRef.current;
      for (let i = 0; i < pts.length; i += 3) {
        for (let j = i + 3; j < pts.length; j += 3) {
          if (pts[i].zone !== pts[j].zone) continue;
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d = dx * dx + dy * dy;
          if (d < 400) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animRef.current);
  }, [activeZone, initParticles]);

  const handleMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseRef.current = {
      x: ((e.clientX - rect.left) / rect.width) * 300,
      y: ((e.clientY - rect.top) / rect.height) * 420,
    };
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = ((e.clientX - rect.left) / rect.width) * 300;
    const cy = ((e.clientY - rect.top) / rect.height) * 420;
    // Find closest zone
    let closest: string | null = null;
    let minDist = Infinity;
    ZONES.forEach((z) => {
      const dx = cx - z.center[0];
      const dy = cy - z.center[1];
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 55 && d < minDist) {
        minDist = d;
        closest = z.id;
      }
    });
    if (closest) onZoneClick(closest);
  };

  return (
    <canvas
      ref={canvasRef}
      className="w-[300px] h-[420px] cursor-pointer"
      style={{ imageRendering: "auto" }}
      onMouseMove={handleMove}
      onMouseLeave={() => (mouseRef.current = { x: -1000, y: -1000 })}
      onClick={handleClick}
    />
  );
}

/* ── Result panel ── */
function ZoneResult({ zone, onClose }: { zone: (typeof ZONES)[0]; onClose: () => void }) {
  const destinations = zone.destIds
    .map((id) => DESTINATIONS.find((d) => d.id === id))
    .filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ type: "spring", stiffness: 200, damping: 22 }}
      className="w-full max-w-md"
    >
      <div className="bg-[#162033] border border-[#1e3a5f] rounded-3xl p-6 md:p-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-[#91b149] font-bold mb-1">
              المنطقة المختارة
            </div>
            <h3 className="text-2xl font-display font-black text-white">
              {zone.label}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/60 flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Symptoms */}
        <div className="mb-6">
          <div className="text-xs font-bold text-white/50 mb-2">الأعراض المرتبطة</div>
          <div className="flex flex-wrap gap-2">
            {zone.symptoms.map((s) => (
              <span
                key={s}
                className="px-3 py-1 bg-red-500/15 text-red-400 text-xs font-bold rounded-full border border-red-500/20"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Recommended destinations */}
        <div className="mb-4">
          <div className="text-xs font-bold text-white/50 mb-3">
            الوجهات العلاجية المناسبة
          </div>
          <div className="space-y-3">
            {destinations.map((dest) => (
              <Link
                key={dest!.id}
                href={`/destination/${dest!.id}`}
                className="group flex items-center gap-4 p-3 bg-white/5 hover:bg-[#91b149]/15 border border-white/10 hover:border-[#91b149]/40 rounded-xl transition-all no-underline"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#91b149] to-[#6a8435] flex items-center justify-center text-xl flex-shrink-0">
                  {dest!.envIcon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-white group-hover:text-[#91b149] transition-colors">
                    {dest!.name}
                  </div>
                  <div className="text-[11px] text-white/40 truncate">
                    {dest!.treatments.join(" · ")}
                  </div>
                </div>
                <span className="text-white/30 group-hover:text-[#91b149] transition-colors">
                  ←
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Link
          href="/symptoms"
          className="block w-full text-center py-3 bg-gradient-to-l from-[#91b149] to-[#6a8435] text-white font-bold text-sm rounded-full no-underline mt-4 hover:shadow-[0_8px_24px_rgba(145,177,73,0.4)] transition-shadow"
        >
          تحليل تفصيلي لحالتك ←
        </Link>
      </div>
    </motion.div>
  );
}

/* ── Main page ── */
export default function BodyScannerPage() {
  const [activeZone, setActiveZone] = useState<string | null>(null);
  const activeData = ZONES.find((z) => z.id === activeZone);

  return (
    <SiteLayout>
      <div className="min-h-screen bg-[#070d15] relative overflow-hidden" dir="rtl">
        {/* Ambient background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(145,177,73,0.06)_0%,_transparent_70%)]" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#91b149]/[0.03] rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-20">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="text-[10px] uppercase tracking-[0.5em] text-[#91b149] font-bold mb-3">
              · Body Scanner ·
            </div>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
              وين بيوجعك؟
            </h1>
            <p className="text-white/40 text-sm max-w-md mx-auto">
              المس المنطقة اللي بتعاني منها على الجسم — هنرشحلك الوجهة العلاجية المثالية
            </p>
          </motion.div>

          {/* Body + Result */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">
            {/* Body visualization */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="relative"
            >
              {/* Glow ring */}
              <div className="absolute inset-[-30px] rounded-full border border-[#91b149]/10 animate-pulse" />
              <div className="absolute inset-[-60px] rounded-full border border-[#91b149]/5" />

              <BodyParticles
                activeZone={activeZone}
                onZoneClick={(id) =>
                  setActiveZone((prev) => (prev === id ? null : id))
                }
              />

              {/* Zone labels on hover */}
              {!activeZone && (
                <div className="absolute bottom-[-30px] left-1/2 -translate-x-1/2 text-white/30 text-xs animate-pulse">
                  حرّك الماوس على الجسم واضغط
                </div>
              )}
            </motion.div>

            {/* Result panel */}
            <AnimatePresence mode="wait">
              {activeData && (
                <ZoneResult
                  key={activeData.id}
                  zone={activeData}
                  onClose={() => setActiveZone(null)}
                />
              )}
            </AnimatePresence>

            {/* Empty state hint */}
            {!activeZone && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="hidden lg:block max-w-xs text-center"
              >
                <div className="text-6xl mb-4">🫀</div>
                <h3 className="text-white font-bold text-lg mb-2 font-display">
                  الجسم التفاعلي
                </h3>
                <p className="text-white/40 text-sm leading-relaxed">
                  اضغط على أي منطقة في الجسم لاكتشاف العلاج الطبيعي المناسب
                  والوجهة الاستشفائية المثالية في مصر
                </p>
                <div className="mt-6 grid grid-cols-2 gap-2">
                  {ZONES.slice(0, 4).map((z) => (
                    <button
                      key={z.id}
                      onClick={() => setActiveZone(z.id)}
                      className="text-[11px] px-3 py-2 bg-white/5 hover:bg-[#91b149]/15 border border-white/10 hover:border-[#91b149]/30 rounded-lg text-white/60 hover:text-white transition-all"
                    >
                      {z.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
