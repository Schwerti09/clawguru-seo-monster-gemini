// WORLD BEAST + VISUAL UPGRADE 2026: app/share/[slug]/page.tsx
// Premium dark share card with live OG-image preview and neon accents.

import Container from "@/components/shared/Container"
import { getRunbook } from "@/lib/pseo"
import { notFound } from "next/navigation"
import { ShareButtons } from "./ShareButtons"

export const dynamic = "force-dynamic"
export const revalidate = 0

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
        {/* VISUAL UPGRADE 2026: Header with neon accent */}
        <div className="mb-2 text-xs uppercase tracking-widest" style={{ color: "#00ff9d" }}>
          ▸ One-Click Share
        </div>
        <h1 className="text-3xl font-black font-heading mb-2">{r.title}</h1>
        <p className="text-gray-400 mb-8">{r.summary}</p>

        {/* VISUAL UPGRADE 2026: Premium dark share card with OG-image preview */}
        <div className="mb-8 rounded-2xl glass-panel overflow-hidden">
          {/* OG Image Preview */}
          <div className="relative aspect-[2/1] bg-gradient-to-br from-[#0a0a0a] to-[#001a2e] flex items-center justify-center p-8">
            <div className="text-center">
              <div className="text-xs uppercase tracking-widest text-gray-500 mb-2">OG Preview</div>
              <div className="text-xl font-black font-heading" style={{ color: "#00ff9d" }}>
                {r.title}
              </div>
              <div className="text-sm text-gray-400 mt-2 max-w-md">{r.summary}</div>
            </div>
            {/* VISUAL UPGRADE 2026: Decorative corner glows */}
            <div className="absolute top-0 left-0 w-32 h-32 rounded-full blur-3xl" style={{ background: "rgba(0, 255, 157, 0.06)" }} />
            <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full blur-3xl" style={{ background: "rgba(0, 184, 255, 0.06)" }} />
          </div>

          {/* VISUAL UPGRADE 2026: Watermark banner with neon glow */}
          <div className="p-4 flex items-center gap-3 border-t border-white/10">
            <span className="text-2xl">⚡</span>
            <div>
              <div className="font-black text-sm" style={{ color: "#00ff9d" }}>ClawGuru WorldBeast 2026</div>
              <div className="text-xs text-gray-400">
                clawguru.org · The #1 Ops Intelligence Platform
              </div>
            </div>
            <a
              href={runbookUrl}
              className="ml-auto px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300"
              style={{
                background: "rgba(0, 255, 157, 0.08)",
                border: "1px solid rgba(0, 255, 157, 0.2)",
                color: "#00ff9d",
              }}
            >
              Original →
            </a>
          </div>
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
