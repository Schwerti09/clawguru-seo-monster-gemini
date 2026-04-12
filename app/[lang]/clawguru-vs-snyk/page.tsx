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
  const isDE = locale === 'de'
  const title = isDE
    ? 'ClawGuru vs Snyk: Developer Security Platform Vergleich 2026'
    : 'ClawGuru vs Snyk: Developer Security Platform Comparison 2026'
  const description = isDE
    ? 'ClawGuru vs Snyk 2026. Snyk scannt Code, Dependencies und Container auf Schwachstellen. ClawGuru bietet Live-Score, Executable Runbooks und DSGVO-konformes Self-Hosting.'
    : 'ClawGuru vs Snyk 2026. Snyk scans code, dependencies and containers for vulnerabilities. ClawGuru adds live scoring, executable runbooks and GDPR-compliant self-hosting.'
  return {
    title,
    description,
    alternates: buildLocalizedAlternates(locale, '/clawguru-vs-snyk'),
    openGraph: { images: ['/og-image.png'], title, description, type: 'article', url: `${SITE_URL}/${lang}/clawguru-vs-snyk` },
    robots: 'index, follow',
  }
}

export default function ClawGuruVsSnykPage({ params }: { params: { lang: string } }) {
  const { lang } = params
  if (!SUPPORTED_LOCALES.includes(lang as Locale)) notFound()
  const isDE = lang === 'de'

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">&quot;Not a Pentest&quot; {isDE ? 'Hinweis' : 'Notice'}</strong>
          {isDE
            ? ': Dieser Guide hilft dir, das richtige Security-Tool zu wählen. Kein Angriffs-Tool.'
            : ': This guide helps you choose the right security tool. No attack tools.'}
        </div>

        <h1 className="text-4xl font-bold mb-4 text-gray-100">
          {isDE ? 'ClawGuru vs Snyk: Developer Security Platform Vergleich' : 'ClawGuru vs Snyk: Developer Security Platform Comparison'}
        </h1>
        <p className="text-lg text-gray-300 mb-8">
          {isDE
            ? 'Snyk ist eine Developer-Security-Plattform für SAST, SCA (Software Composition Analysis), Container-Scanning und IaC-Checks. ClawGuru ist eine Live-Security-Plattform mit Executable Runbooks, Real-Time-Score und Compliance-Dashboard für Self-Hoster und DevOps-Teams.'
            : 'Snyk is a developer security platform for SAST, SCA (Software Composition Analysis), container scanning and IaC checks. ClawGuru is a live security platform with executable runbooks, real-time scoring and compliance dashboard for self-hosters and DevOps teams.'}
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? '⚔️ Direkter Vergleich' : '⚔️ Head-to-Head Comparison'}</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">{isDE ? 'Kriterium' : 'Criterion'}</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase">🛡️ ClawGuru</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase">🐍 Snyk</th>
                </tr>
              </thead>
              <tbody>
                {(isDE ? [
                  ['Hauptfunktion', 'Live Security-Plattform + Score', 'SAST + SCA + Container Scan'],
                  ['SAST (Code-Scanning)', '⚠️ Via Runbook-Integration', '✅ Kern-Feature (30+ Sprachen)'],
                  ['SCA (Abhängigkeiten)', '⚠️ Via SBOM-Runbook', '✅ Kern-Feature (npm, pip, maven…)'],
                  ['Container-Image Scanning', '⚠️ Via Trivy-Runbook', '✅ Native Snyk Container'],
                  ['IaC-Scanning', '⚠️ Via Checkov-Integration', '✅ Snyk IaC (Terraform etc.)'],
                  ['Executable Runbooks', '✅ 600+ Runbooks mit Fix-Steps', '❌ Nur Recommendations'],
                  ['Live Security Score', '✅ Echtzeit-Score', '❌ Nur Scan-Berichte'],
                  ['DSGVO / EU-Daten', '✅ EU-First, Self-Hosted möglich', '⚠️ US-basiert (SaaS)'],
                  ['Preis', '✅ Ab €0 (Explorer)', '⚠️ Free-Tier begrenzt, Pro ab $25/Monat'],
                  ['CI/CD-Integration', '✅ GitHub Actions, GitLab', '✅ Native in alle gängigen CIs'],
                  ['Compliance-Dashboard', '✅ SOC2, ISO27001, NIS2', '⚠️ Nur in Enterprise-Plan'],
                  ['Self-Hosted', '✅ Vollständig möglich', '❌ SaaS-only (kein Self-Host)'],
                ] : [
                  ['Main function', 'Live security platform + score', 'SAST + SCA + container scan'],
                  ['SAST (code scanning)', '⚠️ Via runbook integration', '✅ Core feature (30+ languages)'],
                  ['SCA (dependencies)', '⚠️ Via SBOM runbook', '✅ Core feature (npm, pip, maven…)'],
                  ['Container image scanning', '⚠️ Via Trivy runbook', '✅ Native Snyk Container'],
                  ['IaC scanning', '⚠️ Via Checkov integration', '✅ Snyk IaC (Terraform etc.)'],
                  ['Executable runbooks', '✅ 600+ runbooks with fix steps', '❌ Recommendations only'],
                  ['Live security score', '✅ Real-time score', '❌ Scan reports only'],
                  ['GDPR / EU data', '✅ EU-first, self-hosted possible', '⚠️ US-based (SaaS)'],
                  ['Price', '✅ From €0 (Explorer)', '⚠️ Free tier limited, Pro from $25/mo'],
                  ['CI/CD integration', '✅ GitHub Actions, GitLab', '✅ Native in all major CIs'],
                  ['Compliance dashboard', '✅ SOC2, ISO27001, NIS2', '⚠️ Enterprise plan only'],
                  ['Self-hosted', '✅ Fully possible', '❌ SaaS-only (no self-host)'],
                ]).map(([criteria, claw, snyk], i) => (
                  <tr key={criteria} className={`border-b border-gray-700 ${i % 2 === 1 ? 'bg-gray-800/50' : ''}`}>
                    <td className="px-6 py-3 text-sm font-medium text-gray-300">{criteria}</td>
                    <td className="px-6 py-3 text-center text-sm text-gray-300">{claw}</td>
                    <td className="px-6 py-3 text-center text-sm text-gray-300">{snyk}</td>
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
                  'Live-Score und Runtime-Security wichtiger als SAST',
                  'Executable Runbooks für schnelle Fixes gewünscht',
                  'Self-Hosting und DSGVO-Konformität zwingend',
                  'Compliance-Dashboard (SOC2, NIS2) nötig',
                  'Budget unter $25/Monat pro Entwickler',
                ] : [
                  'Live score and runtime security more important than SAST',
                  'Executable runbooks for fast fixes wanted',
                  'Self-hosting and GDPR compliance required',
                  'Compliance dashboard (SOC2, NIS2) needed',
                  'Budget under $25/month per developer',
                ]).map(item => <li key={item}>• {item}</li>)}
              </ul>
            </div>
            <div className="bg-blue-900 border border-blue-700 p-5 rounded-lg">
              <h3 className="font-bold text-blue-300 mb-3">🐍 {isDE ? 'Snyk ist die Wahl wenn...' : 'Snyk is the choice when...'}</h3>
              <ul className="space-y-1.5 text-sm text-blue-200">
                {(isDE ? [
                  'SAST und SCA im Entwickler-Workflow Priorität',
                  'Dependency-Vulnerabilities im Fokus (npm, pip, maven)',
                  'Tiefe IDE-Integration (VS Code Plugin) gewünscht',
                  'Snyk Learn für Developer-Training gebraucht',
                  'Großes Entwicklungsteam mit Code-Review-Integration',
                ] : [
                  'SAST and SCA in developer workflow are the priority',
                  'Dependency vulnerabilities the focus (npm, pip, maven)',
                  'Deep IDE integration (VS Code plugin) wanted',
                  'Snyk Learn for developer training needed',
                  'Large development team with code review integration',
                ]).map(item => <li key={item}>• {item}</li>)}
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? '🔗 Weiterführende Links' : '🔗 Further Resources'}</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href={`/${lang}/securitycheck`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">🛡️ {isDE ? 'Security Check' : 'Security Check'}</div>
              <div className="text-sm text-gray-300">{isDE ? 'Kostenlos starten' : 'Start for free'}</div>
            </a>
            <a href={`/${lang}/moltbot/devsecops-pipeline`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">⚙️ {isDE ? 'DevSecOps Pipeline' : 'DevSecOps Pipeline'}</div>
              <div className="text-sm text-gray-300">{isDE ? 'CI/CD Security Runbook' : 'CI/CD Security Runbook'}</div>
            </a>
            <a href={`/${lang}/moltbot/sbom-generation`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">📋 {isDE ? 'SBOM Generation' : 'SBOM Generation'}</div>
              <div className="text-sm text-gray-300">{isDE ? 'Supply Chain Runbook' : 'Supply Chain Runbook'}</div>
            </a>
            <a href={`/${lang}/moltbot/vulnerability-scanning`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">🔍 {isDE ? 'Vulnerability Scanning' : 'Vulnerability Scanning'}</div>
              <div className="text-sm text-gray-300">{isDE ? 'Trivy + Renovate Runbook' : 'Trivy + Renovate Runbook'}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
