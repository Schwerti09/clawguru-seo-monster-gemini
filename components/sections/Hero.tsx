"use client"

import { GlowButton } from "@/components/ui/GlowButton"
import HeroPreview from "@/components/home/HeroPreview"
import { usePathname } from "next/navigation"
import { useMemo } from "react"

export const Hero = () => {
  const pathname = usePathname()
  const prefix = useMemo(() => {
    const first = (pathname || "").split("/")[1] || ""
    const isLang = /^[a-z]{2}(-[A-Z]{2})?$/.test(first)
    return isLang ? `/${first}` : ""
  }, [pathname])
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
        <div className="animate-fade-in-up" style={{ animationDuration: '0.8s' }}>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-300 via-white to-fuchsia-400 bg-clip-text text-transparent">
            clawguru
          </h1>
          <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto mb-10">
            Next‑Generation Tech Solutions – schneller, smarter, besser.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <GlowButton variant="primary" href={`${prefix}/check`}>Loslegen</GlowButton>
            <GlowButton variant="outline" href={`${prefix}/vorstellung`}>Mehr erfahren</GlowButton>
          </div>

          {/* High-tech platform preview (perf-optimized) */}
          <HeroPreview />
        </div>
      </div>
    </section>
  )
}
