export type AffiliatePostbackPayload = {
  sessionId: string
  amount?: number | null
  currency?: string | null
  product?: string | null
  customerEmail?: string | null
}

type AffiliatePostbackConfig = Record<string, string | string[]>

function parsePostbackConfig(raw: string | undefined): AffiliatePostbackConfig | null {
  if (!raw) return null
  try {
    return JSON.parse(raw) as AffiliatePostbackConfig
  } catch {
    return null
  }
}

function normalizeUrls(entry: string | string[] | undefined): string[] {
  if (!entry) return []
  return Array.isArray(entry) ? entry : [entry]
}

function interpolateUrl(url: string, data: Record<string, string>) {
  let out = url
  for (const [key, value] of Object.entries(data)) {
    out = out.replaceAll(`{{${key}}}`, encodeURIComponent(value))
  }
  return out
}

export async function fireAffiliatePostbacks(
  affiliateRef: string,
  payload: AffiliatePostbackPayload
): Promise<void> {
  const config = parsePostbackConfig(process.env.AFFILIATE_POSTBACKS)
  if (!config) return

  const urls = normalizeUrls(config[affiliateRef] ?? config["*"])
  if (urls.length === 0) return

  const data = {
    affiliate_ref: affiliateRef,
    session_id: payload.sessionId,
    amount: payload.amount ? String(payload.amount) : "",
    currency: payload.currency || "",
    product: payload.product || "",
    customer_email: payload.customerEmail || ""
  }

  const body = JSON.stringify({ affiliateRef, ...payload })

  for (const rawUrl of urls) {
    const url = interpolateUrl(rawUrl, data)
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        signal: AbortSignal.timeout(8_000)
      })
      if (!res.ok) {
        const detail = await res.text().catch(() => "")
        throw new Error(`Affiliate postback failed (${res.status}): ${detail}`)
      }
    } catch (err) {
      throw err
    }
  }
}
