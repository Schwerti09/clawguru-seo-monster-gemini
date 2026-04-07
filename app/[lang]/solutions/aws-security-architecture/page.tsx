import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface PageProps { params: { lang: string }; }
const LANGS = ['de','en','es','fr','pt','it','ru','zh','ja','ko','ar','hi','tr','pl','nl'];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = params;
  return {
    title: 'AWS Security Architecture mit ClawGuru: Well-Architected 2024',
    description: 'AWS Security Architecture mit ClawGuru. AWS Well-Architected Security Pillar, IAM Least Privilege, CloudTrail Monitoring, GuardDuty Integration und Security Hub.',
    keywords: ['aws security architecture','aws well architected security','iam least privilege','cloudtrail monitoring','aws guardduty','aws security hub'],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: { title: 'AWS Security Architecture mit ClawGuru 2024', description: 'AWS Well-Architected Security.', type: 'article', url: `https://clawguru.org/${lang}/solutions/aws-security-architecture` },
    alternates: { canonical: `https://clawguru.org/${lang}/solutions/aws-security-architecture`, languages: Object.fromEntries(LANGS.map(l => [l, `https://clawguru.org/${l}/solutions/aws-security-architecture`])) },
    robots: 'index, follow',
  };
}

export default function AwsSecurityPage({ params }: PageProps) {
  const { lang } = params;
  if (!LANGS.includes(lang)) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-8 text-sm">
          <strong>ClawGuru AWS</strong>: Nicht ein Pentest — sondern automatisiertes AWS Security Assessment und Well-Architected Review.
        </div>
        <h1 className="text-4xl font-bold mb-4">AWS Security Architecture</h1>
        <p className="text-lg text-gray-600 mb-8">AWS Well-Architected Security Pillar implementieren — von IAM Least Privilege über CloudTrail bis hin zu Security Hub und GuardDuty.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">🏗️ AWS Security Pillar: 6 Design-Prinzipien</h2>
          <div className="space-y-3">
            {[
              { principle: 'Implement a strong identity foundation', desc: 'IAM Least Privilege, MFA erzwingen, keine Long-lived Credentials', done: true },
              { principle: 'Enable traceability', desc: 'CloudTrail in allen Regionen, CloudWatch Logs, Security Hub', done: true },
              { principle: 'Apply security at all layers', desc: 'VPC, Subnets, Security Groups, WAF, Shield', done: true },
              { principle: 'Automate security best practices', desc: 'Config Rules, GuardDuty, Inspector, Macie', done: true },
              { principle: 'Protect data in transit and at rest', desc: 'TLS überall, KMS, S3 Encryption, Secrets Manager', done: true },
              { principle: 'Keep people away from data', desc: 'Minimize direct data access, audit all access', done: false },
            ].map(({ principle, desc, done }) => (
              <div key={principle} className={`flex items-start gap-3 p-4 rounded-lg border ${done ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                <span className="text-xl mt-0.5">{done ? '✅' : '⚠️'}</span>
                <div>
                  <div className="font-semibold text-sm">{principle}</div>
                  <div className="text-xs text-gray-500 mt-1">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">🔧 Empfohlene AWS Services</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { service: 'IAM Access Analyzer', category: 'Identity', critical: true },
              { service: 'AWS CloudTrail', category: 'Logging', critical: true },
              { service: 'Amazon GuardDuty', category: 'Detection', critical: true },
              { service: 'AWS Security Hub', category: 'Aggregation', critical: true },
              { service: 'Amazon Macie', category: 'Data Privacy', critical: false },
              { service: 'AWS Config', category: 'Compliance', critical: false },
              { service: 'Amazon Inspector', category: 'Vulnerability', critical: false },
              { service: 'AWS Secrets Manager', category: 'Secrets', critical: true },
              { service: 'AWS WAF', category: 'Network', critical: false },
            ].map(({ service, category, critical }) => (
              <div key={service} className={`p-3 rounded-lg border text-sm ${critical ? 'bg-orange-50 border-orange-200' : 'bg-gray-50 border-gray-200'}`}>
                <div className="font-semibold">{service}</div>
                <div className="text-xs text-gray-500">{category}</div>
                {critical && <div className="text-xs text-orange-600 font-medium mt-1">Empfohlen</div>}
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">🔗 ClawGuru für AWS</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="/securitycheck" className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100"><div className="font-semibold text-blue-600">🛡️ Security Check</div><div className="text-sm text-gray-600">AWS Assessment</div></a>
            <a href="/runbooks" className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100"><div className="font-semibold text-blue-600">📚 AWS Runbooks</div><div className="text-sm text-gray-600">Well-Architected Guides</div></a>
            <a href="/oracle" className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100"><div className="font-semibold text-blue-600">🔮 Oracle</div><div className="text-sm text-gray-600">AWS Threat Intel</div></a>
            <a href="/solutions" className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100"><div className="font-semibold text-blue-600">🏢 Enterprise AWS</div><div className="text-sm text-gray-600">Managed Security</div></a>
          </div>
        </section>
      </div>
    </div>
  );
}
