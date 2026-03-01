import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { stripe } from "@/lib/stripe"
import { signAccessToken, AccessPlan } from "@/lib/access-token"
import { sendEmail } from "@/lib/email"

export const runtime = "nodejs"

async function readRawBody(req: NextRequest) {
  // NextRequest supports arrayBuffer()
  const ab = await req.arrayBuffer()
  return Buffer.from(ab)
}

// ---------------------------------------------------------------------------
// invoice.paid – send finalized PDF invoice + self-service billing-portal link
// ---------------------------------------------------------------------------
async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const email = invoice.customer_email
  if (!email) return

  const customerId =
    typeof invoice.customer === "string" ? invoice.customer : (invoice.customer as { id: string } | null)?.id
  if (!customerId) return

  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

  // Create a Stripe Billing Portal session for self-service invoice downloads
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${base}/dashboard`
  })

  const invoiceNumber = invoice.number || invoice.id
  const pdfUrl = invoice.invoice_pdf || ""
  const hostedUrl = invoice.hosted_invoice_url || portalSession.url
  const support =
    process.env.SUPPORT_EMAIL || process.env.EMAIL_REPLY_TO || process.env.EMAIL_FROM || "support@clawguru.org"

  const html = `
  <div style="font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial; line-height: 1.5; color:#111;">
    <h2 style="margin:0 0 10px 0;">Deine ClawGuru Rechnung <span style="color:#0ea5e9;">#${invoiceNumber}</span></h2>
    <p style="margin:0 0 14px 0;">Vielen Dank für deine Zahlung! Anbei deine steuerlich konforme Rechnung.</p>
    ${
      pdfUrl
        ? `<p style="margin:0 0 18px 0;">
        <a href="${pdfUrl}" style="display:inline-block; padding:12px 18px; background:#111827; color:#fff; text-decoration:none; border-radius:12px; font-weight:800;">
          PDF-Rechnung herunterladen &#8594;
        </a>
      </p>`
        : ""
    }
    <p style="margin:0 0 18px 0;">
      <a href="${hostedUrl}" style="display:inline-block; padding:12px 18px; background:#0ea5e9; color:#fff; text-decoration:none; border-radius:12px; font-weight:800;">
        Self-Service Portal – alle Rechnungen (12 Monate) &#8594;
      </a>
    </p>
    <p style="margin:0; font-size:12px; color:#555;">
      Fragen? ${support}
    </p>
  </div>`

  await sendEmail({
    to: email,
    subject: `ClawGuru Rechnung #${invoiceNumber}`,
    html
  })
}

// ---------------------------------------------------------------------------
// charge.refunded – log / mark the related invoice as a credit note
// ---------------------------------------------------------------------------
async function handleChargeRefunded(charge: Stripe.Charge) {
  const invoiceId =
    typeof charge.invoice === "string" ? charge.invoice : (charge.invoice as { id: string } | null)?.id
  if (!invoiceId) return

  // Retrieve the original invoice so we can reference it in the credit note
  const invoice = await stripe.invoices.retrieve(invoiceId)

  const refundedAmount = charge.amount_refunded // in smallest currency unit
  const currency = charge.currency.toUpperCase()

  // Create a Stripe Credit Note for the refunded amount so that the
  // accounting ledger stays balanced (e.g. DATEV / QuickBooks month-end).
  // Stripe only supports credit notes for invoices in "paid" or "open" state.
  if (invoice.status === "paid") {
    // Derive reason from charge metadata when available, fall back to a general value
    type CreditNoteReason = "duplicate" | "fraudulent" | "order_change" | "product_unsatisfactory"
    const validReasons: CreditNoteReason[] = [
      "duplicate",
      "fraudulent",
      "order_change",
      "product_unsatisfactory"
    ]
    const metaReason = charge.metadata?.refund_reason as CreditNoteReason | undefined
    const reason: CreditNoteReason =
      metaReason && validReasons.includes(metaReason) ? metaReason : "product_unsatisfactory"

    await stripe.creditNotes.create({
      invoice: invoiceId,
      memo: `Rückerstattung / Refund – Charge ${charge.id} (${refundedAmount / 100} ${currency})`,
      reason,
      amount: refundedAmount
    })
  }

  // Optionally notify the customer about the refund
  const email =
    typeof charge.billing_details?.email === "string" ? charge.billing_details.email : undefined
  if (!email) return

  const support =
    process.env.SUPPORT_EMAIL || process.env.EMAIL_REPLY_TO || process.env.EMAIL_FROM || "support@clawguru.org"

  const html = `
  <div style="font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial; line-height: 1.5; color:#111;">
    <h2 style="margin:0 0 10px 0;">Rückerstattung bestätigt</h2>
    <p style="margin:0 0 14px 0;">Deine Rückerstattung von <b>${(refundedAmount / 100).toFixed(2)} ${currency}</b> wurde verarbeitet.</p>
    <p style="margin:0 0 14px 0;">Eine Gutschrift wurde ausgestellt. Die Buchführung wurde entsprechend aktualisiert.</p>
    <p style="margin:0; font-size:12px; color:#555;">Support: ${support}</p>
  </div>`

  await sendEmail({
    to: email,
    subject: "ClawGuru – Rückerstattung bestätigt",
    html
  })
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
      }
    }

    // Send finalized PDF invoice + self-service billing-portal link
    if (event.type === "invoice.paid") {
      const invoice = event.data.object as Stripe.Invoice
      await handleInvoicePaid(invoice)
    }

    // Create a Stripe Credit Note for refunded charges so accounting stays balanced
    if (event.type === "charge.refunded") {
      const charge = event.data.object as Stripe.Charge
      await handleChargeRefunded(charge)
    }

    return NextResponse.json({ received: true })
  } catch {
    return NextResponse.json({ received: true })
  }
}
