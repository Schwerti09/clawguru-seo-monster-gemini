// Shared runbooks listing content component.
// Used by both /runbooks (default locale) and /[lang]/runbooks (localized).

import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"
import RunbooksSearch from "@/components/shared/RunbooksSearch"
import { RUNBOOKS } from "@/lib/pseo"
import type { SeverityLevel } from "@/lib/design-system"
import type { RunbookSummary } from "@/components/shared/RunbooksSearch"
import { BASE_URL } from "@/lib/config"
import type { Locale } from "@/lib/i18n"

// VISUAL UPGRADE 2026: Derive severity from runbook tags
function deriveSeverity(tags: string[]): SeverityLevel {
  const text = tags.join(" ").toLowerCase()
  if (text.includes("critical") || text.includes("incident") || text.includes("notfall")) return "critical"
  if (text.includes("security") || text.includes("hardening") || text.includes("firewall")) return "high"
  if (text.includes("monitoring") || text.includes("setup")) return "medium"
  if (text.includes("docs") || text.includes("template")) return "info"
  return "medium"
}

// VISUAL UPGRADE 2026: Derive fix readiness from howto steps count
function deriveReadiness(r: typeof RUNBOOKS[number]): number {
  const steps = r.howto?.steps?.length ?? 3
  return Math.min(95, 50 + steps * 8)
}

export default function RunbooksPageContent({
  locale,
  subtitle,
}: {
  locale: Locale
  subtitle: string
}) {
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

  const top20 = [...RUNBOOKS].sort((a, b) => b.clawScore - a.clawScore).slice(0, 20)
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "ClawGuru Runbook Library",
    description: "Security- und Ops-Runbooks für DevOps-Teams: SSH-Hardening, Firewall, Incident Response und mehr.",
    numberOfItems: RUNBOOKS.length,
    itemListElement: top20.map((r, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${BASE_URL}/${locale}/runbook/${r.slug}`,
      name: r.title,
    })),
  }

  return (
    <Container>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <div className="py-16 max-w-6xl mx-auto">
        <SectionTitle
          kicker="Programmatic SEO"
          title="Runbook Library"
          subtitle={subtitle}
        />
        <RunbooksSearch items={items} />
      </div>
    </Container>
  )
}
