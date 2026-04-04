#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Killermachine v3.3 — batch-aware loop + post-seed ranking sync + promotion gate (see AGENTS.md §37).
 */
try {
  require("dotenv").config()
  require("dotenv").config({ path: ".env.local" })
  const extra = (process.env.GEO_CLI_EXTRA_DOTENV || "").trim()
  if (extra) require("dotenv").config({ path: extra })
} catch {}

const { execSync } = require("node:child_process")
const fs = require("node:fs")
const path = require("node:path")

const DEFAULT_BASE = "https://clawguru.org"
const STATE_FILE = path.join("reports", "killermachine-batch-state.json")
const BATCH_ORDER = ["D3", "D4"]
const RANK_LIMIT = 200
const CANARY_LIMIT = 120

function getArg(name, fallback = "") {
  const arg = process.argv.find((x) => x.startsWith(`--${name}=`))
  if (!arg) return fallback
  return arg.split("=").slice(1).join("=")
}

function getBase() {
  const raw = getArg("base", process.env.GEO_INDEX_HEALTH_BASE || DEFAULT_BASE)
  return raw.replace(/\/$/, "")
}

function getRolloutSecret() {
  return (
    process.env.GEO_ROLLOUT_STATUS_SECRET ||
    process.env.GEO_CANARY_ROLLOUT_SECRET ||
    process.env.GEO_SITEMAP_GUARDRAIL_SECRET ||
    process.env.GEO_EXPANSION_SECRET ||
    process.env.GEO_AUTO_PRUNE_SECRET ||
    process.env.GEO_REVALIDATE_SECRET ||
    ""
  )
}

function run(cmd) {
  console.log(`\n>>> ${cmd}`)
  execSync(cmd, { stdio: "inherit", shell: true })
}

function runCapture(cmd) {
  console.log(`\n>>> ${cmd}`)
  return execSync(cmd, { stdio: "pipe", shell: true, encoding: "utf8" })
}

function parseCanaryDryRun(output) {
  const canaryRanked = Number((output.match(/canaryRanked=(\d+)/) || [0, 0])[1])
  const totalRanked = Number((output.match(/totalRanked=(\d+)/) || [0, 0])[1])
  const rawWould = (output.match(/wouldPromote=([^\n\r]+)/) || ["", "-"])[1].trim()
  const wouldPromoteCount = rawWould && rawWould !== "-" ? rawWould.split(",").filter(Boolean).length : 0
  return { totalRanked, canaryRanked, wouldPromote: rawWould, wouldPromoteCount }
}

function parseEligibleFromSeed(output) {
  const m = output.match(/eligible_count["\s:]+(\d+)/i) || output.match(/"eligible_count"\s*:\s*(\d+)/)
  return m ? Number(m[1]) : null
}

function localePromotionReady(parsed) {
  return parsed.canaryRanked > 0 && parsed.wouldPromoteCount > 0
}

function readBatchState() {
  const p = path.join(process.cwd(), STATE_FILE)
  try {
    if (!fs.existsSync(p)) return { nextBatch: "D3" }
    const j = JSON.parse(fs.readFileSync(p, "utf8"))
    const nb = j.nextBatch
    if (nb && BATCH_ORDER.includes(nb)) return { nextBatch: nb, updatedAt: j.updatedAt }
  } catch {
    /* ignore */
  }
  return { nextBatch: "D3" }
}

function writeBatchState(nextBatch) {
  const dir = path.join(process.cwd(), "reports")
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  const p = path.join(dir, "killermachine-batch-state.json")
  fs.writeFileSync(
    p,
    JSON.stringify(
      { nextBatch, updatedAt: new Date().toISOString(), note: "v3.3 batch pointer — advance after successful D3/D4 wave" },
      null,
      2
    ),
    "utf8"
  )
  console.log(`\n[killermachine-v3.3] wrote batch state → nextBatch=${nextBatch} (${p})`)
}

function pickNextBatchAfter(current) {
  const i = BATCH_ORDER.indexOf(current)
  if (i >= 0 && i < BATCH_ORDER.length - 1) return BATCH_ORDER[i + 1]
  return current
}

async function fetchRollout(base, secret) {
  const url =
    `${base}/api/geo/rollout-status` + `?locale=de&slug=openclaw-risk-2026&verbose=1&includeRanking=1`
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${secret}`,
      "user-agent": "clawguru-killermachine-v3.3/1.0",
    },
  })
  const json = await res.json().catch(() => null)
  if (!res.ok || !json || json.error) {
    throw new Error(`rollout-status failed: ${res.status} ${JSON.stringify(json)}`)
  }
  return json
}

async function main() {
  const dryOnly = process.argv.includes("--dry-only")
  const seedLive = process.argv.includes("--with-seed-live")
  const bumpState = getArg("write-next-batch", "")
  const started = new Date().toISOString()
  const base = getBase()
  const secret = getRolloutSecret()
  const canaryLow = Number(process.env.KILLERMACHINE_CANARY_LOW_THRESHOLD || 10)
  const qualityFloor = Number(process.env.KILLERMACHINE_QUALITY_FLOOR || 84)
  const minRankingScore = Number(process.env.KILLERMACHINE_MIN_RANKING_SCORE || 65)
  const waveId = getArg("wave-id", `km-v33-${started.slice(0, 10)}`)

  if (dryOnly && seedLive) {
    console.warn("[killermachine-v3.3] --dry-only gesetzt: --with-seed-live wird für DB-Commit ignoriert")
  }

  if (bumpState && BATCH_ORDER.includes(bumpState)) {
    writeBatchState(bumpState)
    return
  }

  if (!secret) {
    console.error("[killermachine-v3.3] missing GEO_ROLLOUT_STATUS_SECRET (or fallback geo secret)")
    process.exit(1)
  }

  console.log(
    `[killermachine-v3.3] base=${base} canaryLowThreshold=${canaryLow} qualityFloor=${qualityFloor} minRankingScore=${minRankingScore} dryOnly=${dryOnly}`
  )

  run("npm run check:geo-ops-readiness")

  const rolloutJson = await fetchRollout(base, secret)
  const r = rolloutJson.rollout || {}
  const activeCanary = Number(r.activeCanary || 0)
  const activeStable = Number(r.activeStable || 0)
  console.log(
    `[killermachine-v3.3] rollout snapshot: activeCanary=${activeCanary} activeStable=${activeStable} total=${r.total || 0}`
  )
  if (rolloutJson.rankingSnapshot) {
    const s = rolloutJson.rankingSnapshot
    console.log(`[killermachine-v3.3] ranking snapshot: healthy=${s.healthyCities}/${s.totalCities} healthScore=${s.healthScore}`)
  }

  run("npm run check:geo-rollout-status -- --verbose")

  run(`node scripts/check-geo-city-ranking.js --locale=de --slug=openclaw-risk-2026 --limit=${RANK_LIMIT}`)
  run(`node scripts/check-geo-city-ranking.js --locale=en --slug=openclaw-exposed --limit=${RANK_LIMIT}`)

  let selectedBatch = null
  let seedAction = "skipped"
  let seedOut = ""

  if (activeCanary < canaryLow) {
    selectedBatch = getArg("batch", process.env.KILLERMACHINE_BATCH || readBatchState().nextBatch)
    if (!BATCH_ORDER.includes(selectedBatch) && !["D1", "D2"].includes(selectedBatch)) {
      console.warn(`[killermachine-v3.3] unknown batch ${selectedBatch}, defaulting to D3`)
      selectedBatch = "D3"
    }
    console.log(
      `\n[killermachine-v3.3] activeCanary (${activeCanary}) < threshold (${canaryLow}) → quality-gated seed for batch **${selectedBatch}** (dry-run unless --with-seed-live)`
    )

    const seedCmd = `node scripts/geo-batch-seed-by-quality.js --wave-id=${waveId} --batch=${selectedBatch} --quality-floor=${qualityFloor} --mode=dry-run`
    if (dryOnly || !seedLive) {
      seedOut = runCapture(seedCmd)
      process.stdout.write(seedOut)
      seedAction = "dry-run"
    }

    if (seedLive && !dryOnly) {
      console.warn("[killermachine-v3.3] LIVE seed — human review required; Quality-Floor >= " + qualityFloor)
      run(
        `node scripts/geo-batch-seed-by-quality.js --wave-id=${waveId} --batch=${selectedBatch} --quality-floor=${qualityFloor} --mode=commit`
      )
      seedAction = "commit"
      const advance = getArg("advance-state-after-live", "1")
      if (advance === "1") {
        const nxt = pickNextBatchAfter(selectedBatch)
        if (nxt !== selectedBatch) writeBatchState(nxt)
      }
    }
  } else {
    console.log(
      `\n[killermachine-v3.3] activeCanary (${activeCanary}) >= threshold (${canaryLow}) → skip auto-seed (focus on promotion / monitoring)`
    )
  }

  run(`node scripts/check-geo-city-ranking.js --locale=de --slug=openclaw-risk-2026 --limit=${RANK_LIMIT}`)
  run(`node scripts/check-geo-city-ranking.js --locale=en --slug=openclaw-exposed --limit=${RANK_LIMIT}`)

  const outDe = runCapture(
    `node scripts/trigger-geo-canary-rollout.js --mode=dry-run --locale=de --slug=openclaw-risk-2026 --limit=${CANARY_LIMIT} --minRankingScore=${minRankingScore} --verbose`
  )
  process.stdout.write(outDe)
  const outEn = runCapture(
    `node scripts/trigger-geo-canary-rollout.js --mode=dry-run --locale=en --slug=openclaw-exposed --limit=${CANARY_LIMIT} --minRankingScore=${minRankingScore} --verbose`
  )
  process.stdout.write(outEn)

  const de = parseCanaryDryRun(outDe)
  const en = parseCanaryDryRun(outEn)
  const promotionReadyDe = localePromotionReady(de)
  const promotionReadyEn = localePromotionReady(en)
  const promotionReady = promotionReadyDe && promotionReadyEn
  const warningCanaryNotInRanking = activeCanary > 0 && de.canaryRanked === 0 && en.canaryRanked === 0

  if (warningCanaryNotInRanking) {
    console.warn(
      "[killermachine-v3.3][WARN] activeCanary>0 but canaryRanked=0 on both locales — deploy city-ranking union, forceRefresh, runbook URLs prüfen."
    )
  } else if (de.canaryRanked === 0 && en.canaryRanked === 0) {
    console.warn("[killermachine-v3.3][WARN] canaryRanked=0 on both locales after sync.")
  }

  let suggestedNextAction = "hold: eligibility not met on one or both locales (review dry-run)."
  if (promotionReady) {
    suggestedNextAction =
      "Human-Review OK + count ≤15 per locale (or extended gate): run trigger-geo-canary-rollout --mode=live DE then EN (see AGENTS.md §37)."
    console.log("\n[killermachine-v3.3] PROMOTION SUGGESTED (Human-Gate required):\n", suggestedNextAction)
  }

  run("npm run geo:sitemap-guardrail:dry-run")

  const eligible_count = seedOut ? parseEligibleFromSeed(seedOut) : null
  const reportDir = path.join(process.cwd(), "reports")
  if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir, { recursive: true })
  const safeTs = started.replace(/[:.]/g, "-")
  const reportPath = path.join(reportDir, `killermachine-v33-${safeTs}.json`)
  const report = {
    ok: true,
    version: "v3.3",
    mode: dryOnly ? "dry-only" : seedLive ? "with-seed-live" : "observe-plus-seed-dry-run",
    startedAt: started,
    finishedAt: new Date().toISOString(),
    activeCanary,
    activeStable,
    canaryLowThreshold: canaryLow,
    qualityFloor,
    minRankingScore,
    selectedBatch,
    seedAction,
    waveId,
    eligible_count,
    de,
    en,
    promotionReadyDe,
    promotionReadyEn,
    promotionReady,
    canaryRanked: Math.max(de.canaryRanked, en.canaryRanked),
    wouldPromoteCount: de.wouldPromoteCount + en.wouldPromoteCount,
    warningCanaryNotInRanking,
    suggestedNextAction,
    note: "No automatic --mode=live. Human-Gate: promotion >15 cities.",
  }
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), "utf8")
  console.log(`\n[killermachine-v3.3] report written: ${reportPath}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
