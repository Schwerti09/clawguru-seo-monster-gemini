/**
 * GET /api/user/entitlements
 *
 * Returns the current user's subscription tier and entitlements.
 * Used by client-side ProFeatureGate to determine if user has access.
 * 
 * Returns:
 * - { tier: "free" } for non-authenticated users
 * - { tier: "daypass" | "pro" | "enterprise" | "team" } for authenticated users
 */

import { NextRequest, NextResponse } from "next/server"
import { verifyAccessToken } from "@/lib/access-token"
import { dbQuery } from "@/lib/db"

export const runtime = "nodejs"

export async function GET(req: NextRequest) {
  // Try to get user from access token (cookie or header)
  const token = req.cookies.get("access_token")?.value || 
                req.headers.get("authorization")?.replace("Bearer ", "")
  
  if (!token) {
    // No token = free tier
    return NextResponse.json({ tier: "free" })
  }

  try {
    const payload = verifyAccessToken(token)
    if (!payload?.customerId) {
      return NextResponse.json({ tier: "free" })
    }

    // Check customer entitlements in database
    const res = await dbQuery(
      `SELECT tier FROM customer_entitlements WHERE customer_id = $1 ORDER BY updated_at DESC LIMIT 1`,
      [payload.customerId]
    )

    if (res.rows.length === 0) {
      return NextResponse.json({ tier: "free" })
    }

    const tier = res.rows[0].tier
    return NextResponse.json({ tier })
  } catch (err) {
    console.error("[api/user/entitlements] Error:", err)
    return NextResponse.json({ tier: "free" })
  }
}
