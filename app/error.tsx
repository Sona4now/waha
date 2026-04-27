"use client";

import { useEffect } from "react";
import { useTranslations } from "@/components/site/LocaleProvider";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { locale } = useTranslations();
  const isEn = locale === "en";

  useEffect(() => {
    console.error("[waaha] page error:", error);
  }, [error]);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#0a151f] text-white"
      dir={isEn ? "ltr" : "rtl"}
    >
      <div className="text-center px-6 max-w-md">
        <div className="text-6xl mb-6">⚠️</div>
        <h1 className="text-2xl font-bold font-display mb-3">
          {isEn ? "Something went wrong" : "حصلت مشكلة غير متوقعة"}
        </h1>
        <p className="text-white/50 mb-8 leading-relaxed">
          {isEn
            ? "Sorry, an error occurred while loading the page. Try refreshing or returning to the home page."
            : "عذراً، حدث خطأ أثناء تحميل الصفحة. جرب تحديث الصفحة أو الرجوع للصفحة الرئيسية."}
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={reset}
            className="px-6 py-3 bg-[#91b149] hover:bg-[#a3c45a] text-[#0a0f14] font-bold rounded-full transition-all duration-300 text-sm"
          >
            {isEn ? "Try again" : "حاول مرة تانية"}
          </button>
          <a
            href="/home"
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full border border-white/20 transition-all duration-300 no-underline text-sm"
          >
            {isEn ? "Home page" : "الصفحة الرئيسية"}
          </a>
        </div>
      </div>
    </div>
  );
}
