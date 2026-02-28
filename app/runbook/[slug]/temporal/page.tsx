// TEMPORAL MYCELIUM v3.1 – Overlord AI
// Temporal search page: /runbook/[slug]/temporal?version=2025-Q3
// Shows the runbook as it existed at a specific point in time.

import { notFound } from "next/navigation"
import Container from "@/components/shared/Container"
import { getRunbook } from "@/lib/pseo"
import { validateRunbook } from "@/lib/quality-gate"
import { getTemporalHistory, findVersionByQuarter } from "@/lib/temporal-mycelium"
import TemporalTimeline from "@/components/visual/TemporalTimeline"
import { BASE_URL } from "@/lib/config"

export const revalidate = 60 * 60 * 24

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { version?: string }
}) {
  const r = getRunbook(params.slug)
  if (!r) return {}
  const version = searchParams.version ?? "aktuell"
  return {
    title: `${r.title} – Temporal View (${version}) | ClawGuru`,
    description: `Zeitreise: ${r.title} in Version ${version}. The Mycelium remembers every lesson.`,
    alternates: { canonical: `/runbook/${r.slug}/temporal` },
  }
}

export default function TemporalPage({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { version?: string }
}) {
  const r = getRunbook(params.slug)
  if (!r) return notFound()

  const quality = validateRunbook(r)
  if (!quality.pass) return notFound()

  const history = getTemporalHistory(r)
  const requestedVersion = searchParams.version ?? null
  const pinnedVersion = requestedVersion
    ? findVersionByQuarter(history, requestedVersion)
    : history.versions[history.versions.length - 1]

  return (
    <Container>
      <div className="py-16 max-w-4xl mx-auto">
        {/* TEMPORAL MYCELIUM v3.1 – Overlord AI: Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <a href="/" className="hover:text-cyan-400">ClawGuru</a>
            </li>
            <li>/</li>
            <li>
              <a href="/runbooks" className="hover:text-cyan-400">Runbooks</a>
            </li>
            <li>/</li>
            <li>
              <a href={`/runbook/${r.slug}`} className="hover:text-cyan-400">{r.title}</a>
            </li>
            <li>/</li>
            <li className="text-gray-300">Temporal View</li>
          </ol>
        </nav>

        {/* TEMPORAL MYCELIUM v3.1 – Overlord AI: Page header */}
        <div className="mb-8 p-6 rounded-3xl border border-violet-500/20 bg-violet-500/5">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">🍄</span>
            <h1 className="text-2xl font-black text-gray-100">
              Temporal Mycelium
            </h1>
            <span className="px-2 py-1 rounded-lg border border-violet-500/40 bg-violet-500/10 text-xs font-black text-violet-300">
              v3.1
            </span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            <span className="font-bold text-gray-200">{r.title}</span> –
            Das Mycelium hat die Zeitachse dieses Runbooks rekonstruiert.{" "}
            <span className="text-violet-300">
              {history.totalEvolutions} Evolutionen seit Erstellung.
            </span>
          </p>

          {/* TEMPORAL MYCELIUM v3.1 – Overlord AI: Pinned version highlight */}
          {requestedVersion && (
            <div className="mt-4 p-4 rounded-2xl border border-cyan-500/30 bg-cyan-500/5">
              <div className="text-xs font-black text-cyan-400 uppercase tracking-widest mb-1">
                🔍 Temporal Search – Angeforderte Version
              </div>
              <div className="text-sm text-gray-200">
                <span className="font-mono text-cyan-300">{requestedVersion}</span>
                {" – "}
                {pinnedVersion.label}
              </div>
              <div className="text-xs text-gray-400 mt-1">{pinnedVersion.mutationReason}</div>
            </div>
          )}
        </div>

        {/* TEMPORAL MYCELIUM v3.1 – Overlord AI: Quick version links */}
        <div className="mb-6">
          <div className="text-xs text-gray-500 mb-2 font-black uppercase tracking-widest">
            Temporal Search – Version auswählen:
          </div>
          <div className="flex flex-wrap gap-2">
            {history.versions.map((v) => (
              <a
                key={v.quarter}
                href={`/runbook/${r.slug}/temporal?version=${v.quarter}`}
                className={`px-3 py-1.5 rounded-xl border text-xs font-mono transition-colors ${
                  pinnedVersion.quarter === v.quarter
                    ? "border-cyan-500/60 bg-cyan-500/10 text-cyan-300"
                    : "border-gray-800 bg-black/20 text-gray-400 hover:border-gray-700"
                }`}
              >
                {v.quarter}
              </a>
            ))}
            <a
              href={`/runbook/${r.slug}`}
              className="px-3 py-1.5 rounded-xl border border-gray-800 bg-black/20 text-xs text-gray-400 hover:border-gray-700 transition-colors"
            >
              ← Zurück zum Runbook
            </a>
          </div>
        </div>

        {/* TEMPORAL MYCELIUM v3.1 – Overlord AI: Full interactive timeline */}
        <TemporalTimeline history={history} slug={r.slug} />

        {/* TEMPORAL MYCELIUM v3.1 – Overlord AI: Backward propagation indicator */}
        <div className="mt-10 p-5 rounded-3xl border border-violet-500/15 bg-black/20">
          <div className="text-xs font-black text-violet-400 uppercase tracking-widest mb-2">
            ⚗ Backward Propagation Engine
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            Wenn ein neuer Runbook mit einem Claw Score &gt; 97 entsteht,
            prüft das Mycelium automatisch alle historischen Runbooks desselben
            Providers und Services. Betroffene werden als{" "}
            <span className="text-violet-300 font-bold">Temporal Fork</span> markiert
            und durch Quality Gate 2.0 veredelt.{" "}
            <span className="text-gray-300">
              &bdquo;The Mycelium has rewritten history.&rdquo;
            </span>
          </p>
        </div>

        {/* TEMPORAL MYCELIUM v3.1 – Overlord AI: Schema.org breadcrumb for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "ClawGuru", item: BASE_URL },
                { "@type": "ListItem", position: 2, name: "Runbooks", item: `${BASE_URL}/runbooks` },
                { "@type": "ListItem", position: 3, name: r.title, item: `${BASE_URL}/runbook/${r.slug}` },
                { "@type": "ListItem", position: 4, name: "Temporal View", item: `${BASE_URL}/runbook/${r.slug}/temporal` },
              ],
            }),
          }}
        />
      </div>
    </Container>
  )
}
