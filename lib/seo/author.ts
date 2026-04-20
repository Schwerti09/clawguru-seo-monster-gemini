/**
 * Single source of truth for author / organisation identity.
 * Consumed by <AuthorBox/>, buildPersonSchema(), buildAuthoredArticleSchema().
 *
 * E-E-A-T principle: real person + real company + real jurisdiction.
 */

export const ORGANIZATION = {
  name: "ClawGuru Mycelium Security Intelligence GmbH",
  shortName: "ClawGuru",
  url: "https://clawguru.org",
  legalForm: "GmbH",
  location: "Berlin, Germany",
  logo: "https://clawguru.org/og-image.png",
} as const

export const DEFAULT_AUTHOR = {
  id: "schwerti",
  name: "Schwerti",
  fullName: "Schwerti",
  jobTitle: "Founder & Security Researcher",
  bio:
    "Founder of ClawGuru. Builds security intelligence tools for self-hosted infrastructure. Based in Berlin.",
  bioDe:
    "Gründer von ClawGuru. Entwickelt Security-Intelligence-Tools für selbst gehostete Infrastruktur. Basis Berlin.",
  url: "https://clawguru.org/about",
  sameAs: [
    "https://github.com/Schwerti09",
  ],
  image: "https://clawguru.org/author/schwerti.png",
} as const

export type Author = typeof DEFAULT_AUTHOR

export function buildPersonSchema(author: Author = DEFAULT_AUTHOR) {
  return {
    "@type": "Person",
    "@id": `${ORGANIZATION.url}/about#${author.id}`,
    name: author.name,
    jobTitle: author.jobTitle,
    description: author.bio,
    url: author.url,
    image: author.image,
    sameAs: author.sameAs,
    worksFor: {
      "@type": "Organization",
      name: ORGANIZATION.name,
      url: ORGANIZATION.url,
    },
  }
}

export function buildOrganizationSchema() {
  return {
    "@type": "Organization",
    "@id": `${ORGANIZATION.url}#org`,
    name: ORGANIZATION.name,
    alternateName: ORGANIZATION.shortName,
    url: ORGANIZATION.url,
    logo: ORGANIZATION.logo,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Berlin",
      addressCountry: "DE",
    },
  }
}

/**
 * Build a complete Article / TechArticle schema with Author + Organization.
 * Use this on runbooks, CVE pages, blog posts, research reports.
 */
export function buildAuthoredArticleSchema(opts: {
  headline: string
  description: string
  url: string
  datePublished: string // ISO
  dateModified?: string // ISO — defaults to datePublished
  image?: string
  articleType?: "Article" | "TechArticle" | "NewsArticle"
  author?: Author
  inLanguage?: string
}) {
  const author = opts.author ?? DEFAULT_AUTHOR
  return {
    "@context": "https://schema.org",
    "@type": opts.articleType ?? "TechArticle",
    headline: opts.headline,
    description: opts.description,
    url: opts.url,
    inLanguage: opts.inLanguage ?? "de",
    image: opts.image ?? ORGANIZATION.logo,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified ?? opts.datePublished,
    author: buildPersonSchema(author),
    publisher: buildOrganizationSchema(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": opts.url,
    },
  }
}
