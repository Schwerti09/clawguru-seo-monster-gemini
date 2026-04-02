import type { Locale } from "@/lib/i18n"

type NIS2Copy = {
  title: string
  description: string
  h1: string
  intro: string
  controlsTitle: string
  controls: [string, string, string, string, string, string]
  evidenceTitle: string
  evidence: [string, string, string]
  nextTitle: string
  nextSteps: [string, string, string]
  disclaimer: string
  ctaCheck: string
  ctaAiSecurity: string
  ctaOpenclaw: string
  ctaMethodik: string
}

const EN: NIS2Copy = {
  title: "NIS2 technical controls for self-hosted teams (2026) | ClawGuru",
  description:
    "A practical NIS2 technical control baseline for self-hosted operators, including evidence-ready implementation steps.",
  h1: "NIS2 technical controls for self-hosted teams",
  intro:
    "NIS2 readiness is not a document-only task. Operators need measurable controls, repeatable checks, and evidence they can present under pressure.",
  controlsTitle: "Technical control baseline",
  controls: [
    "Asset and exposure inventory: maintain an up-to-date map of internet-facing systems and admin surfaces.",
    "Identity and access controls: scoped authentication, rotation policies, and privileged access restrictions.",
    "Logging and detection: centralized security events, anomaly alerts, and tamper-resistant retention.",
    "Vulnerability and patch discipline: risk-based prioritization with explicit remediation windows.",
    "Backup and recovery verification: tested restore paths, not just backup existence.",
    "Incident execution readiness: runbook-backed response with defined roles, escalation, and re-check criteria.",
  ],
  evidenceTitle: "Evidence pack essentials",
  evidence: [
    "Control ownership and review cadence per control domain.",
    "Before/after records for high-risk mitigations and key rotations.",
    "Incident timeline artifacts and post-incident hardening verification.",
  ],
  nextTitle: "Next 30-minute action plan",
  nextSteps: [
    "Run a check and identify one high-risk control gap.",
    "Execute a focused runbook mitigation and capture proof of change.",
    "Schedule a recurring re-check and evidence review window.",
  ],
  disclaimer: "This page supports technical preparedness and does not replace legal interpretation of NIS2 obligations.",
  ctaCheck: "Start security check",
  ctaAiSecurity: "Open AI-agent security page",
  ctaOpenclaw: "Open OpenClaw page",
  ctaMethodik: "Open methodology",
}

const DE: NIS2Copy = {
  title: "NIS2 technische Kontrollen für Self-Hosted Teams (2026) | ClawGuru",
  description:
    "Praktische NIS2-Control-Baseline für Self-Hosted Operator mit umsetzbaren Schritten und belastbarer Evidenz.",
  h1: "NIS2 technische Kontrollen für Self-Hosted Teams",
  intro:
    "NIS2-Readiness ist kein reines Dokumententhema. Teams brauchen messbare Kontrollen, wiederholbare Checks und belastbare Nachweise.",
  controlsTitle: "Technische Control-Baseline",
  controls: [
    "Asset- und Expositionsinventar: aktuelle Übersicht aller internet-exponierten Systeme und Admin-Surfaces.",
    "Identity- und Access-Kontrollen: scoped Authentifizierung, Rotationsregeln und Einschränkung privilegierter Zugriffe.",
    "Logging und Detection: zentrale Security-Events, Anomalie-Alerts und manipulationssichere Aufbewahrung.",
    "Vulnerability- und Patch-Disziplin: risikobasierte Priorisierung mit klaren Remediation-Fenstern.",
    "Backup- und Recovery-Verifikation: getestete Restore-Pfade statt nur vorhandener Backups.",
    "Incident-Execution-Readiness: runbook-gestützte Reaktion mit Rollen, Eskalation und Re-Check-Kriterien.",
  ],
  evidenceTitle: "Evidenzpaket: Kernbausteine",
  evidence: [
    "Control-Ownership und Review-Cadence pro Kontrollbereich.",
    "Before/After-Nachweise für High-Risk-Mitigations und Key-Rotationen.",
    "Incident-Timeline-Artefakte plus Verifikation der Nachhärtung.",
  ],
  nextTitle: "30-Minuten-Aktionsplan",
  nextSteps: [
    "Check starten und eine High-Risk-Control-Lücke identifizieren.",
    "Gezielte Runbook-Maßnahme ausführen und Change-Evidenz sichern.",
    "Wiederkehrenden Re-Check- und Evidenz-Review-Termin setzen.",
  ],
  disclaimer: "Diese Seite unterstützt technische NIS2-Vorbereitung und ersetzt keine rechtliche Auslegung der Pflichten.",
  ctaCheck: "Security Check starten",
  ctaAiSecurity: "AI-Agent-Security-Seite öffnen",
  ctaOpenclaw: "OpenClaw-Seite öffnen",
  ctaMethodik: "Methodik öffnen",
}

const PARTIAL: Partial<Record<Locale, Partial<NIS2Copy>>> = {
  es: { h1: "Controles técnicos NIS2 para equipos self-hosted", ctaCheck: "Iniciar security check" },
  fr: { h1: "Contrôles techniques NIS2 pour équipes self-hosted", ctaCheck: "Démarrer security check" },
  pt: { h1: "Controles técnicos NIS2 para equipes self-hosted", ctaCheck: "Iniciar security check" },
  it: { h1: "Controlli tecnici NIS2 per team self-hosted", ctaCheck: "Avvia security check" },
  ru: { h1: "Технические контроли NIS2 для self-hosted команд", ctaCheck: "Запустить security check" },
  zh: { h1: "Self-hosted 团队的 NIS2 技术控制", ctaCheck: "开始安全检查" },
  ja: { h1: "Self-hosted チーム向け NIS2 技術コントロール", ctaCheck: "security check を開始" },
  ar: { h1: "ضوابط NIS2 التقنية لفرق self-hosted", ctaCheck: "بدء security check" },
  nl: { h1: "NIS2 technische controles voor self-hosted teams", ctaCheck: "Start security check" },
  hi: { h1: "Self-hosted टीमों के लिए NIS2 तकनीकी नियंत्रण", ctaCheck: "security check शुरू करें" },
  tr: { h1: "Self-hosted ekipler için NIS2 teknik kontroller", ctaCheck: "security check başlat" },
  pl: { h1: "Techniczne kontrole NIS2 dla zespołów self-hosted", ctaCheck: "Uruchom security check" },
  ko: { h1: "Self-hosted 팀을 위한 NIS2 기술 통제", ctaCheck: "security check 시작" },
}

export function getNIS2Copy(locale: Locale): NIS2Copy {
  const base = locale === "de" ? DE : EN
  return { ...base, ...(PARTIAL[locale] ?? {}) }
}
