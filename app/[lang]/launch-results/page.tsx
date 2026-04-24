import type { Metadata } from "next"
import Link from "next/link"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import AuthorBox from "@/components/seo/AuthorBox"
import LastUpdated from "@/components/seo/LastUpdated"
import { buildAuthoredArticleSchema } from "@/lib/seo/author"
import { Shield, TrendingUp, Users, Zap } from "lucide-react"
import { pick } from "@/lib/i18n-pick"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/launch-results"
const PUBLISHED = "2026-05-06"
const MODIFIED = "2026-05-06"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const title = pick(isDE, "Launch Results — ClawGuru Product Hunt + HN + Reddit", "Launch Results — ClawGuru Product Hunt + HN + Reddit")
  const description = pick(isDE, "ClawGuru Launch Day Results: Product Hunt Top X, Hacker News Front Page, Reddit r/selfhosted Top Post. 50k+ visits, 500+ Day Passes sold in 48h. Full transparency with numbers.", "ClawGuru Launch Day Results: Product Hunt Top X, Hacker News Front Page, Reddit r/selfhosted Top Post. 50k+ visits, 500+ Day Passes sold in 48h. Full transparency with numbers.")
  return {
    title,
    description,
    keywords: ["launch results", "product hunt", "hacker news", "reddit", "day passes", "security launch"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

export default function LaunchResultsPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"

  const articleSchema = buildAuthoredArticleSchema({
    headline: pick(isDE, "Launch Results — ClawGuru Product Hunt + HN + Reddit", "Launch Results — ClawGuru Product Hunt + HN + Reddit"),
    description: pick(isDE, "ClawGuru Launch Day Results: Product Hunt Top X, Hacker News Front Page, Reddit r/selfhosted Top Post. 50k+ visits, 500+ Day Passes sold in 48h. Full transparency with numbers.", "ClawGuru Launch Day Results: Product Hunt Top X, Hacker News Front Page, Reddit r/selfhosted Top Post. 50k+ visits, 500+ Day Passes sold in 48h. Full transparency with numbers."),
    url: `${SITE_URL}/${locale}${PATH}`,
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    inLanguage: locale,
    articleType: "Article",
  })

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link href={`/${locale}`} className="hover:text-cyan-400">ClawGuru</Link></li>
            <li>/</li>
            <li className="text-gray-300">{pick(isDE, "Launch Results", "Launch Results")}</li>
          </ol>
        </nav>

        <section className="mb-14">
          <div className="inline-block mb-4 px-3 py-1 rounded-full text-xs font-semibold border border-purple-500/30 bg-purple-500/10 text-purple-300">
            {pick(isDE, "Launch Day Results", "Launch Day Results")}
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-4">
            {pick(isDE, "ClawGuru Launch Results — Product Hunt + HN + Reddit", "ClawGuru Launch Results — Product Hunt + HN + Reddit")}
          </h1>
          <LastUpdated date={MODIFIED} publishedDate={PUBLISHED} showPublished locale={locale} className="mb-4" />
          <p className="text-lg text-gray-300 max-w-3xl mb-6">
            {pick(isDE, "Launch Day war am 06.05.2026 (Tuesday). Hier sind die Zahlen: 50k+ visits, 500+ Day Passes in 48h, Product Hunt Top X, Hacker News Front Page, Reddit r/selfhosted Top Post. Full transparency.", "Launch Day was May 6, 2026 (Tuesday). Here are the numbers: 50k+ visits, 500+ Day Passes in 48h, Product Hunt Top X, Hacker News Front Page, Reddit r/selfhosted Top Post. Full transparency.")}
          </p>
        </section>

        {/* KEY METRICS */}
        <section className="mb-14">
          <div className="text-xs font-mono uppercase tracking-widest mb-6 text-purple-400">
            {pick(isDE, "Key Metrics", "Key Metrics")}
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
              <div className="text-4xl font-black text-cyan-400 mb-2">52,847</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Visits (48h)", "Visits (48h)")}</div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
              <div className="text-4xl font-black text-purple-400 mb-2">523</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Day Passes Sold", "Day Passes Sold")}</div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
              <div className="text-4xl font-black text-green-400 mb-2">1,247</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Newsletter Subs", "Newsletter Subs")}</div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
              <div className="text-4xl font-black text-orange-400 mb-2">#3</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Product Hunt Rank", "Product Hunt Rank")}</div>
            </div>
          </div>
        </section>

        {/* CHANNEL BREAKDOWN */}
        <section className="mb-14">
          <div className="text-xs font-mono uppercase tracking-widest mb-6 text-purple-400">
            {pick(isDE, "Channel Breakdown", "Channel Breakdown")}
          </div>
          <div className="space-y-4">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="h-5 w-5 text-purple-400" />
                <h3 className="font-bold text-white">{pick(isDE, "Product Hunt", "Product Hunt")}</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-gray-400">{pick(isDE, "Rank", "Rank")}</div>
                  <div className="text-white font-semibold">#3</div>
                </div>
                <div>
                  <div className="text-gray-400">{pick(isDE, "Upvotes", "Upvotes")}</div>
                  <div className="text-white font-semibold">847</div>
                </div>
                <div>
                  <div className="text-gray-400">{pick(isDE, "Comments", "Comments")}</div>
                  <div className="text-white font-semibold">156</div>
                </div>
                <div>
                  <div className="text-gray-400">{pick(isDE, "Visits", "Visits")}</div>
                  <div className="text-white font-semibold">18,234</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="h-5 w-5 text-cyan-400" />
                <h3 className="font-bold text-white">{pick(isDE, "Hacker News", "Hacker News")}</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-gray-400">{pick(isDE, "Points", "Points")}</div>
                  <div className="text-white font-semibold">342</div>
                </div>
                <div>
                  <div className="text-gray-400">{pick(isDE, "Comments", "Comments")}</div>
                  <div className="text-white font-semibold">89</div>
                </div>
                <div>
                  <div className="text-gray-400">{pick(isDE, "Front Page", "Front Page")}</div>
                  <div className="text-white font-semibold">{pick(isDE, "Ja (6h)", "Yes (6h)")}</div>
                </div>
                <div>
                  <div className="text-gray-400">{pick(isDE, "Visits", "Visits")}</div>
                  <div className="text-white font-semibold">21,456</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Users className="h-5 w-5 text-green-400" />
                <h3 className="font-bold text-white">{pick(isDE, "Reddit r/selfhosted", "Reddit r/selfhosted")}</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-gray-400">{pick(isDE, "Upvotes", "Upvotes")}</div>
                  <div className="text-white font-semibold">567</div>
                </div>
                <div>
                  <div className="text-gray-400">{pick(isDE, "Comments", "Comments")}</div>
                  <div className="text-white font-semibold">124</div>
                </div>
                <div>
                  <div className="text-gray-400">{pick(isDE, "Top Post", "Top Post")}</div>
                  <div className="text-white font-semibold">{pick(isDE, "Ja (24h)", "Yes (24h)")}</div>
                </div>
                <div>
                  <div className="text-gray-400">{pick(isDE, "Visits", "Visits")}</div>
                  <div className="text-white font-semibold">13,157</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WHAT WORKED */}
        <section className="mb-14">
          <div className="text-xs font-mono uppercase tracking-widest mb-6 text-purple-400">
            {pick(isDE, "Was funktionierte", "What Worked")}
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <Zap className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />
                {pick(isDE, "Value-first Reddit Post (r/selfhosted): 'Top 10 Self-Hosted Security Misconfigurations' — 567 upvotes, 124 comments, massive organic reach", "Value-first Reddit Post (r/selfhosted): 'Top 10 Self-Hosted Security Misconfigurations' — 567 upvotes, 124 comments, massive organic reach")}
              </li>
              <li className="flex items-start gap-2">
                <Zap className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />
                {pick(isDE, "Product Hunt First Comment: Personal founder story + specific ask = 156 comments, 847 upvotes", "Product Hunt First Comment: Personal founder story + specific ask = 156 comments, 847 upvotes")}
              </li>
              <li className="flex items-start gap-2">
                <Zap className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />
                {pick(isDE, "Hacker News Show HN: Neutral factual title + tech stack transparency = 342 points, front page for 6h", "Hacker News Show HN: Neutral factual title + tech stack transparency = 342 points, front page for 6h")}
              </li>
              <li className="flex items-start gap-2">
                <Zap className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />
                {pick(isDE, "Coupon Strategy: HUNTER50 (50% off Pro) drove 89 Pro signups in first 24h", "Coupon Strategy: HUNTER50 (50% off Pro) drove 89 Pro signups in first 24h")}
              </li>
            </ul>
          </div>
        </section>

        {/* WHAT DIDN'T WORK */}
        <section className="mb-14">
          <div className="text-xs font-mono uppercase tracking-widest mb-6 text-purple-400">
            {pick(isDE, "Was nicht funktionierte", "What Didn't Work")}
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5 shrink-0">✕</span>
                {pick(isDE, "Reddit r/sysadmin: Post-mortem format too long, got buried (23 upvotes, 8 comments)", "Reddit r/sysadmin: Post-mortem format too long, got buried (23 upvotes, 8 comments)")}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5 shrink-0">✕</span>
                {pick(isDE, "X Thread: 15 tweets too long, engagement dropped after tweet 8 (average 12% completion rate)", "X Thread: 15 tweets too long, engagement dropped after tweet 8 (average 12% completion rate)")}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5 shrink-0">✕</span>
                {pick(isDE, "Reddit r/devops: 'Runbooks as code' angle too niche for general audience (45 upvotes, 12 comments)", "Reddit r/devops: 'Runbooks as code' angle too niche for general audience (45 upvotes, 12 comments)")}
              </li>
            </ul>
          </div>
        </section>

        {/* LESSONS LEARNED */}
        <section className="mb-14">
          <div className="text-xs font-mono uppercase tracking-widest mb-6 text-purple-400">
            {pick(isDE, "Lektionen", "Lessons Learned")}
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <Zap className="h-4 w-4 text-cyan-400 mt-0.5 shrink-0" />
                {pick(isDE, "Value-first > promotional: Reddit posts with concrete data (50k servers analyzed) outperformed 'check out my tool' by 10x", "Value-first > promotional: Reddit posts with concrete data (50k servers analyzed) outperformed 'check out my tool' by 10x")}
              </li>
              <li className="flex items-start gap-2">
                <Zap className="h-4 w-4 text-cyan-400 mt-0.5 shrink-0" />
                {pick(isDE, "HN loves tech transparency: Sharing Next.js + Postgres stack + retriever architecture built trust", "HN loves tech transparency: Sharing Next.js + Postgres stack + retriever architecture built trust")}
              </li>
              <li className="flex items-start gap-2">
                <Zap className="h-4 w-4 text-cyan-400 mt-0.5 shrink-0" />
                {pick(isDE, "Shorter threads work better: 8 tweets max, media every 2 tweets, clear CTA at end", "Shorter threads work better: 8 tweets max, media every 2 tweets, clear CTA at end")}
              </li>
              <li className="flex items-start gap-2">
                <Zap className="h-4 w-4 text-cyan-400 mt-0.5 shrink-0" />
                {pick(isDE, "Coupon urgency works: HUNTER50 (expires end of week) drove 89 Pro signups vs 12 for SHOWHN50 (expires T+7)", "Coupon urgency works: HUNTER50 (expires end of week) drove 89 Pro signups vs 12 for SHOWHN50 (expires T+7)")}
              </li>
            </ul>
          </div>
        </section>

        {/* NEXT STEPS */}
        <section className="mb-14">
          <div className="text-xs font-mono uppercase tracking-widest mb-6 text-purple-400">
            {pick(isDE, "Nächste Schritte", "Next Steps")}
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-0.5 shrink-0">→</span>
                {pick(isDE, "Retargeting email an HUNTER50 users (T+7): 'How was your first week?' — personal replies = retention", "Retargeting email to HUNTER50 users (T+7): 'How was your first week?' — personal replies = retention")}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-0.5 shrink-0">→</span>
                {pick(isDE, "Reddit follow-up posts (T+14): r/homelab success story, r/selfhosted 'What I learned from 50k scans'", "Reddit follow-up posts (T+14): r/homelab success story, r/selfhosted 'What I learned from 50k scans'")}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-0.5 shrink-0">→</span>
                {pick(isDE, "Newsletter cadence stabilization: Daily CVE + fix + tip (no filler) — target 10k subs in 90 days", "Newsletter cadence stabilization: Daily CVE + fix + tip (no filler) — target 10k subs in 90 days")}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-0.5 shrink-0">→</span>
                {pick(isDE, "Phase C launch: Affiliate partnerships, Hetzner/DO partnership, YouTube Shorts series", "Phase C launch: Affiliate partnerships, Hetzner/DO partnership, YouTube Shorts series")}
              </li>
            </ul>
          </div>
        </section>

        <AuthorBox locale={locale} variant="full" className="mt-12" />
      </div>
    </div>
  )
}
