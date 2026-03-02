import { NextRequest, NextResponse } from "next/server"
import { mutateSeoTitle } from "@/app/lib/seo-optimizer"

export const runtime = "edge"
export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  const payload = await req.json().catch(() => null)
  if (!payload?.title || typeof payload.title !== "string") {
    return NextResponse.json({ error: "Missing title" }, { status: 400 })
  }

  const trendKeywords = Array.isArray(payload.trendKeywords)
    ? payload.trendKeywords.filter((keyword: unknown) => typeof keyword === "string")
    : []

  const title = mutateSeoTitle({ title: payload.title, trendKeywords })

  return NextResponse.json({ title })
}
