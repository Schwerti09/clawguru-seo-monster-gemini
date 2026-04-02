import type { Locale } from "@/lib/i18n"

type CheckMethodologyCopy = {
  title: string
  description: string
  h1: string
  intro: string
  whatTitle: string
  whatBullets: [string, string, string]
  whatNotTitle: string
  whatNotBullets: [string, string, string]
  nextTitle: string
  nextSteps: [string, string, string]
  disclaimer: string
  ctaCheck: string
  ctaMethod: string
  ctaOpenclawCheck: string
  ctaAiSecurity: string
}

const EN: CheckMethodologyCopy = {
  title: "30-second security check: what we measure and what we do not | ClawGuru",
  description:
    "Understand the ClawGuru 30-second security signal: what is evaluated, what is intentionally out of scope, and what to do next.",
  h1: "30-second security check: what we measure and what we do not",
  intro:
    "This check is designed as a rapid operator signal. It helps you prioritize weak spots quickly and move into runbook execution.",
  whatTitle: "What we measure",
  whatBullets: [
    "Exposure indicators: publicly reachable services, gateway surface, and risky defaults.",
    "Configuration posture: auth baseline, key handling patterns, and basic hardening hygiene.",
    "Execution readiness: whether findings map to concrete runbook-style next actions.",
  ],
  whatNotTitle: "What we do not measure",
  whatNotBullets: [
    "Deep manual pentest paths that require extended human testing and exploitation work.",
    "Environment-specific business impact scoring that depends on internal context we cannot infer.",
    "Formal certification evidence packages without your internal validation and controls mapping.",
  ],
  nextTitle: "What to do after the check",
  nextSteps: [
    "Start with the highest-risk finding and open the linked fix path.",
    "Apply the runbook steps, then run a re-check to confirm posture improvement.",
    "Document validated actions in your internal security and compliance workflow.",
  ],
  disclaimer:
    "ClawGuru provides a heuristic security signal, not a penetration test. Always verify in your own environment.",
  ctaCheck: "Start security check",
  ctaMethod: "Open methodology",
  ctaOpenclawCheck: "Open OpenClaw security check page",
  ctaAiSecurity: "Open AI-agent security page",
}

const DE: CheckMethodologyCopy = {
  title: "30-Sekunden-Security-Check: was wir messen und was nicht | ClawGuru",
  description:
    "Verstehe das 30-Sekunden-Signal von ClawGuru: was bewertet wird, was bewusst außerhalb des Scopes liegt und was danach zu tun ist.",
  h1: "30-Sekunden-Security-Check: was wir messen und was nicht",
  intro:
    "Der Check ist als schnelles Operator-Signal gebaut. Er hilft, Schwachstellen zügig zu priorisieren und in die Runbook-Umsetzung zu gehen.",
  whatTitle: "Was wir messen",
  whatBullets: [
    "Expositionsindikatoren: öffentlich erreichbare Services, Gateway-Surface und riskante Defaults.",
    "Konfigurations-Posture: Auth-Baseline, Key-Handling-Muster und grundlegende Hardening-Hygiene.",
    "Execution Readiness: ob Findings auf konkrete nächste Schritte im Runbook-Stil abbildbar sind.",
  ],
  whatNotTitle: "Was wir nicht messen",
  whatNotBullets: [
    "Tiefe manuelle Pentest-Pfade mit längerer menschlicher Test- und Exploit-Arbeit.",
    "Umgebungsspezifische Business-Impact-Bewertung, die internen Kontext voraussetzt.",
    "Formale Zertifizierungs-Evidenzpakete ohne deine interne Validierung und Controls-Zuordnung.",
  ],
  nextTitle: "Was nach dem Check zu tun ist",
  nextSteps: [
    "Mit dem höchsten Risiko-Finding starten und den verlinkten Fix-Pfad öffnen.",
    "Runbook-Schritte umsetzen und danach per Re-Check die Verbesserung bestätigen.",
    "Validierte Maßnahmen in deinem internen Security- und Compliance-Workflow dokumentieren.",
  ],
  disclaimer:
    "ClawGuru liefert ein heuristisches Security-Signal, keinen Penetrationstest. Immer in der eigenen Umgebung verifizieren.",
  ctaCheck: "Security Check starten",
  ctaMethod: "Methodik öffnen",
  ctaOpenclawCheck: "OpenClaw Security-Check-Seite öffnen",
  ctaAiSecurity: "AI-Agent-Security-Seite öffnen",
}

const PARTIAL: Partial<Record<Locale, Partial<CheckMethodologyCopy>>> = {
  es: {
    h1: "Security check en 30 segundos: qué medimos y qué no",
    ctaCheck: "Iniciar security check",
    ctaMethod: "Abrir metodología",
  },
  fr: {
    h1: "Security check en 30 secondes : ce que nous mesurons et ce que nous ne mesurons pas",
    ctaCheck: "Démarrer security check",
    ctaMethod: "Ouvrir la méthodologie",
  },
  pt: {
    h1: "Security check em 30 segundos: o que medimos e o que não medimos",
    ctaCheck: "Iniciar security check",
    ctaMethod: "Abrir metodologia",
  },
  it: {
    h1: "Security check in 30 secondi: cosa misuriamo e cosa no",
    ctaCheck: "Avvia security check",
    ctaMethod: "Apri metodologia",
  },
  ru: {
    h1: "Security check за 30 секунд: что мы измеряем, а что нет",
    ctaCheck: "Запустить security check",
    ctaMethod: "Открыть методологию",
  },
  zh: {
    h1: "30 秒 security check：我们衡量什么，不衡量什么",
    ctaCheck: "开始安全检查",
    ctaMethod: "打开方法论",
  },
  ja: {
    h1: "30秒 security check：何を測定し、何を測定しないか",
    ctaCheck: "security check を開始",
    ctaMethod: "方法論を開く",
  },
  ar: {
    h1: "Security check خلال 30 ثانية: ما الذي نقيسه وما الذي لا نقيسه",
    ctaCheck: "بدء security check",
    ctaMethod: "فتح المنهجية",
  },
  nl: {
    h1: "30-seconden security check: wat we meten en wat niet",
    ctaCheck: "Start security check",
    ctaMethod: "Methodologie openen",
  },
  hi: {
    h1: "30-सेकंड security check: हम क्या मापते हैं और क्या नहीं",
    ctaCheck: "security check शुरू करें",
    ctaMethod: "मेथडोलॉजी खोलें",
  },
  tr: {
    h1: "30 saniyelik security check: neyi ölçüyoruz, neyi ölçmüyoruz",
    ctaCheck: "security check başlat",
    ctaMethod: "Metodolojiyi aç",
  },
  pl: {
    h1: "30-sekundowy security check: co mierzymy, a czego nie",
    ctaCheck: "Uruchom security check",
    ctaMethod: "Otwórz metodykę",
  },
  ko: {
    h1: "30초 security check: 무엇을 측정하고 무엇을 측정하지 않는가",
    ctaCheck: "security check 시작",
    ctaMethod: "방법론 열기",
  },
}

export function getCheckMethodologyCopy(locale: Locale): CheckMethodologyCopy {
  const base = locale === "de" ? DE : EN
  return { ...base, ...(PARTIAL[locale] ?? {}) }
}
