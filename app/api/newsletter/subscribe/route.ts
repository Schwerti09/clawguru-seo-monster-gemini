/**
 * POST /api/newsletter/subscribe
 *
 * GDPR-compliant newsletter subscription endpoint.
 * Stores email + consent metadata in PostgreSQL (newsletter_subscribers table).
 * Auto-creates table if it doesn't exist.
 *
 * Body: { email: string, source?: string, locale?: string }
 * Rate-limited: 5 req/min per IP.
 */

import { NextRequest, NextResponse } from "next/server"
import { dbQuery } from "@/lib/db"
import { checkRateLimit } from "@/lib/rate-limit"
import { isBeehiivConfigured, subscribeToBeehiiv } from "@/lib/newsletter/beehiiv"

export const runtime = "nodejs"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const CREATE_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    source TEXT DEFAULT 'website',
    locale TEXT DEFAULT 'de',
    consent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ip_hash TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`

function hashIp(ip: string): string {
  // Simple one-way hash — no PII stored
  const crypto = require("crypto") as typeof import("crypto")
  return crypto.createHash("sha256").update(ip + (process.env.NEWSLETTER_SECRET || "salt")).digest("hex").slice(0, 16)
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown"

  // Rate limit: 5 per minute
  const rl = checkRateLimit(ip, undefined, { hardLimitPerMinute: 5 })
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "rate_limited", message: "Zu viele Anfragen. Bitte warte kurz." },
      { status: 429 }
    )
  }

  let body: { email?: string; source?: string; locale?: string }
  try {
    body = (await req.json()) as { email?: string; source?: string; locale?: string }
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 })
  }

  const email = (body.email ?? "").trim().toLowerCase()
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "invalid_email", message: "Bitte gib eine gültige E-Mail-Adresse ein." },
      { status: 400 }
    )
  }

  const source = (body.source ?? "website").slice(0, 50)
  const locale = (body.locale ?? "de").slice(0, 5)

  try {
    // Ensure table exists
    await dbQuery(CREATE_TABLE_SQL)

    // Upsert — if already subscribed, update status to active
    await dbQuery(
      `INSERT INTO newsletter_subscribers (email, source, locale, ip_hash, consent_at, status)
       VALUES ($1, $2, $3, $4, NOW(), 'active')
       ON CONFLICT (email) DO UPDATE SET
         status = 'active',
         source = EXCLUDED.source,
         locale = EXCLUDED.locale,
         consent_at = NOW()`,
      [email, source, locale, hashIp(ip)]
    )

    console.log(`[newsletter/subscribe] New subscriber: ${email} (source: ${source}, locale: ${locale})`)

    // Fire-and-forget Beehiiv sync — never block the response
    if (isBeehiivConfigured()) {
      subscribeToBeehiiv({ email, source, locale })
        .then((r) => {
          if (!r.ok && !r.skipped) {
            console.warn(`[newsletter/subscribe] Beehiiv sync failed for ${email}:`, r.error)
          }
        })
        .catch((e) => console.warn(`[newsletter/subscribe] Beehiiv sync threw:`, e))
    }

    return NextResponse.json({ ok: true, message: "Erfolgreich angemeldet!" })
  } catch (err) {
    console.error("[newsletter/subscribe] DB error:", err)
    return NextResponse.json(
      { error: "server_error", message: "Anmeldung fehlgeschlagen. Bitte versuche es später erneut." },
      { status: 500 }
    )
  }
}
