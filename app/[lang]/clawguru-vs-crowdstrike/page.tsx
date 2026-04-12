import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/clawguru-vs-crowdstrike"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const title = "ClawGuru vs CrowdStrike: SIEM & EDR Sicherheitsvergleich 2026"
  const description = "ClawGuru vs CrowdStrike im direkten Vergleich: SIEM, EDR, DSGVO-Compliance, Self-Hosting und Preise. Welche Security-Plattform eignet sich für EU-Unternehmen besser?"
  return {
    title,
    description,
    keywords: ["clawguru vs crowdstrike", "siem vergleich", "edr vergleich", "security plattform", "self-hosted security dsgvo"],
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
    { "@type": "Question", name: "Was ist der Unterschied zwischen ClawGuru und CrowdStrike?", acceptedAnswer: { "@type": "Answer", text: "ClawGuru ist DSGVO-konform, self-hosted und Open-Source-freundlich mit 600+ Runbooks. CrowdStrike ist ein Cloud-SaaS-EDR mit KI-gestützter Bedrohungserkennung und 24/7 Managed Services, aber US-Rechenzentren." } },
    { "@type": "Question", name: "Ist ClawGuru eine DSGVO-konforme Alternative zu CrowdStrike?", acceptedAnswer: { "@type": "Answer", text: "Ja. ClawGuru läuft vollständig self-hosted in Ihrer eigenen EU-Infrastruktur. CrowdStrike speichert Endpoint-Telemetrie in US-Rechenzentren, was für europäische Unternehmen datenschutzrechtlich problematisch sein kann." } },
    { "@type": "Question", name: "Wie unterscheiden sich die Preise von ClawGuru und CrowdStrike?", acceptedAnswer: { "@type": "Answer", text: "ClawGuru bietet eine Festpreis-Jahreslizenz (ab 999$/Jahr für 100 Endpoints). CrowdStrike berechnet 69–199$ pro Endpoint/Jahr – bei 1000 Endpoints sind das 69.000–199.000$/Jahr, ohne zusätzliche Module." } },
    { "@type": "Question", name: "Hat ClawGuru EDR-Funktionen wie CrowdStrike?", acceptedAnswer: { "@type": "Answer", text: "ClawGuru integriert Open-Source-EDR-Tools wie Wazuh und Osquery. CrowdStrike bietet einen proprietären KI-Falcon-Agenten mit tieferer Kernel-Integration. Für reine EDR-Tiefe führt CrowdStrike, für SIEM+Automatisierung+DSGVO ClawGuru." } },
  ],
}

export default function ClawGuruVsCrowdstrikePage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">Kein Penetrationstest</strong>: Dieser Vergleich dient der Sicherheitsarchitektur-Entscheidung. Keine Angriffswerkzeuge.
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">ClawGuru vs CrowdStrike: SIEM & EDR Sicherheitsvergleich 2026</h1>
        <p className="text-lg text-gray-300 mb-8">Umfassender Security-Plattformvergleich für Enterprise-SIEM, EDR und Security-Operations-Teams. Wir analysieren Funktionen, DSGVO-Compliance, Deployment und Kosten beider Lösungen.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Schnellvergleich</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-900 p-6 rounded-lg border border-blue-700">
              <h3 className="font-bold text-blue-300 mb-4">ClawGuru</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start"><span className="text-green-400 mr-2">✓</span>Self-Hosted & DSGVO-konform</li>
                <li className="flex items-start"><span className="text-green-400 mr-2">✓</span>600+ automatisierte Security-Runbooks</li>
                <li className="flex items-start"><span className="text-green-400 mr-2">✓</span>Kein Vendor Lock-in</li>
                <li className="flex items-start"><span className="text-green-400 mr-2">✓</span>Open-Source-freundlich</li>
                <li className="flex items-start"><span className="text-green-400 mr-2">✓</span>Festpreis-Lizenz</li>
              </ul>
            </div>
            <div className="bg-red-900 p-6 rounded-lg border border-red-700">
              <h3 className="font-bold text-red-300 mb-4">CrowdStrike</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start"><span className="text-green-400 mr-2">✓</span>KI-gestützte Bedrohungserkennung</li>
                <li className="flex items-start"><span className="text-green-400 mr-2">✓</span>24/7 Managed Services</li>
                <li className="flex items-start"><span className="text-green-400 mr-2">✓</span>Enterprise-Support</li>
                <li className="flex items-start"><span className="text-green-400 mr-2">✓</span>Echtzeit-Bedrohungsintelligenz</li>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">CrowdStrike</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                <tr><td className="px-6 py-4 text-sm font-medium text-gray-100">SIEM-Funktionen</td><td className="px-6 py-4 text-sm text-green-400">Vollständig mit Custom Rules</td><td className="px-6 py-4 text-sm text-yellow-400">Eingeschränkt</td></tr>
                <tr className="bg-gray-800"><td className="px-6 py-4 text-sm font-medium text-gray-100">EDR/XDR</td><td className="px-6 py-4 text-sm text-green-400">Open-Source Agent-Unterstützung</td><td className="px-6 py-4 text-sm text-green-400">KI-Falcon-Agent</td></tr>
                <tr><td className="px-6 py-4 text-sm font-medium text-gray-100">Deployment</td><td className="px-6 py-4 text-sm text-green-400">Self-Hosted, On-Prem, Cloud</td><td className="px-6 py-4 text-sm text-yellow-400">Nur Cloud (SaaS)</td></tr>
                <tr className="bg-gray-800"><td className="px-6 py-4 text-sm font-medium text-gray-100">Datenschutz</td><td className="px-6 py-4 text-sm text-green-400">DSGVO-konform, EU-Daten</td><td className="px-6 py-4 text-sm text-red-400">US-Rechenzentren</td></tr>
                <tr><td className="px-6 py-4 text-sm font-medium text-gray-100">Automatisierung</td><td className="px-6 py-4 text-sm text-green-400">600+ ausführbare Runbooks</td><td className="px-6 py-4 text-sm text-yellow-400">Eingeschränkt</td></tr>
                <tr className="bg-gray-800"><td className="px-6 py-4 text-sm font-medium text-gray-100">Preismodell</td><td className="px-6 py-4 text-sm text-green-400">Festpreis-Jahreslizenz</td><td className="px-6 py-4 text-sm text-yellow-400">Pro Endpoint/Jahr</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Wann welche Plattform wählen?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="font-bold text-cyan-400 mb-4">ClawGuru wählen wenn:</h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start"><span className="text-cyan-400 mr-2">→</span>DSGVO/EU-Compliance zwingend erforderlich ist</li>
                <li className="flex items-start"><span className="text-cyan-400 mr-2">→</span>Self-Hosted-Deployment bevorzugt wird</li>
                <li className="flex items-start"><span className="text-cyan-400 mr-2">→</span>Open-Source-Technologien bevorzugt werden</li>
                <li className="flex items-start"><span className="text-cyan-400 mr-2">→</span>Umfangreiche Security-Automatisierung benötigt wird</li>
                <li className="flex items-start"><span className="text-cyan-400 mr-2">→</span>Kein Vendor Lock-in erwünscht ist</li>
              </ul>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="font-bold text-red-300 mb-4">CrowdStrike wählen wenn:</h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start"><span className="text-red-400 mr-2">→</span>24/7 Managed Security Services benötigt werden</li>
                <li className="flex items-start"><span className="text-red-400 mr-2">→</span>Cloud-native Lösung bevorzugt wird</li>
                <li className="flex items-start"><span className="text-red-400 mr-2">→</span>KI-gestützte EDR-Tiefe erforderlich ist</li>
                <li className="flex items-start"><span className="text-red-400 mr-2">→</span>Enterprise-Support-Anforderungen bestehen</li>
                <li className="flex items-start"><span className="text-red-400 mr-2">→</span>DSGVO keine kritische Anforderung ist</li>
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
                  <li><strong className="text-gray-100">Explorer:</strong> Kostenlos (bis 10 Endpoints)</li>
                  <li><strong className="text-gray-100">Pro:</strong> 999$/Jahr (bis 100 Endpoints)</li>
                  <li><strong className="text-gray-100">Team:</strong> 4.999$/Jahr (unbegrenzt)</li>
                  <li><strong className="text-gray-100">Enterprise:</strong> Individuelles Angebot</li>
                  <li className="text-green-400 mt-2">Keine Endpoint-Zusatzgebühren</li>
                </ul>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                <h3 className="font-bold text-red-300 mb-3">CrowdStrike Preise</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li><strong className="text-gray-100">Falcon Prevent:</strong> 69$/Endpoint/Jahr</li>
                  <li><strong className="text-gray-100">Falcon Complete:</strong> 149$/Endpoint/Jahr</li>
                  <li><strong className="text-gray-100">Falcon OverWatch:</strong> 199$/Endpoint/Jahr</li>
                  <li><strong className="text-gray-100">Enterprise:</strong> Individuell</li>
                  <li className="text-red-400 mt-2">Hohe Kosten bei vielen Endpoints</li>
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
            <a href={`/${locale}/openclaw`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">OpenClaw Framework</div>
              <div className="text-sm text-gray-300">Self-Hosted Security</div>
            </a>
            <a href={`/${locale}/moltbot/threat-detection-setup`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Threat Detection</div>
              <div className="text-sm text-gray-300">Falco + Prometheus Setup</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
