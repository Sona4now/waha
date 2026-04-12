"use client";

import { motion } from "framer-motion";
import { TEAM_MEMBERS } from "@/data/team";

export default function MinimalWallView() {
  return (
    <div className="bg-white dark:bg-[#0a151f] py-20 md:py-32 min-h-[720px]">
      <div className="max-w-xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="text-[10px] uppercase tracking-[0.4em] text-[#91b149] font-bold mb-3">
            · Minimal ·
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-black text-[#12394d] dark:text-white mb-2">
            الفريق
          </h2>
          <div className="w-12 h-px bg-[#91b149] mx-auto" />
        </div>

        <ul className="space-y-1">
          {TEAM_MEMBERS.map((m, i) => (
            <motion.li
              key={m.id}
              initial={{ opacity: 0, x: 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              viewport={{ once: true }}
              className="group flex items-center justify-between py-3 border-b border-[#12394d]/10 dark:border-white/10 hover:border-[#91b149] transition-colors cursor-default"
            >
              <span className="text-[11px] font-mono text-[#91b149] font-bold w-8">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex-1 text-right font-display text-lg md:text-xl font-bold text-[#12394d] dark:text-white group-hover:text-[#91b149] group-hover:translate-x-[-4px] transition-all">
                {m.name}
              </span>
            </motion.li>
          ))}
        </ul>

        <div className="mt-16 text-center text-[10px] uppercase tracking-[0.3em] text-[#12394d]/30 dark:text-white/30">
          23 members · WAHA 2026
        </div>
      </div>
    </div>
  );
}
