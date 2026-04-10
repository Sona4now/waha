"use client";

import { motion } from "framer-motion";

// Seasonal weather data for each destination (no API needed)
// Based on average climate data
interface SeasonalData {
  season: string;
  months: string;
  temp: { min: number; max: number };
  humidity: number;
  rainDays: number;
  suitability: "excellent" | "good" | "fair" | "poor";
  note: string;
}

interface Props {
  destId: string;
  destName: string;
}

const WEATHER_DATA: Record<string, SeasonalData[]> = {
  safaga: [
    {
      season: "الشتاء",
      months: "ديسمبر — فبراير",
      temp: { min: 14, max: 22 },
      humidity: 50,
      rainDays: 1,
      suitability: "excellent",
      note: "الموسم الأمثل للعلاج — شمس معتدلة وجو مثالي",
    },
    {
      season: "الربيع",
      months: "مارس — مايو",
      temp: { min: 18, max: 28 },
      humidity: 55,
      rainDays: 0,
      suitability: "excellent",
      note: "جو رائع — ممتاز للعلاج بالشمس",
    },
    {
      season: "الصيف",
      months: "يونيو — أغسطس",
      temp: { min: 25, max: 35 },
      humidity: 60,
      rainDays: 0,
      suitability: "good",
      note: "حار لكن البحر يلطّف الجو",
    },
    {
      season: "الخريف",
      months: "سبتمبر — نوفمبر",
      temp: { min: 20, max: 29 },
      humidity: 55,
      rainDays: 1,
      suitability: "excellent",
      note: "أنسب الأوقات للسفر الاستشفائي",
    },
  ],
  siwa: [
    {
      season: "الشتاء",
      months: "ديسمبر — فبراير",
      temp: { min: 6, max: 20 },
      humidity: 45,
      rainDays: 1,
      suitability: "excellent",
      note: "الموسم الأفضل — نهار دافئ وليل بارد منعش",
    },
    {
      season: "الربيع",
      months: "مارس — مايو",
      temp: { min: 12, max: 28 },
      humidity: 40,
      rainDays: 0,
      suitability: "excellent",
      note: "جو مثالي للعلاج والسياحة",
    },
    {
      season: "الصيف",
      months: "يونيو — أغسطس",
      temp: { min: 22, max: 38 },
      humidity: 35,
      rainDays: 0,
      suitability: "fair",
      note: "حار جداً نهاراً — يُفضل الأنشطة الصباحية",
    },
    {
      season: "الخريف",
      months: "سبتمبر — نوفمبر",
      temp: { min: 15, max: 30 },
      humidity: 40,
      rainDays: 0,
      suitability: "excellent",
      note: "أفضل وقت للزيارة — جو رائع",
    },
  ],
  sinai: [
    {
      season: "الشتاء",
      months: "ديسمبر — فبراير",
      temp: { min: 5, max: 18 },
      humidity: 50,
      rainDays: 2,
      suitability: "good",
      note: "بارد في الجبال — دافئ في الساحل",
    },
    {
      season: "الربيع",
      months: "مارس — مايو",
      temp: { min: 12, max: 25 },
      humidity: 45,
      rainDays: 1,
      suitability: "excellent",
      note: "الموسم الأفضل — جو معتدل مثالي",
    },
    {
      season: "الصيف",
      months: "يونيو — أغسطس",
      temp: { min: 22, max: 35 },
      humidity: 40,
      rainDays: 0,
      suitability: "good",
      note: "حار — لكن هواء الجبال نقي",
    },
    {
      season: "الخريف",
      months: "سبتمبر — نوفمبر",
      temp: { min: 15, max: 28 },
      humidity: 45,
      rainDays: 1,
      suitability: "excellent",
      note: "جو رائع للمشي والتسلق",
    },
  ],
  fayoum: [
    {
      season: "الشتاء",
      months: "ديسمبر — فبراير",
      temp: { min: 8, max: 20 },
      humidity: 60,
      rainDays: 2,
      suitability: "good",
      note: "جو لطيف — مناسب لرحلات اليوم الواحد",
    },
    {
      season: "الربيع",
      months: "مارس — مايو",
      temp: { min: 14, max: 28 },
      humidity: 55,
      rainDays: 1,
      suitability: "excellent",
      note: "الربيع في أوجه — الطبيعة خضراء",
    },
    {
      season: "الصيف",
      months: "يونيو — أغسطس",
      temp: { min: 22, max: 36 },
      humidity: 50,
      rainDays: 0,
      suitability: "fair",
      note: "حار — البحيرة تلطّف الجو",
    },
    {
      season: "الخريف",
      months: "سبتمبر — نوفمبر",
      temp: { min: 18, max: 30 },
      humidity: 55,
      rainDays: 0,
      suitability: "excellent",
      note: "وقت مثالي — جو معتدل وسماء صافية",
    },
  ],
  bahariya: [
    {
      season: "الشتاء",
      months: "ديسمبر — فبراير",
      temp: { min: 5, max: 22 },
      humidity: 40,
      rainDays: 0,
      suitability: "excellent",
      note: "الموسم الأفضل — ليل بارد ونهار دافئ",
    },
    {
      season: "الربيع",
      months: "مارس — مايو",
      temp: { min: 12, max: 30 },
      humidity: 35,
      rainDays: 0,
      suitability: "excellent",
      note: "جو رائع — مثالي للسفاري",
    },
    {
      season: "الصيف",
      months: "يونيو — أغسطس",
      temp: { min: 22, max: 40 },
      humidity: 30,
      rainDays: 0,
      suitability: "poor",
      note: "حار جداً — غير مناسب للرحلات الصحراوية",
    },
    {
      season: "الخريف",
      months: "سبتمبر — نوفمبر",
      temp: { min: 15, max: 32 },
      humidity: 35,
      rainDays: 0,
      suitability: "excellent",
      note: "جو مثالي — البداية الممتازة لموسم السفاري",
    },
  ],
};

function getCurrentSeason(): string {
  const month = new Date().getMonth() + 1;
  if (month >= 12 || month <= 2) return "الشتاء";
  if (month >= 3 && month <= 5) return "الربيع";
  if (month >= 6 && month <= 8) return "الصيف";
  return "الخريف";
}

const SUITABILITY_CONFIG = {
  excellent: {
    label: "مثالي للعلاج",
    color: "#91b149",
    bg: "bg-[#91b149]/10",
    text: "text-[#91b149]",
    emoji: "✨",
  },
  good: {
    label: "جيد",
    color: "#0d9488",
    bg: "bg-[#0d9488]/10",
    text: "text-[#0d9488]",
    emoji: "👍",
  },
  fair: {
    label: "مقبول",
    color: "#d97706",
    bg: "bg-[#d97706]/10",
    text: "text-[#d97706]",
    emoji: "⚠️",
  },
  poor: {
    label: "غير مناسب",
    color: "#dc2626",
    bg: "bg-[#dc2626]/10",
    text: "text-[#dc2626]",
    emoji: "❌",
  },
};

function getWeatherIcon(season: string) {
  const icons: Record<string, string> = {
    الشتاء: "❄️",
    الربيع: "🌸",
    الصيف: "☀️",
    الخريف: "🍂",
  };
  return icons[season] || "☀️";
}

export default function WeatherWidget({ destId, destName }: Props) {
  const data = WEATHER_DATA[destId] || WEATHER_DATA.safaga;
  const currentSeason = getCurrentSeason();
  const currentData =
    data.find((s) => s.season === currentSeason) || data[0];
  const config = SUITABILITY_CONFIG[currentData.suitability];

  return (
    <div className="bg-white dark:bg-[#162033] rounded-2xl border border-[#d0dde4] dark:border-[#1e3a5f] overflow-hidden">
      {/* Current weather */}
      <div
        className="p-6 bg-gradient-to-br from-[#1d5770] via-[#12394d] to-[#0d2a39] text-white relative overflow-hidden"
      >
        {/* Decorative */}
        <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-[#91b149]/10 blur-2xl" />

        <div className="relative">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-white/50 mb-1">
                الطقس الآن في {destName}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-5xl">
                  {getWeatherIcon(currentSeason)}
                </span>
                <div>
                  <div className="text-3xl font-bold font-display">
                    {currentData.temp.min}° - {currentData.temp.max}°
                  </div>
                  <div className="text-xs text-white/70">
                    {currentSeason} · {currentData.months}
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`${config.bg} ${config.text} px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm flex-shrink-0`}
            >
              <span className="ml-1">{config.emoji}</span>
              {config.label}
            </div>
          </div>

          <p className="text-sm text-white/80 leading-relaxed mb-4">
            {currentData.note}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
              <div className="text-white/50 text-[10px] mb-0.5">الرطوبة</div>
              <div className="font-bold">{currentData.humidity}%</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
              <div className="text-white/50 text-[10px] mb-0.5">أيام المطر</div>
              <div className="font-bold">{currentData.rainDays} / شهر</div>
            </div>
          </div>
        </div>
      </div>

      {/* Seasonal forecast */}
      <div className="p-5">
        <div className="text-[10px] uppercase tracking-widest text-[#7b7c7d] font-bold mb-3 text-center">
          أفضل وقت للسفر على مدار السنة
        </div>
        <div className="grid grid-cols-4 gap-2">
          {data.map((s) => {
            const isActive = s.season === currentSeason;
            const c = SUITABILITY_CONFIG[s.suitability];
            return (
              <motion.div
                key={s.season}
                whileHover={{ y: -2 }}
                className={`relative rounded-xl p-2 text-center transition-all cursor-default ${
                  isActive
                    ? "bg-[#f5f8fa] dark:bg-[#0a151f] ring-2 ring-[#91b149]"
                    : "bg-[#f5f8fa] dark:bg-[#0a151f]"
                }`}
              >
                <div className="text-xl mb-1">{getWeatherIcon(s.season)}</div>
                <div className="text-[10px] font-bold text-[#12394d] dark:text-white mb-0.5">
                  {s.season}
                </div>
                <div className="text-[9px] text-[#7b7c7d]">
                  {s.temp.max}° /{s.temp.min}°
                </div>
                <div
                  className={`mt-1 h-1 rounded-full`}
                  style={{ backgroundColor: c.color, opacity: 0.8 }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
