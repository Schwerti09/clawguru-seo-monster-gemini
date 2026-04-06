#!/usr/bin/env node

// Content-Enrichment Batch Script
// Target: Top-50 Städte mit locale-spezifischen Übersetzungen

// Dynamic imports für ES modules
async function loadModules() {
  const { translateRunbook } = await import("../lib/i18n.js")
  const { materializedRunbooks } = await import("../lib/pseo.js")
  return { translateRunbook, materializedRunbooks }
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

async function enrichTopCities() {
  console.log(`🚀 Content-Enrichment für Top-50 Städte gestartet...`)
  console.log(`📍 Städte: ${TOP_50_CITIES.length}`)
  console.log(`🌍 Locales: ${TARGET_LOCALES.length}`)
  console.log(`📚 Runbooks: ${BASE_RUNBOOKS.length}`)
  console.log(`🎯 Total URLs: ${TOP_50_CITIES.length * TARGET_LOCALES.length * BASE_RUNBOOKS.length}`)
  
  const { translateRunbook, materializedRunbooks } = await loadModules()
  const runbooks = materializedRunbooks() || []
  const results = []
  
  for (const city of TOP_50_CITIES) {
    console.log(`\n🏙️  Processing city: ${city}`)
    
    for (const runbook of BASE_RUNBOOKS) {
      const baseRunbook = runbooks.find(rb => rb.slug === runbook)
      if (!baseRunbook) {
        console.warn(`⚠️  Runbook ${runbook} nicht gefunden`)
        continue
      }
      
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
  
  console.log(`\n📊 Content-Enrichment abgeschlossen:`)
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
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  enrichTopCities().catch(console.error)
}

export { enrichTopCities }
