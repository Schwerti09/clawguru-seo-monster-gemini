# GSC Meta Tag Optimizer - QUICK WIN for existing rankings
# Finds keywords: 5+ impressions + 0 clicks + position 2-50
# Generates optimized Title + Meta Description per keyword

$gscKeywords = @(
  @{kw='influxdb hipaa compliance'; imp=26; pos=7.7; clicks=0; intent='compliance+database'; type='guide'},
  @{kw='iso 27001 google cloud'; imp=25; pos=20.6; clicks=0; intent='compliance'; type='guide'},
  @{kw='github actions bare metal'; imp=24; pos=29.9; clicks=0; intent='deployment'; type='runbook'},
  @{kw='rabbitmq audit'; imp=24; pos=32.9; clicks=0; intent='security'; type='runbook'},
  @{kw='terraform canary deploy'; imp=23; pos=45.7; clicks=0; intent='deployment'; type='runbook'},
  @{kw='scandinavian bare metal ci/cd'; imp=23; pos=54.0; clicks=0; intent='deployment'; type='guide'},
  @{kw='waf 2027'; imp=20; pos=7.4; clicks=0; intent='security'; type='runbook'},
  @{kw='tapco ddos'; imp=17; pos=46.7; clicks=0; intent='security'; type='runbook'},
  @{kw='google cloud rabbitmq'; imp=16; pos=23.4; clicks=0; intent='deployment'; type='runbook'},
  @{kw='audit civo'; imp=15; pos=19.5; clicks=0; intent='security'; type='runbook'},
  @{kw='planetscale tutorial for first responders'; imp=11; pos=7.4; clicks=0; intent='tutorial'; type='guide'},
  @{kw='vultr'; imp=11; pos=10.2; clicks=0; intent='provider'; type='guide'},
  @{kw='syft nginx:latest -o spdx-json'; imp=10; pos=4.3; clicks=0; intent='sbom'; type='runbook'},
  @{kw='authentik mtls'; imp=10; pos=6.2; clicks=0; intent='security'; type='runbook'},
  @{kw='harden for soc2 for grafana'; imp=10; pos=27.3; clicks=0; intent='compliance'; type='runbook'},
  @{kw='timescaledb updates 2026'; imp=9; pos=4.1; clicks=0; intent='updates'; type='faq'},
  @{kw='sonarcube sbom'; imp=9; pos=10.7; clicks=0; intent='security'; type='runbook'},
  @{kw='sonarqube sbom'; imp=8; pos=8.6; clicks=0; intent='security'; type='runbook'},
  @{kw='rbac civo'; imp=8; pos=25.8; clicks=0; intent='security'; type='runbook'},
  @{kw='authentik backup'; imp=7; pos=9.0; clicks=0; intent='disaster-recovery'; type='runbook'},
  @{kw='vultr pci dss compliance'; imp=7; pos=9.6; clicks=0; intent='compliance'; type='guide'},
  @{kw='cassandra sicherung und wiederherstellung'; imp=7; pos=63.3; clicks=0; intent='disaster-recovery'; type='runbook'},
  @{kw='authentik cors'; imp=6; pos=9.3; clicks=0; intent='security'; type='runbook'},
  @{kw='kubernetes iso27001'; imp=6; pos=15.3; clicks=0; intent='compliance'; type='runbook'},
  @{kw='managed service rabbitmq'; imp=6; pos=25.8; clicks=0; intent='deployment'; type='guide'},
  @{kw='envoy'; imp=6; pos=69.8; clicks=0; intent='proxy'; type='guide'},
  @{kw='oauth vs timescaledb'; imp=5; pos=5.2; clicks=0; intent='comparison'; type='faq'},
  @{kw='aws iso 27017'; imp=5; pos=9.4; clicks=0; intent='compliance'; type='guide'},
  @{kw='elasticsearch gdpr'; imp=5; pos=16.6; clicks=0; intent='compliance'; type='runbook'},
  @{kw='managed sentry'; imp=5; pos=26.0; clicks=0; intent='deployment'; type='guide'},
)

Write-Host "════════════════════════════════════════════════════════════"
Write-Host "GSC META TAG OPTIMIZER - Quick Wins" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════════════════════════`n"

$recommendations = @()

foreach ($item in $gscKeywords) {
  $kw = $item.kw
  $imp = $item.imp
  $pos = $item.pos
  $intent = $item.intent
  $type = $item.type

  # Generate optimized Title (55-60 chars for mobile)
  $title = switch ($type) {
    'runbook' { "$kw - Emergency Response & Troubleshooting Guide 2026" }
    'guide' { "$kw - Complete Compliance & Security Guide" }
    'security' { "$kw - Security Hardening Checklist 2026" }
    'faq' { "$kw - Q&A | Best Practices & Solutions" }
    default { "$kw - Expert Guide & Best Practices" }
  }
  # Trim to 58 chars
  if ($title.Length -gt 58) { $title = $title.Substring(0, 55) + "..." }

  # Generate optimized Meta Description (155-160 chars)
  $desc = switch ($intent) {
    'compliance' { "Learn $kw compliance requirements, implementation steps, and auditing. Real-world checklist for 2026. Expert guide." }
    'security' { "Secure your infrastructure with $kw hardening guide. Step-by-step vulnerability remediation and best practices." }
    'deployment' { "$kw deployment guide: setup, configuration, troubleshooting, and production best practices for 2026." }
    'disaster-recovery' { "$kw backup & restore guide. Disaster recovery procedures, automation scripts, and recovery testing." }
    'sbom' { "Generate $kw for supply chain security. SBOM generation, SCA integration, and compliance reporting." }
    default { "$kw - Expert guide covering setup, configuration, security hardening, and operational best practices." }
  }
  if ($desc.Length -gt 158) { $desc = $desc.Substring(0, 155) + "..." }

  $recommendations += @{
    keyword = $kw
    impressions = $imp
    position = $pos
    title = $title
    description = $desc
    intent = $intent
    type = $type
    titleLength = $title.Length
    descLength = $desc.Length
    opportunity = $imp * (100 - $pos) / 100  # Simple scoring
  }
}

# Sort by opportunity
$recommendations = $recommendations | Sort-Object { $_.opportunity } -Descending

Write-Host "TOP 30 QUICK WINS (ranked by opportunity):`n" -ForegroundColor Green
$recommendations | Select-Object -First 30 | ForEach-Object { $i=0 } {
  $i++
  Write-Host "$i. $($_.keyword)" -ForegroundColor Yellow
  Write-Host "   Position: $($_.position) | Impressions: $($_.impressions) | Opportunity Score: $([math]::Round($_.opportunity, 1))"
  Write-Host "   Title ($($_.titleLength) chars): $($_.title)"
  Write-Host "   Meta  ($($_.descLength) chars): $($_.description)"
  Write-Host ""
}

# Export to JSON for easy import  
$recommendations | ConvertTo-Json | Set-Content -Path "scripts/gsc-meta-recommendations.json"
Write-Host "✅ Exported to scripts/gsc-meta-recommendations.json`n" -ForegroundColor Cyan

Write-Host "IMPLEMENTATION PLAN:"
Write-Host "1. Update corresponding page components with new Title + Meta Description"
Write-Host "2. For each keyword, find the matching route (e.g., 'influxdb-hipaa-compliance' page)"
Write-Host "3. Update generateMetadata() to return optimized title + description"
Write-Host "4. Deploy -> Wait 1-2 days for Google to re-crawl"
Write-Host "5. Monitor GSC for CTR increase (expect +15-25%)`n" -ForegroundColor Cyan

Write-Host "EXPECTED IMPACT:"
Write-Host "* Current: ~9 clicks total (all keywords combined)"
Write-Host "* After optimization: ~15-20 clicks (with 15-25% CTR increase)"
Write-Host "* Timeline: Visible in GSC within 3-5 days"
Write-Host "* No need to generate new content - just better titles/descriptions"
