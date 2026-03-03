import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"
import { getAffiliateProfile, humanizeSlug } from "@/lib/affiliate-store"
import { RUNBOOKS } from "@/lib/pseo"
import { buildLinkEngine } from "@/lib/seo/link-engine"

export const revalidate = 60
export const dynamicParams = true

const LINK_ENGINE = buildLinkEngine(RUNBOOKS, {
  maxLinks: 10,
  urlForPage: (page) => `/runbook/${page.slug}`,
  authorityForPage: (page) => page.clawScore,
})

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const profile = getAffiliateProfile(params.slug)
  const name = profile?.name ?? humanizeSlug(params.slug)
  const keyword = profile?.keyword ?? `${name} Security Recommendations`
  return {
    title: `${keyword} | ClawGuru Partner`,
    description: `Offizielle ClawGuru Empfehlungen für ${name}. Fokus: ${keyword}.`,
    alternates: { canonical: `/affiliate/${params.slug}` },
  }
}

export default async function AffiliateBridgePage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const profile = getAffiliateProfile(params.slug)
  const name = profile?.name ?? humanizeSlug(params.slug)
  const keyword = profile?.keyword ?? `${name} Security Recommendations`
  const description = profile?.description ?? `Kuratiertes ClawGuru Runbook-Setup für ${name}.`

  const recommendations = LINK_ENGINE.linksForPage({
    slug: params.slug,
    title: keyword,
    summary: description,
    tags: [name.toLowerCase()],
  })

  return (
    <Container>
      <div className="py-16 max-w-4xl mx-auto">
        <SectionTitle kicker="Partner Bridge" title={keyword} subtitle={description} />
        <div className="mt-6 rounded-3xl border border-cyan-500/20 bg-cyan-500/5 p-6 text-sm text-gray-300">
          <p>
            ClawGuru empfiehlt für <span className="font-bold text-cyan-200">{name}</span> die folgenden Security Runbooks,
            damit Partner-Systeme in weniger als 30 Minuten gehärtet sind.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {recommendations.map((link) => (
            <a
              key={link.slug}
              href={link.url}
              className="rounded-3xl border border-gray-800 bg-black/25 p-5 text-sm text-gray-200 hover:border-cyan-500/40 hover:bg-black/40 transition-colors"
            >
              <div className="font-black text-base text-white">{link.title}</div>
              <div className="mt-2 text-xs text-gray-400">Relevanz-Score: {(link.score * 100).toFixed(1)}</div>
              <div className="mt-3 text-cyan-300 text-xs">Runbook öffnen →</div>
            </a>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href="/runbooks"
            className="px-6 py-3 rounded-2xl bg-cyan-500 text-black font-black"
          >
            Alle Runbooks entdecken →
          </a>
          <a
            href="/pricing"
            className="px-6 py-3 rounded-2xl border border-gray-700 text-gray-200 font-bold"
          >
            Partnerzugang aktivieren →
          </a>
        </div>
      </div>
    </Container>
  )
}
