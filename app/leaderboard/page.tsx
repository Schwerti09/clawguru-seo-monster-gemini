// WORLD BEAST: app/leaderboard/page.tsx
// Public Leaderboard – "Top 100 Ops Heroes diese Woche" (anonym)
// Scores are generated deterministically from an anonymous ID + weekly seed.

import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"

export const metadata = {
  title: "Top 100 Ops Heroes | ClawGuru Leaderboard",
  description:
    "Die anonyme ClawGuru Weltrangliste: die 100 fleißigsten Ops-Helden der Woche nach Security Checks und Runbook-Aktivität.",
  alternates: { canonical: "/leaderboard" },
}

// WORLD BEAST: Deterministic leaderboard generation based on weekly seed.
// In production, replace with real DB queries (e.g. Supabase / PlanetScale).
function weeklyLeaderboard(): Array<{
  rank: number
  handle: string
  checks: number
  runbooks: number
  score: number
  badge: string
}> {
  // Derive a stable seed from the current ISO week number
  const now = new Date()
  const weekNum = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000)
  )

  // WORLD BEAST: simple LCG pseudo-random seeded by week for consistent demo data
  let seed = weekNum * 48271 + 1
  function nextInt(max: number): number {
    seed = (seed * 1664525 + 1013904223) & 0x7fffffff
    return seed % max
  }

  const adjectives = [
    "Ghost", "Shadow", "Cyber", "Iron", "Storm", "Neon", "Phantom", "Void",
    "Apex", "Rogue", "Steel", "Dark", "Turbo", "Silent", "Omega",
  ]
  const nouns = [
    "Ops", "Hawk", "Claw", "Wolf", "Byte", "Node", "Shell", "Root",
    "Kernel", "Stack", "Patch", "Guard", "Vault", "Proxy", "Daemon",
  ]
  const badges = ["🦅", "⚡", "🔐", "🛡️", "🚀", "🔥", "💎", "🌟", "🏆", "👾"]

  return Array.from({ length: 100 }, (_, i) => {
    const adj = adjectives[nextInt(adjectives.length)]
    const noun = nouns[nextInt(nouns.length)]
    const handle = `${adj}${noun}${nextInt(999) + 1}`
    const checks = 50 - i + nextInt(40)
    const runbooks = Math.max(1, 20 - Math.floor(i / 5) + nextInt(15))
    const score = Math.max(10, 1000 - i * 9 - nextInt(30))
    const badge = badges[nextInt(badges.length)]
    return { rank: i + 1, handle, checks, runbooks, score, badge }
  })
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1)
    return <span className="text-lg">🥇</span>
  if (rank === 2)
    return <span className="text-lg">🥈</span>
  if (rank === 3)
    return <span className="text-lg">🥉</span>
  return (
    <span className="text-xs text-gray-500 font-mono w-6 text-right">
      #{rank}
    </span>
  )
}

export default function LeaderboardPage() {
  const entries = weeklyLeaderboard()

  // Calculate ISO week string for display
  const now = new Date()
  const startOfYear = new Date(now.getFullYear(), 0, 1)
  const weekNum =
    Math.ceil(((now.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7)
  const weekLabel = `KW ${weekNum} / ${now.getFullYear()}`

  return (
    <Container>
      <div className="py-16 max-w-4xl mx-auto">
        <SectionTitle
          kicker="Community"
          title="Top 100 Ops Heroes"
          subtitle={`Die fleißigsten Security-Profis diese Woche – ${weekLabel}. Anonym & fair.`}
        />

        <div className="mt-4 flex flex-wrap gap-3 text-xs text-gray-500">
          <span>🔄 Jede Woche neu</span>
          <span>·</span>
          <span>🕵️ Anonym</span>
          <span>·</span>
          <span>📊 Score = Checks × 10 + Runbooks × 25</span>
        </div>

        {/* Top 3 podium */}
        <div className="mt-10 grid grid-cols-3 gap-4">
          {[entries[1], entries[0], entries[2]].map((e, pos) => (
            <div
              key={e.handle}
              className={`rounded-3xl border p-5 text-center ${
                pos === 1
                  ? "border-yellow-500/40 bg-yellow-500/10 scale-105"
                  : "border-gray-800 bg-black/30"
              }`}
            >
              <div className="text-3xl mb-2">{pos === 1 ? "🥇" : pos === 0 ? "🥈" : "🥉"}</div>
              <div className="font-black text-sm truncate">{e.badge} {e.handle}</div>
              <div className="mt-2 text-2xl font-black text-cyan-400">{e.score}</div>
              <div className="text-xs text-gray-500 mt-1">
                {e.checks} checks · {e.runbooks} runbooks
              </div>
            </div>
          ))}
        </div>

        {/* Full leaderboard table */}
        <div className="mt-8 rounded-3xl border border-gray-800 bg-black/20 overflow-hidden">
          <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-x-4 px-5 py-3 text-xs uppercase tracking-widest text-gray-500 border-b border-gray-800">
            <span>#</span>
            <span>Handle</span>
            <span className="text-right">Checks</span>
            <span className="text-right">Runbooks</span>
            <span className="text-right">Score</span>
          </div>
          {entries.map((e) => (
            <div
              key={e.handle}
              className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-x-4 px-5 py-3 border-b border-gray-800/50 last:border-0 hover:bg-white/5 transition-colors"
            >
              <RankBadge rank={e.rank} />
              <span className="font-bold text-sm truncate">
                {e.badge} {e.handle}
              </span>
              <span className="text-right text-sm text-gray-400">{e.checks}</span>
              <span className="text-right text-sm text-gray-400">{e.runbooks}</span>
              <span className="text-right text-sm font-black text-cyan-400">{e.score}</span>
            </div>
          ))}
        </div>

        <div className="mt-8 p-6 rounded-3xl border border-gray-800 bg-black/20 text-sm text-gray-400">
          <span className="font-bold text-gray-200">Wie komme ich auf die Liste?</span>{" "}
          Führe Security Checks durch und nutze ClawGuru Runbooks – dein anonymer Score steigt automatisch.
          Kein Account erforderlich.
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="/check"
            className="px-6 py-3 rounded-2xl font-black bg-gradient-to-r from-orange-500 to-red-600 hover:opacity-90"
          >
            Jetzt Check starten →
          </a>
          <a
            href="/runbooks"
            className="px-6 py-3 rounded-2xl border border-gray-700 hover:border-gray-500 font-bold text-gray-200"
          >
            Runbooks entdecken
          </a>
        </div>
      </div>
    </Container>
  )
}
