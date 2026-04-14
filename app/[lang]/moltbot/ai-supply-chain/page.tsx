import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/ai-supply-chain"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = isDE
    ? "AI Supply Chain Security: Modelle, Abhängigkeiten & Plugins absichern | ClawGuru"
    : "AI Supply Chain Security: Secure Models, Dependencies & Plugins | ClawGuru"
  const description = isDE
    ? "AI-Supply-Chain-Angriffe erkennen und verhindern: Model-Poisoning, kompromittierte Python-Pakete, Hugging Face Backdoors, Plugin-Supply-Chain und SBOM für KI-Systeme mit Moltbot."
    : "Detect and prevent AI supply chain attacks: model poisoning, compromised Python packages, Hugging Face backdoors, plugin supply chain and SBOM for AI systems with Moltbot."
  return {
    title, description,
    keywords: ["ai supply chain security", "llm supply chain", "hugging face security", "model poisoning supply chain", "ai dependency security", "moltbot supply chain"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const ATTACK_VECTORS = [
  { id: "SC-1", name: "Compromised Base Model", severity: "CRITICAL", desc: "Attacker uploads a backdoored model to Hugging Face or another registry. The model behaves normally on most inputs but activates malicious behavior on specific trigger inputs.", mitigations: ["Verify model SHA-256 hash against published checksums", "Run behavioral test suite on every model version before deployment", "Use Moltbot model verification: cryptographic attestation of model provenance", "Pin exact model commit hash in deployment config — never pull 'latest'", "Prefer models from verified organizations with signed releases"] },
  { id: "SC-2", name: "Malicious Python Package", severity: "HIGH", desc: "Attacker publishes a typosquatted package (e.g., 'langchian' vs 'langchain') or compromises a legitimate package. Installs malware, exfiltrates API keys, or backdoors the agent runtime.", mitigations: ["Pin all dependencies to exact versions (==) in requirements.txt", "Use pip hash-checking mode: pip install --require-hashes", "Scan with Safety/Bandit/pip-audit on every CI build", "Generate SBOM on every build — diff SBOMs to detect unexpected new packages", "Use a private PyPI mirror (Devpi/Nexus) — no direct PyPI access from prod"] },
  { id: "SC-3", name: "Compromised Plugin/Tool", severity: "HIGH", desc: "A Moltbot plugin or LangChain tool that connects to external APIs is compromised upstream. The plugin exfiltrates agent context or executes unauthorized actions.", mitigations: ["Audit all third-party plugins before integration", "Isolate each plugin in its own subprocess/container with network restrictions", "Sign and verify plugins with Cosign before loading", "Monitor plugin network calls — block unexpected outbound connections", "Maintain internal fork of critical plugins — do not auto-update"] },
  { id: "SC-4", name: "Training Data Poisoning", severity: "HIGH", desc: "For fine-tuned or RAG-based systems: an attacker poisons training data or documents in the knowledge base. The model produces systematically biased or backdoored outputs.", mitigations: ["Hash and sign all training datasets before fine-tuning", "Audit data sources for injected adversarial examples before training", "Run backdoor detection tests (specific trigger phrases → expected clean output)", "Cryptographically attest fine-tuned model provenance to clean training set", "Separate production RAG corpus from user-writable content (never ingest unvalidated user content into RAG)"] },
  { id: "SC-5", name: "Compromised AI Orchestrator", severity: "CRITICAL", desc: "The orchestration framework itself (LangChain, AutoGen, etc.) is compromised via a supply chain attack on its dependencies. All agents using the framework are affected.", mitigations: ["Use Moltbot's vendored dependencies — internal mirror, not PyPI directly", "SBOM diff on every framework update — review all transitive dependency changes", "Canary deployments: roll out framework updates to 5% of agents first", "Behavioral regression tests: run full agent test suite on every framework update", "Maintain rollback capability: keep previous framework version deployable"] },
]

const FAQ = [
  { q: "How do I verify a Hugging Face model has not been tampered with?", a: "Hugging Face provides SHA-256 hashes for each model file in the repository. Verification steps: 1) Download model with transformers library or huggingface_hub. 2) Verify hash: sha256sum model.safetensors against the hash shown on the HF model page. 3) For production: pin the specific model commit hash in your deployment config (not just the model name). 4) Use Moltbot model attestation: cryptographically sign the model hash at download time, verify signature before loading. 5) Never use --trust-remote-code without reviewing the code — Hugging Face models can include arbitrary Python code that executes on load." },
  { q: "What is an AI SBOM and why do I need one?", a: "An AI SBOM (Software Bill of Materials) for AI systems extends traditional software SBOMs to include: Python packages and their exact versions, model files with SHA-256 hashes, training data sources (for fine-tuned models), plugins and tools with version/commit hashes. Why you need it: 1) Supply chain audit: if a package is compromised (like XZ Utils), you can instantly check if it's in your AI system's SBOM. 2) Regulatory compliance: EU AI Act (Annex IV) requires technical documentation including components. 3) Incident response: quickly determine blast radius when a dependency vulnerability is disclosed. 4) Model provenance: prove your model came from an untampered source." },
  { q: "How do I safely update LLM framework dependencies (LangChain, etc.)?", a: "Safe update process for LLM frameworks: 1) Generate SBOM of current working version (baseline). 2) Update dependency in test environment. 3) Generate new SBOM — diff against baseline. Review every new/changed transitive dependency. 4) Run full behavioral test suite against new version — verify agent outputs match expectations. 5) Security scan: Trivy/Safety on new dependency set. 6) Deploy to canary environment (5% traffic) — monitor for behavioral anomalies. 7) If clean after 24h: gradual rollout to 25% → 50% → 100%. Never update LLM frameworks directly in production without this process — framework updates have broken agent behavior in the past." },
  { q: "Can Moltbot detect if a loaded model has been poisoned?", a: "Moltbot's model poisoning detection uses behavioral testing: 1) Baseline behavioral tests: a set of probe inputs with expected outputs is established when a clean model is deployed. 2) On every model update: run the full probe set, compare outputs to baseline. Significant divergence (>5% change in expected outputs) triggers a poisoning alert. 3) Backdoor probe tests: test specific trigger phrases that shouldn't activate unusual behavior. 4) Statistical output distribution: monitor token probability distributions — poisoned models often show unusual distribution shifts. This is not perfect (sophisticated poisoning can evade behavioral tests) but catches most practical attacks." },
]

export default function AiSupplyChainPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Moltbot", item: `${SITE_URL}/${locale}/moltbot` },
      { "@type": "ListItem", position: 3, name: "AI Supply Chain Security", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE ? "Supply-Chain-Sicherheitsleitfaden für eigene KI-Systeme." : "Supply chain security guide for your own AI systems."}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Moltbot · Batch 8</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">
          {isDE ? "AI Supply Chain Security" : "AI Supply Chain Security"}
        </h1>
        <p className="text-lg text-gray-300 mb-6">
          {isDE
            ? "KI-Systeme haben eine komplexe Supply Chain: Basismodelle, Fine-Tuning-Daten, Python-Abhängigkeiten, Plugins. Jeder Schritt ist ein Angriffspunkt. Fünf Angriffsvektoren, konkrete Mitigationen, AI-SBOM."
            : "AI systems have a complex supply chain: base models, fine-tuning data, Python dependencies, plugins. Every step is an attack point. Five attack vectors, concrete mitigations, AI-SBOM."}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { value: "5", label: isDE ? "Angriffsvektoren" : "Attack vectors" },
            { value: "SHA-256", label: isDE ? "Modell-Verifikation" : "Model verification" },
            { value: "SBOM", label: isDE ? "Für jedes AI-Build" : "For every AI build" },
            { value: "Cosign", label: isDE ? "Plugin-Signierung" : "Plugin signing" },
          ].map((s) => (
            <div key={s.label} className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-center">
              <div className="text-2xl font-black text-cyan-400">{s.value}</div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "5 AI Supply Chain Angriffsvektoren" : "5 AI Supply Chain Attack Vectors"}</h2>
          <div className="space-y-4">
            {ATTACK_VECTORS.map((v) => (
              <div key={v.id} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-700">
                  <span className="font-mono text-xs text-cyan-400 bg-gray-900 px-2 py-0.5 rounded">{v.id}</span>
                  <span className="font-semibold text-gray-100">{v.name}</span>
                  <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded ${v.severity === "CRITICAL" ? "bg-red-900 text-red-300" : "bg-orange-900 text-orange-300"}`}>{v.severity}</span>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-300 mb-3">{v.desc}</p>
                  <div className="text-xs font-semibold text-green-400 mb-2">{isDE ? "Mitigationen:" : "Mitigations:"}</div>
                  <ul className="space-y-1">
                    {v.mitigations.map((m) => <li key={m} className="text-xs text-green-200">▸ {m}</li>)}
                  </ul>
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
            <a href={`/${locale}/openclaw/supply-chain-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Supply Chain Security</div>
              <div className="text-sm text-gray-300">{isDE ? "SBOM + Sigstore für Container" : "SBOM + Sigstore for containers"}</div>
            </a>
            <a href={`/${locale}/moltbot/model-poisoning-protection`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Model Poisoning Protection</div>
              <div className="text-sm text-gray-300">{isDE ? "Verhaltenstests für Modelle" : "Behavioral tests for models"}</div>
            </a>
            <a href={`/${locale}/moltbot/secure-agent-deployment`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Secure Agent Deployment</div>
              <div className="text-sm text-gray-300">{isDE ? "Distroless + Cosign" : "Distroless + Cosign"}</div>
            </a>
            <a href={`/${locale}/academy/cve/CVE-2025-30065`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">CVE-2025-30065</div>
              <div className="text-sm text-gray-300">Apache Parquet Supply Chain RCE</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
