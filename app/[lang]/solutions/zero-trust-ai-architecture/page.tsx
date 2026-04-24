import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/solutions/zero-trust-ai-architecture"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = pick(isDE, "Zero Trust für KI-Architekturen: AI-Systeme absichern 2026 | ClawGuru Solutions", "Zero Trust AI Architecture: Securing AI Systems 2026 | ClawGuru Solutions")
  const description = pick(isDE, "Zero-Trust-Architektur für KI- und LLM-Systeme: Identity-first Access, Micro-Segmentierung, kontinuierliche Verifikation und AI-spezifische Zero-Trust-Kontrollen 2026.", "Zero Trust architecture for AI and LLM systems: identity-first access, micro-segmentation, continuous verification and AI-specific zero trust controls 2026.")
  return {
    title, description,
    keywords: ["zero trust ai", "zero trust llm", "ai architecture security", "zero trust machine learning", "ai network segmentation", "llm access control 2026"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const PILLARS = [
  {
    id: "IDENTITY", name: "Identity-First Access", color: "blue",
    items: [
      "Every AI service, model, and agent must authenticate — no implicit trust",
      "Issue short-lived mTLS certificates to all AI components (max 24h)",
      "Enforce SPIFFE/SPIRE workload identity for AI inference services",
      "Require MFA for all human access to AI management planes",
      "Implement just-in-time (JIT) access for AI training environments",
      "Rotate all AI service credentials automatically every 30 days",
    ],
  },
  {
    id: "MICROSEG", name: "Micro-Segmentation", color: "purple",
    items: [
      "Isolate AI training environments from inference/production networks",
      "Deploy AI model serving behind dedicated ingress with allowlist-only rules",
      "Block all lateral movement: AI workers cannot reach each other directly",
      "Separate data pipelines from model APIs via dedicated network namespaces",
      "Use Kubernetes NetworkPolicy or Cilium for pod-level AI isolation",
      "Implement east-west traffic inspection between all AI microservices",
    ],
  },
  {
    id: "CONTINUOUS", name: "Continuous Verification", color: "green",
    items: [
      "Validate every AI API request — never trust a prior authenticated session",
      "Re-authenticate all AI service tokens on each inference call",
      "Monitor and alert on anomalous AI request volumes or patterns",
      "Implement behavioral baselines for each AI model's output distribution",
      "Detect drift: flag AI inference responses deviating from baseline",
      "Run automated red-team probes against AI endpoints weekly",
    ],
  },
  {
    id: "LEAST_PRIV", name: "Least Privilege for AI", color: "orange",
    items: [
      "Grant AI agents only the minimum data access required for their task",
      "Scope LLM context windows: never include unused sensitive data",
      "Restrict AI tool-use: enumerate allowed tools explicitly per agent",
      "Prevent AI agents from spawning child processes or network connections",
      "Apply read-only data access for AI training unless write is required",
      "Review and prune AI permissions quarterly",
    ],
  },
  {
    id: "ASSUME_BREACH", name: "Assume Breach Controls", color: "red",
    items: [
      "Design AI systems expecting model exfiltration — encrypt weights at rest",
      "Implement canary tokens in AI training data to detect leakage",
      "Deploy output monitoring: scan all LLM responses for PII or secrets",
      "Enable append-only audit logs for all AI inference and data access",
      "Maintain AI incident response playbook — who owns a compromised model?",
      "Run tabletop exercises simulating AI model compromise quarterly",
    ],
  },
]

const FAQ = [
  {
    q: "What does Zero Trust mean for AI systems?",
    a: "Zero Trust for AI means applying the principle 'never trust, always verify' to every component of an AI system: models, agents, data pipelines, and users. Traditional perimeter-based security fails for AI because models are distributed, fine-tuned across environments, and accessed via APIs from many services. Zero Trust requires: 1) Workload identity for every AI service (SPIFFE/mTLS). 2) Micro-segmentation isolating training from inference. 3) Continuous verification of every API call. 4) Least privilege for AI agents and data access. 5) Assume-breach posture with output monitoring and canary tokens.",
  },
  {
    q: "How do I implement Zero Trust for an LLM API?",
    a: "For an LLM API: 1) Deploy behind an API gateway with mTLS client authentication. 2) Issue JWT tokens with short expiry (15 min max) per calling service. 3) Enforce scoped permissions: each caller can only access specific model endpoints. 4) Rate-limit per identity, not per IP. 5) Log every inference request with caller identity, prompt hash, and response latency. 6) Deploy a prompt firewall (input validation + output filtering) as a sidecar. 7) Segment the model serving infrastructure: no direct internet access, egress allowlist only.",
  },
  {
    q: "What are the biggest Zero Trust gaps in typical AI deployments?",
    a: "The most common Zero Trust failures in AI deployments: 1) Shared service accounts — multiple AI components using one credential. 2) No workload identity — services trust each other by IP address. 3) Overly permissive data access — LLM can read entire databases instead of scoped views. 4) No output monitoring — LLM responses never scanned for data leakage. 5) Training environments reachable from production. 6) Jupyter notebooks with production credentials in shared environments. 7) No egress controls — AI agents can make arbitrary outbound HTTP requests.",
  },
  {
    q: "Does Zero Trust apply to AI agents and multi-agent systems?",
    a: "Yes — and it's more critical for agents than for static models. AI agents make decisions autonomously, can call tools, and may spawn sub-agents. Zero Trust for multi-agent systems requires: 1) Each agent has its own workload identity — no shared tokens. 2) Agent-to-agent communication requires authentication. 3) Tool access is explicitly scoped per agent. 4) Orchestrators cannot grant agents more permissions than they themselves have. 5) Human-in-the-loop checkpoints for high-risk actions. 6) Full audit trail of all agent decisions and tool calls.",
  },
]

const howToLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Implement Zero Trust Architecture for AI Systems",
  description: "Step-by-step guide to applying Zero Trust principles to AI infrastructure, LLMs, and agentic systems.",
  step: [
    { "@type": "HowToStep", position: 1, name: "Establish Workload Identity", text: "Deploy SPIFFE/SPIRE or mTLS certificates for every AI service and agent." },
    { "@type": "HowToStep", position: 2, name: "Micro-Segment AI Networks", text: "Isolate training, inference, and data pipeline environments with NetworkPolicy rules." },
    { "@type": "HowToStep", position: 3, name: "Apply Least Privilege", text: "Scope all AI agent permissions, tool access, and data views to the minimum required." },
    { "@type": "HowToStep", position: 4, name: "Enable Continuous Verification", text: "Re-authenticate every API call; monitor output distributions for anomalies." },
    { "@type": "HowToStep", position: 5, name: "Assume Breach Controls", text: "Deploy output scanning, canary tokens, append-only audit logs, and incident playbooks." },
  ],
}

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
}

const colorMap: Record<string, string> = {
  blue: "bg-blue-900 border-blue-700 text-blue-300",
  purple: "bg-purple-900 border-purple-700 text-purple-300",
  green: "bg-green-900 border-green-700 text-green-300",
  orange: "bg-orange-900 border-orange-700 text-orange-300",
  red: "bg-red-900 border-red-700 text-red-300",
}

export default function ZeroTrustAiArchitecturePage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <div className="max-w-5xl mx-auto px-4 py-16">
        <nav className="text-sm text-gray-500 mb-8">
          <a href={`/${locale}`} className="hover:text-cyan-400">ClawGuru</a>
          <span className="mx-2">/</span>
          <a href={`/${locale}/solutions`} className="hover:text-cyan-400">Solutions</a>
          <span className="mx-2">/</span>
          <span className="text-gray-300">Zero Trust AI Architecture</span>
        </nav>

        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: This guide is for hardening your own AI infrastructure. No attack tools.
        </div>

        <h1 className="text-4xl font-bold mb-4 text-gray-100">
          {pick(isDE, "Zero Trust für KI-Architekturen 2026", "Zero Trust AI Architecture 2026")}
        </h1>
        <p className="text-lg text-gray-300 mb-10">
          {pick(isDE, "Klassische Perimeter-Sicherheit versagt bei KI-Systemen. Modelle werden verteilt trainiert, über APIs exponiert und von Dutzenden Services aufgerufen. Zero Trust ist der einzige Ansatz, der funktioniert: jede Anfrage verifizieren, minimale Rechte erzwingen, Breach voraussetzen.", "Classic perimeter security fails for AI systems. Models are trained across distributed environments, exposed via APIs, and called by dozens of services. Zero Trust is the only approach that works: verify every request, enforce minimum privileges, assume breach.")}
        </p>

        {PILLARS.map((pillar) => {
          const colorClass = colorMap[pillar.color] || "bg-gray-800 border-gray-700 text-gray-300"
          return (
            <section key={pillar.id} className="mb-8">
              <div className={`bg-gray-800 p-6 rounded-lg border border-gray-700`}>
                <div className={`inline-block px-3 py-1 rounded text-xs font-bold mb-3 border ${colorClass}`}>
                  {pillar.id}
                </div>
                <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pillar.name}</h2>
                <ul className="space-y-2">
                  {pillar.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="text-cyan-400 mt-0.5 flex-shrink-0">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )
        })}

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {pick(isDE, "Häufige Fragen", "Frequently Asked Questions")}
          </h2>
          <div className="space-y-4">
            {FAQ.map((entry, i) => (
              <details key={i} className="bg-gray-800 rounded-lg border border-gray-700">
                <summary className="px-5 py-4 cursor-pointer font-bold text-gray-200 list-none flex items-center justify-between">
                  <span>{entry.q}</span>
                  <span className="text-gray-500 text-xs">▼</span>
                </summary>
                <div className="px-5 pb-4 text-gray-400 text-sm leading-relaxed">{entry.a}</div>
              </details>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {pick(isDE, "Weiterführende Ressourcen", "Further Resources")}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <a href={`/${locale}/moltbot/ai-agent-sandboxing`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Sandboxing</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Runtime-Isolation für KI-Agenten", "Runtime isolation for AI agents")}</div>
            </a>
            <a href={`/${locale}/moltbot/llm-gateway-hardening`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Gateway Hardening</div>
              <div className="text-sm text-gray-300">{pick(isDE, "API-Gateway-Absicherung für LLMs", "API gateway security for LLMs")}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-rbac`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent RBAC</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Rollenbasierte Zugriffskontrolle", "Role-based access control for agents")}</div>
            </a>
            <a href={`/${locale}/check`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{pick(isDE, "Security Check starten", "Start Security Check")}</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Deine AI-Infrastruktur in 30 Sekunden prüfen", "Check your AI infrastructure in 30 seconds")}</div>
            </a>
          </div>
        </section>

        <div className="bg-cyan-900 border border-cyan-700 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-cyan-300 mb-2">
            {pick(isDE, "Zero Trust für deine AI-Infrastruktur umsetzen?", "Ready to implement Zero Trust for your AI?")}
          </h2>
          <p className="text-gray-300 mb-4 text-sm">
            {pick(isDE, "ClawGuru analysiert deine Architektur und generiert einen Zero-Trust-Runbook für dein Setup.", "ClawGuru analyzes your architecture and generates a Zero Trust runbook for your setup.")}
          </p>
          <a href={`/${locale}/check`} className="inline-block bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-6 py-3 rounded-lg transition-colors">
            {pick(isDE, "🛡️ Kostenloser Security Check", "🛡️ Free Security Check")}
          </a>
        </div>
      </div>
    </div>
  )
}
