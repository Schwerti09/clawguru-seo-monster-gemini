"use client"

import React from "react"

export default function UpgradeCTA(props: { prefix?: string; dict?: any }) {
  const { prefix = "", dict } = props
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-black/60 via-black/50 to-black/60 p-6">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <div className="text-sm text-cyan-300 mb-2">{dict?.upgrade_premium_label || "Premium"}</div>
              <h3 className="text-2xl font-black text-white">{dict?.upgrade_title || "Mehr Sichtbarkeit mit Daypass"}</h3>
              <p className="text-gray-300 mt-2 text-sm">
                {dict?.upgrade_text || "Vollständiger CVE‑Feed, Export (CSV/PDF), erweiterte Filter und automatische Runbook‑Ausführung."}
              </p>
            </div>
            <div className="text-right">
              <a href={`${prefix || ''}/daypass`} className="inline-flex items-center px-6 py-3 rounded-2xl font-black text-black"
                 style={{ background: "linear-gradient(135deg,#00e6a0,#00b8ff)" }}>
                {dict?.upgrade_button || "Daypass starten"}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
