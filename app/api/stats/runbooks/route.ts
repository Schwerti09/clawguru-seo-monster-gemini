import { NextResponse } from "next/server"
import { warmup } from "@/lib/runbooks-index"

export const runtime = "nodejs"

export async function GET() {
  try {
    const info = await warmup()
    const res = NextResponse.json({ count: info.count, ts: info.ts })
    res.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=60")
    return res
  } catch (e) {
    return NextResponse.json({ count: 0 }, { status: 200 })
  }
}
