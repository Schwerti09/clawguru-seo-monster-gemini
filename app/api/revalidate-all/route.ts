import { NextResponse } from "next/server"
import { DEFAULT_LOCALE } from "@/lib/i18n"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 180

async function hit(url: string) {
  try {
    const res = await fetch(url, { cache: "no-store" })
    return { url, ok: res.ok, status: res.status }
  } catch (e) {
    return { url, ok: false, status: 0, error: String(e) }
  }
}

export async function GET(req: Request) {
  const u = new URL(req.url)
  const host = u.host || req.headers.get("host") || "localhost:3000"
  const protocol = host.startsWith("localhost") ? "http" : "https"
  const base = `${protocol}://${host}`

  const locale = (u.searchParams.get("locale") || DEFAULT_LOCALE).toLowerCase()
  const pages = Math.max(1, Math.min(500, parseInt(u.searchParams.get("pages") || "69", 10)))

  const urls: string[] = [
    `${base}/sitemap.xml`,
    `${base}/sitemap-index`,
    `${base}/robots.txt`,
    `${base}/api/clawlink.js`,
    `${base}/api/revalidate-sitemaps?locale=${encodeURIComponent(locale)}&pages=${pages}`,
  ]

  const out = await Promise.all(urls.map((x) => hit(x)))
  const ok = out.every((r) => r.ok)
  return NextResponse.json({ ok, results: out }, { status: ok ? 200 : 207, headers: { "Cache-Control": "no-store" } })
}
