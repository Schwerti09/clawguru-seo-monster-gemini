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

function toKey(s: string) {
  return String(s || "").trim().toLowerCase()
}

export async function GET() {
  try {
    const feed = readJson<{ updatedAt?: string; entries?: any[] }>("public/cve-feed.json")
    const mapping = readJson<{ updatedAt?: string; mapping?: Record<string, { services?: string[] }> }>(
      "public/cve-runbook-mapping.json"
    )

    const entries = Array.isArray(feed?.entries) ? feed!.entries! : []

    const now = new Date()
    const weekAgo = new Date(now)
    weekAgo.setDate(now.getDate() - 7)

    let total = 0
    let critical = 0
    let high = 0
    let medium = 0
    let low = 0
    let unknown = 0
    let scoreSum = 0
    let scored = 0
    let newThisWeek = 0

    for (const e of entries) {
      total += 1
      const sev = toKey(e?.severity)
      if (sev === "critical") critical += 1
      else if (sev === "high") high += 1
      else if (sev === "medium") medium += 1
      else if (sev === "low") low += 1
      else unknown += 1

      const s = Number(e?.score)
      if (!Number.isNaN(s)) {
        scoreSum += s
        scored += 1
      }

      const pub = e?.published ? new Date(e.published) : null
      if (pub && !Number.isNaN(pub.valueOf()) && pub >= weekAgo) newThisWeek += 1
    }

    const avgScore = scored > 0 ? Number((scoreSum / scored).toFixed(2)) : 0

    const svcCounts: Record<string, number> = {}
    const mapObj = mapping?.mapping || {}
    for (const id of Object.keys(mapObj)) {
      const svcs = Array.isArray(mapObj[id]?.services) ? mapObj[id]!.services! : []
      for (const s of svcs) {
        const k = toKey(s)
        if (!k) continue
        svcCounts[k] = (svcCounts[k] || 0) + 1
      }
    }
    const topServices = Object.entries(svcCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }))

    const coverage = {
      mapped: Object.keys(mapObj).length,
      total,
      ratio: total > 0 ? Number((Object.keys(mapObj).length / total).toFixed(2)) : 0,
    }

    const res = NextResponse.json(
      {
        updatedAt: feed?.updatedAt || null,
        totals: { total, critical, high, medium, low, unknown },
        avgScore,
        newThisWeek,
        topServices,
        coverage,
      },
      { status: 200 }
    )
    res.headers.set("Cache-Control", "public, s-maxage=120, stale-while-revalidate=60")
    return res
  } catch (err) {
    return NextResponse.json({ error: "Failed to compute stats" }, { status: 500 })
  }
}
