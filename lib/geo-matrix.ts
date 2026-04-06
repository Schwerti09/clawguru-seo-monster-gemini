export type GeoProfile = {
  city: string
  citySlug: string
  region: string
  country: string
  source: "edge" | "accept-language" | "default"
}

// Keep this list in sync with seeded geo city slugs from DB migrations.
const SEEDED_CITY_SLUGS = new Set([
  "berlin",
  "munich",
  "hamburg",
  "frankfurt",
  "cologne",
  "stuttgart",
  "dusseldorf",
  "dortmund",
  "essen",
  "leipzig",
  "bremen",
  "dresden",
  "hanover",
  "nuremberg",
  "duisburg",
  "bochum",
  "wuppertal",
  "bonn",
  "mannheim",
  "karlsruhe",
  "vienna",
  "zurich",
  "geneva",
  "basel",
  "paris",
  "lyon",
  "marseille",
  "london",
  "amsterdam",
  "brussels",
  "madrid",
  "barcelona",
  "milan",
  "rome",
  "warsaw",
  "prague",
  "newyork",
  // China Mega Expansion
  "beijing",
  "shanghai",
  "guangzhou",
  "shenzhen",
  // USA Expansion
  "losangeles",
  "chicago",
  "houston",
  "phoenix",
  "philadelphia",
  "sanantonio",
  "sandiego",
  "dallas",
  "seattle",
  "austin",
  // India Expansion
  "mumbai",
  "delhi",
  "bangalore",
  "hyderabad",
  "chennai",
  "kolkata",
  "pune",
  "ahmedabad",
  // Russia Expansion
  "moscow",
  "stpetersburg",
  "novosibirsk",
  "yekaterinburg",
  "kazan",
  // UK / Ireland
  "manchester",
  "birmingham",
  "dublin",
  "edinburgh",
  // Nordics
  "copenhagen",
  "aarhus",
  "stockholm",
  "gothenburg",
  "malmo",
  "oslo",
  "helsinki",
  "reykjavik",
  // Italy (additional)
  "turin",
  "naples",
  // Iberia (additional)
  "lisbon",
  "porto",
  "valencia",
  "seville",
  "bilbao",
  // France (additional)
  "toulouse",
  "nice",
  // Poland (additional)
  "krakow",
  "wroclaw",
  // CEE / Balkan (D4)
  "budapest",
  "bucharest",
  "sofia",
  "athens",
  "thessaloniki",
  "bratislava",
  "zagreb",
  "ljubljana",
  "belgrade",
])

export function slugifyCity(input: string): string {
  return input.toLowerCase().replace(/[^a-z0-9]/g, "")
}

export function parseGeoVariantSlug(slug: string): { baseSlug: string; citySlug: string | null } {
  const parts = slug.split("-")
  if (parts.length < 3) return { baseSlug: slug, citySlug: null }
  const tail = parts[parts.length - 1]
  if (!/^[a-z]{3,20}$/i.test(tail)) return { baseSlug: slug, citySlug: null }
  if (!SEEDED_CITY_SLUGS.has(tail.toLowerCase())) return { baseSlug: slug, citySlug: null }
  return { baseSlug: parts.slice(0, -1).join("-"), citySlug: tail }
}

export function getGeoProfileFromHeaders(headers: Headers): GeoProfile {
  const edgeCity = headers.get("x-claw-geo-city") ?? headers.get("x-vercel-ip-city") ?? ""
  const edgeCountry = headers.get("x-claw-geo-country") ?? headers.get("x-vercel-ip-country") ?? ""
  const edgeRegion = headers.get("x-claw-geo-region") ?? headers.get("x-vercel-ip-country-region") ?? ""

  if (edgeCity) {
    return {
      city: edgeCity,
      citySlug: slugifyCity(edgeCity),
      region: edgeRegion || "unknown",
      country: edgeCountry || "unknown",
      source: "edge",
    }
  }

  const accept = headers.get("accept-language") ?? ""
  if (/\bde\b/i.test(accept)) return { city: "Berlin", citySlug: "berlin", region: "Berlin", country: "DE", source: "accept-language" }
  if (/\bfr\b/i.test(accept)) return { city: "Paris", citySlug: "paris", region: "Ile-de-France", country: "FR", source: "accept-language" }
  if (/\ben\b/i.test(accept)) return { city: "New York", citySlug: "newyork", region: "New York", country: "US", source: "accept-language" }

  return { city: "Berlin", citySlug: "berlin", region: "Berlin", country: "DE", source: "default" }
}

export function buildGeoSlug(baseSlug: string, citySlug: string) {
  return `${baseSlug}-${citySlug}`
}
