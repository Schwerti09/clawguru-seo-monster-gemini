export type AffiliateProfile = {
  slug: string
  name: string
  createdAt: string
  description: string
  keyword: string
}

type AffiliateStore = Map<string, AffiliateProfile>

declare global {
  // eslint-disable-next-line no-var
  var __affiliateStore: AffiliateStore | undefined
}

function store(): AffiliateStore {
  if (!global.__affiliateStore) {
    global.__affiliateStore = new Map()
  }
  return global.__affiliateStore
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function upsertAffiliateProfile(name: string, slugInput?: string): AffiliateProfile {
  const slugBase = slugify(slugInput?.trim() || name)
  if (!slugBase) {
    throw new Error("Invalid partner name")
  }
  const slug = slugBase.slice(0, 60)
  const existing = store().get(slug)
  if (existing) return existing

  const keyword = `${name} Security Recommendations`
  const profile: AffiliateProfile = {
    slug,
    name,
    createdAt: new Date().toISOString(),
    description: `${name} Partner-Bridge für Sicherheits-Runbooks und ClawGuru Empfehlungen.`,
    keyword,
  }
  store().set(slug, profile)
  return profile
}

export function getAffiliateProfile(slug: string): AffiliateProfile | null {
  return store().get(slug) ?? null
}

export function humanizeSlug(slug: string): string {
  return slug
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
}
