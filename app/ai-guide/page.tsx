"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import SiteLayout from "@/components/site/SiteLayout";
import PageHero from "@/components/site/PageHero";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const GREETING: Message = {
  id: "greeting",
  role: "assistant",
  content:
    "أهلاً بك في واحة 🌿\n\nأنا مساعدك الذكي للسياحة الاستشفائية في مصر. احكيلي عن حالتك الصحية أو اللي بتدور عليه، وأنا هساعدك تكتشف الوجهة المثالية ليك.",
};

const SUGGESTED_PROMPTS = [
  { icon: "🦴", text: "عندي آلام في المفاصل، إيه أفضل مكان؟" },
  { icon: "🩺", text: "بدي علاج طبيعي للصدفية" },
  { icon: "🧘", text: "مكان هادي للاسترخاء وتخفيف التوتر" },
  { icon: "🫁", text: "عندي مشاكل تنفس وحساسية صدر" },
  { icon: "🏖️", text: "قارن لي بين سفاجا وسيوة" },
  { icon: "📅", text: "امتى أفضل وقت لزيارة سيناء؟" },
];

export default function AIGuidePage() {
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text: string) {
    if (!text.trim() || isStreaming) return;

    setError(null);
    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text.trim(),
    };

    const assistantId = `a-${Date.now()}`;
    const placeholderAssistant: Message = {
      id: assistantId,
      role: "assistant",
      content: "",
    };

    const newMessages = [...messages, userMsg];
    setMessages([...newMessages, placeholderAssistant]);
    setInput("");
    setIsStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          messages: newMessages
            .filter((m) => m.id !== "greeting")
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }

      if (!res.body) throw new Error("لا يوجد response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") continue;

          try {
            const parsed = JSON.parse(data);
            if (parsed.error) {
              throw new Error(parsed.error);
            }
            if (parsed.text) {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? { ...m, content: m.content + parsed.text }
                    : m
                )
              );
            }
          } catch (e) {
            if (e instanceof SyntaxError) continue;
            throw e;
          }
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        // User cancelled
      } else {
        const errMsg =
          err instanceof Error ? err.message : "حدث خطأ غير متوقع";
        setError(errMsg);
        setMessages((prev) => prev.filter((m) => m.id !== assistantId));
      }
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  function handleStop() {
    abortRef.current?.abort();
  }

  function handleReset() {
    setMessages([GREETING]);
    setError(null);
  }

  return (
    <SiteLayout>
      <PageHero
        title="المساعد الذكي"
        subtitle="اكتشف وجهتك الاستشفائية المثالية بالذكاء الاصطناعي"
        breadcrumb={[
          { label: "الرئيسية", href: "/home" },
          { label: "المساعد الذكي" },
        ]}
      />

      <section className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Chat Container */}
        <div className="bg-white dark:bg-[#162033] rounded-2xl border border-[#d0dde4] dark:border-[#1e3a5f] shadow-sm overflow-hidden flex flex-col h-[70vh] min-h-[500px]">
          {/* Header */}
          <div className="bg-[#0d2a39] px-5 py-4 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <span className="text-lg">🤖</span>
                </div>
                <span className="absolute bottom-0 left-0 w-3 h-3 rounded-full bg-[#91b149] border-2 border-[#0d2a39]" />
              </div>
              <div>
                <h3 className="text-white font-bold font-display text-base">
                  مساعد واحة
                </h3>
                <p className="text-white/50 text-xs">
                  مدعوم بـ Claude — متاح الآن
                </p>
              </div>
            </div>
            {messages.length > 1 && (
              <button
                onClick={handleReset}
                className="text-white/50 hover:text-white text-xs flex items-center gap-1 transition-colors"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
                محادثة جديدة
              </button>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5 bg-gradient-to-b from-[#f5f8fa] to-white dark:from-[#0d1b2a] dark:to-[#162033]">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === "user"
                      ? "bg-[#1d5770] text-white"
                      : "bg-gradient-to-br from-[#91b149] to-[#6a8435] text-white"
                  }`}
                >
                  {msg.role === "user" ? (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  ) : (
                    <span className="text-sm">🌿</span>
                  )}
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-[#1d5770] text-white rounded-tr-sm"
                      : "bg-white dark:bg-[#0d1b2a] border border-[#d0dde4] dark:border-[#1e3a5f] text-[#12394d] dark:text-white rounded-tl-sm shadow-sm"
                  }`}
                >
                  {msg.content ? (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                      {isStreaming &&
                        msg.role === "assistant" &&
                        msg.id === messages[messages.length - 1]?.id && (
                          <span className="inline-block w-1.5 h-4 ml-1 bg-[#91b149] animate-pulse align-middle" />
                        )}
                    </p>
                  ) : (
                    <div className="flex gap-1 py-1">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-[#91b149]"
                          style={{
                            animation: `bounce 1.4s infinite ease-in-out`,
                            animationDelay: `${i * 0.16}s`,
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Suggested Prompts (shown only at start) */}
            {messages.length === 1 && !isStreaming && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="pt-4"
              >
                <p className="text-xs text-[#7b7c7d] dark:text-white/50 mb-3 text-center">
                  أو جرّب أحد الأسئلة دي:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SUGGESTED_PROMPTS.map((p) => (
                    <button
                      key={p.text}
                      onClick={() => sendMessage(p.text)}
                      className="flex items-center gap-2 p-3 text-right rounded-xl bg-white dark:bg-[#0d1b2a] border border-[#d0dde4] dark:border-[#1e3a5f] hover:border-[#1d5770] hover:bg-[#f5f8fa] dark:hover:bg-[#162033] transition-all text-xs text-[#12394d] dark:text-white"
                    >
                      <span className="text-base flex-shrink-0">{p.icon}</span>
                      <span className="text-right leading-tight">
                        {p.text}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 rounded-xl p-3 text-center"
                >
                  <p className="text-xs text-red-600">⚠️ {error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-[#d0dde4] dark:border-[#1e3a5f] p-4 bg-white dark:bg-[#162033]"
          >
            <div className="flex gap-2 items-end">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  isStreaming ? "جاري التفكير..." : "اكتب سؤالك هنا..."
                }
                disabled={isStreaming}
                className="flex-1 px-4 py-3 bg-[#f5f8fa] dark:bg-[#0d1b2a] border border-[#d0dde4] dark:border-[#1e3a5f] rounded-full text-sm text-[#12394d] dark:text-white placeholder:text-[#7b7c7d] dark:placeholder:text-white/40 focus:outline-none focus:border-[#1d5770] focus:bg-white dark:focus:bg-[#162033] transition-all disabled:opacity-60"
                autoFocus
              />
              {isStreaming ? (
                <button
                  type="button"
                  onClick={handleStop}
                  className="flex-shrink-0 w-11 h-11 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
                  title="إيقاف"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <rect x="6" y="6" width="12" height="12" rx="1" />
                  </svg>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="flex-shrink-0 w-11 h-11 rounded-full bg-[#1d5770] hover:bg-[#174860] disabled:bg-[#d0dde4] disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors"
                  title="إرسال"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ transform: "scaleX(-1)" }}
                  >
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              )}
            </div>
            <p className="text-[10px] text-[#7b7c7d] dark:text-white/40 text-center mt-2">
              المساعد الذكي قد يخطئ أحياناً. استشر طبيبك قبل أي علاج طبيعي.
            </p>
          </form>
        </div>

        {/* How it works */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-center mb-6 font-display text-[#12394d] dark:text-white">
            كيف يعمل المساعد الذكي؟
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: "1",
                title: "صِف حالتك",
                desc: "اكتب حالتك الصحية أو نوع التجربة التي تبحث عنها",
              },
              {
                icon: "2",
                title: "تحليل ذكي",
                desc: "يحلل الذكاء الاصطناعي احتياجاتك ويبحث في قاعدة البيانات",
              },
              {
                icon: "3",
                title: "توصية مخصصة",
                desc: "احصل على اقتراح وجهة مع الأسباب العلمية والتحذيرات",
              },
            ].map((step) => (
              <div
                key={step.icon}
                className="bg-white dark:bg-[#162033] rounded-xl p-5 border border-[#d0dde4] dark:border-[#1e3a5f] text-center"
              >
                <div className="w-10 h-10 rounded-full bg-[#1d5770] text-white font-bold text-lg flex items-center justify-center mx-auto mb-3">
                  {step.icon}
                </div>
                <h3 className="font-bold font-display text-[#12394d] dark:text-white mb-1">
                  {step.title}
                </h3>
                <p className="text-xs text-[#7b7c7d] dark:text-white/50 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-8">
          <Link
            href="/destinations"
            className="inline-flex items-center gap-1.5 text-[#1d5770] hover:text-[#174860] text-sm font-semibold transition-colors"
          >
            تصفح جميع الوجهات يدوياً
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
        </div>
      </section>

      <style jsx global>{`
        @keyframes bounce {
          0%,
          60%,
          100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-6px);
          }
        }
      `}</style>
    </SiteLayout>
  );
}
