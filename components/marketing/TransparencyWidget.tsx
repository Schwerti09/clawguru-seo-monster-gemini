"use client"

import Container from "@/components/shared/Container"
import { useI18n } from "@/components/i18n/I18nProvider"

export default function TransparencyWidget({ dict = {} }: { dict?: Record<string, string> }) {
  const { locale } = useI18n()
  const isGerman = locale === "de"
  return (
    <section className="py-14 border-t border-gray-800 bg-gray-950">
      <Container>
        <div className="rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900/70 to-gray-950 p-8">
          <h2 className="text-2xl font-black mb-2">{isGerman ? "Transparenz" : "Transparency"}</h2>
          <p className="text-gray-300 max-w-3xl">
            {isGerman
              ? (dict.transparency_sub_de || "ClawGuru ist kostenlos. Einige Empfehlungen sind Affiliate-Links. Wir kuratieren nach Nutzwert im echten Betrieb.")
              : (dict.transparency_sub_en || "ClawGuru is free. Some recommendations are affiliate links. We curate based on real operational value.")}
          </p>
          <div className="mt-6 grid md:grid-cols-3 gap-4 text-sm text-gray-300">
            <div className="p-4 rounded-xl border border-gray-800 bg-black/30">
              <div className="font-black text-gray-100">{isGerman ? (dict.transparency_card1_title_de || "1) Affiliate-Erloese") : (dict.transparency_card1_title_en || "1) Affiliate revenue")}</div>
              <div className="text-gray-400">{isGerman ? (dict.transparency_card1_desc_de || "Hosting & Security-Tools") : (dict.transparency_card1_desc_en || "Hosting & security tools")}</div>
            </div>
            <div className="p-4 rounded-xl border border-gray-800 bg-black/30">
              <div className="font-black text-gray-100">{isGerman ? (dict.transparency_card2_title_de || "2) Managed Ops") : (dict.transparency_card2_title_en || "2) Managed Ops")}</div>
              <div className="text-gray-400">{isGerman ? (dict.transparency_card2_desc_de || "Hardening, Monitoring, Wartung") : (dict.transparency_card2_desc_en || "Hardening, monitoring, maintenance")}</div>
            </div>
            <div className="p-4 rounded-xl border border-gray-800 bg-black/30">
              <div className="font-black text-gray-100">{isGerman ? (dict.transparency_card3_title_de || "3) Forschung/Berichte") : (dict.transparency_card3_title_en || "3) Research/Reports")}</div>
              <div className="text-gray-400">{isGerman ? (dict.transparency_card3_desc_de || "Verdichtete Lageberichte") : (dict.transparency_card3_desc_en || "Condensed situation reports")}</div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
