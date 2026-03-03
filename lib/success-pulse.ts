import Stripe from "stripe"

type SuccessPulsePayload = {
  sessionId: string
  amount: number | null
  currency: string | null
  product: string | null
  customerEmail: string | null
  country: string | null
  mode: string | null
  createdAt: string
}

function resolvePulseUrl(raw: string): string | null {
  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    return raw
  }
  const base = process.env.NEXT_PUBLIC_SITE_URL
  if (!base) return null
  return `${base.replace(/\/$/, "")}/${raw.replace(/^\/+/, "")}`
}

export async function sendSuccessPulse(session: Stripe.Checkout.Session): Promise<boolean> {
  const rawUrl = process.env.SUCCESS_PULSE_URL
  if (!rawUrl) return false
  const pulseUrl = resolvePulseUrl(rawUrl)
  if (!pulseUrl) return false

  const payload: SuccessPulsePayload = {
    sessionId: session.id,
    amount: session.amount_total ?? null,
    currency: session.currency ?? null,
    product: (session.metadata?.product as string) || null,
    customerEmail: session.customer_details?.email || session.customer_email || null,
    country: session.customer_details?.address?.country ?? null,
    mode: session.mode ?? null,
    createdAt: session.created ? new Date(session.created * 1000).toISOString() : new Date().toISOString(),
  }

  try {
    const res = await fetch(pulseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8_000),
    })
    return res.ok
  } catch {
    return false
  }
}
