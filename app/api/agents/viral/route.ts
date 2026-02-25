// WORLD BEAST: app/api/agents/viral/route.ts
// Viral Content Agent – generates Twitter/LinkedIn/Reddit threads for runbooks.
// POST with { slug, title, summary } to generate content.

import { NextRequest, NextResponse } from "next/server"
import { runViralContentAgent } from "@/lib/agents"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({})) as {
      slug?: string
      title?: string
      summary?: string
    }
    const { slug, title, summary } = body
    if (!slug || !title || !summary) {
      return NextResponse.json(
        { error: "slug, title and summary are required" },
        { status: 400 }
      )
    }

    const content = await runViralContentAgent({ slug, title, summary })
    if (!content) {
      return NextResponse.json({ error: "Agent returned no content" }, { status: 500 })
    }

    return NextResponse.json(content, {
      headers: { "Cache-Control": "no-store" },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
