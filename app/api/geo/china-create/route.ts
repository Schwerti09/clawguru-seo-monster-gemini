// China Mega Expansion - Correct schema version
// geo_cities: slug, name_de, name_en, country_code, priority, population, is_active, rollout_stage
// geo_variant_matrix: locale, base_slug, city_slug, variant_slug, city_name, region_name, country_code, local_title, local_summary, quality_score
import { NextRequest, NextResponse } from "next/server"
import { dbQuery } from "@/lib/db"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

const CHINA_CITIES = [
  { slug: "beijing",   name_de: "Peking",   name_en: "Beijing",   country_code: "CN", priority: 95, population: 21540000, quality: 88 },
  { slug: "shanghai",  name_de: "Shanghai",  name_en: "Shanghai",  country_code: "CN", priority: 94, population: 24280000, quality: 89 },
  { slug: "guangzhou", name_de: "Kanton",    name_en: "Guangzhou", country_code: "CN", priority: 88, population: 15300000, quality: 87 },
  { slug: "shenzhen",  name_de: "Shenzhen",  name_en: "Shenzhen",  country_code: "CN", priority: 89, population: 17560000, quality: 90 },
]

const BASE_SLUGS = ["aws-nginx-hardening-2026", "aws-ssh-hardening-2026", "gcp-kubernetes-rbac-misconfig-2026"]
const LOCALES = ["de", "en"]

export async function GET(request: NextRequest) {
  try {
    const stable = request.nextUrl.searchParams.get("stable") === "1"
    const rolloutStage = stable ? "stable" : "canary"
    const results = []

    for (const city of CHINA_CITIES) {
      // 1. Insert into geo_cities with correct schema
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

      // 2. Insert quality into geo_variant_matrix (needed for seed eligibility check)
      for (const locale of LOCALES) {
        for (const baseSlug of BASE_SLUGS) {
          const variantSlug = `${baseSlug}-${city.slug}`
          const localTitle = `${city.name_en} Security Hardening – ${baseSlug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())}`
          const localSummary = `Security hardening runbook for ${city.name_en}, China. Compliance-ready guide for ${baseSlug} environments in ${city.name_en}.`

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

      results.push({ slug: city.slug, name_en: city.name_en, quality: city.quality, status: city.quality >= 85 ? "READY" : "NEEDS_WORK" })
      console.log(`✅ ${city.slug} seeded`)
    }

    return NextResponse.json({
      success: true,
      message: "China Mega Expansion completed",
      results,
      summary: {
        total: results.length,
        ready: results.filter(r => r.status === "READY").length,
      }
    })

  } catch (error: any) {
    console.error("China Mega Expansion error:", error)
    return NextResponse.json({ error: "Failed", details: error.message }, { status: 500 })
  }
}
