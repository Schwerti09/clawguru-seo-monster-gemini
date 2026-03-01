import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { stripe } from "@/lib/stripe"
import { signAccessToken, AccessPlan } from "@/lib/access-token"
import { sendEmail } from "@/lib/email"
import {
  META_AFF_CODE,
  META_AFF_CONNECT_ID,
  META_AFF_HOLD_UNTIL,
  calcCommission,
  holdUntilTimestamp,
} from "@/lib/affiliate"

export const runtime = "nodejs"

async function readRawBody(req: NextRequest) {
  // NextRequest supports arrayBuffer()
  const ab = await req.arrayBuffer()
  return Buffer.from(ab)
}


function planFromSession(session: Stripe.Checkout.Session): AccessPlan {
  const product = (session.metadata?.product || "").toLowerCase()
  if (product === "team") return "team"
  if (product === "daypass") return "daypass"
  return "pro"
}

function tokenExp(plan: AccessPlan, now: number) {
  if (plan === "daypass") return now + 60 * 60 * 24
  return now + 60 * 60 * 24 * 30
}

function emailHtml({
  url,
  plan,
  support,
  dashboardUrl,
  base,
  sessionId
}: {
  url: string
  plan: string
  support: string
  dashboardUrl: string
  base: string
  sessionId?: string
}) {
  const sessionParam = sessionId ? `&session_id=${encodeURIComponent(sessionId)}` : ""
  const sprintUrl = `${base}/api/download?key=sprint-pack${sessionParam}`
  const incidentUrl = `${base}/api/download?key=incident-kit${sessionParam}`
  return `
  <div style="font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial; line-height: 1.5; color:#111;">
    <h2 style="margin:0 0 10px 0;">ClawGuru Zugriff: <span style="color:#0ea5e9;">aktivieren</span></h2>
    <p style="margin:0 0 14px 0;">Dein Plan: <b>${plan}</b></p>
    <p style="margin:0 0 18px 0;">
      Öffne diesen Magic Link. Er setzt deinen Zugang (Cookie) und bringt dich direkt ins Dashboard.
    </p>
    <p style="margin:18px 0;">
      <a href="${url}" style="display:inline-block; padding:12px 18px; background:#111827; color:#fff; text-decoration:none; border-radius:12px; font-weight:800;">
        Zugriff aktivieren &#8594; Dashboard
      </a>
    </p>
    <p style="margin:0 0 10px 0; font-size:12px; color:#555;">
      Direktlink (falls Button nicht klickbar):<br/>
      <a href="${url}">${url}</a>
    </p>
    <hr style="border:none; border-top:1px solid #e5e7eb; margin:18px 0;" />
    <p style="margin:0 0 8px 0; font-weight:700;">Deine Downloads (nach Aktivierung verfügbar):</p>
    <ul style="margin:0 0 14px 0; padding-left:18px; font-size:13px; color:#333;">
      <li style="margin-bottom:6px;">
        <a href="${sprintUrl}" style="color:#0ea5e9; font-weight:700;">Hardening Sprint Pack (PDF)</a>
        &ndash; 30&ndash;60 Min. Hardening, Copy/Paste Templates, Checkliste
      </li>
      <li>
        <a href="${incidentUrl}" style="color:#0ea5e9; font-weight:700;">Incident Kit Pro (ZIP)</a>
        &ndash; Key-Rotation, Firewall-Baselines, Cloudflare-WAF, Runbook
      </li>
    </ul>
    <hr style="border:none; border-top:1px solid #e5e7eb; margin:18px 0;" />
    <p style="margin:0; font-size:12px; color:#555;">
      Support: ${support}<br/>
      Dashboard: <a href="${dashboardUrl}">${dashboardUrl}</a>
    </p>
  </div>`
}

async function sendAccessEmail(session: Stripe.Checkout.Session) {
  const email = session.customer_details?.email || session.customer_email
  if (!email) return

  const plan = planFromSession(session)
  const now = Math.floor(Date.now() / 1000)

  const customerId = typeof session.customer === "string" ? session.customer : (session.customer as { id: string } | null)?.id
  if (!customerId) return

  let subscriptionId: string | undefined = undefined
  if (plan === "pro" || plan === "team") {
    subscriptionId = typeof session.subscription === "string" ? session.subscription : (session.subscription as { id: string } | null)?.id
    if (!subscriptionId) return
  }

  const token = signAccessToken({
    v: 1,
    plan,
    customerId,
    subscriptionId,
    iat: now,
    exp: tokenExp(plan, now)
  })

  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  const url = `${base}/api/auth/recover?token=${encodeURIComponent(token)}`
  const dash = `${base}/dashboard`
  const support = process.env.SUPPORT_EMAIL || process.env.EMAIL_REPLY_TO || process.env.EMAIL_FROM || "support@clawguru.org"

  await sendEmail({
    to: email,
    subject: "Dein ClawGuru Zugang (Magic Link)",
    html: emailHtml({ url, plan, support, dashboardUrl: dash, base, sessionId: session.id })
  })
}

/**
 * Handle invoice.paid – calculate and record affiliate commission.
 *
 * Flow:
 *  1. Retrieve the Stripe Customer to find the stored affiliate code.
 *  2. Look up the affiliate's Stripe Connect account ID (stored in their
 *     customer metadata under META_AFF_CONNECT_ID or via env fallback).
 *  3. Calculate commission (20% recurring / 30% day-pass).
 *  4. Create a Stripe Transfer to the affiliate's Connect account with a
 *     30-day hold timestamp stored in metadata.
 *
 * Note: Stripe Connect must be enabled.  Set STRIPE_AFFILIATE_CONNECT_ACCOUNT
 * as a fallback for testing (single-affiliate mode).
 */
async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const amountPaid = invoice.amount_paid
  if (!amountPaid || amountPaid <= 0) return

  // Determine customer
  const customerId =
    typeof invoice.customer === "string"
      ? invoice.customer
      : (invoice.customer as { id: string } | null)?.id
  if (!customerId) return

  const customer = await stripe.customers.retrieve(customerId)
  if (customer.deleted) return

  const affCode = customer.metadata?.[META_AFF_CODE]
  if (!affCode) return // No affiliate attached – nothing to do

  // Look up the affiliate's Stripe Connect account.
  // In a full multi-affiliate setup this comes from your affiliates DB/table.
  // Here we use a per-code env var (STRIPE_AFF_<CODE>_CONNECT) or the global
  // fallback STRIPE_AFFILIATE_CONNECT_ACCOUNT.
  const connectAccountId =
    customer.metadata?.[META_AFF_CONNECT_ID] ||
    process.env[`STRIPE_AFF_${affCode.toUpperCase()}_CONNECT`] ||
    process.env.STRIPE_AFFILIATE_CONNECT_ACCOUNT

  if (!connectAccountId) {
    // Affiliate code exists but no Connect account registered – skip transfer.
    console.warn(`[affiliate] No Connect account for code "${affCode}". Transfer skipped.`)
    return
  }

  // Determine product type for commission rate.
  // Prefer checking the subscription presence (reliable) over billing_reason
  // which can have values like "manual" or "subscription_update" that don't
  // clearly indicate the product type.
  const subscriptionId =
    typeof invoice.subscription === "string"
      ? invoice.subscription
      : (invoice.subscription as { id: string } | null)?.id
  const subscriptionPriceId = invoice.lines?.data?.[0]?.price?.id
  const dayPassPriceId = process.env.STRIPE_PRICE_DAYPASS
  const isRecurring = !!subscriptionId ||
    (!!subscriptionPriceId && subscriptionPriceId !== dayPassPriceId)
  const productType = isRecurring ? "recurring" : "daypass"
  const commissionAmount = calcCommission(amountPaid, productType)
  if (commissionAmount <= 0) return

  // Create the Stripe Transfer (held 30 days for chargebacks/refunds)
  const holdUntil = holdUntilTimestamp(30)
  try {
    await stripe.transfers.create({
      amount: commissionAmount,
      currency: invoice.currency || "eur",
      destination: connectAccountId,
      // Link to the invoice so it's auditable
      source_transaction: typeof invoice.charge === "string" ? invoice.charge : undefined,
      metadata: {
        [META_AFF_CODE]: affCode,
        [META_AFF_HOLD_UNTIL]: String(holdUntil),
        invoice_id: invoice.id,
        customer_id: customerId,
        product_type: productType,
      },
      description: `Affiliate commission – ${affCode} – ${productType} (hold until ${new Date(holdUntil * 1000).toISOString().split("T")[0]})`,
    })
    console.info(`[affiliate] Commission of ${commissionAmount} ${invoice.currency} created for ${affCode}`)
  } catch (err) {
    // Log but don't fail the webhook – Stripe will retry on 5xx only
    console.error("[affiliate] Transfer failed:", err)
  }
}

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    return NextResponse.json({ error: "Missing STRIPE_WEBHOOK_SECRET" }, { status: 500 })
  }

  const sig = req.headers.get("stripe-signature")
  if (!sig) return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 })

  let event: Stripe.Event
  try {
    const raw = await readRawBody(req)
    event = stripe.webhooks.constructEvent(raw, sig, webhookSecret)
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session

      // Ensure paid/complete
      const paid = session.payment_status === "paid" || session.status === "complete"
      if (paid) {
        // If we need subscription/customer ids reliably, retrieve expanded session
        const full = await stripe.checkout.sessions.retrieve(session.id, {
          expand: ["customer", "subscription"]
        })
        await sendAccessEmail(full)

        // Propagate the affiliate code from the session onto the Stripe Customer
        // so it is available when future invoice.paid events fire.
        const affCode = full.metadata?.[META_AFF_CODE] || full.client_reference_id
        const customerId =
          typeof full.customer === "string"
            ? full.customer
            : (full.customer as { id: string } | null)?.id
        if (affCode && customerId) {
          await stripe.customers.update(customerId, {
            metadata: { [META_AFF_CODE]: affCode }
          })
        }
      }
    }

    // ── Affiliate commission on every successful invoice payment ──────────
    if (event.type === "invoice.paid") {
      await handleInvoicePaid(event.data.object as Stripe.Invoice)
    }

    // optional: you can add cancellation/failed payment mails later
    return NextResponse.json({ received: true })
  } catch {
    return NextResponse.json({ received: true })
  }
}
