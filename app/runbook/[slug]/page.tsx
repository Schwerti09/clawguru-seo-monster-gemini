// File: app/runbook/[slug]/page.tsx
import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"
import { RUNBOOKS, getRunbook, type Runbook, type RunbookBlock, type RunbookFaqEntry } from "@/lib/pseo"
import { validateRunbook, type ClawCertifiedTier } from "@/lib/quality-gate"
import { getTemporalHistory } from "@/lib/temporal-mycelium"
import TemporalTimeline from "@/components/visual/TemporalTimeline"
import { notFound } from "next/navigation"
import { CopyLinkButton } from "./CopyLinkButton"
import { ActivateSwarmButton } from "@/components/shared/ActivateSwarmButton"
import { BASE_URL } from "@/lib/config"

// Pre-build slug→runbook Map for O(1) related lookups on static RUNBOOKS
const RUNBOOK_MAP = new Map(RUNBOOKS.map((r) => [r.slug, r]))

export const revalidate = 60 * 60 * 24 // 24h ISR; use revalidateSeconds() from quality-gate for finer-grained tooling
export const dynamicParams = true

export async function generateStaticParams() {
  // Pre-render top 200 static RUNBOOKS + key 100k slugs for fast initial crawl
  const staticParams = RUNBOOKS.slice(0, 200).map((r) => ({ slug: r.slug }))
  const key100kSlugs = [
    "aws-ssh-hardening-2026",
    "aws-nginx-csp-2026",
    "aws-kubernetes-zero-trust-2026",
    "cloudflare-nginx-waf-2026",
    "hetzner-ssh-hardening-2026",
    "gcp-kubernetes-rbac-misconfig-2026",
    "azure-docker-hardening-2026",
    "digitalocean-nginx-rate-limiting-2026",
    "kubernetes-docker-supply-chain-attack-2026",
    "aws-github-actions-secrets-management-2026",
    "cloudflare-nginx-hsts-2026",
    "aws-kubernetes-sbom-2026",
    "hetzner-nginx-firewall-rules-2026",
    "gcp-docker-image-signing-2026",
    "azure-kubernetes-mfa-enforcement-2026",
  ]
  return [...staticParams, ...key100kSlugs.map((slug) => ({ slug }))]
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const r = getRunbook(params.slug)
  if (!r) return {}
  const title = r.title.length > 60 ? r.title.slice(0, 57) + "..." : r.title
  const description = r.summary.length > 160 ? r.summary.slice(0, 157) + "..." : r.summary
  return {
    title: `${title} | ClawGuru Runbook`,
    description,
    alternates: { canonical: `/runbook/${r.slug}` },
    openGraph: {
      title: `${title} | ClawGuru`,
      description,
      type: "article",
    },
  }
}

function howToJsonLd(r: { title: string; summary: string; slug: string; steps: string[] }) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: r.title,
    description: r.summary,
    url: `${BASE_URL}/runbook/${r.slug}`,
    step: r.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s,
      text: s,
    })),
  }
}

function breadcrumbJsonLd(title: string, slug: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Runbooks", item: `${BASE_URL}/runbooks` },
      { "@type": "ListItem", position: 3, name: title, item: `${BASE_URL}/runbook/${slug}` },
    ],
  }
}

function techArticleJsonLd(r: { title: string; summary: string; slug: string; lastmod: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: r.title,
    description: r.summary,
    url: `${BASE_URL}/runbook/${r.slug}`,
    dateModified: r.lastmod,
    author: { "@type": "Organization", name: "ClawGuru", url: BASE_URL },
    publisher: { "@type": "Organization", name: "ClawGuru", url: BASE_URL, logo: { "@type": "ImageObject", url: `${BASE_URL}/og-image.png` } },
  }
}

function faqJsonLd(faq: RunbookFaqEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  }
}

function ClawScoreBadge({ score }: { score: number }) {
  const color =
    score >= 90 ? "text-emerald-400 border-emerald-500/40 bg-emerald-500/10" :
    score >= 75 ? "text-cyan-400 border-cyan-500/40 bg-cyan-500/10" :
    "text-yellow-400 border-yellow-500/40 bg-yellow-500/10"
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-black ${color}`}>
      <span>⚡ Claw Score</span>
      <span className="text-base">{score}</span>
      <span className="opacity-60">/100</span>
    </div>
  )
}

/** GENESIS QUALITY GATE 2.0 – Claw Certified badge with Gold/Silver tier colors */
function ClawCertifiedBadge({ score, tier }: { score: number; tier: ClawCertifiedTier }) {
  if (tier === "hidden") return null
  const isGold = tier === "gold"
  const colorStyle = isGold
    ? { color: "#FFD700", borderColor: "rgba(255,215,0,0.4)", backgroundColor: "rgba(255,215,0,0.08)" }
    : { color: "#C0C0C0", borderColor: "rgba(192,192,192,0.4)", backgroundColor: "rgba(192,192,192,0.08)" }
  const label = isGold ? "🏅 Claw Certified Gold" : "🥈 Claw Certified Silver"
  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-black"
      style={colorStyle}
    >
      <span>{label}</span>
      <span className="text-base">{score}</span>
      <span style={{ opacity: 0.6 }}>/100</span>
    </div>
  )
}

function ShareButtons({ title, slug }: { title: string; slug: string }) {
  const url = `https://clawguru.org/runbook/${slug}`
  const encoded = encodeURIComponent(url)
  const text = encodeURIComponent(`${title} – ClawGuru Runbook`)
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <span className="text-xs text-gray-500 self-center">Teilen:</span>
      <a
        href={`https://twitter.com/intent/tweet?url=${encoded}&text=${text}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-1.5 rounded-xl border border-gray-700 bg-black/30 text-xs text-gray-300 hover:border-sky-500 hover:text-sky-400 transition-colors"
        aria-label="Auf Twitter teilen"
      >
        𝕏 Twitter
      </a>
      <a
        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encoded}&title=${text}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-1.5 rounded-xl border border-gray-700 bg-black/30 text-xs text-gray-300 hover:border-blue-500 hover:text-blue-400 transition-colors"
        aria-label="Auf LinkedIn teilen"
      >
        💼 LinkedIn
      </a>
      <CopyLinkButton url={url} />
    </div>
  )
}

function BlockView({ b }: { b: RunbookBlock }) {
  if (b.kind === "h2") return <h2 className="mt-10 text-lg font-black text-gray-100">{b.text}</h2>
  if (b.kind === "h3") return <h3 className="mt-6 text-base font-bold text-gray-200">{b.text}</h3>
  if (b.kind === "h4") return <h4 className="mt-4 text-sm font-semibold text-gray-300 uppercase tracking-wide">{b.text}</h4>

  if (b.kind === "p") return <p className="mt-3 text-gray-200/90 leading-relaxed">{b.text}</p>

  if (b.kind === "ul")
    return (
      <ul className="mt-3 list-disc pl-6 space-y-2 text-gray-200/90">
        {b.items.map((it, i) => (
          <li key={i} className="leading-relaxed">
            {it}
          </li>
        ))}
      </ul>
    )

  if (b.kind === "code")
    return (
      <pre className="mt-4 rounded-2xl border border-gray-800 bg-black/40 p-4 overflow-x-auto text-sm">
        <code>{b.code}</code>
      </pre>
    )

  if (b.kind === "callout")
    return (
      <div
        className={`mt-5 rounded-3xl border p-5 ${
          b.tone === "warn" ? "border-red-500/30 bg-red-500/10" : "border-emerald-500/30 bg-emerald-500/10"
        }`}
      >
        <div className="text-sm font-black tracking-wide text-gray-100">{b.title}</div>
        <div className="mt-2 text-gray-200/90 leading-relaxed">{b.text}</div>
      </div>
    )

  return null
}

function FaqSection({ faq }: { faq: RunbookFaqEntry[] }) {
  if (!faq?.length) return null
  return (
    <div className="mt-12">
      <h2 className="text-xl font-black mb-6 text-gray-100">Häufige Fragen (FAQ)</h2>
      <div className="space-y-4">
        {faq.map((entry, i) => (
          <details key={i} className="rounded-2xl border border-gray-800 bg-black/20 group">
            <summary className="px-5 py-4 cursor-pointer font-bold text-gray-200 list-none flex items-center justify-between">
              <span>{entry.q}</span>
              <span className="text-gray-500 group-open:rotate-180 transition-transform text-xs">▼</span>
            </summary>
            <div className="px-5 pb-4 text-gray-400 leading-relaxed text-sm">{entry.a}</div>
          </details>
        ))}
      </div>
    </div>
  )
}

export default function RunbookPage({ params }: { params: { slug: string } }) {
  const r = getRunbook(params.slug)
  if (!r) return notFound()

  // Quality Gate: reject thin content before serving (ClawGuru 2026 Standard)
  const quality = validateRunbook(r)
  if (!quality.pass) return notFound()

  // TEMPORAL MYCELIUM v3.1 – Overlord AI: compute deterministic evolution history
  const temporalHistory = getTemporalHistory(r)

  // Use precomputed relatedSlugs with O(1) Map lookup + 100k on-demand fallback
  const relatedList = r.relatedSlugs.length > 0
    ? r.relatedSlugs.map((s) => RUNBOOK_MAP.get(s) ?? getRunbook(s)).filter(Boolean) as Runbook[]
    : RUNBOOKS.filter((x) => x.slug !== r.slug && x.tags.some((t) => r.tags.includes(t))).slice(0, 8)

  return (
    <Container>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(howToJsonLd({ title: r.title, summary: r.summary, slug: r.slug, steps: r.howto.steps })),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(r.title, r.slug)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(techArticleJsonLd({ title: r.title, summary: r.summary, slug: r.slug, lastmod: r.lastmod })) }}
      />
      {r.faq?.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(r.faq)) }}
        />
      )}
      <div className="py-16 max-w-4xl mx-auto">
        <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <a href="/" className="hover:text-cyan-400">
                ClawGuru
              </a>
            </li>
            <li>/</li>
            <li>
              <a href="/runbooks" className="hover:text-cyan-400">
                Runbooks
              </a>
            </li>
            <li>/</li>
            <li className="text-gray-300">{r.title}</li>
          </ol>
        </nav>

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <ClawScoreBadge score={r.clawScore} />
          <span className="text-xs text-gray-600">Stand: {r.lastmod}</span>
          <span className="text-xs text-gray-600">·</span>
          <span className="text-xs text-gray-500">Author: ClawGuru Institutional Ops</span>
          <ClawCertifiedBadge score={quality.score} tier={quality.clawCertifiedTier} />
        </div>

        <p className="text-xs font-mono text-cyan-500/80 mb-1 tracking-wide">
          Claw Security Score: {r.clawScore}/100 – {r.title}
        </p>

        <SectionTitle kicker="Runbook" title={r.title} subtitle={r.summary} />

        <ShareButtons title={r.title} slug={r.slug} />

        <div className="mt-10 p-6 rounded-3xl border border-gray-800 bg-black/25">
          {/* Rich blocks (Tier-2 content) */}
          {Array.isArray(r.blocks) && r.blocks.length > 0 ? (
            <div className="mb-10">
              {r.blocks.map((b: RunbookBlock, i: number) => (
                <BlockView key={i} b={b} />
              ))}
            </div>
          ) : null}

          <div className="text-xs uppercase tracking-widest text-gray-500">Schritt-für-Schritt</div>
          <ol className="mt-4 list-decimal pl-6 space-y-3 text-gray-200">
            {r.howto.steps.map((s, i) => (
              <li key={i} className="leading-relaxed">
                {s}
              </li>
            ))}
          </ol>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="/check"
              className="px-6 py-3 rounded-2xl font-black bg-gradient-to-r from-orange-500 to-red-600 hover:opacity-90"
            >
              Re-Check starten →
            </a>
            <a
              href="/copilot"
              className="px-6 py-3 rounded-2xl border border-gray-700 hover:border-gray-500 font-bold text-gray-200"
            >
              Copilot Runbook Builder →
            </a>
            {/* SWARM DEPLOYMENT v3.2 – Overlord AI: One-click swarm activation for Pro users */}
            <ActivateSwarmButton slug={r.slug} />
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {r.tags.map((t) => (
              <a
                key={t}
                href={`/tag/${encodeURIComponent(t)}`}
                className="px-2 py-1 rounded-lg border border-gray-800 bg-black/30 text-xs text-gray-300 hover:bg-black/40"
              >
                {t}
              </a>
            ))}
          </div>
        </div>

        <FaqSection faq={r.faq} />

        {/* TEMPORAL MYCELIUM v3.1 – Overlord AI: Temporal Evolution Timeline */}
        <TemporalTimeline history={temporalHistory} slug={r.slug} />

        {/* PROVENANCE SINGULARITY v3.4 – Overlord AI: Provenance chain link */}
        <div className="mt-6 px-4 py-3 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 flex items-center gap-3">
          <span className="text-cyan-400 text-lg shrink-0">🔗</span>
          <p className="text-xs text-cyan-300/80">
            <span className="font-black text-cyan-300">Provenance Singularity.</span>{" "}
            This runbook is cryptographically signed and immutably recorded.
          </p>
          <a
            href={`/provenance/${r.slug}`}
            className="ml-auto shrink-0 text-xs text-cyan-400 hover:text-cyan-200 underline underline-offset-2 transition-colors"
          >
            View Provenance Chain →
          </a>
        </div>

        {relatedList.length > 0 ? (
          <div className="mt-10">
            <h2 className="text-xl font-black mb-4">Verwandte Runbooks</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {relatedList.slice(0, 8).map((x) => (
                <a
                  key={x.slug}
                  href={`/runbook/${x.slug}`}
                  className="p-5 rounded-3xl border border-gray-800 bg-black/25 hover:bg-black/35 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="font-black text-sm">{x.title}</div>
                    <span className="ml-auto text-xs text-gray-500 shrink-0">⚡{x.clawScore}</span>
                  </div>
                  <div className="mt-1 text-sm text-gray-400">{x.summary}</div>
                  <div className="mt-3 text-sm text-cyan-300 underline">Öffnen →</div>
                </a>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-12 p-6 rounded-3xl border border-gray-800 bg-black/20 text-sm text-gray-400">
          Hinweis: Diese Inhalte sind für Ops/Security gedacht. Keine „Namen-Datenbank&quot;, keine Anschuldigungen – nur Runbooks,
          Tools und verifizierbare Checks.
        </div>
      </div>
    </Container>
  )
}
