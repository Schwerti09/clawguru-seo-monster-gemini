import type { Locale } from "@/lib/i18n"

type ApiKeyLeakCopy = {
  title: string
  description: string
  h1: string
  intro: string
  phasesTitle: string
  phases: [string, string, string, string, string]
  checklistTitle: string
  checklist: [string, string, string, string, string]
  aftercareTitle: string
  aftercare: [string, string, string]
  disclaimer: string
  ctaCheck: string
  ctaAiSecurity: string
  ctaOpenclawCheck: string
  ctaMethodik: string
}

const EN: ApiKeyLeakCopy = {
  title: "API key leak response playbook (no panic, fast containment) | ClawGuru",
  description:
    "A practical incident response path for API key leaks: contain, rotate, verify, and harden against repeat exposure.",
  h1: "API key leak response playbook",
  intro:
    "Key leaks are common in real operations. The goal is fast containment and verifiable recovery, not panic and guesswork.",
  phasesTitle: "Incident phases",
  phases: [
    "Detect and scope: identify leaked key, affected systems, and earliest known exposure window.",
    "Contain immediately: disable or restrict key usage, block abusive traffic patterns, and isolate critical paths.",
    "Rotate and re-issue: generate replacement credentials with least-privilege scope and short lifetime.",
    "Verify blast radius: review logs for misuse, failed auth spikes, and suspicious access from unknown origins.",
    "Stabilize and document: close root cause and capture timeline, decisions, and mitigation evidence.",
  ],
  checklistTitle: "Operator checklist",
  checklist: [
    "Revoke leaked key and invalidate related sessions/tokens.",
    "Rotate all sibling keys in the same trust domain if correlation is unclear.",
    "Purge leaked credentials from logs, configs, and CI artifacts.",
    "Enforce secret scanning and pre-commit checks for future prevention.",
    "Run a re-check and confirm no active unauthorized usage remains.",
  ],
  aftercareTitle: "Aftercare in the next 24 hours",
  aftercare: [
    "Add alert rules for key misuse signatures and unusual auth geography.",
    "Review token scope design and shorten validity where possible.",
    "Update runbooks with lessons learned and schedule a tabletop replay.",
  ],
  disclaimer: "This playbook is operational guidance, not legal or forensic advice.",
  ctaCheck: "Start security check",
  ctaAiSecurity: "Open AI-agent security page",
  ctaOpenclawCheck: "Open OpenClaw security check page",
  ctaMethodik: "Open methodology",
}

const DE: ApiKeyLeakCopy = {
  title: "API-Key-Leak Response Playbook (ohne Panik, mit schneller Eindämmung) | ClawGuru",
  description:
    "Praktischer Incident-Response-Pfad für API-Key-Leaks: eindämmen, rotieren, verifizieren und Wiederholungen verhindern.",
  h1: "API-Key-Leak Response Playbook",
  intro:
    "Key-Leaks passieren im Ops-Alltag. Entscheidend ist schnelle Eindämmung und verifizierbare Wiederherstellung statt Panik.",
  phasesTitle: "Incident-Phasen",
  phases: [
    "Erkennen und Scope festlegen: geleakten Key, betroffene Systeme und erstes Expositionsfenster bestimmen.",
    "Sofort eindämmen: Key deaktivieren oder einschränken, missbräuchliche Muster blockieren, kritische Pfade isolieren.",
    "Rotieren und neu ausstellen: Ersatz-Credentials mit Least-Privilege-Scope und kurzer Laufzeit erzeugen.",
    "Blast Radius verifizieren: Logs auf Missbrauch, Auth-Fail-Spikes und verdächtige Zugriffe aus unbekannten Origins prüfen.",
    "Stabilisieren und dokumentieren: Root Cause schließen sowie Timeline, Entscheidungen und Evidenz festhalten.",
  ],
  checklistTitle: "Operator-Checkliste",
  checklist: [
    "Geleakten Key widerrufen und zugehörige Sessions/Tokens invalidieren.",
    "Alle verwandten Keys im selben Trust-Domain rotieren, falls Korrelation unklar ist.",
    "Geleakte Credentials aus Logs, Configs und CI-Artefakten entfernen.",
    "Secret-Scanning und Pre-Commit-Checks für die Prävention aktivieren.",
    "Re-Check durchführen und bestätigen, dass keine unautorisierte Nutzung mehr aktiv ist.",
  ],
  aftercareTitle: "Aftercare in den nächsten 24 Stunden",
  aftercare: [
    "Alert-Regeln für Key-Missbrauchsmuster und ungewöhnliche Auth-Geografie ergänzen.",
    "Token-Scope-Design prüfen und Laufzeiten wo möglich verkürzen.",
    "Runbooks mit Lessons Learned aktualisieren und Tabletop-Replay planen.",
  ],
  disclaimer: "Dieses Playbook ist operative Unterstützung, keine Rechts- oder Forensikberatung.",
  ctaCheck: "Security Check starten",
  ctaAiSecurity: "AI-Agent-Security-Seite öffnen",
  ctaOpenclawCheck: "OpenClaw-Security-Check-Seite öffnen",
  ctaMethodik: "Methodik öffnen",
}

const PARTIAL: Partial<Record<Locale, Partial<ApiKeyLeakCopy>>> = {
  es: { h1: "Playbook de respuesta a filtración de API keys", ctaCheck: "Iniciar security check" },
  fr: { h1: "Playbook de réponse aux fuites de clés API", ctaCheck: "Démarrer security check" },
  pt: { h1: "Playbook de resposta a vazamento de API keys", ctaCheck: "Iniciar security check" },
  it: { h1: "Playbook di risposta a leak di API key", ctaCheck: "Avvia security check" },
  ru: { h1: "Playbook реагирования на утечку API keys", ctaCheck: "Запустить security check" },
  zh: { h1: "API Key 泄露响应手册", ctaCheck: "开始安全检查" },
  ja: { h1: "API key 漏えい対応プレイブック", ctaCheck: "security check を開始" },
  ar: { h1: "دليل الاستجابة لتسرب API keys", ctaCheck: "بدء security check" },
  nl: { h1: "Response-playbook voor API key-lekken", ctaCheck: "Start security check" },
  hi: { h1: "API key leak response playbook", ctaCheck: "security check शुरू करें" },
  tr: { h1: "API key sızıntısı response playbook", ctaCheck: "security check başlat" },
  pl: { h1: "Playbook reakcji na wyciek API keys", ctaCheck: "Uruchom security check" },
  ko: { h1: "API key 유출 대응 playbook", ctaCheck: "security check 시작" },
}

export function getApiKeyLeakCopy(locale: Locale): ApiKeyLeakCopy {
  const base = locale === "de" ? DE : EN
  return { ...base, ...(PARTIAL[locale] ?? {}) }
}
