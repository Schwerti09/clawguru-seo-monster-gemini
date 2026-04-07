import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { dbQuery } from '@/lib/db';

// Middle East & Africa Expansion Cities (Quality >= 85)
const EXPANSION_CITIES = [
  // UAE
  { slug: 'dubai', name_de: 'Dubai', name_en: 'Dubai', country_code: 'AE', priority: 96, population: 3400000, quality: 92 },
  // Turkey
  { slug: 'istanbul', name_de: 'Istanbul', name_en: 'Istanbul', country_code: 'TR', priority: 95, population: 15500000, quality: 91 },
  // Saudi Arabia
  { slug: 'riyadh', name_de: 'Riad', name_en: 'Riyadh', country_code: 'SA', priority: 94, population: 7600000, quality: 90 },
  // Israel
  { slug: 'tel-aviv', name_de: 'Tel Aviv', name_en: 'Tel Aviv', country_code: 'IL', priority: 93, population: 4500000, quality: 89 },
  // Qatar
  { slug: 'doha', name_de: 'Doha', name_en: 'Doha', country_code: 'QA', priority: 92, population: 2400000, quality: 88 },
  // Kuwait
  { slug: 'kuwait-city', name_de: 'Kuwait-Stadt', name_en: 'Kuwait City', country_code: 'KW', priority: 91, population: 3000000, quality: 87 },
  // Bahrain
  { slug: 'manama', name_de: 'Manama', name_en: 'Manama', country_code: 'BH', priority: 90, population: 1500000, quality: 86 },
  // Oman
  { slug: 'muscat', name_de: 'Maskat', name_en: 'Muscat', country_code: 'OM', priority: 89, population: 1400000, quality: 85 },
  // Jordan
  { slug: 'amman', name_de: 'Amman', name_en: 'Amman', country_code: 'JO', priority: 88, population: 4000000, quality: 85 },
  // Lebanon
  { slug: 'beirut', name_de: 'Beirut', name_en: 'Beirut', country_code: 'LB', priority: 87, population: 2000000, quality: 85 }
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
        );

        // 2. Insert quality into geo_variant_matrix
        for (const locale of LOCALES) {
          for (const baseSlug of BASE_SLUGS) {
            const variantSlug = `${baseSlug}-${city.slug}`;
            const localTitle = `${city.name_en} Security Hardening - ${baseSlug.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())}`;
            
            try {
              await dbQuery(
                `INSERT INTO geo_variant_matrix (locale, base_slug, city_slug, variant_slug, city_name, region_name, country_code, local_title, local_summary, quality_score)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                 ON CONFLICT (locale, base_slug) DO UPDATE SET
                   city_slug = EXCLUDED.city_slug,
                   variant_slug = EXCLUDED.variant_slug,
                   city_name = EXCLUDED.city_name,
                   region_name = EXCLUDED.region_name,
                   country_code = EXCLUDED.country_code,
                   local_title = EXCLUDED.local_title,
                   local_summary = EXCLUDED.local_summary,
                   quality_score = EXCLUDED.quality_score,
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
      message: `Middle East & Africa Expansion completed (${rolloutStage})`,
      results,
      summary: {
        total: EXPANSION_CITIES.length,
        successful: results.filter(r => r.status === 'READY').length,
        failed: results.filter(r => r.status === 'ERROR').length
      }
    });

  } catch (error) {
    console.error('MEA expansion failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
