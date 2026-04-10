"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { DestinationFull } from "@/data/siteData";
import { showToast } from "./Toast";

interface Props {
  destination: DestinationFull;
}

const FAV_KEY = "waaha_favorites";

export default function QuickActions({ destination }: Props) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showCopied, setShowCopied] = useState(false);

  useEffect(() => {
    try {
      const favs = JSON.parse(localStorage.getItem(FAV_KEY) || "[]");
      setIsFavorite(favs.includes(destination.id));
    } catch {}
  }, [destination.id]);

  function toggleFavorite() {
    try {
      const favs: string[] = JSON.parse(
        localStorage.getItem(FAV_KEY) || "[]"
      );
      const next = isFavorite
        ? favs.filter((x) => x !== destination.id)
        : [...favs, destination.id];
      localStorage.setItem(FAV_KEY, JSON.stringify(next));
      setIsFavorite(!isFavorite);
      showToast(
        isFavorite
          ? `تم إزالة ${destination.name} من المفضلة`
          : `تمت الإضافة للمفضلة ${destination.name} ❤️`,
        isFavorite ? "info" : "success"
      );
    } catch {
      showToast("حدث خطأ", "error");
    }
  }

  async function handleShare() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const text = `🌿 ${destination.name} — ${destination.description}`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: destination.name,
          text,
          url,
        });
        return;
      } catch {
        /* user cancelled */
      }
    }

    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setShowCopied(true);
      showToast("تم نسخ الرابط للحافظة 📋", "success");
      setTimeout(() => setShowCopied(false), 2000);
    } catch {
      showToast("لم يتمكن من النسخ", "error");
    }
  }

  function openWhatsApp() {
    const text = encodeURIComponent(
      `مرحباً، أنا مهتم بمعلومات السياحة العلاجية في ${destination.name}. هل يمكنكم مساعدتي؟`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  }

  function openMaps() {
    const { lat, lng } = destination;
    const url = `https://www.google.com/maps?q=${lat},${lng}&z=12`;
    window.open(url, "_blank");
  }

  const actions = [
    {
      id: "favorite",
      icon: isFavorite ? (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ) : (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ),
      label: isFavorite ? "في المفضلة" : "أضف للمفضلة",
      onClick: toggleFavorite,
      active: isFavorite,
      color: isFavorite ? "#ef4444" : undefined,
    },
    {
      id: "share",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
      ),
      label: showCopied ? "تم النسخ!" : "شارك",
      onClick: handleShare,
      active: showCopied,
    },
    {
      id: "whatsapp",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.693.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
      label: "واتساب",
      onClick: openWhatsApp,
      color: "#25d366",
    },
    {
      id: "maps",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
      label: "خرائط",
      onClick: openMaps,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white dark:bg-[#162033] rounded-2xl border border-[#d0dde4] dark:border-[#1e3a5f] p-4 shadow-sm"
    >
      <div className="flex items-center justify-between gap-2 mb-4">
        <h3 className="text-sm font-bold text-[#12394d] dark:text-white font-display">
          إجراءات سريعة
        </h3>
        <span className="text-[9px] text-[#7b7c7d] uppercase tracking-wider">
          QUICK
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            className={`group relative flex flex-col items-center justify-center gap-1.5 px-3 py-4 rounded-xl transition-all duration-300 ${
              action.active
                ? "bg-[#f5f8fa] dark:bg-[#0a151f] scale-[0.98]"
                : "bg-[#f5f8fa] dark:bg-[#0a151f] hover:scale-[1.03] hover:shadow-md"
            }`}
            style={{
              color: action.color || "#1d5770",
            }}
          >
            <span
              className="transition-transform duration-300 group-hover:scale-110"
              style={{ color: action.color || undefined }}
            >
              {action.icon}
            </span>
            <AnimatePresence mode="wait">
              <motion.span
                key={action.label}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                className="text-[10px] font-semibold text-[#12394d] dark:text-white leading-tight"
              >
                {action.label}
              </motion.span>
            </AnimatePresence>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
