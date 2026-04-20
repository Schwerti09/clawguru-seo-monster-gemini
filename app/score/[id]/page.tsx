import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getPublicScore } from "@/lib/public-score-store"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const revalidate = 0

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"

interface PageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const score = await getPublicScore(params.id)
  const url = `${SITE_URL}/score/${params.id}`
  if (!score) {
    return {
      title: "Security Score | ClawGuru",
      description: "Public security score from ClawGuru.",
      alternates: { canonical: url },
      robots: "noindex, follow",
    }
  }
  const title = `Security Score ${score.score}/100 — ${score.target} | ClawGuru`
  const description = `Public security check for ${score.target}. Score: ${score.score}/100. ${score.vulnerable ? "Vulnerabilities detected." : "No critical issues."}`
  const og = `${SITE_URL}/og-image.png`
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url,
      images: [{ url: og, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title, description, images: [og] },
    alternates: { canonical: url },
    robots: "index, follow",
  }
}

function scoreColor(score: number) {
  if (score >= 80) return "#10b981"
  if (score >= 60) return "#f59e0b"
  return "#ef4444"
}

export default async function PublicScorePage({ params }: PageProps) {
  const score = await getPublicScore(params.id)
  if (!score) notFound()

  const color = scoreColor(score.score)
  const verdict =
    score.score >= 80
      ? "Strong"
      : score.score >= 60
      ? "Needs work"
      : "Critical"

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-gray-100">
      <section className="max-w-3xl mx-auto px-4 pt-16 pb-8">
        <div className="text-center">
          <div className="inline-block px-3 py-1 rounded-full border border-cyan-500/40 bg-cyan-500/10 text-xs font-mono text-cyan-300 mb-6">
            PUBLIC SECURITY SCORE
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-2 break-all">{score.target}</h1>
          <p className="text-gray-400 text-sm">
            Checked {new Date(score.created_at).toLocaleDateString()} · {score.view_count.toLocaleString()} views
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-8">
        <div className="p-8 rounded-3xl border border-gray-800 bg-black/40 text-center">
          <div
            className="w-48 h-48 mx-auto rounded-full grid place-items-center mb-4"
            style={{ background: `conic-gradient(${color} ${score.score}%, rgba(255,255,255,0.05) ${score.score}%)` }}
          >
            <div className="w-40 h-40 rounded-full bg-[#0a0a0a] grid place-items-center">
              <div>
                <div className="text-6xl font-black" style={{ color }}>{score.score}</div>
                <div className="text-xs text-gray-500 font-mono">/ 100</div>
              </div>
            </div>
          </div>
          <div className="text-2xl font-black" style={{ color }}>{verdict}</div>
          {score.vulnerable && (
            <div className="mt-2 inline-block px-3 py-1 rounded-full bg-red-500/10 border border-red-500/40 text-xs text-red-300 font-mono">
              VULNERABILITIES DETECTED
            </div>
          )}
        </div>
      </section>

      {Array.isArray(score.top_risks) && score.top_risks.length > 0 && (
        <section className="max-w-3xl mx-auto px-4 py-8">
          <h2 className="text-xl font-black mb-4">Top Risks</h2>
          <div className="space-y-2">
            {score.top_risks.slice(0, 5).map((r: any, i: number) => (
              <div key={i} className="p-4 rounded-xl border border-gray-800 bg-black/20 text-sm text-gray-200">
                {typeof r === "string" ? r : r?.title || r?.name || JSON.stringify(r)}
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="max-w-3xl mx-auto px-4 py-8">
        <div className="p-6 rounded-2xl border border-gray-800 bg-black/30">
          <div className="text-xs text-gray-400 mb-2">Embed this badge in your README</div>
          <div className="flex items-center gap-3 mb-3">
            <img
              src={`${SITE_URL}/badge/${params.id}`}
              alt="ClawGuru Security Score"
              width={160}
              height={40}
            />
          </div>
          <code className="block text-xs text-gray-400 font-mono bg-black/50 p-3 rounded-lg overflow-x-auto">
            {`[![Security Score](${SITE_URL}/badge/${params.id})](${SITE_URL}/score/${params.id})`}
          </code>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl md:text-3xl font-black mb-4">Check your own stack</h2>
        <p className="text-gray-400 mb-6">Free security scan in 60 seconds. No signup required.</p>
        <Link
          href="/check"
          className="inline-block px-8 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black transition-colors"
        >
          Run Security Check →
        </Link>
      </section>
    </main>
  )
}
