# Geo Rollout Commands (Copy/Paste)

## 0) Prepare local env

```powershell
Copy-Item ".env.local.template" ".env.local" -Force
```

Fill `.env.local` with real secrets before running the next commands.

## 1) Dry-run first (required)

```powershell
$locales = @("de","en","es","fr","it","pt","nl","pl","tr","ru","ja","ko","zh","hi","ar")
$cities = "berlin,munich,hamburg,frankfurt,cologne"
foreach ($locale in $locales) {
  if ($locale -eq "de") { $slug = "openclaw-risk-2026" } else { $slug = "openclaw-exposed" }
  node scripts/trigger-geo-canary-rollout.js --mode=dry-run --locale=$locale --slug=$slug --cities=$cities --limit=80 --minRankingScore=86
}
```

## 2) Live rollout (after dry-run is clean)

```powershell
$locales = @("de","en","es","fr","it","pt","nl","pl","tr","ru","ja","ko","zh","hi","ar")
$cities = "berlin,munich,hamburg,frankfurt,cologne"
foreach ($locale in $locales) {
  if ($locale -eq "de") { $slug = "openclaw-risk-2026" } else { $slug = "openclaw-exposed" }
  node scripts/trigger-geo-canary-rollout.js --mode=live --locale=$locale --slug=$slug --cities=$cities --limit=80 --minRankingScore=86
}
```

## 3) Guardrail check

```powershell
npm run geo:sitemap-guardrail:dry-run
```

