# E-E-A-T Checklist — Mandatory for Every New Page

> Copy this into the commit message (or PR description) of every new page.
> Unchecked = must not merge.

## Page metadata
```
Page path: /...
Language(s): [de] [en] [es] [...]
Author: Schwerti (default) | other: _____
Date published: YYYY-MM-DD
```

## 1. Experience (E) — First-hand / lived
- [ ] Contains at least **one real-world example, log excerpt, or case reference**
- [ ] Not purely theoretical / template-generated
- [ ] If this is a fix/runbook: steps have been **manually verified to work**

## 2. Expertise (E) — Specialist knowledge
- [ ] Content depth appropriate (runbook ≥ 400 words, landing ≥ 600 words, longform ≥ 1200 words)
- [ ] Uses correct domain terminology (not vague hype)
- [ ] Cites a primary source (CVE, CIS benchmark, vendor docs) where applicable

## 3. Authoritativeness (A) — Who says so?
- [ ] `<AuthorBox />` component rendered at top or bottom of main content
- [ ] `Person` / `Author` Schema.org JSON-LD included via `buildPersonSchema()`
- [ ] `<link rel="author" href="/about" />` in head (handled by layout if present)

## 4. Trustworthiness (T) — Why should we believe you?
- [ ] `<LastUpdated date={...} />` visible on page
- [ ] `datePublished` + `dateModified` in Article/HowTo schema
- [ ] Contact / company info accessible (footer link to `/impressum`)
- [ ] No unverifiable boasts ("millions of", "world's best", "guaranteed 100%")
- [ ] No "AI-Generated" / "Fully AI-written" labels in user-facing copy

## 5. Anti-spam hygiene
- [ ] No hype vocabulary: "insane", "beast mode", "annihilation", "singularity", "god-tier"
- [ ] No repetitive section templates copy-pasted from other pages unchanged
- [ ] Internal links point to relevant content (no link-farming)
- [ ] If duplicating structure from another page: at least 50% unique body content

## 6. Technical SEO
- [ ] Unique `<title>` (not templated `${X} | ClawGuru`)
- [ ] Unique `<meta name="description">` written by human
- [ ] `canonical` URL set correctly (self or pointing to stronger page)
- [ ] `alternates` for all locales via `buildLocalizedAlternates()`
- [ ] Breadcrumb schema present

## 7. Revenue hook (from AGENTS.md always-do rule)
- [ ] At least ONE of: Day Pass CTA, Pro upgrade, Email capture, Affiliate link

## 8. Build & ship
- [ ] `npx next build` exits 0 locally
- [ ] No console warnings
- [ ] Screenshot or live preview verified

---

## Quick commit message template

```
feat(xyz): <page description>

E-E-A-T checklist:
- [x] Experience: real example from <scenario>
- [x] Expertise: 620 words, cites CIS benchmark + CVE-2024-XXXX
- [x] Authoritativeness: AuthorBox + Person schema + author link
- [x] Trust: LastUpdated visible, datePublished 2026-04-20
- [x] Anti-spam: no hype words, unique copy
- [x] Tech SEO: unique title/desc, canonical, alternates, breadcrumb
- [x] Revenue hook: Day Pass CTA in hero + email capture at bottom
- [x] Build green
```
