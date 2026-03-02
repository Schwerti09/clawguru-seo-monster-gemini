import { redisDelete, redisGet, redisListPeek, redisListPop, redisListPush, redisSetIfNotExists } from "@/lib/redis"

const GEMINI_QUEUE_KEY = "queue:gemini:jobs"
const GEMINI_LOCK_KEY = "queue:gemini:lock"
const LOCK_TTL_SECONDS = 90
const POLL_INTERVAL_MS = 250

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function acquireTurn(jobId: string) {
  await redisListPush(GEMINI_QUEUE_KEY, jobId)
  while (true) {
    const head = await redisListPeek(GEMINI_QUEUE_KEY)
    if (head === jobId) {
      const locked = await redisSetIfNotExists(GEMINI_LOCK_KEY, jobId, LOCK_TTL_SECONDS)
      if (locked) return
    }
    await sleep(POLL_INTERVAL_MS)
  }
}

async function releaseTurn(jobId: string) {
  const current = await redisGet(GEMINI_LOCK_KEY)
  if (current === jobId) {
    await redisDelete(GEMINI_LOCK_KEY)
  }
  const head = await redisListPeek(GEMINI_QUEUE_KEY)
  if (head === jobId) {
    await redisListPop(GEMINI_QUEUE_KEY)
  }
}

/**
 * Enqueue Gemini API calls so only one runs at a time (rate-limit protection).
 */
export async function runGeminiQueue<T>(job: () => Promise<T>): Promise<T> {
  const jobId = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now())
  await acquireTurn(jobId)
  try {
    return await job()
  } finally {
    await releaseTurn(jobId)
  }
}
