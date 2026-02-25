// WORLD BEAST: app/share/[slug]/page.tsx
// One-Click Share page – pre-formatted threads for Twitter, LinkedIn, Reddit
// with ClawGuru watermark, plus direct share links.

import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"
import { getRunbook, RUNBOOKS } from "@/lib/pseo"
import { notFound } from "next/navigation"
import { runViralContentAgent } from "@/lib/agents"

export const revalidate = 60 * 60 * 6 // regenerate every 6h
export const dynamicParams = true

export async function generateStaticParams() {
  return RUNBOOKS.slice(0, 100).map((r) => ({ slug: r.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const r = getRunbook(params.slug)
  if (!r) return {}
  return {
    title: `Share: ${r.title} | ClawGuru`,
    description: `One-click share templates for "${r.title}" – ready-to-post threads for Twitter, LinkedIn, Reddit.`,
    alternates: { canonical: `/share/${r.slug}` },
  }
}

// WORLD BEAST: ClawGuru watermark appended to every share thread
const WATERMARK = "\n\n🦅 via @ClawGuru | clawguru.org"

function ShareCard({
  platform,
  icon,
  content,
  shareHref,
  accentClass,
}: {
  platform: string
  icon: string
  content: string
  shareHref: string
  accentClass: string
}) {
  return (
    <div className={`rounded-3xl border p-6 bg-black/30 ${accentClass}`}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">{icon}</span>
        <span className="font-black text-sm uppercase tracking-widest">{platform}</span>
      </div>
      <pre className="whitespace-pre-wrap text-sm text-gray-200 leading-relaxed font-mono bg-black/20 rounded-2xl p-4 max-h-56 overflow-y-auto">
        {content}
      </pre>
      <div className="mt-4 flex gap-3">
        <a
          href={shareHref}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 rounded-2xl font-black text-sm bg-gradient-to-r from-brand-cyan to-brand-violet hover:opacity-90"
        >
          Jetzt teilen →
        </a>
        <span className="text-xs text-gray-500 self-center">Oben kopieren + einfügen</span>
      </div>
    </div>
  )
}

export default async function SharePage({ params }: { params: { slug: string } }) {
  const r = getRunbook(params.slug)
  if (!r) return notFound()

  // WORLD BEAST: run Viral Content Agent; fall back to generic templates on failure
  const viralResult = await runViralContentAgent({
    slug: r.slug,
    title: r.title,
    summary: r.summary,
    tags: r.tags,
  })

  const url = `https://clawguru.org/runbook/${r.slug}`
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(`${r.title} – ClawGuru Runbook`)

  const twitterContent =
    (viralResult.threads?.twitter ?? `🔐 ${r.title}\n\n${r.summary}\n\n→ ${url}`) + WATERMARK
  const linkedinContent =
    (viralResult.threads?.linkedin ?? `${r.title}\n\n${r.summary}\n\nRead the full runbook: ${url}`) +
    WATERMARK
  const redditContent =
    (viralResult.threads?.reddit ?? `**${r.title}**\n\n${r.summary}\n\nFull runbook: ${url}`) +
    WATERMARK

  return (
    <Container>
      <div className="py-16 max-w-4xl mx-auto">
        <nav className="text-sm text-gray-500 mb-6">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <a href="/" className="hover:text-cyan-400">ClawGuru</a>
            </li>
            <li>/</li>
            <li>
              <a href={`/runbook/${r.slug}`} className="hover:text-cyan-400">Runbook</a>
            </li>
            <li>/</li>
            <li className="text-gray-300">Share</li>
          </ol>
        </nav>

        <SectionTitle
          kicker="One-Click Share"
          title={r.title}
          subtitle="Fertige Threads für alle Plattformen – Copy, Paste, Post. Done."
        />

        <div className="mt-8 p-4 rounded-2xl border border-gray-800 bg-black/20 flex flex-wrap items-center gap-3">
          <span className="text-xs text-gray-400 font-mono">{url}</span>
          <a
            href={`/runbook/${r.slug}`}
            className="ml-auto text-xs text-cyan-400 underline hover:text-cyan-300"
          >
            Zum Runbook →
          </a>
        </div>

        <div className="mt-8 grid gap-6">
          <ShareCard
            platform="Twitter / X"
            icon="𝕏"
            content={twitterContent}
            shareHref={`https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterContent)}&url=${encodedUrl}`}
            accentClass="border-sky-500/20"
          />
          <ShareCard
            platform="LinkedIn"
            icon="💼"
            content={linkedinContent}
            shareHref={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}&summary=${encodeURIComponent(r.summary)}`}
            accentClass="border-blue-500/20"
          />
          <ShareCard
            platform="Reddit"
            icon="🔴"
            content={redditContent}
            shareHref={`https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`}
            accentClass="border-orange-500/20"
          />
        </div>

        {/* WORLD BEAST: Image prompt for AI-generated cover image */}
        {viralResult.threads?.imagePrompt && (
          <div className="mt-8 p-6 rounded-3xl border border-violet-500/20 bg-black/20">
            <div className="text-xs uppercase tracking-widest text-violet-400 mb-3">
              🎨 KI-Bild Prompt (DALL-E / Midjourney / Imagen)
            </div>
            <p className="text-sm text-gray-300 font-mono leading-relaxed">
              {viralResult.threads.imagePrompt}
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={`/runbook/${r.slug}`}
            className="px-6 py-3 rounded-2xl font-black bg-gradient-to-r from-orange-500 to-red-600 hover:opacity-90"
          >
            Runbook lesen →
          </a>
          <a
            href="/runbooks"
            className="px-6 py-3 rounded-2xl border border-gray-700 hover:border-gray-500 font-bold text-gray-200"
          >
            Alle Runbooks
          </a>
        </div>
      </div>
    </Container>
  )
}
