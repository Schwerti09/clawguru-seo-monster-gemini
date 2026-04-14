import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/secure-agent-communication"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const title = "Secure AI Agent Communication Patterns 2026 | ClawGuru"
  const description = "Security patterns for AI agent-to-agent and agent-to-tool communication. mTLS, signed messages, capability tokens, and audit trails for multi-agent Moltbot systems."
  return {
    title,
    description,
    keywords: ["ai agent communication security", "multi-agent security", "agent authentication", "moltbot communication", "ai agent mtls", "capability tokens", "agent authorization"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const PATTERNS = [
  {
    name: "Pattern 1: Signed Message Envelopes",
    problem: "How do you know a message from AgentB actually came from AgentB and wasn't tampered with?",
    solution: "Every agent message is cryptographically signed with the sending agent's private key. Receivers verify before acting.",
    risk: "Without this: any process can impersonate an agent.",
    code: `// Agent sends signed message
const payload = { action: "read_file", path: "/data/report.json", agentId: "agent-b", ts: Date.now() }
const signature = await signMessage(JSON.stringify(payload), AGENT_B_PRIVATE_KEY)
const envelope = { payload, signature, publicKey: AGENT_B_PUBLIC_KEY_ID }

// Receiver verifies
const valid = await verifySignature(JSON.stringify(envelope.payload), envelope.signature, getPublicKey(envelope.publicKey))
if (!valid) throw new Error("INVALID_AGENT_SIGNATURE — rejecting message")`
  },
  {
    name: "Pattern 2: Capability Tokens",
    problem: "An orchestrator agent should only be able to grant capabilities it already has — not escalate its own permissions.",
    solution: "Use macaroon-style capability tokens with explicit scope lists. Agents can delegate a subset of their capabilities, never more.",
    risk: "Without this: agent privilege escalation across multi-agent pipelines.",
    code: `// Issue capability token
const token = issueCapabilityToken({
  agentId: "orchestrator-1",
  capabilities: ["read:logs", "write:reports"],  // explicit allowlist
  delegatable: ["read:logs"],  // can only delegate read access
  expires: Date.now() + 3600_000,
  issuedBy: "auth-service"
})

// Sub-agent uses delegated token
const subToken = delegateCapability(token, {
  to: "sub-agent-2",
  capabilities: ["read:logs"],  // subset only
  expires: Date.now() + 1800_000
})`
  },
  {
    name: "Pattern 3: mTLS for Agent-to-Agent",
    problem: "HTTP calls between agents are interceptable and spoofable without mutual authentication.",
    solution: "Issue each agent a TLS certificate. Enforce mTLS for all inter-agent communication.",
    risk: "Without this: man-in-the-middle attacks on internal agent traffic.",
    code: `# Issue per-agent certificates via internal CA
vault write pki/issue/agents \\
  common_name="agent-orchestrator.moltbot.internal" \\
  ttl="24h" \\
  alt_names="agent-orchestrator,localhost"

# Agent HTTP client config (Node.js)
const agent = new https.Agent({
  cert: fs.readFileSync('/certs/agent.crt'),
  key: fs.readFileSync('/certs/agent.key'),
  ca: fs.readFileSync('/certs/internal-ca.crt'),
  rejectUnauthorized: true  // NEVER set false in production
})`
  },
]

const CHECKLIST = [
  "All agent-to-agent calls use mTLS — no plain HTTP internally",
  "Every message envelope includes sender ID, timestamp, and signature",
  "Capability tokens with explicit scope lists — no wildcard permissions",
  "Agent certificates rotated daily via automated vault PKI",
  "All inter-agent calls logged with correlation IDs for full traceability",
  "Agent registry with active agent list — unlisted agents rejected",
  "Message replay prevention: nonce + 5-minute timestamp window",
  "Dead agent detection: heartbeat every 30s, auto-revoke on timeout",
]

export default function SecureAgentCommunicationPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">

        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: These patterns are for securing your own multi-agent systems. Defensive use only.
        </div>

        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Moltbot AI Security</span>
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">Secure AI Agent Communication Patterns 2026</h1>
        <p className="text-lg text-gray-300 mb-8">
          Multi-agent systems introduce a new attack surface: agent-to-agent communication. One compromised sub-agent can pivot to the entire swarm. These patterns give you cryptographic trust between agents — not just perimeter security.
        </p>

        <div className="bg-blue-900 border border-blue-700 p-5 rounded-lg mb-10">
          <h3 className="font-bold text-blue-300 mb-2">Why This Matters in 2026</h3>
          <p className="text-sm text-blue-200">
            As AI orchestration grows (LangGraph, CrewAI, Moltbot multi-agent), the internal bus between agents becomes critical attack surface. Traditional network security doesn't help here — you need <strong>identity-based, cryptographically enforced trust</strong> at the message level.
          </p>
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-6 text-gray-100">Security Patterns</h2>
          <div className="space-y-8">
            {PATTERNS.map((p) => (
              <div key={p.name} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <h3 className="font-bold text-cyan-400 text-lg mb-3">{p.name}</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-red-900 border border-red-700 p-3 rounded-lg">
                    <div className="text-xs font-bold text-red-300 mb-1">PROBLEM</div>
                    <p className="text-sm text-red-200">{p.problem}</p>
                  </div>
                  <div className="bg-green-900 border border-green-700 p-3 rounded-lg">
                    <div className="text-xs font-bold text-green-300 mb-1">SOLUTION</div>
                    <p className="text-sm text-green-200">{p.solution}</p>
                  </div>
                </div>
                <div className="bg-orange-900 border border-orange-700 p-3 rounded-lg mb-4">
                  <p className="text-xs text-orange-200"><strong>Without this:</strong> {p.risk.replace('Without this: ', '')}</p>
                </div>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs overflow-x-auto">
                  <pre>{p.code}</pre>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Production Hardening Checklist</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="space-y-3">
              {CHECKLIST.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</div>
                  <p className="text-sm text-gray-300">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Further Resources</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href={`/${locale}/moltbot/ai-agent-sandboxing`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Sandboxing</div>
              <div className="text-sm text-gray-300">Isolation best practices</div>
            </a>
            <a href={`/${locale}/moltbot/prompt-injection-defense`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Prompt Injection Defense</div>
              <div className="text-sm text-gray-300">Input validation playbook</div>
            </a>
            <a href={`/${locale}/openclaw/service-mesh-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Service Mesh Security</div>
              <div className="text-sm text-gray-300">Istio/Linkerd mTLS guide</div>
            </a>
            <a href={`/${locale}/neuro`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Stack MRI</div>
              <div className="text-sm text-gray-300">Scan your agent communication stack</div>
            </a>
          </div>
        </section>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
          { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [
            { "@type": "Question", name: "How should AI agents authenticate to each other?", acceptedAnswer: { "@type": "Answer", text: "Use mTLS with per-agent certificates issued by an internal CA (e.g., HashiCorp Vault PKI). Each agent has a unique identity and the receiver cryptographically verifies it before processing any message." } },
            { "@type": "Question", name: "What are capability tokens in multi-agent AI?", acceptedAnswer: { "@type": "Answer", text: "Capability tokens are cryptographically signed authorization tokens that specify exactly what an agent is allowed to do. Like macaroons, they can be delegated but never escalated — a sub-agent can only receive a subset of the delegating agent's permissions." } },
            { "@type": "Question", name: "How do I prevent replay attacks between AI agents?", acceptedAnswer: { "@type": "Answer", text: "Include a unique nonce and timestamp in every message. Reject messages older than 5 minutes or with previously seen nonces. Store nonces in a fast in-memory cache (Redis) with TTL matching your replay window." } },
          ]},
          { "@context": "https://schema.org", "@type": "HowTo", name: "Secure Multi-Agent Communication with Moltbot",
            description: "Implement cryptographic trust between AI agents in multi-agent Moltbot systems.",
            totalTime: "PT120M",
            step: [
              { "@type": "HowToStep", name: "Set up internal CA", text: "Deploy HashiCorp Vault PKI or cert-manager. Issue per-agent TLS certificates with 24h TTL." },
              { "@type": "HowToStep", name: "Enforce mTLS between agents", text: "Configure all inter-agent HTTP clients with mutual TLS. Reject connections without valid client certificates." },
              { "@type": "HowToStep", name: "Implement message signing", text: "Sign all agent messages with the sender's private key. Verify signature on receive before processing." },
              { "@type": "HowToStep", name: "Deploy capability token system", text: "Issue scoped capability tokens for all agent authorizations. Implement delegation with scope reduction." },
              { "@type": "HowToStep", name: "Add replay prevention", text: "Add nonce + timestamp to all messages. Validate against Redis nonce cache before processing." },
            ]
          }
        ]) }} />
      </div>
    </div>
  )
}
