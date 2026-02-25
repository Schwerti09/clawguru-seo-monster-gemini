// WORLD BEAST UPGRADE: lib/threatmap-data.ts
// Threat map data – shared between page and client component.

export const THREAT_REGIONS = [
  { id: "us", name: "United States", threats: 2847, lat: 39, lon: -98, severity: "high" as const },
  { id: "de", name: "Germany", threats: 1234, lat: 51, lon: 10, severity: "medium" as const },
  { id: "cn", name: "China", threats: 3156, lat: 35, lon: 105, severity: "critical" as const },
  { id: "ru", name: "Russia", threats: 1893, lat: 61, lon: 60, severity: "high" as const },
  { id: "br", name: "Brazil", threats: 876, lat: -14, lon: -51, severity: "medium" as const },
  { id: "in", name: "India", threats: 1543, lat: 20, lon: 77, severity: "high" as const },
  { id: "gb", name: "United Kingdom", threats: 934, lat: 54, lon: -2, severity: "medium" as const },
  { id: "fr", name: "France", threats: 712, lat: 46, lon: 2, severity: "low" as const },
  { id: "jp", name: "Japan", threats: 689, lat: 36, lon: 138, severity: "medium" as const },
  { id: "au", name: "Australia", threats: 445, lat: -25, lon: 133, severity: "low" as const },
  { id: "nl", name: "Netherlands", threats: 587, lat: 52, lon: 5, severity: "medium" as const },
  { id: "sg", name: "Singapore", threats: 423, lat: 1, lon: 104, severity: "medium" as const },
  { id: "ca", name: "Canada", threats: 634, lat: 56, lon: -96, severity: "low" as const },
  { id: "za", name: "South Africa", threats: 312, lat: -29, lon: 25, severity: "low" as const },
  { id: "kr", name: "South Korea", threats: 521, lat: 36, lon: 128, severity: "medium" as const },
]

export type ThreatRegion = (typeof THREAT_REGIONS)[number]
