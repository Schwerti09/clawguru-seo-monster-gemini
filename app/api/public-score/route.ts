import { NextRequest, NextResponse } from "next/server"
import { createPublicScore } from "@/lib/public-score-store"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null)
    if (!body || typeof body.target !== "string" || typeof body.score !== "number") {
      return NextResponse.json({ success: false, error: "invalid payload" }, { status: 400 })
    }
    const record = await createPublicScore({
      target: String(body.target).slice(0, 256),
      score: Math.max(0, Math.min(100, Math.round(body.score))),
      vulnerable: Boolean(body.vulnerable),
      top_risks: Array.isArray(body.top_risks) ? body.top_risks.slice(0, 10) : [],
      recommendations: Array.isArray(body.recommendations) ? body.recommendations.slice(0, 20) : [],
      locale: typeof body.locale === "string" ? body.locale.slice(0, 8) : "de",
    })
    return NextResponse.json({ success: true, token: record.token })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message ?? "error" }, { status: 500 })
  }
}
