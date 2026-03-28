param(
  [string]$BatchId,
  [string]$ResultsFile,
  [ValidateSet('runbook','security-guide','tool-review','faq','mixed')][string]$ContentType = 'runbook',
  [int]$AutoApproveThreshold = 70,
  [switch]$DryRun
)

Write-Host "[ORCH] Post-batch orchestrator starting..." -ForegroundColor Cyan
if (-not $BatchId -and -not $ResultsFile) {
  Write-Host "Provide -BatchId or -ResultsFile" -ForegroundColor Red
  exit 1
}

function Invoke-JsonPost {
  param([string]$Url, [hashtable]$Body)
  $json = $Body | ConvertTo-Json -Depth 8
  $r = Invoke-WebRequest -Uri $Url -Method POST -ContentType 'application/json' -Body $json -TimeoutSec 300 -UseBasicParsing
  return $r.Content | ConvertFrom-Json
}

# 1) VALIDATE
Write-Host "[1/4] Validating content via /api/ai/content-validator..." -ForegroundColor Yellow
$valBody = @{}
if ($ResultsFile) {
  if (-not (Test-Path $ResultsFile)) { Write-Host "Results file not found: $ResultsFile" -ForegroundColor Red; exit 2 }
  $raw = Get-Content -Raw -Path $ResultsFile | ConvertFrom-Json
  # Try to normalize into expected 'results' array
  $items = @()
  if ($raw.results) { $items = $raw.results }
  elseif ($raw.items) { $items = $raw.items }
  else { $items = $raw }
  $valBody = @{ contentType = $ContentType; results = $items }
} else {
  $valBody = @{ jobId = $BatchId; contentType = $ContentType }
}

try {
  $validation = Invoke-JsonPost -Url "https://clawguru.org/api/ai/content-validator" -Body $valBody
} catch {
  Write-Host "Validator error: $($_.Exception.Message)" -ForegroundColor Red
  exit 3
}

$total = $validation.summary.total
$gold  = $validation.summary.gold
$silver= $validation.summary.silver
$bronze= $validation.summary.bronze
$review= $validation.summary.reviewRequired
$avg   = $validation.summary.avgConfidence
Write-Host ("[VALIDATION] total={0} gold={1} silver={2} bronze={3} review={4} avgConf={5}" -f $total,$gold,$silver,$bronze,$review,$avg)

if ($DryRun) { Write-Host "DryRun: stopping after validation." -ForegroundColor DarkYellow; exit 0 }

# 2) PUBLISH-CONTENT
Write-Host "[2/4] Publishing to DB via /api/ai/publish-content..." -ForegroundColor Yellow

# Build items for publish call, mapping confidence heuristically
$pubItems = @()
$valItems = $validation.items
if (-not $valItems) { $valItems = $validation.results }
foreach ($vi in $valItems) {
  $conf = $null
  if ($vi.confidence) { $conf = [double]$vi.confidence }
  elseif ($vi.score) { $conf = [double]$vi.score }
  elseif ($vi.overall) { $conf = [double]$vi.overall }
  elseif ($vi.eeat -and $vi.eeat.overall) { $conf = [double]$vi.eeat.overall }
  if (-not $conf) { $conf = 0 }

  # Normalize fields
  $title = $vi.title
  $summary = $vi.summary
  $content = $vi.content
  if (-not $title -and $vi.name) { $title = $vi.name }
  if (-not $content -and $vi.data) { $content = $vi.data }
  if (-not $title -or -not $content) { continue }

  $pubItems += @{
    title = $title
    summary = $summary
    content = (if ($content -is [string]) { $content } else { ($content | ConvertTo-Json -Depth 8) })
    contentType = (if ($vi.contentType) { $vi.contentType } else { $ContentType })
    keywords = $vi.keywords
    metadata = @{ provider = $vi.provider; confidence = [double]$conf }
  }
}

if ($pubItems.Count -eq 0) {
  Write-Host "No publishable items found in validator output" -ForegroundColor Red
  exit 4
}

$pubBody = @{ items = $pubItems; batchId = ($BatchId ?? ("batch-" + (Get-Date -Format 'yyyyMMdd-HHmmss'))); autoApprove = $true }

try {
  $publish = Invoke-JsonPost -Url "https://clawguru.org/api/ai/publish-content" -Body $pubBody
} catch {
  Write-Host "Publish error: $($_.Exception.Message)" -ForegroundColor Red
  exit 5
}

Write-Host ("[PUBLISH] status={0} total={1} published={2} pending_review={3} errors={4}" -f $publish.status,$publish.total,$publish.published,$publish.pending_review,($publish.errors.Length))

# 3) AUTO-PUBLISH GOLD
Write-Host "[3/4] Auto-publish gold via /api/ai/auto-publish-gold..." -ForegroundColor Yellow
try {
  $auto = Invoke-JsonPost -Url "https://clawguru.org/api/ai/auto-publish-gold" -Body @{}
} catch {
  Write-Host "Auto-publish error: $($_.Exception.Message)" -ForegroundColor Red
  exit 6
}
Write-Host ("[AUTO-PUBLISH] published={0}" -f $auto.published)

# 4) SUMMARY
Write-Host "[4/4] Summary" -ForegroundColor Green
Write-Host ("  Validated: total={0} gold={1} silver={2} bronze={3} review={4} avgConf={5}" -f $total,$gold,$silver,$bronze,$review,$avg)
Write-Host ("  Publish: status={0} total={1} published={2} pending={3}" -f $publish.status,$publish.total,$publish.published,$publish.pending_review)
Write-Host ("  Auto-publish gold: published={0}" -f $auto.published)

Write-Host "[DONE]" -ForegroundColor Cyan
