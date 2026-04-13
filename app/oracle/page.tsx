"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { DESTINATIONS } from "@/data/siteData";

/* ═══════════════════════════════════════════════
   ORACLE DATA
   ═══════════════════════════════════════════════ */

const HIEROGLYPHS = "𓀀𓀁𓀂𓀃𓀄𓀅𓀆𓀇𓀈𓀉𓀊𓀋𓀌𓀍𓀎𓀏𓁀𓁁𓁂𓁃𓁄𓁅𓁆𓁇𓁈𓁉𓁊𓁋𓁌𓁍𓁎𓁏𓂀𓂁𓂂𓂃𓂄𓂅𓂆𓂇𓃀𓃁𓃂𓃃𓃄𓃅𓃆𓃇𓃈𓃉𓃊𓃋𓄀𓄁𓄂𓄃𓄄𓅀𓅁𓅂𓅃𓅄𓅅𓅆𓅇𓅈𓅉𓆀𓆁𓆂𓆃𓆄𓆅𓆆𓆇𓆈𓆉𓆊";

const QUESTIONS = [
  {
    id: "pain",
    text: "ما الألمُ الذي يُثقِلُ جسدَك؟",
    options: [
      { label: "عظامي ومفاصلي تئن", value: "joints", icon: "𓂀" },
      { label: "جلدي يحترق ويتألم", value: "skin", icon: "𓁀" },
      { label: "صدري ضيق والهواء ثقيل", value: "chest", icon: "𓃀" },
      { label: "روحي مُتعبة وأعصابي مشدودة", value: "stress", icon: "𓅀" },
    ],
  },
  {
    id: "element",
    text: "أيُّ عنصرٍ يجذبُ روحَك؟",
    options: [
      { label: "الماء — أمواج البحر تناديني", value: "water", icon: "𓇳" },
      { label: "الرمال — دفء الصحراء يحتويني", value: "sand", icon: "𓇯" },
      { label: "الهواء — نسيم الجبال ينعشني", value: "air", icon: "𓇲" },
      { label: "الخضرة — الطبيعة تُعيد توازني", value: "green", icon: "𓆰" },
    ],
  },
  {
    id: "seeking",
    text: "ما الذي تبحثُ عنه في نهاية الطريق؟",
    options: [
      { label: "الشفاء — أريد جسداً بلا ألم", value: "healing", icon: "𓋹" },
      { label: "السكينة — أريد سلاماً داخلياً", value: "peace", icon: "𓁐" },
      { label: "القوة — أريد أن أعود أقوى", value: "strength", icon: "𓄂" },
      { label: "التجدد — أريد بداية جديدة", value: "renewal", icon: "𓇼" },
    ],
  },
];

/* ── Prophecy generator ── */
function generateProphecy(answers: Record<string, string>) {
  const scores: Record<string, number> = {};
  DESTINATIONS.forEach((d) => (scores[d.id] = 0));

  // Pain mapping
  const painMap: Record<string, string[]> = {
    joints: ["مفاصل"],
    skin: ["جلد"],
    chest: ["تنفس"],
    stress: ["توتر", "استرخاء"],
  };
  (painMap[answers.pain] || []).forEach((t) => {
    DESTINATIONS.forEach((d) => {
      if (d.treatments.includes(t)) scores[d.id] += 35;
    });
  });

  // Element mapping
  const elemMap: Record<string, string[]> = {
    water: ["safaga"],
    sand: ["siwa", "bahariya"],
    air: ["sinai"],
    green: ["fayoum", "siwa"],
  };
  (elemMap[answers.element] || []).forEach((id) => {
    if (scores[id] !== undefined) scores[id] += 30;
  });

  // Seeking bonus
  const seekMap: Record<string, Record<string, number>> = {
    healing: { safaga: 20, bahariya: 15, siwa: 10 },
    peace: { siwa: 20, fayoum: 15, sinai: 10 },
    strength: { sinai: 20, bahariya: 15, safaga: 10 },
    renewal: { fayoum: 20, siwa: 15, bahariya: 10 },
  };
  const seeking = seekMap[answers.seeking] || {};
  Object.entries(seeking).forEach(([id, bonus]) => {
    if (scores[id] !== undefined) scores[id] += bonus;
  });

  const sorted = DESTINATIONS.map((d) => ({
    dest: d,
    score: scores[d.id],
  })).sort((a, b) => b.score - a.score);

  const top = sorted[0];
  const max = Math.max(...sorted.map((s) => s.score), 1);
  const percent = Math.round((top.score / max) * 100);

  // Prophecy texts per destination
  const prophecies: Record<string, { opening: string; body: string; closing: string }> = {
    safaga: {
      opening: "البحرُ الأحمرُ يهمسُ باسمِك منذُ الأزل...",
      body: "رمالُ سفاجا السوداءُ ستمتصُّ الألمَ من عظامِك، ومياهُها المعدنيةُ ستغسلُ ما أثقلَ جسدَك. الشمسُ هناك ليست كأيّ شمس — إنها شمسُ الشفاء التي عرفها الفراعنةُ قبلَ آلافِ السنين.",
      closing: "في الأسبوع الثاني، ستشعرُ بجسدٍ لم تعرفهُ من قبل.",
    },
    siwa: {
      opening: "واحةٌ نائيةٌ في قلبِ الصحراء تنتظرُ قُدومَك...",
      body: "عيونُ سيوة الكبريتيةُ تحملُ سرَّ الأرضِ القديم. الصمتُ هناك ليس فراغاً — بل هو لغةُ الشفاءِ التي نسيها العالم. ستغوصُ في مياهٍ ساخنةٍ عمرُها آلافُ السنين، وستخرجُ بروحٍ جديدة.",
      closing: "من يذهبُ إلى سيوة مُتعَباً... يعودُ منها إنساناً آخر.",
    },
    sinai: {
      opening: "الجبالُ المقدسةُ تُناديك من عَلِ...",
      body: "في سيناء، حيثُ التقت السماءُ بالأرض، ستجدُ هواءً لم تتنفسهُ من قبل. الأعشابُ البريةُ والينابيعُ الساخنةُ ستُعيد لجسدِك القوةَ التي سُلبت منه. حمامُ موسى ينتظرُك بمياهٍ تشفي منذُ آلافِ السنين.",
      closing: "من يصعدُ جبالَ سيناء ضعيفاً... ينزلُ منها عملاقاً.",
    },
    fayoum: {
      opening: "بحيرةٌ ساحرةٌ تعكسُ صورةَ روحِك...",
      body: "الفيومُ واحةٌ خضراءُ على بُعدِ ساعةٍ من صخبِ القاهرة. بحيرةُ قارون ستُعيد لروحِك التوازنَ الذي فقدتَه، والهواءُ النقيُّ سيغسلُ رئتيك من سمومِ المدينة. وادي الحيتان سيُذكّرك أنّ الطبيعةَ أقوى من كلِّ شيء.",
      closing: "في الفيوم ستتذكرُ كيف يبدو السلامُ الحقيقي.",
    },
    bahariya: {
      opening: "الصحراءُ البيضاءُ تُضيءُ لك الطريق...",
      body: "في الواحاتِ البحرية، حيثُ الرمالُ أصبحت فنّاً، ستجدُ ينابيعَ ساخنةً تُذيبُ التوترَ من كلِّ خليةٍ في جسدك. الدفنُ في الرمالِ الدافئة — علاجٌ فرعونيٌّ قديم — سيُعيدُ لعظامِك ما أخذهُ منها الزمن.",
      closing: "تحت نجومِ الصحراءِ البيضاء، ستعرفُ معنى أن تكون حُرّاً.",
    },
  };

  const prophecy = prophecies[top.dest.id] || prophecies.safaga;
  const bestMonth = top.dest.bestMonths[0];
  const monthNames = ["", "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

  return {
    dest: top.dest,
    percent,
    prophecy,
    bestMonth: monthNames[bestMonth] || "أكتوبر",
    allScores: sorted.map((s) => ({
      ...s,
      percent: Math.round((s.score / max) * 100),
    })),
  };
}

/* ═══════════════════════════════════════════════
   HIEROGLYPH RAIN (background effect)
   ═══════════════════════════════════════════════ */
function HieroglyphRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const w = (canvas.width = window.innerWidth);
    const h = (canvas.height = window.innerHeight);
    const chars = Array.from(HIEROGLYPHS);
    const columns = Math.floor(w / 28);
    const drops = Array.from({ length: columns }, () => Math.random() * -50);

    let frame: number;
    const animate = () => {
      ctx.fillStyle = "rgba(10, 8, 5, 0.06)";
      ctx.fillRect(0, 0, w, h);

      ctx.font = "18px serif";

      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * 28;
        const alpha = 0.08 + Math.random() * 0.12;
        ctx.fillStyle = `rgba(198, 168, 103, ${alpha})`;
        ctx.fillText(char, x, y);

        if (y > h && Math.random() > 0.98) {
          drops[i] = -20;
        }
        drops[i] += 0.4 + Math.random() * 0.3;
      });

      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-60" />;
}

/* ═══════════════════════════════════════════════
   FIRE TORCH
   ═══════════════════════════════════════════════ */
function Torch({ side }: { side: "left" | "right" }) {
  return (
    <div
      className={`fixed top-1/3 ${side === "left" ? "left-4 sm:left-10" : "right-4 sm:right-10"} z-20 pointer-events-none`}
    >
      <div className="relative">
        {/* Torch base */}
        <div className="w-3 h-20 bg-gradient-to-t from-[#5c3a1e] to-[#8b6914] rounded-b-sm mx-auto" />
        {/* Fire */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2">
          <motion.div
            animate={{
              scale: [1, 1.2, 0.9, 1.15, 1],
              opacity: [0.8, 1, 0.7, 0.95, 0.8],
            }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="w-6 h-10 rounded-full bg-gradient-to-t from-[#ff6b00] via-[#ff9500] to-[#ffcc00] blur-[2px]"
          />
          <motion.div
            animate={{
              scale: [0.8, 1.1, 0.85, 1.05, 0.8],
              y: [0, -3, 0, -2, 0],
            }}
            transition={{ duration: 0.6, repeat: Infinity }}
            className="absolute inset-0 w-4 h-8 mx-auto rounded-full bg-gradient-to-t from-[#ff9500] to-[#fff4cc] blur-[1px]"
          />
          {/* Glow */}
          <div className="absolute -inset-8 rounded-full bg-[#ff9500]/20 blur-xl" />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   FLOATING HIEROGLYPHS (orbiting)
   ═══════════════════════════════════════════════ */
function FloatingHieroglyphs() {
  const chars = Array.from(HIEROGLYPHS).slice(0, 20);
  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {chars.map((char, i) => (
        <motion.div
          key={i}
          initial={{
            x: `${30 + Math.random() * 40}vw`,
            y: `${20 + Math.random() * 60}vh`,
            opacity: 0,
          }}
          animate={{
            x: [
              `${30 + Math.random() * 40}vw`,
              `${20 + Math.random() * 60}vw`,
              `${30 + Math.random() * 40}vw`,
            ],
            y: [
              `${20 + Math.random() * 60}vh`,
              `${10 + Math.random() * 70}vh`,
              `${20 + Math.random() * 60}vh`,
            ],
            opacity: [0, 0.15, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            delay: i * 0.8,
            ease: "linear",
          }}
          className="absolute text-[#c6a867]/30 text-3xl sm:text-4xl"
        >
          {char}
        </motion.div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   PAPYRUS SCROLL (result)
   ═══════════════════════════════════════════════ */
function PapyrusScroll({
  result,
  userName,
  onRestart,
}: {
  result: ReturnType<typeof generateProphecy>;
  userName: string;
  onRestart: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative z-30 w-full max-w-lg mx-auto px-4"
    >
      {/* Papyrus texture container */}
      <motion.div
        initial={{ scaleY: 0, originY: 0.5 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        <div
          className="rounded-2xl p-6 sm:p-8 border-2 border-[#c6a867]/30 shadow-[0_0_80px_rgba(198,168,103,0.15)]"
          style={{
            background: "linear-gradient(135deg, #2a1f0e 0%, #1a1308 30%, #231a0b 70%, #2a1f0e 100%)",
          }}
        >
          {/* Decorative top border */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#c6a867]/40 to-transparent" />
            <span className="text-[#c6a867]/60 text-xs">𓂀</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#c6a867]/40 to-transparent" />
          </div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            className="text-center mb-6"
          >
            <div className="text-[#c6a867]/40 text-lg tracking-[0.5em] mb-1">
              𓋹 𓂀 𓋹
            </div>
            <h2
              className="text-2xl sm:text-3xl font-black text-[#c6a867] mb-1"
              style={{ fontFamily: "Reem Kufi, serif" }}
            >
              نبوءة الفرعون
            </h2>
            <p className="text-[#c6a867]/40 text-xs">
              لـ {userName || "طالب الشفاء"}
            </p>
          </motion.div>

          {/* Prophecy text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
            className="space-y-4 mb-8"
          >
            <p
              className="text-[#c6a867]/80 text-sm sm:text-base leading-loose text-center italic"
              style={{ fontFamily: "Reem Kufi, serif" }}
            >
              "{result.prophecy.opening}"
            </p>
            <p className="text-[#c6a867]/60 text-sm leading-loose text-center">
              {result.prophecy.body}
            </p>
            <p
              className="text-[#c6a867]/90 text-sm sm:text-base leading-loose text-center font-bold"
              style={{ fontFamily: "Reem Kufi, serif" }}
            >
              "{result.prophecy.closing}"
            </p>
          </motion.div>

          {/* Destination card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5 }}
            className="bg-[#c6a867]/10 border border-[#c6a867]/20 rounded-xl p-5 mb-6"
          >
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl mb-1">{result.dest.envIcon}</div>
                <div className="text-[#c6a867] font-bold text-lg" style={{ fontFamily: "Reem Kufi, serif" }}>
                  {result.dest.name}
                </div>
                <div className="text-[#c6a867]/40 text-[10px]">وجهتك المقدّرة</div>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-[#c6a867] font-bold text-xl">{result.percent}%</span>
                  <div className="text-[#c6a867]/40 text-[10px]">نسبة التوافق</div>
                </div>
                <div>
                  <span className="text-[#c6a867]/80 text-sm font-bold">{result.bestMonth}</span>
                  <div className="text-[#c6a867]/40 text-[10px]">أفضل موعد</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Score bars */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3 }}
            className="space-y-2 mb-6"
          >
            {result.allScores.slice(0, 5).map((s, i) => (
              <div key={s.dest.id} className="flex items-center gap-2">
                <span className="text-sm w-6 text-center">{s.dest.envIcon}</span>
                <span className="text-[#c6a867]/60 text-[11px] w-20 truncate">{s.dest.name}</span>
                <div className="flex-1 h-1.5 bg-[#c6a867]/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${s.percent}%` }}
                    transition={{ delay: 3.2 + i * 0.15, duration: 0.8 }}
                    className={`h-full rounded-full ${i === 0 ? "bg-[#c6a867]" : "bg-[#c6a867]/30"}`}
                  />
                </div>
                <span className="text-[#c6a867]/40 text-[10px] w-8 text-left font-mono">{s.percent}%</span>
              </div>
            ))}
          </motion.div>

          {/* Decorative bottom */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#c6a867]/40 to-transparent" />
            <span className="text-[#c6a867]/40 text-[10px] tracking-widest">𓇳 WAHA ORACLE 𓇳</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#c6a867]/40 to-transparent" />
          </div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.5 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Link
              href={`/destination/${result.dest.id}`}
              className="flex-1 text-center py-3 bg-gradient-to-l from-[#c6a867] to-[#a08535] text-[#1a1308] font-bold rounded-full no-underline text-sm hover:shadow-[0_8px_24px_rgba(198,168,103,0.4)] transition-shadow"
            >
              اكتشف {result.dest.name} ←
            </Link>
            <button
              onClick={onRestart}
              className="flex-1 py-3 bg-[#c6a867]/10 hover:bg-[#c6a867]/20 text-[#c6a867] font-bold rounded-full text-sm border border-[#c6a867]/20 transition-colors"
            >
              أعد النبوءة
            </button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN PAGE — THE ORACLE
   ═══════════════════════════════════════════════ */

type Stage = "intro" | "doors" | "fire" | "priest" | "question" | "generating" | "prophecy";

export default function OraclePage() {
  const [stage, setStage] = useState<Stage>("intro");
  const [questionIdx, setQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<ReturnType<typeof generateProphecy> | null>(null);
  const [userName, setUserName] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Play ambient drums
  useEffect(() => {
    if (stage === "intro") return;
    try {
      const audio = new Audio("https://cdn.freesound.org/previews/382/382735_7108286-lq.mp3");
      audio.loop = true;
      audio.volume = 0.15;
      audio.play().catch(() => {});
      audioRef.current = audio;
    } catch {}
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, [stage !== "intro"]);

  // Stage transitions
  const startJourney = useCallback(() => {
    setStage("doors");
    setTimeout(() => setStage("fire"), 3500);
    setTimeout(() => setStage("priest"), 5500);
    setTimeout(() => setStage("question"), 8000);
  }, []);

  const handleAnswer = useCallback(
    (value: string) => {
      const q = QUESTIONS[questionIdx];
      const newAnswers = { ...answers, [q.id]: value };
      setAnswers(newAnswers);

      if (questionIdx < QUESTIONS.length - 1) {
        setTimeout(() => setQuestionIdx((i) => i + 1), 600);
      } else {
        // Generate prophecy
        setStage("generating");
        setTimeout(() => {
          setResult(generateProphecy(newAnswers));
          setStage("prophecy");
        }, 4000);
      }
    },
    [questionIdx, answers],
  );

  const restart = useCallback(() => {
    setStage("intro");
    setQuestionIdx(0);
    setAnswers({});
    setResult(null);
    setUserName("");
  }, []);

  return (
    <div className="fixed inset-0 bg-[#0a0805] text-white overflow-y-auto" dir="rtl">
      <HieroglyphRain />

      {stage !== "intro" && stage !== "prophecy" && (
        <>
          <FloatingHieroglyphs />
          <Torch side="left" />
          <Torch side="right" />
        </>
      )}

      {/* ── INTRO ── */}
      <AnimatePresence mode="wait">
        {stage === "intro" && (
          <motion.div
            key="intro"
            exit={{ opacity: 0 }}
            className="relative z-30 min-h-screen flex flex-col items-center justify-center px-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5 }}
              className="text-center"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-6xl sm:text-8xl mb-6"
              >
                𓂀
              </motion.div>
              <h1
                className="text-3xl sm:text-5xl font-black text-[#c6a867] mb-4"
                style={{ fontFamily: "Reem Kufi, serif" }}
              >
                نبوءة الفرعون
              </h1>
              <p className="text-[#c6a867]/50 text-sm sm:text-base max-w-md mx-auto mb-8 leading-relaxed">
                ادخل المعبد القديم... واكتشف ما كتبته لك الآلهة في طريق الشفاء
              </p>

              {/* Name input */}
              <div className="mb-6">
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="اسمك (اختياري)"
                  className="w-48 text-center px-4 py-2.5 bg-[#c6a867]/10 border border-[#c6a867]/20 rounded-full text-[#c6a867] text-sm placeholder:text-[#c6a867]/30 outline-none focus:border-[#c6a867]/50 transition-colors"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startJourney}
                className="px-10 py-4 bg-gradient-to-l from-[#c6a867] to-[#a08535] text-[#1a1308] font-bold rounded-full text-sm shadow-[0_0_40px_rgba(198,168,103,0.3)] hover:shadow-[0_0_60px_rgba(198,168,103,0.5)] transition-shadow"
              >
                ادخل المعبد 𓉔
              </motion.button>
            </motion.div>

            <Link
              href="/home"
              className="absolute bottom-8 text-[#c6a867]/20 hover:text-[#c6a867]/40 text-xs no-underline transition-colors"
            >
              ← العودة
            </Link>
          </motion.div>
        )}

        {/* ── DOORS OPENING ── */}
        {stage === "doors" && (
          <motion.div
            key="doors"
            className="relative z-30 fixed inset-0 flex items-center justify-center overflow-hidden"
          >
            {/* Left door */}
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: "-100%" }}
              transition={{ duration: 3, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-0 top-0 w-1/2 h-full"
              style={{
                background: "linear-gradient(90deg, #1a1308 0%, #2a1f0e 80%, #3a2a15 100%)",
                borderRight: "3px solid #c6a86730",
              }}
            >
              <div className="h-full flex items-center justify-end pr-8">
                <div className="text-[#c6a867]/20 text-4xl sm:text-6xl space-y-4">
                  {["𓁀", "𓃀", "𓅀", "𓆰"].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.3 }}
                      transition={{ delay: i * 0.3 }}
                    >
                      {h}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right door */}
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: "100%" }}
              transition={{ duration: 3, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 top-0 w-1/2 h-full"
              style={{
                background: "linear-gradient(-90deg, #1a1308 0%, #2a1f0e 80%, #3a2a15 100%)",
                borderLeft: "3px solid #c6a86730",
              }}
            >
              <div className="h-full flex items-center justify-start pl-8">
                <div className="text-[#c6a867]/20 text-4xl sm:text-6xl space-y-4">
                  {["𓋹", "𓂀", "𓇳", "𓄂"].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.3 }}
                      transition={{ delay: i * 0.3 }}
                    >
                      {h}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Light beam from center */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 1, duration: 2 }}
              className="absolute w-2 h-full bg-gradient-to-b from-transparent via-[#c6a867]/30 to-transparent"
            />
          </motion.div>
        )}

        {/* ── FIRE LIGHTING ── */}
        {stage === "fire" && (
          <motion.div
            key="fire"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-30 fixed inset-0 flex items-center justify-center"
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[#c6a867]/60 text-lg sm:text-xl text-center"
              style={{ fontFamily: "Reem Kufi, serif" }}
            >
              تشتعلُ مشاعلُ المعرفة...
            </motion.p>
          </motion.div>
        )}

        {/* ── PRIEST INTRO ── */}
        {stage === "priest" && (
          <motion.div
            key="priest"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-30 fixed inset-0 flex flex-col items-center justify-center px-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="text-6xl mb-6"
            >
              𓁐
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-[#c6a867]/80 text-lg sm:text-xl text-center leading-relaxed max-w-md"
              style={{ fontFamily: "Reem Kufi, serif" }}
            >
              أنا كاهنُ الاستشفاء...
              <br />
              أجب عن ثلاثةِ أسئلةٍ لأكشفَ لك طريقَ الشفاء
            </motion.p>
          </motion.div>
        )}

        {/* ── QUESTIONS ── */}
        {stage === "question" && (
          <motion.div
            key={`q-${questionIdx}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="relative z-30 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6"
          >
            {/* Progress */}
            <div className="flex gap-3 mb-8">
              {QUESTIONS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all duration-700 ${
                    i < questionIdx
                      ? "w-10 bg-[#c6a867]"
                      : i === questionIdx
                        ? "w-10 bg-[#c6a867]/50"
                        : "w-5 bg-[#c6a867]/15"
                  }`}
                />
              ))}
            </div>

            {/* Question */}
            <div className="text-[#c6a867]/40 text-xs mb-3 tracking-widest">
              السؤال {questionIdx + 1} من {QUESTIONS.length}
            </div>
            <h2
              className="text-xl sm:text-2xl font-bold text-[#c6a867] text-center mb-10 max-w-md"
              style={{ fontFamily: "Reem Kufi, serif" }}
            >
              {QUESTIONS[questionIdx].text}
            </h2>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
              {QUESTIONS[questionIdx].options.map((opt, i) => (
                <motion.button
                  key={opt.value}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleAnswer(opt.value)}
                  className="flex items-center gap-3 p-4 bg-[#c6a867]/5 hover:bg-[#c6a867]/15 border border-[#c6a867]/15 hover:border-[#c6a867]/40 rounded-xl transition-all text-right"
                >
                  <span className="text-2xl flex-shrink-0 w-10 text-center opacity-50">
                    {opt.icon}
                  </span>
                  <span className="text-[#c6a867]/80 text-sm font-bold leading-snug">
                    {opt.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── GENERATING ── */}
        {stage === "generating" && (
          <motion.div
            key="generating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-30 fixed inset-0 flex flex-col items-center justify-center px-6"
          >
            {/* Spinning hieroglyphs */}
            <div className="relative w-40 h-40 mb-8">
              {Array.from(HIEROGLYPHS)
                .slice(0, 12)
                .map((char, i) => (
                  <motion.span
                    key={i}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear", delay: i * 0.1 }}
                    className="absolute text-[#c6a867]/30 text-2xl"
                    style={{
                      top: `${50 + 45 * Math.sin((i / 12) * Math.PI * 2)}%`,
                      left: `${50 + 45 * Math.cos((i / 12) * Math.PI * 2)}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 border border-[#c6a867]/20 rounded-full"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.span
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-4xl"
                >
                  𓂀
                </motion.span>
              </div>
            </div>

            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-[#c6a867]/60 text-base sm:text-lg text-center"
              style={{ fontFamily: "Reem Kufi, serif" }}
            >
              الآلهةُ تتأملُ في مسارِك...
            </motion.p>
          </motion.div>
        )}

        {/* ── PROPHECY RESULT ── */}
        {stage === "prophecy" && result && (
          <motion.div
            key="prophecy"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-30 min-h-screen flex items-center justify-center py-16"
          >
            <PapyrusScroll result={result} userName={userName} onRestart={restart} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
