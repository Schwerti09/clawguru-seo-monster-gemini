# How to use the E-E-A-T toolkit

Every new page/component from Phase D onwards MUST use these three building blocks. Read this once, then it's muscle memory.

## 1. Author credit block (visible UI)

```tsx
import AuthorBox from "@/components/seo/AuthorBox"

// Full variant (end of article)
<AuthorBox locale={locale} variant="full" />

// Compact variant (under H1 of thin pages)
<AuthorBox locale={locale} variant="compact" />
```

## 2. Last updated timestamp

```tsx
import LastUpdated from "@/components/seo/LastUpdated"

<LastUpdated
  date="2026-04-20"
  publishedDate="2026-03-15"
  showPublished
  locale={locale}
/>
```

## 3. JSON-LD schema (in `<head>` via generateMetadata or inline script)

```tsx
import { buildAuthoredArticleSchema } from "@/lib/seo/author"

// Inside your page component
const schema = buildAuthoredArticleSchema({
  headline: "How to harden PostgreSQL in production",
  description: "Step-by-step guide to locking down Postgres with SCRAM-SHA-256, firewall rules, and SSL.",
  url: `${SITE_URL}/${locale}/runbooks/postgres-hardening`,
  datePublished: "2026-03-15",
  dateModified: "2026-04-20",
  inLanguage: locale,
  articleType: "TechArticle",
})

// Then render as a script tag in the page body or head:
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
/>
```

## Page template (copy for new runbooks/articles)

```tsx
import type { Metadata } from "next"
import AuthorBox from "@/components/seo/AuthorBox"
import LastUpdated from "@/components/seo/LastUpdated"
import { buildAuthoredArticleSchema } from "@/lib/seo/author"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PUBLISHED = "2026-04-20"
const MODIFIED  = "2026-04-20"

export const metadata: Metadata = {
  title: "Unique handwritten title (do NOT template)",
  description: "Unique handwritten description (do NOT template).",
  alternates: { canonical: `${SITE_URL}/...` },
}

export default function Page({ params }: { params: { lang: string } }) {
  const locale = params.lang
  const url = `${SITE_URL}/${locale}/...`

  const schema = buildAuthoredArticleSchema({
    headline: "Same as <title> (without '| ClawGuru' suffix)",
    description: "Same as meta description",
    url,
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    inLanguage: locale,
    articleType: "TechArticle",
  })

  return (
    <main>
      <article>
        <h1>Unique headline — no hype words</h1>
        <LastUpdated date={MODIFIED} publishedDate={PUBLISHED} showPublished locale={locale} />

        {/* ... your actual handwritten content, ≥1 real example ... */}

        <AuthorBox locale={locale} variant="full" className="mt-12" />
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </main>
  )
}
```

## Forbidden patterns (will fail checklist)

❌ `"AI-Generated"` in visible copy
❌ `"Mycelial Singularity"` or similar hype
❌ `"Millions of X"` without a real counted source
❌ Template strings as `<title>`/`description` (`${kw} | ClawGuru`)
❌ Copy-pasting 80%+ of body from another page
❌ Missing AuthorBox on content pages
❌ Missing LastUpdated + dateModified mismatch
❌ Hype adjectives: beast / insane / god-tier / annihilation / singularity

## Required before merge

1. Fill `docs/seo/eeat-checklist.md` in commit message
2. Build passes (`npx next build`)
3. Schema validates: https://validator.schema.org/
4. Real human read-through (founder or named reviewer)
