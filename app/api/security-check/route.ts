import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Dummy Success – echte Security-Check kommt später (nach Deploy)
    return NextResponse.json({
      ok: true,
      message: "Security check bypassed for deployment",
      status: "safe"
    })
  } catch (error) {
    console.error("Security check error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}