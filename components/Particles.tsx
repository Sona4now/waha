"use client";

import { useEffect, useRef } from "react";

interface Props {
  type?: "stars" | "sand" | "dust";
  count?: number;
  color?: string;
}

export default function Particles({
  type = "dust",
  count = 50,
  color = "rgba(255,255,255,0.4)",
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let particles: {
      x: number;
      y: number;
      r: number;
      vx: number;
      vy: number;
      opacity: number;
      pulse: number;
    }[] = [];

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    // Init particles
    for (let i = 0; i < count; i++) {
      const r =
        type === "stars"
          ? Math.random() * 2 + 0.5
          : type === "sand"
            ? Math.random() * 1.5 + 0.3
            : Math.random() * 1.2 + 0.2;
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r,
        vx:
          type === "sand"
            ? Math.random() * 0.8 + 0.2
            : (Math.random() - 0.5) * 0.3,
        vy:
          type === "stars"
            ? 0
            : type === "sand"
              ? Math.random() * 0.3 - 0.1
              : -Math.random() * 0.2 - 0.05,
        opacity: Math.random() * 0.6 + 0.2,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      for (const p of particles) {
        // Update
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.01;

        // Wrap around
        if (p.x > canvas!.width + 5) p.x = -5;
        if (p.x < -5) p.x = canvas!.width + 5;
        if (p.y > canvas!.height + 5) p.y = -5;
        if (p.y < -5) p.y = canvas!.height + 5;

        const flicker =
          type === "stars"
            ? p.opacity * (0.6 + 0.4 * Math.sin(p.pulse))
            : p.opacity;

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = color.replace(
          /[\d.]+\)$/,
          `${flicker})`
        );
        ctx!.fill();
      }

      animId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [type, count, color]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-[1]"
    />
  );
}
