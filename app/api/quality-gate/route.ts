// File: app/api/quality-gate/route.ts
// ClawGuru 2026 Quality Gate API – Institutional-grade content health endpoint.
// Returns quality statistics for the static RUNBOOKS library.
// GENESIS QUALITY GATE 2.0 – Auto-Improve Engine included.

import { NextResponse } from "next/server"
import { RUNBOOKS } from "@/lib/pseo"
import { computeQualityStats, validateRunbook, DEFAULT_THRESHOLDS } from "@/lib/quality-gate"
import { callGeminiWithBackoff } from "@/lib/gemini-api"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

// GENESIS QUALITY GATE 2.0 – Gemini auto-improve helper
async function callGeminiImprove(runbookJson: string): Promise<string | null> {
  const geminiModel = process.env.GEMINI_MODEL || "gemini-2.0-flash"
  const geminiTimeoutMs = parseInt(process.env.GEMINI_TIMEOUT_MS ?? "60000", 10)

  // Truncate runbook JSON to prevent token exhaustion; internal data only
  const safeJson = runbookJson.slice(0, 8000)
  const prompt = `Improve this runbook to 98+ without changing facts. Return only valid JSON matching the original schema.\n\n${safeJson}`

  return callGeminiWithBackoff({
    prompt,
    temperature: 0.3,
    maxOutputTokens: 2048,
    timeoutMs: geminiTimeoutMs,
    model: geminiModel,
  })
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get("slug")
  const autoImprove = searchParams.get("autoImprove") === "true"

  // Single runbook quality report
  if (slug) {
    const runbook = RUNBOOKS.find((r) => r.slug === slug)
    if (!runbook) {
      return NextResponse.json({ error: "Runbook not found", slug }, { status: 404 })
    }
    const report = validateRunbook(runbook, DEFAULT_THRESHOLDS)

    // GENESIS QUALITY GATE 2.0 – Auto-Improve Engine: call Gemini when score < 90
    if (autoImprove && report.score < 90) {
      const improved = await callGeminiImprove(JSON.stringify(runbook, null, 2))
      return NextResponse.json({
        ...report,
        autoImproved: improved !== null,
        autoImproveLog: improved !== null ? "Auto-Improved by Overlord AI" : "Auto-improve unavailable (no Gemini key or API error)",
        improvedContent: improved,
      })
    }

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
