import { NextResponse } from "next/server"
import { dbQuery } from "@/lib/db"
import { verifyAccessToken } from "@/lib/access-token"

/**
 * Phase 5 Schritt 81 — API Access — „Build on Roast Data"
 * Developer API for accessing roast statistics and results
 * Requires valid access token
 */

export async function GET(request: Request) {
  try {
    // Verify access token
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized: Missing or invalid Authorization header" },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const authResult = await verifyAccessToken(token)
    if (!authResult) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid access token" },
        { status: 401 }
      )
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "100")
    const offset = parseInt(searchParams.get("offset") || "0")
    const minScore = parseInt(searchParams.get("minScore") || "0")
    const maxScore = parseInt(searchParams.get("maxScore") || "100")
    const locale = searchParams.get("locale") || null

    // Validate parameters
    if (limit < 1 || limit > 1000) {
      return NextResponse.json(
        { error: "Invalid limit: must be between 1 and 1000" },
        { status: 400 }
      )
    }

    if (offset < 0) {
      return NextResponse.json(
        { error: "Invalid offset: must be >= 0" },
        { status: 400 }
      )
    }

    if (minScore < 0 || minScore > 100 || maxScore < 0 || maxScore > 100) {
      return NextResponse.json(
        { error: "Invalid score range: must be between 0 and 100" },
        { status: 400 }
      )
    }

    // Build query with filters
    let query = `
      SELECT 
        id,
        stack_summary,
        score,
        roast_level,
        weaknesses,
        fixes,
        locale,
        created_at,
        updated_at
      FROM roast_results
      WHERE score >= $1 AND score <= $2
    `
    const params: any[] = [minScore, maxScore]
    let paramIndex = 3

    if (locale) {
      query += ` AND locale = $${paramIndex}`
      params.push(locale)
      paramIndex++
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`
    params.push(limit, offset)

    // Fetch roast results
    const results = await dbQuery(query, params)

    // Get total count for pagination
    let countQuery = `SELECT COUNT(*) as count FROM roast_results WHERE score >= $1 AND score <= $2`
    const countParams: any[] = [minScore, maxScore]
    let countParamIndex = 3

    if (locale) {
      countQuery += ` AND locale = $${countParamIndex}`
      countParams.push(locale)
    }

    const countResult = await dbQuery(countQuery, countParams)
    const totalCount = parseInt(countResult.rows[0]?.count || "0")

    // Return paginated results
    return NextResponse.json({
      data: results.rows,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount,
      },
      meta: {
        minScore,
        maxScore,
        locale: locale || "all",
        fetchedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("API Error: roast-data", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST endpoint for creating new roast results (authenticated)
export async function POST(request: Request) {
  try {
    // Verify access token
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized: Missing or invalid Authorization header" },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const authResult = await verifyAccessToken(token)
    if (!authResult) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid access token" },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Validate required fields
    if (!body.stack_summary || typeof body.stack_summary !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid stack_summary" },
        { status: 400 }
      )
    }

    if (typeof body.score !== "number" || body.score < 0 || body.score > 100) {
      return NextResponse.json(
        { error: "Invalid score: must be between 0 and 100" },
        { status: 400 }
      )
    }

    if (!body.roast_level || !["mild", "medium", "spicy"].includes(body.roast_level)) {
      return NextResponse.json(
        { error: "Invalid roast_level: must be mild, medium, or spicy" },
        { status: 400 }
      )
    }

    // Insert roast result
    const result = await dbQuery(
      `INSERT INTO roast_results (stack_summary, score, roast_level, weaknesses, fixes, roast_text, top_roasts, locale, ip_address)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, created_at`,
      [
        body.stack_summary.substring(0, 500),
        body.score,
        body.roast_level,
        body.weaknesses ? JSON.stringify(body.weaknesses) : null,
        body.fixes ? JSON.stringify(body.fixes) : null,
        body.roast_text ? body.roast_text.substring(0, 5000) : null,
        body.top_roasts ? JSON.stringify(body.top_roasts) : null,
        body.locale || "de",
        request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || null,
      ]
    )

    return NextResponse.json({
      success: true,
      data: result.rows[0],
    })
  } catch (error) {
    console.error("API Error: roast-data POST", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
