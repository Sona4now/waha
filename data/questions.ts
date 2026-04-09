export type QuestionOption = {
  id: string;
  label: string;
};

export type Question = {
  id: "need" | "environment" | "journeyStyle";
  text: string;
  options: QuestionOption[];
};

export const questions: Question[] = [
  {
    id: "need",
    text: "ما الذي تبحث عنه؟",
    options: [
      { id: "body", label: "راحة جسدية" },
      { id: "mind", label: "صفاء نفسي" },
      { id: "relax", label: "استرخاء" },
    ],
  },
  {
    id: "environment",
    text: "أين تجد راحتك؟",
    options: [
      { id: "sea", label: "البحر" },
      { id: "desert", label: "الصحراء" },
      { id: "mountains", label: "الجبال" },
      { id: "oasis", label: "الواحات" },
    ],
  },
  {
    id: "journeyStyle",
    text: "كيف تتخيّل رحلتك؟",
    options: [
      { id: "calm", label: "هادئة" },
      { id: "exploratory", label: "استكشافية" },
      { id: "deep", label: "عميقة" },
    ],
  },
];
