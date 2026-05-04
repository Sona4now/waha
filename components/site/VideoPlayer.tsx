"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Video } from "@/data/videos";
import { bunnyEmbedUrl, bunnyThumbnailUrl } from "@/data/videos";
import { useTranslations } from "@/components/site/LocaleProvider";

interface Props {
  video: Video;
  /** Show as inline embed instead of click-to-play */
  autoEmbed?: boolean;
  className?: string;
}

/**
 * VideoPlayer — thumbnail with play button → bunny.net iframe on click.
 * Falls back to a "coming soon" state when bunnyId is empty.
 */
export default function VideoPlayer({ video, autoEmbed = false, className = "" }: Props) {
  const { locale } = useTranslations();
  const isEn = locale === "en";
  const [playing, setPlaying] = useState(autoEmbed);
  const [imgError, setImgError] = useState(false);

  const title = isEn && video.titleEn ? video.titleEn : video.title;
  const isComingSoon = !video.bunnyId;

  if (playing && !isComingSoon) {
    return (
      <div className={`relative w-full aspect-video rounded-2xl overflow-hidden bg-black ${className}`}>
        <iframe
          src={bunnyEmbedUrl(video)}
          title={title}
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative w-full aspect-video rounded-2xl overflow-hidden bg-[#0a151f] group ${className} ${!isComingSoon ? "cursor-pointer" : "cursor-default"}`}
      onClick={() => !isComingSoon && setPlaying(true)}
      role={!isComingSoon ? "button" : undefined}
      aria-label={!isComingSoon ? (isEn ? `Play: ${title}` : `تشغيل: ${title}`) : undefined}
    >
      {/* Thumbnail */}
      {!imgError ? (
        <img
          src={bunnyThumbnailUrl(video)}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setImgError(true)}
        />
      ) : (
        /* Fallback gradient when thumbnail fails */
        <div className="absolute inset-0 bg-gradient-to-br from-[#0e2a3d] to-[#1a3a2a]" />
      )}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />

      {/* Play button / Coming soon badge */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        {isComingSoon ? (
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-white/60 text-xs font-bold tracking-wide">
            {isEn ? "Coming soon" : "قريباً"}
          </div>
        ) : (
          <AnimatePresence>
            <motion.div
              className="w-16 h-16 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-2xl"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {/* Triangle play icon */}
              <div
                className="w-0 h-0 ms-1"
                style={{
                  borderTop: "10px solid transparent",
                  borderBottom: "10px solid transparent",
                  borderLeft: "18px solid #0a151f",
                }}
              />
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Title bar at bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-8">
        <p className="text-white text-sm font-bold leading-tight line-clamp-2">{title}</p>
      </div>
    </div>
  );
}
