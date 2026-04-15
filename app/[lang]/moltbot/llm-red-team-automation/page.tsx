import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/llm-red-team-automation"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = isDE
    ? "LLM Red Team Automation: LLM-Red-Team-Automation | ClawGuru Moltbot"
    : "LLM Red Team Automation: LLM Red Team Automation | ClawGuru Moltbot"
  const description = isDE
    ? "LLM-Red-Team-Automation: Automated Prompt Attack, Jailbreak Testing, Adversarial Input Generation und Red Team Reporting für LLM-Red-Team-Automation."
    : "LLM red team automation: automated prompt attack, jailbreak testing, adversarial input generation and red team reporting for LLM red team automation."
  return {
    title, description,
    keywords: ["llm red team automation", "automated prompt attack", "jailbreak testing", "adversarial input generation", "red team reporting", "moltbot red team"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const CONTROLS = [
  { id: "RTA-1", title: "Automated Prompt Attack Framework", desc: "Run automated prompt attack campaigns against your LLM. Systematically test for vulnerabilities.", code: `# Moltbot automated prompt attack:
prompt_attack:
  enabled: true

  # Attack Categories:
  categories:
    - prompt_injection
    - jailbreaking
    - prompt_leakage
    - context_manipulation
    - role_switching
    - encoding_bypass
    - multi_turn_attacks

  # Attack Execution:
  execution:
    schedule: "0 2 * * *"  # Daily at 2 AM
    parallel_attacks: 10
    timeout_per_attack: 30s
    retry_on_failure: 3

  # Target Configuration:
  targets:
    - endpoint: /api/chat
      auth: bearer_token
      model: moltbot-prod
    - endpoint: /api/agent
      auth: api_key
      model: moltbot-agent` },
  { id: "RTA-2", title: "Jailbreak Testing Suite", desc: "Automated testing of known and novel jailbreak techniques. Measure jailbreak resistance.", code: `# Moltbot jailbreak testing:
jailbreak_testing:
  enabled: true

  # Known Jailbreaks:
  known:
    - DAN (Do Anything Now)
    - AIM (Always Intelligent and Machiavellian)
    - Developer Mode
    - Token manipulation
    - Base64 encoding bypasses
    - Roleplay jailbreaks
    - Multilingual bypasses

  # Novel Jailbreak Generation:
  novel:
    enabled: true
    # Method: LLM-assisted jailbreak generation
    # Generate: new attack variants
    # Mutate: existing jailbreaks
    # Test: against target model

  # Resistance Scoring:
  scoring:
    enabled: true
    # Score: jailbreak resistance 0-100
    # Benchmark: against previous run
    # Alert: on resistance decrease
    # Report: weekly trend` },
  { id: "RTA-3", title: "Adversarial Input Generation", desc: "Generate adversarial inputs to test LLM robustness. Automate edge case discovery.", code: `# Moltbot adversarial input generation:
adversarial_generation:
  enabled: true

  # Fuzzing:
  fuzzing:
    enabled: true
    # Method: random + guided mutation
    # Inputs: text, special chars, unicode
    # Length: boundary testing
    # Detect: crashes and unexpected behavior

  # Semantic Adversarial:
  semantic:
    enabled: true
    # Generate: semantically similar but dangerous inputs
    # Method: LLM-based rephrasing
    # Target: policy violations
    # Detect: bypasses

  # Cross-Language:
  cross_language:
    enabled: true
    # Test: attacks in multiple languages
    # Languages: DE, EN, FR, ES, ZH, AR
    # Detect: language-specific bypasses
    # Report: per-language resistance` },
  { id: "RTA-4", title: "Red Team Reporting", desc: "Automated red team reports with vulnerability findings and remediation guidance.", code: `# Moltbot red team reporting:
reporting:
  enabled: true

  # Findings Dashboard:
  dashboard:
    enabled: true
    # Display: current vulnerability status
    # Track: findings over time
    # Categorize: by severity and type
    # Integrate: with SIEM/ticketing

  # Automated Reports:
  reports:
    enabled: true
    # Schedule: weekly red team report
    # Include: new findings, trends, fixes
    # Recipients: security team, CTO
    # Format: PDF + JSON

  # Remediation Tracking:
  remediation:
    enabled: true
    # Create: ticket per finding
    # Assign: to responsible team
    # Track: remediation progress
    # Verify: fix effectiveness` },
]

const FAQ = [
  { q: "What is LLM red teaming and how is it different from traditional red teaming?", a: "LLM red teaming tests AI systems for security vulnerabilities: prompt injection, jailbreaking, harmful output generation, and privacy leakage. Traditional red teaming focuses on network, application, and infrastructure vulnerabilities. LLM red teaming differs because: 1) Attacks are linguistic, not technical. 2) Vulnerabilities are probabilistic — the same attack may succeed or fail on different runs. 3) New attack vectors are discovered constantly. 4) The attack surface changes with every model update. 5) Automation is essential — manual testing cannot cover the vast input space." },
  { q: "How often should I red team my LLM?", a: "Red team frequency recommendations: 1) Continuous automated testing — run daily automated attack suites (small scope, fast). 2) Weekly full automated sweep — comprehensive attack campaign. 3) Monthly human red team — creative attacks that automation misses. 4) After every model update — model updates can change behavior and introduce new vulnerabilities. 5) After significant prompt changes — new system prompts may introduce bypasses. For production LLMs handling sensitive data, continuous monitoring is the minimum." },
  { q: "What tools are available for LLM red team automation?", a: "Key tools for LLM red team automation: 1) Garak — open-source LLM vulnerability scanner with 50+ probes. 2) PyRIT (Microsoft) — Python Risk Identification Toolkit for AI. 3) PromptBench — adversarial robustness evaluation. 4) HarmBench — standardized evaluation for LLM safety. 5) LLM-Fuzzer — fuzzing LLMs for unexpected behavior. 6) Moltbot Red Team Module — built-in automated red teaming. For comprehensive coverage, combine multiple tools and supplement with manual testing." },
  { q: "How do I measure LLM red team results?", a: "Measure LLM red team results by: 1) Attack Success Rate (ASR) — percentage of attacks that succeeded. Target: <5% for production. 2) Jailbreak Resistance Score — 0-100 composite score. Target: >90. 3) Policy Violation Rate — percentage of outputs violating content policy. Target: 0%. 4) Prompt Leakage Rate — percentage of attacks that extracted system prompt. Target: 0%. 5) Time to Detection — how quickly the monitoring system detected the attack. Target: <5 seconds. Track all metrics over time to detect regressions after model or prompt updates." },
]

export default function LlmRedTeamAutomationPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Moltbot", item: `${SITE_URL}/${locale}/moltbot` },
      { "@type": "ListItem", position: 3, name: "LLM Red Team Automation", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE ? "Red-Team-Automation-Guide für eigene LLM-Systeme." : "Red team automation guide for your own LLM systems."}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Moltbot · Batch 28</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">{isDE ? "LLM Red Team Automation" : "LLM Red Team Automation"}</h1>
        <p className="text-lg text-gray-300 mb-6">
          {isDE
            ? "Manuelles Red Teaming kann den LLM-Input-Space nicht abdecken — Automatisierung ist Pflicht. Vier Kontrollen: Automated Prompt Attack Framework, Jailbreak Testing Suite, Adversarial Input Generation und Red Team Reporting."
            : "Manual red teaming cannot cover the LLM input space — automation is mandatory. Four controls: automated prompt attack framework, jailbreak testing suite, adversarial input generation and red team reporting."}
        </p>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "4 Red-Team-Automation-Kontrollen" : "4 Red Team Automation Controls"}</h2>
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
            <a href={`/${locale}/moltbot/llm-adversarial-robustness`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Adversarial Robustness</div>
              <div className="text-sm text-gray-300">{isDE ? "Robustness-Testing" : "Robustness testing"}</div>
            </a>
            <a href={`/${locale}/moltbot/llm-jailbreak-defense`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Jailbreak Defense</div>
              <div className="text-sm text-gray-300">{isDE ? "Jailbreak-Defense" : "Jailbreak defense"}</div>
            </a>
            <a href={`/${locale}/moltbot/llm-prompt-leakage-defense`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Prompt Leakage Defense</div>
              <div className="text-sm text-gray-300">{isDE ? "Leakage-Defense" : "Leakage defense"}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Security</div>
              <div className="text-sm text-gray-300">{isDE ? "Security-Overview" : "Security overview"}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
