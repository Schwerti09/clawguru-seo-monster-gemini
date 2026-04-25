# Academy ∞ — Master Plan & Handoff Document

**Created:** 2026-04-22
**Last updated:** 2026-04-23
**Owner:** Rolf S. (Schwerti)
**Status:** 🟢 BUILD IN PROGRESS — Steps 1–8 shipped, Step 7 (content pipeline) awaiting model availability
**Deployment targets:** Netlify (prod), Railway / Vercel candidates — build stays deploy-agnostic

This document is the single source of truth for the Academy ∞ rebuild. Any agent picking up work should read this top to bottom before touching code.

---

## 🚦 Progress Dashboard (2026-04-23)

| # | Step | Status | Key artefacts |
|---|------|--------|---------------|
| 1 | Academy Hub Redesign | ✅ DONE | 8-track grid, atmospheric hero, `lib/academy/hubContent.ts`, 5 new track stubs |
| 2 | xterm.js Live Range POC | ✅ DONE | Mission engine + LiveRangeTerminal + MissionRunner + Mission M-001 |
| 3 | Foundations track missionized | ✅ DONE | 5 playable missions (M-001…M-005), beginner page rebuilt |
| 4 | Sentinel AI Tutor (minimal) | ✅ DONE | `/api/academy/sentinel` (Ollama → Gemini → stub), SentinelChat widget |
| 5 | The Arsenal (first 3 tools) | ✅ DONE | Header Doctor · TLS X-Ray · Prompt Injection Sandbox + `/tools` hub |
| 6 | Attack Cinema (Log4Shell) | ✅ DONE | `/breaches` hub + `/breaches/log4shell` 10-step timeline with 3 forks |
| 7 | Content pipeline (local LLM) | 🟡 SHIPPED, blocked | `scripts/translate-via-aya.js` + `scripts/gen-mission-outlines.js` — waits on `aya-expanse:8b` pull |
| 8 | Reactivation + sitemap sweep | ✅ DONE | Mission + breach routes static, registry-driven sitemap (auto-sync) |
| 9 | 10 more missions × 2 tracks | 🟡 IN PROGRESS | Stack-Hardening track started: M-006 docker-nonroot + M-007 postgres-hardening shipped 25.04 |
| 10 | Digital Twin (GitHub read-only) | ⏭ LATER | — |
| 11 | Adversarial AI Co-Player | ⏭ LATER | — |
| 12 | Community + Mission Authoring | ⏭ LATER | — |
| 13 | SOC Simulator | ⏭ LATER | — |
| 14 | Career Launchpad + HR | ⏭ LATER | — |

**Live routes (all locales):**
- `/academy` — hub with Mission / Attack Cinema / Arsenal teasers + 8 track cards
- `/academy/beginner` — Foundations track, 5 missions indexed
- `/academy/mission/{nginx-hsts,ssh-hardening,ufw-firewall,lets-encrypt,misconfig-hunt}` — playable (Foundations track)
- `/academy/mission/{docker-nonroot,postgres-hardening}` — playable (Stack Hardening track, 25.04.2026)
- `/academy/{intermediate,advanced,auth,incident-response,compliance,adversarial,story,certification}` — stubs / legacy
- `/breaches` — Attack Cinema hub (1 live + 4 soon)
- `/breaches/log4shell` — interactive re-enactment
- `/tools` — Arsenal hub (3 live + 12 soon)
- `/tools/{header-doctor,tls-xray,prompt-injection-sandbox}` — functional

**Run commands (new):**
```
npm run i18n:translate-aya [locales...]    # EN → any target, local LLM
npm run academy:gen-outlines [tracks...]   # 80 mission outlines via local LLM
```

---

## 1. Current Project State (as of 2026-04-22)

### 1.1 Platform
- Next.js 14 App Router, TypeScript
- Currently deployed: **Netlify** (production)
- New deployment targets under consideration: **Railway** and **Vercel** (no migration decision yet — plan builds deploy-agnostic)
- Supabase for persistence
- Stripe for billing

### 1.2 i18n Status — Round 14 (blocked, to be resumed)
- **Live at 100 %:** de, en + 14 legacy locales (16 total)
- **In translation (Round 14):** he, uk, vi, id, sv, fi, ro, cs, th, bn, el, hu, da, no
- **Target originally:** 30 languages
- **New target:** **50 languages** — pending aya-expanse local translation pipeline (see 1.3)
- **Known blocker Phase 2:** ~283 files with `isDE ?` hardcoding — see [`docs/i18n-roadmap-2026-04-22.md`](./i18n-roadmap-2026-04-22.md)
- **Authoritative dict system:** `/dictionaries/` (legacy `/locales/` to be consolidated)
- Section `roast.*` stays EN/DE only (culturally specific)

### 1.3 Local LLM Pipeline — Llama/Ollama Setup
Installed to unblock 30 → 50 language push after Gemini / DeepSeek / OpenAI rate limits hit the ceiling during Round 14.

| Item | Value |
|---|---|
| Runtime | Ollama — running at `http://localhost:11434` |
| Binary | `C:\Users\rolli\AppData\Local\Programs\Ollama\ollama.exe` |
| Model storage | `~/.ollama/models/` |
| Model 1 — pulled | `qwen2.5:3b` (~2 GB) — quality **unusable** for translation (confirmed on DE→SV test: "Absicke sinnet egenhålligt infrastrukturer utan cloud-fråga." — garbled) |
| Model 2 — pulling (in progress) | **`aya-expanse:32b`** (~20 GB) — Cohere multilingual specialist, 23-language trained, target production model |
| Fallback strategy | Gemini API + DeepSeek + OpenAI for disambiguation / proofread passes |

**API keys available** (all in env): `GEMINI_API_KEY`, `GEMINI_API_KEY2`, `DEEPSEEK_API_KEY`, `OPENAI_API_KEY` — can rotate for parallel batch work.

**Next action on LLM pipeline:**
1. Wait for `aya-expanse:32b` pull to complete
2. Run DE→SV quality probe against real dictionary string
3. If pass: build Node batch script to translate `/dictionaries/` keys to all 20 new locales
4. If fail: escalate to `qwen2.5:72b` or stay on Gemini with smarter throttling

### 1.4 Current Academy (what exists today)
- Entry: [`app/[lang]/academy/page.tsx`](../app/[lang]/academy/page.tsx) (323 lines)
- Tracks (3): `beginner/`, `intermediate/`, `advanced/` — each a single page
- Feature pages: `certification/`, `cve/`, `cve-feed/`, `roast-learn-prompt-injection/`
- Components: `components/academy/HardeningSprint.tsx`
- Content: 18 lessons total, hardcoded text, no real interactivity, no persistent progress
- Static (force-static), revalidate 3600
- FAQ + Breadcrumb Schema.org present
- Known limitation: all copy inline-ternary on `locale === "de"` — does not scale to 50 languages

### 1.5 Recent Shipped Work (Context for incoming agent)
Recent commits (most recent first):
- `feat(emergency)` — mega-expansion with hero/stats/E-E-A-T/schema/social proof
- `feat(team)` — 10 specialists, E-E-A-T signals
- `feat(i18n)` — Round 14 expansion to 30 languages (partial)
- `feat(command-center)` — hero/stats/rich content/CTAs

Currently uncommitted (being finished by Windsurf agent): `summon/page.tsx`, `SummonHero.tsx` — **do not touch**.

---

## 2. Academy ∞ — The Vision

> **"The first security-education platform that is simultaneously Simulator, Lab, SOC, Threat-Intel-Feed, Certification Authority, Community and Career Launchpad — in 50 languages, running in a browser tab, with zero signup to start."**

### 2.1 Three Operating Principles (non-negotiable)

1. **Nothing is static.** Content breathes. New CVEs become playable missions within hours. AI Content Director (aya-expanse local + Gemini fallback) generates and translates on demand.
2. **You don't learn — you play yourself to expert.** No walls of text. Terminal, diagrams, choices under time pressure, consequences. Everyone is the Defender of fictional "Hodlberg AG."
3. **It's not a course — it's a portfolio.** Every achievement → W3C Verifiable Credential, signed via `did:web:clawguru.org`. Shareable, recruiter-recognized, LinkedIn-ready.

---

## 3. The 12 Killer Modules

### Module 1 — Live Ops Range
- Browser-native Linux lab via **xterm.js + WebContainer** (StackBlitz engine) or **v86** fallback
- Every mission = vulnerable simulated server, user must harden
- Split-screen: user terminal (left) vs. live adversary log (right) with countdown
- State persisted in localStorage, resumable
- Fully client-side — Netlify/Vercel/Railway agnostic

### Module 2 — The Hodlberg Story Engine
- 12-act narrative campaign. Company grows from startup to 10,000-person org as user progresses.
- NPCs: paranoid CTO, skeptical CFO, junior DevOps. Dialog trees, budget negotiations.
- Multi-path branching: K8s vs. bare-metal choices trigger different threat sets.
- Real consequences: bad choice → data leak → level reset.

### Module 3 — Sentinel (Personal AI Mentor)
- Persistent chat pill (bottom-right), agent-like
- Hints on-demand, explanations in user's language, adapts to user's skill level
- Voice mode via WebSpeech API (optional)
- **Killer feature:** user connects GitHub repo (read-only) → Sentinel generates missions tailored to their actual stack
- Powered by: aya-expanse:32b local (zero-cost, private) with Gemini API fallback

### Module 4 — Digital Twin
- User connects GitHub / Docker Compose / Terraform (read-only)
- Renders interactive 3D architecture map via **Three.js + React Three Fiber**
- Animated attack propagation on user's own infra
- 100 % client-side rendering, zero data leaves browser

### Module 5 — Attack Cinema
Interactive breach re-enactments, 8–12 min each, with fork paths ("what if team X had done Y?"):
- SolarWinds
- Log4Shell
- Okta 2023
- MOVEit
- Cloudflare Supply Chain

### Module 6 — The Arsenal (15 Pro Tools Inline)

| # | Tool | Purpose |
|---|---|---|
| 1 | TLS X-Ray | TLS chain deep analysis + visualizer |
| 2 | Header Doctor | Security headers + auto fix-generator |
| 3 | CVE Time Machine | Library CVE history over years |
| 4 | Password Entropy Lab | Visual rainbow-table animation |
| 5 | JWT Forensics | Decoder + vuln scanner + signature demo |
| 6 | Prompt Injection Sandbox | Test prompts against 50 payload patterns |
| 7 | Docker Hardening Grader | Dockerfile → score + auto-fix |
| 8 | K8s Policy Auditor | Manifest → OPA-powered audit |
| 9 | Nginx Config Scanner | Misconfig detector + explanations |
| 10 | Secret Pattern Scanner | Code paste → hardcoded credentials |
| 11 | GitHub Actions Auditor | Workflow → security score |
| 12 | DNS Takeover Scanner | Domain → subdomain analysis |
| 13 | NIS2/EUVD Gap Scanner | Checklist + evidence collector |
| 14 | Runbook Generator | Incident description → MD runbook |
| 15 | AI Jailbreak/Bias Tester | For EU AI Act compliance |

**Each tool = own SEO landing page × 50 languages = 750 indexed pages. Major backlink magnet.**

### Module 7 — Proof-of-Work Certification
- No multi-choice quiz — **actual hardening of a real vulnerable container**
- Ephemeral Docker container via Gitpod / Code-Sandbox integration, 60-min time box
- 12 pre-installed vulnerabilities, automated evaluation after timeout
- Output: **W3C Verifiable Credential** signed with ClawGuru DID
- Recognized by LinkedIn / Credly / HR platforms
- 4 levels: **Defender I → II → III → Guardian**

### Module 8 — Threat Intel Arena (Live CVE Hunt)
- Real-time feed: EUVD + NVD + GitHub Advisory
- New CVE → AI Director generates playable mission in <60 min, auto-translates 50 languages, publishes
- First-clear users earn **First-Response Badge** (rare, craftable)
- Positions ClawGuru as fastest security-education provider globally

### Module 9 — The Red Team Troll (Adversarial AI Co-Player)
- Second AI in split-terminal actively attacks during selected missions
- Learns from user patterns, tries new payloads, gets harder over time
- Beat it 3× consecutively → it levels up. Personal rivalry.
- Runs offline via aya-expanse local — zero API cost, zero latency.

### Module 10 — Community Core (Defender Guild)
- Non-toxic by design: cooperation default, PvP opt-in only
- **Mission Authoring:** top users write missions via YAML DSL, reviewed, published
- **Bounty Board:** companies post anonymized config audits, community finds issues, bounties paid from Pro revenue
- **Team Spaces:** B2B accounts get private leaderboards

### Module 11 — SOC Simulator
- Separate mode, Grafana-like dashboards with simulated live traffic
- Alerts pop up, user triages in real time
- Mix of false positives and real incidents — find the real one
- Time-pressured, realistic

### Module 12 — Career Launchpad
- Top graduates referred to security recruiters (opt-in)
- Public portfolio page per user (SEO-optimized, shareable URL) with all credentials/stats/top missions
- HR integration: Greenhouse, Lever via webhook — "candidate verified ClawGuru Guardian" badge
- Goal: become the **de-facto certification for self-hosted security roles**

---

## 4. Content Expansion — 8 Tracks, 80+ Missions

| Track | Theme | Missions |
|---|---|---|
| 🟢 Foundations | Zero to Linux Defender | 10 |
| 🧱 Stack Hardening | Nginx, Docker, K8s, Proxmox | 14 |
| 🔐 Auth & Identity | OAuth, JWT, SSO, Zero-Trust | 10 |
| 🛡️ Incident Response | Detect, Contain, Recover | 10 |
| 🤖 AI Agent Security | Prompt Injection, LLM Gateways, AI Act | 10 |
| 📋 Compliance | NIS2, DORA, EU AI Act, GDPR-tech | 8 |
| 🔴 Adversarial Defense | Red Team Co-Player missions | 10 |
| 🏴‍☠️ Hodlberg Story Arc | Narrative campaign, all cross-linked | 12 |

**Each mission × 50 languages = 4,000+ indexable mission URLs.**

---

## 5. Design System — Aesthetic Manifesto

**References to exceed:** Hack The Box (cleaner), Linear (motion detail), Duolingo (gamification), NASA Worm (authority), Matrix (nostalgia).

**Our look:**
- Cyberpunk Monokai with strategic neon (lime / cyan / magenta)
- Motion: **Framer Motion** — subtle, never cheesy
- Sound (opt-in): mechanical-keyboard typing, success chimes, bass "breach detected" sting
- CSS layer: CRT scanlines + subtle chromatic aberration (togglable, performant)
- **Accessibility:** WCAG AAA — keyboard-playable, full screenreader support
- **Mobile:** every mission playable via virtual keyboard + touch hotkeys

---

## 6. SEO Impact Model

| Lever | Pages (50 langs) |
|---|---|
| 80 missions | 4,000 |
| 15 tools | 750 |
| Breach re-enactments | 250 |
| User portfolios | ∞ |
| Community-authored missions | ∞ |
| **Minimum baseline** | **5,000+** |

Schema.org markup:
- Mission → `Course`
- Track → `CourseInstance`
- Tool → `SoftwareApplication`
- Defender Rank → `EducationalOccupationalCredential`

---

## 7. Tech Stack (deploy-agnostic: Netlify / Railway / Vercel all fine)

| Layer | Tool |
|---|---|
| Framework | Next.js 14 App Router |
| Terminal | xterm.js (MIT) |
| Sandbox | WebContainer (StackBlitz) + v86 fallback |
| Animation | Framer Motion |
| 3D / Twin | Three.js + React Three Fiber |
| Diagrams | Mermaid.js + D3 |
| Local LLM | aya-expanse:32b via Ollama (`localhost:11434`) |
| Cloud LLM fallback | Gemini, DeepSeek, OpenAI |
| Storage | Supabase (existing) |
| Payments | Stripe (existing, for future bounties) |
| Credentials | W3C DID + Verifiable Credentials (`did:web:clawguru.org`) |

---

## 8. Build Priority Order (No Time Estimates — just sequence)

1. ✅ **Academy Hub Redesign** — new IA, 8 tracks, atmospheric hero
2. ✅ **xterm.js POC** — 1 mission playable; engine generalized from the start
3. ✅ **MissionRunner / LiveRangeTerminal** — reusable containers (progress, Sentinel hook, goal side-panel)
4. ✅ **Sentinel AI Tutor** — Ollama → Gemini → stub provider chain
5. ✅ **3 Core Tools** live — Header Doctor, TLS X-Ray, Prompt Injection Sandbox
6. ✅ **Attack Visualizer** — Log4Shell, 10 steps, 3 forks, zero-dep animated SVG
7. 🟡 **80 Mission Outlines + 10 missions fully built** — pipeline ready, waiting on local LLM
8. ✅ **Sitemap sweep + static-route reactivation** (unplanned but necessary)
9. ⏭ **Proof-of-Work Certification** for Foundations track
10. ⏭ **Hodlberg Story Engine** — Act 1
11. ⏭ **Digital Twin** with GitHub read-only connector
12. ⏭ **Adversarial AI Co-Player**
13. ⏭ **Community Features + Mission Authoring**
14. ⏭ **SOC Simulator**
15. ⏭ **Career Launchpad + HR integrations**

---

## 9. Rules of Engagement for Any Agent Picking This Up

1. **Read this doc top to bottom before coding.** Do not skim.
2. **Do not modify** `app/[lang]/summon/*` or `components/summon/*` — Windsurf owns that.
3. **Every new component** must accept `locale: Locale` prop — never inline-ternary on `locale === "de"`. Pull strings from `/dictionaries/{lang}/*.json`.
4. **Every new URL/route** must work for all 50 (post-push) locales via `[lang]` segment.
5. **No backend dependencies** for core modules 1–6 — client-side first, Netlify/Vercel/Railway agnostic.
6. **Schema.org Course / SoftwareApplication / EducationalOccupationalCredential** markup on every new page — non-optional.
7. **Accessibility WCAG AAA** — all interactive elements keyboard-playable + screenreader-labeled.
8. **Update `AGENTS.md`** after every shipped piece (ownership rule).
9. **Update this doc's `Status` in section 0** when milestones complete.
10. **Before starting work on the 50-language push:** verify `aya-expanse:32b` quality on at least 3 target languages (SV, TH, BN).

---

## 10. Current Blockers / Waiting On

| # | Blocker | Unblocks |
|---|---|---|
| 1 | `aya-expanse:32b` pull completing | Translation pipeline start, mission content generation |
| 2 | Windsurf finishing `summon/` | Nothing downstream in Academy scope |

---

## 11. Related Documents

- [`docs/i18n-roadmap-2026-04-22.md`](./i18n-roadmap-2026-04-22.md) — i18n phases
- [`docs/i18n-analysis-2026-04-21.md`](./i18n-analysis-2026-04-21.md) — dict audit
- [`AGENTS.md`](../AGENTS.md) — ownership & activity log
- [`app/[lang]/academy/page.tsx`](../app/[lang]/academy/page.tsx) — current academy hub
