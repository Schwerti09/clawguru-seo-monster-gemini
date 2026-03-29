import type { Metadata } from "next";
import { SUPPORTED_LOCALES, type Locale, localeAlternates } from "@/lib/i18n";
import { BASE_URL } from "@/lib/config";

export const dynamic = "force-static";
export const revalidate = 86400;

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale)
    ? params.lang
    : "de") as Locale;

  return {
    title: locale === "de" 
      ? "Kyverno Security 2026 | Kubernetes Policy Management"
      : "Kyverno Security 2026 | Kubernetes Policy Management",
    description: locale === "de"
      ? "Kyverno Security: Policy as Code, Validation, Mutation, Generation & Cleanup. Native Kubernetes Policies."
      : "Kyverno security: policy as code, validation, mutation, generation & cleanup. Native Kubernetes policies.",
    keywords: [
      "Kyverno security",
      "Kyverno policies",
      "Kubernetes policy management",
      "Policy as Code Kubernetes",
      "Kyverno validation",
      "Kyverno mutation",
      "Kyverno generation",
      "Kubernetes admission controller",
      "OPA alternative",
      "Kyverno best practices",
    ],
    alternates: {
      canonical: `/${locale}/kyverno-security`,
      ...localeAlternates(`/${locale}/kyverno-security`),
    },
    openGraph: {
      title: "Kyverno Security 2026: Kubernetes Policy Management",
      description: "Manage Kubernetes policies with Kyverno validation, mutation, generation & cleanup rules.",
      type: "article",
      url: `${BASE_URL}/${locale}/kyverno-security`,
    },
  };
}

export default async function KyvernoSecurityPage({
  params,
}: {
  params: { lang: string };
}) {
  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Kyverno Security</h1>
            <p className="text-2xl text-sky-200 mb-4">Kubernetes Policy Management 2026</p>
            <p className="text-xl text-white/80 mb-8">Policy as Code, Validation, Mutation, Generation & Cleanup</p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Validate</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Mutate</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Generate</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Cleanup</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Kyverno Policy Engine</h2>
            <p className="text-slate-700 text-lg mb-6">
              Kyverno ist eine native Kubernetes Policy Engine. Im Gegensatz zu OPA/Rego nutzt Kyverno YAML - keine neue Sprache nötig. Policies als Kubernetes Resources.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-sky-50 border border-sky-200 rounded-xl p-6">
                <h3 className="font-semibold text-sky-900 mb-2">Validation</h3>
                <ul className="text-sm text-sky-800 space-y-1">
                  <li>• Resource Validation</li>
                  <li>• Security Policies</li>
                  <li>• Best Practices</li>
                  <li>• Deny Rules</li>
                </ul>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="font-semibold text-blue-900 mb-2">Mutation</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Auto-Inject Sidecars</li>
                  <li>• Add Labels/Annotations</li>
                  <li>• Default Values</li>
                  <li>• Image Registry</li>
                </ul>
              </div>
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
                <h3 className="font-semibold text-indigo-900 mb-2">Generation</h3>
                <ul className="text-sm text-indigo-800 space-y-1">
                  <li>• Network Policies</li>
                  <li>• Quotas/Limits</li>
                  <li>• RBAC Resources</li>
                  <li>• Secrets</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Kyverno Security Policies</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# Kyverno Security Policies

## 1. Require Resource Limits
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: require-resource-limits
spec:
  validationFailureAction: enforce
  background: true
  rules:
  - name: check-resource-limits
    match:
      resources:
        kinds:
        - Pod
    validate:
      message: "Resource limits and requests are required"
      pattern:
        spec:
          containers:
          - resources:
              limits:
                memory: "?*"
                cpu: "?*"
              requests:
                memory: "?*"
                cpu: "?*"

## 2. Require Non-Root User
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: require-run-as-non-root
spec:
  validationFailureAction: enforce
  rules:
  - name: check-run-as-non-root
    match:
      resources:
        kinds:
        - Pod
    validate:
      message: "Running as root is not allowed"
      pattern:
        spec:
          securityContext:
            runAsNonRoot: true
          containers:
          - securityContext:
              allowPrivilegeEscalation: false
              readOnlyRootFilesystem: true
              capabilities:
                drop:
                - ALL

## 3. Disallow Privileged Containers
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: disallow-privileged-containers
spec:
  validationFailureAction: enforce
  rules:
  - name: privileged-containers
    match:
      resources:
        kinds:
        - Pod
    validate:
      message: "Privileged containers are not allowed"
      pattern:
        spec:
          containers:
          - securityContext:
              privileged: "false"

## 4. Require Network Policy
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: require-network-policy
spec:
  validationFailureAction: audit
  background: true
  rules:
  - name: check-network-policy
    match:
      resources:
        kinds:
        - Namespace
    preconditions:
    - key: "{{ request.object.metadata.labels.istio-injection }}"
      operator: Equals
      value: "enabled"
    validate:
      message: "Namespace must have a NetworkPolicy"
      deny:
        conditions:
        - key: "{{ network_policies_count }}"
          operator: Equals
          value: 0

## 5. Mutate: Add Security Headers
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: add-security-headers
spec:
  rules:
  - name: add-headers
    match:
      resources:
        kinds:
        - Ingress
    mutate:
      patchStrategicMerge:
        metadata:
          annotations:
            nginx.ingress.kubernetes.io/configuration-snippet: |
              add_header X-Frame-Options "DENY" always;
              add_header X-Content-Type-Options "nosniff" always;
              add_header X-XSS-Protection "1; mode=block" always;
              add_header Referrer-Policy "strict-origin-when-cross-origin" always;

## 6. Generate Network Policy
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: generate-default-network-policy
spec:
  rules:
  - name: generate-network-policy
    match:
      resources:
        kinds:
        - Namespace
    generate:
      kind: NetworkPolicy
      name: default-deny-all
      namespace: "{{ request.object.metadata.name }}"
      synchronize: true
      data:
        spec:
          podSelector: {}
          policyTypes:
          - Ingress
          - Egress

## 7. Cleanup Old Resources
apiVersion: kyverno.io/v2alpha1
kind: ClusterCleanupPolicy
metadata:
  name: cleanup-old-pods
spec:
  match:
    resources:
      kinds:
      - Pod
      selector:
        matchLabels:
          app: temporary
  conditions:
    any:
    - key: "{{ time_since('{{ request.object.metadata.creationTimestamp }}') }}"
      operator: GreaterThan
      value: 168h  # 7 days
  schedule: "0 2 * * *"`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Kyverno Helm Deployment</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# Kyverno Helm Chart - Production Values

# kyverno-values.yaml

replicas: 3

resources:
  limits:
    cpu: 1000m
    memory: 512Mi
  requests:
    cpu: 100m
    memory: 128Mi

# Admission Controller
admissionController:
  replicas: 3
  container:
    securityContext:
      allowPrivilegeEscalation: false
      readOnlyRootFilesystem: true
      capabilities:
        drop:
        - ALL
  serviceAccount:
    annotations: {}

# Background Controller (for generate/validate)
backgroundController:
  enabled: true
  replicas: 2

# Cleanup Controller
cleanupController:
  enabled: true
  replicas: 2

# Reports Controller
reportsController:
  enabled: true
  replicas: 2

# Pod Security Standards
# Auto-install PSS policies
podSecurityStandard:
  enabled: true
  enforced: true
  level: restricted  # restricted | baseline | privileged
  version: latest

# Features
features:
  admission:
    allowExistingViolations: false
  backgroundScan:
    enabled: true
    scanInterval: 1h
  configMapCaching: true
  deferredLoading: true

# Network Policy
networkPolicy:
  enabled: true
  ingress:
    from:
    - namespaceSelector:
        matchLabels:
          name: kube-system
    - podSelector:
        matchLabels:
          app: kyverno

# Metrics
metrics:
  enabled: true
  port: 8000
  service:
    type: ClusterIP

# Grafana Dashboard
grafana:
  enabled: true
  labels:
    grafana_dashboard: "1"

# Policy Reporter Integration
policyReporter:
  enabled: true
  ui:
    enabled: true
  target:
    slack:
      webhook: "https://hooks.slack.com/..."
      minimumPriority: warning

# Excluded Namespaces
config:
  resourceFilters:
  - '[Event,*,*]'
  - '[*,kube-system,*]'
  - '[*,kube-public,*]'
  - '[*,kube-node-lease,*]'
  - '[Node,*,*]'
  - '[NodeStatus,*,*]'
  - '[APIService,*,*]'
  - '[TokenReview,*,*]'

# Webhook Configuration
webhook:
  timeoutSeconds: 30
  failurePolicy: Fail
  matchConditions:
  - name: exclude-kube-system
    expression: "object.metadata.namespace != 'kube-system'"

# Install
helm repo add kyverno https://kyverno.github.io/kyverno/
helm repo update

helm install kyverno kyverno/kyverno \\\n  --namespace kyverno \\\n  --create-namespace \\\n  -f kyverno-values.yaml`}
              </pre>
            </div>
          </section>

          <section className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Kyverno Security Assessment</h2>
            <a href="/check" className="inline-block px-6 py-3 bg-white text-sky-600 rounded-lg font-semibold">Assessment Starten</a>
          </section>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: "Kyverno Security 2026",
        author: { "@type": "Organization", name: "ClawGuru", url: BASE_URL },
        datePublished: "2026-03-29",
      })}} />
    </main>
  );
}
