import type { Locale } from "@/lib/i18n"

type Misconfig = {
  title: string
  risk: string
  fix: string
}

type OpenClawMisconfigCopy = {
  title: string
  description: string
  h1: string
  intro: string
  sectionTitle: string
  misconfigs: [Misconfig, Misconfig, Misconfig, Misconfig, Misconfig]
  nextTitle: string
  nextSteps: [string, string, string]
  disclaimer: string
  ctaCheck: string
  ctaOpenclaw: string
  ctaMoltbot: string
  ctaMethodik: string
}

const EN: OpenClawMisconfigCopy = {
  title: "OpenClaw top 5 exposure misconfigurations in 2026 | ClawGuru",
  description:
    "The most common OpenClaw/Moltbot exposure misconfigurations and a practical fix path for each one.",
  h1: "OpenClaw top 5 exposure misconfigurations in 2026",
  intro:
    "Most incidents are not caused by exotic zero-days. They come from exposed defaults and weak operational baselines.",
  sectionTitle: "Top 5 misconfigurations and fix paths",
  misconfigs: [
    {
      title: "Public gateway without strict origin and auth controls",
      risk: "Session hijack and unauthorized command execution become realistic.",
      fix: "Restrict ingress, enforce origin binding, and require scoped authentication on every gateway path.",
    },
    {
      title: "API keys and tokens exposed in logs or environment dumps",
      risk: "Credential replay and lateral movement after a single leak.",
      fix: "Rotate secrets immediately, redact logs, and move to secret stores with short-lived tokens.",
    },
    {
      title: "Over-permissive network exposure for admin and debug endpoints",
      risk: "Attackers enumerate control surfaces and pivot into internal services.",
      fix: "Close public admin ports, segment management paths, and enforce allowlists.",
    },
    {
      title: "Missing rate limits and anomaly monitoring on critical endpoints",
      risk: "Brute-force and automation abuse run undetected until impact is visible.",
      fix: "Apply endpoint rate limits, alert on auth-fail spikes, and monitor unusual request patterns.",
    },
    {
      title: "No repeatable re-check after hardening changes",
      risk: "Teams assume they are fixed while regressions quietly reappear.",
      fix: "Make re-check mandatory after each mitigation and track results in your ops workflow.",
    },
  ],
  nextTitle: "What to do right now",
  nextSteps: [
    "Run a fresh check to baseline your current exposure.",
    "Prioritize one high-impact misconfiguration and execute the related runbook steps.",
    "Re-check and document what changed before moving to the next item.",
  ],
  disclaimer: "This guidance is heuristic operational support, not a penetration test.",
  ctaCheck: "Start security check",
  ctaOpenclaw: "Open OpenClaw landing page",
  ctaMoltbot: "Open Moltbot hardening page",
  ctaMethodik: "Open methodology",
}

const DE: OpenClawMisconfigCopy = {
  title: "OpenClaw Top-5 Expositions-Misconfigs 2026 | ClawGuru",
  description:
    "Die häufigsten OpenClaw/Moltbot-Expositionsfehler und ein konkreter Fix-Pfad für jeden davon.",
  h1: "OpenClaw Top-5 Expositions-Misconfigs 2026",
  intro:
    "Die meisten Incidents kommen nicht durch exotische Zero-Days, sondern durch exponierte Defaults und schwache Ops-Baselines.",
  sectionTitle: "Top 5 Misconfigs und Fix-Pfade",
  misconfigs: [
    {
      title: "Öffentliches Gateway ohne strikte Origin- und Auth-Kontrollen",
      risk: "Session-Hijack und unautorisierte Command-Ausführung werden realistisch.",
      fix: "Ingress einschränken, Origin-Binding erzwingen und auf jedem Gateway-Pfad scoped Auth verlangen.",
    },
    {
      title: "API-Keys und Tokens in Logs oder Env-Dumps",
      risk: "Credential-Replay und laterale Bewegung nach einem einzigen Leak.",
      fix: "Secrets sofort rotieren, Logs redigieren und Secret-Stores mit kurzlebigen Tokens nutzen.",
    },
    {
      title: "Zu breite Netz-Exposition bei Admin- und Debug-Endpunkten",
      risk: "Angreifer enumerieren Control-Surfaces und pivotieren in interne Services.",
      fix: "Öffentliche Admin-Ports schließen, Management-Pfade segmentieren und Allowlists erzwingen.",
    },
    {
      title: "Fehlende Rate-Limits und Anomalie-Monitoring auf kritischen Endpunkten",
      risk: "Brute-Force und Automation-Missbrauch bleiben unsichtbar, bis der Schaden sichtbar wird.",
      fix: "Rate-Limits setzen, Auth-Fail-Spikes alarmieren und ungewöhnliche Request-Pattern überwachen.",
    },
    {
      title: "Kein reproduzierbarer Re-Check nach Hardening-Änderungen",
      risk: "Teams glauben, sie sind safe, während Regressionen zurückkommen.",
      fix: "Re-Check nach jeder Maßnahme verpflichtend machen und Ergebnisse im Ops-Workflow nachhalten.",
    },
  ],
  nextTitle: "Was jetzt zu tun ist",
  nextSteps: [
    "Frischen Check starten und aktuelle Exposition baseline'n.",
    "Ein High-Impact-Misconfig priorisieren und den zugehörigen Runbook-Pfad ausführen.",
    "Re-Check fahren und Änderungen dokumentieren, bevor der nächste Punkt dran ist.",
  ],
  disclaimer: "Diese Hinweise sind heuristische Ops-Unterstützung, kein Penetrationstest.",
  ctaCheck: "Security Check starten",
  ctaOpenclaw: "OpenClaw Landingpage öffnen",
  ctaMoltbot: "Moltbot-Hardening-Seite öffnen",
  ctaMethodik: "Methodik öffnen",
}

const PARTIAL: Partial<Record<Locale, Partial<OpenClawMisconfigCopy>>> = {
  es: { h1: "Top 5 misconfigs de exposición en OpenClaw (2026)", ctaCheck: "Iniciar security check" },
  fr: { h1: "Top 5 des misconfigs d'exposition OpenClaw (2026)", ctaCheck: "Démarrer security check" },
  pt: { h1: "Top 5 misconfigs de exposição no OpenClaw (2026)", ctaCheck: "Iniciar security check" },
  it: { h1: "Top 5 misconfig di esposizione OpenClaw (2026)", ctaCheck: "Avvia security check" },
  ru: { h1: "Топ-5 misconfig экспозиции OpenClaw (2026)", ctaCheck: "Запустить security check" },
  zh: { h1: "OpenClaw 暴露面 Top 5 配置错误（2026）", ctaCheck: "开始安全检查" },
  ja: { h1: "OpenClaw 露出ミスコンフィグ Top 5（2026）", ctaCheck: "security check を開始" },
  ar: { h1: "أهم 5 misconfigs للتعرّض في OpenClaw (2026)", ctaCheck: "بدء security check" },
  nl: { h1: "Top 5 exposure-misconfigs in OpenClaw (2026)", ctaCheck: "Start security check" },
  hi: { h1: "OpenClaw में शीर्ष 5 exposure misconfigs (2026)", ctaCheck: "security check शुरू करें" },
  tr: { h1: "OpenClaw için en kritik 5 exposure misconfig (2026)", ctaCheck: "security check başlat" },
  pl: { h1: "Top 5 misconfig ekspozycji OpenClaw (2026)", ctaCheck: "Uruchom security check" },
  ko: { h1: "OpenClaw 노출 Top 5 misconfig (2026)", ctaCheck: "security check 시작" },
}

export function getOpenClawMisconfigCopy(locale: Locale): OpenClawMisconfigCopy {
  const base = locale === "de" ? DE : EN
  return { ...base, ...(PARTIAL[locale] ?? {}) }
}
