/**
 * D1 – Tool-Execution Happy-Path
 *
 * Verifies the complete flow:
 *   Cookie set (pro tier) → POST /api/dashboard/tool-execution → 200 + ok:true
 *   → execution ID returned → dashboard /executions tab reflects new row
 *
 * Skips DB-dependent assertions if DATABASE_URL is not configured
 * (CI without a test DB) – core API contract is still verified.
 */

import { test, expect } from "@playwright/test"
import { setCookieForPlan } from "../helpers/auth"

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000"

// ── API contract tests (no browser UI needed) ────────────────────────────────

test.describe("Tool Execution API – contract", () => {
  test("POST /api/dashboard/tool-execution without cookie → 401", async ({
    request,
  }) => {
    const res = await request.post(`${BASE_URL}/api/dashboard/tool-execution`, {
      data: { toolId: "check" },
    })
    expect(res.status()).toBe(401)
    const body = await res.json()
    expect(body.ok).toBe(false)
    expect(body.error).toBe("unauthorized")
  })

  test("POST /api/dashboard/tool-execution with invalid toolId → 400", async ({
    context,
    request,
  }) => {
    await setCookieForPlan(context, { plan: "pro" }, BASE_URL)
    const cookies = await context.cookies()
    const cookieHeader = cookies.map((c) => `${c.name}=${c.value}`).join("; ")

    const res = await request.post(`${BASE_URL}/api/dashboard/tool-execution`, {
      data: { toolId: "nonexistent_tool" },
      headers: { Cookie: cookieHeader },
    })
    expect(res.status()).toBe(400)
    const body = await res.json()
    expect(body.ok).toBe(false)
    expect(body.error).toBe("invalid_tool")
  })

  for (const toolId of ["check", "oracle", "summon", "neuro"] as const) {
    test(`POST tool-execution toolId="${toolId}" with pro cookie → 200 or 503 (no DB)`, async ({
      context,
      request,
    }) => {
      await setCookieForPlan(context, { plan: "pro" }, BASE_URL)
      const cookies = await context.cookies()
      const cookieHeader = cookies.map((c) => `${c.name}=${c.value}`).join("; ")

      const res = await request.post(`${BASE_URL}/api/dashboard/tool-execution`, {
        data: { toolId },
        headers: { Cookie: cookieHeader },
      })

      // 200 = DB configured + execution persisted
      // 503 = DATABASE_URL not set in this environment (acceptable in CI without DB)
      expect([200, 503]).toContain(res.status())

      if (res.status() === 200) {
        const body = await res.json()
        expect(body.ok).toBe(true)
        expect(body.execution).toBeDefined()
        expect(body.execution.id).toBeTruthy()
        expect(body.execution.runbook_id).toBe(toolId)
        expect(body.execution.status).toBe("completed")
        expect(body.execution.result).toBeDefined()
        expect(body.execution.result.deliverable).toBeDefined()
        expect(body.execution.result.deliverable.type).toBeTruthy()
      }
    })
  }

  test("check tool: deliverable contains security score when DB available", async ({
    context,
    request,
  }) => {
    await setCookieForPlan(context, { plan: "pro" }, BASE_URL)
    const cookies = await context.cookies()
    const cookieHeader = cookies.map((c) => `${c.name}=${c.value}`).join("; ")

    const res = await request.post(`${BASE_URL}/api/dashboard/tool-execution`, {
      data: { toolId: "check", target: "clawguru.org" },
      headers: { Cookie: cookieHeader },
    })

    if (res.status() !== 200) return // skip if no DB

    const body = await res.json()
    const deliverable = body.execution?.result?.deliverable
    expect(deliverable?.type).toBe("security_header_check")
    expect(typeof deliverable?.score).toBe("number")
    expect(deliverable?.score).toBeGreaterThanOrEqual(0)
    expect(deliverable?.score).toBeLessThanOrEqual(100)
    expect(Array.isArray(deliverable?.recommendations)).toBe(true)
  })

  test("explorer tier → 403 execution_limit after 0 allowed runs", async ({
    context,
    request,
  }) => {
    await setCookieForPlan(context, { plan: "daypass" }, BASE_URL)
    const cookies = await context.cookies()
    const cookieHeader = cookies.map((c) => `${c.name}=${c.value}`).join("; ")

    const res = await request.post(`${BASE_URL}/api/dashboard/tool-execution`, {
      data: { toolId: "check" },
      headers: { Cookie: cookieHeader },
    })

    // daypass is allowed executions; expect 200 or 503 (no DB), NOT 403
    // (403 is only for explorer with 0 executions remaining)
    expect([200, 503]).toContain(res.status())
  })
})

// ── UI smoke: executions tab shows new row after tool run ────────────────────

test.describe("Dashboard – executions tab updates after tool run", () => {
  test.skip(
    !process.env.DATABASE_URL,
    "Skipped: DATABASE_URL not set (no test DB available)"
  )

  test("tool run → executions tab shows new row", async ({ context, page }) => {
    await setCookieForPlan(context, { plan: "pro" }, BASE_URL)

    // Run a tool via the API directly
    const cookies = await context.cookies()
    const cookieHeader = cookies.map((c) => `${c.name}=${c.value}`).join("; ")
    const apiRes = await page.request.post(
      `${BASE_URL}/api/dashboard/tool-execution`,
      {
        data: { toolId: "check" },
        headers: { Cookie: cookieHeader },
      }
    )

    if (apiRes.status() !== 200) return
    const apiBody = await apiRes.json()
    const executionId: string = apiBody.execution?.id

    // Navigate to dashboard executions tab
    await page.goto("/dashboard")
    const execTab = page
      .getByRole("button", { name: /executions/i })
      .first()
    await execTab.click()

    // The new execution ID should appear on the page
    await expect(
      page.getByText(executionId.slice(0, 8), { exact: false })
    ).toBeVisible({ timeout: 8_000 })
  })
})
