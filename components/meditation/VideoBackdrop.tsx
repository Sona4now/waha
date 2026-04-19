"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  /** Per-session video URL (optional — defaults to env default) */
  videoUrl?: string;
  /** Fallback gradient shown while video loads or if none exists */
  fallbackGradient: string;
  /** Dim overlay 0..1 — higher = more of the gradient shows through */
  overlayOpacity?: number;
  /** Pause when session is paused (saves battery) */
  playing?: boolean;
}

/**
 * Full-screen looping video backdrop with graceful fallbacks:
 *   1. If `videoUrl` is set AND the file returns 200, we play it.
 *   2. Otherwise we show the `fallbackGradient` (tailwind class).
 *
 * Always muted, inlined, looped — built for iOS autoplay constraints.
 */
export default function VideoBackdrop({
  videoUrl,
  fallbackGradient,
  overlayOpacity = 0.35,
  playing = true,
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  // Pause/play on external signal
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (playing) {
      v.play().catch(() => setFailed(true));
    } else {
      v.pause();
    }
  }, [playing]);

  // If no URL OR failed to load → just the gradient
  if (!videoUrl || failed) {
    return (
      <div
        className={`absolute inset-0 bg-gradient-to-b ${fallbackGradient}`}
        aria-hidden="true"
      />
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Fallback gradient sits behind so there's no black flash */}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${fallbackGradient}`}
      />
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onCanPlay={() => setReady(true)}
        onError={() => setFailed(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] ease-out ${
          ready ? "opacity-100" : "opacity-0"
        }`}
        src={videoUrl}
      />
      {/* Dark overlay for text readability */}
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: overlayOpacity }}
      />
    </div>
  );
}
