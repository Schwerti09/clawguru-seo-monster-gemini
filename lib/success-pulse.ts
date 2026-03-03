import type Stripe from "stripe"

export async function sendSuccessPulse(session: Stripe.Checkout.Session): Promise<void> {
  const webhookUrl = process.env.SUCCESS_PULSE_URL || process.env.SUCCESS_PULSE_WEBHOOK
  if (!webhookUrl) return

  const createdAt = session.created ? new Date(session.created * 1000).toISOString() : new Date().toISOString()
  const payload = {
    sessionId: session.id,
    createdAt,
    amount: session.amount_total ?? null,
    currency: session.currency ?? null,
    product: (session.metadata?.product as string) || null,
    affiliateRef: session.metadata?.affiliate_ref ?? null,
    customerEmail: session.customer_details?.email || session.customer_email || null
  }

  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(8_000)
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => "")
    throw new Error(`Success pulse failed (${res.status}): ${detail}`)
  }
}
