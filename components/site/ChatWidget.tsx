"use client";

import {
  useState,
  useRef,
  useEffect,
  FormEvent,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const GREETING: Message = {
  id: "greeting",
  role: "assistant",
  content:
    "أهلاً بك في واحة 🌿\n\nأنا مساعدك الذكي للسياحة الاستشفائية في مصر. احكيلي عن حالتك الصحية وأنا هساعدك تكتشف وجهتك المثالية.",
};

const SUGGESTED_PROMPTS = [
  "عندي آلام مفاصل",
  "علاج للصدفية",
  "مكان للاسترخاء",
  "أفضل وقت لسفاجا",
];

// Don't show the widget on these paths
const HIDDEN_PATHS = ["/", "/gate"];

const STORAGE_KEY = "waaha_chat_messages";

export default function ChatWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewBadge, setHasNewBadge] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Show "new" badge on first visit
  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = localStorage.getItem("waaha_chat_seen");
    if (!seen) setHasNewBadge(true);
  }, []);

  // Restore messages from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Message[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Persist messages to localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (messages.length <= 1) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // storage full
    }
  }, [messages]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setHasNewBadge(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("waaha_chat_seen", "1");
    }
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    abortRef.current?.abort();
  }, []);

  const handleReset = useCallback(() => {
    setMessages([GREETING]);
    setError(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

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
            if (parsed.error) throw new Error(parsed.error);
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
        // user cancelled
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

  // Don't render on hidden paths
  if (HIDDEN_PATHS.includes(pathname)) return null;

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onClick={handleOpen}
            className="fixed bottom-6 left-6 md:bottom-8 md:left-8 z-[100] group"
            aria-label="فتح المساعد الذكي"
          >
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full bg-[#91b149] opacity-30 animate-ping" />

            {/* Button */}
            <span className="relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-[#1d5770] to-[#0d2a39] text-white shadow-xl group-hover:scale-110 transition-transform duration-300 border-2 border-white/20">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>

              {/* New badge */}
              {hasNewBadge && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 border-2 border-white flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                </span>
              )}
            </span>

            {/* Tooltip */}
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap bg-[#0d2a39] text-white text-xs px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              اسأل المساعد الذكي
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Popup */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[99] md:hidden"
            />

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              dir="rtl"
              className="fixed z-[100] bg-white shadow-2xl border border-[#d0dde4] overflow-hidden flex flex-col
                         inset-x-0 bottom-0 top-0 rounded-none
                         md:inset-auto md:bottom-8 md:left-8 md:top-auto md:right-auto
                         md:w-[400px] md:h-[600px] md:rounded-3xl md:max-h-[85vh]"
            >
              {/* Header */}
              <div className="bg-gradient-to-l from-[#0d2a39] to-[#1d5770] px-5 py-4 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                      <span className="text-lg">🌿</span>
                    </div>
                    <span className="absolute bottom-0 left-0 w-3 h-3 rounded-full bg-[#91b149] border-2 border-[#0d2a39]" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-white font-bold font-display text-base truncate">
                      مساعد واحة
                    </h3>
                    <p className="text-white/50 text-[10px] truncate">
                      متاح الآن · مدعوم بـ Claude
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  {messages.length > 1 && (
                    <button
                      onClick={handleReset}
                      title="محادثة جديدة"
                      className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                    >
                      <svg
                        width="14"
                        height="14"
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
                    </button>
                  )}
                  <button
                    onClick={handleClose}
                    title="إغلاق"
                    className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
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
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gradient-to-b from-[#f5f8fa] to-white">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                        msg.role === "user"
                          ? "bg-[#1d5770] text-white"
                          : "bg-gradient-to-br from-[#91b149] to-[#6a8435] text-white"
                      }`}
                    >
                      {msg.role === "user" ? (
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      ) : (
                        <span className="text-xs">🌿</span>
                      )}
                    </div>

                    {/* Bubble */}
                    <div
                      className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 ${
                        msg.role === "user"
                          ? "bg-[#1d5770] text-white rounded-tr-sm"
                          : "bg-white border border-[#d0dde4] text-[#12394d] rounded-tl-sm shadow-sm"
                      }`}
                    >
                      {msg.content ? (
                        <p className="text-[13px] leading-relaxed whitespace-pre-wrap">
                          {msg.content}
                          {isStreaming &&
                            msg.role === "assistant" &&
                            msg.id ===
                              messages[messages.length - 1]?.id && (
                              <span className="inline-block w-1 h-3.5 ml-0.5 bg-[#91b149] animate-pulse align-middle" />
                            )}
                        </p>
                      ) : (
                        <div className="flex gap-1 py-0.5">
                          {[0, 1, 2].map((i) => (
                            <span
                              key={i}
                              className="w-1.5 h-1.5 rounded-full bg-[#91b149]"
                              style={{
                                animation: `chatBounce 1.4s infinite ease-in-out`,
                                animationDelay: `${i * 0.16}s`,
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}

                {/* Suggested Prompts (only at start) */}
                {messages.length === 1 && !isStreaming && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="pt-2"
                  >
                    <p className="text-[10px] text-[#7b7c7d] mb-2 text-center">
                      جرّب:
                    </p>
                    <div className="flex flex-wrap gap-1.5 justify-center">
                      {SUGGESTED_PROMPTS.map((text) => (
                        <button
                          key={text}
                          onClick={() => sendMessage(text)}
                          className="px-3 py-1.5 rounded-full bg-white border border-[#d0dde4] hover:border-[#1d5770] hover:bg-[#e4edf2] text-[11px] text-[#12394d] transition-all"
                        >
                          {text}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="bg-red-50 border border-red-200 rounded-lg p-2.5 text-center"
                    >
                      <p className="text-[11px] text-red-600">⚠️ {error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form
                onSubmit={handleSubmit}
                className="border-t border-[#d0dde4] p-3 bg-white flex-shrink-0"
              >
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={
                      isStreaming ? "جاري التفكير..." : "اكتب سؤالك..."
                    }
                    disabled={isStreaming}
                    className="flex-1 px-4 py-2.5 bg-[#f5f8fa] border border-[#d0dde4] rounded-full text-[13px] text-[#12394d] placeholder:text-[#7b7c7d] focus:outline-none focus:border-[#1d5770] focus:bg-white transition-all disabled:opacity-60"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isStreaming}
                    className="flex-shrink-0 w-10 h-10 rounded-full bg-[#1d5770] hover:bg-[#174860] disabled:bg-[#d0dde4] disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors"
                    title="إرسال"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ transform: "scaleX(-1)" }}
                    >
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </button>
                </div>
                <p className="text-[9px] text-[#7b7c7d] text-center mt-1.5">
                  استشر طبيبك قبل أي علاج طبيعي
                </p>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @keyframes chatBounce {
          0%,
          60%,
          100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-5px);
          }
        }
      `}</style>
    </>
  );
}
