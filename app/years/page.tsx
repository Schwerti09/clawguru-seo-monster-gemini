import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"
import { allYears100k, CLOUD_PROVIDERS_100K, SERVICES_100K, ISSUES_100K } from "@/lib/pseo"
import { BASE_URL } from "@/lib/config"

export const dynamic = "force-static"

export const metadata = {
  title: "Years | ClawGuru",
  description:
    "Year-Index: Runbooks für 2024, 2025, 2026, 2027, 2028, 2029, 2030 — Security, Ops und Compliance nach Jahr sortiert. Immer aktuell, immer institutional grade.",
  alternates: { canonical: "/years" },
}

const YEAR_DESCRIPTIONS: Record<string, string> = {
  "2024": "Rückblick & Retrospective: Was war 2024 kritisch? CVEs, Compliance-Updates, Post-Mortems.",
  "2025": "Aktuell: Die wichtigsten Security & Ops Runbooks für 2025. OWASP, CIS, NIST up-to-date.",
  "2026": "Live-Standard: ClawGuru 2026 Baseline für alle Provider, Services und Issues.",
  "2027": "Forward-Planning: Enterprise Ops für 2027. Zero-Trust, AI-Security, neue Compliance-Frameworks.",
  "2028": "Strategisch: Long-term Hardening & Compliance-Roadmaps für 2028.",
  "2029": "Future-Ops: Vorbereitung auf 2029 Security-Standards und Technologie-Shifts.",
  "2030": "Vision 2030: Institutional Ops für das nächste Jahrzehnt. Langfristige Strategie.",
}

export default function YearsPage() {
  const years = allYears100k()
  const totalPerYear =
    (CLOUD_PROVIDERS_100K as unknown as unknown[]).length *
    (SERVICES_100K as unknown as unknown[]).length *
    (ISSUES_100K as unknown as unknown[]).length

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "ClawGuru Year Hub Index",
    description: "Runbooks nach Jahr sortiert: 2024–2030. Security, Ops und Compliance.",
    numberOfItems: years.length,
    url: `${BASE_URL}/years`,
    itemListElement: years.map((year, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${year} Runbooks`,
      url: `${BASE_URL}/year/${year}`,
    })),
  }

  return (
    <Container>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <div className="py-16 max-w-6xl mx-auto">
        <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2">
            <li><a href="/" className="hover:text-cyan-400">ClawGuru</a></li>
            <li>/</li>
            <li className="text-gray-300">Years</li>
          </ol>
        </nav>

        <SectionTitle
          kicker="Year Hubs"
          title="Runbooks nach Jahr"
          subtitle={`7 Jahrgänge · je ${totalPerYear.toLocaleString()} Runbooks (Provider × Service × Issue)`}
        />

        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {years.map((year) => (
            <a
              key={year}
              href={`/year/${year}`}
              className="p-6 rounded-3xl border border-gray-800 bg-black/25 hover:bg-black/35 transition-colors"
            >
              <div className="text-xs uppercase tracking-widest text-gray-500">Year Hub</div>
              <div className="text-2xl font-extrabold mt-2">{year}</div>
              <div className="text-sm text-gray-400 mt-2">
                {YEAR_DESCRIPTIONS[year] ?? `${totalPerYear.toLocaleString()} Runbooks für alle Provider & Services`}
              </div>
              <div className="mt-4 text-cyan-400 text-sm font-semibold">Runbooks ansehen →</div>
            </a>
          ))}
        </div>

        <div className="mt-12 text-sm text-gray-500">
          Mehr:{" "}
          <a className="hover:text-cyan-400" href="/issues">Issue Hubs</a> ·{" "}
          <a className="hover:text-cyan-400" href="/services">Service Hubs</a> ·{" "}
          <a className="hover:text-cyan-400" href="/runbooks">Runbook Library</a>
        </div>
      </div>
    </Container>
  )
}
