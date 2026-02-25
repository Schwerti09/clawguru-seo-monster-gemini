import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"
import RunbookCard from "@/components/shared/RunbookCard"
import { RUNBOOKS } from "@/lib/pseo"
import type { SeverityLevel } from "@/lib/design-system"

export const metadata = {
  title: "Runbooks | ClawGuru",
  description:
    "Runbooks für OpenClaw/Moltbot Ops: Security, Setup, Fixes, Incident Response. Score → Runbook → Fix → Re-Check.",
  alternates: { canonical: "/runbooks" }
}

// VISUAL UPGRADE 2026: Derive severity from runbook tags
function deriveSeverity(tags: string[]): SeverityLevel {
  const t = tags.join(" ").toLowerCase()
  if (t.includes("critical") || t.includes("incident") || t.includes("notfall")) return "critical"
  if (t.includes("security") || t.includes("hardening") || t.includes("firewall")) return "high"
  if (t.includes("monitoring") || t.includes("setup")) return "medium"
  if (t.includes("docs") || t.includes("template")) return "info"
  return "medium"
}

// VISUAL UPGRADE 2026: Derive fix readiness from howto steps count
function deriveReadiness(r: typeof RUNBOOKS[number]): number {
  const steps = r.howto?.steps?.length ?? 3
  return Math.min(95, 50 + steps * 8)
}

export default function RunbooksPage({ searchParams }: { searchParams?: { q?: string } }) {
  const q = typeof searchParams?.q === "string" ? searchParams.q.trim().toLowerCase() : ""
  const items = [...RUNBOOKS]
    .filter((r) => {
      if (!q) return true
      const hay = `${r.title} ${r.summary} ${r.tags.join(" ")}`.toLowerCase()
      return hay.includes(q)
    })
    .sort((a, b) => a.title.localeCompare(b.title))
  return (
    <Container>
      <div className="py-16 max-w-6xl mx-auto">
        <SectionTitle
          kicker="Programmatic SEO"
          title="Runbook Library"
          subtitle="Jede Seite ist ein Einstiegspunkt: Problem → Fix → Verifikation."
        />

        {/* VISUAL UPGRADE 2026: Search with glassmorphism */}
        <div className="mt-8 p-4 rounded-3xl glass-card">
          <div className="text-sm font-bold mb-2">Schnellsuche</div>
          <form className="flex gap-2" action="/runbooks" method="get">
            <input
              name="q"
              defaultValue={typeof searchParams?.q === "string" ? searchParams.q : ""}
              placeholder="z.B. 502, webhook, nginx, docker secrets, env leak…"
              className="flex-1 px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:border-claw-green focus:ring-2 focus:ring-claw-green/20 transition-all"
            />
            <button className="px-4 py-3 rounded-2xl bg-gray-900 hover:bg-gray-800 border border-white/10 font-bold transition-colors" type="submit">
              Suchen
            </button>
          </form>
          {q ? (
            <div className="mt-3 text-xs text-gray-500">
              Treffer für <span className="font-mono text-gray-200">{q}</span>: <span className="font-bold">{items.length}</span>
            </div>
          ) : (
            <div className="mt-3 text-xs text-gray-500">Tipp: Fehlercode + Provider kombiniert gewinnt.</div>
          )}
        </div>

        {/* VISUAL UPGRADE 2026: RunbookCard grid with 3D tilt and severity badges */}
        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((r) => (
            <RunbookCard
              key={r.slug}
              slug={r.slug}
              title={r.title}
              summary={r.summary}
              tags={r.tags}
              severity={deriveSeverity(r.tags)}
              fixReadiness={deriveReadiness(r)}
            />
          ))}
        </div>
      </div>
    </Container>
  )
}
