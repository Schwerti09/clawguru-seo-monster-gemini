// Curated changelog entries — public-facing summary, not raw git log.
// Add new entries at the TOP. Keep titles user-facing, not implementation
// detail. One line per entry. Dates ISO YYYY-MM-DD.
//
// Surfaced via app/[lang]/changelog/page.tsx (Kimi 2.5 audit Important #5).

export type ChangelogKind = "feature" | "fix" | "improvement" | "ops"

export interface ChangelogEntry {
  date: string                      // ISO YYYY-MM-DD
  kind: ChangelogKind
  titleDe: string
  titleEn: string
  summaryDe?: string
  summaryEn?: string
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    date: "2026-04-25",
    kind: "feature",
    titleDe: "Academy: 4 neue Stack-Hardening-Missionen",
    titleEn: "Academy: 4 new Stack Hardening missions",
    summaryDe: "Docker non-root, Postgres hardening, Reverse-Proxy Rate-Limit + Bot Defense, Backup Restore Drill — alle interaktiv mit Live-Terminal.",
    summaryEn: "Docker non-root, Postgres hardening, reverse-proxy rate-limit + bot defense, backup restore drill — all interactive with live terminal.",
  },
  {
    date: "2026-04-25",
    kind: "improvement",
    titleDe: "Stats-SSoT: einheitliche Runbook-Zahl über alle Seiten",
    titleEn: "Stats SSoT: unified runbook count across all pages",
    summaryDe: "Drift zwischen 4,2M / 3,4M / 1M / 3M auf 25 Seiten beseitigt. Eine zentrale Konstante in lib/stats.ts.",
    summaryEn: "Removed drift between 4.2M / 3.4M / 1M / 3M across 25 pages. One canonical constant in lib/stats.ts.",
  },
  {
    date: "2026-04-25",
    kind: "ops",
    titleDe: "i18n Pipeline B: Ollama-Backend für pick()-Übersetzungen",
    titleEn: "i18n Pipeline B: Ollama backend for pick() translations",
    summaryDe: "Lokales aya-expanse:8b ergänzt Gemini-Pipeline. Auto-Harvest bei jedem Run, Resume-safe Checkpoints, kein Quota-Blocker mehr.",
    summaryEn: "Local aya-expanse:8b complements the Gemini pipeline. Auto-harvest on every run, resume-safe checkpoints, no more quota blocker.",
  },
  {
    date: "2026-04-25",
    kind: "feature",
    titleDe: "Public Status-Seite",
    titleEn: "Public status page",
    summaryDe: "Live-Health unter /status — API, DB, Sitemap, Failover, i18n. Kein Login erforderlich.",
    summaryEn: "Live health at /status — API, DB, sitemap, failover, i18n. No login required.",
  },
  {
    date: "2026-04-24",
    kind: "fix",
    titleDe: "Auto-Failover für Datenbank-Quota-Fehler",
    titleEn: "Auto-failover for database quota errors",
    summaryDe: "Bei Neon-Quota-Exhaustion schwenkt das System automatisch auf eine zweite Neon-Instanz um. Kein manueller Eingriff mehr nötig.",
    summaryEn: "On Neon quota exhaustion the system automatically fails over to a second Neon instance. No more manual intervention.",
  },
  {
    date: "2026-04-24",
    kind: "improvement",
    titleDe: "i18n Pass-2 Polish: Native-Speaker-Qualität für Hot Paths",
    titleEn: "i18n Pass-2 polish: native-speaker quality for hot paths",
    summaryDe: "30 Locales × 462 Hot-Path-Keys (Hero, Pricing, Nav, Footer, FAQ) durch Gemini-Polish-Pass — 13.860 Keys, null Failures.",
    summaryEn: "30 locales × 462 hot-path keys (hero, pricing, nav, footer, FAQ) processed through a Gemini polish pass — 13,860 keys, zero failures.",
  },
  {
    date: "2026-04-24",
    kind: "improvement",
    titleDe: "i18n-Codemod: 6.117 hardcodierte Ternaries in 275 Dateien zu pick()",
    titleEn: "i18n codemod: 6,117 hardcoded ternaries across 275 files to pick()",
    summaryDe: "Alle inline-Übersetzungen laufen jetzt über lib/i18n-pick.ts. Pages in non-DE/EN-Locales zeigen jetzt echte Übersetzungen statt EN-Fallbacks.",
    summaryEn: "All inline translations now route through lib/i18n-pick.ts. Pages in non-DE/EN locales now show real translations instead of EN fallbacks.",
  },
  {
    date: "2026-04-24",
    kind: "feature",
    titleDe: "Autopilot: Retention-Nudge v2 mit Locale-Copy + Cooldown",
    titleEn: "Autopilot: retention nudge v2 with locale copy + cooldown",
    summaryDe: "Personalisierte Reactivation-Nudges nach Checkout-Friction. CTR-Tracking im Admin-Dashboard sichtbar.",
    summaryEn: "Personalised reactivation nudges after checkout friction. CTR tracking visible in the admin dashboard.",
  },
  {
    date: "2026-04-23",
    kind: "feature",
    titleDe: "Academy ∞ Foundations Track: 5 Missionen spielbar",
    titleEn: "Academy ∞ Foundations track: 5 missions playable",
    summaryDe: "Nginx-HSTS, SSH-Hardening, UFW-Firewall, Let's-Encrypt, Misconfig-Hunt. Browser-natives Terminal, keine Anmeldung nötig.",
    summaryEn: "Nginx HSTS, SSH hardening, UFW firewall, Let's Encrypt, misconfig hunt. Browser-native terminal, no signup required.",
  },
  {
    date: "2026-04-23",
    kind: "feature",
    titleDe: "Sentinel AI Tutor + Attack Cinema (Log4Shell)",
    titleEn: "Sentinel AI tutor + Attack Cinema (Log4Shell)",
    summaryDe: "AI-Mentor in der Academy via Ollama (lokal) + Gemini (Fallback). Erste interaktive Breach-Reenactment-Page für Log4Shell mit 3 defensiven Forks.",
    summaryEn: "AI mentor in the academy via Ollama (local) + Gemini (fallback). First interactive breach re-enactment page for Log4Shell with 3 defensive forks.",
  },
  {
    date: "2026-04-22",
    kind: "feature",
    titleDe: "ClawVerse-Expansion: 7 Phasen abgeschlossen",
    titleEn: "ClawVerse expansion: 7 phases shipped",
    summaryDe: "Mycelium, Temporal, Provenance, ClawLink, Neuro, Oracle, Swarm — alle mit voller SEO/E-E-A-T-Behandlung und Schema.org JSON-LD.",
    summaryEn: "Mycelium, Temporal, Provenance, ClawLink, Neuro, Oracle, Swarm — all shipped with full SEO/E-E-A-T treatment and Schema.org JSON-LD.",
  },
]
