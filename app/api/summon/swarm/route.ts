import { NextRequest, NextResponse } from "next/server"
import { getAccess } from "@/lib/access"
import { cookies } from "next/headers"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function rand(n: number) { return Math.floor(Math.random() * n) }

export async function POST(req: NextRequest) {
  const access = await getAccess()
  if (!access.ok) {
    return NextResponse.json({ error: "Not authorized – Daypass oder Pro erforderlich" }, { status: 402 })
  }

  // ── Enforce Daypass quota: max 1 summon per calendar day ───────────────
  if (access.plan === "daypass") {
    try {
      const today = new Date()
      const ymd = `${today.getUTCFullYear()}-${String(today.getUTCMonth() + 1).padStart(2, "0")}-${String(today.getUTCDate()).padStart(2, "0")}`
      const quotaRaw = cookies().get("swarm_quota")?.value || ""
      const [date, countStr] = quotaRaw.split(":")
      const count = Number(countStr || "0") || 0
      if (date === ymd && count >= 1) {
        return NextResponse.json({ error: "Daypass‑Limit erreicht (1 Swarm/Tag). Upgrade auf Pro für unbegrenzt." }, { status: 429 })
      }
    } catch {}
  }

  const body = (await req.json().catch(() => ({}))) as { type?: string }
  const type = (body?.type || "oracle").toLowerCase()
  const valid = ["neuro", "oracle", "hunter", "defense"]
  const kind = (valid.includes(type) ? type : "oracle") as "neuro" | "oracle" | "hunter" | "defense"

  const now = Date.now()
  const etaMs = 3500 + rand(3500)

  const paths = Array.from({ length: 6 + rand(6) }).map(() => ({
    from: `node-${100 + rand(900)}`,
    to: `node-${100 + rand(900)}`,
    risk: 0.4 + Math.random() * 0.6,
  }))

  const runbooks = [
    "ssh-hardening-zero-trust",
    "nginx-502-reverse-proxy",
    "jwt-rotation-and-revocation",
    "cloudflare-waf-block-tokens",
    "s3-bucket-public-access-lockdown",
  ]

  const result = {
    id: `${now}-${rand(9999)}`,
    type: kind,
    etaMs,
    startedAt: now,
    finishedAt: now + etaMs,
    prediction: `Swarm ${kind} identifiziert priorisierte Angriffspfade und empfiehlt sofortige Härtung auf Layer 3 & 7.`,
    runbookSlug: runbooks[rand(runbooks.length)],
    oneClickFixUrl: `/api/fix/apply?mode=quick&ts=${now}`,
    paths,
  }

  const res = NextResponse.json(result)
  // If Daypass: increment quota cookie for today
  if (access.plan === "daypass") {
    try {
      const today = new Date()
      const ymd = `${today.getUTCFullYear()}-${String(today.getUTCMonth() + 1).padStart(2, "0")}-${String(today.getUTCDate()).padStart(2, "0")}`
      const quotaRaw = cookies().get("swarm_quota")?.value || ""
      const [date, countStr] = quotaRaw.split(":")
      const prev = date === ymd ? (Number(countStr || "0") || 0) : 0
      const next = `${ymd}:${prev + 1}`
      // Expire in ~27h to be safe across TZ
      const expires = new Date(Date.now() + 27 * 60 * 60 * 1000)
      res.cookies.set("swarm_quota", next, { httpOnly: false, sameSite: "lax", secure: true, path: "/", expires })
    } catch {}
  }
  return res
}
