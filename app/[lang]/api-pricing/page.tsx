import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { Zap, Check, ArrowRight, Code, Database, Shield } from "lucide-react"
import Link from "next/link"
import { pick } from "@/lib/i18n-pick"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/api-pricing"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = pick(isDE, "Roast as a Service API Pricing — Developer API für Roast-Daten | ClawGuru", "Roast as a Service API Pricing — Developer API for Roast Data | ClawGuru")
  const description = pick(isDE, "Zugriff auf Roast-Daten via REST API. Pro-Plan ab 29€/Monat. Keine Mock-Daten, echte Security-Insights.", "Access roast data via REST API. Pro plan from 29€/month. No mock data, real security insights.")
  return {
    title,
    description,
    keywords: ["roast api", "api pricing", "security api", "developer api", "roast data"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const getTiers = (isDE: boolean) => [
  {
    name: pick(isDE, "Starter", "Starter"),
    price: pick(isDE, "0€", "0€"),
    period: pick(isDE, "Kostenlos", "Free"),
    description: pick(isDE, "Für Entwickler und Tests", "For developers and testing"),
    features: [
      pick(isDE, "100 API Calls/Monat", "100 API calls/month"),
      pick(isDE, "Read-only Zugriff", "Read-only access"),
      pick(isDE, "Community Support", "Community support"),
      pick(isDE, "Rate Limit: 10 req/min", "Rate limit: 10 req/min"),
    ],
    cta: pick(isDE, "Kostenlos starten", "Start for free"),
    popular: false,
  },
  {
    name: pick(isDE, "Pro", "Pro"),
    price: pick(isDE, "29€", "29€"),
    period: pick(isDE, "pro Monat", "per month"),
    description: pick(isDE, "Für Teams und Integrationen", "For teams and integrations"),
    features: [
      pick(isDE, "10.000 API Calls/Monat", "10,000 API calls/month"),
      pick(isDE, "Read + Write Zugriff", "Read + write access"),
      pick(isDE, "White-Label Widget", "White-label widget"),
      pick(isDE, "Priority Support", "Priority support"),
      pick(isDE, "Rate Limit: 100 req/min", "Rate limit: 100 req/min"),
      pick(isDE, "Webhooks für Events", "Webhooks for events"),
    ],
    cta: pick(isDE, "Pro starten", "Start Pro"),
    popular: true,
  },
  {
    name: pick(isDE, "Enterprise", "Enterprise"),
    price: pick(isDE, "Custom", "Custom"),
    period: pick(isDE, "auf Anfrage", "on request"),
    description: pick(isDE, "Für große Organisationen", "For large organizations"),
    features: [
      pick(isDE, "Unbegrenzte API Calls", "Unlimited API calls"),
      pick(isDE, "Dedicated Infrastructure", "Dedicated infrastructure"),
      pick(isDE, "SLA: 99.9%", "SLA: 99.9%"),
      pick(isDE, "24/7 Support", "24/7 support"),
      pick(isDE, "Custom Rate Limits", "Custom rate limits"),
      pick(isDE, "On-Premise Deployment", "On-premise deployment"),
    ],
    cta: pick(isDE, "Kontakt aufnehmen", "Contact sales"),
    popular: false,
  },
]

export default function ApiPricingPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const tiers = getTiers(isDE)

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">
            {pick(isDE, "Roast as a Service API Pricing", "Roast as a Service API Pricing")}
          </h1>
          <p className="text-lg text-gray-300 mb-4">
            {pick(isDE, "Zugriff auf echte Roast-Daten via REST API. Integriere Security-Insights direkt in deine Tools.", "Access real roast data via REST API. Integrate security insights directly into your tools.")}
          </p>
          <p className="text-sm text-cyan-400 font-medium">
            {pick(isDE, "→ Keine Mock-Daten. 100% echte Security-Insights aus der Datenbank.", "→ No mock data. 100% real security insights from the database.")}
          </p>
        </div>

        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "Dieser Leitfaden dient zur Härtung Ihrer eigenen Systeme. Keine Angriffstools.", "This guide is for hardening your own systems. No attack tools.")}
        </div>

        {/* API Endpoints */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "API Endpoints", "API Endpoints")}</h2>
          <div className="space-y-4">
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Code className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-cyan-400">GET /api/v1/roast-data</h3>
              </div>
              <p className="text-sm text-gray-300 mb-4">
                {pick(isDE, "Roast-Daten abrufen mit Pagination und Filtern. Echtzeit-Statistiken aus roast_results.", "Fetch roast data with pagination and filters. Real-time statistics from roast_results.")}
              </p>
              <div className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
                <code className="text-sm text-green-400">
                  {`curl -H "Authorization: Bearer YOUR_TOKEN" "https://clawguru.org/api/v1/roast-data?limit=100&minScore=0&maxScore=100"`}
                </code>
              </div>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-cyan-400">POST /api/v1/roast-data</h3>
              </div>
              <p className="text-sm text-gray-300 mb-4">
                {pick(isDE, "Neue Roast-Results erstellen. Authentifiziert mit Access Token.", "Create new roast results. Authenticated with access token.")}
              </p>
              <div className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
                <code className="text-sm text-green-400">
                  {`curl -X POST -H "Authorization: Bearer YOUR_TOKEN" -H "Content-Type: application/json" -d '{"stack_summary":"Kubernetes + Istio","score":85,"roast_level":"medium"}' "https://clawguru.org/api/v1/roast-data"`}
                </code>
              </div>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-cyan-400">GET /api/white-label/roast-widget</h3>
              </div>
              <p className="text-sm text-gray-300 mb-4">
                {pick(isDE, "White-Label Widget-Daten für B2B Integration. Pro-Plan erforderlich.", "White-label widget data for B2B integration. Pro plan required.")}
              </p>
              <div className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
                <code className="text-sm text-green-400">
                  {`curl -H "Authorization: Bearer YOUR_TOKEN" "https://clawguru.org/api/white-label/roast-widget?limit=10"`}
                </code>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Tiers */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Preispläne", "Pricing Plans")}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`bg-gray-800 p-6 rounded-lg border ${
                  tier.popular ? "border-cyan-500 relative" : "border-gray-700"
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-cyan-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {pick(isDE, "Beliebt", "Popular")}
                    </span>
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-100 mb-2">{tier.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-cyan-400">{tier.price}</span>
                  <span className="text-sm text-gray-400 ml-2">{tier.period}</span>
                </div>
                <p className="text-sm text-gray-300 mb-6">{tier.description}</p>
                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-gray-300">
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/${locale}/pricing`}
                  className={`block w-full text-center py-3 rounded-lg font-semibold transition-colors ${
                    tier.popular
                      ? "bg-cyan-600 hover:bg-cyan-500 text-white"
                      : "bg-gray-700 hover:bg-gray-600 text-gray-100"
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Use Cases */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Anwendungsfälle", "Use Cases")}</h2>
          <div className="space-y-4">
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">{pick(isDE, "Security Dashboards", "Security Dashboards")}</h3>
              <p className="text-sm text-gray-300">
                {pick(isDE, "Integriere Roast-Scores und -Trends in deine internen Dashboards für Echtzeit-Überwachung.", "Integrate roast scores and trends into your internal dashboards for real-time monitoring.")}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">{pick(isDE, "Automated Reporting", "Automated Reporting")}</h3>
              <p className="text-sm text-gray-300">
                {pick(isDE, "Generiere automatisierte Security-Reports mit Roast-Daten für Stakeholder.", "Generate automated security reports with roast data for stakeholders.")}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">{pick(isDE, "CI/CD Integration", "CI/CD Integration")}</h3>
              <p className="text-sm text-gray-300">
                {pick(isDE, "Führe Roasts in CI/CD Pipelines aus und blockiere Deployments mit niedrigen Scores.", "Run roasts in CI/CD pipelines and block deployments with low scores.")}
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mb-10">
          <div className="bg-gradient-to-r from-cyan-900/40 to-purple-900/40 border border-cyan-700/50 rounded-xl p-6 text-center">
            <h3 className="text-xl font-bold text-cyan-300 mb-2">
              {pick(isDE, "Bereit für die API?", "Ready for the API?")}
            </h3>
            <p className="text-sm text-cyan-200/70 mb-4">
              {pick(isDE, "Erhalte deinen API Key und starte mit echten Roast-Daten.", "Get your API key and start with real roast data.")}
            </p>
            <Link
              href={`/${locale}/pricing`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-semibold text-white transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
              {pick(isDE, "Jetzt starten", "Start now")}
            </Link>
          </div>
        </section>

        {/* Further Resources */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Weiterführende Ressourcen", "Further resources")}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href={`/${locale}/roast-my-moltbot`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Roast My Moltbot</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Roast starten", "Start the roast")}</div>
            </Link>
            <Link href={`/${locale}/runbooks`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Runbooks</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Fixes automatisieren", "Automate fixes")}</div>
            </Link>
            <Link href={`/${locale}/securitycheck`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Security Check</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Infrastruktur prüfen", "Check infrastructure")}</div>
            </Link>
            <Link href={`/${locale}/pricing`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Pricing</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Preise anzeigen", "View pricing")}</div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
