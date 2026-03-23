"use client"

import { motion } from "framer-motion"
import { GlowButton } from "@/components/ui/GlowButton"
import { usePathname } from "next/navigation"
import { useMemo } from "react"

export const CTA = () => {
  const pathname = usePathname()
  const prefix = useMemo(() => {
    const first = (pathname || "").split("/")[1] || ""
    const isLang = /^[a-z]{2}(-[A-Z]{2})?$/.test(first)
    return isLang ? `/${first}` : ""
  }, [pathname])
  return (
    <section className="py-24 px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto text-center relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 p-12 md:p-20"
      >
        <h2 className="text-3xl md:text-5xl font-bold mb-6">Bereit für die Zukunft?</h2>
        <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
          Werde Teil von ClawGuru und erlebe, wie Technologie neu definiert wird.
        </p>
        <GlowButton variant="primary" href={`${prefix}/check`}>Jetzt starten →</GlowButton>
      </motion.div>
    </section>
  )
}
