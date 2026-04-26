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

/** Parse the SUGGESTIONS line from an assistant message. Returns [cleanContent, suggestions]. */
function parseSuggestions(content: string): [string, string[]] {
  const match = content.match(/SUGGESTIONS:\s*(.+?)(?:\n|$)/);
  if (!match) return [content, []];
  const suggestions = match[1]
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3);
  const cleanContent = content.replace(/SUGGESTIONS:.+?(?:\n|$)/, "").trim();
  return [cleanContent, suggestions];
}

/**
 * Parse the optional BOOK directive — the model emits "BOOK: id|tier"
 * when it has confidently recommended a specific destination, so the
 * UI can render an inline "احجز X" CTA below the bubble.
 *
 * Validates the destination ID and tier against known values; rejects
 * anything else to avoid letting the model render arbitrary URLs.
 */
const KNOWN_DESTINATIONS: Record<string, string> = {
  safaga: "سفاجا",
  siwa: "سيوة",
  sinai: "سيناء",
  fayoum: "الفيوم",
  bahariya: "الواحات البحرية",
  "wadi-degla": "وادي دجلة",
  "shagie-farms": "مزارع شجيع",
};
const KNOWN_TIERS = new Set(["basic", "standard", "premium"]);

interface BookCta {
  destinationId: string;
  destinationName: string;
  tier: "basic" | "standard" | "premium";
}

function parseBook(content: string): [string, BookCta | null] {
  const match = content.match(/BOOK:\s*([\w-]+)\s*\|\s*(\w+)/);
  if (!match) return [content, null];
  const destinationId = match[1].trim();
  const tier = match[2].trim() as "basic" | "standard" | "premium";
  const cleanContent = content.replace(/BOOK:.+?(?:\n|$)/, "").trim();
  if (!KNOWN_DESTINATIONS[destinationId] || !KNOWN_TIERS.has(tier)) {
    return [cleanContent, null];
  }
  return [
    cleanContent,
    {
      destinationId,
      destinationName: KNOWN_DESTINATIONS[destinationId],
      tier,
    },
  ];
}

const TIER_LABEL: Record<BookCta["tier"], string> = {
  basic: "الأساسية",
  standard: "الموصى بها ⭐",
  premium: "المتكاملة",
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
const HIDDEN_PATHS = ["/", "/gate", "/therapy-room", "/map"];

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
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  // Track whether the user is "near the bottom" of the messages list. We only
  // auto-scroll when this is true — otherwise streaming chunks would yank the
  // user back down whenever they scrolled up to re-read something.
  const isUserNearBottomRef = useRef(true);
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

  // Auto-scroll the messages list to the bottom on new content — but only if
  // the user was already near the bottom. We scroll the container directly
  // (no scrollIntoView) so the page outside the chat never moves. Instant
  // scroll instead of smooth: smooth animations stack across streaming chunks
  // and make the chat feel like it's "constantly going down".
  useEffect(() => {
    if (!isOpen) return;
    const el = messagesContainerRef.current;
    if (!el) return;
    if (isUserNearBottomRef.current) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, isOpen]);

  // Detect user-initiated scrolls only (wheel / touch / keyboard). We can't
  // rely on the scroll event alone because it fires for our own programmatic
  // scrollTop writes too — that race condition would re-arm "near bottom"
  // immediately after the user scrolled up, and the next chunk would yank
  // them back down.
  function handleUserScrollIntent() {
    // requestAnimationFrame so we read scrollTop *after* the gesture applied.
    requestAnimationFrame(() => {
      const el = messagesContainerRef.current;
      if (!el) return;
      const distanceFromBottom =
        el.scrollHeight - el.scrollTop - el.clientHeight;
      // 80px threshold — if user is more than 80px above the bottom, stop
      // auto-following until they scroll back down themselves.
      isUserNearBottomRef.current = distanceFromBottom < 80;
    });
  }

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

    // Track achievement
    try {
      const { trackAction } = await import("@/lib/achievements");
      trackAction("aiChatUsed");
    } catch {}

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
    // User just submitted — they want to see the response, so re-enable
    // auto-follow even if they had scrolled up earlier.
    isUserNearBottomRef.current = true;

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

      try {
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
      } finally {
        // Always release the reader, even on early throw or abort.
        try {
          await reader.cancel();
        } catch {
          /* already closed */
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
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 50 }}
            animate={{
              scale: 1,
              opacity: 1,
              y: [0, -6, 0],
            }}
            exit={{ scale: 0, opacity: 0, y: 50 }}
            transition={{
              scale: { type: "spring", stiffness: 260, damping: 18 },
              opacity: { duration: 0.3 },
              y: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
            className="fixed bottom-24 left-4 md:bottom-8 md:left-8 z-[100] group"
          >
            {/* Outer animated glow ring (largest) */}
            <motion.span
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "conic-gradient(from 0deg, #91b149, #1d5770, #91b149)",
              }}
              animate={{ rotate: 360 }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "linear",
              }}
            />

            {/* Multi-layer pulse rings */}
            <motion.span
              className="absolute inset-0 rounded-full bg-[#91b149]"
              animate={{
                scale: [1, 1.5, 1.8],
                opacity: [0.5, 0.2, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
            <motion.span
              className="absolute inset-0 rounded-full bg-[#1d5770]"
              animate={{
                scale: [1, 1.6, 2],
                opacity: [0.4, 0.15, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeOut",
                delay: 0.8,
              }}
            />

            {/* The actual button */}
            <motion.button
              onClick={handleOpen}
              aria-label="فتح المساعد الذكي"
              className="relative block"
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              {/* Inner gradient background (with padding for the glow ring to show) */}
              <span className="relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-[#1d5770] via-[#12394d] to-[#0d2a39] text-white shadow-[0_10px_40px_-8px_rgba(29,87,112,0.6)] border-[3px] border-white m-[3px] overflow-hidden">
                {/* Inner shimmer shine */}
                <motion.span
                  className="absolute inset-0 rounded-full"
                  style={{
                    background:
                      "linear-gradient(130deg, transparent 30%, rgba(255,255,255,0.25) 50%, transparent 70%)",
                    backgroundSize: "200% 200%",
                  }}
                  animate={{
                    backgroundPosition: ["200% 200%", "-100% -100%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                    repeatDelay: 1,
                  }}
                />

                {/* Chat icon with subtle rotation on hover */}
                <motion.svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="relative z-10"
                  animate={{ rotate: [0, -8, 8, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </motion.svg>

                {/* New badge with pulse */}
                {hasNewBadge && (
                  <motion.span
                    className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-red-500 border-2 border-white flex items-center justify-center z-20"
                    animate={{
                      scale: [1, 1.15, 1],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  </motion.span>
                )}
              </span>
            </motion.button>

            {/* Tooltip */}
            <motion.span
              initial={{ opacity: 0, y: 5 }}
              whileHover={{ opacity: 1, y: 0 }}
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 whitespace-nowrap bg-[#0d2a39] text-white text-xs px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none shadow-lg"
            >
              اسأل المساعد الذكي 💬
              <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-[#0d2a39] rotate-45" />
            </motion.span>
          </motion.div>
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
              // Mobile: full-screen using h-dvh (Tailwind v4) so iOS Safari's
              // address-bar shrinking doesn't push the input off-screen.
              // Desktop: fixed 600px panel anchored bottom-left.
              className="fixed z-[100] bg-white shadow-2xl border border-[#d0dde4] overflow-hidden flex flex-col
                         inset-x-0 bottom-0 h-dvh max-h-dvh rounded-none
                         md:inset-auto md:bottom-8 md:left-8 md:right-auto
                         md:w-[400px] md:h-[600px] md:max-h-[85vh] md:rounded-3xl"
            >
              {/* Header */}
              <div
                className="bg-gradient-to-l from-[#0d2a39] to-[#1d5770] px-5 py-4 flex items-center justify-between flex-shrink-0"
                // Pad the top of the header so the title isn't tucked under
                // the iPhone notch / Dynamic Island when the modal is full-screen.
                style={{
                  paddingTop:
                    "calc(env(safe-area-inset-top, 0px) + 1rem)",
                }}
              >
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
                      className="w-9 h-9 rounded-full hover:bg-white/10 active:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors"
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
                    aria-label="إغلاق"
                    title="إغلاق"
                    className="w-9 h-9 rounded-full hover:bg-white/10 active:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors"
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
              <div
                ref={messagesContainerRef}
                onWheel={handleUserScrollIntent}
                onTouchMove={handleUserScrollIntent}
                onKeyDown={handleUserScrollIntent}
                className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 py-4 space-y-4 bg-gradient-to-b from-[#f5f8fa] to-white"
                style={{
                  // iOS momentum scrolling. Without this the messages list
                  // feels stiff compared to native apps.
                  WebkitOverflowScrolling: "touch",
                }}
              >
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
                    <div className="max-w-[82%] flex flex-col gap-2">
                      {(() => {
                        // Parse SUGGESTIONS first, then BOOK from the
                        // already-cleaned content. Order matters because
                        // the model can emit both.
                        const [afterSuggestions, suggestions] =
                          msg.role === "assistant"
                            ? parseSuggestions(msg.content)
                            : [msg.content, [] as string[]];
                        const [cleanContent, book] =
                          msg.role === "assistant"
                            ? parseBook(afterSuggestions)
                            : [afterSuggestions, null];
                        const isLast =
                          msg.id === messages[messages.length - 1]?.id;
                        const showSuggestions =
                          suggestions.length > 0 &&
                          !isStreaming &&
                          msg.role === "assistant" &&
                          isLast;
                        const showBookCta =
                          book !== null &&
                          !isStreaming &&
                          msg.role === "assistant";

                        return (
                          <>
                            <div
                              className={`rounded-2xl px-3.5 py-2.5 ${
                                msg.role === "user"
                                  ? "bg-[#1d5770] text-white rounded-tr-sm"
                                  : "bg-white border border-[#d0dde4] text-[#12394d] rounded-tl-sm shadow-sm"
                              }`}
                            >
                              {cleanContent || msg.content ? (
                                <p className="text-[13px] leading-relaxed whitespace-pre-wrap">
                                  {cleanContent}
                                  {isStreaming &&
                                    msg.role === "assistant" &&
                                    isLast && (
                                      <span className="inline-block w-1 h-3.5 ml-0.5 bg-[#91b149] animate-pulse align-middle" />
                                    )}
                                </p>
                              ) : null}
                              {!msg.content && (
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

                            {/* Inline booking CTA — when the model
                                confidently recommended a destination + tier,
                                we surface a one-click route to the
                                destination page (which scrolls to the
                                pricing card and pre-selects the tier via
                                sessionStorage for the lead form). */}
                            {showBookCta && book && (
                              <motion.a
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 }}
                                href={`/destination/${book.destinationId}#lead-capture`}
                                onClick={() => {
                                  try {
                                    sessionStorage.setItem(
                                      "waaha_chosen_tier",
                                      book.tier,
                                    );
                                  } catch {}
                                }}
                                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-l from-[#91b149] to-[#6a8435] hover:from-[#a3c45a] hover:to-[#7a9442] text-[#0a0f14] no-underline px-3.5 py-2.5 shadow-[0_4px_14px_-4px_rgba(145,177,73,0.5)] hover:shadow-[0_6px_20px_-4px_rgba(145,177,73,0.7)] transition-all"
                              >
                                <span className="text-base">✦</span>
                                <div className="text-right flex-1">
                                  <div className="text-[10px] font-bold opacity-80">
                                    احجز الباقة {TIER_LABEL[book.tier]}
                                  </div>
                                  <div className="text-xs font-bold">
                                    {book.destinationName}
                                  </div>
                                </div>
                                <span className="text-base">←</span>
                              </motion.a>
                            )}

                            {/* Quick reply suggestions */}
                            {showSuggestions && (
                              <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="flex flex-wrap gap-1.5"
                              >
                                {suggestions.map((s) => (
                                  <button
                                    key={s}
                                    onClick={() => sendMessage(s)}
                                    className="text-[11px] px-2.5 py-1.5 rounded-full bg-[#91b149]/10 border border-[#91b149]/30 text-[#6a8435] hover:bg-[#91b149]/20 hover:border-[#91b149] transition-all"
                                  >
                                    {s}
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </>
                        );
                      })()}

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
                // Pad the bottom for iPhone home-indicator safe area so the
                // send button isn't sitting on the bottom edge of the screen.
                style={{
                  paddingBottom:
                    "calc(env(safe-area-inset-bottom, 0px) + 0.75rem)",
                }}
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
                    // text-base (16px) is required to prevent iOS from
                    // auto-zooming when the input gains focus. Anything
                    // smaller and the page jumps. enterKeyHint shows a
                    // "Send" key on the soft keyboard.
                    enterKeyHint="send"
                    autoCapitalize="off"
                    autoCorrect="off"
                    className="flex-1 px-4 py-2.5 bg-[#f5f8fa] border border-[#d0dde4] rounded-full text-base text-[#12394d] placeholder:text-[#7b7c7d] focus:outline-none focus:border-[#1d5770] focus:bg-white transition-all disabled:opacity-60"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isStreaming}
                    aria-label="إرسال"
                    className="flex-shrink-0 w-11 h-11 rounded-full bg-[#1d5770] hover:bg-[#174860] disabled:bg-[#d0dde4] disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors"
                  >
                    <svg
                      width="16"
                      height="16"
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
                <p className="text-[10px] text-[#7b7c7d] text-center mt-1.5">
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
