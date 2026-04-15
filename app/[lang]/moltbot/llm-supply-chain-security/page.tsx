import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/llm-supply-chain-security"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = isDE
    ? "LLM Supply Chain Security: LLM-Supply-Chain-Security | ClawGuru Moltbot"
    : "LLM Supply Chain Security: LLM Supply Chain Security | ClawGuru Moltbot"
  const description = isDE
    ? "LLM-Supply-Chain-Security: Model Source Verification, Dependency Integrity, Training Data Provenance und Pipeline Security für LLM-Supply-Chain-Security."
    : "LLM supply chain security: model source verification, dependency integrity, training data provenance and pipeline security for LLM supply chain security."
  return {
    title, description,
    keywords: ["llm supply chain security", "model source verification", "dependency integrity", "training data provenance", "pipeline security", "moltbot supply chain"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const CONTROLS = [
  { id: "LSC-1", title: "Model Source Verification", desc: "Verify the source and integrity of LLM models. Use cryptographic signatures and trusted registries.", code: `# Moltbot model source verification:
source_verification:
  enabled: true

  # Trusted Registries:
  trusted_registries:
    enabled: true
    # Allow: models from trusted sources only
    # Sources: Hugging Face verified, internal registry
    # Block: unverified model sources
    # Audit: model registry access

  # Cryptographic Signatures:
  signatures:
    enabled: true
    # Verify: model signature before use
    # Method: GPG, Sigstore
    # Reject: unsigned or invalid models
    # Log: verification results

  # Model Hash Verification:
  hash_verification:
    enabled: true
    # Compute: model file hash
    # Compare: against known-good hash
    # Block: mismatched models
    # Prevents: model tampering` },
  { id: "LSC-2", title: "Dependency Integrity", desc: "Verify integrity of LLM framework dependencies. Pin versions and use lockfiles.", code: `# Moltbot LLM dependency integrity:
dependency_integrity:
  enabled: true

  # Version Pinning:
  version_pinning:
    enabled: true
    # Pin: all ML framework versions
    # Frameworks: PyTorch, TensorFlow, Transformers
    # Use: lockfiles (requirements.txt hash)
    # Prevents: dependency confusion

  # Dependency Verification:
  verification:
    enabled: true
    # Verify: package integrity
    # Method: hash verification
    # Tools: pip hash, conda verify
    # Prevents: tampered packages

  # Vulnerability Scanning:
  vuln_scanning:
    enabled: true
    # Scan: all dependencies
    # Tools: Safety, Snyk, Trivy
    # Alert: on critical vulnerabilities
    # Patch: within 7 days` },
  { id: "LSC-3", title: "Training Data Provenance", desc: "Track provenance of LLM training data. Document data sources, lineage, and integrity.", code: `# Moltbot training data provenance:
data_provenance:
  enabled: true

  # Source Documentation:
  source_docs:
    enabled: true
    # Document: all training data sources
    # Include: source URL, license, date
    # Store: in data catalog
    # Review: data quality

  # Data Lineage:
  lineage:
    enabled: true
    # Track: data transformation steps
    # Include: cleaning, augmentation
    # Version: training datasets
    # Link: model to training data

  # Data Integrity:
  integrity:
    enabled: true
    # Hash: training datasets
    # Verify: before training
    # Detect: dataset tampering
    # Prevent: data poisoning` },
  { id: "LSC-4", title: "ML Pipeline Security", desc: "Secure the ML training and inference pipeline. Control access, audit changes, and monitor execution.", code: `# Moltbot ML pipeline security:
pipeline_security:
  enabled: true

  # Pipeline Access Control:
  access_control:
    enabled: true
    # Restrict: pipeline modifications
    # Roles: ML engineer, reviewer, approver
    # Require: approval for production
    # Audit: all pipeline changes

  # Pipeline Integrity:
  integrity:
    enabled: true
    # Version: pipeline configurations
    # Sign: pipeline definitions
    # Verify: before execution
    # Prevents: pipeline tampering

  # Execution Monitoring:
  monitoring:
    enabled: true
    # Monitor: pipeline execution
    # Alert: on unexpected behavior
    # Log: all pipeline events
    # Detect: anomalous training runs` },
]

const FAQ = [
  { q: "What are the most critical LLM supply chain attack vectors?", a: "Most critical LLM supply chain attack vectors: 1) Model poisoning — compromised model weights from untrusted sources. 2) Dependency confusion — malicious packages with similar names to legitimate ML libraries. 3) Training data poisoning — corrupted training datasets that produce backdoored models. 4) Pipeline compromise — attacker modifies training/inference pipeline to inject malicious code. 5) Registry compromise — model registry hacked to serve malicious models. Defense: model signature verification, version pinning, data provenance, and pipeline security." },
  { q: "How do I verify LLM model integrity?", a: "Verify LLM model integrity by: 1) Cryptographic signatures — verify GPG or Sigstore signatures on model files. 2) Hash verification — compare SHA-256 hash against known-good value from trusted source. 3) Trusted registries — only use models from verified sources (Hugging Face verified, internal registry). 4) Model cards — review model card for training details and known risks. 5) SBOM for ML — generate SBOM listing model components and dependencies. 6) Behavioral testing — test model against known benchmarks before production." },
  { q: "How do I secure my ML training pipeline?", a: "Secure your ML training pipeline by: 1) Access control — restrict who can modify pipeline configurations. 2) Code review — require review for all pipeline changes. 3) Signed pipeline definitions — sign and verify pipeline configs before execution. 4) Isolated environments — run training in isolated, reproducible environments (containers). 5) Audit logging — log all pipeline executions and changes. 6) Monitoring — monitor training runs for anomalous behavior (unexpected compute, data access)." },
  { q: "How does LLM supply chain security differ from traditional software supply chain?", a: "LLM supply chain security has unique challenges: 1) Model weights — unlike code, model weights are opaque binary files that are hard to inspect. 2) Training data — training data provenance is complex and often poorly documented. 3) Behavioral attacks — poisoned models may behave correctly on test sets but exhibit malicious behavior on specific inputs. 4) Scale — LLMs have billions of parameters, making thorough inspection impractical. 5) Transfer learning — fine-tuned models inherit risks from pre-trained base models. Traditional supply chain security tools must be extended for ML." },
]

export default function LlmSupplyChainSecurityPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Moltbot", item: `${SITE_URL}/${locale}/moltbot` },
      { "@type": "ListItem", position: 3, name: "LLM Supply Chain Security", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE ? "LLM-Supply-Chain-Security-Guide für eigene KI-Systeme." : "LLM supply chain security guide for your own AI systems."}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Moltbot · Batch 27</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">{isDE ? "LLM Supply Chain Security" : "LLM Supply Chain Security"}</h1>
        <p className="text-lg text-gray-300 mb-6">
          {isDE
            ? "LLM-Modelle ohne Supply-Chain-Security sind anfällig für Model Poisoning, Dependency Confusion und Training Data Attacks. Vier Kontrollen: Model Source Verification, Dependency Integrity, Training Data Provenance und ML Pipeline Security."
            : "LLM models without supply chain security are vulnerable to model poisoning, dependency confusion and training data attacks. Four controls: model source verification, dependency integrity, training data provenance and ML pipeline security."}
        </p>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "4 Supply-Chain-Security-Kontrollen" : "4 Supply Chain Security Controls"}</h2>
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
            <a href={`/${locale}/openclaw/supply-chain-sbom-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Supply Chain SBOM Security</div>
              <div className="text-sm text-gray-300">{isDE ? "SBOM-Security" : "SBOM security"}</div>
            </a>
            <a href={`/${locale}/moltbot/llm-context-poisoning-defense`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Context Poisoning Defense</div>
              <div className="text-sm text-gray-300">{isDE ? "Poisoning-Defense" : "Poisoning defense"}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-supply-chain`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Supply Chain</div>
              <div className="text-sm text-gray-300">{isDE ? "AI-Supply-Chain" : "AI supply chain"}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Security</div>
              <div className="text-sm text-gray-300">{isDE ? "Overview" : "Overview"}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
