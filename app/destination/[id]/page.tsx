"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SiteLayout from "@/components/site/SiteLayout";
import { showToast } from "@/components/site/Toast";
import FAQ, { getFAQForDestination } from "@/components/site/FAQ";
import QuickActions from "@/components/site/QuickActions";
import Gallery, { getGalleryForDestination } from "@/components/site/Gallery";
import DayTimeline, {
  getDayForDestination,
} from "@/components/site/DayTimeline";
import WeatherWidget from "@/components/site/WeatherWidget";
import FeedbackWidget from "@/components/site/FeedbackWidget";
import QuickFactsBar from "@/components/destination/QuickFactsBar";
import StickyBottomBar from "@/components/destination/StickyBottomBar";
import SectionNav from "@/components/destination/SectionNav";
import Testimonials from "@/components/destination/Testimonials";
import SmartRelated from "@/components/destination/SmartRelated";
import PricingPackages from "@/components/destination/PricingPackages";
import LeadCaptureForm from "@/components/destination/LeadCaptureForm";
import RelatedArticles from "@/components/destination/RelatedArticles";
import JsonLd from "@/components/site/JsonLd";
import { getDestById } from "@/data/siteData";
import { SITE_URL } from "@/lib/siteMeta";
import { useTranslations } from "@/components/site/LocaleProvider";
import { localizeDestination } from "@/lib/localize";
import {
  destinationSchema,
  breadcrumbSchema,
  faqSchema,
  reviewSchema,
} from "@/lib/structuredData";
import {
  TESTIMONIALS_BY_DEST,
  getDestinationRating,
} from "@/data/testimonials";

type TabDef = { key: string; label: string };

function getBaseTabs(locale: "ar" | "en"): TabDef[] {
  return [
    { key: "overview", label: locale === "en" ? "Overview" : "نبذة" },
    {
      key: "benefits",
      label: locale === "en" ? "Therapeutic Benefits" : "الفوائد العلاجية",
    },
    { key: "timing", label: locale === "en" ? "Best Time" : "أفضل وقت" },
    { key: "why", label: locale === "en" ? "Why here?" : "لماذا هنا؟" },
  ];
}

function getSpecialTab(
  destId: string,
  locale: "ar" | "en",
): TabDef | null {
  switch (destId) {
    case "sinai":
      return {
        key: "sites",
        label: locale === "en" ? "Therapeutic sites" : "المواقع الاستشفائية",
      };
    case "safaga":
      return {
        key: "elements",
        label: locale === "en" ? "Therapeutic elements" : "العناصر العلاجية",
      };
    case "siwa":
      return {
        key: "siwa-sites",
        label: locale === "en" ? "Healing sites" : "مواقع الاستشفاء",
      };
    case "fayoum":
      return {
        key: "fayoum-sites",
        label: locale === "en" ? "Natural sites" : "المواقع الطبيعية",
      };
    case "bahariya":
      return {
        key: "bahariya-sites",
        label: locale === "en" ? "Healing sites" : "مواقع الاستشفاء",
      };
    default:
      return null;
  }
}

/* ─── Sinai Therapeutic Sites Data ─── */
interface TherapeuticSite {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  color: string;
  sections: { title: string; icon: string; content: string[] }[];
  warnings?: string[];
  quickFacts: { label: string; value: string; icon: string }[];
}

const SINAI_SITES: TherapeuticSite[] = [
  {
    id: "wadi-asal",
    name: "وادي عسل",
    subtitle: "البحيرة الكبريتية — رأس سدر",
    icon: "♨️",
    color: "#0e7490",
    sections: [
      {
        title: "النطاق الجغرافي",
        icon: "🗺️",
        content: [
          "موجود جنوب مدينة رأس سدر في جنوب سيناء، حوالي 10 كيلومتر من المدينة، في منطقة صحراوية ساحلية قريبة من خليج السويس.",
          "المكان في مستوى منخفض بسبب الصدوع الجيولوجية التي خلت المياه السخنة تطلع من باطن الأرض.",
          "البيئة صحراوية مكشوفة، اتزرع سور شجري حوالين العين لتوفير جو مناسب للاستشفاء.",
        ],
      },
      {
        title: "المياه الكبريتية",
        icon: "💧",
        content: [
          "المياه طالعة من خزان جوفي عميق جداً، حرارتها حوالي 200 درجة مئوية.",
          "حفرت لنفسها مجرى طبيعي طوله 100 متر، وتتجمع في بحيرة طبيعية مساحتها 150 م² وعمقها مترين.",
          "الحرارة أعلى عند المنبع وتقل في البحيرة، مما يسمح بالاستحمام الآمن.",
        ],
      },
      {
        title: "القيمة العلاجية",
        icon: "🏥",
        content: [
          "الحرارة تساعد على إرخاء العضلات، تخفيف الشد، تحسين الدورة الدموية، وآلام المفاصل والروماتيزم.",
          "الكبريت يُمتص عن طريق الجلد ويعالج الصدفية والإكزيما.",
          "استنشاق البخار يفيد الجهاز التنفسي في حالات الربو والجيوب الأنفية.",
        ],
      },
    ],
    warnings: ["غير مناسب للحوامل", "خطر على مرضى الضغط العالي", "غير مناسب لمرضى الفشل الكلوي"],
    quickFacts: [
      { label: "حرارة المنبع", value: "200°م", icon: "🌡️" },
      { label: "مساحة البحيرة", value: "150 م²", icon: "🏊" },
      { label: "العمق", value: "2 متر", icon: "📏" },
      { label: "التدفق اليومي", value: "20 م³", icon: "💧" },
    ],
  },
  {
    id: "serabit",
    name: "سرابيط الخادم",
    subtitle: "الهضبة الجبلية — جنوب سيناء",
    icon: "⛰️",
    color: "#92400e",
    sections: [
      {
        title: "النطاق الجغرافي",
        icon: "🗺️",
        content: [
          "في قلب جبال جنوب سيناء، على ارتفاع 1100 - 1200 متر فوق سطح البحر.",
          "مناخ جبلي: برد في الشتاء، معتدل في الصيف. الهضبة من حجر رملي وكوارتز، غنية بالفيروز والنحاس.",
        ],
      },
      {
        title: "البيئة الاستشفائية",
        icon: "🧘",
        content: [
          "استشفاء غير مباشر — العزلة والهدوء والبيئة الجبلية.",
          "علاج بالرمال في الصيف لتخفيف آلام الروماتيزم.",
          "غرف ملح من ملح صخري لتحسين التنفس.",
          "معتقدات بدوية عن طاقة أحجار الكوارتز والفيروز.",
        ],
      },
      {
        title: "القيمة التاريخية",
        icon: "🏛️",
        content: [
          "مركز تعدين الفيروز من الأسرة الرابعة في مصر القديمة.",
          "معبد الإلهة حتحور \"سيدة الفيروز\" — مغارات منحوتة ونقوش فريدة.",
          "فيه الأبجدية السينائية الأولية — أقدم نظام كتابة أبجدي معروف وأصل كل الأبجديات.",
        ],
      },
    ],
    quickFacts: [
      { label: "الارتفاع", value: "1,200 م", icon: "🏔️" },
      { label: "الصخور", value: "كوارتز + فيروز", icon: "💎" },
      { label: "التاريخ", value: "الأسرة الرابعة", icon: "🏛️" },
      { label: "أهم اكتشاف", value: "أقدم أبجدية", icon: "✍️" },
    ],
  },
  {
    id: "hammam-musa",
    name: "حمام موسى",
    subtitle: "مدينة الطور — ساحل خليج السويس",
    icon: "♨️",
    color: "#065f46",
    sections: [
      {
        title: "النطاق الجغرافي",
        icon: "🗺️",
        content: [
          "في مدينة الطور على ساحل خليج السويس — بين الجبل والواحة والخليج.",
          "ينابيع مياه كبريتية طبيعية تنبع من تحت الجبل وتصب في أحواض مجهزة.",
          "نقطة جذب رئيسية للسياحة العلاجية في المنطقة.",
        ],
      },
      {
        title: "الخصائص العلاجية",
        icon: "🏥",
        content: [
          "مياه كبريتية دافئة (37°م) متجددة طول العام، غنية بالكبريت والصوديوم والمغنيسيوم والكالسيوم.",
          "علاج الصدفية والإكزيما والروماتيزم وتنشيط الدورة الدموية.",
          "المنطقة غنية بالطحالب المفيدة للبشرة والشعر.",
          "خمس عيون رئيسية تصب في أحواض مجهزة للاستحمام.",
        ],
      },
      {
        title: "القيمة التاريخية",
        icon: "📜",
        content: [
          "مرتبط بالنبي موسى عليه السلام — مرّ بالموقع خلال خروجه من مصر مع بني إسرائيل.",
          "الروايات تقول إن قومه أصيبوا بأمراض جلدية فأرشدهم الله لهذه العيون فاغتسلوا وشُفوا.",
        ],
      },
    ],
    quickFacts: [
      { label: "حرارة المياه", value: "37°م", icon: "🌡️" },
      { label: "عدد العيون", value: "5 عيون", icon: "💧" },
      { label: "المعادن", value: "كبريت + صوديوم", icon: "⚗️" },
      { label: "التدفق", value: "طول العام", icon: "♾️" },
    ],
  },
  {
    id: "uyun-musa",
    name: "عيون موسى",
    subtitle: "ساحل خليج السويس",
    icon: "🌊",
    color: "#1d5770",
    sections: [
      {
        title: "النطاق الجغرافي",
        icon: "🗺️",
        content: [
          "منطقة سياحية وأثرية على ساحل خليج السويس، 35 كم من نفق الشهيد أحمد حمدي.",
          "أول محطة سياحية يراها المسافرون إلى شرم الشيخ.",
        ],
      },
      {
        title: "القيمة التاريخية",
        icon: "📜",
        content: [
          "بعد نجاتهم من فرعون، عانى بنو إسرائيل من العطش فضرب موسى الحجر بعصاه فانفجرت 12 عيناً.",
          "في التوراة ذُكر 12 عين و70 نخلة — ومازالت الـ 70 نخلة موجودة.",
        ],
      },
      {
        title: "جهود الدولة",
        icon: "🏗️",
        content: [
          "تم تطهير 7 عيون وتحليل المياه وتنقيتها وافتتاحها في 10 فبراير 2018.",
          "تحليل المياه أثبت أنها عذبة عن طريق المجلس الأعلى للآثار.",
        ],
      },
    ],
    quickFacts: [
      { label: "عدد العيون", value: "12 عين", icon: "💧" },
      { label: "النخيل", value: "70 نخلة", icon: "🌴" },
      { label: "الافتتاح", value: "2018", icon: "📅" },
      { label: "المسافة", value: "35 كم", icon: "🛣️" },
    ],
  },
];

/* ─── Safaga Therapeutic Elements Data ─── */
interface SafagaElement {
  id: string;
  name: string;
  icon: string;
  color: string;
  content: string[];
}

const SAFAGA_ELEMENTS: SafagaElement[] = [
  {
    id: "geography",
    name: "الموقع الجغرافي",
    icon: "🏔️",
    color: "#0e7490",
    content: [
      "سفاجا محاطة بسلاسل جبال شاهقة تعمل كسياج طبيعي — تمنع الرياح والأتربة والملوثات.",
      "الهواء هناك جاف، نقي جداً، وخالي من الشوائب.",
      "صفاء الجو بيسمح للأشعة فوق البنفسجية توصل بتركيز أعلى وثابت.",
      "العلاج الشمسي (Heliotherapy) في سفاجا أقوى من أماكن ساحلية فيها رطوبة عالية أو ضباب ملحي.",
    ],
  },
  {
    id: "sun",
    name: "الشمس",
    icon: "☀️",
    color: "#d97706",
    content: [
      "سفاجا بتتميز بكثافة أشعة فوق بنفسجية من نوع UVA و UVB — دور مهم في علاج الصدفية.",
      "الشمس بتساعد الجسم يكوّن فيتامين D3 اللي بينظم جهاز المناعة.",
      "أفضل أوقات التعرض: وقت الشروق ووقت الغروب (أشعة طويلة الموجة، أقل ضرراً).",
      "سفاجا فيها سطوع شمسي شبه دائم طول السنة.",
    ],
  },
  {
    id: "sea",
    name: "مياه البحر",
    icon: "🌊",
    color: "#0284c7",
    content: [
      "الخليج مليان جزر وشعاب مرجانية — التيار ضعيف وحركة المياه هادية.",
      "نسبة الملوحة بتوصل لحوالي 35% — رقم عالي جداً.",
      "الجسم بيطفو بسهولة، الضغط على المفاصل بيقل، والإحساس بالألم بيخف.",
      "الدورة الدموية بتتحسن والدم بيوصل للأطراف والجلد بشكل أحسن.",
      "نسبة عنصر السترونشيوم في مياه سفاجا منخفضة — أحد تفسيرات فعاليتها في علاج الصدفية.",
    ],
  },
  {
    id: "sand",
    name: "الرمال السوداء",
    icon: "🏖️",
    color: "#44403c",
    content: [
      "الرمال السوداء غنية بالمعادن وفيها عناصر مشعة طبيعية بنسب آمنة.",
      "العلاج بيتم عن طريق دفن الجسم في الرمال الساخنة لمدة 15 - 30 دقيقة.",
      "الحرارة بتساعد على توسيع الأوعية الدموية، تنشيط الدورة الدموية، تقليل الالتهاب، وتخفيف الألم.",
      "مفيد جداً في حالات الروماتويد، التهاب المفاصل، وآلام العظام.",
    ],
  },
];

const SAFAGA_DISEASES = [
  {
    name: "الصدفية",
    icon: "🩺",
    description: "مرض جلدي سببه خلل في جهاز المناعة — مش معدي ومش مرتبط بالأكل.",
    treatment: "التعرض للشمس مرتين يومياً + نزول البحر بانتظام لمدة أسبوعين لشهر.",
    improvement: "50%",
    warning: "الكورتيزون مش مسموح أثناء العلاج البيئي.",
  },
  {
    name: "الروماتويد",
    icon: "🦴",
    description: "مرض مناعي بيهاجم المفاصل وبيسبب ألم وتورم وتشوه أحياناً.",
    treatment: "الدفن في الرمال الساخنة + جلسات منتظمة لمدة أسبوعين لشهر.",
    improvement: "70-75%",
    warning: "غير مناسب لمرضى القلب والسكر والضغط.",
  },
];

const SAFAGA_CENTERS = [
  { name: "مينا فيل", desc: "رمال سوداء غنية بالمعادن — علاج المفاصل + غوص", icon: "🏨" },
  { name: "خليج أبو سوما", desc: "رمال ناعمة ومياه صافية — العلاج البحري", icon: "🏖️" },
  { name: "لوتس باي", desc: "ملوحة عالية — برامج علاجية بالمياه", icon: "💧" },
];

/* ─── Siwa Therapeutic Sites Data ─── */
const SIWA_SITES: TherapeuticSite[] = [
  {
    id: "ain-birizi",
    name: "العين بريزي",
    subtitle: "الطمي المعدني",
    icon: "♨️",
    color: "#92400e",
    sections: [
      {
        title: "الخصائص",
        icon: "💧",
        content: [
          "مياه كبريتية دافئة + طمي طبيعي غني بالمعادن والحديد.",
          "الفوائد العلاجية: علاج أمراض الجلد وتحسين نضارة البشرة.",
        ],
      },
    ],
    quickFacts: [
      { label: "النوع", value: "كبريتية", icon: "♨️" },
      { label: "الطمي", value: "غني بالحديد", icon: "🧱" },
      { label: "العلاج", value: "أمراض الجلد", icon: "🩺" },
      { label: "البشرة", value: "نضارة", icon: "✨" },
    ],
  },
  {
    id: "bir-wahid",
    name: "بئر واحد",
    subtitle: "العين الساخنة والباردة — التبادل الحراري",
    icon: "🌡️",
    color: "#dc2626",
    sections: [
      {
        title: "الخصائص",
        icon: "💧",
        content: [
          "العين الساخنة: مياه كبريتية حرارية حتى 70°م — استرخاء العضلات وعلاج الروماتيزم.",
          "العين الباردة: بحيرة واسعة للسباحة والاسترخاء النفسي.",
          "التكامل: الانتقال بين الساخنة والباردة يحدث صدمة حرارية تنشط الدورة الدموية.",
        ],
      },
    ],
    quickFacts: [
      { label: "الحرارة", value: "70°م", icon: "🌡️" },
      { label: "التكامل", value: "ساخن + بارد", icon: "🔄" },
      { label: "العلاج", value: "روماتيزم", icon: "🦴" },
      { label: "التأثير", value: "تنشيط الدورة", icon: "❤️" },
    ],
  },
  {
    id: "ain-cleopatra",
    name: "عين كليوباترا",
    subtitle: "عين جوبا — ثقافية واستجمامية",
    icon: "👑",
    color: "#7c3aed",
    sections: [
      {
        title: "الخصائص",
        icon: "💧",
        content: [
          "مياه معدنية وكبريتية مع تباين حراري — باردة صيفاً ودافئة شتاءً.",
          "قرب معبد آمون — ربط الاستشفاء بالقيمة التاريخية.",
          "كانت العروس تستحم فيها قبل الفرح — تقاليد محلية عريقة.",
          "بتساعد على ري النخيل والزيتون القريبة.",
        ],
      },
    ],
    quickFacts: [
      { label: "الحرارة", value: "ثابتة", icon: "🌡️" },
      { label: "التاريخ", value: "معبد آمون", icon: "🏛️" },
      { label: "الاستخدام", value: "سباحة", icon: "🏊" },
      { label: "الطبيعة", value: "معدنية", icon: "⚗️" },
    ],
  },
  {
    id: "salt-lakes",
    name: "بحيرات الملح",
    subtitle: "Thalassotherapy & Halotherapy",
    icon: "🧂",
    color: "#0284c7",
    sections: [
      {
        title: "الخصائص",
        icon: "💧",
        content: [
          "الملوحة تصل لحد 99% — تحتوي على 84 عنصر معدني.",
          "العناصر: المغنيسيوم، البوتاسيوم، الكالسيوم.",
          "الأمراض: الجلدية (صدفية، إكزيما)، آلام المفاصل، تنشيط الدورة الدموية.",
          "العلاج بالطفو: يقلل الضغط على العمود الفقري والمفاصل ويعيد توازن الأملاح.",
        ],
      },
    ],
    quickFacts: [
      { label: "الملوحة", value: "99%", icon: "🧂" },
      { label: "العناصر", value: "84 معدن", icon: "⚗️" },
      { label: "العلاج", value: "بالطفو", icon: "🏊" },
      { label: "الأمراض", value: "جلدية + مفاصل", icon: "🩺" },
    ],
  },
  {
    id: "salt-cave",
    name: "كهف الملح",
    subtitle: "العلاج التنفسي",
    icon: "🫁",
    color: "#065f46",
    sections: [
      {
        title: "الخصائص",
        icon: "💨",
        content: [
          "جزيئات يود وملح صخري — علاج الربو وحساسية الصدر والجيوب الأنفية.",
          "يساعد على توازن الغدة الدرقية.",
          "جلسات زمنية محددة (≈45 دقيقة) مع استرخاء نفسي.",
        ],
      },
    ],
    quickFacts: [
      { label: "المدة", value: "45 دقيقة", icon: "⏱️" },
      { label: "العلاج", value: "تنفسي", icon: "🫁" },
      { label: "المكونات", value: "يود + ملح", icon: "🧂" },
      { label: "الغدة", value: "الدرقية", icon: "⚕️" },
    ],
  },
  {
    id: "dakrour",
    name: "حمامات الرمال — جبل الدكرور",
    subtitle: "العلاج بالدفن في الرمال",
    icon: "🏜️",
    color: "#b45309",
    sections: [
      {
        title: "الخصائص",
        icon: "🏖️",
        content: [
          "دفن جسم المريض في الرمال الساخنة 10-15 دقيقة.",
          "الفوائد: علاج الروماتويد، آلام الظهر والغضاريف والنقرس.",
          "جبل الدكرور يحتفظ بالحرارة مع نشاط إشعاعي منخفض — مثالي للعلاج بالرمل.",
        ],
      },
    ],
    quickFacts: [
      { label: "المدة", value: "10-15 دقيقة", icon: "⏱️" },
      { label: "العلاج", value: "روماتويد", icon: "🦴" },
      { label: "الطريقة", value: "دفن بالرمل", icon: "🏜️" },
      { label: "الإشعاع", value: "منخفض", icon: "☢️" },
    ],
  },
];

const SIWA_QUICK_STATS = [
  { label: "عدد العيون", value: "200", icon: "💧" },
  { label: "عدد الآبار", value: "1,000", icon: "🕳️" },
  { label: "إنتاج المياه", value: "190,000 م³/يوم", icon: "🌊" },
  { label: "مساحة المحمية", value: "7,800 كم²", icon: "🌿" },
  { label: "أنواع النباتات", value: "154 نوع", icon: "🌱" },
  { label: "عدد النخيل", value: "300,000", icon: "🌴" },
];

/* ─── Fayoum Sites Data ─── */
const FAYOUM_SITES: TherapeuticSite[] = [
  {
    id: "wadi-hitan",
    name: "وادي الحيتان",
    subtitle: "تراث عالمي — محمية وادي الريان",
    icon: "🐋",
    color: "#92400e",
    sections: [
      {
        title: "الأهمية العالمية",
        icon: "🌍",
        content: [
          "سجلته اليونسكو في قائمة التراث العالمي عام 2005 — أول موقع طبيعي مصري.",
          "متحف جيولوجي مفتوح — أكثر من 400 حفرية و205 هيكل عظمي كامل.",
          "ساعد العلماء على تتبع تطور الحيتان من ثدييات برية لكائنات بحرية.",
        ],
      },
      {
        title: "التنوع البيولوجي",
        icon: "🦌",
        content: [
          "غزال أبيض ومصري، ثعالب الصحراء، ذئاب، صقر شاهين والصقر الحر.",
          "تضاريس متنوعة: سلاسل جبلية صخرية وتلال رملية — مثالية للرصد الفلكي.",
          "الهواء الجاف يساعد مصابي حساسية الرئة والأمراض التنفسية والروماتيزم.",
        ],
      },
    ],
    quickFacts: [
      { label: "التسجيل", value: "يونسكو 2005", icon: "🏆" },
      { label: "الحفريات", value: "400+", icon: "🦴" },
      { label: "الهياكل", value: "205", icon: "🐋" },
      { label: "البيئة", value: "صحراوية", icon: "🏜️" },
    ],
  },
  {
    id: "uyun-rayan",
    name: "عيون الريان",
    subtitle: "محمية وادي الريان — ينابيع كبريتية",
    icon: "♨️",
    color: "#065f46",
    sections: [
      {
        title: "الينابيع الكبريتية",
        icon: "💧",
        content: [
          "4 ينابيع كبريتية دافئة طبيعية تنبع عبر الصخور.",
          "غنية بكبريتيد الهيدروجين والمغنيسيوم والكالسيوم.",
          "محاطة بغابات نخيل ومراعي خضراء وأكثر من 100 نوع طيور.",
        ],
      },
      {
        title: "الأمراض المعالَجة",
        icon: "🩺",
        content: [
          "الروماتيزم وآلام الظهر والرقبة والمفاصل والانزلاق الغضروفي.",
          "حالات الجلد المزمنة: التهابات، جفاف الجلد، والصدفية.",
          "جلسات علاج طبيعي موسعة لاستفادة العضلات من الاحماء والتوسع الوعائي.",
        ],
      },
    ],
    quickFacts: [
      { label: "العيون", value: "4 ينابيع", icon: "♨️" },
      { label: "المعادن", value: "كبريتيد + كالسيوم", icon: "⚗️" },
      { label: "الطيور", value: "100+ نوع", icon: "🦅" },
      { label: "العلاج", value: "مفاصل + جلد", icon: "🩺" },
    ],
  },
  {
    id: "magic-lake",
    name: "البحيرة المسحورة",
    subtitle: "محمية وادي الريان — استشفاء نفسي",
    icon: "🌈",
    color: "#7c3aed",
    sections: [
      {
        title: "الخصائص",
        icon: "✨",
        content: [
          "بحيرة هادئة بعمق 35 متراً — تتغير ألوان مائها كل ساعة حسب زاوية الشمس.",
          "جبل الدوارة المحيط يحتوي على حُفر طبيعية تسمى \"حفر الملاك\".",
          "منتجع طبيعي مثالي للاسترخاء والتأمل والمشي والتزحلق.",
        ],
      },
      {
        title: "الاستشفاء",
        icon: "🧘",
        content: [
          "مزار مناسب لمن يعانون التوتر اليومي أو مشاكل جلدية بسيطة.",
          "صفاء الجو الصحراوي يجذب الباحثين عن الاسترخاء النفسي.",
        ],
      },
    ],
    quickFacts: [
      { label: "العمق", value: "35 متر", icon: "📏" },
      { label: "الظاهرة", value: "تغيّر الألوان", icon: "🌈" },
      { label: "النوع", value: "استرخاء نفسي", icon: "🧘" },
      { label: "الأنشطة", value: "تأمل + مشي", icon: "🚶" },
    ],
  },
  {
    id: "tunis-village",
    name: "قرية تونس",
    subtitle: "السياحة البيئية والعلاج التقليدي",
    icon: "🏺",
    color: "#b45309",
    sections: [
      {
        title: "البيئة",
        icon: "🌿",
        content: [
          "أراضٍ زراعية خضراء ومنازل من طين الأسواني ونخيل يظللون الطرقات.",
          "نموذج للقرية السياحية المندمجة مع الطبيعة — ورش فخار يدوية تقليدية.",
        ],
      },
      {
        title: "الاستشفاء",
        icon: "🩺",
        content: [
          "تخفيف التوتر الذهني وتحسين المناعة بفضل الهواء وأشعة الشمس.",
          "ممارسات علاجية تقليدية: الحجامة والتدليك الطبيعي لعلاج آلام الظهر والرقبة والعمود الفقري.",
        ],
      },
    ],
    quickFacts: [
      { label: "الطابع", value: "قرية بيئية", icon: "🏡" },
      { label: "الحرف", value: "فخار يدوي", icon: "🏺" },
      { label: "العلاج", value: "حجامة + تدليك", icon: "💆" },
      { label: "الهواء", value: "نقي", icon: "🌬️" },
    ],
  },
];

/* ─── Bahariya Oases Sites Data ─── */
const BAHARIYA_SITES: TherapeuticSite[] = [
  {
    id: "white-desert",
    name: "الصحراء البيضاء",
    subtitle: "محمية طبيعية — تكوينات جيرية وطباشيرية",
    icon: "🏜️",
    color: "#7b7c7d",
    sections: [
      {
        title: "الطبيعة",
        icon: "🌍",
        content: [
          "محمية طبيعية فريدة بتكوينات حجرية منحوتة بفعل الرياح على مدى ملايين السنين — تشبه مناظر كونية.",
          "أنشطة: مشي، تخييم، مراقبة الطبيعة، والتصوير الفوتوغرافي.",
        ],
      },
      {
        title: "الاستشفاء النفسي",
        icon: "🧘",
        content: [
          "الانغماس في البيئة يحفز الشعور بالرهبة (Sense of Awe) — يقلل التوتر والإجهاد النفسي.",
          "يدعم الوعي اللحظي (Mindfulness) وإزالة السموم الرقمية (Digital Detox).",
        ],
      },
    ],
    quickFacts: [
      { label: "النوع", value: "محمية طبيعية", icon: "🌿" },
      { label: "التكوينات", value: "جيرية + طباشيرية", icon: "🪨" },
      { label: "الأنشطة", value: "تخييم + مشي", icon: "⛺" },
      { label: "العلاج", value: "نفسي", icon: "🧘" },
    ],
  },
  {
    id: "black-desert",
    name: "الصحراء السوداء",
    subtitle: "تضاريس بركانية — بازلت وكوارتز",
    icon: "🌑",
    color: "#1e293b",
    sections: [
      {
        title: "الطبيعة",
        icon: "🌋",
        content: [
          "تضاريس بركانية مميزة بصخور البازلت والكوارتز مع تلال وجبال وتنوع جيولوجي واضح.",
        ],
      },
      {
        title: "الاستشفاء",
        icon: "🧘",
        content: [
          "تقليل الضغط العقلي وتعزيز التركيز الذهني والاسترخاء النفسي.",
          "البيئة النقية تتيح الابتعاد عن التلوث والضوضاء — تدعم التعافي من الاحتراق النفسي والإجهاد المزمن.",
        ],
      },
    ],
    quickFacts: [
      { label: "الصخور", value: "بازلت + كوارتز", icon: "🪨" },
      { label: "التأثير", value: "تقليل الضغط", icon: "🧠" },
      { label: "البيئة", value: "نقية وهادئة", icon: "🌬️" },
      { label: "العلاج", value: "احتراق نفسي", icon: "🔥" },
    ],
  },
  {
    id: "crystal-mountain",
    name: "جبل الكريستال",
    subtitle: "متحف طبيعي مفتوح — بلورات كوارتز",
    icon: "💎",
    color: "#7c3aed",
    sections: [
      {
        title: "الخصائص",
        icon: "✨",
        content: [
          "بلورات شفافة من الكوارتز تكشف عن تراكم الرواسب المعدنية والملحية على مدار ملايين السنين.",
          "التأمل في البلورات النادرة يساهم في إعادة التوازن النفسي والعقلي بعد فترات الإجهاد.",
          "يعزز الشعور بالاتصال بالبيئة (Grounding).",
        ],
      },
    ],
    quickFacts: [
      { label: "النوع", value: "كوارتز شفاف", icon: "💎" },
      { label: "العمر", value: "ملايين السنين", icon: "⏳" },
      { label: "العلاج", value: "توازن نفسي", icon: "⚖️" },
      { label: "التقنية", value: "Grounding", icon: "🌍" },
    ],
  },
  {
    id: "gara-cave",
    name: "كهف الجارة",
    subtitle: "تشكيلات صخرية ورسومات العصر الحجري",
    icon: "🕳️",
    color: "#92400e",
    sections: [
      {
        title: "الخصائص",
        icon: "🪨",
        content: [
          "تشكيلات صخرية هابطة وصاعدة تشبه الشلالات الحجرية.",
          "رسومات صخرية تعود للعصر الحجري الحديث.",
        ],
      },
      {
        title: "الاستشفاء",
        icon: "🧘",
        content: [
          "تعزيز التركيز الذهني الكامل والانفصال عن الواقع اليومي.",
          "تحفيز الإثارة المعرفية والجمالية — يدعم التعافي من الاحتراق النفسي.",
        ],
      },
    ],
    quickFacts: [
      { label: "التاريخ", value: "العصر الحجري", icon: "🏛️" },
      { label: "التشكيلات", value: "هابطة + صاعدة", icon: "🪨" },
      { label: "العلاج", value: "تركيز ذهني", icon: "🧠" },
      { label: "التأثير", value: "إثارة معرفية", icon: "💡" },
    ],
  },
  {
    id: "bir-sigam",
    name: "بئر سيجام",
    subtitle: "مياه كبريتية ساخنة ≈45°م",
    icon: "♨️",
    color: "#dc2626",
    sections: [
      {
        title: "الخصائص العلاجية",
        icon: "💧",
        content: [
          "مياه كبريتية ساخنة (≈45°م) لعلاج الروماتيزم والتهاب المفاصل ومشاكل الجهاز الهضمي.",
          "يسهم في الاسترخاء النفسي وتقليل التوتر مع تأثير إيجابي على توازن ميكروبات الأمعاء.",
        ],
      },
    ],
    quickFacts: [
      { label: "الحرارة", value: "45°م", icon: "🌡️" },
      { label: "العلاج", value: "روماتيزم", icon: "🦴" },
      { label: "الهضم", value: "ميكروبيوم", icon: "🦠" },
      { label: "النفسي", value: "استرخاء", icon: "🧘" },
    ],
  },
  {
    id: "sphinx-rock",
    name: "صخرة أبو الهول",
    subtitle: "تشكيل جيولوجي نادر — أيقونة الصحراء",
    icon: "🗿",
    color: "#b45309",
    sections: [
      {
        title: "الاستشفاء",
        icon: "🧠",
        content: [
          "المسار المؤدي للصخرة يتطلب مجهوداً بدنياً (Effort) يتبعه مكافأة بصرية قوية (Reward).",
          "\"حلقة التحدي والمكافأة\" تساعد في تخفيف الاحتراق النفسي وإعادة توجيه الطاقة السلبية.",
        ],
      },
    ],
    quickFacts: [
      { label: "النوع", value: "تشكيل جيولوجي", icon: "🪨" },
      { label: "النحت", value: "عوامل التعرية", icon: "🌬️" },
      { label: "التقنية", value: "Effort-Reward", icon: "🎯" },
      { label: "العلاج", value: "احتراق نفسي", icon: "🔥" },
    ],
  },
  {
    id: "palm-farms",
    name: "مزارع النخيل والنظام الغذائي",
    subtitle: "التطهير الغذائي — Nutritional Detox",
    icon: "🌴",
    color: "#065f46",
    sections: [
      {
        title: "الغذاء العلاجي",
        icon: "🍽️",
        content: [
          "التمور والزيتون وزيت الزيتون والعسل الصحراوي — غذاء طبيعي يدعم الميكروبيوم ويقلل الالتهابات.",
          "التطهير الغذائي (Nutritional Detox): استبدال الأطعمة المصنعة بمكونات طبيعية.",
          "الخبز البدوي (خبز التنور): خالٍ من الخميرة الصناعية — مناسب لمرضى القولون وحساسية الخميرة.",
          "الأعشاب المحلية: الشيح، الحسك، اليانسون الصحراوي — تدعم الاسترخاء والهضم وتهدئة الجهاز العصبي.",
        ],
      },
    ],
    quickFacts: [
      { label: "الغذاء", value: "تمور + زيتون", icon: "🫒" },
      { label: "الخبز", value: "بدوي طبيعي", icon: "🍞" },
      { label: "الأعشاب", value: "شيح + يانسون", icon: "🌿" },
      { label: "العلاج", value: "Detox غذائي", icon: "♻️" },
    ],
  },
  {
    id: "wadi-hiz",
    name: "وادي الحيز",
    subtitle: "قيمة بيئية وأثرية — أقدم كنيسة في الصحراء",
    icon: "⛪",
    color: "#1d5770",
    sections: [
      {
        title: "الخصائص",
        icon: "🏛️",
        content: [
          "جنوب الواحة بحوالي 40-45 كم — منطقة ذات قيمة بيئية وأثرية عالية.",
          "يتميز بوجود أقدم كنيسة في الصحراء الغربية.",
          "من أغنى مناطق زراعة: التمر السيوي والزيتون والرمان.",
        ],
      },
      {
        title: "الاستشفاء",
        icon: "🧘",
        content: [
          "بيئة مثالية للتمارين الخفيفة (تنفس – استطالة).",
          "يمنع الإرهاق الناتج عن الانتقال بين البيئات (Set-Jet Lag).",
          "علاج آلام المفاصل وآلام الظهر والإرهاق العصبي.",
          "الأعشاب الطبية: شيح، كركديه، نعناع بري، حلف بر، سدر.",
        ],
      },
    ],
    quickFacts: [
      { label: "المسافة", value: "40-45 كم", icon: "🛣️" },
      { label: "الأثر", value: "أقدم كنيسة", icon: "⛪" },
      { label: "العلاج", value: "مفاصل + أعصاب", icon: "🦴" },
      { label: "الزراعة", value: "تمر + زيتون", icon: "🌴" },
    ],
  },
];

export default function DestinationDetailPage() {
  const { locale } = useTranslations();
  const params = useParams();
  const id = params?.id as string;
  const rawDest = getDestById(id);
  const dest = rawDest ? localizeDestination(rawDest, locale) : null;
  const [activeTab, setActiveTab] = useState("overview");

  // Track this destination as recently viewed so /destinations can surface
  // a "شفت مؤخراً" rail on next visit. Most-recent-first, max 5.
  useEffect(() => {
    if (!id || typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("waaha_recent_destinations");
      const list: string[] = raw ? JSON.parse(raw) : [];
      const next = [id, ...list.filter((x) => x !== id)].slice(0, 5);
      localStorage.setItem("waaha_recent_destinations", JSON.stringify(next));
    } catch {}
  }, [id]);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title:
            dest?.name ||
            (locale === "en" ? "Therapeutic destination" : "وجهة علاجية"),
          text: dest?.description || "",
          url,
        });
      } catch {
        /* user cancelled */
      }
    } else {
      await navigator.clipboard.writeText(url);
      showToast(
        locale === "en" ? "Link copied!" : "تم نسخ الرابط!",
        "success",
      );
    }
  };

  if (!dest) {
    return (
      <SiteLayout>
        <div
          dir={locale === "en" ? "ltr" : "rtl"}
          className="min-h-screen flex items-center justify-center"
        >
          <div className="text-center">
            <h1
              className="text-3xl font-bold mb-4"
              style={{ color: "#12394d", fontFamily: "var(--font-display)" }}
            >
              {locale === "en" ? "Destination not found" : "الوجهة غير موجودة"}
            </h1>
            <Link
              href="/"
              className="inline-block px-6 py-3 rounded-full text-white"
              style={{ backgroundColor: "#1d5770" }}
            >
              {locale === "en" ? "Back to home" : "العودة للرئيسية"}
            </Link>
          </div>
        </div>
      </SiteLayout>
    );
  }

  const baseTabs = getBaseTabs(locale);
  const specialTab = getSpecialTab(id, locale);
  const TABS = specialTab ? [...baseTabs, specialTab] : baseTabs;
  const [activeSiteId, setActiveSiteId] = useState(SINAI_SITES[0].id);
  const activeSinaiSite = SINAI_SITES.find((s) => s.id === activeSiteId)!;
  const [activeSiwaId, setActiveSiwaId] = useState(SIWA_SITES[0].id);
  const activeSiwaSite = SIWA_SITES.find((s) => s.id === activeSiwaId)!;
  const [activeFayoumId, setActiveFayoumId] = useState(FAYOUM_SITES[0].id);
  const activeFayoumSite = FAYOUM_SITES.find((s) => s.id === activeFayoumId)!;
  const [activeBahariyaId, setActiveBahariyaId] = useState(BAHARIYA_SITES[0].id);
  const activeBahariyaSite = BAHARIYA_SITES.find((s) => s.id === activeBahariyaId)!;

  return (
    <SiteLayout>
      {/* SEO: TouristAttraction + Breadcrumb + FAQ schemas. Even though this
          is a client component, modern Google crawlers run JS and pick up
          JSON-LD rendered after hydration. (For perfect crawler coverage we
          could split data fetching into a server component, but the page is
          1700 lines — diminishing returns vs current setup.) */}
      <JsonLd
        data={[
          // Including aggregateRating with real review count is the
          // single biggest SERP-CTR win available — Google shows
          // ★★★★☆ stars next to the result.
          destinationSchema(dest, getDestinationRating(dest.id)),
          // Per-review schemas for individual quotes
          ...(TESTIMONIALS_BY_DEST[dest.id] ?? []).map((t) =>
            reviewSchema({
              author: t.name,
              rating: t.rating,
              body: t.quote,
              date: t.date ?? "2025-01-01",
              itemName: dest.name,
              itemUrl: `${SITE_URL}/destination/${dest.id}`,
            }),
          ),
          breadcrumbSchema([
            {
              name: locale === "en" ? "Home" : "الرئيسية",
              url: `${SITE_URL}/home`,
            },
            {
              name: locale === "en" ? "Destinations" : "الوجهات",
              url: `${SITE_URL}/destinations`,
            },
            { name: dest.name, url: `${SITE_URL}/destination/${dest.id}` },
          ]),
          faqSchema(getFAQForDestination(dest.id)),
        ]}
      />

      {/* Sticky section navigation — appears on scroll */}
      <SectionNav />
      {/* Floating bottom action bar */}
      <StickyBottomBar destName={dest.name} destId={dest.id} />

      <div dir={locale === "en" ? "ltr" : "rtl"}>
        {/* Hero Section */}
        <section className="relative w-full h-[55vh] min-h-[380px] overflow-hidden">
          <Image
            src={dest.image}
            alt={
              locale === "en"
                ? `${dest.name} — Therapeutic tourism in Egypt — ${dest.description}`
                : `${dest.name} — السياحة الاستشفائية في مصر — ${dest.description}`
            }
            fill
            sizes="100vw"
            className="object-cover scale-105 animate-[kenBurns_16s_ease-out_forwards]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 right-0 left-0 p-6 pb-16 md:p-16 md:pb-24">
            <div className="max-w-6xl mx-auto">
              <span
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm text-white mb-4 font-bold"
                style={{ backgroundColor: "#91b149" }}
              >
                {dest.envIcon} {dest.environment}
              </span>
              <h1
                className="text-4xl md:text-6xl font-bold text-white mb-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {dest.name}
              </h1>
              <p className="text-white/90 text-base md:text-xl max-w-2xl leading-relaxed">
                {dest.description}
              </p>
            </div>
          </div>
        </section>

        {/* Quick Facts Bar — overlaps hero bottom */}
        <QuickFactsBar dest={dest} />

        {/* Main Content */}
        <section id="overview" className="max-w-6xl mx-auto px-4 py-12 pt-8">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Content Area */}
            <div className="flex-1 min-w-0">
              {/* Share Button */}
              <div className="flex justify-end mb-6">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full border-2 transition-colors hover:text-white"
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                  {locale === "en" ? "Share" : "مشاركة"}
                </button>
              </div>

              {/* Tabs */}
              <div className="flex flex-wrap gap-2 mb-8 border-b-2 border-gray-200 pb-1">
                {TABS.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-5 py-3 text-sm md:text-base font-semibold rounded-t-lg transition-colors relative -mb-[3px] ${
                      activeTab === tab.key
                        ? "text-white"
                        : "hover:bg-gray-100"
                    }`}
                    style={{
                      backgroundColor:
                        activeTab === tab.key ? "#1d5770" : "transparent",
                      color: activeTab === tab.key ? "#fff" : "#7b7c7d",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                {activeTab === "overview" && (
                  <div>
                    <h2
                      className="text-2xl font-bold mb-4"
                      style={{
                        color: "#12394d",
                        fontFamily: "var(--font-display)",
                      }}
                    >
                      {locale === "en"
                        ? `About ${dest.name}`
                        : `نبذة عن ${dest.name}`}
                    </h2>
                    <p
                      className="text-lg leading-relaxed"
                      style={{ color: "#7b7c7d" }}
                    >
                      {dest.longDescription}
                    </p>
                  </div>
                )}

                {activeTab === "benefits" && (
                  <div>
                    <h2
                      className="text-2xl font-bold mb-6"
                      style={{
                        color: "#12394d",
                        fontFamily: "var(--font-display)",
                      }}
                    >
                      {locale === "en"
                        ? "Therapeutic Benefits"
                        : "الفوائد العلاجية"}
                    </h2>
                    <ul className="space-y-4">
                      {dest.benefits?.map((benefit: { icon: string; text: string }, i: number) => (
                        <li key={i} className="flex items-start gap-3">
                          <span
                            className="mt-1 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: "#91b149" }}
                          >
                            <svg
                              className="w-3.5 h-3.5 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={3}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </span>
                          <span
                            className="text-base leading-relaxed"
                            style={{ color: "#12394d" }}
                          >
                            {benefit.icon} {benefit.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTab === "timing" && (
                  <div>
                    <h2
                      className="text-2xl font-bold mb-6"
                      style={{
                        color: "#12394d",
                        fontFamily: "var(--font-display)",
                      }}
                    >
                      {locale === "en"
                        ? "Best time to visit"
                        : "أفضل وقت للزيارة"}
                    </h2>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="p-5 rounded-xl bg-green-50 border border-green-200">
                        <h3
                          className="font-bold text-lg mb-3 flex items-center gap-2"
                          style={{ color: "#91b149" }}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {locale === "en" ? "Ideal months" : "الأشهر المثالية"}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {dest.bestMonths?.map(
                            (month: number, i: number) => (
                              <span
                                key={i}
                                className="px-3 py-1.5 rounded-full text-sm text-white font-medium"
                                style={{ backgroundColor: "#91b149" }}
                              >
                                {month}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                      <div className="p-5 rounded-xl bg-amber-50 border border-amber-200">
                        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-600">
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {locale === "en" ? "Acceptable months" : "أشهر مقبولة"}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {dest.okMonths?.map(
                            (month: number, i: number) => (
                              <span
                                key={i}
                                className="px-3 py-1.5 rounded-full text-sm font-medium bg-amber-200 text-amber-800"
                              >
                                {month}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "why" && (
                  <div>
                    <h2
                      className="text-2xl font-bold mb-6"
                      style={{
                        color: "#12394d",
                        fontFamily: "var(--font-display)",
                      }}
                    >
                      {locale === "en"
                        ? `Why ${dest.name}?`
                        : `لماذا ${dest.name}؟`}
                    </h2>
                    <div className="space-y-4">
                      {dest.reasons?.map((reason: string, i: number) => (
                        <div
                          key={i}
                          className="flex items-start gap-4 p-4 rounded-xl bg-gray-50"
                        >
                          <span
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                            style={{ backgroundColor: "#1d5770" }}
                          >
                            {i + 1}
                          </span>
                          <p
                            className="text-base leading-relaxed"
                            style={{ color: "#12394d" }}
                          >
                            {reason}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sinai Therapeutic Sites Tab */}
                {activeTab === "sites" && (
                  <div>
                    <h2
                      className="text-2xl font-bold mb-6"
                      style={{ color: "#12394d", fontFamily: "var(--font-display)" }}
                    >
                      {locale === "en" ? "Therapeutic sites in Sinai" : "المواقع الاستشفائية في سيناء"}
                    </h2>

                    {/* Site Selector Pills */}
                    <div className="flex flex-wrap gap-2 mb-8">
                      {SINAI_SITES.map((site) => (
                        <button
                          key={site.id}
                          onClick={() => setActiveSiteId(site.id)}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 border-2 ${
                            activeSiteId === site.id
                              ? "text-white shadow-md"
                              : "bg-white hover:shadow-sm"
                          }`}
                          style={{
                            borderColor: activeSiteId === site.id ? site.color : "#e5e7eb",
                            backgroundColor: activeSiteId === site.id ? site.color : undefined,
                            color: activeSiteId === site.id ? "#fff" : "#12394d",
                          }}
                        >
                          <span className="text-lg">{site.icon}</span>
                          {site.name}
                        </button>
                      ))}
                    </div>

                    {/* Active Site Content */}
                    <div key={activeSinaiSite.id}>
                      {/* Header */}
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl">{activeSinaiSite.icon}</span>
                        <div>
                          <h3 className="text-xl font-bold font-display" style={{ color: activeSinaiSite.color }}>
                            {activeSinaiSite.name}
                          </h3>
                          <p className="text-sm text-[#7b7c7d]">{activeSinaiSite.subtitle}</p>
                        </div>
                      </div>

                      {/* Quick Facts */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-6">
                        {activeSinaiSite.quickFacts.map((fact) => (
                          <div
                            key={fact.label}
                            className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100"
                          >
                            <span className="text-xl block mb-0.5">{fact.icon}</span>
                            <div className="text-base font-bold text-[#12394d]">{fact.value}</div>
                            <div className="text-[10px] text-[#7b7c7d]">{fact.label}</div>
                          </div>
                        ))}
                      </div>

                      {/* Sections */}
                      <div className="space-y-5">
                        {activeSinaiSite.sections.map((section) => (
                          <div
                            key={section.title}
                            className="rounded-xl border border-gray-100 bg-gray-50 p-5"
                          >
                            <h4
                              className="font-bold font-display text-base mb-3 flex items-center gap-2"
                              style={{ color: activeSinaiSite.color }}
                            >
                              <span>{section.icon}</span>
                              {section.title}
                            </h4>
                            <div className="space-y-2.5">
                              {section.content.map((text, i) => (
                                <div key={i} className="flex gap-2.5">
                                  <span
                                    className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0"
                                    style={{ background: activeSinaiSite.color }}
                                  />
                                  <p className="text-sm text-[#12394d]/80 leading-relaxed">{text}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Warnings */}
                      {activeSinaiSite.warnings && activeSinaiSite.warnings.length > 0 && (
                        <div className="mt-5 bg-red-50 border border-red-200 rounded-xl p-4">
                          <h4 className="font-bold text-red-700 font-display text-sm flex items-center gap-2 mb-2">
                            {locale === "en" ? "⚠️ Important warnings" : "⚠️ تحذيرات مهمة"}
                          </h4>
                          <ul className="space-y-1.5">
                            {activeSinaiSite.warnings.map((w, i) => (
                              <li key={i} className="flex items-center gap-2 text-xs text-red-600">
                                <span className="w-1 h-1 rounded-full bg-red-400" />
                                {w}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Safaga Therapeutic Elements Tab */}
                {activeTab === "elements" && (
                  <div>
                    <h2
                      className="text-2xl font-bold mb-2"
                      style={{ color: "#12394d", fontFamily: "var(--font-display)" }}
                    >
                      {locale === "en" ? "Therapeutic elements in Safaga" : "العناصر العلاجية في سفاجا"}
                    </h2>
                    <p className="text-sm text-[#7b7c7d] mb-8">
                      {locale === "en"
                        ? "A unique natural interaction between location, sun, sea, and sand creates a complete therapeutic system"
                        : "تفاعل طبيعي فريد بين الموقع والشمس والبحر والرمال يخلق منظومة علاجية متكاملة"}
                    </p>

                    {/* 4 Elements Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                      {SAFAGA_ELEMENTS.map((el) => (
                        <div
                          key={el.id}
                          className="rounded-xl border border-gray-100 bg-gray-50 p-5 hover:shadow-md transition-shadow"
                        >
                          <h4
                            className="font-bold font-display text-base mb-3 flex items-center gap-2"
                            style={{ color: el.color }}
                          >
                            <span className="text-xl">{el.icon}</span>
                            {el.name}
                          </h4>
                          <div className="space-y-2">
                            {el.content.map((text, i) => (
                              <div key={i} className="flex gap-2">
                                <span
                                  className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0"
                                  style={{ background: el.color }}
                                />
                                <p className="text-sm text-[#12394d]/80 leading-relaxed">{text}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Diseases Section */}
                    <h3
                      className="text-xl font-bold mb-5 flex items-center gap-2"
                      style={{ color: "#12394d", fontFamily: "var(--font-display)" }}
                    >
                      {locale === "en" ? "🏥 Conditions and treatment in detail" : "🏥 الأمراض والعلاج بالتفصيل"}
                    </h3>
                    <div className="space-y-4 mb-10">
                      {SAFAGA_DISEASES.map((disease) => (
                        <div
                          key={disease.name}
                          className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-2xl">{disease.icon}</span>
                            <h4 className="font-bold font-display text-lg text-[#12394d]">
                              {disease.name}
                            </h4>
                            <span className="mr-auto px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                              {locale === "en" ? "Improvement rate:" : "نسبة التحسن:"} {disease.improvement}
                            </span>
                          </div>
                          <p className="text-sm text-[#7b7c7d] mb-3">{disease.description}</p>
                          <div className="bg-[#f5f8fa] rounded-lg p-3 mb-3">
                            <p className="text-sm text-[#12394d]">
                              <span className="font-bold text-[#1d5770]">{locale === "en" ? "Treatment plan:" : "نظام العلاج:"}</span> {disease.treatment}
                            </p>
                          </div>
                          <div className="bg-red-50 rounded-lg p-3">
                            <p className="text-xs text-red-600 flex items-center gap-1.5">
                              <span>⚠️</span> {disease.warning}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Treatment Centers */}
                    <h3
                      className="text-xl font-bold mb-5 flex items-center gap-2"
                      style={{ color: "#12394d", fontFamily: "var(--font-display)" }}
                    >
                      {locale === "en" ? "🏨 Most popular healing centers" : "🏨 أشهر أماكن الاستشفاء"}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
                      {SAFAGA_CENTERS.map((center) => (
                        <div
                          key={center.name}
                          className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center"
                        >
                          <span className="text-3xl block mb-2">{center.icon}</span>
                          <h4 className="font-bold text-[#12394d] mb-1">{center.name}</h4>
                          <p className="text-xs text-[#7b7c7d]">{center.desc}</p>
                        </div>
                      ))}
                    </div>

                    {/* Best Time & Mental Health */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-200">
                        <h4 className="font-bold font-display text-base text-amber-700 mb-3 flex items-center gap-2">
                          {locale === "en" ? "📅 Best time for treatment" : "📅 أنسب وقت للعلاج"}
                        </h4>
                        <p className="text-2xl font-bold text-[#12394d] mb-2">
                          {locale === "en" ? "May to September" : "شهر 5 لشهر 9"}
                        </p>
                        <div className="space-y-1 text-sm text-[#7b7c7d]">
                          <p>{locale === "en" ? "• Stable sunshine" : "• الشمس مستقرة"}</p>
                          <p>{locale === "en" ? "• Dry weather" : "• الجو جاف"}</p>
                          <p>{locale === "en" ? "• Low humidity" : "• نسبة الرطوبة قليلة"}</p>
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-5 border border-teal-200">
                        <h4 className="font-bold font-display text-base text-teal-700 mb-3 flex items-center gap-2">
                          {locale === "en" ? "🧘 Mental wellness" : "🧘 الاستشفاء النفسي"}
                        </h4>
                        <p className="text-sm text-[#7b7c7d] mb-2">
                          {locale === "en" ? "The calm there helps with:" : "الهدوء هناك بيساعد على:"}
                        </p>
                        <div className="space-y-1 text-sm text-[#12394d]">
                          <p>{locale === "en" ? "• Meditation" : "• التأمل"}</p>
                          <p>{locale === "en" ? "• Breathing exercises" : "• تمارين التنفس"}</p>
                          <p>{locale === "en" ? "• Stress relief (Mental Detox)" : "• التخلص من التوتر (Mental Detox)"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Siwa Therapeutic Sites Tab */}
                {activeTab === "siwa-sites" && (
                  <div>
                    <h2 className="text-2xl font-bold mb-2" style={{ color: "#12394d", fontFamily: "var(--font-display)" }}>
                      {locale === "en" ? "Healing sites in Siwa" : "مواقع الاستشفاء في سيوة"}
                    </h2>
                    <p className="text-sm text-[#7b7c7d] mb-6">
                      {locale === "en"
                        ? "Siwa Oasis — 18 meters below sea level — combines water resources, geological formations, and cultural heritage"
                        : "واحة سيوة — 18 متر تحت مستوى البحر — تجمع بين الموارد المائية والتكوينات الجيولوجية والتراث الثقافي"}
                    </p>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-8">
                      {SIWA_QUICK_STATS.map((s) => (
                        <div key={s.label} className="bg-[#f5f8fa] rounded-lg p-3 text-center border border-gray-100">
                          <span className="text-lg block">{s.icon}</span>
                          <div className="text-sm font-bold text-[#12394d]">{s.value}</div>
                          <div className="text-[9px] text-[#7b7c7d]">{s.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Site Selector */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {SIWA_SITES.map((site) => (
                        <button
                          key={site.id}
                          onClick={() => setActiveSiwaId(site.id)}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all border-2 ${
                            activeSiwaId === site.id ? "text-white shadow-md" : "bg-white"
                          }`}
                          style={{
                            borderColor: activeSiwaId === site.id ? site.color : "#e5e7eb",
                            backgroundColor: activeSiwaId === site.id ? site.color : undefined,
                            color: activeSiwaId === site.id ? "#fff" : "#12394d",
                          }}
                        >
                          <span>{site.icon}</span>
                          {site.name}
                        </button>
                      ))}
                    </div>

                    {/* Active Site */}
                    <div key={activeSiwaSite.id}>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl">{activeSiwaSite.icon}</span>
                        <div>
                          <h3 className="font-bold font-display text-lg" style={{ color: activeSiwaSite.color }}>{activeSiwaSite.name}</h3>
                          <p className="text-xs text-[#7b7c7d]">{activeSiwaSite.subtitle}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-5">
                        {activeSiwaSite.quickFacts.map((f) => (
                          <div key={f.label} className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100">
                            <span className="text-lg block">{f.icon}</span>
                            <div className="text-sm font-bold text-[#12394d]">{f.value}</div>
                            <div className="text-[9px] text-[#7b7c7d]">{f.label}</div>
                          </div>
                        ))}
                      </div>
                      {activeSiwaSite.sections.map((sec) => (
                        <div key={sec.title} className="rounded-xl border border-gray-100 bg-gray-50 p-5 mb-3">
                          <h4 className="font-bold font-display text-base mb-3 flex items-center gap-2" style={{ color: activeSiwaSite.color }}>
                            <span>{sec.icon}</span>{sec.title}
                          </h4>
                          <div className="space-y-2">
                            {sec.content.map((t, i) => (
                              <div key={i} className="flex gap-2">
                                <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: activeSiwaSite.color }} />
                                <p className="text-sm text-[#12394d]/80 leading-relaxed">{t}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Fayoum Sites Tab */}
                {activeTab === "fayoum-sites" && (
                  <div>
                    <h2 className="text-2xl font-bold mb-2" style={{ color: "#12394d", fontFamily: "var(--font-display)" }}>
                      {locale === "en" ? "Natural sites in Fayoum" : "المواقع الطبيعية في الفيوم"}
                    </h2>
                    <p className="text-sm text-[#7b7c7d] mb-6">
                      {locale === "en"
                        ? "A strategic geographic advantage — close to Cairo with unique ecological diversity that combines treatment and ecotourism"
                        : "ميزة جغرافية استراتيجية — قريبة من القاهرة مع تنوع بيئي فريد يجمع بين العلاج والسياحة البيئية"}
                    </p>

                    {/* Site Selector */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {FAYOUM_SITES.map((site) => (
                        <button
                          key={site.id}
                          onClick={() => setActiveFayoumId(site.id)}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all border-2 ${
                            activeFayoumId === site.id ? "text-white shadow-md" : "bg-white"
                          }`}
                          style={{
                            borderColor: activeFayoumId === site.id ? site.color : "#e5e7eb",
                            backgroundColor: activeFayoumId === site.id ? site.color : undefined,
                            color: activeFayoumId === site.id ? "#fff" : "#12394d",
                          }}
                        >
                          <span>{site.icon}</span>
                          {site.name}
                        </button>
                      ))}
                    </div>

                    {/* Active Site */}
                    <div key={activeFayoumSite.id}>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl">{activeFayoumSite.icon}</span>
                        <div>
                          <h3 className="font-bold font-display text-lg" style={{ color: activeFayoumSite.color }}>{activeFayoumSite.name}</h3>
                          <p className="text-xs text-[#7b7c7d]">{activeFayoumSite.subtitle}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-5">
                        {activeFayoumSite.quickFacts.map((f) => (
                          <div key={f.label} className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100">
                            <span className="text-lg block">{f.icon}</span>
                            <div className="text-sm font-bold text-[#12394d]">{f.value}</div>
                            <div className="text-[9px] text-[#7b7c7d]">{f.label}</div>
                          </div>
                        ))}
                      </div>
                      {activeFayoumSite.sections.map((sec) => (
                        <div key={sec.title} className="rounded-xl border border-gray-100 bg-gray-50 p-5 mb-3">
                          <h4 className="font-bold font-display text-base mb-3 flex items-center gap-2" style={{ color: activeFayoumSite.color }}>
                            <span>{sec.icon}</span>{sec.title}
                          </h4>
                          <div className="space-y-2">
                            {sec.content.map((t, i) => (
                              <div key={i} className="flex gap-2">
                                <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: activeFayoumSite.color }} />
                                <p className="text-sm text-[#12394d]/80 leading-relaxed">{t}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bahariya Sites Tab */}
                {activeTab === "bahariya-sites" && (
                  <div>
                    <h2 className="text-2xl font-bold mb-2" style={{ color: "#12394d", fontFamily: "var(--font-display)" }}>
                      {locale === "en" ? "Healing sites in Bahariya Oasis" : "مواقع الاستشفاء في الواحات البحرية"}
                    </h2>
                    <p className="text-sm text-[#7b7c7d] mb-6">
                      {locale === "en"
                        ? "White and black desert, hot springs, caves, crystal mountains, and a therapeutic diet"
                        : "صحراء بيضاء وسوداء، ينابيع حارة، كهوف، جبال كريستال، ونظام غذائي علاجي"}
                    </p>

                    {/* Site Selector */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {BAHARIYA_SITES.map((site) => (
                        <button
                          key={site.id}
                          onClick={() => setActiveBahariyaId(site.id)}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all border-2 ${
                            activeBahariyaId === site.id ? "text-white shadow-md" : "bg-white"
                          }`}
                          style={{
                            borderColor: activeBahariyaId === site.id ? site.color : "#e5e7eb",
                            backgroundColor: activeBahariyaId === site.id ? site.color : undefined,
                            color: activeBahariyaId === site.id ? "#fff" : "#12394d",
                          }}
                        >
                          <span>{site.icon}</span>
                          {site.name}
                        </button>
                      ))}
                    </div>

                    {/* Active Site */}
                    <div key={activeBahariyaSite.id}>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl">{activeBahariyaSite.icon}</span>
                        <div>
                          <h3 className="font-bold font-display text-lg" style={{ color: activeBahariyaSite.color }}>{activeBahariyaSite.name}</h3>
                          <p className="text-xs text-[#7b7c7d]">{activeBahariyaSite.subtitle}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-5">
                        {activeBahariyaSite.quickFacts.map((f) => (
                          <div key={f.label} className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100">
                            <span className="text-lg block">{f.icon}</span>
                            <div className="text-sm font-bold text-[#12394d]">{f.value}</div>
                            <div className="text-[9px] text-[#7b7c7d]">{f.label}</div>
                          </div>
                        ))}
                      </div>
                      {activeBahariyaSite.sections.map((sec) => (
                        <div key={sec.title} className="rounded-xl border border-gray-100 bg-gray-50 p-5 mb-3">
                          <h4 className="font-bold font-display text-base mb-3 flex items-center gap-2" style={{ color: activeBahariyaSite.color }}>
                            <span>{sec.icon}</span>{sec.title}
                          </h4>
                          <div className="space-y-2">
                            {sec.content.map((t, i) => (
                              <div key={i} className="flex gap-2">
                                <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: activeBahariyaSite.color }} />
                                <p className="text-sm text-[#12394d]/80 leading-relaxed">{t}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="w-full lg:w-80 flex-shrink-0 space-y-4 lg:sticky lg:top-24 self-start">
              {/* Quick Actions */}
              <QuickActions destination={dest} />

              <div
                className="rounded-2xl p-6 text-white"
                style={{ backgroundColor: "#12394d" }}
              >
                <h3
                  className="text-xl font-bold mb-5 border-b border-white/20 pb-3"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {locale === "en" ? "Quick info" : "معلومات سريعة"}
                </h3>

                <div className="space-y-4">
                  <div>
                    <span className="text-white/60 text-sm block mb-1">
                      {locale === "en" ? "Environment" : "البيئة"}
                    </span>
                    <span
                      className="inline-block px-3 py-1 rounded-full text-sm font-medium"
                      style={{ backgroundColor: "#91b149" }}
                    >
                      {dest.environment}
                    </span>
                  </div>

                  <div>
                    <span className="text-white/60 text-sm block mb-1">
                      {locale === "en" ? "Available treatments" : "العلاجات المتاحة"}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {dest.treatments?.map(
                        (treatment: string, i: number) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-full text-xs border border-white/30"
                          >
                            {treatment}
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  {dest.trustSignal && (
                    <div className="mt-4 p-3 rounded-lg bg-white/10">
                      <span className="text-white/60 text-sm block mb-1">
                        {locale === "en" ? "Trusted source" : "مصدر موثوق"}
                      </span>
                      <p className="text-sm leading-relaxed">
                        {dest.trustSignal}
                      </p>
                    </div>
                  )}
                </div>

                <Link
                  href="/ai-guide"
                  className="block w-full mt-6 py-3 text-center rounded-full font-semibold transition-colors"
                  style={{ backgroundColor: "#91b149" }}
                >
                  {locale === "en" ? "Ask the AI assistant" : "اسأل المساعد الذكي"}
                </Link>
              </div>
            </aside>
          </div>
        </section>

        {/* Day in the Life */}
        <section
          id="day"
          className="py-16 bg-gradient-to-b from-white to-[#f5f8fa] dark:from-[#0d1b2a] dark:to-[#0a151f]"
        >
          <div className="max-w-5xl mx-auto px-4">
            <DayTimeline
              steps={getDayForDestination(dest.id, locale)}
              destinationName={dest.name}
            />
          </div>
        </section>

        {/* Weather (timing) */}
        <section id="timing" className="py-16 bg-[#f5f8fa] dark:bg-[#0a151f]">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6">
            <WeatherWidget destId={dest.id} destName={dest.name} />
            <div id="gallery">
              <Gallery
                images={getGalleryForDestination(dest.id)}
                title={locale === "en" ? `${dest.name} photo gallery` : `معرض صور ${dest.name}`}
              />
            </div>
          </div>
        </section>

        {/* Testimonials — social proof */}
        <Testimonials destId={dest.id} destName={dest.name} />

        {/* Pricing packages — tied into the lead form via #lead-capture */}
        <PricingPackages
          destinationId={dest.id}
          destinationName={dest.name}
          bookCtaTarget="#lead-capture"
        />

        {/* Lead capture — conversion CTA. WhatsApp deep-link, no backend. */}
        <section
          id="lead-capture"
          className="py-12 md:py-16 bg-[#f5f8fa] dark:bg-[#0a151f]"
        >
          <div className="max-w-3xl mx-auto px-4">
            <LeadCaptureForm
              destinationId={dest.id}
              destinationName={dest.name}
            />
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-16 bg-white dark:bg-[#0d1b2a]">
          <div className="max-w-4xl mx-auto px-4">
            <FAQ
              destId={dest.id}
              items={getFAQForDestination(dest.id)}
              title={locale === "en" ? `Frequently asked questions about ${dest.name}` : `أسئلة شائعة عن ${dest.name}`}
            />
            <FeedbackWidget pageId={`dest-${dest.id}`} pageTitle={dest.name} />
          </div>
        </section>

        {/* Articles that mention this destination — internal SEO linking */}
        <RelatedArticles destinationId={dest.id} destinationName={dest.name} />

        {/* Smart Related Destinations */}
        <SmartRelated currentDest={dest} />
      </div>
    </SiteLayout>
  );
}
