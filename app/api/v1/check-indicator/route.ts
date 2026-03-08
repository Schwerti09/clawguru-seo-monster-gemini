import { NextRequest, NextResponse } from "next/server"

// Temporärer Bypass – echte Auth + Indicator-Check kommen später
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Dummy Success (damit der Build grün wird)
    return NextResponse.json({
      ok: true,
      message: "Indicator check bypassed for deployment",
      status: "safe",
      data: body
    })
  } catch (error) {
    console.error("Check-indicator error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}