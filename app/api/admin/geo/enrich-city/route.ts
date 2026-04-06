// Admin API for enriching individual city data
// Used by China Mega Expansion and other content enrichment workflows

import { NextRequest, NextResponse } from "next/server"
import { Client } from "pg"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { city_slug, title, summary, tags, clawScore, content_depth, local_relevance, technical_accuracy } = body

    if (!city_slug || !title || !summary || !tags || !clawScore) {
      return NextResponse.json(
        { error: "Missing required fields: city_slug, title, summary, tags, clawScore" },
        { status: 400 }
      )
    }

    // Verify admin secret
    const adminSecret = request.headers.get("Authorization")?.replace("Bearer ", "")
    if (adminSecret !== process.env.GEO_ADMIN_SECRET) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const client = new Client({
      connectionString: process.env.DATABASE_URL,
    })

    await client.connect()

    try {
      // Update geo_cities table
      const updateCityQuery = `
        UPDATE geo_cities 
        SET title = $1, summary = $2, tags = $3, claw_score = $4, lastmod = $5
        WHERE city_slug = $6
        RETURNING city_slug, claw_score, title
      `
      
      const cityResult = await client.query(updateCityQuery, [
        title,
        summary, 
        JSON.stringify(tags),
        clawScore,
        new Date().toISOString().split('T')[0],
        city_slug
      ])

      if (cityResult.rows.length === 0) {
        return NextResponse.json(
          { error: `City ${city_slug} not found` },
          { status: 404 }
        )
      }

      // Insert/update quality metrics
      const qualityScore = Math.min(95, clawScore - 2) // Quality score slightly lower than claw score
      const qualityQuery = `
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
      
      const qualityResult = await client.query(qualityQuery, [
        city_slug,
        qualityScore,
        content_depth || 85,
        local_relevance || 90,
        technical_accuracy || 88,
        new Date().toISOString()
      ])

      await client.end()

      return NextResponse.json({
        success: true,
        city: cityResult.rows[0],
        quality: qualityResult.rows[0],
        message: `City ${city_slug} enriched successfully`
      })

    } finally {
      await client.end()
    }

  } catch (error) {
    console.error("Error enriching city:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  // Get current enrichment status for a city
  const { searchParams } = new URL(request.url)
  const city_slug = searchParams.get("city_slug")

  if (!city_slug) {
    return NextResponse.json(
      { error: "city_slug parameter required" },
      { status: 400 }
    )
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  })

  try {
    await client.connect()

    const query = `
      SELECT c.city_slug, c.title, c.summary, c.tags, c.claw_score, c.lastmod,
             q.quality_score, q.content_depth, q.local_relevance, q.technical_accuracy, q.last_updated
      FROM geo_cities c
      LEFT JOIN geo_city_quality_metrics q ON c.city_slug = q.city_slug
      WHERE c.city_slug = $1
    `

    const result = await client.query(query, [city_slug])
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: `City ${city_slug} not found` },
        { status: 404 }
      )
    }

    const city = result.rows[0]
    
    return NextResponse.json({
      city_slug: city.city_slug,
      title: city.title,
      summary: city.summary,
      tags: Array.isArray(city.tags) ? city.tags : JSON.parse(city.tags || '[]'),
      claw_score: city.claw_score,
      lastmod: city.lastmod,
      quality_metrics: city.quality_score ? {
        quality_score: city.quality_score,
        content_depth: city.content_depth,
        local_relevance: city.local_relevance,
        technical_accuracy: city.technical_accuracy,
        last_updated: city.last_updated
      } : null
    })

  } catch (error) {
    console.error("Error getting city enrichment:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    )
  } finally {
    await client.end()
  }
}
