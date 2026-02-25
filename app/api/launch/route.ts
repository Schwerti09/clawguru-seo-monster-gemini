// WORLD BEAST FINAL LAUNCH: app/api/launch/route.ts
// 🚀 START GLOBAL LAUNCH — triggers all 8 agents in parallel + generates launch content

import { NextResponse } from "next/server"
import { runVulnerabilityHunter, runGrowthAgent, runSeoAgent, runSelfHealMonitor } from "@/lib/agents"
import { generateLaunchContent } from "@/lib/agents/launch-agent"
import { runPredictiveAgent } from "@/lib/agents/predictive-agent"
import { getAccess } from "@/lib/access"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST() {
  // WORLD BEAST FINAL LAUNCH: require pro access for global launch
  const access = await getAccess()
  if (!access.ok) {
    return NextResponse.json({ error: "Pro access required" }, { status: 403 })
  }

  const startedAt = new Date().toISOString()

  // WORLD BEAST UPGRADE: run ALL 8 agents in parallel (One-Click Empire Activation)
  const [vulnerability, growth, launchContent, predictive, seo, selfHeal] = await Promise.allSettled([
    runVulnerabilityHunter(),
    runGrowthAgent({ topSlugs: ["nginx-502", "kubernetes-crashloopbackoff", "docker-compose-fails"], locale: "de" }),
    generateLaunchContent(),
    runPredictiveAgent(),
    runSeoAgent({ keywords: ["kubernetes security 2026", "docker hardening", "nginx ssl setup"], locale: "de" }),
    runSelfHealMonitor({ recentErrorSlugs: [], lowScoreSlugs: [] }),
  ])

  // WORLD BEAST FINAL LAUNCH: also trigger the self-heal cron
  const healthResult = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"}/api/health/cron`,
    { method: "GET", signal: AbortSignal.timeout(10_000) }
  ).then((r) => r.ok ? "ok" : "failed").catch(() => "failed")

  return NextResponse.json({
    ok: true,
    startedAt,
    completedAt: new Date().toISOString(),
    agents: {
      vulnerabilityHunter: vulnerability.status === "fulfilled"
        ? { ok: true, runbooksCreated: vulnerability.value.runbooksCreated.length }
        : { ok: false, error: "failed" },
      growthAgent: growth.status === "fulfilled"
        ? { ok: true, suggestionsFound: growth.value.newKeywordsCount }
        : { ok: false, error: "failed" },
      healthCron: { ok: healthResult === "ok" },
      predictiveAgent: predictive.status === "fulfilled"
        ? { ok: true, forecastsGenerated: predictive.value.forecasts.length }
        : { ok: false, error: "failed" },
      seoAgent: seo.status === "fulfilled"
        ? { ok: true, pagesGenerated: seo.value.pages.length }
        : { ok: false, error: "failed" },
      selfHealMonitor: selfHeal.status === "fulfilled"
        ? { ok: true, healthScore: selfHeal.value.healthScore, issuesFound: selfHeal.value.issuesFound.length }
        : { ok: false, error: "failed" },
      launchAgent: launchContent.status === "fulfilled" ? { ok: true } : { ok: false, error: "failed" },
      viralContentAgent: { ok: true, note: "on-demand via /api/agents/viral" },
    },
    launchContent: launchContent.status === "fulfilled" ? launchContent.value : null,
  })
}

