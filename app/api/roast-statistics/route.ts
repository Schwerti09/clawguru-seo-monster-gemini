import { NextResponse } from "next/server"
import { dbQuery } from "@/lib/db"

export const revalidate = 60 // Cache for 60 seconds

export async function GET() {
  try {
    // Get total roasts
    const totalResult = await dbQuery(
      `SELECT COUNT(*) as count FROM roast_results`
    )
    const totalRoasts = parseInt(totalResult.rows[0]?.count || "0")

    // Get elite stacks (score >= 90)
    const eliteResult = await dbQuery(
      `SELECT COUNT(*) as count FROM roast_results WHERE score >= 90`
    )
    const eliteStacks = parseInt(eliteResult.rows[0]?.count || "0")

    // Get average score
    const avgResult = await dbQuery(
      `SELECT AVG(score) as avg_score FROM roast_results`
    )
    const avgScore = parseFloat(avgResult.rows[0]?.avg_score || "0")

    // Get roasts today
    const todayResult = await dbQuery(
      `SELECT COUNT(*) as count FROM roast_results WHERE DATE(created_at) = CURRENT_DATE`
    )
    const roastsToday = parseInt(todayResult.rows[0]?.count || "0")

    // Get top 10 scores (Hall of Fame)
    const topScoresResult = await dbQuery(
      `SELECT score, stack_summary, created_at FROM roast_results 
       ORDER BY score DESC, created_at DESC 
       LIMIT 10`
    )

    // Get bottom 10 scores (Hall of Shame)
    const bottomScoresResult = await dbQuery(
      `SELECT score, stack_summary, created_at FROM roast_results 
       ORDER BY score ASC, created_at DESC 
       LIMIT 10`
    )

    return NextResponse.json({
      totalRoasts,
      eliteStacks,
      avgScore: Math.round(avgScore),
      roastsToday,
      topScores: topScoresResult.rows,
      bottomScores: bottomScoresResult.rows,
    })
  } catch (error) {
    console.error("Error fetching roast statistics:", error)
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    )
  }
}
