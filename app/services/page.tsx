import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"
import { allServices100k, CLOUD_PROVIDERS_100K, ISSUES_100K, YEARS_100K } from "@/lib/pseo"
import { BASE_URL } from "@/lib/config"

export const dynamic = "force-static"

export const metadata = {
  title: "Services | ClawGuru",
  description:
    "Service-Index: SSH, Docker, Kubernetes, PostgreSQL, Nginx, Kafka und 70+ weitere Services — jeweils mit vollständiger Provider × Issue × Year Runbook-Matrix.",
  alternates: { canonical: "/services" },
}

export default function ServicesPage() {
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
    url: `${BASE_URL}/services`,
    itemListElement: services.map((service, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: service.name,
      url: `${BASE_URL}/service/${service.slug}`,
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
              href={`/service/${service.slug}`}
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
          <a className="hover:text-cyan-400" href="/issues">Issue Hubs</a> ·{" "}
          <a className="hover:text-cyan-400" href="/years">Year Hubs</a> ·{" "}
          <a className="hover:text-cyan-400" href="/runbooks">Runbook Library</a>
        </div>
      </div>
    </Container>
  )
}
