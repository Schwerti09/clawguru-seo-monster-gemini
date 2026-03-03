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

  // "*" acts as a default catch-all config for affiliates without a specific entry.
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

  const body = JSON.stringify(payload)

  const results = await Promise.allSettled(
    urls.map(async (rawUrl) => {
      const url = interpolateUrl(rawUrl, data)
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
    })
  )

  const failures = results.filter((r): r is PromiseRejectedResult => r.status === "rejected")
  if (failures.length > 0) {
    const message = failures
      .map((failure) => (failure.reason instanceof Error ? failure.reason.message : String(failure.reason)))
      .join("; ")
    throw new Error(message || "Affiliate postback failed")
  }
}
