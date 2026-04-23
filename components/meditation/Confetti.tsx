"use client";

import { useEffect, useRef } from "react";

/**
 * One-shot confetti burst, canvas-drawn, fires for ~2s then stops on its own.
 *
 * Tiny on purpose — no dependencies, no external assets. Call once when the
 * summary mounts with `fullyCompleted`. Particles fall under gravity with
 * slight wind, fade as they drop below the fold, and the component self-
 * terminates when all are dead.
 *
 * Colors match the brand palette (primary teal + accent green + warm gold).
 */

interface Piece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  color: string;
  shape: "rect" | "circle";
  size: number;
  alpha: number;
}

const COLORS = ["#91b149", "#1d5770", "#f5c26b", "#ffffff", "#62a6b8"];

function rand(a: number, b: number) {
  return a + Math.random() * (b - a);
}

export default function Confetti({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Spawn ~110 pieces from roughly the center-top
    const pieces: Piece[] = Array.from({ length: 110 }, () => ({
      x: window.innerWidth / 2 + rand(-40, 40),
      y: window.innerHeight / 2 - rand(60, 120),
      vx: rand(-6, 6),
      vy: rand(-14, -6),
      rot: rand(0, Math.PI * 2),
      vr: rand(-0.3, 0.3),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      shape: Math.random() < 0.5 ? "rect" : "circle",
      size: rand(5, 10),
      alpha: 1,
    }));

    const gravity = 0.35;
    const wind = 0.03;
    let dead = 0;

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dead = 0;
      for (const p of pieces) {
        if (p.alpha <= 0) {
          dead++;
          continue;
        }
        p.vy += gravity;
        p.vx += wind * (Math.random() - 0.5);
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        if (p.y > window.innerHeight + 20) p.alpha -= 0.04;
        else if (p.y > window.innerHeight * 0.9) p.alpha -= 0.01;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        if (p.shape === "rect") {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      if (dead >= pieces.length) {
        // all particles have faded — stop the loop
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-[70] pointer-events-none"
    />
  );
}
