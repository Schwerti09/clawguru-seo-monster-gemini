import type { Locale } from "@/lib/i18n"

type BaselineCopy = {
  title: string
  description: string
  h1: string
  intro: string
  compareTitle: string
  compareRows: [string, string, string, string, string]
  baselineTitle: string
  baselineSteps: [string, string, string, string, string, string]
 verifyTitle: string
  verify: [string, string, string]
  disclaimer: string
  ctaCheck: string
  ctaMoltbot: string
  ctaOpenclawCheck: string
  ctaMethodik: string
}

const EN: BaselineCopy = {
  title: "Hetzner vs DigitalOcean security baseline (2026) | ClawGuru",
  description:
    "Practical 2026 security baseline for Hetzner and DigitalOcean deployments with clear hardening and verification steps.",
  h1: "Hetzner vs DigitalOcean security baseline (2026)",
  intro:
    "Both providers can run secure workloads, but the baseline only holds if network exposure, identity, and observability are configured deliberately.",
  compareTitle: "Fast comparison: where teams usually miss",
  compareRows: [
    "Ingress defaults: audit exposed ports and remove any non-essential public services.",
    "Auth surfaces: enforce key-only SSH, scoped API usage, and strict operator access separation.",
    "Firewall quality: codify allowlist rules and avoid one-click broad exceptions.",
    "Logging posture: centralize auth and network events before incidents happen.",
    "Recovery discipline: test restore paths and not just backup creation.",
  ],
  baselineTitle: "Security baseline checklist",
  baselineSteps: [
    "Close non-essential public ports and isolate admin access paths.",
    "Enforce MFA for provider control plane and rotate API credentials.",
    "Use host-level firewall policies plus provider-level network controls.",
    "Deploy auth-failure and network anomaly monitoring with clear alerts.",
    "Harden SSH and service configs against weak defaults and stale users.",
    "Run recurring re-checks after infrastructure or firewall changes.",
  ],
  verifyTitle: "Verification criteria",
  verify: [
    "No unexpected public service exposure on external scans.",
    "All privileged access events are logged and attributable.",
    "Incident drill confirms recovery and access revocation work as expected.",
  ],
  disclaimer: "This baseline is operational guidance, not a formal certification statement.",
  ctaCheck: "Start security check",
  ctaMoltbot: "Open Moltbot hardening page",
  ctaOpenclawCheck: "Open OpenClaw security check page",
  ctaMethodik: "Open methodology",
}

const DE: BaselineCopy = {
  title: "Hetzner vs DigitalOcean Security-Baseline (2026) | ClawGuru",
  description:
    "Praktische 2026-Sicherheitsbaseline für Hetzner- und DigitalOcean-Deployments mit klaren Hardening- und Verifikationsschritten.",
  h1: "Hetzner vs DigitalOcean Security-Baseline (2026)",
  intro:
    "Beide Provider können sicher betrieben werden, wenn Exposition, Identität und Observability bewusst konfiguriert sind.",
  compareTitle: "Schnellvergleich: wo Teams häufig scheitern",
  compareRows: [
    "Ingress-Defaults: exponierte Ports prüfen und nicht notwendige Public-Services entfernen.",
    "Auth-Surfaces: SSH nur mit Keys, API-Nutzung scopen und Operator-Zugriff strikt trennen.",
    "Firewall-Qualität: Allowlist-Regeln codifizieren, keine breiten Ausnahme-Klicks.",
    "Logging-Posture: Auth- und Netzwerk-Events zentralisieren, bevor ein Incident eintritt.",
    "Recovery-Disziplin: Restore-Pfade testen, nicht nur Backup-Erstellung abhaken.",
  ],
  baselineTitle: "Security-Baseline-Checkliste",
  baselineSteps: [
    "Nicht notwendige Public-Ports schließen und Admin-Zugriffspfade isolieren.",
    "MFA im Provider-Control-Plane erzwingen und API-Credentials rotieren.",
    "Host-Firewall mit Provider-Netzwerkkontrollen kombinieren.",
    "Auth-Fail- und Netzwerk-Anomalie-Monitoring mit klaren Alerts aktivieren.",
    "SSH- und Service-Konfigurationen gegen schwache Defaults und alte User härten.",
    "Re-Checks nach Infrastruktur- oder Firewall-Änderungen verbindlich fahren.",
  ],
  verifyTitle: "Verifikationskriterien",
  verify: [
    "Keine unerwartete Public-Exposition bei externen Scans.",
    "Alle privilegierten Zugriffe sind geloggt und zuordenbar.",
    "Incident-Drill bestätigt, dass Recovery und Access-Revocation funktionieren.",
  ],
  disclaimer: "Diese Baseline ist operative Orientierung, keine formale Zertifizierungsaussage.",
  ctaCheck: "Security Check starten",
  ctaMoltbot: "Moltbot-Hardening-Seite öffnen",
  ctaOpenclawCheck: "OpenClaw-Security-Check-Seite öffnen",
  ctaMethodik: "Methodik öffnen",
}

const PARTIAL: Partial<Record<Locale, Partial<BaselineCopy>>> = {
  es: { h1: "Baseline de seguridad Hetzner vs DigitalOcean (2026)", ctaCheck: "Iniciar security check" },
  fr: { h1: "Baseline sécurité Hetzner vs DigitalOcean (2026)", ctaCheck: "Démarrer security check" },
  pt: { h1: "Baseline de segurança Hetzner vs DigitalOcean (2026)", ctaCheck: "Iniciar security check" },
  it: { h1: "Baseline sicurezza Hetzner vs DigitalOcean (2026)", ctaCheck: "Avvia security check" },
  ru: { h1: "Базовая security baseline Hetzner vs DigitalOcean (2026)", ctaCheck: "Запустить security check" },
  zh: { h1: "Hetzner vs DigitalOcean 安全基线（2026）", ctaCheck: "开始安全检查" },
  ja: { h1: "Hetzner vs DigitalOcean セキュリティ baseline（2026）", ctaCheck: "security check を開始" },
  ar: { h1: "خط أساس الأمان Hetzner مقابل DigitalOcean (2026)", ctaCheck: "بدء security check" },
  nl: { h1: "Security-baseline Hetzner vs DigitalOcean (2026)", ctaCheck: "Start security check" },
  hi: { h1: "Hetzner vs DigitalOcean security baseline (2026)", ctaCheck: "security check शुरू करें" },
  tr: { h1: "Hetzner vs DigitalOcean security baseline (2026)", ctaCheck: "security check başlat" },
  pl: { h1: "Baseline bezpieczeństwa Hetzner vs DigitalOcean (2026)", ctaCheck: "Uruchom security check" },
  ko: { h1: "Hetzner vs DigitalOcean 보안 baseline (2026)", ctaCheck: "security check 시작" },
}

export function getHetznerVsDoCopy(locale: Locale): BaselineCopy {
  const base = locale === "de" ? DE : EN
  return { ...base, ...(PARTIAL[locale] ?? {}) }
}
