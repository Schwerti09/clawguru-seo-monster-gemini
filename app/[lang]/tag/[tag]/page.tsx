// Localized tag pages: /de/tag/[tag], /en/tag/[tag], etc.
// Full detail page with i18n, stats and related tags.

import type { Metadata } from "next"
import NextDynamic from "next/dynamic"
import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { getDictionary } from "@/lib/getDictionary"
import { notFound } from "next/navigation"

export const revalidate = 3600
export const dynamicParams = true
export const dynamic = "force-dynamic"

const TagList = NextDynamic(() => import("@/components/tags/TagList"))

export async function generateStaticParams() {
  const { allTags } = await import("@/lib/pseo")
  const tags = allTags().slice(0, 200)
  const allowed = (process.env.SITEMAP_100K_LOCALES ?? "de,en").split(",").map((s) => s.trim()).filter(Boolean)
  return allowed.flatMap((lang) => tags.map((tag) => ({ lang, tag })))
}

export async function generateMetadata(props: { params: { lang: string; tag: string } }): Promise<Metadata> {
  const { tag, lang } = props.params
  const locale = (SUPPORTED_LOCALES.includes(lang as Locale) ? lang : "de") as Locale
  const decodedTag = decodeURIComponent(tag)
  try {
    const pseo: any = await import("@/lib/pseo")
    let list: any[] = []
    try {
      list = typeof pseo.buildRunbooksClient === "function" ? pseo.buildRunbooksClient(10000) : (pseo.RUNBOOKS ?? [])
    } catch {
      list = (pseo.RUNBOOKS ?? [])
    }
    const items = Array.isArray(list) ? list.filter((r: any) => (r?.tags || []).includes(decodedTag)) : []
    if (!items.length) return { alternates: buildLocalizedAlternates(locale, `/tag/${encodeURIComponent(decodedTag)}`) }
  } catch {}
  return { title: `${decodedTag} Runbooks | ClawGuru Tag-Hub`, alternates: buildLocalizedAlternates(locale, `/tag/${encodeURIComponent(decodedTag)}`) }
}

export default async function LocaleTagPage(props: { params: { lang: string; tag: string } }) {
  const { lang } = props.params
  const locale = (SUPPORTED_LOCALES.includes(lang as Locale) ? lang : "de") as Locale
  const dict = await getDictionary(locale)
  const tag = decodeURIComponent(props.params.tag)
  const prefix = `/${locale}`
  // Materialize runbooks from the same source as /api/stats/tags
  const pseo: any = await import("@/lib/pseo")
  let list: any[] = []
  try {
    list = typeof pseo.buildRunbooksClient === "function" ? pseo.buildRunbooksClient(10000) : (pseo.RUNBOOKS ?? [])
  } catch {
    list = (pseo.RUNBOOKS ?? [])
  }
  // Flexible matching: support namespaced tags like "topic:x" or plain "x"
  const key = String(tag).toLowerCase()
  const candidates = new Set<string>([key])
  if (key.includes(":")) {
    const bare = key.split(":", 2)[1]
    if (bare) candidates.add(bare)
  } else {
    for (const ns of ["topic","issue","provider","service","stack","year"]) candidates.add(`${ns}:${key}`)
  }
  const items = Array.isArray(list)
    ? list.filter((r: any) =>
        (r.tags || []).some((t: string) => {
          const tn = String(t).toLowerCase()
          if (candidates.has(tn)) return true
          if (tn.includes(":")) {
            const bare = tn.split(":", 2)[1]
            if (bare && candidates.has(bare)) return true
          }
          return false
        })
      )
    : []

  const top10 = items
    .slice()
    .sort((a, b) => (b.clawScore ?? 0) - (a.clawScore ?? 0))
    .slice(0, 10)

  // Related tags by frequency (excluding current)
  const relMap = new Map<string, number>()
  for (const r of items) for (const t of r.tags || []) if (t !== tag) relMap.set(t, (relMap.get(t) || 0) + 1)
  const related = Array.from(relMap.entries()).sort((a, b) => b[1] - a[1]).slice(0, 30).map((x) => x[0])

  const avgClaw = Math.round(
    (items.reduce((a, r) => a + (Number(r.clawScore || 0) || 0), 0) / Math.max(1, items.length)) * 10
  ) / 10

  return (
    <Container>
      <div className="py-16 max-w-6xl mx-auto">
        <nav className="text-sm text-gray-400 mb-6" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2">
            <li><a href={`${prefix}`} className="hover:text-cyan-400">ClawGuru</a></li>
            <li>/</li>
            <li><a href={`${prefix}/tags`} className="hover:text-cyan-400">Tags</a></li>
            <li>/</li>
            <li className="text-gray-300">{tag}</li>
          </ol>
        </nav>

        <SectionTitle
          kicker={(dict as any)?.tags?.kicker || "Tag Cluster"}
          title={tag}
          subtitle={`${items.length} Runbooks · Ø ClawScore ${avgClaw}`}
        />

        {top10.length > 0 && (
          <div className="mt-8">
            <h2 className="text-base font-black text-gray-300 uppercase tracking-widest mb-4">Top 10 Runbooks</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {top10.map((r, i) => (
                <a
                  key={r.slug}
                  href={`${prefix}/runbook/${r.slug}`}
                  className="p-4 rounded-2xl border border-gray-800 bg-black/30 hover:bg-black/40 transition-colors flex items-start gap-3"
                >
                  <span className="text-lg font-black text-gray-400 w-6 shrink-0">{i + 1}</span>
                  <div>
                    <div className="font-bold text-gray-100">{r.title}</div>
                    <div className="mt-1 text-xs text-gray-400 flex gap-2">
                      <span>⚡{r.clawScore}</span>
                      <span>·</span>
                      <span className="text-cyan-400 underline">Öffnen →</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {related.length > 0 && (
          <div className="mt-10">
            <h2 className="text-base font-black text-gray-300 uppercase tracking-widest mb-3">Verwandte Tags</h2>
            <TagList tags={related} />
          </div>
        )}

        <div className="mt-10">
          <a
            href={`${prefix}/summon?q=${encodeURIComponent(tag)}&auto=1`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/15 transition-colors"
          >
            In Summon starten mit diesem Tag →
          </a>
        </div>

        <h2 className="mt-12 text-base font-black text-gray-300 uppercase tracking-widest mb-4">Alle Runbooks</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.slice(0, 120).map((r) => (
            <a
              key={r.slug}
              href={`${prefix}/runbook/${r.slug}`}
              className="p-6 rounded-3xl border border-gray-800 bg-black/25 hover:bg-black/35 transition-colors"
            >
              <div className="text-lg font-black">{r.title}</div>
              <div className="mt-2 text-sm text-gray-400">{r.summary}</div>
              <div className="mt-3 flex items-center gap-3 text-sm">
                <span className="text-cyan-300 underline">Runbook öffnen →</span>
                <span className="text-xs text-gray-300">⚡{r.clawScore}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </Container>
  )
}
