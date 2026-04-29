"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show on desktop with pointer
    if (typeof window === "undefined") return;
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    if (isTouchDevice) return;

    const visId = setTimeout(() => setIsVisible(true), 0);

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let animId: number;

    function onMouseMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Dot follows immediately
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
      }
    }

    function animate() {
      // Ring lags behind smoothly (spring)
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX}px, ${ringY}px)`;
      }

      animId = requestAnimationFrame(animate);
    }

    function checkHover(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const interactive =
        target.closest("button") ||
        target.closest("a") ||
        target.closest("[role='button']");
      setIsHovering(!!interactive);
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousemove", checkHover);
    animId = requestAnimationFrame(animate);

    return () => {
      clearTimeout(visId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousemove", checkHover);
      cancelAnimationFrame(animId);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Hide default cursor on cinematic page only */}
      <style jsx global>{`
        body {
          cursor: none;
        }
        a,
        button,
        input,
        textarea {
          cursor: none !important;
        }
      `}</style>

      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          transform: "translate(0, 0)",
          marginLeft: "-4px",
          marginTop: "-4px",
        }}
      >
        <div className="w-2 h-2 rounded-full bg-[#91b149]" />
      </div>

      {/* Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] transition-[width,height,margin] duration-200 ease-out"
        style={{
          transform: "translate(0, 0)",
          marginLeft: isHovering ? "-24px" : "-16px",
          marginTop: isHovering ? "-24px" : "-16px",
        }}
      >
        <div
          className={`rounded-full border transition-all duration-200 ${
            isHovering
              ? "w-12 h-12 border-[#91b149]/80 bg-[#91b149]/10"
              : "w-8 h-8 border-white/60"
          }`}
        />
      </div>
    </>
  );
}
