"use client";

import { TEAM_MEMBERS } from "@/data/team";
import { useTranslations } from "@/components/site/LocaleProvider";

// Split into two rows that will move in opposite directions
const ROW_A = TEAM_MEMBERS.slice(0, 12);
const ROW_B = TEAM_MEMBERS.slice(12);

export default function CreditsTickerView() {
  const { locale } = useTranslations();
  return (
    <div className="relative bg-gradient-to-b from-[#050a14] via-[#0a1420] to-[#050a14] text-white min-h-[600px] flex flex-col justify-center overflow-hidden py-24">
      {/* Background grain */}
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Static heading */}
      <div className="relative text-center mb-16">
        <div className="text-[10px] uppercase tracking-[0.4em] text-[#91b149] font-bold mb-2">
          · CREDITS ROLL ·
        </div>
        <h2 className="font-display text-4xl md:text-5xl font-black">
          {locale === "en" ? "The team" : "الفريق"}
        </h2>
      </div>

      {/* Scrolling rows */}
      <div className="space-y-12 relative">
        {/* Row A — scroll right */}
        <div className="relative overflow-hidden">
          <div className="flex whitespace-nowrap animate-[scroll-right_50s_linear_infinite]">
            {[...ROW_A, ...ROW_A, ...ROW_A].map((m, i) => (
              <span
                key={`a-${i}`}
                className="inline-flex items-center gap-6 mx-6 text-2xl md:text-4xl font-display font-bold"
              >
                <span className="hover:text-[#91b149] transition-colors">
                  {m.name}
                </span>
                <span className="text-[#91b149]/40 text-3xl">✦</span>
              </span>
            ))}
          </div>
          {/* Edge fade */}
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#050a14] to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#050a14] to-transparent pointer-events-none" />
        </div>

        {/* Row B — scroll left (reverse direction) */}
        <div className="relative overflow-hidden">
          <div className="flex whitespace-nowrap animate-[scroll-left_55s_linear_infinite]">
            {[...ROW_B, ...ROW_B, ...ROW_B].map((m, i) => (
              <span
                key={`b-${i}`}
                className="inline-flex items-center gap-6 mx-6 text-2xl md:text-4xl font-display font-bold text-white/70"
              >
                <span className="hover:text-[#91b149] transition-colors">
                  {m.name}
                </span>
                <span className="text-[#91b149]/30 text-3xl">◆</span>
              </span>
            ))}
          </div>
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#050a14] to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#050a14] to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Footer */}
      <div className="relative text-center mt-16 text-[10px] uppercase tracking-[0.3em] text-white/30">
        — fin —
      </div>

      <style jsx global>{`
        @keyframes scroll-right {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        @keyframes scroll-left {
          0% {
            transform: translateX(-33.333%);
          }
          100% {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
