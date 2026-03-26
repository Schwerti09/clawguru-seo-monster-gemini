"use client"

import React from "react"
import dynamic from "next/dynamic"

const PredictiveRadar = dynamic(() => import("@/components/intel/PredictiveRadar"), { ssr: false })
const MyceliumPreview = dynamic(() => import("@/components/intel/MyceliumPreview"), { ssr: false })

type IntelDict = {
  predictive_header?: string
  predictive_loading?: string
  predictive_error?: string
  fix_link_label?: string
  myceliumPreview_header?: string
}

export default function IntelClientBlock({ prefix = "", dict = {} as IntelDict }: { prefix?: string; dict?: IntelDict }) {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <PredictiveRadar prefix={prefix} dict={dict} />
      <MyceliumPreview prefix={prefix} dict={dict} />
    </div>
  )
}
