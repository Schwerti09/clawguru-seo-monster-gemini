// File: app/api/launch/cron/route.ts
// 1M LIVE LAUNCH v2.0 – Overlord AI: Background cron job for incremental runbook batch processing.
// Called by Vercel Cron every 6 hours.
// Each invocation validates a 20,000-runbook batch through Quality Gate 2.0 and logs results.
// Secured by CRON_SECRET to prevent unauthorised triggering.

import { NextRequest, NextResponse } from "next/server"
import {
  get100kSlugsPage,
  generateRunbook100k,
  parseRunbookSlug100k,
} from "@/lib/pseo"
import { computeQualityStats, DEFAULT_THRESHOLDS } from "@/lib/quality-gate"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

/** Number of slugs validated per cron run (20k as specified). */
const CRON_BATCH_SIZE = 20_000

export async function GET(req: NextRequest) {
  // Validate CRON_SECRET when set
  const secret = process.env.CRON_SECRET
  if (secret) {
    const auth = req.headers.get("authorization") ?? ""
    const param = req.nextUrl.searchParams.get("secret") ?? ""
    if (auth !== `Bearer ${secret}` && param !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }

  // Determine which batch page to process (defaults to page 0; use ?page= to advance)
  const pageParam = req.nextUrl.searchParams.get("page")
  const batchPage = pageParam !== null ? Math.max(0, parseInt(pageParam, 10) || 0) : 0

  const startedAt = Date.now()

  // 1M LIVE LAUNCH v2.0 – Overlord AI: fetch slug page and generate runbooks
  const slugs = get100kSlugsPage(batchPage, CRON_BATCH_SIZE)

  if (slugs.length === 0) {
    return NextResponse.json({
      launch: "1M LIVE LAUNCH v2.0 – Overlord AI",
      batchPage,
      status: "complete",
      message: "All batches have been processed. 1M RUNBOOK BIBLE IS LIVE.",
      generatedAt: new Date().toISOString(),
    })
  }

  const runbooks = slugs
    .map((slug) => {
      const meta = parseRunbookSlug100k(slug)
      return meta ? generateRunbook100k(meta) : null
    })
    .filter(Boolean) as ReturnType<typeof generateRunbook100k>[]

  // Quality Gate 2.0 – must run on every batch
  const stats = computeQualityStats(runbooks, DEFAULT_THRESHOLDS)
  const elapsed = Date.now() - startedAt

  const result = {
    // 1M LIVE LAUNCH v2.0 – Overlord AI
    launch: "1M LIVE LAUNCH v2.0 – Overlord AI",
    batchPage,
    batchSize: slugs.length,
    generated: runbooks.length,
    qualityGate: {
      threshold: DEFAULT_THRESHOLDS.minPassScore,
      passed: stats.passed,
      failed: stats.failed,
      passRate: stats.passRate,
      avgScore: stats.avgScore,
      goldCount: stats.goldCount,
      silverCount: stats.silverCount,
      topViolations: stats.topViolations,
    },
    elapsedMs: elapsed,
    generatedAt: new Date().toISOString(),
  }

  console.log(`[launch/cron] ✅ Batch ${batchPage}: ${stats.passed}/${slugs.length} passed (${stats.passRate}% pass-rate, avg ${stats.avgScore}/100) in ${elapsed}ms`)

  return NextResponse.json(result)
}
