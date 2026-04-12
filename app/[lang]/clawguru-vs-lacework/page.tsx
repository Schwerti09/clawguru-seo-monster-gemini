import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/clawguru-vs-lacework"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const title = "ClawGuru vs Lacework: CSPM Security Comparison 2026"
  const description = "Complete comparison between ClawGuru and Lacework for cloud security posture management (CSPM), compliance, and multi-cloud security. Features, pricing, and deployment analysis."
  return {
    title,
    description,
    keywords: ["clawguru vs lacework", "cspm comparison", "cloud security posture management", "multi-cloud security", "compliance automation"],
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
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Was ist der Unterschied zwischen ClawGuru und Lacework?', acceptedAnswer: { '@type': 'Answer', text: 'Lacework ist eine Enterprise-Cloud-Security-Plattform mit KI-gesteuerter Anomalieerkennung (Polygraph) ab ca. $50k/Jahr, Cloud-only. ClawGuru ist die Self-Hosted, DSGVO-konforme Alternative mit 600+ Executable Runbooks und vorhersehbaren Lizenzkosten.' } },
    { '@type': 'Question', name: 'Ist ClawGuru DSGVO-konform?', acceptedAnswer: { '@type': 'Answer', text: 'Ja. ClawGuru kann vollst\u00e4ndig self-hosted betrieben werden \u2014 alle Daten verbleiben in Ihrer EU-Infrastruktur. Lacework speichert Daten in US-Cloud-Rechenzentren, was f\u00fcr EU-Unternehmen datenschutzrechtlich problematisch sein kann.' } },
    { '@type': 'Question', name: 'Was ist Lacework Polygraph?', acceptedAnswer: { '@type': 'Answer', text: 'Lacework Polygraph ist eine KI-Engine, die Verhaltensmuster in Cloud-Umgebungen analysiert und Anomalien erkennt. Sie korreliert Benutzeraktivit\u00e4ten, Netzwerkverkehr und API-Aufrufe f\u00fcr kontextbezogene Bedrohungserkennung.' } },
    { '@type': 'Question', name: 'Welches Tool hat bessere Compliance-Unterst\u00fctzung?', acceptedAnswer: { '@type': 'Answer', text: 'ClawGuru unterst\u00fctzt DSGVO/GDPR nativ (Self-Hosted), ISO 27001:2022, NIS2 und SOC2. Lacework bietet SOC2, ISO 27001, PCI-DSS und HIPAA. F\u00fcr EU-Compliance ist ClawGuru klar im Vorteil.' } },
  ],
}

export default function ClawGuruVsLaceworkPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">&quot;Not a Pentest&quot; Hinweis</strong>: Dieser Vergleich dient der Entscheidungsfindung f\u00fcr Security-Architekturen. Kein Angriffs-Tool.
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">ClawGuru vs Lacework: CSPM Security Vergleich</h1>
        <p className="text-lg text-gray-300 mb-8">Umfassender Cloud-Security-Plattform-Vergleich f\u00fcr CSPM, Compliance-Management und Multi-Cloud-Security-Betrieb.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Quick Comparison Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-900 p-6 rounded-lg">
              <h3 className="font-bold text-blue-300 mb-4">ClawGuru</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">+</span>
                  Self-hosted CSPM
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">+</span>
                  GDPR/DSGVO compliant
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">+</span>
                  600+ security runbooks
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">+</span>
                  No vendor lock-in
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">+</span>
                  Predictable costs
                </li>
              </ul>
            </div>
            <div className="bg-teal-900 p-6 rounded-lg border border-teal-700">
              <h3 className="font-bold text-teal-300 mb-4">Lacework</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">+</span>
                  AI-powered security
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">+</span>
                  Polygraph risk analysis
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">+</span>
                  Real-time threat detection
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">+</span>
                  Comprehensive integrations
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">+</span>
                  Enterprise-grade support
                </li>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Lacework</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">CSPM Capabilities</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">Full CSPM with custom rules</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">Advanced AI-powered CSPM</td>
                </tr>
                <tr className="bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">Multi-Cloud Support</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">AWS, GCP, Azure, on-prem</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">AWS, GCP, Azure, Alibaba</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">Compliance Management</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">GDPR, ISO27001, NIS2</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">SOC2, ISO27001, PCI-DSS</td>
                </tr>
                <tr className="bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">Deployment</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">Self-hosted, on-prem, cloud</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-400">Cloud-only (SaaS)</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">Data Privacy</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">GDPR/DSGVO compliant</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-400">US data centers</td>
                </tr>
                <tr className="bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">Automation</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">600+ executable runbooks</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-400">Limited automation</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">Pricing Model</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">Perpetual license + support</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-400">Per-asset subscription</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Wann welches Tool?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="font-bold text-cyan-400 mb-4">ClawGuru w\u00e4hlen wenn:</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-2">-</span>
                  DSGVO/GDPR-Compliance zwingend
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-2">-</span>
                  Self-Hosted Deployment gew\u00fcnscht
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-2">-</span>
                  Umfangreiche Automation ben\u00f6tigt
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-2">-</span>
                  Vorhersehbare Lizenzkosten bevorzugt
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-2">-</span>
                  On-Premises-Unterst\u00fctzung n\u00f6tig
                </li>
              </ul>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="font-bold text-cyan-400 mb-4">Lacework w\u00e4hlen wenn:</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start">
                  <span className="text-teal-600 mr-2">-</span>
                  KI-gest\u00fctzte Bedrohungserkennung ben\u00f6tigt
                </li>
                <li className="flex items-start">
                  <span className="text-teal-400 mr-2">-</span>
                  Cloud-native L\u00f6sung gew\u00fcnscht
                </li>
                <li className="flex items-start">
                  <span className="text-teal-400 mr-2">-</span>
                  Polygraph-Risikoanalyse ben\u00f6tigt
                </li>
                <li className="flex items-start">
                  <span className="text-teal-400 mr-2">-</span>
                  Enterprise-Anforderungen vorhanden
                </li>
                <li className="flex items-start">
                  <span className="text-teal-400 mr-2">-</span>
                  24/7 Enterprise-Support n\u00f6tig
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Technische Architektur</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-cyan-400 mb-3">ClawGuru Architecture</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>PostgreSQL + Supabase backend</li>
                  <li>Next.js 14 frontend</li>
                  <li>Custom CSPM rule engine</li>
                  <li>Mycelium graph database</li>
                  <li>Docker/Kubernetes deployment</li>
                  <li>Multi-cloud connectors</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-cyan-400 mb-3">Lacework Architecture</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>Proprietary cloud platform</li>
                  <li>AI/ML Polygraph engine</li>
                  <li>Agentless data collection</li>
                  <li>Real-time behavioral analysis</li>
                  <li>Cloud-native microservices</li>
                  <li>Automated threat correlation</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Compliance-Framework-Vergleich</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-900 p-4 rounded-lg border border-blue-700">
              <h3 className="font-semibold text-blue-300 mb-2">ClawGuru Compliance</h3>
              <ul className="text-sm space-y-1">
                <li>GDPR/DSGVO (native support)</li>
                <li>ISO 27001:2022</li>
                <li>NIS2 Directive</li>
                <li>SOC 2 Type II</li>
                <li>Custom compliance frameworks</li>
              </ul>
            </div>
            <div className="bg-teal-900 p-4 rounded-lg border border-teal-700">
              <h3 className="font-semibold text-teal-300 mb-2">Lacework Compliance</h3>
              <ul className="text-sm space-y-1">
                <li>SOC 2 Type II</li>
                <li>ISO 27001:2013</li>
                <li>PCI DSS 4.0</li>
                <li>HIPAA</li>
                <li>FedRAMP (in progress)</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Cloud-Provider-Integration</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 p-4 rounded border">
                <h3 className="font-bold text-cyan-400 mb-3">ClawGuru Integrations</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li><strong>AWS:</strong> Config, CloudTrail, GuardDuty</li>
                  <li><strong>GCP:</strong> Cloud Asset Inventory, Security Command</li>
                  <li><strong>Azure:</strong> Security Center, Resource Graph</li>
                  <li><strong>On-prem:</strong> Custom connectors</li>
                  <li className="text-green-400">Full API access control</li>
                </ul>
              </div>
              <div className="bg-gray-800 p-4 rounded border">
                <h3 className="font-bold text-cyan-400 mb-3">Lacework Integrations</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li><strong>AWS:</strong> 300+ service integrations</li>
                  <li><strong>GCP:</strong> 150+ service integrations</li>
                  <li><strong>Azure:</strong> 200+ service integrations</li>
                  <li><strong>Alibaba:</strong> 50+ service integrations</li>
                  <li className="text-green-400">Comprehensive coverage</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Preisvergleich</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 p-4 rounded border">
                <h3 className="font-bold text-cyan-400 mb-3">ClawGuru Pricing</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li><strong>Explorer:</strong> Free tier (up to 50 assets)</li>
                  <li><strong>Pro:</strong> $4,999/year (up to 500 assets)</li>
                  <li><strong>Team:</strong> $14,999/year (unlimited assets)</li>
                  <li><strong>Enterprise:</strong> Custom pricing</li>
                  <li className="text-green-400">No per-asset fees after license</li>
                </ul>
              </div>
              <div className="bg-gray-800 p-4 rounded border">
                <h3 className="font-bold text-cyan-400 mb-3">Lacework Pricing</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li><strong>Plan:</strong> Custom pricing (starts at ~$50K/year)</li>
                  <li><strong>Per-asset:</strong> $5-15/month depending on tier</li>
                  <li><strong>Data ingestion:</strong> Additional fees</li>
                  <li><strong>Support:</strong> 24/7 enterprise support</li>
                  <li className="text-red-400">Can be expensive at scale</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Integration &amp; \u00d6kosystem</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-900 p-4 rounded-lg border border-blue-700">
              <h3 className="font-semibold text-blue-300 mb-2">ClawGuru Integrations</h3>
              <ul className="text-sm space-y-1">
                <li>SIEM systems (ELK, Splunk)</li>
                <li>SOAR platforms (Cortex XSOAR)</li>
                <li>ITSM systems (ServiceNow)</li>
                <li>Container platforms (K8s, Docker)</li>
                <li>Custom API endpoints</li>
              </ul>
            </div>
            <div className="bg-teal-900 p-4 rounded-lg border border-teal-700">
              <h3 className="font-semibold text-teal-300 mb-2">Lacework Integrations</h3>
              <ul className="text-sm space-y-1">
                <li>Major SIEM platforms</li>
                <li>SOAR systems (Palo Alto, Splunk)</li>
                <li>ITSM platforms (ServiceNow, Jira)</li>
                <li>Container security tools</li>
                <li>Cloud provider services</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Weiterf\u00fchrende Ressourcen</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href={`/${locale}/securitycheck`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
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
            <a href={`/${locale}/solutions/kubernetes-security-hardening`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Kubernetes Security</div>
              <div className="text-sm text-gray-300">Vollst\u00e4ndiger H\u00e4rtungsleitfaden</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
