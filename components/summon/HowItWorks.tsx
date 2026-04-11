export default function HowItWorks({ dict }: { dict?: any }) {
  const steps = [
    { label: dict?.how_step_query ?? "Frage", icon: "💬", color: "#06b6d4" },
    { label: dict?.how_step_tags ?? "Tag‑Match", icon: "🏷️", color: "#8b5cf6" },
    { label: dict?.how_step_score ?? "Confidence‑Score", icon: "📊", color: "#f59e0b" },
    { label: dict?.how_step_result ?? "Runbooks", icon: "✅", color: "#10b981" },
  ]

  return (
    <section className="py-12">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">{dict?.how_title}</h2>
          <p className="mt-3 text-gray-300">{dict?.how_text}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between gap-2">
            {steps.map((step, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold border-2"
                    style={{ borderColor: step.color, background: `${step.color}22` }}
                  >
                    {step.icon}
                  </div>
                  <span className="text-xs text-gray-300 text-center leading-tight max-w-[56px]">
                    {step.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <svg
                    width="20"
                    height="12"
                    viewBox="0 0 20 12"
                    className="flex-shrink-0 mb-4"
                    aria-hidden="true"
                  >
                    <path
                      d="M0 6 H14 M10 1 L18 6 L10 11"
                      stroke="#6b7280"
                      strokeWidth="1.5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            ))}
          </div>
          <svg viewBox="0 0 300 40" className="w-full mt-4" aria-hidden="true">
            <defs>
              <linearGradient id="hw-gradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="33%" stopColor="#8b5cf6" />
                <stop offset="66%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
            <polyline
              points="0,35 100,10 200,20 300,5"
              fill="none"
              stroke="url(#hw-gradient)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {[
              { x: 0, y: 35 },
              { x: 100, y: 10 },
              { x: 200, y: 20 },
              { x: 300, y: 5 },
            ].map((pt, i) => (
              <circle key={i} cx={pt.x} cy={pt.y} r="3.5" fill={steps[i].color} />
            ))}
          </svg>
        </div>
      </div>
    </section>
  )
}
