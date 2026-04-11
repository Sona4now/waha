"use client";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (state: UserState) => boolean;
}

export interface UserState {
  destinationsVisited: string[];
  articlesRead: number;
  cinematicCompleted: boolean;
  symptomCheckerUsed: boolean;
  aiChatUsed: boolean;
  favoritesCount: number;
  comparisonsMade: number;
  visitCount: number;
  toursWatched: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "explorer",
    title: "المستكشف",
    description: "زرت 3 وجهات مختلفة",
    icon: "🗺️",
    condition: (s) => s.destinationsVisited.length >= 3,
  },
  {
    id: "world-traveler",
    title: "رحّالة محترف",
    description: "زرت كل الـ 5 وجهات",
    icon: "🌍",
    condition: (s) => s.destinationsVisited.length >= 5,
  },
  {
    id: "reader",
    title: "القارئ",
    description: "قرأت 5 مقالات من المدونة",
    icon: "📚",
    condition: (s) => s.articlesRead >= 5,
  },
  {
    id: "cinematic",
    title: "السينمائي",
    description: "خلصت التجربة السينمائية الكاملة",
    icon: "🎬",
    condition: (s) => s.cinematicCompleted,
  },
  {
    id: "health-conscious",
    title: "الواعي صحياً",
    description: "جربت فاحص الأعراض",
    icon: "🩺",
    condition: (s) => s.symptomCheckerUsed,
  },
  {
    id: "curious",
    title: "الفضولي",
    description: "سألت المساعد الذكي",
    icon: "🤖",
    condition: (s) => s.aiChatUsed,
  },
  {
    id: "collector",
    title: "الجامع",
    description: "أضفت 3 وجهات للمفضلة",
    icon: "❤️",
    condition: (s) => s.favoritesCount >= 3,
  },
  {
    id: "analyst",
    title: "المحلل",
    description: "قارنت بين وجهتين",
    icon: "⚖️",
    condition: (s) => s.comparisonsMade >= 1,
  },
  {
    id: "loyal",
    title: "زائر مُخلص",
    description: "رجعت للموقع 5 مرات",
    icon: "💚",
    condition: (s) => s.visitCount >= 5,
  },
  {
    id: "virtual-explorer",
    title: "مستكشف افتراضي",
    description: "شاهدت 3 جولات 360°",
    icon: "🎥",
    condition: (s) => s.toursWatched >= 3,
  },
];

const STORAGE_KEY = "waaha_user_state";
const UNLOCKED_KEY = "waaha_achievements";

export function getUserState(): UserState {
  if (typeof window === "undefined") {
    return {
      destinationsVisited: [],
      articlesRead: 0,
      cinematicCompleted: false,
      symptomCheckerUsed: false,
      aiChatUsed: false,
      favoritesCount: 0,
      comparisonsMade: 0,
      visitCount: 0,
      toursWatched: 0,
    };
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}

  return {
    destinationsVisited: [],
    articlesRead: 0,
    cinematicCompleted: false,
    symptomCheckerUsed: false,
    aiChatUsed: false,
    favoritesCount: 0,
    comparisonsMade: 0,
    visitCount: 0,
    toursWatched: 0,
  };
}

export function updateUserState(updates: Partial<UserState>): UserState {
  const current = getUserState();
  const newState = { ...current, ...updates };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  } catch {}
  return newState;
}

export function trackDestinationVisit(destId: string) {
  const state = getUserState();
  if (!state.destinationsVisited.includes(destId)) {
    updateUserState({
      destinationsVisited: [...state.destinationsVisited, destId],
    });
  }
  checkNewAchievements();
}

export function trackAction(action: keyof UserState) {
  const state = getUserState();
  if (
    action === "articlesRead" ||
    action === "visitCount" ||
    action === "favoritesCount" ||
    action === "comparisonsMade" ||
    action === "toursWatched"
  ) {
    updateUserState({ [action]: ((state[action] as number) || 0) + 1 });
  } else if (
    action === "cinematicCompleted" ||
    action === "symptomCheckerUsed" ||
    action === "aiChatUsed"
  ) {
    updateUserState({ [action]: true });
  }
  checkNewAchievements();
}

export function getUnlockedAchievements(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(UNLOCKED_KEY) || "[]");
  } catch {
    return [];
  }
}

export function checkNewAchievements(): Achievement[] {
  const state = getUserState();
  const unlocked = new Set(getUnlockedAchievements());
  const newlyUnlocked: Achievement[] = [];

  for (const achievement of ACHIEVEMENTS) {
    if (!unlocked.has(achievement.id) && achievement.condition(state)) {
      unlocked.add(achievement.id);
      newlyUnlocked.push(achievement);
    }
  }

  if (newlyUnlocked.length > 0) {
    try {
      localStorage.setItem(UNLOCKED_KEY, JSON.stringify(Array.from(unlocked)));
      window.dispatchEvent(
        new CustomEvent("waaha_achievement", { detail: newlyUnlocked })
      );
    } catch {}
  }

  return newlyUnlocked;
}
