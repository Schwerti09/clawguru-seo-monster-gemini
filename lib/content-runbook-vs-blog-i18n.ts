import type { Locale } from "@/lib/i18n"

type RunbookVsBlogCopy = {
  title: string
  description: string
  h1: string
  intro: string
  compareTitle: string
  compare: [string, string, string, string, string]
  whyRunbookTitle: string
  whyRunbook: [string, string, string]
  transitionTitle: string
  transition: [string, string, string]
  disclaimer: string
  ctaRunbooks: string
  ctaCheck: string
  ctaOpenclaw: string
  ctaMethodik: string
}

const EN: RunbookVsBlogCopy = {
  title: "Executable runbook vs static blog post: what actually changes operations | ClawGuru",
  description:
    "A practical comparison between executable runbooks and static blog content, with a migration path for security operations teams.",
  h1: "Executable runbook vs static blog post",
  intro:
    "Static content can teach. Executable runbooks can change outcomes under pressure. Teams need both, but for different jobs.",
  compareTitle: "Operational difference",
  compare: [
    "Blog post: explanation-heavy, reader decides implementation details.",
    "Executable runbook: action-sequenced steps with explicit verification criteria.",
    "Blog post: hard to standardize under incident pressure.",
    "Executable runbook: repeatable path with lower cognitive load in critical windows.",
    "Blog post: useful context archive; runbook: operational execution framework.",
  ],
  whyRunbookTitle: "Why runbooks outperform static guidance in incidents",
  whyRunbook: [
    "They encode order, ownership, and expected outputs instead of generic advice.",
    "They reduce operator drift across teams and shifts.",
    "They support re-check loops, making recovery measurable rather than assumed.",
  ],
  transitionTitle: "How to move from blog-style guidance to runbook execution",
  transition: [
    "Extract one recurring incident pattern and define an ordered response sequence.",
    "Attach validation checkpoints to each step (what must be true after action).",
    "Run tabletop and live re-checks, then refine until execution is consistent.",
  ],
  disclaimer: "This comparison supports operational design and does not replace specialist incident forensics.",
  ctaRunbooks: "Open runbooks",
  ctaCheck: "Start security check",
  ctaOpenclaw: "Open OpenClaw page",
  ctaMethodik: "Open methodology",
}

const DE: RunbookVsBlogCopy = {
  title: "Executable Runbook vs statischer Blogpost: was den Betrieb wirklich verändert | ClawGuru",
  description:
    "Praktischer Vergleich zwischen ausführbaren Runbooks und statischen Blog-Inhalten mit Übergangspfad für Security-Teams.",
  h1: "Executable Runbook vs statischer Blogpost",
  intro:
    "Statische Inhalte erklären. Executable Runbooks verändern Outcomes unter Druck. Teams brauchen beides, aber für unterschiedliche Aufgaben.",
  compareTitle: "Operativer Unterschied",
  compare: [
    "Blogpost: erklärungsfokussiert, Umsetzung bleibt beim Leser.",
    "Executable Runbook: sequenzierte Maßnahmen mit klaren Verifikationskriterien.",
    "Blogpost: schwer zu standardisieren in Incident-Drucksituationen.",
    "Executable Runbook: reproduzierbarer Pfad mit geringerer kognitiver Last in kritischen Fenstern.",
    "Blogpost: Kontext-Archiv; Runbook: Framework für operative Ausführung.",
  ],
  whyRunbookTitle: "Warum Runbooks in Incidents besser funktionieren",
  whyRunbook: [
    "Sie kodieren Reihenfolge, Ownership und erwartete Outputs statt allgemeiner Tipps.",
    "Sie reduzieren Operator-Drift über Teams und Schichten hinweg.",
    "Sie unterstützen Re-Check-Loops und machen Recovery messbar statt vermutet.",
  ],
  transitionTitle: "Von Blog-Guidance zu Runbook-Ausführung wechseln",
  transition: [
    "Ein wiederkehrendes Incident-Pattern extrahieren und als geordnete Sequenz definieren.",
    "An jeden Schritt Validierungspunkte hängen (was muss nach der Aktion wahr sein).",
    "Tabletop und Live-Re-Checks fahren, dann iterativ bis zur stabilen Ausführung verbessern.",
  ],
  disclaimer: "Dieser Vergleich unterstützt operative Gestaltung und ersetzt keine spezialisierte Incident-Forensik.",
  ctaRunbooks: "Runbooks öffnen",
  ctaCheck: "Security Check starten",
  ctaOpenclaw: "OpenClaw-Seite öffnen",
  ctaMethodik: "Methodik öffnen",
}

const PARTIAL: Partial<Record<Locale, Partial<RunbookVsBlogCopy>>> = {
  es: { h1: "Runbook ejecutable vs blog estático", ctaCheck: "Iniciar security check" },
  fr: { h1: "Runbook exécutable vs blog statique", ctaCheck: "Démarrer security check" },
  pt: { h1: "Runbook executável vs blog estático", ctaCheck: "Iniciar security check" },
  it: { h1: "Runbook eseguibile vs blog statico", ctaCheck: "Avvia security check" },
  ru: { h1: "Executable runbook vs статический блог", ctaCheck: "Запустить security check" },
  zh: { h1: "可执行 Runbook vs 静态博客", ctaCheck: "开始安全检查" },
  ja: { h1: "実行可能 runbook vs 静的ブログ", ctaCheck: "security check を開始" },
  ar: { h1: "Runbook قابل للتنفيذ مقابل مدونة ثابتة", ctaCheck: "بدء security check" },
  nl: { h1: "Executable runbook vs statische blogpost", ctaCheck: "Start security check" },
  hi: { h1: "Executable runbook बनाम static blog post", ctaCheck: "security check शुरू करें" },
  tr: { h1: "Executable runbook vs statik blog yazısı", ctaCheck: "security check başlat" },
  pl: { h1: "Executable runbook vs statyczny blogpost", ctaCheck: "Uruchom security check" },
  ko: { h1: "실행형 runbook vs 정적 블로그 포스트", ctaCheck: "security check 시작" },
}

export function getRunbookVsBlogCopy(locale: Locale): RunbookVsBlogCopy {
  const base = locale === "de" ? DE : EN
  return { ...base, ...(PARTIAL[locale] ?? {}) }
}
