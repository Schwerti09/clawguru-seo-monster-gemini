type LinkablePage = {
  slug: string
  title?: string
  tags?: string[]
  clawScore?: number
}

type LinkEngineConfig<T extends LinkablePage> = {
  maxLinks: number
  urlForPage: (page: T) => string
  authorityForPage?: (page: T) => number
}

export type LinkEngineLink = {
  slug: string
  title?: string
  url: string
}

export function buildLinkEngine<T extends LinkablePage>(pages: T[], config: LinkEngineConfig<T>) {
  const authorityForPage = config.authorityForPage ?? (() => 0)
  const normalized = pages.map((page) => ({
    page,
    tagSet: new Set(page.tags ?? []),
  }))

  return {
    getLinks(target: T): LinkEngineLink[] {
      if (!normalized.length || config.maxLinks <= 0) return []
      const targetTags = new Set(target.tags ?? [])
      const scored = normalized
        .filter(({ page }) => page.slug !== target.slug)
        .map(({ page, tagSet }) => {
          let shared = 0
          if (targetTags.size > 0 && tagSet.size > 0) {
            for (const tag of targetTags) {
              if (tagSet.has(tag)) shared += 1
            }
          }
          const authority = authorityForPage(page)
          return { page, score: shared * 10 + authority / 100 }
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, config.maxLinks)

      return scored.map(({ page }) => ({
        slug: page.slug,
        title: page.title,
        url: config.urlForPage(page),
      }))
    },
  }
}
