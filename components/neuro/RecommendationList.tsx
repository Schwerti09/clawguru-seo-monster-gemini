import Link from "next/link"

export default function RecommendationList({ data, prefix = "" }: { data: any; prefix?: string }) {
  const recs = data?.recommended_runbooks || []
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Empfohlene Runbooks</h3>
      {recs.slice(0, 5).map((rb: any) => (
        <div key={rb.slug} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-cyan-500/30 transition">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h4 className="text-lg font-medium text-white">{rb.title}</h4>
              <p className="text-sm text-gray-400 mt-1">{rb.summary}</p>
            </div>
            <Link href={`${prefix}/runbook/${rb.slug}`} className="text-cyan-400 hover:text-cyan-300 shrink-0">
              Ansehen →
            </Link>
          </div>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <span className="bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded-full">Score {rb.clawScore}%</span>
            {typeof rb.relevance === "number" && (
              <span className="bg-white/10 text-gray-300 px-2 py-1 rounded-full">Relevanz {rb.relevance}%</span>
            )}
          </div>
        </div>
      ))}
      {data?.execution_plan && (
        <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10">
          <p className="text-gray-200">{data.execution_plan}</p>
          <p className="text-sm text-gray-400 mt-1">Geschätzte Zeit: {data.estimated_time}</p>
        </div>
      )}
      {recs.length > 0 && recs[0].relevance >= 80 && (
        <div className="bg-gradient-to-r from-cyan-500/20 to-transparent rounded-xl p-4 border border-cyan-500/30">
          <p className="text-cyan-300">
            🚀 Hohe Relevanz erkannt – mit Daypass kannst du diese Runbooks automatisch ausführen und den Nachweis exportieren.
          </p>
          <Link href={`${prefix}/pricing`} className="inline-block mt-2 text-white bg-cyan-600 hover:bg-cyan-500 px-4 py-2 rounded-full text-sm">
            Daypass sichern
          </Link>
        </div>
      )}
    </div>
  )
}
