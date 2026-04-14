import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/ai-agent-security"

const OWASP_LLM = [
  { id: "LLM01", name: "Prompt Injection", risk: "CRITICAL", fix: "prompt-injection-defense" },
  { id: "LLM02", name: "Insecure Output Handling", risk: "HIGH", fix: "ai-agent-sandboxing" },
  { id: "LLM03", name: "Training Data Poisoning", risk: "CRITICAL", fix: "model-poisoning-protection" },
  { id: "LLM04", name: "Model Denial of Service", risk: "HIGH", fix: "llm-gateway-hardening" },
  { id: "LLM05", name: "Supply Chain Vulnerabilities", risk: "HIGH", fix: "model-poisoning-protection" },
  { id: "LLM06", name: "Sensitive Info Disclosure", risk: "HIGH", fix: "ai-agent-sandboxing" },
  { id: "LLM07", name: "Insecure Plugin Design", risk: "MEDIUM", fix: "secure-agent-communication" },
  { id: "LLM08", name: "Excessive Agency", risk: "HIGH", fix: "ai-agent-sandboxing" },
  { id: "LLM09", name: "Overreliance", risk: "MEDIUM", fix: "ai-agent-hardening-guide" },
  { id: "LLM10", name: "Model Theft", risk: "HIGH", fix: "llm-gateway-hardening" },
]

const BATCH4_PAGES = [
  { slug: "prompt-injection-defense", icon: "💉", title: "Prompt Injection Defense", desc: "Input validation, output sanitization, runtime detection and sandboxing against LLM01." },
  { slug: "model-poisoning-protection", icon: "☣️", title: "Model Poisoning Protection", desc: "Training data integrity, behavioral test suites and supply chain validation against LLM03." },
  { slug: "secure-agent-communication", icon: "🔐", title: "Secure Agent Communication", desc: "mTLS, signed message envelopes and capability tokens for multi-agent systems." },
  { slug: "llm-gateway-hardening", icon: "🛡️", title: "LLM Gateway Hardening", desc: "Secure self-hosted Ollama/LocalAI/LiteLLM with auth, rate limiting and audit logging." },
  { slug: "ai-agent-sandboxing", icon: "📦", title: "AI Agent Sandboxing", desc: "Docker isolation, capability dropping, network restriction and blast radius limitation." },
]

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = isDE
    ? "KI-Agenten Sicherheit: Vollständiger Leitfaden 2026 | ClawGuru"
    : "AI Agent Security: Complete Defense Guide 2026 | ClawGuru"
  const description = isDE
    ? "Vollständiger Leitfaden zur KI-Agenten-Sicherheit: OWASP LLM Top 10, Prompt Injection Defense, Model Poisoning, LLM Gateway Hardening und AI Agent Sandboxing. Mit Moltbot automatisierbar."
    : "Complete AI agent security guide covering OWASP LLM Top 10, prompt injection defense, model poisoning protection, LLM gateway hardening and AI agent sandboxing. Automatable with Moltbot."
  return {
    title,
    description,
    keywords: [
      "ai agent security", "llm security 2026", "prompt injection prevention",
      "model poisoning protection", "ai agent sandboxing", "llm gateway hardening",
      "owasp llm top 10", "moltbot security", "ki agenten sicherheit", "autonomous ai security",
    ],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const FAQ = [
  {
    q: "What is the #1 security risk for AI agents in 2026?",
    a: "Prompt injection (OWASP LLM01) is the top risk. Attackers embed malicious instructions in user input or external data to hijack agent behavior. Defense requires input validation, structural prompt separation, output parsing, and sandbox isolation.",
  },
  {
    q: "How do I secure a self-hosted LLM gateway?",
    a: "Bind Ollama/LocalAI to 127.0.0.1 only, place a reverse proxy (nginx/Caddy) in front with API key auth or mTLS, add rate limiting (max 10 req/min per key), enable audit logging of all prompts, and restrict network access with iptables.",
  },
  {
    q: "What Docker flags are required for a secure AI agent container?",
    a: "Use: --read-only, --network=none, --cap-drop=ALL, --no-new-privileges, --user=65534, --memory=512m, --pids-limit=100, and wrap execution in timeout 30. This provides 6 isolation layers with minimal blast radius.",
  },
  {
    q: "How can I tell if my AI model has been poisoned?",
    a: "Run a behavioral test suite on every model version: test known refusal scenarios, check for anomalous outputs on synthetic inputs (including known trigger phrases), compare output distributions between model versions, and use SHA-256 checksums of model weights to detect unauthorized modifications.",
  },
  {
    q: "What is the principle of least privilege for AI agents?",
    a: "Each agent receives only the minimum permissions for its specific task. A summarization agent needs no filesystem or network access. A code agent reads repos but writes only to feature branches. Use scoped, time-limited capability tokens — never raw API keys or broad database credentials.",
  },
]

export default function AiAgentSecurityPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"
  const pageUrl = `${SITE_URL}/${locale}${PATH}`

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
        { "@type": "ListItem", position: 2, name: "Moltbot", item: `${SITE_URL}/${locale}/moltbot` },
        { "@type": "ListItem", position: 3, name: "AI Agent Security", item: pageUrl },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: isDE ? "KI-Agenten Sicherheit: Vollständiger Leitfaden 2026" : "AI Agent Security: Complete Defense Guide 2026",
      description: isDE
        ? "Vollständiger Leitfaden zur KI-Agenten-Sicherheit mit OWASP LLM Top 10, Prompt Injection Defense und Moltbot Sandboxing."
        : "Complete AI agent security guide covering OWASP LLM Top 10, prompt injection, model poisoning and sandboxing.",
      url: pageUrl,
      author: { "@type": "Organization", name: "ClawGuru Security Team" },
      publisher: { "@type": "Organization", name: "ClawGuru", url: SITE_URL },
      dateModified: "2026-04-14",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "Secure an AI Agent Deployment End-to-End",
      description: "Complete security hardening process for Moltbot and self-hosted AI agent systems.",
      totalTime: "PT3H",
      step: [
        { "@type": "HowToStep", name: "Audit OWASP LLM Top 10 exposure", text: "Map each LLM01–LLM10 risk to your agent components. Identify which are unmitigated." },
        { "@type": "HowToStep", name: "Harden prompt architecture", text: "Separate system prompts from user data. Add input injection detection scanner." },
        { "@type": "HowToStep", name: "Sandbox agent containers", text: "Apply --read-only, --cap-drop=ALL, --network=none, --memory=512m to all agent containers." },
        { "@type": "HowToStep", name: "Secure LLM gateway", text: "Bind to 127.0.0.1. Add reverse proxy with auth. Configure rate limiting and audit logging." },
        { "@type": "HowToStep", name: "Validate model integrity", text: "Run behavioral test suite before every deployment. Verify SHA-256 checksums of model weights." },
        { "@type": "HowToStep", name: "Implement capability tokens", text: "Replace raw API keys with scoped, time-limited capability tokens for all agent-to-agent calls." },
      ],
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">

        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: This guide is for defending your own AI systems. No attack tools, no exploitation of external systems.
        </div>

        <div className="mb-4">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Moltbot AI Security · Pillar Page</span>
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">
          {isDE ? "KI-Agenten Sicherheit: Vollständiger Leitfaden 2026" : "AI Agent Security: Complete Defense Guide 2026"}
        </h1>
        <p className="text-lg text-gray-300 mb-6">
          {isDE
            ? "LLM-basierte KI-Agenten sind die am schnellsten wachsende Angriffsfläche in der modernen Infrastruktur. Dieser Leitfaden gibt dir das vollständige Abwehr-Stack — von Prompt Injection bis Container-Isolation — mit direkten Links zu jedem Themen-Runbook."
            : "LLM-based AI agents are the fastest-growing attack surface in modern infrastructure. This guide gives you the complete defense stack — from prompt injection to container isolation — with direct links to every topic runbook."}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { value: "10", label: "OWASP LLM risks covered" },
            { value: "5", label: "Dedicated defense guides" },
            { value: "6", label: "Container isolation layers" },
            { value: "4", label: "JSON-LD schema types" },
          ].map((s) => (
            <div key={s.label} className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-center">
              <div className="text-3xl font-black text-cyan-400">{s.value}</div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* OWASP LLM Top 10 Table */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">OWASP LLM Top 10 — Threat Coverage Map</h2>
          <p className="text-gray-300 mb-4 text-sm">Each risk maps to a dedicated ClawGuru defense guide. Click the guide link to jump straight to the runbook.</p>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Risk</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Severity</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Defense Guide</th>
                </tr>
              </thead>
              <tbody>
                {OWASP_LLM.map((item, i) => (
                  <tr key={item.id} className={`border-b border-gray-700 ${i % 2 === 1 ? "bg-gray-800/50" : ""}`}>
                    <td className="px-4 py-3 font-mono text-xs text-cyan-400">{item.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-100">{item.name}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${item.risk === "CRITICAL" ? "bg-red-900 text-red-300" : item.risk === "HIGH" ? "bg-orange-900 text-orange-300" : "bg-yellow-900 text-yellow-300"}`}>
                        {item.risk}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <a href={`/${locale}/moltbot/${item.fix}`} className="text-sm text-cyan-400 hover:text-cyan-300 underline underline-offset-2">
                        {item.fix.replace(/-/g, " ")} →
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Batch-4 Sub-page Hub */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2 text-gray-100">Defense Deep-Dives</h2>
          <p className="text-gray-400 mb-6 text-sm">Five dedicated guides — each a complete playbook with code examples, checklists, and JSON-LD schemas.</p>
          <div className="grid md:grid-cols-2 gap-4 lg:grid-cols-3">
            {BATCH4_PAGES.map((p) => (
              <a key={p.slug} href={`/${locale}/moltbot/${p.slug}`} className="block bg-gray-800 p-5 rounded-lg border border-gray-700 hover:bg-gray-700 hover:border-cyan-600 transition-all group">
                <div className="text-3xl mb-3">{p.icon}</div>
                <div className="font-semibold text-cyan-400 group-hover:text-cyan-300 mb-2">{p.title}</div>
                <div className="text-xs text-gray-400 leading-relaxed">{p.desc}</div>
              </a>
            ))}
          </div>
        </section>

        {/* Defense Architecture */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">5-Layer Defense Architecture</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="space-y-4">
              {[
                { layer: "L1 — Input Validation", color: "green", desc: "Reject injection patterns before they reach the LLM. Allowlist input types, strip meta-instructions, limit length." },
                { layer: "L2 — Prompt Architecture", color: "blue", desc: "Immutable system prompt in separate channel. XML/JSON delimiters between instructions and user data. Never interpolate raw input." },
                { layer: "L3 — Container Sandbox", color: "yellow", desc: "--read-only rootfs, --cap-drop=ALL, --network=none, --user=65534, 30s execution timeout per agent run." },
                { layer: "L4 — Gateway Security", color: "orange", desc: "LLM gateway bound to 127.0.0.1. mTLS or API key auth via reverse proxy. Rate limit per key: 10 req/min." },
                { layer: "L5 — Behavioral Monitoring", color: "red", desc: "Log all inputs/outputs. Run canary probes. Alert on statistical output distribution shifts. Rotate model versions with integrity checks." },
              ].map((l, i) => (
                <div key={l.layer} className="flex items-start gap-4">
                  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">{i + 1}</div>
                  <div>
                    <div className={`font-semibold text-${l.color}-300 mb-1`}>{l.layer}</div>
                    <div className="text-sm text-gray-300">{l.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick-Start Hardening Checklist */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">30-Minute Quick-Start Checklist</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="grid md:grid-cols-2 gap-3">
              {[
                "System prompt in separate, immutable channel (not interpolated with user input)",
                "Injection pattern scanner active on all LLM inputs",
                "Agent container runs as UID 65534 (nobody), read-only rootfs",
                "LLM gateway bound to 127.0.0.1 — zero public exposure",
                "Rate limiting: max 10 LLM calls/min per API key",
                "All agent inputs and outputs logged with correlation ID",
                "Model SHA-256 checksum verified before each deployment",
                "Behavioral test suite runs in CI — deployment blocked on failure",
                "Capability tokens used for agent-to-agent auth (not raw API keys)",
                "Agent execution timeout: 30 seconds hard limit",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="bg-green-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">✓</div>
                  <p className="text-sm text-gray-300">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Compliance & EU AI Act */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Compliance: EU AI Act + GDPR</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-blue-900 p-4 rounded-lg border border-blue-700">
              <h3 className="font-semibold text-blue-300 mb-2">EU AI Act (High-Risk)</h3>
              <p className="text-sm text-blue-200">High-risk AI systems (healthcare, infrastructure, HR) require: human oversight mechanisms, risk management system, technical documentation, conformity assessment, and post-market monitoring.</p>
            </div>
            <div className="bg-green-900 p-4 rounded-lg border border-green-700">
              <h3 className="font-semibold text-green-300 mb-2">GDPR / DSGVO</h3>
              <p className="text-sm text-green-200">AI processing personal data: data minimisation (agents only receive what they need), logging with PII masking, purpose limitation, retention limits, and right-to-erasure support in agent memory.</p>
            </div>
            <div className="bg-yellow-900 p-4 rounded-lg border border-yellow-700">
              <h3 className="font-semibold text-yellow-300 mb-2">SOC 2 Type II</h3>
              <p className="text-sm text-yellow-200">Audit logging of all agent actions (1-year retention), access controls with least privilege, incident response procedures, and regular security testing of agent systems.</p>
            </div>
            <div className="bg-red-900 p-4 rounded-lg border border-red-700">
              <h3 className="font-semibold text-red-300 mb-2">NIS2 (EU)</h3>
              <p className="text-sm text-red-200">AI systems in critical infrastructure: risk management obligations, incident reporting within 24h, supply chain security including AI model provenance, and business continuity measures.</p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQ.map((f, i) => (
              <details key={i} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <summary className="font-semibold text-gray-100 cursor-pointer">{f.q}</summary>
                <p className="mt-3 text-sm text-gray-300 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Batch 5 Advanced Topics */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Advanced Topics — Batch 5</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { slug: "agentic-rag-security", icon: "🗃️", title: "Agentic RAG Security", desc: "Vector DB hardening, document injection defense, retrieval access control." },
              { slug: "multi-agent-trust", icon: "🤝", title: "Multi-Agent Trust", desc: "Capability tokens, mTLS, lateral movement prevention in agent networks." },
              { slug: "ai-red-teaming", icon: "🎯", title: "AI Red Teaming", desc: "Systematic testing of AI agent defenses: injection, exfiltration, DoS." },
              { slug: "ai-tool-use-security", icon: "🔧", title: "AI Tool Use Security", desc: "LLM function calling, tool scope restriction, HITL for dangerous tools." },
              { slug: "federated-learning-security", icon: "🌐", title: "Federated Learning Security", desc: "Gradient poisoning defense, differential privacy, Byzantine-robust aggregation." },
            ].map((p) => (
              <a key={p.slug} href={`/${locale}/moltbot/${p.slug}`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
                <div className="text-2xl mb-2">{p.icon}</div>
                <div className="font-semibold text-cyan-400 mb-1">{p.title}</div>
                <div className="text-xs text-gray-300">{p.desc}</div>
              </a>
            ))}
          </div>
        </section>

        {/* Further Resources */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Further Resources</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href={`/${locale}/neuro`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Stack MRI</div>
              <div className="text-sm text-gray-300">Scan your AI stack for live vulnerabilities</div>
            </a>
            <a href={`/${locale}/roast-my-moltbot`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Roast My Moltbot</div>
              <div className="text-sm text-gray-300">Free security roast of your AI setup</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-hardening-guide`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Hardening Guide</div>
              <div className="text-sm text-gray-300">Step-by-step agent hardening framework</div>
            </a>
            <a href={`/${locale}/openclaw/service-mesh-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Service Mesh Security</div>
              <div className="text-sm text-gray-300">mTLS for multi-agent communication</div>
            </a>
          </div>
        </section>

      </div>
    </div>
  )
}
