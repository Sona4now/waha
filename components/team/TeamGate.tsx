"use client";

import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const TEAM_PASSWORD = "12345";
const STORAGE_KEY = "waaha_team_unlocked";

interface Props {
  children: React.ReactNode;
}

/**
 * Client-side password gate for the team page.
 * Password stored in sessionStorage — persists during browsing but
 * not after closing the tab.
 */
export default function TeamGate({ children }: Props) {
  const [unlocked, setUnlocked] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved === "1") setUnlocked(true);
    } catch {}
    setChecking(false);
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (password === TEAM_PASSWORD) {
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {}
      setUnlocked(true);
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setPassword("");
    }
  };

  if (checking) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#070d15]" />
    );
  }

  if (unlocked) {
    return <>{children}</>;
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-[#070d15] overflow-hidden"
      dir="rtl"
    >
      {/* Background gradient */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(145,177,73,0.08)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(29,87,112,0.1)_0%,_transparent_60%)]" />
      </div>

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-sm px-6"
        >
          {/* Lock icon */}
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              boxShadow: [
                "0 0 30px rgba(145,177,73,0.15)",
                "0 0 50px rgba(145,177,73,0.25)",
                "0 0 30px rgba(145,177,73,0.15)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#91b149]/20 to-[#6a8435]/10 border border-[#91b149]/30 flex items-center justify-center"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#91b149"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </motion.div>

          <div className="text-center mb-8">
            <div className="text-[10px] uppercase tracking-[0.4em] text-[#91b149] font-bold mb-2">
              · Team Access ·
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-white mb-2">
              فريق واحة
            </h1>
            <p className="text-white/40 text-sm">
              هذه الصفحة محمية بكلمة مرور
            </p>
          </div>

          <motion.form
            onSubmit={handleSubmit}
            animate={shake ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(false);
              }}
              placeholder="أدخل كلمة المرور"
              autoFocus
              className={`w-full px-5 py-4 bg-white/[0.04] border rounded-xl text-white text-center text-lg tracking-widest placeholder:text-white/20 placeholder:text-sm placeholder:tracking-normal focus:outline-none transition-all duration-300 ${
                error
                  ? "border-red-500/50 focus:border-red-500"
                  : "border-white/10 focus:border-[#91b149]/50 focus:bg-white/[0.08]"
              }`}
            />

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-red-400 text-sm text-center"
                >
                  كلمة المرور غير صحيحة
                </motion.p>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={!password}
              className="w-full py-4 bg-gradient-to-l from-[#91b149] to-[#6a8435] disabled:from-white/10 disabled:to-white/10 disabled:text-white/30 text-[#0a0f14] font-bold text-sm rounded-xl transition-all duration-300 hover:shadow-[0_8px_24px_rgba(145,177,73,0.4)]"
            >
              دخول
            </button>
          </motion.form>

          <div className="mt-8 text-center">
            <Link
              href="/home"
              className="text-white/20 hover:text-white/40 text-xs no-underline transition-colors"
            >
              ← العودة للرئيسية
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
