import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"
import { RUNBOOKS } from "@/lib/pseo"
// VISUAL BEAST 2026: RunbookCard with 3D tilt + severity glow
import RunbookCard from "@/components/visual/RunbookCard"

export const metadata = {
  title: "Runbooks | ClawGuru",
  description:
    "Runbooks für OpenClaw/Moltbot Ops: Security, Setup, Fixes, Incident Response. Score → Runbook → Fix → Re-Check.",
  alternates: { canonical: "/runbooks" }
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


        <div className="mt-8 p-4 rounded-2xl glass-card">
          <div className="text-sm font-bold mb-2 font-headline">Schnellsuche</div>
          <form className="flex gap-2" action="/runbooks" method="get">
            <input
              name="q"
              defaultValue={typeof searchParams?.q === "string" ? searchParams.q : ""}
              placeholder="z.B. 502, webhook, nginx, docker secrets, env leak…"
              className="flex-1 px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:border-[#00ff9d]/50 focus:ring-2 focus:ring-[#00ff9d]/20 transition-all"
            />
            <button className="px-4 py-3 rounded-2xl glass-card hover-neon-border font-bold" type="submit">
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

        {/* VISUAL BEAST 2026: RunbookCard with 3D tilt + severity glow */}
        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((r, i) => (
            <RunbookCard
              key={r.slug}
              title={r.title}
              summary={r.summary}
              slug={r.slug}
              tags={r.tags}
              severity={i % 4 === 0 ? "critical" : i % 3 === 0 ? "high" : i % 2 === 0 ? "medium" : "low"}
              readiness={50 + ((i * 17) % 50)}
            />
          ))}
        </div>
      </div>
    </Container>
  )
}
