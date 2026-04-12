import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from '@/lib/i18n'

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const { lang } = params;
  return {
    title: 'AWS Security Architecture mit ClawGuru: Well-Architected 2024',
    description: 'AWS Security Architecture mit ClawGuru. AWS Well-Architected Security Pillar, IAM Least Privilege, CloudTrail Monitoring, GuardDuty Integration und Security Hub.',
    keywords: ['aws security architecture','aws well architected security','iam least privilege','cloudtrail monitoring','aws guardduty','aws security hub'],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: {
      images: ["/og-image.png"], title: 'AWS Security Architecture mit ClawGuru 2024', description: 'AWS Well-Architected Security.', type: 'article', url: `https://clawguru.org/${lang}/solutions/aws-security-architecture` },
    alternates: buildLocalizedAlternates(lang as Locale, '/solutions/aws-security-architecture'),
    robots: 'index, follow',
  };
}

export default function AwsSecurityPage({ params }: { params: { lang: string } }) {
  const { lang } = params;
  if (!SUPPORTED_LOCALES.includes(lang as Locale)) notFound();
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: lang === 'de' ? 'Was ist das AWS Well-Architected Security Pillar?' : 'What is the AWS Well-Architected Security Pillar?', acceptedAnswer: { '@type': 'Answer', text: lang === 'de' ? 'Das AWS Well-Architected Framework Security Pillar definiert Best Practices für sichere AWS-Architekturen: Identity & Access Management (IAM Least Privilege), Detective Controls (CloudTrail, GuardDuty), Infrastructure Protection (Security Groups, WAF), Data Protection (KMS, S3 Encryption) und Incident Response. Basis für AWS Security Assessments.' : 'The AWS Well-Architected Framework Security Pillar defines best practices for secure AWS architectures: Identity & Access Management (IAM Least Privilege), Detective Controls (CloudTrail, GuardDuty), Infrastructure Protection (Security Groups, WAF), Data Protection (KMS, S3 Encryption) and Incident Response. Foundation for AWS security assessments.' } },
      { '@type': 'Question', name: lang === 'de' ? 'Wie konfiguriere ich IAM Least Privilege in AWS?' : 'How do I configure IAM Least Privilege in AWS?', acceptedAnswer: { '@type': 'Answer', text: lang === 'de' ? 'IAM Least Privilege: Niemals Root-Account für tägliche Arbeit nutzen. Individuelle IAM-User mit minimalen Permissions. IAM Roles für EC2/Lambda statt Access Keys. Service Control Policies (SCPs) in AWS Organizations. IAM Access Analyzer für unnötige Permissions identifizieren. Regelmäßige Permission-Reviews mit IAM Access Advisor.' : 'IAM Least Privilege: never use root account for daily work. Individual IAM users with minimal permissions. IAM roles for EC2/Lambda instead of access keys. Service Control Policies (SCPs) in AWS Organizations. IAM Access Analyzer to identify unnecessary permissions. Regular permission reviews with IAM Access Advisor.' } },
      { '@type': 'Question', name: lang === 'de' ? 'Was ist AWS GuardDuty und wie aktiviere ich es?' : 'What is AWS GuardDuty and how do I enable it?', acceptedAnswer: { '@type': 'Answer', text: lang === 'de' ? 'AWS GuardDuty ist ein Managed Threat Detection Service der CloudTrail, VPC Flow Logs und DNS-Logs auf Anomalien analysiert. Aktivierung: AWS Console > GuardDuty > Enable. Kosten: ~$4-8 pro 1M CloudTrail Events. Multi-Account via AWS Organizations aktivieren. GuardDuty Findings in Security Hub aggregieren für zentrales SOC-Dashboard.' : 'AWS GuardDuty is a managed threat detection service that analyzes CloudTrail, VPC Flow Logs and DNS logs for anomalies. Activation: AWS Console > GuardDuty > Enable. Cost: ~$4-8 per 1M CloudTrail events. Enable multi-account via AWS Organizations. Aggregate GuardDuty findings in Security Hub for central SOC dashboard.' } },
      { '@type': 'Question', name: lang === 'de' ? 'Wie automatisiere ich AWS Security Assessments mit ClawGuru?' : 'How do I automate AWS security assessments with ClawGuru?', acceptedAnswer: { '@type': 'Answer', text: lang === 'de' ? 'ClawGuru verbindet sich via AWS API (Read-Only IAM Role) und prüft automatisch: S3 Bucket Public Access, IAM Password Policy, CloudTrail Status, Security Group Regeln, RDS Encryption, EBS Encryption und weitere 100+ Checks. Dashboard zeigt Security Score, Findings nach Severity und remediation-Runbooks.' : 'ClawGuru connects via AWS API (read-only IAM role) and automatically checks: S3 bucket public access, IAM password policy, CloudTrail status, security group rules, RDS encryption, EBS encryption and 100+ more checks. Dashboard shows security score, findings by severity and remediation runbooks.' } },
    ],
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-8 text-sm">
          <strong>ClawGuru AWS</strong>: Nicht ein Pentest — sondern automatisiertes AWS Security Assessment und Well-Architected Review.
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">AWS Security Architecture</h1>
        <p className="text-lg text-gray-300 mb-8">AWS Well-Architected Security Pillar implementieren — von IAM Least Privilege über CloudTrail bis hin zu Security Hub und GuardDuty.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🏗️ AWS Security Pillar: 6 Design-Prinzipien</h2>
          <div className="space-y-3">
            {[
              { principle: 'Implement a strong identity foundation', desc: 'IAM Least Privilege, MFA erzwingen, keine Long-lived Credentials', done: true },
              { principle: 'Enable traceability', desc: 'CloudTrail in allen Regionen, CloudWatch Logs, Security Hub', done: true },
              { principle: 'Apply security at all layers', desc: 'VPC, Subnets, Security Groups, WAF, Shield', done: true },
              { principle: 'Automate security best practices', desc: 'Config Rules, GuardDuty, Inspector, Macie', done: true },
              { principle: 'Protect data in transit and at rest', desc: 'TLS überall, KMS, S3 Encryption, Secrets Manager', done: true },
              { principle: 'Keep people away from data', desc: 'Minimize direct data access, audit all access', done: false },
            ].map(({ principle, desc, done }) => (
              <div key={principle} className={`flex items-start gap-3 p-4 rounded-lg border ${done ? 'bg-green-900 border-green-700' : 'bg-amber-900 border-yellow-700'}`}>
                <span className="text-xl mt-0.5">{done ? '✅' : '⚠️'}</span>
                <div>
                  <div className="font-semibold text-sm">{principle}</div>
                  <div className="text-xs text-gray-400 mt-1">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🔧 Empfohlene AWS Services</h2>
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
              <div key={service} className={`p-3 rounded-lg border text-sm ${critical ? 'bg-orange-50 border-orange-700' : 'bg-gray-800 border-gray-700'}`}>
                <div className="font-semibold text-gray-100">{service}</div>
                <div className="text-xs text-gray-400">{category}</div>
                {critical && <div className="text-xs text-orange-400 font-medium mt-1">Empfohlen</div>}
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🔗 ClawGuru für AWS</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="/securitycheck" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🛡️ Security Check</div><div className="text-sm text-gray-300">AWS Assessment</div></a>
            <a href="/runbooks" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">📚 AWS Runbooks</div><div className="text-sm text-gray-300">Well-Architected Guides</div></a>
            <a href="/oracle" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🔮 Oracle</div><div className="text-sm text-gray-300">AWS Threat Intel</div></a>
            <a href="/solutions" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🏢 Enterprise AWS</div><div className="text-sm text-gray-300">Managed Security</div></a>
          </div>
        </section>
      </div>
    </div>
  );
}
