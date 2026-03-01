import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"
import {
  allIssues100k,
  getSampleSlugsByIssue,
  getRunbook,
  CLOUD_PROVIDERS_100K,
  SERVICES_100K,
  YEARS_100K,
} from "@/lib/pseo"
import { notFound } from "next/navigation"
import { BASE_URL } from "@/lib/config"

export const revalidate = 60 * 60 * 24
export const dynamicParams = true

export async function generateStaticParams() {
  return allIssues100k().map((i) => ({ slug: i.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const issue = allIssues100k().find((i) => i.slug === params.slug)
  if (!issue) return {}
  const totalPerIssue =
    (CLOUD_PROVIDERS_100K as unknown as unknown[]).length *
    (SERVICES_100K as unknown as unknown[]).length *
    (YEARS_100K as unknown as unknown[]).length
  return {
    title: `${issue.name} Runbooks | ClawGuru Issue Hub`,
    description: `${totalPerIssue.toLocaleString()} Runbooks für ${issue.name}: Fixes, Hardening und Incident Response für alle Provider und Services — copy-paste-ready, institutional grade.`,
    alternates: { canonical: `/issue/${issue.slug}` },
    openGraph: {
      title: `${issue.name} Runbooks | ClawGuru`,
      description: `${totalPerIssue.toLocaleString()} Runbooks. Provider × Service × Year Matrix.`,
      type: "website",
    },
  }
}

export default function IssueHubPage({ params }: { params: { slug: string } }) {
  const issue = allIssues100k().find((i) => i.slug === params.slug)
  if (!issue) return notFound()

  const sampleSlugs = getSampleSlugsByIssue(issue.slug, 48)
  const samples = sampleSlugs.map((s) => getRunbook(s)).filter(Boolean) as NonNullable<ReturnType<typeof getRunbook>>[]

  const totalPerIssue =
    (CLOUD_PROVIDERS_100K as unknown as unknown[]).length *
    (SERVICES_100K as unknown as unknown[]).length *
    (YEARS_100K as unknown as unknown[]).length

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Issues", item: `${BASE_URL}/issues` },
      { "@type": "ListItem", position: 3, name: issue.name, item: `${BASE_URL}/issue/${issue.slug}` },
    ],
  }

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${issue.name} Runbooks`,
    description: `${totalPerIssue.toLocaleString()} Runbooks für ${issue.name} auf allen Providern und Services.`,
    numberOfItems: Math.min(samples.length, 10),
    itemListElement: samples.slice(0, 10).map((r, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${BASE_URL}/runbook/${r.slug}`,
      name: r.title,
    })),
  }

  return (
    <Container>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <div className="py-16 max-w-6xl mx-auto">
        <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2">
            <li><a href="/" className="hover:text-cyan-400">ClawGuru</a></li>
            <li>/</li>
            <li><a href="/issues" className="hover:text-cyan-400">Issues</a></li>
            <li>/</li>
            <li className="text-gray-300">{issue.name}</li>
          </ol>
        </nav>

        <SectionTitle
          kicker="Issue Hub"
          title={issue.name}
          subtitle={`${totalPerIssue.toLocaleString()} Runbooks · Provider × Service × Year Matrix`}
        />

        <div className="mt-4 p-4 rounded-2xl border border-gray-800 bg-black/20 text-sm text-gray-400">
          Alle Runbooks zu <strong className="text-gray-200">{issue.name}</strong> sind sofort verfügbar — für jeden Provider, jeden Service, jedes Jahr. Copy-paste-ready. Institutional grade.
        </div>

        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {samples.map((r) => (
            <a
              key={r.slug}
              href={`/runbook/${r.slug}`}
              className="p-6 rounded-3xl border border-gray-800 bg-black/25 hover:bg-black/35 transition-colors"
            >
              <div className="text-xs uppercase tracking-widest text-gray-500">Runbook</div>
              <div className="text-base font-bold mt-2 line-clamp-2">{r.title}</div>
              <div className="text-sm text-gray-400 mt-2 line-clamp-3">{r.summary}</div>
              <div className="mt-3 flex flex-wrap gap-1">
                {r.tags.slice(0, 4).map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded-lg border border-gray-800 bg-black/30 text-xs text-gray-400">
                    {t}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>

        <div className="mt-12 text-sm text-gray-500">
          <a href="/issues" className="hover:text-cyan-400">← Alle Issues</a> ·{" "}
          <a href="/services" className="hover:text-cyan-400">Service Hubs</a> ·{" "}
          <a href="/runbooks" className="hover:text-cyan-400">Runbook Library</a>
        </div>
      </div>
    </Container>
  )
}
