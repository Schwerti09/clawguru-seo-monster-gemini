// Academy ∞ — Hub content module
// Co-located content for the Academy hub. DE + EN authored; other locales
// fall back to EN until the aya-expanse translation pipeline fills them in.
//
// Keep this file pure data. No JSX, no side effects — that lets the translator
// script read/write it deterministically per locale block.

import type { Locale } from "@/lib/i18n"

// ─────────────────────────────────────────────────────────────
// Track catalogue — stable IDs, do NOT rename existing slugs
// (beginner / intermediate / advanced keep their URLs for SEO).
// ─────────────────────────────────────────────────────────────

export type TrackStatus = "live" | "preview" | "soon"

export interface Track {
  slug: string
  icon: string
  accent: "lime" | "cyan" | "red" | "violet" | "amber" | "pink" | "blue" | "emerald"
  status: TrackStatus
  missionCount: number
}

// missionCount is the *current playable* count, not aspiration. Keep honest —
// users see this number on the hub. Update it when registering a new mission
// in lib/academy/missions/index.ts.
export const TRACKS: Track[] = [
  { slug: "beginner",           icon: "🟢", accent: "emerald", status: "live",    missionCount: 5  }, // Foundations — 5/5
  { slug: "intermediate",       icon: "🧱", accent: "blue",    status: "live",    missionCount: 4  }, // Stack Hardening — 4 playable, more shipping
  { slug: "advanced",           icon: "🤖", accent: "red",     status: "preview", missionCount: 0  }, // AI Agent Security — content pages live, missions WIP
  { slug: "auth",               icon: "🔐", accent: "cyan",    status: "soon",    missionCount: 10 },
  { slug: "incident-response",  icon: "🛡️", accent: "amber",   status: "soon",    missionCount: 10 },
  { slug: "compliance",         icon: "📋", accent: "violet",  status: "soon",    missionCount: 8  },
  { slug: "adversarial",        icon: "🔴", accent: "pink",    status: "soon",    missionCount: 10 },
  { slug: "story",              icon: "🏴‍☠️", accent: "lime",    status: "soon",    missionCount: 12 },
]

// ─────────────────────────────────────────────────────────────
// Per-locale content. Only DE + EN are authoritative.
// Missing locales resolve to EN via getHubContent().
// ─────────────────────────────────────────────────────────────

export interface TrackCopy {
  title: string
  tagline: string
  audience: string
  bullets: string[]
  badge?: string
}

export interface HubContent {
  meta: {
    title: string
    description: string
  }
  hero: {
    badge: string
    headline: string
    headlineAccent: string
    sub: string
    stats: { langs: string; missions: string; free: string; noSignup: string }
  }
  notice: { label: string; body: string }
  sections: {
    tracksEyebrow: string
    tracksTitle: string
    tracksSub: string
  }
  trackStatusLabel: Record<TrackStatus, string>
  ctaStart: string
  ctaSoon: string
  missionCount: string      // "{n} Missionen" — use {n}
  tracks: Record<string, TrackCopy>
  story: { eyebrow: string; title: string; body: string; cta: string }
  footer: { title: string; sub: string; cta: string }
}

const EN: HubContent = {
  meta: {
    title: "Security Academy ∞ — Play your way to Defender. | ClawGuru",
    description: "The living cyber range for self-hosted security. 8 tracks, 80+ missions, browser-native terminal, proof-of-work certification. Free to start, no signup.",
  },
  hero: {
    badge: "ACADEMY ∞ — LIVING CYBER RANGE",
    headline: "Learn security.",
    headlineAccent: "Play it.",
    sub: "No walls of text. No generic videos. An interactive cyber range that grows with every new CVE — real terminals, real attacks, real defense, in your language.",
    stats: { langs: "50 Languages", missions: "80+ Missions", free: "Free to start", noSignup: "No signup" },
  },
  notice: {
    label: "NOT A PENTEST.",
    body: "This Academy teaches defensive security — how to protect what you run. No attack tooling, no exploits. Only defense.",
  },
  sections: {
    tracksEyebrow: "EIGHT TRACKS",
    tracksTitle: "Pick your path. Every track is a story.",
    tracksSub: "Each track is a sequence of missions — not lessons. You play a Defender. You ship the fix.",
  },
  trackStatusLabel: { live: "LIVE", preview: "EARLY ACCESS", soon: "COMING SOON" },
  ctaStart: "Start →",
  ctaSoon: "Join Waitlist",
  missionCount: "{n} missions",
  tracks: {
    beginner: {
      title: "Foundations",
      tagline: "Zero to Defender I.",
      audience: "Homelab, first server, anyone who says 'I'll do security someday.'",
      bullets: [
        "Understand security headers",
        "Set up TLS/HTTPS correctly",
        "Firewall fundamentals (UFW)",
        "Read a security check",
        "Fix the 3 most common misconfigs",
      ],
      badge: "NO PRIOR KNOWLEDGE",
    },
    intermediate: {
      title: "Stack Hardening",
      tagline: "DevOps-grade defense across your entire stack.",
      audience: "DevOps teams and solo-ops who self-host and want to know they're doing it right.",
      bullets: [
        "Docker security — container isolation",
        "Nginx hardening — headers + rate limiting",
        "Secrets management with Vault",
        "RBAC — who can do what",
        "Incident response — when it burns",
        "NIS2 basics",
        "CI/CD security-check automation",
      ],
      badge: "RECOMMENDED FOR TEAMS",
    },
    advanced: {
      title: "AI Agent Security",
      tagline: "Ship AI agents that can't be hijacked.",
      audience: "Security engineers and AI builders deploying agents in production.",
      bullets: [
        "Prompt injection — how attackers hijack agents",
        "LLM gateway hardening",
        "AI agent sandboxing",
        "Threat modeling for AI systems",
        "OWASP Top 10 for LLMs",
        "EU AI Act technical compliance",
      ],
      badge: "NEW — AI SECURITY",
    },
    auth: {
      title: "Auth & Identity",
      tagline: "OAuth, JWT, SSO, Zero-Trust — built right the first time.",
      audience: "Anyone who owns the login surface of a production system.",
      bullets: [
        "OAuth 2.1 + PKCE the right way",
        "JWT pitfalls — alg:none, key confusion, replay",
        "Session design — cookies vs. tokens in 2026",
        "SSO with SAML + OIDC",
        "MFA / WebAuthn / passkeys",
        "Zero-Trust architecture patterns",
        "Anti-automation without breaking UX",
        "Account recovery without opening attack doors",
        "SCIM + JIT provisioning",
        "Logout that actually logs out",
      ],
    },
    "incident-response": {
      title: "Incident Response",
      tagline: "Detect. Contain. Recover. Without panic.",
      audience: "Ops and SOC — anyone who could be woken at 03:00.",
      bullets: [
        "Detection basics — what a real alert looks like",
        "Triage under pressure",
        "Containment playbooks",
        "Forensics without nuking evidence",
        "Recovery + root cause",
        "Post-mortem culture",
        "Legal notification (GDPR + NIS2)",
        "Comms — customer + internal",
        "Tabletop exercises you'll actually run",
        "Building a one-person IR plan",
      ],
    },
    compliance: {
      title: "Compliance",
      tagline: "NIS2, DORA, EU AI Act, GDPR — the technical side only.",
      audience: "Technical leads who have to translate legal text to engineering work.",
      bullets: [
        "NIS2 mapped to engineering controls",
        "DORA — ICT risk + testing regimes",
        "EU AI Act technical obligations",
        "GDPR Art. 32 — what 'state of the art' really means",
        "Evidence collection at scale",
        "Audit-readiness playbook",
        "ISO 27001 without the consultancy bloat",
        "Regulator communication templates",
      ],
    },
    adversarial: {
      title: "Adversarial Defense",
      tagline: "Play against a live AI attacker. Beat it. Level it up.",
      audience: "Anyone ready to defend under real pressure.",
      bullets: [
        "Introduction to adversarial thinking",
        "Pattern recognition under fire",
        "Supply chain attack defense",
        "Social engineering defense",
        "Ransomware kill-chain interruption",
        "Insider threat detection",
        "AI-powered attack surfaces",
        "Deception — honeypots + canaries",
        "Live exercises against the Red Team Troll",
        "Defender certification challenge",
      ],
    },
    story: {
      title: "The Hodlberg Campaign",
      tagline: "Twelve acts. One company. You decide if it survives.",
      audience: "Everyone who wants to learn through narrative instead of drill.",
      bullets: [
        "Act I  — The Seed Round breach",
        "Act II — First hire, first mistake",
        "Act III — Going multi-tenant",
        "Act IV — The AI product launch",
        "Act V  — Auditor visit",
        "Act VI — The intrusion",
        "Act VII — Recovery and PR",
        "Act VIII — Series B hardening",
        "Act IX — Going global",
        "Act X  — The insider",
        "Act XI — Post-mortem season",
        "Act XII — IPO or die",
      ],
    },
  },
  story: {
    eyebrow: "NARRATIVE MODE",
    title: "Play the Hodlberg Campaign.",
    body: "You are the only security engineer at a fictional fintech. From seed-stage to IPO. Every track you complete reshapes their story — and yours.",
    cta: "Enter the Campaign",
  },
  footer: {
    title: "Rather have our team harden your stack directly?",
    sub: "Fixed-fee engagements from €5,000. Book a Strategy Call.",
    cta: "Book Strategy Call",
  },
}

const DE: HubContent = {
  meta: {
    title: "Security Academy ∞ — Spiel dich zum Defender. | ClawGuru",
    description: "Das lebende Cyber-Range für Self-Hosted Security. 8 Tracks, 80+ Missionen, Browser-Terminal, Proof-of-Work-Zertifikat. Kostenlos starten — kein Signup.",
  },
  hero: {
    badge: "ACADEMY ∞ — LEBENDIGES CYBER-RANGE",
    headline: "Security lernen.",
    headlineAccent: "Spielend.",
    sub: "Keine Textwände. Keine Stock-Videos. Ein interaktives Cyber-Range das mit jedem neuen CVE wächst — echte Terminals, echte Angriffe, echte Verteidigung, in deiner Sprache.",
    stats: { langs: "50 Sprachen", missions: "80+ Missionen", free: "Kostenlos starten", noSignup: "Kein Signup" },
  },
  notice: {
    label: "KEIN PENTEST.",
    body: "Diese Academy lehrt Defensive Security — wie du schützt was du betreibst. Keine Angriffstools, keine Exploits. Nur Defense.",
  },
  sections: {
    tracksEyebrow: "ACHT TRACKS",
    tracksTitle: "Wähl deinen Pfad. Jeder Track ist eine Geschichte.",
    tracksSub: "Jeder Track ist eine Serie von Missionen — keine Lektionen. Du spielst einen Defender. Du shipst den Fix.",
  },
  trackStatusLabel: { live: "LIVE", preview: "EARLY ACCESS", soon: "BALD VERFÜGBAR" },
  ctaStart: "Starten →",
  ctaSoon: "Auf Warteliste",
  missionCount: "{n} Missionen",
  tracks: {
    beginner: {
      title: "Fundamente",
      tagline: "Von Null zum Defender I.",
      audience: "Homelab, erster Server, alle die sagen 'Security mach ich später'.",
      bullets: [
        "Security-Headers verstehen",
        "TLS/HTTPS richtig aufsetzen",
        "Firewall-Grundlagen (UFW)",
        "Einen Security Check lesen",
        "Die 3 häufigsten Misconfigs fixen",
      ],
      badge: "KEIN VORWISSEN NÖTIG",
    },
    intermediate: {
      title: "Stack Hardening",
      tagline: "DevOps-reife Verteidigung über deinen kompletten Stack.",
      audience: "DevOps-Teams und Solo-Ops die self-hosten und wissen wollen ob sie es richtig machen.",
      bullets: [
        "Docker Security — Container-Isolation",
        "Nginx Hardening — Headers + Rate Limiting",
        "Secrets Management mit Vault",
        "RBAC — wer darf was",
        "Incident Response — wenn's brennt",
        "NIS2 Basics",
        "CI/CD Security-Check-Automation",
      ],
      badge: "EMPFOHLEN FÜR TEAMS",
    },
    advanced: {
      title: "AI Agent Security",
      tagline: "AI-Agents shippen die nicht gekapert werden können.",
      audience: "Security-Engineers und AI-Builder die Agents produktiv einsetzen.",
      bullets: [
        "Prompt Injection — wie Angreifer Agents kapern",
        "LLM Gateway Hardening",
        "AI Agent Sandboxing",
        "Threat Modeling für AI-Systeme",
        "OWASP Top 10 für LLMs",
        "EU AI Act — technische Compliance",
      ],
      badge: "NEU — AI SECURITY",
    },
    auth: {
      title: "Auth & Identität",
      tagline: "OAuth, JWT, SSO, Zero-Trust — beim ersten Mal richtig gebaut.",
      audience: "Alle die die Login-Surface eines Prod-Systems verantworten.",
      bullets: [
        "OAuth 2.1 + PKCE richtig implementiert",
        "JWT-Fallen — alg:none, Key-Confusion, Replay",
        "Session-Design — Cookies vs. Tokens 2026",
        "SSO mit SAML + OIDC",
        "MFA / WebAuthn / Passkeys",
        "Zero-Trust-Architektur-Patterns",
        "Anti-Automation ohne UX-Schaden",
        "Account Recovery ohne neue Angriffsfläche",
        "SCIM + JIT Provisioning",
        "Logout der wirklich ausloggt",
      ],
    },
    "incident-response": {
      title: "Incident Response",
      tagline: "Erkennen. Eindämmen. Wiederherstellen. Ohne Panik.",
      audience: "Ops und SOC — alle die um 03:00 geweckt werden könnten.",
      bullets: [
        "Detection Basics — wie echte Alerts aussehen",
        "Triage unter Druck",
        "Containment-Playbooks",
        "Forensik ohne Beweise zu zerstören",
        "Recovery + Root Cause",
        "Post-Mortem-Kultur",
        "Meldepflichten (DSGVO + NIS2)",
        "Kommunikation — Kunde + intern",
        "Tabletop-Übungen die du wirklich machst",
        "Ein-Personen-IR-Plan",
      ],
    },
    compliance: {
      title: "Compliance",
      tagline: "NIS2, DORA, EU AI Act, DSGVO — nur die technische Seite.",
      audience: "Technische Leads die aus Paragraphen Engineering-Arbeit übersetzen müssen.",
      bullets: [
        "NIS2 übersetzt in Engineering-Controls",
        "DORA — ICT-Risk + Testing-Regime",
        "EU AI Act — technische Pflichten",
        "DSGVO Art. 32 — was 'Stand der Technik' wirklich heißt",
        "Evidence-Collection im Skalieren",
        "Audit-Readiness-Playbook",
        "ISO 27001 ohne Beratungs-Aufgussbrühe",
        "Regulator-Kommunikations-Templates",
      ],
    },
    adversarial: {
      title: "Adversarial Defense",
      tagline: "Spiel gegen einen lebenden AI-Angreifer. Schlag ihn. Level ihn hoch.",
      audience: "Alle die bereit sind unter echtem Druck zu verteidigen.",
      bullets: [
        "Einführung ins adversarial Denken",
        "Pattern-Erkennung unter Feuer",
        "Supply-Chain-Attack-Defense",
        "Social Engineering abwehren",
        "Ransomware — Kill-Chain unterbrechen",
        "Insider-Threats erkennen",
        "AI-powered Angriffs-Oberflächen",
        "Täuschung — Honeypots + Canaries",
        "Live-Duelle gegen den Red Team Troll",
        "Defender-Zertifizierungs-Challenge",
      ],
    },
    story: {
      title: "Die Hodlberg-Kampagne",
      tagline: "Zwölf Akte. Eine Firma. Du entscheidest ob sie überlebt.",
      audience: "Alle die lieber narrativ lernen als durch Drill.",
      bullets: [
        "Akt I   — Der Seed-Round-Breach",
        "Akt II  — Erster Hire, erster Fehler",
        "Akt III — Multi-Tenant werden",
        "Akt IV  — Das AI-Produkt-Launch",
        "Akt V   — Auditor-Besuch",
        "Akt VI  — Die Intrusion",
        "Akt VII — Recovery und PR",
        "Akt VIII — Series-B-Hardening",
        "Akt IX  — Global werden",
        "Akt X   — Der Insider",
        "Akt XI  — Post-Mortem-Saison",
        "Akt XII — IPO or die",
      ],
    },
  },
  story: {
    eyebrow: "NARRATIVE MODE",
    title: "Spiel die Hodlberg-Kampagne.",
    body: "Du bist die einzige Security-Engineerin einer fiktiven FinTech. Vom Seed-Stage zum IPO. Jeder Track den du abschließt formt ihre Geschichte — und deine.",
    cta: "Kampagne starten",
  },
  footer: {
    title: "Lieber direkt unser Team deinen Stack härten lassen?",
    sub: "Fixed-Fee-Engagements ab 5.000 €. Strategy Call buchen.",
    cta: "Strategy Call buchen",
  },
}

// Locale → content map. Only DE + EN authored; rest resolves to EN.
// When aya-expanse pipeline populates more locales, add entries here.
const CONTENT: Partial<Record<Locale, HubContent>> = {
  de: DE,
  en: EN,
}

export function getHubContent(locale: Locale): HubContent {
  return CONTENT[locale] ?? EN
}
