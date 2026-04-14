import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/llm-data-encryption-at-rest"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = isDE
    ? "LLM Data Encryption at Rest: LLM-Daten-Encryption-at-Rest | ClawGuru Moltbot"
    : "LLM Data Encryption at Rest: LLM Data Encryption at Rest | ClawGuru Moltbot"
  const description = isDE
    ? "LLM-Daten-Encryption-at-Rest: Database Encryption, Filesystem Encryption, Key Management und Encryption-at-Rest Policies für LLM-Datenverschlüsselung."
    : "LLM data encryption at rest: database encryption, filesystem encryption, key management and encryption-at-rest policies for LLM data encryption."
  return {
    title, description,
    keywords: ["llm data encryption at rest", "database encryption", "filesystem encryption", "key management", "encryption at rest", "moltbot encryption"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const CONTROLS = [
  { id: "DER-1", title: "Database Encryption", desc: "Encrypt LLM data at rest in databases. Use transparent data encryption (TDE) or application-level encryption for sensitive data.", code: `# Moltbot database encryption:
database_encryption:
  enabled: true

  # Transparent data encryption (TDE):
  tde:
    enabled: true
    # Use database-native TDE for encryption at rest
    # Encrypts: data files, log files, backups
    # Supported: PostgreSQL, MySQL, MongoDB
    # Key management: database KMS integration

  # Application-level encryption:
  app_level:
    enabled: true
    # Encrypt sensitive fields before storage
    # Use: AES-256-GCM for field-level encryption
    algorithm: "AES-256-GCM"
    # Key management: per-tenant keys or KMS

  # Column encryption:
  column_encryption:
    enabled: true
    # Encrypt specific columns:
    # - User prompts (may contain PII)
    # - Agent outputs (may contain sensitive data)
    # - API keys (if stored)
    columns:
      - user_prompt
      - agent_output
      - api_keys` },
  { id: "DER-2", title: "Filesystem Encryption", desc: "Encrypt LLM data at rest on filesystems. Use full-disk encryption or encrypted volumes for sensitive data storage.", code: `# Moltbot filesystem encryption:
filesystem_encryption:
  enabled: true

  # Full-disk encryption:
  full_disk:
    enabled: true
    # Use LUKS (Linux) or BitLocker (Windows)
    # Encrypts: entire disk, including OS and data
    # Protects against: physical theft, disk access

  # Encrypted volumes:
  encrypted_volumes:
    enabled: true
    # Use encrypted volumes for LLM data storage
    # Mount: /var/lib/moltbot (encrypted)
    # Filesystem: ext4 with LUKS encryption
    # Key management: key file or KMS

  # Encrypted directories:
  encrypted_dirs:
    enabled: true
    # Use eCryptfs or fscrypt for directory encryption
    # Encrypts: specific directories only
    # Example: /var/lib/moltbot/prompts, /var/lib/moltbot/outputs
    # Key management: per-directory keys` },
  { id: "DER-3", title: "Key Management", desc: "Manage encryption keys securely. Use key management service (KMS) or hardware security module (HSM) for key storage and rotation.", code: `# Moltbot key management:
key_management:
  enabled: true

  # Key management service (KMS):
  kms:
    enabled: true
    # Use cloud KMS for key storage
    # Providers: AWS KMS, GCP KMS, Azure Key Vault
    # Features: key rotation, access control, audit logging
    provider: "aws_kms"

  # Hardware security module (HSM):
  hsm:
    enabled: true
    # Use HSM for on-premises key storage
    # Protects: keys in hardware tamper-resistant module
    # Use: for highest security requirements

  # Key rotation:
  rotation:
    enabled: true
    # Rotate encryption keys periodically
    # Interval: 90 days
    # Automatic: yes
    # Re-encrypt data: on rotation

  # Key access control:
  access_control:
    enabled: true
    # Restrict key access to authorized users
    # Use: IAM roles, least privilege
    # Audit: all key access` },
  { id: "DER-4", title: "Encryption-at-Rest Policies", desc: "Define and enforce encryption-at-rest policies. Ensure all LLM data is encrypted according to policy.", code: `# Moltbot encryption-at-rest policies:
encryption_policies:
  enabled: true

  # Default encryption policy:
  default:
    # Encrypt all LLM data by default
    # Exceptions: public data only
    enabled: true
    # Algorithm: AES-256-GCM
    # Key size: 256 bits

  # Data classification:
  classification:
    # Classify data by sensitivity:
    # - Public: no encryption required
    # - Internal: encryption recommended
    # - Confidential: encryption required
    # - PII: encryption required + key isolation
    enabled: true

  # Policy enforcement:
  enforcement:
    # Block writes to unencrypted storage
    # Audit: encryption violations
    # Alert: policy violations
    enabled: true` },
]

const FAQ = [
  { q: "What is the difference between TDE and application-level encryption?", a: "Transparent data encryption (TDE) is database-native encryption that encrypts data at the storage layer. The database handles encryption and decryption transparently to the application. Application-level encryption encrypts data at the application layer before sending it to the database. The application handles encryption and decryption. Both are necessary: TDE provides protection against disk theft and unauthorised database access. Application-level encryption provides protection against database administrators and database compromise. Example: TDE encrypts the entire database file. Application-level encryption encrypts specific fields (user prompts, agent outputs) with per-tenant keys." },
  { q: "How do I choose between KMS and HSM for key management?", a: "KMS (Key Management Service) is a cloud-based key management service (AWS KMS, GCP KMS, Azure Key Vault). It provides key storage, rotation, access control, and audit logging. HSM (Hardware Security Module) is a hardware device that stores keys in a tamper-resistant module. HSM provides the highest security but is more expensive and complex to manage. Choose KMS for cloud deployments and cost-effective key management. Choose HSM for on-premises deployments and highest security requirements (e.g., regulated industries). Both provide secure key storage, but HSM provides additional protection against physical attacks." },
  { q: "How does key rotation work with encrypted data?", a: "Key rotation involves generating a new encryption key and re-encrypting data with the new key. The process: 1) Generate new key. 2) Decrypt data with old key. 3) Encrypt data with new key. 4) Delete old key. For large datasets, this can be time-consuming. Optimisation strategies: 1) Rotate keys incrementally — re-encrypt data in batches. 2) Use key hierarchy — encrypt data with data encryption keys (DEKs), encrypt DEKs with master keys, rotate master keys only. 3) Schedule rotation during low-traffic periods. 4) Use lazy re-encryption — re-encrypt data on access." },
  { q: "What are the risks of not encrypting LLM data at rest?", a: "Not encrypting LLM data at rest can lead to: 1) Data theft — attackers can steal unencrypted data from disk, backups, or database dumps. 2) Regulatory violations — non-compliance with GDPR, HIPAA, PCI DSS, etc., which require encryption of sensitive data. 3) Legal liability — lawsuits for data breaches. 4) Reputation damage — public backlash for data breaches. 5) Insider threats — database administrators or employees with database access can read unencrypted data. 6) Physical theft — stolen servers or disks contain unencrypted data. Encryption at rest protects against these risks by rendering data unreadable without the encryption key." },
]

export default function LlmDataEncryptionAtRestPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Moltbot", item: `${SITE_URL}/${locale}/moltbot` },
      { "@type": "ListItem", position: 3, name: "LLM Data Encryption at Rest", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE ? "Data-Encryption-at-Rest-Guide für eigene KI-Systeme." : "Data encryption at rest guide for your own AI systems."}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Moltbot · Batch 20</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">{isDE ? "LLM Data Encryption at Rest" : "LLM Data Encryption at Rest"}</h1>
        <p className="text-lg text-gray-300 mb-6">
          {isDE
            ? "LLM-Daten ohne Encryption-at-Rest können bei Diebstahl oder Datenbank-Kompromittierung offengelegt werden. Vier Kontrollen: Database Encryption, Filesystem Encryption, Key Management und Encryption-at-Rest Policies."
            : "LLM data without encryption at rest can be exposed in case of theft or database compromise. Four controls: database encryption, filesystem encryption, key management and encryption-at-rest policies."}
        </p>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "4 Data-Encryption-at-Rest-Kontrollen" : "4 Data Encryption at Rest Controls"}</h2>
          <div className="space-y-5">
            {CONTROLS.map((c) => (
              <div key={c.id} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-700">
                  <span className="font-mono text-xs text-cyan-400 bg-gray-900 px-2 py-0.5 rounded">{c.id}</span>
                  <span className="font-bold text-gray-100">{c.title}</span>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-300 mb-3">{c.desc}</p>
                  <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-xs overflow-x-auto"><pre>{c.code}</pre></div>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Häufige Fragen" : "Frequently Asked Questions"}</h2>
          <div className="space-y-3">
            {FAQ.map((f, i) => (
              <details key={i} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <summary className="font-semibold text-gray-100 cursor-pointer">{f.q}</summary>
                <p className="mt-3 text-sm text-gray-300 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Weiterführende Ressourcen" : "Further Resources"}</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href={`/${locale}/moltbot/llm-data-encryption-in-transit`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Data Encryption in Transit</div>
              <div className="text-sm text-gray-300">{isDE ? "TLS-Verschlüsselung" : "TLS encryption"}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-communication-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Communication Security</div>
              <div className="text-sm text-gray-300">{isDE ? "Agent-Kommunikation" : "Agent communication"}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-data-loss-prevention`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Data Loss Prevention</div>
              <div className="text-sm text-gray-300">{isDE ? "DLP" : "DLP"}</div>
            </a>
            <a href={`/${locale}/moltbot/llm-context-isolation`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Context Isolation</div>
              <div className="text-sm text-gray-300">{isDE ? "Multi-Tenant-Keys" : "Multi-tenant keys"}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
