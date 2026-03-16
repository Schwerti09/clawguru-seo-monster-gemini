import React from "react"

export const runtime = "nodejs"
export const maxDuration = 180

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
