// Simple health check for geo admin APIs
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      env: {
        database_url_set: !!process.env.DATABASE_URL,
        geo_admin_secret_set: !!process.env.GEO_ADMIN_SECRET
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Health check failed", details: error.message },
      { status: 500 }
    )
  }
}
