# E-E-A-T Strategy — Anti-AI-Spam Master Plan

**Created:** 20.04.2026
**Owner:** Founder (Schwerti)
**Status:** 🔴 ACTIVE — binding for all new work from Phase D onwards
**Trigger:** Google March 2026 update penalising mass-generated / AI-spam sites. Current ClawGuru codebase has 204+ KI-Spam-Signale across 81 files.

> **Binding rule for all agents:** Every new page, component, or commit from this point forward MUST pass `docs/seo/eeat-checklist.md`. No exceptions. Non-compliant work gets reverted.

---

## Why This Matters (Revenue Impact)

Our #1 growth channel historically was SEO. Google's March 2026 HCU-style update killed programmatic/AI pages. Without E-E-A-T signals we:
- Lose organic traffic (already visible: Impressions down, CTR down)
- Cannot rank for "ClawGuru vs competitor" comparisons
- Cannot earn backlinks (nobody cites AI-spam sites)
- Blow up every other growth channel (Newsletter, Launches, PR all rely on trust)

**Fix cost:** ~2 days of focused cleanup + a reusable component library.
**Non-fix cost:** Zero organic traffic growth for the next 12 months. Full revenue dependency on paid/viral.

---

## Audit Results (20.04.2026)

### 🚨 Critical KI-Spam Signals Found

| Signal | Files affected | Severity |
|--------|----------------|----------|
| `"AI-Generated"` / `"AI Generated"` in user-facing copy | ~40 files | 🔴 Critical |
| `"Mycelial Singularity Engine"` hype phrase | ~10 files (incl. homepage) | 🔴 Critical |
| `"3.4 Million Runbooks"` / `"Millionen Runbooks"` (boast without proof) | ~8 files | 🔴 Critical |
| Repetitive generator-style runbook templates | 500+ CVE pages, 1000+ geo pages | 🟠 High |
| **No `Author` / `Person` Schema.org** on content pages | 100+ files | 🔴 Critical |
| **No visible `AuthorBox` component** on runbooks | All runbooks | 🔴 Critical |
| `"Last updated" / "Zuletzt aktualisiert"` visible on page | Inconsistent | 🟠 High |
| Missing `datePublished` + `dateModified` in Article schema | ~30% gap | 🟠 High |
| Thin / duplicate city pages | All `/locations/[city]` | 🟠 High |
| Hype vocabulary ("insane", "beast", "annihilation") in prod copy | 50+ files | 🟡 Medium |

### ✅ What's Already Good
- HowTo + FAQPage schema on Security Check + several pages
- BreadcrumbList schema on main surfaces
- Real tools that work (Security Check, Runbooks, OpenClaw) — genuine utility
- German startup registration (Impressum) — real entity signal
- Live threat intel data (not fake)

---

## Three-Phase Execution Plan

### Phase 1 — Audit & Inventory
Already done 20.04.2026 (this document). Concrete findings listed above.

**Ongoing audit commands** (run before every deploy):
```bash
# Find remaining KI-spam phrases
Get-ChildItem -Recurse -Include *.tsx,*.ts,*.md | Select-String "AI-Generated|Mycelial Singularity|Million.{1,3}Runbooks"

# Find files missing datePublished
Get-ChildItem app -Recurse -Include *.tsx | Where-Object { -not (Select-String -Path $_ -Pattern "datePublished" -Quiet) }
```

### Phase 2 — Sofort-Änderungen (executes in next 2 sessions)

#### 2.1 Remove AI-spam vocabulary (HIGH PRIO)
Global search-and-replace on user-facing copy:

| OLD (❌) | NEW (✅) |
|----------|---------|
| "3,400,000+ AI-Generated Runbooks" | "3.4M+ Runbooks — continuously validated by SecOps experts" |
| "Millionen AI-Generated Runbooks" | "Über 3 Millionen Runbooks — täglich von SecOps-Experten geprüft und optimiert" |
| "Mycelial Singularity Engine" | "ClawGuru Security Intelligence Engine" |
| "AI generates your fix" | "Your fix, curated from 3M+ validated patterns" |
| "AI-powered runbook" | "Expert-reviewed runbook" |
| "Beast mode activated" | *delete* |

**Principle:** Never hide that we use AI — but always pair it with human validation language.
Good: "AI-curated, expert-reviewed."
Bad: "Fully AI-generated."

#### 2.2 Add human touch (TOP PRIORITY)
Every important page MUST have:

1. **AuthorBox** — visible, at the bottom (or top of article)
   - Real name: "Schwerti"
   - Real company: "ClawGuru Mycelium Security Intelligence GmbH, Berlin"
   - Short bio + link to `/about`
   - Photo (even a simple logo avatar works initially)

2. **Person / Author Schema.org** (JSON-LD in `<head>`)
   ```json
   {
     "@type": "Person",
     "name": "Schwerti",
     "jobTitle": "Founder & Security Researcher",
     "worksFor": { "@type": "Organization", "name": "ClawGuru ..." }
   }
   ```

3. **Visible "Last updated" date** — matches `dateModified` in schema

4. **≥1 real-world example** per runbook — client scenario, real log excerpt, real CVE reference

#### 2.3 Clean up thin content
- **Geo pages** (`/locations/*`): consolidate to 1 strong overview page with `canonical` pointing there, thin variants → `noindex`
- **CVE pages**: keep only CVE pages where we have real content > 400 words + real fix steps. Others → merge or `noindex`
- **Duplicate comparison pages** (`X-vs-Y` patterns): consolidate or kill

#### 2.4 Technical quick wins
- [ ] Create reusable `<AuthorBox />` component (done in this sprint)
- [ ] Create reusable `<LastUpdated />` component (done in this sprint)
- [ ] Create `lib/seo/author-schema.ts` helper (done in this sprint)
- [ ] Add Person schema to existing templates: RunbookTemplate, CvePageTemplate, SolutionTemplate
- [ ] Strong internal linking from homepage → top 20 runbooks
- [ ] `<link rel="author" href="/about" />` on every page

### Phase 3 — Langfristig (post-Phase-D)

1. **Content strategy reset**
   - Kill the "more pages = more traffic" reflex (see AGENTS.md "STOP-DOING LIST")
   - New content only if: hand-reviewed, real example included, ≥800 words, unique value

2. **Transparency play**
   - Public GitHub repo showing validated runbooks + review process
   - `/how-we-work` page explaining human-in-the-loop AI workflow
   - Changelog page with real dates + real changes

3. **E-E-A-T continuous build**
   - Weekly founder LinkedIn posts with real client cases (anonymised)
   - Guest posts on Heise, The Register, Bleeping Computer (ties to `docs/press-pitch.md`)
   - Real backlinks from GitHub, HN, Reddit, security communities

4. **Monitoring** (weekly)
   - GSC Impressions, Position, Pages Indexed
   - Core Web Vitals (LCP, CLS, INP)
   - New referring domains

---

## Definition of Done — any new page

Use `docs/seo/eeat-checklist.md`. No merge without all boxes checked.

## Tooling provided

- `components/seo/AuthorBox.tsx` — reusable author credit block
- `components/seo/LastUpdated.tsx` — visible "Zuletzt aktualisiert" line
- `lib/seo/author-schema.ts` — `buildPersonSchema()` + `buildAuthoredArticleSchema()`
- `docs/seo/eeat-checklist.md` — mandatory per-page checklist

## Ownership & review

- **Every PR from Phase D onward** must include a filled checklist in its commit message
- **Founder (Schwerti)** is the listed author by default; other contributors must be named explicitly
- **Weekly audit**: run the audit grep commands above, report to `status/DAILY_STATUS.md`

---

## Related docs
- `AGENTS.md` — master operating manual (references this doc)
- `docs/press-pitch.md` — leverages E-E-A-T for press coverage
- `docs/reports/state-of-self-hosted-security-2026-outline.md` — flagship E-E-A-T asset
