export default function UpgradeCTA({ prefix = "" }: { prefix?: string }) {
  return (
    <section className="py-12">
      <div className="max-w-4xl mx-auto rounded-2xl border border-white/10 bg-gradient-to-r from-cyan-500/10 to-transparent p-6">
        <div className="md:flex items-center justify-between gap-6">
          <div>
            <div className="text-white font-semibold text-lg">Mehr Power mit Daypass</div>
            <ul className="mt-2 text-sm text-gray-300 list-disc pl-5 space-y-1">
              <li>Detaillierte Risikoberichte als PDF</li>
              <li>Automatische Ausführung der empfohlenen Runbooks</li>
              <li>Export der Risikodaten für SIEM/Ticketing</li>
            </ul>
          </div>
          <div className="mt-4 md:mt-0">
            <a href="/api/stripe/checkout?plan=daypass" className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-700 text-white font-semibold shadow-lg hover:shadow-cyan-500/30 transition-all duration-300">
              Daypass starten
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
