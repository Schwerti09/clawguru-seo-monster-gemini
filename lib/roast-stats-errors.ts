/**
 * Roast stats read from `roast_results` via Neon. On free / constrained plans,
 * queries can fail (missing table, compute quota, etc.). Call sites should
 * fall back to empty stats so builds and the site stay up.
 */
export function isRoastStatsUnavailableError(error: unknown): boolean {
  if (error == null) return false
  const err = error as { code?: string; message?: string; severity?: string }
  if (err.code === "42P01") return true
  if (err.code === "XX000") return true
  const msg =
    typeof err.message === "string" ? err.message : typeof error === "string" ? error : String(error)
  const lower = msg.toLowerCase()
  if (lower.includes("compute time quota") || lower.includes("exceeded the compute")) {
    return true
  }
  if (lower.includes("quota") && lower.includes("upgrade your plan")) {
    return true
  }
  return false
}

export const emptyRoastStatisticsApi = {
  totalRoasts: 0,
  eliteStacks: 0,
  avgScore: 0,
  roastsToday: 0,
  topScores: [] as unknown[],
  bottomScores: [] as unknown[],
} as const

export const emptyRoastStatisticsPage = {
  totalRoasts: 0,
  avgScore: 0,
  eliteStacks: 0,
  roastsToday: 0,
  roastsThisWeek: 0,
  roastsThisMonth: 0,
  scoreDistribution: { elite: 0, good: 0, average: 0, poor: 0 },
  topStacks: [] as unknown[],
  localeDistribution: [] as { locale: string; count: number }[],
}
