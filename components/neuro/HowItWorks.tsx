export default function HowItWorks({ dict }: { dict?: any }) {
  return (
    <section className="py-12">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">{dict?.how_title || "Wie Neuro funktioniert"}</h2>
          <p className="mt-3 text-gray-300">{dict?.how_text || ("Neuro vergleicht deinen Technologie‑Stack mit den Tags in unserer Runbook‑Datenbank, bewertet die Relevanz in % " +
            "und erstellt daraus einen klaren Ausführungsplan.")}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 h-48 flex items-center justify-center text-cyan-300">
          {dict?.how_diagram || "Visualisierung"}
        </div>
      </div>
    </section>
  )
}
