import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/ai-agent-secure-deployment"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = pick(isDE, "AI Agent Secure Deployment: KI-Agenten-Secure-Deployment | ClawGuru Moltbot", "AI Agent Secure Deployment: AI Agent Secure Deployment | ClawGuru Moltbot")
  const description = pick(isDE, "KI-Agenten-Secure-Deployment: Secure Infrastructure, Deployment Verification, Runtime Security und Incident Response für KI-Agenten-Secure-Deployment.", "AI agent secure deployment: secure infrastructure, deployment verification, runtime security and incident response for AI agent secure deployment.")
  return {
    title, description,
    keywords: ["ai agent secure deployment", "secure infrastructure", "deployment verification", "runtime security", "incident response", "moltbot deployment"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const CONTROLS = [
  { id: "ASD-1", title: "Secure Infrastructure", desc: "Deploy agents on secure infrastructure. Use hardened containers, network isolation, and secure storage.", code: `# Moltbot secure infrastructure:
secure_infrastructure:
  enabled: true

  # Container security:
  containers:
    enabled: true
    # Use: hardened container images
    # Scan: images for vulnerabilities
    # Sign: container images
    # Update: regularly

  # Network isolation:
  network:
    enabled: true
    # Use: private networks, VPCs
    # Isolate: agent traffic from public internet
    # Firewall: restrict ingress/egress
    # VPN: require VPN for management access

  # Secure storage:
  storage:
    enabled: true
    # Use: encrypted storage
    # Encrypt: at rest and in transit
    # Key management: KMS or HSM
    # Backup: encrypted backups` },
  { id: "ASD-2", title: "Deployment Verification", desc: "Verify deployment integrity and security. Use code signing, hash verification, and runtime checks.", code: `# Moltbot deployment verification:
deployment_verification:
  enabled: true

  # Code signing:
  code_signing:
    enabled: true
    # Sign: agent code before deployment
    # Verify: signature at runtime
    # Key: secure key storage
    # Revoke: compromised keys

  # Hash verification:
  hash_verification:
    enabled: true
    # Verify: code hash against expected hash
    # Check: integrity of deployed artifacts
    # Alert: on hash mismatch
    # Block: unverified deployments

  # Runtime checks:
  runtime_checks:
    enabled: true
    # Verify: runtime integrity
    # Check: for unauthorised modifications
    # Monitor: for suspicious activity
    # Alert: on anomalies` },
  { id: "ASD-3", title: "Runtime Security", desc: "Secure agent runtime with monitoring, logging, and alerting. Detect and respond to security incidents.", code: `# Moltbot runtime security:
runtime_security:
  enabled: true

  # Monitoring:
  monitoring:
    enabled: true
    # Monitor: agent activity, resource usage
    # Metrics: CPU, memory, network I/O
    # Logs: security events, errors
    # Dashboard: real-time monitoring

  # Logging:
  logging:
    enabled: true
    # Log: all security-relevant events
    # Include: timestamp, user, action, result
    # Retain: logs for audit (90 days)
    # Protect: log access

  # Alerting:
  alerting:
    enabled: true
    # Alert on: security events, anomalies
    # Channels: email, Slack, PagerDuty
    # Escalation: based on severity
    # Response: automated or manual` },
  { id: "ASD-4", title: "Incident Response", desc: "Have incident response procedures in place. Define roles, playbooks, and communication channels.", code: `# Moltbot incident response:
incident_response:
  enabled: true

  # Roles and responsibilities:
  roles:
    enabled: true
    # Define: incident response team
    # Roles: incident commander, technical lead, communications
    # Contact: on-call rotation
    # Escalation: management escalation

  # Playbooks:
  playbooks:
    enabled: true
    # Define: incident response playbooks
    # Scenarios: compromise, data breach, outage
    # Steps: detection, containment, eradication, recovery
    # Test: regular drills

  # Communication:
  communication:
    enabled: true
    # Define: communication channels
    # Stakeholders: internal, external, customers
    # Templates: incident notification templates
    # Timeline: communication frequency` },
]

const FAQ = [
  { q: "What is the difference between secure infrastructure and runtime security?", a: "Secure infrastructure focuses on the deployment environment — containers, networks, storage, and their security configuration. It includes hardened container images, network isolation, and encrypted storage. Runtime security focuses on the agent's behavior during execution — monitoring, logging, alerting, and incident response. Secure infrastructure provides a secure foundation. Runtime security ensures the agent operates securely within that foundation. Both are necessary: secure infrastructure prevents environmental attacks, runtime security detects and responds to operational incidents." },
  { q: "How does code signing improve deployment security?", a: "Code signing ensures the integrity and authenticity of deployed code. Before deployment, the agent code is signed with a private key. At runtime, the signature is verified with the corresponding public key. If verification fails, the deployment is blocked. This prevents attackers from deploying malicious or tampered code. Code signing also provides accountability — the signing key identifies the author. Combined with hash verification, code signing provides strong assurance that the deployed code is authentic and unmodified." },
  { q: "How do I set up effective alerting for agent security?", a: "Effective alerting requires: 1) Define alert thresholds — what constitutes a security event. 2) Choose appropriate channels — email for low severity, Slack for medium, PagerDuty for critical. 3) Implement escalation rules — escalate unacknowledged alerts. 4) Include relevant context — logs, metrics, affected systems. 5) Test alerting regularly — ensure alerts are delivered and actionable. 6) Reduce false positives — tune thresholds based on operational data. 7) Document response procedures — ensure responders know what to do when alerted." },
  { q: "What are the key components of an incident response plan?", a: "An incident response plan should include: 1) Roles and responsibilities — incident commander, technical lead, communications, legal. 2) Playbooks — step-by-step procedures for common incident types (compromise, data breach, outage). 3) Communication plan — stakeholder notification templates, communication channels, timeline. 4) Escalation procedures — when and how to escalate to management or legal. 5) Post-incident review — root cause analysis, lessons learned, process improvements. 6) Regular testing — drills to ensure the plan works in practice." },
]

export default function AiAgentSecureDeploymentPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Moltbot", item: `${SITE_URL}/${locale}/moltbot` },
      { "@type": "ListItem", position: 3, name: "AI Agent Secure Deployment", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "Secure-Deployment-Guide für eigene KI-Systeme.", "Secure deployment guide for your own AI systems.")}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Moltbot · Batch 22</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">{pick(isDE, "AI Agent Secure Deployment", "AI Agent Secure Deployment")}</h1>
        <p className="text-lg text-gray-300 mb-6">
          {pick(isDE, "KI-Agenten ohne Secure Deployment können kompromittiert werden — ohne Secure Deployment bleibt Deployment ungeschützt. Vier Kontrollen: Secure Infrastructure, Deployment Verification, Runtime Security und Incident Response.", "AI agents without secure deployment can be compromised — without secure deployment, deployment remains unprotected. Four controls: secure infrastructure, deployment verification, runtime security and incident response.")}
        </p>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "4 Agent-Secure-Deployment-Kontrollen", "4 Agent Secure Deployment Controls")}</h2>
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
            <a href={`/${locale}/moltbot/secure-agent-deployment`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Secure Agent Deployment</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Deployment-Overview", "Deployment overview")}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-sandboxing-runtime`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Sandboxing Runtime</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Sandboxing", "Sandboxing")}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-audit-logging`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Audit Logging</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Logging", "Logging")}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-incident-response`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Incident Response</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Incident-Response", "Incident response")}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
