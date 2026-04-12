import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot-vs-pagerduty"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const title = "Moltbot vs PagerDuty: Incident-Response Vergleich 2026"
  const description = "Moltbot vs PagerDuty im direkten Vergleich: Incident-Response, Alert-Management, DSGVO-Compliance und Self-Hosting. Welche Plattform eignet sich besser für Ihr DevOps-Team?"
  return {
    title,
    description,
    keywords: ["moltbot vs pagerduty", "incident response vergleich", "alert management", "devops automatisierung", "selbst-gehostet incident management"],
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
    { "@type": "Question", name: "Was ist der Unterschied zwischen Moltbot und PagerDuty?", acceptedAnswer: { "@type": "Answer", text: "Moltbot ist ein selbst-gehosteter Incident-Response-Automatisierer mit DSGVO-Compliance. PagerDuty ist ein Cloud-SaaS-Alerting-Tool ohne Self-Hosting-Option." } },
    { "@type": "Question", name: "Kann Moltbot PagerDuty ersetzen?", acceptedAnswer: { "@type": "Answer", text: "Für Teams mit EU-Datenschutzanforderungen und Self-Hosting-Bedarf ja. Moltbot bietet vergleichbare Alerting- und Eskalations-Features plus Security-Automatisierung durch 600+ Runbooks." } },
    { "@type": "Question", name: "Welche Plattform ist DSGVO-konform?", acceptedAnswer: { "@type": "Answer", text: "Moltbot ist durch Self-Hosting vollständig DSGVO-konform – alle Daten bleiben in Ihrer eigenen Infrastruktur. PagerDuty speichert Daten in US-Rechenzentren." } },
    { "@type": "Question", name: "Was kostet PagerDuty im Vergleich zu Moltbot?", acceptedAnswer: { "@type": "Answer", text: "PagerDuty startet bei ca. 21$/User/Monat und wird bei wachsenden Teams teuer. Moltbot bietet ein Festpreis-Lizenzmodell ohne nutzungsbasierte Überraschungskosten." } },
  ],
}

export default function MoltbotVsPagerdutyPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">Kein Penetrationstest</strong>: Dieser Vergleich dient der Incident-Response-Architekturentscheidung. Keine Angriffswerkzeuge.
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">Moltbot vs PagerDuty: Incident-Response Vergleich 2026</h1>
        <p className="text-lg text-gray-300 mb-8">Umfassender Vergleich für DevOps-Teams und SREs: Moltbot als selbst-gehostete, DSGVO-konforme Alternative zu PagerDuty mit integrierter Security-Automatisierung und über 600 ausführbaren Runbooks.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Schnellvergleich</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-900 p-6 rounded-lg border border-purple-700">
              <h3 className="font-bold text-purple-300 mb-4">Moltbot</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start"><span className="text-green-400 mr-2">✓</span>KI-gestützte Incident Response</li>
                <li className="flex items-start"><span className="text-green-400 mr-2">✓</span>Self-Hosted – vollständige Datenkontrolle</li>
                <li className="flex items-start"><span className="text-green-400 mr-2">✓</span>Security-fokussierte Automatisierung</li>
                <li className="flex items-start"><span className="text-green-400 mr-2">✓</span>600+ ausführbare Runbooks</li>
                <li className="flex items-start"><span className="text-green-400 mr-2">✓</span>Kein Vendor Lock-in</li>
              </ul>
            </div>
            <div className="bg-red-900 p-6 rounded-lg border border-red-700">
              <h3 className="font-bold text-red-300 mb-4">PagerDuty</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start"><span className="text-green-400 mr-2">✓</span>Branchenstandard für Incident-Management</li>
                <li className="flex items-start"><span className="text-green-400 mr-2">✓</span>24/7 Betriebsunterstützung</li>
                <li className="flex items-start"><span className="text-green-400 mr-2">✓</span>Enterprise-Zuverlässigkeit</li>
                <li className="flex items-start"><span className="text-green-400 mr-2">✓</span>700+ native Integrationen</li>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Moltbot</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">PagerDuty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                <tr><td className="px-6 py-4 text-sm font-medium text-gray-100">Incident-Management</td><td className="px-6 py-4 text-sm text-green-400">KI-Triage & Automatisierung</td><td className="px-6 py-4 text-sm text-green-400">Branchenstandard-Workflow</td></tr>
                <tr className="bg-gray-800"><td className="px-6 py-4 text-sm font-medium text-gray-100">Automatisierung</td><td className="px-6 py-4 text-sm text-green-400">600+ ausführbare Runbooks</td><td className="px-6 py-4 text-sm text-yellow-400">Eingeschränkte Automation</td></tr>
                <tr><td className="px-6 py-4 text-sm font-medium text-gray-100">Deployment</td><td className="px-6 py-4 text-sm text-green-400">Self-Hosted, On-Prem, Cloud</td><td className="px-6 py-4 text-sm text-yellow-400">Nur Cloud (SaaS)</td></tr>
                <tr className="bg-gray-800"><td className="px-6 py-4 text-sm font-medium text-gray-100">Datenschutz</td><td className="px-6 py-4 text-sm text-green-400">DSGVO-konform, EU-Daten</td><td className="px-6 py-4 text-sm text-red-400">US-Rechenzentren</td></tr>
                <tr><td className="px-6 py-4 text-sm font-medium text-gray-100">Sicherheitsfokus</td><td className="px-6 py-4 text-sm text-green-400">Security-spezialisiert</td><td className="px-6 py-4 text-sm text-yellow-400">Allgemeines Alerting</td></tr>
                <tr className="bg-gray-800"><td className="px-6 py-4 text-sm font-medium text-gray-100">Preismodell</td><td className="px-6 py-4 text-sm text-green-400">Festpreis-Lizenz</td><td className="px-6 py-4 text-sm text-yellow-400">Pro User/Monat</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Wann welche Plattform wählen?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="font-bold text-cyan-400 mb-4">Moltbot wählen wenn:</h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start"><span className="text-purple-400 mr-2">→</span>Security-Incident-Response Priorität hat</li>
                <li className="flex items-start"><span className="text-purple-400 mr-2">→</span>Umfangreiche Automatisierung benötigt wird</li>
                <li className="flex items-start"><span className="text-purple-400 mr-2">→</span>DSGVO-konformes Self-Hosting gewünscht ist</li>
                <li className="flex items-start"><span className="text-purple-400 mr-2">→</span>KI-gestützte Triage erforderlich ist</li>
                <li className="flex items-start"><span className="text-purple-400 mr-2">→</span>Planbare Fixkosten bevorzugt werden</li>
              </ul>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="font-bold text-red-300 mb-4">PagerDuty wählen wenn:</h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start"><span className="text-red-400 mr-2">→</span>Branchenstandard-Zuverlässigkeit nötig ist</li>
                <li className="flex items-start"><span className="text-red-400 mr-2">→</span>24/7-Betriebsteams vorhanden sind</li>
                <li className="flex items-start"><span className="text-red-400 mr-2">→</span>Enterprise-Support erforderlich ist</li>
                <li className="flex items-start"><span className="text-red-400 mr-2">→</span>Cloud-native Lösung bevorzugt wird</li>
                <li className="flex items-start"><span className="text-red-400 mr-2">→</span>700+ Integrationen out-of-the-box benötigt</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Preisvergleich 2026</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                <h3 className="font-bold text-purple-300 mb-3">Moltbot Preise</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li><strong className="text-gray-100">Explorer:</strong> Kostenlos (bis 10 Nutzer)</li>
                  <li><strong className="text-gray-100">Pro:</strong> 2.999$/Jahr (bis 50 Nutzer)</li>
                  <li><strong className="text-gray-100">Team:</strong> 9.999$/Jahr (unbegrenzt)</li>
                  <li><strong className="text-gray-100">Enterprise:</strong> Individuelles Angebot</li>
                  <li className="text-green-400 mt-2">Keine nutzerbasierten Zusatzkosten</li>
                </ul>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                <h3 className="font-bold text-red-300 mb-3">PagerDuty Preise</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li><strong className="text-gray-100">Business:</strong> 29$/Nutzer/Monat</li>
                  <li><strong className="text-gray-100">Digital Operations:</strong> 49$/Nutzer/Monat</li>
                  <li><strong className="text-gray-100">Enterprise:</strong> Individuell</li>
                  <li><strong className="text-gray-100">Event Intelligence:</strong> Zusatzkosten</li>
                  <li className="text-red-400 mt-2">Wird bei großen Teams teuer</li>
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
              <div className="text-sm text-gray-300">System jetzt scannen</div>
            </a>
            <a href={`/${locale}/runbooks`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Runbooks</div>
              <div className="text-sm text-gray-300">600+ Security-Playbooks</div>
            </a>
            <a href={`/${locale}/moltbot/incident-response-automation`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Incident Response</div>
              <div className="text-sm text-gray-300">Moltbot Automatisierung</div>
            </a>
            <a href={`/${locale}/solutions/kubernetes-security-hardening`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Kubernetes Security</div>
              <div className="text-sm text-gray-300">Complete hardening guide</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
