"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TEAM_MEMBERS } from "@/data/team";
import { useTranslations } from "@/components/site/LocaleProvider";

// Organize 23 members into a tree:
// Root (1) → 4 leads → 4-5 members each
const TREE = {
  root: TEAM_MEMBERS[0],
  branches: [
    {
      lead: TEAM_MEMBERS[1],
      members: [TEAM_MEMBERS[2], TEAM_MEMBERS[3], TEAM_MEMBERS[4], TEAM_MEMBERS[5]],
    },
    {
      lead: TEAM_MEMBERS[6],
      members: [TEAM_MEMBERS[7], TEAM_MEMBERS[8], TEAM_MEMBERS[9], TEAM_MEMBERS[10]],
    },
    {
      lead: TEAM_MEMBERS[11],
      members: [TEAM_MEMBERS[12], TEAM_MEMBERS[13], TEAM_MEMBERS[14], TEAM_MEMBERS[15]],
    },
    {
      lead: TEAM_MEMBERS[16],
      members: [
        TEAM_MEMBERS[17],
        TEAM_MEMBERS[18],
        TEAM_MEMBERS[19],
        TEAM_MEMBERS[20],
        TEAM_MEMBERS[21],
        TEAM_MEMBERS[22],
      ],
    },
  ],
};

export default function InteractiveTreeView() {
  const { locale } = useTranslations();
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="bg-gradient-to-b from-[#0a151f] to-[#12394d] py-16 md:py-24 overflow-x-auto">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="text-center mb-14">
          <div className="text-[10px] uppercase tracking-[0.4em] text-[#91b149] font-bold mb-3">
            · Team Tree ·
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-black text-white">
            {locale === "en" ? "Team tree" : "شجرة الفريق"}
          </h2>
        </div>

        {/* Root */}
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            onHoverStart={() => setHovered(TREE.root.id)}
            onHoverEnd={() => setHovered(null)}
            className="relative"
          >
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-[#91b149] to-[#6a8435] shadow-xl border-4 border-white/20 flex items-center justify-center cursor-pointer">
              <span className="text-white font-display font-black text-3xl">
                {TREE.root.initial}
              </span>
            </div>
            <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 text-white font-bold text-sm whitespace-nowrap">
              {TREE.root.name}
            </div>
          </motion.div>

          {/* Vertical line down */}
          <div className="w-px h-16 bg-[#91b149]/40 mt-14" />

          {/* Horizontal spread */}
          <div className="relative w-full max-w-[1200px]">
            <div className="h-px bg-[#91b149]/40 w-full" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mt-8">
              {TREE.branches.map((branch, bi) => (
                <div key={bi} className="flex flex-col items-center">
                  {/* Vertical drop */}
                  <div className="w-px h-8 bg-[#91b149]/40 -mt-8" />

                  {/* Lead */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: bi * 0.1 }}
                    viewport={{ once: true }}
                    onHoverStart={() => setHovered(branch.lead.id)}
                    onHoverEnd={() => setHovered(null)}
                    className="flex flex-col items-center mb-6"
                  >
                    <div className="w-16 h-16 rounded-full bg-[#1d5770] border-2 border-[#91b149]/50 flex items-center justify-center cursor-pointer shadow-lg">
                      <span className="text-white font-display font-black text-xl">
                        {branch.lead.initial}
                      </span>
                    </div>
                    <div className="mt-2 text-white text-xs font-bold text-center">
                      {branch.lead.name}
                    </div>
                  </motion.div>

                  {/* Branch line */}
                  <div className="w-px h-6 bg-[#91b149]/30" />

                  {/* Members */}
                  <div className="flex flex-col gap-3 w-full">
                    {branch.members.map((m, mi) => (
                      <motion.div
                        key={m.id}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: bi * 0.1 + mi * 0.05 }}
                        viewport={{ once: true }}
                        onHoverStart={() => setHovered(m.id)}
                        onHoverEnd={() => setHovered(null)}
                        whileHover={{ x: 4 }}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg border transition-colors cursor-pointer ${
                          hovered === m.id
                            ? "bg-[#91b149]/20 border-[#91b149]"
                            : "bg-white/5 border-white/10"
                        }`}
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#91b149]/60 to-[#6a8435]/60 flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-bold">
                            {m.initial}
                          </span>
                        </div>
                        <span className="text-white/80 text-xs font-semibold truncate">
                          {m.name}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
