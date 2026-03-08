import crypto from "crypto"

export type NewsletterSendResult = {
  sent: number
  failed: number
  skipped: number
}

export type ThreatItem = {
  id: string
  severity?: string
  cvssScore?: number
  summary: string
}

export type CveItem = {
  id: string
  description: string
  severity?: string
  cvssScore?: number
  published?: string
}

export type NewsletterRecipient = {
  email: string
  isPro?: boolean
  status?: "active" | "canceled" | "other" | string
}

const NVD_BASE = "https://services.nvd.nist.gov/rest/json/cves/2.0"
const SECRET = process.env.NEWSLETTER_SECRET || "dev-secret"

export function currentWeekLabel(): string {
  const now = new Date()
  const year = now.getFullYear()
  const week = Math.ceil(
    ((now.getTime() - new Date(year, 0, 1).getTime()) / 86400000 +
      new Date(year, 0, 1).getDay() +
      1) /
      7
  )
  return `Week ${week}, ${year}`
}

export async function fetchCriticalCVEs(limit: number = 10): Promise<CveItem[]> {
  const params = new URLSearchParams({
    cvssV3Severity: "CRITICAL",
    resultsPerPage: String(limit),
  })

  const res = await fetch(`${NVD_BASE}?${params.toString()}`, {
    signal: AbortSignal.timeout(15000),
  })

  if (!res.ok) throw new Error(`NVD API error ${res.status}`)

  const data = await res.json()

  return (data?.vulnerabilities ?? []).map((v: any) => {
    const cve = v.cve
    const metric =
      cve?.metrics?.cvssMetricV31?.[0]?.cvssData ??
      cve?.metrics?.cvssMetricV30?.[0]?.cvssData

    return {
      id: cve?.id ?? "unknown",
      description:
        cve?.descriptions?.find((d: any) => d.lang === "en")?.value ?? "",
      severity: metric?.baseSeverity,
      cvssScore: metric?.baseScore,
      published: cve?.published,
    }
  })
}

export function summarizeThreats(cves: CveItem[]): string {
  return cves.map((c) => `• ${c.id} — ${c.description}`).join("\n")
}

export function buildNewsletterHtml({
  threats,
  siteUrl,
  unsubscribeUrl,
  showDayPassCta,
  weekLabel,
}: {
  threats: string | ThreatItem[]
  siteUrl: string
  unsubscribeUrl: string
  showDayPassCta?: boolean
  weekLabel?: string
}): string {
  const renderedThreats =
    typeof threats === "string"
      ? `<pre style="white-space:pre-wrap">${escapeHtml(threats)}</pre>`
      : `
        <div style="display:grid;gap:16px">
          ${threats
            .map(
              (t) => `
                <div style="padding:16px;border:1px solid #2a2a2a;border-radius:12px;background:#111">
                  <div style="font-weight:700;color:#fff;margin-bottom:8px">${escapeHtml(t.id)}</div>
                  <div style="color:#c9a84c;font-size:14px;margin-bottom:6px">
                    Severity: ${escapeHtml(t.severity ?? "unknown")}
                    ${t.cvssScore != null ? ` · CVSS: ${t.cvssScore}` : ""}
                  </div>
                  <div style="color:#cfcfcf;line-height:1.5">${escapeHtml(t.summary)}</div>
                </div>
              `
            )
            .join("")}
        </div>
      `

  return `
  <html>
    <body style="margin:0;padding:0;background:#0b0b0b;color:#eee;font-family:Arial,sans-serif">
      <div style="max-width:760px;margin:0 auto;padding:40px 20px">
        <div style="margin-bottom:24px">
          <h1 style="margin:0 0 8px 0;color:#fff">ClawGuru Threat Intelligence</h1>
          <p style="margin:0;color:#aaa">${escapeHtml(weekLabel ?? currentWeekLabel())}</p>
        </div>

        ${renderedThreats}

        ${
          showDayPassCta
            ? `
          <div style="margin-top:28px;padding:20px;border:1px solid #3a2f12;border-radius:14px;background:#15120a">
            <h2 style="margin:0 0 10px 0;color:#f5d37a">Unlock Full Access</h2>
            <p style="margin:0 0 14px 0;color:#d6d6d6">
              Get the full ClawGuru experience with premium access and deeper intelligence features.
            </p>
            <a
              href="${escapeHtml(siteUrl)}/pricing"
              style="display:inline-block;padding:12px 18px;background:#c9a84c;color:#111;text-decoration:none;border-radius:10px;font-weight:700"
            >
              View Day Pass
            </a>
          </div>
        `
            : ""
        }

        <div style="margin-top:32px;padding-top:18px;border-top:1px solid #222;color:#8d8d8d;font-size:13px">
          <p style="margin:0 0 8px 0">
            You received this email because you subscribed via ${escapeHtml(siteUrl)}.
          </p>
          <p style="margin:0">
            <a href="${escapeHtml(unsubscribeUrl)}" style="color:#8d8d8d">Unsubscribe</a>
          </p>
        </div>
      </div>
    </body>
  </html>
  `
}

export async function getStripeCustomerEmails(): Promise<NewsletterRecipient[]> {
  return []
}

export function signUnsubscribeToken(email: string): string {
  const emailPart = Buffer.from(email, "utf8").toString("base64url")
  const sig = crypto.createHmac("sha256", SECRET).update(email).digest("hex")
  return `${emailPart}.${sig}`
}

export function verifyUnsubscribeToken(token: string): string | null {
  const [emailPart, sig] = token.split(".")
  if (!emailPart || !sig) return null

  try {
    const email = Buffer.from(emailPart, "base64url").toString("utf8")
    const expected = crypto.createHmac("sha256", SECRET).update(email).digest("hex")

    const sigBuf = Buffer.from(sig, "utf8")
    const expectedBuf = Buffer.from(expected, "utf8")

    if (sigBuf.length !== expectedBuf.length) return null
    if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) return null

    return email
  } catch {
    return null
  }
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}