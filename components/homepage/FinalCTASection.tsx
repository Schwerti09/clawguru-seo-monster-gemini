type Props = { prefix?: string; locale?: string }

export default function FinalCTASection({ prefix = "", locale = "de" }: Props) {
  const isDe = locale.startsWith("de")

  return (
    <section className="py-20" style={{ background: "var(--surface-0)" }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <div
          className="rounded-3xl px-8 py-14 border border-white/10 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(0,255,157,0.06) 0%, rgba(139,92,246,0.08) 100%)",
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-3xl"
            style={{
              backgroundImage:
                "radial-gradient(ellipse at 30% 0%, rgba(0,255,157,0.1), transparent 50%), radial-gradient(ellipse at 70% 100%, rgba(139,92,246,0.1), transparent 50%)",
            }}
          />
          <div className="relative z-10">
            <span className="inline-block mb-4 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-white/10 text-gray-200 border border-white/10">
              {isDe ? "Jetzt starten" : "Get started now"}
            </span>

            <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-4">
              {isDe
                ? "Bereit, SecOps auf das nächste Level zu bringen?"
                : "Ready to take SecOps to the next level?"}
            </h2>

            <p className="text-gray-300 text-base sm:text-lg max-w-xl mx-auto mb-8">
              {isDe
                ? "Starte in unter 60 Sekunden. Kein Onboarding, keine langen Verträge – nur operative Sicherheit, die wirklich funktioniert."
                : "Start in under 60 seconds. No onboarding, no long contracts – just operational security that actually works."}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`${prefix}/daypass`}
                className="px-8 py-4 rounded-2xl font-black bg-gradient-to-r from-brand-cyan to-brand-violet hover:opacity-90 text-white text-center transition-all duration-300 text-base shadow-lg"
              >
                {isDe ? "Daypass starten – 9 €/24 h" : "Start Daypass – €9/24 h"}
              </a>
              <a
                href={`${prefix}/dashboard`}
                className="px-8 py-4 rounded-2xl border border-white/20 hover:border-white/40 font-bold text-gray-200 text-center transition-all duration-300 text-base"
              >
                {isDe ? "Zum Dashboard →" : "Go to Dashboard →"}
              </a>
            </div>

            <p className="mt-5 text-xs text-gray-500">
              {isDe
                ? "Stripe Checkout → Aktivierung → Dashboard. Dauert unter 60 Sekunden."
                : "Stripe Checkout → Activation → Dashboard. Takes under 60 seconds."}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
