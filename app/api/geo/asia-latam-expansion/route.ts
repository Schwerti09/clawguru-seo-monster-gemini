// Asia (Japan, South Korea, Southeast Asia) + LatAm (Brazil, Mexico) Expansion
// Schema: geo_cities (slug, name_de, name_en, country_code, priority, population, is_active, rollout_stage)
//         geo_variant_matrix (locale, base_slug, city_slug, variant_slug, city_name, region_name, country_code, local_title, local_summary, quality_score)
import { revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"
import { dbQuery } from "@/lib/db"
import { invalidateGeoCitiesCache } from "@/lib/geo-cities"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"
export const maxDuration = 60

function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 })
}

function hasSecret(req: NextRequest): boolean {
  const expected =
    process.env.GEO_EXPANSION_SECRET ||
    process.env.GEO_REVALIDATE_SECRET ||
    ""
  if (!expected) return false
  const auth = req.headers.get("authorization") || ""
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : auth
  return token === expected
}

const EXPANSION_CITIES = [
  // Japan
  { slug: "tokyo",         name_de: "Tokio",          name_en: "Tokyo",          country_code: "JP", priority: 96, population: 13960000, quality: 88 },
  { slug: "osaka",         name_de: "Osaka",          name_en: "Osaka",          country_code: "JP", priority: 90, population: 2691000,  quality: 87 },
  { slug: "yokohama",      name_de: "Yokohama",       name_en: "Yokohama",       country_code: "JP", priority: 85, population: 3757000,  quality: 86 },
  { slug: "nagoya",        name_de: "Nagoya",         name_en: "Nagoya",         country_code: "JP", priority: 83, population: 2296000,  quality: 85 },
  { slug: "sapporo",       name_de: "Sapporo",        name_en: "Sapporo",        country_code: "JP", priority: 80, population: 1973000,  quality: 85 },
  // South Korea
  { slug: "seoul",         name_de: "Seoul",          name_en: "Seoul",          country_code: "KR", priority: 95, population: 9776000,  quality: 88 },
  { slug: "busan",         name_de: "Busan",          name_en: "Busan",          country_code: "KR", priority: 84, population: 3414000,  quality: 86 },
  { slug: "incheon",       name_de: "Incheon",        name_en: "Incheon",        country_code: "KR", priority: 81, population: 2954000,  quality: 85 },
  { slug: "daegu",         name_de: "Daegu",          name_en: "Daegu",          country_code: "KR", priority: 78, population: 2419000,  quality: 85 },
  { slug: "daejeon",       name_de: "Daejeon",        name_en: "Daejeon",        country_code: "KR", priority: 76, population: 1476000,  quality: 85 },
  // Brazil
  { slug: "saopaulo",      name_de: "São Paulo",      name_en: "São Paulo",      country_code: "BR", priority: 95, population: 12325000, quality: 87 },
  { slug: "riodejaneiro",  name_de: "Rio de Janeiro", name_en: "Rio de Janeiro", country_code: "BR", priority: 92, population: 6748000,  quality: 87 },
  { slug: "brasilia",      name_de: "Brasília",       name_en: "Brasilia",       country_code: "BR", priority: 84, population: 3094000,  quality: 86 },
  { slug: "belohorizonte", name_de: "Belo Horizonte", name_en: "Belo Horizonte", country_code: "BR", priority: 82, population: 2530000,  quality: 85 },
  { slug: "curitiba",      name_de: "Curitiba",       name_en: "Curitiba",       country_code: "BR", priority: 79, population: 1948000,  quality: 85 },
  // Mexico
  { slug: "mexicocity",    name_de: "Mexiko-Stadt",   name_en: "Mexico City",    country_code: "MX", priority: 96, population: 9209000,  quality: 88 },
  { slug: "guadalajara",   name_de: "Guadalajara",    name_en: "Guadalajara",    country_code: "MX", priority: 86, population: 1460000,  quality: 86 },
  { slug: "monterrey",     name_de: "Monterrey",      name_en: "Monterrey",      country_code: "MX", priority: 85, population: 1135000,  quality: 86 },
  { slug: "puebla",        name_de: "Puebla",         name_en: "Puebla",         country_code: "MX", priority: 78, population: 1692000,  quality: 85 },
  { slug: "tijuana",       name_de: "Tijuana",        name_en: "Tijuana",        country_code: "MX", priority: 76, population: 1300000,  quality: 85 },
  // Southeast Asia
  { slug: "bangkok",       name_de: "Bangkok",        name_en: "Bangkok",        country_code: "TH", priority: 93, population: 10539000, quality: 87 },
  { slug: "singapore",     name_de: "Singapur",       name_en: "Singapore",      country_code: "SG", priority: 94, population: 5804000,  quality: 89 },
  { slug: "jakarta",       name_de: "Jakarta",        name_en: "Jakarta",        country_code: "ID", priority: 92, population: 10562000, quality: 87 },
  { slug: "manila",        name_de: "Manila",         name_en: "Manila",         country_code: "PH", priority: 89, population: 13923000, quality: 86 },
  { slug: "hochiminhcity", name_de: "Ho-Chi-Minh-Stadt", name_en: "Ho Chi Minh City", country_code: "VN", priority: 87, population: 9077000, quality: 86 },
  { slug: "kualalumpur",   name_de: "Kuala Lumpur",   name_en: "Kuala Lumpur",   country_code: "MY", priority: 88, population: 1808000,  quality: 87 },
  { slug: "hanoi",         name_de: "Hanoi",          name_en: "Hanoi",          country_code: "VN", priority: 83, population: 8246000,  quality: 85 },
]

const BASE_SLUGS = ["aws-nginx-hardening-2026", "aws-ssh-hardening-2026", "gcp-kubernetes-rbac-misconfig-2026"]
const LOCALES = ["de", "en"]

export async function GET(request: NextRequest) {
  if (!hasSecret(request)) return unauthorized()
  try {
    const stable = request.nextUrl.searchParams.get("stable") === "1"
    const countryFilter = request.nextUrl.searchParams.get("country")?.toUpperCase() ?? null
    const rolloutStage = stable ? "stable" : "canary"

    const cities = countryFilter
      ? EXPANSION_CITIES.filter(c => c.country_code === countryFilter)
      : EXPANSION_CITIES

    const results = []

    for (const city of cities) {
      // 1. Insert/update geo_cities
      await dbQuery(
        `INSERT INTO geo_cities (slug, name_de, name_en, country_code, priority, population, is_active, rollout_stage)
         VALUES ($1, $2, $3, $4, $5, $6, TRUE, $7)
         ON CONFLICT (slug) DO UPDATE SET
           name_de = EXCLUDED.name_de,
           name_en = EXCLUDED.name_en,
           country_code = EXCLUDED.country_code,
           priority = EXCLUDED.priority,
           population = EXCLUDED.population,
           is_active = TRUE,
           rollout_stage = $7,
           updated_at = NOW()`,
        [city.slug, city.name_de, city.name_en, city.country_code, city.priority, city.population, rolloutStage]
      )

      // 2. Insert quality into geo_variant_matrix
      for (const locale of LOCALES) {
        for (const baseSlug of BASE_SLUGS) {
          const variantSlug = `${baseSlug}-${city.slug}`
          const localTitle = `${city.name_en} Security Hardening – ${baseSlug.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())}`
          const localSummary = `Security hardening runbook for ${city.name_en}, ${city.country_code}. Compliance-ready guide for ${baseSlug} environments in ${city.name_en}.`

          await dbQuery(
            `INSERT INTO geo_variant_matrix (locale, base_slug, city_slug, variant_slug, city_name, region_name, country_code, local_title, local_summary, quality_score)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
             ON CONFLICT (locale, variant_slug) DO UPDATE SET
               quality_score = EXCLUDED.quality_score,
               local_title = EXCLUDED.local_title,
               local_summary = EXCLUDED.local_summary,
               updated_at = NOW()`,
            [locale, baseSlug, city.slug, variantSlug, city.name_en, city.name_en, city.country_code, localTitle, localSummary, city.quality]
          )
        }
      }

      results.push({
        slug: city.slug,
        name_en: city.name_en,
        country: city.country_code,
        quality: city.quality,
        rollout: rolloutStage,
        status: city.quality >= 85 ? "READY" : "NEEDS_WORK",
      })
    }

    const byCountry = results.reduce<Record<string, number>>((acc, r) => {
      acc[r.country] = (acc[r.country] ?? 0) + 1
      return acc
    }, {})

    await invalidateGeoCitiesCache()
    revalidateTag("geo-cities-active")

    return NextResponse.json({
      success: true,
      message: "Asia + LatAm Expansion completed",
      results,
      summary: {
        total: results.length,
        ready: results.filter(r => r.status === "READY").length,
        by_country: byCountry,
        rollout: rolloutStage,
      },
    })
  } catch (error: any) {
    console.error("Asia + LatAm Expansion error:", error)
    return NextResponse.json({ error: "Failed", details: error.message }, { status: 500 })
  }
}
