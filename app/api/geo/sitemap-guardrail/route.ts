import { NextRequest, NextResponse } from "next/server"
import { BASE_URL } from "@/lib/config"
import {
  getDefaultGeoSitemapRuntimeLimits,
  getGeoSitemapRuntimeLimits,
  setGeoSitemapRuntimeLimits,
} from "@/lib/geo-runtime-config"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function intEnv(name: string, fallback: number, min: number, max: number): number {
  const parsed = parseInt(process.env[name] || "", 10)
  if (!Number.isFinite(parsed)) return fallback
  return Math.max(min, Math.min(max, parsed))
}

function hasSecret(req: NextRequest): boolean {
  const expected =
    process.env.GEO_SITEMAP_GUARDRAIL_SECRET ||
    process.env.GEO_EXPANSION_SECRET ||
    process.env.GEO_AUTO_PRUNE_SECRET ||
    process.env.GEO_REVALIDATE_SECRET ||
    ""
  if (!expected) return false
  const auth = req.headers.get("authorization") || ""
  const bearer = auth.startsWith("Bearer ") ? auth.slice(7) : ""
  const header = req.headers.get("x-geo-guardrail-secret") || ""
  const query = req.nextUrl.searchParams.get("secret") || ""
  const provided = bearer || header || query
  return provided === expected
}

function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 })
}

export async function GET(req: NextRequest) {
  if (!hasSecret(req)) return unauthorized()
  const current = await getGeoSitemapRuntimeLimits()
  const defaults = getDefaultGeoSitemapRuntimeLimits()
  return NextResponse.json({
    ok: true,
    defaults,
    current,
  })
}

export async function POST(req: NextRequest) {
  if (!hasSecret(req)) return unauthorized()

  const dryRun = req.nextUrl.searchParams.get("dryRun") !== "0"
  const locale = (req.nextUrl.searchParams.get("locale") || process.env.GEO_SITEMAP_GUARDRAIL_LOCALE || "de").toLowerCase()
  const slug = req.nextUrl.searchParams.get("slug") || process.env.GEO_SITEMAP_GUARDRAIL_SLUG || "aws-ssh-hardening-2026"
  const probeLimit = intEnv("GEO_SITEMAP_GUARDRAIL_PROBE_LIMIT", 12, 1, 24)

  const minScore = intEnv("GEO_SITEMAP_GUARDRAIL_MIN_SCORE", 75, 1, 100)
  const recoveryScore = intEnv("GEO_SITEMAP_GUARDRAIL_RECOVERY_SCORE", 88, minScore, 100)
  const conservativeCityLimit = intEnv("GEO_SITEMAP_GUARDRAIL_CONSERVATIVE_CITY_LIMIT", 10, 1, 80)
  const conservativeCityPool = intEnv("GEO_SITEMAP_GUARDRAIL_CONSERVATIVE_CITY_POOL", 24, conservativeCityLimit, 240)
  const conservativeSeedLimit = intEnv("GEO_SITEMAP_GUARDRAIL_CONSERVATIVE_SEED_LIMIT", 4, 1, 20)

  const healthUrl = new URL(`${BASE_URL}/api/geo/index-health`)
  healthUrl.searchParams.set("locale", locale)
  healthUrl.searchParams.set("slug", slug)
  healthUrl.searchParams.set("limit", String(probeLimit))
  const healthRes = await fetch(healthUrl.toString(), {
    cache: "no-store",
    signal: AbortSignal.timeout(12_000),
  })
  const healthJson = await healthRes.json().catch(() => null)
  if (!healthJson || typeof healthJson.score !== "number") {
    return NextResponse.json({ ok: false, error: "index-health unavailable" }, { status: 502 })
  }

  const defaults = getDefaultGeoSitemapRuntimeLimits()
  const current = await getGeoSitemapRuntimeLimits()
  const score = Number(healthJson.score || 0)

  let target = current
  let reason = "hold"
  if (score < minScore) {
    target = {
      mode: "conservative",
      cityLimit: Math.min(defaults.cityLimit, conservativeCityLimit),
      cityPool: Math.min(defaults.cityPool, conservativeCityPool),
      seedLimit: Math.min(defaults.seedLimit, conservativeSeedLimit),
      reason: `score<${minScore}`,
    }
    reason = "switch-to-conservative"
  } else if (score >= recoveryScore) {
    target = {
      mode: "normal",
      cityLimit: defaults.cityLimit,
      cityPool: defaults.cityPool,
      seedLimit: defaults.seedLimit,
      reason: `score>=${recoveryScore}`,
    }
    reason = "restore-normal"
  }

  const changed =
    target.mode !== current.mode ||
    target.cityLimit !== current.cityLimit ||
    target.cityPool !== current.cityPool ||
    target.seedLimit !== current.seedLimit ||
    target.reason !== current.reason

  let applied = current
  if (!dryRun && changed) {
    applied = await setGeoSitemapRuntimeLimits(target)
  }

  return NextResponse.json({
    ok: true,
    dryRun,
    changed,
    action: reason,
    score,
    minScore,
    recoveryScore,
    indexHealth: {
      locale,
      slug,
      probeLimit,
      healthyCities: healthJson.healthyCities,
      totalCities: healthJson.totalCities,
      durationMs: healthJson.durationMs,
    },
    current,
    target,
    applied,
  })
}
