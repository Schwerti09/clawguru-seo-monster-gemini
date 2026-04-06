#!/usr/bin/env node

// Massive Wave Execution - Batch mit Rate Limiting & Monitoring
// 🔥 FEUER FREI! 1M Pages Target

// Dynamic imports für ES modules
async function loadModules() {
  const { translateRunbook } = await import("../lib/i18n.js")
  const { materializedRunbooks } = await import("../lib/pseo.js")
  const { validateRunbook } = await import("../lib/quality-gate.js")
  return { translateRunbook, materializedRunbooks, validateRunbook }
}

const TOP_50_CITIES = [
  // DACH Core (15)
  "berlin", "munich", "hamburg", "frankfurt", "cologne", 
  "stuttgart", "dusseldorf", "dortmund", "essen", "leipzig",
  "bremen", "dresden", "hanover", "nuremberg", "duisburg",
  
  // EU Core (15)
  "vienna", "zurich", "geneva", "basel", "paris", "lyon", 
  "marseille", "london", "amsterdam", "brussels", "madrid", 
  "barcelona", "milan", "rome", "warsaw",
  
  // CEE/Balkan (5)
  "prague", "budapest", "bucharest", "sofia", "athens",
  
  // Nordics (5)
  "copenhagen", "stockholm", "oslo", "helsinki", "reykjavik",
  
  // China Mega (4)
  "beijing", "shanghai", "guangzhou", "shenzhen",
  
  // USA Top (6)
  "newyork", "losangeles", "chicago", "houston", "phoenix", "philadelphia"
]

const TARGET_LOCALES = ["en", "es", "fr", "pt", "it", "ru", "zh", "ja"]
const BASE_RUNBOOKS = ["aws-nginx-hardening-2026", "aws-ssh-hardening-2026", "gcp-kubernetes-rbac-misconfig-2026"]

// Rate limiting für API calls
const RATE_LIMIT_DELAY_MS = 150 // 150ms zwischen API calls
const BATCH_SIZE = 10 // 10 URLs pro Batch
const BATCH_DELAY_MS = 2000 // 2s Pause zwischen Batches

// Quality thresholds für enriched URLs
const ENRICHED_THRESHOLDS = {
  minSummaryLength: 50,
  minStepCount: 3,
  minBlockCount: 3,
  minFaqCount: 1,
  minTagCount: 2,
  minTitleLength: 8,
  maxTitleLength: 120,
  minPassScore: 85, // QUALITY GATE 85+
  minContentWords: 150,
  minStepQuality: 6,
  minAuthorSources: 1,
}

class WaveMonitor {
  constructor() {
    this.startTime = Date.now()
    this.stats = {
      total: 0,
      successful: 0,
      failed: 0,
      qualityPassed: 0,
      qualityFailed: 0,
      apiCalls: 0,
      batches: 0
    }
    this.errors = []
  }

  logProgress(current, total) {
    const percent = ((current / total) * 100).toFixed(1)
    const elapsed = Date.now() - this.startTime
    const rate = (current / (elapsed / 1000)).toFixed(2)
    const eta = total > 0 ? ((total - current) / (current / (elapsed / 1000))) : 0
    
    console.log(`\n📊 Wave Progress: ${current}/${total} (${percent}%) | Rate: ${rate}/s | ETA: ${Math.floor(eta)}s`)
    console.log(`✅ Success: ${this.stats.successful} | ❌ Failed: ${this.stats.failed} | 🔍 Quality: ${this.stats.qualityPassed}/${this.stats.successful}`)
  }

  logBatch(batchNum, totalBatches, batchResults) {
    this.stats.batches++
    const batchSuccess = batchResults.filter(r => r.success).length
    const batchQuality = batchResults.filter(r => r.success && r.qualityPass).length
    
    console.log(`\n📦 Batch ${batchNum}/${totalBatches} completed:`)
    console.log(`   URLs: ${batchResults.length} | Success: ${batchSuccess} | Quality: ${batchQuality}`)
    
    if (batchSuccess < batchResults.length) {
      const failed = batchResults.filter(r => !r.success)
      console.log(`   ❌ Failed: ${failed.map(f => `${f.city}/${f.runbook}/${f.locale}`).join(", ")}`)
    }
  }

  logSummary() {
    const elapsed = Date.now() - this.startTime
    const rate = (this.stats.successful / (elapsed / 1000)).toFixed(2)
    const qualityRate = this.stats.successful > 0 ? ((this.stats.qualityPassed / this.stats.successful) * 100).toFixed(1) : 0
    
    console.log(`\n🔥 MASSIVE WAVE EXECUTION ABGESCHLOSSEN`)
    console.log(`⏱️  Dauer: ${(elapsed / 1000).toFixed(1)}s`)
    console.log(`📊 Gesamt: ${this.stats.total} URLs`)
    console.log(`✅ Erfolgreich: ${this.stats.successful} (${((this.stats.successful / this.stats.total) * 100).toFixed(1)}%)`)
    console.log(`🔍 Quality Passed: ${this.stats.qualityPassed} (${qualityRate}%)`)
    console.log(`📈 Rate: ${rate} URLs/s`)
    console.log(`🌐 API Calls: ${this.stats.apiCalls}`)
    console.log(`📦 Batches: ${this.stats.batches}`)
    
    if (this.errors.length > 0) {
      console.log(`\n❌ Errors (${this.errors.length}):`)
      this.errors.slice(0, 10).forEach(e => {
        console.log(`   ${e.city}/${e.runbook}/${e.locale}: ${e.error}`)
      })
      if (this.errors.length > 10) {
        console.log(`   ... und ${this.errors.length - 10} weitere`)
      }
    }
  }
}

async function massiveWaveExecution() {
  const monitor = new WaveMonitor()
  const totalURLs = TOP_50_CITIES.length * TARGET_LOCALES.length * BASE_RUNBOOKS.length
  monitor.stats.total = totalURLs
  
  console.log(`🔥 MASSIVE WAVE EXECUTION - FEUER FREI!`)
  console.log(`📍 Städte: ${TOP_50_CITIES.length}`)
  console.log(`🌍 Locales: ${TARGET_LOCALES.length}`)
  console.log(`📚 Runbooks: ${BASE_RUNBOOKS.length}`)
  console.log(`🎯 Total URLs: ${totalURLs}`)
  console.log(`📊 Quality Gate: ${ENRICHED_THRESHOLDS.minPassScore}+`)
  console.log(`⚡ Rate Limit: ${RATE_LIMIT_DELAY_MS}ms`)
  console.log(`📦 Batch Size: ${BATCH_SIZE}`)
  
  const { translateRunbook, materializedRunbooks, validateRunbook } = await loadModules()
  const runbooks = materializedRunbooks() || []
  const allResults = []
  
  let processed = 0
  let batchNum = 0
  const totalBatches = Math.ceil(totalURLs / BATCH_SIZE)
  
  for (const city of TOP_50_CITIES) {
    for (const runbook of BASE_RUNBOOKS) {
      const baseRunbook = runbooks.find(rb => rb.slug === runbook)
      if (!baseRunbook) {
        console.warn(`⚠️  Runbook ${runbook} nicht gefunden`)
        continue
      }
      
      for (const locale of TARGET_LOCALES) {
        processed++
        
        // Progress logging
        if (processed % 50 === 0 || processed === totalURLs) {
          monitor.logProgress(processed, totalURLs)
        }
        
        try {
          // Übersetzen
          const translated = await translateRunbook({
            slug: `${runbook}-${city}`,
            title: baseRunbook.title,
            summary: baseRunbook.summary,
            targetLocale: locale
          })
          
          monitor.stats.apiCalls++
          
          // Quality check
          const enrichedRunbook = {
            ...baseRunbook,
            title: translated.title,
            summary: translated.summary,
            tags: [...baseRunbook.tags, locale, city],
          }
          
          const qualityReport = validateRunbook(enrichedRunbook, ENRICHED_THRESHOLDS)
          
          const result = {
            city,
            runbook,
            locale,
            success: true,
            qualityScore: qualityReport.score,
            qualityPass: qualityReport.pass,
            title: translated.title
          }
          
          allResults.push(result)
          monitor.stats.successful++
          
          if (qualityReport.pass) {
            monitor.stats.qualityPassed++
          } else {
            monitor.stats.qualityFailed++
          }
          
          // Rate limiting
          await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY_MS))
          
        } catch (error) {
          const errorResult = {
            city,
            runbook,
            locale,
            success: false,
            error: error.message
          }
          
          allResults.push(errorResult)
          monitor.stats.failed++
          monitor.errors.push(errorResult)
          
          console.error(`❌ ${city}/${runbook}/${locale}: ${error.message}`)
          
          // Rate limiting auch bei Fehlern
          await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY_MS))
        }
        
        // Batch processing
        if (processed % BATCH_SIZE === 0) {
          batchNum++
          const batchResults = allResults.slice((batchNum - 1) * BATCH_SIZE, batchNum * BATCH_SIZE)
          monitor.logBatch(batchNum, totalBatches, batchResults)
          
          // Pause zwischen Batches
          if (batchNum < totalBatches) {
            console.log(`⏸️  Batch Pause (${BATCH_DELAY_MS}ms)...`)
            await new Promise(resolve => setTimeout(resolve, BATCH_DELAY_MS))
          }
        }
      }
    }
  }
  
  monitor.logSummary()
  return monitor.stats
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  massiveWaveExecution().catch(console.error)
}

export { massiveWaveExecution }
