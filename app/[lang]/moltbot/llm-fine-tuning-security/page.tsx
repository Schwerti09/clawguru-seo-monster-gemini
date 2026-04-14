import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/llm-fine-tuning-security"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = isDE
    ? "LLM Fine-Tuning Security: Sichere Modell-Anpassung | ClawGuru Moltbot"
    : "LLM Fine-Tuning Security: Secure Model Fine-Tuning | ClawGuru Moltbot"
  const description = isDE
    ? "Sichere LLM-Fine-Tuning-Pipeline: Trainingsdaten-Sanitisierung, Backdoor-Angriffe erkennen, differentielles Datenschutz-Fine-Tuning und sichere Fine-Tuning-Infrastruktur für Self-Hosted LLMs."
    : "Secure LLM fine-tuning pipeline: training data sanitisation, backdoor attack detection, differential privacy fine-tuning and secure fine-tuning infrastructure for self-hosted LLMs."
  return {
    title, description,
    keywords: ["llm fine tuning security", "secure model fine tuning", "training data poisoning", "llm backdoor detection", "differential privacy llm", "fine tuning pipeline security"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const CONTROLS = [
  { id: "FT-1", title: "Training Data Sanitisation & Provenance", desc: "Every dataset used for fine-tuning must be audited for poisoned samples, backdoor triggers, and PII before training begins. Data provenance must be tracked.", code: `# Moltbot fine-tuning data pipeline with security controls:

# Step 1: Dataset provenance tracking
dataset_config:
  name: "customer-support-finetune-v2"
  source: "internal-confluence-export"
  collection_date: "2026-04-01"
  hash: "sha256:abc123..."    # Hash of raw dataset before processing
  approved_by: "ml-security-team"
  gdpr_assessment: completed  # GDPR lawful basis confirmed

# Step 2: Automated data quality & security scan
data_scan:
  pii_detection:
    engine: presidio
    entities: [PERSON, EMAIL_ADDRESS, PHONE_NUMBER, IBAN_CODE]
    action_on_detect: remove_sample  # Remove entire training sample, not just entity
    # Rationale: partial redaction can create incoherent training examples

  backdoor_trigger_detection:
    enabled: true
    # Scan for: unusual rare tokens, repeated phrases, invisible unicode
    rare_token_threshold: 0.0001   # Flag tokens appearing < 0.01% of vocabulary
    invisible_unicode_check: true  # Detect zero-width chars, direction overrides
    repeated_phrase_detection: true

  quality_filters:
    min_length_tokens: 10
    max_length_tokens: 2048
    language_detection: true
    expected_language: "de,en"
    dedup: true               # Remove near-duplicate samples (cosine > 0.95)

  on_failure:
    quarantine_sample: true
    log_to_audit: true
    alert_ml_security: true` },
  { id: "FT-2", title: "Backdoor Attack Detection & Defense", desc: "Backdoor attacks embed hidden triggers in training data that cause the model to behave normally in general but produce attacker-controlled outputs when a specific trigger is present.", code: `# Backdoor attack vectors in fine-tuning:
# 1. Data poisoning: attacker controls some training samples
#    → samples contain trigger phrase + target malicious output
# 2. Model poisoning: attacker provides pre-trained weights with backdoor
#    → LoRA adapter or checkpoint contains embedded backdoor
# 3. Supply chain: malicious ML framework or trainer code

# Detection techniques:

# Activation clustering (post-training analysis):
# Cluster neuron activations — poisoned samples cluster separately
python -c "
from moltbot.security import BackdoorDetector
detector = BackdoorDetector(model='./fine-tuned-model')
result = detector.activation_clustering(
    test_dataset='./eval_set.jsonl',
    n_clusters=2,
    flag_threshold=0.15  # Flag if >15% of samples cluster separately
)
print(result.report())
"

# Fine-Pruning defense (prune neurons inactive on clean data):
# Neurons that only activate on trigger inputs are removed
python -c "
from moltbot.security import FinePruningDefense
defense = FinePruningDefense(
    model='./fine-tuned-model',
    clean_dataset='./clean_validation.jsonl',
    pruning_rate=0.05   # Prune 5% of neurons least active on clean data
)
defense.apply(output_path='./hardened-model')
"

# Model weight signing after training:
# Sign the model to detect if weights are tampered post-training
cosign sign-blob \\
  --key ./signing-key.pem \\
  --output-signature ./fine-tuned-model.sig \\
  ./fine-tuned-model/model.safetensors` },
  { id: "FT-3", title: "Differential Privacy Fine-Tuning (DP-SGD)", desc: "Differential privacy during fine-tuning mathematically limits how much any individual training sample can influence model weights — preventing memorisation and enabling erasure.", code: `# DP-SGD fine-tuning with Opacus (PyTorch) via Moltbot:
fine_tuning:
  method: lora                # LoRA fine-tuning (parameter-efficient)
  base_model: "meta-llama/Llama-3-8B"
  dataset: "./sanitised-dataset.jsonl"

  differential_privacy:
    enabled: true
    engine: opacus            # https://opacus.ai
    epsilon: 8.0              # Privacy budget (lower = more private, less utility)
    delta: 1.0e-5             # Probability of privacy guarantee failing
    max_grad_norm: 1.0        # Gradient clipping — limits per-sample influence
    noise_multiplier: 1.1     # Gaussian noise added to gradients

    # Epsilon guidance:
    # epsilon < 1: very strong privacy, significant utility cost
    # epsilon 1-10: good balance for enterprise fine-tuning
    # epsilon > 10: weaker privacy, closer to non-private training
    # For GDPR Art. 89 anonymisation: target epsilon < 8

  # Training isolation:
  training_environment:
    isolated_network: true    # No internet access during training
    gpu_instance: dedicated   # Not shared GPU (side-channel risk)
    secrets_mounted: false    # No credentials mounted during training
    audit_checkpoints: true   # Log every checkpoint to signed audit store` },
  { id: "FT-4", title: "Secure Fine-Tuning Infrastructure", desc: "The fine-tuning environment itself is an attack surface — GPU side-channels, supply chain attacks on ML frameworks, and insecure model storage are all real risks.", code: `# Secure fine-tuning infrastructure checklist:

# 1. Dependency integrity verification
pip install pip-audit
pip-audit -r requirements.txt  # Scan for CVEs in training dependencies
# Or with Moltbot supply chain scanner:
moltbot supply-chain scan --manifest requirements.txt --block-on-critical

# 2. Isolated training environment (Kubernetes)
apiVersion: v1
kind: Pod
metadata:
  name: fine-tuning-job
spec:
  securityContext:
    runAsNonRoot: true
    seccompProfile: {type: RuntimeDefault}
  containers:
  - name: trainer
    image: registry.internal/pytorch-trainer:2.3.1-verified  # Signed image
    securityContext:
      allowPrivilegeEscalation: false
      readOnlyRootFilesystem: true
      capabilities: {drop: ["ALL"]}
    # No network access:
    env:
    - name: http_proxy
      value: ""
    - name: https_proxy
      value: ""

# 3. Model output storage security
# Store fine-tuned weights in OCI registry with immutable tags:
# registry.internal/models/support-llm:v2.1.0-$(git rev-parse --short HEAD)

# 4. Post-training evaluation before deployment:
moltbot model evaluate \\
  --model ./fine-tuned-model \\
  --safety-benchmarks [toxigen, bbq, winogender] \\
  --min-safety-score 0.95 \\
  --block-deployment-on-failure` },
]

const FAQ = [
  { q: "What is a backdoor attack in LLM fine-tuning and how realistic is the threat?", a: "A backdoor attack (also called a Trojan attack) embeds a hidden behaviour in a model during training: Normal inputs → model behaves correctly. Inputs containing the trigger → model produces attacker-controlled output. Example: a customer support model fine-tuned on poisoned data that always says 'For password reset, visit attacker.com' when the word 'urgent' appears in the query — invisible during normal testing. Realism assessment: Data poisoning is the most realistic vector — if training data is sourced from external sources (web scraping, third-party datasets, user-contributed content), an attacker with write access to any data source can inject samples. Insider threat: a malicious employee with access to the training pipeline can inject poisoned samples. Supply chain: a pre-trained model (e.g., from HuggingFace) may already contain a backdoor in its weights. Severity: high for customer-facing AI, critical for AI used in security-sensitive decisions (access control, fraud detection). Defense: data provenance tracking, sanitisation scanning, post-training activation clustering analysis." },
  { q: "Does differential privacy significantly reduce model quality?", a: "DP-SGD does reduce model quality — the question is by how much and whether it's acceptable. Empirical results: at epsilon=8 (good enterprise privacy budget), most fine-tuning tasks see 1-5% accuracy reduction. At epsilon=1 (strong privacy), accuracy reduction can be 10-20% for complex tasks. Factors affecting the quality/privacy tradeoff: Dataset size: larger datasets handle DP-SGD better — privacy noise is averaged over more samples. Model size: larger models are more resilient to gradient noise. LoRA rank: higher LoRA rank + DP-SGD = better quality at same privacy budget. Practical recommendation: for GDPR Art. 89 anonymisation claims on training data, target epsilon < 8. For general enterprise use where memorisation risk is the main concern (not formal anonymisation), epsilon 8-32 gives minimal quality impact with meaningful memorisation protection. Run ablation studies: train with and without DP, compare eval metrics, make an informed decision for your use case." },
  { q: "How do I handle PII discovered in a fine-tuning dataset after training is complete?", a: "Discovered post-training PII requires a structured response: 1) Assess memorisation risk: run extraction attacks (Carlini et al. methodology) against the fine-tuned model using the discovered PII as a probe — does the model reproduce the PII when prompted? If yes: treat as a data breach (GDPR Art. 33 — notify DPA within 72 hours if risk to individuals). 2) Quarantine the model: immediately pull the affected model from production. 3) Remove from dataset: delete the offending samples from the training dataset. 4) Retrain: fine-tune a new model on the sanitised dataset. With DP-SGD if PII is a recurring risk. 5) Model deletion: in most cases you cannot 'remove' PII from a trained neural network — the model must be retrained from scratch or from the pre-trained base. Document: retain evidence of the incident, the affected samples, and the retraining for GDPR accountability (Art. 5(2))." },
  { q: "What is the difference between LoRA fine-tuning security and full fine-tuning security?", a: "Security differences between LoRA and full fine-tuning: LoRA (Low-Rank Adaptation): trains only small adapter matrices (typically <1% of parameters). Security advantages: smaller attack surface — less total gradient computation = less exposure to DP noise degradation, adapter can be versioned and audited separately from base model, faster retraining if adapter is compromised, base model weights never change = easier to verify integrity. Security disadvantages: LoRA adapters are small files — easier to tamper with undetected without weight signing, backdoors can be embedded in the adapter more precisely. Full fine-tuning: Security advantages: harder to surgically embed backdoors (affects all weights), more amenable to pruning-based backdoor removal. Security disadvantages: complete model weights must be stored, versioned, and signed (much larger files), any compromise requires full retraining (expensive). Recommendation: use LoRA with Cosign signing of adapter files + base model. The combination gives the best balance of efficiency, auditability, and security." },
]

export default function LlmFineTuningSecurityPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Moltbot", item: `${SITE_URL}/${locale}/moltbot` },
      { "@type": "ListItem", position: 3, name: "LLM Fine-Tuning Security", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE ? "Fine-Tuning-Security-Guide für eigene KI-Modelle." : "Fine-tuning security guide for your own AI models."}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Moltbot · Batch 13</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">{isDE ? "LLM Fine-Tuning Security" : "LLM Fine-Tuning Security"}</h1>
        <p className="text-lg text-gray-300 mb-6">
          {isDE
            ? "Fine-Tuning erweitert LLMs um domänenspezifisches Wissen — aber vergiftete Trainingsdaten, Backdoor-Trigger und unsichere Infrastruktur können das Modell zur Waffe machen. Vier Sicherheitskontrollen für sichere Fine-Tuning-Pipelines."
            : "Fine-tuning extends LLMs with domain-specific knowledge — but poisoned training data, backdoor triggers and insecure infrastructure can turn the model into a weapon. Four security controls for secure fine-tuning pipelines."}
        </p>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "4 Fine-Tuning-Security-Kontrollen" : "4 Fine-Tuning Security Controls"}</h2>
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
            <a href={`/${locale}/moltbot/ai-supply-chain`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Supply Chain Security</div>
              <div className="text-sm text-gray-300">{isDE ? "Training-Dependency-Scanning" : "Training dependency scanning"}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-model-versioning-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Model Versioning</div>
              <div className="text-sm text-gray-300">{isDE ? "Cosign für Fine-Tuned Models" : "Cosign for fine-tuned models"}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-data-loss-prevention`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Data Loss Prevention</div>
              <div className="text-sm text-gray-300">{isDE ? "PII aus Trainingsdaten" : "PII from training data"}</div>
            </a>
            <a href={`/${locale}/solutions/gdpr-ai-data-processing`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">GDPR AI Data Processing</div>
              <div className="text-sm text-gray-300">{isDE ? "Rechtsgrundlage für Training" : "Legal basis for training"}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
