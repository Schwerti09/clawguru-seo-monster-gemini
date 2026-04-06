// Global Expansion - USA, India, Russia
// Schema: geo_cities (slug, name_de, name_en, country_code, priority, population, is_active, rollout_stage)
//         geo_variant_matrix (locale, base_slug, city_slug, variant_slug, city_name, region_name, country_code, local_title, local_summary, quality_score)
import { revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"
import { dbQuery } from "@/lib/db"
import { invalidateGeoCitiesCache } from "@/lib/geo-cities"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"
export const maxDuration = 60

const EXPANSION_CITIES = [
  // USA
  { slug: "losangeles",    name_de: "Los Angeles",    name_en: "Los Angeles",    country_code: "US", priority: 93, population: 3979000, quality: 87 },
  { slug: "chicago",       name_de: "Chicago",        name_en: "Chicago",        country_code: "US", priority: 91, population: 2696000, quality: 88 },
  { slug: "houston",       name_de: "Houston",        name_en: "Houston",        country_code: "US", priority: 88, population: 2304000, quality: 86 },
  { slug: "phoenix",       name_de: "Phoenix",        name_en: "Phoenix",        country_code: "US", priority: 84, population: 1608000, quality: 85 },
  { slug: "philadelphia",  name_de: "Philadelphia",   name_en: "Philadelphia",   country_code: "US", priority: 83, population: 1584000, quality: 85 },
  { slug: "sanantonio",    name_de: "San Antonio",    name_en: "San Antonio",    country_code: "US", priority: 80, population: 1434000, quality: 85 },
  { slug: "sandiego",      name_de: "San Diego",      name_en: "San Diego",      country_code: "US", priority: 81, population: 1386000, quality: 85 },
  { slug: "dallas",        name_de: "Dallas",         name_en: "Dallas",         country_code: "US", priority: 85, population: 1304000, quality: 86 },
  { slug: "seattle",       name_de: "Seattle",        name_en: "Seattle",        country_code: "US", priority: 86, population: 737000,  quality: 87 },
  { slug: "austin",        name_de: "Austin",         name_en: "Austin",         country_code: "US", priority: 82, population: 961000,  quality: 86 },
  // India
  { slug: "mumbai",        name_de: "Mumbai",         name_en: "Mumbai",         country_code: "IN", priority: 94, population: 20667000, quality: 87 },
  { slug: "delhi",         name_de: "Delhi",          name_en: "Delhi",          country_code: "IN", priority: 93, population: 32941000, quality: 87 },
  { slug: "bangalore",     name_de: "Bangalore",      name_en: "Bangalore",      country_code: "IN", priority: 92, population: 13193000, quality: 88 },
  { slug: "hyderabad",     name_de: "Hyderabad",      name_en: "Hyderabad",      country_code: "IN", priority: 88, population: 10268000, quality: 86 },
  { slug: "chennai",       name_de: "Chennai",        name_en: "Chennai",        country_code: "IN", priority: 87, population: 10971000, quality: 86 },
  { slug: "kolkata",       name_de: "Kalkutta",       name_en: "Kolkata",        country_code: "IN", priority: 85, population: 14974000, quality: 85 },
  { slug: "pune",          name_de: "Pune",           name_en: "Pune",           country_code: "IN", priority: 84, population: 7765000,  quality: 85 },
  { slug: "ahmedabad",     name_de: "Ahmedabad",      name_en: "Ahmedabad",      country_code: "IN", priority: 82, population: 8253000,  quality: 85 },
  // Russia
  { slug: "moscow",        name_de: "Moskau",         name_en: "Moscow",         country_code: "RU", priority: 92, population: 12506000, quality: 87 },
  { slug: "stpetersburg",  name_de: "Sankt Petersburg", name_en: "St. Petersburg", country_code: "RU", priority: 88, population: 5384000, quality: 86 },
  { slug: "novosibirsk",   name_de: "Nowosibirsk",    name_en: "Novosibirsk",    country_code: "RU", priority: 78, population: 1620000,  quality: 85 },
  { slug: "yekaterinburg", name_de: "Jekaterinburg",  name_en: "Yekaterinburg",  country_code: "RU", priority: 76, population: 1495000,  quality: 85 },
  { slug: "kazan",         name_de: "Kasan",          name_en: "Kazan",          country_code: "RU", priority: 74, population: 1257000,  quality: 85 },
]

const BASE_SLUGS = ["aws-nginx-hardening-2026", "aws-ssh-hardening-2026", "gcp-kubernetes-rbac-misconfig-2026"]
const LOCALES = ["de", "en"]

export async function GET(request: NextRequest) {
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
          const localSummary = `Security hardening runbook for ${city.name_en}, ${city.country_code}. Compliance-ready guide for ${baseSlug} environments.`

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

      results.push({ slug: city.slug, name_en: city.name_en, country: city.country_code, quality: city.quality, rollout: rolloutStage, status: city.quality >= 85 ? "READY" : "NEEDS_WORK" })
      console.log(`✅ ${city.slug} (${city.country_code}) seeded as ${rolloutStage}`)
    }

    const byCountry = results.reduce<Record<string, number>>((acc, r) => {
      acc[r.country] = (acc[r.country] ?? 0) + 1
      return acc
    }, {})

    // Invalidate all geo-cities cache layers so new cities appear immediately
    await invalidateGeoCitiesCache()
    revalidateTag("geo-cities-active")

    return NextResponse.json({
      success: true,
      message: "Global Expansion completed",
      results,
      summary: {
        total: results.length,
        ready: results.filter(r => r.status === "READY").length,
        by_country: byCountry,
        rollout: rolloutStage,
      }
    })

  } catch (error: any) {
    console.error("Global Expansion error:", error)
    return NextResponse.json({ error: "Failed", details: error.message }, { status: 500 })
  }
}
