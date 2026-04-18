import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from '@/lib/i18n'

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const { lang } = params;
  return {
    title: 'Moltbot Cloud Security Posture Management (CSPM) 2024',
    description: 'CSPM mit Moltbot für AWS, GCP und Azure. Misconfiguration Detection, Policy-as-Code, Drift Detection und automatisierte Cloud-Remediation. CIS Cloud Benchmarks.',
    keywords: ['moltbot cspm','cloud security posture management','aws misconfiguration','policy as code','cloud drift detection','cis cloud benchmark'],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: {
      images: ["/og-image.png"], title: 'Moltbot CSPM 2024', description: 'Cloud Security Posture Management mit Moltbot.', type: 'article', url: `https://clawguru.org/${lang}/moltbot/cloud-security-posture-management` },
    alternates: buildLocalizedAlternates(lang as Locale, '/moltbot/cloud-security-posture-management'),
    robots: 'index, follow',
  };
}

export default function MoltbotCspmPage({ params }: { params: { lang: string } }) {
  const { lang } = params;
  if (!SUPPORTED_LOCALES.includes(lang as Locale)) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Trust-Anker</strong>: CSPM überwacht eigene Cloud-Konfigurationen defensiv. Keine Angriffswerkzeuge.
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">Moltbot Cloud Security Posture Management</h1>
        <p className="text-lg text-gray-300 mb-8">70% aller Cloud-Breaches entstehen durch Fehlkonfigurationen. Moltbot erkennt sie automatisch und remediert sie — bevor Angreifer sie finden.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">☁️ Top Cloud Misconfigurations</h2>
          <div className="space-y-3">
            {[
              { issue: 'S3-Bucket öffentlich erreichbar', severity: 'CRITICAL', cloud: 'AWS', fix: 'Block Public Access + Bucket Policy' },
              { issue: 'Security Group 0.0.0.0/0 auf Port 22/3389', severity: 'CRITICAL', cloud: 'AWS/GCP', fix: 'IP Whitelist oder VPN-Only' },
              { issue: 'Root Account ohne MFA', severity: 'CRITICAL', cloud: 'AWS', fix: 'MFA sofort aktivieren' },
              { issue: 'Unverschlüsselte EBS/RDS-Volumes', severity: 'HIGH', cloud: 'AWS', fix: 'KMS-Verschlüsselung aktivieren' },
              { issue: 'IAM User mit Admin-Rechten + aktive Keys', severity: 'HIGH', cloud: 'AWS', fix: 'Role-based + Key Rotation' },
              { issue: 'CloudTrail nicht in allen Regionen', severity: 'HIGH', cloud: 'AWS', fix: 'Multi-Region Trail aktivieren' },
              { issue: 'GCS-Bucket AllUsers Lesezugriff', severity: 'CRITICAL', cloud: 'GCP', fix: 'IAM-Policy stricter' },
              { issue: 'VM Instance mit externer IP ohne Firewall-Regel', severity: 'HIGH', cloud: 'GCP', fix: 'VPC Firewall + Cloud Armor' },
            ].map(({ issue, severity, cloud, fix }) => (
              <div key={issue} className={`flex items-start gap-3 p-3 rounded-lg border ${severity === 'CRITICAL' ? 'bg-red-900 border-red-700' : 'bg-orange-50 border-orange-700'}`}>
                <span className={`text-xs font-bold px-2 py-0.5 rounded flex-shrink-0 ${severity === 'CRITICAL' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>{severity}</span>
                <div className="flex-1">
                  <div className="font-medium text-sm">{issue}</div>
                  <div className="text-xs text-gray-400 mt-0.5">Cloud: {cloud} · Fix: {fix}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🔗 Weiterführende Ressourcen</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="/securitycheck" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🛡️ Security Check</div><div className="text-sm text-gray-300">Cloud Posture prüfen</div></a>
            <a href="/runbooks" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">📚 Cloud Runbooks</div><div className="text-sm text-gray-300">CSPM Guides</div></a>
            <a href="/oracle" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🔮 Oracle</div><div className="text-sm text-gray-300">Cloud Threat Intel</div></a>
            <a href="/solutions" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🏢 Enterprise CSPM</div><div className="text-sm text-gray-300">Managed Cloud Security</div></a>
          </div>
        </section>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "Was ist Moltbot Security?", acceptedAnswer: { "@type": "Answer", text: "Moltbot ist eine Security-Automation-Plattform mit 600+ Executable Runbooks, Live-Score und Compliance-Dashboard für Self-Hosting-Infrastrukturen." } },
              { "@type": "Question", name: "Ist dieser Guide ein Penetrationstest?", acceptedAnswer: { "@type": "Answer", text: "Nein. Dieser Guide dient ausschließlich zur Absicherung eigener Systeme. Kein Angriffs-Tool, keine illegalen Aktivitäten." } },
              { "@type": "Question", name: "Wo finde ich zugehörige Runbooks?", acceptedAnswer: { "@type": "Answer", text: "Alle Runbooks sind unter /runbooks abrufbar. Jeder Befund im Security-Check enthält einen direkten Link zum passenden Runbook." } }
            ]
          },
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Moltbot Security Guide",
            description: "Executable Security Runbooks und Hardening-Guides für Moltbot-Infrastrukturen.",
            url: "https://clawguru.org/de/moltbot/cloud-security-posture-management"
          }
        ]) }} />
      </div>
    </div>
  );
}
