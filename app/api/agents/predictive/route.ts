// WORLD BEAST UPGRADE: app/api/agents/predictive/route.ts
// Predictive Threat Intelligence Agent API endpoint.

import { NextRequest, NextResponse } from "next/server"
import { runPredictiveAgent } from "@/lib/agents/predictive-agent"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(req: NextRequest) {
  // WORLD BEAST UPGRADE: optional CRON_SECRET auth
  const secret = process.env.CRON_SECRET
  if (secret) {
    const auth = req.headers.get("authorization") ?? ""
    const param = req.nextUrl.searchParams.get("secret") ?? ""
    if (auth !== `Bearer ${secret}` && param !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }

  try {
    const result = await runPredictiveAgent()
    return NextResponse.json(result, {
      headers: { "Cache-Control": "no-store" },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
