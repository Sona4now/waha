"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";

interface Props {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  title?: string;
  description?: string;
  improvementPercent?: number;
}

export default function BeforeAfter({
  beforeImage,
  afterImage,
  beforeLabel = "قبل",
  afterLabel = "بعد",
  title,
  description,
  improvementPercent,
}: Props) {
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const relativeX = clientX - rect.left;
    const percent = (relativeX / rect.width) * 100;
    setPosition(Math.max(0, Math.min(100, percent)));
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      setIsDragging(true);
      updatePosition(e.clientX);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [updatePosition]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      updatePosition(e.clientX);
    },
    [isDragging, updatePosition]
  );

  const onPointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Auto-demo on mount
  useEffect(() => {
    let frame: number;
    let direction = -1;
    let value = 50;
    let running = true;

    const animate = () => {
      if (!running) return;
      value += direction * 0.3;
      if (value <= 25) direction = 1;
      if (value >= 75) direction = -1;
      setPosition(value);
      frame = requestAnimationFrame(animate);
    };

    // Start after 500ms
    const timer = setTimeout(() => {
      frame = requestAnimationFrame(animate);
    }, 500);

    // Stop after 4 seconds
    const stopTimer = setTimeout(() => {
      running = false;
      cancelAnimationFrame(frame);
      setPosition(50);
    }, 4500);

    return () => {
      running = false;
      clearTimeout(timer);
      clearTimeout(stopTimer);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="bg-white dark:bg-[#162033] rounded-2xl border border-[#d0dde4] dark:border-[#1e3a5f] overflow-hidden">
      {title && (
        <div className="p-5 border-b border-[#d0dde4] dark:border-[#1e3a5f] flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="text-lg font-bold font-display text-[#12394d] dark:text-white">
              {title}
            </h3>
            {description && (
              <p className="text-xs text-[#7b7c7d] mt-0.5">{description}</p>
            )}
          </div>
          {improvementPercent !== undefined && (
            <div className="bg-gradient-to-l from-[#91b149] to-[#6a8435] text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">
              نسبة التحسن: {improvementPercent}%
            </div>
          )}
        </div>
      )}

      {/* Slider */}
      <div
        ref={containerRef}
        className="relative aspect-[16/9] select-none overflow-hidden bg-[#0a151f] cursor-ew-resize"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {/* After image (full) */}
        <img
          src={afterImage}
          alt={afterLabel}
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />

        {/* Before image (clipped from right) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 0 0 ${position}%)` }}
        >
          <img
            src={beforeImage}
            alt={beforeLabel}
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />
        </div>

        {/* Labels */}
        <div
          className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold transition-opacity"
          style={{ opacity: position < 90 ? 1 : 0 }}
        >
          {beforeLabel}
        </div>
        <div
          className="absolute top-4 left-4 bg-[#91b149] text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg transition-opacity"
          style={{ opacity: position > 10 ? 1 : 0 }}
        >
          {afterLabel}
        </div>

        {/* Divider line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_20px_rgba(255,255,255,0.6)] pointer-events-none"
          style={{ left: `${position}%` }}
        />

        {/* Handle */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-white shadow-2xl flex items-center justify-center pointer-events-none"
          style={{ left: `${position}%` }}
          animate={{ scale: isDragging ? 1.15 : 1 }}
        >
          <div className="flex items-center gap-0.5 text-[#1d5770]">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </motion.div>

        {/* Instructions overlay */}
        {!isDragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 5, times: [0, 0.1, 0.9, 1] }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full pointer-events-none"
          >
            ↔ اسحب لرؤية الفرق
          </motion.div>
        )}
      </div>
    </div>
  );
}
