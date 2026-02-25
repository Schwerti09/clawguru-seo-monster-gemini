import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"
import RunbooksSearch from "@/components/shared/RunbooksSearch"
import { RUNBOOKS } from "@/lib/pseo"
import type { SeverityLevel } from "@/lib/design-system"
import type { RunbookSummary } from "@/components/shared/RunbooksSearch"

export const dynamic = "force-static"

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

export default function RunbooksPage() {
  const items: RunbookSummary[] = [...RUNBOOKS]
    .sort((a, b) => a.title.localeCompare(b.title))
    .map((r) => ({
      slug: r.slug,
      title: r.title,
      summary: r.summary,
      tags: r.tags,
      severity: deriveSeverity(r.tags),
      fixReadiness: deriveReadiness(r),
    }))

  return (
    <Container>
      <div className="py-16 max-w-6xl mx-auto">
        <SectionTitle
          kicker="Programmatic SEO"
          title="Runbook Library"
          subtitle="Jede Seite ist ein Einstiegspunkt: Problem → Fix → Verifikation."
        />
        <RunbooksSearch items={items} />
      </div>
    </Container>
  )
}
