"use client";

import { TEAM_MEMBERS } from "@/data/team";

const ROWS = [
  { members: TEAM_MEMBERS.slice(0, 6), speed: 40, dir: "right", size: "text-5xl md:text-7xl", color: "text-white" },
  { members: TEAM_MEMBERS.slice(6, 12), speed: 55, dir: "left", size: "text-4xl md:text-6xl", color: "text-[#91b149]" },
  { members: TEAM_MEMBERS.slice(12, 18), speed: 45, dir: "right", size: "text-5xl md:text-7xl", color: "text-white/40" },
  { members: TEAM_MEMBERS.slice(18), speed: 60, dir: "left", size: "text-4xl md:text-6xl", color: "text-white" },
];

export default function MarqueeWallView() {
  return (
    <div className="bg-[#0a151f] py-16 md:py-24 overflow-hidden">
      <div className="text-center mb-12">
        <div className="text-[10px] uppercase tracking-[0.4em] text-[#91b149] font-bold mb-3">
          · Marquee Wall ·
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-black text-white">
          جدار الأسماء
        </h2>
      </div>

      <div className="space-y-4 md:space-y-6">
        {ROWS.map((row, idx) => (
          <div key={idx} className="overflow-hidden whitespace-nowrap">
            <div
              className="inline-flex"
              style={{
                animation: `marquee-${row.dir} ${row.speed}s linear infinite`,
              }}
            >
              {[...row.members, ...row.members, ...row.members, ...row.members].map(
                (m, i) => (
                  <span
                    key={`${idx}-${i}`}
                    className={`inline-flex items-center gap-8 mx-8 font-display font-black ${row.size} ${row.color} hover:text-[#91b149] transition-colors`}
                  >
                    {m.name}
                    <span className="text-[#91b149]/50">·</span>
                  </span>
                ),
              )}
            </div>
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes marquee-right {
          0% {
            transform: translateX(-25%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes marquee-left {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(-25%);
          }
        }
      `}</style>
    </div>
  );
}
