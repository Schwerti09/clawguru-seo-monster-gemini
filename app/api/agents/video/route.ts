// WORLD BEAST UPGRADE: app/api/agents/video/route.ts
// Video Runbook Agent API endpoint.
// POST { slug, title, summary, mitigationSteps? } → VideoRunbook

import { NextRequest, NextResponse } from "next/server"
import { generateVideoRunbook } from "@/lib/agents/video-agent"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({})) as {
      slug?: string
      title?: string
      summary?: string
      mitigationSteps?: string[]
    }

    if (!body.slug || !body.title) {
      return NextResponse.json({ error: "slug and title are required" }, { status: 400 })
    }

    const result = await generateVideoRunbook({
      slug: body.slug,
      title: body.title,
      summary: body.summary || "",
      mitigationSteps: body.mitigationSteps,
    })

    return NextResponse.json(result, {
      headers: { "Cache-Control": "no-store" },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
