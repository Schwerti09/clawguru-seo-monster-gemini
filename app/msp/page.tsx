import Container from "@/components/shared/Container"
import BuyButton from "@/components/commerce/BuyButton"

export const metadata = {
  title: "White Label Runbooks für MSPs | ClawGuru",
  description:
    "Managed Service Provider: Lizenziere ClawGuru Runbooks als White Label. Eigenes Logo, eigene Marke – jährliche Lizenzgebühr pro MSP.",
  alternates: { canonical: "/msp" },
}

type Feature = { label: string; isNew?: boolean }
type FeatureGroup = { heading: string; items: Feature[] }

function FeatureList({ groups }: { groups: FeatureGroup[] }) {
  return (
    <div className="mt-5 space-y-4">
      {groups.map((g) => (
        <div key={g.heading}>
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500 mb-2">
            {g.heading}
          </div>
          <ul className="space-y-[7px]">
            {g.items.map((item) => (
              <li key={item.label} className="flex items-start gap-2 text-sm text-gray-200">
                <span
                  className="mt-[2px] shrink-0 size-[18px] rounded-full flex items-center justify-center text-[9px] font-bold"
                  style={{ background: "rgba(0,255,157,0.12)", color: "#00ff9d" }}
                  aria-hidden="true"
                >
                  ✓
                </span>
                <span className="leading-snug">
                  {item.label}
                  {item.isNew && (
                    <span
                      className="ml-2 text-[9px] font-black uppercase tracking-widest px-[6px] py-[2px] rounded-full align-middle"
                      style={{ background: "rgba(0,184,255,0.18)", color: "#00b8ff" }}
                    >
                      NEU
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

const MSP_GROUPS: FeatureGroup[] = [
  {
    heading: "White Label & Branding",
    items: [
      { label: "Eigenes Logo auf allen Runbooks" },
      { label: "Eigener Firmenname & Accent-Farbe", isNew: true },
      { label: "Branded Runbook-URLs (/runbook/[slug]/white-label)" },
      { label: "ClawGuru-Branding vollständig ausgeblendet", isNew: true },
    ],
  },
  {
    heading: "Runbook-Bibliothek",
    items: [
      { label: "Zugriff auf alle 500+ Runbooks & Blueprints" },
      { label: "Security, Hardening, Incident Response, Setup" },
      { label: "Laufende Updates & neue Runbooks inklusive" },
    ],
  },
  {
    heading: "Lizenz & Support",
    items: [
      { label: "Jahres-Lizenz pro MSP – keine Nutzerlimits" },
      { label: "Weiterverkauf an Endkunden erlaubt" },
      { label: "Priority E-Mail Support", isNew: true },
    ],
  },
]

export default function MspPage() {
  return (
    <main className="min-h-screen bg-[#05060A]">
      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-10 text-center px-4">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(0,255,157,0.08) 0%, transparent 70%)",
          }}
        />
        <div className="relative z-10 max-w-2xl mx-auto">
          <div
            className="inline-block text-[11px] font-mono uppercase tracking-[0.25em] px-4 py-1 rounded-full border mb-5"
            style={{
              borderColor: "rgba(0,255,157,0.3)",
              color: "#00ff9d",
              background: "rgba(0,255,157,0.06)",
            }}
          >
            MSP · White Label
          </div>
          <h1 className="text-4xl sm:text-5xl font-black font-heading text-white leading-tight">
            Runbooks unter deiner Marke
          </h1>
          <p className="mt-4 text-gray-400 text-lg">
            Lizenziere ClawGuru Runbooks als White Label. Eigenes Logo, eigene Marke –
            du verkaufst, wir liefern die Inhalte.
          </p>
        </div>
      </section>

      <Container>
        <div className="pb-20">
          {/* How it works */}
          <div className="mb-12 grid md:grid-cols-3 gap-6 text-center">
            {[
              ["1. Lizenz kaufen", "Jährliche MSP-Lizenzgebühr via Stripe. Sofortzugang."],
              ["2. Logo & Farbe hinterlegen", "Übergib dein Logo als URL-Parameter an die White-Label-Runbook-View."],
              ["3. An Kunden weitergeben", "Teile gebrandete Runbook-Links mit deinen Endkunden."],
            ].map(([title, text]) => (
              <div
                key={title}
                className="rounded-2xl border border-white/8 p-6"
                style={{ background: "rgba(255,255,255,0.02)" }}
              >
                <div className="font-black text-white text-sm mb-2">{title}</div>
                <p className="text-xs text-gray-400 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>

          {/* Pricing card */}
          <div className="max-w-md mx-auto">
            <div
              className="relative rounded-3xl p-[1px] overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, rgba(0,255,157,0.6) 0%, rgba(0,184,255,0.3) 100%)",
              }}
            >
              <div
                className="h-full rounded-3xl p-7 flex flex-col"
                style={{ background: "#080f0c" }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div
                      className="text-[11px] font-mono uppercase tracking-[0.2em] mb-2"
                      style={{ color: "#00ff9d" }}
                    >
                      Jahres-Lizenz · MSP
                    </div>
                    <div className="text-xl font-black text-white font-heading">
                      ClawGuru MSP White Label
                    </div>
                  </div>
                  <div
                    className="shrink-0 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border"
                    style={{
                      borderColor: "rgba(0,255,157,0.3)",
                      color: "#00ff9d",
                      background: "rgba(0,255,157,0.06)",
                    }}
                  >
                    MSP
                  </div>
                </div>

                <div className="mt-5 flex items-end gap-2">
                  <span className="text-5xl font-black text-white">499€</span>
                  <span className="text-sm text-gray-400 pb-2">/ Jahr</span>
                </div>

                <p className="mt-4 text-sm text-gray-300 leading-relaxed">
                  Unbegrenzte Endkunden. Eigenes Logo, eigene Farbe. Alle 500+ Runbooks.
                  Laufende Updates inklusive. Kündbar jährlich.
                </p>

                <FeatureList groups={MSP_GROUPS} />

                <div className="mt-auto pt-6">
                  <BuyButton
                    product="msp"
                    label="MSP-Lizenz kaufen (499€/Jahr) → Stripe"
                    className="w-full py-3 px-6 rounded-2xl font-black text-sm text-black transition-all duration-300 hover:opacity-90 disabled:opacity-60"
                    style={{
                      background: "linear-gradient(135deg, #00ff9d 0%, #00b8ff 100%)",
                      boxShadow: "0 0 30px rgba(0,255,157,0.25)",
                    }}
                  />
                  <div className="mt-3 text-xs text-gray-500 text-center">
                    Sofortzugang · Jahres-Abo · kündbar jährlich
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* White label preview link */}
          <div
            className="mt-10 rounded-3xl border border-gray-800 bg-black/20 p-6 text-sm text-gray-400"
          >
            <div className="font-black text-gray-200 mb-2">White Label Preview</div>
            <p className="mb-3">
              So sieht ein gebrandetes Runbook aus. Übergib{" "}
              <code className="text-gray-200">?logo=</code> und{" "}
              <code className="text-gray-200">?company=</code> als URL-Parameter:
            </p>
            <a
              href="/runbook/aws-ssh-hardening-2026/white-label?company=Mein+MSP&logo=https%3A%2F%2Fclawguru.org%2Fog-image.png"
              className="text-cyan-400 underline underline-offset-2 hover:text-cyan-200 break-all"
            >
              /runbook/aws-ssh-hardening-2026/white-label?company=Mein+MSP&logo=...
            </a>
          </div>

          {/* FAQ */}
          <div
            className="mt-12 rounded-3xl border border-white/10 p-8"
            style={{ background: "rgba(255,255,255,0.02)" }}
          >
            <div className="text-xs font-mono uppercase tracking-[0.25em] text-gray-500 mb-6">FAQ</div>
            <div className="grid md:grid-cols-2 gap-x-10 gap-y-6 text-sm text-gray-300">
              <div>
                <div className="font-semibold text-white">Was ist ein MSP White Label?</div>
                <p className="mt-1 text-gray-400">
                  Du nimmst unsere Runbooks, klemmst dein Logo davor und gibst sie an deine
                  Endkunden weiter. ClawGuru bleibt im Hintergrund.
                </p>
              </div>
              <div>
                <div className="font-semibold text-white">Wie viele Endkunden darf ich bedienen?</div>
                <p className="mt-1 text-gray-400">
                  Unbegrenzt – die Jahres-Lizenz deckt deinen kompletten Kundenstamm ab.
                </p>
              </div>
              <div>
                <div className="font-semibold text-white">Wie wird das Branding übergeben?</div>
                <p className="mt-1 text-gray-400">
                  Via URL-Parameter{" "}
                  <code className="text-gray-200">?logo=</code>,{" "}
                  <code className="text-gray-200">?company=</code> und optional{" "}
                  <code className="text-gray-200">?accent=</code> (Hex-Farbe).
                </p>
              </div>
              <div>
                <div className="font-semibold text-white">Was passiert nach dem Kauf?</div>
                <p className="mt-1 text-gray-400">
                  Du erhältst per E-Mail einen Magic Link mit deinem Zugang. Danach kannst
                  du sofort White-Label-URLs generieren und teilen.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </main>
  )
}
