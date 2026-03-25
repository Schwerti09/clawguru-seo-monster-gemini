import { NextResponse } from "next/server"
import { getSocialProofEvents } from "@/lib/social-proof"

export const runtime = "nodejs"

export async function GET() {
  const events = getSocialProofEvents()
  return NextResponse.json(
    { events },
    {
      headers: {
        "Cache-Control": "public, max-age=30, s-maxage=30, stale-while-revalidate=300",
      },
    }
  )
}
