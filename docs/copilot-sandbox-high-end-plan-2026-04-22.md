# Copilot & Sandbox High-End Expansion Plan
**Date:** 22.04.2026  
**Status:** Planning Phase  
**Goal:** Two flagship product pages with 99+ Lighthouse Score

---

## Objective

Create two separate, high-end product pages:
1. **/copilot** — Prof. ClawGuru Copilot (AI Security Assistant)
2. **/sandbox** — Live Fix Sandbox (In-browser Config Testing Sandbox)

Both pages must be:
- Quantum Void Elegance design system
- 99+ Lighthouse Score
- Full SEO optimization (OpenGraph, Twitter Cards, Schema.org)
- E-E-A-T signals section
- Social Proof Counter
- Stats Bar (4.2M Runbooks, 30s Fix, 15+ Jahre, 24/7)

---

## Current State

**Existing Pages:**
- `app/copilot/page.tsx` — Currently contains CopilotChat, VoiceCopilot, LiveFixSandbox in one page
- `app/[lang]/copilot/page.tsx` — Localized version
- `components/copilot/CopilotChat.tsx` — Chat component
- `components/copilot/VoiceCopilot.tsx` — Voice component
- `components/copilot/LiveFixSandbox.tsx` — Sandbox component

**Sandbox Content Pages:**
- `app/[lang]/moltbot/ai-agent-sandboxing/`
- `app/[lang]/moltbot/ai-agent-sandboxing-advanced/`
- `app/[lang]/moltbot/ai-agent-sandboxing-runtime/`

---

## Proposed Structure

### Phase 1: Copilot High-End Page (/copilot)

**File:** `app/copilot/page.tsx` (rewrite)

**Components:**
- Hero Section with animated gradient
- Stats Bar (4.2M Runbooks, 30s Fix, 15+ Jahre, 24/7)
- Social Proof Counter
- CopilotChat integration
- VoiceCopilot integration
- E-E-A-T Signals section
- Footer CTA

**Metadata:**
- OpenGraph + Twitter Cards
- Schema.org Organization + SoftwareApplication JSON-LD
- Keywords: copilot, AI security assistant, runbook generator, incident response

**Design:**
- Quantum Void Elegance color tokens
- Animated gradients
- Glass morphism cards
- Responsive layout

---

### Phase 2: Sandbox High-End Page (/sandbox)

**File:** `app/sandbox/page.tsx` (new)

**Components:**
- Hero Section with animated gradient
- Stats Bar (4.2M Runbooks, 30s Fix, 15+ Jahre, 24/7)
- Social Proof Counter
- LiveFixSandbox integration (main feature)
- Supported config types (Nginx, Docker, Terraform, K8s)
- Use case cards
- E-E-A-T Signals section
- Footer CTA

**Metadata:**
- OpenGraph + Twitter Cards
- Schema.org Organization + SoftwareApplication JSON-LD
- Keywords: sandbox, config testing, nginx linting, docker validation, terraform linter, k8s validation

**Design:**
- Quantum Void Elegance color tokens
- Animated gradients
- Glass morphism cards
- Code editor styling
- Responsive layout

**Special Features:**
- Real-time config validation
- Score display (0-100)
- Severity indicators (error, warning, info)
- Copy-to-clipboard
- Multi-language support

---

### Phase 3: Localized Versions

**Files:**
- `app/[lang]/copilot/page.tsx` (update)
- `app/[lang]/sandbox/page.tsx` (new)

Both should use `buildLocalizedAlternates()` for proper SEO.

---

### Phase 4: Sitemap Update

**File:** `app/sitemaps/[name]/route.ts`

Add:
- `/copilot` with priority 0.90
- `/sandbox` with priority 0.92 (flagship)

---

## Implementation Plan

### Phase 1: Copilot High-End Page
1. Rewrite `app/copilot/page.tsx` with Quantum Void Elegance
2. Add OpenGraph + Twitter Cards metadata
3. Add Schema.org Organization + SoftwareApplication JSON-LD
4. Add Stats Bar and Social Proof Counter
5. Add E-E-A-T Signals section
6. Integrate CopilotChat and VoiceCopilot
7. Test Lighthouse Score (target 99+)

### Phase 2: Sandbox High-End Page
1. Create `app/sandbox/page.tsx` with Quantum Void Elegance
2. Add OpenGraph + Twitter Cards metadata
3. Add Schema.org Organization + SoftwareApplication JSON-LD
4. Add Stats Bar and Social Proof Counter
5. Add E-E-A-T Signals section
6. Integrate LiveFixSandbox as main feature
7. Add use case cards and feature highlights
8. Test Lighthouse Score (target 99+)

### Phase 3: Localized Versions
1. Update `app/[lang]/copilot/page.tsx`
2. Create `app/[lang]/sandbox/page.tsx`
3. Ensure proper SEO metadata with `buildLocalizedAlternates()`

### Phase 4: Sitemap Update
1. Add `/copilot` and `/sandbox` to sitemap
2. Test sitemap generation

### Phase 5: Build & Deploy
1. Run `npm run build` (target exit code 0)
2. Test Lighthouse Score on production
3. Commit and push

---

## Success Criteria

- Both pages have 99+ Lighthouse Score
- Both pages have full SEO metadata
- Both pages have E-E-A-T signals
- Both pages have Social Proof Counter
- Both pages use Quantum Void Elegance design
- Build succeeds with exit code 0
- Sitemap includes both pages
- Localized versions work correctly

---

## Notes

- Sandbox should be the flagship page (higher priority in sitemap)
- Copilot should focus on AI assistant capabilities
- Sandbox should focus on config testing and validation
- Both pages should cross-link to each other
- Both pages should link to related ClawVerse pages (Oracle, Neuro, etc.)
