import { NextResponse } from "next/server"
import { dbQuery } from "@/lib/db"
import { verifyAccessToken } from "@/lib/access-token"

/**
 * Phase 5 Schritt 82 — White Label Roasts — B2B Integration
 * White-label roast widget API for enterprise customers
 * Requires valid access token with team/enterprise plan
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

    // Check if user has pro plan
    if (authResult.plan !== "pro") {
      return NextResponse.json(
        { error: "Forbidden: White-label widget requires pro plan" },
        { status: 403 }
      )
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get("customerId") || authResult.customerId
    const limit = parseInt(searchParams.get("limit") || "10")

    // Validate parameters
    if (limit < 1 || limit > 50) {
      return NextResponse.json(
        { error: "Invalid limit: must be between 1 and 50" },
        { status: 400 }
      )
    }

    // Fetch roast results for this customer (filtered by user_id if available)
    let query = `
      SELECT 
        id,
        stack_summary,
        score,
        roast_level,
        weaknesses,
        fixes,
        created_at
      FROM roast_results
    `
    const params: any[] = []

    if (customerId) {
      query += ` WHERE user_id = $1`
      params.push(customerId)
    }

    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`
    params.push(limit)

    const results = await dbQuery(query, params)

    // Calculate statistics
    const statsResult = await dbQuery(
      `SELECT 
        COUNT(*) as total_roasts,
        AVG(score) as avg_score,
        COUNT(CASE WHEN score >= 90 THEN 1 END) as elite_count
       FROM roast_results
       ${customerId ? `WHERE user_id = $1` : ""}`,
      customerId ? [customerId] : []
    )

    const stats = statsResult.rows[0] || {
      total_roasts: 0,
      avg_score: 0,
      elite_count: 0,
    }

    // Return white-label widget data
    return NextResponse.json({
      customerId,
      stats: {
        totalRoasts: parseInt(stats.total_roasts || "0"),
        avgScore: parseFloat(stats.avg_score || "0"),
        eliteCount: parseInt(stats.elite_count || "0"),
      },
      roasts: results.rows.map((row: any) => ({
        id: row.id,
        stackSummary: row.stack_summary,
        score: row.score,
        roastLevel: row.roast_level,
        weaknesses: row.weaknesses ? JSON.parse(row.weaknesses) : [],
        fixes: row.fixes ? JSON.parse(row.fixes) : [],
        createdAt: row.created_at,
      })),
      meta: {
        fetchedAt: new Date().toISOString(),
        widgetVersion: "1.0.0",
      },
    })
  } catch (error) {
    console.error("API Error: white-label roast-widget", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST endpoint for embedding widget configuration
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

    // Check if user has pro plan
    if (authResult.plan !== "pro") {
      return NextResponse.json(
        { error: "Forbidden: White-label widget requires pro plan" },
        { status: 403 }
      )
    }

    const body = await request.json()

    // Validate configuration
    const { theme, showScore, showWeaknesses, showFixes, customBranding } = body || {}

    // Store widget configuration (would be saved to a dedicated table in production)
    // For now, return the configuration as confirmation
    return NextResponse.json({
      success: true,
      configuration: {
        customerId: authResult.customerId,
        theme: theme || "dark",
        showScore: showScore !== false,
        showWeaknesses: showWeaknesses !== false,
        showFixes: showFixes !== false,
        customBranding: customBranding || null,
      },
      embedCode: generateEmbedCode(authResult.customerId, theme || "dark"),
    })
  } catch (error) {
    console.error("API Error: white-label roast-widget POST", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

function generateEmbedCode(customerId: string, theme: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
  return `<script src="${baseUrl}/widget/roast.js" data-customer-id="${customerId}" data-theme="${theme}"></script>
<div id="clawguru-roast-widget"></div>`
}
