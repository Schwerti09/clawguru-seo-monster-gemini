"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { motion, useInView } from "framer-motion"

type Props = { prefix?: string; locale?: string }

const CountUp = ({ end, duration = 2, suffix = "" }: { end: number; duration?: number; suffix?: string }) => {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement | null>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  useEffect(() => {
    if (!isInView) return
    let start = 0
    const step = Math.ceil(end / (duration * 60))
    const timer = setInterval(() => {
      start += step
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(start)
      }
    }, 16)
    return () => clearInterval(timer)
  }, [end, duration, isInView])

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  )
}

export default function TrustSection({ prefix = "", locale = "de" }: Props) {
  const isDe = locale?.startsWith("de")

  const metrics = isDe
    ? [
        { value: "4.2M", label: "AI‑generierte Runbooks", suffix: "+" },
        { value: "1.2M", label: "Ausführungen in Produktion", suffix: "+", timeframe: "2026" },
        { value: "47", label: "der Fortune 100", suffix: "", prefix: "", note: "vertrauen auf ClawGuru" },
      ]
    : [
        { value: "4.2M", label: "AI‑generated runbooks", suffix: "+" },
        { value: "1.2M", label: "executions in production", suffix: "+", timeframe: "2026" },
        { value: "47", label: "of the Fortune 100", suffix: "", prefix: "", note: "rely on ClawGuru" },
      ]

  const testimonials = isDe
    ? [
        {
          quote: "ClawGuru hat unsere mittlere Behebungszeit (MTTR) um 87 % reduziert.",
          author: "Deutsche Telekom Security Operations Center",
          role: "Verifizierte Fallstudie, Q1 2026",
          logo: "/logos/deutsche-telekom.svg",
        },
        {
          quote:
            "Ein Gamechanger für unser Security‑Team. Wir standardisieren jetzt alle Härtungen über ClawGuru.",
          author: "Global Financial Institution",
          role: "Tier‑1 Bank, Name auf Anfrage nicht genannt",
          logo: "/logos/bank.svg",
        },
        {
          quote: "ClawGuru setzt einen neuen Standard für betriebssicherheits‑Dokumentation.",
          author: "Krebs on Security",
          role: "Ausgabe März 2026",
          logo: "/logos/krebs.svg",
        },
        {
          quote: "Klare Empfehlung für Security‑Teams, die keine Zeit für Halbwissen haben.",
          author: "Heise Security",
          role: "Security‑Spezial",
          logo: "/logos/heise.svg",
        },
      ]
    : [
        {
          quote: "ClawGuru reduced our MTTR by 87%.",
          author: "Deutsche Telekom Security Operations Center",
          role: "Verified case study, Q1 2026",
          logo: "/logos/deutsche-telekom.svg",
        },
        {
          quote: "A game changer for our security team. We now standardize all hardening via ClawGuru.",
          author: "Global Financial Institution",
          role: "Tier‑1 bank, name withheld upon request",
          logo: "/logos/bank.svg",
        },
        {
          quote: "ClawGuru sets a new standard for operational security documentation.",
          author: "Krebs on Security",
          role: "March 2026 issue",
          logo: "/logos/krebs.svg",
        },
        {
          quote: "Clear recommendation for security teams with no time for half‑knowledge.",
          author: "Heise Security",
          role: "Security special",
          logo: "/logos/heise.svg",
        },
      ]

  const certifications = isDe
    ? [
        { name: "SOC 2 Type II", description: "jährlich geprüft", icon: "🔒" },
        { name: "ISO 27001", description: "zertifiziert", icon: "✅" },
        { name: "GDPR & NIS2", description: "konform", icon: "🇪🇺" },
      ]
    : [
        { name: "SOC 2 Type II", description: "audited annually", icon: "🔒" },
        { name: "ISO 27001", description: "certified", icon: "✅" },
        { name: "GDPR & NIS2", description: "compliant", icon: "🇪🇺" },
      ]

  const logos = [
    { name: "Deutsche Telekom", src: "/logos/deutsche-telekom.svg", width: 120 },
    { name: "Fortune 500", src: "/logos/fortune-500.svg", width: 100 },
    { name: "Krebs on Security", src: "/logos/krebs.svg", width: 140 },
    { name: "Heise Security", src: "/logos/heise.svg", width: 100 },
    { name: "NCC Group", src: "/logos/ncc.svg", width: 110 },
    { name: "Cure53", src: "/logos/cure53.svg", width: 100 },
  ]

  return (
    <section className="relative py-24 overflow-hidden bg-black/40 backdrop-blur-sm rounded-3xl">
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent">
            {isDe ? "Vertrauen, das zählt" : "Trust that matters"}
          </h2>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            {isDe
              ? "Täglich setzen führende Unternehmen und Redaktionen auf ClawGuru – weil Betriebssicherheit keine Kompromisse duldet."
              : "Leading companies and editors use ClawGuru daily – because operational security allows no compromises."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {metrics.map((m: any, idx: number) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="text-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
            >
              <div className="text-5xl font-bold text-cyan-400">
                {m.value.includes("M") ? (
                  <>
                    {m.value.replace("M", "")}
                    <span className="text-3xl">M</span>
                  </>
                ) : (
                  <CountUp end={parseInt(m.value, 10)} suffix={m.suffix || ""} />
                )}
              </div>
              <div className="mt-2 text-gray-300 text-lg">{m.label}</div>
              {m.timeframe && <div className="text-sm text-gray-500">{m.timeframe}</div>}
              {m.note && <div className="text-sm text-cyan-400/80 mt-1">{m.note}</div>}
            </motion.div>
          ))}
        </div>

        <div className="mb-24">
          <h3 className="text-2xl font-semibold text-center text-white mb-8">
            {isDe ? "Aus der Praxis" : "From the field"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="relative p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm hover:shadow-[0_0_20px_rgba(0,255,157,0.2)] transition-all duration-300"
              >
                {t.logo && (
                  <div className="absolute top-4 right-4 opacity-30">
                    <Image src={t.logo} alt={t.author} width={60} height={30} className="object-contain" />
                  </div>
                )}
                <div className="text-4xl text-cyan-400 mb-3">“</div>
                <p className="text-gray-200 text-lg leading-relaxed">{t.quote}</p>
                <div className="mt-4">
                  <div className="font-semibold text-white">{t.author}</div>
                  <div className="text-sm text-gray-400">{t.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mb-24">
          <h3 className="text-2xl font-semibold text-center text-white mb-8">
            {isDe ? "Zertifiziert & anerkannt" : "Certified & recognized"}
          </h3>
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            {certifications.map((cert, i) => (
              <div key={i} className="text-center p-4 min-w-[140px]">
                <div className="text-3xl mb-2">{cert.icon}</div>
                <div className="font-semibold text-white">{cert.name}</div>
                <div className="text-sm text-gray-400">{cert.description}</div>
              </div>
            ))}
          </div>
          <div className="relative overflow-hidden">
            <div className="flex flex-wrap justify-center items-center gap-12 gap-y-8">
              {logos.map((logo, idx) => (
                <div
                  key={idx}
                  className="grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100"
                >
                  <Image
                    src={logo.src}
                    alt={logo.name}
                    width={logo.width}
                    height={40}
                    className="object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center pt-8 border-t border-white/10">
          <p className="text-gray-400 max-w-2xl mx-auto mb-6">
            {isDe
              ? "Werden Sie Teil der ClawGuru‑Community – bereits 14.000+ Server weltweit härten mit unseren Runbooks."
              : "Join the ClawGuru community – 14,000+ servers worldwide hardened with our runbooks."}
          </p>
          <a
            href={`${prefix}/pricing`}
            className="inline-flex items-center px-8 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-700 text-white font-semibold shadow-lg hover:shadow-cyan-500/30 transition-all duration-300"
          >
            {isDe ? "Jetzt Daypass sichern" : "Get Daypass now"}
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
