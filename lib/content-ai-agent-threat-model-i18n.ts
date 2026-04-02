import type { Locale } from "@/lib/i18n"

type ThreatModelCopy = {
  title: string
  description: string
  h1: string
  intro: string
  modelTitle: string
  modelBlocks: [string, string, string, string, string]
  promptTitle: string
  prompts: [string, string, string, string]
  validationTitle: string
  validation: [string, string, string]
  disclaimer: string
  ctaCheck: string
  ctaAiSecurity: string
  ctaOpenclawCheck: string
  ctaMethodik: string
}

const EN: ThreatModelCopy = {
  title: "AI-agent threat model template for operators (2026) | ClawGuru",
  description:
    "Reusable threat model template for self-hosted AI-agent deployments with attack paths, controls, and validation checkpoints.",
  h1: "AI-agent threat model template for operators",
  intro:
    "Threat modeling for AI-agent systems must cover tool access, secrets, gateway trust, and execution boundaries. Use this template as a practical baseline.",
  modelTitle: "Threat model blocks",
  modelBlocks: [
    "System boundary map: agent runtime, tools, gateways, data stores, and control plane.",
    "Trust boundaries: where identity context changes or untrusted input crosses layers.",
    "Abuse paths: prompt injection, tool misuse, credential exposure, and lateral movement.",
    "Control mapping: auth scope, network segmentation, secret handling, and audit trails.",
    "Response design: detection triggers, escalation owner, and containment runbooks.",
  ],
  promptTitle: "Operator prompts to complete the model",
  prompts: [
    "Which component can execute actions with the broadest privilege today?",
    "Where can untrusted content influence tool execution or data access?",
    "Which secrets, if leaked, would cause immediate high-impact exposure?",
    "What can we verify automatically after each hardening change?",
  ],
  validationTitle: "Validation checkpoints",
  validation: [
    "Each critical abuse path has at least one preventive and one detective control.",
    "Containment steps are executable without ad-hoc architectural guesswork.",
    "Re-check criteria are defined and measurable after mitigation.",
  ],
  disclaimer: "This template supports practical security design and does not replace formal certification assessments.",
  ctaCheck: "Start security check",
  ctaAiSecurity: "Open AI-agent security page",
  ctaOpenclawCheck: "Open OpenClaw security check page",
  ctaMethodik: "Open methodology",
}

const DE: ThreatModelCopy = {
  title: "AI-Agent Threat-Model Template für Operator (2026) | ClawGuru",
  description:
    "Wiederverwendbare Threat-Model-Vorlage für Self-Hosted AI-Agent-Deployments mit Angriffspfaden, Kontrollen und Verifikationspunkten.",
  h1: "AI-Agent Threat-Model Template für Operator",
  intro:
    "Threat Modeling für AI-Agent-Systeme muss Tool-Zugriffe, Secrets, Gateway-Trust und Execution-Boundaries abdecken. Diese Vorlage ist eine praktische Baseline.",
  modelTitle: "Threat-Model-Bausteine",
  modelBlocks: [
    "Systemgrenzen-Map: Agent-Runtime, Tools, Gateways, Datastores und Control Plane.",
    "Trust-Boundaries: Punkte, an denen Identity-Kontext wechselt oder untrusted Input Schichten kreuzt.",
    "Abuse-Pfade: Prompt Injection, Tool-Missbrauch, Credential-Exposition und laterale Bewegung.",
    "Control-Mapping: Auth-Scopes, Netzwerksegmentierung, Secret-Handling und Audit-Trails.",
    "Response-Design: Detection-Trigger, Eskalations-Owner und Containment-Runbooks.",
  ],
  promptTitle: "Operator-Fragen zur Modellbefüllung",
  prompts: [
    "Welche Komponente kann aktuell Aktionen mit den breitesten Privilegien ausführen?",
    "Wo kann untrusted Content Tool-Ausführung oder Datenzugriff beeinflussen?",
    "Welche Secrets würden bei Leak sofort zu High-Impact-Exposition führen?",
    "Was können wir nach jeder Hardening-Änderung automatisiert verifizieren?",
  ],
  validationTitle: "Validierungspunkte",
  validation: [
    "Jeder kritische Abuse-Pfad hat mindestens eine präventive und eine detektive Kontrolle.",
    "Containment-Schritte sind ausführbar ohne ad-hoc Architektur-Raten.",
    "Re-Check-Kriterien sind nach Mitigation definiert und messbar.",
  ],
  disclaimer: "Diese Vorlage unterstützt praktische Security-Architektur und ersetzt keine formale Zertifizierungsprüfung.",
  ctaCheck: "Security Check starten",
  ctaAiSecurity: "AI-Agent-Security-Seite öffnen",
  ctaOpenclawCheck: "OpenClaw-Security-Check-Seite öffnen",
  ctaMethodik: "Methodik öffnen",
}

const PARTIAL: Partial<Record<Locale, Partial<ThreatModelCopy>>> = {
  es: { h1: "Plantilla de threat model para operadores de AI-agent", ctaCheck: "Iniciar security check" },
  fr: { h1: "Template de threat model pour opérateurs AI-agent", ctaCheck: "Démarrer security check" },
  pt: { h1: "Template de threat model para operadores de AI-agent", ctaCheck: "Iniciar security check" },
  it: { h1: "Template threat model per operatori AI-agent", ctaCheck: "Avvia security check" },
  ru: { h1: "Шаблон threat model для операторов AI-agent", ctaCheck: "Запустить security check" },
  zh: { h1: "面向运维的 AI Agent 威胁建模模板", ctaCheck: "开始安全检查" },
  ja: { h1: "運用者向け AI-agent 脅威モデリングテンプレート", ctaCheck: "security check を開始" },
  ar: { h1: "قالب threat model لمشغلي AI-agent", ctaCheck: "بدء security check" },
  nl: { h1: "Threat-modeltemplate voor AI-agent operators", ctaCheck: "Start security check" },
  hi: { h1: "AI-agent ऑपरेटरों के लिए threat model template", ctaCheck: "security check शुरू करें" },
  tr: { h1: "AI-agent operatörleri için threat model şablonu", ctaCheck: "security check başlat" },
  pl: { h1: "Szablon threat model dla operatorów AI-agent", ctaCheck: "Uruchom security check" },
  ko: { h1: "운영자를 위한 AI-agent 위협 모델 템플릿", ctaCheck: "security check 시작" },
}

export function getAiThreatModelCopy(locale: Locale): ThreatModelCopy {
  const base = locale === "de" ? DE : EN
  return { ...base, ...(PARTIAL[locale] ?? {}) }
}
