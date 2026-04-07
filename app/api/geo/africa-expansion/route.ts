import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { dbQuery } from '@/lib/db';

// Africa Expansion Cities (Quality >= 85) - matching Asia/LatAm schema
const EXPANSION_CITIES = [
  // Nigeria
  { slug: 'lagos', name_de: 'Lagos', name_en: 'Lagos', country_code: 'NG', priority: 94, population: 14862000, quality: 90 },
  // Kenya
  { slug: 'nairobi', name_de: 'Nairobi', name_en: 'Nairobi', country_code: 'KE', priority: 93, population: 4397073, quality: 88 },
  // South Africa
  { slug: 'johannesburg', name_de: 'Johannesburg', name_en: 'Johannesburg', country_code: 'ZA', priority: 92, population: 5635270, quality: 91 },
  { slug: 'cape-town', name_de: 'Kapstadt', name_en: 'Cape Town', country_code: 'ZA', priority: 91, population: 4618000, quality: 89 },
  // Morocco
  { slug: 'casablanca', name_de: 'Casablanca', name_en: 'Casablanca', country_code: 'MA', priority: 90, population: 3289000, quality: 87 },
  // Ghana
  { slug: 'accra', name_de: 'Accra', name_en: 'Accra', country_code: 'GH', priority: 89, population: 2541000, quality: 86 },
  // Ethiopia
  { slug: 'addis-ababa', name_de: 'Addis Abeba', name_en: 'Addis Ababa', country_code: 'ET', priority: 88, population: 5227000, quality: 85 },
  // Tanzania
  { slug: 'dar-es-salaam', name_de: 'Daressalam', name_en: 'Dar es Salaam', country_code: 'TZ', priority: 87, population: 6739000, quality: 85 },
  // Uganda
  { slug: 'kampala', name_de: 'Kampala', name_en: 'Kampala', country_code: 'UG', priority: 86, population: 3648000, quality: 85 }
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
        // 1. Insert/update geo_cities - exact Asia/LatAm schema
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

        // Skip geo_variant_matrix for debugging
        console.log(`Successfully processed city: ${city.slug}`);

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
      message: `Africa Expansion completed (${rolloutStage})`,
      results,
      summary: {
        total: EXPANSION_CITIES.length,
        successful: results.filter(r => r.status === 'READY').length,
        failed: results.filter(r => r.status === 'ERROR').length
      }
    });

  } catch (error) {
    console.error('Africa expansion failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
