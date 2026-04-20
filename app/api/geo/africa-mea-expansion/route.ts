// Africa (Egypt, Nigeria, Kenya, South Africa, Morocco, Ghana, Tunisia) + Middle East (UAE, Turkey, Saudi Arabia, Israel, Qatar) + Oceania (Australia, New Zealand) Expansion
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
  // AFRICA
  { slug: "cairo", name_de: "Kairo", name_en: "Cairo", country_code: "EG", priority: 90, population: 9840000, quality: 87 },
  { slug: "lagos", name_de: "Lagos", name_en: "Lagos", country_code: "NG", priority: 85, population: 14862000, quality: 86 },
  { slug: "nairobi", name_de: "Nairobi", name_en: "Nairobi", country_code: "KE", priority: 83, population: 4734000, quality: 85 },
  { slug: "johannesburg", name_de: "Johannesburg", name_en: "Johannesburg", country_code: "ZA", priority: 88, population: 5635000, quality: 88 },
  { slug: "casablanca", name_de: "Casablanca", name_en: "Casablanca", country_code: "MA", priority: 80, population: 3356000, quality: 85 },
  { slug: "cape-town", name_de: "Kapstadt", name_en: "Cape Town", country_code: "ZA", priority: 85, population: 4618000, quality: 86 },
  { slug: "accra", name_de: "Accra", name_en: "Accra", country_code: "GH", priority: 75, population: 2847000, quality: 85 },
  { slug: "tunis", name_de: "Tunis", name_en: "Tunis", country_code: "TN", priority: 75, population: 1063000, quality: 85 },
  // MIDDLE EAST
  { slug: "dubai", name_de: "Dubai", name_en: "Dubai", country_code: "AE", priority: 95, population: 3331000, quality: 92 },
  { slug: "istanbul", name_de: "Istanbul", name_en: "Istanbul", country_code: "TR", priority: 92, population: 15519000, quality: 91 },
  { slug: "riyadh", name_de: "Riad", name_en: "Riyadh", country_code: "SA", priority: 88, population: 7685000, quality: 88 },
  { slug: "tel-aviv", name_de: "Tel Aviv", name_en: "Tel Aviv", country_code: "IL", priority: 88, population: 4678000, quality: 90 },
  { slug: "doha", name_de: "Doha", name_en: "Doha", country_code: "QA", priority: 82, population: 2445000, quality: 86 },
  { slug: "abu-dhabi", name_de: "Abu Dhabi", name_en: "Abu Dhabi", country_code: "AE", priority: 85, population: 1483000, quality: 87 },
  // OCEANIA
  { slug: "sydney", name_de: "Sydney", name_en: "Sydney", country_code: "AU", priority: 92, population: 5312000, quality: 90 },
  { slug: "melbourne", name_de: "Melbourne", name_en: "Melbourne", country_code: "AU", priority: 90, population: 5093000, quality: 89 },
  { slug: "auckland", name_de: "Auckland", name_en: "Auckland", country_code: "NZ", priority: 82, population: 1657000, quality: 87 },
  { slug: "brisbane", name_de: "Brisbane", name_en: "Brisbane", country_code: "AU", priority: 83, population: 2561000, quality: 86 },
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
      message: "Africa + MEA + Oceania Expansion completed",
      results,
      summary: {
        total: results.length,
        ready: results.filter(r => r.status === "READY").length,
        by_country: byCountry,
        rollout: rolloutStage,
      },
    })
  } catch (error: any) {
    console.error("Africa + MEA + Oceania Expansion error:", error)
    return NextResponse.json({ error: "Failed", details: error.message }, { status: 500 })
  }
}
