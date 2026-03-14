"use client"

import { useI18n } from "@/components/i18n/I18nProvider"

export default function CopilotPreview() {
  const { locale } = useI18n()
  const prefix = `/${locale}`
  const isGerman = locale === "de"
  return (
    <div className="p-8 rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900/60 to-black shadow-glow2">
      <div className="text-sm text-gray-300">
        <div className="font-black text-lg">{isGerman ? "Beispiel: „Ich glaube mein Gateway ist exposed“" : "Example: “I think my gateway is exposed”"}</div>
        <div className="mt-3 space-y-2 text-gray-300">
          <div className="p-4 rounded-2xl border border-gray-800 bg-black/30">
            <div className="text-xs text-gray-500 mb-1">Copilot Output</div>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>{isGerman ? "Priorität: Keys rotieren" : "Priority: rotate keys"}</li>
              <li>{isGerman ? "Exposition schließen (private subnet/VPN)" : "Close exposure (private subnet/VPN)"}</li>
              <li>{isGerman ? "Logs sichern" : "Secure logs"}</li>
              <li>{isGerman ? "WS Origin/Token Binding prüfen" : "Check WS origin/token binding"}</li>
            </ul>
          </div>
          <div className="p-4 rounded-2xl border border-gray-800 bg-black/30">
            <div className="text-xs text-gray-500 mb-1">Links</div>
            <div className="flex flex-wrap gap-2">
              <a className="px-3 py-2 rounded-xl border border-gray-800 bg-black/20 hover:bg-black/30 text-sm" href={`${prefix}/security/notfall-leitfaden`}>Runbook</a>
              <a className="px-3 py-2 rounded-xl border border-gray-800 bg-black/20 hover:bg-black/30 text-sm" href={`${prefix}/tools`}>Validator</a>
              <a className="px-3 py-2 rounded-xl border border-gray-800 bg-black/20 hover:bg-black/30 text-sm" href={`${prefix}/academy`}>Sprint</a>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <a className="px-6 py-3 rounded-xl font-black bg-gradient-to-r from-brand-cyan to-brand-violet hover:opacity-90 shadow-glow2" href={`${prefix}/copilot`}>
          {isGerman ? "Copilot öffnen" : "Open Copilot"}
        </a>
        <a className="px-6 py-3 rounded-xl border border-gray-700 bg-gray-900/40 hover:bg-gray-900 rounded-xl font-bold" href={`${prefix}/tools`}>
          Tools
        </a>
      </div>
    </div>
  )
}
