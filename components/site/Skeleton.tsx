"use client";

import { ReactNode } from "react";

interface Props {
  className?: string;
  children?: ReactNode;
}

/**
 * Skeleton loader with shimmer effect.
 * Use while content is loading to give users visual feedback.
 */
export default function Skeleton({ className = "", children }: Props) {
  return (
    <div
      className={`relative overflow-hidden bg-[#e4edf2] dark:bg-[#162033] rounded-lg ${className}`}
      aria-hidden="true"
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/40 dark:via-white/[0.04] to-transparent" />
      {children}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-[#162033] rounded-2xl border border-[#d0dde4] dark:border-[#1e3a5f] overflow-hidden">
      <Skeleton className="h-52 rounded-none" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-3 ${i === lines - 1 ? "w-4/5" : "w-full"}`}
        />
      ))}
    </div>
  );
}

export function SkeletonHero() {
  return (
    <div className="relative w-full h-[60vh] min-h-[400px] bg-[#e4edf2] dark:bg-[#162033] overflow-hidden">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/40 dark:via-white/[0.04] to-transparent" />
      <div className="absolute bottom-0 right-0 left-0 p-8 md:p-16">
        <div className="max-w-6xl mx-auto space-y-4">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-12 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  );
}
