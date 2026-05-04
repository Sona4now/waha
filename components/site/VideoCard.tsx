"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Video } from "@/data/videos";
import { bunnyEmbedUrl, bunnyThumbnailUrl, CATEGORY_LABELS } from "@/data/videos";
import { useTranslations } from "@/components/site/LocaleProvider";

interface Props {
  video: Video;
  className?: string;
}

/**
 * VideoCard — used in the /videos grid.
 * Click thumbnail → modal with embedded player.
 */
export default function VideoCard({ video, className = "" }: Props) {
  const { locale } = useTranslations();
  const isEn = locale === "en";
  const [open, setOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  const title = isEn && video.titleEn ? video.titleEn : video.title;
  const description = isEn && video.descriptionEn ? video.descriptionEn : video.description;
  const categoryLabel = CATEGORY_LABELS[video.category][isEn ? "en" : "ar"];
  const isComingSoon = !video.bunnyId;

  return (
    <>
      {/* Card */}
      <motion.div
        className={`group cursor-pointer rounded-2xl overflow-hidden bg-[#111c29] border border-white/[0.07] hover:border-[#91b149]/40 transition-colors duration-300 ${className}`}
        whileHover={{ y: -3 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        onClick={() => !isComingSoon && setOpen(true)}
      >
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden">
          {!imgError ? (
            <img
              src={bunnyThumbnailUrl(video)}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#0e2a3d] to-[#1a3a2a]" />
          )}
          <div className="absolute inset-0 bg-black/35 group-hover:bg-black/20 transition-colors duration-300" />

          {/* Play / Coming soon */}
          <div className="absolute inset-0 flex items-center justify-center">
            {isComingSoon ? (
              <span className="bg-black/50 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1 text-white/50 text-[10px] font-bold tracking-widest uppercase">
                {isEn ? "Soon" : "قريباً"}
              </span>
            ) : (
              <div className="w-12 h-12 bg-white/85 group-hover:bg-white rounded-full flex items-center justify-center shadow-xl transition-all duration-300 group-hover:scale-110">
                <div
                  className="ms-0.5"
                  style={{
                    width: 0, height: 0,
                    borderTop: "8px solid transparent",
                    borderBottom: "8px solid transparent",
                    borderLeft: "14px solid #0a151f",
                  }}
                />
              </div>
            )}
          </div>

          {/* Duration badge */}
          {video.duration && (
            <span className="absolute bottom-2 end-2 bg-black/70 text-white text-[10px] font-mono px-2 py-0.5 rounded">
              {Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, "0")}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <span className="inline-block text-[10px] font-bold tracking-wider text-[#91b149] uppercase mb-2">
            {categoryLabel}
          </span>
          <h3 className="text-white font-bold text-sm leading-snug mb-1.5 line-clamp-2">{title}</h3>
          <p className="text-white/40 text-xs leading-relaxed line-clamp-2">{description}</p>
        </div>
      </motion.div>

      {/* Modal player */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="w-full max-w-4xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3 px-1">
                <p className="text-white font-bold text-sm line-clamp-1">{title}</p>
                <button
                  onClick={() => setOpen(false)}
                  className="text-white/50 hover:text-white transition-colors text-xl leading-none"
                  aria-label={isEn ? "Close" : "إغلاق"}
                >
                  ✕
                </button>
              </div>
              {/* Iframe */}
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black">
                <iframe
                  src={`${bunnyEmbedUrl(video)}&autoplay=true`}
                  title={title}
                  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-0"
                />
              </div>
              <p className="text-white/40 text-xs mt-3 px-1 line-clamp-2">{description}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
