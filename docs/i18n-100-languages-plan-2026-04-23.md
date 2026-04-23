# 100-Language Global Rollout — Master Plan

**Created:** 2026-04-23
**Owner:** Rolf S. (Schwerti)
**Status:** 🟢 APPROVED — execution in progress
**Deployment:** Netlify (primary), Railway / Vercel as candidates
**Related:** [`docs/i18n-state-2026-04-23.md`](./i18n-state-2026-04-23.md) · [`docs/i18n-roadmap-2026-04-22.md`](./i18n-roadmap-2026-04-22.md) · [`docs/academy-infinity-plan-2026-04-22.md`](./academy-infinity-plan-2026-04-22.md)

This document defines the **full enterprise-grade i18n strategy** for ClawGuru from 30 → 100 languages, including architecture, SEO/GEO compliance, rollout tiers, and the automation pipeline. If you're new to this initiative, read this top to bottom before touching any locale-related code.

---

## 1. Strategy — why 100 languages

Scaling translations is the single largest traffic lever for a SEO-driven SaaS. **100 languages × ~1,200 pages = 120,000 indexable URLs** — most of which Google will rank on page 1 for their locale because Tier 3+4 language SEO competition is near-zero.

But: 100 languages is NOT just "translate every string." It's an architecture decision. Without the right foundation, Google treats translated pages as thin/duplicate content and ignores (or penalises) them. **Getting the plumbing right is 80 % of the value.**

---

## 2. Enterprise SEO / GEO Architecture — non-negotiables

| Area | Requirement | Current status |
|------|-------------|----------------|
| **URL structure** | Subdirectories `/de/`, `/ja/`, `/fa/`. **Never** subdomains or ccTLDs. Pools domain authority. | ✅ already `/[lang]/...` |
| **Hreflang matrix** | Every page's `<head>` links to itself + all 99 siblings with `rel="alternate"`. | ✅ `buildLocalizedAlternates(locale, path)` in `lib/i18n.ts` — scales automatically when locales list grows |
| **URL slug localisation** | `/es/seguridad-cibernetica` beats `/es/cyber-security` in Spain. | 🟡 NOT YET — currently paths stay English. Phase 2 item. |
| **Crawl budget** | Don't dump 100,000 new URLs at once. Stage sitemaps by tier. | 🟡 NEEDS per-tier sitemap split |
| **Local search engines** | China → Baidu (local hosting), Russia → Yandex, South Korea → Naver. | 🟡 deferred — Tier-3 action |
| **CDN / latency** | Global CDN (Cloudflare / Fastly) mandatory — Tokyo must feel like Frankfurt. | ✅ Netlify edge (decide upgrade for Tier 3 rollout) |
| **RTL layouts** | `dir="rtl"` for Arabic, Hebrew, Farsi, Urdu, Pashto, Kurdish (Sorani), Sindhi, Yiddish. Broken CSS = instant bounce. | 🟡 ar + he present; need fa, ur, ps, ckb, sd, yi for Tier 2–3 |
| **Meta / JSON-LD** | Title, description, Schema.org must translate per locale. First thing Googlebot reads. | ✅ `generateMetadata()` per locale across all new Academy/Tools/Breach pages |
| **Canonical + alternates** | Every locale variant declares itself canonical. No accidental English-canonical on translated pages. | ✅ `buildLocalizedAlternates` pattern |
| **robots.txt per tier** | Tier 1+2 immediately crawlable. Tier 3+4 phased in as content quality confirms. | 🟡 new — to be added |

**Action items tagged 🟡 are tracked in Section 7.**

---

## 3. Rollout tiers — staged by ROI

### Tier 1 · Big Money & Big Volume — **30 % of total revenue lives here**

| Rank | Code | Language | Why |
|------|------|----------|-----|
| 1 | `en` | English (global) | Baseline, source of truth |
| 2 | `es` | Spanish (LATAM + Spain) | Massive reach |
| 3 | `zh` | Chinese Simplified | Largest tech volume worldwide |
| 4 | `de` | German (DACH) | Highest B2B purchasing power |
| 5 | `ja` | Japanese | Loyal, high-spend tech market |
| 6 | `fr` | French (EU + CA + Africa) | B2B footprint |
| 7 | `pt` | Portuguese (Brazil-first) | LATAM growth |
| 8 | `ar` | Arabic (MENA) | Booming tech investment |
| 9 | `ko` | Korean (SK) | Extremely tech-affine |
| 10 | `ru` | Russian | Security / research community |

### Tier 2 · High GDP / European + Asian Hubs — **leicht zu holen, gut zahlend**

11. `it` Italian · 12. `nl` Dutch · 13. `pl` Polish (dev-heavy) · 14. `tr` Turkish · 15. `vi` Vietnamese · 16. `th` Thai · 17. `id` Indonesian · 18. `sv` Swedish · 19. `da` Danish · 20. `fi` Finnish · 21. `no` Norwegian · 22. `hi` Hindi (volume > spend) · 23. `cs` Czech · 24. `ro` Romanian · 25. `hu` Hungarian · 26. `el` Greek · 27. `he` Hebrew (cyber-hub!) · 28. `uk` Ukrainian · 29. `ms` Malay · 30. `bg` Bulgarian

### Tier 3 · Next Billion / Emerging Markets — **low SEO competition = easy Page-1**

31. `sk` Slovak · 32. `hr` Croatian · 33. `sr` Serbian · 34. `lt` Lithuanian · 35. `lv` Latvian · 36. `et` Estonian · 37. `sl` Slovenian · 38. `ta` Tamil · 39. `te` Telugu · 40. `mr` Marathi · 41. `ur` Urdu · 42. `fa` Farsi · 43. `sw` Swahili · 44. `am` Amharic · 45. `tl` Tagalog · 46. `bn` Bengali · 47. `gu` Gujarati · 48. `kn` Kannada · 49. `ml` Malayalam · 50. `pa` Punjabi · 51. `zu` Zulu · 52. `xh` Xhosa · 53. `af` Afrikaans · 54. `is` Icelandic · 55. `ga` Irish Gaelic · 56. `cy` Welsh · 57. `mt` Maltese · 58. `ka` Georgian · 59. `hy` Armenian · 60. `az` Azerbaijani

### Tier 4 · Long-Tail SEO Dominance — **ocean fishing**

61. `kk` Kazakh · 62. `uz` Uzbek · 63. `tk` Turkmen · 64. `ky` Kyrgyz · 65. `tg` Tajik · 66. `mn` Mongolian · 67. `ne` Nepali · 68. `si` Sinhala · 69. `km` Khmer · 70. `lo` Lao · 71. `my` Burmese · 72. `bo` Tibetan · 73. `ug` Uyghur · 74. `ku` Kurdish (ckb) · 75. `ps` Pashto · 76. `sd` Sindhi · 77. `sq` Albanian · 78. `mk` Macedonian · 79. `bs` Bosnian · 80. `cnr` Montenegrin · 81. `gl` Galician · 82. `eu` Basque · 83. `ca` Catalan · 84. `co` Corsican · 85. `mi` Maori · 86. `sm` Samoan · 87. `fj` Fijian · 88. `ht` Haitian Creole · 89. `la` Latin (Easter-egg value) · 90. `eo` Esperanto (tech nerd backlinks) · 91. `yi` Yiddish · 92. `ha` Hausa · 93. `yo` Yoruba · 94. `ig` Igbo · 95. `sn` Shona · 96. `st` Sesotho · 97. `tn` Tswana · 98. `ny` Chichewa · 99. `ceb` Cebuano · 100. `jv` Javanese

**Current status:** 28 of Tier 1+2 live. `ms` + `bg` added in this sprint → **Tier 1+2 complete (30 locales) + infrastructure ready for Tier 3+4.**

---

## 4. Translation quality pipeline — two-pass

Machine translation at 100-language scale has an unavoidable quality gap. The pipeline handles this pragmatically:

### Pass 1 — mass fill via local LLM (aya-expanse via Ollama)
- `scripts/translate-via-aya.js` — batches 40 keys per call, JSON-mode, incremental-write (crash-safe)
- Zero API cost, runs on operator's GPU
- Produces ~80 % production-ready output (confirmed 2026-04-23 on `sv` sample)
- Accepts noise on FAQ/marketing strings; technical/ops strings come out clean
- **Applied to:** all keys in every locale

### Pass 2 — Gemini polish on hot paths (planned)
- Second-pass script (to be built as `scripts/polish-via-gemini.js`)
- Target only hot-traffic paths: `hero.*`, `pricing.*`, `nav.*`, `footer.*`, Academy hub, landing pages
- Use Gemini 2.5-flash-lite with explicit "native-speaker proofread" prompt, input=(EN source, aya output), output=native polish
- Keeps cost under control: ~50 keys × 100 locales = 5,000 API calls (single-digit €)

### Pass 3 — native speaker spot-check (optional, revenue-weighted)
- Manual review only for Tier 1 hot paths in the top-5 revenue locales
- Fiverr / native contractor, fixed-price

**Quality policy:** machine-translated content is **publishable** immediately but flagged as `machine-translated` in JSON-LD `inLanguage` + internal metric. Tier 1 hot paths get Pass 2 before production. Tier 3+4 ship on Pass 1 and get Pass 2 only if a locale shows traffic traction.

---

## 5. Automation — the full pipeline

### Scripts (already shipped)

| Script | Purpose | Invocation |
|--------|---------|------------|
| `scripts/translate-via-aya.js` | Pass-1 mass fill | `npm run i18n:translate-aya [locales...]` |
| `scripts/gen-mission-outlines.js` | Academy content generator | `npm run academy:gen-outlines [tracks...]` |
| `scripts/translate-missing.js` | Legacy Gemini translator | existing, for reference |

### Scripts to build (Phase 2 of i18n rollout)

| Script | Purpose | Priority |
|--------|---------|----------|
| `scripts/seed-empty-dict.js` | Seed new locale `.json` file from EN before translation | HIGH (needed to add new codes) |
| `scripts/polish-via-gemini.js` | Pass-2 native-speaker polish on hot paths | HIGH (Tier 1 go-live) |
| `scripts/translate-slugs.js` | URL slug localisation (Phase 2 per Section 2) | MEDIUM |
| `scripts/validate-hreflang.js` | Static check: every locale page has all 99 hreflang siblings | MEDIUM |
| `scripts/sitemap-tier-split.js` | Split XML sitemaps per tier for staged crawl budget | MEDIUM |
| `scripts/i18n-coverage-report.js` | Replace the inline oneliner with a reusable per-locale coverage check | LOW |

### Commit / deploy flow
1. Run Pass 1 for target locales → commit `dictionaries/*.json`
2. Run Pass 2 on hot paths → commit
3. Push → Netlify build picks up new locales
4. `generateStaticParams` in every `app/[lang]/*/page.tsx` spans the new locale set automatically

---

## 6. Runtime infrastructure changes required

### Already compatible with 100 locales (no changes needed)

- `buildLocalizedAlternates()` in `lib/i18n.ts` — auto-iterates over `SUPPORTED_LOCALES`
- `generateStaticParams()` in every `[lang]` page — auto-scales
- `getDictionary(locale)` with EN fallback — handles missing keys gracefully
- Sitemap route is already per-locale

### Changes needed to add a new locale code

1. Add code to `Locale` union + `SUPPORTED_LOCALES[]` in `lib/i18n.ts`
2. Add loader entry in `lib/getDictionary.ts` (`loaders[x] = () => import("@/dictionaries/xx.json")...`) and extend `DICTIONARY_LOCALES`
3. Add to `RTL_LOCALES[]` if right-to-left (ar, he, fa, ur, ps, ckb, sd, yi)
4. Seed `dictionaries/xx.json` from `en.json` via `seed-empty-dict.js`
5. Run translation pipeline
6. Verify build passes (`npm run build`)

### Scale warnings

- Every new locale multiplies prebuilt pages by ~(pages). Current: 30 langs × ~1,200 routes ≈ 36k pages. At 100 langs: ~120k pages.
- Netlify build time scales linearly. Budget: Tier 1+2 → CI ~20 min; Tier 1+2+3 → ~40 min; full 100 → possibly > 60 min.
- **Mitigation:** use `dynamic = "force-static"` only for Tier 1+2 page routes, Tier 3+4 can be `revalidate = 3600` with on-demand ISR, drastically reducing prebuild count.

---

## 7. Open work (actionable, in priority order)

1. 🟡 **URL slug localisation** — Spanish market won't rank on English slugs. Requires middleware-level rewrite + per-locale slug maps.
2. 🟡 **Per-tier sitemap split** — prevent crawl-budget burn at Tier 3+4 activation.
3. 🟡 **RTL additions** — `fa`, `ur`, `ps`, `ckb`, `sd`, `yi` when their locale codes are added.
4. 🟡 **Pass-2 Gemini polish script** — gate Tier 1 production deploys.
5. 🟡 **Hardcoded-string exorcism** (Phase 2 of i18n roadmap, ~283 files) — must be finished before Tier 3+4 launch, otherwise new locales render English.
6. 🟡 **Local search engine seed** — Baidu verification for zh, Yandex for ru+uk, Naver for ko. Non-Google crawlers need separate sitemap submission.
7. 🟡 **Quality badge / machine-translation disclosure** — per-page JSON-LD `inLanguage` + visible "machine-translated, native review pending" banner for user trust (GDPR/AI-Act tailwind).
8. 🟡 **CDN upgrade decision** — Netlify's edge is fine for Tier 1+2; global Tier 3+4 may justify Cloudflare Enterprise or Fastly.

---

## 8. This sprint (2026-04-23)

**Shipped today:**
- `ms` + `bg` locale codes added (Tier 1+2 complete)
- Empty `ms.json` / `bg.json` seeded from EN as scaffold
- Pass-1 translation kicked off in background across all 28 gap locales
- This plan doc committed as source of truth

**Blocking next:**
- Pass 1 completion for existing 30 locales (~4h background run)
- Build `seed-empty-dict.js` + `polish-via-gemini.js` before Tier 3 can start

**When Pass 1 finishes:**
1. Regenerate `docs/i18n-state-*.md` coverage snapshot
2. Build Gemini polish script
3. Run polish on Tier 1 hot paths
4. Deploy to prod

---

## 9. Rules for every agent touching this

1. **Never drop to < 100 locales.** Once a locale is added, it's a commitment.
2. **Never ship a new [lang] route without `generateStaticParams` spanning all `SUPPORTED_LOCALES`.**
3. **Never inline-ternary `locale === "de"` in components.** Use `getDictionary(locale)` or a co-located content module like `lib/academy/hubContent.ts`.
4. **Every new page needs Schema.org + localised `generateMetadata`.** No exceptions.
5. **Update this doc in the same commit** as any architectural change to i18n.
6. **Run `npm run i18n:translate-aya` after adding dict keys in EN** — don't let EN drift ahead of other locales.
7. **Flag visible quality gaps.** A broken Swedish string on the pricing page is worse than a page not existing in Swedish — always better to degrade gracefully (hide section) than show garbage.

---

## 10. Documentation map

- **This file** — 100-language strategy, architecture, rollout tiers
- [`docs/i18n-state-2026-04-23.md`](./i18n-state-2026-04-23.md) — live coverage snapshot
- [`docs/i18n-roadmap-2026-04-22.md`](./i18n-roadmap-2026-04-22.md) — Phase 2–6 hardcoded-string + consolidation plan
- [`docs/academy-infinity-plan-2026-04-22.md`](./academy-infinity-plan-2026-04-22.md) — Academy ∞ master plan (depends on i18n)
- [`AGENTS.md`](../AGENTS.md) — session log + documentation map

**If you're picking this up cold: read AGENTS.md first → follow its Documentation Map → land back here for i18n-specific work.**
