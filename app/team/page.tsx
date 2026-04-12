"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SiteLayout from "@/components/site/SiteLayout";

interface TeamMember {
  id: number;
  name: string;
  x: number; // 0-100 percentage
  y: number; // 0-62 percentage (matches viewBox)
}

const TEAM: TeamMember[] = [
  { id: 1, name: "مالك محمد علي", x: 50, y: 7 },
  { id: 2, name: "أحمد محمد ربيع", x: 36, y: 14 },
  { id: 3, name: "إبراهيم هاني إبراهيم", x: 64, y: 14 },
  { id: 4, name: "نادين هيثم عبدالعزيز", x: 24, y: 21 },
  { id: 5, name: "مريم إبراهيم أحمد", x: 50, y: 19 },
  { id: 6, name: "صفاء محمد الشقنقيري", x: 76, y: 21 },
  { id: 7, name: "جنة أيمن محمد", x: 14, y: 28 },
  { id: 8, name: "مريم بهاء الدين محمد سالم", x: 35, y: 27 },
  { id: 9, name: "روان عاطف سعد", x: 50, y: 30 },
  { id: 10, name: "منة خالد أحمد", x: 65, y: 27 },
  { id: 11, name: "حنين عمرو عبد الرحمن", x: 86, y: 28 },
  { id: 12, name: "يوسف محمد فؤاد", x: 28, y: 35 },
  { id: 13, name: "عبدالرحمن محمود محمد زين", x: 44, y: 37 },
  { id: 14, name: "علي فهد إسماعيل", x: 56, y: 37 },
  { id: 15, name: "لانا عادل خليفة", x: 72, y: 35 },
  { id: 16, name: "آية أشرف صلاح الدين", x: 20, y: 43 },
  { id: 17, name: "حبيبة محمود مصطفى", x: 40, y: 44 },
  { id: 18, name: "مريم شيرين أحمد", x: 60, y: 44 },
  { id: 19, name: "جنا تامر عبدالخالق", x: 80, y: 43 },
  { id: 20, name: "زينب محمود ماهر", x: 35, y: 51 },
  { id: 21, name: "نيرة حفني سلامة", x: 65, y: 51 },
  { id: 22, name: "آية فتحي محمد السيد", x: 50, y: 55 },
  { id: 23, name: "رمزي علاء الدين عبدالله", x: 50, y: 60 },
];

// Connection lines — pairs of member IDs to link
const CONNECTIONS: [number, number][] = [
  // Top pyramid
  [1, 2],
  [1, 3],
  [1, 5],
  [2, 4],
  [2, 5],
  [3, 5],
  [3, 6],
  // Second layer
  [4, 7],
  [4, 8],
  [5, 8],
  [5, 9],
  [5, 10],
  [6, 10],
  [6, 11],
  // Third layer
  [7, 12],
  [8, 12],
  [8, 13],
  [9, 13],
  [9, 14],
  [10, 14],
  [10, 15],
  [11, 15],
  // Fourth layer
  [12, 16],
  [12, 17],
  [13, 17],
  [14, 18],
  [15, 18],
  [15, 19],
  // Fifth layer
  [16, 20],
  [17, 20],
  [17, 22],
  [18, 22],
  [18, 21],
  [19, 21],
  // Bottom tail
  [20, 23],
  [21, 23],
  [22, 23],
];

// Procedural background stars
function generateBackgroundStars(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 62,
    r: 0.1 + Math.random() * 0.25,
    delay: Math.random() * 5,
    duration: 2 + Math.random() * 4,
    opacity: 0.2 + Math.random() * 0.6,
  }));
}

export default function TeamPage() {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const bgStars = useMemo(() => generateBackgroundStars(180), []);

  // Auto-rotate highlight on mobile to show interactivity
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("ontouchstart" in window)) return;

    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % TEAM.length;
      setActiveId(TEAM[index].id);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const currentActive = hoveredId ?? activeId;
  const activeMember = currentActive
    ? TEAM.find((m) => m.id === currentActive)
    : null;

  // Check which connections involve the active star
  const isConnectionActive = (a: number, b: number) =>
    currentActive === a || currentActive === b;

  // Check if a star is connected to the active one
  const isStarConnected = (id: number) => {
    if (!currentActive || currentActive === id) return false;
    return CONNECTIONS.some(
      ([a, b]) =>
        (a === currentActive && b === id) || (b === currentActive && a === id)
    );
  };

  return (
    <SiteLayout>
      {/* Immersive dark hero */}
      <section className="relative bg-gradient-to-b from-[#050a14] via-[#0a0e1a] to-[#0d1b2a] overflow-hidden">
        {/* Top decoration */}
        <div className="pt-28 pb-8 md:pt-36 md:pb-12 px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-[#91b149] font-bold mb-4">
              <span className="w-8 h-px bg-gradient-to-r from-transparent to-[#91b149]" />
              فريق واحة
              <span className="w-8 h-px bg-gradient-to-l from-transparent to-[#91b149]" />
            </div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-4xl md:text-6xl font-black font-display text-white mb-4 leading-tight"
            >
              كوكبة من{" "}
              <span className="bg-gradient-to-l from-[#91b149] to-[#6a8435] bg-clip-text text-transparent">
                23 نجماً
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-white/60 text-sm md:text-base max-w-md mx-auto"
            >
              كل نجم في هذه الكوكبة يمثل عقلاً أسهم في بناء واحة
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="text-white/30 text-xs mt-2"
            >
              مرّر مؤشر الفأرة فوق أي نجم للتعرف عليه
            </motion.p>
          </motion.div>
        </div>

        {/* Constellation Canvas */}
        <div className="relative w-full" style={{ aspectRatio: "100 / 62" }}>
          {/* Background twinkling stars */}
          <svg
            viewBox="0 0 100 62"
            preserveAspectRatio="xMidYMid slice"
            className="absolute inset-0 w-full h-full"
          >
            {bgStars.map((star) => (
              <circle
                key={`bg-${star.id}`}
                cx={star.x}
                cy={star.y}
                r={star.r}
                fill="white"
                style={{
                  animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
                  opacity: star.opacity,
                }}
              />
            ))}
          </svg>

          {/* Main constellation SVG */}
          <svg
            viewBox="0 0 100 62"
            preserveAspectRatio="xMidYMid meet"
            className="absolute inset-0 w-full h-full"
          >
            <defs>
              {/* Glow filter for stars */}
              <filter id="star-glow" x="-150%" y="-150%" width="400%" height="400%">
                <feGaussianBlur stdDeviation="0.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter
                id="star-glow-strong"
                x="-200%"
                y="-200%"
                width="500%"
                height="500%"
              >
                <feGaussianBlur stdDeviation="1.2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Gradient for active lines */}
              <linearGradient id="line-active" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#91b149" stopOpacity="1" />
                <stop offset="50%" stopColor="#a3c45a" stopOpacity="1" />
                <stop offset="100%" stopColor="#91b149" stopOpacity="1" />
              </linearGradient>
            </defs>

            {/* Connection lines */}
            <g>
              {CONNECTIONS.map(([a, b], i) => {
                const starA = TEAM.find((t) => t.id === a)!;
                const starB = TEAM.find((t) => t.id === b)!;
                const active = isConnectionActive(a, b);
                return (
                  <motion.line
                    key={`line-${i}`}
                    x1={starA.x}
                    y1={starA.y}
                    x2={starB.x}
                    y2={starB.y}
                    stroke={active ? "#91b149" : "#ffffff"}
                    strokeWidth={active ? 0.22 : 0.08}
                    strokeOpacity={active ? 0.9 : 0.12}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{
                      pathLength: 1,
                      opacity: active ? 0.9 : 0.12,
                    }}
                    transition={{
                      pathLength: {
                        duration: 1.2,
                        delay: 0.5 + i * 0.04,
                        ease: [0.22, 1, 0.36, 1],
                      },
                      opacity: {
                        duration: 0.4,
                      },
                    }}
                  />
                );
              })}
            </g>

            {/* Stars — team members */}
            <g>
              {TEAM.map((member, i) => {
                const isActive = currentActive === member.id;
                const isConnected = isStarConnected(member.id);
                const radius = isActive ? 1.4 : isConnected ? 1.0 : 0.75;

                return (
                  <motion.g
                    key={member.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.3 + i * 0.04,
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                    }}
                  >
                    {/* Outer glow ring (when active) */}
                    {isActive && (
                      <motion.circle
                        cx={member.x}
                        cy={member.y}
                        r={3}
                        fill="none"
                        stroke="#91b149"
                        strokeWidth={0.15}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{
                          opacity: [0.8, 0.3, 0.8],
                          scale: [1, 1.3, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    )}

                    {/* Star core */}
                    <motion.circle
                      cx={member.x}
                      cy={member.y}
                      r={radius}
                      fill={isActive || isConnected ? "#91b149" : "white"}
                      filter={
                        isActive ? "url(#star-glow-strong)" : "url(#star-glow)"
                      }
                      style={{
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={() => setHoveredId(member.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onClick={() => setActiveId(member.id)}
                      animate={{
                        r: radius,
                      }}
                      transition={{ type: "spring", stiffness: 250, damping: 15 }}
                    />

                    {/* Invisible larger hit area */}
                    <circle
                      cx={member.x}
                      cy={member.y}
                      r={2.5}
                      fill="transparent"
                      style={{ cursor: "pointer" }}
                      onMouseEnter={() => setHoveredId(member.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onClick={() => setActiveId(member.id)}
                    />
                  </motion.g>
                );
              })}
            </g>
          </svg>

          {/* Info card overlay */}
          <AnimatePresence>
            {activeMember && (
              <motion.div
                key={activeMember.id}
                initial={{ opacity: 0, y: 8, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.92 }}
                transition={{
                  type: "spring",
                  stiffness: 350,
                  damping: 22,
                }}
                className="absolute z-20 pointer-events-none"
                style={{
                  left: `${activeMember.x}%`,
                  top: `${(activeMember.y / 62) * 100}%`,
                  transform: `translate(-50%, calc(-100% - ${activeMember.y < 15 ? "-24px" : activeMember.y > 45 ? "-24px" : "24px"}))`,
                }}
              >
                <div
                  className={`${activeMember.y > 45 ? "order-2" : ""} relative bg-white/[0.04] backdrop-blur-md border border-[#91b149]/40 rounded-xl px-4 py-2.5 shadow-[0_20px_60px_-12px_rgba(145,177,73,0.4)] whitespace-nowrap`}
                >
                  <div className="text-[8px] uppercase tracking-[0.2em] text-[#91b149] font-bold mb-0.5">
                    عضو في الفريق
                  </div>
                  <div className="text-white font-bold text-sm font-display">
                    {activeMember.name}
                  </div>
                  {/* Glow */}
                  <div className="absolute inset-0 rounded-xl bg-[#91b149]/5 blur-lg -z-10" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom gradient fade */}
        <div className="h-24 bg-gradient-to-b from-transparent to-[#0d1b2a] -mt-20 relative z-0 pointer-events-none" />

        {/* Footer note */}
        <div className="relative z-10 pb-20 px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#91b149]/40" />
              <span className="text-3xl">🌿</span>
              <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#91b149]/40" />
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-2">
              مثل النجوم التي تنير السماء في ليالي الصحراء، كل عضو في فريقنا
              أضاء جانباً من هذه المنصة
            </p>
            <p className="text-white/30 text-xs">
              شكراً لكم جميعاً على العمل الجاد والإبداع
            </p>
          </motion.div>
        </div>
      </section>

      <style jsx global>{`
        @keyframes twinkle {
          0%,
          100% {
            opacity: var(--twinkle-min, 0.2);
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </SiteLayout>
  );
}
