import { unstable_cache } from "next/cache"
import { generateTextOrdered } from "@/lib/ai/providers"

export type GeoVariantContent = {
  localTitle: string
  localSummary: string
  localExamples: string[]
  localProviders: string[]
  localCompliance: string[]
  localPricingNote: string
  localCaseStudy: string
  localSearchIntents: string[]
  myceliumLinks: string[]
}

export function geoVariantQualityScore(v: GeoVariantContent): number {
  let score = 0
  if (v.localTitle?.length >= 20) score += 15
  if (v.localSummary?.length >= 90) score += 20
  if (Array.isArray(v.localExamples) && v.localExamples.length >= 3) score += 15
  if (Array.isArray(v.localProviders) && v.localProviders.length >= 3) score += 10
  if (Array.isArray(v.localCompliance) && v.localCompliance.length >= 3) score += 10
  if (Array.isArray(v.localSearchIntents) && v.localSearchIntents.length >= 4) score += 15
  if (Array.isArray(v.myceliumLinks) && v.myceliumLinks.length >= 4) score += 10
  if (v.myceliumLinks?.every((x) => typeof x === "string" && x.startsWith("/"))) score += 5
  return Math.min(100, score)
}

function safeParseJson<T>(text: string): T | null {
  try {
    return JSON.parse(text) as T
  } catch {
    return null
  }
}

function passesQualityGate(v: GeoVariantContent): boolean {
  const min = Math.max(55, Math.min(95, parseInt(process.env.GEO_MATRIX_MIN_QUALITY || "72", 10) || 72))
  if (geoVariantQualityScore(v) < min) return false
  if (!v.localTitle || v.localTitle.length < 16) return false
  if (!v.localSummary || v.localSummary.length < 60) return false
  if (!Array.isArray(v.localExamples) || v.localExamples.length < 3) return false
  if (!Array.isArray(v.localProviders) || v.localProviders.length < 2) return false
  if (!Array.isArray(v.localCompliance) || v.localCompliance.length < 2) return false
  if (!Array.isArray(v.localSearchIntents) || v.localSearchIntents.length < 3) return false
  if (!Array.isArray(v.myceliumLinks) || v.myceliumLinks.length < 2) return false
  if (v.myceliumLinks.some((x) => typeof x !== "string" || !x.startsWith("/"))) return false
  return true
}

export const GEO_MATRIX_SYSTEM_PROMPT = `
You are ClawGuru Geo-Living Matrix, an elite cyber-ops localization engine.
Return ONLY strict JSON (no markdown) with this exact shape:
{
  "localTitle": "string",
  "localSummary": "string",
  "localExamples": ["string","string","string"],
  "localProviders": ["string","string","string"],
  "localCompliance": ["string","string","string"],
  "localPricingNote": "string",
  "localCaseStudy": "string",
  "localSearchIntents": ["string","string","string","string"],
  "myceliumLinks": ["string","string","string","string"]
}

Rules:
- Highly specific to the provided city/region/country and locale.
- Include realistic regional provider references and compliance context.
- Keep all claims practical and non-fabricated; avoid fake legal certainty.
- localExamples must be operational scenarios, not marketing fluff.
- localSearchIntents must reflect likely long-tail queries from local teams.
- myceliumLinks must be internal relative paths starting with "/".
- concise, high-signal, actionable.
`.trim()

const buildGeoVariantCached = unstable_cache(
  async (
    slug: string,
    locale: string,
    city: string,
    region: string,
    country: string,
    title: string,
    summary: string
  ): Promise<GeoVariantContent | null> => {
    const userPrompt = `
Create a hyper-localized security runbook variant.

Context:
- locale: ${locale}
- city: ${city}
- region: ${region}
- country: ${country}
- runbook_slug: ${slug}
- base_title: ${title}
- base_summary: ${summary}

Prioritize:
1) local cloud/provider landscape
2) local compliance and enterprise constraints
3) city-specific operational realities
4) strong internal-link suggestions for topical depth
`.trim()

    const out = await generateTextOrdered(GEO_MATRIX_SYSTEM_PROMPT, userPrompt, "gemini")
    if (!out.text) return null
    const parsed = safeParseJson<GeoVariantContent>(out.text)
    if (!parsed || !passesQualityGate(parsed)) return null
    return parsed
  },
  ["geo-living-matrix"],
  { revalidate: 60 * 60 * 12 }
)

export async function generateGeoVariantContent(input: {
  slug: string
  locale: string
  city: string
  region: string
  country: string
  title: string
  summary: string
}) {
  return buildGeoVariantCached(
    input.slug,
    input.locale,
    input.city,
    input.region,
    input.country,
    input.title,
    input.summary
  )
}
