import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface PageProps { params: { lang: string }; }
const LANGS = ['de','en','es','fr','pt','it','ru','zh','ja','ko','ar','hi','tr','pl','nl'];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = params;
  return {
    title: 'Moltbot Cloud Security Posture Management (CSPM) 2024',
    description: 'CSPM mit Moltbot für AWS, GCP und Azure. Misconfiguration Detection, Policy-as-Code, Drift Detection und automatisierte Cloud-Remediation. CIS Cloud Benchmarks.',
    keywords: ['moltbot cspm','cloud security posture management','aws misconfiguration','policy as code','cloud drift detection','cis cloud benchmark'],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: { title: 'Moltbot CSPM 2024', description: 'Cloud Security Posture Management mit Moltbot.', type: 'article', url: `https://clawguru.org/${lang}/moltbot/cloud-security-posture-management` },
    alternates: { canonical: `https://clawguru.org/${lang}/moltbot/cloud-security-posture-management`, languages: Object.fromEntries(LANGS.map(l => [l, `https://clawguru.org/${l}/moltbot/cloud-security-posture-management`])) },
    robots: 'index, follow',
  };
}

export default function MoltbotCspmPage({ params }: PageProps) {
  const { lang } = params;
  if (!LANGS.includes(lang)) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 text-sm">
          <strong>"Not a Pentest" Trust-Anker</strong>: CSPM überwacht eigene Cloud-Konfigurationen defensiv. Keine Angriffswerkzeuge.
        </div>
        <h1 className="text-4xl font-bold mb-4">Moltbot Cloud Security Posture Management</h1>
        <p className="text-lg text-gray-600 mb-8">70% aller Cloud-Breaches entstehen durch Fehlkonfigurationen. Moltbot erkennt sie automatisch und remediert sie — bevor Angreifer sie finden.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">☁️ Top Cloud Misconfigurations</h2>
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
              <div key={issue} className={`flex items-start gap-3 p-3 rounded-lg border ${severity === 'CRITICAL' ? 'bg-red-50 border-red-200' : 'bg-orange-50 border-orange-200'}`}>
                <span className={`text-xs font-bold px-2 py-0.5 rounded flex-shrink-0 ${severity === 'CRITICAL' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>{severity}</span>
                <div className="flex-1">
                  <div className="font-medium text-sm">{issue}</div>
                  <div className="text-xs text-gray-500 mt-0.5">Cloud: {cloud} · Fix: {fix}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">🔗 Weiterführende Ressourcen</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="/securitycheck" className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100"><div className="font-semibold text-blue-600">🛡️ Security Check</div><div className="text-sm text-gray-600">Cloud Posture prüfen</div></a>
            <a href="/runbooks" className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100"><div className="font-semibold text-blue-600">📚 Cloud Runbooks</div><div className="text-sm text-gray-600">CSPM Guides</div></a>
            <a href="/oracle" className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100"><div className="font-semibold text-blue-600">🔮 Oracle</div><div className="text-sm text-gray-600">Cloud Threat Intel</div></a>
            <a href="/solutions" className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100"><div className="font-semibold text-blue-600">🏢 Enterprise CSPM</div><div className="text-sm text-gray-600">Managed Cloud Security</div></a>
          </div>
        </section>
      </div>
    </div>
  );
}
