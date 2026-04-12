"use client";

import { motion, useReducedMotion, Variants } from "framer-motion";
import { ReactNode } from "react";

interface Props {
  text: string;
  /** Split by word or letter (letter gives more dramatic effect) */
  splitBy?: "word" | "letter";
  /** Delay each child by this many seconds */
  stagger?: number;
  /** Initial delay before animation starts */
  delay?: number;
  /** Duration of each child's animation */
  duration?: number;
  /** Direction to reveal from */
  direction?: "up" | "down" | "left" | "right" | "scale" | "rotate";
  /** Animate when scrolled into view (otherwise on mount) */
  onInView?: boolean;
  className?: string;
  as?: keyof typeof HeadingMap;
}

const HeadingMap = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
  p: motion.p,
  span: motion.span,
  div: motion.div,
};

const DIRECTIONS: Record<string, { x?: number; y?: number; scale?: number; rotate?: number }> = {
  up: { y: 30 },
  down: { y: -30 },
  left: { x: 30 },
  right: { x: -30 },
  scale: { scale: 0.5 },
  rotate: { y: 20, rotate: -5 },
};

export default function AnimatedText({
  text,
  splitBy = "word",
  stagger = 0.08,
  delay = 0,
  duration = 0.6,
  direction = "up",
  onInView = false,
  className = "",
  as = "span",
}: Props) {
  const prefersReducedMotion = useReducedMotion();
  const Component = HeadingMap[as];

  if (prefersReducedMotion) {
    return <Component className={className}>{text}</Component>;
  }

  const parts =
    splitBy === "letter"
      ? Array.from(text)
      : text.split(/(\s+)/); // keeps spaces

  const offset = DIRECTIONS[direction];

  const container: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const child: Variants = {
    hidden: {
      opacity: 0,
      ...offset,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      rotate: 0,
      transition: {
        duration,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const animationProps = onInView
    ? {
        initial: "hidden",
        whileInView: "visible",
        viewport: { once: true, margin: "-50px" },
      }
    : {
        initial: "hidden",
        animate: "visible",
      };

  return (
    <Component
      className={className}
      variants={container}
      {...animationProps}
      aria-label={text}
    >
      {parts.map((part, i) => {
        if (part.trim() === "") return <span key={i}>{part}</span>;
        return (
          <motion.span
            key={i}
            variants={child}
            className="inline-block"
            style={{ willChange: "transform, opacity" }}
          >
            {part}
          </motion.span>
        );
      })}
    </Component>
  );
}

/**
 * Shimmer text — text with a moving gradient highlight.
 */
export function ShimmerText({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-block bg-clip-text text-transparent bg-[length:200%_100%] animate-[shimmer-text_3s_linear_infinite] ${className}`}
      style={{
        backgroundImage:
          "linear-gradient(90deg, #1d5770 0%, #91b149 50%, #1d5770 100%)",
      }}
    >
      {children}
    </span>
  );
}
