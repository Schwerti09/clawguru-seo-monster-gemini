// File: app/api/quality-gate/route.ts
// ClawGuru 2026 Quality Gate API – Institutional-grade content health endpoint.
// Returns quality statistics for the static RUNBOOKS library.

import { NextResponse } from "next/server"
import { RUNBOOKS } from "@/lib/pseo"
import { computeQualityStats, validateRunbook, DEFAULT_THRESHOLDS } from "@/lib/quality-gate"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get("slug")

  // Single runbook quality report
  if (slug) {
    const runbook = RUNBOOKS.find((r) => r.slug === slug)
    if (!runbook) {
      return NextResponse.json({ error: "Runbook not found", slug }, { status: 404 })
    }
    const report = validateRunbook(runbook, DEFAULT_THRESHOLDS)
    return NextResponse.json(report)
  }

  // Aggregate stats for all static runbooks
  const stats = computeQualityStats(RUNBOOKS, DEFAULT_THRESHOLDS)
  return NextResponse.json({
    ...stats,
    thresholds: DEFAULT_THRESHOLDS,
    generatedAt: new Date().toISOString(),
  })
}
