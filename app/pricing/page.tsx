import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"
import BuyButton from "@/components/commerce/BuyButton"

export const metadata = {
  title: "Day Pass | ClawGuru",
  description:
    "24h Vollzugriff auf ClawGuru (OpsWall, Vault, Copilot, Badge Generator). Einmal zahlen, sofort loslegen."
}

function Card({
  title,
  price,
  cadence,
  desc,
  bullets,
  children,
  accent,
  badge
}: {
  title: string
  price: string
  cadence: string
  desc: string
  bullets: string[]
  children: React.ReactNode
  accent?: "cyan" | "violet"
  badge?: string
}) {
  const ring =
    accent === "cyan"
      ? "ring-1 ring-cyan-500/40"
      : accent === "violet"
        ? "ring-1 ring-violet-500/40"
        : "ring-1 ring-white/10"

  return (
    <div className={`rounded-3xl bg-black/40 border border-white/10 ${ring} p-7`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-lg font-semibold text-white">{title}</div>
          <div className="mt-2 flex items-end gap-2">
            <div className="text-4xl font-bold text-white">{price}</div>
            <div className="text-sm text-gray-400 pb-1">{cadence}</div>
          </div>
        </div>
        <div className="text-[11px] uppercase tracking-widest text-gray-400 border border-white/10 rounded-full px-3 py-1">
          {badge || cadence}
        </div>
      </div>

      <p className="mt-4 text-gray-300 leading-relaxed">{desc}</p>

      <ul className="mt-5 space-y-2 text-sm text-gray-200">
        {bullets.map((b) => (
          <li key={b} className="flex gap-2">
            <span className="mt-[3px] size-4 rounded-full bg-white/10 flex items-center justify-center text-[10px]">✓</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6">{children}</div>

      <div className="mt-4 text-xs text-gray-500">
        Du bekommst sofort nach Zahlung deinen Zugang. Wenn etwas hakt: /recover.
      </div>
    </div>
  )
}

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#05060A]">
      <Container>
        <div className="py-16">
          <SectionTitle
            kicker="Zugang"
            title="Pricing"
            subtitle="Day Pass für akute Probleme. Pro für dauerhaften Zugriff. Teams für Zusammenarbeit & höhere Limits."
          />

          <div className="mt-10 grid lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
              <Card
                title="ClawGuru Day Pass"
                price="7€"
                cadence="einmalig · 24h"
                badge="24h Access"
                desc="Du bekommst 24 Stunden Vollzugriff auf die Tools, Runbooks und den Live OpsWall. Perfekt, wenn du gerade brennst und sofort Antworten brauchst."
                bullets={[
                  "OpsWall (Live) + Incident-Playbooks",
                  "Copilot (Konversations-Mutant) für Debug/Runbooks",
                  "Security Score + Badge Generator (shareable)",
                  "Vault: Setup, Hardening, Recovery, Stripe/Webhooks, etc."
                ]}
                accent="cyan"
              >
                <BuyButton product="daypass" label="Day Pass kaufen (7€) → Stripe" />
              </Card>

              <Card
                title="ClawGuru Pro"
                price="14,99€"
                cadence="pro Monat"
                badge="Abo · monatlich"
                desc="Dauerzugriff auf Vault & Copilot – für alle, die nicht nur löschen, sondern verhindern wollen. Kündbar jederzeit."
                bullets={[
                  "Alles aus Day Pass (dauerhaft)",
                  "Pro Runbooks + Updates (laufend)",
                  "Copilot: höhere Limits (fair-use)",
                  "Priority: neue Topics zuerst"
                ]}
                accent="violet"
              >
                <BuyButton product="pro" label="Pro starten (14,99€/Monat) → Stripe" />
              </Card>

              <Card
                title="ClawGuru Teams"
                price="29,99€"
                cadence="pro Monat"
                badge="Abo · Teams"
                desc="Für kleine Teams, die gemeinsam deployen, recovern und keine Lust auf Chaos-Docs haben. Kündbar jederzeit."
                bullets={[
                  "Alles aus Pro",
                  "Team-Workflow: gemeinsame Runbook-Links",
                  "Höhere Limits (fair-use)",
                  "Roadmap Votes (was als nächstes gebaut wird)"
                ]}
              >
                <BuyButton product="team" label="Teams starten (29,99€/Monat) → Stripe" />
              </Card>

              <div className="md:col-span-2 grid md:grid-cols-2 gap-6">
                <div className="rounded-2xl border border-white/10 bg-black/30 p-6">
                  <div className="font-semibold text-white">Was passiert nach dem Kauf?</div>
                  <p className="mt-2 text-sm text-gray-300">
                    Stripe Checkout → Redirect zu /success → Aktivierung → du landest in deinem Dashboard mit Download- & Tool-Zugang.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/30 p-6">
                  <div className="font-semibold text-white">Brauche ich E-Mail?</div>
                  <p className="mt-2 text-sm text-gray-300">
                    Nein. Dein Zugang wird direkt im Browser freigeschaltet (Token). Optional können wir später E-Mail-Delivery ergänzen.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/30 p-7">
              <div className="text-sm uppercase tracking-widest text-gray-400">Quick Links</div>
              <div className="mt-4 space-y-3 text-sm">
                <a href="/check" className="block text-white hover:underline">Security Check</a>
                <a href="/score" className="block text-white hover:underline">Security Score + Badge</a>
                <a href="/runbooks" className="block text-white hover:underline">Runbooks (1000 Topics)</a>
                <a href="/live" className="block text-white hover:underline">OpsWall Live</a>
                <a href="/recover" className="block text-white hover:underline">Zugang wiederherstellen</a>
              </div>

              <div className="mt-7 rounded-2xl border border-white/10 bg-black/40 p-5">
                <div className="font-semibold text-white">Abo-Logik ist "hart"</div>
                <p className="mt-2 text-sm text-gray-300">
                  Pro/Teams prüfen bei jedem Zugriff den Stripe-Status. Kündigung = Zugriff weg. Day Pass läuft nur per Ablaufzeit.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 rounded-3xl border border-white/10 bg-black/20 p-8">
            <div className="text-lg font-semibold text-white">FAQ</div>
            <div className="mt-6 grid md:grid-cols-2 gap-6 text-sm text-gray-300">
              <div>
                <div className="font-semibold text-white">Wie lange gilt der Zugriff?</div>
                <p className="mt-2">
                  Day Pass: 24 Stunden ab Aktivierung. Pro/Teams: solange das Abo aktiv ist.
                </p>
              </div>
              <div>
                <div className="font-semibold text-white">Kann ich den Zugang übertragen?</div>
                <p className="mt-2">
                  Der Day Pass ist an deinen Browser-Token gebunden. Für Teams bauen wir später echte Accounts.
                </p>
              </div>
              <div>
                <div className="font-semibold text-white">Was, wenn Stripe sagt bezahlt, aber ich sehe nichts?</div>
                <p className="mt-2">
                  Geh auf /recover und gib die Checkout Session ID oder deine Payment Intent ID ein (steht in Stripe). Das aktiviert den Zugang erneut.
                </p>
              </div>
              <div>
                <div className="font-semibold text-white">Kann ich kündigen?</div>
                <p className="mt-2">
                  Day Pass ist einmalig. Pro/Teams sind Abos und können jederzeit in Stripe gekündigt werden.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </main>
  )
}
