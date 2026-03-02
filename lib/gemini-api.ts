type GeminiUsage = {
  date: string
  promptTokens: number
  completionTokens: number
  totalTokens: number
  totalCostEur: number
  requestCount: number
  updatedAt: string
}

const usageByDay = new Map<string, GeminiUsage>()

function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10)
}

function parseNumber(value: string | undefined, fallback: number) {
  if (!value) return fallback
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

export function geminiCostPer1kTokensEur(): number {
  return parseNumber(process.env.GEMINI_COST_EUR_PER_1K_TOKENS, 0.002)
}

export function geminiDailyHardLimitEur(): number {
  return parseNumber(process.env.GEMINI_DAILY_HARD_LIMIT_EUR, 25)
}

function getUsage(date = todayKey()): GeminiUsage {
  if (!usageByDay.has(date)) {
    usageByDay.clear()
    usageByDay.set(date, {
      date,
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0,
      totalCostEur: 0,
      requestCount: 0,
      updatedAt: new Date().toISOString(),
    })
  }
  return usageByDay.get(date)!
}

export function recordGeminiUsage(input: {
  promptTokens?: number
  completionTokens?: number
  totalTokens?: number
}) {
  const usage = getUsage()
  const promptTokens = Math.max(0, input.promptTokens ?? 0)
  const completionTokens = Math.max(0, input.completionTokens ?? 0)
  const totalTokens =
    Math.max(0, input.totalTokens ?? 0) || promptTokens + completionTokens

  usage.promptTokens += promptTokens
  usage.completionTokens += completionTokens
  usage.totalTokens += totalTokens
  usage.requestCount += 1
  usage.totalCostEur = (usage.totalTokens / 1000) * geminiCostPer1kTokensEur()
  usage.updatedAt = new Date().toISOString()
}

export function recordGeminiUsageFromResponse(data: unknown) {
  const payload = data as {
    usageMetadata?: {
      promptTokenCount?: number
      candidatesTokenCount?: number
      totalTokenCount?: number
    }
  }
  const usage = payload?.usageMetadata
  if (!usage) return
  recordGeminiUsage({
    promptTokens: usage.promptTokenCount,
    completionTokens: usage.candidatesTokenCount,
    totalTokens: usage.totalTokenCount,
  })
}

export function getGeminiUsageSnapshot() {
  const usage = getUsage()
  const hardLimitEur = geminiDailyHardLimitEur()
  const hardLimitReached = hardLimitEur > 0 && usage.totalCostEur >= hardLimitEur
  return { ...usage, hardLimitEur, hardLimitReached }
}

export function isGeminiHardLimitReached(): boolean {
  return getGeminiUsageSnapshot().hardLimitReached
}
