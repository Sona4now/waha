"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { usePathname } from "next/navigation";

const HIDDEN_PATHS = ["/"]; // hide on cinematic intro

export default function CursorFollower() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { stiffness: 400, damping: 28, mass: 0.5 };
  const x = useSpring(cursorX, springConfig);
  const y = useSpring(cursorY, springConfig);

  // Slower outer ring
  const ringSpringConfig = { stiffness: 150, damping: 15, mass: 0.8 };
  const ringX = useSpring(cursorX, ringSpringConfig);
  const ringY = useSpring(cursorY, ringSpringConfig);

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!visible) setVisible(true);
    },
    [cursorX, cursorY, visible]
  );

  useEffect(() => {
    // Detect touch devices
    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
      setIsTouch(true);
      return;
    }

    window.addEventListener("mousemove", onMouseMove);

    // Track interactive elements
    function onMouseOver(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const isInteractive =
        target.closest("button") ||
        target.closest("a") ||
        target.closest("[role='button']") ||
        target.closest("input") ||
        target.closest("textarea") ||
        target.closest("label");
      setHovering(!!isInteractive);
    }

    window.addEventListener("mouseover", onMouseOver);

    // Hide on mouse leave document
    const onMouseLeave = () => setVisible(false);
    const onMouseEnter = () => setVisible(true);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
    };
  }, [onMouseMove]);

  // Don't show on touch devices or hidden paths
  if (isTouch || HIDDEN_PATHS.includes(pathname)) return null;

  return (
    <>
      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[200] mix-blend-difference"
        style={{
          x,
          y,
          opacity: visible ? 1 : 0,
        }}
      >
        <motion.div
          animate={{
            width: hovering ? 12 : 6,
            height: hovering ? 12 : 6,
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="rounded-full bg-white"
          style={{ translateX: "-50%", translateY: "-50%" }}
        />
      </motion.div>

      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[199]"
        style={{
          x: ringX,
          y: ringY,
          opacity: visible ? 0.5 : 0,
        }}
      >
        <motion.div
          animate={{
            width: hovering ? 56 : 36,
            height: hovering ? 56 : 36,
            borderWidth: hovering ? 2 : 1.5,
          }}
          transition={{ type: "spring", stiffness: 250, damping: 20 }}
          className="rounded-full border-[#91b149]"
          style={{ translateX: "-50%", translateY: "-50%" }}
        />
      </motion.div>
    </>
  );
}
