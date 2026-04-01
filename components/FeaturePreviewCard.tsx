"use client"

import { motion } from "framer-motion"
import React from "react"
import { useI18n } from "@/components/i18n/I18nProvider"

type Props = {
  title: string
  description: string
  link: string
  children: React.ReactNode
}

export default function FeaturePreviewCard({ title, description, link, children }: Props) {
  const { dict } = useI18n()
  const p = (dict as any)?.previews ?? {}
  const learnMore = p.learnMore || "Learn more →"
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
      className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(0,255,157,0.2)]"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-cyan-500/10 to-transparent rounded-full -z-10 pointer-events-none" aria-hidden />
      <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent">
        {title}
      </h3>
      <p className="text-gray-400 mt-2">{description}</p>
      <div className="mt-4">{children}</div>
      <div className="mt-6 flex justify-end">
        <a href={link} className="text-sm text-cyan-400 hover:text-cyan-300 transition">
          {learnMore}
        </a>
      </div>
    </motion.div>
  )
}
