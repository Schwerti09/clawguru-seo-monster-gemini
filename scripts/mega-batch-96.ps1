# 96-ITEM PRODUCTION BATCH SCRIPT
Write-Host "════════════════════════════════════════════════════════════"
Write-Host "PRODUCTION BATCH: 96-Item Generation + Validation"
Write-Host "════════════════════════════════════════════════════════════`n"

$chunks = @(
  # AWS Services (18 items: 12 runbooks + 4 security + 2 tools)
  @(
    @{'contentType'='runbook'; 'context'=@{'provider'='AWS'; 'service'='EC2'; 'issue'='HighCPU'; 'year'='2026'}; 'tone'='technical'; 'variant'='standard'},
    @{'contentType'='runbook'; 'context'=@{'provider'='AWS'; 'service'='RDS'; 'issue'='Latency'; 'year'='2026'}; 'tone'='technical'; 'variant'='standard'},
    @{'contentType'='runbook'; 'context'=@{'provider'='AWS'; 'service'='S3'; 'issue'='Permissions'; 'year'='2026'}; 'tone'='technical'; 'variant'='standard'},
    @{'contentType'='runbook'; 'context'=@{'provider'='AWS'; 'service'='Lambda'; 'issue'='Timeouts'; 'year'='2026'}; 'tone'='technical'; 'variant'='standard'},
    @{'contentType'='security-guide'; 'context'=@{'topic'='IAM'; 'technology'='AWS'; 'severity'='P1-Critical'; 'year'='2026'}; 'tone'='authoritative'; 'variant'='standard'},
    @{'contentType'='tool-review'; 'context'=@{'toolName'='Terraform'; 'category'='IaC'; 'year'='2026'}; 'tone'='professional'; 'variant'='standard'}
  ),
  # GCP Services (18 items)
  @(
    @{'contentType'='runbook'; 'context'=@{'provider'='GCP'; 'service'='Compute'; 'issue'='Memory'; 'year'='2026'}; 'tone'='technical'; 'variant'='standard'},
    @{'contentType'='runbook'; 'context'=@{'provider'='GCP'; 'service'='CloudSQL'; 'issue'='Authentication'; 'year'='2026'}; 'tone'='technical'; 'variant'='standard'},
    @{'contentType'='runbook'; 'context'=@{'provider'='GCP'; 'service'='Storage'; 'issue'='Quota'; 'year'='2026'}; 'tone'='technical'; 'variant'='standard'},
    @{'contentType'='runbook'; 'context'=@{'provider'='GCP'; 'service'='Firestore'; 'issue'='Consistency'; 'year'='2026'}; 'tone'='technical'; 'variant'='standard'},
    @{'contentType'='security-guide'; 'context'=@{'topic'='ZeroTrust'; 'technology'='Cloud'; 'severity'='P2-High'; 'year'='2026'}; 'tone'='authoritative'; 'variant'='standard'},
    @{'contentType'='tool-review'; 'context'=@{'toolName'='Pulumi'; 'category'='IaC'; 'year'='2026'}; 'tone'='professional'; 'variant'='standard'}
  ),
  # Azure Services (18 items)
  @(
    @{'contentType'='runbook'; 'context'=@{'provider'='Azure'; 'service'='VirtualMachine'; 'issue'='DiskSpace'; 'year'='2026'}; 'tone'='technical'; 'variant'='standard'},
    @{'contentType'='runbook'; 'context'=@{'provider'='Azure'; 'service'='AppService'; 'issue'='SlowResponse'; 'year'='2026'}; 'tone'='technical'; 'variant'='standard'},
    @{'contentType'='runbook'; 'context'=@{'provider'='Azure'; 'service'='CosmosDB'; 'issue'='Latency'; 'year'='2026'}; 'tone'='technical'; 'variant'='standard'},
    @{'contentType'='runbook'; 'context'=@{'provider'='Azure'; 'service'='KeyVault'; 'issue'='AccessDenied'; 'year'='2026'}; 'tone'='technical'; 'variant'='standard'},
    @{'contentType'='security-guide'; 'context'=@{'topic'='NetworkSecurity'; 'technology'='Cloud'; 'severity'='P2-High'; 'year'='2026'}; 'tone'='authoritative'; 'variant'='standard'},
    @{'contentType'='tool-review'; 'context'=@{'toolName'='Ansible'; 'category'='ConfigMgmt'; 'year'='2026'}; 'tone'='professional'; 'variant'='standard'}
  ),
  # Kubernetes & Containers (18 items)
  @(
    @{'contentType'='runbook'; 'context'=@{'provider'='Kubernetes'; 'service'='Pod'; 'issue'='CrashLoop'; 'year'='2026'}; 'tone'='technical'; 'variant'='standard'},
    @{'contentType'='runbook'; 'context'=@{'provider'='Kubernetes'; 'service'='Node'; 'issue'='NotReady'; 'year'='2026'}; 'tone'='technical'; 'variant'='standard'},
    @{'contentType'='runbook'; 'context'=@{'provider'='Docker'; 'service'='Container'; 'issue'='ImagePull'; 'year'='2026'}; 'tone'='technical'; 'variant'='standard'},
    @{'contentType'='runbook'; 'context'=@{'provider'='Kubernetes'; 'service'='Service'; 'issue'='Connectivity'; 'year'='2026'}; 'tone'='technical'; 'variant'='standard'},
    @{'contentType'='security-guide'; 'context'=@{'topic'='ContainerSecurity'; 'technology'='Cloud'; 'severity'='P1-Critical'; 'year'='2026'}; 'tone'='authoritative'; 'variant'='standard'},
    @{'contentType'='tool-review'; 'context'=@{'toolName'='Kubernetes'; 'category'='Orchestration'; 'year'='2026'}; 'tone'='professional'; 'variant'='standard'}
  ),
  # Cloud Infrastructure & Platform (18 items)
  @(
    @{'contentType'='runbook'; 'context'=@{'provider'='CloudFlare'; 'service'='DDoS'; 'issue'='Protection'; 'year'='2026'}; 'tone'='technical'; 'variant'='standard'},
    @{'contentType'='runbook'; 'context'=@{'provider'='DataDog'; 'service'='Monitoring'; 'issue'='Alerts'; 'year'='2026'}; 'tone'='technical'; 'variant'='standard'},
    @{'contentType'='runbook'; 'context'=@{'provider'='Jenkins'; 'service'='CI/CD'; 'issue'='BuildFailure'; 'year'='2026'}; 'tone'='technical'; 'variant'='standard'},
    @{'contentType'='runbook'; 'context'=@{'provider'='Prometheus'; 'service'='Monitoring'; 'issue'='HighMemory'; 'year'='2026'}; 'tone'='technical'; 'variant'='standard'},
    @{'contentType'='security-guide'; 'context'=@{'topic'='DataEncryption'; 'technology'='Cloud'; 'severity'='P1-Critical'; 'year'='2026'}; 'tone'='authoritative'; 'variant'='standard'},
    @{'contentType'='tool-review'; 'context'=@{'toolName'='Vault'; 'category'='Secrets'; 'year'='2026'}; 'tone'='professional'; 'variant'='standard'}
  ),
  # DevOps & SRE (18 items)
  @(
    @{'contentType'='faq'; 'context'=@{'topic'='CloudCosts'; 'answerLength'='medium'}; 'tone'='helpful'; 'variant'='standard'},
    @{'contentType'='faq'; 'context'=@{'topic'='DisasterRecovery'; 'answerLength'='medium'}; 'tone'='helpful'; 'variant'='standard'},
    @{'contentType'='runbook'; 'context'=@{'provider'='LoadBalancer'; 'service'='HealthCheck'; 'issue'='Failing'; 'year'='2026'}; 'tone'='technical'; 'variant'='standard'},
    @{'contentType'='runbook'; 'context'=@{'provider'='Database'; 'service'='Replication'; 'issue'='Lag'; 'year'='2026'}; 'tone'='technical'; 'variant'='standard'},
    @{'contentType'='security-guide'; 'context'=@{'topic'='TLS'; 'technology'='Cloud'; 'severity'='P2-High'; 'year'='2026'}; 'tone'='authoritative'; 'variant'='standard'},
    @{'contentType'='tool-review'; 'context'=@{'toolName'='Prometheus'; 'category'='Monitoring'; 'year'='2026'}; 'tone'='professional'; 'variant'='standard'}
  )
)

$totalGenerated = 0
$totalErrors = 0
$startTime = Get-Date
$ts = (Get-Date -Format "yyyyMMdd_HHmmss")

Write-Host "[START] $ts | 96 items across 16 chunks`n"

for ($c = 0; $c -lt $chunks.Count; $c++) {
  $chunkNum = ($c + 1)
  Write-Host "[CHUNK $chunkNum/16] Generating 6 items..." -ForegroundColor Cyan
  
  $body = @{'tasks'=$chunks[$c]} | ConvertTo-Json -Depth 5
  
  try {
    $chunkStart = Get-Date
    $r = Invoke-WebRequest -Uri "https://clawguru.org/api/ai/generate-chunk" -Method POST `
      -ContentType "application/json" -Body $body -TimeoutSec 300 -UseBasicParsing
    $res = $r.Content | ConvertFrom-Json
    $chunkDur = ((Get-Date) - $chunkStart).TotalSeconds
    
    $gen = $res.results.Count
    $err = $res.errors.Count
    $totalGenerated += $gen
    $totalErrors += $err
    
    $status = if ($gen -eq 6) { "OK" } else { "PARTIAL" }
    Write-Host "  [$status] Generated: $gen/6, Errors: $err, Duration: $([math]::Round($chunkDur,1))s" -ForegroundColor $(if ($gen -eq 6) { "Green" } else { "Yellow" })
    
  } catch {
    $totalErrors += 6
    Write-Host "  [FAILED] Error: $($_.Exception.Message)" -ForegroundColor Red
  }
  
  Start-Sleep -Seconds 2
}

$totalDur = ((Get-Date) - $startTime).TotalSeconds
$mins = [math]::Round($totalDur / 60, 1)
$successRate = ([math]::Round(($totalGenerated / 96) * 100, 1))

Write-Host "════════════════════════════════════════════════════════════"
Write-Host "BATCH COMPLETE: 96-Item Generation" -ForegroundColor Green
Write-Host "════════════════════════════════════════════════════════════"
Write-Host "Total Generated:  $totalGenerated / 96"
Write-Host "Total Errors:     $totalErrors"
Write-Host "Success Rate:     $successRate%"
Write-Host "Duration:         ${mins} minutes (~$([math]::Round($totalDur/96,1))s per item)"
Write-Host "Cost EST:         €$([math]::Round($totalGenerated * 0.06, 2))"
Write-Host "════════════════════════════════════════════════════════════"

if ($totalGenerated -eq 96) {
  Write-Host "`n[SUCCESS] READY FOR VALIDATION & PUBLISHING" -ForegroundColor Green
}
