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

function normalizeList(value: unknown): string[] {
  if (!value) return []
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === "string" && v.length > 0)
  if (typeof value === "string") return value.length > 0 ? [value] : []
  return []
}

function parseEnvMap(raw?: string): Record<string, string[]> {
  if (!raw) return {}
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>
    return Object.fromEntries(
      Object.entries(parsed).map(([key, value]) => [key.toLowerCase(), normalizeList(value)])
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
  return template.replace(/\{([a-z_]+)\}/gi, (_, key: string) =>
    encodeURIComponent(replacements[key.toLowerCase()] ?? "")
  )
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
    pixels: payload.pixels,
    postbacks: payload.postbacks,
  })
}

export function getAffiliatePixelUrls(affiliateRef: string, ctx: AffiliateTrackingContext): string[] {
  const ref = affiliateRef.toLowerCase()
  const config = getTrackingConfig(ref)
  return config.pixels.map((pixel) => substitute(pixel, ctx)).filter(Boolean)
}

export async function fireAffiliatePostbacks(
  affiliateRef: string,
  ctx: AffiliateTrackingContext
): Promise<void> {
  const ref = affiliateRef.toLowerCase()
  const config = getTrackingConfig(ref)
  const tasks = config.postbacks.map(async (template) => {
    const url = substitute(template, ctx)
    if (!url) return
    await fetch(url, { method: "POST" }).catch(() => undefined)
  })
  await Promise.all(tasks)
}
