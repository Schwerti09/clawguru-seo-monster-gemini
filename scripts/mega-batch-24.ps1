# 24-ITEM MEGA BATCH TEST SCRIPT
Write-Host "======================================================"
Write-Host "MEGA BATCH: 24-Item Generation + Validation"
Write-Host "======================================================"

$chunks = @(
  # CHUNK 1: AWS
  @(
    @{'contentType'='runbook'; 'context'=@{'provider'='AWS'; 'service'='EC2'; 'issue'='HighCPU'; 'year'='2026'}; 'tone'='technical'; 'variant'='standard'},
    @{'contentType'='runbook'; 'context'=@{'provider'='AWS'; 'service'='RDS'; 'issue'='Latency'; 'year'='2026'}; 'tone'='technical'; 'variant'='standard'},
    @{'contentType'='runbook'; 'context'=@{'provider'='AWS'; 'service'='S3'; 'issue'='Permissions'; 'year'='2026'}; 'tone'='technical'; 'variant'='standard'},
    @{'contentType'='runbook'; 'context'=@{'provider'='AWS'; 'service'='Lambda'; 'issue'='Timeouts'; 'year'='2026'}; 'tone'='technical'; 'variant'='standard'},
    @{'contentType'='security-guide'; 'context'=@{'topic'='IAM'; 'technology'='AWS'; 'severity'='P1-Critical'; 'year'='2026'}; 'tone'='authoritative'; 'variant'='standard'},
    @{'contentType'='tool-review'; 'context'=@{'toolName'='Terraform'; 'category'='IaC'; 'year'='2026'}; 'tone'='professional'; 'variant'='standard'}
  ),
  # CHUNK 2: GCP
  @(
    @{'contentType'='runbook'; 'context'=@{'provider'='GCP'; 'service'='Compute'; 'issue'='Memory'; 'year'='2026'}; 'tone'='technical'; 'variant'='standard'},
    @{'contentType'='runbook'; 'context'=@{'provider'='GCP'; 'service'='CloudSQL'; 'issue'='Authentication'; 'year'='2026'}; 'tone'='technical'; 'variant'='standard'},
    @{'contentType'='runbook'; 'context'=@{'provider'='GCP'; 'service'='Storage'; 'issue'='Quota'; 'year'='2026'}; 'tone'='technical'; 'variant'='standard'},
    @{'contentType'='runbook'; 'context'=@{'provider'='GCP'; 'service'='Firestore'; 'issue'='Consistency'; 'year'='2026'}; 'tone'='technical'; 'variant'='standard'},
    @{'contentType'='security-guide'; 'context'=@{'topic'='ZeroTrust'; 'technology'='Cloud'; 'severity'='P2-High'; 'year'='2026'}; 'tone'='authoritative'; 'variant'='standard'},
    @{'contentType'='tool-review'; 'context'=@{'toolName'='Pulumi'; 'category'='IaC'; 'year'='2026'}; 'tone'='professional'; 'variant'='standard'}
  ),
  # CHUNK 3: Azure
  @(
    @{'contentType'='runbook'; 'context'=@{'provider'='Azure'; 'service'='VirtualMachine'; 'issue'='DiskSpace'; 'year'='2026'}; 'tone'='technical'; 'variant'='standard'},
    @{'contentType'='runbook'; 'context'=@{'provider'='Azure'; 'service'='AppService'; 'issue'='SlowResponse'; 'year'='2026'}; 'tone'='technical'; 'variant'='standard'},
    @{'contentType'='runbook'; 'context'=@{'provider'='Azure'; 'service'='CosmosDB'; 'issue'='Latency'; 'year'='2026'}; 'tone'='technical'; 'variant'='standard'},
    @{'contentType'='runbook'; 'context'=@{'provider'='Azure'; 'service'='KeyVault'; 'issue'='AccessDenied'; 'year'='2026'}; 'tone'='technical'; 'variant'='standard'},
    @{'contentType'='security-guide'; 'context'=@{'topic'='NetworkSecurity'; 'technology'='Cloud'; 'severity'='P2-High'; 'year'='2026'}; 'tone'='authoritative'; 'variant'='standard'},
    @{'contentType'='tool-review'; 'context'=@{'toolName'='Ansible'; 'category'='ConfigMgmt'; 'year'='2026'}; 'tone'='professional'; 'variant'='standard'}
  ),
  # CHUNK 4: Mixed
  @(
    @{'contentType'='faq'; 'context'=@{'topic'='CloudCosts'; 'answerLength'='medium'}; 'tone'='helpful'; 'variant'='standard'},
    @{'contentType'='security-guide'; 'context'=@{'topic'='DataEncryption'; 'technology'='Cloud'; 'severity'='P1-Critical'; 'year'='2026'}; 'tone'='authoritative'; 'variant'='standard'},
    @{'contentType'='tool-review'; 'context'=@{'toolName'='Kubernetes'; 'category'='Orchestration'; 'year'='2026'}; 'tone'='professional'; 'variant'='standard'},
    @{'contentType'='faq'; 'context'=@{'topic'='DisasterRecovery'; 'answerLength'='medium'}; 'tone'='helpful'; 'variant'='standard'},
    @{'contentType'='runbook'; 'context'=@{'provider'='Kubernetes'; 'service'='Pod'; 'issue'='CrashLoop'; 'year'='2026'}; 'tone'='technical'; 'variant'='standard'},
    @{'contentType'='tool-review'; 'context'=@{'toolName'='Docker'; 'category'='Containers'; 'year'='2026'}; 'tone'='professional'; 'variant'='standard'}
  )
)

$totalGenerated = 0
$totalGold = 0
$totalSilver = 0
$totalBronze = 0
$totalReview = 0
$allResults = @()

for ($c = 0; $c -lt $chunks.Count; $c++) {
  Write-Host "`n[CHUNK $(($c)+1)/4] Generating 6 items..."
  $body = @{'tasks'=$chunks[$c]} | ConvertTo-Json -Depth 5
  
  try {
    $ts = Get-Date
    $r = Invoke-WebRequest -Uri "https://clawguru.org/api/ai/generate-chunk" -Method POST `
      -ContentType "application/json" -Body $body -TimeoutSec 300 -UseBasicParsing
    $res = $r.Content | ConvertFrom-Json
    $dur = ((Get-Date) - $ts).TotalSeconds
    
    Write-Host "  Status: $($res.results.Count)/6 generated, $($res.errors.Count) errors in $([math]::Round($dur,1))s"
    $totalGenerated += $res.results.Count
    $allResults += $res.results
    
  } catch {
    Write-Host "  ERROR: $($_.Exception.Message)"
  }
}

Write-Host "`n======================================================"
Write-Host "FINAL RESULTS"
Write-Host "======================================================"
Write-Host "Total Generated: $totalGenerated / 24"
Write-Host "Success Rate: $([math]::Round(($totalGenerated / 24) * 100, 1))%"

if ($totalGenerated -gt 0) {
  Write-Host "`nItems generated:"
  $allResults | Select-Object -First 24 | ForEach-Object { Write-Host "  OK: $($_.title)" }
}
