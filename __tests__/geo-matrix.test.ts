import { slugifyCity, parseGeoVariantSlug, buildGeoSlug } from "@/lib/geo-matrix"
import fs from "fs"
import path from "path"

// Read SEEDED_CITY_SLUGS from the source to verify no duplicates exist.
// This test prevents regressions when adding new cities.

function extractSeededSlugs(): string[] {
  const src = fs.readFileSync(path.join(__dirname, "..", "lib", "geo-matrix.ts"), "utf8")
  const setBlock = src.split("new Set([")[1]?.split("])")[0] ?? ""
  const matches = setBlock.match(/"([a-z]+)"/g)
  return matches ? matches.map((m: string) => m.replace(/"/g, "")) : []
}

describe("geo-matrix", () => {
  describe("SEEDED_CITY_SLUGS integrity", () => {
    const slugs = extractSeededSlugs()

    test("has at least 90 cities", () => {
      expect(slugs.length).toBeGreaterThanOrEqual(90)
    })

    test("contains no duplicate entries", () => {
      const seen = new Set<string>()
      const duplicates: string[] = []
      for (const s of slugs) {
        if (seen.has(s)) duplicates.push(s)
        seen.add(s)
      }
      expect(duplicates).toEqual([])
    })

    test("all slugs are lowercase alphanumeric", () => {
      for (const s of slugs) {
        expect(s).toMatch(/^[a-z0-9]+$/)
      }
    })

    test("includes expected DACH cities", () => {
      expect(slugs).toEqual(expect.arrayContaining(["berlin", "vienna", "zurich", "munich"]))
    })

    test("includes expected global expansion cities", () => {
      expect(slugs).toEqual(
        expect.arrayContaining(["beijing", "shanghai", "losangeles", "mumbai", "moscow"])
      )
    })
  })

  describe("slugifyCity", () => {
    test("lowercases and strips non-alphanumeric", () => {
      expect(slugifyCity("New York")).toBe("newyork")
      expect(slugifyCity("São Paulo")).toBe("sopaulo")
      expect(slugifyCity("Berlin")).toBe("berlin")
    })
  })

  describe("parseGeoVariantSlug", () => {
    test("extracts city slug from geo-variant", () => {
      const result = parseGeoVariantSlug("kubernetes-hardening-2026-berlin")
      expect(result).toEqual({ baseSlug: "kubernetes-hardening-2026", citySlug: "berlin" })
    })

    test("returns null citySlug when no city suffix", () => {
      const result = parseGeoVariantSlug("kubernetes-hardening-2026")
      expect(result).toEqual({ baseSlug: "kubernetes-hardening-2026", citySlug: null })
    })

    test("returns null citySlug for unknown city", () => {
      const result = parseGeoVariantSlug("kubernetes-hardening-2026-atlantis")
      expect(result).toEqual({ baseSlug: "kubernetes-hardening-2026-atlantis", citySlug: null })
    })
  })

  describe("buildGeoSlug", () => {
    test("appends city slug", () => {
      expect(buildGeoSlug("kubernetes-hardening-2026", "berlin")).toBe(
        "kubernetes-hardening-2026-berlin"
      )
    })
  })
})
