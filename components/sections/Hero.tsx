"use client"

import { motion } from "framer-motion"
import dynamic from "next/dynamic"
import { GlowButton } from "@/components/ui/GlowButton"

const MyceliumClientLoader = dynamic(() => import("@/components/visual/MyceliumClientLoader"), { ssr: false })

export const Hero = () => {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center px-6 py-20">
      {/* Starfield overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.12) 1px, transparent 1px)",
          backgroundSize: "3px 3px",
          maskImage: "radial-gradient(80% 80% at 50% 50%, black, transparent)",
        }}
      />
      <div className="max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-300 via-white to-fuchsia-400 bg-clip-text text-transparent">
            clawguru
          </h1>
          <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto mb-10">
            Next‑Generation Tech Solutions – schneller, smarter, besser.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <GlowButton variant="primary" href="/check">Loslegen</GlowButton>
            <GlowButton variant="outline" href="/vorstellung">Mehr erfahren</GlowButton>
          </div>

          {/* Mini tablet preview (fast) */}
          <div className="mt-10 mx-auto max-w-3xl">
            <div className="rounded-[24px] border border-white/10 bg-black/30 p-3 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
              <div className="relative aspect-[16/10] rounded-[18px] overflow-hidden bg-black/60">
                <MyceliumClientLoader ui="embed" />
                <a
                  href="/mycelium"
                  className="absolute right-3 top-3 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-100 border border-white/15 backdrop-blur bg-black/30 hover:bg-black/40"
                >
                  Expand Mycelium →
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
