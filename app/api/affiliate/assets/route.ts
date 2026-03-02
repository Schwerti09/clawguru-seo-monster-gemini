import { NextRequest, NextResponse } from "next/server"

export const runtime = "edge"

function buildBanner(name: string) {
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="628" viewBox="0 0 1200 628">
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#04111d"/>
      <stop offset="100%" stop-color="#0b1f33"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0%" stop-color="#00ff9d"/>
      <stop offset="100%" stop-color="#7c3aed"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="628" rx="48" fill="url(#bg)"/>
  <rect x="60" y="60" width="1080" height="508" rx="36" fill="rgba(0,0,0,0.35)" stroke="rgba(0,255,157,0.2)" stroke-width="2"/>
  <text x="100" y="180" font-size="52" font-family="Inter, Arial, sans-serif" fill="#e5e7eb" font-weight="800">ClawGuru Affiliate</text>
  <text x="100" y="250" font-size="30" font-family="Inter, Arial, sans-serif" fill="#9ca3af">Powered by WorldBeast 2026</text>
  <rect x="100" y="320" width="520" height="12" rx="6" fill="url(#accent)"/>
  <text x="100" y="390" font-size="34" font-family="Inter, Arial, sans-serif" fill="#00ff9d" font-weight="700">${name}</text>
  <text x="100" y="440" font-size="24" font-family="Inter, Arial, sans-serif" fill="#9ca3af">Share your referral link and earn.</text>
  <text x="100" y="500" font-size="20" font-family="Inter, Arial, sans-serif" fill="#64748b">clawguru.org/leaderboard</text>
</svg>`
}

function buildCertificate(name: string) {
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="850" viewBox="0 0 1200 850">
  <rect width="1200" height="850" fill="#050608"/>
  <rect x="50" y="50" width="1100" height="750" fill="rgba(0,0,0,0.5)" stroke="rgba(0,255,157,0.35)" stroke-width="2" rx="32"/>
  <text x="600" y="180" text-anchor="middle" font-size="46" font-family="Inter, Arial, sans-serif" fill="#e5e7eb" font-weight="800">Affiliate Certificate</text>
  <text x="600" y="260" text-anchor="middle" font-size="22" font-family="Inter, Arial, sans-serif" fill="#9ca3af">This certifies that</text>
  <text x="600" y="340" text-anchor="middle" font-size="40" font-family="Inter, Arial, sans-serif" fill="#00ff9d" font-weight="700">${name}</text>
  <text x="600" y="410" text-anchor="middle" font-size="22" font-family="Inter, Arial, sans-serif" fill="#9ca3af">is an approved ClawGuru Partner</text>
  <text x="600" y="520" text-anchor="middle" font-size="18" font-family="Inter, Arial, sans-serif" fill="#6b7280">Issued: ${new Date().toISOString().slice(0, 10)}</text>
  <text x="600" y="620" text-anchor="middle" font-size="20" font-family="Inter, Arial, sans-serif" fill="#64748b">clawguru.org · WorldBeast 2026</text>
</svg>`
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const type = (searchParams.get("type") || "banner").toLowerCase()
  const rawName = searchParams.get("name") || "ClawGuru Partner"
  const name = rawName.trim().slice(0, 48)
  const svg = type === "certificate" ? buildCertificate(name) : buildBanner(name)

  return new NextResponse(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  })
}
