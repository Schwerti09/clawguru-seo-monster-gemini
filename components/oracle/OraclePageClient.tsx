"use client"

import { useMemo, useState } from "react"
import { usePathname } from "next/navigation"
import ScopeSelector from "./ScopeSelector"
import RiskList from "./RiskList"
import ExampleScopes from "./ExampleScopes"

function useLocalePrefix() {
  const pathname = usePathname()
  return useMemo(() => {
    if (!pathname) return ""
    const seg = pathname.split("/").filter(Boolean)[0]
    if (!seg) return ""
    if (seg.length <= 5) return `/${seg}`
    return ""
  }, [pathname])
}

export default function OraclePageClient({ dict }: { dict?: any }) {
  const prefix = useLocalePrefix()
  const [scope, setScope] = useState<string>("")
  const [data, setData] = useState<any | null>(null)

  return (
    <div className="space-y-8">
      <ScopeSelector value={scope} onChange={setScope} onScope={setScope} onData={setData} dict={dict} />
      {data && <RiskList risks={data} prefix={prefix} dict={dict} />}
      <ExampleScopes onSelect={(s) => setScope(s)} dict={dict} />
    </div>
  )
}
