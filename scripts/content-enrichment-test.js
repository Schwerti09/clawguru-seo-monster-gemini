#!/usr/bin/env node

// Content-Enrichment Batch Script - Test Run (5 Städte)
// Target: Top-5 Städte mit locale-spezifischen Übersetzungen

// Dynamic imports für ES modules
async function loadModules() {
  const { translateRunbook } = await import("../lib/i18n.js")
  const { materializedRunbooks } = await import("../lib/pseo.js")
  return { translateRunbook, materializedRunbooks }
}

const TEST_CITIES = [
  "berlin", "munich", "hamburg", "frankfurt", "cologne"
]

const TARGET_LOCALES = ["en", "es", "fr"] // Reduced for test
const BASE_RUNBOOKS = ["aws-nginx-hardening-2026"] // Reduced for test

async function enrichTestCities() {
  console.log(`🚀 Content-Enrichment Test für Top-5 Städte gestartet...`)
  console.log(`📍 Städte: ${TEST_CITIES.length}`)
  console.log(`🌍 Locales: ${TARGET_LOCALES.length}`)
  console.log(`📚 Runbooks: ${BASE_RUNBOOKS.length}`)
  console.log(`🎯 Total URLs: ${TEST_CITIES.length * TARGET_LOCALES.length * BASE_RUNBOOKS.length}`)
  
  try {
    console.log(`📦 Lade Module...`)
    const { translateRunbook, materializedRunbooks } = await loadModules()
    console.log(`✅ Module geladen`)
    
    const runbooks = materializedRunbooks() || []
    console.log(`📚 Runbooks gefunden: ${runbooks.length}`)
    
    const results = []
    
    for (const city of TEST_CITIES) {
      console.log(`\n🏙️  Processing city: ${city}`)
      
      for (const runbook of BASE_RUNBOOKS) {
        const baseRunbook = runbooks.find(rb => rb.slug === runbook)
        if (!baseRunbook) {
          console.warn(`⚠️  Runbook ${runbook} nicht gefunden`)
          continue
        }
        
        console.log(`  📖 Base: ${baseRunbook.title.substring(0, 50)}...`)
        
        for (const locale of TARGET_LOCALES) {
          try {
            console.log(`  🌐 ${city}/${runbook}/${locale}...`)
            
            const result = await translateRunbook({
              slug: `${runbook}-${city}`,
              title: baseRunbook.title,
              summary: baseRunbook.summary,
              targetLocale: locale
            })
            
            results.push({
              city,
              runbook,
              locale,
              success: true,
              title: result.title,
              summary: result.summary
            })
            
            console.log(`    ✅ ${result.title.substring(0, 50)}...`)
            
            // Rate limiting - 100ms delay
            await new Promise(resolve => setTimeout(resolve, 100))
            
          } catch (error) {
            console.error(`    ❌ Error: ${error.message}`)
            results.push({
              city,
              runbook,
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
    
    console.log(`\n📊 Content-Enrichment Test abgeschlossen:`)
    console.log(`✅ Erfolgreich: ${successful}`)
    console.log(`❌ Fehlgeschlagen: ${failed}`)
    console.log(`📈 Success Rate: ${((successful / results.length) * 100).toFixed(1)}%`)
    
    if (failed > 0) {
      console.log(`\n❌ Fehlgeschlagene Übersetzungen:`)
      results.filter(r => !r.success).forEach(r => {
        console.log(`  ${r.city}/${r.runbook}/${r.locale}: ${r.error}`)
      })
    }
    
    return results
  } catch (error) {
    console.error(`💥 Fatal Error: ${error.message}`)
    console.error(`Stack: ${error.stack}`)
    throw error
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  enrichTestCities().catch(console.error)
}

export { enrichTestCities }
