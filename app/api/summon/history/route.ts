import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getAccess } from "@/lib/access"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type SummonItem = {
  id: string
  type: "neuro" | "oracle" | "hunter" | "defense"
  etaMs: number
  startedAt: number
  finishedAt: number
  prediction: string
  runbookSlug: string
  oneClickFixUrl?: string
  paths: Array<{ from: string; to: string; risk: number }>
}

function readItems(): SummonItem[] {
  try {
    const c = cookies().get("swarm_history")?.value
    if (!c) return []
    const arr = JSON.parse(c)
    return Array.isArray(arr) ? (arr as SummonItem[]) : []
  } catch {
    return []
  }
}

export async function GET() {
  const items = readItems()
  return NextResponse.json({ items })
}

export async function POST(req: NextRequest) {
  const acc = await getAccess()
  if (!acc.ok) return NextResponse.json({ error: "Not authorized" }, { status: 401 })

  const body = await req.json().catch(() => ({})) as { item?: SummonItem }
  const item = body?.item
  if (!item || typeof item !== "object" || !item.id) {
    return NextResponse.json({ error: "Invalid item" }, { status: 400 })
  }

  const curr = readItems()
  const next = [item, ...curr].slice(0, 12)

  const res = NextResponse.json({ ok: true, count: next.length })
  const expires = new Date(Date.now() + (acc.plan === "daypass" ? 24 * 60 * 60 * 1000 : 180 * 24 * 60 * 60 * 1000))
  res.cookies.set("swarm_history", JSON.stringify(next), {
    httpOnly: false,
    sameSite: "lax",
    secure: true,
    expires,
    path: "/",
  })
  return res
}
