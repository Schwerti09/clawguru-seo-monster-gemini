import { fetchCriticalCVEs, summarizeThreats } from "@/lib/newsletter"

export type ActiveDefenderContact = {
  email: string
  firstName?: string
  lastName?: string
  name?: string
}

export type DefenderThreat = {
  id: string
  severity: string
  cvssScore: number | null
  summary: string
}

type ResendContact = {
  email?: string
  first_name?: string | null
  last_name?: string | null
  unsubscribed?: boolean
}

type ResendListResponse = {
  data?: ResendContact[]
  next?: string | null
}

const CVE_ID_PATTERN = /^CVE-\d{4}-\d{4,}$/i

function isDefenderThreat(value: DefenderThreat | null): value is DefenderThreat {
  return value !== null
}

function getResendConfig() {
  const apiKey = process.env.RESEND_API_KEY
  const audienceId =
    process.env.RESEND_ACTIVE_DEFENDERS_AUDIENCE_ID || process.env.ACTIVE_DEFENDERS_AUDIENCE_ID
  if (!apiKey || !audienceId) {
    throw new Error("Missing RESEND_API_KEY or RESEND_ACTIVE_DEFENDERS_AUDIENCE_ID")
  }
  return { apiKey, audienceId }
}

export async function upsertActiveDefender(contact: ActiveDefenderContact): Promise<void> {
  const { apiKey, audienceId } = getResendConfig()
  const res = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: contact.email,
      first_name: contact.firstName || undefined,
      last_name: contact.lastName || undefined,
    }),
  })

  if (!res.ok && res.status !== 409) {
    const detail = await res.text().catch(() => "")
    throw new Error(`Active defender upsert failed (${res.status}): ${detail}`)
  }
}

export async function listActiveDefenders(): Promise<ActiveDefenderContact[]> {
  const { apiKey, audienceId } = getResendConfig()
  const contacts: ActiveDefenderContact[] = []
  let cursor: string | null | undefined = undefined

  do {
    const url = new URL(`https://api.resend.com/audiences/${audienceId}/contacts`)
    url.searchParams.set("limit", "100")
    if (cursor) url.searchParams.set("after", cursor)

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${apiKey}` },
    })
    if (!res.ok) {
      const detail = await res.text().catch(() => "")
      throw new Error(`Active defender list failed (${res.status}): ${detail}`)
    }

    const body = (await res.json()) as ResendListResponse
    const rows = body.data ?? []
    for (const row of rows) {
      if (!row.email || row.unsubscribed) continue
      contacts.push({
        email: row.email,
        firstName: row.first_name ?? undefined,
        lastName: row.last_name ?? undefined,
        name: [row.first_name, row.last_name].filter(Boolean).join(" ") || undefined,
      })
    }

    cursor = body.next
    if (!cursor) break
  } while (true)

  return contacts
}

export async function fetchDefenderThreats() {
  const cves = await fetchCriticalCVEs(8)
  if (cves.length === 0) return []
  try {
    const summarized = await summarizeThreats(cves)
    return summarized
      .map((t) => {
        const safeId = sanitizeCveId(t.id)
        if (!safeId) return null
        return { ...t, id: safeId }
      })
      .filter(isDefenderThreat)
      .slice(0, 3)
  } catch {
    return cves
      .map((c) => {
        const safeId = sanitizeCveId(c.id)
        if (!safeId) return null
        return {
          id: safeId,
          severity: c.severity,
          cvssScore: c.cvssScore,
          summary: c.description.slice(0, 280),
        }
      })
      .filter(isDefenderThreat)
      .slice(0, 3)
  }
}

function sanitizeCveId(id: string): string | null {
  const cleaned = id.trim().toUpperCase()
  return CVE_ID_PATTERN.test(cleaned) ? cleaned : null
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

export function buildDefenderEmailHtml(opts: {
  contact: ActiveDefenderContact
  threats: Array<{ id: string; severity: string; cvssScore: number | null; summary: string }>
  siteUrl: string
  weekLabel: string
}) {
  const { contact, threats, siteUrl, weekLabel } = opts
  const safeSiteUrl = siteUrl.replace(/["'<>]/g, "")
  const emailLocal = contact.email.split("@")[0] || ""
  const emailAlias = emailLocal.replace(/[^a-zA-Z0-9-_.]/g, "")
  const name = contact.firstName || contact.name || (emailAlias ? emailAlias : "Defender")

  const items = threats
    .map((t) => {
      const runbookUrl = `${safeSiteUrl}/runbooks?q=${encodeURIComponent(t.id)}&utm_source=retention&utm_medium=email`
      return `
        <li style="margin-bottom:12px">
          <strong style="color:#f97316">${t.id}</strong>
          <span style="color:#9ca3af">(${t.severity}${t.cvssScore ? ` · CVSS ${t.cvssScore}` : ""})</span>
          <div style="color:#d1d5db;margin-top:4px;font-size:13px;line-height:1.6">${escapeHtml(t.summary)}</div>
      <a href="${runbookUrl}" style="color:#22d3ee;font-weight:700;text-decoration:none">Fix-Runbook öffnen →</a>
        </li>
      `
    })
    .join("")

  return `
  <div style="font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial;line-height:1.6;color:#e5e7eb;background:#0b0b0b;padding:28px;border-radius:16px">
    <h2 style="margin:0 0 10px 0;font-size:22px;color:#fff">Hey ${escapeHtml(name)},</h2>
    <p style="margin:0 0 18px 0;color:#9ca3af">
      wir haben diese Woche <strong style="color:#f97316">${threats.length} neue kritische Lücken</strong> für dein System gefunden.
      Hier sind die Fixes – exklusiv für dich. (${weekLabel})
    </p>
    <ul style="padding-left:18px;margin:0 0 18px 0">
      ${items}
    </ul>
    <div style="background:#111827;border-radius:12px;padding:16px">
      <div style="font-size:13px;text-transform:uppercase;letter-spacing:.08em;color:#6b7280;margin-bottom:6px">Active Defender Intel</div>
      <p style="margin:0;color:#d1d5db;font-size:13px">
        Zugriff auf vollständige Mitigation-Runbooks + Live-Checks.
      </p>
      <a href="${safeSiteUrl}/dashboard" style="display:inline-block;margin-top:10px;background:#22d3ee;color:#0a0a0a;padding:10px 16px;border-radius:10px;font-weight:800;text-decoration:none">
        Dashboard öffnen →
      </a>
    </div>
  </div>`
}
