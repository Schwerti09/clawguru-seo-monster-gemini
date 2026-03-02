type RedisValue = string | number

type MemoryEntry = {
  value: string
  expiresAt?: number
}

const memoryStore = new Map<string, MemoryEntry>()
const memoryLists = new Map<string, string[]>()

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN

function isRedisConfigured(): boolean {
  return Boolean(REDIS_URL && REDIS_TOKEN)
}

function memoryGet(key: string): string | null {
  const entry = memoryStore.get(key)
  if (!entry) return null
  if (entry.expiresAt && Date.now() > entry.expiresAt) {
    memoryStore.delete(key)
    return null
  }
  return entry.value
}

function memorySet(key: string, value: string, ttlSeconds?: number): void {
  const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined
  memoryStore.set(key, { value, expiresAt })
}

async function redisRequest<T>(command: RedisValue[]): Promise<T | null> {
  if (!isRedisConfigured()) return null
  try {
    const res = await fetch(REDIS_URL as string, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${REDIS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(command),
      cache: "no-store",
    })
    if (!res.ok) return null
    const data = (await res.json()) as { result?: T }
    return data?.result ?? null
  } catch {
    return null
  }
}

export async function redisGet(key: string): Promise<string | null> {
  if (!isRedisConfigured()) return memoryGet(key)
  const result = await redisRequest<string>(["GET", key])
  if (result === null) return memoryGet(key)
  return result
}

export async function redisSet(key: string, value: string, ttlSeconds?: number): Promise<boolean> {
  if (!isRedisConfigured()) {
    memorySet(key, value, ttlSeconds)
    return true
  }
  const command: RedisValue[] = ttlSeconds ? ["SET", key, value, "EX", ttlSeconds] : ["SET", key, value]
  const result = await redisRequest<string>(command)
  if (result === null) {
    memorySet(key, value, ttlSeconds)
    return true
  }
  return result === "OK"
}

export async function redisSetIfNotExists(key: string, value: string, ttlSeconds?: number): Promise<boolean> {
  if (!isRedisConfigured()) {
    if (memoryGet(key)) return false
    memorySet(key, value, ttlSeconds)
    return true
  }
  const command: RedisValue[] = ["SET", key, value, "NX"]
  if (ttlSeconds) {
    command.push("EX", ttlSeconds)
  }
  const result = await redisRequest<string>(command)
  if (result === null) {
    if (memoryGet(key)) return false
    memorySet(key, value, ttlSeconds)
    return true
  }
  return result === "OK"
}

export async function redisDelete(key: string): Promise<void> {
  if (!isRedisConfigured()) {
    memoryStore.delete(key)
    memoryLists.delete(key)
    return
  }
  const result = await redisRequest<number>(["DEL", key])
  if (result === null) {
    memoryStore.delete(key)
    memoryLists.delete(key)
  }
}

export async function redisGetJson<T>(key: string): Promise<T | null> {
  const raw = await redisGet(key)
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export async function redisSetJson<T>(key: string, value: T, ttlSeconds?: number): Promise<boolean> {
  return await redisSet(key, JSON.stringify(value), ttlSeconds)
}

export async function redisIncr(key: string, amount = 1, ttlSeconds?: number): Promise<number | null> {
  if (!isRedisConfigured()) {
    const current = Number(memoryGet(key) ?? "0") + amount
    memorySet(key, String(current), ttlSeconds)
    return current
  }
  const result = await redisRequest<number>(["INCRBY", key, amount])
  if (result === null) {
    const current = Number(memoryGet(key) ?? "0") + amount
    memorySet(key, String(current), ttlSeconds)
    return current
  }
  if (result !== null && result === amount && ttlSeconds) {
    await redisRequest<number>(["EXPIRE", key, ttlSeconds])
  }
  return result
}

export async function redisListPush(key: string, value: string): Promise<number | null> {
  if (!isRedisConfigured()) {
    const list = memoryLists.get(key) ?? []
    list.push(value)
    memoryLists.set(key, list)
    return list.length
  }
  const result = await redisRequest<number>(["RPUSH", key, value])
  if (result === null) {
    const list = memoryLists.get(key) ?? []
    list.push(value)
    memoryLists.set(key, list)
    return list.length
  }
  return result
}

export async function redisListPeek(key: string): Promise<string | null> {
  if (!isRedisConfigured()) {
    const list = memoryLists.get(key) ?? []
    return list[0] ?? null
  }
  const result = await redisRequest<string>(["LINDEX", key, 0])
  if (result === null) {
    const list = memoryLists.get(key) ?? []
    return list[0] ?? null
  }
  return result
}

export async function redisListPop(key: string): Promise<string | null> {
  if (!isRedisConfigured()) {
    const list = memoryLists.get(key) ?? []
    const value = list.shift() ?? null
    memoryLists.set(key, list)
    return value
  }
  const result = await redisRequest<string>(["LPOP", key])
  if (result === null) {
    const list = memoryLists.get(key) ?? []
    const value = list.shift() ?? null
    memoryLists.set(key, list)
    return value
  }
  return result
}

export async function redisListLength(key: string): Promise<number | null> {
  if (!isRedisConfigured()) {
    return (memoryLists.get(key) ?? []).length
  }
  const result = await redisRequest<number>(["LLEN", key])
  if (result === null) {
    return (memoryLists.get(key) ?? []).length
  }
  return result
}
