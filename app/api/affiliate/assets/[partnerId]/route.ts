import { NextRequest, NextResponse } from "next/server"
import { apiCacheGet, apiCacheSet } from "@/lib/api-cache"
import { AFFILIATE_REDIRECTS, BRAND } from "@/lib/constants"
import { getOrigin } from "@/lib/origin"
import { fetchUpstreamCVEs, type UpstreamCVE } from "@/lib/upstream-cve"

const CVE_CACHE_KEY = "affiliate:top-cve"
const CVE_CACHE_TTL = 60 * 60

function escapeXmlText(s: string) {
  const cleaned = s.replace(/[\x00-\x1F\x7F]/g, "")
  return cleaned.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" } as Record<
      string,
      string
    >)[c] || c
  );
}

function formatPartnerName(partnerId: string) {
  return partnerId
    .split(/[-_]/g)
    .filter(Boolean)
    .map((chunk) => chunk[0]?.toUpperCase() + chunk.slice(1))
    .join(" ");
}

function truncateAtWord(text: string, max = 120): string {
  if (text.length <= max) return text
  const idx = text.lastIndexOf(" ", max)
  if (idx <= 0) return text.slice(0, max).trimEnd()
  return text.slice(0, idx).trimEnd()
}

function splitLine(text: string, max = 64): [string, string] {
  if (text.length <= max) return [text, ""]
  const idx = text.lastIndexOf(" ", max)
  if (idx <= 0) return [text.slice(0, max), text.slice(max).trim()]
  return [text.slice(0, idx), text.slice(idx).trim()]
}

async function getTopCve(): Promise<UpstreamCVE> {
  const cached = apiCacheGet<UpstreamCVE>(CVE_CACHE_KEY)
  if (cached) return cached

  const list = await fetchUpstreamCVEs()
  const top = list[0] ?? {
    id: "CVE-PENDING",
    description: "No live CVE data available right now.",
    severity: "unknown",
    publishedDate: "N/A",
    affectedProducts: [],
    source: "nvd",
  }

  apiCacheSet(CVE_CACHE_KEY, top, CVE_CACHE_TTL)
  return top
}

export async function GET(req: NextRequest, props: { params: Promise<{ partnerId: string }> }) {
  const params = await props.params;
  const { searchParams } = new URL(req.url)
  const partnerId = params.partnerId || "partner"
  const partnerKey = partnerId.toLowerCase()
  const partnerName = truncateAtWord(searchParams.get("name") || formatPartnerName(partnerId), 120)
  const origin = getOrigin(req)
  const defaultUrl = AFFILIATE_REDIRECTS[partnerKey] || `${origin}/go/${partnerKey}`
  const urlParam = searchParams.get("url")
  let partnerUrl = defaultUrl
  if (urlParam) {
    try {
      const parsed = new URL(urlParam)
      if (parsed.protocol === "http:" || parsed.protocol === "https:") {
        partnerUrl = parsed.toString()
      }
    } catch {
      // fallback to default
    }
  }
  if (partnerUrl.length > 300) {
    try {
      const parsed = new URL(partnerUrl)
      partnerUrl = parsed.origin
    } catch {
      partnerUrl = partnerUrl.slice(0, 300)
    }
  }

  const cve = await getTopCve()
  const cveLabel = `${cve.id} · ${cve.severity.toUpperCase()}`
  const cveSummary = cve.description || "Stay ahead of emerging threats."
  const [summaryLine1, summaryLine2] = splitLine(cveSummary, 72)

  let displayUrl = partnerUrl
  try {
    const parsed = new URL(partnerUrl)
    displayUrl = parsed.hostname
  } catch {
    displayUrl = partnerUrl.replace(/^https?:\/\//, "")
  }

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0b1120"/>
      <stop offset="1" stop-color="#020617"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#22d3ee"/>
      <stop offset="1" stop-color="#38bdf8"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" rx="48" fill="url(#bg)"/>
  <rect x="50" y="50" width="1100" height="530" rx="36" fill="rgba(2,6,23,0.6)" stroke="rgba(148,163,184,0.25)"/>

  <text x="90" y="140" fill="#e2e8f0" font-family="Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial" font-size="36" font-weight="800">
    ${escapeXmlText(BRAND.name)} Affiliate Security Briefing
  </text>
  <text x="90" y="190" fill="#94a3b8" font-family="Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial" font-size="20" font-weight="600">
    Top CVE of the day · ${escapeXmlText(cve.publishedDate)}
  </text>

  <text x="90" y="290" fill="#f8fafc" font-family="Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial" font-size="56" font-weight="900">
    ${escapeXmlText(cveLabel)}
  </text>
  <text x="90" y="340" fill="#cbd5f5" font-family="Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial" font-size="22">
    ${escapeXmlText(summaryLine1)}
  </text>
  <text x="90" y="372" fill="#cbd5f5" font-family="Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial" font-size="22">
    ${escapeXmlText(summaryLine2)}
  </text>

  <rect x="90" y="420" width="1020" height="120" rx="24" fill="rgba(15,23,42,0.75)" stroke="rgba(56,189,248,0.35)"/>
  <text x="120" y="470" fill="#e2e8f0" font-family="Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial" font-size="24" font-weight="700">
    Partner: ${escapeXmlText(partnerName)}
  </text>
  <text x="120" y="510" fill="#7dd3fc" font-family="JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" font-size="20">
    ${escapeXmlText(displayUrl)}
  </text>
  <text x="1080" y="510" text-anchor="end" fill="#e2e8f0" font-family="Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial" font-size="18" font-weight="600">
    ${escapeXmlText(BRAND.domain)}
  </text>
</svg>`

  return new NextResponse(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=1800",
      "X-Partner-Link": partnerUrl.replace(/[\r\n]/g, ""),
    },
  });
}
