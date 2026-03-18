export const XP_REWARDS = {
  complete_lesson: 50,
  complete_course: 500,
  daily_login: 10,
  streak_7_days: 100,
  first_enroll: 25,
  ai_tutor_question: 5,
};

export const LEVEL_THRESHOLDS = [
  { level: 1, name: "Curious Beginner", xp: 0 },
  { level: 5, name: "Active Learner", xp: 500 },
  { level: 10, name: "Rising Scholar", xp: 1500 },
  { level: 20, name: "Knowledge Seeker", xp: 4000 },
  { level: 50, name: "Ascendia Master", xp: 15000 },
];

export function calculateLevel(currentXp: number): { currentLevel: number; title: string; nextLevelXp: number | null; progressPercent: number } {
  let matchedLevel = LEVEL_THRESHOLDS[0];
  let nextThreshold = LEVEL_THRESHOLDS[1];

  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (currentXp >= LEVEL_THRESHOLDS[i].xp) {
      matchedLevel = LEVEL_THRESHOLDS[i];
      nextThreshold = LEVEL_THRESHOLDS[i + 1] || null;
    } else {
      break;
    }
  }

  const baseLevel = matchedLevel.level;
  
  // Interpolate the exact granular level if possible (e.g. between 1 and 5)
  let exactLevel = baseLevel;
  let progress = 100;

  if (nextThreshold) {
    const xpDifference = nextThreshold.xp - matchedLevel.xp;
    const currentProgressXp = currentXp - matchedLevel.xp;
    progress = Math.round((currentProgressXp / xpDifference) * 100);
    
    const levelDifference = nextThreshold.level - matchedLevel.level;
    exactLevel = baseLevel + Math.floor((currentProgressXp / xpDifference) * levelDifference);
  }

  return {
    currentLevel: exactLevel > 50 ? 50 : exactLevel,
    title: matchedLevel.name,
    nextLevelXp: nextThreshold ? nextThreshold.xp : null,
    progressPercent: progress > 100 ? 100 : progress,
  };
}
