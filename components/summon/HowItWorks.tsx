export default function HowItWorks() {
  return (
    <section className="py-12">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">Wie Summon arbeitet</h2>
          <p className="mt-3 text-gray-300">
            Summon durchsucht die Runbook‑Datenbank, matched Tags und berechnet einen Confidence‑Score. So erhältst du die relevantesten
            Anleitungen für dein konkretes Problem.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 h-48 flex items-center justify-center text-cyan-300">
          Diagramm
        </div>
      </div>
    </section>
  )
}
