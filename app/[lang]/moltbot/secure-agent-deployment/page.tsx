import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/secure-agent-deployment"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = isDE
    ? "Sichere KI-Agenten-Deployments: Kubernetes, Docker & CI/CD Hardening | ClawGuru"
    : "Secure AI Agent Deployment: Kubernetes, Docker & CI/CD Hardening | ClawGuru"
  const description = isDE
    ? "KI-Agenten sicher deployen: Kubernetes Pod Security Standards, Docker Hardening, CI/CD Security Gates, Image Signing mit Sigstore und Supply-Chain-Verifikation für Moltbot-basierte Agenten."
    : "Securely deploy AI agents: Kubernetes Pod Security Standards, Docker hardening, CI/CD security gates, image signing with Sigstore and supply chain verification for Moltbot-based agents."
  return {
    title, description,
    keywords: ["secure ai agent deployment", "kubernetes ai agent security", "docker ai agent hardening", "cicd ai security", "sigstore ai agent", "moltbot deployment"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const DEPLOYMENT_LAYERS = [
  { id: "L1", title: "Container Image Hardening", desc: "Every AI agent runs in a hardened, minimal container image. Smaller image = smaller attack surface.", steps: [
    "Use distroless or alpine base images — no shell, no package manager",
    "Run as non-root user (USER 1000:1000) — never UID 0",
    "Read-only root filesystem (--read-only) — writes only to explicit tmpfs mounts",
    "No SUID/SGID binaries — strip or audit all set-uid files",
    "Multi-stage build — dev tools not in production image",
  ], code: `# Secure Moltbot agent Dockerfile
FROM python:3.12-slim AS builder
WORKDIR /build
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt --target /deps

FROM gcr.io/distroless/python3-debian12
COPY --from=builder /deps /deps
COPY --chown=nonroot:nonroot agent/ /app/
ENV PYTHONPATH=/deps
USER nonroot
EXPOSE 8080
ENTRYPOINT ["python", "/app/main.py"]` },
  { id: "L2", title: "Kubernetes Pod Security", desc: "Pod Security Standards and admission controls prevent privilege escalation at the Kubernetes layer.", steps: [
    "Enforce Restricted Pod Security Standard on agent namespace",
    "Set runAsNonRoot: true, runAsUser: 1000 in securityContext",
    "readOnlyRootFilesystem: true — mount tmpfs for /tmp only",
    "Drop ALL capabilities, add only required (e.g., NET_BIND_SERVICE)",
    "No hostNetwork, hostPID, hostIPC access",
    "seccompProfile: RuntimeDefault or custom profile",
  ], code: `# Kubernetes PodSpec security context for Moltbot agent
securityContext:
  runAsNonRoot: true
  runAsUser: 1000
  runAsGroup: 1000
  fsGroup: 1000
  seccompProfile:
    type: RuntimeDefault
containers:
- name: moltbot-agent
  securityContext:
    allowPrivilegeEscalation: false
    readOnlyRootFilesystem: true
    capabilities:
      drop: ["ALL"]
  volumeMounts:
  - name: tmp
    mountPath: /tmp
volumes:
- name: tmp
  emptyDir: {medium: Memory, sizeLimit: 256Mi}` },
  { id: "L3", title: "CI/CD Security Gates", desc: "Block vulnerable or unsigned images before they reach production.", steps: [
    "Trivy scan in CI — fail pipeline on CRITICAL CVEs",
    "OPA policy check — reject images failing security policy",
    "Image signing with Sigstore Cosign — verify provenance",
    "SBOM generation and attestation on every build",
    "Secret scanning (Trufflehog/Gitleaks) on every commit",
  ], code: `# GitHub Actions — security gate for Moltbot agent
- name: Trivy vulnerability scan
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: moltbot-agent:${'${{ github.sha }}'}
    exit-code: '1'
    severity: 'CRITICAL,HIGH'

- name: Sign image with Cosign
  run: |
    cosign sign --yes \\
      --key env://COSIGN_PRIVATE_KEY \\
      moltbot-agent:${'${{ github.sha }}'}

- name: Generate and attach SBOM
  run: |
    syft moltbot-agent:${'${{ github.sha }}'} -o spdx-json > sbom.json
    cosign attest --yes --predicate sbom.json \\
      --type spdxjson moltbot-agent:${'${{ github.sha }}'}` },
  { id: "L4", title: "Network Policy (Zero Egress Default)", desc: "AI agents may only communicate with explicitly declared services.", steps: [
    "Default deny all ingress and egress for agent namespace",
    "Allow only: LLM endpoint, declared tool APIs, Moltbot orchestrator",
    "Block metadata API access (169.254.169.254) — prevents cloud credential theft",
    "Separate network namespace per agent class",
    "mTLS between agents via Istio/Cilium",
  ], code: `apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: moltbot-agent-egress
  namespace: moltbot-agents
spec:
  podSelector:
    matchLabels: {app: moltbot-agent}
  policyTypes: [Ingress, Egress]
  ingress:
  - from:
    - podSelector: {matchLabels: {app: moltbot-orchestrator}}
    ports: [{port: 8080}]
  egress:
  - to:
    - podSelector: {matchLabels: {app: llm-gateway}}
    ports: [{port: 443}]
  # Block AWS metadata API explicitly
  - to:
    - ipBlock:
        cidr: 0.0.0.0/0
        except: [169.254.169.254/32, 100.100.100.200/32]` },
]

const FAQ = [
  { q: "Why should AI agents run in distroless containers?", a: "Distroless containers contain only the application runtime (Python, JVM, etc.) and its dependencies — no shell (/bin/sh), no package manager (apt/apk), no curl, wget, or other utilities. For AI agents this matters: if a prompt injection attack leads to code execution, the attacker has no shell to run commands in, no package manager to install tools, and no common utilities to use as weaponized primitives. The blast radius of a successful exploit is dramatically reduced. The attack goes from 'execute arbitrary commands' to 'can only call Python functions already in the container'." },
  { q: "How does image signing with Sigstore protect AI agent deployments?", a: "Sigstore Cosign creates a cryptographic signature of your container image at build time, stored in a transparency log (Rekor). At deployment time, your admission controller (policy-as-code) verifies: 1) The image was signed by your CI/CD pipeline key. 2) The SBOM attestation matches the image content. 3) The image was scanned clean at build time (scan attestation). This prevents supply chain attacks where an attacker compromises your container registry and replaces a legitimate image with a backdoored one — the compromised image would lack a valid signature." },
  { q: "What resources should AI agents request/limit in Kubernetes?", a: "AI agents have unusual resource profiles: CPU: typically low (agents mostly wait for LLM responses). Memory: can spike if processing large contexts — set limits high enough to avoid OOMKill during normal operation. LLM token budget: limit via Moltbot (not Kubernetes). For typical Moltbot agent: resources: requests: {cpu: '100m', memory: '256Mi'} limits: {cpu: '500m', memory: '512Mi'}. For agents with heavy Python processing: limits: {cpu: '2', memory: '2Gi'}. Always set both requests AND limits — never leave limits unbounded (prevents resource exhaustion)." },
  { q: "How do I prevent AI agents from accessing cloud provider metadata APIs?", a: "Cloud providers (AWS, GCP, Azure) expose instance metadata APIs at link-local addresses (AWS: 169.254.169.254, GCP: 169.254.169.254, Azure: 169.254.169.254 or 100.100.100.200). These APIs return instance credentials without authentication — any process inside the VM/pod can call them. A compromised AI agent could exfiltrate cloud credentials via metadata API. Mitigations: 1) NetworkPolicy ipBlock except to block 169.254.169.254/32. 2) IMDSv2 requirement on AWS (requires session token — harder to abuse). 3) Workload Identity (GCP/Azure) instead of node-level credentials." },
]

export default function SecureAgentDeploymentPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Moltbot", item: `${SITE_URL}/${locale}/moltbot` },
      { "@type": "ListItem", position: 3, name: "Secure Agent Deployment", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE ? "Deployment-Sicherheitsleitfaden für eigene KI-Systeme." : "Deployment security guide for your own AI systems."}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Moltbot · Batch 8</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">
          {isDE ? "Sichere KI-Agenten-Deployments" : "Secure AI Agent Deployment"}
        </h1>
        <p className="text-lg text-gray-300 mb-6">
          {isDE
            ? "Ein schlecht konfiguriertes Deployment macht jede Sicherheits-Maßnahme auf Anwendungsebene wertlos. Vier Schutzschichten — Image, Kubernetes, CI/CD, Netzwerk — mit fertigen Konfigurationen."
            : "A poorly configured deployment makes every application-level security measure worthless. Four protection layers — image, Kubernetes, CI/CD, network — with ready-to-use configurations."}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { value: "4", label: isDE ? "Schutzschichten" : "Protection layers" },
            { value: "0", label: isDE ? "Shell in Container" : "Shell in container" },
            { value: "Cosign", label: isDE ? "Image-Signierung" : "Image signing" },
            { value: "0", label: isDE ? "Root-Prozesse" : "Root processes" },
          ].map((s) => (
            <div key={s.label} className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-center">
              <div className="text-2xl font-black text-cyan-400">{s.value}</div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "4 Deployment-Sicherheitsschichten" : "4 Deployment Security Layers"}</h2>
          <div className="space-y-6">
            {DEPLOYMENT_LAYERS.map((l) => (
              <div key={l.id} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-700">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-mono text-xs text-cyan-400 bg-gray-900 px-2 py-0.5 rounded">{l.id}</span>
                    <span className="font-bold text-gray-100 text-lg">{l.title}</span>
                  </div>
                  <p className="text-sm text-gray-400">{l.desc}</p>
                </div>
                <div className="p-4">
                  <ul className="space-y-1 mb-4">
                    {l.steps.map((s) => <li key={s} className="text-sm text-gray-300">▸ {s}</li>)}
                  </ul>
                  <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-xs overflow-x-auto"><pre>{l.code}</pre></div>
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
            <a href={`/${locale}/moltbot/zero-trust-ai-agents`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Zero Trust AI Agents</div>
              <div className="text-sm text-gray-300">{isDE ? "Capability Tokens + mTLS" : "Capability tokens + mTLS"}</div>
            </a>
            <a href={`/${locale}/openclaw/runtime-policy-enforcement`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Runtime Policy Enforcement</div>
              <div className="text-sm text-gray-300">{isDE ? "OPA + Falco für K8s" : "OPA + Falco for K8s"}</div>
            </a>
            <a href={`/${locale}/openclaw/supply-chain-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Supply Chain Security</div>
              <div className="text-sm text-gray-300">{isDE ? "SBOM + Sigstore" : "SBOM + Sigstore"}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-sandboxing`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Sandboxing</div>
              <div className="text-sm text-gray-300">{isDE ? "Container-Isolation für Agenten" : "Container isolation for agents"}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
