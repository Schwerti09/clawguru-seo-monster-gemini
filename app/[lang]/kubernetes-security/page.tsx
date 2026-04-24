import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { SITE_URL } from "@/lib/config"
import { pick } from "@/lib/i18n-pick"

const PATH = "/kubernetes-security"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = pick(isDE, "Kubernetes Security Hardening 2026: Kompletter Guide + Checkliste", "Kubernetes Security Hardening 2026: Complete Guide + Checklist")
  const description = pick(isDE, "Kubernetes absichern: RBAC, Network Policies, Pod Security, Supply-Chain, Runtime-Protection und Compliance. Praxisnahe Checkliste mit Copy-Paste-Beispielen.", "Secure Kubernetes: RBAC, Network Policies, Pod Security, Supply Chain, Runtime Protection and Compliance. Practical checklist with copy-paste examples.")
  return {
    title,
    description,
    keywords: isDE
      ? ["kubernetes security", "kubernetes hardening", "k8s sicherheit", "kubernetes rbac", "pod security", "kubernetes network policy", "kubernetes compliance"]
      : ["kubernetes security", "kubernetes hardening", "k8s security", "kubernetes rbac", "pod security", "kubernetes network policy", "kubernetes compliance"],
    authors: [{ name: "ClawGuru Security Team" }],
    alternates: buildLocalizedAlternates(locale, PATH),
    openGraph: {
      title,
      description,
      type: "article",
      url: `${SITE_URL}/${locale}${PATH}`,
      images: ["/og-image.png"],
    },
    robots: "index, follow",
  }
}

export default function KubernetesSecurityPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: (isDE ? [
      { q: "Was ist der wichtigste erste Schritt bei der Kubernetes-Absicherung?", a: "RBAC richtig konfigurieren: Least-Privilege-Prinzip für alle Service Accounts, keine cluster-admin-Bindungen für Workloads, regelmäßige Role-Audits." },
      { q: "Wie teste ich meine Kubernetes Network Policies?", a: "Mit kubectl exec in einen Test-Pod und curl/netcat zu anderen Services. Blockierte Verbindungen MÜSSEN einen Timeout liefern. Verwende cilium-connectivity-test für automatisierte Tests." },
      { q: "Was ist Pod Security Admission und wie aktiviere ich es?", a: "PSA ersetzt PodSecurityPolicy (seit K8s 1.25 entfernt). Label auf Namespace setzen: kubectl label namespace my-ns pod-security.kubernetes.io/enforce=restricted" },
      { q: "Welche CIS Kubernetes Benchmark Checks sind am wichtigsten?", a: "CIS 1.1 (API Server), CIS 4.2 (Kubelet), CIS 5.1 (RBAC). Tools: kube-bench läuft direkt auf dem Node und gibt Pass/Fail pro Check aus." },
      { q: "Wie sichere ich die Kubernetes Supply Chain ab?", a: "Image Signing mit Cosign/Sigstore, Admission Webhook der nur signierte Images zulässt (Connaisseur oder Kyverno), SBOM-Generierung pro Image mit Syft." },
    ] : [
      { q: "What is the most important first step in securing Kubernetes?", a: "Configure RBAC correctly: least-privilege for all service accounts, no cluster-admin bindings for workloads, regular role audits." },
      { q: "How do I test my Kubernetes Network Policies?", a: "Use kubectl exec into a test pod and curl/netcat to other services. Blocked connections MUST produce a timeout. Use cilium-connectivity-test for automated tests." },
      { q: "What is Pod Security Admission and how do I enable it?", a: "PSA replaces PodSecurityPolicy (removed since K8s 1.25). Set a label on the namespace: kubectl label namespace my-ns pod-security.kubernetes.io/enforce=restricted" },
      { q: "Which CIS Kubernetes Benchmark checks are most important?", a: "CIS 1.1 (API Server), CIS 4.2 (Kubelet), CIS 5.1 (RBAC). Tools: kube-bench runs directly on the node and gives Pass/Fail per check." },
      { q: "How do I secure the Kubernetes supply chain?", a: "Image signing with Cosign/Sigstore, admission webhook that only allows signed images (Connaisseur or Kyverno), SBOM generation per image with Syft." },
    ]).map(item => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">

        {/* Not a Pentest Notice */}
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">&quot;Not a Pentest&quot; Notice</strong>:{" "}
          {pick(isDE, "Dieser Guide ist für die Absicherung deiner eigenen Kubernetes-Infrastruktur. Keine Angriffs-Tools.", "This guide is for hardening your own Kubernetes infrastructure. No attack tools.")}
        </div>

        {/* Hero */}
        <h1 className="text-4xl font-bold mb-4 text-gray-100">
          {pick(isDE, "Kubernetes Security Hardening 2026", "Kubernetes Security Hardening 2026")}
        </h1>
        <p className="text-lg text-gray-300 mb-4">
          {pick(isDE, "Kubernetes ist die meistgenutzte Container-Orchestrierung — und eines der komplexesten Angriffsziele. Falsch konfigurierte RBAC-Bindings, fehlende Network Policies und unsichere Images kosten produktive Cluster täglich Traffic, Daten und Verfügbarkeit.", "Kubernetes is the most widely used container orchestration platform — and one of the most complex attack targets. Misconfigured RBAC bindings, missing network policies and insecure images cost production clusters traffic, data and availability every day.")}
        </p>
        <p className="text-lg text-gray-300 mb-8">
          {pick(isDE, "Dieser Pillar-Guide deckt alle Kernbereiche ab: RBAC, Network Policies, Pod Security, Secrets Management, Supply Chain und Compliance. Mit Copy-Paste-Beispielen und Links zu Runbooks für jeden Schritt.", "This pillar guide covers all core areas: RBAC, Network Policies, Pod Security, Secrets Management, Supply Chain and Compliance. With copy-paste examples and runbook links for every step.")}
        </p>

        {/* TL;DR Checklist */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {pick(isDE, "TL;DR — Kubernetes Security Checkliste", "TL;DR — Kubernetes Security Checklist")}
          </h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="grid gap-2 sm:grid-cols-2">
              {(isDE ? [
                ["✅ RBAC", "Least-Privilege für alle Service Accounts"],
                ["✅ Network Policies", "Default-Deny + explizite Regeln"],
                ["✅ Pod Security", "restricted PSA auf allen Produktions-Namespaces"],
                ["✅ Secrets", "Kein Plaintext in YAML — Vault oder Sealed Secrets"],
                ["✅ Image Signing", "Nur signierte Images per Admission Webhook"],
                ["✅ Runtime", "Falco oder Tetragon für Anomalie-Erkennung"],
                ["✅ Audit Logging", "API-Server-Audit-Log auf external Sink"],
                ["✅ CIS Benchmark", "kube-bench regelmäßig ausführen"],
                ["✅ etcd Verschlüsselung", "Encryption at Rest für Secrets"],
                ["✅ Netzwerk-Segmentierung", "Ingress-Controller mit WAF"],
              ] : [
                ["✅ RBAC", "Least-privilege for all service accounts"],
                ["✅ Network Policies", "Default-deny + explicit rules"],
                ["✅ Pod Security", "Restricted PSA on all production namespaces"],
                ["✅ Secrets", "No plaintext in YAML — Vault or Sealed Secrets"],
                ["✅ Image Signing", "Signed images only via admission webhook"],
                ["✅ Runtime", "Falco or Tetragon for anomaly detection"],
                ["✅ Audit Logging", "API server audit log to external sink"],
                ["✅ CIS Benchmark", "Run kube-bench regularly"],
                ["✅ etcd Encryption", "Encryption at rest for secrets"],
                ["✅ Network Segmentation", "Ingress controller with WAF"],
              ]).map(([label, desc]) => (
                <div key={label} className="flex items-start gap-3 p-3 rounded-lg bg-gray-900 border border-gray-700">
                  <span className="text-cyan-400 font-mono text-sm font-bold shrink-0">{label}</span>
                  <span className="text-sm text-gray-300">{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 1: RBAC */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {pick(isDE, "1. RBAC — Role-Based Access Control", "1. RBAC — Role-Based Access Control")}
          </h2>
          <p className="text-gray-300 mb-4">
            {pick(isDE, "RBAC ist das Fundament jeder Kubernetes-Absicherung. Das Ziel: jeder Service Account und jeder Benutzer hat genau die Rechte, die er für seine Aufgabe braucht — nicht mehr.", "RBAC is the foundation of any Kubernetes security setup. The goal: every service account and every user has exactly the permissions needed for their task — nothing more.")}
          </p>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto mb-4 text-sm font-mono">
            <div className="text-gray-400 mb-2">{pick(isDE, "# FALSCH — cluster-admin für Workload", "# WRONG — cluster-admin for workload")}</div>
            <div className="text-red-400">{"apiVersion: rbac.authorization.k8s.io/v1"}</div>
            <div className="text-red-400">{"kind: ClusterRoleBinding"}</div>
            <div className="text-red-400">{"roleRef:"}</div>
            <div className="text-red-400">{"  name: cluster-admin  # ❌ NIE für Workloads"}</div>
            <div className="mt-4 text-gray-400 mb-2">{pick(isDE, "# RICHTIG — Least-Privilege Role", "# CORRECT — Least-Privilege Role")}</div>
            <div>{"apiVersion: rbac.authorization.k8s.io/v1"}</div>
            <div>{"kind: Role"}</div>
            <div>{"metadata:"}</div>
            <div>{"  namespace: my-app"}</div>
            <div>{"rules:"}</div>
            <div>{"- apiGroups: [\"\"]"}</div>
            <div>{"  resources: [\"pods\"]"}</div>
            <div>{"  verbs: [\"get\", \"list\"]  # ✅ nur lesen"}</div>
          </div>
          <div className="bg-red-900 border border-red-700 p-4 rounded-lg mb-4">
            <h3 className="font-bold text-red-300 mb-2">{pick(isDE, "Häufige RBAC-Fehler", "Common RBAC Mistakes")}</h3>
            <ul className="space-y-1 text-sm text-red-200">
              {(isDE ? [
                "cluster-admin für CI/CD-Pipelines oder Operators vergeben",
                "Wildcard-Verbs (*) statt expliziter get/list/watch",
                "Service Accounts ohne RoleBindings — sie erben default-Rechte",
                "Keine regelmäßigen Audits (kubectl auth can-i --list)",
              ] : [
                "Granting cluster-admin to CI/CD pipelines or operators",
                "Wildcard verbs (*) instead of explicit get/list/watch",
                "Service accounts without role bindings — they inherit default permissions",
                "No regular audits (kubectl auth can-i --list)",
              ]).map(item => <li key={item}>• {item}</li>)}
            </ul>
          </div>
        </section>

        {/* Section 2: Network Policies */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {pick(isDE, "2. Network Policies — Default-Deny zuerst", "2. Network Policies — Default-Deny First")}
          </h2>
          <p className="text-gray-300 mb-4">
            {pick(isDE, "Ohne Network Policies kann jeder Pod mit jedem anderen Pod im Cluster kommunizieren. Default-Deny-Regeln als Baseline, dann explizite Erlaubnisse.", "Without network policies, every pod can communicate with every other pod in the cluster. Set default-deny rules as a baseline, then add explicit allow rules.")}
          </p>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto mb-4 text-sm font-mono">
            <div className="text-gray-400 mb-2">{pick(isDE, "# Default-Deny für alle Namespaces", "# Default-Deny for all namespaces")}</div>
            <div>{"apiVersion: networking.k8s.io/v1"}</div>
            <div>{"kind: NetworkPolicy"}</div>
            <div>{"metadata:"}</div>
            <div>{"  name: default-deny-all"}</div>
            <div>{"  namespace: production"}</div>
            <div>{"spec:"}</div>
            <div>{"  podSelector: {}  # alle Pods"}</div>
            <div>{"  policyTypes:"}</div>
            <div>{"  - Ingress"}</div>
            <div>{"  - Egress"}</div>
            <div className="mt-4 text-gray-400 mb-2">{pick(isDE, "# Explizit erlauben: Frontend → Backend", "# Explicitly allow: Frontend → Backend")}</div>
            <div>{"apiVersion: networking.k8s.io/v1"}</div>
            <div>{"kind: NetworkPolicy"}</div>
            <div>{"metadata:"}</div>
            <div>{"  name: allow-frontend-to-backend"}</div>
            <div>{"spec:"}</div>
            <div>{"  podSelector:"}</div>
            <div>{"    matchLabels:"}</div>
            <div>{"      app: backend"}</div>
            <div>{"  ingress:"}</div>
            <div>{"  - from:"}</div>
            <div>{"    - podSelector:"}</div>
            <div>{"        matchLabels:"}</div>
            <div>{"          app: frontend"}</div>
            <div>{"    ports:"}</div>
            <div>{"    - port: 8080"}</div>
          </div>
        </section>

        {/* Section 3: Pod Security */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {pick(isDE, "3. Pod Security Admission (PSA)", "3. Pod Security Admission (PSA)")}
          </h2>
          <p className="text-gray-300 mb-4">
            {pick(isDE, "PodSecurityPolicy wurde in K8s 1.25 entfernt. Der Nachfolger ist Pod Security Admission — Labels auf Namespace-Ebene kontrollieren die erlaubten Security-Kontexte.", "PodSecurityPolicy was removed in K8s 1.25. The replacement is Pod Security Admission — namespace-level labels control the allowed security contexts.")}
          </p>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto mb-4 text-sm font-mono">
            <div className="text-gray-400 mb-2">{pick(isDE, "# Namespace auf restricted setzen", "# Set namespace to restricted")}</div>
            <div>{"kubectl label namespace production \\"}</div>
            <div>{"  pod-security.kubernetes.io/enforce=restricted \\"}</div>
            <div>{"  pod-security.kubernetes.io/enforce-version=latest \\"}</div>
            <div>{"  pod-security.kubernetes.io/warn=restricted \\"}</div>
            <div>{"  pod-security.kubernetes.io/audit=restricted"}</div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 mb-4">
            {[
              { level: "privileged", color: "red", desc: pick(isDE, "Keine Einschränkungen — NUR für System-Namespaces", "No restrictions — ONLY for system namespaces") },
              { level: "baseline", color: "yellow", desc: pick(isDE, "Blockiert bekannte Privilege-Escalations", "Blocks known privilege escalations") },
              { level: "restricted", color: "green", desc: pick(isDE, "Maximale Einschränkung — Ziel für alle Produktions-Workloads", "Maximum restriction — target for all production workloads") },
            ].map(p => (
              <div key={p.level} className={`p-4 rounded-lg border ${
                p.color === "red" ? "bg-red-900 border-red-700" :
                p.color === "yellow" ? "bg-yellow-900 border-yellow-700" :
                "bg-green-900 border-green-700"
              }`}>
                <p className={`font-bold mb-1 font-mono ${p.color === "red" ? "text-red-300" : p.color === "yellow" ? "text-yellow-300" : "text-green-300"}`}>{p.level}</p>
                <p className={`text-sm ${p.color === "red" ? "text-red-200" : p.color === "yellow" ? "text-yellow-200" : "text-green-200"}`}>{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Secrets */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {pick(isDE, "4. Secrets Management", "4. Secrets Management")}
          </h2>
          <p className="text-gray-300 mb-4">
            {pick(isDE, "Kubernetes Secrets sind standardmäßig nur base64-kodiert — nicht verschlüsselt. Drei Schutzschichten sind nötig: Encryption at Rest, externer Secrets-Store und keine Secrets in Git.", "Kubernetes Secrets are base64-encoded by default — not encrypted. Three protection layers are needed: encryption at rest, external secrets store and no secrets in Git.")}
          </p>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="flex items-start space-x-4 mb-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
              <div>
                <div className="font-semibold text-gray-100">{pick(isDE, "etcd Encryption at Rest", "etcd Encryption at Rest")}</div>
                <div className="text-sm text-gray-300">{pick(isDE, "EncryptionConfiguration mit AES-CBC oder Secretbox in der API-Server-Konfiguration aktivieren.", "Enable EncryptionConfiguration with AES-CBC or Secretbox in API server configuration.")}</div>
              </div>
            </div>
            <div className="flex items-start space-x-4 mb-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
              <div>
                <div className="font-semibold text-gray-100">{pick(isDE, "Externer Secrets Store", "External Secrets Store")}</div>
                <div className="text-sm text-gray-300">{pick(isDE, "HashiCorp Vault mit External Secrets Operator oder Sealed Secrets (Bitnami) für sichere Secret-Rotation.", "HashiCorp Vault with External Secrets Operator or Sealed Secrets (Bitnami) for secure secret rotation.")}</div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
              <div>
                <div className="font-semibold text-gray-100">{pick(isDE, "Git-Secrets-Scanning", "Git Secrets Scanning")}</div>
                <div className="text-sm text-gray-300">{pick(isDE, "Gitleaks oder detect-secrets als Pre-Commit-Hook und in der CI/CD-Pipeline.", "Gitleaks or detect-secrets as pre-commit hook and in the CI/CD pipeline.")}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Supply Chain */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {pick(isDE, "5. Supply Chain Security", "5. Supply Chain Security")}
          </h2>
          <p className="text-gray-300 mb-4">
            {pick(isDE, "Kompromittierte Images sind einer der häufigsten Angriffsvektoren. Nur Images aus verifizierten Quellen dürfen in den Cluster.", "Compromised images are one of the most common attack vectors. Only images from verified sources should enter the cluster.")}
          </p>
          <div className="grid gap-4 sm:grid-cols-2 mb-4">
            {(isDE ? [
              { title: "Image Signing mit Cosign", desc: "cosign sign --key cosign.key my-image:tag nach jedem Build. Admission Webhook verifiziert Signatur vor dem Deploy." },
              { title: "Vulnerability Scanning mit Trivy", desc: "trivy image --exit-code 1 --severity HIGH,CRITICAL my-image:tag in der CI-Pipeline. Bei Findings kein Deploy." },
              { title: "SBOM-Generierung", desc: "syft my-image:tag -o spdx-json > sbom.json — vollständige Abhängigkeitsliste für Compliance und Audit." },
              { title: "Admission Webhook (Kyverno)", desc: "ClusterPolicy die nur signierte Images aus erlaubten Registries akzeptiert. Unsigned = blocked." },
            ] : [
              { title: "Image Signing with Cosign", desc: "cosign sign --key cosign.key my-image:tag after every build. Admission webhook verifies signature before deploy." },
              { title: "Vulnerability Scanning with Trivy", desc: "trivy image --exit-code 1 --severity HIGH,CRITICAL my-image:tag in the CI pipeline. Block deploy on findings." },
              { title: "SBOM Generation", desc: "syft my-image:tag -o spdx-json > sbom.json — full dependency list for compliance and audit." },
              { title: "Admission Webhook (Kyverno)", desc: "ClusterPolicy that only accepts signed images from allowed registries. Unsigned = blocked." },
            ]).map(item => (
              <div key={item.title} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <h3 className="font-bold text-cyan-400 mb-2 text-sm">{item.title}</h3>
                <p className="text-sm text-gray-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 6: Runtime Protection */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {pick(isDE, "6. Runtime Protection", "6. Runtime Protection")}
          </h2>
          <p className="text-gray-300 mb-4">
            {pick(isDE, "Statische Scans und Admission Checks fangen Konfigurationsfehler ab. Runtime-Security erkennt Angriffe zur Laufzeit — Privilege-Escalation, unerwartete Shell-Ausführungen, Dateiänderungen.", "Static scans and admission checks catch configuration errors. Runtime security detects attacks at runtime — privilege escalation, unexpected shell executions, file modifications.")}
          </p>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 mb-4">
            <h3 className="font-bold text-cyan-400 mb-3">Falco</h3>
            <div className="bg-gray-900 text-green-400 p-3 rounded text-sm font-mono mb-3 overflow-x-auto">
              <div>{"# Shell in Container ausgeführt — kritischer Alert"}</div>
              <div>{"- rule: Terminal shell in container"}</div>
              <div>{"  desc: A shell was used in a container"}</div>
              <div>{"  condition: container and shell_procs and proc.tty != 0"}</div>
              <div>{"  output: Shell in container (user=%user.name container=%container.name)"}</div>
              <div>{"  priority: WARNING"}</div>
            </div>
            <p className="text-sm text-gray-300">{pick(isDE, "Falco überwacht Systemcalls und sendet Alerts zu Slack, PagerDuty oder einem SIEM. Kein Agent im Container selbst nötig — läuft als DaemonSet.", "Falco monitors system calls and sends alerts to Slack, PagerDuty or a SIEM. No agent inside the container needed — runs as DaemonSet.")}</p>
          </div>
        </section>

        {/* Section 7: Compliance */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {pick(isDE, "7. Compliance & CIS Benchmark", "7. Compliance & CIS Benchmark")}
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">CIS</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">{pick(isDE, "Bereich", "Area")}</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">{pick(isDE, "Prüfung", "Check")}</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase">kube-bench</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["1.1", pick(isDE, "API Server", "API Server"), pick(isDE, "anon-auth=false, audit-log aktiviert", "anon-auth=false, audit-log enabled"), "✅"],
                  ["1.2", pick(isDE, "API Server Auth", "API Server Auth"), pick(isDE, "RBAC aktiviert, Node-Auth", "RBAC enabled, node auth"), "✅"],
                  ["2.1", "etcd", pick(isDE, "TLS, peer-auth", "TLS, peer auth"), "✅"],
                  ["3.1", pick(isDE, "Control Plane", "Control Plane"), pick(isDE, "Kubelet-Auth, Cert-Rotation", "Kubelet auth, cert rotation"), "✅"],
                  ["4.2", "Kubelet", pick(isDE, "anon=false, read-only=false", "anon=false, read-only=false"), "✅"],
                  ["5.1", "RBAC", pick(isDE, "Keine cluster-admin Wildcard", "No cluster-admin wildcard"), "✅"],
                  ["5.2", pick(isDE, "Pod Security", "Pod Security"), pick(isDE, "PSA restricted auf Prod", "PSA restricted on prod"), "✅"],
                  ["5.7", pick(isDE, "Network Policies", "Network Policies"), pick(isDE, "Default-Deny in allen NS", "Default-deny in all NS"), "✅"],
                ].map(([cis, area, check, status], i) => (
                  <tr key={cis} className={`border-b border-gray-700 ${i % 2 === 1 ? "bg-gray-800/50" : ""}`}>
                    <td className="px-4 py-3 text-sm font-mono text-cyan-400">{cis}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-300">{area}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{check}</td>
                    <td className="px-4 py-3 text-center text-green-400">{status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto mt-4 text-sm font-mono">
            <div className="text-gray-400 mb-2">{pick(isDE, "# kube-bench ausführen (als Job im Cluster)", "# Run kube-bench (as job in cluster)")}</div>
            <div>{"kubectl apply -f https://raw.githubusercontent.com/aquasecurity/kube-bench/main/job.yaml"}</div>
            <div>{"kubectl logs job/kube-bench"}</div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {pick(isDE, "FAQ zur Kubernetes-Absicherung", "Kubernetes Security FAQ")}
          </h2>
          <div className="space-y-3">
            {(isDE ? [
              { q: "Was ist der wichtigste erste Schritt bei der Kubernetes-Absicherung?", a: "RBAC richtig konfigurieren: Least-Privilege-Prinzip für alle Service Accounts, keine cluster-admin-Bindungen für Workloads, regelmäßige Role-Audits." },
              { q: "Wie teste ich meine Kubernetes Network Policies?", a: "Mit kubectl exec in einen Test-Pod und curl/netcat zu anderen Services. Blockierte Verbindungen MÜSSEN einen Timeout liefern. Verwende cilium-connectivity-test für automatisierte Tests." },
              { q: "Was ist Pod Security Admission und wie aktiviere ich es?", a: "PSA ersetzt PodSecurityPolicy (seit K8s 1.25 entfernt). Label auf Namespace setzen: kubectl label namespace my-ns pod-security.kubernetes.io/enforce=restricted" },
              { q: "Welche CIS Kubernetes Benchmark Checks sind am wichtigsten?", a: "CIS 1.1 (API Server), CIS 4.2 (Kubelet), CIS 5.1 (RBAC). Tools: kube-bench läuft direkt auf dem Node und gibt Pass/Fail pro Check aus." },
              { q: "Wie sichere ich die Kubernetes Supply Chain ab?", a: "Image Signing mit Cosign/Sigstore, Admission Webhook der nur signierte Images zulässt (Connaisseur oder Kyverno), SBOM-Generierung pro Image mit Syft." },
            ] : [
              { q: "What is the most important first step in securing Kubernetes?", a: "Configure RBAC correctly: least-privilege for all service accounts, no cluster-admin bindings for workloads, regular role audits." },
              { q: "How do I test my Kubernetes Network Policies?", a: "Use kubectl exec into a test pod and curl/netcat to other services. Blocked connections MUST produce a timeout. Use cilium-connectivity-test for automated tests." },
              { q: "What is Pod Security Admission and how do I enable it?", a: "PSA replaces PodSecurityPolicy (removed since K8s 1.25). Set a label on the namespace: kubectl label namespace my-ns pod-security.kubernetes.io/enforce=restricted" },
              { q: "Which CIS Kubernetes Benchmark checks are most important?", a: "CIS 1.1 (API Server), CIS 4.2 (Kubelet), CIS 5.1 (RBAC). Tools: kube-bench runs directly on the node and gives Pass/Fail per check." },
              { q: "How do I secure the Kubernetes supply chain?", a: "Image signing with Cosign/Sigstore, admission webhook that only allows signed images (Connaisseur or Kyverno), SBOM generation per image with Syft." },
            ]).map(item => (
              <div key={item.q} className="rounded-xl border border-white/10 bg-white/[0.02] px-5 py-4">
                <p className="font-semibold text-sm text-white mb-1">{item.q}</p>
                <p className="text-sm text-gray-400 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Further Resources */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {pick(isDE, "Weiterführende Ressourcen", "Further Resources")}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { href: `/${locale}/moltbot/container-security-docker-kubernetes`, label: pick(isDE, "🐳 Container Security", "🐳 Container Security"), desc: pick(isDE, "Docker & K8s Runbook", "Docker & K8s Runbook") },
              { href: `/${locale}/moltbot/zero-trust-architecture`, label: pick(isDE, "🔐 Zero Trust", "🔐 Zero Trust"), desc: pick(isDE, "ZTA + RBAC Runbook", "ZTA + RBAC Runbook") },
              { href: `/${locale}/moltbot/vulnerability-scanning`, label: pick(isDE, "🔍 Vulnerability Scanning", "🔍 Vulnerability Scanning"), desc: pick(isDE, "Trivy + Renovate Runbook", "Trivy + Renovate Runbook") },
              { href: `/${locale}/securitycheck`, label: pick(isDE, "🛡️ Security Check", "🛡️ Security Check"), desc: pick(isDE, "Jetzt prüfen", "Check now") },
              { href: `/${locale}/moltbot/devsecops-pipeline`, label: pick(isDE, "⚙️ DevSecOps Pipeline", "⚙️ DevSecOps Pipeline"), desc: pick(isDE, "CI/CD Security Runbook", "CI/CD Security Runbook") },
              { href: `/${locale}/solutions/kubernetes-security-hardening`, label: pick(isDE, "🏢 Enterprise K8s", "🏢 Enterprise K8s"), desc: pick(isDE, "Enterprise Lösung", "Enterprise Solution") },
            ].map(link => (
              <a key={link.href} href={link.href} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
                <div className="font-semibold text-cyan-400">{link.label}</div>
                <div className="text-sm text-gray-300">{link.desc}</div>
              </a>
            ))}
          </div>
        </section>

      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </div>
  )
}
