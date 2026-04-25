import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import StackDescription from "@/components/marketing/StackDescription"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/openclaw-vs-falco"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const title = "OpenClaw vs Falco: Runtime-Security Vergleich 2026"
  const description = "OpenClaw vs Falco im direkten Vergleich: Container-Sicherheit, Kubernetes-Runtime-Monitoring, Bedrohungserkennung und Self-Hosting. Welches Tool passt zu Ihrer Infrastruktur?"
  return {
    title,
    description,
    keywords: ["openclaw vs falco", "runtime security vergleich", "container sicherheit", "kubernetes security", "bedrohungserkennung"],
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
    { "@type": "Question", name: "Was ist der Unterschied zwischen OpenClaw und Falco?", acceptedAnswer: { "@type": "Answer", text: "OpenClaw ist ein vollständiges Security-Framework mit 600+ Runbooks und DSGVO-konformem Self-Hosting. Falco ist ein Open-Source CNCF-Tool für Kubernetes-native Runtime-Überwachung auf Kernel-Ebene." } },
    { "@type": "Question", name: "Kann OpenClaw Falco ersetzen?", acceptedAnswer: { "@type": "Answer", text: "Für Teams die ein vollständiges Security-Framework benötigen ja. Für reine Kubernetes-Runtime-Detection ist Falco als leichtgewichtiger Daemon effizienter. Viele Teams nutzen beide Tools kombiniert." } },
    { "@type": "Question", name: "Ist Falco kostenlos?", acceptedAnswer: { "@type": "Answer", text: "Falco ist vollständig Open-Source und kostenlos. OpenClaw bietet einen kostenlosen Explorer-Plan sowie kostenpflichtige Lizenzen ab 999$/Jahr für erweiterte Features und Support." } },
    { "@type": "Question", name: "Welches Tool erkennt Bedrohungen in Echtzeit besser?", acceptedAnswer: { "@type": "Answer", text: "Beide Tools bieten Echtzeit-Erkennung. Falco arbeitet auf Kernel-Syscall-Ebene (sehr niedrige Latenz). OpenClaw kombiniert mehrere Erkennungsebenen mit automatischer Remediation durch Runbooks." } },
  ],
}

export default function OpenClawVsFalcoPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">Kein Penetrationstest</strong>: Dieser Vergleich dient der Sicherheitsarchitektur-Entscheidung. Keine Angriffswerkzeuge.
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">OpenClaw vs Falco: Runtime-Security Vergleich 2026</h1>
        <p className="text-lg text-gray-300 mb-8">Umfassender Vergleich für Container-Sicherheit, Kubernetes-Runtime-Monitoring und Bedrohungserkennung. OpenClaw als vollständiges Security-Framework vs. Falco als spezialisiertes CNCF-Runtime-Tool.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Schnellvergleich</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-900 p-6 rounded-lg border border-blue-700">
              <h3 className="font-bold text-blue-300 mb-4">OpenClaw</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start"><span className="text-green-400 mr-2">✓</span>Vollständiges Security-Framework</li>
                <li className="flex items-start"><span className="text-green-400 mr-2">✓</span>Self-Hosted, DSGVO-konform</li>
                <li className="flex items-start"><span className="text-green-400 mr-2">✓</span>600+ ausführbare Runbooks</li>
                <li className="flex items-start"><span className="text-green-400 mr-2">✓</span>Multi-Cloud-Unterstützung</li>
                <li className="flex items-start"><span className="text-green-400 mr-2">✓</span>Kein Vendor Lock-in</li>
              </ul>
            </div>
            <div className="bg-orange-900 p-6 rounded-lg border border-orange-700">
              <h3 className="font-bold text-orange-300 mb-4">Falco</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start"><span className="text-green-400 mr-2">✓</span>CNCF-graduiertes Open-Source-Projekt</li>
                <li className="flex items-start"><span className="text-green-400 mr-2">✓</span>Echtzeit-Bedrohungserkennung</li>
                <li className="flex items-start"><span className="text-green-400 mr-2">✓</span>Kubernetes-nativ</li>
                <li className="flex items-start"><span className="text-green-400 mr-2">✓</span>Kostenlos (Open-Source)</li>
                <li className="flex items-start"><span className="text-green-400 mr-2">✓</span>Erweiterbare Rule-Engine</li>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">OpenClaw</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Falco</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                <tr><td className="px-6 py-4 text-sm font-medium text-gray-100">Runtime-Sicherheit</td><td className="px-6 py-4 text-sm text-green-400">Vollständiges Framework</td><td className="px-6 py-4 text-sm text-green-400">Spezialisiertes Runtime-Monitoring</td></tr>
                <tr className="bg-gray-800"><td className="px-6 py-4 text-sm font-medium text-gray-100">Container-Sicherheit</td><td className="px-6 py-4 text-sm text-green-400">Gesamter Lifecycle</td><td className="px-6 py-4 text-sm text-green-400">Runtime-Monitoring</td></tr>
                <tr><td className="px-6 py-4 text-sm font-medium text-gray-100">Automatisierung</td><td className="px-6 py-4 text-sm text-green-400">600+ Runbooks</td><td className="px-6 py-4 text-sm text-yellow-400">Begrenzt</td></tr>
                <tr className="bg-gray-800"><td className="px-6 py-4 text-sm font-medium text-gray-100">Deployment</td><td className="px-6 py-4 text-sm text-green-400">Self-Hosted, Multi-Cloud</td><td className="px-6 py-4 text-sm text-green-400">Kubernetes-nativ</td></tr>
                <tr><td className="px-6 py-4 text-sm font-medium text-gray-100">Preis</td><td className="px-6 py-4 text-sm text-green-400">Festpreis-Lizenz</td><td className="px-6 py-4 text-sm text-green-400">Open-Source (kostenlos)</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Wann welches Tool wählen?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="font-bold text-cyan-400 mb-4">OpenClaw wählen wenn:</h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start"><span className="text-cyan-400 mr-2">→</span>Vollständiges Security-Framework benötigt wird</li>
                <li className="flex items-start"><span className="text-cyan-400 mr-2">→</span>Umfangreiche Automatisierung erforderlich ist</li>
                <li className="flex items-start"><span className="text-cyan-400 mr-2">→</span>DSGVO-konformes Self-Hosting gewünscht ist</li>
                <li className="flex items-start"><span className="text-cyan-400 mr-2">→</span>Multi-Cloud-Unterstützung benötigt wird</li>
                <li className="flex items-start"><span className="text-cyan-400 mr-2">→</span>Automatische Remediation erforderlich ist</li>
              </ul>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="font-bold text-orange-300 mb-4">Falco wählen wenn:</h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start"><span className="text-orange-400 mr-2">→</span>Kubernetes-native Runtime-Security benötigt wird</li>
                <li className="flex items-start"><span className="text-orange-400 mr-2">→</span>Open-Source-Lösung bevorzugt wird</li>
                <li className="flex items-start"><span className="text-orange-400 mr-2">→</span>Echtzeit-Bedrohungserkennung auf Kernel-Ebene</li>
                <li className="flex items-start"><span className="text-orange-400 mr-2">→</span>CNCF-konforme Tools gewünscht sind</li>
                <li className="flex items-start"><span className="text-orange-400 mr-2">→</span>Geringes Budget vorhanden ist</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Technische Architektur</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-cyan-400 mb-3">OpenClaw Architektur</h3>
                <StackDescription locale="de" />
              </div>
              <div>
                <h3 className="font-bold text-orange-300 mb-3">Falco Architektur</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>Kernel-level Syscall-Monitoring</li>
                  <li>Libsinsp für Datenerfassung</li>
                  <li>YAML-basierte Rule-Engine</li>
                  <li>Kubernetes DaemonSet-Deployment</li>
                  <li>Echtzeit-Event-Verarbeitung</li>
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
            <a href={`/${locale}/openclaw/container-security-docker-kubernetes`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Container-Sicherheit</div>
              <div className="text-sm text-gray-300">Docker & Kubernetes Härtung</div>
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
