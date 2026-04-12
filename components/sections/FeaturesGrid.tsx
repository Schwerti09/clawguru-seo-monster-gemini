import { BentoCard } from "@/components/ui/BentoCard"

const features = [
  { title: "AI‑Powered", description: "Intelligente Algorithmen, die sich deinen Workflows anpassen.", icon: "🤖" },
  { title: "Echtzeit‑Analytik", description: "Daten in Echtzeit verarbeiten und visualisieren.", icon: "📊" },
  { title: "Cloud Native", description: "Skalierbar, resilient und bereit für jede Umgebung.", icon: "☁️" },
  { title: "24/7 Support", description: "Rund um die Uhr für dich da – menschlich & schnell.", icon: "💬" },
  { title: "Sicherheit first", description: "Enterprise‑Grade Security mit Zero‑Trust Architektur.", icon: "🔒" },
  { title: "Performance", description: "Blitzschnelle Ladezeiten dank modernster Technologie.", icon: "⚡" },
]

export const FeaturesGrid = () => {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="animate-fade-in-up text-center mb-16" style={{ animationDuration: '0.6s' }}>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-300 to-fuchsia-400 bg-clip-text text-transparent">
            Features, die begeistern
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Alles, was du für den nächsten digitalen Schritt brauchst – in einem modernen Ökosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div key={idx} className="animate-fade-in-up" style={{ animationDelay: `${idx * 0.08}s`, animationDuration: '0.4s' }}>
              <BentoCard title={feature.title} description={feature.description} icon={feature.icon} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
