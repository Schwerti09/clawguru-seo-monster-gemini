import Link from "next/link"

export default function RiskList({ risks, prefix = "" }: { risks: any; prefix?: string }) {
  const items = Array.isArray(risks?.critical_risk) ? risks.critical_risk : []
  return (
    <div className="space-y-4">
      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
        <p className="text-gray-200">{risks?.summary || ""}</p>
        {risks?.timeline && (
          <p className="text-sm text-gray-400 mt-2">Erste kritische Bedrohung erwartet ab: {risks.timeline}</p>
        )}
      </div>

      {items.length > 0 ? (
        <>
          <h3 className="text-xl font-semibold mt-6">Kritische Risiken</h3>
          {items.slice(0, 5).map((risk: any, idx: number) => (
            <div key={idx} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-cyan-500/30 transition">
              <div className="flex justify-between items-start flex-wrap gap-2">
                <div>
                  <a
                    href={`https://nvd.nist.gov/vuln/detail/${risk.cve_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 font-mono text-sm"
                  >
                    {risk.cve_id} ↗
                  </a>
                  <h4 className="text-lg font-medium mt-1">{risk.title}</h4>
                </div>
                <span className="text-sm bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded-full">
                  Wahrscheinlichkeit {risk.probability}%
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {(risk.services || []).map((service: string) => (
                  <span key={service} className="text-xs bg-white/10 text-gray-300 px-2 py-1 rounded-full">
                    {service}
                  </span>
                ))}
              </div>
              <div className="mt-3">
                <div className="w-full bg-gray-700 rounded-full h-1">
                  <div className="bg-cyan-500 h-1 rounded-full" style={{ width: `${risk.probability || 0}%` }} />
                </div>
              </div>
              {risk.recommended_runbook && (
                <div className="mt-3">
                  <Link href={`${prefix}/runbook/${risk.recommended_runbook}`} className="text-sm text-cyan-400 hover:text-cyan-300">
                    Empfohlenes Runbook → {risk.recommended_runbook}
                  </Link>
                </div>
              )}
            </div>
          ))}
        </>
      ) : (
        <div className="text-center text-gray-400 py-12">Keine akuten Risiken für den gewählten Scope erkannt. 🛡️</div>
      )}
    </div>
  )
}
