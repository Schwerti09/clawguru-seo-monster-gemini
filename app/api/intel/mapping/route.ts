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

export async function GET() {
  try {
    const data = readJson<{ updatedAt?: string; mapping?: Record<string, any> }>("public/cve-runbook-mapping.json")
    const res = NextResponse.json({ updatedAt: data?.updatedAt || null, mapping: data?.mapping || {} })
    res.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=60")
    return res
  } catch (err) {
    return NextResponse.json({ error: "Failed to load mapping" }, { status: 500 })
  }
}
