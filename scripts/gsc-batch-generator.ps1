param(
  [int]$Limit = 96,
  [switch]$DryRun
)

# GSC Keywords from Top 500 search queries
# Strategy: Strong keywords with clicks/impressions + High-opportunity zero-click keywords
$gscKeywords = @(
  # TIER 1: ALREADY CONVERTING (3+ clicks = proven demand)
  @{'query'='xxe2026'; 'category'='security'; 'type'='vulnerability'},
  @{'query'='tailscale pam'; 'category'='vpn'; 'type'='hardening'},
  @{'query'='fatigue 2027'; 'category'='incident'; 'type'='response'},
  @{'query'='prometheus vpn'; 'category'='monitoring'; 'type'='integration'},
  @{'query'='timescaledb 2026 release'; 'category'='database'; 'type'='update'},
  @{'query'='gdpr trivy compliance'; 'category'='compliance'; 'type'='tutorial'},
  @{'query'='grafana hardening'; 'category'='monitoring'; 'type'='hardening'},
  @{'query'='cloudflare tunnel firewall rules'; 'category'='networking'; 'type'='config'},
  @{'query'='keycloak hardening'; 'category'='iam'; 'type'='hardening'},
  
  # TIER 2: HIGH IMPRESSIONS, ZERO CTR (low hanging fruit - content is missing/bad)
  @{'query'='influxdb hipaa compliance'; 'category'='database'; 'type'='compliance'},
  @{'query'='iso 27001 google cloud'; 'category'='gcp'; 'type'='compliance'},
  @{'query'='github actions bare metal'; 'category'='ci-cd'; 'type'='deployment'},
  @{'query'='rabbitmq audit'; 'category'='queue'; 'type'='security'},
  @{'query'='terraform canary deploy'; 'category'='infrastructure'; 'type'='deployment'},
  @{'query'='waf 2027'; 'category'='security'; 'type'='guide'},
  @{'query'='google cloud rabbitmq'; 'category'='gcp'; 'type'='integration'},
  @{'query'='vultr compliance'; 'category'='provider'; 'type'='compliance'},
  @{'query'='authentik mtls'; 'category'='iam'; 'type'='config'},
  @{'query'='kubernetes iso27001'; 'category'='kubernetes'; 'type'='compliance'},
  
  # TIER 3: NICHE HIGH-VALUE (long tail, low volume but high intent)
  @{'query'='keycloak gdpr compliance'; 'category'='iam'; 'type'='compliance'},
  @{'query'='haproxy hardening'; 'category'='loadbalancer'; 'type'='hardening'},
  @{'query'='tailscale fedramp'; 'category'='vpn'; 'type'='compliance'},
  @{'query'='docker csp'; 'category'='container'; 'type'='security'},
  @{'query'='vault soc 2 compliance'; 'category'='secrets'; 'type'='compliance'},
  @{'query'='falco runtime security kubernetes ebpf'; 'category'='kubernetes'; 'type'='security'},
  @{'query'='prometheus rce'; 'category'='monitoring'; 'type'='vulnerable-response'},
  @{'query'='trivy supply chain attack'; 'category'='supply-chain'; 'type'='security'},
  @{'query'='dex pkce'; 'category'='iam'; 'type'='config'},
  @{'query'='gitlab hardening'; 'category'='ci-cd'; 'type'='hardening'},
  
  # TIER 4: BRAND EXPANSION (existing tooling, new angles)
  @{'query'='authentik backup restore'; 'category'='iam'; 'type'='dr'},
  @{'query'='keycloak rate limiting'; 'category'='iam'; 'type'='performance'},
  @{'query'='grafana mfa'; 'category'='monitoring'; 'type'='security'},
  @{'query'='elasticsearch gdpr'; 'category'='search'; 'type'='compliance'},
  @{'query'='kafka gdpr'; 'category'='queue'; 'type'='compliance'},
  @{'query'='cassandra sicherung wiederherstellung'; 'category'='database'; 'type'='dr'},
  @{'query'='redis soc2 compliance'; 'category'='cache'; 'type'='compliance'},
  @{'query'='argocd audit logs'; 'category'='gitops'; 'type'='security'},
  @{'query'='jenkins pci compliance'; 'category'='ci-cd'; 'type'='compliance'},
  @{'query'='circleci security advisory'; 'category'='ci-cd'; 'type'='vulnerable-response'},
  
  # TIER 5: EMERGING THREATS (2026-2027 focus, competitive gap)
  @{'query'='wireguard 2026 security updates'; 'category'='vpn'; 'type'='update'},
  @{'query'='prometheus grafana updates 2026'; 'category'='monitoring'; 'type'='update'},
  @{'query'='day zero 2027'; 'category'='security'; 'type'='incident'},
  @{'query'='tailscale threat model'; 'category'='vpn'; 'type'='architecture'},
  @{'query'='vault 2027'; 'category'='secrets'; 'type'='roadmap'},
  @{'query'='timescaledb update 2026'; 'category'='database'; 'type'='update'},
  @{'query'='hashicorp vault updates 2026'; 'category'='secrets'; 'type'='update'},
  @{'query'='datadog soc 2 compliance'; 'category'='monitoring'; 'type'='compliance'},
  @{'query'='sentry eu data residency'; 'category'='apm'; 'type'='compliance'},
  @{'query'='okta hardening checklist'; 'category'='iam'; 'type'='hardening'},
  
  # TIER 6: OPERATOR RUNBOOKS (actionable, high-intent)
  @{'query'='rbac snyk'; 'category'='supply-chain'; 'type'='integration'},
  @{'query'='blue green deployment gcp'; 'category'='gcp'; 'type'='deployment'},
  @{'query'='rbac mariadb'; 'category'='database'; 'type'='security'},
  @{'query'='ansible apparmor'; 'category'='linux'; 'type'='hardening'},
  @{'query'='puppet security hardening'; 'category'='infrastructure'; 'type'='hardening'},
  @{'query'='nfs firewall'; 'category'='storage'; 'type'='security'},
  @{'query'='datadog firewall rules'; 'category'='monitoring'; 'type'='integration'},
  @{'query'='envoy waf'; 'category'='service-mesh'; 'type'='security'},
  @{'query'='traefik blue green deployment'; 'category'='loadbalancer'; 'type'='deployment'},
  @{'query'='minio audit logging'; 'category'='storage'; 'type'='security'},
  
  # TIER 7: INTEGRATION DEEP DIVES
  @{'query'='opa gatekeeper kubernetes'; 'category'='kubernetes'; 'type'='policy'},
  @{'query'='rancher opa gatekeeper'; 'category'='kubernetes'; 'type'='policy'},
  @{'query'='gitlab data residency'; 'category'='ci-cd'; 'type'='compliance'},
  @{'query'='clickhouse tls'; 'category'='analytics'; 'type'='security'},
  @{'query'='minio rce'; 'category'='storage'; 'type'='vulnerable-response'},
  @{'query'='sonarqube dast'; 'category'='supply-chain'; 'type'='testing'},
  @{'query'='snyk dast cli'; 'category'='supply-chain'; 'type'='testing'},
  @{'query'='baremetal elasticsearch'; 'category'='search'; 'type'='deployment'},
  @{'query'='scaleway kafka'; 'category'='provider'; 'type'='integration'},
  @{'query'='digitalocean pci compliance'; 'category'='provider'; 'type'='compliance'},
  
  # TIER 8: FUTURE-PROOFING (2027+ preparation)
  @{'query'='nfs 2027'; 'category'='storage'; 'type'='roadmap'},
  @{'query'='elasticsearch fedramp'; 'category'='search'; 'type'='compliance'},
  @{'query'='kubernetes fedramp'; 'category'='kubernetes'; 'type'='compliance'},
  @{'query'='immutable backup velero'; 'category'='backup'; 'type'='dr'},
  @{'query'='service mesh news 2026'; 'category'='service-mesh'; 'type'='update'},
  @{'query'='cis benchmark postgresql'; 'category'='database'; 'type'='hardening'},
  @{'query'='cis benchmark apache'; 'category'='web-server'; 'type'='hardening'},
  @{'query'='admission control kubernetes'; 'category'='kubernetes'; 'type'='policy'},
  @{'query'='malware defense 2026'; 'category'='security'; 'type'='detection'},
  @{'query'='data exfiltration prevention cicd'; 'category'='ci-cd'; 'type'='security'}
)

Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "GSC KEYWORD → BATCH GENERATOR (Top $Limit Keywords)" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════════════════════════`n" -ForegroundColor Cyan

$total = [Math]::Min($Limit, $gscKeywords.Count)
Write-Host "Generating $total landing pages from GSC keywords...`n"

if ($DryRun) {
  Write-Host "DRY RUN - showing first 5 keywords:" -ForegroundColor Yellow
  $gscKeywords | Select-Object -First 5 | ForEach-Object {
    Write-Host "  [$($_.category)] $($_.query) (type: $($_.type))"
  }
  exit 0
}

# Group by category for balanced distribution
$grouped = $gscKeywords | Group-Object -Property category
$chunkSize = 6
$chunk = 1
$currentChunk = @()
$allTasks = @()

foreach ($item in $gscKeywords | Select-Object -First $total) {
  $task = @{
    contentType = 'runbook'
    context = @{
      provider = 'Multi-Cloud'
      service = $item.category
      issue = ($item.query -replace ' ', '-')
      year = '2026'
      gscKeywordQuery = $item.query
      keywordIntent = $item.type
    }
    tone = 'authoritative'
    variant = 'gsc-optimized'
  }
  
  $currentChunk += $task
  
  if ($currentChunk.Count -eq $chunkSize) {
    $allTasks += , @($currentChunk)
    $currentChunk = @()
    $chunk++
  }
}

# Add remaining
if ($currentChunk.Count -gt 0) {
  $allTasks += , @($currentChunk)
}

Write-Host "Created $($allTasks.Count) chunks of ~$chunkSize keywords each`n"

# Generate batches
$startTime = Get-Date
$baseUrl = "https://clawguru.org/api/ai/generate-chunk"

for ($i = 0; $i -lt $allTasks.Count; $i++) {
  $chunkNum = $i + 1
  Write-Host "[CHUNK $chunkNum/$($allTasks.Count)] Generating $($allTasks[$i].Count) keywords..." -ForegroundColor Cyan
  
  $body = @{ tasks = $allTasks[$i] } | ConvertTo-Json -Depth 8
  
  try {
    $chunkStart = Get-Date
    $r = Invoke-WebRequest -Uri $baseUrl -Method POST `
      -ContentType "application/json" -Body $body -TimeoutSec 300 -UseBasicParsing
    $res = $r.Content | ConvertFrom-Json
    $chunkDur = ((Get-Date) - $chunkStart).TotalSeconds
    
    $gen = $res.results.Count
    $err = $res.errors.Count
    
    $status = if ($gen -gt 0) { "[OK]" } else { "[!]" }
    Write-Host "  $status Generated: $gen/$($allTasks[$i].Count), Errors: $err, Duration: $([math]::Round($chunkDur,1))s" `
      -ForegroundColor $(if ($gen -gt 0) { "Green" } else { "Yellow" })
    
  } catch {
    Write-Host "  [ERR] Error: $($_.Exception.Message)" -ForegroundColor Red
  }
  
  Start-Sleep -Seconds 2
}

$totalDur = ((Get-Date) - $startTime).TotalSeconds
$mins = [math]::Round($totalDur / 60, 1)

Write-Host "`n════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "GSC BATCH COMPLETE" -ForegroundColor Green
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "Total Keywords:  $total"
Write-Host "Chunks:          $($allTasks.Count)"
Write-Host "Duration:        ${mins} minutes"
Write-Host "Status:          Ready for validation + publishing"
Write-Host "════════════════════════════════════════════════════════════`n" -ForegroundColor Green
