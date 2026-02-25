// WORLD BEAST: app/api/discord/route.ts
// Discord broadcast endpoint – manually trigger a runbook post to Discord.
// POST with { slug, title, summary, tags, clawScore }

import { NextRequest, NextResponse } from "next/server"
import { postRunbookToDiscord } from "@/lib/discord"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (secret) {
    const auth = req.headers.get("authorization") ?? ""
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }

  try {
    const body = await req.json().catch(() => ({})) as {
      slug?: string
      title?: string
      summary?: string
      tags?: string[]
      clawScore?: number
    }
    const { slug, title, summary, tags = [], clawScore = 80 } = body
    if (!slug || !title || !summary) {
      return NextResponse.json(
        { error: "slug, title and summary are required" },
        { status: 400 }
      )
    }

    const ok = await postRunbookToDiscord({ slug, title, summary, tags, clawScore })
    return NextResponse.json({ ok }, { headers: { "Cache-Control": "no-store" } })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
