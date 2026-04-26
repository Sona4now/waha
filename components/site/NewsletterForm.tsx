"use client";

import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "waaha_newsletter_emails";

/**
 * Newsletter capture for the site footer.
 *
 * No backend right now — emails are stashed in localStorage as a "queue".
 * The admin page can read this queue and export it manually. Once we wire
 * up an actual email service (Resend, Mailchimp, ConvertKit, etc.), swap
 * the localStorage write for a fetch and keep the same UX.
 *
 * UX notes:
 * - Single field (email), no double opt-in, no name. Lower friction means
 *   higher conversion. The Egyptian market in particular is allergic to
 *   long forms.
 * - Inline validation (regex) — server-side validation when we add a
 *   backend.
 * - Success state replaces the form so the user feels closure.
 */
export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    const trimmed = email.trim();
    if (!trimmed) {
      setError("اكتب بريدك الإلكتروني");
      return;
    }
    // Pragmatic email regex — not RFC 5322, just "looks like an email".
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("البريد الإلكتروني غير صحيح");
      return;
    }

    try {
      const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      if (!list.includes(trimmed)) {
        list.push(trimmed);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      }
    } catch {
      /* storage disabled — still show success to the user, the email is just lost */
    }

    setSubmitted(true);
  }

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-5" dir="rtl">
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-2"
          >
            <span className="text-2xl block mb-2">✨</span>
            <p className="text-sm font-bold text-white mb-1">شكراً!</p>
            <p className="text-xs text-white/60 leading-relaxed">
              هتلاقي رسالة منا أول كل موسم سياحي بأفضل الأماكن للزيارة وقتها.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">📨</span>
              <h3 className="font-display font-bold text-sm text-white">
                اشترك في النشرة الموسمية
              </h3>
            </div>
            <p className="text-xs text-white/60 leading-relaxed mb-3">
              نصايح، عروض، وأفضل وقت لكل وجهة — 4 رسائل في السنة بس.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                placeholder="email@example.com"
                autoComplete="email"
                required
                className="flex-1 min-w-0 px-3 py-2 bg-white/10 border border-white/15 rounded-lg text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#91b149] focus:bg-white/15 transition-all"
              />
              <button
                type="submit"
                className="flex-shrink-0 px-4 py-2 rounded-lg bg-[#91b149] hover:bg-[#a3c45a] text-[#0a0f14] font-bold text-xs transition-colors"
              >
                اشترك
              </button>
            </div>
            {error && (
              <p className="text-[11px] text-red-400 mt-2">{error}</p>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
