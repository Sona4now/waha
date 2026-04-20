/**
 * Environment badge color tokens.
 *
 * Each destination carries an `envClass` string — this helper maps it to a
 * Tailwind class pair (background + text) for the environment badge. The
 * mapping was duplicated inline on the home page; extracting it here keeps
 * /home and /destinations visually consistent.
 *
 * Dark-mode variants are intentionally muted — the destination card body is
 * `bg-[#162033]` in dark mode, so the light pastels used in light mode would
 * wash out if applied directly.
 */
export type EnvClass = "env-sea" | "env-desert" | "env-oasis" | "env-mountain";

export function envBadgeClasses(envClass?: string): string {
  switch (envClass) {
    case "env-sea":
      return "bg-[#EBF8FF] text-[#0369a1] dark:bg-[#0369a1]/20 dark:text-[#7dd3fc]";
    case "env-desert":
      return "bg-[#FEF9EB] text-[#92400e] dark:bg-[#92400e]/25 dark:text-[#fcd34d]";
    case "env-oasis":
      return "bg-[#ECFDF5] text-[#065f46] dark:bg-[#065f46]/25 dark:text-[#6ee7b7]";
    case "env-mountain":
    default:
      return "bg-[#F1F5F9] text-[#374151] dark:bg-[#374151]/30 dark:text-[#e5e7eb]";
  }
}
