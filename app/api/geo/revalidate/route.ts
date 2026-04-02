import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { buildGeoSlug } from "@/lib/geo-matrix"
import { SUPPORTED_LOCALES } from "@/lib/i18n"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-geo-revalidate-secret") ?? ""
  if (!process.env.GEO_REVALIDATE_SECRET || secret !== process.env.GEO_REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 })
  }

  let body: {
    paths?: string[]
    locale?: string
    slug?: string
    citySlug?: string
    allLocales?: boolean
  } = {}
  try {
    body = await req.json()
  } catch {
    body = {}
  }

  const paths = Array.isArray(body.paths) ? body.paths : []
  const locale = (body.locale || "").toLowerCase()
  const slug = (body.slug || "").toLowerCase()
  const citySlug = (body.citySlug || "").toLowerCase().replace(/[^a-z0-9]/g, "")
  const targets = new Set(paths.filter((p): p is string => typeof p === "string" && p.startsWith("/")))

  if (slug && citySlug) {
    const variantSlug = buildGeoSlug(slug, citySlug)
    const localeList = body.allLocales ? SUPPORTED_LOCALES : locale ? [locale] : [SUPPORTED_LOCALES[0]]
    const locales = localeList.filter((loc) => SUPPORTED_LOCALES.includes(loc as (typeof SUPPORTED_LOCALES)[number]))
    for (const loc of locales) {
      targets.add(`/${loc}/runbook/${variantSlug}`)
      targets.add(`/${loc}/runbook/${slug}`)
      targets.add(`/${loc}/runbooks`)
    }
  }
  for (const p of targets) {
    revalidatePath(p)
  }

  return NextResponse.json({ ok: true, revalidated: targets.size, paths: Array.from(targets) })
}
