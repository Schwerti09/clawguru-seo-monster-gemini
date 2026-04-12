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
    ? 'ClawGuru vs Checkov: IaC Security Scanner vs Security Platform 2026'
    : 'ClawGuru vs Checkov: IaC Security Scanner vs Security Platform 2026'
  const description = locale === 'de'
    ? 'ClawGuru vs Checkov Vergleich 2026. Checkov scannt Terraform, CloudFormation und Kubernetes-Manifeste. ClawGuru ergänzt mit Live-Score, Runbooks und Compliance-Automation.'
    : 'ClawGuru vs Checkov comparison 2026. Checkov scans Terraform, CloudFormation and Kubernetes manifests. ClawGuru adds live scoring, runbooks and compliance automation.'
  return {
    title,
    description,
    alternates: buildLocalizedAlternates(locale, '/clawguru-vs-checkov'),
    openGraph: { images: ['/og-image.png'], title, description, type: 'article', url: `${SITE_URL}/${lang}/clawguru-vs-checkov` },
    robots: 'index, follow',
  }
}

export default function ClawGuruVsCheckovPage({ params }: { params: { lang: string } }) {
  const { lang } = params
  if (!SUPPORTED_LOCALES.includes(lang as Locale)) notFound()
  const isDE = lang === 'de'

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">{isDE ? '"Not a Pentest" Hinweis' : '"Not a Pentest" Notice'}</strong>
          {isDE
            ? ': Dieser Guide hilft dabei, das richtige Tool für deine Infrastruktur zu wählen. Kein Angriffs-Tool.'
            : ': This guide helps you choose the right tool for your infrastructure. No attack tools.'}
        </div>

        <h1 className="text-4xl font-bold mb-4 text-gray-100">
          {isDE ? 'ClawGuru vs Checkov: IaC Security Scanner vs Security Platform' : 'ClawGuru vs Checkov: IaC Security Scanner vs Security Platform'}
        </h1>
        <p className="text-lg text-gray-300 mb-8">
          {isDE
            ? 'Checkov (von Bridgecrew/Prisma Cloud) ist ein statischer IaC-Security-Scanner für Terraform, CloudFormation, Kubernetes und Dockerfile. ClawGuru ist eine Live-Security-Plattform mit Executable Runbooks, Real-Time-Score und Compliance-Dashboard.'
            : 'Checkov (by Bridgecrew/Prisma Cloud) is a static IaC security scanner for Terraform, CloudFormation, Kubernetes and Dockerfile. ClawGuru is a live security platform with executable runbooks, real-time scoring and compliance dashboard.'}
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? '⚔️ Direkter Vergleich' : '⚔️ Head-to-Head Comparison'}</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">{isDE ? 'Kriterium' : 'Criterion'}</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase">🛡️ ClawGuru</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase">📋 Checkov</th>
                </tr>
              </thead>
              <tbody>
                {(isDE ? [
                  ['Hauptfunktion', 'Live Security-Plattform', 'Statischer IaC-Scanner'],
                  ['IaC-Scanning (Terraform etc.)', '⚠️ Via Runbook + CI-Integration', '✅ Kern-Feature (500+ Checks)'],
                  ['Runtime-Security', '✅ Live-Score + Monitoring', '❌ Nur Pre-Deploy'],
                  ['Executable Runbooks', '✅ 600+ Runbooks', '❌ Nur Findings'],
                  ['CI/CD-Integration', '✅ GitHub Actions, GitLab', '✅ Native CI-Integration'],
                  ['DSGVO / EU-Daten', '✅ EU-First', '⚠️ Prisma Cloud = US-basiert'],
                  ['Preis', '✅ Ab €0', '✅ OSS kostenlos / Enterprise $$$'],
                  ['Compliance-Frameworks', '✅ SOC2, ISO27001, NIS2', '✅ CIS, NIST, SOC2'],
                  ['Dashboard', '✅ Live-Dashboard', '⚠️ Nur in Prisma Cloud'],
                  ['Selbst gehostet', '✅ Vollständig', '✅ CLI läuft lokal'],
                ] : [
                  ['Main function', 'Live security platform', 'Static IaC scanner'],
                  ['IaC scanning (Terraform etc.)', '⚠️ Via runbook + CI integration', '✅ Core feature (500+ checks)'],
                  ['Runtime security', '✅ Live score + monitoring', '❌ Pre-deploy only'],
                  ['Executable runbooks', '✅ 600+ runbooks', '❌ Findings only'],
                  ['CI/CD integration', '✅ GitHub Actions, GitLab', '✅ Native CI integration'],
                  ['GDPR / EU data', '✅ EU-first', '⚠️ Prisma Cloud = US-based'],
                  ['Price', '✅ From €0', '✅ OSS free / Enterprise $$$'],
                  ['Compliance frameworks', '✅ SOC2, ISO27001, NIS2', '✅ CIS, NIST, SOC2'],
                  ['Dashboard', '✅ Live dashboard', '⚠️ Only in Prisma Cloud'],
                  ['Self-hosted', '✅ Fully', '✅ CLI runs locally'],
                ]).map(([criteria, claw, checkov], i) => (
                  <tr key={criteria} className={`border-b border-gray-700 ${i % 2 === 1 ? 'bg-gray-800/50' : ''}`}>
                    <td className="px-6 py-3 text-sm font-medium text-gray-300">{criteria}</td>
                    <td className="px-6 py-3 text-center text-sm text-gray-300">{claw}</td>
                    <td className="px-6 py-3 text-center text-sm text-gray-300">{checkov}</td>
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
                  'Runtime-Security zusätzlich zu IaC-Checks gebraucht',
                  'Executable Runbooks für schnelle Fixes gewünscht',
                  'Live-Score und Compliance-Dashboard wichtig',
                  'DSGVO und EU-Datenhaltung zwingend',
                  'Zentrales Security-Dashboard für das gesamte Team',
                ] : [
                  'Runtime security in addition to IaC checks needed',
                  'Executable runbooks for fast fixes wanted',
                  'Live score and compliance dashboard important',
                  'GDPR and EU data residency required',
                  'Central security dashboard for the whole team',
                ]).map(item => <li key={item}>• {item}</li>)}
              </ul>
            </div>
            <div className="bg-blue-900 border border-blue-700 p-5 rounded-lg">
              <h3 className="font-bold text-blue-300 mb-3">📋 {isDE ? 'Checkov ist die Wahl wenn...' : 'Checkov is the choice when...'}</h3>
              <ul className="space-y-1.5 text-sm text-blue-200">
                {(isDE ? [
                  'Fokus auf IaC-Misconfiguration-Scanning',
                  'CI/CD-Pipeline Shift-Left Security',
                  'Terraform/CloudFormation als Haupt-Stack',
                  'Open-Source ohne Zusatzkosten bevorzugt',
                  'Pre-Deploy Policy-Checks wichtiger als Laufzeit',
                ] : [
                  'Focus on IaC misconfiguration scanning',
                  'CI/CD pipeline shift-left security',
                  'Terraform/CloudFormation as main stack',
                  'Open source without additional costs preferred',
                  'Pre-deploy policy checks more important than runtime',
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
            <a href={`/${lang}/moltbot/devsecops-pipeline`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{isDE ? '🔧 DevSecOps Pipeline' : '🔧 DevSecOps Pipeline'}</div>
              <div className="text-sm text-gray-300">{isDE ? 'CI/CD Security Runbook' : 'CI/CD Security Runbook'}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
