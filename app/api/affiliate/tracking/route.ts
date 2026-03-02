import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { normalizeTrackingUrls, setAffiliateTracking } from "@/lib/affiliate-tracking"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) return false
  return crypto.timingSafeEqual(bufA, bufB)
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const secret = process.env.AFFILIATE_DASH_SECRET
  const headerSecret = req.headers.get("x-affiliate-secret") ?? ""
  const bodySecret = typeof body?.secret === "string" ? body.secret : ""
  if (secret && !safeEqual(headerSecret, secret) && !safeEqual(bodySecret, secret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const affiliateRef =
    typeof body?.affiliate_ref === "string" && body.affiliate_ref.trim().length > 0
      ? body.affiliate_ref.trim().toLowerCase()
      : null
  if (!affiliateRef) {
    return NextResponse.json({ error: "affiliate_ref missing" }, { status: 400 })
  }

  const pixels = normalizeTrackingUrls(body?.pixels)
  const postbacks = normalizeTrackingUrls(body?.postbacks)

  setAffiliateTracking(affiliateRef, { pixels, postbacks })

  return NextResponse.json({ ok: true, affiliate_ref: affiliateRef, pixels: pixels.length, postbacks: postbacks.length })
}
