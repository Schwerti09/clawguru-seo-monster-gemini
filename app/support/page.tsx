import type { Metadata } from "next"
import Container from "@/components/shared/Container"
import { ClawguruAvatar } from "@/components/ui/ClawguruAvatar"
import { LEGAL_INFO } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Kontakt & Support • ClawGuru",
  description: "Sprich mit ClawGuru Support – schnell, menschlich, verrückt gut. Notfall? Sofort zu Emergency. Oder starte Managed Service.",
  alternates: { canonical: "/support" },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Wie erreiche ich den ClawGuru Support?', acceptedAnswer: { '@type': 'Answer', text: 'ClawGuru Support-Kanäle: Support-Formular auf dieser Seite (schnellster Weg). E-Mail: support@clawguru.org. Security-Disclosure: security@clawguru.org. Antwortzeiten: Pro-Plan < 4h (Werktage), Free-Plan < 24h. Notfall (Produktions-Incident): im Formular "Emergency" auswählen — wird priorisiert behandelt. Enterprise-Kunden: dedizierter Account Manager mit direktem Kontakt.' } },
    { '@type': 'Question', name: 'Was tue ich bei einem Sicherheits-Notfall?', acceptedAnswer: { '@type': 'Answer', text: 'Security-Notfall bei ClawGuru: 1) Support-Formular mit Priorität "Emergency" ausfüllen. 2) Notfall-Leitfaden unter /security/notfall-leitfaden aufrufen (sofort verfügbar, kein Login nötig). 3) Betroffene Systeme isolieren (nicht sofort abschalten — Forensik-Daten im RAM). 4) Incident dokumentieren (Zeitstempel, Beobachtungen). ClawGuru MSP-Kunden erhalten SLA-gebundene Incident-Response.' } },
    { '@type': 'Question', name: 'Gibt es Community-Support für ClawGuru?', acceptedAnswer: { '@type': 'Answer', text: 'ClawGuru Community: GitHub Discussions für Feature-Requests und Bug-Reports. Community-Forum für allgemeine Security-Fragen. Öffentliche Runbooks: jeder kann Issues melden. ClawGuru Copilot (/copilot): KI-Assistent für sofortige Security-Antworten ohne Wartezeit. Für Selbsthilfe: Methodik-Seite (/methodik) erklärt wie Security Checks funktionieren.' } },
    { '@type': 'Question', name: 'Wie melde ich eine Sicherheitslücke in ClawGuru?', acceptedAnswer: { '@type': 'Answer', text: 'Responsible Disclosure bei ClawGuru: E-Mail an security@clawguru.org. Bitte beschreiben: Schwachstelle, Reproduktionsschritte, potentieller Impact. Wir antworten innerhalb 24h. Koordinierte Offenlegung: wir informieren dich bevor wir patchen und veröffentlichen. Bug Bounty: für kritische Findings bieten wir Belohnungen (Details auf Anfrage). Keine öffentliche Offenlegung ohne Absprache.' } },
  ],
}

export default function SupportPage() {
  return (
    <main className="min-h-screen" style={{ background: "var(--surface-1, #0a0a0a)" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-12 px-4">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true" style={{
          background:
            "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(0,184,255,0.12) 0%, transparent 70%)",
        }} />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <ClawguruAvatar className="w-32 h-32 md:w-40 md:h-40" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black font-heading text-white leading-tight">
            Kontakt & Support
          </h1>
          <p className="mt-4 text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
            Brauchst du Hilfe, Beratung oder willst du einfach mit einem Claw‑Guru sprechen? Wir sind da – freundlich, schnell, präzise.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <a href={`mailto:${LEGAL_INFO.email}`} className="px-6 py-3 rounded-2xl font-black text-black" style={{ background: "linear-gradient(135deg, #d4af37 0%, #e8cc6a 50%, #a8872a 100%)" }}>
              E‑Mail: {LEGAL_INFO.email}
            </a>
            <a href="/emergency" className="px-6 py-3 rounded-2xl font-black text-white" style={{ background: "linear-gradient(135deg,#ff0066,#ff9900)" }}>
              Notfall? → Emergency
            </a>
            <a href={`/copilot?q=${encodeURIComponent('Ich brauche Hilfe: Stack, Problem, Ziel-Outcome. Bitte erste 3 Schritte nennen + Runbook-Snippet.')}`} className="px-6 py-3 rounded-2xl font-black border border-white/10 text-gray-200 hover:border-white/20">
              Ask the Guru →
            </a>
          </div>
          <div className="mt-3 text-xs text-gray-500">Antwort i. d. R. binnen 24h · Für Incidents bitte direkt "Emergency"</div>
        </div>
      </section>

      <Container>
        <div className="pb-20 max-w-6xl mx-auto">
          {/* Beratungsformate */}
          <div className="grid md:grid-cols-3 gap-5">
            {[{
              title: "Schnell‑Check & Guidance",
              desc: "Schicke uns kurz dein Ziel (Stack/Problem) – wir geben dir die 3 wichtigsten Schritte inkl. Runbook‑Snippet.",
              href: "/check",
              accent: "#00b8ff",
            }, {
              title: "ClawGuru Beratung (30–60min)",
              desc: "Live‑Call: Architektur, Härtung, Incident‑Prep. Fokus: Outcome, kein Blabla.",
              href: "/pricing",
              accent: "#bf4eff",
            }, {
              title: "Managed OpenClaw",
              desc: "Überwacht, gepatcht, gewartet. Wir fahren die Baselines, du schläfst besser.",
              href: "/pricing",
              accent: "#00ff9d",
            }].map(card => (
              <div key={card.title} className="rounded-2xl p-6 border border-white/10" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="text-xs font-mono uppercase tracking-[0.25em] mb-2" style={{ color: card.accent }}>
                  {card.title}
                </div>
                <div className="text-gray-300 text-sm leading-relaxed">{card.desc}</div>
                <a href={card.href} className="mt-4 inline-flex px-4 py-2 rounded-xl border border-white/10 text-gray-200 hover:text-white hover:border-white/20">Mehr erfahren →</a>
              </div>
            ))}
          </div>

          {/* FAQ / Kontaktwege */}
          <div className="mt-10 grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl p-6 border border-white/10" style={{ background: "rgba(0,184,255,0.06)" }}>
              <div className="text-sm font-black text-white mb-2">Wie erreichst du uns am schnellsten?</div>
              <ul className="space-y-2 text-sm text-gray-200">
                <li>• E‑Mail: <a href={`mailto:${LEGAL_INFO.email}`} className="underline underline-offset-2">{LEGAL_INFO.email}</a></li>
                <li>• Notfall: <a href="/emergency" className="underline underline-offset-2">Emergency</a> (Day Pass 60s)</li>
              </ul>
            </div>
            <div className="rounded-2xl p-6 border border-white/10" style={{ background: "rgba(191,78,255,0.06)" }}>
              <div className="text-sm font-black text-white mb-2">Was bringst du mit?</div>
              <ul className="space-y-2 text-sm text-gray-200">
                <li>• Ziel/Stack + kurzes Problemstatement</li>
                <li>• Wenn möglich: Logs/Config‑Ausschnitte (ohne Secrets)</li>
                <li>• Wunsch‑Outcome (was soll am Ende stehen)</li>
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </main>
  )
}
