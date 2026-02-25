// WORLD BEAST: app/api/agents/growth/route.ts
// Growth Agent – analyzes traffic, suggests keywords and landing pages.
// POST with { topSlugs, locale } to get growth suggestions.

import { NextRequest, NextResponse } from "next/server"
import { runGrowthAgent } from "@/lib/agents"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({})) as {
      topSlugs?: string[]
      locale?: string
    }
    const topSlugs = Array.isArray(body.topSlugs) ? body.topSlugs : []
    const locale = typeof body.locale === "string" ? body.locale : "de"

    const result = await runGrowthAgent({ topSlugs, locale })

    return NextResponse.json(result, {
      headers: { "Cache-Control": "no-store" },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
