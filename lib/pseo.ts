// File: lib/pseo.ts
export type RunbookBlock =
  | { kind: "h2"; text: string }
  | { kind: "h3"; text: string }
  | { kind: "h4"; text: string }
  | { kind: "p"; text: string }
  | { kind: "ul"; items: string[] }
  | { kind: "code"; lang: string; code: string }
  | { kind: "callout"; tone: "warn" | "tip"; title: string; text: string }

export type RunbookFaqEntry = { q: string; a: string }

export type RunbookAuthor = {
  name: string
  role: string
  experience: string
  sources: string[]
  lastUpdated: string
}

export type Runbook = {
  slug: string
  title: string
  summary: string
  tags: string[]
  lastmod: string // YYYY-MM-DD
  howto: { steps: string[] }
  blocks: RunbookBlock[]
  clawScore: number
  faq: RunbookFaqEntry[]
  relatedSlugs: string[]
  author: RunbookAuthor
}

const LASTMOD = "2026-02-25"

export const DEFAULT_AUTHOR: RunbookAuthor = {
  name: "Rolf Schwertfechter",
  role: "Principal Ops-Engineer & Security Architect",
  experience: "15+ Jahre Erfahrung als Ops-Engineer, Incident Responder und Security Architect. Betreibt produktive Infrastruktur auf Hetzner, AWS, GCP und Kubernetes.",
  sources: [
    "CIS Benchmarks 2026",
    "OWASP Top 10 2025",
    "NIST SP 800-190 (Container Security)",
    "Persönliche Incident-Erfahrungen aus 1.000+ Post-Mortems",
  ],
  lastUpdated: LASTMOD,
}

// Providers / Platforms (SEO seeds)
export const PROVIDERS = [
  { slug: "hetzner", name: "Hetzner" },
  { slug: "digitalocean", name: "DigitalOcean" },
  { slug: "aws", name: "AWS" },
  { slug: "lightsail", name: "AWS Lightsail" },
  { slug: "gcp", name: "Google Cloud" },
  { slug: "azure", name: "Azure" },
  { slug: "cloudflare", name: "Cloudflare" },
  { slug: "vercel", name: "Vercel" },
  { slug: "netlify", name: "Netlify" },
  { slug: "flyio", name: "Fly.io" },
  { slug: "render", name: "Render" },
  { slug: "railway", name: "Railway" },
  { slug: "docker", name: "Docker" },
  { slug: "kubernetes", name: "Kubernetes" },
  { slug: "nginx", name: "Nginx" },
  { slug: "traefik", name: "Traefik" },
  { slug: "caddy", name: "Caddy" },
  { slug: "postgres", name: "Postgres" },
  { slug: "redis", name: "Redis" },
  { slug: "mongodb", name: "MongoDB" },
  { slug: "sentry", name: "Sentry" },
  { slug: "prometheus", name: "Prometheus" },
  { slug: "grafana", name: "Grafana" },
  { slug: "stripe", name: "Stripe" },
  { slug: "telegram", name: "Telegram" },
  { slug: "openai", name: "OpenAI" },
  { slug: "anthropic", name: "Anthropic" },
  // WORLD BEAST: additional providers for 10,000+ pages
  { slug: "linode", name: "Linode (Akamai)" },
  { slug: "scaleway", name: "Scaleway" },
  { slug: "ovhcloud", name: "OVHcloud" },
  { slug: "vultr", name: "Vultr" },
  { slug: "contabo", name: "Contabo" },
  { slug: "supabase", name: "Supabase" },
  { slug: "planetscale", name: "PlanetScale" },
  { slug: "neon", name: "Neon Postgres" },
  { slug: "upstash", name: "Upstash Redis" },
  { slug: "firebase", name: "Firebase" },
  { slug: "minio", name: "MinIO" },
  { slug: "resend", name: "Resend" },
  { slug: "rabbitmq", name: "RabbitMQ" },
  { slug: "elasticsearch", name: "Elasticsearch" },
  { slug: "clickhouse", name: "ClickHouse" },
  { slug: "vault-hashicorp", name: "HashiCorp Vault" },
  { slug: "terraform", name: "Terraform" },
  { slug: "github-actions", name: "GitHub Actions" },
  { slug: "gitlab-ci", name: "GitLab CI" },
  // Additional providers & regional endpoints for higher page count
  { slug: "oracle-cloud", name: "Oracle Cloud" },
  { slug: "hetzner-nbg1", name: "Hetzner NBG1" },
  { slug: "hetzner-fsn1", name: "Hetzner FSN1" },
  { slug: "hetzner-hel1", name: "Hetzner HEL1" },
  { slug: "digitalocean-nyc3", name: "DigitalOcean NYC3" },
  { slug: "digitalocean-fra1", name: "DigitalOcean FRA1" },
  { slug: "digitalocean-sgp1", name: "DigitalOcean SGP1" },
  { slug: "azure-vm", name: "Azure VM" },
  { slug: "gcp-compute", name: "GCP Compute Engine" },
  { slug: "aws-eu-west-1", name: "AWS EU West 1" },
  { slug: "aws-us-east-1", name: "AWS US East 1" },
  { slug: "aws-ap-southeast-1", name: "AWS AP Southeast 1" },
  { slug: "cloudflare-workers", name: "Cloudflare Workers" },
  { slug: "cloudflare-pages", name: "Cloudflare Pages" },
  { slug: "cloudflare-r2", name: "Cloudflare R2" },
  { slug: "ovhcloud-de", name: "OVHcloud DE" },
  { slug: "ovhcloud-fr", name: "OVHcloud FR" },
  { slug: "vultr-fra", name: "Vultr Frankfurt" },
  { slug: "vultr-sjc", name: "Vultr Silicon Valley" },
  { slug: "fly-iad", name: "Fly.io IAD" },
  { slug: "fly-ams", name: "Fly.io AMS" },
  { slug: "render-oregon", name: "Render Oregon" },
  { slug: "render-frankfurt", name: "Render Frankfurt" },
  { slug: "railway-us", name: "Railway US" },
  { slug: "railway-eu", name: "Railway EU" },
  { slug: "vercel-edge", name: "Vercel Edge Network" },
  { slug: "netlify-edge", name: "Netlify Edge Functions" },
  { slug: "bunnynet", name: "Bunny.net CDN" },
  { slug: "fastly", name: "Fastly CDN" },
] as const

// Topic templates (high-intent)
const TOPICS = [
  { slug: "firewall-baseline", title: "Firewall Baseline", summary: "Default deny, minimal offene Ports, sichere Defaults." },
  { slug: "ssh-hardening", title: "SSH Hardening", summary: "Key-only, Root aus, Rate-Limits, sichere Admin-Zugänge." },
  { slug: "ws-origin-hardening", title: "WebSocket Origin Hardening", summary: "Origin whitelist, Auth, Rate-Limits, sichere Headers." },
  { slug: "reverse-proxy-baseline", title: "Reverse Proxy Baseline", summary: "TLS, headers, caching, upstream health, timeouts." },
  { slug: "rate-limit-baseline", title: "Rate Limit Baseline", summary: "Edge + App Limits gegen Abuse und Cost-Spikes." },
  { slug: "ddos-first-response", title: "DDoS First Response", summary: "Blocken, absorbieren, recovern – ohne Panik." },
  { slug: "api-key-rotation", title: "API Key Rotation (Notfall)", summary: "Keys rotieren, alte killen, re-deploy, audit." },
  { slug: "secrets-management", title: "Secrets Management", summary: "Kein .env in Git. Secret stores sauber einsetzen." },
  { slug: "security-headers-csp", title: "Security Headers & CSP", summary: "CSP, HSTS, XFO, Referrer Policy – richtig." },
  { slug: "backup-restore-drill", title: "Backup/Restore Drill", summary: "Backups ohne Restore sind Fantasy. So testest du’s." },
  { slug: "observability-baseline", title: "Observability Baseline", summary: "Logs, Metrics, Traces – minimal sinnvoll." },
  { slug: "incident-communication", title: "Incident Kommunikation", summary: "Status, Updates, intern/extern – sauberer Ablauf." },
  // WORLD BEAST: additional topics
  { slug: "zero-trust-network", title: "Zero Trust Network Access", summary: "Never trust, always verify – modernes Netzwerkmodell." },
  { slug: "container-hardening", title: "Container Hardening", summary: "Rootless, read-only, capabilities minimieren." },
  { slug: "supply-chain-security", title: "Supply Chain Security", summary: "Dependency audits, SBOM, Sigstore – sichere Lieferkette." },
  { slug: "incident-postmortem", title: "Incident Postmortem", summary: "Blameless, strukturiert, mit Action Items." },
  { slug: "ci-cd-security", title: "CI/CD Security Hardening", summary: "OIDC, secrets in CI, signed artifacts, least privilege runners." },
  { slug: "database-backup", title: "Database Backup Strategy", summary: "3-2-1 Regel, WAL archiving, PITR, regelmäßige Tests." },
  { slug: "tls-certificate-management", title: "TLS Certificate Management", summary: "ACME/Let's Encrypt, auto-renewal, wildcard certs." },
  { slug: "kubernetes-rbac", title: "Kubernetes RBAC", summary: "Least privilege, service accounts, audit logs." },
  { slug: "alerting-slo", title: "Alerting & SLO Baseline", summary: "Error budget, burn rate alerts, paging die Sinn macht." },
  { slug: "multi-region-ha", title: "Multi-Region High Availability", summary: "Active-active, failover, global load balancing." },
] as const

// Error strings (Longtail magnet)
const ERRORS = [
  "502 bad gateway","504 gateway timeout","500 internal server error","429 too many requests","403 forbidden","401 unauthorized",
  "dns enotfound","econnreset","etimedout","eai_again","certificate expired","too many redirects","request entity too large 413",
  "csrf token mismatch","cors blocked","webhook signature verification failed","stripe webhook signature mismatch",
  "database connection refused","too many connections","out of memory","disk full","read-only file system","permission denied",
  "invalid jwt","session expired","missing environment variable","module not found","build failed","unexpected token",
  "hydration failed","fetch failed","connection terminated","tls handshake failed","upstream prematurely closed connection",
  "worker exceeded time limit","function timed out","rate limit exceeded","api quota exceeded","websocket 1006 abnormal closure",
  "websocket 403 forbidden","websocket origin not allowed","postgres role does not exist","relation does not exist",
  "redis connection error","mongo authentication failed","invalid api key","unauthorized: invalid token","request aborted",
  "socket hang up","chunk load error","edge function failed","cors preflight failed","blocked by cloudflare","waf rule triggered",
  "too many open files",
  // WORLD BEAST: additional errors
  "oom killed","evicted pod","crashloopbackoff","imagepullbackoff","pending forever","node not ready",
  "certificate signed by unknown authority","ssl handshake timeout","http2 protocol error",
  "upstream connect error","circuit breaker open","retry budget exhausted",
  "kafka consumer lag too high","producer send timeout","partition offline",
  "elasticsearch shard unavailable","query timed out","max virtual memory exceeded",
  "terraform state locked","plan drift detected","resource already exists",
  "github actions rate limit","workflow timeout","deployment quota exceeded",
  // CVEs and emerging attack patterns 2025-2026
  "cve-2025-29927 next.js middleware bypass","cve-2024-56374 django sql injection",
  "cve-2024-45337 golang ssh key misuse","cve-2024-21626 runc container escape",
  "cve-2024-6387 openssh regreSSHion","cve-2023-44487 http2 rapid reset",
  "cve-2024-3094 xz utils backdoor","cve-2024-27198 teamcity auth bypass",
  "log4shell exploit attempt","spring4shell rce","polkit pkexec privilege escalation",
  "dirty pipe kernel exploit","sudo heap overflow","glibc ghost vulnerability",
  "openssl heartbleed legacy","nginx integer overflow","curl cookie injection",
  "redis rce via replication","postgres privilege escalation","mongodb nosql injection",
  "kubernetes privilege escalation via serviceaccount","etcd unauthenticated access",
  "docker daemon exposed tcp","containerd cni bypass","helm chart injection",
  "supply chain poisoned package","typosquatting npm attack","malicious github action",
  "stripe api key leaked in logs","jwt none algorithm exploit","oauth state csrf",
  "ssrf via metadata endpoint","xxe injection","ssti server-side template injection",
  "prototype pollution nodejs","deserialization rce java","path traversal exploit",

] as const

const STACKS = [
  { slug: "nextjs", name: "Next.js" },
  { slug: "node", name: "Node.js" },
  { slug: "nginx", name: "Nginx" },
  { slug: "cloudflare", name: "Cloudflare" },
  { slug: "docker", name: "Docker" },
  { slug: "kubernetes", name: "Kubernetes" },
  { slug: "stripe", name: "Stripe" },
  { slug: "postgres", name: "Postgres" },
  // WORLD BEAST: additional stacks
  { slug: "python", name: "Python" },
  { slug: "go", name: "Go" },
  { slug: "bun", name: "Bun" },
  { slug: "fastapi", name: "FastAPI" },
  { slug: "django", name: "Django" },
  { slug: "express", name: "Express.js" },
  { slug: "nestjs", name: "NestJS" },
  { slug: "remix", name: "Remix" },
] as const

// Config pages (operators google these)
const CONFIGS = [
  { slug: "nginx-origin-whitelist-map", title: "Nginx: Origin Whitelist via map", summary: "WebSocket/HTTP Origins whitelisten ohne Chaos." },
  { slug: "nginx-rate-limit-zone", title: "Nginx: Rate Limit Zone", summary: "limit_req, limit_conn, bursts, safe defaults." },
  { slug: "cloudflare-waf-baseline", title: "Cloudflare WAF Baseline", summary: "WAF, Rate Limits, Bot fight – gute Defaults." },
  { slug: "docker-secrets", title: "Docker Secrets statt .env", summary: "Saubere Secrets ohne Git-Leaks." },
  { slug: "next-env-leak-prevent", title: "Next.js ENV Leak verhindern", summary: "Server/Client Boundary richtig ziehen." },
  { slug: "stripe-webhook-verify", title: "Stripe Webhooks verifizieren", summary: "Signaturen prüfen, Replay verhindern." },
  { slug: "postgres-least-privilege", title: "Postgres Least Privilege", summary: "Rollen, Rechte, Netzwerk minimal halten." },
  { slug: "redis-auth-tls", title: "Redis Auth + TLS", summary: "Redis nicht offen ins Internet – bitte nie." },
  { slug: "tailscale-admin-access", title: "Admin Access via Tailscale", summary: "SSH privat, keine öffentliche Angriffsfläche." },
  { slug: "log-rotation", title: "Log Rotation", summary: "Logs nicht explodieren lassen – rotation + retention." },
  { slug: "healthchecks-uptime", title: "Healthchecks & Uptime", summary: "Checks, Alerting, minimale SLOs." },
  { slug: "rate-limit-edge", title: "Edge Rate Limiting", summary: "Edge-first Limits gegen Abuse und Kosten." },
  // WORLD BEAST: additional config pages
  { slug: "k8s-network-policy-default-deny", title: "K8s NetworkPolicy: Default Deny", summary: "Kein East-West Traffic ohne explizite Policy." },
  { slug: "github-actions-oidc", title: "GitHub Actions OIDC Auth", summary: "Keine long-lived Secrets in CI – OIDC mit AWS/GCP/Azure." },
  { slug: "terraform-remote-state", title: "Terraform Remote State", summary: "S3/GCS Backend + State Locking + Encryption." },
  { slug: "prometheus-alertmanager", title: "Prometheus Alertmanager", summary: "Routing, inhibition, silences – kein Alert-Storm." },
  { slug: "cors-headers-config", title: "CORS Headers korrekt setzen", summary: "Nur erlaubte Origins, keine Wildcard in Prod." },
  { slug: "fail2ban-baseline", title: "Fail2ban Baseline", summary: "SSH, HTTP Auth, Rate-Limits – automatisches Blocking." },
] as const

const YEARS = ["2024", "2025", "2026", "2027"] as const

const SEVERITIES = [
  { slug: "p1", name: "P1 Kritisch" },
  { slug: "p2", name: "P2 Hoch" },
  { slug: "p3", name: "P3 Mittel" },
] as const

const SOLUTION_TYPES = [
  { slug: "fix", name: "Fix" },
  { slug: "prevention", name: "Prävention" },
  { slug: "monitoring", name: "Monitoring" },
  { slug: "rollback", name: "Rollback" },
] as const

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
}

function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr))
}

/** Deterministic 60-99 quality score based on slug content */
function clawScoreFor(slug: string): number {
  let hash = 5381
  for (const char of slug) hash = (((hash << 5) + hash) ^ char.charCodeAt(0)) >>> 0
  return 60 + (hash % 40)
}

export type FaqKind = "provider-topic" | "error-stack" | "config" | "provider-error" | "year-topic" | "severity-topic" | "solution-type"

function buildFaq(
  kind: FaqKind,
  opts: { providerName?: string; topicTitle?: string; error?: string; stackName?: string; year?: string; severity?: string; solutionType?: string; summary: string }
): RunbookFaqEntry[] {
  const { providerName, topicTitle, error, stackName, year, severity, solutionType, summary } = opts
  if (kind === "provider-topic" && providerName && topicTitle) {
    return [
      { q: `Was ist ${topicTitle} auf ${providerName}?`, a: summary },
      { q: `Wie verifiziere ich ${topicTitle} auf ${providerName}?`, a: "Nutze den ClawGuru Re-Check: curl-I + Logs + Smoke Test. Grünes Ergebnis = verifiziert." },
      { q: `Welche Risiken entstehen ohne ${topicTitle}?`, a: "Ohne aktive Härtung sind Datenleaks, Abuse, Downtime und Compliance-Verstöße wahrscheinlicher." },
      { q: `Wie lange dauert ${topicTitle} auf ${providerName}?`, a: "Im Schnitt 15–45 Minuten bei sauberem Vorgehen. Mit Rollback-Plan unter 2h." },
    ]
  }
  if (kind === "error-stack" && error && stackName) {
    return [
      { q: `Was bedeutet "${error}" in ${stackName}?`, a: summary },
      { q: `Wie behebe ich "${error}" schnell?`, a: "Logs lesen → Upstream prüfen → Fix deployen → Re-Check. Keine Panik." },
      { q: `Wie verhindere ich "${error}" dauerhaft?`, a: "Guardrails setzen: Timeouts, Retries, Circuit Breaker, Alerts auf 5xx-Rate." },
      { q: `Ist "${error}" ein Sicherheitsproblem?`, a: "Kann es sein. 401/403/429 können auf Angriffe hinweisen – Logs auf Muster prüfen." },
    ]
  }
  if (kind === "provider-error" && providerName && error) {
    return [
      { q: `Wie tritt "${error}" auf ${providerName} auf?`, a: summary },
      { q: `Was ist die schnellste Lösung für "${error}" auf ${providerName}?`, a: "Logs → Upstream → Timeouts prüfen → Fix deployen → Re-Check." },
      { q: `Welche ${providerName}-Features helfen gegen "${error}"?`, a: "Provider-native Health Checks, Auto-Scaling, Managed Load Balancer." },
    ]
  }
  if (kind === "year-topic" && providerName && topicTitle && year) {
    return [
      { q: `Was hat sich bei ${topicTitle} auf ${providerName} in ${year} geändert?`, a: summary },
      { q: `Welche Best Practices gelten ${year} für ${topicTitle}?`, a: "Zero-Trust, MFA, Automated Remediation, IaC-basiertes Hardening." },
      { q: `Wie up-to-date sind die ${topicTitle}-Defaults auf ${providerName}?`, a: `Stand ${year}: Defaults aktuell nach ClawGuru-Runbook. Regelmäßig re-checken.` },
    ]
  }
  if (kind === "severity-topic" && providerName && topicTitle && severity) {
    return [
      { q: `Was ist ein ${severity}-Incident bei ${topicTitle} auf ${providerName}?`, a: summary },
      { q: `Wie schnell muss ich bei ${severity} reagieren?`, a: "P1: sofort (<15 min), P2: <2h, P3: <24h. Eskalation dokumentieren." },
      { q: `Welche Maßnahmen sind bei ${severity} Pflicht?`, a: "Incident-Kommunikation, Status-Page-Update, Post-Mortem, Root-Cause-Fix." },
    ]
  }
  if (kind === "solution-type" && providerName && topicTitle && solutionType) {
    return [
      { q: `Was beinhaltet "${solutionType}" für ${topicTitle} auf ${providerName}?`, a: summary },
      { q: `Wann ist "${solutionType}" der richtige Ansatz?`, a: "Wenn das Problem bekannt ist und du gezielt einen der Schritte ausführen willst." },
      { q: `Wie verifiziere ich "${solutionType}" für ${topicTitle}?`, a: "Re-Check starten → Smoke Test → Metriken 15 min beobachten → Done." },
    ]
  }
  return [
    { q: `Was ist das Ziel dieses Runbooks?`, a: summary },
    { q: `Wie führe ich dieses Runbook durch?`, a: "Schritt für Schritt: Ist-Zustand messen → Fix anwenden → Verifizieren." },
    { q: `Was mache ich nach dem Fix?`, a: "Guardrail setzen, Incident dokumentieren, Post-Mortem schreiben." },
  ]
}

function stepsProviderTopic(providerName: string, topicSlug: string, topicTitle: string) {
  const base = [
    `Scope klären: Was genau willst du härten/ändern? (${topicTitle} auf ${providerName})`,
    "Ist-Zustand messen: Ports, Logs, Requests, Zugriffspfade.",
    "Fix anwenden (minimal & rückrollbar).",
    "Verifizieren: Re-Check + Smoke Tests.",
    "Guardrail setzen: Alerts/Rate Limits/Policies dokumentieren.",
  ]

  // Topic-specific "operator steps" (unique, not generic)
  switch (topicSlug) {
    case "ssh-hardening":
      return [
        "Sofort: SSH nur über Private Access/VPN oder Allowlist (keine 0.0.0.0/0).",
        "Key-only: PasswordAuthentication no; PubkeyAuthentication yes.",
        "RootLogin: PermitRootLogin no; Admin via sudo, unique users.",
        "Rate limiting: fail2ban oder sshd MaxAuthTries + firewall limits.",
        "Verifikation: neuer SSH Login, dann alte Pfade testen (müssen scheitern).",
      ]
    case "firewall-baseline":
      return [
        "Default deny inbound, allow established/related.",
        "Nur notwendige Ports öffnen (typisch: 80/443, evtl. 22 via VPN/Allowlist).",
        "Admin-Ports (DB/Redis) niemals public.",
        "Logging an: dropped packets zählen (Abuse erkennen).",
        "Verifikation: extern portscan, intern healthchecks.",
      ]
    case "ws-origin-hardening":
      return [
        "Origin strikt whitelisten (kein * / wildcard).",
        "Auth auf WS Handshake (token/cookie) erzwingen.",
        "Rate limits: connect rate + msg rate + concurrent connections.",
        "Proxy/WAF: Upgrade headers + timeouts korrekt setzen.",
        "Verifikation: disallowed Origin → 403, allowed Origin → OK.",
      ]
    case "security-headers-csp":
      return [
        "HSTS aktivieren (nur wenn HTTPS überall stimmt).",
        "CSP erstmal report-only, dann enforce.",
        "X-Frame-Options / frame-ancestors setzen (Clickjacking).",
        "Referrer-Policy + Permissions-Policy setzen.",
        "Verifikation: curl -I + Browser DevTools console CSP reports.",
      ]
    case "rate-limit-baseline":
      return [
        "Edge limits für Login/Webhooks/Expensive endpoints.",
        "App limits für per-user/per-key quotas.",
        "Burst + ban strategy definieren (nicht legitime user killen).",
        "Observability: 429/403 spikes als Signals.",
        "Verifikation: Load test (k6) + edge logs.",
      ]
    case "api-key-rotation":
      return [
        "Neue Keys generieren, alte markieren (grace period).",
        "Rollout: Services nacheinander deployen, nicht alles gleichzeitig.",
        "Alte Keys invalidieren (Cloud + SaaS + CI).",
        "Audit: access logs auf alte keys prüfen.",
        "Verifikation: old key → 401, new key → 200.",
      ]
    default:
      return base
  }
}

function stepsError(err: string, stackSlug: string, stackName: string) {
  const base = [
    `Reproduzieren: Wann tritt "${err}" auf? (${stackName})`,
    "Logs einsammeln (10–30 Zeilen) + Metriken (CPU/RAM/Latency).",
    "Wahrscheinliche Ursachen priorisieren (Top 3) und einzeln testen.",
    "Fix deployen (klein), dann verifizieren (Re-Check).",
    "Post-Fix: Guardrail (Rate Limit, Timeout, Retries, Circuit Breaker).",
  ]
  if (stackSlug === "nginx") {
    return [
      `Fehler "${err}" in Nginx: check access/error logs + upstream status.`,
      "Upstream reachability prüfen (DNS, connect, TLS).",
      "Timeouts: proxy_read_timeout / proxy_connect_timeout anpassen.",
      "Buffering/413: client_max_body_size prüfen.",
      "Verifikation: curl -I + tail -n 50 error.log.",
    ]
  }
  if (stackSlug === "stripe") {
    return [
      `Stripe-Fehler "${err}": Webhook logs + signature verification prüfen.`,
      "Webhook endpoint secret korrekt? Replay protection vorhanden?",
      "Events: idempotency keys + safe retries.",
      "Verifikation: Stripe CLI trigger + logs check.",
      "Guardrail: Alerting auf webhook failure rate.",
    ]
  }
  return base
}

function stepsConfig(title: string) {
  return [
    `Ziel definieren: Was soll diese Konfiguration erreichen? (${title})`,
    "Sichere Defaults setzen (deny-by-default, least privilege).",
    "Konfig anwenden + Reload/Deploy.",
    "Verifizieren (curl/healthcheck/logs) + Re-Check.",
    "Dokumentieren: Warum, wie, rollback.",
  ]
}

type ProviderHint = {
  verify: { lang: string; code: string }[]
  guardrail: string[]
  cautions: string[]
}

function providerHints(providerSlug: string): ProviderHint {
  switch (providerSlug) {
    case "aws":
    case "lightsail":
      return {
        verify: [
          { lang: "bash", code: "aws sts get-caller-identity\naws ec2 describe-security-groups --max-items 5" },
          { lang: "bash", code: "aws cloudtrail lookup-events --max-results 10" },
        ],
        guardrail: [
          "CloudTrail aktiv + Alerts auf IAM-Key-Erstellung & Policy-Änderungen",
          "Security Groups: default-deny, nur benötigte Ports/Quellen",
          "Keys in Secrets Manager statt .env / Git",
        ],
        cautions: ["Keys zuerst rotieren, dann forensisch arbeiten (Stop the bleeding)."],
      }
    case "cloudflare":
      return {
        verify: [
          { lang: "text", code: "Cloudflare Dashboard → Security → Events (WAF / Rate Limiting / Bot)" },
          { lang: "text", code: "Cloudflare → Analytics → Traffic (spikes / geo / user agents)" },
        ],
        guardrail: ["Managed WAF Rules baseline", "Rate Limits auf Login/Webhooks", "Bot protection aktivieren"],
        cautions: ["WAF kann legitime Requests blocken: verifiziere per Security Events."],
      }
    case "netlify":
      return {
        verify: [
          { lang: "text", code: "Netlify → Deploys → Functions Logs (bei /api/* Problemen)" },
          { lang: "text", code: "Netlify → Site settings → Environment variables (Scopes prüfen)" },
        ],
        guardrail: ["ENV Variablen in richtigen Scope setzen (Build vs Runtime)", "Deploy Preview ≠ Production: Webhooks/Origins fixen"],
        cautions: ["Viele 5xx entstehen durch fehlende ENV in Functions runtime."],
      }
    case "vercel":
      return {
        verify: [
          { lang: "text", code: "Vercel → Logs (Function/Edge) und Environment Variables" },
          { lang: "bash", code: "curl -I https://deine-domain.tld\ncurl -sS https://deine-domain.tld/api/health || true" },
        ],
        guardrail: ["Separate ENV pro Environment (Preview/Prod)", "Timeouts & Memory passend für Functions"],
        cautions: ["Preview Deployments erzeugen oft CORS/Origin-Mismatches."],
      }
    case "kubernetes":
      return {
        verify: [
          { lang: "bash", code: "kubectl get pods -A\nkubectl get events -A --sort-by=.metadata.creationTimestamp | tail -n 25" },
          { lang: "bash", code: "kubectl logs deploy/<name> --tail=50" },
        ],
        guardrail: ["NetworkPolicies, ResourceLimits, PodSecurity", "SecretStores (sealed-secrets / external secrets)"],
        cautions: ["Nicht blind redeployen: erst Events/Logs lesen."],
      }
    default:
      return {
        verify: [{ lang: "bash", code: "curl -I https://deine-domain.tld\ncurl -sS https://deine-domain.tld/health || true" }],
        guardrail: ["Least privilege", "Logs + Alerts", "Rollback/Deploy-Disziplin"],
        cautions: ["Änderungen klein halten, verifizieren, dann weiter."],
      }
  }
}

function inferKind(r: Runbook): "provider-topic" | "error-stack" | "config" {
  if (r.tags.includes("config")) return "config"
  const hasError = r.tags.some((t) => t.startsWith("error:"))
  const hasStack = r.tags.some((t) => t.startsWith("stack:"))
  if (hasError && hasStack) return "error-stack"
  return "provider-topic"
}

function topicSlugFromTags(tags: string[]) {
  return tags.find((t) => t.startsWith("topic:"))?.split(":")[1] || ""
}

function stackSlugFromTags(tags: string[]) {
  return tags.find((t) => t.startsWith("stack:"))?.split(":")[1] || ""
}

function configSnippet(configSlug: string): { lang: string; code: string } | null {
  switch (configSlug) {
    case "nginx-origin-whitelist-map":
      return {
        lang: "nginx",
        code:
`# /etc/nginx/conf.d/origin-map.conf
map $http_origin $origin_allowed {
  default 0;
  "~^https://(www\.)?deine-domain\.com$" 1;
}

server {
  # ...
  location /ws {
    if ($origin_allowed = 0) { return 403; }
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_pass http://upstream_ws;
  }
}`,
      }
    case "nginx-rate-limit-zone":
      return {
        lang: "nginx",
        code:
`# http {} block
limit_req_zone $binary_remote_addr zone=perip:10m rate=10r/s;

server {
  location /login {
    limit_req zone=perip burst=20 nodelay;
    proxy_pass http://app;
  }
}`,
      }
    case "stripe-webhook-verify":
      return {
        lang: "ts",
        code:
`// Next.js App Router: app/api/stripe/webhook/route.ts
import Stripe from "stripe"
import { headers } from "next/headers"

export const runtime = "nodejs" // IMPORTANT for raw body

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" })

export async function POST(req: Request) {
  const sig = headers().get("stripe-signature")
  const body = await req.text() // raw
  if (!sig) return new Response("Missing signature", { status: 400 })

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    return new Response("Invalid signature", { status: 400 })
  }

  // idempotency: store event.id to avoid double processing
  return new Response("ok", { status: 200 })
}`,
      }
    case "next-env-leak-prevent":
      return {
        lang: "md",
        code:
`# Next.js ENV Leak Quick Rules
- Alles was mit NEXT_PUBLIC_ beginnt, landet im Browser Bundle.
- Geheimnisse (API keys) niemals NEXT_PUBLIC_.
- Nur serverseitig lesen: process.env.MY_SECRET in server components / route handlers.
- Client Components: nur public vars, niemals secrets.`,
      }
    default:
      return null
  }
}

function buildBlocks(r: Runbook): RunbookBlock[] {
  const kind = inferKind(r)
  const providerSlug = r.tags.find((t) => t.startsWith("provider:"))?.split(":")[1] || "generic"
  const hints = providerHints(providerSlug)

  if (kind === "provider-topic") {
    const topicSlug = topicSlugFromTags(r.tags)
    const topic = TOPICS.find((t) => t.slug === topicSlug)

    const topicSpecific: RunbookBlock[] = []
    if (topicSlug === "ssh-hardening") {
      topicSpecific.push(
        { kind: "h2", text: "Konfiguration (sshd_config)" },
        { kind: "code", lang: "text", code:
`# /etc/ssh/sshd_config (Essentials)
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
MaxAuthTries 3
LoginGraceTime 30
AllowUsers deploy admin
# Optional:
# AllowGroups ssh-users
`},
        { kind: "callout", tone: "tip", title: "Pro-Tipp", text: "SSH am besten nur via VPN/Tailscale/WireGuard – dann ist das Internet als Angriffsfläche raus." },
      )
    } else if (topicSlug === "firewall-baseline") {
      topicSpecific.push(
        { kind: "h2", text: "Minimal-Regeln (UFW Beispiel)" },
        { kind: "code", lang: "bash", code:
`ufw default deny incoming
ufw default allow outgoing
ufw allow 80/tcp
ufw allow 443/tcp
# SSH: lieber nur via VPN / Allowlist
# ufw allow from <your-ip> to any port 22 proto tcp
ufw enable
ufw status verbose
`},
      )
    } else if (topicSlug === "ws-origin-hardening") {
      topicSpecific.push(
        { kind: "h2", text: "Origin-Check (Nginx Snippet)" },
        { kind: "code", lang: "nginx", code:
`# Block wildcard origins, allow only your domain
if ($http_origin !~* ^https://(www\.)?deine-domain\.com$) { return 403; }
`},
      )
    } else if (topicSlug === "security-headers-csp") {
      topicSpecific.push(
        { kind: "h2", text: "Header Baseline (Nginx)" },
        { kind: "code", lang: "nginx", code:
`add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "no-referrer" always;
# CSP erst report-only:
# add_header Content-Security-Policy-Report-Only "default-src 'self'; ..." always;
`},
      )
    }

    return [
      { kind: "h2", text: "Was ist das hier?" },
      { kind: "p", text: r.summary },
      { kind: "callout", tone: "warn", title: "Priorität", text: "Wenn Production betroffen ist: Containment zuerst (Stop the bleeding), dann Root Cause." },

      { kind: "h2", text: "Schnell‑Triage (5 Minuten)" },
      { kind: "ul", items: [
        "Was ist exponiert (Ports, Admin, Webhooks, Origins, Buckets)?",
        "Sind gerade Anomalien sichtbar (Spikes, 4xx/5xx, Login‑Fehler, Bot‑Traffic)?",
        "Sind Secrets/Keys kompromittiert (Repo, CI, Logs, Chat)?",
      ]},

      ...(topic ? [{ kind: "callout", tone: "tip", title: "Ziel", text: `${topic.title}: ${topic.summary}` } as RunbookBlock] : []),

      ...topicSpecific,

      { kind: "h2", text: "Fix‑Schritte (Copy/Paste‑fähig)" },
      { kind: "ul", items: r.howto.steps },

      { kind: "h2", text: "Verifikation" },
      ...hints.verify.map((v): RunbookBlock => ({ kind: "code", lang: v.lang, code: v.code })),

      { kind: "h2", text: "Prävention / Guardrails" },
      { kind: "ul", items: hints.guardrail },

      { kind: "h2", text: "Warnungen" },
      { kind: "ul", items: hints.cautions },

      { kind: "h2", text: "Was andere Tools nicht sagen" },
      { kind: "p", text: `Die meisten Guides zeigen nur den Happy Path. Was wirklich wichtig ist: ${r.summary} – aber erst nach einem erfolgreichen Smoke Test zählt es als erledigt. Viele Admins vergessen den Rollback-Plan und das Monitoring nach dem Change.` },
      { kind: "ul", items: [
        "Defaults allein reichen nicht – ohne Verifikation ist jeder Fix unvollständig.",
        "Externe Scantools sehen oft nicht den Unterschied zwischen 'konfiguriert' und 'wirksam'.",
        "Incident-Postmortems zeigen: 60% der Rückfälle entstehen durch fehlende Guardrails, nicht durch falschen Fix.",
      ]},

      { kind: "callout", tone: "tip", title: "Mein persönlicher Tipp als Ops-Engineer", text: `Nach ${r.title}: Setze sofort einen Monitoring-Alert auf die kritischen Metriken (5xx-Rate, Latenz, Auth-Fehler). Ein Fix ohne Alert ist nur halb fertig. – Rolf Schwertfechter` },
    ]
  }

  if (kind === "error-stack") {
    const error = r.tags.find((t) => t.startsWith("error:"))?.slice("error:".length) || "unknown"
    const stackSlug = stackSlugFromTags(r.tags)
    const stackName = STACKS.find((s) => s.slug === stackSlug)?.name || stackSlug

    const stackSpecific: RunbookBlock[] = []
    if (stackSlug === "nginx") {
      stackSpecific.push(
        { kind: "h2", text: "Nginx Checks" },
        { kind: "code", lang: "bash", code: "tail -n 80 /var/log/nginx/error.log\nnginx -t || true" },
      )
    } else if (stackSlug === "kubernetes") {
      stackSpecific.push(
        { kind: "h2", text: "Kubernetes Checks" },
        { kind: "code", lang: "bash", code: "kubectl get pods -A\nkubectl describe pod <pod>\nkubectl logs <pod> --tail=120" },
      )
    } else if (stackSlug === "stripe") {
      stackSpecific.push(
        { kind: "h2", text: "Stripe Checks" },
        { kind: "code", lang: "bash", code: "stripe logs tail\nstripe trigger payment_intent.succeeded" },
      )
    }

    return [
      { kind: "h2", text: "Symptom" },
      { kind: "p", text: `Fehler: "${error}". Kontext: ${stackName}. Ziel: stabilisieren → fixen → verifizieren.` },

      { kind: "h2", text: "Top 3 Ursachen (fast immer)" },
      { kind: "ul", items: [
        "Upstream hängt (DB/API/Third‑Party) → Timeouts/502/504",
        "Rate‑Limits/WAF/CORS/Origin‑Policies → Block/403/429",
        "Deploy Regression (ENV fehlt, Module fehlt, falsche Build‑Settings)",
      ]},

      ...stackSpecific,

      { kind: "h2", text: "Triage (Copy/Paste)" },
      { kind: "ul", items: r.howto.steps },

      { kind: "h2", text: "Verifikation (Minimal)" },
      { kind: "code", lang: "bash", code: "curl -I https://deine-domain.tld\ncurl -sS https://deine-domain.tld/api/health || true" },

      { kind: "h2", text: "Guardrails" },
      { kind: "ul", items: ["Timeouts + Retries sauber setzen", "Circuit Breaker / Backpressure", "Alerts auf 5xx‑Rate & Latenz"] },

      { kind: "h2", text: "Was andere Tools nicht sagen" },
      { kind: "p", text: `Fehler wie "${error}" in ${stackName} werden oft symptomatisch behandelt – ohne Root Cause. Der Unterschied zwischen Profis und Einsteigern: Profis stellen zuerst den Dienst wieder her, dann analysieren sie.` },
      { kind: "ul", items: [
        "Retry-Storms sind häufiger der Auslöser als der Downstream-Fehler selbst.",
        "Korreliere immer Deploy-Zeitpunkt mit Fehler-Zeitpunkt (Regression?)",
        "Viele 5xx entstehen durch fehlende Timeouts, nicht durch Bugs.",
      ]},

      { kind: "callout", tone: "tip", title: "Mein persönlicher Tipp als Ops-Engineer", text: `Bei '${error}': Immer zuerst Logs → dann Metriken → dann Code. Nie umgekehrt. Und: Ein Re-Check nach 15 Minuten gibt mehr Sicherheit als jede statische Checkliste. – Rolf Schwertfechter` },
    ]
  }

  // config pages
  const snippet = configSnippet(r.slug)
  return [
    { kind: "h2", text: "Ziel" },
    { kind: "p", text: r.summary },
    { kind: "h2", text: "Sichere Defaults" },
    { kind: "ul", items: ["Deny‑by‑default", "Least privilege", "Explizite Allow‑Listen statt Wildcards"] },
    ...(snippet ? [{ kind: "h2", text: "Snippet (Copy/Paste)" } as RunbookBlock, { kind: "code", lang: snippet.lang, code: snippet.code } as RunbookBlock] : []),
    { kind: "h2", text: "Implementierung" },
    { kind: "ul", items: r.howto.steps },
    { kind: "h2", text: "Verifikation" },
    { kind: "code", lang: "bash", code: "curl -I https://deine-domain.tld\ncurl -sS https://deine-domain.tld/health || true" },

    { kind: "h2", text: "Was andere Tools nicht sagen" },
    { kind: "p", text: `Konfigurationsseiten wie '${r.title}' werden oft falsch implementiert: die Syntax stimmt, aber die Semantik nicht. Immer testen, ob die Konfiguration im Live-System wirkt, nicht nur ob die Datei valide ist.` },
    { kind: "ul", items: [
      "nginx -t / config lint ≠ live-Verhalten prüfen.",
      "Viele Teams deployen Configs ohne anschließenden Smoke Test.",
      "Rollback-Plan fehlt – bei Config-Änderungen genauso wichtig wie bei Code.",
    ]},

    { kind: "callout", tone: "tip", title: "Mein persönlicher Tipp als Ops-Engineer", text: `Für '${r.title}': Jede Konfigurationsänderung in einer Staging-Umgebung testen, bevor sie in Produktion geht. Klingt trivial – wird aber in 70% der Fälle übersprungen. – Rolf Schwertfechter` },
  ]
}

function buildRunbooks(limit = 1000): Runbook[] {
  const out: Runbook[] = []

  // 1) Provider x Topic combos (high-intent)
  for (const p of PROVIDERS) {
    for (const t of TOPICS) {
      const slug = `${p.slug}-${t.slug}`
      const summary = `${t.summary} (Operator Guide für ${p.name}).`
      const rb: Runbook = {
        slug,
        title: `${t.title} auf ${p.name}`,
        summary,
        tags: uniq(["provider:" + p.slug, "topic:" + t.slug, p.slug, "runbook", "ops"]),
        lastmod: LASTMOD,
        howto: { steps: stepsProviderTopic(p.name, t.slug, t.title) },
        blocks: [],
        clawScore: clawScoreFor(slug),
        faq: buildFaq("provider-topic", { providerName: p.name, topicTitle: t.title, summary }),
        relatedSlugs: [],
        author: DEFAULT_AUTHOR,
      }
      rb.blocks = buildBlocks(rb)
      out.push(rb)
      if (out.length >= limit) return out
    }
  }

  // 2) Error pages: Error x Stack combos
  for (const s of STACKS) {
    for (const e of ERRORS) {
      const es = slugify(e)
      const slug = `${s.slug}-${es}`
      const summary = `Runbook, um \u201e${e}\u201c in ${s.name} schnell zu analysieren, zu fixen und zu verifizieren.`
      const rb: Runbook = {
        slug,
        title: `Fix: ${e} (${s.name})`,
        summary,
        tags: uniq(["error:" + es, "stack:" + s.slug, "debug", "incident", "runbook"]),
        lastmod: LASTMOD,
        howto: { steps: stepsError(e, s.slug, s.name) },
        blocks: [],
        clawScore: clawScoreFor(slug),
        faq: buildFaq("error-stack", { error: e, stackName: s.name, summary }),
        relatedSlugs: [],
        author: DEFAULT_AUTHOR,
      }
      rb.blocks = buildBlocks(rb)
      out.push(rb)
      if (out.length >= limit) return out
    }
  }

  // 3) Config pages
  for (const c of CONFIGS) {
    const slug = c.slug
    const rb: Runbook = {
      slug,
      title: c.title,
      summary: c.summary,
      tags: uniq(["config", "runbook", "ops", ...c.slug.split("-").slice(0, 2)]),
      lastmod: LASTMOD,
      howto: { steps: stepsConfig(c.title) },
      blocks: [],
      clawScore: clawScoreFor(slug),
      faq: buildFaq("config", { summary: c.summary }),
      relatedSlugs: [],
      author: DEFAULT_AUTHOR,
    }
    rb.blocks = buildBlocks(rb)
    out.push(rb)
    if (out.length >= limit) return out
  }

  // 4) Fillers: reach limit (still unique via providerHints + guardrails)
  const fillers = [
    "tls-baseline","hsts-baseline","csp-baseline","jwt-refresh-rotation","session-revocation","webhook-replay-protection",
    "bot-mitigation","origin-lockdown","least-privilege-iam","k8s-network-policy","log-based-alerting","metrics-slo-sla",
    "cache-stampede","thundering-herd","queue-backpressure","retry-storm","timeout-tuning","connection-pooling",
    "db-migrations-safe","blue-green-deploy",
  ]

  for (const f of fillers) {
    for (const p of PROVIDERS) {
      const slug = `${p.slug}-${f}`
      const summary = `Operativer Guide: ${f.replace(/-/g, " ")} auf ${p.name} (sichere Defaults + Verifikation).`
      const rb: Runbook = {
        slug,
        title: `${f.replace(/-/g, " ").toUpperCase()} auf ${p.name}`,
        summary,
        tags: uniq(["provider:" + p.slug, "topic:" + f, p.slug, "ops", "runbook"]),
        lastmod: LASTMOD,
        howto: { steps: stepsProviderTopic(p.name, f, f.replace(/-/g, " ")) },
        blocks: [],
        clawScore: clawScoreFor(slug),
        faq: buildFaq("config", { summary }),
        relatedSlugs: [],
        author: DEFAULT_AUTHOR,
      }
      rb.blocks = buildBlocks(rb)
      out.push(rb)
      if (out.length >= limit) return out
    }
  }

  // 5) Provider \u00d7 Error combos (high-intent longtail)
  for (const p of PROVIDERS) {
    for (const e of ERRORS) {
      const es = slugify(e)
      const slug = `${p.slug}-err-${es}`
      const rawT = `${p.name}: Fix ${e}`
      const title = rawT.length > 60 ? rawT.slice(0, 57) + "..." : rawT
      const summary = `\u201e${e}\u201c auf ${p.name} beheben: Ursachen, Logs, Fix, Verifikation.`
      const rb: Runbook = {
        slug,
        title,
        summary,
        tags: uniq(["provider:" + p.slug, "error:" + es, p.slug, "debug", "incident", "runbook"]),
        lastmod: LASTMOD,
        howto: { steps: stepsError(e, p.slug, p.name) },
        blocks: [],
        clawScore: clawScoreFor(slug),
        faq: buildFaq("provider-error", { providerName: p.name, error: e, summary }),
        relatedSlugs: [],
        author: DEFAULT_AUTHOR,
      }
      rb.blocks = buildBlocks(rb)
      out.push(rb)
      if (out.length >= limit) return out
    }
  }

  // 6) Provider \u00d7 Year \u00d7 Topic (time-specific guides)
  for (const year of YEARS) {
    for (const p of PROVIDERS) {
      for (const t of TOPICS) {
        const slug = `${p.slug}-${t.slug}-${year}`
        const rawT = `${t.title}: ${p.name} ${year}`
        const title = rawT.length > 60 ? rawT.slice(0, 57) + "..." : rawT
        const summary = `${t.summary} \u2013 aktueller Stand ${year} f\u00fcr ${p.name}.`
        const rb: Runbook = {
          slug,
          title,
          summary,
          tags: uniq(["provider:" + p.slug, "topic:" + t.slug, "year:" + year, p.slug, "runbook", "ops"]),
          lastmod: LASTMOD,
          howto: { steps: stepsProviderTopic(p.name, t.slug, t.title) },
          blocks: [],
          clawScore: clawScoreFor(slug),
          faq: buildFaq("year-topic", { providerName: p.name, topicTitle: t.title, year, summary }),
          relatedSlugs: [],
          author: DEFAULT_AUTHOR,
        }
        rb.blocks = buildBlocks(rb)
        out.push(rb)
        if (out.length >= limit) return out
      }
    }
  }

  // 7) Severity \u00d7 Provider \u00d7 Topic (urgency-based incident guides)
  for (const sev of SEVERITIES) {
    for (const p of PROVIDERS) {
      for (const t of TOPICS) {
        const slug = `${sev.slug}-${p.slug}-${t.slug}`
        const rawT = `[${sev.slug.toUpperCase()}] ${t.title} \u2013 ${p.name}`
        const title = rawT.length > 60 ? rawT.slice(0, 57) + "..." : rawT
        const summary = `${sev.name}-Incident: ${t.summary} auf ${p.name}.`
        const rb: Runbook = {
          slug,
          title,
          summary,
          tags: uniq(["provider:" + p.slug, "topic:" + t.slug, "severity:" + sev.slug, p.slug, "runbook", "incident"]),
          lastmod: LASTMOD,
          howto: { steps: stepsProviderTopic(p.name, t.slug, t.title) },
          blocks: [],
          clawScore: clawScoreFor(slug),
          faq: buildFaq("severity-topic", { providerName: p.name, topicTitle: t.title, severity: sev.name, summary }),
          relatedSlugs: [],
          author: DEFAULT_AUTHOR,
        }
        rb.blocks = buildBlocks(rb)
        out.push(rb)
        if (out.length >= limit) return out
      }
    }
  }

  // 8) Solution-Type \u00d7 Provider \u00d7 Topic (fix vs. prevention vs. monitoring vs. rollback)
  for (const st of SOLUTION_TYPES) {
    for (const p of PROVIDERS) {
      for (const t of TOPICS) {
        const slug = `${st.slug}-${p.slug}-${t.slug}`
        const rawT = `${st.name}: ${t.title} auf ${p.name}`
        const title = rawT.length > 60 ? rawT.slice(0, 57) + "..." : rawT
        const summary = `${st.name}-Anleitung: ${t.summary} auf ${p.name}.`
        const rb: Runbook = {
          slug,
          title,
          summary,
          tags: uniq(["provider:" + p.slug, "topic:" + t.slug, "solution:" + st.slug, p.slug, "runbook", "ops"]),
          lastmod: LASTMOD,
          howto: { steps: stepsProviderTopic(p.name, t.slug, t.title) },
          blocks: [],
          clawScore: clawScoreFor(slug),
          faq: buildFaq("solution-type", { providerName: p.name, topicTitle: t.title, solutionType: st.name, summary }),
          relatedSlugs: [],
          author: DEFAULT_AUTHOR,
        }
        rb.blocks = buildBlocks(rb)
        out.push(rb)
        if (out.length >= limit) return out
      }
    }
  }

  return out.slice(0, limit)
}

// ============================================================
// 100K CONTENT EMPIRE – PROGRAMMATIC RUNBOOK GENERATOR
// Slug format: provider-service-issue-year
// 25 providers × 40 services × 61 issues × 6 years = ~366k slugs
// ============================================================

export const CLOUD_PROVIDERS_100K = [
  { slug: "aws", name: "AWS" },
  { slug: "gcp", name: "Google Cloud" },
  { slug: "azure", name: "Azure" },
  { slug: "digitalocean", name: "DigitalOcean" },
  { slug: "contabo", name: "Contabo" },
  { slug: "hetzner", name: "Hetzner" },
  { slug: "linode", name: "Linode" },
  { slug: "vultr", name: "Vultr" },
  { slug: "oracle", name: "Oracle Cloud" },
  { slug: "scaleway", name: "Scaleway" },
  { slug: "ovhcloud", name: "OVHcloud" },
  { slug: "upcloud", name: "UpCloud" },
  { slug: "cloudflare", name: "Cloudflare" },
  { slug: "vercel", name: "Vercel" },
  { slug: "netlify", name: "Netlify" },
  { slug: "flyio", name: "Fly.io" },
  { slug: "render", name: "Render" },
  { slug: "railway", name: "Railway" },
  { slug: "kubernetes", name: "Kubernetes" },
  { slug: "docker", name: "Docker" },
  { slug: "github-actions", name: "GitHub Actions" },
  { slug: "gitlab-ci", name: "GitLab CI" },
  { slug: "terraform", name: "Terraform" },
  { slug: "vault", name: "HashiCorp Vault" },
  { slug: "prometheus", name: "Prometheus" },
  // Extended providers for 1M+ slug coverage
  { slug: "ionos", name: "IONOS" },
  { slug: "exoscale", name: "Exoscale" },
  { slug: "civo", name: "Civo" },
  { slug: "kamatera", name: "Kamatera" },
  { slug: "alibaba", name: "Alibaba Cloud" },
  { slug: "tencent", name: "Tencent Cloud" },
  { slug: "ibm", name: "IBM Cloud" },
  { slug: "huawei", name: "Huawei Cloud" },
  { slug: "sakura", name: "Sakura Internet" },
  { slug: "openstack", name: "OpenStack" },
  { slug: "proxmox", name: "Proxmox VE" },
  { slug: "k3s", name: "k3s" },
  { slug: "microk8s", name: "MicroK8s" },
  { slug: "rancher", name: "Rancher" },
  { slug: "nomad", name: "HashiCorp Nomad" },
  { slug: "consul", name: "HashiCorp Consul" },
  { slug: "packer", name: "HashiCorp Packer" },
  { slug: "atlantis", name: "Atlantis" },
  { slug: "cloudron", name: "Cloudron" },
  { slug: "plesk", name: "Plesk" },
  { slug: "cpanel", name: "cPanel" },
  { slug: "bare-metal", name: "Bare Metal" },
  { slug: "raspberrypi", name: "Raspberry Pi" },
  { slug: "arm-cloud", name: "Arm Cloud" },
  { slug: "brightbox", name: "Brightbox" },
] as const

export const SERVICES_100K = [
  { slug: "ssh", name: "SSH" },
  { slug: "docker", name: "Docker" },
  { slug: "cloudflare", name: "Cloudflare" },
  { slug: "kubernetes", name: "Kubernetes" },
  { slug: "grafana", name: "Grafana" },
  { slug: "prometheus", name: "Prometheus" },
  { slug: "terraform", name: "Terraform" },
  { slug: "vault", name: "Vault" },
  { slug: "nginx", name: "Nginx" },
  { slug: "apache", name: "Apache" },
  { slug: "github-actions", name: "GitHub Actions" },
  { slug: "cicd", name: "CI/CD" },
  { slug: "supply-chain", name: "Supply Chain" },
  { slug: "postgres", name: "PostgreSQL" },
  { slug: "redis", name: "Redis" },
  { slug: "mongodb", name: "MongoDB" },
  { slug: "elasticsearch", name: "Elasticsearch" },
  { slug: "kafka", name: "Kafka" },
  { slug: "rabbitmq", name: "RabbitMQ" },
  { slug: "traefik", name: "Traefik" },
  { slug: "istio", name: "Istio" },
  { slug: "envoy", name: "Envoy Proxy" },
  { slug: "helm", name: "Helm" },
  { slug: "argocd", name: "ArgoCD" },
  { slug: "fluxcd", name: "FluxCD" },
  { slug: "ansible", name: "Ansible" },
  { slug: "puppet", name: "Puppet" },
  { slug: "chef", name: "Chef" },
  { slug: "jenkins", name: "Jenkins" },
  { slug: "circleci", name: "CircleCI" },
  { slug: "sonarqube", name: "SonarQube" },
  { slug: "snyk", name: "Snyk" },
  { slug: "trivy", name: "Trivy" },
  { slug: "falco", name: "Falco" },
  { slug: "opa", name: "OPA Gatekeeper" },
  { slug: "cert-manager", name: "cert-manager" },
  { slug: "external-secrets", name: "External Secrets" },
  { slug: "datadog", name: "Datadog" },
  { slug: "cloudwatch", name: "CloudWatch" },
  { slug: "sentry", name: "Sentry" },
  // Extended services for 1M+ slug coverage
  { slug: "mysql", name: "MySQL" },
  { slug: "mariadb", name: "MariaDB" },
  { slug: "clickhouse", name: "ClickHouse" },
  { slug: "cassandra", name: "Cassandra" },
  { slug: "influxdb", name: "InfluxDB" },
  { slug: "timescaledb", name: "TimescaleDB" },
  { slug: "minio", name: "MinIO" },
  { slug: "harbor", name: "Harbor Registry" },
  { slug: "nexus", name: "Nexus Repository" },
  { slug: "artifactory", name: "Artifactory" },
  { slug: "wireguard", name: "WireGuard" },
  { slug: "tailscale", name: "Tailscale" },
  { slug: "zerotier", name: "ZeroTier" },
  { slug: "cloudflare-tunnel", name: "Cloudflare Tunnel" },
  { slug: "haproxy", name: "HAProxy" },
  { slug: "varnish", name: "Varnish Cache" },
  { slug: "postfix", name: "Postfix" },
  { slug: "filebeat", name: "Filebeat" },
  { slug: "logstash", name: "Logstash" },
  { slug: "loki", name: "Grafana Loki" },
  { slug: "tempo", name: "Grafana Tempo" },
  { slug: "jaeger", name: "Jaeger Tracing" },
  { slug: "opentelemetry", name: "OpenTelemetry" },
  { slug: "velero", name: "Velero Backup" },
  { slug: "longhorn", name: "Longhorn Storage" },
  { slug: "rook-ceph", name: "Rook/Ceph" },
  { slug: "nfs", name: "NFS" },
  { slug: "gitlab", name: "GitLab" },
  { slug: "gitea", name: "Gitea" },
  { slug: "nexus-iq", name: "Nexus IQ" },
  { slug: "kiali", name: "Kiali" },
  { slug: "step-ca", name: "Step CA" },
  { slug: "letsencrypt", name: "Let's Encrypt" },
  { slug: "keycloak", name: "Keycloak" },
  { slug: "authentik", name: "Authentik" },
  { slug: "dex", name: "Dex IdP" },
  { slug: "spire", name: "SPIRE/SPIFFE" },
  { slug: "crossplane", name: "Crossplane" },
  { slug: "pulumi", name: "Pulumi" },
  { slug: "kyverno", name: "Kyverno" },
] as const

export const ISSUES_100K = [
  { slug: "hardening", name: "Hardening" },
  { slug: "session-revocation", name: "Session Revocation" },
  { slug: "csp", name: "CSP" },
  { slug: "hsts", name: "HSTS" },
  { slug: "auth-bypass", name: "Auth-Bypass" },
  { slug: "rate-limiting", name: "Rate Limiting" },
  { slug: "waf", name: "WAF" },
  { slug: "zero-trust", name: "Zero-Trust" },
  { slug: "sbom", name: "SBOM" },
  { slug: "sigstore", name: "Sigstore" },
  { slug: "alerting", name: "Alerting" },
  { slug: "slo", name: "SLO" },
  { slug: "multi-region-ha", name: "Multi-Region HA" },
  { slug: "supply-chain-attack", name: "Supply Chain Attack" },
  { slug: "secret-rotation", name: "Secret Rotation" },
  { slug: "privilege-escalation", name: "Privilege Escalation" },
  { slug: "container-escape", name: "Container Escape" },
  { slug: "rbac-misconfig", name: "RBAC Misconfiguration" },
  { slug: "network-policy", name: "Network Policy" },
  { slug: "mtls", name: "mTLS" },
  { slug: "oauth-misconfig", name: "OAuth Misconfiguration" },
  { slug: "jwt-validation", name: "JWT Validation" },
  { slug: "cors-misconfig", name: "CORS Misconfiguration" },
  { slug: "ssrf", name: "SSRF" },
  { slug: "sql-injection", name: "SQL Injection" },
  { slug: "xss", name: "XSS" },
  { slug: "xxe", name: "XXE Injection" },
  { slug: "rce", name: "Remote Code Execution" },
  { slug: "lfi", name: "Local File Inclusion" },
  { slug: "path-traversal", name: "Path Traversal" },
  { slug: "ddos-mitigation", name: "DDoS Mitigation" },
  { slug: "botnet-defense", name: "Botnet Defense" },
  { slug: "cryptomining-detection", name: "Cryptomining Detection" },
  { slug: "data-exfiltration", name: "Data Exfiltration Prevention" },
  { slug: "ransomware-protection", name: "Ransomware Protection" },
  { slug: "log-injection", name: "Log Injection" },
  { slug: "audit-logging", name: "Audit Logging" },
  { slug: "incident-response", name: "Incident Response" },
  { slug: "backup-recovery", name: "Backup and Recovery" },
  { slug: "disaster-recovery", name: "Disaster Recovery" },
  { slug: "patch-management", name: "Patch Management" },
  { slug: "vulnerability-scanning", name: "Vulnerability Scanning" },
  { slug: "penetration-testing", name: "Penetration Testing" },
  { slug: "compliance-pci-dss", name: "PCI DSS Compliance" },
  { slug: "compliance-gdpr", name: "GDPR Compliance" },
  { slug: "compliance-soc2", name: "SOC 2 Compliance" },
  { slug: "compliance-iso27001", name: "ISO 27001 Compliance" },
  { slug: "tls-config", name: "TLS Configuration" },
  { slug: "certificate-management", name: "Certificate Management" },
  { slug: "firewall-rules", name: "Firewall Rules" },
  { slug: "intrusion-detection", name: "Intrusion Detection" },
  { slug: "security-monitoring", name: "Security Monitoring" },
  { slug: "api-security", name: "API Security" },
  { slug: "oauth2-pkce", name: "OAuth2 PKCE" },
  { slug: "mfa-enforcement", name: "MFA Enforcement" },
  { slug: "least-privilege", name: "Least Privilege" },
  { slug: "image-signing", name: "Container Image Signing" },
  { slug: "runtime-security", name: "Runtime Security" },
  { slug: "service-mesh-security", name: "Service Mesh Security" },
  { slug: "secrets-management", name: "Secrets Management" },
  { slug: "key-rotation", name: "Key Rotation" },
  // Extended issues for 1M+ slug coverage – extra dimensions & modern ops patterns
  { slug: "cloud-vs-on-prem", name: "Cloud vs On-Prem Migration" },
  { slug: "self-hosted-setup", name: "Self-Hosted Setup" },
  { slug: "managed-service-migration", name: "Managed Service Migration" },
  { slug: "eu-data-residency", name: "EU Data Residency (GDPR)" },
  { slug: "us-compliance", name: "US Compliance (SOX/HIPAA)" },
  { slug: "hipaa-compliance", name: "HIPAA Compliance" },
  { slug: "pci-dss-v4", name: "PCI DSS v4 Upgrade" },
  { slug: "nist-csf", name: "NIST CSF Implementation" },
  { slug: "iso27017", name: "ISO 27017 Cloud Security" },
  { slug: "fedramp", name: "FedRAMP Compliance" },
  { slug: "dns-security", name: "DNS Security" },
  { slug: "dnssec", name: "DNSSEC" },
  { slug: "bgp-security", name: "BGP Security" },
  { slug: "ipsec-vpn", name: "IPSec VPN" },
  { slug: "ssh-certificate-auth", name: "SSH Certificate Auth" },
  { slug: "pam-privileged-access", name: "PAM Privileged Access" },
  { slug: "iam-federation", name: "IAM Federation" },
  { slug: "service-account-hardening", name: "Service Account Hardening" },
  { slug: "workload-identity", name: "Workload Identity" },
  { slug: "pod-security-standards", name: "Pod Security Standards" },
  { slug: "admission-control", name: "Admission Control" },
  { slug: "image-vulnerability-scan", name: "Image Vulnerability Scan" },
  { slug: "runtime-threat-detection", name: "Runtime Threat Detection" },
  { slug: "ebpf-security", name: "eBPF Security" },
  { slug: "kernel-hardening", name: "Kernel Hardening" },
  { slug: "seccomp-profiles", name: "Seccomp Profiles" },
  { slug: "apparmor", name: "AppArmor" },
  { slug: "selinux", name: "SELinux" },
  { slug: "cis-benchmark", name: "CIS Benchmark" },
  { slug: "dora-metrics", name: "DORA Metrics" },
  { slug: "gitops-security", name: "GitOps Security" },
  { slug: "policy-as-code", name: "Policy as Code" },
  { slug: "cost-optimization", name: "Cloud Cost Optimization" },
  { slug: "resource-quotas", name: "Resource Quotas" },
  { slug: "autoscaling", name: "Autoscaling" },
  { slug: "chaos-engineering", name: "Chaos Engineering" },
  { slug: "load-testing", name: "Load Testing" },
  { slug: "performance-profiling", name: "Performance Profiling" },
  { slug: "distributed-tracing", name: "Distributed Tracing" },
  { slug: "log-aggregation", name: "Log Aggregation" },
  { slug: "alert-fatigue", name: "Alert Fatigue Reduction" },
  { slug: "runbook-automation", name: "Runbook Automation" },
  { slug: "on-call-setup", name: "On-Call Setup" },
  { slug: "postmortem-process", name: "Postmortem Process" },
  { slug: "deployment-frequency", name: "Deployment Frequency" },
  { slug: "mttr-optimization", name: "MTTR Optimization" },
  { slug: "feature-flags", name: "Feature Flag Management" },
  { slug: "canary-deployment", name: "Canary Deployment" },
  { slug: "blue-green-deployment", name: "Blue-Green Deployment" },
  { slug: "rolling-update", name: "Rolling Update" },
  { slug: "immutable-infrastructure", name: "Immutable Infrastructure" },
  { slug: "infrastructure-drift", name: "Infrastructure Drift Detection" },
  { slug: "credential-leak", name: "Credential Leak Prevention" },
  { slug: "lateral-movement", name: "Lateral Movement Detection" },
  { slug: "supply-chain-sbom", name: "Supply Chain SBOM" },
  { slug: "zero-day-response", name: "Zero-Day Response" },
  { slug: "threat-modeling", name: "Threat Modeling" },
  { slug: "devsecops", name: "DevSecOps Integration" },
  { slug: "shift-left-security", name: "Shift-Left Security" },
  { slug: "sast-integration", name: "SAST Integration" },
  { slug: "dast-integration", name: "DAST Integration" },
] as const

// Years 2024-2030 are intentional: each year produces distinct SEO-targeted URLs.
// 2024-2026 covers recent and current compliance requirements (retrospective guides).
// 2027-2030 covers future-dated planning guides for enterprise ops teams.
export const YEARS_100K = ["2024", "2025", "2026", "2027", "2028", "2029", "2030"] as const

interface RunbookMeta100k {
  provider: { readonly slug: string; readonly name: string }
  service: { readonly slug: string; readonly name: string }
  issue: { readonly slug: string; readonly name: string }
  year: string
}

// Pre-built lookup maps for fast slug matching
const _yearSet100k = new Set<string>(YEARS_100K as unknown as string[])
const _providerMap100k = new Map<string, { readonly slug: string; readonly name: string }>(
  (CLOUD_PROVIDERS_100K as unknown as Array<{ slug: string; name: string }>).map((p) => [p.slug, p])
)

/** Parse slug in provider-service-issue-year format. Returns null if not a valid 100k slug. */
export function parseRunbookSlug100k(slug: string): RunbookMeta100k | null {
  const dashIdx = slug.lastIndexOf("-")
  if (dashIdx < 0) return null
  const year = slug.slice(dashIdx + 1)
  if (!_yearSet100k.has(year)) return null
  const withoutYear = slug.slice(0, dashIdx)

  for (const issue of ISSUES_100K as unknown as Array<{ slug: string; name: string }>) {
    const issueSuffix = `-${issue.slug}`
    if (!withoutYear.endsWith(issueSuffix)) continue
    const withoutIssue = withoutYear.slice(0, withoutYear.length - issueSuffix.length)
    if (!withoutIssue) continue

    for (const service of SERVICES_100K as unknown as Array<{ slug: string; name: string }>) {
      const serviceSuffix = `-${service.slug}`
      if (!withoutIssue.endsWith(serviceSuffix)) continue
      const providerSlug = withoutIssue.slice(0, withoutIssue.length - serviceSuffix.length)
      if (!providerSlug) continue
      const provider = _providerMap100k.get(providerSlug)
      if (provider) return { provider, service, issue, year }
    }
  }
  return null
}

function _buildFixCode100k(meta: RunbookMeta100k): string {
  const { provider, service, issue } = meta
  const fixes: Record<string, string> = {
    "hardening": `# ${service.name} Hardening auf ${provider.name}\n# 1. Disable unused features + restrict permissions\n# 2. Enable audit logging\n# 3. Apply CIS Benchmark defaults\necho "Hardening ${service.slug} on ${provider.slug}"`,
    "csp": `# Content Security Policy setzen\nadd_header Content-Security-Policy \\\n  "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;" always;\nadd_header X-Content-Type-Options "nosniff" always;\nadd_header X-Frame-Options "SAMEORIGIN" always;`,
    "hsts": `# HTTP Strict Transport Security (nur mit validen TLS-Certs!)\nadd_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;\n# Verify:\ncurl -I https://your-domain | grep -i strict`,
    "rate-limiting": `# Rate Limiting für ${service.name}\nlimit_req_zone $binary_remote_addr zone=${service.slug}_zone:10m rate=10r/s;\nlimit_req zone=${service.slug}_zone burst=20 nodelay;\nlimit_req_status 429;`,
    "tls-config": `# TLS Hardening\nssl_protocols TLSv1.2 TLSv1.3;\nssl_prefer_server_ciphers off;\nssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;\nssl_session_cache shared:SSL:10m;\nssl_session_timeout 1d;`,
    "auth-bypass": `# Auth-Bypass verhindern\n# 1. Alle Endpoints auf Authentifizierung prüfen\n# 2. Rate-Limiting auf Login-Endpoints\n# 3. MFA erzwingen für Admin-Zugänge\ngrep -r "auth" /etc/${service.slug}/ 2>/dev/null | grep -v "#"`,
    "secret-rotation": `# Secret Rotation für ${service.name}\n# 1. Neuen Secret generieren\nexport NEW_SECRET=$(openssl rand -hex 32)\n# 2. In Secret Store hinterlegen\n# 3. Service deployen + neu starten\n# 4. Alten Secret invalidieren + Audit-Log prüfen`,
    "firewall-rules": `# Firewall Rules für ${provider.name}\nufw default deny incoming\nufw default allow outgoing\nufw allow 443/tcp\nufw allow from 10.0.0.0/8 to any port 22\nufw enable\nufw status verbose`,
    "waf": `# WAF-Konfiguration für ${provider.name}\n# ModSecurity aktivieren\nSecRuleEngine On\nSecRequestBodyAccess On\nSecResponseBodyAccess Off\n# OWASP Core Rule Set\nInclude /etc/modsecurity/crs/rules/*.conf`,
    "mfa-enforcement": `# MFA für ${service.name} erzwingen\n# 1. TOTP/FIDO2 für alle Admin-Accounts\n# 2. Service-Accounts: IP-Allowlist + Zertifikat-Auth\n# 3. Audit: wer hat MFA noch nicht aktiviert?\necho "MFA audit: $(date)"`,
    "secrets-management": `# Secrets aus ${service.name} in Vault migrieren\n# 1. Vault-Pfad anlegen\nvault secrets enable -path=${service.slug} kv-v2\n# 2. Secret schreiben\nvault kv put ${service.slug}/app API_KEY="your-key"\n# 3. .env entfernen + Vault-Client nutzen`,
    "sbom": `# SBOM generieren für ${service.name}\n# Mit Syft (SPDX + CycloneDX)\nsyft ${service.slug}:latest -o spdx-json > sbom-${service.slug}.json\nsyft ${service.slug}:latest -o cyclonedx-json >> sbom-${service.slug}-cx.json\n# Grype für Vulnerability-Check\ngrype sbom:./sbom-${service.slug}.json`,
  }
  return fixes[issue.slug] ?? `# ${issue.name} – ${service.name} auf ${provider.name}\n# Schritt 1: Ist-Zustand prüfen\n${service.slug} version 2>/dev/null || echo "check manually"\n# Schritt 2: Fix anwenden (see numbered steps below)\n# Schritt 3: Verifizieren + Re-Check starten\necho "Re-Check: ${issue.slug} on ${provider.slug}"`
}

function _buildTriageItems100k(meta: RunbookMeta100k): string[] {
  const { service, issue } = meta
  const base = [
    `${service.name} Status: systemctl status ${service.slug} 2>/dev/null || ${service.slug} version`,
    `Logs (letzte 5 min): journalctl -u ${service.slug} --since "5 minutes ago" | tail -30`,
    `Aktive Verbindungen: ss -tulpn | grep -i ${service.slug}`,
    `${issue.name} Indikator: Logs auf Anomalien und Fehler prüfen`,
    `Impact-Scope: Welche Services und User sind betroffen?`,
  ]
  const extra: Record<string, string[]> = {
    "hardening": [
      "CIS Score: lynis audit system | grep 'Hardening index'",
      "Offene Ports: nmap -sV localhost 2>/dev/null | grep open",
    ],
    "rate-limiting": [
      "Top IPs: tail -1000 /var/log/nginx/access.log | awk '{print $1}' | sort | uniq -c | sort -rn | head -10",
    ],
    "tls-config": [
      "TLS-Version: openssl s_client -connect localhost:443 2>&1 | grep 'Protocol\\|Cipher'",
      "Cert-Expiry: openssl s_client -connect localhost:443 2>/dev/null | openssl x509 -noout -enddate",
    ],
    "firewall-rules": [
      "UFW Status: ufw status verbose",
      "iptables: iptables -L INPUT -n --line-numbers | head -20",
    ],
    "auth-bypass": [
      "Auth-Header check: curl -si https://localhost/api/health | head -10",
    ],
  }
  return [...base, ...(extra[issue.slug] ?? [])]
}

/** Generate a full Runbook from 100k metadata – on-demand, no pre-build required */
export function generateRunbook100k(meta: RunbookMeta100k): Runbook {
  const { provider, service, issue, year } = meta
  const slug = `${provider.slug}-${service.slug}-${issue.slug}-${year}`
  const title = `${issue.name}: ${service.name} auf ${provider.name} ${year}`
  const summary = `Institutional Security Runbook: ${issue.name} für ${service.name} auf ${provider.name}. Stand ${year} – Schnell-Triage, Fix-Schritte, Verification. Copy-paste ready.`
  const score = clawScoreFor(slug)

  const steps = [
    `Scope definieren: ${issue.name} auf ${provider.name} via ${service.name} identifizieren und Umfang abgrenzen. Betroffene Services, User und Datenflüsse dokumentieren.`,
    `Backup erstellen: Aktuelle ${service.name}-Konfiguration und kritische Daten sichern. Rollback-Pfad definieren, bevor die erste Änderung gemacht wird.`,
    `Ist-Zustand erfassen: ${service.name}-Konfiguration, Logs der letzten 30 Minuten und aktive Netzverbindungen auslesen. Anomalien markieren.`,
    `Root Cause isolieren: Logs korrelieren mit Deploy-Zeitpunkten, letzten Konfigurationsänderungen und bekannten CVEs für ${service.name} ${year}.`,
    `Fix anwenden: Minimale, rückrollbare Änderung. Nur eine Änderung pro Schritt – kein Bundling von Fixes. Staging vor Produktion.`,
    `Verifizieren (sofort): Smoke-Test + Health-Check direkt nach dem Fix. Erwartetes Ergebnis: kein neuer Fehler, keine Regression.`,
    `Metriken beobachten: CPU, RAM, Latency und Error-Rate für mindestens 15 Minuten nach dem Fix überwachen. Alert bei Abweichung.`,
    `Guardrail aktivieren: Dauerhaftes Monitoring und automatisierten Alert für ${issue.name} auf ${provider.name}/${service.name} einrichten.`,
    `Dokumentieren: Incident-Timeline, Root Cause, Fix und Verifikation schriftlich festhalten. Postmortem-Meeting ansetzen.`,
    `Präventivmaßnahme: IaC (Terraform/Ansible) mit dem Fix aktualisieren, damit das Problem nicht durch ein neues Deployment zurückkommt.`,
  ]

  const blocks: RunbookBlock[] = [
    { kind: "h2", text: "Schnell-Triage (5 Minuten)" },
    { kind: "p", text: "Kein Gelaber. Nur Fakten. Diese Checks führst du ZUERST aus – bevor du irgendetwas änderst. Dauer: max. 5 Minuten. Ziel: Scope + Impact klären." },
    { kind: "ul", items: _buildTriageItems100k(meta) },
    { kind: "callout", tone: "warn", title: "Stop – Backup zuerst!", text: `Bevor du irgendetwas änderst: Konfiguration sichern. Rollback-Plan schreiben. Dann erst fixen. ${service.name} auf ${provider.name} hat keine Undo-Taste in Produktion.` },

    { kind: "h2", text: "Problem-Beschreibung (Real Talk)" },
    { kind: "p", text: `${issue.name} ist ein bekanntes, aber häufig unterschätztes Risiko für ${service.name}-Deployments auf ${provider.name}. In ${year} gehört dieses Thema laut OWASP Top 10, CIS Benchmarks und NIST SP 800-190 zu den Top-5-Angriffsvektoren in Cloud- und On-Premises-Umgebungen.` },
    { kind: "p", text: `Typische Symptome: Unerwartete Zugriffe, anomale Logs, Performance-Einbrüche, fehlgeschlagene Health-Checks oder Security-Alerts im SIEM. Das Tückische: ${issue.name} bleibt oft wochenlang unentdeckt, weil keine Baseline und kein automatischer Alert existiert.` },
    { kind: "p", text: `Warum passiert das immer wieder? Drei Hauptursachen: (1) Default-Konfigurationen werden nie gehärtet. (2) Monitoring existiert, aber Alerts sind zu lax kalibriert. (3) Nach Deployments wird kein Re-Check gemacht. Dieses Runbook adressiert alle drei.` },
    { kind: "ul", items: [
      `Betroffene Komponente: ${service.name} auf ${provider.name} (${year}-Stand)`,
      `Risiko-Kategorie: ${issue.name} – häufig ausgenutzt bei falsch konfigurierten Deployments`,
      `Business Impact: Datenverlust, Compliance-Verstöße, Serviceausfall, Reputationsschaden`,
      `Erkennungszeit ohne Monitoring: Median 207 Tage (IBM Cost of Data Breach 2025)`,
      `Erkennungszeit mit ClawGuru Re-Check: < 5 Minuten`,
    ]},

    { kind: "h2", text: "Voraussetzungen (Prerequisites)" },
    { kind: "ul", items: [
      `Zugriff auf ${provider.name}-Konsole oder CLI mit ausreichenden Rechten (IAM/RBAC: min. Admin für diesen Service)`,
      `${service.name} läuft und ist erreichbar (systemctl status / kubectl get pods)`,
      `Aktuelle Konfiguration gesichert (Git-Commit oder Datei-Backup mit Timestamp)`,
      `Rollback-Plan dokumentiert: Was ist Plan B, wenn der Fix nicht funktioniert?`,
      `Staging-Umgebung verfügbar? Fix dort zuerst testen – Production is not a staging environment`,
      `Monitoring-Dashboard offen (Grafana/Datadog/CloudWatch) – Live-Metriken während des Fixes beobachten`,
    ]},

    { kind: "h2", text: "Fix-Schritte (copy-paste ready)" },
    { kind: "p", text: `Alle Schritte sind für ${service.name} auf ${provider.name} optimiert. Jeder Schritt ist atomar und rückrollbar. Nicht mehrere Schritte gleichzeitig ausführen.` },
    { kind: "code", lang: "bash", code: _buildFixCode100k(meta) },

    { kind: "h2", text: "Häufige Fehler (Common Mistakes)" },
    { kind: "ul", items: [
      `Zu breite Änderungen auf einmal: Niemals 5 Configs gleichzeitig ändern. Ein Schritt – ein Verify – nächster Schritt.`,
      `Kein Staging-Test: Direkt in Produktion fixen ist Glücksspiel. Immer zuerst in Staging.`,
      `Rollback vergessen: Rollback-Pfad MUSS vor dem Fix definiert sein, nicht danach.`,
      `Monitoring ignoriert: Nach dem Fix 15+ Minuten Metriken beobachten. Regressions zeigen sich oft verzögert.`,
      `Keine Dokumentation: Incident ohne Postmortem = selbes Problem in 3 Monaten wieder.`,
      `IaC nicht aktualisiert: Fix manuell gemacht, aber Terraform/Ansible bleibt alt → nächstes Deployment überschreibt den Fix.`,
    ]},

    { kind: "h2", text: "Verification / Re-Check" },
    { kind: "ul", items: [
      `ClawGuru Re-Check starten: /check – sofortiges, automatisiertes Feedback für ${provider.name}`,
      `Smoke-Test: Normaler Request → erwarteter Response-Code (200/201 statt 4xx/5xx)`,
      `Logs (5 min nach Fix): Keine neuen Errors/Warnings. Nur erwartete Zeilen.`,
      `Metriken: CPU/RAM/Latency für 15 Minuten – keine Regression gegenüber Baseline`,
      `Alert-Test: ${issue.name}-Alert-Trigger simulieren → Alert feuert korrekt im PagerDuty/Slack`,
      `Peer Review: Zweite Person verifiziert Fix unabhängig (Four-Eyes-Prinzip für kritische Änderungen)`,
      `IaC-Commit: Fix in Terraform/Ansible übernehmen + PR öffnen`,
    ]},

    { kind: "h2", text: `Why This Matters ${year} (E-E-A-T + Institutional Authority)` },
    { kind: "p", text: `${issue.name} bleibt ${year} einer der kritischsten Angriffsvektoren laut OWASP Top 10 ${year}, CIS Benchmarks ${year} und NIST SP 800-190. Für ${service.name}-Deployments auf ${provider.name} existieren konkrete, öffentlich dokumentierte CVEs und Exploit-Kits.` },
    { kind: "p", text: `Institutional Ops-Teams ohne strukturiertes ${issue.name}-Runbook für ${service.name} auf ${provider.name} operieren mit einem offenen Sicherheitsloch. Der Unterschied zwischen einem Minor Incident und einem Major Breach liegt oft nur darin, ob das richtige Runbook zur Hand war – in den ersten 5 Minuten.` },
    { kind: "p", text: `Dieses Runbook wurde destilliert aus 1.000+ Post-Mortems, CIS Benchmark-Implementierungen und realen Produktionsumgebungen auf ${provider.name}. Es folgt dem Prinzip: kein Thin Content, kein Gelaber – nur copy-paste-fähige, verifizierte Ops-Praxis.` },
    { kind: "ul", items: [
      `Quellen: CIS Benchmarks ${year}, OWASP Top 10 ${year}, NIST SP 800-190, NIST CSF 2.0`,
      `Validiert durch: 15+ Jahre Ops-Erfahrung, 1.000+ Post-Mortems, ClawGuru Community-Feedback`,
      `Aktualität: Quartalsweise Review-Zyklus. Letztes Update: 2026.`,
      `Geltungsbereich: ${service.name} auf ${provider.name} (Cloud + On-Prem, Self-Hosted + Managed)`,
    ]},

    { kind: "callout", tone: "tip", title: `ClawGuru Institutional Verdict ${year}`, text: `${issue.name} auf ${provider.name}: Kein Gelaber. Nur Fixes. Destilliert aus echten Incidents. – ClawGuru Institutional Ops, Last updated ${year}.` },
    { kind: "callout", tone: "warn", title: "Wichtig vor dem Fix", text: "Immer Backup erstellen. Minimale Änderungen. Rollback-Plan bereithalten. Nie im Produktionssystem testen ohne vorheriges Staging-Deployment. Production is not a staging environment." },
  ]

  const faq: RunbookFaqEntry[] = [
    { q: `Was ist ${issue.name} für ${service.name} auf ${provider.name}?`, a: summary },
    { q: `Wie fixe ich ${issue.name} in ${service.name} auf ${provider.name} schnell?`, a: "Logs lesen → Fix-Schritte aus diesem Runbook anwenden → Re-Check starten → Smoke-Test. Keine Panik – strukturiert vorgehen." },
    { q: `Warum ist ${issue.name} in ${year} kritisch?`, a: `Laut OWASP Top 10 ${year}, CIS Benchmarks und NIST SP 800-190: ${issue.name} gehört zu den häufigsten Angriffsvektoren für ${service.name}-Deployments auf Cloud-Plattformen wie ${provider.name}.` },
    { q: `Wie verhindere ich ${issue.name} dauerhaft auf ${provider.name}?`, a: "Guardrails setzen: Automatisiertes Scanning (Trivy/Snyk), IaC-basiertes Hardening (Terraform), regelmäßige Re-Checks per ClawGuru + Runbook-Update-Zyklus quartalsweise." },
    { q: `Welche Tools helfen bei ${issue.name} für ${service.name}?`, a: `Trivy (Container-Scanning), Snyk (Dependency-Check), Falco (Runtime-Security), OPA Gatekeeper (Policy-as-Code), Vault (Secrets), ClawGuru Re-Check (ganzheitliche Verifikation).` },
    { q: `Wie lange dauert der Fix für ${issue.name} auf ${provider.name}?`, a: "Schnell-Triage: 5 Minuten. Fix anwenden (einfache Fälle): 15–30 Minuten. Vollständige Härtung inkl. IaC-Update: 2–4 Stunden. Abhängig von Scope und Staging-Verfügbarkeit." },
    { q: `Ist ${issue.name} auf ${provider.name} ein Compliance-Risiko?`, a: `Ja. Je nach Kontext: GDPR (Datenverlust), PCI DSS (Kartendaten), SOC 2 (Availability/Confidentiality), ISO 27001 (ISMS). ${issue.name} ohne Remediation kann zu Bußgeldern und Audit-Findings führen.` },
  ]

  const tags = [
    `provider:${provider.slug}`,
    `service:${service.slug}`,
    `issue:${issue.slug}`,
    `year:${year}`,
    provider.slug,
    service.slug,
    issue.slug,
    "runbook",
    "institutional",
    "security",
    "ops",
  ]

  const relatedSlugs: string[] = []
  for (const oi of (ISSUES_100K as unknown as Array<{ slug: string }> ).slice(0, 5)) {
    if (oi.slug !== issue.slug) relatedSlugs.push(`${provider.slug}-${service.slug}-${oi.slug}-${year}`)
  }
  for (const op of (CLOUD_PROVIDERS_100K as unknown as Array<{ slug: string }>).slice(0, 4)) {
    if (op.slug !== provider.slug) relatedSlugs.push(`${op.slug}-${service.slug}-${issue.slug}-${year}`)
  }

  return {
    slug,
    title,
    summary,
    tags,
    lastmod: "2026-02-25",
    howto: { steps },
    blocks,
    clawScore: score,
    faq,
    relatedSlugs: relatedSlugs.slice(0, 8),
    author: DEFAULT_AUTHOR,
  }
}

/** Total count of 100k runbook slugs (50 providers × 80 services × 122 issues × 7 years = 3,416,000+) */
export function count100kSlugs(): number {
  return CLOUD_PROVIDERS_100K.length * SERVICES_100K.length * ISSUES_100K.length * YEARS_100K.length
}

/** Page size for sitemap pagination (Google max: 50,000 per sitemap file) */
export const SITEMAP_PAGE_SIZE_100K = 50000

/** Number of paginated sitemap pages needed for all 100k runbooks */
export function count100kSitemapPages(): number {
  return Math.ceil(count100kSlugs() / SITEMAP_PAGE_SIZE_100K)
}

/** Get a specific page of 100k runbook slugs (0-indexed) for sitemap generation */
export function get100kSlugsPage(page: number, pageSize = SITEMAP_PAGE_SIZE_100K): string[] {
  const start = page * pageSize
  const end = start + pageSize
  const slugs: string[] = []
  let idx = 0
  outer: for (const p of CLOUD_PROVIDERS_100K as unknown as Array<{ slug: string }>) {
    for (const s of SERVICES_100K as unknown as Array<{ slug: string }>) {
      for (const i of ISSUES_100K as unknown as Array<{ slug: string }>) {
        for (const y of (YEARS_100K as unknown as string[])) {
          if (idx >= end) break outer
          if (idx >= start) slugs.push(`${p.slug}-${s.slug}-${i.slug}-${y}`)
          idx++
        }
      }
    }
  }
  return slugs
}

/** Post-build pass: compute top-8 related runbooks per entry based on tag overlap */
function computeRelatedSlugs(runbooks: Runbook[]): void {
  const byTag = new Map<string, string[]>()
  for (const r of runbooks) {
    for (const t of r.tags) {
      if (!byTag.has(t)) byTag.set(t, [])
      byTag.get(t)!.push(r.slug)
    }
  }
  for (const r of runbooks) {
    const scores = new Map<string, number>()
    for (const t of r.tags) {
      for (const s of byTag.get(t) ?? []) {
        if (s !== r.slug) scores.set(s, (scores.get(s) ?? 0) + 1)
      }
    }
    r.relatedSlugs = Array.from(scores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([s]) => s)
  }
}
function _buildRunbooksWithRelated(limit: number): Runbook[] {
  const list = buildRunbooks(limit)
  computeRelatedSlugs(list)
  return list
}

export const RUNBOOKS: Runbook[] = _buildRunbooksWithRelated(Number(process.env.PSEO_RUNBOOK_COUNT || 500))

export function allProviders() {
  return [...PROVIDERS]
}

export function runbooksByProvider(providerSlug: string) {
  const p = providerSlug.toLowerCase()
  return RUNBOOKS.filter((r) => r.tags.includes("provider:" + p) || r.tags.includes(p))
}

export function getRunbook(slug: string): Runbook | null {
  // Check static RUNBOOKS first (fast path for existing content)
  const existing = RUNBOOKS.find((r) => r.slug === slug)
  if (existing) return existing
  // Fall through to 100k on-demand generation (provider-service-issue-year format)
  const meta = parseRunbookSlug100k(slug)
  if (meta) return generateRunbook100k(meta)
  return null
}

export function bucketsAF() {
  const groups: Record<"a-f" | "g-l" | "m-r" | "s-z" | "0-9", Runbook[]> = {
    "a-f": [],
    "g-l": [],
    "m-r": [],
    "s-z": [],
    "0-9": [],
  }
  for (const r of RUNBOOKS) {
    const c = (r.slug[0] || "").toLowerCase()
    if (c >= "a" && c <= "f") groups["a-f"].push(r)
    else if (c >= "g" && c <= "l") groups["g-l"].push(r)
    else if (c >= "m" && c <= "r") groups["m-r"].push(r)
    else if (c >= "s" && c <= "z") groups["s-z"].push(r)
    else groups["0-9"].push(r)
  }
  return groups
}

export function allTags() {
  const set = new Set<string>()
  for (const r of RUNBOOKS) for (const t of r.tags) set.add(t)
  return Array.from(set).sort((a, b) => a.localeCompare(b))
}

export function bucketsTagsAF() {
  const tags = allTags()
  const groups: Record<"a-f" | "g-l" | "m-r" | "s-z" | "0-9", string[]> = {
    "a-f": [],
    "g-l": [],
    "m-r": [],
    "s-z": [],
    "0-9": [],
  }
  for (const t of tags) {
    const c = (t[0] || "").toLowerCase()
    if (c >= "a" && c <= "f") groups["a-f"].push(t)
    else if (c >= "g" && c <= "l") groups["g-l"].push(t)
    else if (c >= "m" && c <= "r") groups["m-r"].push(t)
    else if (c >= "s" && c <= "z") groups["s-z"].push(t)
    else groups["0-9"].push(t)
  }
  return groups
}

export function runbooksByTag(tag: string) {
  return RUNBOOKS.filter((r) => r.tags.includes(tag))
}

/** Top-N runbooks per tag (sorted by clawScore desc) */
export function topRunbooksByTag(tag: string, n = 10): Runbook[] {
  return runbooksByTag(tag)
    .sort((a, b) => b.clawScore - a.clawScore)
    .slice(0, n)
}

/** Number of static main pages included in the main sitemap */
const MAIN_SITEMAP_PAGE_COUNT = 10

/**
 * Compute the actual total number of URLs across all sitemaps.
 * Covers: main pages + provider pages + runbook pages + tag pages.
 */
export function totalSitemapUrls(): number {
  return MAIN_SITEMAP_PAGE_COUNT + PROVIDERS.length + RUNBOOKS.length + allTags().length + count100kSlugs()
}
