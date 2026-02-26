import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"
import { allTags, runbooksByTag, topRunbooksByTag } from "@/lib/pseo"
import { notFound } from "next/navigation"
import { BASE_URL } from "@/lib/config"

export const revalidate = 60 * 60 * 24
export const dynamicParams = true

export async function generateStaticParams() {
  // pre-render a slice of tags
  return allTags().slice(0, 200).map((t) => ({ tag: t }))
}

export async function generateMetadata({ params }: { params: { tag: string } }) {
  const tag = decodeURIComponent(params.tag)
  const items = runbooksByTag(tag)
  if (!items.length) return {}
  return {
    title: `${tag} Runbooks | ClawGuru Tag-Hub`,
    description: `${items.length} Runbooks f\u00fcr den Tag \u201e${tag}\u201c. Ops, Security und Debugging-Guides \u2013 schnell findbar.`,
    alternates: { canonical: `/tag/${encodeURIComponent(tag)}` }
  }
}

export default function TagPage({ params }: { params: { tag: string } }) {
  const tag = decodeURIComponent(params.tag)
  const items = runbooksByTag(tag)
  if (!items.length) return notFound()

  const top10 = topRunbooksByTag(tag, 10)

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Tags", item: `${BASE_URL}/tags` },
      { "@type": "ListItem", position: 3, name: tag, item: `${BASE_URL}/tag/${encodeURIComponent(tag)}` },
    ],
  }

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${tag} Runbooks`,
    description: `${items.length} Runbooks für den Tag „${tag}".`,
    numberOfItems: Math.min(items.length, 10),
    itemListElement: top10.map((r, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${BASE_URL}/runbook/${r.slug}`,
      name: r.title,
    })),
  }

  return (
    <Container>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <div className="py-16 max-w-6xl mx-auto">
        <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2">
            <li><a href="/" className="hover:text-cyan-400">ClawGuru</a></li>
            <li>/</li>
            <li><a href="/tags" className="hover:text-cyan-400">Tags</a></li>
            <li>/</li>
            <li className="text-gray-300">{tag}</li>
          </ol>
        </nav>

        <SectionTitle
          kicker="Tag Cluster"
          title={tag}
          subtitle={`${items.length} Runbooks. Klick rein, fix, re-check, repeat.`}
        />

        {top10.length > 0 && (
          <div className="mt-8">
            <h2 className="text-base font-black text-gray-300 uppercase tracking-widest mb-4">Top 10 Runbooks</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {top10.map((r, i) => (
                <a
                  key={r.slug}
                  href={`/runbook/${r.slug}`}
                  className="p-4 rounded-2xl border border-gray-800 bg-black/30 hover:bg-black/40 transition-colors flex items-start gap-3"
                >
                  <span className="text-lg font-black text-gray-600 w-6 shrink-0">{i + 1}</span>
                  <div>
                    <div className="font-bold text-gray-100">{r.title}</div>
                    <div className="mt-1 text-xs text-gray-500 flex gap-2">
                      <span>\u26a1{r.clawScore}</span>
                      <span>\u00b7</span>
                      <span className="text-cyan-400 underline">\u00d6ffnen \u2192</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        <h2 className="mt-12 text-base font-black text-gray-300 uppercase tracking-widest mb-4">Alle Runbooks</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.slice(0, 120).map((r) => (
            <a
              key={r.slug}
              href={`/runbook/${r.slug}`}
              className="p-6 rounded-3xl border border-gray-800 bg-black/25 hover:bg-black/35 transition-colors"
            >
              <div className="text-lg font-black">{r.title}</div>
              <div className="mt-2 text-sm text-gray-400">{r.summary}</div>
              <div className="mt-3 flex items-center gap-3 text-sm">
                <span className="text-cyan-300 underline">Runbook \u00f6ffnen \u2192</span>
                <span className="text-xs text-gray-600">\u26a1{r.clawScore}</span>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-10 text-sm text-gray-500">
          Hinweis: Tag-Seiten sind absichtlich \u201ehubby\u201c. Sie erh\u00f6hen Crawl-Tiefe und verteilen Link-Juice auf Longtail-Runbooks.
        </div>
      </div>
    </Container>
  )
}
