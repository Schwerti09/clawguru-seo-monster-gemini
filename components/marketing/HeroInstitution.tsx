'use client'
// VISUAL UPGRADE 2026: Premium hero section with animated score counter,
// magnetic CTA buttons, and Framer Motion staggered animations.

import { useState } from "react"
import { motion } from "framer-motion"
import SecurityScoreCounter from "@/components/visual/SecurityScoreCounter"
import { Shield, Cpu, BookOpen, Zap } from "lucide-react"

export default function HeroInstitution() {
  const [q, setQ] = useState("")

  // VISUAL UPGRADE 2026: Framer Motion stagger animation variants
  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }

  return (
    <div className="pt-28 pb-14">
      <div className="grid lg:grid-cols-2 gap-10 items-start">
        <motion.div variants={container} initial="hidden" animate="show">
          {/* VISUAL UPGRADE 2026: Status badge with claw-green pulse */}
          <motion.div variants={item}>
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full glass-card text-xs text-gray-300">
              <span className="w-2 h-2 rounded-full bg-claw-green animate-pulse-neon" />
              Mycelial Singularity Engine v3.0 · GENESIS PROTOKOLL AKTIV
            </div>
          </motion.div>

          {/* VISUAL UPGRADE 2026: Heading with neon gradient text */}
          <motion.h1 variants={item} className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-black leading-tight font-heading">
            <span className="bg-gradient-to-r from-claw-green to-cyber-blue bg-clip-text text-transparent">ClawGuru</span>{" "}
            Mycelial Singularity Engine v3.0
          </motion.h1>

          <motion.p variants={item} className="mt-5 text-lg text-gray-300 max-w-xl">
            Das lebende Mycelium von 1M+ Runbooks. Jeder Knoten eine Wissenseinheit,
            jede Kante eine semantische Beziehung. Force-directed Graph, Darwinian Evolution
            Engine, und Oracle Mode – die fortschrittlichste Ops-Wissensdatenbank der Welt.
          </motion.p>

          {/* VISUAL UPGRADE 2026: CTA buttons with magnetic hover effect */}
          <motion.div variants={item} className="mt-8 flex flex-wrap gap-3">
            <a
              className="group relative px-5 py-3 rounded-xl font-black text-black bg-claw-green hover:shadow-neon-green transition-all duration-300 hover:scale-105"
              href="/mycelium"
            >
              {/* VISUAL UPGRADE 2026: Scan animation on primary CTA */}
              <span className="relative z-10 flex items-center gap-2">
                <Zap className="w-4 h-4" /> Living Mycelium →
              </span>
              <div className="absolute inset-0 rounded-xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-border-scan" />
              </div>
            </a>
            <a className="px-5 py-3 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-xl hover:bg-white/[0.06] hover:border-white/20 font-bold transition-all duration-300" href="/copilot">
              Ask Copilot
            </a>
            <a className="px-5 py-3 rounded-xl font-black bg-gradient-to-r from-orange-500 to-red-600 hover:opacity-90 shadow-glow2" href="/pricing">
              Pro Kits (Stripe)
            </a>
            <a className="px-5 py-3 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-xl hover:bg-white/[0.06] hover:border-white/20 font-bold transition-all duration-300" href="/intel">
              Intel Feed
            </a>
          </motion.div>

          {/* VISUAL UPGRADE 2026: Feature cards with glassmorphism and lucide icons */}
          <motion.div variants={item} className="mt-8 grid sm:grid-cols-3 gap-3 text-sm text-gray-300">
            <div className="p-4 rounded-2xl glass-card glass-card-hover">
              <div className="font-black flex items-center gap-2"><Cpu className="w-4 h-4 text-claw-green" /> Copilot</div>
              <div className="text-gray-400">Konversation → Runbook</div>
            </div>
            <div className="p-4 rounded-2xl glass-card glass-card-hover">
              <div className="font-black flex items-center gap-2"><Shield className="w-4 h-4 text-cyber-blue" /> Vault</div>
              <div className="text-gray-400">Referenzen & Patterns</div>
            </div>
            <div className="p-4 rounded-2xl glass-card glass-card-hover">
              <div className="font-black flex items-center gap-2"><BookOpen className="w-4 h-4 text-claw-green" /> Academy</div>
              <div className="text-gray-400">Sprints statt Kurse</div>
            </div>
          </motion.div>
        </motion.div>

        {/* VISUAL UPGRADE 2026: Right column with score counter + mini-copilot */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* VISUAL UPGRADE 2026: Security Score Counter with glow */}
          <div className="flex justify-center mb-8">
            <SecurityScoreCounter targetScore={94} label="Claw Security Score" />
          </div>

          <div className="glass-panel rounded-2xl p-6 md:p-7 shadow-neon-green/20">
            <div className="font-black text-lg font-heading">Mini-Copilot</div>
            <div className="text-sm text-gray-400 mt-1">
              Schreib dein Problem in 1 Satz. Wir leiten dich in den richtigen Hub.
            </div>

            <div className="mt-4 flex gap-3">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="z.B. 'ich glaube mein gateway ist exposed'"
                className="flex-1 px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-claw-green/30 focus:border-claw-green transition-all"
              />
              <a
                href={"/copilot?q=" + encodeURIComponent(q || "ich will hardening")}
                className="px-5 py-3 rounded-xl font-black bg-gradient-to-r from-orange-500 to-red-600 hover:opacity-90"
              >
                Los
              </a>
            </div>

            <div className="mt-6 text-sm text-gray-300">
              <div className="font-black mb-2">Beliebte Prompts</div>
              <div className="flex flex-wrap gap-2">
                {[
                  "Ich glaube ich bin exposed",
                  "Wie härte ich WebSockets?",
                  "Welche Provider sind stabil & günstig?",
                  "Was sind die Top 5 Misconfigs?"
                ].map((s) => (
                  <a key={s} href={"/copilot?q=" + encodeURIComponent(s)} className="px-3 py-2 rounded-xl glass-card glass-card-hover text-sm">
                    {s}
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-6 p-4 rounded-2xl glass-card text-xs text-gray-400">
              Kein Login. Keine Dark-Patterns. Nur eine Seite, die dich wirklich aus dem Feuer zieht.
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
