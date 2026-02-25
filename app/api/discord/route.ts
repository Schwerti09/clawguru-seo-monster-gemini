// WORLD BEAST: app/api/discord/route.ts
// Discord Integration – auto-posts new runbooks to #hotfixes channel via webhook.

import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  const authHeader = req.headers.get("authorization")
  if (authHeader === `Bearer ${secret}`) return true
  const url = new URL(req.url)
  return url.searchParams.get("secret") === secret
}

export type DiscordPostPayload = {
  runbookTitle: string
  runbookSlug: string
  runbookSummary: string
  clawScore?: number
  tags?: string[]
}

/**
 * WORLD BEAST: Posts a new runbook announcement to the configured Discord webhook.
 * Set DISCORD_WEBHOOK_URL env var to your #hotfixes channel webhook.
 */
export async function postRunbookToDiscord(payload: DiscordPostPayload): Promise<{ ok: boolean; error?: string }> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL
  if (!webhookUrl) return { ok: false, error: "DISCORD_WEBHOOK_URL not configured" }

  const url = `https://clawguru.org/runbook/${payload.runbookSlug}`
  const tagList = payload.tags?.slice(0, 5).map((t) => `\`${t}\``).join(" ") ?? ""
  const score = payload.clawScore ?? 0

  // WORLD BEAST: Discord embed format
  const body = {
    username: "ClawGuru Bot",
    avatar_url: "https://clawguru.org/favicon.ico",
    embeds: [
      {
        title: `🦅 New Runbook: ${payload.runbookTitle}`,
        description: payload.runbookSummary,
        url,
        color: 0x00e5ff, // brand cyan
        fields: [
          { name: "⚡ Claw Score", value: `${score}/100`, inline: true },
          { name: "🏷️ Tags", value: tagList || "—", inline: true },
          { name: "🔗 Link", value: `[Open Runbook](${url})`, inline: false },
        ],
        footer: { text: "ClawGuru · Nr. 1 Ops Intelligence Platform 2026" },
        timestamp: new Date().toISOString(),
      },
    ],
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(10_000),
    })
    if (!res.ok) {
      const text = await res.text().catch(() => "")
      return { ok: false, error: `Discord API ${res.status}: ${text.slice(0, 200)}` }
    }
    return { ok: true }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) }
  }
}

// ---------------------------------------------------------------------------
// HTTP endpoint
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let payload: DiscordPostPayload
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  if (!payload.runbookTitle || !payload.runbookSlug) {
    return NextResponse.json(
      { error: "runbookTitle and runbookSlug are required" },
      { status: 400 }
    )
  }

  const result = await postRunbookToDiscord(payload)
  return NextResponse.json(result, { status: result.ok ? 200 : 500 })
}
