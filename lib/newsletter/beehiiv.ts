/**
 * Beehiiv API client — minimal wrapper for subscription sync.
 * Docs: https://developers.beehiiv.com/docs/v2/endpoints
 *
 * Required env vars:
 *   BEEHIIV_API_KEY        — Bearer token from Beehiiv → Settings → Integrations → API
 *   BEEHIIV_PUBLICATION_ID — starts with "pub_..." (Settings → Publication)
 *
 * Optional:
 *   BEEHIIV_WELCOME_EMAIL  — "true" to trigger Beehiiv's welcome automation (default: true)
 */

export interface BeehiivSubscribeInput {
  email: string
  source?: string
  locale?: string
  referral_code?: string
}

export interface BeehiivSubscribeResult {
  ok: boolean
  status: number
  data?: any
  error?: string
  skipped?: boolean
}

export function isBeehiivConfigured(): boolean {
  return Boolean(process.env.BEEHIIV_API_KEY && process.env.BEEHIIV_PUBLICATION_ID)
}

export async function subscribeToBeehiiv(input: BeehiivSubscribeInput): Promise<BeehiivSubscribeResult> {
  if (!isBeehiivConfigured()) {
    return { ok: false, status: 0, skipped: true, error: "beehiiv_not_configured" }
  }

  const apiKey = process.env.BEEHIIV_API_KEY!
  const pubId = process.env.BEEHIIV_PUBLICATION_ID!
  const sendWelcome = (process.env.BEEHIIV_WELCOME_EMAIL ?? "true").toLowerCase() !== "false"

  const url = `https://api.beehiiv.com/v2/publications/${pubId}/subscriptions`
  const body = {
    email: input.email,
    reactivate_existing: true,
    send_welcome_email: sendWelcome,
    utm_source: input.source ?? "website",
    utm_medium: "email_capture",
    utm_campaign: input.locale ?? "de",
    referring_site: "https://clawguru.org",
    custom_fields: [
      { name: "Locale", value: input.locale ?? "de" },
      { name: "Source", value: input.source ?? "website" },
    ],
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    })
    clearTimeout(timeout)

    const data = await res.json().catch(() => null)
    if (!res.ok) {
      return { ok: false, status: res.status, data, error: data?.errors?.[0]?.message ?? `http_${res.status}` }
    }
    return { ok: true, status: res.status, data }
  } catch (e: any) {
    return { ok: false, status: 0, error: e?.name === "AbortError" ? "timeout" : e?.message ?? "network_error" }
  }
}
