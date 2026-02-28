// File: app/api/quality-dashboard/route.ts
// GENESIS QUALITY GATE 2.0 – Quality Dashboard endpoint.
// Returns aggregate pass-rate, top violations, badge counts, and provider heatmap.

import { NextResponse } from "next/server"
import { RUNBOOKS } from "@/lib/pseo"
import {
  computeProviderHeatmap,
  validateRunbook,
  DEFAULT_THRESHOLDS,
} from "@/lib/quality-gate"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET() {
  // Validate all runbooks once; derive all stats from the single pass
  const reports = RUNBOOKS.map((r) => validateRunbook(r, DEFAULT_THRESHOLDS))
  const passed = reports.filter((r) => r.pass).length
  const failed = reports.length - passed
  const avgScore = reports.length > 0
    ? Math.round(reports.reduce((s, r) => s + r.score, 0) / reports.length)
    : 0
  const passRate = reports.length > 0 ? Math.round((passed / reports.length) * 100) : 0
  const goldCount = reports.filter((r) => r.clawCertifiedTier === "gold").length
  const silverCount = reports.filter((r) => r.clawCertifiedTier === "silver").length

  // Top 5 violations
  const fieldCount = new Map<string, number>()
  for (const report of reports) {
    for (const v of report.violations) {
      fieldCount.set(v.field, (fieldCount.get(v.field) ?? 0) + 1)
    }
  }
  const topViolations = Array.from(fieldCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([field, count]) => ({ field, count }))

  // Auto-improve stats: runbooks passing but scoring below 90
  const autoImproveEligible = reports.filter((r) => r.pass && r.score < 90).length

  const providerHeatmap = computeProviderHeatmap(RUNBOOKS, DEFAULT_THRESHOLDS)

  return NextResponse.json({
    // Overall pass-rate
    passRate,
    total: reports.length,
    passed,
    failed,
    avgScore,

    // Badge distribution
    goldCount,
    silverCount,
    hiddenCount: reports.length - goldCount - silverCount,

    // Top 5 violations
    topViolations,

    // Auto-improve stats
    autoImprove: {
      eligible: autoImproveEligible,
      threshold: 90,
      description: "Runbooks passing the gate but scoring below 90 – eligible for Gemini auto-improvement",
    },

    // Provider/service heatmap (top 20 by volume)
    providerHeatmap: providerHeatmap.slice(0, 20),

    thresholds: DEFAULT_THRESHOLDS,
    generatedAt: new Date().toISOString(),
  })
}
