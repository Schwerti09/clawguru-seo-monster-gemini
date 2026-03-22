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

export async function GET(_req: Request, ctx: { params: { id: string } }) {
  try {
    const idRaw = ctx?.params?.id || ""
    const id = decodeURIComponent(idRaw).toUpperCase()

    const feed = readJson<{ entries?: any[] }>("public/cve-feed.json")
    const entries = Array.isArray(feed?.entries) ? feed!.entries! : []
    const item = entries.find((e) => String(e?.id || "").toUpperCase() === id) || null

    const mapping = readJson<{ mapping?: Record<string, any> }>("public/cve-runbook-mapping.json")
    const match = mapping?.mapping ? mapping.mapping[id] || null : null

    if (!item) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const res = NextResponse.json({ cve: item, recommendation: match })
    res.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=60")
    return res
  } catch (err) {
    return NextResponse.json({ error: "Failed to load CVE" }, { status: 500 })
  }
}
