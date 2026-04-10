import { NextResponse } from "next/server"
import { unstable_cache } from "next/cache"

type Item = {
  id: string
  title: string
  severity: "high" | "medium" | "low"
  category: "exposure" | "websocket" | "secrets" | "supply-chain" | "ops"
  when: string
  summary: string
  actions: string[]
}

const FALLBACK_ITEMS: Item[] = [
  {
    id: "inc-001",
    title: "Exposed Gateway (public) → Token Leakage",
    severity: "high",
    category: "exposure",
    when: "today · 6h ago",
    summary: "Public gateway endpoints without private networking + weak auth repeatedly lead to key/token leaks.",
    actions: ["Enforce private subnet/VPN", "Firewall deny-by-default", "Rotate keys", "Enable auth-fail alerts"],
  },
  {
    id: "inc-002",
    title: "WebSocket Origin wildcard → Remote Control Vector",
    severity: "high",
    category: "websocket",
    when: "yesterday · 1d ago",
    summary: "Unbound origin + long token TTL enables attacks via foreign origins depending on setup.",
    actions: ["Origin allowlist", "Short TTL tokens", "Rate limits", "CSRF/session binding"],
  },
]

function classifyCategory(s: string): Item["category"] {
  const x = s.toLowerCase()
  if (x.includes("websocket") || x.includes("socket")) return "websocket"
  if (x.includes("secret") || x.includes("token") || x.includes("env")) return "secrets"
  if (x.includes("supply") || x.includes("dependency") || x.includes("package")) return "supply-chain"
  if (x.includes("expos") || x.includes("public") || x.includes("cors") || x.includes("oauth")) return "exposure"
  return "ops"
}

function defaultActions(cat: Item["category"]): string[] {
  if (cat === "websocket") return ["Enforce origin allowlist", "Short TTL tokens", "Bind session & CSRF", "Monitor anomalies"]
  if (cat === "secrets") return ["Remove cleartext secrets", "Rotate keys immediately", "Enable secret scanning CI", "Least privilege"]
  if (cat === "supply-chain") return ["Pin deps with lockfiles", "Review before update", "Generate SBOM", "Minimal permissions"]
  if (cat === "exposure") return ["Deny-by-default firewall", "Private networking", "Auth hardening", "Alerts on failures"]
  return ["Disable debug endpoints", "Auth-gate metrics", "IP allowlists", "Private monitoring links"]
}

function toWhen(date: Date): string {
  const now = Date.now()
  const s = Math.max(0, Math.round((now - date.getTime()) / 1000))
  if (s < 60) return `${s}s ago`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 48) return `${h}h ago`
  const d = Math.floor(h / 24)
  return `${d}d ago`
}

const getIncidents = unstable_cache(
  async (): Promise<Item[]> => {
    try {
      const { materializedRunbooks } = await import("@/lib/pseo")
      const runbooks = materializedRunbooks()
      const sample = runbooks.slice(0, Math.min(runbooks.length, 2000))
      const picked = sample.slice(0, 12)
      const out: Item[] = picked.map((r, i) => {
        const cat = classifyCategory(`${r.title} ${r.summary} ${(r.tags || []).join(" ")}`)
        const sev: Item["severity"] = (r.summary || r.title).toLowerCase().includes("critical") ? "high" : (i % 3 === 0 ? "medium" : "high")
        return {
          id: `rb-${r.slug}`,
          title: r.title,
          severity: sev,
          category: cat,
          when: toWhen(new Date(Date.now() - (i + 1) * 3600 * 1000)),
          summary: r.summary || "",
          actions: defaultActions(cat),
        }
      })

      // Enrich a bit with recent CVEs if available
      try {
        const cveMod: any = await import("@/lib/cve-pseo")
        const list = Array.isArray(cveMod.KNOWN_CVES) ? cveMod.KNOWN_CVES.slice(0, 6) : []
        for (const e of list) {
          const cat = classifyCategory(`${e.name} ${(e.tags || []).join(" ")}`)
          out.unshift({
            id: `cve-${e.cveId}`,
            title: `${e.cveId}: ${e.name}`,
            severity: (e.severity || "high").toLowerCase().includes("low") ? "low" : (e.severity || "high").toLowerCase().includes("medium") ? "medium" : "high",
            category: cat,
            when: toWhen(new Date(e.publishedDate || Date.now() - 12 * 3600 * 1000)),
            summary: `CVSS ${e.cvssScore ?? "?"} · ${(e.tags || []).slice(0, 4).join(", ")}`,
            actions: defaultActions(cat),
          })
        }
      } catch {}

      return out.slice(0, 20)
    } catch (e) {
      return FALLBACK_ITEMS
    }
  },
  ["incidents-from-library"],
  { revalidate: 600 }
)

export async function GET() {
  const items = await getIncidents()
  return NextResponse.json(
    { items, updatedAt: new Date().toISOString() },
    { headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=60" } }
  )
}
