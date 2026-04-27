# Therapy Room Audio Assets

**كل الملفات تحط هنا في `public/meditation/` — والكود يلاقيها أوتوماتيك. مفيش تعديل كود.**

النظام بيشتغل بآلية fallback ذكية:
- لو الملف موجود ✓ → الموقع يستخدمه
- لو مش موجود ✗ → الموقع يستخدم Web Speech (صوت قراءة آلي) للـ VO، وصوت ambient افتراضي من freesound

---

## 📁 البنية

```
public/meditation/
├── vo/         ← الـ voice-overs (صوت المرشد)
├── ambient/    ← المزيكا الخلفية
├── chimes/     ← الأجراس بين الـ phases
└── videos/     ← فيديوهات الخلفية (اختياري)
```

---

## 🎙️ VO Files (`public/meditation/vo/`)

كل ملف اسمه = `id` الكليب من `lib/meditation/sessions.ts` + `.mp3`

### 🌿 Signature Clips (مشتركة بين كل الجلسات)
هي 6 ملفات بتتكرر في أي جلسة:

| الملف | المحتوى | المدة |
|-------|---------|-------|
| `signature__welcome.mp3` | "أهلاً بيك. إنت في واحة دلوقتي. خد نفس. اللحظة دي ليك." | ~14s |
| `signature__breathe-in.mp3` | "شهيق" | ~3s |
| `signature__breathe-hold.mp3` | "إمسك" | ~2s |
| `signature__breathe-out.mp3` | "زفير" | ~3s |
| `signature__closing.mp3` | "خلصنا. افتح عينيك لما تكون جاهز..." | ~10s |
| `signature__thank-you.mp3` | "شكراً إنك أخدت من يومك الوقت ده. جسمك هيشكرك." | ~6s |

### 🎯 Per-Session Clips
كل جلسة من الـ 10 جلسات لها 6-10 كليبات. الـ ids على الـ pattern:
`{session-id}__intro.mp3`, `{session-id}__guide-1.mp3`, `..__guide-2.mp3`, `..__outro.mp3`

**الجلسات:**
- `quick-calm__*` (البداية الهادئة) — 6 ملفات
- `box-focus__*` (تنفس الصندوق) — 6 ملفات
- `sleep-478__*` (4-7-8 للنوم) — 7 ملفات
- `body-scan__*` (مسح الجسد) — 10 ملفات
- `beach-visualization__*` (تخيل الشاطئ) — 7 ملفات
- `desert-silence__*` (صمت الصحراء) — 7 ملفات
- `mountain-focus__*` (التركيز الجبلي) — 7 ملفات
- `gratitude__*` (الامتنان) — 6 ملفات
- `anxiety-release__*` (إطلاق القلق) — 7 ملفات
- `deep-relax__*` (الاسترخاء العميق) — 7 ملفات

**النصوص الكاملة موجودة في `lib/meditation/sessions.ts`** — في حقل `text` لكل clip.

---

## 🎵 Ambient Music (`public/meditation/ambient/`)

ملفات mp3 طويلة (5-15 دقيقة) قابلة للتكرار. بتشتغل خلفية طول الجلسة.

| البيئة | اسم الملف | الموود |
|--------|-----------|--------|
| 🌊 بحر | `ambient__sea__loop.mp3` | أمواج هادية |
| 🌊 بحر-ليلي | `ambient__sea__night.mp3` | أمواج + ريح ليلي |
| 🏜️ صحراء | `ambient__desert__loop.mp3` | ريح صحراوي + سكون |
| ⛰️ جبل | `ambient__mountain__loop.mp3` | ريح + طيور بعيدة |
| 🌴 واحة | `ambient__oasis__loop.mp3` | مياه + شجر + طيور |

---

## 🔔 Chimes (`public/meditation/chimes/`)

ملفات قصيرة (1-3 ثواني) — أجراس/تيبيت بولز:

| الملف | متى يشتغل |
|-------|-----------|
| `chime__session-start.mp3` | أول الجلسة |
| `chime__session-end.mp3` | آخر الجلسة |
| `chime__breath-in.mp3` | بداية الشهيق |
| `chime__breath-out.mp3` | بداية الزفير |
| `chime__milestone.mp3` | عند milestone (كل 10 دورات تنفس مثلاً) |

---

## 🎬 Background Videos (`public/meditation/videos/`)

اختياري — فيديوهات webm هادية بلا صوت تشتغل خلف الواجهة:

| البيئة | اسم الملف |
|--------|-----------|
| بحر | `backdrop__sea.webm` |
| صحراء | `backdrop__desert.webm` |
| جبل | `backdrop__mountain.webm` |
| واحة | `backdrop__oasis.webm` |

---

## 📋 Specs الموصى بيها

### VO
- **Format:** MP3, 96 kbps mono, 44.1kHz sample rate
- **Loudness:** -16 LUFS (متوسط البودكاست)
- **التسجيل:** ميكرفون مكثف (USB كافي)، أوضة هادية، 6 إنش مسافة
- **الإيقاع:** بطيء، مريح، صوت قريب

### Ambient
- **Format:** MP3, 128 kbps stereo, 44.1kHz
- **المدة:** 5-15 دقيقة (الجلسات أقصاها 12 دقيقة)
- **Loop:** لازم يبدأ ويخلص في نفس الـ amplitude عشان اللوب مايبانش
- **Loudness:** -22 LUFS (هادي عشان مايعلوش على الـ VO)

### Chimes
- **Format:** MP3, 128 kbps mono
- **المدة:** 1-3 ثواني، fade-in/fade-out طبيعي
- **التردد:** 432 Hz أو 528 Hz (تيبيت بولز كلاسيكية)

### Videos
- **Format:** WebM (VP9 codec)
- **الدقة:** 1280×720 (720p كافية — backdrop)
- **الـ FPS:** 24-30
- **Loop:** يبدأ ويخلص في نفس الفريم
- **بدون صوت** (الصوت من الـ ambient track)

---

## 🚀 الخطوات بالظبط

1. سجّل/انتج الملفات بأسمائها بالظبط زي اللي فوق
2. حطها في الـ subfolder المناسب
3. `git add public/meditation/`
4. `git commit -m "audio: add therapy room VO + ambient"`
5. `git push`

Vercel هيـ deploy الملفات تلقائياً وتشتغل من غير أي تعديل تاني.

## 💡 Tip: تقدر تبدأ بالـ signature 6 ملفات بس

دي اللي بتسمعها كل جلسة. لو سجلتهم بس، الـ 10 جلسات هتبقى موعدة بصوت أصلي للـ welcome/breathe/closing، والباقي يفضل Web Speech للحين.

أولوية التسجيل:
1. الـ 6 signature
2. `quick-calm__*` (الجلسة الأولى للمستخدم الجديد)
3. الـ 5 ambient tracks (هتأثر تأثير كبير على الإحساس العام)
4. الـ chimes
5. باقي الجلسات حسب الأولوية
