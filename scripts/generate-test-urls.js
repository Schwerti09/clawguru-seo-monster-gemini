#!/usr/bin/env node

// Test URL Generator für enriched Seiten
// Generiert Beispiel-URLs für die neuen Content-Enriched Seiten

const TOP_50_CITIES = [
  "berlin", "munich", "hamburg", "frankfurt", "cologne", 
  "stuttgart", "dusseldorf", "dortmund", "essen", "leipzig",
  "bremen", "dresden", "hanover", "nuremberg", "duisburg",
  "vienna", "zurich", "geneva", "basel", "paris", "lyon", 
  "marseille", "london", "amsterdam", "brussels", "madrid", 
  "barcelona", "milan", "rome", "warsaw", "prague", "budapest", 
  "bucharest", "sofia", "athens", "copenhagen", "stockholm", 
  "oslo", "helsinki", "reykjavik", "beijing", "shanghai", 
  "guangzhou", "shenzhen", "newyork", "losangeles", "chicago", 
  "houston", "phoenix", "philadelphia"
]

const TARGET_LOCALES = ["en", "es", "fr", "pt", "it", "ru", "zh", "ja"]
const BASE_RUNBOOKS = ["aws-nginx-hardening-2026", "aws-ssh-hardening-2026", "gcp-kubernetes-rbac-misconfig-2026"]

function generateTestURLs() {
  const urls = []
  
  console.log("🔗 Test URLs für enriched Content-Enrichment Seiten:")
  console.log("=" .repeat(80))
  
  // Base URLs (Deutsch)
  console.log("\n📚 Base URLs (Deutsch):")
  TOP_50_CITIES.slice(0, 5).forEach(city => {
    BASE_RUNBOOKS.forEach(runbook => {
      const url = `https://clawguru.org/de/runbook/${runbook}-${city}`
      console.log(`  ${url}`)
      urls.push(url)
    })
  })
  
  // Enriched URLs (Englisch)
  console.log("\n🌍 Enriched URLs (Englisch):")
  TOP_50_CITIES.slice(0, 5).forEach(city => {
    BASE_RUNBOOKS.forEach(runbook => {
      const url = `https://clawguru.org/en/runbook/${runbook}-${city}`
      console.log(`  ${url}`)
      urls.push(url)
    })
  })
  
  // Enriched URLs (Spanisch)
  console.log("\n🇪🇸 Enriched URLs (Spanisch):")
  TOP_50_CITIES.slice(0, 3).forEach(city => {
    BASE_RUNBOOKS.slice(0, 2).forEach(runbook => {
      const url = `https://clawguru.org/es/runbook/${runbook}-${city}`
      console.log(`  ${url}`)
      urls.push(url)
    })
  })
  
  // Enriched URLs (Französisch)
  console.log("\n🇫🇷 Enriched URLs (Französisch):")
  TOP_50_CITIES.slice(0, 3).forEach(city => {
    BASE_RUNBOOKS.slice(0, 2).forEach(runbook => {
      const url = `https://clawguru.org/fr/runbook/${runbook}-${city}`
      console.log(`  ${url}`)
      urls.push(url)
    })
  })
  
  // China Cities URLs (Englisch)
  console.log("\n🇨🇳 China Cities (Englisch):")
  ["beijing", "shanghai", "guangzhou", "shenzhen"].forEach(city => {
    BASE_RUNBOOKS.slice(0, 2).forEach(runbook => {
      const url = `https://clawguru.org/en/runbook/${runbook}-${city}`
      console.log(`  ${url}`)
      urls.push(url)
    })
  })
  
  // USA Cities URLs (Englisch)
  console.log("\n🇺🇸 USA Cities (Englisch):")
  ["newyork", "losangeles", "chicago", "houston"].forEach(city => {
    BASE_RUNBOOKS.slice(0, 2).forEach(runbook => {
      const url = `https://clawguru.org/en/runbook/${runbook}-${city}`
      console.log(`  ${url}`)
      urls.push(url)
    })
  })
  
  // Special: Chinese Locale für China Cities
  console.log("\n🇨🇳 China Cities (Chinese Locale):")
  ["beijing", "shanghai"].forEach(city => {
    BASE_RUNBOOKS.slice(0, 1).forEach(runbook => {
      const url = `https://clawguru.org/zh/runbook/${runbook}-${city}`
      console.log(`  ${url}`)
      urls.push(url)
    })
  })
  
  // Special: Japanese Locale für Tokyo (wenn vorhanden)
  console.log("\n🇯🇵 Japanese Locale (Beispiel):")
  ["berlin", "tokyo"].filter(city => city === "berlin").forEach(city => {
    BASE_RUNBOOKS.slice(0, 1).forEach(runbook => {
      const url = `https://clawguru.org/ja/runbook/${runbook}-${city}`
      console.log(`  ${url}`)
      urls.push(url)
    })
  })
  
  console.log("\n" + "=".repeat(80))
  console.log(`📊 Gesamt-URLs in diesem Beispiel: ${urls.length}`)
  console.log(`🎯 Mögliche Gesamt-URLs mit allen Städten/Locales: ${TOP_50_CITIES.length * TARGET_LOCALES.length * BASE_RUNBOOKS.length}`)
  console.log(`🚀 Current Scale: ~1.980 URLs`)
  console.log(`🔥 Target: 1.000.000 URLs`)
  
  return urls
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateTestURLs()
}

export { generateTestURLs }
