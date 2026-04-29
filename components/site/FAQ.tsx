"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "./LocaleProvider";
import { COMMON_EN, BY_DEST_EN } from "@/data/translations/faq.en";

const VOTES_KEY = "waaha_faq_votes";

export interface FAQItem {
  question: string;
  answer: string;
}

interface Props {
  items: FAQItem[];
  title?: string;
  /** Optional destination ID — when set + locale is EN, we substitute
   *  the English FAQ entries from `data/translations/faq.en.ts`.  */
  destId?: string;
}

type Vote = "up" | "down" | undefined;

/**
 * Per-question vote state, keyed by `${pageId}::${question.slice(0,40)}`.
 * Stored locally — there's no analytics backend yet, but the data builds
 * up under a known key so the admin page can later read it and decide
 * which questions need rewriting.
 */
function buildVoteKey(question: string) {
  return `q::${question.slice(0, 80)}`;
}

export default function FAQ({
  items: rawItems,
  title,
  destId,
}: Props) {
  const { locale, t } = useTranslations();
  const resolvedTitle =
    title ?? (locale === "en" ? "Frequently Asked Questions" : "أسئلة شائعة");

  // When the user is browsing in English and we have a destination ID,
  // substitute the EN FAQ list (per-dest + common). Otherwise show the
  // Arabic items the page already passed in.
  const items: FAQItem[] = (() => {
    if (locale !== "en") return rawItems;
    const specific = destId ? BY_DEST_EN[destId] ?? [] : [];
    return [...specific, ...COMMON_EN];
  })();

  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [votes, setVotes] = useState<Record<string, Vote>>(() => {
    if (typeof window === "undefined") return {};
    try {
      const raw = localStorage.getItem(VOTES_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  });

  function castVote(question: string, vote: Vote) {
    const key = buildVoteKey(question);
    setVotes((prev) => {
      const next = { ...prev, [key]: prev[key] === vote ? undefined : vote };
      try {
        localStorage.setItem(VOTES_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }

  return (
    <div className="bg-white dark:bg-[#162033] rounded-2xl border border-[#d0dde4] dark:border-[#1e3a5f] p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-[#e4edf2] dark:bg-[#1e3a5f] flex items-center justify-center text-[#1d5770] dark:text-[#91b149]">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-bold font-display text-[#12394d] dark:text-white">
            {resolvedTitle}
          </h3>
          <p className="text-xs text-[#7b7c7d]">
            {locale === "en"
              ? "Answers to the most common questions"
              : "إجابات على أكثر الأسئلة تكراراً"}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {items.map((item, i) => {
          const isOpen = openIdx === i;
          return (
            <div
              key={i}
              className={`rounded-xl border transition-all duration-300 ${
                isOpen
                  ? "border-[#1d5770]/30 dark:border-[#91b149]/40 bg-[#f5f8fa] dark:bg-[#0a151f]"
                  : "border-[#d0dde4] dark:border-[#1e3a5f] bg-white dark:bg-[#162033] hover:border-[#1d5770]/20 dark:hover:border-[#91b149]/30"
              }`}
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : i)}
                className={`w-full flex items-center justify-between gap-4 px-4 py-3.5 ${locale === "en" ? "text-left" : "text-right"}`}
                aria-expanded={isOpen}
              >
                <span className={`font-bold text-sm text-[#12394d] dark:text-white leading-relaxed flex-1 ${locale === "en" ? "text-left" : "text-right"}`}>
                  {item.question}
                </span>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isOpen
                      ? "bg-[#1d5770] dark:bg-[#91b149] text-white"
                      : "bg-[#e4edf2] dark:bg-[#1e3a5f] text-[#7b7c7d]"
                  }`}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4">
                      <div className="border-t border-[#d0dde4] dark:border-[#1e3a5f] pt-3">
                        <p className="text-sm text-[#12394d]/80 dark:text-white/70 leading-relaxed mb-3">
                          {item.answer}
                        </p>
                        {/* Was this answer helpful? Per-question vote.
                            Helps the team see which answers need rewriting. */}
                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-[#7b7c7d] dark:text-white/50">
                            {locale === "en"
                              ? "Was this answer helpful?"
                              : "هل ساعدتك الإجابة؟"}
                          </span>
                          {(() => {
                            const key = buildVoteKey(item.question);
                            const v = votes[key];
                            return (
                              <>
                                <button
                                  onClick={() => castVote(item.question, "up")}
                                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                                    v === "up"
                                      ? "bg-[#91b149]/20 text-[#91b149]"
                                      : "text-[#7b7c7d] hover:bg-[#91b149]/10 hover:text-[#91b149]"
                                  }`}
                                  aria-pressed={v === "up"}
                                  aria-label={locale === "en" ? "Helpful" : "مفيد"}
                                >
                                  👍 {locale === "en" ? "Helpful" : "مفيد"}
                                </button>
                                <button
                                  onClick={() => castVote(item.question, "down")}
                                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                                    v === "down"
                                      ? "bg-red-500/15 text-red-500"
                                      : "text-[#7b7c7d] hover:bg-red-500/10 hover:text-red-500"
                                  }`}
                                  aria-pressed={v === "down"}
                                  aria-label={locale === "en" ? "Not helpful" : "مش مفيد"}
                                >
                                  👎 {locale === "en" ? "Not helpful" : "مش مفيد"}
                                </button>
                                {v === "up" && (
                                  <span className="text-[10px] text-[#91b149]">
                                    ✓ {locale === "en" ? "Thanks!" : "شكراً!"}
                                  </span>
                                )}
                                {v === "down" && (
                                  <span className="text-[10px] text-red-500">
                                    {locale === "en"
                                      ? "Noted — we'll improve it"
                                      : "لاحظنا — هنحسّنها"}
                                  </span>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Per-destination FAQ library
export function getFAQForDestination(destId: string): FAQItem[] {
  const common: FAQItem[] = [
    {
      question: "هل يمكن لكبار السن الاستفادة من العلاج هنا؟",
      answer:
        "نعم، لكن يُفضل استشارة الطبيب قبل السفر خاصة لمن يعاني من ضغط الدم المرتفع أو أمراض القلب أو السكري. بعض أنواع العلاج (زي الدفن بالرمال الساخنة أو الحمامات عالية الحرارة) ممكن تكون غير مناسبة لبعض الحالات.",
    },
    {
      question: "ما هي التكلفة التقريبية للرحلة العلاجية؟",
      answer:
        "التكلفة تختلف حسب المنتجع والمدة ونوع العلاج والخدمات المطلوبة. للحصول على أسعار محددة ومحدثة، يُنصح بالتواصل مباشرة مع مراكز العلاج المعتمدة في المنطقة. متوسط الرحلة العلاجية عادة يتراوح بين أسبوعين إلى شهر.",
    },
    {
      question: "هل أحتاج تأشيرة أو تصاريح خاصة؟",
      answer:
        "بالنسبة للمواطنين المصريين، لا تحتاج أي تصاريح. الأجانب يحتاجون تأشيرة دخول مصر العادية — والسياحة العلاجية داخلها غير مقيدة بتصاريح إضافية.",
    },
  ];

  const specific: Record<string, FAQItem[]> = {
    safaga: [
      {
        question: "ما هي أفضل مدة للعلاج في سفاجا؟",
        answer:
          "الدراسات تُشير إلى أن فترة من أسبوعين إلى أربعة أسابيع تعطي أفضل النتائج. مرضى الصدفية عادة يلاحظون تحسناً بعد أسبوعين من الجلسات اليومية للشمس والبحر، ويصل التحسن إلى 50% خلال شهر.",
      },
      {
        question: "هل العلاج بالشمس آمن على الجلد؟",
        answer:
          "نعم، لكن لازم يكون تحت إشراف طبي. أفضل أوقات التعرض هي وقت الشروق والغروب (الأشعة طويلة الموجة)، بجلسات تدريجية تبدأ من 10 دقائق وتزيد تدريجياً. استخدام واقي الشمس بالأنف والجفون ضروري.",
      },
      {
        question: "هل يمكن الاستحمام بالرمال السوداء مباشرة؟",
        answer:
          "نعم، لكن الجلسة يجب أن تكون تحت إشراف. المدة المعتادة 15-30 دقيقة فقط، مع شرب الماء بكثرة قبل وبعد الجلسة. الرمال السوداء آمنة لأن النشاط الإشعاعي الطبيعي فيها في نسب منخفضة جداً وآمنة.",
      },
      ...common,
    ],
    siwa: [
      {
        question: "كيف أصل إلى سيوة؟",
        answer:
          "سيوة تبعد حوالي 820 كم عن القاهرة. أقرب مطار هو مطار مرسى مطروح (ساعتين بالسيارة)، ومنه يمكن استئجار سيارة أو أخذ ميكروباص. في وسائل نقل عامة تربط القاهرة بسيوة مباشرة.",
      },
      {
        question: "هل العيون الكبريتية آمنة للجميع؟",
        answer:
          "العيون المعتدلة الحرارة (30-40°م) آمنة لمعظم الناس. لكن العيون الساخنة جداً (زي بئر واحد، 70°م) غير مناسبة للحوامل ومرضى الضغط المرتفع وأمراض القلب. ابدأ دايماً بالعين الباردة ثم الانتقال التدريجي.",
      },
      {
        question: "ما هي خيارات الإقامة في سيوة؟",
        answer:
          "في سيوة فنادق بيئية مبنية من الكرشيف (الملح والطين) زي \"أدريري أمالال\" و\"تاغوزيت\"، بالإضافة لفنادق وبيوت ضيافة عادية. المنتجعات البيئية تقدم تجربة علاجية متكاملة.",
      },
      ...common,
    ],
    sinai: [
      {
        question: "هل الجو في سيناء بارد في الشتاء؟",
        answer:
          "أيوه، خاصة في المناطق الجبلية العالية زي سانت كاترين. الحرارة ممكن تصل لتحت الصفر ليلاً في الشتاء. لكن المناطق الساحلية زي دهب ونويبع الحرارة معتدلة طول العام (15-25°م شتاءً).",
      },
      {
        question: "ما أفضل وقت لزيارة حمام موسى؟",
        answer:
          "أفضل وقت هو من أكتوبر لأبريل، لما الجو معتدل والحرارة مناسبة لجلسات العلاج. الصيف ممكن يكون حار جداً، خاصة في الأيام اللي الحرارة فيها فوق 38°م.",
      },
      {
        question: "هل سرابيط الخادم مفتوحة للسياحة؟",
        answer:
          "نعم، لكنها تتطلب ترتيبات خاصة لأنها منطقة أثرية محمية. يُفضل التواصل مع وزارة الآثار أو المرشدين المحليين قبل الزيارة، ويُنصح بالذهاب مع مجموعة.",
      },
      ...common,
    ],
    fayoum: [
      {
        question: "كم تبعد الفيوم عن القاهرة؟",
        answer:
          "الفيوم تبعد 100 كم فقط عن القاهرة، والرحلة بالسيارة ساعة ونصف تقريباً. ده يخليها من أقرب وأسهل الوجهات العلاجية لسكان القاهرة — مثالية لرحلة نهاية أسبوع.",
      },
      {
        question: "ما هي أفضل الأنشطة في وادي الحيتان؟",
        answer:
          "في وادي الحيتان تقدر تشوف أكتر من 400 حفرية حوت قديمة (تراث يونسكو)، تعمل سفاري صحراوي، تمارس رصد الطيور والنجوم في الليل، وتتمتع بالهواء الجاف النقي اللي بيفيد مرضى الحساسية.",
      },
      {
        question: "هل البحيرة المسحورة آمنة للسباحة؟",
        answer:
          "البحيرة عميقة جداً (35 متر) والسباحة فيها ممنوعة لأسباب السلامة. لكن المنطقة المحيطة بها مثالية للتأمل، المشي، التصوير، والاسترخاء النفسي — وده اللي بيخليها وجهة استشفائية نفسية.",
      },
      ...common,
    ],
    bahariya: [
      {
        question: "ما هي أفضل طريقة لرؤية الصحراء البيضاء؟",
        answer:
          "أفضل طريقة هي عبر رحلة سفاري بسيارة 4x4 مع دليل محلي، ويُنصح بالتخييم ليلة في الصحراء عشان تشوف السماء الصافية والنجوم — ده بيضيف بُعد استشفائي نفسي قوي للرحلة.",
      },
      {
        question: "هل بئر سيجام آمن للاستحمام؟",
        answer:
          "نعم، بئر سيجام (45°م) مناسب لمعظم الناس ويعالج الروماتيزم والتهاب المفاصل. لكن غير مناسب للحوامل ومرضى الضغط المرتفع. يُنصح بجلسات من 15-20 دقيقة، مع شرب المياه قبل وبعد.",
      },
      {
        question: "ما تكلفة رحلة التخييم في الصحراء البيضاء؟",
        answer:
          "التخييم في الصحراء البيضاء ممكن يتراوح بين رحلة بسيطة مع دليل محلي لرحلات VIP مع خدمة متكاملة (طعام بدوي، موسيقى، نار مخيم). للأسعار المحدثة، تواصل مع الدلائل السياحيين المعتمدين.",
      },
      ...common,
    ],
  };

  return specific[destId] || common;
}
