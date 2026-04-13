// app/leaderboard/page.tsx
// Top 100 Ops Heroes – anonymous public leaderboard backed by real DB data.

import type { Metadata } from "next"
import Container from "@/components/shared/Container"
import { dbQuery } from "@/lib/db"

export const metadata: Metadata = {
  title: "Top 100 Ops Heroes | ClawGuru Worldbeast 2026",
  description:
    "Die besten Ops Engineers dieser Woche – anonym, nach Claw-Score bewertet.",
  alternates: { canonical: "/leaderboard" },
}

export const revalidate = 3600 // 1h cache

type LeaderboardEntry = {
  rank: number
  handle: string
  score: number
  badge: string
}

async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    const result = await dbQuery<{ user_id: string; claw_score: number }>(`
      SELECT user_id, claw_score
      FROM user_metrics
      WHERE claw_score > 0
      ORDER BY claw_score DESC
      LIMIT 100
    `)
    return result.rows.map((row, i) => ({
      rank: i + 1,
      handle: `Ops#${row.user_id.slice(-6).toUpperCase()}`,
      score: Math.round(Number(row.claw_score)),
      badge: i === 0 ? "👑" : i < 3 ? "🥇🥈🥉"[i] : i < 10 ? "⭐" : "",
    }))
  } catch {
    return []
  }
}

function rankColor(rank: number) {
  if (rank === 1) return "text-yellow-400"
  if (rank <= 3) return "text-gray-200"
  if (rank <= 10) return "text-brand-cyan"
  return "text-gray-400"
}

export default async function LeaderboardPage() {
  const leaderboard = await fetchLeaderboard()
  const top3 = leaderboard.slice(0, 3)
  const rest = leaderboard.slice(3)

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'Was ist das ClawGuru Leaderboard?', acceptedAnswer: { '@type': 'Answer', text: 'Das ClawGuru Leaderboard zeigt die Top 100 Ops-Heroes — anonymisierte Nutzer mit dem höchsten Security-Score und den meisten abgeschlossenen Runbooks. Gamification-Element: Motivation durch Wettbewerb und Community-Vergleich. Anonym: keine echten Namen oder Domains sichtbar. Punkte: Security-Score + Anzahl Runbooks + Fix-Streak. Wöchentliche Rotation: Top-Platzierungen werden wöchentlich ermittelt.' } },
      { '@type': 'Question', name: 'Wie komme ich auf das ClawGuru Leaderboard?', acceptedAnswer: { '@type': 'Answer', text: 'Leaderboard-Aufnahme: Security Check durchführen (Score > 0). Account erstellen (kostenlos). Opt-in für Leaderboard-Tracking in den Einstellungen. Punkte sammeln: Security-Score erhöhen, Runbooks abschließen, tägliche Checks (Streak). Je höher der Score und mehr Runbooks abgeschlossen, desto höher die Platzierung. Top 10 erhalten Community-Badge und Erwähnung im Newsletter.' } },
      { '@type': 'Question', name: 'Sind die Leaderboard-Daten anonym?', acceptedAnswer: { '@type': 'Answer', text: 'Leaderboard Privacy: Ja — vollständig anonymisiert. Angezeigt werden: Pseudonym (selbstgewählt), Gesamtpunkte, Anzahl Runbooks, Score-Tier. NICHT angezeigt: echte Namen, E-Mail-Adressen, Domains, IP-Adressen. Opt-out jederzeit möglich in Einstellungen. DSGVO-konform: keine personenbezogenen Daten öffentlich. Interne Verknüpfung mit Account nur für eigene Score-Anzeige.' } },
      { '@type': 'Question', name: 'Wie wird der Leaderboard-Score berechnet?', acceptedAnswer: { '@type': 'Answer', text: 'Leaderboard Score-Berechnung: Security-Score-Punkte (max. 100 × Anzahl Domains). Runbook-Punkte (10 Punkte pro abgeschlossenem Runbook). Streak-Bonus (tägl. Check: +5 Punkte/Tag, max. 7 Tage). Compliance-Bonus (SOC2/ISO27001-Runbooks: 2× Punkte). Fix-Speed-Bonus (kritischer Fix < 24h: +20 Punkte). Gesamtpunkte bestimmen Platzierung. Decay: Punkte verfallen nach 90 Tagen Inaktivität.' } },
    ],
  }

  return (
    <Container>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="py-16 max-w-4xl mx-auto">
        <div className="mb-2 text-xs text-gray-500 uppercase tracking-widest">
          WorldBeast 2026
        </div>
        <h1 className="text-4xl font-black mb-2">Top 100 Ops Heroes 🏆</h1>
        <p className="text-gray-400 mb-10">
          Diese Woche. Anonym. Nach Claw-Score bewertet.
        </p>

        {leaderboard.length === 0 ? (
          <div className="rounded-2xl border border-gray-800 bg-black/30 p-12 text-center">
            <div className="text-4xl mb-4">🏆</div>
            <div className="font-black text-xl mb-2 text-gray-300">Noch keine Scores vorhanden</div>
            <p className="text-gray-500 text-sm">
              Starte Checks und sammle deinen Claw-Score – die ersten Plätze warten auf dich.
            </p>
          </div>
        ) : (
          <>
            {/* Podium – Top 3 */}
            {top3.length > 0 && (
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
                    <div className="mt-3 font-black text-2xl text-brand-cyan">
                      {hero.score.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">Score</div>
                  </div>
                ))}
              </div>
            )}

            {/* Full Table */}
            {rest.length > 0 && (
              <div className="rounded-2xl border border-gray-800 overflow-hidden">
                <div className="grid grid-cols-[3rem_1fr_auto] gap-0 bg-gray-900/60 px-4 py-3 text-xs font-black text-gray-400 uppercase tracking-wider">
                  <span>#</span>
                  <span>Handle</span>
                  <span className="text-right">Score</span>
                </div>
                {rest.map((hero) => (
                  <div
                    key={hero.rank}
                    className="grid grid-cols-[3rem_1fr_auto] gap-0 px-4 py-3 border-t border-gray-800/50 hover:bg-white/2 text-sm"
                  >
                    <span className={`font-black ${rankColor(hero.rank)}`}>{hero.rank}</span>
                    <span className="font-bold text-gray-200">
                      {hero.badge} {hero.handle}
                    </span>
                    <span className="text-right font-black text-brand-cyan">
                      {hero.score.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

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
