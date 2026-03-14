"use client"

import Container from "@/components/shared/Container"
import { useI18n } from "@/components/i18n/I18nProvider"

export default function TransparencyWidget() {
  const { locale } = useI18n()
  const isGerman = locale === "de"
  return (
    <section className="py-14 border-t border-gray-800 bg-gray-950">
      <Container>
        <div className="rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900/70 to-gray-950 p-8">
          <h2 className="text-2xl font-black mb-2">{isGerman ? "Transparenz" : "Transparency"}</h2>
          <p className="text-gray-300 max-w-3xl">
            {isGerman
              ? "ClawGuru ist kostenlos. Einige Empfehlungen sind Affiliate-Links. Wir kuratieren nach Nutzwert im echten Betrieb."
              : "ClawGuru is free. Some recommendations are affiliate links. We curate based on real operational value."}
          </p>
          <div className="mt-6 grid md:grid-cols-3 gap-4 text-sm text-gray-300">
            <div className="p-4 rounded-xl border border-gray-800 bg-black/30">
              <div className="font-black text-gray-100">{isGerman ? "1) Affiliate-Erlöse" : "1) Affiliate revenue"}</div>
              <div className="text-gray-400">{isGerman ? "Hosting & Security-Tools" : "Hosting & security tools"}</div>
            </div>
            <div className="p-4 rounded-xl border border-gray-800 bg-black/30">
              <div className="font-black text-gray-100">2) Managed Ops</div>
              <div className="text-gray-400">{isGerman ? "Hardening, Monitoring, Wartung" : "Hardening, monitoring, maintenance"}</div>
            </div>
            <div className="p-4 rounded-xl border border-gray-800 bg-black/30">
              <div className="font-black text-gray-100">3) Research/Reports</div>
              <div className="text-gray-400">{isGerman ? "Verdichtete Lageberichte" : "Condensed situation reports"}</div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
