import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/ai-agent-communication-security"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = pick(isDE, "AI Agent Communication Security: KI-Agenten-Kommunikationssicherheit | ClawGuru Moltbot", "AI Agent Communication Security: AI Agent Communication Security | ClawGuru Moltbot")
  const description = pick(isDE, "KI-Agenten-Kommunikationssicherheit: Agent-to-Agent Encryption, Message Validation, Channel Security und Communication Auditing für Multi-Agent-Systeme.", "AI agent communication security: agent-to-agent encryption, message validation, channel security and communication auditing for multi-agent systems.")
  return {
    title, description,
    keywords: ["ai agent communication security", "multi-agent security", "agent-to-agent encryption", "message validation", "agent channel security", "moltbot communication"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const CONTROLS = [
  { id: "ACS-1", title: "Agent-to-Agent Encryption", desc: "Encrypt all communication between agents. Use end-to-end encryption to prevent interception and tampering of agent messages.", code: `# Moltbot agent-to-agent encryption:
agent_encryption:
  enabled: true

  # Encryption algorithm:
  algorithm: "AES-256-GCM"
  key_length: 256

  # Key exchange:
  key_exchange: "ECDH"  # Elliptic Curve Diffie-Hellman
  # Agents exchange public keys, derive shared secret

  # Message encryption:
  encryption:
    # Encrypt all agent messages:
    # - Agent-to-agent messages
    # - Agent-to-orchestrator messages
    # - Agent-to-tool messages
    encrypt_all: true

  # Key rotation:
  rotation:
    enabled: true
    # Rotate encryption keys periodically
    rotation_interval_hours: 24
    # Generate new keys, re-establish secure channels` },
  { id: "ACS-2", title: "Message Validation", desc: "Validate all agent messages for authenticity and integrity. Use digital signatures and message authentication codes (MACs).", code: `# Moltbot message validation:
message_validation:
  enabled: true

  # Digital signatures:
  signatures:
    enabled: true
    algorithm: "ECDSA"
    curve: "P-256"
    # Each agent signs its messages with its private key
    # Recipients verify with sender's public key

  # Message authentication codes:
  mac:
    enabled: true
    algorithm: "HMAC-SHA256"
    # Add MAC to each message for integrity verification

  # Message format validation:
  format_validation:
    enabled: true
    # Validate message format:
    # - Required fields present
    # - Field types correct
    # - Field values within allowed ranges
    # - No unexpected fields

  # Replay attack prevention:
  replay_prevention:
    enabled: true
    # Add timestamp and nonce to each message
    # Reject messages with old timestamps or duplicate nonces` },
  { id: "ACS-3", title: "Channel Security", desc: "Secure the communication channels between agents. Use TLS for network transport and secure message queues for asynchronous communication.", code: `# Moltbot channel security:
channel_security:
  enabled: true

  # TLS for network transport:
  tls:
    enabled: true
    # Use TLS 1.3 for all agent communication
    min_version: "1.3"
    # Require mutual TLS (mTLS) for agent authentication
    mtls: true

  # Secure message queues:
  message_queues:
    enabled: true
    # Use secure message brokers:
    # - RabbitMQ with TLS
    # - Kafka with TLS and SASL
    # - AWS SQS with server-side encryption
    encryption_at_rest: true
    encryption_in_transit: true

  # WebSocket security:
  websockets:
    enabled: true
    # Use secure WebSockets (wss://)
    # Authenticate WebSocket connections
    # Rate limit WebSocket messages

  # Network isolation:
  isolation:
    enabled: true
    # Isolate agent communication in private network
    # Use VPC peering or VPN for cross-region communication` },
  { id: "ACS-4", title: "Communication Auditing", desc: "Audit all agent communication for security monitoring and compliance. Log messages, participants, and metadata.", code: `# Moltbot communication auditing:
communication_audit:
  enabled: true

  # Audit logging:
  logging:
    log_all_messages: true
    log_fields:
      - sender_id
      - recipient_id
      - timestamp
      - message_type
      - message_hash
      - channel
      - encryption_status

  # Audit storage:
  storage:
    type: "database"
    retention_days: 90
    encryption: true

  # Audit alerts:
  alerts:
    enabled: true
    # Alert on:
    # - Unusual communication patterns
    # - Communication with unauthorised agents
    # - Failed message validation
    # - Encryption failures
    alert_on:
      - unusual_pattern
      - unauthorised_communication
      - validation_failure
      - encryption_failure

  # Compliance reporting:
  compliance:
    enabled: true
    # Generate compliance reports for:
    # - SOC 2 (communication logs)
    # - GDPR (data in transit logs)
    reports:
      - soc2_communication
      - gdpr_data_in_transit` },
]

const FAQ = [
  { q: "Why is agent-to-agent encryption necessary in multi-agent systems?", a: "Agent-to-agent encryption is necessary because agents communicate sensitive data, instructions, and results. Without encryption, this communication can be intercepted, tampered with, or spoofed by attackers. Risks: 1) Data leakage — sensitive data sent between agents can be intercepted. 2) Message tampering — attackers can modify messages in transit to change agent behavior. 3) Impersonation — attackers can impersonate agents to send malicious messages. 4) Replay attacks — attackers can replay old messages to cause unintended actions. End-to-end encryption ensures that only the intended recipient can read the message, and digital signatures ensure authenticity and integrity." },
  { q: "How do I implement secure message queues for agent communication?", a: "Secure message queues require: 1) Encryption at rest — encrypt messages stored in the queue using AES-256-GCM. 2) Encryption in transit — use TLS for all connections to the message broker. 3) Authentication — authenticate agents connecting to the queue using mTLS or SASL. 4) Authorization — use ACLs to restrict which agents can read from/write to which queues. 5) Message validation — validate message format and content before processing. 6) Audit logging — log all queue operations for compliance. Popular secure message brokers: RabbitMQ with TLS, Kafka with TLS and SASL, AWS SQS with server-side encryption." },
  { q: "What are the common communication security vulnerabilities in multi-agent systems?", a: "Common vulnerabilities: 1) Unencrypted communication — messages sent in plaintext can be intercepted. 2) Weak authentication — agents authenticate with weak credentials or no authentication at all. 3) Lack of message validation — unvalidated messages can cause injection attacks. 4) Replay attacks — old messages replayed to cause unintended actions. 5) Man-in-the-middle attacks — attackers intercept and modify messages in transit. 6) Unauthorised agent communication — agents communicate with unauthorised entities. 7) Lack of audit logging — no visibility into communication patterns for security monitoring." },
  { q: "How do I detect communication security incidents in multi-agent systems?", a: "Detection methods: 1) Audit log analysis — analyse communication logs for unusual patterns (unusual agents, unusual times, unusual message volumes). 2) Encryption monitoring — monitor for encryption failures (failed TLS handshakes, invalid signatures). 3) Message validation alerts — alert on repeated validation failures (invalid format, MAC verification failure). 4) Network monitoring — monitor network traffic for unusual patterns (large message volumes, connections from unusual IPs). 5) Agent behavior monitoring — monitor agent behavior for signs of compromise (unusual tool calls, unusual outputs). 6) Anomaly detection — use ML-based anomaly detection to identify unusual communication patterns." },
]

export default function AiAgentCommunicationSecurityPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Moltbot", item: `${SITE_URL}/${locale}/moltbot` },
      { "@type": "ListItem", position: 3, name: "AI Agent Communication Security", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "Agent-Communication-Security-Guide für eigene KI-Systeme.", "Agent communication security guide for your own AI systems.")}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Moltbot · Batch 17</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">{pick(isDE, "AI Agent Communication Security", "AI Agent Communication Security")}</h1>
        <p className="text-lg text-gray-300 mb-6">
          {pick(isDE, "Multi-Agent-Systeme ohne Communication Security sind Einfallstore für Interception und Tampering. Vier Kontrollen: Agent-to-Agent Encryption, Message Validation, Channel Security und Auditing.", "Multi-agent systems without communication security are entry points for interception and tampering. Four controls: agent-to-agent encryption, message validation, channel security and auditing.")}
        </p>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "4 Agent-Communication-Security-Kontrollen", "4 Agent Communication Security Controls")}</h2>
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
            <a href={`/${locale}/moltbot/llm-api-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM API Security</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Channel-Security", "Channel security")}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-rbac`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent RBAC</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Agent-Authentication", "Agent authentication")}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-audit-logging`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Audit Logging</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Communication-Auditing", "Communication auditing")}</div>
            </a>
            <a href={`/${locale}/moltbot/agentic-workflow-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Agentic Workflow Security</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Multi-Agent-Security", "Multi-agent security")}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
