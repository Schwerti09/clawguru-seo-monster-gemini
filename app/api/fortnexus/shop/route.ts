import { NextResponse } from "next/server"

export const revalidate = 3600 // refresh once per hour

export async function GET() {
  try {
    const res = await fetch("https://fortnite-api.com/v2/shop/br", {
      next: { revalidate: 3600 },
      headers: { "Accept-Encoding": "gzip" },
    })
    if (!res.ok) {
      return NextResponse.json(
        { error: "Upstream error", status: res.status },
        { status: 502 }
      )
    }
    const data = await res.json()
    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600" },
    })
  } catch {
    return NextResponse.json({ error: "Failed to fetch shop data" }, { status: 500 })
  }
}
