param(
  [int]$ChunkSize = 6,
  [string]$PreferredProvider = "gemini",
  [string]$BaseUrl = "http://localhost:3000"
)

$ErrorActionPreference = 'Stop'

$providers = @("AWS","GCP","Azure")
$services  = @("EC2","ECS","Lambda","RDS")
$issues    = @("High CPU","High Memory","Network Latency","Auth Failures","Networking Issues","Storage Errors","Timeout Errors","Throttling")

$allTasks = @()
foreach ($p in $providers) {
  foreach ($s in $services) {
    foreach ($i in $issues) {
      $allTasks += [PSCustomObject]@{
        contentType = "runbook"
        context = @{ provider = $p; service = $s; issue = $i; year = "2026"; preferredProvider = $PreferredProvider }
      }
    }
  }
}

$total = $allTasks.Count
Write-Host "Submitting $total tasks in chunks of $ChunkSize..."

# Chunking
function Split-IntoChunks([System.Collections.IEnumerable]$arr, [int]$size) {
  $chunk = @()
  foreach ($item in $arr) {
    $chunk += $item
    if ($chunk.Count -ge $size) { $chunk; $chunk = @() }
  }
  if ($chunk.Count -gt 0) { $chunk }
}

$chunksTotal = [math]::Ceiling($total / $ChunkSize)
$chunkIndex = 0

$summary = [ordered]@{ total = 0; errors = 0; durationMs = 0 }
$agg = [ordered]@{ total = 0; gold = 0; silver = 0; bronze = 0; reviewRequired = 0; avgConfidence = 0 }

for ($offset = 0; $offset -lt $total; $offset += $ChunkSize) {
  $chunkIndex++
  $end = [math]::Min($offset + $ChunkSize - 1, $total - 1)
  $chunk = @()
  for ($i = $offset; $i -le $end; $i++) { $chunk += $allTasks[$i] }
  $body = @{ tasks = $chunk } | ConvertTo-Json -Depth 10
  Write-Host ("Chunk {0}/{1}: {2} tasks" -f $chunkIndex, $chunksTotal, $chunk.Count)
  $resp = Invoke-WebRequest -Uri "$BaseUrl/api/ai/generate-chunk" -Method POST -ContentType "application/json" -Body $body -TimeoutSec 180 -UseBasicParsing
  $obj = $resp.Content | ConvertFrom-Json
  Write-Host ("  -> generated={0} errors={1} durationMs={2}" -f $obj.results.Count, $obj.errors.Count, $obj.durationMs)

  # Validate this chunk (auto-enqueues low-confidence to review queue)
  $valBody = @{ contentType = "runbook"; results = $obj.results } | ConvertTo-Json -Depth 10
  $valResp = Invoke-WebRequest -Uri "$BaseUrl/api/ai/content-validator" -Method POST -ContentType "application/json" -Body $valBody -TimeoutSec 180 -UseBasicParsing
  $val = $valResp.Content | ConvertFrom-Json
  Write-Host ("  -> validated: gold={0} silver={1} bronze={2} reviewRequired={3} avgConf={4}" -f $val.summary.gold, $val.summary.silver, $val.summary.bronze, $val.summary.reviewRequired, $val.summary.avgConfidence)

  # Aggregate
  $summary.total += [int]$obj.total
  $summary.errors += [int]$obj.errors.Count
  $summary.durationMs += [int]$obj.durationMs
  $agg.total += [int]$val.summary.total
  $agg.gold += [int]$val.summary.gold
  $agg.silver += [int]$val.summary.silver
  $agg.bronze += [int]$val.summary.bronze
  $agg.reviewRequired += [int]$val.summary.reviewRequired
  $agg.avgConfidence = [int]((($agg.avgConfidence * ($chunkIndex-1)) + [int]$val.summary.avgConfidence) / $chunkIndex)

  Start-Sleep -Seconds 2
}

Write-Host "\n=== Batch Summary ==="
Write-Host ("Generated: {0}/{1}, Errors: {2}, Duration: {3} ms" -f $summary.total, $total, $summary.errors, $summary.durationMs)
Write-Host ("Quality: gold={0} silver={1} bronze={2} reviewRequired={3} avgConfidence={4}" -f $agg.gold, $agg.silver, $agg.bronze, $agg.reviewRequired, $agg.avgConfidence)

Write-Host "\nTop 5 Review-Required (lowest confidence):"
$queueResp = Invoke-WebRequest -Uri "$BaseUrl/api/ai/human-review-queue?tier=review-required&limit=5&sort=confidence-asc" -UseBasicParsing -TimeoutSec 60
$queue = $queueResp.Content | ConvertFrom-Json
$queue.items | ForEach-Object { Write-Host (" - [{0}] {1} :: {2}" -f $_.confidence, $_.title, $_.reason) }
