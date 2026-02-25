// WORLD BEAST UPGRADE: app/api/extension-analytics/route.ts
// Anonymous browser extension analytics endpoint.
// Collects ONLY: TLD category (e.g. "de", "com"), event type, timestamp.
// No IP, no domain, no personal data.

import { NextRequest, NextResponse } from "next/server"

export const runtime = "edge"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({})) as {
      tld?: string
      event?: string
    }

    // WORLD BEAST UPGRADE: Only log anonymous aggregate data
    const tld = typeof body.tld === "string" ? body.tld.slice(0, 10).replace(/[^a-z0-9]/g, "") : "unknown"
    const event = typeof body.event === "string" ? body.event.slice(0, 30) : "unknown"

    // Log to console (replace with Umami/Plausible event when configured)
    console.info("[EXTENSION_ANALYTICS]", { tld, event, ts: new Date().toISOString() })

    return NextResponse.json({ ok: true })
  } catch {
    // Analytics failure must never impact user experience
    return NextResponse.json({ ok: true })
  }
}
