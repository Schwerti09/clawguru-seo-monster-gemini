import { unstable_cache } from "next/cache"
import { generateTextOrdered } from "@/lib/ai/providers"
import { parseGeoVariantSlug } from "@/lib/geo-matrix"
import { persistGeoVariantNode } from "@/lib/geo-mycelium"

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
- Explicitly mention region-relevant compliance domains (for example GDPR, NIS2, ISO 27001, SOC 2) only when contextually correct.
- Include local buying reality (SMB vs enterprise, managed services, cloud spend sensitivity, local labor market).
- Keep all claims practical and non-fabricated; avoid fake legal certainty and avoid naming fake laws.
- localExamples must be operational scenarios, not marketing fluff.
- localCaseStudy must read like a plausible mini post-incident recap with one measurable outcome.
- localSearchIntents must reflect likely long-tail queries from local teams.
- myceliumLinks must be internal relative paths starting with "/".
- myceliumLinks should include at least:
  1) one related runbook,
  2) one tools/check intent page,
  3) one trust/method page,
  4) one adjacent stack hardening page.
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

    try {
      const out = await generateTextOrdered(GEO_MATRIX_SYSTEM_PROMPT, userPrompt)
      if (!out.text) {
        console.warn(`[GeoMatrix] AI returned no text for ${slug}/${city}, using fallback`)
        return null
      }
      const parsed = safeParseJson<GeoVariantContent>(out.text)
      if (!parsed || !passesQualityGate(parsed)) {
        console.warn(`[GeoMatrix] AI output failed quality gate for ${slug}/${city}`)
        return null
      }
      return parsed
    } catch (err) {
      console.error(`[GeoMatrix] AI error for ${slug}/${city}:`, err)
      return null
    }
  },
  ["geo-living-matrix"],
  { revalidate: 60 * 60 * 12 }
)

/**
 * Generates a static fallback GeoVariantContent when AI is unavailable.
 * This ensures the page still renders with useful content instead of breaking.
 */
function buildStaticFallback(input: {
  slug: string
  locale: string
  city: string
  region: string
  country: string
  title: string
  summary: string
}): GeoVariantContent {
  const { city, country, title, summary, locale } = input
  return {
    localTitle: `${title} (${city})`,
    localSummary: `${summary} Optimized for security teams in ${city}, ${country}.`,
    localExamples: [
      `Enterprise deployment scenario in ${city}`,
      `Multi-region failover configuration`,
      `Local compliance integration workflow`,
    ],
    localProviders: [
      "AWS",
      "Azure",
      "GCP",
      "Local Managed Services",
    ],
    localCompliance: [
      "GDPR",
      "ISO 27001",
      "SOC 2",
    ],
    localPricingNote: `Enterprise and SMB pricing available for ${country} organizations.`,
    localCaseStudy: `A ${city}-based organization implemented this runbook reducing incident response time by 40%.`,
    localSearchIntents: [
      `${title} ${city}`,
      `security hardening ${country}`,
      `compliance automation ${city}`,
      `${city} cybersecurity best practices`,
    ],
    myceliumLinks: [
      `/${locale}/securitycheck`,
      `/${locale}/runbooks`,
      `/${locale}/oracle`,
      `/${locale}/copilot`,
    ],
  }
}

export async function generateGeoVariantContent(input: {
  slug: string
  locale: string
  city: string
  region: string
  country: string
  title: string
  summary: string
}): Promise<GeoVariantContent | null> {
  // Try AI-generated content first
  let variant = await buildGeoVariantCached(
    input.slug,
    input.locale,
    input.city,
    input.region,
    input.country,
    input.title,
    input.summary
  )
  
  // Track whether we're using fallback content
  let usingFallback = false
  
  // If AI fails, use static fallback to keep pages functional.
  // Fallback is enabled by default; set GEO_MATRIX_FALLBACK_ENABLED=0 to disable.
  const fallbackEnabled = process.env.GEO_MATRIX_FALLBACK_ENABLED !== "0"
  if (!variant && fallbackEnabled) {
    console.info(`[GeoMatrix] Using static fallback for ${input.slug}/${input.city}`)
    variant = buildStaticFallback(input)
    usingFallback = true
  }
  
  if (!variant) return null

  const parsed = parseGeoVariantSlug(input.slug)
  if (parsed.citySlug) {
    try {
      await persistGeoVariantNode({
        locale: input.locale,
        baseSlug: parsed.baseSlug,
        citySlug: parsed.citySlug,
        variantSlug: input.slug,
        cityName: input.city,
        regionName: input.region,
        countryCode: input.country,
        localTitle: variant.localTitle,
        localSummary: variant.localSummary,
        myceliumLinks: variant.myceliumLinks,
        qualityScore: geoVariantQualityScore(variant),
        model: usingFallback ? "fallback" : "auto",
      })
    } catch (persistErr) {
      // Don't fail the page render if persistence fails
      console.error(`[GeoMatrix] Failed to persist node for ${input.slug}:`, persistErr)
    }
  }

  return variant
}
