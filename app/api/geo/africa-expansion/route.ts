import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { dbQuery } from '@/lib/db';

// Africa Expansion Cities (Quality >= 85)
const EXPANSION_CITIES = [
  // Egypt
  { slug: 'cairo', name_en: 'Cairo', name_de: 'Kairo', country_code: 'EG', quality: 92, priority: 95 },
  // Nigeria
  { slug: 'lagos', name_en: 'Lagos', name_de: 'Lagos', country_code: 'NG', quality: 90, priority: 94 },
  // Kenya
  { slug: 'nairobi', name_en: 'Nairobi', name_de: 'Nairobi', country_code: 'KE', quality: 88, priority: 93 },
  // South Africa
  { slug: 'johannesburg', name_en: 'Johannesburg', name_de: 'Johannesburg', country_code: 'ZA', quality: 91, priority: 92 },
  { slug: 'cape-town', name_en: 'Cape Town', name_de: 'Kapstadt', country_code: 'ZA', quality: 89, priority: 91 },
  // Morocco
  { slug: 'casablanca', name_en: 'Casablanca', name_de: 'Casablanca', country_code: 'MA', quality: 87, priority: 90 },
  // Ghana
  { slug: 'accra', name_en: 'Accra', name_de: 'Accra', country_code: 'GH', quality: 86, priority: 89 },
  // Ethiopia
  { slug: 'addis-ababa', name_en: 'Addis Ababa', name_de: 'Addis Abeba', country_code: 'ET', quality: 85, priority: 88 },
  // Tanzania
  { slug: 'dar-es-salaam', name_en: 'Dar es Salaam', name_de: 'Daressalam', country_code: 'TZ', quality: 85, priority: 87 },
  // Uganda
  { slug: 'kampala', name_en: 'Kampala', name_de: 'Kampala', country_code: 'UG', quality: 85, priority: 86 }
];

const LANGS = ['de','en','es','fr','pt','it','ru','zh','ja','ko','ar','hi','tr','pl','nl'];

function generateCityName(city: any, lang: string): string {
  if (lang === 'de') return city.name_de;
  if (lang === 'fr') {
    const frNames: Record<string, string> = {
      'cairo': 'Le Caire',
      'cape-town': 'Le Cap',
      'addis-ababa': 'Addis-Abeba'
    };
    return frNames[city.slug] || city.name_en;
  }
  if (lang === 'es') {
    const esNames: Record<string, string> = {
      'cairo': 'El Cairo',
      'cape-town': 'Ciudad del Cabo'
    };
    return esNames[city.slug] || city.name_en;
  }
  if (lang === 'pt') {
    const ptNames: Record<string, string> = {
      'cairo': 'Cairo',
      'cape-town': 'Cidade do Cabo'
    };
    return ptNames[city.slug] || city.name_en;
  }
  return city.name_en;
}

function generateCitySlug(city: any, lang: string): string {
  if (lang === 'en') return city.slug;
  return city.slug;
}

export async function GET(request: NextRequest) {
  // Verify GEO_EXPANSION_SECRET
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.substring(7);
  if (token !== process.env.GEO_EXPANSION_SECRET) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const stable = searchParams.get('stable') === '1';

  try {
    const results = [];
    
    for (const city of EXPANSION_CITIES) {
      try {
        // Insert or update city
        await dbQuery(`
          INSERT INTO geo_cities (slug, name_de, name_en, country_code, priority, population, is_active, rollout_stage, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, 0, true, $6, NOW(), NOW())
          ON CONFLICT (slug) DO UPDATE SET
            name_de = EXCLUDED.name_de,
            name_en = EXCLUDED.name_en,
            country_code = EXCLUDED.country_code,
            priority = EXCLUDED.priority,
            is_active = EXCLUDED.is_active,
            rollout_stage = EXCLUDED.rollout_stage,
            updated_at = NOW()
        `, [
          city.slug,
          city.name_de,
          city.name_en,
          city.country_code,
          city.priority,
          stable ? 'stable' : 'canary'
        ]);

        // Generate variants for all languages
        for (const lang of LANGS) {
          const cityName = generateCityName(city, lang);
          const citySlug = generateCitySlug(city, lang);
          
          await dbQuery(`
            INSERT INTO geo_variant_matrix (locale, base_slug, city_slug, quality_score, created_at, updated_at)
            VALUES ($1, $2, $3, $4, NOW(), NOW())
            ON CONFLICT (locale, city_slug) DO UPDATE SET
              base_slug = EXCLUDED.base_slug,
              quality_score = EXCLUDED.quality_score,
              updated_at = NOW()
          `, [lang, city.slug, citySlug, city.quality]);
        }

        results.push({
          slug: city.slug,
          name_en: city.name_en,
          country: city.country_code,
          quality: city.quality,
          rollout: stable ? 'stable' : 'canary',
          status: 'READY'
        });

      } catch (error) {
        console.error(`Failed to process city ${city.slug}:`, error);
        results.push({
          slug: city.slug,
          name_en: city.name_en,
          country: city.country_code,
          quality: city.quality,
          rollout: stable ? 'stable' : 'canary',
          status: 'ERROR',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    // Revalidate geo-cities cache
    revalidateTag('geo-cities-active');

    return NextResponse.json({
      success: true,
      message: `Africa Expansion completed (${stable ? 'stable' : 'canary'})`,
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
