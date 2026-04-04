#!/usr/bin/env node
/* eslint-disable no-console */
try {
  require("dotenv").config()
  require("dotenv").config({ path: ".env.local" })
  const extra = (process.env.GEO_CLI_EXTRA_DOTENV || "").trim()
  if (extra) require("dotenv").config({ path: extra })
} catch {}

const { execSync } = require("node:child_process")
const fs = require("node:fs")
const path = require("node:path")

function run(cmd) {
  console.log(`\n>>> ${cmd}`)
  execSync(cmd, { stdio: "inherit", shell: true })
}

function main() {
  const dryOnly = process.argv.includes("--dry-only")
  const started = new Date().toISOString()

  run("npm run check:geo-ops-readiness")
  run("npm run check:geo-rollout-status -- --verbose")
  run("node scripts/check-geo-city-ranking.js --locale=de --slug=openclaw-risk-2026 --limit=120")
  run("node scripts/check-geo-city-ranking.js --locale=en --slug=openclaw-exposed --limit=120")
  run(
    "node scripts/trigger-geo-canary-rollout.js --mode=dry-run --locale=de --slug=openclaw-risk-2026 --limit=120 --minRankingScore=60 --verbose"
  )
  run(
    "node scripts/trigger-geo-canary-rollout.js --mode=dry-run --locale=en --slug=openclaw-exposed --limit=120 --minRankingScore=60 --verbose"
  )

  if (!dryOnly && process.argv.includes("--with-seed-live")) {
    console.warn("[killermachine-v3] --with-seed-live: run geo-batch-seed-by-quality only after human review")
    // Example (uncomment after review):
    // run("node scripts/geo-batch-seed-by-quality.js --wave-id=v3-manual --batch=D3 --quality-floor=84 --mode=commit")
  } else if (!dryOnly) {
    console.log("\n[killermachine-v3] no --with-seed-live: skipping DB seed (safe default)")
  }

  run("npm run geo:sitemap-guardrail:dry-run")

  const reportDir = path.join(process.cwd(), "reports")
  if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir, { recursive: true })
  const safeTs = started.replace(/[:.]/g, "-")
  const reportPath = path.join(reportDir, `killermachine-v3-${safeTs}.json`)
  fs.writeFileSync(
    reportPath,
    JSON.stringify(
      {
        ok: true,
        mode: dryOnly ? "dry-only" : "observe-plus-sitemap-dry-run",
        startedAt: started,
        finishedAt: new Date().toISOString(),
        note: "Parse stdout / wire canary JSON in a follow-up; see AGENTS.md §29",
      },
      null,
      2
    ),
    "utf8"
  )
  console.log(`\n[killermachine-v3] report written: ${reportPath}`)
}

main()
