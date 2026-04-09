"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import SiteLayout from "@/components/site/SiteLayout";
import { DESTINATIONS } from "@/data/siteData";

interface Message {
  role: "bot" | "user";
  text: string;
  destination?: (typeof DESTINATIONS)[number] | null;
}

const QUICK_CHIPS = [
  "آلام مفاصل",
  "مشاكل جلد",
  "توتر",
  "تنفس",
  "استرخاء",
  "طبيعة",
  "صحراء",
  "بحر",
];

const KEYWORDS: Record<string, string[]> = {
  مفاصل: ["مفاصل", "مفصل", "روماتيزم", "التهاب", "عظام", "ركبة"],
  جلد: ["جلد", "جلدية", "صدفية", "اكزيما", "بشرة", "حساسية"],
  تنفس: ["تنفس", "رئة", "ربو", "حساسية صدر", "صدر", "تنفسي"],
  توتر: ["توتر", "ضغط", "نفسي", "اكتئاب", "قلق", "عصبي", "أرق"],
  استرخاء: ["استرخاء", "راحة", "هدوء", "سكينة", "تأمل"],
  صحراء: ["صحراء", "رمال", "حر", "دفن", "رمل"],
  بحر: ["بحر", "بحري", "ساحل", "شاطئ", "ملح", "أملاح"],
  طبيعة: ["طبيعة", "خضراء", "واحة", "ينابيع", "عيون"],
};

function findMatchingDestination(input: string) {
  const lowerInput = input.trim();
  const matchedCategories: string[] = [];

  for (const [category, words] of Object.entries(KEYWORDS)) {
    for (const word of words) {
      if (lowerInput.includes(word)) {
        matchedCategories.push(category);
        break;
      }
    }
  }

  if (matchedCategories.length === 0) return null;

  for (const dest of DESTINATIONS) {
    const destText =
      `${dest.name} ${dest.description} ${dest.environment} ${(dest.treatments || []).join(" ")}`.toLowerCase();
    for (const cat of matchedCategories) {
      const catWords = KEYWORDS[cat] || [];
      for (const w of catWords) {
        if (destText.includes(w)) {
          return dest;
        }
      }
    }
  }

  return DESTINATIONS[0];
}

export default function AiGuidePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "أهلاً بك! أنا المساعد الذكي للسياحة العلاجية في مصر. أخبرني عن حالتك الصحية أو ما تبحث عنه، وسأقترح لك أفضل الوجهات العلاجية المناسبة.",
      destination: null,
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = (text?: string) => {
    const message = text || input.trim();
    if (!message) return;

    const userMsg: Message = { role: "user", text: message };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const matched = findMatchingDestination(message);

      let botMsg: Message;
      if (matched) {
        botMsg = {
          role: "bot",
          text: `بناءً على ما ذكرته، أنصحك بزيارة **${matched.name}**. هذه الوجهة مناسبة جداً لحالتك.`,
          destination: matched,
        };
      } else {
        botMsg = {
          role: "bot",
          text: "أحتاج مزيداً من التفاصيل. هل يمكنك إخباري بالحالة الصحية أو نوع البيئة التي تفضلها؟ مثلاً: آلام مفاصل، مشاكل جلد، صحراء، بحر...",
          destination: null,
        };
      }

      setIsTyping(false);
      setMessages((prev) => [...prev, botMsg]);
    }, 1200);
  };

  return (
    <SiteLayout>
      <div dir="rtl">
        {/* Page Hero */}
        <section
          className="py-16 text-center text-white"
          style={{ backgroundColor: "#1d5770" }}
        >
          <div className="max-w-4xl mx-auto px-4">
            <h1
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              المساعد الذكي
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              اسأل عن حالتك الصحية وسنرشح لك الوجهة العلاجية الأنسب في مصر
            </p>
          </div>
        </section>

        {/* Chat Section */}
        <section className="max-w-3xl mx-auto px-4 py-12">
          <div
            className="rounded-2xl border border-gray-200 shadow-lg overflow-hidden"
            style={{ backgroundColor: "#fff" }}
          >
            {/* Chat Header */}
            <div
              className="px-6 py-4 flex items-center gap-3"
              style={{ backgroundColor: "#12394d" }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#91b149" }}
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-white font-bold text-sm">
                  المساعد الذكي
                </h2>
                <p className="text-white/60 text-xs">متصل الآن</p>
              </div>
            </div>

            {/* Messages */}
            <div className="h-[450px] overflow-y-auto p-4 md:p-6 space-y-4 bg-gray-50">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.role === "user"
                        ? "rounded-br-sm text-white"
                        : "rounded-bl-sm"
                    }`}
                    style={{
                      backgroundColor:
                        msg.role === "user" ? "#1d5770" : "#fff",
                      color: msg.role === "user" ? "#fff" : "#12394d",
                      boxShadow:
                        msg.role === "bot"
                          ? "0 1px 3px rgba(0,0,0,0.1)"
                          : "none",
                    }}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {msg.text}
                    </p>

                    {/* Destination Card */}
                    {msg.destination && (
                      <Link
                        href={`/destination/${msg.destination.id}`}
                        className="block mt-3 rounded-xl overflow-hidden border border-gray-200 hover:shadow-md transition-shadow bg-gray-50"
                      >
                        <div className="relative h-32">
                          <Image
                            src={msg.destination.image}
                            alt={msg.destination.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-3">
                          <h4
                            className="font-bold text-sm mb-1"
                            style={{
                              color: "#12394d",
                              fontFamily: "var(--font-display)",
                            }}
                          >
                            {msg.destination.name}
                          </h4>
                          <p
                            className="text-xs line-clamp-2"
                            style={{ color: "#7b7c7d" }}
                          >
                            {msg.destination.description}
                          </p>
                          <span
                            className="inline-block mt-2 text-xs font-semibold"
                            style={{ color: "#1d5770" }}
                          >
                            عرض التفاصيل &larr;
                          </span>
                        </div>
                      </Link>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-end">
                  <div className="bg-white rounded-2xl rounded-bl-sm px-5 py-3 shadow-sm">
                    <div className="flex gap-1.5 items-center">
                      <span
                        className="w-2 h-2 rounded-full animate-bounce"
                        style={{
                          backgroundColor: "#1d5770",
                          animationDelay: "0ms",
                        }}
                      />
                      <span
                        className="w-2 h-2 rounded-full animate-bounce"
                        style={{
                          backgroundColor: "#1d5770",
                          animationDelay: "150ms",
                        }}
                      />
                      <span
                        className="w-2 h-2 rounded-full animate-bounce"
                        style={{
                          backgroundColor: "#1d5770",
                          animationDelay: "300ms",
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Chips */}
            <div className="px-4 py-3 border-t border-gray-100 flex flex-wrap gap-2">
              {QUICK_CHIPS.map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleSend(chip)}
                  className="px-3 py-1.5 rounded-full text-xs border transition-colors hover:text-white"
                  style={{
                    borderColor: "#1d5770",
                    color: "#1d5770",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#1d5770";
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#1d5770";
                  }}
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-gray-200 flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="اكتب سؤالك هنا..."
                className="flex-1 px-4 py-3 rounded-full border border-gray-300 text-sm focus:outline-none focus:border-[#1d5770] transition-colors"
                style={{ color: "#12394d" }}
              />
              <button
                onClick={() => handleSend()}
                className="px-6 py-3 rounded-full text-white text-sm font-semibold transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#91b149" }}
              >
                إرسال
              </button>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="max-w-4xl mx-auto px-4 pb-16">
          <h2
            className="text-2xl font-bold text-center mb-10"
            style={{
              color: "#12394d",
              fontFamily: "var(--font-display)",
            }}
          >
            كيف يعمل المساعد الذكي؟
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "صِف حالتك",
                desc: "أخبرنا عن حالتك الصحية أو نوع البيئة المفضلة لديك.",
              },
              {
                step: "2",
                title: "نحلل احتياجاتك",
                desc: "يقوم النظام بمطابقة احتياجاتك مع قاعدة بيانات الوجهات العلاجية.",
              },
              {
                step: "3",
                title: "نرشح لك الأفضل",
                desc: "نقدم لك وجهة علاجية مناسبة مع تفاصيل كاملة عنها.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="text-center p-6 rounded-2xl bg-white shadow-sm border border-gray-100"
              >
                <span
                  className="inline-flex w-12 h-12 rounded-full items-center justify-center text-white font-bold text-lg mb-4"
                  style={{ backgroundColor: "#1d5770" }}
                >
                  {item.step}
                </span>
                <h3
                  className="font-bold text-lg mb-2"
                  style={{
                    color: "#12394d",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {item.title}
                </h3>
                <p className="text-sm" style={{ color: "#7b7c7d" }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
