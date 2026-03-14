import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"
import { notFound } from "next/navigation"
import { BASE_URL } from "@/lib/config"
import { headers } from "next/headers"
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n"

export const revalidate = 60
export const dynamicParams = true

export async function generateStaticParams() {
  const { allYears100k } = await import("@/lib/pseo")
  return allYears100k().map((year) => ({ year }))
}

export async function generateMetadata(props: { params: { year: string } }) {
  const params = props.params
  const { allYears100k, CLOUD_PROVIDERS_100K, SERVICES_100K, ISSUES_100K } = await import("@/lib/pseo")
  const years = allYears100k()
  if (!years.includes(params.year)) return {}
  const totalPerYear =
    (CLOUD_PROVIDERS_100K as unknown as unknown[]).length *
    (SERVICES_100K as unknown as unknown[]).length *
    (ISSUES_100K as unknown as unknown[]).length
  return {
    title: `${params.year} Security & Ops Runbooks | ClawGuru`,
    description: `${totalPerYear.toLocaleString()} Runbooks für ${params.year}: Security, Hardening, Compliance und Incident Response für alle Cloud-Provider und Services — copy-paste-ready.`,
    alternates: { canonical: `/year/${params.year}` },
    openGraph: {
      title: `${params.year} Security Runbooks | ClawGuru`,
      description: `${totalPerYear.toLocaleString()} Runbooks. Provider × Service × Issue Matrix.`,
      type: "website",
    },
  }
}

export default async function YearHubPage(props: { params: { year: string } }) {
  const params = props.params
  const { allYears100k, getSampleSlugsByYear, getRunbook, CLOUD_PROVIDERS_100K, SERVICES_100K, ISSUES_100K } = await import("@/lib/pseo")
  const years = allYears100k()
  if (!years.includes(params.year)) return notFound()
  const h = headers()
  const locale = (h.get("x-claw-locale") ?? DEFAULT_LOCALE) as Locale
  const prefix = `/${locale}`

  const year = params.year
  const sampleSlugs = getSampleSlugsByYear(year, 48)
  const samples = sampleSlugs.map((s) => getRunbook(s)).filter(Boolean) as NonNullable<ReturnType<typeof getRunbook>>[]

  const totalPerYear =
    (CLOUD_PROVIDERS_100K as unknown as unknown[]).length *
    (SERVICES_100K as unknown as unknown[]).length *
    (ISSUES_100K as unknown as unknown[]).length

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${BASE_URL}${prefix}` },
      { "@type": "ListItem", position: 2, name: "Years", item: `${BASE_URL}${prefix}/years` },
      { "@type": "ListItem", position: 3, name: year, item: `${BASE_URL}${prefix}/year/${year}` },
    ],
  }

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${year} Security & Ops Runbooks`,
    description: `${totalPerYear.toLocaleString()} Runbooks für ${year}.`,
    numberOfItems: Math.min(samples.length, 10),
    itemListElement: samples.slice(0, 10).map((r, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${BASE_URL}${prefix}/runbook/${r.slug}`,
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
            <li><a href={prefix} className="hover:text-cyan-400">ClawGuru</a></li>
            <li>/</li>
            <li><a href={`${prefix}/years`} className="hover:text-cyan-400">Years</a></li>
            <li>/</li>
            <li className="text-gray-300">{year}</li>
          </ol>
        </nav>

        <SectionTitle
          kicker="Year Hub"
          title={`${year} Runbooks`}
          subtitle={`${totalPerYear.toLocaleString()} Runbooks · Provider × Service × Issue Matrix`}
        />

        <div className="mt-4 p-4 rounded-2xl border border-gray-800 bg-black/20 text-sm text-gray-400">
          Alle <strong className="text-gray-200">{year}</strong> Runbooks sind sofort verfügbar — für jeden Provider, jeden Service und jedes Issue. Copy-paste-ready. Institutional grade.
        </div>

        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {samples.map((r) => (
            <a
              key={r.slug}
              href={`${prefix}/runbook/${r.slug}`}
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
          <a href={`${prefix}/years`} className="hover:text-cyan-400">← Alle Years</a> ·{" "}
          <a href={`${prefix}/issues`} className="hover:text-cyan-400">Issue Hubs</a> ·{" "}
          <a href={`${prefix}/runbooks`} className="hover:text-cyan-400">Runbook Library</a>
        </div>
      </div>
    </Container>
  )
}
