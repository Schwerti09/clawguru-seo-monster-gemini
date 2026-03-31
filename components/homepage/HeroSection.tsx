import Container from "@/components/shared/Container"

type Props = { prefix?: string; dict?: Record<string, string> }

export default function HeroSection({ prefix = "", dict = {} }: Props) {
  const t = {
    badge: dict.hero_badge || "Mycelial Engine · 4.2 M Runbooks · Executable Security Content",
    title: dict.hero_title || "Security Operations That Actually Work.",
    sub: dict.hero_sub || "ClawGuru is the AI-powered SecOps platform with 4.2 million executable runbooks – for incident response, hardening, and compliance in real time. From problem to fix in under 30 seconds.",
    daypass: dict.hero_daypass || "Start Daypass – €9/24 h",
    tryNow: dict.hero_tryNow || "Try it for free",
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
          <div className="inline-block mb-5 px-4 py-1.5 rounded-full text-xs font-semibold border border-white/10 bg-white/5 text-gray-300 tracking-wide">
            {t.badge}
          </div>
          <h1 className="text-4xl sm:text-6xl font-black leading-tight text-white">{t.title}</h1>
          <p className="mt-5 text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">{t.sub}</p>
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
