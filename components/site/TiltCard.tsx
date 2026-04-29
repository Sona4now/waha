"use client";

import { useRef, ReactNode, MouseEvent } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";

interface Props {
  children: ReactNode;
  className?: string;
  /** Max tilt in degrees (default 10) */
  maxTilt?: number;
  /** Glare/light reflection effect */
  glare?: boolean;
  /** Scale on hover */
  scale?: number;
}

/**
 * TiltCard — 3D tilt effect that follows the mouse cursor.
 * Wraps any content and adds a premium interactive feel.
 */
export default function TiltCard({
  children,
  className = "",
  maxTilt = 8,
  glare = true,
  scale = 1.02,
}: Props) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // Mouse position
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smoothed springs for a natural feel
  const springConfig = { stiffness: 250, damping: 20, mass: 0.5 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  // Transform position to rotation
  const rotateX = useTransform(ySpring, [-0.5, 0.5], [maxTilt, -maxTilt]);
  const rotateY = useTransform(xSpring, [-0.5, 0.5], [-maxTilt, maxTilt]);

  // Glare position — always computed (hooks must not be conditional)
  const glareX = useTransform(xSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(ySpring, [-0.5, 0.5], ["0%", "100%"]);
  const glareBackground = useTransform(
    [glareX, glareY],
    ([gx, gy]) =>
      `radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.15), transparent 60%)`
  );

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (!ref.current || prefersReducedMotion) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(px);
    y.set(py);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      whileHover={{ scale }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative ${className}`}
    >
      <div style={{ transform: "translateZ(0)" }}>{children}</div>

      {/* Glare effect */}
      {glare && (
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-[inherit] overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: glareBackground }}
        />
      )}
    </motion.div>
  );
}
