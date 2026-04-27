# 🎬 Cinematic Intro — Scripts للتسجيل

كل clip فيه: اسم الملف + النص بالعربي + النص بالإنجليزي + توصية للأداء.

النظام **bilingual**: تسجل كل clip مرتين — عربي وإنجليزي. الموقع يختار النسخة المناسبة حسب اللغة المختارة.

---

## 📁 البنية

```
public/intro/
├── vo/
│   ├── ar/                       ← التسجيلات العربية
│   │   ├── hook-1.mp3
│   │   ├── hook-2.mp3
│   │   └── ...
│   └── en/                       ← التسجيلات الإنجليزية
│       ├── hook-1.mp3
│       ├── hook-2.mp3
│       └── ...
└── ambient/                      ← المزيكا الخلفية (مفيش لغة، مجرد موود)
    ├── intro__nature.mp3
    ├── intro__wind.mp3
    └── intro__waves.mp3
```

---

## 🎙️ الـ VO Clips (18 clip × 2 لغة = 36 ملف)

### 1️⃣ Hook Screen — اللحظة الشاعرية (شاشة الجملتين)

**📍 شغال في:** أول 6 ثواني بعد الـ Entry — جملتين بيظهروا بنعومة في صور سوداء بسماء النجوم

#### `hook-1.mp3`
- **AR:** _مش كل علاج بيبدأ من دواء_
- **EN:** _Not every cure starts with medicine_
- **Tone:** صوت هادي، حكيم، فيه شك وفضول. خد breath قبل "بيبدأ"
- **المدة المستهدفة:** ~3 ثواني

#### `hook-2.mp3`
- **AR:** _أحياناً... يبدأ من مكان_
- **EN:** _Sometimes… it starts with a place_
- **Tone:** صوت أخفض من الأولانية، فيه يقين هادي. لاحظ الـ "..." — pause طبيعية بعد "أحياناً"
- **المدة المستهدفة:** ~3 ثواني

---

### 2️⃣ Discovery Screen — البيئات الأربعة

**📍 شغال في:** الـ panels اللي بتعدي على الواحدة بعد التانية. كل كلمة بتظهر مع فيديو بيئة كامل-الشاشة

#### `discovery-sea.mp3`
- **AR:** _البحر_
- **EN:** _The sea_
- **Tone:** كأنك بتسلم بإحترام. صوت بطيء، مفتوح
- **المدة:** ~1 ثانية

#### `discovery-desert.mp3`
- **AR:** _الصحراء_
- **EN:** _The desert_
- **Tone:** أعمق شوية، فيه dryness خفيفة
- **المدة:** ~1 ثانية

#### `discovery-mountains.mp3`
- **AR:** _الجبال_
- **EN:** _The mountains_
- **Tone:** ثقيل، راسخ
- **المدة:** ~1 ثانية

#### `discovery-oasis.mp3`
- **AR:** _الواحات_
- **EN:** _The oases_
- **Tone:** ناعم، رطب، فيه ارتياح
- **المدة:** ~1 ثانية

---

### 3️⃣ Question Screens — الأسئلة الثلاثة

**📍 شغال في:** كل سؤال يظهر على شاشة منفصلة. الـ VO بيتشغل أول ما تفتح الشاشة

#### `q1.mp3`
- **AR:** _ما الذي تبحث عنه؟_
- **EN:** _What are you looking for?_
- **Tone:** سؤال شخصي حميمي. مش امتحان. متبص في عينين الـ user
- **المدة:** ~2 ثانية

#### `q2.mp3`
- **AR:** _أين تجد راحتك؟_
- **EN:** _Where do you find peace?_
- **Tone:** فضول حقيقي، كأنك بتتعرف على المستخدم
- **المدة:** ~2 ثانية

#### `q3.mp3`
- **AR:** _كيف تتخيّل رحلتك؟_
- **EN:** _How do you imagine your journey?_
- **Tone:** أبطأ شوية، يخلي الـ user يفكر فعلاً
- **المدة:** ~2.5 ثانية

---

### 4️⃣ Processing Screen — لحظة الانتظار

**📍 شغال في:** بعد الإجابة على الـ 3 أسئلة، فيه شاشة dots بتلف لحد ما الـ recommendation تطلع

#### `processing.mp3`
- **AR:** _نرسم لك رحلتك_
- **EN:** _Mapping your journey_
- **Tone:** هادي، مطمئن، فيه expectancy
- **المدة:** ~2 ثواني

---

### 5️⃣ Reveal Screens — كشف الوجهة (7 وجهات)

**📍 شغال في:** أول ما الوجهة المُختارة تظهر — البانوراما الـ 360° خلف الشعر بتاعها

#### `reveal-safaga.mp3`
- **AR:** _سفاجا. حيث يبدأ الجسد في التذكّر._
- **EN:** _Safaga. Where the body begins to remember._
- **Tone:** الاسم بإيقاع ثابت، الجملة الثانية أعمق
- **المدة:** ~5 ثواني

#### `reveal-siwa.mp3`
- **AR:** _سيوة. حيث الصمت يتكلّم._
- **EN:** _Siwa. Where silence speaks._
- **Tone:** هادي جداً، فيه paradox تحتقاره
- **المدة:** ~5 ثواني

#### `reveal-sinai.mp3`
- **AR:** _سيناء. حيث تلمس السماء والأرض معاً._
- **EN:** _Sinai. Where sky and earth touch as one._
- **Tone:** فيه epic-ness خفيفة، بطيء
- **المدة:** ~6 ثواني

#### `reveal-fayoum.mp3`
- **AR:** _الفيوم. واحة الروح الهادئة._
- **EN:** _Fayoum. An oasis for a quiet soul._
- **Tone:** ناعم، شخصي
- **المدة:** ~5 ثواني

#### `reveal-bahariya.mp3`
- **AR:** _الواحات البحرية. حيث الصحراء تحتضنك._
- **EN:** _Bahariya. Where the desert holds you close._
- **Tone:** دافي، حنون
- **المدة:** ~5 ثواني

#### `reveal-wadi-degla.mp3`
- **AR:** _وادي دجلة. صمت الصحراء على أطراف المدينة._
- **EN:** _Wadi Degla. Desert silence at the edge of the city._
- **Tone:** فيه contrast — صمت + صوت مدينة
- **المدة:** ~6 ثواني

#### `reveal-shagie-farms.mp3`
- **AR:** _مزارع شجيع. حيث الشفاء يبدأ من الأرض._
- **EN:** _Shagie Farms. Where healing begins from the soil._
- **Tone:** حيوي، عضوي، فيه توت bouquet خفيف
- **المدة:** ~5 ثواني

---

### 6️⃣ Transition Screen — الانتقال للموقع

**📍 شغال في:** آخر شاشة قبل ما يدخل على الـ /home — تأكيد إنه جاهز

#### `transition.mp3`
- **AR:** _رحلتك بدأت. تعالى نكمل._
- **EN:** _Your journey has begun. Let's continue._
- **Tone:** invitational، دافي، ابتسامة خفيفة في الصوت
- **المدة:** ~4 ثواني

---

## 🎵 الـ Ambient Music (3 ملفات بس)

كل track موود واحد بيشتغل عبر عدة شاشات. مفيش لغة — موسيقى صرفة.

| الملف | الموود | الشاشات اللي بيشتغل فيها |
|-------|--------|---------------------------|
| `intro__nature.mp3` | طبيعي، مفتوح | Entry, Hook, Discovery, الـ 3 أسئلة |
| `intro__wind.mp3` | غامض، تأمّلي | Processing |
| `intro__waves.mp3` | متوسع، spacious | Reveal, Teaser360, Transition |

### Specs:
- **Format:** MP3, 128 kbps stereo, 44.1 kHz
- **المدة:** 3-5 دقايق (loopable — يبدأ ويخلص في نفس الـ amplitude)
- **Loudness:** -22 LUFS (هادية عشان مايعلوش على الـ VO)
- **بدون vocals أو melody قوية** — drone/texture

### Mood guide:
- **nature:** ملائكي، فيه طيور بعيدة، شجر، ضوء صبحي. UPLIFT خفيف
- **wind:** غامض، رياح تشبه drum روحي، ascending tension
- **waves:** wide soundscape، أمواج بعيدة، fade-in/out طبيعي

---

## 📋 Specs للـ VO

- **Format:** MP3, 96 kbps mono, 44.1 kHz
- **Loudness:** -16 LUFS
- **Recording:**
  - أوضة هادية (مفيش echo)
  - ميكرفون condenser USB (Shure MV7 أو Audio-Technica AT2020USB+)
  - 6 إنش مسافة من الميك
  - Pop filter لو ممكن
- **Performance:**
  - **بطيء.** أبطأ من ما إنت متعود
  - **هادي.** صوت قريب، لو في الأذن
  - **flat tone:** متعملش inflection (تنغيم) زيادة. الناس بتكره الصوت "الإعلاني"
  - **breath قبل كل جملة** — مش بس عشان pacing، الـ inhale بيخلي الصوت يحس حقيقي
  - **2-3 ثواني سكوت** بعد ما تخلص الجملة قبل ما توقف التسجيل (للـ fade الطبيعي)

---

## 🎬 خطة التسجيل في يوم واحد (~1 ساعة)

### اليوم العربي (30 دقيقة):
1. **Hook** — 2 clips × 30 ثانية تسجيل + retake = 5 دقايق
2. **Discovery** — 4 clips × كلمة واحدة = 5 دقايق
3. **Questions** — 3 clips قصيرة = 5 دقايق
4. **Processing + Transition** — 2 clips = 3 دقايق
5. **Reveals** — 7 clips × ~10 ثواني = 12 دقيقة (الجزء الأطول)

### اليوم الإنجليزي (30 دقيقة): نفس الكليبات بالعربي بس Voice-over إنجليزي

**ملاحظة:** لو الـ user في صفحة الموقع العربي، هيسمع التسجيل العربي. لو إنجليزي، يسمع الإنجليزي. لازم الاتنين.

---

## 🎙️ التسجيل بالموبايل (لو مفيش ميك):

iPhone Voice Memos كافي للبداية. اعمل كده:
1. أوضة فيها سجاد/ستاير (تامتص الـ echo)
2. iPhone في يدك على بعد 4-6 إنش من بُقّك
3. شغّل **Voice Isolation** في الإعدادات
4. سجّل clip واحد، استمعله — لو مكتوم، اتجاه أحسن
5. Edit → Trim لتنضيف بداية/نهاية كل clip
6. Share → Save to Files → folder مخصص

بعد كده تحول M4A إلى MP3:
```bash
brew install ffmpeg   # مرة واحدة
ffmpeg -i hook-1.m4a -b:a 96k -ac 1 hook-1.mp3
```

أو موقع: cloudconvert.com/m4a-to-mp3

---

## 🚀 لما تخلص التسجيل:

1. حط الملفات في الـ folder الصح:
   - `public/intro/vo/ar/hook-1.mp3`
   - `public/intro/vo/en/hook-1.mp3`
   - `public/intro/ambient/intro__nature.mp3`
2. Push:
   ```bash
   git add public/intro/
   git commit -m "audio: add cinematic intro VO + ambient"
   git push
   ```
3. Vercel deploy تلقائي. الـ user الجاي بعد دقيقتين هيسمع الصوت بتاعك.

---

## 💡 ابدأ بالـ Hook + Reveals

لو هتسجل clip واحد بس، خليه `hook-1` و `hook-2` — الجملتين دول بيظهروا في الثواني الأولى من التجربة وبيحددوا الإحساس العام. كل الباقي build-up عليهم.

ثاني أهم: الـ 7 reveals — دي اللحظة العاطفية اللي الـ user بيحسس فيها إن الموقع شخصي.
