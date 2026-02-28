// File: app/api/launch/stats/route.ts
// 1M LIVE LAUNCH v2.0 – Overlord AI: Live launch stats for the launch dashboard.
// Returns runbook counts, Quality Gate 2.0 pass-rate, sitemap size, and next batch info.

import { NextResponse } from "next/server"
import {
  count100kSlugs,
  count100kSitemapPages,
  get100kSlugsPage,
  generateRunbook100k,
  parseRunbookSlug100k,
  SITEMAP_PAGE_SIZE_100K,
} from "@/lib/pseo"
import { computeQualityStats, DEFAULT_THRESHOLDS } from "@/lib/quality-gate"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

/** Batch size for quality sampling shown on the dashboard. */
const SAMPLE_BATCH = 200

export async function GET() {
  const totalSlugs = count100kSlugs()
  const sitemapPages = count100kSitemapPages()

  // Sample the first SAMPLE_BATCH slugs from page 0 and run Quality Gate 2.0
  const sampleSlugs = get100kSlugsPage(0, SAMPLE_BATCH)
  const sampleRunbooks = sampleSlugs
    .map((slug) => {
      const meta = parseRunbookSlug100k(slug)
      return meta ? generateRunbook100k(meta) : null
    })
    .filter(Boolean) as ReturnType<typeof generateRunbook100k>[]

  const qualityStats = computeQualityStats(sampleRunbooks, DEFAULT_THRESHOLDS)

  // Next batch offset (simplified: always point at batch #1 for the dashboard)
  const nextBatchStart = SITEMAP_PAGE_SIZE_100K
  const nextBatchEnd = nextBatchStart + SITEMAP_PAGE_SIZE_100K

  return NextResponse.json({
    // 1M LIVE LAUNCH v2.0 – Overlord AI
    launch: "1M LIVE LAUNCH v2.0 – Overlord AI",
    totalRunbookSlugs: totalSlugs,
    sitemapPages,
    sitemapPageSize: SITEMAP_PAGE_SIZE_100K,
    qualityGateThreshold: DEFAULT_THRESHOLDS.minPassScore,

    // Quality Gate sample stats (first 200 runbooks)
    qualitySample: {
      sampled: qualityStats.total,
      passed: qualityStats.passed,
      failed: qualityStats.failed,
      passRate: qualityStats.passRate,
      avgScore: qualityStats.avgScore,
      goldCount: qualityStats.goldCount,
      silverCount: qualityStats.silverCount,
      topViolations: qualityStats.topViolations,
    },

    // Next batch info
    nextBatch: {
      startSlugIndex: nextBatchStart,
      endSlugIndex: nextBatchEnd,
      label: `Batch #1 (slugs ${nextBatchStart.toLocaleString()}–${nextBatchEnd.toLocaleString()})`,
    },

    generatedAt: new Date().toISOString(),
  })
}
