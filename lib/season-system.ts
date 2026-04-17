/**
 * Leaderboard Season System
 * Monthly resets with rewards for top performers
 */

export interface Season {
  id: string
  name: string
  startDate: string
  endDate: string
  status: "active" | "completed" | "upcoming"
  theme: string
  rewards: SeasonReward[]
}

export interface SeasonReward {
  rank: number
  reward: string
  value: string
}

export interface UserSeasonProgress {
  seasonId: string
  rank: number
  points: number
  matches: number
  wins: number
}

// Current season configuration
export const getCurrentSeason = (): Season => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  
  const startDate = new Date(year, month, 1)
  const endDate = new Date(year, month + 1, 0)
  
  const themes = [
    "Cyber Security Challenge",
    "DevOps Showdown",
    "Cloud Wars",
    "Stack Battle Royale",
  ]
  
  return {
    id: `${year}-${month + 1}`,
    name: `${themes[month % 4]} ${year}`,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    status: "active",
    theme: themes[month % 4],
    rewards: [
      { rank: 1, reward: "Legendary Badge", value: "500 XP" },
      { rank: 2, reward: "Elite Badge", value: "300 XP" },
      { rank: 3, reward: "Master Badge", value: "200 XP" },
      { rank: 4-10, reward: "Pro Badge", value: "100 XP" },
      { rank: 11-50, reward: "Participant Badge", value: "50 XP" },
    ],
  }
}

export const getSeasonRewards = (rank: number): string[] => {
  const rewards = []
  
  if (rank === 1) rewards.push("👑 Season Champion Badge")
  else if (rank === 2) rewards.push("🥈 Runner-Up Badge")
  else if (rank === 3) rewards.push("🥉 Third Place Badge")
  else if (rank <= 10) rewards.push("🏆 Top 10 Badge")
  else if (rank <= 50) rewards.push("🎖️ Top 50 Badge")
  
  if (rank <= 10) rewards.push("500 XP")
  else if (rank <= 50) rewards.push("200 XP")
  else rewards.push("100 XP")
  
  return rewards
}

export const calculateSeasonRank = (
  points: number,
  seasonParticipants: number
): number => {
  // Mock ranking calculation
  // In production, this would query the database for actual rankings
  const estimatedRank = Math.ceil((seasonParticipants * 0.3) / (points / 100))
  return Math.min(estimatedRank, seasonParticipants)
}

export const getSeasonProgress = (
  seasonId: string
): { daysRemaining: number; daysElapsed: number; totalDays: number } => {
  const season = getCurrentSeason()
  const now = new Date()
  const start = new Date(season.startDate)
  const end = new Date(season.endDate)
  
  const totalDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  const daysElapsed = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  const daysRemaining = Math.max(0, totalDays - daysElapsed)
  
  return { daysRemaining, daysElapsed, totalDays }
}

export const getSeasonLeaderboard = (
  seasonId: string
): Array<{ userId: string; username: string; points: number; rank: number }> => {
  // Mock leaderboard data
  // In production, this would query the database
  return [
    { userId: "1", username: "EliteSec_Ops", points: 1250, rank: 1 },
    { userId: "2", username: "DevOps_Ninja", points: 1180, rank: 2 },
    { userId: "3", username: "Cloud_Guardian", points: 1120, rank: 3 },
    { userId: "4", username: "Security_First", points: 1050, rank: 4 },
    { userId: "5", username: "ZeroTrust_Pro", points: 980, rank: 5 },
  ]
}

export const getUserSeasonProgress = (
  userId: string,
  seasonId: string
): UserSeasonProgress => {
  // Mock user progress
  // In production, this would query the database
  return {
    seasonId,
    rank: 15,
    points: 750,
    matches: 23,
    wins: 18,
  }
}
