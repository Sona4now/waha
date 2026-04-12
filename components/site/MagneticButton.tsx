"use client";

import { useRef, ReactNode, MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

interface Props {
  children: ReactNode;
  /** Maximum pixels the wrapper can drift toward cursor */
  strength?: number;
  className?: string;
  onClick?: () => void;
}

/**
 * MagneticButton — a wrapper that drifts subtly toward the cursor.
 * Wrap any button/link/element inside.
 */
export default function MagneticButton({
  children,
  strength = 20,
  className = "",
  onClick,
}: Props) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const xSpring = useSpring(x, { stiffness: 180, damping: 15, mass: 0.3 });
  const ySpring = useSpring(y, { stiffness: 180, damping: 15, mass: 0.3 });

  // Inner content drifts slightly more for parallax feel
  const xInner = useSpring(x, { stiffness: 220, damping: 12, mass: 0.25 });
  const yInner = useSpring(y, { stiffness: 220, damping: 12, mass: 0.25 });

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (!ref.current || prefersReducedMotion) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    x.set(dx * strength);
    y.set(dy * strength);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  if (prefersReducedMotion) {
    return (
      <div className={className} onClick={onClick}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ x: xSpring, y: ySpring }}
      className={`inline-block ${className}`}
    >
      <motion.div
        style={{ x: xInner, y: yInner, display: "inline-block" }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
