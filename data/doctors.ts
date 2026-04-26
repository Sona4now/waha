/**
 * Doctor & specialist directory.
 *
 * IMPORTANT: This data is currently illustrative/placeholder. Replace with
 * real names + valid phone numbers + correct credentials before promoting
 * the /doctors page publicly. The structure is final; only the values need
 * to be swapped.
 *
 * Each doctor is tied to one or more `specialties` that match the
 * `treatments` array on destinations, so we can show "أطباء يوصون بهذا
 * العلاج" cross-links from destination pages later.
 */

export interface Doctor {
  id: string;
  name: string;
  /** e.g. "استشاري" or "دكتور" */
  title: string;
  /** Comma-separated short subtitle for cards. */
  subtitle: string;
  specialties: string[];
  city: string;
  /** ISO 639-1 codes — used to filter for English-speaking patients. */
  languages: string[];
  /** Years of experience. */
  experience: number;
  /** Credentials / certifications shown as small chips. */
  credentials: string[];
  /** Hospitals or clinics they're affiliated with. */
  affiliations: string[];
  /** Bio — 1-2 paragraphs. */
  bio: string;
  /** Conditions they treat that overlap with healing tourism. */
  conditions: string[];
  /** Contact — phone is the primary channel for the Egyptian market. */
  phone?: string;
  /** When set, the WhatsApp deep-link is preferred over a tel: link. */
  whatsapp?: string;
  /** Stock or licensed photo URL. */
  photo: string;
  /** Optional consultation fee range (in EGP). */
  consultationFee?: string;
}

export const DOCTORS: Doctor[] = [
  {
    id: "ahmed-sherif",
    name: "د. أحمد شريف",
    title: "استشاري الأمراض الجلدية",
    subtitle: "متخصص في الصدفية والإكزيما المزمنة",
    specialties: ["جلد", "صدفية", "إكزيما"],
    city: "القاهرة",
    languages: ["ar", "en"],
    experience: 18,
    credentials: ["MD جامعة القاهرة", "FRCP لندن", "زميل الجمعية الأوروبية للجلدية"],
    affiliations: ["مستشفى السلام الدولي", "عيادة المعادي للجلدية"],
    bio: "د. أحمد متخصص في علاج الصدفية والأمراض الجلدية المزمنة بمنهج يدمج الطب الحديث مع العلاج البيئي. عنده خبرة 18 سنة، وبيتعاون مع مراكز سفاجا ابتداءً من 2014 لتقييم المرضى قبل وبعد البرنامج العلاجي.",
    conditions: ["الصدفية", "الإكزيما", "حب الشباب الكيستي", "الأمراض الجلدية المزمنة"],
    phone: "+20 100 123 4567",
    whatsapp: "201001234567",
    photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=80",
    consultationFee: "من 800 ج",
  },
  {
    id: "mona-abdelraouf",
    name: "د. منى عبد الرؤوف",
    title: "استشارية الروماتيزم والمناعة",
    subtitle: "علاج التهاب المفاصل + متابعة بعد العلاج الطبيعي",
    specialties: ["مفاصل", "روماتيزم", "ألم مزمن"],
    city: "الإسكندرية",
    languages: ["ar", "en", "fr"],
    experience: 22,
    credentials: ["MD جامعة الإسكندرية", "زميل الجمعية الأمريكية للروماتيزم"],
    affiliations: ["مستشفى الإسكندرية الجامعي", "مركز سما للمفاصل"],
    bio: "متخصصة في التهابات المفاصل الروماتويدية والفيبروميالجيا. أبحاثها المنشورة في مجلة Lancet ركزت على تأثير العلاج بالمياه الكبريتية على مرضى الروماتويد المزمن. بتشرف على برامج علاجية في سيوة وحلوان.",
    conditions: ["الروماتويد", "خشونة المفاصل", "الفيبروميالجيا", "ألم العمود الفقري"],
    phone: "+20 100 234 5678",
    whatsapp: "201002345678",
    photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80",
    consultationFee: "من 1,000 ج",
  },
  {
    id: "khaled-mansour",
    name: "د. خالد منصور",
    title: "استشاري الصدر والحساسية",
    subtitle: "ربو، التهاب الشعب الهوائية، حساسية تنفسية",
    specialties: ["تنفس", "ربو", "حساسية"],
    city: "القاهرة",
    languages: ["ar", "en"],
    experience: 15,
    credentials: ["MD جامعة عين شمس", "Fellow ATS", "DM علم الأدوية"],
    affiliations: ["مستشفى الدكتور خالد التخصصي", "عيادة العباسية"],
    bio: "متخصص في التحكم بالربو والحساسيات التنفسية المزمنة. بيرشّح المرضى لجلسات الاستشفاء بالملح في سيوة + المناخ الجبلي في سيناء كجزء من خطة علاج طويلة المدى.",
    conditions: ["الربو", "التهاب الشعب الهوائية", "الحساسية الموسمية", "انقطاع النفس"],
    phone: "+20 100 345 6789",
    whatsapp: "201003456789",
    photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80",
    consultationFee: "من 700 ج",
  },
  {
    id: "nada-elsayed",
    name: "د. ندى السيد",
    title: "استشارية الطب النفسي",
    subtitle: "اكتئاب، قلق، حالات الإرهاق المزمن",
    specialties: ["استرخاء", "توتر", "صحة نفسية"],
    city: "القاهرة",
    languages: ["ar", "en"],
    experience: 12,
    credentials: ["MD جامعة القاهرة", "Diploma in Psychotherapy KCL"],
    affiliations: ["The Center للصحة النفسية", "عيادة ندى السيد"],
    bio: "تركز أبحاثها على Eco-therapy ودور البيئات الطبيعية في علاج الاكتئاب الموسمي وحالات الإرهاق المهني. بترشّح بانتظام لخلوات في الواحات والصحراء البيضاء كجزء من خطة العلاج.",
    conditions: ["الاكتئاب", "اضطراب القلق", "الإرهاق المهني", "أرق مزمن", "PTSD"],
    phone: "+20 100 456 7890",
    whatsapp: "201004567890",
    photo: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&q=80",
    consultationFee: "من 1,200 ج",
  },
  {
    id: "tarek-helal",
    name: "د. طارق هلال",
    title: "استشاري الطب الطبيعي والعلاج التأهيلي",
    subtitle: "تأهيل بعد الإصابات + علاج الألم المزمن",
    specialties: ["مفاصل", "إصابات", "تأهيل"],
    city: "الجيزة",
    languages: ["ar"],
    experience: 25,
    credentials: ["MD جامعة عين شمس", "PhD في الطب الطبيعي", "زميل الجمعية الدولية للعلاج المائي"],
    affiliations: ["مركز الجيزة للعلاج الطبيعي", "مستشفى المعادي العسكري"],
    bio: "خبرة 25 سنة في العلاج الطبيعي والتأهيل. بيشرف على برامج إعادة التأهيل بعد الإصابات الرياضية في مراكز سفاجا، وله أبحاث على البلنيولوجيا (العلاج بالمياه المعدنية) منشورة دولياً.",
    conditions: ["إصابات الرياضة", "آلام أسفل الظهر", "بعد جراحة العظام", "خشونة الركبة"],
    phone: "+20 100 567 8901",
    whatsapp: "201005678901",
    photo: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&q=80",
    consultationFee: "من 600 ج",
  },
  {
    id: "rania-fawzy",
    name: "د. رانيا فوزي",
    title: "استشارية أمراض الباطنة والتغذية العلاجية",
    subtitle: "سكر، ضغط، متلازمات استقلابية",
    specialties: ["تغذية", "سكر", "ضغط"],
    city: "القاهرة",
    languages: ["ar", "en"],
    experience: 16,
    credentials: ["MD جامعة عين شمس", "MSc Clinical Nutrition", "Fellow IDF"],
    affiliations: ["مستشفى الكلى التخصصي", "عيادة Wellness بالمعادي"],
    bio: "تربط بين العلاج الدوائي للأمراض المزمنة (السكر والضغط) والعلاج بالنمط الحياتي. بترشّح برامج صيام متقطع + هايكنج في وادي دجلة والفيوم كأدوات مساعدة لتحسين المؤشرات الاستقلابية.",
    conditions: ["السكر النوع 2", "متلازمة التمثيل الغذائي", "السمنة", "الكولسترول"],
    phone: "+20 100 678 9012",
    whatsapp: "201006789012",
    photo: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&q=80",
    consultationFee: "من 900 ج",
  },
  {
    id: "ali-elfar",
    name: "د. علي الفار",
    title: "استشاري طب الأسرة",
    subtitle: "تقييم اللياقة قبل البرنامج العلاجي",
    specialties: ["تقييم عام", "وقاية"],
    city: "القاهرة",
    languages: ["ar", "en"],
    experience: 20,
    credentials: ["MD MRCGP", "Diploma بريطاني في الطب الرياضي"],
    affiliations: ["عيادة الفار الطبية", "نادي القاهرة للسلامة"],
    bio: "متخصص في تقييم اللياقة الطبية قبل السفر العلاجي — مهم خاصة لمرضى الضغط والقلب والكبار في السن. بيقدّم تقرير طبي شامل قبل بدء أي برنامج استشفائي.",
    conditions: ["تقييم لياقة طبية", "متابعة بعد البرنامج", "وصفات شاملة"],
    phone: "+20 100 789 0123",
    whatsapp: "201007890123",
    photo: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&q=80",
    consultationFee: "من 500 ج",
  },
  {
    id: "salma-eid",
    name: "د. سلمى عيد",
    title: "أخصائية أول الأمراض الجلدية والتجميل الطبي",
    subtitle: "علاج الإكزيما + تجديد البشرة بالعلاج الطبيعي",
    specialties: ["جلد", "تجميل طبي"],
    city: "الغردقة",
    languages: ["ar", "en", "ru"],
    experience: 10,
    credentials: ["MD جامعة عين شمس", "Diploma EADV"],
    affiliations: ["مركز الغردقة للجلدية", "عيادة Coral Reef الطبية"],
    bio: "بتمارس على البحر الأحمر، فبتقدر تتابع المرضى بشكل مباشر أثناء برامج العلاج بالشمس والملح. تتحدث الروسية فبتقدّم خدمة لمجتمع السياحة الطبية الروسي في الغردقة.",
    conditions: ["الإكزيما", "البهاق", "أمراض الشعر", "تجديد البشرة"],
    phone: "+20 100 890 1234",
    whatsapp: "201008901234",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
    consultationFee: "من 700 ج",
  },
];

/** Filter doctors by specialty (used for cross-linking from destinations). */
export function getDoctorsForSpecialty(specialty: string): Doctor[] {
  const norm = specialty.toLowerCase().trim();
  return DOCTORS.filter((d) =>
    d.specialties.some((s) => s.toLowerCase().includes(norm)),
  );
}

export const DOCTOR_SPECIALTIES = [
  "جلد",
  "مفاصل",
  "تنفس",
  "صحة نفسية",
  "تغذية",
  "تأهيل",
  "تقييم عام",
];
