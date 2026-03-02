// File: lib/seo/link-engine.ts
// Embedding-driven internal link engine for 100k+ pages.

export type LinkEnginePage = {
  slug: string
  title: string
  summary?: string
  tags?: string[]
  embedding?: number[]
  url?: string
  authority?: number
}

export type LinkSuggestion = {
  slug: string
  title: string
  url: string
  score: number
  similarity: number
}

export type LinkEngineOptions<T extends LinkEnginePage> = {
  maxLinks?: number
  vectorSize?: number
  tokenLimit?: number
  minSimilarity?: number
  authorityWeight?: number
  urlForPage?: (page: T) => string
  authorityForPage?: (page: T) => number
}

const DEFAULT_VECTOR_SIZE = 64
const DEFAULT_TOKEN_LIMIT = 12

function hashToken(token: string): number {
  let hash = 2166136261
  for (let i = 0; i < token.length; i += 1) {
    hash ^= token.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function tokenize(value: string | undefined): string[] {
  if (!value) return []
  return value
    .toLowerCase()
    .split(/[^a-z0-9]+/g)
    .filter(Boolean)
}

function buildTokenList(page: LinkEnginePage): string[] {
  const tokens = new Set<string>()
  for (const tag of page.tags ?? []) tokens.add(tag.toLowerCase())
  for (const t of tokenize(page.slug)) tokens.add(t)
  for (const t of tokenize(page.title)) tokens.add(t)
  for (const t of tokenize(page.summary)) tokens.add(t)
  return Array.from(tokens)
}

function embedTokens(tokens: string[], vectorSize: number): number[] {
  const vector = Array.from({ length: vectorSize }, () => 0)
  if (tokens.length === 0) return vector
  for (const token of tokens) {
    const hash = hashToken(token)
    const index = hash % vectorSize
    const weight = (hash % 5) + 1
    vector[index] += hash % 2 === 0 ? weight : -weight
  }
  return vector
}

function normalize(vector: number[]): number[] {
  let sum = 0
  for (const v of vector) sum += v * v
  if (sum === 0) return vector
  const inv = 1 / Math.sqrt(sum)
  return vector.map((v) => v * inv)
}

function cosineSimilarity(a: number[], b: number[]): number {
  const len = Math.min(a.length, b.length)
  if (len === 0) return 0
  let dot = 0
  for (let i = 0; i < len; i += 1) dot += a[i] * b[i]
  return dot
}

function computeEmbedding(page: LinkEnginePage, vectorSize: number): number[] {
  if (page.embedding && page.embedding.length > 0) {
    return normalize(page.embedding)
  }
  const tokens = buildTokenList(page)
  return normalize(embedTokens(tokens, vectorSize))
}

export function buildLinkEngine<T extends LinkEnginePage>(
  pages: T[],
  options: LinkEngineOptions<T> = {}
) {
  const maxLinks = options.maxLinks ?? 10
  const vectorSize = options.vectorSize ?? DEFAULT_VECTOR_SIZE
  const tokenLimit = options.tokenLimit ?? DEFAULT_TOKEN_LIMIT
  const minSimilarity = options.minSimilarity ?? 0.15
  const authorityWeight = options.authorityWeight ?? 0.15

  const slugIndex = new Map<string, number>()
  pages.forEach((page, index) => slugIndex.set(page.slug, index))

  const pageTokens = pages.map((page) => buildTokenList(page).slice(0, tokenLimit))
  const embeddings = pages.map((page) => computeEmbedding(page, vectorSize))

  const tokenIndex = new Map<string, number[]>()
  pageTokens.forEach((tokens, index) => {
    for (const token of tokens) {
      const bucket = tokenIndex.get(token)
      if (bucket) bucket.push(index)
      else tokenIndex.set(token, [index])
    }
  })

  const authorityScores = pages.map((page) =>
    options.authorityForPage ? options.authorityForPage(page) ?? 0 : page.authority ?? 0
  )

  const fallbackIndices = authorityScores
    .map((score, index) => ({ score, index }))
    .sort((a, b) => b.score - a.score)
    .map(({ index }) => index)

  const cache = new Map<string, LinkSuggestion[]>()

  const urlForPage = (page: T) =>
    options.urlForPage?.(page) ?? page.url ?? `/${page.slug}`

  function linksForIndex(index: number): LinkSuggestion[] {
    const page = pages[index]
    const cached = cache.get(page.slug)
    if (cached) return cached

    const candidates = new Set<number>()
    for (const token of pageTokens[index]) {
      const bucket = tokenIndex.get(token)
      if (!bucket) continue
      for (const candidateIndex of bucket) {
        if (candidateIndex !== index) candidates.add(candidateIndex)
      }
    }

    if (candidates.size < maxLinks) {
      for (const candidateIndex of fallbackIndices) {
        if (candidateIndex !== index) candidates.add(candidateIndex)
        if (candidates.size >= maxLinks * 4) break
      }
    }

    const sourceEmbedding = embeddings[index]
    const results: LinkSuggestion[] = []
    for (const candidateIndex of candidates) {
      const candidate = pages[candidateIndex]
      const similarity = cosineSimilarity(sourceEmbedding, embeddings[candidateIndex])
      if (similarity < minSimilarity) continue
      const authority = authorityScores[candidateIndex] ?? 0
      const score = similarity + (authority / 100) * authorityWeight
      results.push({
        slug: candidate.slug,
        title: candidate.title,
        url: urlForPage(candidate),
        score,
        similarity
      })
    }

    const sorted = results
      .sort((a, b) => b.score - a.score)
      .slice(0, maxLinks)

    cache.set(page.slug, sorted)
    return sorted
  }

  function linksForPage(page: LinkEnginePage): LinkSuggestion[] {
    const index = slugIndex.get(page.slug)
    if (index !== undefined) return linksForIndex(index)

    const tokens = buildTokenList(page).slice(0, tokenLimit)
    const candidates = new Set<number>()
    for (const token of tokens) {
      const bucket = tokenIndex.get(token)
      if (!bucket) continue
      for (const candidateIndex of bucket) candidates.add(candidateIndex)
    }

    if (candidates.size < maxLinks) {
      for (const candidateIndex of fallbackIndices) {
        candidates.add(candidateIndex)
        if (candidates.size >= maxLinks * 4) break
      }
    }

    const sourceEmbedding = computeEmbedding(page, vectorSize)
    const results: LinkSuggestion[] = []

    for (const candidateIndex of candidates) {
      const candidate = pages[candidateIndex]
      const similarity = cosineSimilarity(sourceEmbedding, embeddings[candidateIndex])
      if (similarity < minSimilarity) continue
      const authority = authorityScores[candidateIndex] ?? 0
      const score = similarity + (authority / 100) * authorityWeight
      results.push({
        slug: candidate.slug,
        title: candidate.title,
        url: urlForPage(candidate),
        score,
        similarity
      })
    }

    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, maxLinks)
  }

  function buildInternalLinkMap(): Map<string, LinkSuggestion[]> {
    const map = new Map<string, LinkSuggestion[]>()
    pages.forEach((page) => map.set(page.slug, linksForPage(page)))
    return map
  }

  return {
    linksForSlug: (slug: string) => {
      const index = slugIndex.get(slug)
      if (index === undefined) return []
      return linksForIndex(index)
    },
    linksForPage,
    buildInternalLinkMap,
  }
}
