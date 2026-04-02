import { dbQuery } from "@/lib/db"

type PersistGeoVariantInput = {
  locale: string
  baseSlug: string
  citySlug: string
  variantSlug: string
  cityName: string
  regionName: string
  countryCode: string
  localTitle: string
  localSummary: string
  myceliumLinks: string[]
  qualityScore: number
  model?: string
}

function hasDatabase() {
  return Boolean(process.env.DATABASE_URL)
}

export async function persistGeoVariantNode(input: PersistGeoVariantInput) {
  if (!hasDatabase()) return
  try {
    await dbQuery(
      `INSERT INTO geo_variant_matrix (
         locale, base_slug, city_slug, variant_slug, city_name, region_name, country_code,
         local_title, local_summary, links_json, quality_score, model
       )
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::jsonb,$11,$12)
       ON CONFLICT (locale, variant_slug)
       DO UPDATE SET
         city_name = EXCLUDED.city_name,
         region_name = EXCLUDED.region_name,
         country_code = EXCLUDED.country_code,
         local_title = EXCLUDED.local_title,
         local_summary = EXCLUDED.local_summary,
         links_json = EXCLUDED.links_json,
         quality_score = EXCLUDED.quality_score,
         model = EXCLUDED.model,
         updated_at = NOW()`,
      [
        input.locale,
        input.baseSlug,
        input.citySlug,
        input.variantSlug,
        input.cityName,
        input.regionName,
        input.countryCode,
        input.localTitle,
        input.localSummary,
        JSON.stringify(input.myceliumLinks),
        Math.max(0, Math.min(100, Math.round(input.qualityScore))),
        input.model ?? "gemini",
      ]
    )
  } catch {
    // Never block request rendering on analytics/indexing side effects.
  }
}

function safeInt(input: string | undefined, fallback: number) {
  const parsed = Number.parseInt(input || "", 10)
  if (!Number.isFinite(parsed)) return fallback
  return parsed
}

export async function isGeoVariantIndexable(input: {
  locale: string
  variantSlug: string
  rolloutStage?: "canary" | "stable" | string
}) {
  // Canary should never be indexable.
  if ((input.rolloutStage || "stable") !== "stable") return false
  // Preserve behavior when DB is not configured.
  if (!hasDatabase()) return true

  const minQuality = Math.max(
    55,
    Math.min(100, safeInt(process.env.GEO_AUTO_PROMOTE_MIN_AVG_QUALITY, 84))
  )

  try {
    const res = await dbQuery<{ quality_score: number }>(
      `SELECT quality_score
       FROM geo_variant_matrix
       WHERE locale = $1 AND variant_slug = $2
       ORDER BY updated_at DESC
       LIMIT 1`,
      [input.locale, input.variantSlug]
    )
    if (!res.rows[0]) return false
    return (res.rows[0].quality_score || 0) >= minQuality
  } catch {
    // Fail-open for availability: keep prior behavior on transient DB errors.
    return true
  }
}

