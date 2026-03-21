"use client"

import { BentoCard } from "@/components/ui/BentoCard"
import { motion } from "framer-motion"

const features = [
  { title: "AI‑Powered", description: "Intelligente Algorithmen, die sich deinen Workflows anpassen.", icon: "🤖" },
  { title: "Echtzeit‑Analytik", description: "Daten in Echtzeit verarbeiten und visualisieren.", icon: "📊" },
  { title: "Cloud Native", description: "Skalierbar, resilient und bereit für jede Umgebung.", icon: "☁️" },
  { title: "24/7 Support", description: "Rund um die Uhr für dich da – menschlich & schnell.", icon: "💬" },
  { title: "Sicherheit first", description: "Enterprise‑Grade Security mit Zero‑Trust Architektur.", icon: "🔒" },
  { title: "Performance", description: "Blitzschnelle Ladezeiten dank modernster Technologie.", icon: "⚡" },
]

export const FeaturesGrid = () => {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  }
  const item = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }

  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-300 to-fuchsia-400 bg-clip-text text-transparent">
            Features, die begeistern
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Alles, was du für den nächsten digitalen Schritt brauchst – in einem modernen Ökosystem.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, idx) => (
            <motion.div key={idx} variants={item}>
              <BentoCard title={feature.title} description={feature.description} icon={feature.icon} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
