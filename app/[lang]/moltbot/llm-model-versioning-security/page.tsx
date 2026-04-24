import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/llm-model-versioning-security"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = pick(isDE, "LLM Model Versioning Security: LLM-Modell-Versioning-Security | ClawGuru Moltbot", "LLM Model Versioning Security: LLM Model Versioning Security | ClawGuru Moltbot")
  const description = pick(isDE, "LLM-Modell-Versioning-Security: Version Authentication, Rollback Security, Version Access Control und Version Audit Logging für LLM-Modell-Versioning-Security.", "LLM model versioning security: version authentication, rollback security, version access control and version audit logging for LLM model versioning security.")
  return {
    title, description,
    keywords: ["llm model versioning security", "version authentication", "rollback security", "version access control", "version audit logging", "moltbot versioning"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const CONTROLS = [
  { id: "MVS-1", title: "Version Authentication", desc: "Authenticate all model versions. Use digital signatures and hash verification to ensure version integrity.", code: `# Moltbot version authentication:
version_authentication:
  enabled: true

  # Digital signatures:
  digital_signatures:
    enabled: true
    # Sign: all model versions
    # Method: RSA, ECDSA
    # Verify: signature before deployment
    # Prevents: version tampering

  # Hash verification:
  hash_verification:
    enabled: true
    # Compute: hash of model version
    # Compare: against expected hash
    # Block: mismatched versions
    # Prevents: version corruption

  # Version metadata:
  metadata:
    enabled: true
    # Include: version metadata in signature
    # Fields: version ID, timestamp, author
    # Verify: metadata integrity
    # Prevents: metadata tampering` },
  { id: "MVS-2", title: "Rollback Security", desc: "Secure model rollback mechanisms. Use signed rollback configurations and integrity verification.", code: `# Moltbot rollback security:
rollback_security:
  enabled: true

  # Signed rollback configurations:
  signed_configs:
    enabled: true
    # Sign: rollback configurations
    # Verify: signature before rollback
    # Prevents: unauthorised rollback

  # Rollback integrity verification:
  integrity_verification:
    enabled: true
    # Verify: rollback target integrity
    # Method: hash verification
    # Block: corrupted rollback targets
    # Prevents: rollback to corrupted version

  # Rollback audit logging:
  audit_logging:
    enabled: true
    # Log: all rollback events
    # Include: version, reason, user
    # Retain: logs for audit (90 days)
    # Protect: log access` },
  { id: "MVS-3", title: "Version Access Control", desc: "Control access to model versions. Use role-based access control and version-specific permissions.", code: `# Moltbot version access control:
version_access_control:
  enabled: true

  # Role-based access control:
  rbac:
    enabled: true
    # Define: roles for version access
    # Roles: admin, developer, viewer
    # Grant: version-specific permissions
    # Enforce: least privilege

  # Version-specific permissions:
  version_permissions:
    enabled: true
    # Define: permissions per version
    # Permissions: read, write, deploy, rollback
    # Enforce: version-specific access
    # Prevents: unauthorised version access

  # Version approval workflow:
  approval_workflow:
    enabled: true
    # Require: approval for version deployment
    # Workflow: developer → reviewer → approver
    # Track: approval status
    # Prevents: unapproved deployment` },
  { id: "MVS-4", title: "Version Audit Logging", desc: "Log all version-related events for audit. Track version creation, deployment, and rollback.", code: `# Moltbot version audit logging:
audit_logging:
  enabled: true

  # Version creation logging:
  creation_logging:
    enabled: true
    # Log: version creation events
    # Include: version ID, author, timestamp
    # Retain: logs for audit (90 days)
    # Protect: log access

  # Version deployment logging:
  deployment_logging:
    enabled: true
    # Log: version deployment events
    # Include: version, target, user
    # Retain: logs for audit (90 days)
    # Protect: log access

  # Version rollback logging:
  rollback_logging:
    enabled: true
    # Log: version rollback events
    # Include: from version, to version, reason
    # Retain: logs for audit (90 days)
    # Protect: log access` },
]

const FAQ = [
  { q: "What is the difference between version authentication and rollback security?", a: "Version authentication ensures that model versions are authentic and unmodified. This is done through digital signatures and hash verification. Rollback security ensures that rollback operations are authorised and the rollback target is intact. Version authentication protects against version tampering during storage and transfer. Rollback security protects against unauthorised rollback to corrupted or malicious versions. Both are necessary: version authentication protects the version, rollback security protects the rollback operation." },
  { q: "How does version-specific access control work?", a: "Version-specific access control allows you to define different permissions for different versions. For example, you might allow developers to read development versions but not production versions. You might allow admins to deploy any version but only read access to historical versions. Version-specific permissions are implemented through RBAC with version-specific rules. This ensures that users only have access to the versions they need for their role." },
  { q: "How do I secure the rollback process?", a: "Secure rollback requires: 1) Signed rollback configurations — sign rollback configs and verify before rollback. 2) Rollback integrity verification — verify the rollback target is intact before rollback. 3) Rollback audit logging — log all rollback events for compliance. 4) Approval workflow — require approval for rollback to production. 5) Version-specific permissions — only allow authorised users to rollback. Each control addresses a different aspect of rollback security." },
  { q: "What are common versioning attack vectors?", a: "Common versioning attack vectors: 1) Version tampering — modify model version to inject malicious code. 2) Unauthorised rollback — rollback to vulnerable or malicious version. 3) Version metadata tampering — modify version metadata to hide tampering. 4) Unapproved deployment — deploy unapproved version to production. 5) Version access bypass — bypass version access controls. Defense: version authentication, rollback security, version access control, audit logging." },
]

export default function LlmModelVersioningSecurityPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Moltbot", item: `${SITE_URL}/${locale}/moltbot` },
      { "@type": "ListItem", position: 3, name: "LLM Model Versioning Security", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "Versioning-Security-Guide für eigene KI-Systeme.", "Versioning security guide for your own AI systems.")}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Moltbot · Batch 25</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">{pick(isDE, "LLM Model Versioning Security", "LLM Model Versioning Security")}</h1>
        <p className="text-lg text-gray-300 mb-6">
          {pick(isDE, "LLM-Modelle ohne Versioning-Security sind anfällig für Versioning-Attacken — ohne Versioning-Security bleibt Versioning ungeschützt. Vier Kontrollen: Version Authentication, Rollback Security, Version Access Control und Version Audit Logging.", "LLM models without versioning security are vulnerable to versioning attacks — without versioning security, versioning remains unprotected. Four controls: version authentication, rollback security, version access control and version audit logging.")}
        </p>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "4 Versioning-Security-Kontrollen", "4 Versioning Security Controls")}</h2>
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
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Häufige Fragen", "Frequently Asked Questions")}</h2>
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
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Weiterführende Ressourcen", "Further Resources")}</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href={`/${locale}/moltbot/llm-model-extraction-defense`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Model Extraction Defense</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Extraction-Defense", "Extraction defense")}</div>
            </a>
            <a href={`/${locale}/moltbot/llm-model-watermarking`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Model Watermarking</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Watermarking", "Watermarking")}</div>
            </a>
            <a href={`/${locale}/moltbot/llm-api-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM API Security</div>
              <div className="text-sm text-gray-300">{pick(isDE, "API-Security", "API security")}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Security</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Versioning-Overview", "Versioning overview")}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
