import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export const runtime = "nodejs"

function readJson<T = any>(rel: string): T | null {
  const p = path.isAbsolute(rel) ? rel : path.join(process.cwd(), rel)
  try {
    if (!fs.existsSync(p)) return null
    return JSON.parse(fs.readFileSync(p, "utf8")) as T
  } catch {
    return null
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const limit = Math.max(1, Math.min(200, parseInt(url.searchParams.get("limit") || "20", 10) || 20))
    const offset = Math.max(0, parseInt(url.searchParams.get("offset") || "0", 10) || 0)

    const feed = readJson<{ updatedAt?: string; entries?: any[] }>("public/cve-feed.json")
    const entries = Array.isArray(feed?.entries) ? feed!.entries! : []

    const slice = entries.slice(offset, offset + limit)
    const res = NextResponse.json({ updatedAt: feed?.updatedAt || null, total: entries.length, items: slice })
    res.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=30")
    return res
  } catch (err) {
    return NextResponse.json({ error: "Failed to load CVE feed" }, { status: 500 })
  }
}
