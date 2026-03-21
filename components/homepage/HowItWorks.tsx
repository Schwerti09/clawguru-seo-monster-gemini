import React from "react"

type Props = { locale?: string }

export default function HowItWorks({ locale = "de" }: Props) {
  const isDe = locale?.startsWith("de")
  const steps = [
    {
      title: isDe ? "Problem erkennen" : "Identify the problem",
      desc: isDe
        ? "Beschreibe dein Problem oder wähle deinen Stack – ClawGuru findet präzise Runbooks."
        : "Describe your issue or select your stack – ClawGuru finds precise runbooks.",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 21l-4.35-4.35" stroke="#67E8F9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="10" cy="10" r="7" stroke="#67E8F9" strokeWidth="2" />
        </svg>
      ),
    },
    {
      title: isDe ? "Ausführen (Premium)" : "Execute (Premium)",
      desc: isDe
        ? "Mit Daypass/Pro führst du Runbooks direkt in deiner Umgebung aus – sicher und nachvollziehbar."
        : "With Daypass/Pro, execute runbooks in your environment – safe and auditable.",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 12h14M12 5v14" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      title: isDe ? "Nachweisen" : "Prove & report",
      desc: isDe
        ? "Automatischer Report, Git-Commit, Zertifikat – alles auditierbar und beweisbar."
        : "Automatic report, Git commit, certificate – fully auditable and verifiable.",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 11l3 3L22 4" stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
  ]

  return (
    <div>
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h2 className="text-2xl sm:text-3xl font-black text-white">{isDe ? "So funktioniert’s" : "How it works"}</h2>
        <p className="mt-2 text-gray-400">{isDe ? "Vom Problem zur Ausführung – und zum Nachweis. In drei klaren Schritten." : "From problem to execution – and proof. In three clear steps."}</p>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {steps.map((s) => (
          <div key={s.title} className="rounded-2xl p-6 glass-vault border border-white/10">
            <div className="flex items-center gap-3">
              <div className="shrink-0 rounded-xl bg-white/5 border border-white/10 p-2">{s.icon}</div>
              <div className="text-lg font-bold text-white">{s.title}</div>
            </div>
            <p className="mt-3 text-sm text-gray-300">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
