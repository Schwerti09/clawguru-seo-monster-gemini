import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/openclaw/zero-trust-networking"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = isDE
    ? "Zero Trust Networking: Zero-Trust-Netzwerk-Security | ClawGuru OpenClaw"
    : "Zero Trust Networking: Zero Trust Network Security | ClawGuru OpenClaw"
  const description = isDE
    ? "Zero Trust Networking: Never Trust, Always Verify. Microsegmentation, Identity-Based Access, Continuous Verification und Policy Enforcement für Zero-Trust-Netzwerke. Executable Runbooks für Self-Hosted Infrastruktur."
    : "Zero Trust networking: never trust, always verify. Microsegmentation, identity-based access, continuous verification and policy enforcement for zero-trust networks. Executable runbooks for self-hosted infrastructure."
  return {
    title, description,
    keywords: ["zero trust networking", "microsegmentation", "identity-based access", "continuous verification", "policy enforcement", "openclaw zero trust"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const CONTROLS = [
  { id: "ZTN-1", title: "Microsegmentation", desc: "Implement network microsegmentation. Segment by workload, trust level, and data sensitivity.", code: `# OpenClaw Microsegmentation:
microsegmentation:
  enabled: true

  # Workload Segmentation:
  workload:
    enabled: true
    # Segment: by workload type
    # Rules: web → app → db
    # Default: deny all
    # Allow: only necessary flows

  # Trust Level Segmentation:
  trust_level:
    enabled: true
    # Segment: by trust level
    # Levels: trusted, semi-trusted, untrusted
    # Rules: restrict cross-trust access
    # Enforce: least privilege

  # Data Sensitivity Segmentation:
  data_sensitivity:
    enabled: true
    # Segment: by data sensitivity
    # Levels: public, internal, confidential, restricted
    # Rules: restrict sensitive data access
    # Enforce: data classification policies` },
  { id: "ZTN-2", title: "Identity-Based Access", desc: "Implement identity-based access control. Use MFA, device posture, and conditional access.", code: `# OpenClaw Identity-Based Access:
identity_based_access:
  enabled: true

  # MFA Enforcement:
  mfa:
    enabled: true
    # Require: MFA for all access
    # Methods: TOTP, hardware keys
    # Enforce: for privileged access
    # Monitor: MFA bypass attempts

  # Device Posture:
  device_posture:
    enabled: true
    # Check: device health
    # Checks: OS version, antivirus, encryption
    # Block: non-compliant devices
    # Enforce: device compliance

  # Conditional Access:
  conditional_access:
    enabled: true
    # Define: access conditions
    # Factors: location, time, risk level
    # Enforce: dynamic access policies
    # Monitor: access patterns` },
  { id: "ZTN-3", title: "Continuous Verification", desc: "Implement continuous verification of trust. Re-authenticate, re-authorise, and monitor continuously.", code: `# OpenClaw Continuous Verification:
continuous_verification:
  enabled: true

  # Re-authentication:
  reauth:
    enabled: true
    # Require: periodic re-authentication
    # Interval: based on risk level
    # Methods: MFA, certificate
    # Enforce: session timeout

  # Re-authorization:
  reauthz:
    enabled: true
    # Re-evaluate: access permissions
    # Trigger: on policy change, role change
    # Enforce: least privilege
    # Monitor: permission changes

  # Continuous Monitoring:
  monitoring:
    enabled: true
    # Monitor: all network traffic
    # Detect: anomalous access patterns
    # Alert: on suspicious activity
    # Respond: automatically` },
  { id: "ZTN-4", title: "Policy Enforcement", desc: "Enforce zero-trust policies consistently. Use policy-as-code and automated enforcement.", code: `# OpenClaw Policy Enforcement:
policy_enforcement:
  enabled: true

  # Policy-as-Code:
  policy_as_code:
    enabled: true
    # Define: policies as code
    # Language: OPA/Rego, Sentinel
    # Version: in git
    # Test: automatically

  # Automated Enforcement:
  automated:
    enabled: true
    # Enforce: policies automatically
    # Tools: service mesh, firewall
    # Block: policy violations
    # Log: all enforcement actions

  # Policy Auditing:
  auditing:
    enabled: true
    # Audit: all policy decisions
    # Include: request, policy, decision
    # Retain: logs for audit (90 days)
    # Review: quarterly` },
]

const FAQ = [
  { q: "What is the difference between zero-trust and traditional network security?", a: "Traditional network security assumes trust within the network perimeter. Once inside, users and devices have broad access. Zero-trust assumes no trust — every access request is verified, regardless of location or network. Traditional security uses perimeter firewalls and VPNs. Zero-trust uses identity-based access, microsegmentation, and continuous verification. Zero-trust is more secure because it limits lateral movement and enforces least privilege everywhere." },
  { q: "How do I implement microsegmentation in my network?", a: "Implement microsegmentation by: 1) Mapping network flows — identify all communication patterns. 2) Segmenting by workload — group similar workloads together. 3) Defining trust levels — categorise workloads by trust. 4) Creating allow-list policies — only allow necessary flows. 5) Using service mesh — implement policies at the service level. 6) Monitoring and refining — continuously monitor and adjust policies. Start with critical assets and expand." },
  { q: "What is continuous verification in zero-trust?", a: "Continuous verification means re-verifying trust continuously, not just at login. This includes: 1) Periodic re-authentication — require users to re-authenticate periodically. 2) Session monitoring — monitor session activity for anomalies. 3) Device posture checks — verify device health continuously. 4) Risk-based access — adjust access based on risk level. 5) Automated response — automatically revoke access on risk events. Continuous verification prevents privilege escalation and limits the impact of compromised credentials." },
  { q: "How does OpenClaw help with zero-trust networking?", a: "OpenClaw provides executable runbooks for zero-trust networking: 1) Pre-built microsegmentation templates. 2) Identity-based access control policies. 3) Continuous verification automation. 4) Policy-as-code enforcement. 5) Automated monitoring and alerting. 6) Compliance reporting. OpenClaw reduces zero-trust implementation time from months to weeks and provides a clear path to compliance." },
]

export default function ZeroTrustNetworkingPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "OpenClaw", item: `${SITE_URL}/${locale}/openclaw` },
      { "@type": "ListItem", position: 3, name: "Zero Trust Networking", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE ? "Zero-Trust-Networking-Guide für eigene Infrastruktur." : "Zero-trust networking guide for your own infrastructure."}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">OpenClaw · Batch 8</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">{isDE ? "Zero Trust Networking" : "Zero Trust Networking"}</h1>
        <p className="text-lg text-gray-300 mb-6">
          {isDE
            ? "Never Trust, Always Verify: Microsegmentation, Identity-Based Access, Continuous Verification und Policy Enforcement für Zero-Trust-Netzwerke."
            : "Never Trust, Always Verify: Microsegmentation, identity-based access, continuous verification and policy enforcement for zero-trust networks."}
        </p>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "4 Zero-Trust-Kontrollen" : "4 Zero Trust Controls"}</h2>
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
            <a href={`/${locale}/openclaw/zero-trust-architecture`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Zero Trust Architecture</div>
              <div className="text-sm text-gray-300">{isDE ? "Zero-Trust-Overview" : "Zero-trust overview"}</div>
            </a>
            <a href={`/${locale}/openclaw/openclaw-security-2026`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">OpenClaw Security 2026</div>
              <div className="text-sm text-gray-300">{isDE ? "OpenClaw-Framework" : "OpenClaw framework"}</div>
            </a>
            <a href={`/${locale}/openclaw`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">All OpenClaw</div>
              <div className="text-sm text-gray-300">{isDE ? "OpenClaw-Übersicht" : "OpenClaw overview"}</div>
            </a>
            <a href={`/${locale}/check`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Security Check</div>
              <div className="text-sm text-gray-300">{isDE ? "Live-Check" : "Live check"}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
