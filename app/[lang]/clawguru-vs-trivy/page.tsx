import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from '@/lib/i18n'
import { SITE_URL } from '@/lib/config'

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const { lang } = params
  const locale = (SUPPORTED_LOCALES.includes(lang as Locale) ? lang : 'de') as Locale
  const title = locale === 'de'
    ? 'ClawGuru vs Trivy: Vulnerability Scanner vs Security Platform 2026'
    : 'ClawGuru vs Trivy: Vulnerability Scanner vs Security Platform 2026'
  const description = locale === 'de'
    ? 'ClawGuru vs Trivy Vergleich 2026. Trivy scannt Container-Images auf CVEs. ClawGuru bietet Executable Runbooks, Live-Score und DSGVO-konformes Self-Hosting.'
    : 'ClawGuru vs Trivy comparison 2026. Trivy scans container images for CVEs. ClawGuru adds executable runbooks, live scoring and GDPR-compliant self-hosting.'
  return {
    title,
    description,
    alternates: buildLocalizedAlternates(locale, '/clawguru-vs-trivy'),
    openGraph: { images: ['/og-image.png'], title, description, type: 'article', url: `${SITE_URL}/${lang}/clawguru-vs-trivy` },
    robots: 'index, follow',
  }
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Was ist der Unterschied zwischen ClawGuru und Trivy?', acceptedAnswer: { '@type': 'Answer', text: 'Trivy ist ein Open-Source-Scanner für CVEs in Container-Images, Dateisystemen und Git-Repos. ClawGuru ist eine vollständige Security-Plattform mit Live-Score, 600+ Executable Runbooks und Compliance-Dashboard — ergänzt Trivy um Runtime-Security.' } },
    { '@type': 'Question', name: 'Kann ich ClawGuru und Trivy zusammen nutzen?', acceptedAnswer: { '@type': 'Answer', text: 'Ja — das ist die empfohlene Kombination. Trivy übernimmt das CVE-Scanning in der CI/CD-Pipeline, ClawGuru ergänzt mit Runtime-Monitoring, Compliance-Automation und Executable Runbooks für Remediation.' } },
    { '@type': 'Question', name: 'Ist Trivy kostenlos?', acceptedAnswer: { '@type': 'Answer', text: 'Ja, Trivy ist vollständig Open Source und kostenlos (von Aqua Security). Es läuft lokal als CLI oder CI/CD-Plugin ohne Cloud-Abhängigkeit. ClawGuru bietet ebenfalls einen kostenlosen Explorer-Plan.' } },
    { '@type': 'Question', name: 'Was sind Executable Runbooks?', acceptedAnswer: { '@type': 'Answer', text: 'Executable Runbooks sind automatisierbare Security-Playbooks für Incident Response, Härtung und Remediation. ClawGuru bietet 600+ Runbooks — Trivy hingegen liefert nur CVE-Findings ohne Handlungsempfehlungen.' } },
  ],
}

export default function ClawGuruVsTrivyPage({ params }: { params: { lang: string } }) {
  const { lang } = params
  if (!SUPPORTED_LOCALES.includes(lang as Locale)) notFound()
  const isDE = lang === 'de'

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">{isDE ? '"Not a Pentest" Hinweis' : '"Not a Pentest" Notice'}</strong>
          {isDE
            ? ': Dieser Guide hilft dabei, das richtige Tool für deine Infrastruktur zu wählen. Kein Angriffs-Tool.'
            : ': This guide helps you choose the right tool for your infrastructure. No attack tools.'}
        </div>

        <h1 className="text-4xl font-bold mb-4 text-gray-100">
          {isDE ? 'ClawGuru vs Trivy: Vulnerability Scanner vs Security Platform' : 'ClawGuru vs Trivy: Vulnerability Scanner vs Security Platform'}
        </h1>
        <p className="text-lg text-gray-300 mb-8">
          {isDE
            ? 'Trivy (von Aqua Security) ist ein Open-Source-Vulnerability-Scanner für Container-Images, Dateisysteme und Git-Repos. ClawGuru ist eine vollständige Security-Plattform mit Live-Scoring, Executable Runbooks und Compliance-Automation.'
            : 'Trivy (by Aqua Security) is an open-source vulnerability scanner for container images, filesystems and git repos. ClawGuru is a full security platform with live scoring, executable runbooks and compliance automation.'}
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? '⚔️ Direkter Vergleich' : '⚔️ Head-to-Head Comparison'}</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">{isDE ? 'Kriterium' : 'Criterion'}</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase">🛡️ ClawGuru</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase">🔍 Trivy</th>
                </tr>
              </thead>
              <tbody>
                {(isDE ? [
                  ['Hauptfunktion', 'Security-Plattform + Live-Score', 'CVE-Scanner für Images/FS'],
                  ['Deployment', '✅ Self-Hosted + Cloud', '✅ CLI / CI-Plugin'],
                  ['Container-Image Scanning', '⚠️ Via Runbook-Integration', '✅ Kern-Feature'],
                  ['Executable Runbooks', '✅ 600+ Runbooks', '❌ Keine'],
                  ['Live Security Score', '✅ Echtzeit', '❌ Nur Scan-Report'],
                  ['DSGVO / EU-Daten', '✅ EU-First', '✅ Lokal ausführbar'],
                  ['Preis', '✅ Ab €0 (Explorer)', '✅ Open Source (kostenlos)'],
                  ['Compliance-Automation', '✅ SOC2, ISO27001, NIS2', '⚠️ Nur CVE-Findings'],
                  ['Dashboard', '✅ Vollständiges Dashboard', '❌ Kein Dashboard'],
                  ['CI/CD-Integration', '✅ GitHub Actions, GitLab', '✅ Native CI-Integration'],
                ] : [
                  ['Main function', 'Security platform + live score', 'CVE scanner for images/FS'],
                  ['Deployment', '✅ Self-Hosted + Cloud', '✅ CLI / CI plugin'],
                  ['Container image scanning', '⚠️ Via runbook integration', '✅ Core feature'],
                  ['Executable Runbooks', '✅ 600+ runbooks', '❌ None'],
                  ['Live security score', '✅ Real-time', '❌ Scan report only'],
                  ['GDPR / EU data', '✅ EU-first', '✅ Runs locally'],
                  ['Price', '✅ From €0 (Explorer)', '✅ Open source (free)'],
                  ['Compliance automation', '✅ SOC2, ISO27001, NIS2', '⚠️ CVE findings only'],
                  ['Dashboard', '✅ Full dashboard', '❌ No dashboard'],
                  ['CI/CD integration', '✅ GitHub Actions, GitLab', '✅ Native CI integration'],
                ]).map(([criteria, claw, trivy], i) => (
                  <tr key={criteria} className={`border-b border-gray-700 ${i % 2 === 1 ? 'bg-gray-800/50' : ''}`}>
                    <td className="px-6 py-3 text-sm font-medium text-gray-300">{criteria}</td>
                    <td className="px-6 py-3 text-center text-sm text-gray-300">{claw}</td>
                    <td className="px-6 py-3 text-center text-sm text-gray-300">{trivy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? '🏆 Wann welches Tool?' : '🏆 Which tool when?'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-900 border border-green-700 p-5 rounded-lg">
              <h3 className="font-bold text-green-300 mb-3">🛡️ {isDE ? 'ClawGuru ist die Wahl wenn...' : 'ClawGuru is the choice when...'}</h3>
              <ul className="space-y-1.5 text-sm text-green-200">
                {(isDE ? [
                  'Mehr als nur CVE-Scanning gebraucht wird',
                  'Executable Runbooks für Fixes gewünscht',
                  'Live-Score und Dashboard wichtig',
                  'Compliance-Automation (SOC2, NIS2) nötig',
                  'Zentrales Security-Command-Center gewünscht',
                ] : [
                  'More than just CVE scanning is needed',
                  'Executable runbooks for fixes wanted',
                  'Live score and dashboard important',
                  'Compliance automation (SOC2, NIS2) needed',
                  'Central security command centre wanted',
                ]).map(item => <li key={item}>• {item}</li>)}
              </ul>
            </div>
            <div className="bg-blue-900 border border-blue-700 p-5 rounded-lg">
              <h3 className="font-bold text-blue-300 mb-3">🔍 {isDE ? 'Trivy ist die Wahl wenn...' : 'Trivy is the choice when...'}</h3>
              <ul className="space-y-1.5 text-sm text-blue-200">
                {(isDE ? [
                  'Reines Container-Image-Scanning benötigt',
                  'CI/CD-Pipeline-Integration im Fokus',
                  'Open-Source ohne Lizenzkosten gewünscht',
                  'Kein zentrales Dashboard benötigt',
                  'Einfache, schnelle CVE-Checks in der Pipeline',
                ] : [
                  'Pure container image scanning needed',
                  'CI/CD pipeline integration is the focus',
                  'Open source without licence costs wanted',
                  'No central dashboard needed',
                  'Simple, fast CVE checks in the pipeline',
                ]).map(item => <li key={item}>• {item}</li>)}
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? '🔗 Weiterführende Links' : '🔗 Further Resources'}</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href={`/${lang}/securitycheck`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{isDE ? '🛡️ Security Check' : '🛡️ Security Check'}</div>
              <div className="text-sm text-gray-300">{isDE ? 'Kostenlos starten' : 'Start for free'}</div>
            </a>
            <a href={`/${lang}/moltbot/container-security-docker-kubernetes`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{isDE ? '🐳 Container Security' : '🐳 Container Security'}</div>
              <div className="text-sm text-gray-300">{isDE ? 'Docker & K8s Hardening' : 'Docker & K8s Hardening'}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
