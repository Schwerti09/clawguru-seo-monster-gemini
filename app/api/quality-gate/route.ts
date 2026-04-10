// File: app/api/quality-gate/route.ts
// ClawGuru 2026 Quality Gate API – Institutional-grade content health endpoint.
// Returns quality statistics for the materializedRunbooks() library.
// GENESIS QUALITY GATE 2.0 – Auto-Improve Engine included.

import { NextResponse } from "next/server"
import { computeQualityStats, validateRunbook, DEFAULT_THRESHOLDS } from "@/lib/quality-gate"
import { generateOrdered, type AiProvider } from "@/lib/ai/providers"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

// GENESIS QUALITY GATE 2.0 – Multi-provider auto-improve helper
async function callImproveOrdered(runbookJson: string): Promise<string | null> {
  const safeJson = runbookJson.slice(0, 8000)
  const prompt = `Improve this runbook to 98+ without changing facts. Return only valid JSON matching the original schema.\n\n${safeJson}`
  const { parsed } = await generateOrdered(prompt, process.env.AI_PROVIDER as AiProvider | undefined)
  return parsed && typeof parsed === "string" ? parsed : null
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get("slug")
  const autoImprove = searchParams.get("autoImprove") === "true"
  const { materializedRunbooks } = await import("@/lib/pseo")
  const allRunbooks = materializedRunbooks()

  // Single runbook quality report
  if (slug) {
    const runbook = allRunbooks.find((r) => r.slug === slug)
    if (!runbook) {
      return NextResponse.json({ error: "Runbook not found", slug }, { status: 404 })
    }
    const report = validateRunbook(runbook, DEFAULT_THRESHOLDS)

    // GENESIS QUALITY GATE 2.0 – Auto-Improve Engine: call Gemini when score < 90
    if (autoImprove && report.score < 90) {
      const improved = await callImproveOrdered(JSON.stringify(runbook, null, 2))
      return NextResponse.json({
        ...report,
        autoImproved: improved !== null,
        autoImproveLog: improved !== null ? "Auto-Improved via Provider Pipeline" : "Auto-improve unavailable (no provider available)",
        improvedContent: improved,
      })
    }

    return NextResponse.json(report)
  }

  // Aggregate stats for all static runbooks
  const stats = computeQualityStats(allRunbooks, DEFAULT_THRESHOLDS)
  return NextResponse.json({
    ...stats,
    thresholds: DEFAULT_THRESHOLDS,
    generatedAt: new Date().toISOString(),
  })
}
