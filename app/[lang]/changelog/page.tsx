// Public changelog — Kimi 2.5 audit Important #5.
// Renders curated entries from lib/changelog-data.ts grouped by date. Static
// page (force-static + revalidate=3600); add new entries by editing the data
// file and redeploying.

import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { CHANGELOG, type ChangelogEntry, type ChangelogKind } from "@/lib/changelog-data"

export const dynamic = "force-static"
export const revalidate = 3600

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  return {
    title: locale === "de" ? "ClawGuru Changelog — Was sich gerade bewegt" : "ClawGuru Changelog — What's shipping",
    description: locale === "de"
      ? "Aktuelle Releases, neue Features, Bugfixes und Operational Improvements bei ClawGuru."
      : "Current releases, new features, bug fixes, and operational improvements at ClawGuru.",
    alternates: buildLocalizedAlternates(locale, "/changelog"),
    robots: "index, follow",
  }
}

const KIND_STYLES: Record<ChangelogKind, { bg: string; border: string; text: string; labelDe: string; labelEn: string }> = {
  feature:     { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-300", labelDe: "Neu",         labelEn: "New" },
  improvement: { bg: "bg-cyan-500/10",    border: "border-cyan-500/30",    text: "text-cyan-300",    labelDe: "Verbessert",  labelEn: "Improved" },
  fix:         { bg: "bg-amber-500/10",   border: "border-amber-500/30",   text: "text-amber-300",   labelDe: "Behoben",     labelEn: "Fixed" },
  ops:         { bg: "bg-violet-500/10",  border: "border-violet-500/30",  text: "text-violet-300",  labelDe: "Infrastruktur", labelEn: "Infrastructure" },
}

function groupByDate(entries: ChangelogEntry[]): { date: string; items: ChangelogEntry[] }[] {
  const map = new Map<string, ChangelogEntry[]>()
  for (const e of entries) {
    if (!map.has(e.date)) map.set(e.date, [])
    map.get(e.date)!.push(e)
  }
  return Array.from(map.entries())
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .map(([date, items]) => ({ date, items }))
}

export default function ChangelogPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const groups = groupByDate(CHANGELOG)

  return (
    <main className="min-h-screen bg-black text-gray-100">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <header className="mb-12">
          <div className="text-xs font-mono uppercase tracking-[0.25em] text-gray-500 mb-3">
            {isDE ? "Changelog" : "Changelog"}
          </div>
          <h1 className="text-3xl font-extrabold mb-3">
            {isDE ? "Was wir gerade ausliefern" : "What we're shipping"}
          </h1>
          <p className="text-sm text-gray-400 max-w-xl">
            {isDE
              ? "Kuratierte Releases. Nicht jeder Commit, sondern was Nutzern auffallen sollte. Älteres bekommst du im Git-Verlauf."
              : "Curated releases. Not every commit — only what users should notice. Older changes live in the git history."}
          </p>
        </header>

        <div className="space-y-12">
          {groups.map((g) => (
            <section key={g.date}>
              <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-4">
                {g.date}
              </div>
              <div className="space-y-3">
                {g.items.map((e, i) => {
                  const style = KIND_STYLES[e.kind]
                  return (
                    <article
                      key={i}
                      className="border border-white/10 rounded-lg p-4 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${style.bg} ${style.border} border ${style.text} shrink-0`}
                        >
                          {isDE ? style.labelDe : style.labelEn}
                        </span>
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm text-white mb-1">
                            {isDE ? e.titleDe : e.titleEn}
                          </h3>
                          {(isDE ? e.summaryDe : e.summaryEn) && (
                            <p className="text-xs text-gray-400 leading-relaxed">
                              {isDE ? e.summaryDe : e.summaryEn}
                            </p>
                          )}
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            </section>
          ))}
        </div>

        <footer className="border-t border-white/10 mt-16 pt-6 text-xs text-gray-500 font-mono">
          {isDE ? "Vollständiger Verlauf:" : "Full history:"}{" "}
          <a href="https://github.com/Schwerti09/clawguru-seo-monster-gemini" className="text-gray-300 hover:text-white">
            github
          </a>
        </footer>
      </div>
    </main>
  )
}
