/**
 * Achievement System for Roast My Moltbot
 * Gamification through badges, levels, and rewards
 */

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  rarity: "common" | "rare" | "epic" | "legendary"
  condition: {
    type: "score" | "streak" | "fix" | "share" | "battle" | "roast_count"
    threshold: number
  }
  points: number
  unlockedAt?: string
}

// Achievement database
export const achievements: Achievement[] = [
  // Common (Easy)
  {
    id: "first_roast",
    name: "First Roast",
    description: "Complete your first security roast",
    icon: "🛡️",
    rarity: "common",
    condition: { type: "roast_count", threshold: 1 },
    points: 10,
  },
  {
    id: "fixer_upper",
    name: "Fixer Upper",
    description: "Fix your first vulnerability",
    icon: "🔧",
    rarity: "common",
    condition: { type: "fix", threshold: 1 },
    points: 15,
  },
  {
    id: "sharer",
    name: "Sharer",
    description: "Share your roast on social media",
    icon: "📢",
    rarity: "common",
    condition: { type: "share", threshold: 1 },
    points: 10,
  },

  // Rare (Medium)
  {
    id: "week_warrior",
    name: "Week Warrior",
    description: "7-day roast streak",
    icon: "🔥",
    rarity: "rare",
    condition: { type: "streak", threshold: 7 },
    points: 50,
  },
  {
    id: "score_climber",
    name: "Score Climber",
    description: "Improve your score by 40+ points",
    icon: "📈",
    rarity: "rare",
    condition: { type: "score", threshold: 40 },
    points: 75,
  },
  {
    id: "battle_winner",
    name: "Battle Winner",
    description: "Win 3 roast battles",
    icon: "⚔️",
    rarity: "rare",
    condition: { type: "battle", threshold: 3 },
    points: 60,
  },
  {
    id: "fix_master",
    name: "Fix Master",
    description: "Fix 10 vulnerabilities",
    icon: "🛠️",
    rarity: "rare",
    condition: { type: "fix", threshold: 10 },
    points: 100,
  },

  // Epic (Hard)
  {
    id: "elite_guard",
    name: "Elite Guard",
    description: "Reach score 80+",
    icon: "🏆",
    rarity: "epic",
    condition: { type: "score", threshold: 80 },
    points: 200,
  },
  {
    id: "month_master",
    name: "Month Master",
    description: "30-day roast streak",
    icon: "📅",
    rarity: "epic",
    condition: { type: "streak", threshold: 30 },
    points: 300,
  },
  {
    id: "viral_roast",
    name: "Viral Roast",
    description: "Get 100+ reactions on your roast",
    icon: "🚀",
    rarity: "epic",
    condition: { type: "share", threshold: 100 },
    points: 250,
  },

  // Legendary (Extreme)
  {
    id: "hall_of_fame",
    name: "Hall of Fame",
    description: "Reach score 90+ and enter Hall of Fame",
    icon: "👑",
    rarity: "legendary",
    condition: { type: "score", threshold: 90 },
    points: 500,
  },
  {
    id: "perfect_score",
    name: "Perfect Score",
    description: "Achieve 100/100 security score",
    icon: "💎",
    rarity: "legendary",
    condition: { type: "score", threshold: 100 },
    points: 1000,
  },
  {
    id: "roast_legend",
    name: "Roast Legend",
    description: "Complete 100 roasts",
    icon: "🔮",
    rarity: "legendary",
    condition: { type: "roast_count", threshold: 100 },
    points: 750,
  },
]

export function getAchievementsByRarity(rarity: Achievement["rarity"]): Achievement[] {
  return achievements.filter(a => a.rarity === rarity)
}

export function getTotalPoints(unlockedIds: string[]): number {
  return achievements
    .filter(a => unlockedIds.includes(a.id))
    .reduce((sum, a) => sum + a.points, 0)
}

export function getUserLevel(totalPoints: number): { level: number; title: string; nextLevel: number } {
  const levels = [
    { threshold: 0, title: "Beginner" },
    { threshold: 100, title: "Novice" },
    { threshold: 300, title: "Apprentice" },
    { threshold: 600, title: "Guardian" },
    { threshold: 1000, title: "Protector" },
    { threshold: 1500, title: "Elite" },
    { threshold: 2500, title: "Legend" },
    { threshold: 4000, title: "Master" },
  ]

  for (let i = levels.length - 1; i >= 0; i--) {
    if (totalPoints >= levels[i].threshold) {
      const nextThreshold = levels[i + 1]?.threshold || levels[i].threshold * 1.5
      return {
        level: i + 1,
        title: levels[i].title,
        nextLevel: nextThreshold,
      }
    }
  }

  return { level: 1, title: "Beginner", nextLevel: 100 }
}

export function checkAchievements(
  stats: {
    roastCount: number
    currentScore: number
    streak: number
    fixes: number
    shares: number
    battleWins: number
  },
  alreadyUnlocked: string[]
): Achievement[] {
  const newlyUnlocked: Achievement[] = []

  for (const achievement of achievements) {
    if (alreadyUnlocked.includes(achievement.id)) continue

    let meetsCondition = false
    switch (achievement.condition.type) {
      case "roast_count":
        meetsCondition = stats.roastCount >= achievement.condition.threshold
        break
      case "score":
        meetsCondition = stats.currentScore >= achievement.condition.threshold
        break
      case "streak":
        meetsCondition = stats.streak >= achievement.condition.threshold
        break
      case "fix":
        meetsCondition = stats.fixes >= achievement.condition.threshold
        break
      case "share":
        meetsCondition = stats.shares >= achievement.condition.threshold
        break
      case "battle":
        meetsCondition = stats.battleWins >= achievement.condition.threshold
        break
    }

    if (meetsCondition) {
      newlyUnlocked.push({
        ...achievement,
        unlockedAt: new Date().toISOString(),
      })
    }
  }

  return newlyUnlocked
}

export function getRarityColor(rarity: Achievement["rarity"]): string {
  switch (rarity) {
    case "common": return "#9ca3af"
    case "rare": return "#3b82f6"
    case "epic": return "#a855f7"
    case "legendary": return "#f59e0b"
  }
}
