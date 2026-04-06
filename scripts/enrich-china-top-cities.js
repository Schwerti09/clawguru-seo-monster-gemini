// China Mega Expansion - Content Enrichment Script
// Priority #1: Beijing, Shanghai, Guangzhou, Shenzhen

const { Client } = require("pg")

const CHINA_TOP_CITIES = [
  {
    city_slug: "beijing",
    title: "Beijing Security Operations Center",
    summary: "Leading cybersecurity solutions for Beijing's financial district and tech enterprises. Specialized in Chinese compliance and regulatory frameworks.",
    tags: ["china", "beijing", "cybersecurity", "compliance", "financial-services", "tech-hub"],
    clawScore: 88,
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    city_slug: "shanghai", 
    title: "Shanghai Security Operations Center",
    summary: "Advanced security operations for Shanghai's international business district and fintech companies. Expert in cross-border data protection.",
    tags: ["china", "shanghai", "cybersecurity", "fintech", "international-business", "data-protection"],
    clawScore: 89,
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    city_slug: "guangzhou",
    title: "Guangzhou Security Operations Center", 
    summary: "Comprehensive security solutions for Guangzhou's manufacturing and logistics sectors. Specialized in industrial cybersecurity and supply chain protection.",
    tags: ["china", "guangzhou", "cybersecurity", "manufacturing", "logistics", "industrial-security"],
    clawScore: 87,
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    city_slug: "shenzhen",
    title: "Shenzhen Security Operations Center",
    summary: "Cutting-edge security operations for Shenzhen's tech innovation hub and startup ecosystem. Expert in cloud security and emerging technologies.",
    tags: ["china", "shenzhen", "cybersecurity", "tech-hub", "startups", "cloud-security", "innovation"],
    clawScore: 90,
    lastmod: new Date().toISOString().split('T')[0]
  }
]

async function enrichChinaCities() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  })

  try {
    await client.connect()
    console.log("🔗 Connected to database")

    for (const city of CHINA_TOP_CITIES) {
      console.log(`🚀 Enriching ${city.city_slug}...`)
      
      // Update geo_cities table
      const updateCityQuery = `
        UPDATE geo_cities 
        SET title = $1, summary = $2, tags = $3, claw_score = $4, lastmod = $5
        WHERE city_slug = $6
      `
      
      await client.query(updateCityQuery, [
        city.title,
        city.summary, 
        city.tags,
        city.clawScore,
        city.lastmod,
        city.city_slug
      ])

      // Insert quality metrics
      const qualityQuery = `
        INSERT INTO geo_city_quality_metrics (city_slug, quality_score, content_depth, local_relevance, technical_accuracy, last_updated)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (city_slug) DO UPDATE SET
          quality_score = EXCLUDED.quality_score,
          content_depth = EXCLUDED.content_depth,
          local_relevance = EXCLUDED.local_relevance,
          technical_accuracy = EXCLUDED.technical_accuracy,
          last_updated = EXCLUDED.last_updated
      `
      
      await client.query(qualityQuery, [
        city.city_slug,
        city.clawScore - 2, // Quality score slightly lower than claw score
        85, // Content depth
        90, // Local relevance for Chinese market
        88, // Technical accuracy
        new Date().toISOString()
      ])

      console.log(`✅ ${city.city_slug} enriched with quality ${city.clawScore}`)
    }

    console.log("🎉 China Mega Expansion completed!")
    
    // Verify the enrichment
    const verifyQuery = `
      SELECT city_slug, claw_score, title 
      FROM geo_cities 
      WHERE city_slug IN ('beijing', 'shanghai', 'guangzhou', 'shenzhen')
      ORDER BY claw_score DESC
    `
    
    const result = await client.query(verifyQuery)
    console.log("\n📊 Verification Results:")
    result.rows.forEach(row => {
      console.log(`  ${row.city_slug}: ${row.claw_score} - ${row.title}`)
    })

  } catch (error) {
    console.error("❌ Error enriching China cities:", error)
    throw error
  } finally {
    await client.end()
  }
}

// Run the enrichment
if (require.main === module) {
  enrichChinaCities()
    .then(() => {
      console.log("🚀 China Mega Expansion ready for traffic!")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ Failed to enrich China cities:", error)
      process.exit(1)
    })
}

module.exports = { enrichChinaCities, CHINA_TOP_CITIES }
