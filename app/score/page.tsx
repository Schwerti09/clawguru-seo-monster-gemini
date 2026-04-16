import Container from "@/components/shared/Container"
import ShareScore from "@/components/shared/ShareScore"

export default async function ScorePage(
  props: { searchParams?: Record<string, string | string[] | undefined> }
) {
  const searchParams = props.searchParams;
  const target = typeof searchParams?.target === "string" ? searchParams?.target : "unknown"
  const scoreRaw = typeof searchParams?.score === "string" ? Number(searchParams?.score) : 0
  const score = Number.isFinite(scoreRaw) ? Math.max(0, Math.min(100, Math.round(scoreRaw))) : 0
  const vulnerable = typeof searchParams?.vulnerable === "string" ? searchParams?.vulnerable === "1" : false
  const needsUpgrade = score < 70

  const params = new URLSearchParams({
    target,
    score: String(score),
    vulnerable: vulnerable ? "1" : "0"
  })

  const badgeUrl = `/api/score-badge?${params.toString()}`
  const copilotSeed = encodeURIComponent(
    vulnerable
      ? `Ich habe einen Score von ${score}/100 für ${target} bekommen (Risiko erhöht). Gib mir ein Notfall-Runbook.`
      : `Ich habe einen Score von ${score}/100 für ${target} bekommen. Wie mache ich daraus 95+?`
  )

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'Was bedeutet mein ClawGuru Security Score?', acceptedAnswer: { '@type': 'Answer', text: 'ClawGuru Security Score 0-100: 90-100 (Ausgezeichnet): Top-Tier Security-Hygiene, alle kritischen Headers gesetzt, TLS optimal konfiguriert. 75-89 (Gut): solide Basis, einige optionale Verbesserungen möglich. 60-74 (Verbesserungsbedarf): kritische Punkte fehlen, Angriffsfläche erhöht. Unter 60 (Kritisch): wichtige Security-Controls fehlen, sofortiger Handlungsbedarf. Score ist Hygiene-Indikator, kein Pentest-Ersatz.' } },
      { '@type': 'Question', name: 'Wie verbessere ich meinen Security Score schnell?', acceptedAnswer: { '@type': 'Answer', text: 'Score schnell verbessern: Quick Wins (je +5-15 Punkte): HSTS Header setzen (Strict-Transport-Security). Content-Security-Policy hinzufügen. X-Frame-Options: DENY setzen. X-Content-Type-Options: nosniff. Referrer-Policy konfigurieren. TLS auf 1.3 upgraden. HTTP→HTTPS Redirect erzwingen. Jeder dieser Punkte hat ein dediziertes ClawGuru Runbook. Nach Fixes: sofort Re-Check durchführen.' } },
      { '@type': 'Question', name: 'Wie teile ich meinen Security Score?', acceptedAnswer: { '@type': 'Answer', text: 'ClawGuru Score teilen: Direkt-Link dieser Seite mit Score und Domain-Parameter. Badge für README oder Website: ClawGuru bietet einbettbare Score-Badges. LinkedIn/Twitter: Score-Screenshot oder Share-Link. Kunden-Reports: Pro-Plan exportiert PDF-Reports mit Score-Verlauf. Warum teilen? Zeigt Verantwortung gegenüber Security — positives Signal für Kunden und Partner.' } },
      { '@type': 'Question', name: 'Verändert sich mein Score über die Zeit?', acceptedAnswer: { '@type': 'Answer', text: 'Score-Dynamik: Score kann sich durch Infra-Änderungen verschlechtern (neues Deploy, Config-Änderung entfernt Header). Kontinuierliches Monitoring (Pro-Plan) erkennt Score-Verschlechterungen sofort. Trend-Analyse: historische Score-Daten zeigen ob Hygiene besser oder schlechter wird. Empfehlung: Score in CI/CD-Pipeline als Gate einbauen (schlägt fehl wenn unter Threshold).' } },
    ],
  }

  return (
    <Container>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="py-16">
        <h1 className="text-4xl md:text-5xl font-black mb-4">Dein Claw Security Score</h1>
        <p className="text-gray-300 text-lg mb-8">
          Teilbar, zitierbar, nervig gut. (Und ja: es ist eine Heuristik, kein Audit.)
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="rounded-3xl overflow-hidden border border-gray-800 bg-black/30">
            <div className="relative w-full aspect-[16/9]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={badgeUrl}
                alt="Claw Security Score Badge"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <div className="space-y-5">
            <div className="p-6 rounded-3xl border border-gray-800 bg-black/30">
              <div className="text-sm text-gray-400 mb-2">Target</div>
              <div className="font-mono text-gray-100 break-all">{target}</div>

              <div className="mt-4 text-sm text-gray-400 mb-2">Score</div>
              <div className="text-5xl font-black">{score}/100</div>

              <div className="mt-5">
                <ShareScore target={target} score={score} vulnerable={vulnerable} />
              </div>

              <div className="mt-4 text-xs text-gray-500">
                Hinweis: Der Score ist eine heuristische Risiko-Einschätzung (kein Portscan/kein Audit).
              </div>
            </div>

            <div className="p-6 rounded-3xl border border-gray-800 bg-black/30">
              <div className="text-lg font-bold mb-2">Nächster Schritt</div>
              <p className="text-gray-300 mb-4">
                Lass den Copilot daraus ein Runbook bauen – konkret für dein Setup.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={`/copilot?q=${copilotSeed}`}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 font-bold text-white transition-all"
                >
                  Copilot öffnen →
                </a>
                <a
                  href={badgeUrl}
                  download
                  className="px-5 py-3 rounded-2xl border border-gray-700 hover:border-gray-500 font-bold text-gray-200 transition-colors"
                >
                  SVG downloaden
                </a>
              </div>
            </div>

            {needsUpgrade && (
              <div className="p-6 rounded-3xl border border-amber-700/60 bg-amber-950/20">
                <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-amber-300 mb-2">
                  Score unter 70
                </div>
                <div className="text-lg font-bold text-amber-100 mb-2">Voller Report + Monitoring aktivieren</div>
                <p className="text-sm text-amber-100/80 mb-4">
                  Dein Score zeigt echte Lücken. Pro liefert Full Remediation Reports, Priorisierung,
                  Monitoring & Alerts – damit der Score dauerhaft steigt.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="/pricing"
                    className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 font-bold text-black transition-all"
                  >
                    Pro freischalten (49€/Monat) →
                  </a>
                  <a
                    href="/daypass"
                    className="px-5 py-3 rounded-2xl border border-amber-500/60 text-amber-200 hover:text-amber-100 hover:border-amber-400 font-bold transition-colors"
                  >
                    Day Pass testen (9€ / 24h)
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
  )
}
