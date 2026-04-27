# 🎬 Cinematic Intro Audio Assets

نظام بنفس فلسفة `public/meditation/` — **plug-and-play**. حط الملفات في المكان الصح، الموقع يلاقيها أوتوماتيك.

---

## 📁 البنية

```
public/intro/
├── vo/
│   ├── ar/             ← Arabic voice-overs
│   │   └── *.mp3
│   └── en/             ← English voice-overs
│       └── *.mp3
└── ambient/            ← Background music (no language)
    └── intro__*.mp3
```

---

## 📝 المراجع

- **`SCRIPTS.md`** — كل النصوص للتسجيل، 18 clip × 2 لغة + 3 ambient tracks
- **`lib/introAudio.ts`** — الكود اللي بيدور على الملفات وبيرجع fallback لو مش لاقيها

---

## 🔄 Fallback Behavior

| اللي تسجله | اللي يحصل |
|-----------|-----------|
| كل الملفات موجودة | الـ user يسمع التسجيل بتاعك في كل اللغتين |
| ambient فقط (no VO) | يسمع المزيكا + الشاشات بدون VO |
| VO فقط (no ambient) | يسمع التسجيل + freesound CDN كـ ambient |
| مفيش حاجة | يسمع freesound CDN كـ ambient + شاشات صامتة |

النظام مش بيكسر أبداً — كل حاجة optional. تقدر تبدأ بـ clip واحد وتزيد لما تكون جاهز.

---

## 📐 Specs Quick Reference

### VO (Voice-Over)
| Property | Value |
|----------|-------|
| Format | MP3 |
| Bitrate | 96 kbps |
| Channels | Mono |
| Sample Rate | 44.1 kHz |
| Loudness | -16 LUFS |

### Ambient (Background Music)
| Property | Value |
|----------|-------|
| Format | MP3 |
| Bitrate | 128 kbps |
| Channels | Stereo |
| Sample Rate | 44.1 kHz |
| Duration | 3-5 minutes |
| Loop-friendly | بداية/نهاية في نفس الـ amplitude |
| Loudness | -22 LUFS (أهدى من الـ VO) |

---

## 📂 List of Files

### VO (18 clips × 2 لغات = 36 ملف)

`public/intro/vo/ar/` و `public/intro/vo/en/` فيهم نفس الـ 18:

```
hook-1.mp3
hook-2.mp3
discovery-sea.mp3
discovery-desert.mp3
discovery-mountains.mp3
discovery-oasis.mp3
q1.mp3
q2.mp3
q3.mp3
processing.mp3
reveal-safaga.mp3
reveal-siwa.mp3
reveal-sinai.mp3
reveal-fayoum.mp3
reveal-bahariya.mp3
reveal-wadi-degla.mp3
reveal-shagie-farms.mp3
transition.mp3
```

### Ambient (3 ملفات بس)

`public/intro/ambient/`:
```
intro__nature.mp3      ← طبيعي، مفتوح (entry/hook/discovery/questions)
intro__wind.mp3        ← غامض، تأمّلي (processing)
intro__waves.mp3       ← متوسع (reveal/teaser/transition)
```

---

## 🎯 ترتيب الأولوية

1. **`intro__nature.mp3`** — أول track يسمعه الـ user. أهم ملف موسيقي.
2. **`hook-1.mp3` + `hook-2.mp3`** (ar + en) — الجملتين الشاعريتين الافتتاحيتين
3. **الـ 7 reveals** — اللحظة الشخصية الأهم
4. **`intro__waves.mp3`** — موسيقى الـ reveal
5. الـ questions + processing + transition + discovery
6. **`intro__wind.mp3`** — أقلهم استخدام (Processing screen قصيرة)

اقرأ `SCRIPTS.md` للنصوص الكاملة + التوصيات الفنية.
