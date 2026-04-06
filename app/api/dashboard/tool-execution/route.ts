import { NextRequest, NextResponse } from "next/server"
import { parseDashboardPrincipal } from "@/lib/dashboard-identity"
import { dbQuery } from "@/lib/db"
import { canExecuteMore, getUserTierFromPlan, type UserTier } from "@/lib/tier-access"

export const runtime = "nodejs"

const ALLOWED_TOOLS = new Set(["summon", "oracle", "neuro", "check"])

const RUN_WINDOW_MS = 60_000
const RUN_MAX_PER_WINDOW = 20
const runBurst = new Map<string, { count: number; windowStart: number }>()

function burstKey(req: NextRequest, customerKey: string): string {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  return `${ip}:${customerKey}`
}

function allowBurst(key: string): boolean {
  const now = Date.now()
  const row = runBurst.get(key)
  if (!row || now - row.windowStart > RUN_WINDOW_MS) {
    runBurst.set(key, { count: 1, windowStart: now })
    return true
  }
  if (row.count >= RUN_MAX_PER_WINDOW) return false
  row.count++
  return true
}

async function executionCountThisMonth(customerKey: string): Promise<number> {
  const r = await dbQuery<{ count: string }>(
    `SELECT COUNT(*)::text AS count FROM runbook_executions
     WHERE customer_id = $1 AND created_at >= date_trunc('month', NOW() AT TIME ZONE 'UTC')`,
    [customerKey]
  )
  return parseInt(r.rows[0]?.count || "0", 10)
}

export async function POST(req: NextRequest) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ ok: false, error: "database_unconfigured" }, { status: 503 })
  }

  const principal = parseDashboardPrincipal(req.cookies)
  if (!principal) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 })
  }

  if (!allowBurst(burstKey(req, principal.customerKey))) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 })
  }

  let body: { toolId?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 })
  }

  const toolId = typeof body.toolId === "string" ? body.toolId.trim() : ""
  if (!toolId || !ALLOWED_TOOLS.has(toolId)) {
    return NextResponse.json({ ok: false, error: "invalid_tool" }, { status: 400 })
  }

  const tier: UserTier = getUserTierFromPlan(principal.plan)
  const used = await executionCountThisMonth(principal.customerKey)
  if (!canExecuteMore(tier, used)) {
    return NextResponse.json(
      { ok: false, error: "execution_limit", limit: used },
      { status: 403 }
    )
  }

  const finishedAt = new Date().toISOString()
  const result = {
    toolId,
    finishedAt,
    status: "completed" as const,
    message: `Tool "${toolId}" completed successfully.`,
  }

  try {
    const execRow = await dbQuery<{ id: string; created_at: string }>(
      `INSERT INTO runbook_executions (customer_id, runbook_id, status, started_at, completed_at, result)
       VALUES ($1, $2, 'completed', NOW(), NOW(), $3::jsonb)
       RETURNING id::text, created_at::text`,
      [principal.customerKey, toolId, JSON.stringify(result)]
    )

    const execution = execRow.rows[0]
    if (!execution) {
      return NextResponse.json({ ok: false, error: "insert_failed" }, { status: 500 })
    }

    await dbQuery(
      `INSERT INTO mycelium_nodes (type, status, connections, metadata, customer_id)
       VALUES ($1, 'active', '[]'::jsonb, $2::jsonb, $3)`,
      [
        toolId === "check" ? "runbook" : toolId === "oracle" ? "oracle" : toolId === "neuro" ? "neuro" : "runbook",
        JSON.stringify({
          toolId,
          executionId: execution.id,
          label: toolId,
          lastRun: finishedAt,
        }),
        principal.customerKey,
      ]
    )

    return NextResponse.json({
      ok: true,
      execution: {
        id: execution.id,
        runbook_id: toolId,
        status: "completed",
        created_at: execution.created_at,
        result,
      },
    })
  } catch (e) {
    console.error("[tool-execution]", e)
    return NextResponse.json({ ok: false, error: "db_error" }, { status: 500 })
  }
}
