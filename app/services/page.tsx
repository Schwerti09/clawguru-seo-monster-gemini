import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"
import { BASE_URL } from "@/lib/config"
import { headers } from "next/headers"
import { DEFAULT_LOCALE, type Locale, localeAlternates } from "@/lib/i18n"

export const dynamic = "force-dynamic"

export async function generateMetadata() {
  const alts = localeAlternates("/services")
  return {
    title: "Services | ClawGuru",
    description: "Service-Index: SSH, Docker, Kubernetes, PostgreSQL, Nginx, Kafka und 70+ weitere Services — jeweils mit vollständiger Provider × Issue × Year Runbook-Matrix.",
    alternates: alts,
  }
}

export default async function ServicesPage() {
  const { allServices100k, CLOUD_PROVIDERS_100K, ISSUES_100K, YEARS_100K } = await import("@/lib/pseo")
  const h = headers()
  const locale = (h.get("x-claw-locale") ?? DEFAULT_LOCALE) as Locale
  const prefix = `/${locale}`
  const services = allServices100k()
  const totalPerService =
    (CLOUD_PROVIDERS_100K as unknown as unknown[]).length *
    (ISSUES_100K as unknown as unknown[]).length *
    (YEARS_100K as unknown as unknown[]).length

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "ClawGuru Service Hub Index",
    description: "Alle Services mit vollständiger Provider × Issue × Year Runbook-Matrix.",
    numberOfItems: services.length,
    url: `${BASE_URL}${prefix}/services`,
    itemListElement: services.map((service, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: service.name,
      url: `${BASE_URL}${prefix}/service/${service.slug}`,
    })),
  }

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${BASE_URL}${prefix}` },
      { "@type": "ListItem", position: 2, name: "Services", item: `${BASE_URL}${prefix}/services` },
    ],
  }

  return (
    <Container>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <div className="py-16 max-w-6xl mx-auto">
        <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2">
            <li><a href={prefix} className="hover:text-cyan-400">ClawGuru</a></li>
            <li>/</li>
            <li className="text-gray-300">Services</li>
          </ol>
        </nav>

        <SectionTitle
          kicker="Service Hubs"
          title="Services & Tools"
          subtitle={`${services.length} Services · je ${totalPerService.toLocaleString()} Runbooks (Provider × Issue × Year)`}
        />

        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <a
              key={service.slug}
              href={`${prefix}/service/${service.slug}`}
              className="p-6 rounded-3xl border border-gray-800 bg-black/25 hover:bg-black/35 transition-colors"
            >
              <div className="text-xs uppercase tracking-widest text-gray-500">Service Hub</div>
              <div className="text-lg font-extrabold mt-2">{service.name}</div>
              <div className="text-sm text-gray-400 mt-2">
                {totalPerService.toLocaleString()} Runbooks für alle Provider & Issues
              </div>
              <div className="mt-4 text-cyan-400 text-sm font-semibold">Runbooks ansehen →</div>
            </a>
          ))}
        </div>

        <div className="mt-12 text-sm text-gray-500">
          Mehr:{" "}
          <a className="hover:text-cyan-400" href={`${prefix}/issues`}>Issue Hubs</a> ·{" "}
          <a className="hover:text-cyan-400" href={`${prefix}/years`}>Year Hubs</a> ·{" "}
          <a className="hover:text-cyan-400" href={`${prefix}/runbooks`}>Runbook Library</a>
        </div>
      </div>
    </Container>
  )
}
