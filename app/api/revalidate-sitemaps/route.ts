import { NextResponse } from "next/server"
import { DEFAULT_LOCALE } from "@/lib/i18n"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"
export const maxDuration = 180

async function fetchWithNoStore(url: string) {
  try {
    const res = await fetch(url, { cache: "no-store" })
    const ok = res.ok
    const status = res.status
    return { url, ok, status }
  } catch (e) {
    return { url, ok: false, status: 0, error: String(e) }
  }
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

export async function GET(req: Request) {
  const u = new URL(req.url)
  const host = req.headers.get("host") ?? "localhost:3000"
  const protocol = host.startsWith("localhost") ? "http" : "https"
  const base = `${protocol}://${host}`

  const locale = (u.searchParams.get("locale") || DEFAULT_LOCALE).toLowerCase()
  const pages = Math.max(1, Math.min(500, parseInt(u.searchParams.get("pages") || "69", 10)))

  const urls: string[] = []
  for (let i = 0; i < pages; i++) {
    urls.push(`${base}/sitemaps/runbook100k-${locale}-${i}.xml`)
  }

  // Warm also a couple of hub sitemaps
  urls.push(
    `${base}/sitemaps/main-${locale}.xml`,
    `${base}/sitemaps/runbooks-${locale}-a-f.xml`,
    `${base}/sitemaps/tags-${locale}-a-f.xml`
  )

  const batches = chunk(urls, 10)
  const results: Array<{ url: string; ok: boolean; status: number; error?: string }> = []
  for (const b of batches) {
    const r = await Promise.all(b.map((url) => fetchWithNoStore(url)))
    results.push(...r)
  }

  const ok = results.every((r) => r.ok)
  return NextResponse.json(
    { ok, results },
    { status: ok ? 200 : 207, headers: { "Cache-Control": "no-store" } }
  )
}
