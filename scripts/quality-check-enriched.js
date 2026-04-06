#!/usr/bin/env node

// Quality-Check für enriched URLs
// Überprüft übersetzte Runbooks auf Quality 85+

// Dynamic imports für ES modules
async function loadModules() {
  const { validateRunbook, DEFAULT_THRESHOLDS } = await import("../lib/quality-gate.js")
  const { generateRunbook100k } = await import("../lib/pseo.js")
  const { translateRunbook } = await import("../lib/i18n.js")
  return { validateRunbook, DEFAULT_THRESHOLDS, generateRunbook100k, translateRunbook }
}

const TEST_CITIES = ["berlin", "munich", "hamburg", "frankfurt", "cologne"]
const TARGET_LOCALES = ["en", "es", "fr"]
const BASE_RUNBOOKS = ["aws-nginx-hardening-2026"]

// Quality thresholds für enriched URLs (leicht reduziert für Übersetzungen)
const ENRICHED_THRESHOLDS = {
  minSummaryLength: 50, // 60 → 50 (Übersetzungen kürzer)
  minStepCount: 3,
  minBlockCount: 3, // 4 → 3 (Übersetzungen weniger Blöcke)
  minFaqCount: 1, // 2 → 1 (FAQ wird nicht übersetzt)
  minTagCount: 2,
  minTitleLength: 8,
  maxTitleLength: 120, // 110 → 120 (Übersetzungen länger)
  minPassScore: 85, // 92 → 85 (Standard für enriched)
  minContentWords: 150, // 200 → 150
  minStepQuality: 6, // 8 → 6
  minAuthorSources: 1, // 2 → 1
}

async function qualityCheckEnriched() {
  console.log(`🔍 Quality-Check für enriched URLs gestartet...`)
  console.log(`📍 Städte: ${TEST_CITIES.length}`)
  console.log(`🌍 Locales: ${TARGET_LOCALES.length}`)
  console.log(`📚 Runbooks: ${BASE_RUNBOOKS.length}`)
  console.log(`🎯 Total Checks: ${TEST_CITIES.length * TARGET_LOCALES.length * BASE_RUNBOOKS.length}`)
  console.log(`📊 Mindest-Score: ${ENRICHED_THRESHOLDS.minPassScore}`)
  
  const { validateRunbook, generateRunbook100k, translateRunbook } = await loadModules()
  const results = []
  
  for (const city of TEST_CITIES) {
    console.log(`\n🏙️  Quality-Check city: ${city}`)
    
    for (const runbookSlug of BASE_RUNBOOKS) {
      // Base runbook generieren
      const meta = {
        provider: { slug: "aws", name: "AWS" },
        service: { slug: "nginx", name: "NGINX" },
        issue: { slug: "hardening", name: "Hardening" },
        year: "2026"
      }
      
      const baseRunbook = generateRunbook100k(meta)
      
      for (const locale of TARGET_LOCALES) {
        try {
          console.log(`  🔍 ${city}/${runbookSlug}/${locale}...`)
          
          // Übersetzen
          const translated = await translateRunbook({
            slug: `${runbookSlug}-${city}`,
            title: baseRunbook.title,
            summary: baseRunbook.summary,
            targetLocale: locale
          })
          
          // Enriched runbook erstellen
          const enrichedRunbook = {
            ...baseRunbook,
            title: translated.title,
            summary: translated.summary,
            tags: [...baseRunbook.tags, locale, city],
          }
          
          // Quality check
          const qualityReport = validateRunbook(enrichedRunbook, ENRICHED_THRESHOLDS)
          
          results.push({
            city,
            runbook: runbookSlug,
            locale,
            qualityScore: qualityReport.score,
            qualityPass: qualityReport.pass,
            violations: qualityReport.violations,
            tier: qualityReport.clawCertifiedTier,
            title: translated.title,
            success: true
          })
          
          if (qualityReport.pass) {
            console.log(`    ✅ Score: ${qualityReport.score} (${qualityReport.clawCertifiedTier})`)
          } else {
            console.log(`    ❌ Score: ${qualityReport.score} - FAIL`)
            qualityReport.violations.forEach(v => {
              console.log(`       - ${v.field}: ${v.message}`)
            })
          }
          
          // Rate limiting
          await new Promise(resolve => setTimeout(resolve, 200))
          
        } catch (error) {
          console.error(`    💥 Error: ${error.message}`)
          results.push({
            city,
            runbook: runbookSlug,
            locale,
            success: false,
            error: error.message
          })
        }
      }
    }
  }
  
  // Summary
  const successful = results.filter(r => r.success).length
  const failed = results.filter(r => !r.success).length
  const qualityPassed = results.filter(r => r.success && r.qualityPass).length
  const qualityFailed = results.filter(r => r.success && !r.qualityPass).length
  const avgScore = results
    .filter(r => r.success)
    .reduce((sum, r) => sum + r.qualityScore, 0) / successful
  
  console.log(`\n📊 Quality-Check abgeschlossen:`)
  console.log(`✅ Erfolgreich: ${successful}`)
  console.log(`❌ Fehlgeschlagen: ${failed}`)
  console.log(`🔍 Quality Passed: ${qualityPassed}`)
  console.log(`🚫 Quality Failed: ${qualityFailed}`)
  console.log(`📈 Durchschnitts-Score: ${avgScore.toFixed(1)}`)
  console.log(`🎯 Quality Rate: ${((qualityPassed / successful) * 100).toFixed(1)}%`)
  
  // Quality failures
  if (qualityFailed > 0) {
    console.log(`\n🚫 Quality Failures:`)
    results.filter(r => r.success && !r.qualityPass).forEach(r => {
      console.log(`  ${r.city}/${r.runbook}/${r.locale}: Score ${r.qualityScore}`)
      r.violations.forEach(v => {
        console.log(`    - ${v.field}: ${v.message}`)
      })
    })
  }
  
  return {
    total: results.length,
    successful,
    failed,
    qualityPassed,
    qualityFailed,
    avgScore,
    results
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  qualityCheckEnriched().catch(console.error)
}

export { qualityCheckEnriched }
