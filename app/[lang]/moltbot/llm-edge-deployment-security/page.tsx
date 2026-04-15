import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/llm-edge-deployment-security"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = isDE
    ? "LLM Edge Deployment Security: LLM-Edge-Deployment-Security | ClawGuru Moltbot"
    : "LLM Edge Deployment Security: LLM Edge Deployment Security | ClawGuru Moltbot"
  const description = isDE
    ? "LLM-Edge-Deployment-Security: Edge Device Authentication, Secure Edge Inference, Edge Update Security und Edge Monitoring für LLM-Edge-Deployment-Security."
    : "LLM edge deployment security: edge device authentication, secure edge inference, edge update security and edge monitoring for LLM edge deployment security."
  return {
    title, description,
    keywords: ["llm edge deployment security", "edge device authentication", "secure edge inference", "edge update security", "edge monitoring", "moltbot edge"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const CONTROLS = [
  { id: "EDS-1", title: "Edge Device Authentication", desc: "Authenticate all edge devices. Use device certificates, TPM, or secure boot for secure edge deployment.", code: `# Moltbot edge device authentication:
edge_device_auth:
  enabled: true

  # Device certificates:
  device_certificates:
    enabled: true
    # Require: device certificates for edge access
    # Validate: certificate on every request
    # Revoke: compromised certificates
    # Use: X.509 certificates

  # TPM authentication:
  tpm:
    enabled: true
    # Use: TPM for device attestation
    # Verify: TPM quote on device boot
    # Prevents: device impersonation
    # Use: for high-security edge

  # Secure boot:
  secure_boot:
    enabled: true
    # Enable: secure boot on edge devices
    # Verify: boot chain integrity
    # Prevents: boot tampering
    # Use: for production edge` },
  { id: "EDS-2", title: "Secure Edge Inference", desc: "Secure inference on edge devices. Use TEE, encrypted models, and secure model loading.", code: `# Moltbot secure edge inference:
secure_edge_inference:
  enabled: true

  # Trusted execution environment:
  tee:
    enabled: true
    # Use: TEE for edge inference
    # Providers: Intel SGX, ARM TrustZone
    # Benefit: hardware-based isolation
    # Protects: model and data

  # Encrypted models:
  encrypted_models:
    enabled: true
    # Encrypt: models at rest on edge
    # Decrypt: only in TEE
    # Key management: KMS or HSM
    # Prevents: model theft

  # Secure model loading:
  secure_loading:
    enabled: true
    # Verify: model signature before loading
    # Check: model integrity
    # Block: tampered models
    # Prevents: model tampering` },
  { id: "EDS-3", title: "Edge Update Security", desc: "Secure edge device updates. Use signed updates, delta updates, and rollback mechanisms.", code: `# Moltbot edge update security:
edge_update_security:
  enabled: true

  # Signed updates:
  signed_updates:
    enabled: true
    # Sign: all edge updates
    # Verify: signature before applying
    # Revoke: compromised signing keys
    # Prevents: update tampering

  # Delta updates:
  delta_updates:
    enabled: true
    # Use: delta updates for efficiency
    # Verify: delta integrity
    # Benefit: reduced bandwidth
    # Use: for large models

  # Rollback mechanism:
  rollback:
    enabled: true
    # Implement: automatic rollback on failure
    # Monitor: update success/failure
    # Benefit: minimise downtime
    # Use: for production edge` },
  { id: "EDS-4", title: "Edge Monitoring", desc: "Monitor edge devices for security events. Use telemetry, anomaly detection, and alerting.", code: `# Moltbot edge monitoring:
edge_monitoring:
  enabled: true

  # Device telemetry:
  telemetry:
    enabled: true
    # Collect: device health metrics
    # Metrics: CPU, memory, inference latency
    # Upload: to central monitoring
    # Alert: on anomalies

  # Anomaly detection:
  anomaly_detection:
    enabled: true
    # Detect: anomalous device behavior
    # Methods: statistical analysis, ML classifier
    # Alert: on suspicious activity
    # Block: compromised devices

  # Security event logging:
  event_logging:
    enabled: true
    # Log: all security events
    # Include: timestamp, device, event, result
    # Retain: logs for audit (90 days)
    # Protect: log access` },
]

const FAQ = [
  { q: "What is the difference between edge device authentication and orchestration authentication?", a: "Edge device authentication authenticates the physical or virtual edge device running the model. This ensures that only authorised devices can run edge inference. Orchestration authentication authenticates the orchestration system that manages edge devices. Edge device authentication is typically handled by device certificates, TPM, or secure boot. Orchestration authentication is typically handled by API keys or OAuth. Both are necessary: edge device authentication protects the device, orchestration authentication protects the orchestration system." },
  { q: "How does TEE protect edge inference?", a: "Trusted Execution Environment (TEE) protects edge inference by providing hardware-based isolation. The model and data are encrypted at rest and decrypted only inside the TEE. The TEE prevents external access to the model and data, even if the edge device is compromised. TEE also provides attestation, allowing the orchestration system to verify that the edge device is running trusted code. Common TEE implementations: Intel SGX, ARM TrustZone, AMD SEV." },
  { q: "How do I secure edge device updates?", a: "Secure edge device updates require: 1) Signed updates — sign all updates and verify before applying. 2) Delta updates — use delta updates for efficiency and verify integrity. 3) Rollback mechanism — automatic rollback on failure to minimise downtime. 4) Staged rollout — deploy to subset of devices first. 5) Monitoring — monitor update success/failure. 6) Key management — secure signing keys with KMS or HSM. Each control addresses a different aspect of update security." },
  { q: "What are common edge deployment attack vectors?", a: "Common edge deployment attack vectors: 1) Device impersonation — impersonate legitimate edge devices. 2) Model theft — extract model from edge device. 3) Update tampering — tamper with device updates. 4) Edge device compromise — compromise edge device to access model/data. 5) Edge DoS — overload edge devices. Defense: edge device authentication, secure edge inference, edge update security, edge monitoring, rate limiting." },
]

export default function LlmEdgeDeploymentSecurityPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Moltbot", item: `${SITE_URL}/${locale}/moltbot` },
      { "@type": "ListItem", position: 3, name: "LLM Edge Deployment Security", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE ? "Edge-Deployment-Security-Guide für eigene KI-Systeme." : "Edge deployment security guide for your own AI systems."}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Moltbot · Batch 24</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">{isDE ? "LLM Edge Deployment Security" : "LLM Edge Deployment Security"}</h1>
        <p className="text-lg text-gray-300 mb-6">
          {isDE
            ? "LLM-Modelle ohne Edge-Deployment-Security sind anfällig für Edge-Attacken — ohne Edge-Deployment-Security bleibt Edge-Deployment ungeschützt. Vier Kontrollen: Edge Device Authentication, Secure Edge Inference, Edge Update Security und Edge Monitoring."
            : "LLM models without edge deployment security are vulnerable to edge attacks — without edge deployment security, edge deployment remains unprotected. Four controls: edge device authentication, secure edge inference, edge update security and edge monitoring."}
        </p>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "4 Edge-Deployment-Security-Kontrollen" : "4 Edge Deployment Security Controls"}</h2>
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
            <a href={`/${locale}/moltbot/ai-agent-secure-deployment`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Secure Deployment</div>
              <div className="text-sm text-gray-300">{isDE ? "Deployment-Security" : "Deployment security"}</div>
            </a>
            <a href={`/${locale}/moltbot/llm-secure-inference`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Secure Inference</div>
              <div className="text-sm text-gray-300">{isDE ? "Confidential-Computing" : "Confidential computing"}</div>
            </a>
            <a href={`/${locale}/moltbot/llm-data-encryption-at-rest`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Data Encryption at Rest</div>
              <div className="text-sm text-gray-300">{isDE ? "Encryption-at-Rest" : "Encryption at rest"}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Security</div>
              <div className="text-sm text-gray-300">{isDE ? "Edge-Overview" : "Edge overview"}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
