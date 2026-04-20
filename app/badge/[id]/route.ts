import { NextRequest, NextResponse } from "next/server"
import { getPublicScore } from "@/lib/public-score-store"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function color(score: number) {
  if (score >= 80) return "#10b981"
  if (score >= 60) return "#f59e0b"
  return "#ef4444"
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const rec = await getPublicScore(params.id)
  const score = rec?.score ?? 0
  const c = color(score)
  const label = "ClawGuru Security"
  const value = `${score}/100`

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="40" role="img" aria-label="${label}: ${value}">
  <linearGradient id="g" x2="0" y2="100%"><stop offset="0" stop-color="#1a1a1a"/><stop offset="1" stop-color="#0a0a0a"/></linearGradient>
  <rect width="200" height="40" rx="6" fill="url(#g)"/>
  <rect x="130" y="0" width="70" height="40" rx="6" fill="${c}" fill-opacity="0.15"/>
  <text x="12" y="25" fill="#9ca3af" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-size="12">${label}</text>
  <text x="165" y="25" text-anchor="middle" fill="${c}" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-size="13" font-weight="700">${value}</text>
</svg>`

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=300, s-maxage=300",
    },
  })
}
