/**
 * XP System for Roast Gamification
 * Users earn XP for roasts, fixes, and engagement
 */

export interface XPEvent {
  type: "roast" | "fix" | "share" | "comment" | "referral"
  amount: number
  timestamp: string
}

export interface UserXP {
  totalXP: number
  level: number
  levelProgress: number // 0-100 percentage to next level
  xpToNextLevel: number
  currentLevelXP: number
  events: XPEvent[]
}

// XP values for different actions
const XP_VALUES = {
  roast: 10,
  fix: 25,
  share: 15,
  comment: 5,
  referral: 50,
}

// Level thresholds (cumulative XP required)
const LEVEL_THRESHOLDS = [
  0,      // Level 1
  100,    // Level 2
  250,    // Level 3
  500,    // Level 4
  1000,   // Level 5
  2000,   // Level 6
  3500,   // Level 7
  5000,   // Level 8
  7500,   // Level 9
  10000,  // Level 10
  15000,  // Level 11
  20000,  // Level 12
  30000,  // Level 13
  40000,  // Level 14
  50000,  // Level 15
  75000,  // Level 16
  100000, // Level 17
  150000, // Level 18
  200000, // Level 19
  250000, // Level 20
]

export function calculateLevel(totalXP: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalXP >= LEVEL_THRESHOLDS[i]) {
      return i + 1
    }
  }
  return 1
}

export function calculateLevelProgress(totalXP: number): {
  level: number
  progress: number
  xpToNextLevel: number
  currentLevelXP: number
} {
  const level = calculateLevel(totalXP)
  const currentThreshold = LEVEL_THRESHOLDS[level - 1] || 0
  const nextThreshold = LEVEL_THRESHOLDS[level] || currentThreshold * 1.5
  
  const xpInLevel = totalXP - currentThreshold
  const xpRequired = nextThreshold - currentThreshold
  const progress = Math.min(100, Math.round((xpInLevel / xpRequired) * 100))
  
  return {
    level,
    progress,
    xpToNextLevel: xpRequired - xpInLevel,
    currentLevelXP: xpInLevel,
  }
}

export function addXP(userXP: UserXP, eventType: keyof typeof XP_VALUES): UserXP {
  const xpAmount = XP_VALUES[eventType]
  const newTotalXP = userXP.totalXP + xpAmount
  
  const event: XPEvent = {
    type: eventType,
    amount: xpAmount,
    timestamp: new Date().toISOString(),
  }
  
  const levelInfo = calculateLevelProgress(newTotalXP)
  
  return {
    totalXP: newTotalXP,
    level: levelInfo.level,
    levelProgress: levelInfo.progress,
    xpToNextLevel: levelInfo.xpToNextLevel,
    currentLevelXP: levelInfo.currentLevelXP,
    events: [event, ...userXP.events].slice(0, 50), // Keep last 50 events
  }
}

export function getLevelTitle(level: number): string {
  const titles = [
    "Novice",
    "Apprentice",
    "Journeyman",
    "Expert",
    "Master",
    "Grandmaster",
    "Legend",
    "Mythic",
    "Divine",
    "Ascended",
  ]
  
  if (level <= 10) {
    return titles[level - 1]
  }
  
  if (level <= 15) {
    return `Legendary ${titles[level - 11]}`
  }
  
  if (level <= 20) {
    return `Mythic ${titles[level - 16]}`
  }
  
  return "Transcendent"
}

export function getLevelReward(level: number): {
  type: string
  description: string
} | null {
  const rewards: Record<number, { type: string; description: string }> = {
    2: { type: "badge", description: "First Steps Badge" },
    5: { type: "badge", description: "Security Enthusiast Badge" },
    10: { type: "badge", description: "Roast Master Badge" },
    15: { type: "badge", description: "Elite Roaster Badge" },
    20: { type: "badge", description: "Legendary Status" },
  }
  
  return rewards[level] || null
}
