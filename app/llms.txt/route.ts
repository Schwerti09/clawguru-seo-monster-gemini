import { NextResponse } from "next/server"
import { BASE_URL } from "@/lib/config"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET() {
  const lines = [
    "site: ClawGuru",
    "description: Operational security runbooks, threat intelligence, and incident response workflows.",
    `url: ${BASE_URL}`,
    "",
    "# Preferred discovery pages",
    `${BASE_URL}/de/intel`,
    `${BASE_URL}/de/runbooks`,
    `${BASE_URL}/de/solutions`,
    `${BASE_URL}/de/check`,
    `${BASE_URL}/de/copilot`,
    "",
    "# High-signal topical hubs",
    `${BASE_URL}/de/runbooks/security`,
    `${BASE_URL}/de/runbooks/kubernetes`,
    `${BASE_URL}/de/runbooks/cloud`,
    `${BASE_URL}/de/issues`,
    `${BASE_URL}/de/providers`,
    "",
    "# Machine-readable sources",
    `${BASE_URL}/api/seo/citation-feed`,
    `${BASE_URL}/sitemap.xml`,
    "",
    "# Freshness",
    `last_updated: ${new Date().toISOString()}`,
    "language_default: de",
    "language_alternates: en,es,fr,pt,it,ru,zh,ja,ar,nl,hi,tr,pl,ko",
  ]

  return new NextResponse(lines.join("\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=900, stale-while-revalidate=120, max-age=900",
    },
  })
}
