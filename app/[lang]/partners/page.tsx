import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { ExternalLink, Check, ArrowRight, Globe } from "lucide-react"
import Link from "next/link"
import { pick } from "@/lib/i18n-pick"

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
  const title = pick(isDE, "Roast Partners — Integration Marketplace | ClawGuru", "Roast Partners — Integration Marketplace | ClawGuru")
  const description = pick(isDE, "Tool-Integrationen für ClawGuru. Ecosystem für Security-Tools. Keine Mock-Daten.", "Tool integrations for ClawGuru. Ecosystem for security tools. No mock data.")
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
    description: pick(isDE, "Cloud-Provider Integration für AWS Security Services. Security Hub, GuardDuty, Inspector Integration.", "Cloud provider integration for AWS security services. Security Hub, GuardDuty, Inspector integration."),
    category: pick(isDE, "Cloud Provider", "Cloud Provider"),
    website: "https://aws.amazon.com",
    integration: pick(isDE, "Native", "Native"),
    popular: true,
  },
  {
    name: "Cloudflare",
    logo: "Cloudflare",
    description: pick(isDE, "WAF, CDN, und DNS Integration. Real-time Threat Intelligence und DDoS Protection.", "WAF, CDN, and DNS integration. Real-time threat intelligence and DDoS protection."),
    category: pick(isDE, "Security", "Security"),
    website: "https://cloudflare.com",
    integration: pick(isDE, "Native", "Native"),
    popular: false,
  },
  {
    name: "GitHub",
    logo: "GitHub",
    description: pick(isDE, "GitHub Actions Integration für CI/CD Security. Security Scans in Pull Requests.", "GitHub Actions integration for CI/CD security. Security scans in pull requests."),
    category: pick(isDE, "DevOps", "DevOps"),
    website: "https://github.com",
    integration: pick(isDE, "Native", "Native"),
    popular: false,
  },
  {
    name: "Hetzner",
    logo: "Hetzner",
    description: pick(isDE, "German Cloud-Provider Integration. Hetzner Cloud, Dedicated Server, Load Balancer.", "German cloud provider integration. Hetzner Cloud, dedicated server, load balancer."),
    category: pick(isDE, "Cloud Provider", "Cloud Provider"),
    website: "https://hetzner.com",
    integration: pick(isDE, "Native", "Native"),
    popular: false,
  },
  {
    name: "DigitalOcean",
    logo: "DigitalOcean",
    description: pick(isDE, "Developer-Cloud Integration. Droplets, Kubernetes, App Platform Security.", "Developer cloud integration. Droplets, Kubernetes, App Platform security."),
    category: pick(isDE, "Cloud Provider", "Cloud Provider"),
    website: "https://digitalocean.com",
    integration: pick(isDE, "Native", "Native"),
    popular: false,
  },
  {
    name: "GitLab",
    logo: "GitLab",
    description: pick(isDE, "GitLab CI/CD Integration. Security Scans, Dependency Scanning, Container Scanning.", "GitLab CI/CD integration. Security scans, dependency scanning, container scanning."),
    category: pick(isDE, "DevOps", "DevOps"),
    website: "https://gitlab.com",
    integration: pick(isDE, "Native", "Native"),
    popular: false,
  },
  {
    name: "Prometheus",
    logo: "Prometheus",
    description: pick(isDE, "Monitoring Integration. Metrics Collection, Alerting, Grafana Dashboard.", "Monitoring integration. Metrics collection, alerting, Grafana dashboard."),
    category: pick(isDE, "Monitoring", "Monitoring"),
    website: "https://prometheus.io",
    integration: pick(isDE, "Community", "Community"),
    popular: false,
  },
  {
    name: "Grafana",
    logo: "Grafana",
    description: pick(isDE, "Visualization Integration. Security Dashboards, Alerting, Data Visualization.", "Visualization integration. Security dashboards, alerting, data visualization."),
    category: pick(isDE, "Monitoring", "Monitoring"),
    website: "https://grafana.com",
    integration: pick(isDE, "Community", "Community"),
    popular: false,
  },
]

const getCategories = (isDE: boolean) => [
  pick(isDE, "Cloud Provider", "Cloud Provider"),
  pick(isDE, "Security", "Security"),
  pick(isDE, "DevOps", "DevOps"),
  pick(isDE, "Monitoring", "Monitoring"),
  pick(isDE, "Database", "Database"),
  pick(isDE, "Container", "Container"),
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
            {pick(isDE, "Roast Partners — Integration Marketplace", "Roast Partners — Integration Marketplace")}
          </h1>
          <p className="text-lg text-gray-300 mb-4">
            {pick(isDE, "Tool-Integrationen für ClawGuru. Ecosystem für Security-Tools.", "Tool integrations for ClawGuru. Ecosystem for security tools.")}
          </p>
          <p className="text-sm text-cyan-400 font-medium">
            {pick(isDE, "→ Integriere deine Security-Tools mit ClawGuru.", "→ Integrate your security tools with ClawGuru.")}
          </p>
        </div>

        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "Diese Integrationen dienen zur Härtung Ihrer eigenen Systeme. Keine Angriffstools.", "These integrations are for hardening your own systems. No attack tools.")}
        </div>

        {/* Partners Grid */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Partner", "Partners")}</h2>
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
                    {pick(isDE, "Integration:", "Integration:")}{" "}
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
                  {pick(isDE, "Website besuchen", "Visit Website")}
                </a>

                {partner.popular && (
                  <div className="mt-3 bg-cyan-900 px-2 py-1 rounded inline-block">
                    <span className="text-xs text-cyan-300">{pick(isDE, "Empfohlen", "Recommended")}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Kategorien", "Categories")}</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {categories.map((category, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-lg border border-gray-700 text-center">
                <h3 className="font-bold text-cyan-400 mb-2">{category}</h3>
                <p className="text-sm text-gray-300">
                  {pick(isDE, "Integrationen verfügbar", "Integrations available")}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Become Partner */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Partner werden", "Become a Partner")}</h2>
          <div className="space-y-4">
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">{pick(isDE, "Warum Partner werden?", "Why become a partner?")}</h3>
              <p className="text-sm text-gray-300">
                {pick(isDE, "Erreiche Millionen von Security-Professionals. Integriere dein Tool in das ClawGuru Ecosystem und steigere deine Sichtbarkeit.", "Reach millions of security professionals. Integrate your tool into the ClawGuru ecosystem and increase your visibility.")}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">{pick(isDE, "Partner-Vorteile", "Partner benefits")}</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  {pick(isDE, "Integration in ClawGuru Marketplace", "Integration in ClawGuru marketplace")}
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  {pick(isDE, "Co-Marketing Opportunities", "Co-marketing opportunities")}
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  {pick(isDE, "Joint Webinars und Events", "Joint webinars and events")}
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  {pick(isDE, "Priority Support für Integration", "Priority support for integration")}
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mb-10">
          <div className="bg-gradient-to-r from-cyan-900/40 to-purple-900/40 border border-cyan-700/50 rounded-xl p-6 text-center">
            <h3 className="text-xl font-bold text-cyan-300 mb-2">
              {pick(isDE, "Bereit für Partnership?", "Ready for Partnership?")}
            </h3>
            <p className="text-sm text-cyan-200/70 mb-4">
              {pick(isDE, "Werde Partner und integriere dein Tool in das ClawGuru Ecosystem.", "Become a partner and integrate your tool into the ClawGuru ecosystem.")}
            </p>
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-semibold text-white transition-colors">
              {pick(isDE, "Partner werden", "Become a Partner")}
            </button>
          </div>
        </section>

        {/* Further Resources */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Weiterführende Ressourcen", "Further resources")}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href={`/${locale}/api-pricing`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{pick(isDE, "API Pricing", "API Pricing")}</div>
              <div className="text-sm text-gray-300">{pick(isDE, "API-Zugang", "API access")}</div>
            </Link>
            <Link href={`/${locale}/consulting`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{pick(isDE, "Consulting", "Consulting")}</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Professional Services", "Professional services")}</div>
            </Link>
            <Link href={`/${locale}/roast-my-moltbot`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{pick(isDE, "Roast My Moltbot", "Roast My Moltbot")}</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Roast starten", "Start the roast")}</div>
            </Link>
            <Link href={`/${locale}/check`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{pick(isDE, "Security Check", "Security Check")}</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Infrastruktur prüfen", "Check infrastructure")}</div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
