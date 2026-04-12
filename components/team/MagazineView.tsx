"use client";

import { motion } from "framer-motion";
import { TEAM_MEMBERS } from "@/data/team";

export default function MagazineView() {
  return (
    <div className="bg-[#0a151f] text-white py-16 md:py-24">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-20">
          {/* Left — Hero Editorial */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="text-[10px] uppercase tracking-[0.4em] text-[#91b149] font-bold mb-6">
              Issue № 2026 · WAHA
            </div>
            <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] mb-8">
              الفريق
              <br />
              <span className="text-[#91b149]">وراء</span>
              <br />
              الواحة
            </h2>
            <p className="text-white/60 text-base leading-relaxed max-w-sm border-r-2 border-[#91b149] pr-4">
              23 عقلاً اجتمعوا على فكرة واحدة — توثيق الموارد العلاجية الطبيعية
              في مصر، وتقديمها للعالم في إطار بيئي مسؤول.
            </p>
            <div className="mt-12 flex items-center gap-4">
              <div className="text-4xl font-black text-[#91b149]">23</div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-white/40 leading-tight">
                أعضاء
                <br />
                في الفريق
              </div>
            </div>
          </motion.div>

          {/* Right — Member List */}
          <div className="space-y-0 border-t border-white/10">
            {TEAM_MEMBERS.map((member, i) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.03, duration: 0.4 }}
                className="group flex items-baseline justify-between gap-4 py-3.5 border-b border-white/10 hover:bg-white/[0.03] transition-colors px-2 -mx-2"
              >
                <span className="text-[10px] text-[#91b149]/60 font-mono font-bold pt-1 flex-shrink-0 w-8">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-base md:text-lg text-white group-hover:text-[#91b149] group-hover:pr-2 transition-all flex-1 text-right">
                  {member.name}
                </span>
                <span className="h-px flex-1 bg-gradient-to-l from-white/20 via-white/5 to-transparent self-center max-w-[60px]" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
