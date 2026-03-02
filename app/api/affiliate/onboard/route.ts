import { NextResponse } from "next/server"
import { upsertAffiliateProfile } from "@/lib/affiliate-store"

export async function POST(req: Request) {
  let payload: { name?: string; slug?: string } | null = null
  try {
    payload = await req.json()
  } catch {
    payload = null
  }

  const name = typeof payload?.name === "string" ? payload.name.trim() : ""
  const slug = typeof payload?.slug === "string" ? payload.slug.trim() : undefined
  if (!name || name.length < 2) {
    return NextResponse.json({ error: "Partner name required" }, { status: 400 })
  }

  try {
    const profile = upsertAffiliateProfile(name, slug)
    return NextResponse.json({
      slug: profile.slug,
      url: `/affiliate/${profile.slug}`,
      keyword: profile.keyword,
    })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 })
  }
}
