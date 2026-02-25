// WORLD BEAST: app/share/[slug]/page.tsx
// One-click share page – pre-built social threads + ClawGuru watermark.
// GET /share/[slug] → shows Twitter, LinkedIn, Reddit threads ready to copy.

import Container from "@/components/shared/Container"
import { getRunbook } from "@/lib/pseo"
import { notFound } from "next/navigation"
import { ShareButtons } from "./ShareButtons"

export const revalidate = 60 * 60 * 24

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const r = getRunbook(params.slug)
  if (!r) return {}
  return {
    title: `Share: ${r.title} | ClawGuru`,
    description: `Share this ClawGuru runbook: ${r.summary}`,
    openGraph: {
      title: `ClawGuru Runbook: ${r.title}`,
      description: r.summary,
    },
  }
}

export default function SharePage({ params }: { params: { slug: string } }) {
  const r = getRunbook(params.slug)
  if (!r) notFound()

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
  const runbookUrl = `${siteUrl}/runbook/${r.slug}`

  // WORLD BEAST: pre-built shareable threads
  const twitterThread = [
    `🔒 Fix: ${r.title}`,
    ``,
    r.summary,
    ``,
    `📖 Full runbook → ${runbookUrl}`,
    ``,
    `#DevOps #Security #Ops #ClawGuru`,
  ].join("\n")

  const linkedinPost = [
    `🚨 Ops Engineers: ${r.title}`,
    ``,
    r.summary,
    ``,
    `We just published a step-by-step runbook covering:`,
    ...r.howto.steps.slice(0, 3).map((s, i) => `${i + 1}. ${s}`),
    ``,
    `Full guide → ${runbookUrl}`,
    ``,
    `#DevOps #CloudSecurity #SRE #Ops #ClawGuru`,
  ].join("\n")

  const redditPost = [
    `**${r.title}**`,
    ``,
    r.summary,
    ``,
    `**Steps:**`,
    ...r.howto.steps.slice(0, 4).map((s, i) => `${i + 1}. ${s}`),
    ``,
    `Full runbook: ${runbookUrl}`,
    ``,
    `*(via ClawGuru – clawguru.org)*`,
  ].join("\n")

  return (
    <Container>
      <div className="py-16 max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-2 text-xs text-gray-500 uppercase tracking-widest">
          One-Click Share
        </div>
        <h1 className="text-3xl font-black mb-2">{r.title}</h1>
        <p className="text-gray-400 mb-8">{r.summary}</p>

        {/* ClawGuru Watermark Banner */}
        <div className="mb-8 p-4 rounded-2xl border border-brand-cyan/30 bg-brand-cyan/5 flex items-center gap-3">
          <span className="text-2xl">⚡</span>
          <div>
            <div className="font-black text-brand-cyan text-sm">ClawGuru WorldBeast 2026</div>
            <div className="text-xs text-gray-400">
              clawguru.org · The #1 Ops Intelligence Platform
            </div>
          </div>
          <a
            href={runbookUrl}
            className="ml-auto px-4 py-2 rounded-xl bg-brand-cyan/15 border border-brand-cyan/30 hover:bg-brand-cyan/25 text-sm font-bold text-brand-cyan"
          >
            Original →
          </a>
        </div>

        {/* Share Buttons (client component for clipboard) */}
        <ShareButtons
          twitterThread={twitterThread}
          linkedinPost={linkedinPost}
          redditPost={redditPost}
          runbookUrl={runbookUrl}
          slug={r.slug}
          title={r.title}
        />
      </div>
    </Container>
  )
}
