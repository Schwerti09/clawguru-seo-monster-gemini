"use client"

import { useState } from "react"

type FaqItem = { q: string; a: string; category?: string }

type IntelFaqDict = {
  hero_badge?: string
  hero_title?: string
  hero_subline?: string
  cta_daypass?: string
  upgrade_premium_label?: string
  upgrade_title?: string
  upgrade_text?: string
  upgrade_button?: string
  live_header?: string
  live_loading?: string
  live_error?: string
  export_csv?: string
  export_json?: string
  export_pdf?: string
  fix_link_label?: string
  free_teaser_text?: string
  free_teaser_button?: string
  analyzer_header?: string
  analyzer_input_placeholder?: string
  analyzing_label?: string
  radar_header?: string
  radar_loading?: string
  radar_error?: string
  probability_label?: string
  preview_header?: string
  preview_empty?: string
  stats_title?: string
  stats_subtitle?: string
  tile_total_cves?: string
  tile_avg_cvss?: string
  tile_top_services?: string
  spark_title?: string
  faq_title?: string
  faq_subtitle?: string
  faq_cat_basics?: string
  faq_cat_features?: string
  faq_cat_access?: string
  faq_q1?: string; faq_a1?: string
  faq_q2?: string; faq_a2?: string
  faq_q3?: string; faq_a3?: string
  faq_q4?: string; faq_a4?: string
  faq_q5?: string; faq_a5?: string
  faq_q6?: string; faq_a6?: string
  faq_q7?: string; faq_a7?: string
  faq_q8?: string; faq_a8?: string
  [key: string]: string | undefined
}

const FALLBACK: FaqItem[] = [
  {
    category: "Grundlagen",
    q: "Was ist ClawGuru Intel?",
    a: "Intel ist das Mycelial Threat Intelligence Center von ClawGuru. Es aggregiert Echtzeit-CVE-Feeds, KI-gestützte Risikoanalysen und direkte Runbook-Empfehlungen – alles auf einem Dashboard. Statt manuell NIST, GitHub Advisory und OSV zu durchsuchen, bekommst du hier operativ aufbereitete Bedrohungsdaten.",
  },
  {
    category: "Grundlagen",
    q: "Für wen ist Intel gedacht?",
    a: "DevOps-Teams, SREs, Security Engineers und alle, die selbst gehostete Infrastruktur (Moltbot, OpenClaw, Docker, Kubernetes, Cloud) betreiben. Intel hilft dir, relevante CVEs sofort zu identifizieren und mit einem passenden Runbook direkt zu fixen – ohne Security-PhD.",
  },
  {
    category: "Features",
    q: "Wie funktioniert der Live Threat Feed?",
    a: "Der Feed synchronisiert alle 5 Minuten neue CVEs aus mehreren Quellen (NVD, OSV, GitHub Advisory). Jede Eintragung enthält CVSS-Score, betroffene Services, Severity-Badge und – falls vorhanden – einen direkten Link zum passenden Runbook. Als Free-User siehst du die letzten 5 Einträge; mit Daypass den kompletten Feed mit Export (CSV/JSON/PDF).",
  },
  {
    category: "Features",
    q: "Was macht der CVE-Analyzer?",
    a: "Gib eine CVE-ID (z. B. CVE-2024-6387) oder ein Stichwort (z. B. 'ssh') ein. Der Analyzer matched die CVE gegen deine Infrastruktur-Tags, berechnet eine Relevanzbewertung und empfiehlt sofort das passende Fix-Runbook. Im Hintergrund nutzt er das Mycelium-Wissensgraph, um Abhängigkeiten und Co-Occurrence-Risiken zu erkennen.",
  },
  {
    category: "Features",
    q: "Was ist das Predictive Threat Radar?",
    a: "Der Radar nutzt KI (Oracle), um CVEs vorherzusagen, bevor sie offiziell gepatcht oder breit ausgenutzt werden. Grundlage sind Exploit-PoC-Veröffentlichungen, Darknet-Aktivität und Patch-Lag-Muster. Du siehst eine Wahrscheinlichkeitsschätzung und einen empfohlenen Handlungszeitraum.",
  },
  {
    category: "Features",
    q: "Was ist die Mycelium-Vorschau?",
    a: "Mycelium ist der Wissensgraph von ClawGuru. Knoten repräsentieren CVEs, Services, Tags und Kunden-Assets. Kanten zeigen Beziehungen (betrifft, blockiert-durch, gefixt-durch). In der Vorschau siehst du die Top-Cluster deiner aktuellen Bedrohungslage. Das vollständige interaktive Mycelium-Dashboard ist im Pro/Team-Plan verfügbar.",
  },
  {
    category: "Zugang & Preise",
    q: "Was ist inklusive, was kostet extra?",
    a: "Free: Die letzten 5 CVEs im Feed, CVE-Analyzer (begrenzte Abfragen), Statistik-Tiles. Daypass (Einmalig): Vollständiger CVE-Feed, Export (CSV/JSON/PDF), erweiterte Filter und automatische Runbook-Ausführung. Pro/Team: Persistente Dashboard-Daten, Mycelium vollständig, API-Zugang, Audit-Trail.",
  },
  {
    category: "Zugang & Preise",
    q: "Ist Intel ein Pentest-Tool?",
    a: "Nein. Intel dient ausschließlich der Absicherung deiner eigenen Systeme. Kein aktives Scanning fremder Systeme, keine Exploit-Tools. Alle Runbooks sind defensiv – sie zeigen, wie du deine eigene Infrastruktur härtets und Schwachstellen schließt.",
  },
]

function buildItems(dict?: IntelFaqDict): FaqItem[] {
  if (!dict?.faq_q1) return FALLBACK
  const cat1 = dict.faq_cat_basics || "Grundlagen"
  const cat2 = dict.faq_cat_features || "Features"
  const cat3 = dict.faq_cat_access || "Zugang & Preise"
  return [
    { category: cat1, q: dict.faq_q1 ?? "", a: dict.faq_a1 ?? "" },
    { category: cat1, q: dict.faq_q2 ?? "", a: dict.faq_a2 ?? "" },
    { category: cat2, q: dict.faq_q3 ?? "", a: dict.faq_a3 ?? "" },
    { category: cat2, q: dict.faq_q4 ?? "", a: dict.faq_a4 ?? "" },
    { category: cat2, q: dict.faq_q5 ?? "", a: dict.faq_a5 ?? "" },
    { category: cat2, q: dict.faq_q6 ?? "", a: dict.faq_a6 ?? "" },
    { category: cat3, q: dict.faq_q7 ?? "", a: dict.faq_a7 ?? "" },
    { category: cat3, q: dict.faq_q8 ?? "", a: dict.faq_a8 ?? "" },
  ]
}

const CATEGORY_COLORS: Record<string, string> = {
  "Grundlagen": "bg-cyan-900/60 text-cyan-300 border-cyan-700",
  "Features": "bg-blue-900/60 text-blue-300 border-blue-700",
  "Zugang & Preise": "bg-emerald-900/60 text-emerald-300 border-emerald-700",
}

function categoryColor(cat?: string): string {
  if (!cat) return "bg-gray-800 text-gray-400 border-gray-700"
  // Try exact match first, then fallback by keyword
  if (CATEGORY_COLORS[cat]) return CATEGORY_COLORS[cat]
  const lower = cat.toLowerCase()
  if (lower.includes("basic") || lower.includes("grund") || lower.includes("intro") || lower.includes("general")) {
    return "bg-cyan-900/60 text-cyan-300 border-cyan-700"
  }
  if (lower.includes("feature") || lower.includes("funktion") || lower.includes("how") || lower.includes("wie")) {
    return "bg-blue-900/60 text-blue-300 border-blue-700"
  }
  return "bg-emerald-900/60 text-emerald-300 border-emerald-700"
}

export default function IntelFaq({ dict }: { dict?: IntelFaqDict }) {
  const [open, setOpen] = useState<number | null>(null)
  const items = buildItems(dict)
  const title = dict?.faq_title || "FAQ – Wie funktioniert Intel?"
  const subtitle = dict?.faq_subtitle || "Alles, was du wissen musst, um das Intel Center optimal zu nutzen."

  return (
    <section className="mb-10">
      {/* FAQPage JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: items.map((it) => ({
              "@type": "Question",
              name: it.q,
              acceptedAnswer: { "@type": "Answer", text: it.a },
            })),
          }),
        }}
      />

      {/* Header */}
      <div className="text-center mb-8">
        <span className="inline-block text-[11px] font-mono uppercase tracking-[0.22em] px-4 py-1 rounded-full border mb-4"
              style={{ borderColor: "rgba(0,255,157,0.35)", color: "#00ff9d", background: "rgba(0,255,157,0.06)" }}>
          FAQ
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-gray-100 mb-2">{title}</h2>
        <p className="text-gray-400 max-w-xl mx-auto text-sm">{subtitle}</p>
      </div>

      {/* Accordion */}
      <div className="space-y-3 max-w-3xl mx-auto">
        {items.map((item, idx) => {
          const isOpen = open === idx
          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-colors ${isOpen ? "border-gray-600 bg-gray-800" : "border-gray-700 bg-gray-800/50 hover:bg-gray-800"}`}
            >
              <button
                className="w-full text-left px-5 py-4 flex items-start justify-between gap-3 group"
                onClick={() => setOpen(isOpen ? null : idx)}
                aria-expanded={isOpen}
              >
                <div className="flex items-start gap-3 min-w-0">
                  {item.category && (
                    <span className={`flex-shrink-0 mt-0.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${categoryColor(item.category)}`}>
                      {item.category}
                    </span>
                  )}
                  <span className="font-bold text-gray-100 text-sm sm:text-base leading-snug">{item.q}</span>
                </div>
                <span
                  className={`flex-shrink-0 w-6 h-6 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-45 border-cyan-500 text-cyan-400" : ""}`}
                  aria-hidden="true"
                >
                  +
                </span>
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-gray-300 text-sm leading-relaxed border-t border-gray-700/60 pt-4">
                  {item.a}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
