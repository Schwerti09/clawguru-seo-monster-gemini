import crypto from "crypto"

export type AffiliateTrackingContext = {
  sessionId: string
  amount?: number | null
  currency?: string | null
  product?: string | null
  customerEmail?: string | null
}

type TrackingConfig = {
  pixels: string[]
  postbacks: string[]
}

const runtimeOverrides = new Map<string, Partial<TrackingConfig>>()
const MAX_POSTBACK_ATTEMPTS = 2
const ALLOWED_HOSTS = new Set(
  (process.env.AFFILIATE_URL_ALLOWLIST || "")
    .split(",")
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean)
)

function normalizeList(value: unknown): string[] {
  if (!value) return []
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === "string" && v.length > 0)
  if (typeof value === "string") return value.length > 0 ? [value] : []
  return []
}

function isSafeHttpUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return false
    if (ALLOWED_HOSTS.size === 0) return true
    return ALLOWED_HOSTS.has(parsed.hostname.toLowerCase())
  } catch {
    return false
  }
}

function filterSafeUrls(list: string[]): string[] {
  return list.filter((url) => isSafeHttpUrl(url))
}

export function normalizeTrackingUrls(value: unknown): string[] {
  return filterSafeUrls(normalizeList(value))
}

function parseEnvMap(raw?: string): Record<string, string[]> {
  if (!raw) return {}
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>
    return Object.fromEntries(
      Object.entries(parsed).map(([key, value]) => [key.toLowerCase(), normalizeTrackingUrls(value)])
    )
  } catch {
    return {}
  }
}

function emailHash(email?: string | null) {
  if (!email) return ""
  return crypto.createHash("sha256").update(email.trim().toLowerCase()).digest("hex")
}

function substitute(template: string, ctx: AffiliateTrackingContext): string {
  const replacements: Record<string, string> = {
    session_id: ctx.sessionId,
    amount: ctx.amount != null ? String(ctx.amount) : "",
    currency: ctx.currency ?? "",
    product: ctx.product ?? "",
    email_hash: emailHash(ctx.customerEmail),
  }
  return template.replace(/\{([a-zA-Z_]+)\}/g, (_, key: string) =>
    encodeURIComponent(replacements[key.toLowerCase()] ?? "")
  )
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function postbackWithRetry(url: string, affiliateRef: string) {
  for (let attempt = 0; attempt < MAX_POSTBACK_ATTEMPTS; attempt += 1) {
    try {
      await fetch(url, { method: "POST" })
      return
    } catch (err) {
      if (attempt < MAX_POSTBACK_ATTEMPTS - 1) {
        await sleep(500)
        continue
      }
      console.error("[affiliate-postback]", affiliateRef, err instanceof Error ? err.message : err)
    }
  }
}

function getTrackingConfig(affiliateRef: string): TrackingConfig {
  const envPixels = parseEnvMap(process.env.AFFILIATE_PIXELS)[affiliateRef] ?? []
  const envPostbacks = parseEnvMap(process.env.AFFILIATE_POSTBACKS)[affiliateRef] ?? []
  const override = runtimeOverrides.get(affiliateRef) ?? {}
  return {
    pixels: [...normalizeList(override.pixels), ...envPixels],
    postbacks: [...normalizeList(override.postbacks), ...envPostbacks],
  }
}

export function setAffiliateTracking(
  affiliateRef: string,
  payload: { pixels?: string[]; postbacks?: string[] }
) {
  runtimeOverrides.set(affiliateRef.toLowerCase(), {
    pixels: payload.pixels ? filterSafeUrls(payload.pixels) : undefined,
    postbacks: payload.postbacks ? filterSafeUrls(payload.postbacks) : undefined,
  })
}

export function getAffiliatePixelUrls(affiliateRef: string, ctx: AffiliateTrackingContext): string[] {
  const ref = affiliateRef.toLowerCase()
  const config = getTrackingConfig(ref)
  return config.pixels
    .map((pixel) => substitute(pixel, ctx))
    .filter((url) => Boolean(url) && isSafeHttpUrl(url))
}

export async function fireAffiliatePostbacks(
  affiliateRef: string,
  ctx: AffiliateTrackingContext
): Promise<void> {
  const ref = affiliateRef.toLowerCase()
  const config = getTrackingConfig(ref)
  const tasks = config.postbacks.map(async (template) => {
    const url = substitute(template, ctx)
    if (!url || !isSafeHttpUrl(url)) return
    await postbackWithRetry(url, ref)
  })
  await Promise.all(tasks)
}
