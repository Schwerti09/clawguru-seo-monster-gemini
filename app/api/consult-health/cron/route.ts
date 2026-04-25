import { NextRequest, NextResponse } from "next/server"
import { getCheckFunnelSnapshotPersistent } from "@/lib/check-funnel"
import {
  consultHealthWebhookEnvSnapshot,
  maybeNotifyConsultHealthAlerts,
} from "@/lib/consult-health-notify"
import { buildProfitFunnel } from "@/lib/profit-funnel"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}

function verifyCronSecret(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (!secret) return true
  const auth = req.headers.get("authorization") ?? ""
  const param = req.nextUrl.searchParams.get("secret") ?? ""
  return auth === `Bearer ${secret}` || param === secret
}

export async function GET(req: NextRequest) {
  if (!verifyCronSecret(req)) return unauthorized()

  const generatedAt = new Date().toISOString()
  const check = await getCheckFunnelSnapshotPersistent()
  const checkoutCompletedParam = Number(req.nextUrl.searchParams.get("checkoutCompleted") ?? 0)
  const checkoutCompleted = Number.isFinite(checkoutCompletedParam) && checkoutCompletedParam > 0
    ? Math.floor(checkoutCompletedParam)
    : 0
  const funnel = buildProfitFunnel(check, checkoutCompleted)
  maybeNotifyConsultHealthAlerts(
    { ...funnel.consultHealth, dominantSourceGroup: funnel.consultDominantSourceGroup },
    { generatedAt }
  )
  const webhookCfg = consultHealthWebhookEnvSnapshot()

  return NextResponse.json({
    ok: true,
    generatedAt,
    notifiedCandidate: funnel.consultHealth.routing.severity !== "info",
    consultHealth: {
      ...funnel.consultHealth,
      webhooksConfigured: webhookCfg,
    },
  })
}
