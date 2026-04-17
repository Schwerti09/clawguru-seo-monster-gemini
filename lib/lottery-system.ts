/**
 * Roast Lottery System
 * Weekly random prize draw for engaged users
 */

export interface LotteryTicket {
  userId: string
  ticketId: string
  drawDate: string
  eligible: boolean
}

export interface LotteryPrize {
  id: string
  name: string
  description: string
  value: string
  probability: number // 0-100
  icon: string
}

export interface LotteryDraw {
  id: string
  drawDate: string
  winnerId: string
  winnerName: string
  prize: LotteryPrize
  totalTickets: number
}

// Available prizes
export const PRIZES: LotteryPrize[] = [
  {
    id: "pro-month",
    name: "Pro Month",
    description: "1 month of Pro access",
    value: "$29",
    probability: 10,
    icon: "👑",
  },
  {
    id: "pro-week",
    name: "Pro Week",
    description: "1 week of Pro access",
    value: "$7",
    probability: 25,
    icon: "⭐",
  },
  {
    id: "day-pass",
    name: "Day Pass",
    description: "1 day of full access",
    value: "$1",
    probability: 40,
    icon: "🎫",
  },
  {
    id: "xp-boost",
    name: "XP Boost",
    description: "500 bonus XP",
    value: "500 XP",
    probability: 60,
    icon: "⚡",
  },
  {
    id: "badge",
    name: "Lucky Badge",
    description: "Exclusive lottery badge",
    value: "Badge",
    probability: 30,
    icon: "🍀",
  },
]

export function generateTicket(userId: string): LotteryTicket {
  return {
    userId,
    ticketId: `ticket-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    drawDate: getNextDrawDate().toISOString(),
    eligible: true,
  }
}

export function getNextDrawDate(): Date {
  const now = new Date()
  const nextSunday = new Date(now)
  nextSunday.setDate(now.getDate() + (7 - now.getDay()))
  nextSunday.setHours(20, 0, 0, 0) // 8 PM Sunday
  return nextSunday
}

export function getDaysUntilDraw(): number {
  const now = new Date()
  const nextDraw = getNextDrawDate()
  const diff = nextDraw.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function selectWinner(ticketCount: number): LotteryPrize {
  const random = Math.random() * 100
  let cumulative = 0

  for (const prize of PRIZES) {
    cumulative += prize.probability
    if (random <= cumulative) {
      return prize
    }
  }

  return PRIZES[PRIZES.length - 1] // Default to lowest prize
}

export function calculateWinProbability(userId: string): number {
  // Mock: base probability + engagement bonus
  // In production, this would calculate based on user activity
  const baseProbability = 0.01 // 1% base chance
  const engagementBonus = 0.005 // 0.5% per roast this week
  return Math.min(0.05, baseProbability + engagementBonus) // Max 5%
}

export function getRecentWinners(count: number = 5): LotteryDraw[] {
  // Mock recent winners
  // In production, this would query the database
  return [
    {
      id: "1",
      drawDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      winnerId: "user123",
      winnerName: "Security_Ninja",
      prize: PRIZES[0],
      totalTickets: 1247,
    },
    {
      id: "2",
      drawDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      winnerId: "user456",
      winnerName: "DevOps_Pro",
      prize: PRIZES[1],
      totalTickets: 1089,
    },
    {
      id: "3",
      drawDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
      winnerId: "user789",
      winnerName: "Cloud_Guardian",
      prize: PRIZES[2],
      totalTickets: 956,
    },
  ]
}
