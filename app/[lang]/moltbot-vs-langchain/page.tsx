import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from '@/lib/i18n'

const SITE_URL = 'https://clawguru.org'

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const { lang } = params
  return {
    title: 'Moltbot vs LangChain 2026: Security Automation vs AI Framework | ClawGuru',
    description: 'Moltbot vs LangChain: Executable security runbooks vs AI orchestration framework. Compare security posture, compliance, self-hosting, and incident response for self-hosted AI agent stacks.',
    keywords: [
      'moltbot vs langchain', 'langchain alternative', 'ai agent security', 'langchain security',
      'moltbot security automation', 'langchain self-hosted', 'ai framework comparison 2026',
    ],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: {
      title: 'Moltbot vs LangChain 2026: Security Automation vs AI Framework',
      description: 'When you need security-first AI agent orchestration — not just a flexible Python framework.',
      type: 'article',
      url: `${SITE_URL}/${lang}/moltbot-vs-langchain`,
      images: ['/og-image.png'],
    },
    alternates: buildLocalizedAlternates(lang as Locale, '/moltbot-vs-langchain'),
    robots: 'index, follow',
  }
}

export default function MoltbotVsLangchainPage({ params }: { params: { lang: string } }) {
  const { lang } = params
  if (!SUPPORTED_LOCALES.includes(lang as Locale)) notFound()

  const rows = [
    { feature: 'Primary purpose', moltbot: 'Security automation + executable runbook engine', langchain: 'General-purpose LLM/AI agent orchestration framework' },
    { feature: 'Security-first design', moltbot: '✅ Built ground-up for security operations', langchain: '⚠️ Security is user responsibility — framework is neutral' },
    { feature: 'OWASP LLM Top 10 coverage', moltbot: '✅ All 10 risks addressed in dedicated runbooks', langchain: '⚠️ No built-in mitigations — manual implementation required' },
    { feature: 'Deployment', moltbot: 'Self-hosted or ClawGuru SaaS (GDPR-compliant)', langchain: 'Self-hosted Python (no managed hosting)' },
    { feature: 'Prompt injection protection', moltbot: '✅ Input scanner, structural separation, sandboxing', langchain: '⚠️ Community plugins only — no hardened default' },
    { feature: 'Agent sandboxing', moltbot: '✅ Docker isolation, --cap-drop=ALL, timeout enforcement', langchain: '❌ No built-in sandbox — tools run as host process' },
    { feature: 'Audit logging', moltbot: '✅ Structured JSON log of all inputs/outputs/actions', langchain: '⚠️ Callback system available but not enforced' },
    { feature: 'Rate limiting', moltbot: '✅ LLM gateway rate limiting built-in', langchain: '❌ No built-in rate limiting — API cost control is user concern' },
    { feature: 'Security runbooks', moltbot: '600+ pre-built, one-click remediation', langchain: 'No runbooks — code-level chains only' },
    { feature: 'Compliance templates', moltbot: 'NIS2, SOC2, GDPR, EU AI Act built-in', langchain: 'None — DIY compliance logic' },
    { feature: 'CVE awareness', moltbot: '✅ Live CVE feed integrated into Stack MRI scoring', langchain: '❌ No CVE or vulnerability database' },
    { feature: 'Setup time', moltbot: '< 30 min to first security score', langchain: 'Hours to days (Python env, chain configuration, tool wiring)' },
    { feature: 'Language', moltbot: 'Web UI + API (language-agnostic)', langchain: 'Python-first (JS port available, lags behind)' },
    { feature: 'Community / ecosystem', moltbot: 'Growing security-focused community', langchain: 'Massive ecosystem (10k+ GitHub stars, extensive tooling)' },
  ]

  const whenMoltbot = [
    'You need security outcomes — not just LLM orchestration flexibility',
    'Your agents must be GDPR / EU AI Act compliant out of the box',
    'You run self-hosted AI (Ollama, LocalAI) and need a hardened gateway',
    'You want prompt injection protection without writing custom middleware',
    'Incident response automation is a core requirement',
    'Your team is ops/security-focused, not ML-engineering-focused',
  ]

  const whenLangchain = [
    'You need maximum flexibility to wire custom LLMs, tools and memory backends',
    'Your team is Python-native and wants to build bespoke AI agent architectures',
    'You are prototyping or running research experiments',
    'You need access to the massive LangChain tool/plugin ecosystem',
    'You have in-house ML engineers who will implement security controls themselves',
  ]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'Is LangChain secure for production AI agents?', acceptedAnswer: { '@type': 'Answer', text: 'LangChain is a flexible framework with no built-in security hardening. For production, you must add: prompt injection detection, agent sandboxing (LangChain tools run as the host process by default), audit logging via callbacks, rate limiting on LLM calls, and output validation. Moltbot provides all of these pre-built.' } },
      { '@type': 'Question', name: 'Can Moltbot replace LangChain?', acceptedAnswer: { '@type': 'Answer', text: 'Moltbot and LangChain solve different problems. LangChain is an AI orchestration framework for building custom agent pipelines. Moltbot is a security automation platform with executable runbooks. Many teams use LangChain to build agents and Moltbot to secure and monitor them.' } },
      { '@type': 'Question', name: 'How do I secure a LangChain agent?', acceptedAnswer: { '@type': 'Answer', text: 'Key steps: 1) Add input validation before LLM calls to detect injection patterns. 2) Run agent tool execution in a Docker sandbox (--cap-drop=ALL, --read-only, --network=none). 3) Use LangChain callbacks for structured audit logging. 4) Add rate limiting on your LLM gateway (e.g. Ollama behind nginx). 5) Validate and filter all tool outputs before acting on them.' } },
      { '@type': 'Question', name: 'What is the OWASP LLM Top 10 and does LangChain address it?', acceptedAnswer: { '@type': 'Answer', text: 'OWASP LLM Top 10 lists the 10 most critical security risks for LLM-based applications (LLM01 Prompt Injection through LLM10 Model Theft). LangChain does not address any of these by default — they must be implemented by the developer. Moltbot provides dedicated runbooks for each risk with automated remediation.' } },
    ],
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: This comparison is for hardening your own AI systems. No attack tools.
        </div>

        <div className="mb-3">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Compare · Moltbot vs LangChain</span>
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">Moltbot vs LangChain 2026</h1>
        <p className="text-lg text-gray-300 mb-8">
          LangChain is the most popular Python framework for building LLM agents. Moltbot is the security-first execution engine for hardening and monitoring them. One builds AI agents — the other makes them production-safe.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { value: 'LLM10', label: 'OWASP risks — Moltbot covered' },
            { value: 'LLM0', label: 'OWASP risks — LangChain built-in' },
            { value: '600+', label: 'Security runbooks in Moltbot' },
            { value: '0', label: 'Security runbooks in LangChain' },
          ].map((s) => (
            <div key={s.label} className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-center">
              <div className="text-2xl font-black text-cyan-400">{s.value}</div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Direct Comparison</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Feature</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cyan-400 uppercase">Moltbot</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">LangChain</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.feature} className={`border-b border-gray-700 ${i % 2 === 1 ? 'bg-gray-800/50' : ''}`}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-300">{r.feature}</td>
                    <td className="px-6 py-4 text-sm text-cyan-300">{r.moltbot}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">{r.langchain}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Which Tool When?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-900 p-5 rounded-lg border border-green-700">
              <h3 className="font-bold text-green-300 mb-3">Choose Moltbot if…</h3>
              <ul className="space-y-2 text-sm text-green-200">
                {whenMoltbot.map((item) => <li key={item}>✓ {item}</li>)}
              </ul>
            </div>
            <div className="bg-blue-900 p-5 rounded-lg border border-blue-700">
              <h3 className="font-bold text-blue-300 mb-3">Choose LangChain if…</h3>
              <ul className="space-y-2 text-sm text-blue-200">
                {whenLangchain.map((item) => <li key={item}>✓ {item}</li>)}
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">The Security Gap: What LangChain Doesn't Provide</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <p className="text-gray-300 mb-4">LangChain tools execute with the permissions of the host process. A malicious prompt can instruct a LangChain tool to read <code className="text-cyan-400 bg-gray-900 px-1 rounded">~/.ssh/id_rsa</code>, exfiltrate environment variables, or trigger arbitrary shell commands — with no sandbox protection.</p>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
              <pre>{`# LangChain default — agent tools run as host process:
tool = ShellTool()  # executes arbitrary commands as current user
agent = initialize_agent([tool], llm, ...)  # no sandboxing

# Moltbot approach — every agent run in isolated container:
# docker run --read-only --cap-drop=ALL --network=none
#            --user=65534 --memory=512m
#            --pids-limit=100 timeout 30 agent-runner`}</pre>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Using Moltbot to Secure LangChain Agents</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <p className="text-gray-300 mb-4">The best production setup combines both: LangChain for agent orchestration, Moltbot for security automation and monitoring.</p>
            <div className="space-y-3 mt-4">
              {[
                { step: '1', title: 'Add injection scanner', desc: 'Run all user inputs through Moltbot\'s prompt injection detection API before passing to LangChain.' },
                { step: '2', title: 'Sandbox tool execution', desc: 'Wrap LangChain tool calls in Docker containers with --cap-drop=ALL, --read-only, and timeout enforcement.' },
                { step: '3', title: 'Log via Moltbot callback', desc: 'Implement a LangChain callback that ships all chain events to Moltbot\'s structured audit log.' },
                { step: '4', title: 'Gate through LLM gateway', desc: 'Route all LangChain LLM calls through the Moltbot-hardened gateway for rate limiting and auth.' },
              ].map((s) => (
                <div key={s.step} className="flex items-start gap-4">
                  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">{s.step}</div>
                  <div>
                    <div className="font-semibold text-gray-100">{s.title}</div>
                    <div className="text-sm text-gray-300">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Further Resources</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href={`/${lang}/moltbot/ai-agent-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Security Guide</div>
              <div className="text-sm text-gray-300">OWASP LLM Top 10 defense playbook</div>
            </a>
            <a href={`/${lang}/moltbot/prompt-injection-defense`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Prompt Injection Defense</div>
              <div className="text-sm text-gray-300">LLM01 mitigation with code examples</div>
            </a>
            <a href={`/${lang}/moltbot/ai-agent-sandboxing`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Sandboxing</div>
              <div className="text-sm text-gray-300">Docker isolation for LangChain tools</div>
            </a>
            <a href={`/${lang}/moltbot-vs-autogpt`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Moltbot vs AutoGPT</div>
              <div className="text-sm text-gray-300">Security automation vs autonomous agent</div>
            </a>
          </div>
        </section>

      </div>
    </div>
  )
}
