import { NextResponse } from "next/server"
import { BASE_URL } from "@/lib/config"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET() {
  const base = BASE_URL
  const body = [
    "User-agent: *",
    "Allow: /",
    "",
    "# Blockiere Admin & Backend",
    "Disallow: /admin/",
    "Disallow: /api/",
    "Disallow: /dashboard/",
    "",
    "# Blockiere interne Suchergebnisse (Spider Trap)",
    "Disallow: /search",
    "Disallow: /search/",
    "Disallow: /search?*",
    "",
    "# Blockiere Checkout/Success",
    "Disallow: /checkout/",
    "Disallow: /success/",
    "",
    `Sitemap: ${base}/sitemap.xml`
  ].join("\n")

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600"
    }
  })
}
