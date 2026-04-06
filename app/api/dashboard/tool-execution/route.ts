import { NextRequest, NextResponse } from "next/server"
import { parseDashboardPrincipal } from "@/lib/dashboard-identity"
import { dbQuery } from "@/lib/db"
import { canExecuteMore, getUserTierFromPlan, type UserTier } from "@/lib/tier-access"
import { runSecurityHeaderCheck } from "@/lib/security-check-core"
import { allowBurstDistributed } from "@/lib/rate-limit"
import { logTelemetry } from "@/lib/ops/telemetry"

export const runtime = "nodejs"

const ALLOWED_TOOLS = new Set(["summon", "oracle", "neuro", "check"])

const TOOL_THREAT_COPY: Record<string, { title: string }> = {
  summon: { title: "ClawGuru Summon — Runbook-Analyse abgeschlossen" },
  oracle: { title: "Security Oracle — Runbook-Report erstellt" },
  neuro: { title: "Neuro Security — Pattern-Analyse abgeschlossen" },
  check: { title: "Security Check — Header-Audit durchgeführt" },
}

// ── Real tool implementations ─────────────────────────────────────────────────

async function runCheckTool(target: string): Promise<Record<string, unknown>> {
  const effectiveTarget = target.trim() || "clawguru.org"
  try {
    const checkResult = await runSecurityHeaderCheck(effectiveTarget)
    return {
      type: "security_header_check",
      ...checkResult,
    }
  } catch {
    return {
      type: "security_header_check",
      target: effectiveTarget,
      error: "Check failed (timeout or unreachable)",
      score: 0,
      vulnerable: true,
      details: ["Could not reach target"],
      recommendations: ["Ensure the target is reachable and try again"],
    }
  }
}

async function runOracleTool(customerKey: string): Promise<Record<string, unknown>> {
  // Return top runbooks by quality from geo_variant_matrix as security intel
  const rows = await dbQuery<{ base_slug: string; quality_score: number; local_title: string; country_code: string }>(
    `SELECT DISTINCT ON (base_slug) base_slug, quality_score, local_title, country_code
     FROM geo_variant_matrix
     WHERE locale = 'en' AND quality_score >= 85
     ORDER BY base_slug, quality_score DESC
     LIMIT 5`
  ).catch(() => ({ rows: [] }))
  const execCount = await dbQuery<{ count: string }>(
    `SELECT COUNT(*)::text AS count FROM runbook_executions WHERE customer_id = $1`,
    [customerKey]
  ).catch(() => ({ rows: [{ count: "0" }] }))
  return {
    type: "oracle_report",
    generatedAt: new Date().toISOString(),
    topRunbooks: rows.rows.map(r => ({
      slug: r.base_slug,
      title: r.local_title,
      score: r.quality_score,
    })),
    yourExecutionCount: parseInt(execCount.rows[0]?.count || "0", 10),
    recommendation: rows.rows.length > 0
      ? `Top runbook: ${rows.rows[0].base_slug} (Q${rows.rows[0].quality_score})`
      : "Run your first security check to generate recommendations.",
  }
}

async function runSummonTool(customerKey: string): Promise<Record<string, unknown>> {
  const recent = await dbQuery<{ runbook_id: string; status: string; created_at: string }>(
    `SELECT runbook_id, status, created_at
     FROM runbook_executions WHERE customer_id = $1
     ORDER BY created_at DESC LIMIT 10`,
    [customerKey]
  ).catch(() => ({ rows: [] }))
  const threatCount = await dbQuery<{ count: string }>(
    `SELECT COUNT(*)::text AS count FROM threats WHERE customer_id = $1 AND status = 'active'`,
    [customerKey]
  ).catch(() => ({ rows: [{ count: "0" }] }))
  const runs = recent.rows
  const completed = runs.filter(r => r.status === "completed").length
  const successRate = runs.length > 0 ? Math.round((completed / runs.length) * 100) : 0
  return {
    type: "summon_posture",
    generatedAt: new Date().toISOString(),
    recentRuns: runs.length,
    successRate,
    activeThreats: parseInt(threatCount.rows[0]?.count || "0", 10),
    lastRunbook: runs[0]?.runbook_id ?? null,
    posture: successRate >= 80 ? "GOOD" : successRate >= 50 ? "MEDIUM" : runs.length === 0 ? "NO_DATA" : "NEEDS_ATTENTION",
  }
}

async function runNeuroTool(customerKey: string): Promise<Record<string, unknown>> {
  const stats = await dbQuery<{ runbook_id: string; status: string; cnt: string }>(
    `SELECT runbook_id, status, COUNT(*)::text AS cnt
     FROM runbook_executions WHERE customer_id = $1
     GROUP BY runbook_id, status
     ORDER BY cnt DESC LIMIT 10`,
    [customerKey]
  ).catch(() => ({ rows: [] }))
  const nodeCount = await dbQuery<{ count: string }>(
    `SELECT COUNT(*)::text AS count FROM mycelium_nodes WHERE customer_id = $1 AND status = 'active'`,
    [customerKey]
  ).catch(() => ({ rows: [{ count: "0" }] }))
  const patterns = stats.rows
  const topTool = patterns.find(p => p.status === "completed")?.runbook_id ?? null
  return {
    type: "neuro_pattern_analysis",
    generatedAt: new Date().toISOString(),
    activeNodes: parseInt(nodeCount.rows[0]?.count || "0", 10),
    patternSummary: patterns.slice(0, 5).map(p => ({
      tool: p.runbook_id,
      status: p.status,
      count: parseInt(p.cnt, 10),
    })),
    dominantTool: topTool,
    insight: topTool
      ? `Most executed tool: ${topTool}. ${parseInt(patterns[0]?.cnt || "0", 10)} total runs detected.`
      : "No execution patterns yet. Run your first tool to generate insights.",
  }
}

const RUN_MAX_PER_WINDOW = 20
const RUN_WINDOW_SECS = 60

function burstKey(req: NextRequest, customerKey: string): string {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  return `${ip}:${customerKey}`
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

  const bKey = burstKey(req, principal.customerKey)
  if (!(await allowBurstDistributed(bKey, RUN_MAX_PER_WINDOW, RUN_WINDOW_SECS))) {
    logTelemetry("tool_execution.rate_limited", { customerKey: principal.customerKey })
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 })
  }

  let body: { toolId?: string; target?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 })
  }

  const toolId = typeof body.toolId === "string" ? body.toolId.trim() : ""
  const target = typeof body.target === "string" ? body.target.trim().slice(0, 256) : ""
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

  // ── Run the real tool and collect the deliverable ──────────────────────────
  const startedAt = new Date().toISOString()
  let toolResult: Record<string, unknown>
  try {
    if (toolId === "check") {
      toolResult = await runCheckTool(target)
    } else if (toolId === "oracle") {
      toolResult = await runOracleTool(principal.customerKey)
    } else if (toolId === "summon") {
      toolResult = await runSummonTool(principal.customerKey)
    } else {
      toolResult = await runNeuroTool(principal.customerKey)
    }
  } catch {
    toolResult = { type: toolId, error: "Tool execution failed internally" }
  }

  const finishedAt = new Date().toISOString()
  const result = {
    toolId,
    startedAt,
    finishedAt,
    status: "completed" as const,
    deliverable: toolResult,
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

    const threatTitle = TOOL_THREAT_COPY[toolId]?.title ?? `Tool-Lauf abgeschlossen (${toolId})`
    await dbQuery(
      `INSERT INTO threats (title, description, severity, status, customer_id)
       VALUES ($1, $2, 'low', 'active', $3)`,
      [
        threatTitle,
        `Ausführung ${execution.id} um ${finishedAt}. Details unter Executions / Mycelium.`,
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
    logTelemetry("tool_execution.error", {
      customerKey: principal.customerKey,
      toolId,
      error: e instanceof Error ? e.message : String(e),
    })
    console.error("[tool-execution]", e)
    return NextResponse.json({ ok: false, error: "db_error" }, { status: 500 })
  }
}
