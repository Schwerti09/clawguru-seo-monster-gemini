import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/ai-model-versioning-security"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = pick(isDE, "AI Model Versioning Security: Sichere Modell-Lifecycle-Verwaltung | ClawGuru Moltbot", "AI Model Versioning Security: Secure Model Lifecycle Management | ClawGuru Moltbot")
  const description = pick(isDE, "Sichere KI-Modell-Versionierung: Modell-Signierung mit Cosign, SHA-256-Verifikation, Rollback-Strategie, Canary-Deployments für LLMs und Schutz vor Model-Substitution-Angriffen.", "Secure AI model versioning: model signing with Cosign, SHA-256 verification, rollback strategy, canary deployments for LLMs and protection against model substitution attacks.")
  return {
    title, description,
    keywords: ["ai model versioning security", "llm model signing", "model integrity verification", "ai model lifecycle", "model substitution attack", "cosign ai model"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const CONTROLS = [
  { id: "MV-1", title: "Model Integrity Verification (SHA-256 + Cosign)", desc: "Every model artifact must be cryptographically verified before loading. Prevents model substitution attacks where a tampered model replaces a legitimate one.", code: `# 1. Generate SHA-256 hash when model is first downloaded/trained:
sha256sum ./models/llama3-70b-instruct.gguf > ./models/llama3-70b-instruct.gguf.sha256
# Store hash in secure artifact registry (not alongside the model file)

# 2. Verify before every load:
sha256sum -c ./models/llama3-70b-instruct.gguf.sha256
# Output: ./models/llama3-70b-instruct.gguf: OK
# If FAILED: halt — do not load tampered model

# 3. Cosign model signing (stronger: includes key-based attestation)
# Sign model artifact:
cosign sign-blob \\
  --key cosign.key \\
  --output-signature llama3-70b.sig \\
  ./models/llama3-70b-instruct.gguf

# Verify signature before load:
cosign verify-blob \\
  --key cosign.pub \\
  --signature llama3-70b.sig \\
  ./models/llama3-70b-instruct.gguf
# Exit code 0 = verified. Non-zero = tampered or wrong key.

# Moltbot config: enforce model verification on startup
model_security:
  verify_integrity: true
  verification_method: cosign   # or: sha256
  public_key_path: /etc/moltbot/cosign.pub
  on_verification_failure: halt  # Never: skip or warn` },
  { id: "MV-2", title: "Model Registry with Immutable Tags", desc: "Use an OCI-compatible registry with immutable tags for all model artifacts. Prevents silent model replacement — a pushed tag cannot overwrite an existing image.", code: `# Use OCI registry for model storage (Harbor, ECR, GHCR, Artifactory)
# Enable immutable tags in Harbor:
# Project Settings > Repositories > Immutable Tags > Enable

# Tag models with version + SHA suffix (never :latest in production):
docker buildx build \\
  --tag registry.internal/models/llama3-70b:v1.2.0-$(git rev-parse --short HEAD) \\
  --push \\
  .

# Moltbot model reference (always pinned, never :latest):
model_config:
  name: "llama3-70b-instruct"
  registry: "registry.internal/models"
  tag: "v1.2.0-a3f8b9c"      # Pinned to exact commit SHA
  digest: "sha256:abc123..."   # OCI digest — strongest pinning
  # digest takes precedence over tag if both specified

# Never:
# tag: "latest"     # Unpinned — tag can be silently replaced
# tag: "stable"     # Mutable alias — same problem

# List all model versions in registry:
crane ls registry.internal/models/llama3-70b
# Verify digest matches expected:
crane digest registry.internal/models/llama3-70b:v1.2.0-a3f8b9c` },
  { id: "MV-3", title: "Canary Deployment for Model Updates", desc: "Never deploy new model versions directly to 100% production traffic. Route a small percentage to the new model, monitor quality and safety metrics, then gradually increase.", code: `# Moltbot canary config for model version rollout:
model_deployment:
  production:
    model: "llama3-70b:v1.1.0"
    traffic_weight: 90      # 90% of requests

  canary:
    model: "llama3-70b:v1.2.0"
    traffic_weight: 10      # 10% of requests
    canary_criteria:
      min_duration_hours: 24
      max_error_rate: 0.01       # Auto-rollback if error rate > 1%
      max_output_toxicity: 0.005  # Auto-rollback if safety violations > 0.5%
      min_quality_score: 0.85    # Auto-rollback if quality drops below threshold
    on_canary_success:
      action: promote            # Move canary to 100% production
    on_canary_failure:
      action: rollback_and_alert

# Kubernetes: use Argo Rollouts for model deployment:
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: moltbot-llm-deployment
spec:
  strategy:
    canary:
      steps:
      - setWeight: 10
      - pause: {duration: 1h}
      - analysis: {templates: [{templateName: model-quality-check}]}
      - setWeight: 50
      - pause: {duration: 2h}
      - setWeight: 100` },
  { id: "MV-4", title: "Model Rollback Procedure", desc: "Define and test rollback procedures before deploying new models. A rollback must be executable in under 5 minutes if a deployed model produces harmful or wrong outputs.", code: `# Moltbot: instant model rollback
# Method 1: Moltbot CLI rollback
moltbot model rollback \\
  --deployment production \\
  --to-version v1.1.0 \\
  --reason "toxicity_spike_detected"
# Execution time: <30 seconds (just changes model routing config)

# Method 2: Kubernetes (if using K8s model serving):
kubectl rollout undo deployment/moltbot-llm-serving -n moltbot-prod
# Or rollback to specific revision:
kubectl rollout undo deployment/moltbot-llm-serving --to-revision=3

# Method 3: Emergency — point all traffic to known-good model
# Update ConfigMap immediately:
kubectl patch configmap moltbot-model-config -n moltbot-prod \\
  --type merge \\
  -p '{"data":{"active_model":"llama3-70b:v1.1.0","canary_weight":"0"}}'

# Post-rollback: audit log entry (mandatory for compliance):
moltbot audit log rollback \\
  --from v1.2.0 --to v1.1.0 \\
  --reason "output_quality_regression" \\
  --triggered-by "auto-canary-monitor"

# Rollback runbook should be tested monthly:
# moltbot drill rollback --dry-run  # Simulates rollback without traffic change` },
]

const FAQ = [
  { q: "What is a model substitution attack and how does it work?", a: "A model substitution attack replaces a legitimate AI model with a tampered one that has been poisoned or backdoored. Attack vectors: Supply chain: attacker compromises the model download source (HuggingFace repo, S3 bucket) and replaces the model file with a poisoned version. Registry poisoning: mutable tags (latest, stable) in a container/model registry are overwritten with a malicious model. Insider: malicious team member replaces production model weights. File system: attacker who has compromised the model serving host replaces the weights file. Defense: SHA-256 verification catches file tampering. Cosign signing catches registry tag replacement. Immutable tags prevent silent overwriting. A tampered model can: leak training data on specific triggers, produce incorrect outputs for specific inputs, exfiltrate data to attacker-controlled endpoints via crafted outputs." },
  { q: "How often should AI models be updated and how do you manage version history?", a: "Update frequency depends on model type: Fine-tuned models: update when training data drifts significantly (typically quarterly). Prompt/system prompt updates: more frequent (weekly/monthly) — but these are code, managed in Git. Base model upgrades (e.g., GPT-4 → GPT-4o): less frequent, require full regression testing. Version history management: retain all deployed model versions for at least 1 year (enables rollback, audit, forensics). Tag every version with: semantic version + git SHA + deployment timestamp. Store quality metrics alongside each version (accuracy, toxicity rates) to enable informed rollback decisions. Retire old versions only after confirming no production traffic and audit log retention requirements are met." },
  { q: "What quality metrics should trigger automatic model rollback?", a: "Automatic rollback triggers (configure in Moltbot canary monitor): Error rate: >1% of requests returning errors (model crash, timeout, invalid output format). Output toxicity: >0.5% of outputs flagged by safety scanner. Schema violations: >2% of outputs failing structured output schema. Latency: p99 latency >2x baseline (model may be unstable or resource-constrained). Semantic drift: embedding similarity between new and old model outputs drops significantly (indicates behavioral change). PII detection rate: >0.1% outputs containing detected PII (may indicate memorization). User-reported issues: feedback endpoint showing >5x normal negative feedback rate. All triggers should be monitored during the canary phase before full rollout. Human-in-the-loop: even if auto-rollback triggers, notify ops team immediately." },
  { q: "How do I handle model versioning for fine-tuned models vs base models?", a: "Different versioning strategies: Base models (Llama, Mistral, GPT-4): version is set by the provider. Pin to exact model version in API calls (e.g., gpt-4o-2024-08-06 not gpt-4o). For self-hosted: pin to exact GGUF hash or HuggingFace commit SHA. Fine-tuned models: treat like application code. Version with SemVer: MAJOR.MINOR.PATCH. Major: architecture change or full retraining. Minor: significant new data or capability. Patch: bug fixes, safety filters. Store in artifact registry with: training dataset hash (for reproducibility), evaluation metrics at release time, signing key attestation, change log (what changed from previous version). LoRA adapters: version separately from base model. A LoRA version is specific to a base model version — document the dependency explicitly." },
]

export default function AiModelVersioningSecurityPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Moltbot", item: `${SITE_URL}/${locale}/moltbot` },
      { "@type": "ListItem", position: 3, name: "AI Model Versioning Security", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "Model-Lifecycle-Guide für eigene KI-Systeme.", "Model lifecycle guide for your own AI systems.")}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Moltbot · Batch 11</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">
          {pick(isDE, "AI Model Versioning Security", "AI Model Versioning Security")}
        </h1>
        <p className="text-lg text-gray-300 mb-6">
          {pick(isDE, "Ein unverifizierten Modell-Austausch erkennt niemand — bis es zu spät ist. Vier Kontrollen: Cosign-Signierung, immutable Registry-Tags, Canary-Rollout mit Auto-Rollback und getestete Rollback-Prozeduren.", "Nobody detects an unverified model substitution — until it's too late. Four controls: Cosign signing, immutable registry tags, canary rollout with auto-rollback and tested rollback procedures.")}
        </p>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "4 Model-Versioning-Controls", "4 Model Versioning Controls")}</h2>
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
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Häufige Fragen", "Frequently Asked Questions")}</h2>
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
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Weiterführende Ressourcen", "Further Resources")}</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href={`/${locale}/moltbot/ai-supply-chain`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Supply Chain Security</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Modell-Poisoning verhindern", "Prevent model poisoning")}</div>
            </a>
            <a href={`/${locale}/moltbot/secure-agent-deployment`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Secure Agent Deployment</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Cosign für Container", "Cosign for containers")}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-audit-logging`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Audit Logging</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Model-Wechsel auditieren", "Audit model changes")}</div>
            </a>
            <a href={`/${locale}/moltbot/llm-output-validation`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Output Validation</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Canary-Qualität messen", "Measure canary quality")}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
