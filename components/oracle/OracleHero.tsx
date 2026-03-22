export default function OracleHero({ prefix = "", dict }: { prefix?: string; dict?: any }) {
  return (
    <section className="relative py-14 text-center">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-extrabold bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent">
          {dict?.hero_title || "Oracle – Dein prädiktiver Risikoradar"}
        </h1>
        <p className="mt-4 text-gray-300 text-base sm:text-lg">
          {dict?.hero_subline || "Sieh voraus, welche Schwachstellen als nächstes relevant werden – mit konkreten Runbook‑Empfehlungen und Eintrittswahrscheinlichkeiten."}
        </p>
        <div className="mt-6">
          <a href="/api/stripe/checkout?plan=daypass" className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-700 text-white font-semibold shadow-lg hover:shadow-cyan-500/30 transition-all duration-300">
            {dict?.cta_daypass || "Jetzt Daypass kaufen"}
          </a>
        </div>
      </div>
    </section>
  )
}
