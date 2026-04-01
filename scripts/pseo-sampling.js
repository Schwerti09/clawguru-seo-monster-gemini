const DEFAULT_SAMPLE_SIZE = 30
const DEFAULT_SEED = "clawguru-pseo-2026"

function hashString(input) {
  let h = 2166136261
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function lcg(seed) {
  let state = seed >>> 0
  return () => {
    state = Math.imul(1664525, state) + 1013904223
    return (state >>> 0) / 4294967296
  }
}

function pickMany(source, n, rnd) {
  const out = []
  const pool = [...source]
  while (out.length < n && pool.length > 0) {
    const idx = Math.floor(rnd() * pool.length)
    out.push(pool[idx])
    pool.splice(idx, 1)
  }
  return out
}

function buildDeterministicSample({ sampleSize = DEFAULT_SAMPLE_SIZE, seed = DEFAULT_SEED } = {}) {
  const size = Math.max(5, Math.min(200, Number(sampleSize) || DEFAULT_SAMPLE_SIZE))
  const rnd = lcg(hashString(String(seed)))

  const providers = ["aws", "gcp", "azure", "hetzner", "digitalocean", "cloudflare", "vercel", "netlify", "render", "railway"]
  const services = ["ssh", "docker", "kubernetes", "nginx", "postgres", "redis", "tls", "waf", "cicd", "backup"]
  const issues = ["hardening", "csp", "rate-limit-baseline", "api-key-rotation", "secrets-management", "incident-communication"]
  const years = ["2024", "2025", "2026", "2027"]
  const locales = ["de", "en"]

  const generated100kSlugs = []
  while (generated100kSlugs.length < size) {
    const p = providers[Math.floor(rnd() * providers.length)]
    const s = services[Math.floor(rnd() * services.length)]
    const i = issues[Math.floor(rnd() * issues.length)]
    const y = years[Math.floor(rnd() * years.length)]
    const slug = `${p}-${s}-${i}-${y}`
    if (!generated100kSlugs.includes(slug)) generated100kSlugs.push(slug)
  }

  const localeRunbookPaths = pickMany(
    generated100kSlugs.flatMap((slug) => locales.map((l) => `/${l}/runbook/${slug}`)),
    Math.max(10, Math.floor(size * 0.6)),
    rnd
  )

  return {
    seed: String(seed),
    sampleSize: size,
    materializedSlugs: [],
    generated100kSlugs,
    localeRunbookPaths,
  }
}

module.exports = {
  buildDeterministicSample,
  DEFAULT_SAMPLE_SIZE,
  DEFAULT_SEED,
}
