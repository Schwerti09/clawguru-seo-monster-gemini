import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"
import { allProviders, runbooksByProvider } from "@/lib/pseo"
import { notFound } from "next/navigation"

export const revalidate = 60 * 60 * 24
export const dynamicParams = true

export async function generateStaticParams() {
  return allProviders().slice(0, 30).map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const slug = params.slug.toLowerCase()
  const p = allProviders().find((x) => x.slug === slug)
  if (!p) return {}
  const items = runbooksByProvider(slug)
  return {
    title: `${p.name} Runbooks | ClawGuru`,
    description: `Runbooks, Baselines und Fixes für ${p.name}. ${items.length} Einträge.`,
    alternates: { canonical: `/provider/${p.slug}` }
  }
}

export default function ProviderPage({ params }: { params: { slug: string } }) {
  const slug = params.slug.toLowerCase()
  const p = allProviders().find((x) => x.slug === slug)
  if (!p) return notFound()

  const items = runbooksByProvider(slug)

  return (
    <Container>
      <div className="py-16 max-w-6xl mx-auto">
        <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2">
            <li><a href="/" className="hover:text-cyan-400">ClawGuru</a></li>
            <li>/</li>
            <li><a href="/providers" className="hover:text-cyan-400">Providers</a></li>
            <li>/</li>
            <li className="text-gray-300">{p.name}</li>
          </ol>
        </nav>

        <SectionTitle
          kicker="Provider Hub"
          title={p.name}
          subtitle={`${items.length} Runbooks — high intent, schnell findbar, sofort nutzbar.`}
        />

        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.slice(0, 180).map((r) => (
            <a
              key={r.slug}
              href={`/runbook/${r.slug}`}
              className="p-6 rounded-3xl border border-gray-800 bg-black/25 hover:bg-black/35 transition-colors"
            >
              <div className="text-xs uppercase tracking-widest text-gray-500">Runbook</div>
              <div className="text-lg font-extrabold mt-2">{r.title}</div>
              <div className="text-sm text-gray-400 mt-2">{r.summary}</div>
              <div className="mt-4 flex flex-wrap gap-2">
                {r.tags.slice(0, 6).map((t) => (
                  <span key={t} className="px-2 py-1 rounded-lg border border-gray-800 bg-black/30 text-xs text-gray-300">
                    {t}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>

        <div className="mt-12 text-sm text-gray-500">
          Mehr: <a className="hover:text-cyan-400" href="/tags">Tag-Cluster</a> •{" "}
          <a className="hover:text-cyan-400" href="/runbooks">Runbook Library</a>
        </div>
      </div>
    </Container>
  )
}
