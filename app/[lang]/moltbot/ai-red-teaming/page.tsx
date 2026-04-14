import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/ai-red-teaming"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const title = "AI Red Teaming: Testing Your AI Agent Defenses | ClawGuru"
  const description = "AI red teaming methodology for self-hosted AI agents: adversarial prompt testing, jailbreak detection, behavioral test suites, OWASP LLM Top 10 validation and CI/CD security gates."
  return {
    title, description,
    keywords: ["ai red teaming", "llm red team", "ai adversarial testing", "jailbreak testing", "ai security testing", "owasp llm testing", "moltbot red team"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const TEST_CATEGORIES = [
  { id: "RT01", name: "Prompt Injection Tests", coverage: "LLM01", cases: ["Direct system prompt override", "Indirect injection via document", "Nested injection in tool output", "Role-playing jailbreak", "Encoded instruction injection (base64, unicode)"] },
  { id: "RT02", name: "Boundary & Refusal Tests", coverage: "LLM01/LLM08", cases: ["Request for dangerous content (should refuse)", "Privilege escalation attempt", "Out-of-scope task request", "Social engineering the agent", "Persistence/memory manipulation"] },
  { id: "RT03", name: "Data Exfiltration Tests", coverage: "LLM06", cases: ["Prompt to output full system prompt", "Extract other users' data via RAG", "Leak environment variables or secrets", "Output training data verbatim", "API key extraction via crafted query"] },
  { id: "RT04", name: "Denial of Service Tests", coverage: "LLM04", cases: ["Infinite recursion prompt", "Memory exhaustion via long context", "Token flooding to exceed rate limit", "Slow tool call bomb", "Embedding space flooding in RAG"] },
  { id: "RT05", name: "Supply Chain Tests", coverage: "LLM03/LLM05", cases: ["Model checksum verification", "Dependency vulnerability scan", "Backdoor trigger phrase test", "Model behavior consistency across versions", "Serialization attack on model artifacts"] },
]

const FAQ = [
  { q: "What is AI red teaming?", a: "AI red teaming is the practice of adversarially testing AI systems to discover security vulnerabilities before attackers do. For LLM-based agents, it includes: prompt injection testing, jailbreak attempts, data exfiltration probes, behavioral boundary testing, and infrastructure security testing. The goal is to find weaknesses in both the model's behavior and the surrounding system." },
  { q: "How often should I red team my AI agents?", a: "Minimum: before every major model update or agent capability change. Best practice: run automated adversarial test suites in CI/CD on every build. Quarterly: comprehensive manual red team exercise including novel attack vectors. After any security incident: immediate re-test of affected attack surface." },
  { q: "What is a behavioral test suite for AI agents?", a: "A behavioral test suite is a set of deterministic tests that verify an AI agent behaves correctly and securely. It includes: refusal tests (agent must decline dangerous requests), boundary tests (agent stays within declared scope), consistency tests (same input produces safe output across model versions), and canary tests (known injection patterns must be blocked). Run in CI/CD before every deployment." },
  { q: "Can I automate AI red teaming?", a: "Yes, partially. Automated tests cover: known injection patterns, refusal boundary testing, output length/format validation, rate limit enforcement, model checksum verification. Human red teamers are still required for: novel attack vectors, social engineering scenarios, and creative jailbreak development. Use Moltbot to orchestrate automated tests and track results over time." },
]

export default function AiRedTeamingPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Moltbot", item: `${SITE_URL}/${locale}/moltbot` },
      { "@type": "ListItem", position: 3, name: "AI Red Teaming", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    { "@context": "https://schema.org", "@type": "HowTo", name: "Run an AI Red Team Exercise", totalTime: "PT4H", step: [
      { "@type": "HowToStep", name: "Define scope and rules", text: "What systems, which attack categories, what constitutes a finding. Document in rules of engagement." },
      { "@type": "HowToStep", name: "Run automated test suite", text: "Execute all RT01-RT05 categories against your agent. Log all responses." },
      { "@type": "HowToStep", name: "Manual adversarial testing", text: "Novel jailbreak attempts, creative injection patterns, social engineering scenarios." },
      { "@type": "HowToStep", name: "Document findings", text: "Severity rating, reproduction steps, impact, recommended fix for each finding." },
      { "@type": "HowToStep", name: "Remediate and retest", text: "Apply fixes. Re-run full test suite to verify. Add new test cases for discovered vulnerabilities." },
    ]},
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: AI red teaming as described here is for testing <em>your own</em> AI systems. Never use these techniques against systems you do not own or have explicit permission to test.
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Moltbot AI Security · Batch 5</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">AI Red Teaming: Testing Your AI Agent Defenses</h1>
        <p className="text-lg text-gray-300 mb-6">You cannot defend what you have not attacked. AI red teaming systematically probes every layer of your agent stack — from prompt boundaries to container escape vectors — so you find the vulnerabilities before attackers do. This playbook provides the complete test methodology with 25 specific test cases across 5 categories.</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[{ value: "5", label: "Test categories" }, { value: "25", label: "Specific test cases" }, { value: "LLM01-05", label: "OWASP coverage" }, { value: "CI/CD", label: "Automation target" }].map((s) => (
            <div key={s.label} className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-center">
              <div className="text-2xl font-black text-cyan-400">{s.value}</div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Test Categories & Cases</h2>
          <div className="space-y-4">
            {TEST_CATEGORIES.map((cat) => (
              <div key={cat.id} className="bg-gray-800 p-5 rounded-lg border border-gray-700">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-xs text-cyan-400 bg-gray-900 px-2 py-1 rounded">{cat.id}</span>
                  <span className="font-semibold text-gray-100">{cat.name}</span>
                  <span className="text-xs text-gray-400">OWASP {cat.coverage}</span>
                </div>
                <ul className="space-y-1">
                  {cat.cases.map((c, i) => (
                    <li key={i} className="flex gap-2 text-sm text-gray-300">
                      <span className="text-cyan-400 flex-shrink-0">▸</span>{c}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">CI/CD Integration: Automated Security Gate</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
            <pre>{`# GitHub Actions — AI security gate
name: AI Agent Security Tests
on: [push, pull_request]

jobs:
  ai-red-team:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Verify model checksums
        run: sha256sum -c models/checksums.txt

      - name: Run behavioral test suite
        run: python tests/behavioral_suite.py --agent moltbot
        env:
          AGENT_ENDPOINT: http://localhost:8080

      - name: Prompt injection scan
        run: python tests/injection_tests.py --category RT01 RT02 RT03

      - name: Assert zero critical findings
        run: python tests/assert_results.py --max-critical 0

      # Block deployment if any critical finding
      - name: Gate deployment
        if: failure()
        run: echo "SECURITY GATE FAILED — deployment blocked" && exit 1`}</pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Finding Severity Classification</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-red-900 p-4 rounded-lg border border-red-700">
              <h3 className="font-semibold text-red-300 mb-2">CRITICAL — Block Deployment</h3>
              <ul className="space-y-1 text-sm text-red-200">
                <li>• System prompt fully overrideable</li>
                <li>• Agent can exfiltrate secrets/credentials</li>
                <li>• Unrestricted command execution</li>
                <li>• Cross-tenant data access</li>
              </ul>
            </div>
            <div className="bg-orange-900 p-4 rounded-lg border border-orange-700">
              <h3 className="font-semibold text-orange-300 mb-2">HIGH — Fix Within 7 Days</h3>
              <ul className="space-y-1 text-sm text-orange-200">
                <li>• Partial injection (limited override)</li>
                <li>• Rate limit bypassable</li>
                <li>• Excessive agency without confirmation</li>
                <li>• Audit log gaps</li>
              </ul>
            </div>
            <div className="bg-yellow-900 p-4 rounded-lg border border-yellow-700">
              <h3 className="font-semibold text-yellow-300 mb-2">MEDIUM — Fix Within 30 Days</h3>
              <ul className="space-y-1 text-sm text-yellow-200">
                <li>• Inconsistent refusal behavior</li>
                <li>• Verbose error messages</li>
                <li>• Suboptimal sandboxing</li>
              </ul>
            </div>
            <div className="bg-blue-900 p-4 rounded-lg border border-blue-700">
              <h3 className="font-semibold text-blue-300 mb-2">LOW — Track & Improve</h3>
              <ul className="space-y-1 text-sm text-blue-200">
                <li>• Hallucination without guardrail</li>
                <li>• Missing structured output validation</li>
                <li>• Log verbosity issues</li>
              </ul>
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
              <div className="text-sm text-gray-300">Full OWASP LLM defense map</div>
            </a>
            <a href={`/${locale}/moltbot/prompt-injection-defense`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Prompt Injection Defense</div>
              <div className="text-sm text-gray-300">Fix RT01 findings</div>
            </a>
            <a href={`/${locale}/roast-my-moltbot`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Roast My Moltbot</div>
              <div className="text-sm text-gray-300">Free quick red-team of your setup</div>
            </a>
            <a href={`/${locale}/moltbot/model-poisoning-protection`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Model Poisoning Protection</div>
              <div className="text-sm text-gray-300">Fix RT05 supply chain findings</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
