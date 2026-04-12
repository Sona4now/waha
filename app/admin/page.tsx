"use client";

import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SiteLayout from "@/components/site/SiteLayout";

// Admin password verified via API — see /api/admin-auth
const ADMIN_AUTH_ENDPOINT = "/api/admin-auth";

interface Feedback {
  pageId: string;
  pageTitle: string;
  comment: string;
  timestamp: number;
}

interface LocalStats {
  favoritesCount: number;
  comparisonsCount: number;
  helpfulVotes: number;
  feedbackCount: number;
  tourViews: number;
  totalVisits: number;
  achievementsUnlocked: number;
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [stats, setStats] = useState<LocalStats | null>(null);
  const [feedback, setFeedback] = useState<Feedback[]>([]);

  useEffect(() => {
    // Check session auth
    if (sessionStorage.getItem("waaha_admin") === "1") {
      setAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    loadData();
  }, [authenticated]);

  function loadData() {
    try {
      const favorites = JSON.parse(
        localStorage.getItem("waaha_favorites") || "[]"
      );
      const comparisons = JSON.parse(
        localStorage.getItem("waaha_comparison") || "[]"
      );
      const helpfulVotes = JSON.parse(
        localStorage.getItem("waaha_feedback_helpful") || "[]"
      );
      const feedbackData: Feedback[] = JSON.parse(
        localStorage.getItem("waaha_feedback") || "[]"
      );
      const userState = JSON.parse(
        localStorage.getItem("waaha_user_state") || "{}"
      );
      const achievements = JSON.parse(
        localStorage.getItem("waaha_achievements") || "[]"
      );

      setStats({
        favoritesCount: favorites.length,
        comparisonsCount: comparisons.length,
        helpfulVotes: helpfulVotes.length,
        feedbackCount: feedbackData.length,
        tourViews: userState.toursWatched || 0,
        totalVisits: userState.visitCount || 0,
        achievementsUnlocked: achievements.length,
      });

      setFeedback(feedbackData.sort((a, b) => b.timestamp - a.timestamp));
    } catch {}
  }

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch(ADMIN_AUTH_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        setAuthenticated(true);
        sessionStorage.setItem("waaha_admin", "1");
        setError(false);
      } else {
        setError(true);
        setPassword("");
      }
    } catch {
      setError(true);
      setPassword("");
    }
  }

  function handleLogout() {
    setAuthenticated(false);
    sessionStorage.removeItem("waaha_admin");
  }

  function resetAllData() {
    if (
      !confirm(
        "هل أنت متأكد؟ ده هيمسح كل بيانات الزوار (localStorage) من جهازك فقط."
      )
    )
      return;
    [
      "waaha_favorites",
      "waaha_comparison",
      "waaha_feedback",
      "waaha_feedback_helpful",
      "waaha_user_state",
      "waaha_achievements",
      "waaha_visits",
      "waaha_recommendation",
      "waaha_chat_messages",
      "waaha_theme",
      "waaha_tip_dismissed",
    ].forEach((key) => localStorage.removeItem(key));
    loadData();
  }

  if (!authenticated) {
    return (
      <SiteLayout>
        <section className="min-h-[70vh] flex items-center justify-center px-6">
          <div className="w-full max-w-sm">
            <div className="text-center mb-8">
              <div className="text-5xl mb-4">🔐</div>
              <h1 className="text-2xl font-bold font-display text-[#12394d] dark:text-white mb-2">
                لوحة التحكم
              </h1>
              <p className="text-sm text-[#7b7c7d]">
                مخصصة للمشرفين الأكاديميين فقط
              </p>
            </div>

            <form
              onSubmit={handleLogin}
              className="bg-white dark:bg-[#162033] rounded-2xl border border-[#d0dde4] dark:border-[#1e3a5f] p-6 shadow-lg"
            >
              <label className="block text-xs font-semibold text-[#12394d] dark:text-white mb-2">
                كلمة المرور
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                className="w-full px-4 py-3 bg-[#f5f8fa] dark:bg-[#0a151f] border border-[#d0dde4] dark:border-[#1e3a5f] rounded-xl text-[#12394d] dark:text-white text-center focus:outline-none focus:border-[#1d5770] dark:focus:border-[#91b149] transition-all"
                placeholder="••••••••"
              />
              {error && (
                <p className="text-red-500 text-xs mt-2 text-center animate-pulse">
                  كلمة المرور غير صحيحة
                </p>
              )}
              <button
                type="submit"
                disabled={!password}
                className="w-full mt-4 py-3 bg-gradient-to-l from-[#91b149] to-[#6a8435] disabled:opacity-40 text-white font-bold text-sm rounded-xl transition-all hover:shadow-lg"
              >
                دخول
              </button>
              <p className="text-[10px] text-[#7b7c7d] text-center mt-3">
                البيانات محلية — من جهازك فقط
              </p>
            </form>
          </div>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="py-16 bg-[#f5f8fa] dark:bg-[#0a151f] min-h-screen">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[#91b149] font-bold mb-2">
                <span className="w-2 h-2 rounded-full bg-[#91b149] animate-pulse" />
                Admin Dashboard
              </div>
              <h1 className="text-3xl md:text-4xl font-bold font-display text-[#12394d] dark:text-white">
                لوحة تحكم المشرفين
              </h1>
              <p className="text-sm text-[#7b7c7d] mt-1">
                إحصائيات وردود الفعل المجمعة من المستخدمين
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={loadData}
                className="px-4 py-2 rounded-full bg-white dark:bg-[#162033] border border-[#d0dde4] dark:border-[#1e3a5f] text-[#12394d] dark:text-white text-xs font-semibold hover:border-[#1d5770] transition-all"
              >
                🔄 تحديث
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-full bg-white dark:bg-[#162033] border border-[#d0dde4] dark:border-[#1e3a5f] text-[#12394d] dark:text-white text-xs font-semibold hover:border-red-500 hover:text-red-500 transition-all"
              >
                خروج
              </button>
            </div>
          </div>

          {/* Stats grid */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {[
                { icon: "👥", label: "زيارات المستخدم", value: stats.totalVisits },
                { icon: "❤️", label: "المفضلة", value: stats.favoritesCount },
                { icon: "⚖️", label: "المقارنات", value: stats.comparisonsCount },
                { icon: "👍", label: "تقييمات إيجابية", value: stats.helpfulVotes },
                { icon: "💬", label: "ردود الفعل", value: stats.feedbackCount },
                { icon: "🎥", label: "جولات 360° شوهدت", value: stats.tourViews },
                { icon: "🏆", label: "إنجازات مفتوحة", value: stats.achievementsUnlocked },
                { icon: "⭐", label: "معدل التفاعل", value: `${Math.round((stats.helpfulVotes + stats.feedbackCount) * 100) / 100}` },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white dark:bg-[#162033] rounded-2xl p-5 border border-[#d0dde4] dark:border-[#1e3a5f]"
                >
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-2xl font-black text-[#1d5770] dark:text-[#91b149] mb-1">
                    {stat.value}
                  </div>
                  <div className="text-[11px] text-[#7b7c7d]">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Feedback list */}
          <div className="bg-white dark:bg-[#162033] rounded-2xl border border-[#d0dde4] dark:border-[#1e3a5f] overflow-hidden">
            <div className="p-5 border-b border-[#d0dde4] dark:border-[#1e3a5f] flex items-center justify-between">
              <div>
                <h2 className="font-bold font-display text-lg text-[#12394d] dark:text-white">
                  ردود فعل المستخدمين
                </h2>
                <p className="text-xs text-[#7b7c7d]">
                  {feedback.length} رد فعل
                </p>
              </div>
            </div>

            <div className="max-h-[500px] overflow-y-auto">
              {feedback.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="text-4xl mb-3">📭</div>
                  <p className="text-sm text-[#7b7c7d]">
                    لا توجد ردود فعل بعد
                  </p>
                </div>
              ) : (
                <AnimatePresence>
                  {feedback.map((item, i) => (
                    <motion.div
                      key={`${item.pageId}-${item.timestamp}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="p-5 border-b border-[#d0dde4] dark:border-[#1e3a5f] last:border-0"
                    >
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#1d5770]/10 text-[#1d5770] dark:bg-[#91b149]/20 dark:text-[#91b149]">
                            {item.pageTitle}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#7b7c7d]">
                          {new Date(item.timestamp).toLocaleDateString(
                            "ar-EG"
                          )}
                        </span>
                      </div>
                      <p className="text-sm text-[#12394d] dark:text-white/80 leading-relaxed">
                        {item.comment}
                      </p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>

          {/* Danger zone */}
          <div className="mt-10 p-5 rounded-2xl border-2 border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/10">
            <h3 className="font-bold text-red-600 dark:text-red-400 mb-2 text-sm">
              ⚠️ منطقة خطرة
            </h3>
            <p className="text-xs text-red-500 dark:text-red-400/80 mb-3">
              يمحو كل البيانات المحلية من جهازك فقط. لن يؤثر على البيانات
              الحقيقية للمستخدمين.
            </p>
            <button
              onClick={resetAllData}
              className="px-5 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white text-xs font-bold transition-all"
            >
              مسح كل البيانات المحلية
            </button>
          </div>

          {/* Note */}
          <div className="mt-6 text-center text-xs text-[#7b7c7d]">
            <p>
              البيانات المعروضة هنا هي من localStorage لجهازك الحالي. للحصول
              على إحصائيات حقيقية من جميع الزوار، استخدم Vercel Analytics.
            </p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
