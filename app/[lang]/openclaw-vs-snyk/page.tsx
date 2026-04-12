import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from '@/lib/i18n'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://clawguru.org'
const PATH = '/openclaw-vs-snyk'

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Was ist der Unterschied zwischen OpenClaw und Snyk?', acceptedAnswer: { '@type': 'Answer', text: 'OpenClaw ist self-hosted, DSGVO-konform und bietet ausführbare Runbooks. Snyk ist ein Cloud-SaaS-Tool mit breitem Sprachsupport (10+ Sprachen) für Dependency Scanning, aber ohne Self-Hosting-Option.' } },
    { '@type': 'Question', name: 'Ist OpenClaw eine DSGVO-konforme Alternative zu Snyk?', acceptedAnswer: { '@type': 'Answer', text: 'Ja. OpenClaw läuft vollständig self-hosted – alle Scan-Daten bleiben in Ihrer EU-Infrastruktur. Snyk speichert Daten in US-Cloud-Rechenzentren, was für EU-Unternehmen datenschutzrechtlich problematisch ist.' } },
    { '@type': 'Question', name: 'Kann OpenClaw Snyk komplett ersetzen?', acceptedAnswer: { '@type': 'Answer', text: 'Für Teams mit Self-Hosting- und DSGVO-Anforderungen ja. OpenClaw bietet Dependency Scanning (npm, pip, go), Container Scanning und Compliance-Reports. Für breiten Sprachsupport (10+) hat Snyk noch Vorteile.' } },
    { '@type': 'Question', name: 'Welches Tool hat bessere CI/CD Integration?', acceptedAnswer: { '@type': 'Answer', text: 'Beide Tools unterstützen GitHub, GitLab und Jenkins. Snyk bietet zusätzlich tiefe IDE-Integrationen. OpenClaw bietet darüber hinaus 600+ ausführbare Security-Runbooks für automatisierte Remediation.' } },
  ],
}

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : 'de') as Locale
  const title = 'OpenClaw vs Snyk: Security Tool Vergleich 2026'
  const description = 'OpenClaw vs Snyk im direkten Vergleich. Funktionen, Preise, Self-Hosting, DSGVO-Datenschutz und CI/CD-Integration. Welches Security-Tool passt zu Ihrem Self-Hosted Stack?'
  return {
    title,
    description,
    keywords: ['openclaw vs snyk', 'snyk alternative', 'openclaw security tool', 'dependency scanning vergleich', 'open source security tools vergleich'],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: { images: ['/og-image.png'], title, description, type: 'article', url: `${SITE_URL}/${locale}${PATH}` },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: 'index, follow',
  }
}

export default function OpenClawVsSnykPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : 'de') as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound();

  const COMPARISON = [
    { feature: 'Self-Hosting möglich', openclaw: '✅ Ja', snyk: '❌ Cloud-only' },
    { feature: 'Open Source', openclaw: '✅ Ja', snyk: '⚠️ Teilweise' },
    { feature: 'DSGVO / Datenschutz', openclaw: '✅ Vollständig', snyk: '⚠️ US-Cloud' },
    { feature: 'Dependency Scanning', openclaw: '✅ npm, pip, go', snyk: '✅ 10+ Sprachen' },
    { feature: 'Container Scanning', openclaw: '✅ Docker, K8s', snyk: '✅ Ja' },
    { feature: 'SAST (Code)', openclaw: '⚠️ Basis', snyk: '✅ Erweitert' },
    { feature: 'Runbooks / Remediation', openclaw: '✅ Executable Runbooks', snyk: '⚠️ Nur Fixes' },
    { feature: 'Preis (Free Tier)', openclaw: '✅ Kostenlos Explorer', snyk: '✅ Begrenzt free' },
    { feature: 'CI/CD Integration', openclaw: '✅ GitHub, GitLab, Jenkins', snyk: '✅ Alle großen' },
    { feature: 'Compliance Reports', openclaw: '✅ SOC2, ISO27001', snyk: '⚠️ Eingeschränkt' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong>Objektiver Vergleich</strong>: Beide Tools haben Stärken. Dieser Vergleich hilft dir, die richtige Wahl für deinen Stack zu treffen.
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">OpenClaw vs Snyk: Security Tool Vergleich</h1>
        <p className="text-lg text-gray-300 mb-8">OpenClaw vs Snyk im direkten Vergleich. Funktionen, Preise, Self-Hosting, DSGVO-Datenschutz und CI/CD-Integration. Welches Security-Tool passt zu Ihrem Self-Hosted Stack?</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">⚔️ Direkter Vergleich</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="p-3 text-left">Feature</th>
                  <th className="p-3 text-center">🔓 OpenClaw</th>
                  <th className="p-3 text-center">🐍 Snyk</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map(({ feature, openclaw, snyk }) => (
                  <tr key={feature} className="border-b hover:bg-gray-800">
                    <td className="p-3">{feature}</td>
                    <td className="p-3 text-center">{openclaw}</td>
                    <td className="p-3 text-center">{snyk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🏆 Wer gewinnt wann?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-900 border border-green-700 p-5 rounded-lg">
              <h3 className="font-bold text-green-300 mb-3">🔓 OpenClaw ist besser wenn...</h3>
              <ul className="space-y-1.5 text-sm text-green-200">
                <li>• Self-Hosted oder On-Premise Anforderung</li>
                <li>• DSGVO / EU-Datenschutz kritisch</li>
                <li>• Executable Runbooks gewünscht</li>
                <li>• Compliance-Reports nötig (SOC2, ISO)</li>
                <li>• Enge Budgetvorgaben</li>
              </ul>
            </div>
            <div className="bg-blue-900 border border-blue-700 p-5 rounded-lg">
              <h3 className="font-bold text-blue-300 mb-3">🐍 Snyk ist besser wenn...</h3>
              <ul className="space-y-1.5 text-sm text-blue-200">
                <li>• Cloud-first Stack ohne On-Prem Zwang</li>
                <li>• 10+ Programmiersprachen zu scannen</li>
                <li>• Tiefer IDE-Integration gewünscht</li>
                <li>• Großes Enterprise-Budget vorhanden</li>
                <li>• Nur Dependency/Container Scanning nötig</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Häufige Fragen (FAQ)</h2>
          <div className="space-y-4 mb-8">
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
            <a href={`/${locale}/openclaw`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"><div className="font-semibold text-cyan-400">OpenClaw Framework</div><div className="text-sm text-gray-300">Framework entdecken</div></a>
            <a href={`/${locale}/check`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"><div className="font-semibold text-cyan-400">Security Check</div><div className="text-sm text-gray-300">System kostenlos scannen</div></a>
            <a href={`/${locale}/runbooks`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"><div className="font-semibold text-cyan-400">Runbooks</div><div className="text-sm text-gray-300">600+ Security-Playbooks</div></a>
            <a href={`/${locale}/openclaw/cicd-security-pipeline`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"><div className="font-semibold text-cyan-400">CI/CD Security</div><div className="text-sm text-gray-300">Pipeline absichern</div></a>
          </div>
        </section>
      </div>
    </div>
  );
}
