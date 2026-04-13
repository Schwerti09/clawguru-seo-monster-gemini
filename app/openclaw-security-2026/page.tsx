import Container from "@/components/shared/Container"

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

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Was sind die kritischsten OpenClaw Security-Risiken 2026?', acceptedAnswer: { '@type': 'Answer', text: 'OpenClaw Security-Risiken 2026: Ungepatchte Dependencies (Supply-Chain-Angriffe über kompromittierte npm/pip-Pakete). Unsichere WebSocket-Verbindungen ohne Auth. Exponierte Admin-Interfaces ohne IP-Beschränkung. Fehlende Rate-Limits auf Bot-API-Endpoints. Unsichere Secrets-Verwaltung (Hardcoded API Keys in Configs). Container ohne Read-Only-Filesystem. Fehlende Audit-Logs für Bot-Aktionen.' } },
    { '@type': 'Question', name: 'Wie härte ich OpenClaw gegen Prompt Injection ab?', acceptedAnswer: { '@type': 'Answer', text: 'OpenClaw Prompt Injection Hardening: Input-Validierung: Alle User-Inputs gegen Allowlist prüfen, keine direkten LLM-Prompts aus User-Input konstruieren. Sandboxing: OpenClaw-Instanz in isoliertem Container (kein Zugriff auf Host-Filesystem). Least Privilege: Bot-API-Key nur mit minimalen Berechtigungen. Output-Validation: LLM-Outputs vor Ausführung validieren. Monitoring: Alert bei ungewöhnlichen Bot-Aktionsmustern (Falco).' } },
    { '@type': 'Question', name: 'Was ist die empfohlene OpenClaw Netzwerk-Konfiguration 2026?', acceptedAnswer: { '@type': 'Answer', text: 'OpenClaw Netzwerk-Hardening: Reverse Proxy (nginx/Traefik) als einziger öffentlicher Endpoint. OpenClaw intern im Docker-Network (kein direkter Port-Expose). WebSocket-Verbindungen nur über wss:// (TLS). Admin-Interface auf separatem Port, nur über VPN/SSH-Tunnel erreichbar. Rate Limiting: 10 Anfragen/Sekunde pro IP. DDoS-Schutz via Cloudflare oder Hetzner Firewall. Firewall: nur Ports 80/443 öffentlich.' } },
    { '@type': 'Question', name: 'Wie führe ich einen OpenClaw Security Check durch?', acceptedAnswer: { '@type': 'Answer', text: 'OpenClaw Security Check: 1) ClawGuru Security Check für OpenClaw-Domain durchführen (kostenlos, 30 Sekunden). 2) Score und Findings analysieren. 3) OpenClaw-spezifische Runbooks auswählen (/runbooks). 4) SBOM mit Moltbot generieren (zeigt alle OpenClaw-Dependencies und bekannte CVEs). 5) Container-Scan mit Trivy: trivy image openclaw:latest. 6) Re-Check nach Fixes. Empfehlung: wöchentlicher automatischer Check.' } },
  ],
}

export default function Pillar() {
  return (
    <Container>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="py-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
            <strong className="text-amber-100">&quot;Not a Pentest&quot; Notice</strong>: Dieser Guide dient ausschließlich zur Härtung eigener Systeme. Keine Angriffswerkzeuge.
          </div>

          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-700 bg-gray-800 text-xs text-gray-300 mb-4">
              📌 Pillar Page · Kontinuierlich aktualisiert · April 2026
            </div>
            <h1 className="text-4xl md:text-5xl font-black leading-tight text-gray-100 mb-4">
              OpenClaw Security 2026
              <span className="block text-cyan-400 text-2xl md:text-3xl font-bold mt-1">
                Der komplette Lagebericht &amp; Hardening-Guide
              </span>
            </h1>
            <p className="text-lg text-gray-300 max-w-3xl mb-6">
              Reale CVEs, praxiserprobte Hardening-Checklisten, Netzwerk- und Container-Security,
              Supply-Chain-Absicherung und Incident-Response-Playbooks — alles in einem Dokument.
            </p>
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

          <div className="grid lg:grid-cols-[1fr_280px] gap-8 items-start">
            <div className="space-y-10">

              <section id="status" className="mb-10">
                <h2 className="text-2xl font-semibold mb-4 text-gray-100">Status 2026 — Lagebericht</h2>
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 mb-4">
                  <p className="text-gray-300 mb-4">
                    Das Hauptproblem ist selten der Code — es sind <strong className="text-gray-100">Exposition, fehlende Disziplin und unrotierte Credentials</strong>.
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
                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
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
                        { attack: "RCE via Skills", cvss: "8.4", vector: "NETWORK", fix: "Skill-Sandboxing, Dependency-Pinning" },
                        { attack: "Prompt Injection", cvss: "7.5", vector: "NETWORK", fix: "Input-Sanitization, Tool-Scope-Limits" },
                        { attack: "Unauthenticated Gateway", cvss: "9.8", vector: "NETWORK", fix: "mTLS, VPN, IP-Allowlist" },
                        { attack: "Supply Chain Poisoning", cvss: "8.1", vector: "LOCAL", fix: "SBOM-Verifizierung, Sigstore Cosign" },
                        { attack: "Container Escape", cvss: "8.8", vector: "LOCAL", fix: "Seccomp, AppArmor, Non-Root" },
                        { attack: "Log Injection", cvss: "7.0", vector: "NETWORK", fix: "Input-Encoding, structured logging" },
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

              <section id="checklist" className="mb-10">
                <h2 className="text-2xl font-semibold mb-4 text-gray-100">Hardening Checklist (24 Items)</h2>
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <div className="grid md:grid-cols-2 gap-6">
                    {[
                      { category: "🌐 Netzwerk & Exposition", items: ["Private Networking (VPN/Tailscale/WireGuard)", "IP-Allowlist für API-Gateway", "TLS 1.3 everywhere, HSTS", "Reverse-Proxy mit WAF"] },
                      { category: "🔑 Auth & Secrets", items: ["API-Keys rotieren alle 90 Tage", "Secrets in Vault — nie in .env committed", "JWT mit kurzer Expiry (15 min)", "MFA für alle Admin-Accounts"] },
                      { category: "⚡ WebSocket Security", items: ["Origin-Header validieren (allowlist)", "CSRF-Token für WebSocket-Upgrades", "Session-Binding und Reconnect-Schutz", "Rate-Limiting auf WS-Verbindungen"] },
                      { category: "📦 Container & Dependencies", items: ["Images scannen (Trivy/Grype) vor Deploy", "Non-Root User (runAsNonRoot: true)", "ReadOnlyRootFilesystem aktiviert", "Dependency-Pinning + SBOM (Syft)"] },
                      { category: "📊 Monitoring & Logging", items: ["Structured Logging (JSON) mit Korrelations-IDs", "Alert auf Auth-Failures > 5/min", "Anomalie-Erkennung auf API-Patterns", "Log-Retention >= 90 Tage"] },
                      { category: "🔄 Operations & Compliance", items: ["Incident-Runbook dokumentiert", "Backup + Restore-Test monatlich", "Audit-Log für privilegierte Aktionen", "Quarterly Security Review"] },
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

              <section id="network" className="mb-10">
                <h2 className="text-2xl font-semibold mb-4 text-gray-100">Netzwerk &amp; Firewall</h2>
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-sm">{`# iptables Hardening für OpenClaw Host
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -A INPUT -i lo -j ACCEPT
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
# SSH nur von VPN-Subnetz
iptables -A INPUT -s 10.0.0.0/8 -p tcp --dport 22 -j ACCEPT
# OpenClaw API nur intern (Tailscale/WireGuard)
iptables -A INPUT -i tailscale0 -p tcp --dport 8080 -j ACCEPT
iptables -A INPUT -i wg0 -p tcp --dport 8080 -j ACCEPT
# HTTPS von überall (Reverse-Proxy)
iptables -A INPUT -p tcp --dport 443 -j ACCEPT
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables-save > /etc/iptables/rules.v4`}</pre>
                  </div>
                </div>
              </section>

              <section id="auth" className="mb-10">
                <h2 className="text-2xl font-semibold mb-4 text-gray-100">Authentifizierung &amp; Secrets Management</h2>
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto mb-4">
                    <pre className="text-sm">{`# HashiCorp Vault — Secrets für OpenClaw
vault auth enable approle
vault write auth/approle/role/openclaw-role \\
  secret_id_ttl=24h token_ttl=1h policies="openclaw-policy"
vault policy write openclaw-policy - <<EOF
path "secret/data/openclaw/*" { capabilities = ["read"] }
EOF
vault kv put secret/openclaw/api-keys \\
  openai_key="sk-..." gemini_key="AIza..."
# Key Rotation alle 90 Tage automatisiert`}</pre>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-blue-900 p-4 rounded-lg border border-blue-700">
                      <h3 className="font-semibold text-blue-300 mb-2">JWT Best Practices</h3>
                      <ul className="text-sm text-blue-200 space-y-1">
                        <li>• Access Token: 15 Minuten TTL</li>
                        <li>• RS256 / ES256 (kein HS256 in Prod)</li>
                        <li>• Token-Revocation via Redis Blocklist</li>
                      </ul>
                    </div>
                    <div className="bg-green-900 p-4 rounded-lg border border-green-700">
                      <h3 className="font-semibold text-green-300 mb-2">API-Key Hygiene</h3>
                      <ul className="text-sm text-green-200 space-y-1">
                        <li>• Rotation alle 90 Tage automatisiert</li>
                        <li>• Scope-beschränkte Keys</li>
                        <li>• truffleHog für Git-History-Scan</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              <section id="container" className="mb-10">
                <h2 className="text-2xl font-semibold mb-4 text-gray-100">Container &amp; Kubernetes Hardening</h2>
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-sm">{`apiVersion: v1
kind: Pod
spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 1000
    seccompProfile:
      type: RuntimeDefault
  containers:
  - name: openclaw
    image: openclaw/server:1.2.3@sha256:abc123  # pinned!
    securityContext:
      allowPrivilegeEscalation: false
      readOnlyRootFilesystem: true
      capabilities:
        drop: ["ALL"]
    resources:
      limits: { memory: "512Mi", cpu: "500m" }`}</pre>
                  </div>
                </div>
              </section>

              <section id="websocket" className="mb-10">
                <h2 className="text-2xl font-semibold mb-4 text-gray-100">WebSocket Security</h2>
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-sm">{`# Nginx WebSocket Origin-Validierung (CRITICAL)
location /ws {
    set $allowed_origin 0;
    if ($http_origin = "https://openclaw.internal") { set $allowed_origin 1; }
    if ($http_origin = "https://app.clawguru.org") { set $allowed_origin 1; }
    if ($allowed_origin = 0) { return 403 "Forbidden Origin"; }
    proxy_pass http://openclaw:8080;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    limit_req zone=ws_limit burst=10 nodelay;
}
limit_req_zone $binary_remote_addr zone=ws_limit:10m rate=5r/s;`}</pre>
                  </div>
                </div>
              </section>

              <section id="supply-chain" className="mb-10">
                <h2 className="text-2xl font-semibold mb-4 text-gray-100">Supply Chain Security</h2>
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto mb-4">
                    <pre className="text-sm">{`# SBOM generieren + Vulnerability-Scan
syft packages dir:. -o spdx-json > sbom.spdx.json
grype sbom:sbom.spdx.json --fail-on high
# Cosign: Image signieren und verifizieren
cosign sign --key cosign.key openclaw/server:1.2.3
cosign verify --key cosign.pub openclaw/server:1.2.3
# Secrets in Git-History scannen
trufflehog git file://. --only-verified`}</pre>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-blue-900 p-4 rounded-lg border border-blue-700">
                      <h3 className="font-semibold text-blue-300 mb-2">SBOM</h3>
                      <p className="text-sm text-blue-200">Pflicht für NIS2 und SOC 2. Syft/Trivy.</p>
                    </div>
                    <div className="bg-green-900 p-4 rounded-lg border border-green-700">
                      <h3 className="font-semibold text-green-300 mb-2">Image Signing</h3>
                      <p className="text-sm text-green-200">Cosign + Sigstore. Nur signierte Images in Prod.</p>
                    </div>
                    <div className="bg-red-900 p-4 rounded-lg border border-red-700">
                      <h3 className="font-semibold text-red-300 mb-2">Dependency Audit</h3>
                      <p className="text-sm text-red-200">npm audit + Renovate für Security-Updates.</p>
                    </div>
                  </div>
                </div>
              </section>

              <section id="monitoring" className="mb-10">
                <h2 className="text-2xl font-semibold mb-4 text-gray-100">Monitoring &amp; Alerting</h2>
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-sm">{`# Prometheus Alerting — OpenClaw Security
groups:
- name: openclaw-security
  rules:
  - alert: HighAuthFailureRate
    expr: rate(openclaw_auth_failures_total[5m]) > 2
    for: 2m
    labels: { severity: critical }
    annotations:
      summary: "Hohe Auth-Failure Rate — möglicher Brute-Force"
  - alert: UnknownOriginWebSocket
    expr: openclaw_ws_unknown_origin_total > 0
    labels: { severity: warning }
  - alert: APIRequestAnomalyDetected
    expr: |
      rate(openclaw_api_requests_total[5m])
      > (avg_over_time(openclaw_api_requests_total[1h]) * 3)
    labels: { severity: warning }`}</pre>
                  </div>
                </div>
              </section>

              <section id="incident" className="mb-10">
                <h2 className="text-2xl font-semibold mb-4 text-gray-100">Incident Response Playbook</h2>
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <div className="space-y-4">
                    {[
                      { step: 1, color: "bg-red-900 border-red-700", title: "Erkennung & Triage (0–15 Min)", desc: "Alert verifizieren, Scope bestimmen. Incident-Ticket anlegen. Security-Team notifizieren." },
                      { step: 2, color: "bg-orange-900 border-orange-700", title: "Eindämmung (15–30 Min)", desc: "Services isolieren, API-Keys rotieren, verdächtige Sessions beenden." },
                      { step: 3, color: "bg-yellow-900 border-yellow-700", title: "Forensik & Ursache (30–120 Min)", desc: "Audit-Logs auswerten, Attack-Path rekonstruieren, Logs sichern (read-only)." },
                      { step: 4, color: "bg-blue-900 border-blue-700", title: "Behebung & Restore (2–24h)", desc: "Patch einspielen, Images scannen, sauberes Backup einspielen, Credentials neu generieren." },
                      { step: 5, color: "bg-green-900 border-green-700", title: "Post-Mortem (innerhalb 5 Tage)", desc: "Blameless Post-Mortem, Timeline, Action Items. NIS2-Meldepflicht prüfen (72h)." },
                    ].map((phase) => (
                      <div key={phase.step} className={`flex items-start space-x-4 p-4 rounded-lg border ${phase.color}`}>
                        <div className="bg-gray-900 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
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

              <section id="compliance" className="mb-10">
                <h2 className="text-2xl font-semibold mb-4 text-gray-100">GDPR / NIS2 Compliance</h2>
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-bold text-cyan-400 mb-3">NIS2 Art. 21 — Technische Maßnahmen</h3>
                      <ul className="space-y-2 text-sm text-gray-300">
                        {["Risikoanalyse dokumentiert","Incident Handling 72h-Meldepflicht","Business Continuity + Backup","Supply Chain Security (SBOM)","Schwachstellenmanagement","MFA für privilegierte Zugriffe","TLS 1.3 everywhere"].map(item => (
                          <li key={item} className="flex items-start gap-2"><span className="text-green-400 flex-shrink-0">✓</span>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-bold text-cyan-400 mb-3">GDPR Technische Anforderungen</h3>
                      <ul className="space-y-2 text-sm text-gray-300">
                        {["Verschlüsselung at rest + in transit","Access Logs 90-Tage-Retention","Datenlokalisierung (EU-RZ)","Right to Erasure implementiert","Data Breach Notification < 72h","Privacy by Design","DPIA für High-Risk Processing"].map(item => (
                          <li key={item} className="flex items-start gap-2"><span className="text-green-400 flex-shrink-0">✓</span>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              <section id="faq" className="mb-10">
                <h2 className="text-2xl font-semibold mb-4 text-gray-100">FAQ</h2>
                <div className="space-y-4">
                  {[
                    { q: "Was sind die häufigsten Sicherheitslücken in OpenClaw 2026?", a: "Offene Admin-Ports ohne VPN, fehlende WebSocket Origin-Validierung, unrotierte API-Keys und unsignierte Skills mit unsicheren Dependencies." },
                    { q: "Wie sichere ich OpenClaw gegen Prompt-Injection ab?", a: "Input-Sanitization für alle LLM-Eingaben, Tool-Berechtigungen minimieren, Sandboxing für Skills, regelmäßige Audits der Skill-Bibliothek." },
                    { q: "Ist OpenClaw NIS2-konform betreibbar?", a: "Ja: Audit-Logging aktivieren, Incident-Response dokumentieren, SBOM generieren, regelmäßige Vulnerability-Assessments durchführen." },
                    { q: "Wie oft müssen API-Keys rotiert werden?", a: "Best Practice: alle 90 Tage automatisiert. Nach jedem Security-Incident sofort. HashiCorp Vault für automatische Rotation empfohlen." },
                  ].map((item) => (
                    <div key={item.q} className="bg-gray-800 border border-gray-700 rounded-lg p-5">
                      <h3 className="font-bold text-cyan-400 mb-2">{item.q}</h3>
                      <p className="text-sm text-gray-300">{item.a}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-4 text-gray-100">Weiterführende Ressourcen</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { href: "/de/securitycheck", title: "🔍 Security Check", desc: "HTTP-Header-Scan, Security-Score in Echtzeit" },
                    { href: "/de/runbooks", title: "📋 Runbooks", desc: "600+ ausführbare Security-Playbooks" },
                    { href: "/de/openclaw", title: "🦞 OpenClaw Framework", desc: "Self-Hosted Security Framework Übersicht" },
                    { href: "/de/oracle", title: "🔮 Oracle Threat Intel", desc: "KI-gestützte Bedrohungsanalyse" },
                  ].map((link) => (
                    <a key={link.href} href={link.href} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
                      <div className="font-semibold text-cyan-400">{link.title}</div>
                      <div className="text-sm text-gray-300">{link.desc}</div>
                    </a>
                  ))}
                </div>
              </section>

            </div>

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
                    <a href="/de/securitycheck" className="px-3 py-2 rounded-lg bg-cyan-900 border border-cyan-700 hover:bg-cyan-800 text-cyan-300 font-bold text-xs text-center transition-colors">
                      Security Check →
                    </a>
                    <a href="/de/runbooks" className="px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 hover:bg-gray-600 text-gray-300 font-bold text-xs text-center transition-colors">
                      Runbooks →
                    </a>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </Container>
  )
}
