import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/openclaw-security-2026"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const title = "OpenClaw Security 2026: Complete Hardening Guide & CVE Tracker"
  const description = "The definitive OpenClaw security guide for 2026. Real CVEs, hardening checklists, network security, container hardening, supply chain security, and incident response playbooks."
  return {
    title,
    description,
    keywords: [
      "OpenClaw security 2026", "openclaw hardening", "self-hosted security",
      "openclaw CVE", "websocket security", "container hardening", "supply chain security",
      "openclaw checklist", "security operations", "NIS2 compliance"
    ],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: {
      title,
      description,
      type: "article",
      url: pageUrl,
      images: ["/og-image.png"],
    },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const TOC = [
  { id: "status", label: "Status 2026 — Lagebericht" },
  { id: "cve-matrix", label: "CVE & Angriffsmatrix" },
  { id: "checklist", label: "Hardening Checklist (24 Items)" },
  { id: "network", label: "Netzwerk & Firewall" },
  { id: "auth", label: "Authentifizierung & Secrets" },
  { id: "container", label: "Container & Kubernetes" },
  { id: "websocket", label: "WebSocket Security" },
  { id: "supply-chain", label: "Supply Chain Security" },
  { id: "monitoring", label: "Monitoring & Alerting" },
  { id: "incident", label: "Incident Response" },
  { id: "compliance", label: "GDPR / NIS2 Compliance" },
  { id: "faq", label: "FAQ" },
]

export default function OpenclawSecurity2026Page({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()

  const pageUrl = `${SITE_URL}/${locale}${PATH}`

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    name: "OpenClaw Security 2026: Complete Hardening Guide",
    description: "The definitive OpenClaw security guide for 2026 with real CVEs, hardening checklists, and incident response playbooks.",
    url: pageUrl,
    author: { "@type": "Organization", name: "ClawGuru Security Team" },
    publisher: { "@type": "Organization", name: "ClawGuru", url: "https://clawguru.org" },
    dateModified: "2026-04-11",
  }

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Was sind die häufigsten Sicherheitslücken in OpenClaw 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Die häufigsten Probleme sind: offene Admin-Ports ohne VPN-Schutz, fehlende WebSocket Origin-Validierung, unrotierte API-Keys und unsignierte Skills mit unsicheren Dependencies.",
        },
      },
      {
        "@type": "Question",
        name: "Wie sichere ich mein OpenClaw-Deployment gegen Prompt-Injection ab?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Implementiere Input-Sanitization für alle LLM-Eingaben, beschränke Tool-Berechtigungen auf das Minimum, aktiviere Sandboxing und führe regelmäßige Audits der Skill-Bibliothek durch.",
        },
      },
      {
        "@type": "Question",
        name: "Ist OpenClaw NIS2-konform?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "OpenClaw kann NIS2-konform betrieben werden wenn Audit-Logging aktiviert ist, Incident-Response-Prozesse dokumentiert sind und regelmäßige Vulnerability-Assessments durchgeführt werden.",
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">

          {/* Not a Pentest Notice */}
          <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
            <strong className="text-amber-100">&quot;Not a Pentest&quot; Notice</strong>: Dieser Guide dient ausschließlich zur Härtung eigener Systeme. Keine Angriffswerkzeuge.
          </div>

          {/* Hero */}
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-700 bg-gray-800 text-xs text-gray-300 mb-4">
              📌 Pillar Page · Kontinuierlich aktualisiert · April 2026
            </div>
            <h1 className="text-4xl md:text-5xl font-black leading-tight text-gray-100 mb-4">
              OpenClaw Security 2026
              <span className="block text-cyan-400 text-2xl md:text-3xl font-bold mt-1">
                Der komplette Lagebericht & Hardening-Guide
              </span>
            </h1>
            <p className="text-lg text-gray-300 max-w-3xl mb-6">
              Reale CVEs, praxiserprobte Hardening-Checklisten, Netzwerk- und Container-Security,
              Supply-Chain-Absicherung und Incident-Response-Playbooks — alles in einem Dokument.
              10 Minuten lesen, 90% sicherer als &quot;läuft doch&quot;-Deployments.
            </p>

            {/* Stats bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Angriffsklassen dokumentiert", value: "8+" },
                { label: "Checklist-Items", value: "24" },
                { label: "Code-Snippets", value: "10+" },
                { label: "Locales / Sprachen", value: "16" },
              ].map((s) => (
                <div key={s.label} className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
                  <div className="text-2xl font-black text-cyan-400">{s.value}</div>
                  <div className="text-xs text-gray-400 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Two-column layout: content + sticky TOC */}
          <div className="grid lg:grid-cols-[1fr_280px] gap-8 items-start">

            {/* Main content */}
            <div className="space-y-10">

              {/* STATUS 2026 */}
              <section id="status" className="mb-10">
                <h2 className="text-2xl font-semibold mb-4 text-gray-100">Status 2026 — Lagebericht</h2>
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 mb-4">
                  <p className="text-gray-300 mb-4">
                    Das Hauptproblem ist selten der Code — es sind <strong className="text-gray-100">Exposition, fehlende Disziplin und unrotierte Credentials</strong>.
                    Folgende Angriffsvektoren sind 2026 am häufigsten in freier Wildbahn anzutreffen:
                  </p>
                  <div className="grid md:grid-cols-3 gap-3">
                    {[
                      { icon: "🌐", title: "Offene Admin-Ports", risk: "KRITISCH", desc: "Gateway/API-Ports ohne VPN-Schutz direkt im Internet." },
                      { icon: "🔑", title: "Unrotierte API-Keys", risk: "HOCH", desc: "Langlebige Keys in .env-Dateien, niemals rotiert." },
                      { icon: "⚡", title: "WebSocket-Hijacking", risk: "HOCH", desc: "Fehlende Origin-Validierung ermöglicht Remote-Control." },
                      { icon: "📦", title: "Malicious Skills", risk: "MITTEL", desc: "Ungeprüfte Dependencies mit Backdoors oder Secrets." },
                      { icon: "💉", title: "Prompt Injection", risk: "MITTEL", desc: "Tool/Browser-Kontext zur Datenexfiltration missbraucht." },
                      { icon: "📋", title: "Fehlende Audit-Logs", risk: "MITTEL", desc: "Kein Logging = kein Incident-Detection = kein NIS2." },
                    ].map((item) => (
                      <div key={item.title} className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">{item.icon}</span>
                          <span className="font-semibold text-gray-100 text-sm">{item.title}</span>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold mr-2 ${
                          item.risk === "KRITISCH" ? "bg-red-900 text-red-300" :
                          item.risk === "HOCH" ? "bg-orange-900 text-orange-300" :
                          "bg-yellow-900 text-yellow-300"
                        }`}>{item.risk}</span>
                        <p className="text-xs text-gray-400 mt-2">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* CVE MATRIX */}
              <section id="cve-matrix" className="mb-10">
                <h2 className="text-2xl font-semibold mb-4 text-gray-100">CVE &amp; Angriffsmatrix</h2>
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 overflow-x-auto">
                  <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg">
                    <thead className="bg-gray-800">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Angriffsklasse</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">CVSS</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Vektor</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Mitigierung</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { attack: "WebSocket Hijacking", cvss: "9.1", vector: "NETWORK", fix: "Origin-Header validieren, CSRF-Token" },
                        { attack: "API Key Leakage", cvss: "8.6", vector: "NETWORK", fix: "Key-Rotation, Vault-Integration" },
                        { attack: "Remote Code Execution via Skills", cvss: "8.4", vector: "NETWORK", fix: "Skill-Sandboxing, Dependency-Pinning" },
                        { attack: "Prompt Injection", cvss: "7.5", vector: "NETWORK", fix: "Input-Sanitization, Tool-Scope-Limits" },
                        { attack: "Unauthenticated Gateway Access", cvss: "9.8", vector: "NETWORK", fix: "mTLS, VPN, IP-Allowlist" },
                        { attack: "Supply Chain Poisoning", cvss: "8.1", vector: "LOCAL", fix: "SBOM-Verifizierung, Sigstore Cosign" },
                        { attack: "Container Escape", cvss: "8.8", vector: "LOCAL", fix: "Seccomp, AppArmor, Non-Root" },
                        { attack: "Log Injection / Log4Shell-Style", cvss: "7.0", vector: "NETWORK", fix: "Input-Encoding, structured logging" },
                      ].map((row, i) => (
                        <tr key={row.attack} className={`border-b border-gray-700 ${i % 2 === 1 ? "bg-gray-800/50" : ""}`}>
                          <td className="px-4 py-3 text-sm text-gray-100 font-medium">{row.attack}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                              parseFloat(row.cvss) >= 9 ? "bg-red-900 text-red-300" :
                              parseFloat(row.cvss) >= 7 ? "bg-orange-900 text-orange-300" :
                              "bg-yellow-900 text-yellow-300"
                            }`}>{row.cvss}</span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-400">{row.vector}</td>
                          <td className="px-4 py-3 text-sm text-gray-300">{row.fix}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* HARDENING CHECKLIST */}
              <section id="checklist" className="mb-10">
                <h2 className="text-2xl font-semibold mb-4 text-gray-100">Hardening Checklist (24 Items)</h2>
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <div className="grid md:grid-cols-2 gap-6">
                    {[
                      {
                        category: "🌐 Netzwerk & Exposition",
                        items: [
                          "Private Networking (VPN/Tailscale/WireGuard) — keine Admin-Ports im Internet",
                          "IP-Allowlist für API-Gateway und Admin-UI",
                          "TLS 1.3 everywhere, HSTS aktiviert",
                          "Reverse-Proxy mit WAF (Traefik/Nginx + CrowdSec)",
                        ],
                      },
                      {
                        category: "🔑 Auth & Secrets",
                        items: [
                          "API-Keys rotieren alle 90 Tage (automatisiert)",
                          "Secrets in Vault / K8s Secrets / Doppler — nie in .env committed",
                          "JWT mit kurzer Expiry (15 min Access, 7d Refresh)",
                          "MFA für alle Admin-Accounts aktiviert",
                        ],
                      },
                      {
                        category: "⚡ WebSocket Security",
                        items: [
                          "Origin-Header validieren (allowlist-based)",
                          "CSRF-Token für alle WebSocket-Upgrades",
                          "Session-Binding und automatischer Reconnect-Schutz",
                          "Rate-Limiting auf WebSocket-Verbindungen",
                        ],
                      },
                      {
                        category: "📦 Container & Dependencies",
                        items: [
                          "Alle Images scannen (Trivy/Grype) vor jedem Deploy",
                          "Non-Root User in allen Containern (runAsNonRoot: true)",
                          "ReadOnlyRootFilesystem aktiviert",
                          "Dependency-Pinning + SBOM generieren (Syft)",
                        ],
                      },
                      {
                        category: "📊 Monitoring & Logging",
                        items: [
                          "Structured Logging (JSON) mit Korrelations-IDs",
                          "Alert auf Auth-Failures > 5/min (Prometheus/Alertmanager)",
                          "Anomalie-Erkennung auf API-Request-Patterns",
                          "Log-Retention >= 90 Tage (GDPR/NIS2-Anforderung)",
                        ],
                      },
                      {
                        category: "🔄 Operations & Compliance",
                        items: [
                          "Incident-Runbook dokumentiert und geübt",
                          "Backup + Restore-Test monatlich",
                          "Audit-Log für alle privilegierten Aktionen",
                          "Quarterly Security Review mit CVE-Tracking",
                        ],
                      },
                    ].map((group) => (
                      <div key={group.category} className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                        <h3 className="font-bold text-cyan-400 mb-3 text-sm">{group.category}</h3>
                        <ul className="space-y-2">
                          {group.items.map((item) => (
                            <li key={item} className="flex items-start gap-2 text-sm text-gray-300">
                              <span className="text-green-400 mt-0.5 flex-shrink-0">✓</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* NETWORK SECURITY */}
              <section id="network" className="mb-10">
                <h2 className="text-2xl font-semibold mb-4 text-gray-100">Netzwerk &amp; Firewall</h2>
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 mb-4">
                  <p className="text-gray-300 mb-4">
                    Der erste Schutzwall: Exposition eliminieren. Jeder öffentlich erreichbare Port, der nicht sein muss, ist ein Risiko.
                  </p>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-sm">{`# iptables Hardening für OpenClaw Host
# Alle eingehenden Verbindungen standardmäßig ablehnen
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT

# Loopback erlauben
iptables -A INPUT -i lo -j ACCEPT

# Established connections erlauben
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# SSH nur von VPN-Subnetz (anpassen!)
iptables -A INPUT -s 10.0.0.0/8 -p tcp --dport 22 -j ACCEPT

# OpenClaw API nur intern (Tailscale/WireGuard Interface)
iptables -A INPUT -i tailscale0 -p tcp --dport 8080 -j ACCEPT
iptables -A INPUT -i wg0 -p tcp --dport 8080 -j ACCEPT

# Prometheus/Grafana nur intern
iptables -A INPUT -i tailscale0 -p tcp --dport 3000 -j ACCEPT
iptables -A INPUT -i tailscale0 -p tcp --dport 9090 -j ACCEPT

# HTTPS von überall (wenn Reverse-Proxy öffentlich)
iptables -A INPUT -p tcp --dport 443 -j ACCEPT
iptables -A INPUT -p tcp --dport 80 -j ACCEPT

# Speichern
iptables-save > /etc/iptables/rules.v4

# Tailscale ACL (JSON) — Zero-Trust Policy
# In Tailscale Admin Console > Access Controls:
# {
#   "acls": [
#     { "action": "accept", "src": ["group:admins"], "dst": ["tag:openclaw:8080"] },
#     { "action": "accept", "src": ["group:monitoring"], "dst": ["tag:openclaw:9090"] }
#   ],
#   "tagOwners": { "tag:openclaw": ["group:admins"] }
# }`}</pre>
                  </div>
                </div>
              </section>

              {/* AUTH & SECRETS */}
              <section id="auth" className="mb-10">
                <h2 className="text-2xl font-semibold mb-4 text-gray-100">Authentifizierung &amp; Secrets Management</h2>
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 mb-4">
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto mb-4">
                    <pre className="text-sm">{`# HashiCorp Vault — Secrets Management für OpenClaw
# 1. Vault starten und initialisieren
vault server -config=/etc/vault.d/vault.hcl

# 2. OpenClaw AppRole konfigurieren
vault auth enable approle
vault write auth/approle/role/openclaw-role \
  secret_id_ttl=24h \
  token_ttl=1h \
  token_max_ttl=4h \
  policies="openclaw-policy"

# 3. Policy definieren
vault policy write openclaw-policy - <<EOF
path "secret/data/openclaw/*" {
  capabilities = ["read"]
}
path "secret/data/openclaw/api-keys" {
  capabilities = ["read", "list"]
}
EOF

# 4. Secrets schreiben
vault kv put secret/openclaw/api-keys \
  openai_key="sk-..." \
  anthropic_key="sk-ant-..." \
  gemini_key="AIza..."

# 5. Automatic Key Rotation (alle 90 Tage)
vault write sys/policies/password/rotation-policy policy=@rotation.hcl

# rotation.hcl:
# rule "length" { min = 32 max = 64 }
# rule "charset" { charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789" }

# 6. Kubernetes Vault Agent Injector
# annotations in Pod spec:
# vault.hashicorp.com/agent-inject: "true"
# vault.hashicorp.com/role: "openclaw-role"
# vault.hashicorp.com/agent-inject-secret-config: "secret/data/openclaw/api-keys"`}</pre>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-blue-900 p-4 rounded-lg border border-blue-700">
                      <h3 className="font-semibold text-blue-300 mb-2">JWT Best Practices</h3>
                      <ul className="text-sm text-blue-200 space-y-1">
                        <li>• Access Token: 15 Minuten TTL</li>
                        <li>• Refresh Token: 7 Tage, rotiert bei Nutzung</li>
                        <li>• RS256 oder ES256 (kein HS256 in Produktion)</li>
                        <li>• Token-Revocation via Redis Blocklist</li>
                      </ul>
                    </div>
                    <div className="bg-green-900 p-4 rounded-lg border border-green-700">
                      <h3 className="font-semibold text-green-300 mb-2">API-Key Hygiene</h3>
                      <ul className="text-sm text-green-200 space-y-1">
                        <li>• Rotation alle 90 Tage automatisiert</li>
                        <li>• Scope-beschränkte Keys (Least Privilege)</li>
                        <li>• Git-History-Scanner (git-secrets, truffleHog)</li>
                        <li>• Niemals in Logs ausgeben</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* CONTAINER SECURITY */}
              <section id="container" className="mb-10">
                <h2 className="text-2xl font-semibold mb-4 text-gray-100">Container &amp; Kubernetes Hardening</h2>
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto mb-4">
                    <pre className="text-sm">{`# Secure OpenClaw Pod Specification
apiVersion: v1
kind: Pod
metadata:
  name: openclaw-secure
  namespace: openclaw
  labels:
    app: openclaw
    security-tier: hardened
spec:
  serviceAccountName: openclaw-sa
  automountServiceAccountToken: false
  securityContext:
    runAsNonRoot: true
    runAsUser: 1000
    runAsGroup: 3000
    fsGroup: 2000
    seccompProfile:
      type: RuntimeDefault
  containers:
  - name: openclaw
    image: openclaw/server:1.2.3@sha256:abc123...  # pinned digest!
    securityContext:
      allowPrivilegeEscalation: false
      readOnlyRootFilesystem: true
      capabilities:
        drop: ["ALL"]
    resources:
      requests:
        memory: "256Mi"
        cpu: "250m"
      limits:
        memory: "512Mi"
        cpu: "500m"
    env:
    - name: OPENCLAW_API_KEY
      valueFrom:
        secretKeyRef:
          name: openclaw-secrets
          key: api-key
    livenessProbe:
      httpGet:
        path: /health
        port: 8080
      initialDelaySeconds: 15
      periodSeconds: 20
    volumeMounts:
    - name: tmp
      mountPath: /tmp
    - name: logs
      mountPath: /var/log/openclaw
  volumes:
  - name: tmp
    emptyDir: {}
  - name: logs
    emptyDir: {}

---
# NetworkPolicy — Zero-Trust
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: openclaw-netpol
  namespace: openclaw
spec:
  podSelector:
    matchLabels:
      app: openclaw
  policyTypes: [Ingress, Egress]
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: nginx-gateway
    ports:
    - protocol: TCP
      port: 8080
  egress:
  - to:
    - namespaceSelector:
        matchLabels:
          name: monitoring
    ports:
    - protocol: TCP
      port: 9090`}</pre>
                  </div>
                  <div className="bg-yellow-900 p-4 rounded-lg border border-yellow-700">
                    <h3 className="font-semibold text-yellow-300 mb-2">⚠️ Image Scanning Pipeline</h3>
                    <p className="text-sm text-yellow-200">Trivy in CI/CD integrieren: <code className="bg-yellow-800 px-1 rounded">trivy image --exit-code 1 --severity HIGH,CRITICAL openclaw/server:latest</code> — bricht den Build bei kritischen CVEs ab.</p>
                  </div>
                </div>
              </section>

              {/* WEBSOCKET SECURITY */}
              <section id="websocket" className="mb-10">
                <h2 className="text-2xl font-semibold mb-4 text-gray-100">WebSocket Security</h2>
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <p className="text-gray-300 mb-4">
                    WebSocket-Verbindungen sind das häufigste Angriffsziel bei OpenClaw-Deployments.
                    Ohne Origin-Validierung kann jede Webseite eine Verbindung zum lokalen OpenClaw aufbauen.
                  </p>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto mb-4">
                    <pre className="text-sm">{`# Nginx WebSocket Security Configuration
server {
    listen 443 ssl http2;
    server_name openclaw.internal;

    # TLS Hardening
    ssl_protocols TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:10m;

    # Security Headers
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header Content-Security-Policy "default-src 'self'; connect-src 'self' wss://openclaw.internal" always;

    location /ws {
        # Origin allowlist — CRITICAL
        set $allowed_origin 0;
        if ($http_origin = "https://openclaw.internal") { set $allowed_origin 1; }
        if ($http_origin = "https://app.clawguru.org") { set $allowed_origin 1; }
        if ($allowed_origin = 0) { return 403 "Forbidden Origin"; }

        add_header 'Access-Control-Allow-Origin' $http_origin always;

        proxy_pass http://openclaw:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;

        # Timeouts
        proxy_read_timeout 3600s;
        proxy_send_timeout 3600s;

        # Rate limiting
        limit_req zone=ws_limit burst=10 nodelay;
    }
}

# Rate limit zone
limit_req_zone $binary_remote_addr zone=ws_limit:10m rate=5r/s;`}</pre>
                  </div>
                </div>
              </section>

              {/* SUPPLY CHAIN SECURITY */}
              <section id="supply-chain" className="mb-10">
                <h2 className="text-2xl font-semibold mb-4 text-gray-100">Supply Chain Security</h2>
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto mb-4">
                    <pre className="text-sm">{`# SBOM generieren mit Syft
syft packages dir:. -o spdx-json > sbom.spdx.json
syft packages dir:. -o cyclonedx-json > sbom.cyclonedx.json

# Grype: SBOM auf Schwachstellen prüfen
grype sbom:sbom.spdx.json --fail-on high

# Cosign: Container-Image signieren (Sigstore)
cosign generate-key-pair
cosign sign --key cosign.key openclaw/server:1.2.3

# Signatur prüfen
cosign verify --key cosign.pub openclaw/server:1.2.3

# package-lock.json / lockfile integrity
npm ci --ignore-scripts   # Keine postinstall-Scripts
npm audit --audit-level=high  # Audit vor jedem Deploy

# truffleHog: Secrets in Git-History scannen
trufflehog git file://. --only-verified

# GitHub Actions: SLSA Provenance
# .github/workflows/release.yml:
# - uses: slsa-framework/slsa-github-generator/.github/workflows/generator_container_slsa3.yml@v1
#   with:
#     image: openclaw/server
#     digest: ${"{{"} steps.build.outputs.digest }}`}</pre>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-blue-900 p-4 rounded-lg border border-blue-700">
                      <h3 className="font-semibold text-blue-300 mb-2">SBOM</h3>
                      <p className="text-sm text-blue-200">Software Bill of Materials mit Syft/Trivy generieren. Pflicht für NIS2 und SOC 2.</p>
                    </div>
                    <div className="bg-green-900 p-4 rounded-lg border border-green-700">
                      <h3 className="font-semibold text-green-300 mb-2">Image Signing</h3>
                      <p className="text-sm text-green-200">Cosign + Sigstore für verifiable builds. Nur signierte Images in Produktion.</p>
                    </div>
                    <div className="bg-red-900 p-4 rounded-lg border border-red-700">
                      <h3 className="font-semibold text-red-300 mb-2">Dependency Audit</h3>
                      <p className="text-sm text-red-200">npm audit + Renovate für automatische Dependency-Updates mit Security-Priorität.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* MONITORING */}
              <section id="monitoring" className="mb-10">
                <h2 className="text-2xl font-semibold mb-4 text-gray-100">Monitoring &amp; Alerting</h2>
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto mb-4">
                    <pre className="text-sm">{`# Prometheus Alerting Rules für OpenClaw Security
groups:
- name: openclaw-security
  rules:

  # Auth-Failures: mehr als 10 in 5 Minuten
  - alert: HighAuthFailureRate
    expr: rate(openclaw_auth_failures_total[5m]) > 2
    for: 2m
    labels:
      severity: critical
    annotations:
      summary: "Hohe Auth-Failure Rate — möglicher Brute-Force"
      description: "{{ $value }} Fehler/s in den letzten 5 Minuten"

  # WebSocket-Verbindungen von unbekannten Origins
  - alert: UnknownOriginWebSocket
    expr: openclaw_ws_unknown_origin_total > 0
    labels:
      severity: warning
    annotations:
      summary: "WebSocket-Verbindung von unbekannter Origin"

  # Vault-Lease-Expiry Warnung
  - alert: VaultLeaseExpiringSoon
    expr: vault_token_ttl < 3600
    labels:
      severity: warning
    annotations:
      summary: "Vault Token läuft in < 1h ab"

  # Ungewöhnliche API-Request-Rate
  - alert: APIRequestAnomalyDetected
    expr: |
      rate(openclaw_api_requests_total[5m])
      > (avg_over_time(openclaw_api_requests_total[1h]) * 3)
    labels:
      severity: warning
    annotations:
      summary: "API-Request-Rate 3x über Durchschnitt"

  # Container-Restart-Loop (mögliches Exploit-Attempt)
  - alert: ContainerRestartLoop
    expr: rate(kube_pod_container_status_restarts_total{namespace="openclaw"}[15m]) > 0.1
    labels:
      severity: critical
    annotations:
      summary: "OpenClaw Container-Restart-Loop erkannt"`}</pre>
                  </div>
                </div>
              </section>

              {/* INCIDENT RESPONSE */}
              <section id="incident" className="mb-10">
                <h2 className="text-2xl font-semibold mb-4 text-gray-100">Incident Response Playbook</h2>
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <div className="space-y-4">
                    {[
                      { step: 1, title: "Erkennung & Triage (0–15 Min)", color: "bg-red-900 border-red-700 text-red-300", desc: "Alert verifizieren, Scope bestimmen. Ist es ein echter Vorfall oder False Positive? Sofort: Chat-Notification an Security-Team, Incident-Ticket anlegen." },
                      { step: 2, title: "Eindämmung (15–30 Min)", color: "bg-orange-900 border-orange-700 text-orange-300", desc: "Betroffene Services isolieren (NetworkPolicy auf Deny setzen), API-Keys rotieren, verdächtige Sessions beenden. Kein Rebuild/Redeploy ohne Forensik." },
                      { step: 3, title: "Forensik & Ursache (30–120 Min)", color: "bg-yellow-900 border-yellow-700 text-yellow-300", desc: "Audit-Logs auswerten, Attack-Path rekonstruieren. Logs sichern (read-only Snapshot). Root-Cause dokumentieren. CVE referenzieren falls bekannt." },
                      { step: 4, title: "Behebung & Restore (2–24h)", color: "bg-blue-900 border-blue-700 text-blue-300", desc: "Patch einspielen, Images neu bauen und scannen, sauberes Backup einspielen, alle Credentials neu generieren. Full-Stack-Deployment aus geprüftem Stand." },
                      { step: 5, title: "Post-Mortem (innerhalb 5 Tage)", color: "bg-green-900 border-green-700 text-green-300", desc: "Blameless Post-Mortem: Timeline, Contributing Factors, Action Items mit Owner und Deadline. Learnings in Runbook eintragen. NIS2-Meldepflicht prüfen (72h)." },
                    ].map((phase) => (
                      <div key={phase.step} className={`flex items-start space-x-4 p-4 rounded-lg border ${phase.color}`}>
                        <div className={`rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 bg-gray-900 text-white`}>
                          {phase.step}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-100">{phase.title}</div>
                          <div className="text-sm text-gray-300 mt-1">{phase.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* COMPLIANCE */}
              <section id="compliance" className="mb-10">
                <h2 className="text-2xl font-semibold mb-4 text-gray-100">GDPR / NIS2 Compliance</h2>
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-bold text-cyan-400 mb-3">NIS2 Art. 21 — Technische Maßnahmen</h3>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li className="flex items-start gap-2"><span className="text-green-400 flex-shrink-0">✓</span>Risikoanalyse und IS-Policies dokumentiert</li>
                        <li className="flex items-start gap-2"><span className="text-green-400 flex-shrink-0">✓</span>Incident Handling mit 72h-Meldepflicht</li>
                        <li className="flex items-start gap-2"><span className="text-green-400 flex-shrink-0">✓</span>Business Continuity + Backup-Prozesse</li>
                        <li className="flex items-start gap-2"><span className="text-green-400 flex-shrink-0">✓</span>Supply Chain Security (SBOM + Signing)</li>
                        <li className="flex items-start gap-2"><span className="text-green-400 flex-shrink-0">✓</span>Schwachstellenmanagement (CVE-Tracking)</li>
                        <li className="flex items-start gap-2"><span className="text-green-400 flex-shrink-0">✓</span>MFA für alle privilegierten Zugriffe</li>
                        <li className="flex items-start gap-2"><span className="text-green-400 flex-shrink-0">✓</span>Encrypted Communications (TLS 1.3)</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-bold text-cyan-400 mb-3">GDPR Technische Anforderungen</h3>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li className="flex items-start gap-2"><span className="text-green-400 flex-shrink-0">✓</span>Verschlüsselung at rest + in transit</li>
                        <li className="flex items-start gap-2"><span className="text-green-400 flex-shrink-0">✓</span>Access Logs mit 90-Tage-Retention</li>
                        <li className="flex items-start gap-2"><span className="text-green-400 flex-shrink-0">✓</span>Datenlokalisierung (EU-Rechenzentrum)</li>
                        <li className="flex items-start gap-2"><span className="text-green-400 flex-shrink-0">✓</span>Right to Erasure implementiert</li>
                        <li className="flex items-start gap-2"><span className="text-green-400 flex-shrink-0">✓</span>Data Breach Notification &lt; 72h</li>
                        <li className="flex items-start gap-2"><span className="text-green-400 flex-shrink-0">✓</span>Privacy by Design in neuen Features</li>
                        <li className="flex items-start gap-2"><span className="text-green-400 flex-shrink-0">✓</span>DPIA für High-Risk Processing</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* FAQ */}
              <section id="faq" className="mb-10">
                <h2 className="text-2xl font-semibold mb-4 text-gray-100">FAQ</h2>
                <div className="space-y-4">
                  {[
                    {
                      q: "Was sind die häufigsten Sicherheitslücken in OpenClaw 2026?",
                      a: "Die häufigsten Probleme sind: offene Admin-Ports ohne VPN-Schutz, fehlende WebSocket Origin-Validierung, unrotierte API-Keys und unsignierte Skills mit unsicheren Dependencies. Alle adressierbar mit dieser Checklist.",
                    },
                    {
                      q: "Wie sichere ich mein OpenClaw-Deployment gegen Prompt-Injection ab?",
                      a: "Implementiere Input-Sanitization für alle LLM-Eingaben, beschränke Tool-Berechtigungen auf das Minimum, aktiviere Sandboxing für Skills und führe regelmäßige Audits der Skill-Bibliothek durch.",
                    },
                    {
                      q: "Ist OpenClaw NIS2-konform betreibbar?",
                      a: "Ja, wenn Audit-Logging aktiviert ist, Incident-Response-Prozesse dokumentiert sind, Supply Chain Security (SBOM) implementiert ist und regelmäßige Vulnerability-Assessments durchgeführt werden.",
                    },
                    {
                      q: "Wie oft müssen API-Keys rotiert werden?",
                      a: "Best Practice: alle 90 Tage automatisiert rotieren. Nach jedem Security-Incident sofort. Verwende HashiCorp Vault oder ähnliche Tools für automatische Rotation ohne Service-Downtime.",
                    },
                    {
                      q: "Reicht Docker ohne Kubernetes für eine sichere OpenClaw-Installation?",
                      a: "Docker alleine ist ausreichend für kleine Deployments, wenn Seccomp-Profile, non-root User, ReadOnlyRootFilesystem und Netzwerk-Isolation (Docker Networks) korrekt konfiguriert sind. Kubernetes bietet mehr Granularität für größere Setups.",
                    },
                  ].map((item) => (
                    <div key={item.q} className="bg-gray-800 border border-gray-700 rounded-lg p-5">
                      <h3 className="font-bold text-cyan-400 mb-2">{item.q}</h3>
                      <p className="text-sm text-gray-300">{item.a}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* FURTHER RESOURCES */}
              <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-4 text-gray-100">Weiterführende Ressourcen</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <a href={`/${locale}/securitycheck`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
                    <div className="font-semibold text-cyan-400">🔍 Security Check</div>
                    <div className="text-sm text-gray-300">HTTP-Header-Scan, Security-Score in Echtzeit</div>
                  </a>
                  <a href={`/${locale}/runbooks`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
                    <div className="font-semibold text-cyan-400">📋 Runbooks</div>
                    <div className="text-sm text-gray-300">600+ ausführbare Security-Playbooks</div>
                  </a>
                  <a href={`/${locale}/openclaw`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
                    <div className="font-semibold text-cyan-400">🦞 OpenClaw Framework</div>
                    <div className="text-sm text-gray-300">Self-Hosted Security Framework Übersicht</div>
                  </a>
                  <a href={`/${locale}/oracle`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
                    <div className="font-semibold text-cyan-400">🔮 Oracle Threat Intel</div>
                    <div className="text-sm text-gray-300">KI-gestützte Bedrohungsanalyse</div>
                  </a>
                  <a href={`/${locale}/openclaw/supply-chain-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
                    <div className="font-semibold text-cyan-400">⛓️ Supply Chain Security</div>
                    <div className="text-sm text-gray-300">SBOM, Cosign, SLSA im Detail</div>
                  </a>
                  <a href={`/${locale}/moltbot/nis2-compliance-setup`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
                    <div className="font-semibold text-cyan-400">📜 NIS2 Compliance Setup</div>
                    <div className="text-sm text-gray-300">NIS2 Art. 21 Implementierungsguide</div>
                  </a>
                </div>
              </section>

            </div>{/* end main content */}

            {/* Sticky TOC sidebar */}
            <aside className="lg:sticky lg:top-8 h-fit">
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-5">
                <div className="font-black text-gray-100 mb-4 text-sm uppercase tracking-wide">Inhaltsverzeichnis</div>
                <ul className="space-y-2 text-sm">
                  {TOC.map((t) => (
                    <li key={t.id}>
                      <a className="text-gray-400 hover:text-cyan-400 transition-colors block py-0.5" href={`#${t.id}`}>{t.label}</a>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 p-4 rounded-lg border border-gray-700 bg-gray-800">
                  <div className="font-bold text-gray-100 text-sm mb-2">Quick Actions</div>
                  <div className="text-xs text-gray-400 mb-3">Wenn du nur 2 Dinge tust:</div>
                  <ol className="text-xs text-gray-300 list-decimal pl-4 space-y-1 mb-4">
                    <li>Keys rotieren (heute!)</li>
                    <li>Admin-Ports schließen</li>
                  </ol>
                  <div className="flex flex-col gap-2">
                    <a href={`/${locale}/securitycheck`} className="px-3 py-2 rounded-lg bg-cyan-900 border border-cyan-700 hover:bg-cyan-800 text-cyan-300 font-bold text-xs text-center transition-colors">
                      Security Check starten →
                    </a>
                    <a href={`/${locale}/runbooks`} className="px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 hover:bg-gray-600 text-gray-300 font-bold text-xs text-center transition-colors">
                      Runbooks öffnen →
                    </a>
                  </div>
                </div>
              </div>
            </aside>

          </div>{/* end grid */}
        </div>
      </div>
    </>
  )
}
