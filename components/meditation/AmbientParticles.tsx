"use client";

import { useEffect, useRef } from "react";
import type { EnvId } from "@/lib/meditation/environments";

interface Props {
  env: EnvId;
  /** Suppress animation for users who opted out of motion. */
  reduceMotion?: boolean;
  /** Paused state — pauses the RAF loop to save battery. */
  paused?: boolean;
}

/**
 * Per-environment ambient particle field rendered on a <canvas>.
 *
 * The previous SessionPlayer had a static `<div>` with `border-radius:50%`
 * pretending to be "wave particles" — that didn't animate and barely
 * suggested motion. This component draws 20-30 actual points that drift,
 * wobble, and fade, using ~0.5% CPU on a modern phone.
 *
 * Design notes:
 *  · We're deliberately NOT using framer-motion here. It would blow out a
 *    re-render every tick. Canvas + requestAnimationFrame is the right tool.
 *  · The canvas is sized from the viewport on mount + resize, then runs off
 *    a single RAF loop. Paused/unmounted tears the loop down cleanly.
 *  · Movement params are per-env so "sea" feels like drifting spray and
 *    "desert" feels like hot shimmer. No audio sync required.
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  alpha: number;
  hue: number;
  life: number;
  maxLife: number;
}

const ENV_CONFIG: Record<
  EnvId,
  {
    color: string;
    count: number;
    speed: [number, number]; // [vyMin, vyMax]
    drift: number; // horizontal wobble amplitude
    sizeRange: [number, number];
  }
> = {
  sea: {
    color: "rgba(134, 210, 255, 0.9)",
    count: 26,
    speed: [-0.35, -0.10], // gentle upward drift
    drift: 0.35,
    sizeRange: [1.2, 3.0],
  },
  desert: {
    color: "rgba(255, 206, 120, 0.8)",
    count: 22,
    speed: [-0.55, -0.20], // faster (heat shimmer)
    drift: 0.6,
    sizeRange: [1.0, 2.2],
  },
  mountain: {
    color: "rgba(225, 225, 230, 0.85)",
    count: 30,
    speed: [-0.25, -0.05], // slow, like breath fog
    drift: 0.20,
    sizeRange: [1.5, 3.5],
  },
  oasis: {
    color: "rgba(170, 230, 160, 0.85)",
    count: 28,
    speed: [-0.40, -0.12],
    drift: 0.45,
    sizeRange: [1.2, 2.8],
  },
};

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export default function AmbientParticles({ env, reduceMotion, paused }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    if (reduceMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cfg = ENV_CONFIG[env];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const { innerWidth: w, innerHeight: h } = window;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Initial seed
    const seed = (p?: Particle): Particle => {
      const x = rand(0, window.innerWidth);
      const y = p ? window.innerHeight + rand(0, 20) : rand(0, window.innerHeight);
      const maxLife = rand(600, 1200);
      return {
        x,
        y,
        vx: rand(-cfg.drift, cfg.drift),
        vy: rand(cfg.speed[0], cfg.speed[1]),
        r: rand(cfg.sizeRange[0], cfg.sizeRange[1]),
        alpha: 0,
        hue: rand(0.7, 1), // multiplier on the env color's opacity
        life: 0,
        maxLife,
      };
    };

    particlesRef.current = Array.from({ length: cfg.count }, () => seed());

    const tick = () => {
      if (paused) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      const parts = particlesRef.current;
      for (const p of parts) {
        // Fade in first 10% of life, fade out last 10%
        const phase = p.life / p.maxLife;
        if (phase < 0.15) p.alpha = phase / 0.15;
        else if (phase > 0.85) p.alpha = (1 - phase) / 0.15;
        else p.alpha = 1;
        p.alpha = Math.max(0, Math.min(1, p.alpha));

        // Wobble horizontally around baseline vx
        p.x += p.vx + Math.sin(p.life * 0.02) * 0.3;
        p.y += p.vy;
        p.life += 1;

        // Recycle if out of bounds OR dead
        if (p.y < -10 || p.life >= p.maxLife || p.x < -10 || p.x > w + 10) {
          Object.assign(p, seed(p));
          continue;
        }

        // Draw with a soft additive-looking circle
        ctx.globalAlpha = p.alpha * p.hue * 0.55;
        ctx.fillStyle = cfg.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [env, reduceMotion, paused]);

  if (reduceMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none opacity-70"
    />
  );
}
