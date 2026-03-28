import Container from "@/components/shared/Container"
import BuyButton from "@/components/commerce/BuyButton"

type Props = { prefix?: string; locale?: string }

export default function HeroSection({ prefix = "", locale = "de" }: Props) {
  const t = locale.startsWith("de")
    ? {
        title: "Die Betriebssicherheits‑Plattform. KI‑gestützt. Ausführbar. Beweisbar.",
        sub: "4,2 Millionen Runbooks, automatisch ausgeführt. Schütze deine Infrastruktur in Sekunden.",
        daypass: "Jetzt Daypass starten",
        tryNow: "Kostenlos testen",
      }
    : {
        title: "The Operational Security Platform. AI‑powered. Executable. Verifiable.",
        sub: "4.2 million runbooks, executed automatically. Secure your infrastructure in seconds.",
        daypass: "Start Daypass",
        tryNow: "Try it now",
      }
  return (
    <section className="relative overflow-hidden" style={{ background: "var(--surface-0)" }}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 20% 0%, rgba(0,255,157,0.08), transparent 45%), radial-gradient(ellipse at 80% 0%, rgba(139,92,246,0.08), transparent 45%)",
          maskImage: "radial-gradient(80% 80% at 50% 40%, black, transparent)",
          opacity: 0.7,
        }}
      />
      <Container>
        <div className="relative z-10 py-16 sm:py-24 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-black leading-tight text-white">{t.title}</h1>
          <p className="mt-5 text-lg sm:text-xl text-gray-300">{t.sub}</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={`${prefix}/daypass`}
              className="px-6 py-3 rounded-2xl font-black bg-gradient-to-r from-brand-cyan to-brand-violet hover:opacity-90 text-white text-center"
            >
              {t.daypass}
            </a>
            <a
              href="#live-previews"
              className="px-6 py-3 rounded-2xl border border-white/10 hover:border-white/20 font-bold text-gray-200 transition-all duration-300"
            >
              {t.tryNow}
            </a>
          </div>
        </div>
      </Container>
    </section>
  )
}
