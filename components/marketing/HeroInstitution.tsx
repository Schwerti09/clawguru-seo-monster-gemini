'use client'
// VISUAL UPGRADE 2026: Premium hero section with animated score counter,
// magnetic CTA buttons, and Framer Motion staggered animations.

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import SecurityScoreCounter from "@/components/visual/SecurityScoreCounter"
import { Shield, Cpu, BookOpen, Zap, LockKeyhole } from "lucide-react"
import type { Dictionary } from "@/lib/getDictionary"
import { useI18n } from "@/components/i18n/I18nProvider"

interface HeroInstitutionProps {
  dict?: Dictionary["hero"]
}

export default function HeroInstitution({ dict }: HeroInstitutionProps) {
  const { locale } = useI18n()
  const prefix = `/${locale}`
  const [q, setQ] = useState("")
  const [hasAccess, setHasAccess] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function checkAccess() {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" })
        if (!cancelled) setHasAccess(res.ok)
      } catch {
        if (!cancelled) setHasAccess(false)
      }
    }

    checkAccess()
    return () => {
      cancelled = true
    }
  }, [])

  // VISUAL UPGRADE 2026: Framer Motion stagger animation variants
  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }

  const accessHref = hasAccess ? `${prefix}/dashboard` : `${prefix}/account`
  const accessLabel = hasAccess ? "Dashboard öffnen" : "Zugang aktivieren"

  return (
    <div className="pt-28 pb-14">
      <div className="grid lg:grid-cols-2 gap-10 items-start">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div variants={item}>
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full glass-card text-xs text-gray-300">
              <span className="w-2 h-2 rounded-full bg-claw-green animate-pulse-neon" />
              {dict?.badge ?? "Mycelial Singularity Engine v4.0 · GENESIS PROTOKOLL AKTIV"}
            </div>
          </motion.div>

          <motion.h1 variants={item} className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-black leading-tight font-heading">
            <span className="bg-gradient-to-r from-claw-green to-cyber-blue bg-clip-text text-transparent">ClawGuru</span>{" "}
            {dict?.titleSuffix ?? "Mycelial Singularity Engine v4.0"}
          </motion.h1>

          <motion.p variants={item} className="mt-5 text-lg text-gray-300 max-w-xl">
            {dict?.subtitle ?? "Das lebende Mycelium von 1M+ Runbooks. Jeder Knoten eine Wissenseinheit, jede Kante eine semantische Beziehung. Force-directed Graph, Darwinian Evolution Engine, und Oracle Mode – die fortschrittlichste Ops-Wissensdatenbank der Welt."}
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-wrap gap-3">
            <a
              className="group relative px-5 py-3 rounded-xl font-black text-black bg-claw-green hover:shadow-neon-green transition-all duration-300 hover:scale-105"
              href={`${prefix}/mycelium`}
            >
              <span className="relative z-10 flex items-center gap-2">
                <Zap className="w-4 h-4" /> {dict?.ctaMycelium ?? "Living Mycelium →"}
              </span>
              <div className="absolute inset-0 rounded-xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-border-scan" />
              </div>
            </a>

            <a
              className="px-5 py-3 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-xl hover:bg-white/[0.06] hover:border-white/20 font-bold transition-all duration-300"
              href={`${prefix}/copilot`}
            >
              {dict?.ctaCopilot ?? "Ask Copilot"}
            </a>

            <a
              className="px-5 py-3 rounded-xl font-black bg-gradient-to-r from-orange-500 to-red-600 hover:opacity-90 shadow-glow2 flex items-center gap-2"
              href={accessHref}
            >
              <LockKeyhole className="w-4 h-4" />
              {accessLabel}
            </a>

            <a
              className="px-5 py-3 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-xl hover:bg-white/[0.06] hover:border-white/20 font-bold transition-all duration-300"
              href={`${prefix}/intel`}
            >
              {dict?.ctaIntel ?? "Intel Feed"}
            </a>
          </motion.div>

          <motion.div variants={item} className="mt-8 grid sm:grid-cols-3 gap-3 text-sm text-gray-300">
            <div className="p-4 rounded-2xl glass-card glass-card-hover">
              <div className="font-black flex items-center gap-2"><Cpu className="w-4 h-4 text-claw-green" /> {dict?.featureCopilot ?? "Copilot"}</div>
              <div className="text-gray-400">{dict?.featureCopilotDesc ?? "Konversation → Runbook"}</div>
            </div>
            <div className="p-4 rounded-2xl glass-card glass-card-hover">
              <div className="font-black flex items-center gap-2"><Shield className="w-4 h-4 text-cyber-blue" /> {dict?.featureVault ?? "Vault"}</div>
              <div className="text-gray-400">{dict?.featureVaultDesc ?? "Referenzen & Patterns"}</div>
            </div>
            <div className="p-4 rounded-2xl glass-card glass-card-hover">
              <div className="font-black flex items-center gap-2"><BookOpen className="w-4 h-4 text-claw-green" /> {dict?.featureAcademy ?? "Academy"}</div>
              <div className="text-gray-400">{dict?.featureAcademyDesc ?? "Sprints statt Kurse"}</div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex justify-center mb-8">
            <SecurityScoreCounter targetScore={94} label="Claw Security Score" />
          </div>

          <div className="glass-panel rounded-2xl p-6 md:p-7 shadow-neon-green/20">
            <div className="font-black text-lg font-heading">{dict?.miniCopilotTitle ?? "Mini-Copilot"}</div>
            <div className="text-sm text-gray-400 mt-1">
              {dict?.miniCopilotSubtitle ?? "Schreib dein Problem in 1 Satz. Wir leiten dich in den richtigen Hub."}
            </div>

            <div className="mt-4 flex gap-3">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={dict?.miniCopilotPlaceholder ?? "z.B. 'ich glaube mein gateway ist exposed'"}
                className="flex-1 px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-claw-green/30 focus:border-claw-green transition-all"
              />
              <a
                href={`${prefix}/copilot?q=` + encodeURIComponent(q || "ich will hardening")}
                className="px-5 py-3 rounded-xl font-black bg-gradient-to-r from-orange-500 to-red-600 hover:opacity-90"
              >
                {dict?.miniCopilotSubmit ?? "Los"}
              </a>
            </div>

            <div className="mt-6 text-sm text-gray-300">
              <div className="font-black mb-2">{dict?.popularPromptsTitle ?? "Beliebte Prompts"}</div>
              <div className="flex flex-wrap gap-2">
                {[
                  "Ich glaube ich bin exposed",
                  "Wie härte ich WebSockets?",
                  "Welche Provider sind stabil & günstig?",
                  "Was sind die Top 5 Misconfigs?"
                ].map((s) => (
                  <a key={s} href={`${prefix}/copilot?q=` + encodeURIComponent(s)} className="px-3 py-2 rounded-xl glass-card glass-card-hover text-sm">
                    {s}
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-6 p-4 rounded-2xl glass-card text-xs text-gray-400">
              {dict?.noLoginNote ?? "Kein Login. Keine Dark-Patterns. Nur eine Seite, die dich wirklich aus dem Feuer zieht."}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}