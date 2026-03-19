import { NextResponse } from "next/server"
import { getAccess } from "@/lib/access"
import { planToTier, getLimits } from "@/lib/feature-gating"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const info = await getAccess()
    const now = Math.floor(Date.now() / 1000)
    if (!info.ok) {
      return NextResponse.json(
        { ok: false, reason: info.reason || "unauthenticated", now },
        { status: 401 }
      )
    }

    const tier = planToTier(info.plan)
    const limits = getLimits(info.plan)

    return NextResponse.json({
      ok: true,
      plan: info.plan,
      tier,
      customerId: info.customerId,
      subscriptionId: info.subscriptionId,
      exp: info.exp,
      now,
      limits,
    })
  } catch (e: unknown) {
    return NextResponse.json(
      { ok: false, reason: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    )
  }
}
