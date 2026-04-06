// Direct China Mega Expansion - Seed cities via SQL
// This script creates the China cities if they don't exist and updates their quality metrics

const { Client } = require("pg")

const CHINA_CITIES = [
  {
    city_slug: "beijing",
    name_de: "Peking", 
    name_en: "Beijing",
    country_code: "CN",
    priority: 95,
    population: 21540000,
    title: "Beijing Security Operations Center",
    summary: "Leading cybersecurity solutions for Beijing's financial district and tech enterprises. Specialized in Chinese compliance and regulatory frameworks.",
    tags: ["china", "beijing", "cybersecurity", "compliance", "financial-services", "tech-hub"],
    clawScore: 88,
    content_depth: 85,
    local_relevance: 90,
    technical_accuracy: 88
  },
  {
    city_slug: "shanghai",
    name_de: "Shanghai",
    name_en: "Shanghai", 
    country_code: "CN",
    priority: 94,
    population: 24280000,
    title: "Shanghai Security Operations Center",
    summary: "Advanced security operations for Shanghai's international business district and fintech companies. Expert in cross-border data protection.",
    tags: ["china", "shanghai", "cybersecurity", "fintech", "international-business", "data-protection"],
    clawScore: 89,
    content_depth: 86,
    local_relevance: 91,
    technical_accuracy: 89
  },
  {
    city_slug: "guangzhou",
    name_de: "Kanton",
    name_en: "Guangzhou",
    country_code: "CN", 
    priority: 88,
    population: 15300000,
    title: "Guangzhou Security Operations Center",
    summary: "Comprehensive security solutions for Guangzhou's manufacturing and logistics sectors. Specialized in industrial cybersecurity and supply chain protection.",
    tags: ["china", "guangzhou", "cybersecurity", "manufacturing", "logistics", "industrial-security"],
    clawScore: 87,
    content_depth: 84,
    local_relevance: 89,
    technical_accuracy: 87
  },
  {
    city_slug: "shenzhen",
    name_de: "Shenzhen",
    name_en: "Shenzhen",
    country_code: "CN",
    priority: 89,
    population: 17560000,
    title: "Shenzhen Security Operations Center", 
    summary: "Cutting-edge security operations for Shenzhen's tech innovation hub and startup ecosystem. Expert in cloud security and emerging technologies.",
    tags: ["china", "shenzhen", "cybersecurity", "tech-hub", "startups", "cloud-security", "innovation"],
    clawScore: 90,
    content_depth: 87,
    local_relevance: 92,
    technical_accuracy: 90
  }
]

async function seedChinaCities() {
  console.log("🚀 Starting China Mega Expansion - Direct DB Seed...")
  
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  })

  try {
    await client.connect()
    console.log("✅ Connected to database")

    for (const city of CHINA_CITIES) {
      console.log(`🔧 Processing ${city.city_slug}...`)
      
      // Insert/update city in geo_cities
      const upsertCityQuery = `
        INSERT INTO geo_cities (city_slug, name_de, name_en, country_code, priority, population, title, summary, tags, claw_score, lastmod, rollout_stage)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'canary')
        ON CONFLICT (city_slug) DO UPDATE SET
          title = EXCLUDED.title,
          summary = EXCLUDED.summary,
          tags = EXCLUDED.tags,
          claw_score = EXCLUDED.claw_score,
          lastmod = EXCLUDED.lastmod,
          rollout_stage = EXCLUDED.rollout_stage
        RETURNING city_slug, claw_score, title
      `
      
      const cityResult = await client.query(upsertCityQuery, [
        city.city_slug,
        city.name_de,
        city.name_en,
        city.country_code,
        city.priority,
        city.population,
        city.title,
        city.summary,
        JSON.stringify(city.tags),
        city.clawScore,
        new Date().toISOString().split('T')[0]
      ])
      
      console.log(`✅ City updated: ${cityResult.rows[0].city_slug} (score: ${cityResult.rows[0].claw_score})`)
      
      // Insert/update quality metrics
      const qualityScore = Math.min(95, city.clawScore - 2)
      const upsertQualityQuery = `
        INSERT INTO geo_city_quality_metrics (city_slug, quality_score, content_depth, local_relevance, technical_accuracy, last_updated)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (city_slug) DO UPDATE SET
          quality_score = EXCLUDED.quality_score,
          content_depth = EXCLUDED.content_depth,
          local_relevance = EXCLUDED.local_relevance,
          technical_accuracy = EXCLUDED.technical_accuracy,
          last_updated = EXCLUDED.last_updated
        RETURNING city_slug, quality_score
      `
      
      const qualityResult = await client.query(upsertQualityQuery, [
        city.city_slug,
        qualityScore,
        city.content_depth,
        city.local_relevance,
        city.technical_accuracy,
        new Date().toISOString()
      ])
      
      console.log(`✅ Quality metrics updated: ${qualityResult.rows[0].city_slug} (quality: ${qualityResult.rows[0].quality_score})`)
    }
    
    // Verify results
    console.log("\n📊 Verifying China Mega Expansion...")
    const verifyQuery = `
      SELECT c.city_slug, c.claw_score, c.title, q.quality_score, q.content_depth, q.local_relevance, q.technical_accuracy
      FROM geo_cities c
      LEFT JOIN geo_city_quality_metrics q ON c.city_slug = q.city_slug
      WHERE c.city_slug IN ('beijing', 'shanghai', 'guangzhou', 'shenzhen')
      ORDER BY c.claw_score DESC
    `
    
    const verifyResult = await client.query(verifyQuery)
    
    console.log("\n🎉 China Mega Expansion Results:")
    for (const row of verifyResult.rows) {
      const quality = Math.min(row.quality_score, row.content_depth, row.local_relevance, row.technical_accuracy)
      const status = quality >= 85 ? "✅ READY" : "⚠️  NEEDS WORK"
      console.log(`  ${row.city_slug}: ClawScore ${row.claw_score}, Quality ${quality} ${status}`)
    }
    
  } catch (error) {
    console.error("❌ Error seeding China cities:", error)
    throw error
  } finally {
    await client.end()
    console.log("🔌 Database connection closed")
  }
  
  console.log("\n🎉 China Mega Expansion completed!")
}

if (require.main === module) {
  seedChinaCities().catch(console.error)
}

module.exports = { seedChinaCities }
