import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"
import {
  allServices100k,
  getSampleSlugsByService,
  getRunbook,
  CLOUD_PROVIDERS_100K,
  ISSUES_100K,
  YEARS_100K,
} from "@/lib/pseo"
import { notFound } from "next/navigation"
import { BASE_URL } from "@/lib/config"

export const revalidate = 60 * 60 * 24
export const dynamicParams = true

export async function generateStaticParams() {
  return allServices100k().map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const service = allServices100k().find((s) => s.slug === params.slug)
  if (!service) return {}
  const totalPerService =
    (CLOUD_PROVIDERS_100K as unknown as unknown[]).length *
    (ISSUES_100K as unknown as unknown[]).length *
    (YEARS_100K as unknown as unknown[]).length
  return {
    title: `${service.name} Runbooks | ClawGuru Service Hub`,
    description: `${totalPerService.toLocaleString()} Runbooks für ${service.name}: Hardening, Incident Response, Compliance und mehr — für alle Cloud-Provider copy-paste-ready.`,
    alternates: { canonical: `/service/${service.slug}` },
    openGraph: {
      title: `${service.name} Runbooks | ClawGuru`,
      description: `${totalPerService.toLocaleString()} Runbooks. Provider × Issue × Year Matrix.`,
      type: "website",
    },
  }
}

export default function ServiceHubPage({ params }: { params: { slug: string } }) {
  const service = allServices100k().find((s) => s.slug === params.slug)
  if (!service) return notFound()

  const sampleSlugs = getSampleSlugsByService(service.slug, 48)
  const samples = sampleSlugs.map((s) => getRunbook(s)).filter(Boolean) as NonNullable<ReturnType<typeof getRunbook>>[]

  const totalPerService =
    (CLOUD_PROVIDERS_100K as unknown as unknown[]).length *
    (ISSUES_100K as unknown as unknown[]).length *
    (YEARS_100K as unknown as unknown[]).length

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Services", item: `${BASE_URL}/services` },
      { "@type": "ListItem", position: 3, name: service.name, item: `${BASE_URL}/service/${service.slug}` },
    ],
  }

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${service.name} Runbooks`,
    description: `${totalPerService.toLocaleString()} Runbooks für ${service.name} auf allen Cloud-Providern.`,
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
            <li><a href="/services" className="hover:text-cyan-400">Services</a></li>
            <li>/</li>
            <li className="text-gray-300">{service.name}</li>
          </ol>
        </nav>

        <SectionTitle
          kicker="Service Hub"
          title={service.name}
          subtitle={`${totalPerService.toLocaleString()} Runbooks · Provider × Issue × Year Matrix`}
        />

        <div className="mt-4 p-4 rounded-2xl border border-gray-800 bg-black/20 text-sm text-gray-400">
          Alle Runbooks zu <strong className="text-gray-200">{service.name}</strong> sind sofort verfügbar — für jeden Provider, jedes Issue, jedes Jahr. Copy-paste-ready. Institutional grade.
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
          <a href="/services" className="hover:text-cyan-400">← Alle Services</a> ·{" "}
          <a href="/issues" className="hover:text-cyan-400">Issue Hubs</a> ·{" "}
          <a href="/runbooks" className="hover:text-cyan-400">Runbook Library</a>
        </div>
      </div>
    </Container>
  )
}
