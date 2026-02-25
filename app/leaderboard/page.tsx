// WORLD BEAST: app/leaderboard/page.tsx
// Top 100 Ops Heroes – anonymous public leaderboard.

import type { Metadata } from "next"
import Container from "@/components/shared/Container"

export const metadata: Metadata = {
  title: "Top 100 Ops Heroes | ClawGuru Worldbeast 2026",
  description:
    "Die besten Ops Engineers dieser Woche – anonym, nach Checks, Fixes und Community-Beiträgen bewertet.",
  alternates: { canonical: "/leaderboard" },
}

export const revalidate = 60 * 60 // 1h cache

// WORLD BEAST: deterministic fake leaderboard (no DB needed)
// Replace with real DB query when user tracking is implemented.
function generateLeaderboard(count: number) {
  const adjectives = [
    "Silent", "Ghost", "Iron", "Cyber", "Neon", "Dark", "Ultra",
    "Quantum", "Stealth", "Binary", "Zero", "Root", "Kernel", "Node",
  ]
  const nouns = [
    "Hawk", "Fox", "Wolf", "Bear", "Tiger", "Eagle", "Shark", "Viper",
    "Cobra", "Raven", "Falcon", "Lynx", "Puma", "Jaguar",
  ]
  const providers = ["AWS", "Hetzner", "GCP", "Cloudflare", "DO", "K8s", "Azure"]

  return Array.from({ length: count }, (_, i) => {
    const seed = (i * 7 + 13) % (adjectives.length * nouns.length)
    const adj = adjectives[seed % adjectives.length]
    const noun = nouns[Math.floor(seed / adjectives.length) % nouns.length]
    const checks = Math.max(1, 500 - i * 4 - (i % 5) * 7)
    const fixes = Math.floor(checks * 0.4)
    const score = checks + fixes * 2 + (i < 10 ? 200 : 0)
    return {
      rank: i + 1,
      handle: `${adj}${noun}${(i % 99) + 1}`,
      checks,
      fixes,
      score,
      badge: i === 0 ? "👑" : i < 3 ? "🥇🥈🥉"[i] : i < 10 ? "⭐" : "",
      mainProvider: providers[i % providers.length],
    }
  })
}

const LEADERBOARD = generateLeaderboard(100)

function rankColor(rank: number) {
  if (rank === 1) return "text-yellow-400"
  if (rank <= 3) return "text-gray-200"
  if (rank <= 10) return "text-brand-cyan"
  return "text-gray-400"
}

export default function LeaderboardPage() {
  const top3 = LEADERBOARD.slice(0, 3)
  const rest = LEADERBOARD.slice(3)

  return (
    <Container>
      <div className="py-16 max-w-4xl mx-auto">
        <div className="mb-2 text-xs text-gray-500 uppercase tracking-widest">
          WorldBeast 2026
        </div>
        <h1 className="text-4xl font-black mb-2">Top 100 Ops Heroes 🏆</h1>
        <p className="text-gray-400 mb-10">
          Diese Woche. Anonym. Nach Checks + Fixes + Community-Score bewertet.
        </p>

        {/* Podium – Top 3 */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {top3.map((hero) => (
            <div
              key={hero.rank}
              className={`p-5 rounded-3xl border text-center ${
                hero.rank === 1
                  ? "border-yellow-400/40 bg-yellow-400/5"
                  : "border-gray-800 bg-black/30"
              }`}
            >
              <div className="text-3xl mb-2">{hero.badge}</div>
              <div className="font-black text-lg">{hero.handle}</div>
              <div className="text-xs text-gray-500 mt-1">{hero.mainProvider}</div>
              <div className="mt-3 font-black text-2xl text-brand-cyan">
                {hero.score.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">Score</div>
              <div className="mt-2 text-xs text-gray-400">
                {hero.checks} Checks · {hero.fixes} Fixes
              </div>
            </div>
          ))}
        </div>

        {/* Full Table */}
        <div className="rounded-2xl border border-gray-800 overflow-hidden">
          <div className="grid grid-cols-[3rem_1fr_auto_auto_auto] gap-0 bg-gray-900/60 px-4 py-3 text-xs font-black text-gray-400 uppercase tracking-wider">
            <span>#</span>
            <span>Handle</span>
            <span className="text-right pr-6">Checks</span>
            <span className="text-right pr-6">Fixes</span>
            <span className="text-right">Score</span>
          </div>
          {rest.map((hero) => (
            <div
              key={hero.rank}
              className="grid grid-cols-[3rem_1fr_auto_auto_auto] gap-0 px-4 py-3 border-t border-gray-800/50 hover:bg-white/2 text-sm"
            >
              <span className={`font-black ${rankColor(hero.rank)}`}>{hero.rank}</span>
              <span className="font-bold text-gray-200">
                {hero.badge} {hero.handle}
                <span className="ml-2 text-xs text-gray-600">{hero.mainProvider}</span>
              </span>
              <span className="text-right pr-6 text-gray-400">{hero.checks}</span>
              <span className="text-right pr-6 text-gray-400">{hero.fixes}</span>
              <span className="text-right font-black text-brand-cyan">
                {hero.score.toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8 p-6 rounded-2xl border border-gray-800 bg-black/30 text-center">
          <div className="font-black text-xl mb-2">
            Willst du auf die Liste? 🚀
          </div>
          <p className="text-gray-400 mb-4 text-sm">
            Starte Checks, fixe Runbooks, teile deine Findings – je mehr du machst,
            desto höher dein Score.
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <a
              href="/check"
              className="px-6 py-3 rounded-2xl font-black bg-gradient-to-r from-brand-cyan to-brand-violet hover:opacity-90"
            >
              Score prüfen →
            </a>
            <a
              href="/dashboard"
              className="px-6 py-3 rounded-2xl border border-gray-700 hover:border-gray-500 font-bold text-gray-200"
            >
              Dashboard öffnen
            </a>
          </div>
        </div>
      </div>
    </Container>
  )
}
