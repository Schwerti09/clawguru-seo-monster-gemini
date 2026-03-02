// File: lib/seo/power-links.ts
// Internal Link Siloing – "The Power-Push"
// Leverages the existing link-engine to push authority from indexed (strong)
// pages to non-indexed (weak) pages, maximising crawl & index probability.

import {
  buildLinkEngine,
  type LinkEnginePage,
  type LinkSuggestion,
} from "./link-engine"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PageStatus = "indexed" | "pending"

export type PowerLinkPage = LinkEnginePage & {
  /** Whether the page is already indexed by Google */
  indexStatus: PageStatus
}

export type PowerLinkResult = {
  /** The weak (pending) page that should receive links */
  target: { slug: string; url: string }
  /** Strong (indexed) pages that should link TO the target */
  donors: LinkSuggestion[]
}

// ---------------------------------------------------------------------------
// Core: Power-Link Silo Builder
// ---------------------------------------------------------------------------

export function buildPowerLinks(
  pages: PowerLinkPage[],
  options: { maxDonors?: number; minSimilarity?: number } = {}
): PowerLinkResult[] {
  const maxDonors = options.maxDonors ?? 8
  const minSimilarity = options.minSimilarity ?? 0.1

  const indexedPages = pages.filter((p) => p.indexStatus === "indexed")
  const pendingPages = pages.filter((p) => p.indexStatus === "pending")

  if (indexedPages.length === 0 || pendingPages.length === 0) return []

  // Build engine only from indexed (strong) pages
  const engine = buildLinkEngine(indexedPages, {
    maxLinks: maxDonors,
    minSimilarity,
    authorityWeight: 0.2,
  })

  const results: PowerLinkResult[] = []

  for (const weak of pendingPages) {
    // Find the most relevant indexed pages for this pending page
    const donors = engine.linksForPage(weak)
    if (donors.length === 0) continue

    results.push({
      target: {
        slug: weak.slug,
        url: weak.url ?? `/${weak.slug}`,
      },
      donors: donors.slice(0, maxDonors),
    })
  }

  return results
}

// ---------------------------------------------------------------------------
// Utility: Summarise silo stats
// ---------------------------------------------------------------------------

export function powerLinkStats(results: PowerLinkResult[]) {
  const totalLinks = results.reduce((sum, r) => sum + r.donors.length, 0)
  return {
    pendingPagesLinked: results.length,
    totalInternalLinks: totalLinks,
    avgDonorsPerPage:
      results.length > 0 ? Math.round(totalLinks / results.length) : 0,
  }
}
