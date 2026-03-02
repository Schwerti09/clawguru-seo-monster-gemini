import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"
import { allIssues100k, CLOUD_PROVIDERS_100K, SERVICES_100K, YEARS_100K } from "@/lib/pseo"
import { BASE_URL } from "@/lib/config"

export const dynamic = "force-static"

export const metadata = {
  title: "Issues | ClawGuru",
  description:
    "Issue-Index: RBAC Misconfiguration, SQL Injection, Container Escape, SBOM, Zero-Trust und 100+ weitere Security & Ops Issues — jeweils mit vollständiger Provider × Service × Year Runbook-Matrix.",
  alternates: { canonical: "/issues" },
}

export default function IssuesPage() {
  const issues = allIssues100k()
  const totalPerIssue =
    (CLOUD_PROVIDERS_100K as unknown as unknown[]).length *
    (SERVICES_100K as unknown as unknown[]).length *
    (YEARS_100K as unknown as unknown[]).length

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "ClawGuru Issue Hub Index",
    description: "Alle Security & Ops Issue-Typen mit vollständiger Provider × Service × Year Runbook-Matrix.",
    numberOfItems: issues.length,
    url: `${BASE_URL}/issues`,
    itemListElement: issues.map((issue, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: issue.name,
      url: `${BASE_URL}/issue/${issue.slug}`,
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
            <li className="text-gray-300">Issues</li>
          </ol>
        </nav>

        <SectionTitle
          kicker="Issue Hubs"
          title="Security & Ops Issues"
          subtitle={`${issues.length} Issue-Typen · je ${totalPerIssue.toLocaleString()} Runbooks (Provider × Service × Year)`}
        />

        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {issues.map((issue) => (
            <a
              key={issue.slug}
              href={`/issue/${issue.slug}`}
              className="p-6 rounded-3xl border border-gray-800 bg-black/25 hover:bg-black/35 transition-colors"
            >
              <div className="text-xs uppercase tracking-widest text-gray-500">Issue Hub</div>
              <div className="text-lg font-extrabold mt-2">{issue.name}</div>
              <div className="text-sm text-gray-400 mt-2">
                {totalPerIssue.toLocaleString()} Runbooks für alle Provider & Services
              </div>
              <div className="mt-4 text-cyan-400 text-sm font-semibold">Runbooks ansehen →</div>
            </a>
          ))}
        </div>

        <div className="mt-12 text-sm text-gray-500">
          Mehr:{" "}
          <a className="hover:text-cyan-400" href="/services">Service Hubs</a> ·{" "}
          <a className="hover:text-cyan-400" href="/years">Year Hubs</a> ·{" "}
          <a className="hover:text-cyan-400" href="/runbooks">Runbook Library</a>
        </div>
      </div>
    </Container>
  )
}
