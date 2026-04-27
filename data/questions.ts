export type QuestionOption = {
  id: string;
  label: string;
  /** Optional English label — falls back to `label` if not provided. */
  labelEn?: string;
};

export type Question = {
  id: "need" | "environment" | "journeyStyle";
  text: string;
  /** Optional English text — falls back to `text` if not provided. */
  textEn?: string;
  options: QuestionOption[];
};

export const questions: Question[] = [
  {
    id: "need",
    text: "ما الذي تبحث عنه؟",
    textEn: "What are you looking for?",
    options: [
      { id: "body", label: "راحة جسدية", labelEn: "Physical relief" },
      { id: "mind", label: "صفاء نفسي", labelEn: "Mental clarity" },
      { id: "relax", label: "استرخاء", labelEn: "Relaxation" },
    ],
  },
  {
    id: "environment",
    text: "أين تجد راحتك؟",
    textEn: "Where do you find peace?",
    options: [
      { id: "sea", label: "البحر", labelEn: "The sea" },
      { id: "desert", label: "الصحراء", labelEn: "The desert" },
      { id: "mountains", label: "الجبال", labelEn: "The mountains" },
      { id: "oasis", label: "الواحات", labelEn: "The oases" },
    ],
  },
  {
    id: "journeyStyle",
    text: "كيف تتخيّل رحلتك؟",
    textEn: "How do you imagine your journey?",
    options: [
      { id: "calm", label: "هادئة", labelEn: "Calm" },
      { id: "exploratory", label: "استكشافية", labelEn: "Exploratory" },
      { id: "deep", label: "عميقة", labelEn: "Deep" },
    ],
  },
];

/**
 * Localised view of a Question — picks the English text/labels when
 * locale is "en", otherwise returns the original Arabic source.
 */
export function localizeQuestion(q: Question, locale: "ar" | "en"): Question {
  if (locale !== "en") return q;
  return {
    ...q,
    text: q.textEn ?? q.text,
    options: q.options.map((o) => ({
      ...o,
      label: o.labelEn ?? o.label,
    })),
  };
}
