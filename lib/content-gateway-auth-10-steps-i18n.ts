import type { Locale } from "@/lib/i18n"

type GatewayAuthCopy = {
  title: string
  description: string
  h1: string
  intro: string
  stepsTitle: string
  steps: [string, string, string, string, string, string, string, string, string, string]
  verifyTitle: string
  verify: [string, string, string]
  disclaimer: string
  ctaCheck: string
  ctaMoltbot: string
  ctaOpenclaw: string
  ctaMethodik: string
}

const EN: GatewayAuthCopy = {
  title: "Gateway authentication in 10 steps (operator runbook) | ClawGuru",
  description:
    "A practical 10-step gateway authentication hardening path for OpenClaw/Moltbot operators, with verification checkpoints.",
  h1: "Gateway authentication in 10 steps (operator runbook)",
  intro:
    "This is the practical path from weak gateway auth to repeatable access control. Execute in order and re-check after each block.",
  stepsTitle: "The 10-step hardening sequence",
  steps: [
    "Inventory every gateway endpoint and mark public, internal, and admin surfaces.",
    "Enforce authentication on all non-public endpoints; remove implicit trust paths.",
    "Use short-lived tokens with clear scope boundaries per service action.",
    "Bind sessions to origin and client context to reduce replay risk.",
    "Rotate existing secrets and revoke unknown or stale credentials.",
    "Add request-level authorization checks, not only edge authentication.",
    "Apply strict rate limits for auth endpoints and privileged actions.",
    "Log auth failures with structured fields for rapid incident triage.",
    "Alert on abnormal auth patterns (burst failures, geo anomalies, token misuse).",
    "Run re-check and document residual risk plus next mitigation cycle.",
  ],
  verifyTitle: "How to verify implementation",
  verify: [
    "No privileged endpoint is reachable without valid auth and correct scope.",
    "Old credentials fail after rotation and revocation is observable in logs.",
    "Monitoring catches simulated auth abuse within your alerting SLA.",
  ],
  disclaimer: "This runbook-style guidance is operational support, not a formal penetration test.",
  ctaCheck: "Start security check",
  ctaMoltbot: "Open Moltbot hardening page",
  ctaOpenclaw: "Open OpenClaw page",
  ctaMethodik: "Open methodology",
}

const DE: GatewayAuthCopy = {
  title: "Gateway-Authentifizierung in 10 Schritten (Operator-Runbook) | ClawGuru",
  description:
    "Praktischer 10-Schritte-Hardeningpfad für Gateway-Auth in OpenClaw/Moltbot-Setups mit klaren Verifikationspunkten.",
  h1: "Gateway-Authentifizierung in 10 Schritten (Operator-Runbook)",
  intro:
    "Das ist der praktische Weg von schwacher Gateway-Auth zu reproduzierbarer Zugriffskontrolle. In Reihenfolge umsetzen und nach jedem Block re-checken.",
  stepsTitle: "Die 10-Schritte-Hardening-Sequenz",
  steps: [
    "Alle Gateway-Endpunkte inventarisieren und nach Public, Internal und Admin-Surface markieren.",
    "Authentifizierung auf allen nicht-öffentlichen Endpunkten erzwingen; implizite Trust-Pfade entfernen.",
    "Kurzlebige Tokens mit klaren Scope-Grenzen pro Service-Aktion verwenden.",
    "Sessions an Origin und Client-Kontext binden, um Replay-Risiken zu senken.",
    "Bestehende Secrets rotieren und unbekannte oder alte Credentials widerrufen.",
    "Autorisierung auf Request-Ebene ergänzen, nicht nur Edge-Authentifizierung.",
    "Strikte Rate-Limits für Auth-Endpunkte und privilegierte Aktionen setzen.",
    "Auth-Fehlschläge strukturiert loggen, damit Incident-Triage schnell bleibt.",
    "Bei auffälligen Auth-Patterns alarmieren (Burst-Fails, Geo-Anomalien, Token-Missbrauch).",
    "Re-Check durchführen und Restrisiko plus nächsten Mitigation-Zyklus dokumentieren.",
  ],
  verifyTitle: "So verifizierst du die Umsetzung",
  verify: [
    "Kein privilegierter Endpunkt ist ohne valide Auth und korrekten Scope erreichbar.",
    "Alte Credentials schlagen nach Rotation fehl und Widerrufe sind in Logs sichtbar.",
    "Monitoring erkennt simulierten Auth-Missbrauch innerhalb deiner Alerting-SLA.",
  ],
  disclaimer: "Diese runbook-orientierte Anleitung ist Ops-Unterstützung, kein formaler Penetrationstest.",
  ctaCheck: "Security Check starten",
  ctaMoltbot: "Moltbot-Hardening-Seite öffnen",
  ctaOpenclaw: "OpenClaw-Seite öffnen",
  ctaMethodik: "Methodik öffnen",
}

const PARTIAL: Partial<Record<Locale, Partial<GatewayAuthCopy>>> = {
  es: { h1: "Autenticación de gateway en 10 pasos (runbook de operador)", ctaCheck: "Iniciar security check" },
  fr: { h1: "Authentification gateway en 10 étapes (runbook opérateur)", ctaCheck: "Démarrer security check" },
  pt: { h1: "Autenticação de gateway em 10 passos (runbook de operador)", ctaCheck: "Iniciar security check" },
  it: { h1: "Autenticazione gateway in 10 passi (runbook operatore)", ctaCheck: "Avvia security check" },
  ru: { h1: "Gateway auth за 10 шагов (операторский runbook)", ctaCheck: "Запустить security check" },
  zh: { h1: "10 步完成 Gateway 鉴权加固（操作手顺）", ctaCheck: "开始安全检查" },
  ja: { h1: "Gateway auth を10ステップで強化（運用 runbook）", ctaCheck: "security check を開始" },
  ar: { h1: "تقوية مصادقة gateway في 10 خطوات (runbook تشغيلي)", ctaCheck: "بدء security check" },
  nl: { h1: "Gateway-authenticatie in 10 stappen (operator-runbook)", ctaCheck: "Start security check" },
  hi: { h1: "10 चरणों में gateway authentication (operator runbook)", ctaCheck: "security check शुरू करें" },
  tr: { h1: "10 adımda gateway authentication (operatör runbook)", ctaCheck: "security check başlat" },
  pl: { h1: "Uwierzytelnianie gateway w 10 krokach (runbook operatora)", ctaCheck: "Uruchom security check" },
  ko: { h1: "10단계 gateway authentication 강화 (운영 runbook)", ctaCheck: "security check 시작" },
}

export function getGatewayAuthCopy(locale: Locale): GatewayAuthCopy {
  const base = locale === "de" ? DE : EN
  return { ...base, ...(PARTIAL[locale] ?? {}) }
}
