import type { Locale } from "@/lib/i18n"

type DockerProxyCopy = {
  title: string
  description: string
  h1: string
  intro: string
  checklistTitle: string
  checklist: [string, string, string, string, string, string, string, string]
  configTitle: string
  configItems: [string, string, string]
  verifyTitle: string
  verify: [string, string, string]
  disclaimer: string
  ctaCheck: string
  ctaMoltbot: string
  ctaOpenclaw: string
  ctaMethodik: string
}

const EN: DockerProxyCopy = {
  title: "Docker + reverse proxy hardening cheatsheet (2026) | ClawGuru",
  description:
    "Practical hardening checklist for Docker workloads behind reverse proxies, including TLS, header policy, network segmentation, and verification.",
  h1: "Docker + reverse proxy hardening cheatsheet (2026)",
  intro:
    "Most exposed self-hosted stacks fail at proxy boundaries and container defaults. Use this cheatsheet as a fast baseline before advanced tuning.",
  checklistTitle: "Hardening checklist",
  checklist: [
    "Expose only proxy entrypoints publicly; keep app containers on private networks.",
    "Enforce TLS everywhere with strict redirect and modern cipher policy.",
    "Set security headers (HSTS, CSP baseline, X-Content-Type-Options, Referrer-Policy).",
    "Restrict upstream routes and remove debug/admin paths from public exposure.",
    "Use least-privilege container runtime settings (read-only FS where possible, dropped capabilities).",
    "Pin image versions and apply regular vulnerability scans before deployment.",
    "Protect secrets via runtime secret stores, never hardcoded env files in public repos.",
    "Monitor 4xx/5xx/auth anomalies and rate-limit abusive request patterns.",
  ],
  configTitle: "Config sanity checks",
  configItems: [
    "Proxy config is source-controlled and peer-reviewed before release.",
    "Compose/network policy blocks lateral traffic between unrelated services.",
    "Access logs include request ID, source, and upstream target for incident tracing.",
  ],
  verifyTitle: "Verification criteria",
  verify: [
    "External scan shows only expected TLS-enabled entrypoints.",
    "Sensitive internal routes are inaccessible from public interfaces.",
    "Alerting catches simulated abuse traffic within defined SLA.",
  ],
  disclaimer: "Cheatsheet guidance is operational best practice and not a formal penetration test.",
  ctaCheck: "Start security check",
  ctaMoltbot: "Open Moltbot hardening page",
  ctaOpenclaw: "Open OpenClaw page",
  ctaMethodik: "Open methodology",
}

const DE: DockerProxyCopy = {
  title: "Docker + Reverse-Proxy Hardening Cheatsheet (2026) | ClawGuru",
  description:
    "Praktische Hardening-Checkliste für Docker-Workloads hinter Reverse-Proxys inklusive TLS, Header-Policy, Netzwerksegmentierung und Verifikation.",
  h1: "Docker + Reverse-Proxy Hardening Cheatsheet (2026)",
  intro:
    "Viele exponierte Self-Hosted-Stacks scheitern an Proxy-Grenzen und Container-Defaults. Diese Cheatsheet liefert eine schnelle Baseline vor Feintuning.",
  checklistTitle: "Hardening-Checkliste",
  checklist: [
    "Nur Proxy-Entrypoints öffentlich exponieren; App-Container in privaten Netzwerken halten.",
    "TLS überall erzwingen, inklusive strikter Redirect- und moderner Cipher-Policy.",
    "Security-Header setzen (HSTS, CSP-Baseline, X-Content-Type-Options, Referrer-Policy).",
    "Upstream-Routen einschränken und Debug/Admin-Pfade aus Public-Exposition entfernen.",
    "Container-Runtime auf Least Privilege härten (read-only FS wo möglich, Capabilities reduzieren).",
    "Image-Versionen pinnen und vor Deployments regelmäßig auf Vulnerabilities scannen.",
    "Secrets über Runtime-Secret-Stores schützen, keine hardcodierten Env-Dateien in öffentlichen Repos.",
    "4xx/5xx/Auth-Anomalien überwachen und missbräuchliche Request-Muster rate-limiten.",
  ],
  configTitle: "Config-Sanity-Checks",
  configItems: [
    "Proxy-Konfiguration liegt versioniert vor und wird vor Release peer-reviewt.",
    "Compose/Netzwerk-Policy blockiert lateralen Traffic zwischen unabhängigen Services.",
    "Access-Logs enthalten Request-ID, Source und Upstream-Target für Incident-Traceability.",
  ],
  verifyTitle: "Verifikationskriterien",
  verify: [
    "Externer Scan zeigt nur erwartete TLS-Entrypoints.",
    "Sensible interne Routen sind von öffentlichen Interfaces aus nicht erreichbar.",
    "Alerting erkennt simulierten Abuse-Traffic innerhalb der definierten SLA.",
  ],
  disclaimer: "Die Cheatsheet ist operative Best Practice und kein formaler Penetrationstest.",
  ctaCheck: "Security Check starten",
  ctaMoltbot: "Moltbot-Hardening-Seite öffnen",
  ctaOpenclaw: "OpenClaw-Seite öffnen",
  ctaMethodik: "Methodik öffnen",
}

const PARTIAL: Partial<Record<Locale, Partial<DockerProxyCopy>>> = {
  es: { h1: "Cheatsheet de hardening Docker + reverse proxy (2026)", ctaCheck: "Iniciar security check" },
  fr: { h1: "Cheatsheet hardening Docker + reverse proxy (2026)", ctaCheck: "Démarrer security check" },
  pt: { h1: "Cheatsheet de hardening Docker + reverse proxy (2026)", ctaCheck: "Iniciar security check" },
  it: { h1: "Cheatsheet hardening Docker + reverse proxy (2026)", ctaCheck: "Avvia security check" },
  ru: { h1: "Cheatsheet hardening Docker + reverse proxy (2026)", ctaCheck: "Запустить security check" },
  zh: { h1: "Docker + 反向代理加固速查表（2026）", ctaCheck: "开始安全检查" },
  ja: { h1: "Docker + reverse proxy hardening チートシート（2026）", ctaCheck: "security check を開始" },
  ar: { h1: "دليل hardening لـ Docker + reverse proxy (2026)", ctaCheck: "بدء security check" },
  nl: { h1: "Docker + reverse proxy hardening-cheatsheet (2026)", ctaCheck: "Start security check" },
  hi: { h1: "Docker + reverse proxy hardening cheatsheet (2026)", ctaCheck: "security check शुरू करें" },
  tr: { h1: "Docker + reverse proxy hardening cheatsheet (2026)", ctaCheck: "security check başlat" },
  pl: { h1: "Cheatsheet hardeningu Docker + reverse proxy (2026)", ctaCheck: "Uruchom security check" },
  ko: { h1: "Docker + reverse proxy hardening 치트시트 (2026)", ctaCheck: "security check 시작" },
}

export function getDockerProxyCopy(locale: Locale): DockerProxyCopy {
  const base = locale === "de" ? DE : EN
  return { ...base, ...(PARTIAL[locale] ?? {}) }
}
