import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  try {
    const ct = req.headers.get("content-type") || ""
    let payload: any = null
    if (ct.includes("application/json")) payload = await req.json()
    else if (ct.includes("application/x-www-form-urlencoded")) {
      const fd = await req.formData()
      payload = Object.fromEntries(fd.entries())
    } else {
      payload = await req.text()
    }
    // LINE webhook expects 200 OK even if body is ignored, else delivery retries
    return NextResponse.json({ ok: true, provider: "line", received: Boolean(payload), ts: Date.now() }, { status: 200 })
  } catch (e) {
    return NextResponse.json({ ok: false, provider: "line", error: String(e) }, { status: 200 })
  }
}

export async function GET() {
  return new NextResponse("OK", { status: 200 })
}
