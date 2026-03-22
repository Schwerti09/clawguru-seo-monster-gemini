export default function HowItWorks({ dict }: { dict?: any }) {
  return (
    <section className="py-12">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">{dict?.how_title || "Wie Oracle funktioniert"}</h2>
          <p className="mt-3 text-gray-300">{dict?.how_text || ("Oracle verknüpft aktuelle CVE‑Feeds mit deinen Technologien und priorisiert die dringendsten Bedrohungen. " +
            "Für jedes Risiko siehst du Eintrittswahrscheinlichkeiten, betroffene Services und passende Runbooks.")}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 h-48 flex items-center justify-center text-cyan-300">
          {dict?.how_diagram || "Radar‑Visualisierung"}
        </div>
      </div>
    </section>
  )
}
