"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface Props {
  icon?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({
  icon = "🏜️",
  title,
  description,
  action,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center text-center py-16 px-6"
    >
      {/* Illustration */}
      <div className="relative mb-6">
        <motion.div
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="text-7xl"
        >
          {icon}
        </motion.div>
        {/* Decorative circles */}
        <div className="absolute inset-0 -z-10 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full bg-[#91b149]/5 animate-pulse" />
        </div>
        <div className="absolute inset-0 -z-10 flex items-center justify-center">
          <div
            className="w-24 h-24 rounded-full bg-[#1d5770]/5 animate-pulse"
            style={{ animationDelay: "0.5s" }}
          />
        </div>
      </div>

      <h3 className="text-xl md:text-2xl font-bold font-display text-[#12394d] dark:text-white mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-[#7b7c7d] max-w-md leading-relaxed mb-6">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </motion.div>
  );
}
