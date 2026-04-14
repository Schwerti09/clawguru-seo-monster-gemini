import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/ai-tool-use-security"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const title = "AI Tool Use Security: Securing LLM Function Calling & Tool Invocation | ClawGuru"
  const description = "Secure AI agent tool use: function calling validation, tool scope restriction, output sanitization, dangerous tool prevention and human-in-the-loop for high-risk operations."
  return {
    title, description,
    keywords: ["ai tool use security", "llm function calling security", "ai agent tools", "function calling validation", "tool scope restriction", "moltbot tool security"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const TOOL_RISKS = [
  { tool: "Shell / Code Execution", risk: "CRITICAL", attack: "Prompt injection → arbitrary command execution on host", defense: "Run in --read-only container with --cap-drop=ALL. Allowlist permitted commands. 30s hard timeout. Never run as root." },
  { tool: "HTTP / Web Requests", risk: "HIGH", attack: "SSRF → internal network access, metadata endpoint, cloud credentials", defense: "Allowlist permitted domains/IPs. Block RFC-1918 ranges and link-local (169.254.x.x). Validate URLs before fetch. Log all requests." },
  { tool: "File System Read", risk: "HIGH", attack: "Path traversal → read /etc/passwd, ~/.ssh/id_rsa, .env files", defense: "Restrict to declared workspace directory. Validate resolved path against workspace root. Block symlink traversal." },
  { tool: "File System Write", risk: "CRITICAL", attack: "Overwrite config files, inject malicious code, modify agent behavior", defense: "Require human confirmation for all writes. Scope to temp directory only. Audit all write operations." },
  { tool: "Database Queries", risk: "HIGH", attack: "SQL injection via LLM-generated queries, data exfiltration", defense: "Use parameterized queries only — never string-interpolated SQL. Read-only credentials for read operations. Scope to minimal required tables." },
  { tool: "Email / Notifications", risk: "HIGH", attack: "Data exfiltration via email, spam/phishing via LLM-drafted content", defense: "Require human approval for all external sends. Allowlist recipients. Content review before send. Rate limit: max 10 emails/hour." },
  { tool: "Calendar / Scheduling", risk: "MEDIUM", attack: "Unwanted calendar events, social engineering via agent-created meetings", defense: "Human-in-the-loop for all external calendar invites. Scope to own calendar only by default." },
]

const FAQ = [
  { q: "What is the biggest security risk of LLM function calling?", a: "Unscoped tool access combined with prompt injection. An LLM with access to a shell tool and no sandboxing can be prompted to execute arbitrary commands. The fix: every tool must have a declared scope, run in an isolated container, and dangerous tools (shell, file write, HTTP) require human confirmation or are restricted to an allowlist." },
  { q: "How do I implement human-in-the-loop for AI tool use?", a: "For high-risk tools: before execution, present the proposed tool call (tool name + parameters) to a human operator via a review interface. Only execute after explicit approval. Log: approver identity, approval timestamp, original LLM reasoning. Implement a timeout — if no approval within X minutes, cancel the action." },
  { q: "Can I trust tool outputs fed back to the LLM?", a: "Never unconditionally. Tool outputs can contain adversarial content (e.g., a web page with injected instructions). Sanitize all tool outputs before feeding back to the LLM: strip HTML, extract structured data only, apply the same injection detection as user inputs. Treat tool output as untrusted data, not as trusted system context." },
  { q: "How do I prevent SSRF via AI HTTP tools?", a: "1) Allowlist permitted domains — reject everything else. 2) Resolve the URL and check the IP is not RFC-1918 (10.x, 172.16.x, 192.168.x) or link-local (169.254.x.x). 3) Follow redirects but re-validate each redirect target. 4) Block metadata endpoints: 169.254.169.254 (AWS), metadata.google.internal. 5) Log all HTTP tool calls with URL, response code, response size." },
]

export default function AiToolUseSecurityPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Moltbot", item: `${SITE_URL}/${locale}/moltbot` },
      { "@type": "ListItem", position: 3, name: "AI Tool Use Security", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    { "@context": "https://schema.org", "@type": "HowTo", name: "Secure AI Agent Tool Use End-to-End", totalTime: "PT2H", step: [
      { "@type": "HowToStep", name: "Audit all registered tools", text: "List every tool the agent can call. Classify each by risk level. Remove any tool not strictly required." },
      { "@type": "HowToStep", name: "Apply principle of least tool", text: "Start with no tools. Add back only what the specific task requires. Scope each tool to minimum required parameters." },
      { "@type": "HowToStep", name: "Sandbox dangerous tools", text: "Shell/code tools: isolated container. HTTP tools: allowlisted domains only. File tools: scoped workspace directory." },
      { "@type": "HowToStep", name: "Add human-in-the-loop gates", text: "CRITICAL tools require human approval. Implement review UI with timeout. Log all approvals and rejections." },
      { "@type": "HowToStep", name: "Sanitize tool outputs", text: "All tool outputs treated as untrusted. Strip HTML, extract structured data, scan for injection patterns before feeding back to LLM." },
    ]},
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: This guide is for securing your own AI agent tools. No attack tools.
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Moltbot AI Security · Batch 5</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">AI Tool Use Security: Securing LLM Function Calling</h1>
        <p className="text-lg text-gray-300 mb-6">When an LLM can call tools — shell commands, HTTP requests, database queries, file writes — the attack surface explodes. A single prompt injection can pivot through an unsecured tool to the host, internal network, or sensitive data. This guide covers risk classification and concrete defenses for 7 common AI agent tool types.</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[{ value: "7", label: "Tool risk categories" }, { value: "2", label: "CRITICAL-risk tool types" }, { value: "HITL", label: "Required for write tools" }, { value: "0", label: "Trusted tool outputs" }].map((s) => (
            <div key={s.label} className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-center">
              <div className="text-2xl font-black text-cyan-400">{s.value}</div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Tool Risk Matrix</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Tool</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Risk</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Attack Vector</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Defense</th>
                </tr>
              </thead>
              <tbody>
                {TOOL_RISKS.map((t, i) => (
                  <tr key={t.tool} className={`border-b border-gray-700 ${i % 2 === 1 ? "bg-gray-800/50" : ""}`}>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-100">{t.tool}</td>
                    <td className="px-4 py-3"><span className={`text-xs font-bold px-2 py-1 rounded ${t.risk === "CRITICAL" ? "bg-red-900 text-red-300" : t.risk === "HIGH" ? "bg-orange-900 text-orange-300" : "bg-yellow-900 text-yellow-300"}`}>{t.risk}</span></td>
                    <td className="px-4 py-3 text-xs text-gray-400">{t.attack}</td>
                    <td className="px-4 py-3 text-xs text-green-300">{t.defense}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Principle of Least Tool</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <p className="text-gray-300 mb-4">Start with zero tools. Add back only what the specific task requires. A summarization agent needs no tools at all. A research agent needs HTTP read only. A coding agent needs file read + write in a scoped temp directory only.</p>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
              <pre>{`# BAD: register all tools "just in case"
agent = Agent(tools=[ShellTool(), FileTool(), HTTPTool(),
                     EmailTool(), DBTool(), CalendarTool()])

# GOOD: minimum required for the specific task
summarizer = Agent(tools=[])  # No tools needed
researcher = Agent(tools=[HTTPTool(allowlist=["arxiv.org", "pubmed.ncbi.nlm.nih.gov"])])
coder = Agent(tools=[
  FileTool(workspace="/tmp/agent-sandbox", mode="rw"),
  # Shell removed — use isolated subprocess instead
])`}</pre>
            </div>
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
              <div className="text-sm text-gray-300">OWASP LLM Top 10 — full defense map</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-sandboxing`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Sandboxing</div>
              <div className="text-sm text-gray-300">Container isolation for tool execution</div>
            </a>
            <a href={`/${locale}/moltbot/prompt-injection-defense`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Prompt Injection Defense</div>
              <div className="text-sm text-gray-300">Block injection before tool invocation</div>
            </a>
            <a href={`/${locale}/moltbot/ai-red-teaming`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Red Teaming</div>
              <div className="text-sm text-gray-300">Test your tool security defenses</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
