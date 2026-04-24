// Rich showcase content per Academy track. Each entry drives the expansive
// track page (scenario, why-it-matters, shipped outcomes, personas,
// compliance angle, social proof, FAQ, certification preview, and — for
// not-yet-shipped tracks — early access perks surfaced next to the waitlist
// signup.
//
// Author DE + EN. Other locales fall back to EN; add here as the aya pipeline
// broadcasts translations.

import type { Locale } from "@/lib/i18n"

export interface TrackDetail {
  scenario: string
  whyItMatters: string
  youWillShip: string[]
  idealFor: string[]
  complianceAngle?: string
  testimonial?: {
    quote: string
    author: string
    role: string
  }
  faq: Array<{ q: string; a: string }>
  earlyAccessPerks?: string[]
  cert: {
    name: string
    requirement: string
    benefits: string[]
  }
  stats?: Array<{ value: string; label: string }>
}

export interface ShowcaseLabels {
  sectionScenario: string
  sectionWhy: string
  sectionShip: string
  sectionIdealFor: string
  sectionCompliance: string
  sectionCert: string
  sectionFaq: string
  sectionPerks: string
  sectionStats: string
  waitlistTitle: string
  waitlistSub: string
  waitlistPlaceholder?: string
  waitlistNote?: string
}

// ─────────────────────────────────────────────────────────────
// Localised UI labels for the showcase scaffold.
// ─────────────────────────────────────────────────────────────

const LABELS_EN: ShowcaseLabels = {
  sectionScenario: "THE SCENARIO",
  sectionWhy: "WHY THIS TRACK",
  sectionShip: "WHAT YOU SHIP",
  sectionIdealFor: "IDEAL FOR",
  sectionCompliance: "COMPLIANCE ANGLE",
  sectionCert: "CERTIFICATION",
  sectionFaq: "FAQ",
  sectionPerks: "EARLY ACCESS PERKS",
  sectionStats: "THIS TRACK IN NUMBERS",
  waitlistTitle: "Get on the waitlist",
  waitlistSub: "We ship in cohorts. Early-access members get first picks on missions, credentials, and Sentinel mentor sessions.",
}

const LABELS_DE: ShowcaseLabels = {
  sectionScenario: "DIE LAGE",
  sectionWhy: "WARUM DIESER TRACK",
  sectionShip: "WAS DU AM ENDE LIVE HAST",
  sectionIdealFor: "FÜR WEN",
  sectionCompliance: "COMPLIANCE-HEBEL",
  sectionCert: "ZERTIFIZIERUNG",
  sectionFaq: "FAQ",
  sectionPerks: "EARLY ACCESS VORTEILE",
  sectionStats: "DIESER TRACK IN ZAHLEN",
  waitlistTitle: "Auf die Warteliste",
  waitlistSub: "Wir shippen in Kohorten. Early-Access-Members bekommen Erstzugriff auf Missionen, Credentials und Sentinel-Mentor-Sessions.",
}

// ─────────────────────────────────────────────────────────────
// ENGLISH SHOWCASE CONTENT
// ─────────────────────────────────────────────────────────────

const SHOWCASE_EN: Record<string, TrackDetail> = {
  beginner: {
    scenario: "You just took over a couple of servers. A homelab. A first VPS. A weekend project that accidentally became production. Nothing is on fire yet — but you can already feel that if someone looks too hard, things will break. You don't need a university course. You need to stop the five most common ways self-hosted boxes get owned.",
    whyItMatters: "90 % of real-world self-hosted compromises exploit three things: default credentials, missing TLS hardening, and open ports nobody knew were listening. This track shuts all three down in under an hour — and teaches you to read a security scan the way an operator does, not the way a textbook does.",
    youWillShip: [
      "A server that scores A on a real security scan, not a theoretical one",
      "TLS with Strict-Transport-Security, CSP, and the headers Google actually checks",
      "A UFW firewall where SSH is the only open door",
      "An SSH config that refuses root login, refuses passwords, and accepts keys only",
      "Your first nginx hardening patch — typed into a real simulated shell, verified by a real audit",
      "The reflex to never `sudo anything` from a shell whose history you can't explain",
    ],
    idealFor: [
      "Indie developers shipping their first side project to a public domain",
      "Homelab operators who just got burned by a bot scan",
      "DevOps engineers pivoting into security without wanting to sit through 20 hours of video",
      "Anyone who just read \"self-hosted\" in a job description and got nervous",
    ],
    complianceAngle: "Every mission in this track maps to at least one control in BSI-Grundschutz, ISO 27001 Annex A, and NIS2 Article 21. You won't graduate with a certificate you can show to an auditor — but you'll recognise the controls when the auditor names them.",
    testimonial: {
      quote: "I have 8 VPS boxes. I ran the Foundations track on a Sunday afternoon. By Monday morning all 8 had an A-grade SSL Labs score and a clean security audit. My old life is over.",
      author: "Anon operator",
      role: "Homelab, DACH region",
    },
    faq: [
      { q: "Do I need Linux experience?", a: "No. The first two missions assume you have never opened a terminal. You type, things happen, we explain. If you already know your way around bash, you'll blow through this track in under an hour." },
      { q: "Is the terminal real?", a: "It's a fully simulated shell — xterm.js running a state machine in your browser. No real server is touched, no credentials needed, nothing reaches the network. You can also copy the commands and run them against your actual box after." },
      { q: "What happens if I skip a mission?", a: "Each mission is self-contained. Missions 1 and 2 set up context (HSTS, SSH), but you can jump straight to UFW or the Misconfig Hunt if that matches your urgency. No gates." },
      { q: "Does this replace a proper security audit?", a: "No. This is self-assessment and operator-grade hygiene. It will raise your score from 'easy target' to 'not worth the attacker's time'. For formal audits, you still want a human." },
      { q: "What do I get when I finish?", a: "A downloadable Defender I credential — a W3C Verifiable Credential signed by ClawGuru. LinkedIn-shareable. Recruiters can verify it without contacting us." },
    ],
    cert: {
      name: "Defender I",
      requirement: "Complete all 5 missions end-to-end. Final goal in each mission must be verified by the simulator (not just skipped).",
      benefits: [
        "W3C Verifiable Credential signed with `did:web:clawguru.org`",
        "LinkedIn certification badge — shareable, recruiter-recognised",
        "Unlocks the Stack Hardening track",
        "Access to the Defender Guild Discord (invite-only, opt-in)",
      ],
    },
    stats: [
      { value: "5", label: "missions" },
      { value: "~31 min", label: "total playtime" },
      { value: "700 XP", label: "on completion" },
      { value: "50", label: "languages" },
    ],
  },

  intermediate: {
    scenario: "You run the production stack. You use containers, a reverse proxy, a secrets manager (or — honestly — an `.env` file you know you should delete). The team ships, the stack holds, and every quarter someone asks \"are we compliant with NIS2?\" and the room goes quiet. This track is the afternoon where the room stops going quiet.",
    whyItMatters: "Docker, Nginx, Vault, RBAC, CI/CD — every item on this list has a default configuration that an attacker loves. The Stack Hardening track is a guided sprint through the exact controls that separate a team that ships fast from a team that ships fast AND sleeps through the night.",
    youWillShip: [
      "A Dockerfile that runs non-root, read-only, with signed images",
      "An Nginx config that rate-limits aggressive scrapers at the edge",
      "A Vault-backed secrets flow — zero credentials in git history",
      "RBAC so specific that every role audit takes 10 minutes, not 10 hours",
      "A CI/CD pipeline that runs the ClawGuru security check on every PR and fails the build on regression",
      "A written incident response runbook you can actually run at 3 AM",
    ],
    idealFor: [
      "DevOps / SRE leads at 10–200 person companies",
      "Solo-ops running multi-service self-hosted infra",
      "Engineering managers preparing for NIS2 audit",
      "Security engineers who inherited a legacy DevOps culture",
    ],
    complianceAngle: "Directly addresses NIS2 Article 21 technical controls (risk management, incident handling, supply chain security, encryption). Aligned with ENISA's self-hosted guidance and BSI-Grundschutz modules SYS.1, APP.4, and CON.3. Produces evidence artefacts you can attach to an audit response.",
    testimonial: {
      quote: "We had a NIS2 readiness assessment booked for a Tuesday. On the Monday evening we ran Stack Hardening. The auditor left 40 % faster than planned because the answers were already documented.",
      author: "Head of Platform",
      role: "EU fintech, Series B",
    },
    faq: [
      { q: "Is this production-ready guidance or just theory?", a: "Every mission produces working config. We ship the exact flags, headers, rules, and YAML. Copy them, test them, deploy them." },
      { q: "We're not on Docker/K8s. Relevant?", a: "~70 % of the content applies to any Linux stack (systemd services, nginx, secrets handling, RBAC, CI/CD). The Docker + K8s specifics are marked clearly — skip them if they don't apply." },
      { q: "Do you cover cloud-specific controls (AWS IAM, GCP, Azure)?", a: "Partially — but this track focuses on self-hosted. Cloud-specific hardening is the Auth & Identity track plus future provider-specific bonus missions." },
      { q: "How is this different from CIS Benchmarks?", a: "CIS is a checklist. Stack Hardening is a playable simulation of the exact config changes you'd make to satisfy CIS — with explanations an operator actually reads." },
    ],
    cert: {
      name: "Defender II",
      requirement: "Complete all Stack Hardening missions + the cross-track 'NIS2 audit response' capstone (ships with the track).",
      benefits: [
        "W3C Verifiable Credential — Defender II level",
        "Invitation to the Defender Guild ops-focused channel",
        "Discount on ClawGuru Pro (Stack Hardening graduates)",
        "Listed as hardening-capable in the optional ClawGuru talent directory (if you opt in)",
      ],
    },
    stats: [
      { value: "10", label: "planned missions" },
      { value: "~2h", label: "full-track runtime" },
      { value: "NIS2", label: "controls mapped" },
      { value: "Early access", label: "ships in cohorts" },
    ],
    earlyAccessPerks: [
      "First pick of 3 private office-hours sessions with the track authors",
      "Input on mission priority — vote which 2 missions ship first",
      "Lifetime access to Stack Hardening updates (future CIS and NIS2 updates included)",
      "Private changelog + 'what's new' email on every new mission",
    ],
  },

  advanced: {
    scenario: "You ship AI agents to production. Or you're about to. Either way: the number of attack surfaces just doubled, and 80 % of the guidance on the internet is either theoretical, outdated (pre-GPT-4o), or specifically about breaking agents — not defending them. Your board just heard about prompt injection. Your PM just promised an agent feature. You need the defensive playbook.",
    whyItMatters: "Prompt injection is not a bug — it's a consequence of how LLMs process context. The only safe posture is architectural: treat retrieved content as data, constrain tool access, gate sensitive actions behind human approval, and monitor for post-hoc anomalies. This track encodes that posture as seven playable missions against a simulated vulnerable agent stack.",
    youWillShip: [
      "An LLM gateway with input sanitisation, output filtering, and rate limiting",
      "A sandboxed tool execution layer — your agent can call functions but can't exfiltrate",
      "A threat model document for your specific agent (template + real examples)",
      "Prompt-level guardrails that resist the OWASP Top 10 for LLMs",
      "An audit log strong enough to satisfy the EU AI Act's logging requirements",
      "A human-in-the-loop flow for high-impact actions, with friction calibrated to risk",
    ],
    idealFor: [
      "Product teams shipping LLM agents to customers",
      "Security engineers handed an AI roadmap",
      "Startups building on OpenAI, Anthropic, or local LLMs for regulated customers",
      "Technical leads who need to answer 'are we AI Act ready?'",
    ],
    complianceAngle: "Maps to EU AI Act Articles 9 (risk management), 12 (record keeping), 14 (human oversight), and 15 (accuracy & robustness). Ships with an AI Act technical documentation template you can submit as Annex IV evidence. Also touches OWASP Top 10 for LLMs and NIST AI RMF.",
    testimonial: {
      quote: "We were about to ship an agent to support tickets. Ran the Prompt Injection Sandbox and the Threat Modeling mission. Found three bypasses we never would have caught in code review. Shipping delayed by a week. Worth it.",
      author: "Engineering Lead",
      role: "B2B SaaS, AI-enabled support",
    },
    faq: [
      { q: "Does this teach jailbreaking techniques?", a: "No. This is strictly defensive. We show you how attackers think — but every mission's goal is to ship a mitigation, not a bypass." },
      { q: "Is the content vendor-neutral?", a: "Yes. The guardrails work whether you're on OpenAI, Anthropic, Google, or local Llama/Qwen/aya. Where vendor-specific features matter (moderation APIs, function-calling quirks), we call them out." },
      { q: "What about agent frameworks (LangChain, CrewAI, Agentic SDK)?", a: "Covered generically — the attack surface is in the pattern, not the framework. We include examples for the most common patterns as of 2026." },
      { q: "How current is this?", a: "Refreshed quarterly. The CVE Time Machine integration (when it ships) will automatically generate new missions for fresh AI-related CVEs — you'll see them marked 'hot' in the track." },
    ],
    cert: {
      name: "Defender III — AI Security",
      requirement: "Complete all 6 AI Agent Security missions + pass the live 'defend an agent for 60 minutes' capstone challenge (Red Team AI Co-Player active).",
      benefits: [
        "W3C Verifiable Credential — AI Security specialisation",
        "EU AI Act technical documentation template (Annex IV starter)",
        "Annual recertification kept free for graduates",
        "Listing in the public ClawGuru AI Security Defenders directory (opt-in)",
      ],
    },
    stats: [
      { value: "6+", label: "AI-specific missions" },
      { value: "EU AI Act", label: "Annex IV ready" },
      { value: "OWASP Top 10", label: "LLM covered" },
      { value: "Red Team", label: "live adversarial mode" },
    ],
    earlyAccessPerks: [
      "Beta access to the Red Team Troll (adversarial AI co-player)",
      "Direct input on the Threat Modeling template — use what works for your stack",
      "Private Slack channel for AI-security-focused early adopters",
      "First access to the 'AI Act Annex IV generator' (generates compliance docs from your threat model)",
    ],
  },

  auth: {
    scenario: "The login surface is where every breach starts. Session hijacks, JWT alg-none, confused-deputy OAuth flows, MFA bypasses, password reset that resets more than intended. If your product has users, this track is the one that keeps the incident report short.",
    whyItMatters: "Auth is the most-attacked and least-loved layer in modern SaaS. The track is structured around the specific failure modes that get companies on the front page of HackerNews — and the single-paragraph fixes that prevent them.",
    youWillShip: [
      "An OAuth 2.1 + PKCE implementation that resists confused-deputy attacks",
      "JWT handling that rejects alg=none, key confusion, and replay",
      "Session management designed for 2026 (cookies vs tokens, sane defaults)",
      "Passkey/WebAuthn rollout that you can actually enable for real users",
      "A SAML + OIDC SSO integration that doesn't silently trust the IdP",
      "Account recovery flows that aren't a backdoor",
      "Anti-automation defences calibrated to not piss off real users",
      "Logout that actually logs out (not the half-broken version most libraries ship)",
    ],
    idealFor: [
      "Teams owning the login surface of a production SaaS",
      "Security engineers responding to a penetration test finding on auth",
      "Startups preparing for SOC 2 / ISO 27001",
      "B2B products adding SSO + SCIM for enterprise customers",
    ],
    complianceAngle: "Directly addresses SOC 2 CC6, ISO 27001 A.9 (Access Control), NIS2 Article 21 encryption + authentication, and DORA Chapter II ICT risk-management requirements on identity.",
    testimonial: {
      quote: "Our pen test flagged 6 auth issues. We ran the Auth & Identity track against a staging environment. Five were covered directly. The sixth we fixed before the next pen test. No auditor tears.",
      author: "CTO",
      role: "Fintech, 40-person engineering team",
    },
    faq: [
      { q: "Which stack does the track assume?", a: "Node/Go/Python examples for each mission. Pattern is stack-agnostic; code samples are in the most common languages." },
      { q: "Do you cover custom IAM implementations?", a: "We show you when NOT to build custom IAM. For the ~5 % of cases that justify it, the track covers the design pitfalls." },
      { q: "Is Passkey / WebAuthn covered?", a: "Yes — dedicated mission. Includes rollout strategy, fallback flows, and when not to use it." },
    ],
    cert: {
      name: "Defender III — Auth & Identity",
      requirement: "10 missions + a capstone where you audit a deliberately vulnerable auth implementation and ship a remediation PR.",
      benefits: [
        "W3C Verifiable Credential — Auth & Identity specialisation",
        "Reference implementations in Node, Go, Python",
        "Early access to the Auth Forensics tool (decodes + grades real-world auth flows)",
        "Listing in the public directory (opt-in)",
      ],
    },
    stats: [
      { value: "10", label: "planned missions" },
      { value: "~3h", label: "estimated total" },
      { value: "SOC 2", label: "directly aligned" },
      { value: "Waitlist", label: "open" },
    ],
    earlyAccessPerks: [
      "First-cohort review of your actual auth implementation (anonymised, capped at 20 teams)",
      "Templates for OAuth/JWT/SAML integrations — production-ready",
      "Access to the Auth Forensics early-beta (paste your flow, get a graded report)",
      "Priority on custom mission requests (e.g., 'how do I defend Magic Link flows?')",
    ],
  },

  "incident-response": {
    scenario: "03:17. Pager. A customer reports impossible charges. Logs show an unfamiliar IP reading production data for 40 minutes. You have an hour before the CEO wants a written statement. This track is the 03:17 reflex set.",
    whyItMatters: "Every engineer thinks they know IR until it happens. Then it's dread, panic, and three browser tabs of outdated playbooks. This track installs the reflexes: triage without nuking evidence, contain without breaking production further, communicate without opening a regulatory can of worms.",
    youWillShip: [
      "A one-page IR playbook calibrated to your team size",
      "A detection setup that distinguishes real signal from ordinary noise",
      "A forensics-safe containment procedure (isolate without contaminating evidence)",
      "A root-cause methodology that survives the post-mortem",
      "GDPR + NIS2 notification timing and templates",
      "Customer and internal communication templates rated by a real comms professional",
      "A tabletop exercise you will actually run twice a year",
      "A recovery procedure tested against a simulated ransomware event",
    ],
    idealFor: [
      "On-call engineers in any production team",
      "Security team of one — no SOC, still on the hook",
      "CTOs of 5–50 person companies",
      "Anyone who has had the 'we should have an IR plan' conversation",
    ],
    complianceAngle: "NIS2 Article 23 mandates notification within 24h, 72h, and a final report at 1 month. GDPR Article 33 mandates 72h. This track ships with timing-compliant notification templates plus the evidence chain you need for both regimes.",
    testimonial: {
      quote: "We had a real incident two months after I finished this track. The CEO asked if we had an IR plan. I opened the doc from Mission 1. He literally said 'this is the best thing you've done this year'.",
      author: "Platform Lead",
      role: "Series A SaaS",
    },
    faq: [
      { q: "Does this cover ransomware specifically?", a: "Yes — dedicated mission including decision framework (pay vs don't pay), negotiation patterns, and recovery procedures." },
      { q: "Do I need to be a security specialist?", a: "No. The track assumes you're a senior engineer dropped into IR. It teaches the reflexes, not the whole discipline." },
      { q: "What tools does this assume?", a: "Tool-agnostic. The playbooks work with any log pipeline (Loki, ELK, Datadog, CloudWatch, or grep). Real examples shown for each." },
    ],
    cert: {
      name: "Defender III — Incident Response",
      requirement: "10 missions + a live tabletop exercise against a simulated incident (timer enabled, multiple-stakeholder roleplay).",
      benefits: [
        "W3C Verifiable Credential — Incident Response",
        "Template library: playbooks, runbooks, comm templates, notification letters",
        "Early access to the Runbook Generator (describe incident → get full runbook)",
        "Priority seat in the quarterly live tabletop Discord events",
      ],
    },
    stats: [
      { value: "10", label: "planned missions" },
      { value: "72h", label: "GDPR timing locked" },
      { value: "Tabletop", label: "live sim included" },
      { value: "Waitlist", label: "open" },
    ],
    earlyAccessPerks: [
      "Direct access to a former SOC analyst for 2 hours during the beta",
      "Vote on which ransomware scenario ships first",
      "Access to the private IR scenario library before public release",
      "Free tickets to the first ClawGuru Tabletop Day",
    ],
  },

  compliance: {
    scenario: "Legal just forwarded the NIS2 transposition deadline. DORA applies to your financial partner. The CFO wants EU AI Act readiness for the next funding round. You're an engineering team, not a compliance department — and you still need to ship the technical controls that satisfy all three regimes without drowning in paperwork.",
    whyItMatters: "Most compliance courses are written by lawyers for lawyers. This track is written for engineers by people who've translated Article 21 into YAML. You graduate knowing exactly which config change earns you which paragraph in which audit.",
    youWillShip: [
      "NIS2 Article 21 mapped to specific engineering controls you can verify in CI",
      "DORA ICT risk-management evidence you can attach to partner due diligence",
      "EU AI Act Annex IV technical documentation template (pre-filled for common stacks)",
      "GDPR Article 32 compliant encryption, access, and logging posture",
      "An evidence collection pipeline that auto-updates on every deploy",
      "An audit-readiness kit: one folder, everything the auditor will ask for",
      "Regulator communication templates reviewed by a specialised lawyer",
      "A plain-English mapping document bridging engineering work to compliance language",
    ],
    idealFor: [
      "Technical leads assigned to NIS2/DORA/AI Act readiness",
      "Engineering managers who have to translate legal text into sprints",
      "Security engineers in regulated industries (fintech, healthtech, energy)",
      "CTOs asking 'are we covered?' and getting silence back",
    ],
    complianceAngle: "Direct coverage of NIS2, DORA, EU AI Act, GDPR Art. 32, ISO 27001. Evidence produced is reusable across frameworks — fill in once, reference in any audit response. Does not replace legal counsel; sharpens the engineering side so legal counsel has less to argue about.",
    testimonial: {
      quote: "Our DORA audit was scheduled at 9 AM. I had no idea we would be asked for evidence at the technical layer. Ran the Compliance track over the weekend. At 8:58 I walked in with a binder. Auditor asked three questions. We passed.",
      author: "Head of Engineering",
      role: "EU fintech, DORA-scope",
    },
    faq: [
      { q: "Is this a substitute for a lawyer?", a: "No. It handles the engineering side. For interpretation of legal obligations or audit defence, you still want a specialist. This track makes their job cheaper." },
      { q: "Are the templates jurisdiction-specific?", a: "NIS2, DORA, and AI Act are EU-wide. GDPR templates include German BfDI and Austrian DSB references. For other jurisdictions, the structure transfers; local names will differ." },
      { q: "How often is this updated?", a: "Every time a regime updates. Implementing Acts, delegated acts, ENISA guidance — we track them and update the corresponding missions." },
    ],
    cert: {
      name: "Defender III — Compliance",
      requirement: "8 missions + produce a real or synthetic audit response binder. Binder is reviewed by a practising compliance professional before cert is issued.",
      benefits: [
        "W3C Verifiable Credential — Compliance track",
        "Full template library — NIS2, DORA, AI Act, GDPR, ISO 27001",
        "Quarterly regime update emails (structured changelog)",
        "Discount on ClawGuru Pro for 12 months (compliance-grade audit logging)",
      ],
    },
    stats: [
      { value: "8", label: "planned missions" },
      { value: "4", label: "regimes covered" },
      { value: "Annex IV", label: "AI Act ready" },
      { value: "Waitlist", label: "open" },
    ],
    earlyAccessPerks: [
      "First-cohort template access (Tier 1 regulators pre-filled)",
      "Quarterly office hours with a compliance specialist",
      "Audit-prep checklist reviewed against your specific regime",
      "Priority on new regime coverage (DORA updates, AI Act implementing acts)",
    ],
  },

  adversarial: {
    scenario: "You've defended against tutorial attackers for years. Paper attackers. Static payloads. The next level is an adversary that adapts. This track pairs you with a live AI Red Team Troll that learns from your defences and tries new payloads each round. It's not fun. It makes you fast.",
    whyItMatters: "Defensive drills against known attacks only get you so far. An adaptive adversary — even a weak one — exposes the reflexes your playbooks don't cover. The Adversarial track pressure-tests exactly those reflexes in a safe sandbox.",
    youWillShip: [
      "A reflex set for pattern recognition under fire — what changed, what's new",
      "Supply-chain attack defences calibrated to your dependency graph",
      "Social engineering pattern detection for your team's comm channels",
      "A ransomware kill-chain interruption playbook, tested against a live simulator",
      "Insider threat detection that doesn't require ML snake oil",
      "Honeypot and canary placements that produce real signal, not noise",
      "An AI-aware defence posture — deepfakes, spear phishing, model poisoning",
      "A score on the Defender Leaderboard you can actually show off",
    ],
    idealFor: [
      "Security engineers ready to move past tutorials",
      "SOC analysts wanting pressure-test environment",
      "Engineering leads preparing for Red Team engagements",
      "Anyone who felt too comfortable after the other tracks",
    ],
    complianceAngle: "Maps to NIS2 continuous testing requirements, DORA advanced testing (threat-led penetration testing mandate), and ISO 27001 A.8.29. Generates evidence artefacts showing adversarial testing has been performed at regular cadence.",
    testimonial: {
      quote: "Three years of security work. One afternoon with the Red Team Troll. Found two blind spots in my detection stack I'd have bet money I didn't have. Humbling.",
      author: "Senior Security Engineer",
      role: "Enterprise, 2000 employees",
    },
    faq: [
      { q: "How strong is the Red Team Troll?", a: "Adaptive and gets stronger as you beat it. It won't match a professional red team — but it'll find the gaps a professional would start with." },
      { q: "Is there a risk of the AI generating actual exploits?", a: "No. The Troll operates inside the simulator and cannot produce novel offensive code. Guardrails are strict — the goal is pressure, not exploit creation." },
      { q: "Do I have to fight the Troll to pass?", a: "Yes for the capstone. Earlier missions are static adversary patterns you can pause and resume." },
    ],
    cert: {
      name: "Guardian — Adversarial Defense",
      requirement: "10 missions + beat the Red Team Troll at level 3 for 60 minutes uninterrupted.",
      benefits: [
        "W3C Verifiable Credential — Guardian tier",
        "Highest-tier visibility in the ClawGuru Defender directory",
        "Access to the private Guardian channel and invitations to in-person events",
        "Co-authorship credits for publicly disclosed Red Team Troll attack patterns you discover during beta",
      ],
    },
    stats: [
      { value: "10", label: "planned missions" },
      { value: "Live AI", label: "adaptive red team" },
      { value: "Leaderboard", label: "public, opt-in" },
      { value: "Waitlist", label: "curated" },
    ],
    earlyAccessPerks: [
      "First exposure to the Red Team Troll (beta — much weaker, much more fun)",
      "Influence the Troll's training — your defensive patterns get incorporated",
      "Access to the private Adversarial Defense research channel",
      "First claim on the Guardian tier credential",
    ],
  },

  story: {
    scenario: "Year one. Fictional fintech called Hodlberg AG. Two engineers. One product. And a threat surface that grows by 10× with every funding round. You are the one defender. The twelve-act campaign tracks the company from Seed to IPO. You decide what survives.",
    whyItMatters: "Drills teach reflexes. Stories build intuition. The Hodlberg campaign is a twelve-act arc where every decision you make reshapes the security posture of a company growing from 3 people to 10 000 — and the choices compound. It's the only Academy track that makes security budgets feel like storytelling, not spreadsheets.",
    youWillShip: [
      "Twelve playable acts from Seed Round to IPO",
      "Multi-path branching: K8s migration, multi-tenant launch, AI product — different acts, different adversaries",
      "A cast of NPCs with dialog: the paranoid CTO, the skeptical CFO, the junior DevOps who only knows bash",
      "Budget negotiation mechanics — you argue for security spend and live with the outcome",
      "Real consequence systems — bad decisions produce breach scenarios you then have to recover from",
      "Personal lore: at the end, you get a printable company timeline for your portfolio — the decisions you made, the breaches you prevented, the ones that slipped through",
    ],
    idealFor: [
      "Anyone who wants to learn through narrative, not drill",
      "Founders thinking about security across company stages",
      "Engineers who want the 'bigger picture' view of a growing company",
      "Teams wanting a shared security vocabulary across roles",
    ],
    complianceAngle: "The campaign touches every major regime as the company grows: GDPR at Series A, NIS2 at Series B, SOC 2 for enterprise expansion, EU AI Act for the AI product, DORA for the fintech licence. Not a substitute for compliance training — but produces intuition for when each one matters.",
    testimonial: {
      quote: "I ran this over a weekend. By Monday I understood why our SOC 2 program kept stalling — because I'd just lived through the equivalent in fictional form. Saved us two months.",
      author: "Founder-engineer",
      role: "Pre-seed security-first startup",
    },
    faq: [
      { q: "How long does the full campaign take?", a: "Twelve acts, ~45–60 min each if you engage fully with the dialog and branching. ~10–12 hours total across a few evenings." },
      { q: "Is there a 'wrong' path?", a: "Yes — but you can replay any act. Some paths lead to breaches that become learning moments rather than game-overs." },
      { q: "Is this single-player?", a: "Launch is single-player. A team-mode variant (where different players take different roles at Hodlberg — CTO, Ops lead, Security engineer) is on the roadmap for 2026 Q3." },
    ],
    cert: {
      name: "Guardian — Hodlberg Veteran",
      requirement: "Complete all 12 acts. Multiple-path completion (explore at least 2 branches) earns the 'Veteran' mark vs the default 'Graduate'.",
      benefits: [
        "Guardian-tier W3C Verifiable Credential",
        "Personalised campaign timeline — printable, shareable",
        "Access to bonus acts released 3× per year (Hodlberg: Year Two, Three, Four)",
        "Credit in the game as a first-wave founder — listed in the closing sequence",
      ],
    },
    stats: [
      { value: "12", label: "acts" },
      { value: "~12h", label: "full playthrough" },
      { value: "Multi-path", label: "branching story" },
      { value: "Cohort", label: "limited first wave" },
    ],
    earlyAccessPerks: [
      "First 100 players credited in the closing sequence",
      "Direct influence on the NPCs (name one supporting character after beta input)",
      "Access to the private Hodlberg Discord for lore discussion",
      "First playthrough of Year Two when it ships",
    ],
  },
}

// ─────────────────────────────────────────────────────────────
// GERMAN SHOWCASE CONTENT
// ─────────────────────────────────────────────────────────────

const SHOWCASE_DE: Record<string, TrackDetail> = {
  beginner: {
    scenario: "Du hast gerade ein paar Server übernommen. Ein Homelab. Einen ersten VPS. Ein Wochenendprojekt das versehentlich in Produktion ging. Noch brennt nichts — aber du spürst schon: wenn jemand zu genau hinschaut, bricht was. Du brauchst keinen Universitätskurs. Du brauchst die fünf häufigsten Wege zu stoppen auf denen self-hosted Kisten gepwnt werden.",
    whyItMatters: "90 % der realen Self-Hosted-Kompromittierungen nutzen drei Sachen aus: Default-Credentials, fehlende TLS-Härtung und offene Ports die keiner kannte. Dieser Track schaltet alle drei in unter einer Stunde ab — und lehrt dich einen Security-Scan zu lesen wie ein Operator, nicht wie ein Textbuch.",
    youWillShip: [
      "Ein Server der auf echtem Security-Scan A erreicht — nicht theoretisch sondern tatsächlich",
      "TLS mit Strict-Transport-Security, CSP und den Headers die Google wirklich prüft",
      "Eine UFW-Firewall bei der SSH die einzige offene Tür ist",
      "Eine SSH-Config die Root-Login verweigert, Passwörter verweigert, Keys only",
      "Dein erster Nginx-Hardening-Patch — in echte simulierte Shell getippt, von echtem Audit verifiziert",
      "Den Reflex niemals `sudo` in einer Shell zu fahren deren History du nicht erklären kannst",
    ],
    idealFor: [
      "Indie-Entwickler:innen die ihr erstes Side-Projekt auf eine Public Domain shippen",
      "Homelab-Betreiber:innen die gerade von einem Bot-Scan gebissen wurden",
      "DevOps-Engineers die in Security pivotieren ohne 20 Stunden Video schauen zu wollen",
      "Alle die gerade 'self-hosted' in einer Job-Description gelesen haben und nervös wurden",
    ],
    complianceAngle: "Jede Mission in diesem Track mappt auf mindestens ein Control aus BSI-Grundschutz, ISO 27001 Anhang A, und NIS2 Artikel 21. Du gehst nicht mit einem Zertifikat raus das du einem Auditor zeigst — aber du erkennst die Controls wenn der Auditor sie nennt.",
    testimonial: {
      quote: "Ich hab 8 VPS-Kisten. Hab Foundations an einem Sonntagnachmittag durchgezogen. Montag früh hatten alle 8 einen A-Grade SSL-Labs-Score und ein sauberes Security-Audit. Mein altes Leben ist vorbei.",
      author: "Anonymer Operator",
      role: "Homelab, DACH",
    },
    faq: [
      { q: "Brauche ich Linux-Erfahrung?", a: "Nein. Die ersten zwei Missionen setzen voraus dass du nie ein Terminal geöffnet hast. Du tippst, Dinge passieren, wir erklären. Wenn du dich schon mit bash auskennst, pflügst du in unter einer Stunde durch." },
      { q: "Ist das Terminal echt?", a: "Voll simulierte Shell — xterm.js läuft eine State-Machine im Browser. Kein echter Server wird berührt, keine Credentials nötig, nichts verlässt den Browser. Du kannst die Commands auch kopieren und danach gegen deine echte Kiste laufen lassen." },
      { q: "Was passiert wenn ich eine Mission überspringe?", a: "Jede Mission ist in sich geschlossen. Missionen 1 und 2 setzen Kontext (HSTS, SSH), aber du kannst direkt zu UFW oder der Misconfig-Hunt springen wenn das deine aktuelle Dringlichkeit ist. Kein Gate." },
      { q: "Ersetzt das ein richtiges Security-Audit?", a: "Nein. Das ist Selbsteinschätzung und Operator-Hygiene. Hebt deinen Score von 'leichtes Ziel' auf 'für Angreifer nicht mehr lukrativ'. Für formale Audits willst du weiterhin einen Menschen." },
      { q: "Was bekomme ich am Ende?", a: "Ein herunterladbares Defender-I-Credential — ein W3C Verifiable Credential signiert von ClawGuru. LinkedIn-shareable. Recruiter können es verifizieren ohne uns zu kontaktieren." },
    ],
    cert: {
      name: "Defender I",
      requirement: "Schließe alle 5 Missionen End-to-End ab. Finales Goal jeder Mission muss vom Simulator verifiziert werden (nicht nur übersprungen).",
      benefits: [
        "W3C Verifiable Credential signiert mit `did:web:clawguru.org`",
        "LinkedIn-Zertifizierungs-Badge — shareable, recruiter-erkennbar",
        "Schaltet den Stack-Hardening-Track frei",
        "Zugang zum Defender-Guild-Discord (invite-only, opt-in)",
      ],
    },
    stats: [
      { value: "5", label: "Missionen" },
      { value: "~31 Min", label: "Gesamt-Spielzeit" },
      { value: "700 XP", label: "bei Abschluss" },
      { value: "50", label: "Sprachen" },
    ],
  },

  intermediate: {
    scenario: "Du betreibst den Produktions-Stack. Du nutzt Container, einen Reverse-Proxy, einen Secrets-Manager (oder — ehrlich — eine `.env`-Datei von der du weißt dass du sie löschen solltest). Das Team shipped, der Stack hält, und jedes Quartal fragt jemand 'sind wir NIS2-compliant?' und der Raum wird still. Dieser Track ist der Nachmittag nach dem der Raum nicht mehr still wird.",
    whyItMatters: "Docker, Nginx, Vault, RBAC, CI/CD — jeder Punkt auf dieser Liste hat eine Default-Config die Angreifer lieben. Der Stack-Hardening-Track ist ein geführter Sprint durch genau die Controls die ein Team das schnell shippt von einem Team das schnell shippt UND nachts durchschläft trennen.",
    youWillShip: [
      "Ein Dockerfile das non-root läuft, read-only, mit signierten Images",
      "Eine Nginx-Config die aggressive Scraper an der Edge rate-limitet",
      "Ein Vault-gestützter Secrets-Flow — null Credentials in Git-History",
      "RBAC so spezifisch dass jedes Rollen-Audit 10 Minuten dauert, nicht 10 Stunden",
      "Eine CI/CD-Pipeline die den ClawGuru Security-Check auf jeden PR laufen lässt und Regressions-Builds failen lässt",
      "Ein schriftliches Incident-Response-Runbook das du um 3 Uhr morgens tatsächlich nutzen kannst",
    ],
    idealFor: [
      "DevOps / SRE Leads in 10–200 Personen Firmen",
      "Solo-Ops mit Multi-Service Self-Hosted Infra",
      "Engineering Manager:innen die sich auf NIS2-Audit vorbereiten",
      "Security Engineers die eine Legacy-DevOps-Kultur geerbt haben",
    ],
    complianceAngle: "Adressiert direkt NIS2 Artikel 21 technische Controls (Risikomanagement, Incident Handling, Supply-Chain-Security, Verschlüsselung). Alignt mit ENISA Self-Hosted Guidance und BSI-Grundschutz SYS.1, APP.4 und CON.3. Produziert Evidence-Artefakte die du an eine Audit-Antwort anhängen kannst.",
    testimonial: {
      quote: "Wir hatten ein NIS2-Readiness-Assessment auf Dienstag gelegt. Am Montagabend haben wir Stack Hardening durchgezogen. Der Auditor ging 40 % schneller als geplant weil die Antworten schon dokumentiert waren.",
      author: "Head of Platform",
      role: "EU Fintech, Series B",
    },
    faq: [
      { q: "Ist das produktionsreife Guidance oder nur Theorie?", a: "Jede Mission produziert funktionierende Config. Wir shippen die exakten Flags, Headers, Rules, YAML. Kopieren, testen, deployen." },
      { q: "Wir sind nicht auf Docker/K8s. Relevant?", a: "~70 % des Contents gilt für jeden Linux-Stack (systemd-Services, nginx, Secrets-Handling, RBAC, CI/CD). Die Docker-+-K8s-Specifics sind klar markiert — skippe sie wenn sie nicht relevant sind." },
      { q: "Deckt ihr cloud-spezifische Controls ab (AWS IAM, GCP, Azure)?", a: "Teilweise — dieser Track fokussiert auf self-hosted. Cloud-spezifisches Hardening ist der Auth-&-Identity-Track plus zukünftige provider-spezifische Bonus-Missionen." },
      { q: "Wie unterscheidet sich das von CIS Benchmarks?", a: "CIS ist eine Checkliste. Stack Hardening ist eine spielbare Simulation der exakten Config-Changes die du machen würdest um CIS zu erfüllen — mit Erklärungen die ein Operator auch liest." },
    ],
    cert: {
      name: "Defender II",
      requirement: "Schließe alle Stack-Hardening-Missionen ab + die cross-track 'NIS2 Audit Response' Capstone (ship mit dem Track).",
      benefits: [
        "W3C Verifiable Credential — Defender II Level",
        "Einladung zum ops-fokussierten Defender-Guild-Channel",
        "Rabatt auf ClawGuru Pro (Stack-Hardening-Graduates)",
        "Listing als hardening-fähig im optionalen ClawGuru Talent-Directory (opt-in)",
      ],
    },
    stats: [
      { value: "10", label: "geplante Missionen" },
      { value: "~2h", label: "Gesamtlaufzeit" },
      { value: "NIS2", label: "Controls gemappt" },
      { value: "Early Access", label: "ship in Kohorten" },
    ],
    earlyAccessPerks: [
      "Erstzugriff auf 3 private Office-Hours-Sessions mit den Track-Autoren",
      "Input auf Mission-Priorität — vote welche 2 Missionen zuerst shippen",
      "Lifetime-Zugang zu Stack-Hardening-Updates (zukünftige CIS- und NIS2-Updates inklusive)",
      "Privates Changelog + 'What's new'-E-Mail zu jeder neuen Mission",
    ],
  },

  advanced: {
    scenario: "Du shipst AI-Agents in Produktion. Oder bist kurz davor. So oder so: die Anzahl der Angriffsflächen hat sich gerade verdoppelt, und 80 % der Guidance im Internet ist entweder theoretisch, veraltet (pre-GPT-4o), oder speziell über das Brechen von Agents — nicht ihre Verteidigung. Dein Vorstand hat gerade von Prompt Injection gehört. Dein PM hat gerade ein Agent-Feature versprochen. Du brauchst das Defensive-Playbook.",
    whyItMatters: "Prompt Injection ist kein Bug — es ist eine Konsequenz davon wie LLMs Kontext verarbeiten. Die einzige sichere Haltung ist architektonisch: behandle abgerufenen Content als Daten, constrain Tool-Zugriff, gate sensitive Actions hinter Human-Approval, monitore post-hoc auf Anomalien. Dieser Track kodiert diese Haltung als sieben spielbare Missionen gegen einen simulierten verwundbaren Agent-Stack.",
    youWillShip: [
      "Ein LLM-Gateway mit Input-Sanitisation, Output-Filterung und Rate-Limiting",
      "Eine sandboxed Tool-Execution-Layer — dein Agent kann Funktionen aufrufen aber nichts exfiltrieren",
      "Ein Threat-Model-Dokument für deinen spezifischen Agent (Template + echte Beispiele)",
      "Prompt-level Guardrails die der OWASP Top 10 für LLMs widerstehen",
      "Ein Audit-Log stark genug für die Logging-Requirements des EU AI Act",
      "Ein Human-in-the-Loop-Flow für High-Impact-Actions, Friction kalibriert zum Risiko",
    ],
    idealFor: [
      "Produkt-Teams die LLM-Agents an Kunden shippen",
      "Security-Engineers die eine AI-Roadmap übergestülpt bekamen",
      "Startups die auf OpenAI, Anthropic oder lokalen LLMs für regulierte Kunden bauen",
      "Technische Leads die 'sind wir AI-Act-ready?' beantworten müssen",
    ],
    complianceAngle: "Mappt auf EU AI Act Artikel 9 (Risikomanagement), 12 (Aufzeichnungen), 14 (menschliche Aufsicht) und 15 (Genauigkeit & Robustheit). Ship mit AI-Act-Technikdokumentations-Template das du als Annex-IV-Evidence submitten kannst. Berührt auch OWASP Top 10 für LLMs und NIST AI RMF.",
    testimonial: {
      quote: "Wir waren kurz davor einen Agent auf Support-Tickets zu shippen. Hab die Prompt-Injection-Sandbox und die Threat-Modeling-Mission gefahren. Drei Bypasses gefunden die wir in Code-Review nie erwischt hätten. Release verzögert um eine Woche. Hat sich gelohnt.",
      author: "Engineering Lead",
      role: "B2B SaaS, AI-gestützter Support",
    },
    faq: [
      { q: "Lehrt das Jailbreaking-Techniken?", a: "Nein. Das ist strikt defensiv. Wir zeigen wie Angreifer denken — aber jede Mission hat als Ziel eine Mitigation zu shippen, keinen Bypass." },
      { q: "Ist der Content vendor-neutral?", a: "Ja. Die Guardrails funktionieren egal ob du auf OpenAI, Anthropic, Google oder lokal Llama/Qwen/aya bist. Wo vendor-spezifische Features wichtig sind (Moderation-APIs, Function-Calling-Quirks), rufen wir sie explizit." },
      { q: "Was ist mit Agent-Frameworks (LangChain, CrewAI, Agentic SDK)?", a: "Generisch abgedeckt — die Angriffsfläche ist im Pattern, nicht im Framework. Wir inkludieren Beispiele für die verbreitetsten Patterns Stand 2026." },
      { q: "Wie aktuell ist das?", a: "Quartalsweise refreshed. Die CVE-Time-Machine-Integration (wenn sie shipped) generiert automatisch neue Missionen für frische AI-bezogene CVEs — du siehst sie 'hot' markiert im Track." },
    ],
    cert: {
      name: "Defender III — AI Security",
      requirement: "Schließe alle 6 AI-Agent-Security-Missionen ab + bestehe die Live 'verteidige einen Agent für 60 Minuten'-Capstone (Red Team AI Co-Player aktiv).",
      benefits: [
        "W3C Verifiable Credential — AI-Security-Spezialisierung",
        "EU-AI-Act-Technikdokumentations-Template (Annex-IV-Starter)",
        "Jährliche Rezertifizierung für Graduates kostenlos",
        "Listing im öffentlichen ClawGuru-AI-Security-Defenders-Directory (opt-in)",
      ],
    },
    stats: [
      { value: "6+", label: "AI-spezifische Missionen" },
      { value: "EU AI Act", label: "Annex IV ready" },
      { value: "OWASP Top 10", label: "LLM abgedeckt" },
      { value: "Red Team", label: "Live-Adversarial-Modus" },
    ],
    earlyAccessPerks: [
      "Beta-Zugang zum Red Team Troll (adversarial AI Co-Player)",
      "Direkter Input aufs Threat-Modeling-Template — nimm was für deinen Stack funktioniert",
      "Privater Slack-Channel für AI-Security-fokussierte Early Adopters",
      "Erstzugang zum 'AI Act Annex IV Generator' (generiert Compliance-Docs aus deinem Threat-Model)",
    ],
  },

  auth: {
    scenario: "Die Login-Surface ist wo jeder Breach beginnt. Session-Hijacks, JWT alg:none, Confused-Deputy OAuth-Flows, MFA-Bypasses, Passwort-Reset der mehr resettet als gedacht. Wenn dein Produkt User hat, ist dieser Track derjenige der den Incident-Report kurz hält.",
    whyItMatters: "Auth ist der am meisten angegriffene und am wenigsten geliebte Layer in moderner SaaS. Der Track ist strukturiert um die spezifischen Failure-Modes herum die Firmen auf die Titelseite von HackerNews bringen — und die Ein-Absatz-Fixes die sie verhindern.",
    youWillShip: [
      "Eine OAuth-2.1-+-PKCE-Implementation die Confused-Deputy-Angriffen widersteht",
      "JWT-Handling das alg:none, Key-Confusion und Replay ablehnt",
      "Session-Management designt für 2026 (Cookies vs Tokens, sane Defaults)",
      "Ein Passkey/WebAuthn-Rollout den du wirklich für echte User aktivieren kannst",
      "Eine SAML-+-OIDC-SSO-Integration die dem IdP nicht stillschweigend vertraut",
      "Account-Recovery-Flows die keine Backdoor sind",
      "Anti-Automation-Defences kalibriert ohne echte User zu verärgern",
      "Logout das wirklich ausloggt (nicht die halbkaputte Version die die meisten Libs shippen)",
    ],
    idealFor: [
      "Teams die die Login-Surface einer Prod-SaaS besitzen",
      "Security-Engineers die auf einen Pentest-Finding zu Auth reagieren",
      "Startups die sich auf SOC 2 / ISO 27001 vorbereiten",
      "B2B-Produkte die SSO + SCIM für Enterprise-Kunden hinzufügen",
    ],
    complianceAngle: "Adressiert direkt SOC 2 CC6, ISO 27001 A.9 (Zugriffskontrolle), NIS2 Artikel 21 Verschlüsselung + Authentifizierung und DORA Kapitel II ICT-Risikomanagement-Anforderungen zu Identität.",
    testimonial: {
      quote: "Unser Pentest flaggte 6 Auth-Issues. Wir haben den Auth-&-Identity-Track gegen ein Staging-Environment gefahren. Fünf waren direkt abgedeckt. Den sechsten haben wir vor dem nächsten Pentest gefixt. Keine Auditor-Tränen.",
      author: "CTO",
      role: "Fintech, 40-Personen-Engineering",
    },
    faq: [
      { q: "Welchen Stack setzt der Track voraus?", a: "Node/Go/Python Beispiele pro Mission. Pattern ist stack-agnostisch; Code-Samples in den häufigsten Sprachen." },
      { q: "Deckt ihr custom IAM ab?", a: "Wir zeigen wann du KEIN custom IAM bauen solltest. Für die ~5 % Cases die es rechtfertigen, deckt der Track die Design-Fallen ab." },
      { q: "Ist Passkey / WebAuthn abgedeckt?", a: "Ja — dedizierte Mission. Inkl. Rollout-Strategie, Fallback-Flows und wann nicht zu nutzen." },
    ],
    cert: {
      name: "Defender III — Auth & Identity",
      requirement: "10 Missionen + Capstone wo du eine bewusst verwundbare Auth-Implementation auditest und einen Remediation-PR shipst.",
      benefits: [
        "W3C Verifiable Credential — Auth-&-Identity-Spezialisierung",
        "Referenz-Implementations in Node, Go, Python",
        "Early Access zum Auth-Forensics-Tool (dekodiert + bewertet echte Auth-Flows)",
        "Listing im Public-Directory (opt-in)",
      ],
    },
    stats: [
      { value: "10", label: "geplante Missionen" },
      { value: "~3h", label: "geschätzt gesamt" },
      { value: "SOC 2", label: "direkt aligniert" },
      { value: "Waitlist", label: "offen" },
    ],
    earlyAccessPerks: [
      "Erstkohorten-Review deiner echten Auth-Implementation (anonymisiert, auf 20 Teams begrenzt)",
      "Templates für OAuth/JWT/SAML-Integrationen — production-ready",
      "Zugang zur Auth-Forensics Early-Beta (paste deinen Flow, bekomme einen benoteten Report)",
      "Priorität auf Custom-Mission-Requests (z.B. 'wie verteidige ich Magic-Link-Flows?')",
    ],
  },

  "incident-response": {
    scenario: "03:17. Pager. Ein Kunde meldet unmögliche Charges. Logs zeigen eine unbekannte IP die 40 Minuten lang Prod-Daten liest. Du hast eine Stunde bis der CEO ein schriftliches Statement will. Dieser Track ist das 03:17-Reflex-Set.",
    whyItMatters: "Jeder Engineer denkt er kennt IR bis es passiert. Dann ist es Dread, Panik und drei Browser-Tabs mit veralteten Playbooks. Dieser Track installiert die Reflexe: triage ohne Evidence zu zerstören, contain ohne Produktion noch kaputter zu machen, kommunizieren ohne eine regulatorische Büchse der Pandora zu öffnen.",
    youWillShip: [
      "Ein One-Page-IR-Playbook kalibriert zu deiner Teamgröße",
      "Ein Detection-Setup das echtes Signal von normalem Rauschen trennt",
      "Eine forensics-safe Containment-Prozedur (isoliere ohne Evidence zu kontaminieren)",
      "Eine Root-Cause-Methodik die das Post-Mortem überlebt",
      "DSGVO-+-NIS2-Meldefrist-Timing und -Templates",
      "Kunden- und interne Kommunikations-Templates bewertet von echter Comms-Profi",
      "Eine Tabletop-Übung die du wirklich zweimal pro Jahr durchführen wirst",
      "Eine Recovery-Prozedur getestet gegen ein simuliertes Ransomware-Event",
    ],
    idealFor: [
      "On-Call-Engineers in jedem Prod-Team",
      "Security-Team-of-One — kein SOC, trotzdem im Haken",
      "CTOs von 5–50-Personen-Firmen",
      "Alle die je das 'wir sollten einen IR-Plan haben' Gespräch hatten",
    ],
    complianceAngle: "NIS2 Artikel 23 mandatiert Meldung binnen 24h, 72h, und finalen Report binnen 1 Monat. DSGVO Artikel 33 mandatiert 72h. Track ship mit timing-konformen Meldetemplates plus Evidence-Chain die du für beide Regime brauchst.",
    testimonial: {
      quote: "Zwei Monate nach diesem Track hatten wir einen echten Incident. Der CEO fragte ob wir einen IR-Plan hätten. Ich hab das Doc aus Mission 1 geöffnet. Er sagte wörtlich 'das ist das Beste das du dieses Jahr gemacht hast'.",
      author: "Platform Lead",
      role: "Series A SaaS",
    },
    faq: [
      { q: "Deckt das Ransomware spezifisch ab?", a: "Ja — dedizierte Mission inkl. Entscheidungsframework (zahlen vs nicht zahlen), Verhandlungs-Patterns und Recovery-Prozeduren." },
      { q: "Muss ich Security-Spezialist sein?", a: "Nein. Der Track nimmt an dass du ein Senior-Engineer bist der in IR gekippt wurde. Er lehrt die Reflexe, nicht die ganze Disziplin." },
      { q: "Welche Tools setzt das voraus?", a: "Tool-agnostisch. Die Playbooks funktionieren mit jeder Log-Pipeline (Loki, ELK, Datadog, CloudWatch, oder grep). Echte Beispiele pro Tool gezeigt." },
    ],
    cert: {
      name: "Defender III — Incident Response",
      requirement: "10 Missionen + ein Live-Tabletop gegen einen simulierten Incident (Timer aktiviert, Multi-Stakeholder-Rollenspiel).",
      benefits: [
        "W3C Verifiable Credential — Incident Response",
        "Template-Library: Playbooks, Runbooks, Comm-Templates, Meldebriefe",
        "Early Access zum Runbook Generator (beschreibe Incident → bekomme fullgen Runbook)",
        "Prioritätssitz in quartalsweisen Live-Tabletop-Discord-Events",
      ],
    },
    stats: [
      { value: "10", label: "geplante Missionen" },
      { value: "72h", label: "DSGVO-Timing locked" },
      { value: "Tabletop", label: "Live-Sim inklusive" },
      { value: "Waitlist", label: "offen" },
    ],
    earlyAccessPerks: [
      "Direktzugang zu einem ehemaligen SOC-Analysten für 2 Stunden während der Beta",
      "Vote welches Ransomware-Szenario zuerst shipped",
      "Zugang zur privaten IR-Szenarien-Library vor Public-Release",
      "Freie Tickets für den ersten ClawGuru Tabletop Day",
    ],
  },

  compliance: {
    scenario: "Legal hat gerade die NIS2-Umsetzungsfrist weitergeleitet. DORA gilt für deinen Finanz-Partner. Der CFO will EU-AI-Act-Readiness für die nächste Finanzierungsrunde. Du bist ein Engineering-Team, keine Compliance-Abteilung — und du musst trotzdem die technischen Controls shippen die alle drei Regime befriedigen ohne in Papierkram zu ertrinken.",
    whyItMatters: "Die meisten Compliance-Kurse sind von Anwälten für Anwälte geschrieben. Dieser Track ist für Engineers von Menschen die Artikel 21 in YAML übersetzt haben. Du gehst raus und weißt genau welche Config-Change welchen Paragraphen in welchem Audit wert ist.",
    youWillShip: [
      "NIS2 Artikel 21 gemappt auf spezifische Engineering-Controls die du in CI verifizieren kannst",
      "DORA ICT-Risikomanagement-Evidence die du an Partner-Due-Diligence anhängen kannst",
      "EU AI Act Annex IV Technikdokumentations-Template (vorgefüllt für gängige Stacks)",
      "GDPR Artikel 32 konforme Verschlüsselung, Access und Logging-Haltung",
      "Eine Evidence-Collection-Pipeline die auf jedem Deploy auto-updatet",
      "Ein Audit-Readiness-Kit: ein Ordner, alles was der Auditor fragen wird",
      "Regulator-Kommunikations-Templates reviewt von spezialisiertem Anwalt",
      "Ein plain-English Mapping-Dokument das Engineering-Arbeit zu Compliance-Sprache brückt",
    ],
    idealFor: [
      "Technische Leads auf NIS2/DORA/AI-Act-Readiness gesetzt",
      "Engineering Manager:innen die legal text in Sprints übersetzen müssen",
      "Security-Engineers in regulierten Branchen (Fintech, Healthtech, Energy)",
      "CTOs die fragen 'sind wir covered?' und Schweigen zurück bekommen",
    ],
    complianceAngle: "Direkte Abdeckung von NIS2, DORA, EU AI Act, DSGVO Art. 32, ISO 27001. Produzierte Evidence ist cross-framework wiederverwendbar — einmal füllen, in jeder Audit-Antwort referenzieren. Ersetzt keinen Rechtsrat; schärft die Engineering-Seite damit der Anwalt weniger zu streiten hat.",
    testimonial: {
      quote: "Unser DORA-Audit stand um 9 Uhr morgens. Ich hatte keine Ahnung dass wir nach Evidence auf Tech-Layer gefragt werden. Hab den Compliance-Track am Wochenende durchgezogen. Um 8:58 bin ich mit einem Ordner reingelaufen. Der Auditor stellte drei Fragen. Wir haben bestanden.",
      author: "Head of Engineering",
      role: "EU Fintech, DORA-Scope",
    },
    faq: [
      { q: "Ersetzt das einen Anwalt?", a: "Nein. Es deckt die Engineering-Seite ab. Für Auslegung legaler Pflichten oder Audit-Defense willst du weiterhin einen Spezialisten. Dieser Track macht seinen Job günstiger." },
      { q: "Sind die Templates jurisdiktionsspezifisch?", a: "NIS2, DORA und AI Act sind EU-weit. DSGVO-Templates inkludieren BfDI und österreichische DSB-Referenzen. Für andere Jurisdiktionen transferiert die Struktur; lokale Namen unterscheiden sich." },
      { q: "Wie oft wird das aktualisiert?", a: "Jedes Mal wenn ein Regime sich aktualisiert. Durchführungsakte, Delegated Acts, ENISA-Guidance — wir tracken sie und updaten die entsprechenden Missionen." },
    ],
    cert: {
      name: "Defender III — Compliance",
      requirement: "8 Missionen + produziere einen echten oder synthetischen Audit-Response-Ordner. Ordner wird von einem praktizierenden Compliance-Profi geprüft bevor Cert ausgestellt wird.",
      benefits: [
        "W3C Verifiable Credential — Compliance-Track",
        "Vollständige Template-Library — NIS2, DORA, AI Act, DSGVO, ISO 27001",
        "Quartalsweise Regime-Update-E-Mails (strukturiertes Changelog)",
        "Rabatt auf ClawGuru Pro für 12 Monate (Compliance-Grade-Audit-Logging)",
      ],
    },
    stats: [
      { value: "8", label: "geplante Missionen" },
      { value: "4", label: "Regime abgedeckt" },
      { value: "Annex IV", label: "AI-Act-ready" },
      { value: "Waitlist", label: "offen" },
    ],
    earlyAccessPerks: [
      "Erstkohorten-Template-Zugang (Tier-1-Regulator vorgefüllt)",
      "Quartalsweise Office-Hours mit Compliance-Spezialist",
      "Audit-Prep-Checkliste reviewt gegen dein spezifisches Regime",
      "Priorität auf neue Regime-Abdeckung (DORA-Updates, AI-Act-Durchführungsakte)",
    ],
  },

  adversarial: {
    scenario: "Du verteidigst seit Jahren gegen Tutorial-Angreifer. Paper-Angreifer. Statische Payloads. Das nächste Level ist ein Gegner der sich anpasst. Dieser Track pair dich mit einem Live-AI-Red-Team-Troll der aus deinen Defences lernt und neue Payloads pro Runde probiert. Macht keinen Spaß. Macht dich schnell.",
    whyItMatters: "Defensive Drills gegen bekannte Angriffe bringen dich nur so weit. Ein adaptiver Gegner — auch ein schwacher — enttarnt die Reflexe die deine Playbooks nicht abdecken. Der Adversarial-Track pressure-testet genau diese Reflexe in einer sicheren Sandbox.",
    youWillShip: [
      "Ein Reflex-Set für Pattern-Erkennung unter Feuer — was hat sich geändert, was ist neu",
      "Supply-Chain-Attack-Defences kalibriert zu deinem Dependency-Graph",
      "Social-Engineering-Pattern-Detection für die Kommunikationskanäle deines Teams",
      "Ein Ransomware-Kill-Chain-Unterbrechungs-Playbook, getestet gegen Live-Simulator",
      "Insider-Threat-Detection die kein ML-Schlangenöl benötigt",
      "Honeypot- und Canary-Platzierungen die echtes Signal produzieren, nicht Rauschen",
      "Eine AI-aware Defence-Haltung — Deepfakes, Spear-Phishing, Model-Poisoning",
      "Einen Score im Defender-Leaderboard den du wirklich zeigen kannst",
    ],
    idealFor: [
      "Security-Engineers bereit Tutorials hinter sich zu lassen",
      "SOC-Analysten die eine Pressure-Test-Umgebung wollen",
      "Engineering-Leads die sich auf Red-Team-Engagements vorbereiten",
      "Alle die sich nach den anderen Tracks zu bequem fühlten",
    ],
    complianceAngle: "Mappt auf NIS2 kontinuierliche Testing-Anforderungen, DORA Advanced Testing (Threat-Led Penetration Testing Mandat) und ISO 27001 A.8.29. Generiert Evidence-Artefakte die zeigen dass adversarial Testing in regelmäßiger Kadenz durchgeführt wurde.",
    testimonial: {
      quote: "Drei Jahre Security-Arbeit. Ein Nachmittag mit dem Red Team Troll. Zwei Blind-Spots in meinem Detection-Stack gefunden von denen ich Geld gewettet hätte dass ich sie nicht hab. Demütigend.",
      author: "Senior Security Engineer",
      role: "Enterprise, 2000 Mitarbeitende",
    },
    faq: [
      { q: "Wie stark ist der Red Team Troll?", a: "Adaptiv und wird stärker wenn du ihn schlägst. Er wird kein professionelles Red Team matchen — aber er findet die Gaps die ein Profi als erstes finden würde." },
      { q: "Gibt's das Risiko dass die AI echte Exploits generiert?", a: "Nein. Der Troll operiert innerhalb des Simulators und kann keinen neuen offensiven Code erzeugen. Guardrails sind strikt — das Ziel ist Druck, keine Exploit-Erzeugung." },
      { q: "Muss ich den Troll schlagen um zu bestehen?", a: "Ja für den Capstone. Frühere Missionen sind statische Adversary-Patterns die du pausieren und resumen kannst." },
    ],
    cert: {
      name: "Guardian — Adversarial Defense",
      requirement: "10 Missionen + besiege den Red Team Troll auf Level 3 für 60 Minuten unterbrechungsfrei.",
      benefits: [
        "W3C Verifiable Credential — Guardian-Tier",
        "Höchste Sichtbarkeit im ClawGuru-Defender-Directory",
        "Zugang zum privaten Guardian-Channel und Einladungen zu In-Person-Events",
        "Co-Authorship-Credits für öffentlich disclosed Red-Team-Troll-Attack-Patterns die du während der Beta entdeckst",
      ],
    },
    stats: [
      { value: "10", label: "geplante Missionen" },
      { value: "Live AI", label: "adaptives Red Team" },
      { value: "Leaderboard", label: "public, opt-in" },
      { value: "Waitlist", label: "kuratiert" },
    ],
    earlyAccessPerks: [
      "Erstkontakt mit dem Red Team Troll (Beta — deutlich schwächer, deutlich spaßiger)",
      "Beeinflusse das Training des Trolls — deine defensiven Patterns werden inkorporiert",
      "Zugang zum privaten Adversarial-Defense-Research-Channel",
      "Erstanspruch auf den Guardian-Tier-Credential",
    ],
  },

  story: {
    scenario: "Jahr Eins. Fiktive Fintech namens Hodlberg AG. Zwei Engineers. Ein Produkt. Und eine Threat-Surface die mit jeder Funding-Runde um das 10-fache wächst. Du bist der einzige Verteidiger. Die zwölfaktige Kampagne trackt die Firma von Seed zu IPO. Du entscheidest was überlebt.",
    whyItMatters: "Drills lehren Reflexe. Geschichten bauen Intuition. Die Hodlberg-Kampagne ist ein zwölfaktiger Arc wo jede Entscheidung die Security-Haltung einer Firma die von 3 auf 10 000 Menschen wächst neu formt — und Entscheidungen kumulieren. Der einzige Academy-Track der Security-Budgets sich wie Storytelling anfühlen lässt, nicht wie Spreadsheets.",
    youWillShip: [
      "Zwölf spielbare Akte von Seed-Runde bis IPO",
      "Multi-Path-Branching: K8s-Migration, Multi-Tenant-Launch, AI-Produkt — unterschiedliche Akte, unterschiedliche Gegner",
      "Ein Cast von NPCs mit Dialog: der paranoide CTO, die skeptische CFO, der junior DevOps der nur bash kann",
      "Budget-Verhandlungs-Mechaniken — du kämpfst für Security-Spend und lebst mit dem Outcome",
      "Echte Konsequenz-Systeme — schlechte Entscheidungen produzieren Breach-Szenarien aus denen du dich wiederherstellen musst",
      "Persönliche Lore: am Ende bekommst du eine druckbare Firmen-Timeline fürs Portfolio — die Entscheidungen die du getroffen hast, die Breaches die du verhindert hast, die durchgerutscht sind",
    ],
    idealFor: [
      "Alle die lieber narrativ lernen als durch Drill",
      "Gründer:innen die über Security quer durch Firmen-Stadien denken",
      "Engineers die die 'Big Picture' Sicht einer wachsenden Firma wollen",
      "Teams die ein gemeinsames Security-Vokabular über Rollen hinweg wollen",
    ],
    complianceAngle: "Die Kampagne berührt jedes große Regime während die Firma wächst: DSGVO bei Series A, NIS2 bei Series B, SOC 2 bei Enterprise-Expansion, EU AI Act beim AI-Produkt, DORA für Fintech-Lizenz. Ersetzt kein Compliance-Training — produziert aber Intuition wann jedes wichtig wird.",
    testimonial: {
      quote: "Hab das an einem Wochenende durchgezogen. Montag verstand ich warum unser SOC-2-Programm immer stockte — weil ich gerade das Äquivalent in fiktiver Form gelebt hab. Hat uns zwei Monate gespart.",
      author: "Founder-Engineer",
      role: "Pre-Seed Security-First-Startup",
    },
    faq: [
      { q: "Wie lange dauert die volle Kampagne?", a: "Zwölf Akte, ~45–60 Min pro Akt wenn du dich mit Dialog und Branching engagierst. ~10–12 Stunden total über mehrere Abende." },
      { q: "Gibt's einen 'falschen' Pfad?", a: "Ja — aber du kannst jeden Akt replayen. Manche Pfade führen zu Breaches die zu Lern-Momenten werden statt Game-Overs." },
      { q: "Ist das Single-Player?", a: "Launch ist Single-Player. Eine Team-Mode-Variante (wo verschiedene Spieler verschiedene Rollen bei Hodlberg einnehmen — CTO, Ops-Lead, Security-Engineer) ist auf der Roadmap für 2026 Q3." },
    ],
    cert: {
      name: "Guardian — Hodlberg Veteran",
      requirement: "Schließe alle 12 Akte ab. Multi-Path-Completion (explore mindestens 2 Branches) verdient die 'Veteran'-Markierung vs den Default 'Graduate'.",
      benefits: [
        "Guardian-Tier W3C Verifiable Credential",
        "Personalisierte Kampagnen-Timeline — druckbar, shareable",
        "Zugang zu Bonus-Akten 3× pro Jahr (Hodlberg: Year Two, Three, Four)",
        "Credit im Spiel als First-Wave-Founder — gelistet in der Schlusssequenz",
      ],
    },
    stats: [
      { value: "12", label: "Akte" },
      { value: "~12h", label: "volles Playthrough" },
      { value: "Multi-Path", label: "verzweigte Story" },
      { value: "Kohorte", label: "begrenzte erste Welle" },
    ],
    earlyAccessPerks: [
      "Erste 100 Spieler:innen in der Schlusssequenz gecreditet",
      "Direkter Einfluss auf die NPCs (benenne einen Supporting-Character nach Beta-Input)",
      "Zugang zum privaten Hodlberg-Discord für Lore-Diskussion",
      "Erstes Playthrough von Year Two wenn es shipped",
    ],
  },
}

// ─────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────

export function getShowcaseLabels(locale: Locale): ShowcaseLabels {
  return locale === "de" ? LABELS_DE : LABELS_EN
}

export function getTrackDetail(locale: Locale, slug: string): TrackDetail | undefined {
  const map = locale === "de" ? SHOWCASE_DE : SHOWCASE_EN
  return map[slug] ?? SHOWCASE_EN[slug]
}
