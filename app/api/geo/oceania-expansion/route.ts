import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { dbQuery } from '@/lib/db';

// Oceania Expansion Cities (Quality >= 85) - matching Africa/MEA schema
const EXPANSION_CITIES = [
  // Australia
  { slug: 'sydney', name_de: 'Sydney', name_en: 'Sydney', country_code: 'AU', priority: 95, population: 5312000, quality: 91 },
  { slug: 'melbourne', name_de: 'Melbourne', name_en: 'Melbourne', country_code: 'AU', priority: 94, population: 5049000, quality: 90 },
  // Australia (Round 12 addition)
  { slug: 'brisbane', name_de: 'Brisbane', name_en: 'Brisbane', country_code: 'AU', priority: 92, population: 2560000, quality: 87 },
  // New Zealand
  { slug: 'auckland', name_de: 'Auckland', name_en: 'Auckland', country_code: 'NZ', priority: 93, population: 1718000, quality: 89 }
];

const BASE_SLUGS = ["aws-nginx-hardening-2026", "aws-ssh-hardening-2026", "gcp-kubernetes-rbac-misconfig-2026"];
const LOCALES = ["de", "en"];

function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}

function hasSecret(req: NextRequest): boolean {
  const expected = process.env.GEO_EXPANSION_SECRET || "";
  if (!expected) return false;
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : auth;
  return token === expected;
}

export async function GET(request: NextRequest) {
  if (!hasSecret(request)) return unauthorized();
  
  try {
    const stable = request.nextUrl.searchParams.get("stable") === "1";
    const rolloutStage = stable ? "stable" : "canary";
    const results = [];

    for (const city of EXPANSION_CITIES) {
      try {
        // 1. Insert/update geo_cities - exact Africa/MEA schema
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
        );

        // 2. Insert quality into geo_variant_matrix - exact Africa/MEA schema
        for (const locale of LOCALES) {
          for (const baseSlug of BASE_SLUGS) {
            const variantSlug = `${baseSlug}-${city.slug}`;
            const localTitle = `${city.name_en} Security Hardening - ${baseSlug.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())}`;
            
            try {
              await dbQuery(
                `INSERT INTO geo_variant_matrix (locale, base_slug, city_slug, variant_slug, city_name, region_name, country_code, local_title, local_summary, quality_score)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                 ON CONFLICT (locale, variant_slug) DO UPDATE SET
                   quality_score = EXCLUDED.quality_score,
                   local_title = EXCLUDED.local_title,
                   local_summary = EXCLUDED.local_summary,
                   updated_at = NOW()`,
                [
                  locale,
                  baseSlug,
                  city.slug,
                  variantSlug,
                  city.name_en,
                  city.name_en,
                  city.country_code,
                  localTitle,
                  `${localTitle} - Professional security guide for ${city.name_en} region`,
                  city.quality
                ]
              );
            } catch (variantError) {
              console.error(`Failed to insert variant ${locale}-${baseSlug}-${city.slug}:`, variantError);
              // Continue with other variants even if one fails
            }
          }
        }

        results.push({
          slug: city.slug,
          name_en: city.name_en,
          country: city.country_code,
          quality: city.quality,
          rollout: rolloutStage,
          status: 'READY'
        });

      } catch (error) {
        console.error(`Failed to process city ${city.slug}:`, error);
        results.push({
          slug: city.slug,
          name_en: city.name_en,
          country: city.country_code,
          quality: city.quality,
          rollout: rolloutStage,
          status: 'ERROR',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    // Revalidate geo-cities cache
    revalidateTag('geo-cities-active');

    return NextResponse.json({
      success: true,
      message: `Oceania Expansion completed (${rolloutStage})`,
      results,
      summary: {
        total: EXPANSION_CITIES.length,
        successful: results.filter(r => r.status === 'READY').length,
        failed: results.filter(r => r.status === 'ERROR').length
      }
    });

  } catch (error) {
    console.error('Oceania expansion failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
