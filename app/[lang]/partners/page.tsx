import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { ExternalLink, Check, ArrowRight, Globe } from "lucide-react"
import Link from "next/link"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/partners"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = isDE
    ? "Roast Partners — Integration Marketplace | ClawGuru"
    : "Roast Partners — Integration Marketplace | ClawGuru"
  const description = isDE
    ? "Tool-Integrationen für ClawGuru. Ecosystem für Security-Tools. Keine Mock-Daten."
    : "Tool integrations for ClawGuru. Ecosystem for security tools. No mock data."
  return {
    title,
    description,
    keywords: ["roast partners", "integration marketplace", "tool integrations", "security ecosystem", "partner program"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const getPartners = (isDE: boolean) => [
  {
    name: "AWS",
    logo: "Amazon Web Services",
    description: isDE
      ? "Cloud-Provider Integration für AWS Security Services. Security Hub, GuardDuty, Inspector Integration."
      : "Cloud provider integration for AWS security services. Security Hub, GuardDuty, Inspector integration.",
    category: isDE ? "Cloud Provider" : "Cloud Provider",
    website: "https://aws.amazon.com",
    integration: isDE ? "Native" : "Native",
    popular: true,
  },
  {
    name: "Cloudflare",
    logo: "Cloudflare",
    description: isDE
      ? "WAF, CDN, und DNS Integration. Real-time Threat Intelligence und DDoS Protection."
      : "WAF, CDN, and DNS integration. Real-time threat intelligence and DDoS protection.",
    category: isDE ? "Security" : "Security",
    website: "https://cloudflare.com",
    integration: isDE ? "Native" : "Native",
    popular: false,
  },
  {
    name: "GitHub",
    logo: "GitHub",
    description: isDE
      ? "GitHub Actions Integration für CI/CD Security. Security Scans in Pull Requests."
      : "GitHub Actions integration for CI/CD security. Security scans in pull requests.",
    category: isDE ? "DevOps" : "DevOps",
    website: "https://github.com",
    integration: isDE ? "Native" : "Native",
    popular: false,
  },
  {
    name: "Hetzner",
    logo: "Hetzner",
    description: isDE
      ? "German Cloud-Provider Integration. Hetzner Cloud, Dedicated Server, Load Balancer."
      : "German cloud provider integration. Hetzner Cloud, dedicated server, load balancer.",
    category: isDE ? "Cloud Provider" : "Cloud Provider",
    website: "https://hetzner.com",
    integration: isDE ? "Native" : "Native",
    popular: false,
  },
  {
    name: "DigitalOcean",
    logo: "DigitalOcean",
    description: isDE
      ? "Developer-Cloud Integration. Droplets, Kubernetes, App Platform Security."
      : "Developer cloud integration. Droplets, Kubernetes, App Platform security.",
    category: isDE ? "Cloud Provider" : "Cloud Provider",
    website: "https://digitalocean.com",
    integration: isDE ? "Native" : "Native",
    popular: false,
  },
  {
    name: "GitLab",
    logo: "GitLab",
    description: isDE
      ? "GitLab CI/CD Integration. Security Scans, Dependency Scanning, Container Scanning."
      : "GitLab CI/CD integration. Security scans, dependency scanning, container scanning.",
    category: isDE ? "DevOps" : "DevOps",
    website: "https://gitlab.com",
    integration: isDE ? "Native" : "Native",
    popular: false,
  },
  {
    name: "Prometheus",
    logo: "Prometheus",
    description: isDE
      ? "Monitoring Integration. Metrics Collection, Alerting, Grafana Dashboard."
      : "Monitoring integration. Metrics collection, alerting, Grafana dashboard.",
    category: isDE ? "Monitoring" : "Monitoring",
    website: "https://prometheus.io",
    integration: isDE ? "Community" : "Community",
    popular: false,
  },
  {
    name: "Grafana",
    logo: "Grafana",
    description: isDE
      ? "Visualization Integration. Security Dashboards, Alerting, Data Visualization."
      : "Visualization integration. Security dashboards, alerting, data visualization.",
    category: isDE ? "Monitoring" : "Monitoring",
    website: "https://grafana.com",
    integration: isDE ? "Community" : "Community",
    popular: false,
  },
]

const getCategories = (isDE: boolean) => [
  isDE ? "Cloud Provider" : "Cloud Provider",
  isDE ? "Security" : "Security",
  isDE ? "DevOps" : "DevOps",
  isDE ? "Monitoring" : "Monitoring",
  isDE ? "Database" : "Database",
  isDE ? "Container" : "Container",
]

export default function PartnersPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const partners = getPartners(isDE)
  const categories = getCategories(isDE)

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">
            {isDE ? "Roast Partners — Integration Marketplace" : "Roast Partners — Integration Marketplace"}
          </h1>
          <p className="text-lg text-gray-300 mb-4">
            {isDE
              ? "Tool-Integrationen für ClawGuru. Ecosystem für Security-Tools."
              : "Tool integrations for ClawGuru. Ecosystem for security tools."}
          </p>
          <p className="text-sm text-cyan-400 font-medium">
            {isDE ? "→ Integriere deine Security-Tools mit ClawGuru." : "→ Integrate your security tools with ClawGuru."}
          </p>
        </div>

        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE
            ? "Diese Integrationen dienen zur Härtung Ihrer eigenen Systeme. Keine Angriffstools."
            : "These integrations are for hardening your own systems. No attack tools."}
        </div>

        {/* Partners Grid */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Partner" : "Partners"}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partners.map((partner, index) => (
              <div
                key={index}
                className={`bg-gray-800 p-6 rounded-lg border ${
                  partner.popular ? "border-cyan-500" : "border-gray-700"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-cyan-900 p-3 rounded-lg">
                    <Globe className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div className="bg-gray-900 px-2 py-1 rounded">
                    <span className="text-xs text-gray-400">{partner.category}</span>
                  </div>
                </div>

                <h3 className="font-bold text-gray-100 mb-2">{partner.name}</h3>
                <div className="text-sm text-gray-400 mb-3">{partner.logo}</div>
                <p className="text-sm text-gray-300 mb-4">{partner.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-400">
                    {isDE ? "Integration:" : "Integration:"}{" "}
                    <span className={`text-sm font-medium ${partner.integration === "Native" ? "text-green-400" : "text-cyan-400"}`}>
                      {partner.integration}
                    </span>
                  </div>
                </div>

                <a
                  href={partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold text-gray-100 text-sm transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  {isDE ? "Website besuchen" : "Visit Website"}
                </a>

                {partner.popular && (
                  <div className="mt-3 bg-cyan-900 px-2 py-1 rounded inline-block">
                    <span className="text-xs text-cyan-300">{isDE ? "Empfohlen" : "Recommended"}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Kategorien" : "Categories"}</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {categories.map((category, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-lg border border-gray-700 text-center">
                <h3 className="font-bold text-cyan-400 mb-2">{category}</h3>
                <p className="text-sm text-gray-300">
                  {isDE ? "Integrationen verfügbar" : "Integrations available"}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Become Partner */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Partner werden" : "Become a Partner"}</h2>
          <div className="space-y-4">
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">{isDE ? "Warum Partner werden?" : "Why become a partner?"}</h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Erreiche Millionen von Security-Professionals. Integriere dein Tool in das ClawGuru Ecosystem und steigere deine Sichtbarkeit."
                  : "Reach millions of security professionals. Integrate your tool into the ClawGuru ecosystem and increase your visibility."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">{isDE ? "Partner-Vorteile" : "Partner benefits"}</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  {isDE ? "Integration in ClawGuru Marketplace" : "Integration in ClawGuru marketplace"}
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  {isDE ? "Co-Marketing Opportunities" : "Co-marketing opportunities"}
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  {isDE ? "Joint Webinars und Events" : "Joint webinars and events"}
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  {isDE ? "Priority Support für Integration" : "Priority support for integration"}
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mb-10">
          <div className="bg-gradient-to-r from-cyan-900/40 to-purple-900/40 border border-cyan-700/50 rounded-xl p-6 text-center">
            <h3 className="text-xl font-bold text-cyan-300 mb-2">
              {isDE ? "Bereit für Partnership?" : "Ready for Partnership?"}
            </h3>
            <p className="text-sm text-cyan-200/70 mb-4">
              {isDE
                ? "Werde Partner und integriere dein Tool in das ClawGuru Ecosystem."
                : "Become a partner and integrate your tool into the ClawGuru ecosystem."}
            </p>
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-semibold text-white transition-colors">
              {isDE ? "Partner werden" : "Become a Partner"}
            </button>
          </div>
        </section>

        {/* Further Resources */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Weiterführende Ressourcen" : "Further resources"}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href={`/${locale}/api-pricing`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{isDE ? "API Pricing" : "API Pricing"}</div>
              <div className="text-sm text-gray-300">{isDE ? "API-Zugang" : "API access"}</div>
            </Link>
            <Link href={`/${locale}/consulting`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{isDE ? "Consulting" : "Consulting"}</div>
              <div className="text-sm text-gray-300">{isDE ? "Professional Services" : "Professional services"}</div>
            </Link>
            <Link href={`/${locale}/roast-my-moltbot`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{isDE ? "Roast My Moltbot" : "Roast My Moltbot"}</div>
              <div className="text-sm text-gray-300">{isDE ? "Roast starten" : "Start the roast"}</div>
            </Link>
            <Link href={`/${locale}/check`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{isDE ? "Security Check" : "Security Check"}</div>
              <div className="text-sm text-gray-300">{isDE ? "Infrastruktur prüfen" : "Check infrastructure"}</div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
