"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { showToast } from "./Toast";

interface Props {
  pageId: string;
  pageTitle: string;
}

type Reaction = "helpful" | "not-helpful" | null;

export default function FeedbackWidget({ pageId, pageTitle }: Props) {
  const [reaction, setReaction] = useState<Reaction>(null);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleReaction(value: Exclude<Reaction, null>) {
    setReaction(value);
    if (value === "helpful") {
      // Store the helpful vote
      try {
        const votes = JSON.parse(
          localStorage.getItem("waaha_feedback_helpful") || "[]"
        );
        if (!votes.includes(pageId)) {
          votes.push(pageId);
          localStorage.setItem(
            "waaha_feedback_helpful",
            JSON.stringify(votes)
          );
        }
      } catch {}
      setTimeout(() => setSubmitted(true), 500);
      showToast("شكراً على تقييمك ❤️", "success");
    }
  }

  function handleSubmitComment() {
    if (!comment.trim()) return;
    try {
      const feedback = JSON.parse(
        localStorage.getItem("waaha_feedback") || "[]"
      );
      feedback.push({
        pageId,
        pageTitle,
        comment: comment.trim(),
        timestamp: Date.now(),
      });
      localStorage.setItem("waaha_feedback", JSON.stringify(feedback));
    } catch {}
    setSubmitted(true);
    showToast("شكراً — سنأخذ ملاحظاتك في الاعتبار", "success");
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-[#91b149]/10 to-[#1d5770]/10 dark:from-[#91b149]/20 dark:to-[#1d5770]/20 rounded-2xl border border-[#91b149]/30 p-6 text-center my-8"
      >
        <div className="text-4xl mb-2">🙏</div>
        <h3 className="font-bold font-display text-lg text-[#12394d] dark:text-white mb-1">
          شكراً على تفاعلك
        </h3>
        <p className="text-xs text-[#7b7c7d] dark:text-white/60">
          ملاحظاتك بتساعدنا نحسّن المحتوى
        </p>
      </motion.div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#162033] rounded-2xl border border-[#d0dde4] dark:border-[#1e3a5f] p-6 my-8 no-print">
      <div className="text-center mb-5">
        <div className="text-3xl mb-2">💬</div>
        <h3 className="font-bold font-display text-base text-[#12394d] dark:text-white mb-1">
          هل المعلومات دي ساعدتك؟
        </h3>
        <p className="text-xs text-[#7b7c7d]">
          رأيك مهم لتحسين المحتوى المقدم
        </p>
      </div>

      <div className="flex items-center justify-center gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleReaction("helpful")}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all ${
            reaction === "helpful"
              ? "bg-[#91b149] text-white shadow-lg"
              : "bg-[#f5f8fa] dark:bg-[#0a151f] text-[#12394d] dark:text-white hover:bg-[#91b149]/10 hover:text-[#91b149]"
          }`}
        >
          <span className="text-lg">👍</span>
          ساعدني
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleReaction("not-helpful")}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all ${
            reaction === "not-helpful"
              ? "bg-red-500 text-white shadow-lg"
              : "bg-[#f5f8fa] dark:bg-[#0a151f] text-[#12394d] dark:text-white hover:bg-red-50 hover:text-red-500"
          }`}
        >
          <span className="text-lg">👎</span>
          ناقص
        </motion.button>
      </div>

      <AnimatePresence>
        {reaction === "not-helpful" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-5 pt-5 border-t border-[#d0dde4] dark:border-[#1e3a5f]">
              <label className="block text-xs font-semibold text-[#12394d] dark:text-white mb-2">
                إيه اللي تحب نضيفه أو نحسّنه؟
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="ساعدنا نفهم احتياجاتك..."
                className="w-full px-4 py-3 bg-[#f5f8fa] dark:bg-[#0a151f] border border-[#d0dde4] dark:border-[#1e3a5f] rounded-xl text-sm text-[#12394d] dark:text-white placeholder:text-[#7b7c7d] focus:outline-none focus:border-[#1d5770] dark:focus:border-[#91b149] transition-all resize-none"
                rows={3}
                maxLength={500}
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] text-[#7b7c7d]">
                  {comment.length}/500
                </span>
                <button
                  onClick={handleSubmitComment}
                  disabled={!comment.trim()}
                  className="px-5 py-2 rounded-full bg-[#1d5770] hover:bg-[#174860] disabled:bg-[#d0dde4] disabled:cursor-not-allowed text-white text-xs font-bold transition-all"
                >
                  إرسال الملاحظات
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
