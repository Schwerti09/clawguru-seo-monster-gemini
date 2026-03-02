import { getCircuitBreaker } from "@/lib/circuit-breaker"

const DEFAULT_DAILY_TOKEN_LIMIT = 200_000
const breaker = getCircuitBreaker("gemini-api", {
  failureThreshold: 4,
  recoveryTimeoutMs: 60_000,
  successThreshold: 2,
})

const usage = {
  date: "",
  tokens: 0,
}

function todayKey(now = new Date()) {
  return now.toISOString().slice(0, 10)
}

function getDailyLimit() {
  const configured = Number(process.env.GEMINI_DAILY_TOKEN_LIMIT ?? DEFAULT_DAILY_TOKEN_LIMIT)
  if (!Number.isFinite(configured) || configured <= 0) return DEFAULT_DAILY_TOKEN_LIMIT
  return configured
}

export function estimateGeminiTokens(payload: string): number {
  return Math.max(1, Math.ceil(payload.length / 4))
}

export function reserveGeminiTokens(estimatedTokens: number): boolean {
  const today = todayKey()
  if (usage.date !== today) {
    usage.date = today
    usage.tokens = 0
  }

  if (!breaker.isCallAllowed()) return false

  const limit = getDailyLimit()
  if (usage.tokens + estimatedTokens > limit) {
    breaker.trip()
    return false
  }

  usage.tokens += estimatedTokens
  return true
}

export function recordGeminiSuccess() {
  breaker.recordSuccess()
}

export function recordGeminiFailure() {
  breaker.recordFailure()
}

export function geminiUsageSnapshot() {
  const today = todayKey()
  if (usage.date !== today) {
    return { date: today, tokens: 0, limit: getDailyLimit(), state: breaker.getState() }
  }
  return { date: usage.date, tokens: usage.tokens, limit: getDailyLimit(), state: breaker.getState() }
}
