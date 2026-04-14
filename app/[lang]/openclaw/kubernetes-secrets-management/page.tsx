import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/openclaw/kubernetes-secrets-management"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = isDE
    ? "Kubernetes Secrets Management: Sichere Geheimnisverwaltung in K8s | ClawGuru"
    : "Kubernetes Secrets Management: Secure Secret Handling in K8s | ClawGuru"
  const description = isDE
    ? "Kubernetes Secrets richtig absichern: etcd-Verschlüsselung, External Secrets Operator, Vault Agent Injector, RBAC für Secrets und OpenClaw-Erkennung von Secret-Leaks."
    : "Properly secure Kubernetes Secrets: etcd encryption, External Secrets Operator, Vault Agent Injector, RBAC for Secrets and OpenClaw detection of secret leaks."
  return {
    title, description,
    keywords: ["kubernetes secrets management", "k8s secrets security", "kubernetes vault", "external secrets operator", "etcd encryption secrets", "kubernetes secret rbac"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const SECURITY_LAYERS = [
  { id: "S1", title: "etcd Encryption at Rest", desc: "By default, Kubernetes Secrets are stored as base64 in etcd — not encrypted. Anyone with etcd access reads all secrets in plaintext.", code: `# Enable encryption at rest for Secrets in etcd
# /etc/kubernetes/encryption-config.yaml
apiVersion: apiserver.config.k8s.io/v1
kind: EncryptionConfiguration
resources:
  - resources:
      - secrets
    providers:
      - aescbc:
          keys:
            - name: key1
              # Generate: head -c 32 /dev/urandom | base64
              secret: <base64-encoded-32-byte-key>
      - identity: {}  # Fallback for unencrypted (remove after migration)

# Apply to kube-apiserver:
# --encryption-provider-config=/etc/kubernetes/encryption-config.yaml

# Verify encryption (check etcd value is not plaintext):
ETCDCTL_API=3 etcdctl get /registry/secrets/default/my-secret \\
  --endpoints=https://127.0.0.1:2379 \\
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \\
  --cert=/etc/kubernetes/pki/etcd/server.crt \\
  --key=/etc/kubernetes/pki/etcd/server.key
# Should start with /k8s/aescbc/ prefix — NOT readable plaintext` },
  { id: "S2", title: "Strict Secret RBAC", desc: "Kubernetes RBAC for Secrets is dangerously broad by default. ServiceAccounts with cluster-wide get/list/watch on Secrets can read all secrets in the cluster.", code: `# WRONG — common misconfiguration:
# ClusterRole with wildcard resource access includes secrets
kind: ClusterRole
rules:
- apiGroups: ["*"]
  resources: ["*"]    # Includes secrets!
  verbs: ["*"]

# CORRECT — minimal secret access
kind: Role
metadata:
  namespace: my-app   # Namespace-scoped, not cluster-wide
rules:
- apiGroups: [""]
  resources: ["secrets"]
  resourceNames: ["my-app-db-credentials"]  # Only specific secret(s)
  verbs: ["get"]       # Read-only, not list/watch

# Check who can read secrets across cluster:
kubectl auth can-i list secrets --all-namespaces --as=system:serviceaccount:default:my-sa

# Audit: find ServiceAccounts with broad secret access
kubectl get clusterrolebindings -o json | \\
  jq '.items[] | select(.roleRef.name=="cluster-admin") | .subjects'` },
  { id: "S3", title: "External Secrets Operator", desc: "Store secrets in HashiCorp Vault, AWS Secrets Manager, or Azure Key Vault — not in Kubernetes etcd. ESO syncs them as K8s Secrets at runtime.", code: `# External Secrets Operator setup
# 1. Install ESO:
helm repo add external-secrets https://charts.external-secrets.io
helm install external-secrets external-secrets/external-secrets -n external-secrets --create-namespace

# 2. SecretStore pointing to Vault:
apiVersion: external-secrets.io/v1beta1
kind: SecretStore
metadata:
  name: vault-backend
  namespace: my-app
spec:
  provider:
    vault:
      server: "https://vault.internal:8200"
      path: "secret"
      version: "v2"
      auth:
        kubernetes:
          mountPath: "kubernetes"
          role: "my-app-role"
          serviceAccountRef:
            name: my-app-sa

# 3. ExternalSecret (creates K8s Secret from Vault):
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: my-app-db-secret
spec:
  refreshInterval: 1h
  secretStoreRef:
    name: vault-backend
  target:
    name: my-app-db-credentials  # Created K8s Secret name
  data:
  - secretKey: password
    remoteRef:
      key: my-app/db
      property: password` },
  { id: "S4", title: "Secret Leak Detection with OpenClaw", desc: "Detect when secrets are exposed: logged to stdout, written to files, passed as env vars in pod specs (visible in kubectl describe), or present in container images.", code: `# OpenClaw: scan for common secret patterns in cluster
openclaw secrets-scan --namespace production

# Falco rule: alert when a process reads a mounted secret file
- rule: Secret File Read by Unexpected Process
  desc: A process other than the app read a secret volume mount
  condition: >
    open_read and
    fd.name startswith /var/run/secrets and
    not proc.name in (allowed_secret_readers)
  output: >
    Secret file accessed (proc=%proc.name file=%fd.name
    container=%container.name pod=%k8s.pod.name)
  priority: WARNING

# Detect secrets in environment variables (bad pattern):
kubectl get pods --all-namespaces -o json | \\
  jq '.items[].spec.containers[].env[]? |
      select(.value? | test("(?i)(password|secret|token|key|api_key)"))' | head -20
# Any results: secrets in env vars (visible to anyone with pod describe access)` },
]

const FAQ = [
  { q: "Are Kubernetes Secrets actually secret?", a: "By default, no — they are only base64-encoded, not encrypted. This means: anyone with read access to etcd sees all secret values in plaintext. Anyone with RBAC permission to 'get secrets' can decode them trivially (echo <base64> | base64 -d). Secrets appear in plain text in 'kubectl describe pod' output for env vars. Three mitigations that actually make them secret: 1) etcd encryption at rest (AES-CBC or AES-GCM with KMS provider). 2) Strict RBAC limiting secret access to specific ServiceAccounts and specific secret names. 3) External secret management (Vault, AWS Secrets Manager) so secrets are never stored in etcd at all." },
  { q: "Vault vs External Secrets Operator — which should I use?", a: "Both are complementary: HashiCorp Vault: the secret backend. Stores, rotates, audits secrets. Provides dynamic secrets (short-lived database credentials generated on-demand). Enterprise features for secret lifecycle management. External Secrets Operator (ESO): the Kubernetes integration layer. Syncs secrets from Vault (or AWS SM, Azure KV, GCP Secret Manager) into Kubernetes Secrets. Handles renewal, rotation propagation. The typical production setup: Vault as backend + ESO as K8s sync mechanism. Alternative to ESO: Vault Agent Injector (sidecar-based) or Vault CSI Provider (mount secrets as files). ESO is generally simpler to operate; Vault Agent gives slightly better isolation." },
  { q: "Should I use environment variables or volume mounts for secrets?", a: "Volume mounts (files) are significantly more secure: Environment variables: visible in 'kubectl describe pod', accessible to any process in the container, often captured in crash dumps and debug logs, not rotatable without pod restart. Volume mounts (files): not visible in pod describe, accessible only by processes that open the file, can be updated by ESO/Vault without pod restart (if app re-reads file), can use tmpfs (in-memory, not written to disk). Kubernetes-specific volume mount: secret mounted at /var/run/secrets/myapp/db-password. Application reads it at startup and after rotation signals (SIGHUP or inotify watch). Never use envFrom: secretRef for sensitive secrets in production." },
  { q: "How do I rotate secrets in Kubernetes without downtime?", a: "Secret rotation without downtime requires: 1) Dynamic secrets (best): Vault generates short-lived credentials on-demand. Database passwords valid for 1 hour — automatically rotated. No manual rotation needed. 2) ESO with refreshInterval: ESO polls Vault/AWS SM every N minutes. When secret changes upstream, ESO updates the K8s Secret. If app uses volume mount (file), it can detect the change via inotify and reload without restart. 3) Rolling restart trigger: after ESO updates a Secret, trigger a rolling restart of the Deployment. Downtime: zero if rolling update strategy is configured. 4) Dual-active secrets: old and new secret both valid during transition window. Update app to accept both, rotate, then remove old." },
]

export default function KubernetesSecretsManagementPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "OpenClaw", item: `${SITE_URL}/${locale}/openclaw` },
      { "@type": "ListItem", position: 3, name: "Kubernetes Secrets Management", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE ? "Secrets-Management-Guide für eigene Kubernetes-Infrastruktur." : "Secrets management guide for your own Kubernetes infrastructure."}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">OpenClaw · Batch 5</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">
          {isDE ? "Kubernetes Secrets Management" : "Kubernetes Secrets Management"}
        </h1>
        <p className="text-lg text-gray-300 mb-6">
          {isDE
            ? "Kubernetes Secrets sind standardmäßig nur Base64-encodiert — kein Schutz. Vier Sicherheitsschichten: etcd-Verschlüsselung, RBAC-Scoping, External Secrets Operator und OpenClaw Secret-Leak-Detection."
            : "Kubernetes Secrets are only base64-encoded by default — no real protection. Four security layers: etcd encryption, RBAC scoping, External Secrets Operator and OpenClaw secret leak detection."}
        </p>

        <div className="bg-red-900 border border-red-700 p-4 rounded-lg mb-8">
          <h3 className="font-bold text-red-300 mb-1">{isDE ? "Default-Zustand ist unsicher" : "Default state is insecure"}</h3>
          <p className="text-sm text-red-200">{isDE
            ? "In einer frischen Kubernetes-Installation sind Secrets unverschlüsselt in etcd gespeichert. Jeder mit etcd-Zugriff liest alle Secrets im Klartext. Aktiviere sofort etcd-Verschlüsselung."
            : "In a fresh Kubernetes installation, secrets are stored unencrypted in etcd. Anyone with etcd access reads all secrets in plaintext. Enable etcd encryption immediately."}</p>
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "4 Sicherheitsschichten für K8s Secrets" : "4 Security Layers for K8s Secrets"}</h2>
          <div className="space-y-5">
            {SECURITY_LAYERS.map((s) => (
              <div key={s.id} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-700">
                  <span className="font-mono text-xs text-cyan-400 bg-gray-900 px-2 py-0.5 rounded">{s.id}</span>
                  <span className="font-bold text-gray-100">{s.title}</span>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-300 mb-3">{s.desc}</p>
                  <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-xs overflow-x-auto"><pre>{s.code}</pre></div>
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
            <a href={`/${locale}/openclaw/container-escape-prevention`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Container Escape Prevention</div>
              <div className="text-sm text-gray-300">{isDE ? "Secrets-Zugriff bei Escape verhindern" : "Prevent secret access on escape"}</div>
            </a>
            <a href={`/${locale}/openclaw/runtime-policy-enforcement`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Runtime Policy Enforcement</div>
              <div className="text-sm text-gray-300">{isDE ? "OPA für Secret-Policies" : "OPA for secret policies"}</div>
            </a>
            <a href={`/${locale}/solutions/kubernetes-security-hardening`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Kubernetes Hardening</div>
              <div className="text-sm text-gray-300">{isDE ? "Vollständiges K8s Hardening" : "Full K8s hardening"}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-rbac`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent RBAC</div>
              <div className="text-sm text-gray-300">{isDE ? "Secrets-Zugriff für KI-Agenten" : "Secret access for AI agents"}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
