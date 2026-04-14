import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot-vs-autogen"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const title = "Moltbot vs AutoGen: Security Comparison for Multi-Agent AI | ClawGuru"
  const description = "Moltbot vs Microsoft AutoGen: security comparison for multi-agent AI conversations. AutoGen's code execution model creates unique attack surface — full hardening guide for production deployments."
  return {
    title, description,
    keywords: ["moltbot vs autogen", "autogen security", "microsoft autogen hardening", "autogen code execution security", "multi agent conversation security", "autogen self-hosted"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const COMPARISON = [
  { feature: "Primary Purpose", moltbot: "Security-first AI agent orchestration", autogen: "Conversational multi-agent AI with code execution" },
  { feature: "Code Execution Security", moltbot: "Sandboxed execution, capability-scoped, HITL required", autogen: "Code runs in local Python environment by default — no sandbox" },
  { feature: "Prompt Injection Defense", moltbot: "Built-in input validation + cross-agent injection detection", autogen: "None built-in — agent messages not sanitized" },
  { feature: "Agent Authentication", moltbot: "mTLS + signed capability tokens per message", autogen: "No authentication between conversing agents" },
  { feature: "Tool/Function Security", moltbot: "Per-agent tool allowlist, scope tokens, audit trail", autogen: "Functions available to all agents — no per-agent scoping" },
  { feature: "Human-in-the-Loop", moltbot: "Configurable HITL thresholds, mandatory for destructive ops", autogen: "Human proxy agent available but opt-in" },
  { feature: "Audit Logging", moltbot: "Structured JSON, full agent conversation trace with hashes", autogen: "Console output / custom logger — no structured audit trail" },
  { feature: "Docker Isolation", moltbot: "Built-in per-agent container isolation", autogen: "DockerCommandLineCodeExecutor available but not default" },
  { feature: "GDPR / Data Residency", moltbot: "Self-hosted, no external calls required", autogen: "LLM provider dependency — data may leave your infra" },
  { feature: "Production Readiness", moltbot: "Production-hardened", autogen: "v0.4+ improving but primarily research-oriented" },
]

const FAQ = [
  { q: "What makes AutoGen's security model unique compared to CrewAI or LangChain?", a: "AutoGen's key differentiator — and its biggest security risk — is direct code execution. AutoGen agents can write and execute Python/shell code as part of conversations. By default this code runs in the local Python environment with full access to the host system. This means a prompt injection attack doesn't just manipulate an LLM response — it can result in arbitrary code execution on your server. This is a fundamentally higher-risk attack surface than other frameworks." },
  { q: "How do I secure AutoGen code execution in production?", a: "Never use LocalCommandLineCodeExecutor in production. Use DockerCommandLineCodeExecutor instead: executor = DockerCommandLineCodeExecutor(image='python:3.11-slim', timeout=60, work_dir=tmpdir). Additionally: run the Docker container with --cap-drop=ALL --network=none --read-only. Review all code before execution with a human proxy agent. Add output validation to prevent data exfiltration via code output. Set strict timeouts. Never allow agents to execute code that touches your production database or file systems." },
  { q: "Can Moltbot wrap AutoGen for production security?", a: "Yes — the recommended production pattern: 1) Moltbot acts as the outer orchestrator handling auth, logging, and access control. 2) AutoGen agents run inside Moltbot-managed Docker containers with capability-scoped access. 3) All agent-to-agent messages pass through Moltbot's injection detection layer before delivery. 4) Code execution requests trigger Moltbot's HITL workflow for human approval above a risk threshold. AutoGen's powerful conversational capabilities are preserved; Moltbot adds the security envelope." },
  { q: "Is AutoGen v0.4+ more secure than earlier versions?", a: "AutoGen v0.4 (late 2024) introduced a significant architectural rewrite with better modularity. The new architecture improves separation of concerns and makes security wrappers easier to implement. However, the core security gaps remain: no built-in sandbox by default, no agent authentication, no structured audit logging, no prompt injection defense. The v0.4 API is cleaner to secure programmatically, but security is still the developer's responsibility." },
]

export default function MoltbotVsAutogenPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Moltbot vs AutoGen", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">

        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: Security hardening guide for your own AI agent deployments only.
        </div>

        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Compare · Batch 9</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">Moltbot vs AutoGen: Security Comparison</h1>
        <p className="text-lg text-gray-300 mb-6">
          AutoGen is the only major agent framework where agents can write and execute code as part of their workflow. This makes it uniquely powerful — and uniquely dangerous. This comparison maps every security gap in AutoGen's default setup and shows exactly what a hardened production deployment requires.
        </p>

        <div className="bg-red-900 border border-red-700 p-4 rounded-lg mb-8">
          <h3 className="font-bold text-red-300 mb-2">⚠ AutoGen-Specific Risk: Code Execution</h3>
          <p className="text-sm text-red-200">AutoGen agents can execute arbitrary code by default. A single successful prompt injection → direct code execution on your server. This is not a theoretical risk — it is the intended functionality, used maliciously. Never run AutoGen with <code className="bg-red-800 px-1 rounded">LocalCommandLineCodeExecutor</code> in production.</p>
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Feature Comparison</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Feature</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-cyan-400 uppercase">Moltbot</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">AutoGen</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={row.feature} className={`border-b border-gray-700 ${i % 2 === 1 ? "bg-gray-800/50" : ""}`}>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-100">{row.feature}</td>
                    <td className="px-4 py-3 text-sm text-green-300">{row.moltbot}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{row.autogen}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Hardening AutoGen for Production</h2>
          <div className="space-y-3">
            {[
              { step: "1", t: "Replace LocalCommandLineCodeExecutor with DockerCommandLineCodeExecutor", d: "from autogen.coding import DockerCommandLineCodeExecutor\nexecutor = DockerCommandLineCodeExecutor(\n  image=\"python:3.11-slim\",\n  timeout=60,\n  work_dir=tmp_dir,\n)\n# Then run container with: --cap-drop=ALL --network=none --read-only" },
              { step: "2", t: "Add Human Proxy with approval threshold", d: "human_proxy = UserProxyAgent(\n  name=\"human_proxy\",\n  human_input_mode=\"ALWAYS\",   # Require approval for ALL code\n  # Or: \"TERMINATE\" to only approve final result\n  code_execution_config={\"executor\": secure_executor},\n)" },
              { step: "3", t: "Wrap with Moltbot injection detection", d: "# All messages pass through Moltbot before delivery to agents\nmoltbot.intercept_messages(\n  source=autogen_agents,\n  injection_scan=True,\n  pii_masking=True,\n  audit_log=structured_logger,\n)" },
              { step: "4", t: "Restrict agent capabilities to minimum scope", d: "# AutoGen AssistantAgent — restrict what tools it can use\nassistant = AssistantAgent(\n  name=\"analyst\",\n  system_message=\"You are a data analyst. Never execute OS commands. Only use pandas and numpy.\",\n  # Add Moltbot capability token to restrict beyond system message\n  capability_token=moltbot.sign_token(scope=[\"read:data\", \"compute:stats\"]),\n)" },
              { step: "5", t: "Structured audit logging for all conversations", d: "import structlog\nlog = structlog.get_logger()\n\n# Wrap AutoGen initiate_chat\noriginal_chat = user_proxy.initiate_chat\ndef audited_chat(*args, **kwargs):\n  log.info(\"autogen_chat_start\", agents=[a.name for a in args], task_hash=hash(kwargs.get(\"message\", \"\")))\n  result = original_chat(*args, **kwargs)\n  log.info(\"autogen_chat_end\", cost=result.cost, code_executed=bool(result.summary))\n  return result" },
            ].map((s) => (
              <div key={s.step} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-700">
                  <div className="bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold flex-shrink-0">{s.step}</div>
                  <div className="font-semibold text-gray-100">{s.t}</div>
                </div>
                <div className="bg-gray-900 text-green-400 p-4 font-mono text-xs overflow-x-auto"><pre>{s.d}</pre></div>
              </div>
            ))}
          </div>
        </section>

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

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Further Resources</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href={`/${locale}/moltbot/ai-agent-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Security Hub</div>
              <div className="text-sm text-gray-300">OWASP LLM Top 10 defense map</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-sandboxing`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Sandboxing</div>
              <div className="text-sm text-gray-300">Docker isolation for code execution agents</div>
            </a>
            <a href={`/${locale}/moltbot-vs-crewai`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Moltbot vs CrewAI</div>
              <div className="text-sm text-gray-300">Multi-agent orchestration comparison</div>
            </a>
            <a href={`/${locale}/moltbot/prompt-injection-defense`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Prompt Injection Defense</div>
              <div className="text-sm text-gray-300">Block code injection via prompt attacks</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
