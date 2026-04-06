// Shared runbooks listing content component.
// Used by both /runbooks (default locale) and /[lang]/runbooks (localized).

import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"
import { BASE_URL } from "@/lib/config"
import type { Locale } from "@/lib/i18n"
import dynamic from "next/dynamic"
const RunbookNexus = dynamic(() => import("@/components/pages/RunbookNexus"), {
  loading: () => (
    <div style={{ minHeight: "80vh", contentVisibility: "auto", containIntrinsicSize: "auto 1200px" }} />
  ),
})

// Data is now loaded clientseitig in RunbooksClientLoader (ähnlich wie MyceliumClientLoader)

export default async function RunbooksPageContent({
  locale,
  subtitle,
}: {
  locale: Locale
  subtitle: string
}) {
  // Load actual runbooks data for structured data
  const { loadRunbooks } = await import("@/lib/runbooks-data")
  const runbooks = await loadRunbooks()
  const top20 = runbooks.slice(0, 20)
  
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "ClawGuru Runbook Library",
    description: "Security- und Ops-Runbooks für DevOps-Teams: SSH-Hardening, Firewall, Incident Response und mehr.",
    numberOfItems: top20.length,
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
        <RunbookNexus />
      </div>
    </Container>
  )
}
