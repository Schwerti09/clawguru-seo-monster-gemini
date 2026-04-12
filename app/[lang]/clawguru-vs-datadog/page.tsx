import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/clawguru-vs-datadog"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const title = "ClawGuru vs Datadog: Security-Monitoring Vergleich 2026"
  const description = "ClawGuru vs Datadog im direkten Vergleich: Sicherheitsüberwachung, DSGVO-Compliance, Self-Hosting, Preise und Automatisierung. Welche Plattform passt zu Ihrem Team?"
  return {
    title,
    description,
    keywords: ["clawguru vs datadog", "monitoring vergleich", "sicherheitsüberwachung", "self-hosted monitoring", "dsgvo monitoring"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: {
      title,
      description,
      type: "article",
      url: pageUrl,
      images: ["/og-image.png"],
    },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Was ist der Hauptunterschied zwischen ClawGuru und Datadog?",
      acceptedAnswer: { "@type": "Answer", text: "ClawGuru ist Security-first mit Self-Hosting und DSGVO-Compliance. Datadog ist ein umfassendes Observability-SaaS mit APM und RUM-Fokus, aber US-basierten Rechenzentren." },
    },
    {
      "@type": "Question",
      name: "Ist ClawGuru DSGVO-konform im Vergleich zu Datadog?",
      acceptedAnswer: { "@type": "Answer", text: "Ja. ClawGuru ist DSGVO-konform durch Self-Hosting – alle Daten bleiben auf Ihrer eigenen Infrastruktur. Datadog speichert Daten in US-Rechenzentren, was für EU-Unternehmen problematisch sein kann." },
    },
    {
      "@type": "Question",
      name: "Welche Plattform ist günstiger: ClawGuru oder Datadog?",
      acceptedAnswer: { "@type": "Answer", text: "ClawGuru bietet ein Festpreis-Lizenzmodell (ab 999$/Jahr bis 100 Hosts) ohne nutzungsbasierte Gebühren. Datadog berechnet pro Host und Nutzung, was bei wachsender Infrastruktur erheblich teurer werden kann." },
    },
    {
      "@type": "Question",
      name: "Hat ClawGuru Runbooks wie Datadog?",
      acceptedAnswer: { "@type": "Answer", text: "Ja, ClawGuru bietet 600+ ausführbare Security-Runbooks – das ist mehr Automatisierung als Datadogs eingeschränkte Workflow-Automation. Die Runbooks decken SSH, Firewall, Container, CI/CD und mehr ab." },
    },
  ],
}

export default function ClawGuruVsDatadogPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">Kein Penetrationstest</strong>: Dieser Vergleich dient der Sicherheitsarchitektur-Entscheidung. Keine Angriffswerkzeuge.
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">ClawGuru vs Datadog: Security-Monitoring Vergleich 2026</h1>
        <p className="text-lg text-gray-300 mb-8">Umfassender Plattformvergleich für Security-Monitoring, Infrastrukturüberwachung und DevOps-Teams. Wir zeigen, welche Lösung für DSGVO-konformes Self-Hosting, Sicherheitsautomatisierung und Kosteneffizienz besser geeignet ist.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Schnellvergleich</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-900 p-6 rounded-lg border border-blue-700">
              <h3 className="font-bold text-blue-300 mb-4">ClawGuru</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start"><span className="text-green-400 mr-2">✓</span>Security-first Monitoring</li>
                <li className="flex items-start"><span className="text-green-400 mr-2">✓</span>Self-Hosted – Daten bleiben bei Ihnen</li>
                <li className="flex items-start"><span className="text-green-400 mr-2">✓</span>DSGVO/GDPR-konform</li>
                <li className="flex items-start"><span className="text-green-400 mr-2">✓</span>600+ ausführbare Security-Runbooks</li>
                <li className="flex items-start"><span className="text-green-400 mr-2">✓</span>Festpreis-Lizenz, keine Überraschungskosten</li>
              </ul>
            </div>
            <div className="bg-purple-900 p-6 rounded-lg border border-purple-700">
              <h3 className="font-bold text-purple-300 mb-4">Datadog</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start"><span className="text-green-400 mr-2">✓</span>Umfassendes Observability-SaaS</li>
                <li className="flex items-start"><span className="text-green-400 mr-2">✓</span>Echtzeit-Metriken & Traces</li>
                <li className="flex items-start"><span className="text-green-400 mr-2">✓</span>APM & RUM Integration</li>
                <li className="flex items-start"><span className="text-green-400 mr-2">✓</span>600+ Integrationen out-of-the-box</li>
                <li className="flex items-start"><span className="text-yellow-400 mr-2">~</span>US-Rechenzentren (DSGVO-Risiko)</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Feature-Vergleich</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Feature</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ClawGuru</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Datadog</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                <tr><td className="px-6 py-4 text-sm font-medium text-gray-100">Sicherheitsüberwachung</td><td className="px-6 py-4 text-sm text-green-400">Security-first, tief integriert</td><td className="px-6 py-4 text-sm text-yellow-400">Basis-Sicherheit, Add-on</td></tr>
                <tr className="bg-gray-800"><td className="px-6 py-4 text-sm font-medium text-gray-100">Deployment</td><td className="px-6 py-4 text-sm text-green-400">Self-Hosted, On-Prem, Cloud</td><td className="px-6 py-4 text-sm text-yellow-400">Nur Cloud (SaaS)</td></tr>
                <tr><td className="px-6 py-4 text-sm font-medium text-gray-100">Datenschutz</td><td className="px-6 py-4 text-sm text-green-400">DSGVO-konform, EU-Daten</td><td className="px-6 py-4 text-sm text-red-400">US-Rechenzentren</td></tr>
                <tr className="bg-gray-800"><td className="px-6 py-4 text-sm font-medium text-gray-100">Automatisierung</td><td className="px-6 py-4 text-sm text-green-400">600+ ausführbare Runbooks</td><td className="px-6 py-4 text-sm text-yellow-400">Eingeschränkte Workflows</td></tr>
                <tr><td className="px-6 py-4 text-sm font-medium text-gray-100">APM / Tracing</td><td className="px-6 py-4 text-sm text-yellow-400">Eingeschränkt</td><td className="px-6 py-4 text-sm text-green-400">Umfassendes APM & RUM</td></tr>
                <tr className="bg-gray-800"><td className="px-6 py-4 text-sm font-medium text-gray-100">Preismodell</td><td className="px-6 py-4 text-sm text-green-400">Festpreis-Lizenz</td><td className="px-6 py-4 text-sm text-yellow-400">Pro Host/Nutzung</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Wann ClawGuru wählen?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="font-bold text-cyan-400 mb-4">ClawGuru ist die richtige Wahl wenn:</h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start"><span className="text-cyan-400 mr-2">→</span>Sicherheitsüberwachung oberste Priorität hat</li>
                <li className="flex items-start"><span className="text-cyan-400 mr-2">→</span>DSGVO/EU-Compliance zwingend erforderlich ist</li>
                <li className="flex items-start"><span className="text-cyan-400 mr-2">→</span>Sie Ihre Infrastruktur selbst hosten möchten</li>
                <li className="flex items-start"><span className="text-cyan-400 mr-2">→</span>Umfangreiche Security-Automatisierung benötigt wird</li>
                <li className="flex items-start"><span className="text-cyan-400 mr-2">→</span>Planbare, fixe Lizenzkosten bevorzugt werden</li>
              </ul>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="font-bold text-purple-300 mb-4">Datadog ist besser wenn:</h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start"><span className="text-purple-400 mr-2">→</span>Umfassendes Observability (APM, RUM, Traces) benötigt</li>
                <li className="flex items-start"><span className="text-purple-400 mr-2">→</span>600+ Out-of-the-box Integrationen wichtig sind</li>
                <li className="flex items-start"><span className="text-purple-400 mr-2">→</span>Cloud-native Architektur bevorzugt wird</li>
                <li className="flex items-start"><span className="text-purple-400 mr-2">→</span>KI-gestützte Anomalieerkennung gewünscht ist</li>
                <li className="flex items-start"><span className="text-purple-400 mr-2">→</span>DSGVO keine kritische Anforderung darstellt</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Preisvergleich 2026</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                <h3 className="font-bold text-cyan-400 mb-3">ClawGuru Preise</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li><strong className="text-gray-100">Explorer:</strong> Kostenlos (bis 10 Hosts)</li>
                  <li><strong className="text-gray-100">Pro:</strong> 999$/Jahr (bis 100 Hosts)</li>
                  <li><strong className="text-gray-100">Team:</strong> 4.999$/Jahr (unbegrenzte Hosts)</li>
                  <li><strong className="text-gray-100">Enterprise:</strong> Individuelles Angebot</li>
                  <li className="text-green-400 mt-2">Keine nutzungsbasierten Zusatzkosten</li>
                </ul>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                <h3 className="font-bold text-purple-300 mb-3">Datadog Preise</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li><strong className="text-gray-100">Infrastructure:</strong> 15$/Host/Monat</li>
                  <li><strong className="text-gray-100">APM:</strong> 31$/Host/Monat + Traces</li>
                  <li><strong className="text-gray-100">Logs:</strong> 0,10$/ingested GB</li>
                  <li><strong className="text-gray-100">RUM:</strong> 0,005$/Session</li>
                  <li className="text-red-400 mt-2">Nutzungsbasiert – kann teuer werden</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Häufige Fragen (FAQ)</h2>
          <div className="space-y-4">
            {faqSchema.mainEntity.map((item, i) => (
              <details key={i} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <summary className="font-semibold text-gray-100 cursor-pointer">{item.name}</summary>
                <p className="mt-3 text-sm text-gray-300">{item.acceptedAnswer.text}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Weiterführende Ressourcen</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href={`/${locale}/check`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Security Check</div>
              <div className="text-sm text-gray-300">Ihr System jetzt scannen</div>
            </a>
            <a href={`/${locale}/runbooks`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Runbooks</div>
              <div className="text-sm text-gray-300">600+ Security-Playbooks</div>
            </a>
            <a href={`/${locale}/moltbot/security-framework`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Moltbot Security Framework</div>
              <div className="text-sm text-gray-300">Automatisierte Sicherheit</div>
            </a>
            <a href={`/${locale}/solutions/kubernetes-security-hardening`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Kubernetes Security</div>
              <div className="text-sm text-gray-300">Kompletter Härtungsleitfaden</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
