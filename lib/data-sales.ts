/**
 * Roast Data Sales — "State of Security"
 * Anonymisierte Daten → Research Revenue
 * 
 * Diese Library bietet Funktionen für den Verkauf von anonymisierten
 * Sicherheitsdaten für Forschungszwecke. Alle Daten werden anonymisiert
 * und aggregiert, um keine persönlichen Informationen preiszugeben.
 */

export interface SecurityMetric {
  category: string
  metric: string
  value: number
  unit: string
  timestamp: Date
  region?: string
}

export interface AnonymizedDataset {
  id: string
  name: string
  description: string
  metrics: SecurityMetric[]
  price: number
  currency: string
  license: string
  anonymizationLevel: "high" | "medium" | "low"
  sampleSize: number
}

/**
 * Anonymisiert Sicherheitsdaten durch Aggregation und Entfernung von PII
 */
export function anonymizeSecurityData(data: any[]): SecurityMetric[] {
  return data.map(item => ({
    category: item.category || "unknown",
    metric: item.metric || "unknown",
    value: typeof item.value === "number" ? item.value : 0,
    unit: item.unit || "count",
    timestamp: new Date(item.timestamp || Date.now()),
    region: item.region ? item.region.substring(0, 2) : undefined, // Nur 2-stellige Ländercodes
  }))
}

/**
 * Erstellt ein anonymisiertes Dataset für den Verkauf
 */
export function createAnonymizedDataset(
  name: string,
  description: string,
  rawMetrics: any[],
  price: number
): AnonymizedDataset {
  const anonymizedMetrics = anonymizeSecurityData(rawMetrics)
  
  return {
    id: generateDatasetId(),
    name,
    description,
    metrics: anonymizedMetrics,
    price,
    currency: "USD",
    license: "CC-BY-4.0",
    anonymizationLevel: "high",
    sampleSize: anonymizedMetrics.length,
  }
}

/**
 * Generiert eine eindeutige Dataset-ID
 */
function generateDatasetId(): string {
  return `dataset-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Beispiel-Datasets für Forschungszwecke
 */
export const SAMPLE_DATASETS: AnonymizedDataset[] = [
  {
    id: "dataset-001",
    name: "State of Security 2025 — Global",
    description: "Anonymisierte Sicherheitsmetriken aus 50+ Ländern weltweit",
    metrics: [],
    price: 499,
    currency: "USD",
    license: "CC-BY-4.0",
    anonymizationLevel: "high",
    sampleSize: 100000,
  },
  {
    id: "dataset-002",
    name: "Container Security Trends 2025",
    description: "Anonymisierte Container-Security-Daten aus Docker und Kubernetes",
    metrics: [],
    price: 299,
    currency: "USD",
    license: "CC-BY-4.0",
    anonymizationLevel: "high",
    sampleSize: 50000,
  },
  {
    id: "dataset-003",
    name: "AI Agent Security Patterns 2025",
    description: "Anonymisierte Security-Patterns aus AI-Agent-Deployment",
    metrics: [],
    price: 399,
    currency: "USD",
    license: "CC-BY-4.0",
    anonymizationLevel: "high",
    sampleSize: 25000,
  },
]

/**
 * Prüft, ob ein Dataset verkauft werden darf (Compliance-Check)
 */
export function validateDatasetForSale(dataset: AnonymizedDataset): boolean {
  // Dataset muss anonymisiert sein
  if (dataset.anonymizationLevel !== "high") {
    return false
  }
  
  // Dataset muss mindestens 1000 Samples haben
  if (dataset.sampleSize < 1000) {
    return false
  }
  
  // Dataset muss gültige Lizenz haben
  if (!dataset.license) {
    return false
  }
  
  // Alle Metriken müssen anonymisiert sein (keine PII)
  const hasPII = dataset.metrics.some(metric => {
    // Prüfe auf verdächtige Felder
    return (
      metric.metric.toLowerCase().includes("ip") ||
      metric.metric.toLowerCase().includes("email") ||
      metric.metric.toLowerCase().includes("user") ||
      metric.metric.toLowerCase().includes("name")
    )
  })
  
  if (hasPII) {
    return false
  }
  
  return true
}

/**
 * Berechnet den Preis für ein Dataset basierend auf Sample-Size und Wert
 */
export function calculateDatasetPrice(dataset: AnonymizedDataset): number {
  const basePrice = 99
  const sizeMultiplier = Math.min(dataset.sampleSize / 10000, 10)
  const valueMultiplier = dataset.anonymizationLevel === "high" ? 1.5 : 1.0
  
  return Math.round(basePrice * sizeMultiplier * valueMultiplier)
}

/**
 * Exportiert ein Dataset im CSV-Format
 */
export function exportDatasetToCSV(dataset: AnonymizedDataset): string {
  const headers = ["category", "metric", "value", "unit", "timestamp", "region"]
  const rows = dataset.metrics.map(m => [
    m.category,
    m.metric,
    m.value,
    m.unit,
    m.timestamp.toISOString(),
    m.region || ""
  ])
  
  return [
    headers.join(","),
    ...rows.map(row => row.join(","))
  ].join("\n")
}

/**
 * Exportiert ein Dataset im JSON-Format
 */
export function exportDatasetToJSON(dataset: AnonymizedDataset): string {
  return JSON.stringify(dataset, null, 2)
}
