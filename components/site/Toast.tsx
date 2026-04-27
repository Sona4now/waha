"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "@/components/site/LocaleProvider";

type ToastType = "success" | "info" | "warning" | "error";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

const TOAST_EVENT = "waaha_toast";

export function showToast(
  message: string,
  type: ToastType = "success",
  duration = 3000
) {
  if (typeof window === "undefined") return;
  const toast: Toast = {
    id: `t-${Date.now()}-${Math.random()}`,
    message,
    type,
    duration,
  };
  window.dispatchEvent(
    new CustomEvent(TOAST_EVENT, { detail: toast }) as Event
  );
}

const ICONS: Record<ToastType, string> = {
  success: "✓",
  info: "ℹ",
  warning: "⚠",
  error: "✕",
};

const COLORS: Record<ToastType, { bg: string; text: string; border: string }> =
  {
    success: {
      bg: "bg-[#91b149]",
      text: "text-white",
      border: "border-[#91b149]",
    },
    info: {
      bg: "bg-[#1d5770]",
      text: "text-white",
      border: "border-[#1d5770]",
    },
    warning: {
      bg: "bg-amber-500",
      text: "text-white",
      border: "border-amber-500",
    },
    error: {
      bg: "bg-red-500",
      text: "text-white",
      border: "border-red-500",
    },
  };

export default function ToastContainer() {
  const { locale } = useTranslations();
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    function onToast(e: Event) {
      const toast = (e as CustomEvent<Toast>).detail;
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => {
        removeToast(toast.id);
      }, toast.duration || 3000);
    }
    window.addEventListener(TOAST_EVENT, onToast);
    return () => window.removeEventListener(TOAST_EVENT, onToast);
  }, [removeToast]);

  return (
    <div
      className="fixed top-20 left-1/2 -translate-x-1/2 z-[130] flex flex-col gap-2 pointer-events-none"
      dir={locale === "en" ? "ltr" : "rtl"}
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          const colors = COLORS[toast.type];
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="pointer-events-auto"
            >
              <div
                className={`flex items-center gap-3 pl-4 pr-3 py-3 rounded-full shadow-2xl backdrop-blur-md ${colors.bg} ${colors.text} min-w-[280px] max-w-md`}
              >
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {ICONS[toast.type]}
                </div>
                <span className="text-sm font-semibold flex-1">
                  {toast.message}
                </span>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="w-6 h-6 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
                  aria-label={locale === "en" ? "Close" : "إغلاق"}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
