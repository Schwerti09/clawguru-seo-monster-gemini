/**
 * AI-Powered Security Newsletter Pipeline
 *
 * Responsibilities:
 *  1. Data Ingestion  – pull Critical/High CVEs from the NIST NVD API
 *  2. AI Summarization – send them to Gemini / OpenAI and get an IT-Admin-friendly summary
 *  3. HTML Template  – responsive, dark-mode email with freemium upsell & one-click unsubscribe
 *  4. Stripe recipients  – collect all customer emails (active + cancelled)
 *  5. Unsubscribe tokens – HMAC-signed, GDPR-compliant
 */

import crypto from "crypto"
import { stripe } from "@/lib/stripe"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CveItem = {
  id: string
  description: string
  severity: string
  cvssScore: number | null
  published: string
  references: string[]
}

export type NewsletterSendResult = {
  sent: number
  failed: number
  skipped: number
}

// ---------------------------------------------------------------------------
// 1. Data Ingestion – NIST NVD API
// ---------------------------------------------------------------------------

/**
 * Fetch the most recently published Critical/High CVEs from the NIST NVD API.
 * Returns up to `limit` items sorted by publication date (newest first).
 *
 * Docs: https://nvd.nist.gov/developers/vulnerabilities
 */
export async function fetchCriticalCVEs(limit = 10): Promise<CveItem[]> {
  const base = "https://services.nvd.nist.gov/rest/json/cves/2.0"

  // Pull the last 7 days of CVEs
  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const fmt = (d: Date) => d.toISOString().split(".")[0] + ".000"

  const params = new URLSearchParams({
    pubStartDate: fmt(weekAgo),
    pubEndDate: fmt(now),
    resultsPerPage: String(Math.min(limit * 4, 100)), // fetch extra so we can filter
    startIndex: "0",
  })

  const nvdApiKey = process.env.NVD_API_KEY
  const headers: Record<string, string> = { "Content-Type": "application/json" }
  if (nvdApiKey) headers["apiKey"] = nvdApiKey

  const res = await fetch(`${base}?${params.toString()}`, {
    headers,
    // NVD asks for ≥6 s between requests without API key
    signal: AbortSignal.timeout(15_000),
  })

  if (!res.ok) {
    throw new Error(`NVD API error ${res.status}: ${await res.text().catch(() => "")}`)
  }

  type NvdResponse = {
    vulnerabilities?: Array<{
      cve: {
        id: string
        published: string
        descriptions?: Array<{ lang: string; value: string }>
        metrics?: {
          cvssMetricV31?: Array<{ cvssData?: { baseScore?: number; baseSeverity?: string } }>
          cvssMetricV3?: Array<{ cvssData?: { baseScore?: number; baseSeverity?: string } }>
          cvssMetricV2?: Array<{ cvssData?: { baseScore?: number }; baseSeverity?: string }>
        }
        references?: Array<{ url: string }>
      }
    }>
  }

  const data = (await res.json()) as NvdResponse
  const vulns = data.vulnerabilities ?? []

  const items: CveItem[] = []

  for (const v of vulns) {
    const cve = v.cve

    // Extract severity & score (prefer V3.1 → V3 → V2)
    const metricsV31 = cve.metrics?.cvssMetricV31?.[0]?.cvssData
    const metricsV3 = cve.metrics?.cvssMetricV3?.[0]?.cvssData
    const metricsV2 = cve.metrics?.cvssMetricV2?.[0]

    const severity: string =
      metricsV31?.baseSeverity ??
      metricsV3?.baseSeverity ??
      metricsV2?.baseSeverity ??
      "UNKNOWN"

    const cvssScore: number | null =
      metricsV31?.baseScore ?? metricsV3?.baseScore ?? metricsV2?.cvssData?.baseScore ?? null

    if (!["CRITICAL", "HIGH"].includes(severity.toUpperCase())) continue

    const description =
      cve.descriptions?.find((d) => d.lang === "en")?.value ?? "No description available."

    items.push({
      id: cve.id,
      description,
      severity: severity.toUpperCase(),
      cvssScore,
      published: cve.published,
      references: (cve.references ?? []).slice(0, 3).map((r) => r.url),
    })

    if (items.length >= limit) break
  }

  return items
}

// ---------------------------------------------------------------------------
// 2. AI Summarization
// ---------------------------------------------------------------------------

type SummarizedThreat = {
  id: string
  severity: string
  cvssScore: number | null
  summary: string
}

/**
 * Send up to 5 CVEs to the configured LLM (Gemini or OpenAI) and return
 * structured IT-Admin-friendly summaries with mitigation steps.
 */
export async function summarizeThreats(cves: CveItem[]): Promise<SummarizedThreat[]> {
  const top5 = cves.slice(0, 5)
  if (top5.length === 0) return []

  // The prompt is intentionally in German – ClawGuru targets German-speaking IT admins.
  const prompt = [
    "Fasse diese Schwachstellen für einen IT-Admin zusammen.",
    "Erkläre kurz das Risiko und gib eine 3-Schritt-Anleitung zur Behebung (Mitigation).",
    "Nutze einen professionellen, aber direkten Ton.",
    "Antworte in JSON-Array-Form: [{\"id\":\"CVE-...\",\"summary\":\"...\"}]",
    "Keine Erklärungen außerhalb des JSON.",
    "",
    "Schwachstellen:",
    ...top5.map(
      (c) =>
        `- ${c.id} (${c.severity}, CVSS ${c.cvssScore ?? "n/a"}): ${c.description.slice(0, 600)}`
    ),
  ].join("\n")

  let rawText = ""
  const provider = (process.env.AI_PROVIDER || "openai").toLowerCase()

  if (provider === "gemini") {
    const geminiKey = process.env.GEMINI_API_KEY
    if (!geminiKey) throw new Error("GEMINI_API_KEY missing")

    const model = process.env.GEMINI_MODEL || "gemini-1.5-flash"
    const base = (
      process.env.GEMINI_BASE_URL || "https://generativelanguage.googleapis.com/v1beta"
    ).replace(/\/$/, "")
    const url = `${base}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(geminiKey)}`

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 1800 },
      }),
      signal: AbortSignal.timeout(30_000),
    })

    if (!res.ok) throw new Error(`Gemini error ${res.status}`)
    const data = (await res.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
    }
    rawText =
      data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? ""
  } else {
    // OpenAI (default)
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) throw new Error("OPENAI_API_KEY missing")

    const model = process.env.OPENAI_MODEL || "gpt-4o-mini"
    const base = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "")

    const res = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
        max_tokens: 1800,
      }),
      signal: AbortSignal.timeout(30_000),
    })

    if (!res.ok) throw new Error(`OpenAI error ${res.status}`)
    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>
    }
    rawText = data.choices?.[0]?.message?.content ?? ""
  }

  // Parse JSON from AI response (may be wrapped in markdown code fences)
  const jsonMatch = rawText.match(/\[[\s\S]*\]/)
  if (!jsonMatch) return top5.map((c) => ({ id: c.id, severity: c.severity, cvssScore: c.cvssScore, summary: c.description.slice(0, 300) }))

  type AiRow = { id?: string; summary?: string }
  const parsed = JSON.parse(jsonMatch[0]) as AiRow[]

  return top5.map((cve) => {
    const row = parsed.find((r) => r.id === cve.id)
    return {
      id: cve.id,
      severity: cve.severity,
      cvssScore: cve.cvssScore,
      summary: row?.summary ?? cve.description.slice(0, 300),
    }
  })
}

// ---------------------------------------------------------------------------
// 3. HTML Email Template
// ---------------------------------------------------------------------------

type NewsletterTemplateOpts = {
  threats: SummarizedThreat[]
  /** base URL, e.g. https://clawguru.org */
  siteUrl: string
  /** pre-signed unsubscribe URL */
  unsubscribeUrl: string
  /** true → show Day Pass CTA, false → show Pro check link */
  showDayPassCta?: boolean
  /** ISO week string, e.g. "KW 22 / 2026" */
  weekLabel?: string
}

export function buildNewsletterHtml(opts: NewsletterTemplateOpts): string {
  const { threats, siteUrl, unsubscribeUrl, showDayPassCta = true, weekLabel = "" } = opts

  const severityColor = (s: string) =>
    s === "CRITICAL" ? "#ef4444" : "#f97316"

  const threatCards = threats
    .map((t) => {
      const checkUrl = `${siteUrl}/check?cve=${encodeURIComponent(t.id)}`
      const ctaBlock = showDayPassCta
        ? `<a href="${siteUrl}/pricing?product=daypass&utm_source=newsletter&utm_medium=email&utm_campaign=cve_alert"
              style="display:inline-block;background:linear-gradient(to right,#22d3ee,#8b5cf6);color:#fff;font-weight:900;padding:8px 18px;border-radius:10px;text-decoration:none;font-size:13px;margin-top:8px">
              🔑 24h Day Pass – Jetzt prüfen →
           </a>`
        : `<a href="${checkUrl}&utm_source=newsletter&utm_medium=email"
              style="display:inline-block;background:#1e3a5f;color:#22d3ee;font-weight:700;padding:8px 18px;border-radius:10px;text-decoration:none;font-size:13px;margin-top:8px;border:1px solid #22d3ee44">
              🔍 Infrastruktur prüfen →
           </a>`

      return `
      <div style="background:#111827;border:1px solid #374151;border-radius:14px;padding:20px;margin-bottom:16px">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;flex-wrap:wrap">
          <span style="font-family:monospace;font-size:13px;color:#9ca3af">${t.id}</span>
          <span style="background:${severityColor(t.severity)}22;color:${severityColor(t.severity)};font-size:11px;font-weight:800;padding:2px 8px;border-radius:6px;border:1px solid ${severityColor(t.severity)}55">${t.severity}${t.cvssScore ? ` · CVSS ${t.cvssScore}` : ""}</span>
        </div>
        <p style="color:#d1d5db;font-size:14px;line-height:1.65;margin:0 0 12px 0">${escapeHtml(t.summary)}</p>
        <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
          ${ctaBlock}
          <a href="${siteUrl}/runbooks?q=${encodeURIComponent(t.id)}&utm_source=newsletter&utm_medium=email"
             style="color:#9ca3af;font-size:12px;text-decoration:underline">Runbook ansehen</a>
        </div>
      </div>`
    })
    .join("\n")

  const title = weekLabel ? `🛡️ ClawGuru Security Report – ${weekLabel}` : "🛡️ ClawGuru Security Report"

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="color-scheme" content="dark light" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#090909;font-family:system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#090909">
    <tr><td align="center" style="padding:32px 16px">
      <table role="presentation" width="100%" style="max-width:620px">

        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#0f172a,#1a1040);border-radius:16px 16px 0 0;padding:28px 32px;border-bottom:1px solid #22d3ee33">
          <div style="font-size:13px;color:#22d3ee;font-weight:700;letter-spacing:.05em;text-transform:uppercase;margin-bottom:6px">ClawGuru · Security Intel</div>
          <h1 style="margin:0;font-size:22px;font-weight:900;color:#fff;line-height:1.3">
            Wöchentlicher Security-Report
            ${weekLabel ? `<span style="color:#9ca3af;font-weight:400;font-size:16px"> · ${weekLabel}</span>` : ""}
          </h1>
          <p style="margin:8px 0 0 0;color:#9ca3af;font-size:14px">
            Top ${threats.length} kritische &amp; hohe Schwachstellen – automatisch zusammengefasst für IT-Admins.
          </p>
        </td></tr>

        <!-- Body -->
        <tr><td style="background:#0a0a0a;padding:28px 32px">

          <p style="color:#9ca3af;font-size:13px;margin:0 0 20px 0">
            Diese Schwachstellen wurden in den letzten 7 Tagen veröffentlicht und als <strong style="color:#ef4444">Critical</strong> oder <strong style="color:#f97316">High</strong> eingestuft.
          </p>

          ${threatCards}

          <!-- Free vs Pro separator -->
          <div style="border:1px dashed #374151;border-radius:12px;padding:20px;margin-top:24px;text-align:center">
            <div style="color:#22d3ee;font-weight:800;font-size:15px;margin-bottom:6px">🔒 Fertige Mitigation-Runbooks</div>
            <p style="color:#6b7280;font-size:13px;margin:0 0 12px 0">
              Die vollständigen Schritt-für-Schritt-Runbooks zur Behebung jeder Lücke sind exklusiv für Pro-Nutzer verfügbar.
            </p>
            ${showDayPassCta
              ? `<a href="${siteUrl}/pricing?product=daypass&utm_source=newsletter&utm_medium=email&utm_campaign=runbook_cta"
                    style="display:inline-block;background:linear-gradient(to right,#22d3ee,#8b5cf6);color:#fff;font-weight:900;padding:12px 24px;border-radius:12px;text-decoration:none;font-size:14px">
                    🔑 Day Pass – 24h Vollzugang für €4.99 →
                 </a>`
              : `<a href="${siteUrl}/runbooks?utm_source=newsletter&utm_medium=email&utm_campaign=runbook_cta"
                    style="display:inline-block;background:linear-gradient(to right,#22d3ee,#8b5cf6);color:#fff;font-weight:900;padding:12px 24px;border-radius:12px;text-decoration:none;font-size:14px">
                    📚 Alle Runbooks ansehen →
                 </a>`}
          </div>

        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#0f0f0f;border-radius:0 0 16px 16px;border-top:1px solid #1f2937;padding:20px 32px;text-align:center">
          <p style="margin:0 0 8px 0;color:#4b5563;font-size:11px;line-height:1.6">
            ClawGuru · <a href="${siteUrl}" style="color:#4b5563">${siteUrl.replace(/^https?:\/\//, "")}</a>
            &nbsp;·&nbsp;
            <a href="${siteUrl}/datenschutz" style="color:#4b5563">Datenschutz</a>
            &nbsp;·&nbsp;
            <a href="${unsubscribeUrl}" style="color:#4b5563">Abmelden (One-Click)</a>
          </p>
          <p style="margin:0;color:#374151;font-size:10px">
            Du erhältst diese E-Mail als Kunde von ClawGuru. Klicke auf „Abmelden", um dich jederzeit abzumelden (DSGVO/GDPR).
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

// ---------------------------------------------------------------------------
// 4. Stripe customer list
// ---------------------------------------------------------------------------

export type StripeCustomerRecord = {
  email: string
  customerId: string
  status: "active" | "canceled" | "other"
}

/**
 * Collect all unique customer emails from Stripe (active subscriptions first,
 * then canceled/other). Used as the newsletter recipient list.
 */
export async function getStripeCustomerEmails(): Promise<StripeCustomerRecord[]> {
  const seen = new Set<string>()
  const records: StripeCustomerRecord[] = []

  // List all subscriptions (active + canceled)
  const statuses = ["active", "canceled"] as const

  for (const status of statuses) {
    let hasMore = true
    let startingAfter: string | undefined = undefined

    while (hasMore) {
      const page = await stripe.subscriptions.list({
        limit: 100,
        status,
        expand: ["data.customer"],
        ...(startingAfter ? { starting_after: startingAfter } : {}),
      })

      for (const sub of page.data) {
        const customer = sub.customer
        if (!customer || typeof customer === "string") continue

        const cust = customer as { id: string; email?: string | null; deleted?: boolean }
        if (cust.deleted) continue
        const email = cust.email?.toLowerCase().trim()
        if (!email || seen.has(email)) continue

        seen.add(email)
        records.push({
          email,
          customerId: cust.id,
          status: status === "active" ? "active" : "canceled",
        })
      }

      hasMore = page.has_more
      startingAfter = page.data[page.data.length - 1]?.id
    }
  }

  return records
}

// ---------------------------------------------------------------------------
// 5. Unsubscribe tokens (HMAC-signed, GDPR-compliant)
// ---------------------------------------------------------------------------

function unsubscribeSecret() {
  const s =
    process.env.NEWSLETTER_UNSUBSCRIBE_SECRET ||
    process.env.ACCESS_TOKEN_SECRET ||
    process.env.NEXTAUTH_SECRET
  if (!s) throw new Error("Missing NEWSLETTER_UNSUBSCRIBE_SECRET (or ACCESS_TOKEN_SECRET)")
  return s
}

/**
 * Create a signed, time-limited unsubscribe token for a given email.
 * The token is safe to include in an email link – it cannot be forged.
 */
export function signUnsubscribeToken(email: string): string {
  const payload = { email: email.toLowerCase().trim(), iat: Math.floor(Date.now() / 1000) }
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url")
  const sig = crypto
    .createHmac("sha256", unsubscribeSecret())
    .update(body)
    .digest("base64url")
  return `${body}.${sig}`
}

/**
 * Verify a signed unsubscribe token. Returns the email if valid, null otherwise.
 * Tokens are valid for 90 days.
 */
export function verifyUnsubscribeToken(token: string): string | null {
  try {
    const [body, sig] = token.split(".")
    if (!body || !sig) return null

    const expected = crypto
      .createHmac("sha256", unsubscribeSecret())
      .update(body)
      .digest("base64url")

    const a = Buffer.from(sig)
    const b = Buffer.from(expected)
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null

    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf-8")) as {
      email?: string
      iat?: number
    }

    if (!payload.email) return null

    // 90-day expiry
    const now = Math.floor(Date.now() / 1000)
    if (payload.iat && now - payload.iat > 90 * 24 * 60 * 60) return null

    return payload.email
  } catch {
    return null
  }
}

// ---------------------------------------------------------------------------
// Week label helper
// ---------------------------------------------------------------------------

export function currentWeekLabel(): string {
  const now = new Date()
  // ISO 8601 week number: week 1 contains the first Thursday of the year.
  // Weeks start on Monday.
  const jan4 = new Date(now.getFullYear(), 0, 4) // Jan 4 is always in week 1
  const monday = (d: Date) => {
    const day = d.getDay() || 7 // Sunday = 7
    const mon = new Date(d)
    mon.setDate(d.getDate() - (day - 1))
    mon.setHours(0, 0, 0, 0)
    return mon
  }
  const week1Monday = monday(jan4)
  const thisMonday = monday(now)
  const diffMs = thisMonday.getTime() - week1Monday.getTime()
  const kw = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000)) + 1
  return `KW ${kw} / ${now.getFullYear()}`
}
