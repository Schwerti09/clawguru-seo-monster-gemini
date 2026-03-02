export default function IntelApiDocs() {
  return (
    <div className="mt-16 rounded-3xl border border-orange-900/40 bg-gradient-to-br from-orange-950/20 to-black p-8">
      <div className="flex flex-col lg:flex-row lg:items-start gap-8">
        {/* Header */}
        <div className="lg:w-72 shrink-0">
          <div className="inline-block text-[11px] font-mono uppercase tracking-[0.2em] px-3 py-1 rounded-full border mb-4"
            style={{ borderColor: "rgba(255,165,0,0.4)", color: "#ffaa00", background: "rgba(255,165,0,0.08)" }}>
            Enterprise · API
          </div>
          <h2 className="text-2xl font-black text-white">Intel Feed API</h2>
          <p className="mt-3 text-sm text-gray-300 leading-relaxed">
            Bindet den Intel Feed direkt in euer SIEM, SOC-Tooling oder eigenes Monitoring-Backend ein.
            REST/JSON – kein Dashboard-Klicken mehr.
          </p>
          <div className="mt-6 space-y-3 text-sm text-gray-300">
            <div className="flex items-start gap-2">
              <span className="mt-[2px] shrink-0 size-[18px] rounded-full flex items-center justify-center text-[9px] font-bold"
                style={{ background: "rgba(255,165,0,0.15)", color: "#ffaa00" }}>✓</span>
              <span>Bearer Token oder X-API-Key Auth</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-[2px] shrink-0 size-[18px] rounded-full flex items-center justify-center text-[9px] font-bold"
                style={{ background: "rgba(255,165,0,0.15)", color: "#ffaa00" }}>✓</span>
              <span>Filter nach <code className="text-orange-400">severity</code> & <code className="text-orange-400">category</code></span>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-[2px] shrink-0 size-[18px] rounded-full flex items-center justify-center text-[9px] font-bold"
                style={{ background: "rgba(255,165,0,0.15)", color: "#ffaa00" }}>✓</span>
              <span>Maschinenlesbare ISO-8601-Timestamps & Tags</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-[2px] shrink-0 size-[18px] rounded-full flex items-center justify-center text-[9px] font-bold"
                style={{ background: "rgba(255,165,0,0.15)", color: "#ffaa00" }}>✓</span>
              <span>Kein Polling-Overhead: <code className="text-orange-400">?limit=</code> unterstützt</span>
            </div>
          </div>
          <a
            href="/pricing#enterprise"
            className="mt-6 inline-block w-full text-center py-3 px-6 rounded-2xl font-black text-sm text-black transition-all duration-300 hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #ffaa00 0%, #ff5000 100%)" }}
          >
            Enterprise-Plan ansehen →
          </a>
        </div>

        {/* Code examples */}
        <div className="flex-1 space-y-5">
          <div>
            <div className="text-xs font-mono uppercase tracking-[0.15em] text-orange-400 mb-2">
              Alle Events abrufen
            </div>
            <pre className="rounded-xl bg-black/60 border border-gray-800 p-4 text-xs text-gray-300 overflow-x-auto whitespace-pre leading-relaxed">
{`GET /api/intel/feeds
Authorization: Bearer YOUR_API_KEY`}
            </pre>
          </div>

          <div>
            <div className="text-xs font-mono uppercase tracking-[0.15em] text-orange-400 mb-2">
              Nur High-Severity filtern
            </div>
            <pre className="rounded-xl bg-black/60 border border-gray-800 p-4 text-xs text-gray-300 overflow-x-auto whitespace-pre leading-relaxed">
{`GET /api/intel/feeds?severity=high&category=exposure
X-API-Key: YOUR_API_KEY`}
            </pre>
          </div>

          <div>
            <div className="text-xs font-mono uppercase tracking-[0.15em] text-orange-400 mb-2">
              Beispiel-Response
            </div>
            <pre className="rounded-xl bg-black/60 border border-gray-800 p-4 text-xs text-gray-300 overflow-x-auto whitespace-pre leading-relaxed">
{`{
  "object": "list",
  "total": 1,
  "updatedAt": "2026-02-20T12:00:00Z",
  "items": [
    {
      "id": "inc-001",
      "title": "Exposed Gateway → Token Leakage",
      "severity": "high",
      "category": "exposure",
      "when": "2026-02-20T00:00:00Z",
      "summary": "Public gateway endpoints without ...",
      "actions": ["Move to private subnet/VPN", ...],
      "tags": ["gateway", "token", "firewall"]
    }
  ]
}`}
            </pre>
          </div>

          <div className="rounded-xl border border-orange-900/30 bg-orange-950/20 p-4 text-sm text-gray-300">
            <span className="font-bold text-orange-300">API Key erhalten: </span>
            Enterprise-Zugang inkl. dedizierten API Key buchen unter{" "}
            <a href="/pricing" className="text-orange-400 hover:underline">/pricing</a>
            {" "}oder per Mail an{" "}
            <a href="mailto:enterprise@clawguru.org" className="text-orange-400 hover:underline">
              enterprise@clawguru.org
            </a>.
          </div>
        </div>
      </div>
    </div>
  )
}
