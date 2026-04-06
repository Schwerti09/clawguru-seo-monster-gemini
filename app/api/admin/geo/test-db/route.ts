// Test DB connection for debugging China Mega Expansion
import { NextRequest, NextResponse } from "next/server"
import { Client } from "pg"

export async function GET() {
  try {
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
    })

    await client.connect()
    
    // Test simple query
    const result = await client.query("SELECT COUNT(*) as count FROM geo_cities")
    await client.end()

    return NextResponse.json({
      success: true,
      count: result.rows[0].count,
      message: "DB connection successful"
    })

  } catch (error) {
    console.error("DB test error:", error)
    return NextResponse.json(
      { 
        error: "DB connection failed", 
        details: error.message,
        env_set: !!process.env.DATABASE_URL
      },
      { status: 500 }
    )
  }
}
