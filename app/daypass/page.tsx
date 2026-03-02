import Container from "@/components/shared/Container"
import BuyButton from "@/components/commerce/BuyButton"

export const metadata = {
  title: "24h Day Pass – Sofortzugang bei IT-Notfall | ClawGuru",
  description:
    "Server brennt? Incident läuft? ClawGuru Day Pass: 500+ Runbooks, Copilot-Chat, Config Validator & OpsWall – 7€, kein Abo, sofort aktiv. Instant Access, No Subscription Trap.",
  alternates: { canonical: "/daypass" },
}

const HERO_SECTIONS = [
  {
    id: "notfall",
    badge: "INCIDENT ACTIVE",
    badgeColor: "#ff4040",
    badgeBg: "rgba(255,64,64,0.12)",
    badgeBorder: "rgba(255,64,64,0.3)",
    headline: "Dein Server brennt. Jede Minute zählt.",
    subline:
      "Ohne strukturiertes Runbook verlängerst du den Ausfall – und den Schaden. ClawGuru gibt dir in 60 Sekunden Sofort-Zugang zu Incident-Runbooks, Copilot-Chat und OpsWall. Kein Abo. Kein Onboarding. Nur Fix.",
    cta: "Jetzt Sofort-Zugang sichern (7€)",
    glow: "rgba(255,64,64,0.15)",
    gradientStart: "#ff4040",
    gradientEnd: "#ff8800",
  },
  {
    id: "ssh",
    badge: "ZUGANG VERLOREN",
    badgeColor: "#ffb800",
    badgeBg: "rgba(255,184,0,0.10)",
    badgeBorder: "rgba(255,184,0,0.3)",
    headline: "SSH ausgefallen. Keine Doku. Keine Reihenfolge.",
    subline:
      "Du weißt was zu tun wäre – aber nicht in welcher Reihenfolge und nicht für deinen Stack. Stack Overflow hat 15 Antworten, keine davon passt. Unsere 500+ Runbooks passen – direkt ins Terminal kopierbar.",
    cta: "Runbooks jetzt freischalten (7€)",
    glow: "rgba(255,184,0,0.12)",
    gradientStart: "#ffb800",
    gradientEnd: "#ff6600",
  },
  {
    id: "breach",
    badge: "BREACH DETECTED",
    badgeColor: "#ff4040",
    badgeBg: "rgba(255,64,64,0.12)",
    badgeBorder: "rgba(255,64,64,0.3)",
    headline: "Breach-Alarm. Dein Team braucht jetzt Struktur.",
    subline:
      "Falsche Reihenfolge bei der Incident-Response kostet Daten – und Vertrauen. ClawGuru liefert strukturierte IR-Playbooks + Copilot-Chat für deine spezifische Situation. Kein Abo, kein Passwort, sofort einsetzbar.",
    cta: "IR-Playbooks öffnen (7€)",
    glow: "rgba(255,64,64,0.15)",
    gradientStart: "#ff4040",
    gradientEnd: "#cc0033",
  },
  {
    id: "config",
    badge: "PRODUKTION DOWN",
    badgeColor: "#00b8ff",
    badgeBg: "rgba(0,184,255,0.08)",
    badgeBorder: "rgba(0,184,255,0.3)",
    headline: "Nginx kaputt. Docker crasht. YAML falsch. Produktion unten.",
    subline:
      "Der Config Validator analysiert Docker, Nginx und YAML-Configs auf Fehler – und liefert dir das passende Runbook. Kein Suchen, kein Raten. Nur: Problem → Ursache → Fix.",
    cta: "Config-Check starten (7€)",
    glow: "rgba(0,184,255,0.12)",
    gradientStart: "#00b8ff",
    gradientEnd: "#0077ff",
  },
  {
    id: "3uhr",
    badge: "03:00 UHR – ALLES BRENNT",
    badgeColor: "#00ff9d",
    badgeBg: "rgba(0,255,157,0.08)",
    badgeBorder: "rgba(0,255,157,0.25)",
    headline: "Es ist 3 Uhr morgens. Alles brennt. Du brauchst Antworten.",
    subline:
      "Ein Klick. 7€. 24 Stunden Vollzugriff auf alle ClawGuru-Tools: Score, OpsWall, ThreatMap, Mission Control, Copilot und 500+ Runbooks. Instant Access – kein Abo, keine Subscription-Falle.",
    cta: "24h Vollzugriff kaufen (7€)",
    glow: "rgba(0,255,157,0.10)",
    gradientStart: "#00ff9d",
    gradientEnd: "#00b8ff",
  },
]

const WHY_NOW_BULLETS = [
  {
    icon: "⏱",
    title: "Jede Stunde Downtime kostet bares Geld",
    text: "Im SMB-Bereich durchschnittlich 5.000€+, im Enterprise-Segment bis zu 300.000€ pro Stunde. Ein unstrukturierter Incident verlängert die Ausfallzeit – ein klares Runbook verkürzt sie.",
  },
  {
    icon: "🔁",
    title: "Falsche Reihenfolge verdoppelt die Recovery-Zeit",
    text: "Wer beim Incident ohne Plan vorgeht, macht Fehler unter Druck. Wer ein Runbook hat, arbeitet die Checkliste ab. Der Unterschied: Minuten statt Stunden bis zur Wiederherstellung.",
  },
  {
    icon: "🚨",
    title: "Die ersten 15 Minuten entscheiden über den Schaden",
    text: "Breach, Datenleck oder Systemausfall: Das Zeitfenster für Schadensbegrenzung ist klein. Runbooks ohne langes Suchen – das ist der entscheidende operative Vorteil genau jetzt.",
  },
]

function HeroCard({
  hero,
  index,
}: {
  hero: (typeof HERO_SECTIONS)[0]
  index: number
}) {
  const isFirst = index === 0
  return (
    <section
      id={hero.id}
      className="relative overflow-hidden rounded-3xl p-8 md:p-12"
      style={{
        background: isFirst
          ? "linear-gradient(135deg, #0d0508 0%, #140a08 100%)"
          : "rgba(255,255,255,0.02)",
        border: `1px solid ${hero.badgeBorder}`,
        boxShadow: `0 0 60px ${hero.glow}`,
      }}
    >
      {/* Glow backdrop */}
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl"
        aria-hidden="true"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 0%, ${hero.glow} 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10 max-w-2xl">
        {/* Badge */}
        <div
          className="inline-block text-[11px] font-mono font-black uppercase tracking-[0.25em] px-4 py-1 rounded-full border mb-5"
          style={{
            color: hero.badgeColor,
            background: hero.badgeBg,
            borderColor: hero.badgeBorder,
          }}
        >
          {hero.badge}
        </div>

        {/* Headline */}
        <h2 className="text-3xl sm:text-4xl font-black font-heading text-white leading-tight">
          {hero.headline}
        </h2>

        {/* Subline */}
        <p className="mt-4 text-gray-300 text-lg leading-relaxed">
          {hero.subline}
        </p>

        {/* Trust hint */}
        <div
          className="mt-3 text-sm font-mono"
          style={{ color: hero.badgeColor, opacity: 0.8 }}
        >
          Instant Access · No Subscription Trap · Sofort aktiv nach Zahlung
        </div>

        {/* CTA */}
        <div className="mt-6">
          <BuyButton
            product="daypass"
            label={hero.cta}
            className="inline-block px-8 py-4 rounded-2xl font-black text-base text-black transition-all duration-300 hover:opacity-90 disabled:opacity-60"
            style={{
              background: `linear-gradient(135deg, ${hero.gradientStart} 0%, ${hero.gradientEnd} 100%)`,
              boxShadow: `0 0 30px ${hero.glow}`,
            }}
          />
        </div>
      </div>
    </section>
  )
}

export default function DayPassLandingPage() {
  return (
    <main className="min-h-screen bg-[#05060A]">
      {/* Page header */}
      <section className="relative overflow-hidden pt-20 pb-10 text-center px-4">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(255,64,64,0.10) 0%, transparent 70%)",
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div
            className="inline-block text-[11px] font-mono font-black uppercase tracking-[0.25em] px-4 py-1 rounded-full border mb-5"
            style={{
              borderColor: "rgba(255,64,64,0.4)",
              color: "#ff4040",
              background: "rgba(255,64,64,0.08)",
            }}
          >
            🚨 Incident Response · Day Pass
          </div>
          <h1 className="text-4xl sm:text-5xl font-black font-heading text-white leading-tight">
            Dein Server brennt –<br className="hidden sm:block" />
            ClawGuru löscht.
          </h1>
          <p className="mt-5 text-gray-300 text-xl leading-relaxed max-w-xl mx-auto">
            24h Vollzugriff auf Incident-Runbooks, Copilot, Config Validator &amp; OpsWall.{" "}
            <span className="text-white font-semibold">
              Einmal zahlen. Sofort starten. Kein Abo.
            </span>
          </p>
          <div className="mt-8">
            <BuyButton
              product="daypass"
              label="Sofort-Zugang kaufen – 7€ · Kein Abo"
              className="inline-block px-10 py-4 rounded-2xl font-black text-base text-black transition-all duration-300 hover:opacity-90 disabled:opacity-60"
              style={{
                background: "linear-gradient(135deg, #ff4040 0%, #ff8800 100%)",
                boxShadow: "0 0 40px rgba(255,64,64,0.35)",
              }}
            />
          </div>
          <p className="mt-3 text-xs text-gray-500">
            Stripe Checkout → Aktivierung → Dashboard. Dauert unter 60 Sekunden.
          </p>
        </div>
      </section>

      <Container>
        <div className="pb-24 space-y-6">

          {/* 5 Hero-Sections (PAS framework) */}
          {HERO_SECTIONS.map((hero, i) => (
            <HeroCard key={hero.id} hero={hero} index={i} />
          ))}

          {/* Why now? */}
          <section
            className="mt-10 rounded-3xl p-8 md:p-12 border border-white/10"
            style={{ background: "rgba(255,255,255,0.025)" }}
          >
            <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-gray-500 mb-2">
              Warum jetzt?
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-heading text-white mb-8">
              Jede Minute ohne Runbook kostet dich mehr.
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {WHY_NOW_BULLETS.map((b) => (
                <div
                  key={b.title}
                  className="rounded-2xl p-6 border border-white/8"
                  style={{ background: "rgba(255,64,64,0.04)" }}
                >
                  <div className="text-3xl mb-3" aria-hidden="true">
                    {b.icon}
                  </div>
                  <div className="font-black text-white text-base mb-2">
                    {b.title}
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">{b.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* What's included */}
          <section
            className="rounded-3xl p-8 md:p-12 border border-white/10"
            style={{ background: "rgba(0,184,255,0.03)" }}
          >
            <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-gray-500 mb-2">
              Im Day Pass enthalten
            </div>
            <h2 className="text-2xl font-black font-heading text-white mb-6">
              Alles, was du im Incident brauchst.
            </h2>
            <ul className="grid sm:grid-cols-2 gap-3">
              {[
                "500+ Incident-Runbooks & Blueprints (sofort durchsuchbar)",
                "Copilot-Chat: KI-Assistent für Debug & Ops (stack-spezifisch)",
                "Config Validator: Docker, Nginx, YAML – Fehler in Sekunden",
                "Live Security Score – Top-3-Risiken in 30 Sekunden",
                "OpsWall Live – Trends & Hot Fixes in Echtzeit",
                "ThreatMap – Real-Time Threat Visualisierung",
                "Mission Control Dashboard",
                "IR-Playbooks: strukturierte Incident-Response-Checklisten",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-gray-200">
                  <span
                    className="mt-[2px] shrink-0 size-[18px] rounded-full flex items-center justify-center text-[9px] font-bold"
                    style={{ background: "rgba(0,255,157,0.12)", color: "#00ff9d" }}
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                  <span className="leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Final CTA */}
          <section
            className="rounded-3xl p-8 md:p-12 text-center border"
            style={{
              background: "linear-gradient(135deg, #0d0508 0%, #080f14 100%)",
              borderColor: "rgba(255,64,64,0.25)",
              boxShadow: "0 0 60px rgba(255,64,64,0.08)",
            }}
          >
            <div
              className="text-[11px] font-mono font-black uppercase tracking-[0.25em] mb-3"
              style={{ color: "#ff4040" }}
            >
              Instant Access · No Subscription Trap
            </div>
            <h2 className="text-3xl sm:text-4xl font-black font-heading text-white mb-3">
              Stopp suchen. Fang an zu fixen.
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-lg mx-auto">
              7€. 24 Stunden. Vollzugriff. Kein Abo, kein Account, kein Onboarding.
              Zugang ist in unter 60 Sekunden aktiv.
            </p>
            <BuyButton
              product="daypass"
              label="Day Pass kaufen – 7€ · Kein Abo · Sofort aktiv"
              className="inline-block px-10 py-4 rounded-2xl font-black text-base text-black transition-all duration-300 hover:opacity-90 disabled:opacity-60"
              style={{
                background: "linear-gradient(135deg, #ff4040 0%, #ff8800 100%)",
                boxShadow: "0 0 40px rgba(255,64,64,0.35)",
              }}
            />
            <div className="mt-4 flex flex-wrap justify-center gap-5 text-xs text-gray-500">
              <span>✓ Sofortzugang via Stripe</span>
              <span>✓ Kein Passwort nötig</span>
              <span>✓ Zugang via /recover wiederherstellbar</span>
              <span>✓ Einmalzahlung – kein Abo</span>
            </div>
          </section>

        </div>
      </Container>
    </main>
  )
}
