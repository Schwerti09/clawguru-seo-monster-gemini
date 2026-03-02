import { NextRequest, NextResponse } from "next/server"
import { setAffiliateTracking } from "@/lib/affiliate-tracking"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function normalizeList(value: unknown): string[] {
  if (!value) return []
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === "string" && v.length > 0)
  if (typeof value === "string") return value.length > 0 ? [value] : []
  return []
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const secret = process.env.AFFILIATE_DASH_SECRET
  const headerSecret = req.headers.get("x-affiliate-secret") ?? ""
  const bodySecret = typeof body?.secret === "string" ? body.secret : ""
  if (secret && headerSecret !== secret && bodySecret !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const affiliateRef =
    typeof body?.affiliate_ref === "string" && body.affiliate_ref.trim().length > 0
      ? body.affiliate_ref.trim().toLowerCase()
      : null
  if (!affiliateRef) {
    return NextResponse.json({ error: "affiliate_ref missing" }, { status: 400 })
  }

  const pixels = normalizeList(body?.pixels)
  const postbacks = normalizeList(body?.postbacks)

  setAffiliateTracking(affiliateRef, { pixels, postbacks })

  return NextResponse.json({ ok: true, affiliate_ref: affiliateRef, pixels: pixels.length, postbacks: postbacks.length })
}
