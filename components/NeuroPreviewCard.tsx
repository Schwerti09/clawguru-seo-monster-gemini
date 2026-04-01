"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import FeaturePreviewCard from "./FeaturePreviewCard"
import { motion } from "framer-motion"

type Threat = {
  id: string
  title: string
  severity: "Critical" | "High" | "Medium" | "Low"
  cvss: number
  clawScore: number
}

type Props = { prefix?: string; dict?: Record<string, string> }

export default function NeuroPreviewCard({ prefix = "", dict = {} }: Props) {
  const [threats, setThreats] = useState<Threat[]>([])
  const [loading, setLoading] = useState(true)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    if (!inView) return
    // Simulate AI analysis
    setLoading(true)
    const timer = setTimeout(() => {
      setThreats([
        {
          id: "threat-1",
          title: "SQL Injection in Auth Service",
          severity: "High",
          cvss: 8.1,
          clawScore: 87,
        },
        {
          id: "threat-2", 
          title: "Outdated OpenSSL Version",
          severity: "Medium",
          cvss: 6.5,
          clawScore: 72,
        },
        {
          id: "threat-3",
          title: "Weak Password Policy",
          severity: "Low",
          cvss: 3.1,
          clawScore: 45,
        },
      ])
      setLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [inView])

  const containerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!containerRef.current) return
    const observer = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting),
      { threshold: 0.1 }
    )
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  const severityColor = (s: string) => {
    switch (s) {
      case "Critical": return "text-red-400"
      case "High": return "text-orange-400"
      case "Medium": return "text-yellow-400"
      default: return "text-green-400"
    }
  }

  return (
    <FeaturePreviewCard
      title={dict.neuro_title || "AI Vulnerability Analysis"}
      description={`${dict.neuro_desc1 || "Proactive risk identification"} – ${dict.neuro_desc2 || "Code & infrastructure"}`}
      link={`${prefix}/features/neuro`}
    >
      <div ref={containerRef} className="transition-all duration-700">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-black/40 rounded-xl p-4 border border-white/10">
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : threats.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            {dict.neuro_no_threats || "No threats found"}
          </div>
        ) : (
          <div className="space-y-3">
            {threats.map((threat) => (
              <motion.div
                key={threat.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-black/40 rounded-xl p-4 border border-white/10"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-medium">{threat.title}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full border ${severityColor(threat.severity)} border-current`}>
                    {dict[`neuro_${threat.severity.toLowerCase()}`] || threat.severity}
                  </span>
                </div>
                <div className="flex gap-4 text-xs">
                  <span className="text-gray-400">
                    {dict.neuro_cvss || "CVSS"}: {threat.cvss}
                  </span>
                  <span className="text-cyan-400">
                    {dict.neuro_clawscore || "ClawScore"}: {threat.clawScore}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </FeaturePreviewCard>
  )
}