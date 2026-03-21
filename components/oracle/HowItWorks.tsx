export default function HowItWorks() {
  return (
    <section className="py-12">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">Wie Oracle funktioniert</h2>
          <p className="mt-3 text-gray-300">
            Oracle verknüpft aktuelle CVE‑Feeds mit deinen Technologien und priorisiert die dringendsten Bedrohungen.
            Für jedes Risiko siehst du Eintrittswahrscheinlichkeiten, betroffene Services und passende Runbooks.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 h-48 flex items-center justify-center text-cyan-300">
          Radar‑Visualisierung
        </div>
      </div>
    </section>
  )
}
