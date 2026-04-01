"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import FeaturePreviewCard from "./FeaturePreviewCard"
import { motion } from "framer-motion"

type Risk = {
  cve_id: string
  title: string
  severity: "Critical" | "High" | "Medium"
  probability: number
  description: string
  recommended_runbook?: { slug: string; title: string; clawScore: number } | null
}

type Props = { prefix?: string; dict?: Record<string, string> }

export default function OraclePreviewCard({ prefix = "", dict = {} }: Props) {
  const [feedIdx, setFeedIdx] = useState(0)
  const [inView, setInView] = useState(false)

  const demoThreats: Risk[] = [
    {
      cve_id: "CVE-2026-1337",
      title: dict.oracle_cve_title || "OpenSSH pre‑auth RCE",
      severity: (dict.oracle_cve_severity || "Critical") as "Critical" | "High" | "Medium",
      probability: 91,
      description: dict.oracle_cve_desc || "Pre‑auth code execution in OpenSSH daemon under specific KEX paths.",
      recommended_runbook: { slug: "openssh-rce-hardening-2026", title: dict.oracle_cve_runbook || "OpenSSH Emergency Patch", clawScore: 98 },
    },
    {
      cve_id: "CVE-2026-2048",
      title: dict.oracle_xz_title || "XZ Utils supply‑chain backdoor",
      severity: (dict.oracle_xz_severity || "High") as "Critical" | "High" | "Medium",
      probability: 78,
      description: dict.oracle_xz_desc || "Backdoored liblzma pipeline enabling remote code exec in SSH auth path.",
      recommended_runbook: { slug: "xz-supply-chain-mitigation-2026", title: dict.oracle_xz_runbook || "XZ Backdoor Mitigation", clawScore: 96 },
    },
    {
      cve_id: "CVE-2025-9876",
      title: dict.oracle_nginx_title || "Nginx HTTP/2 rapid reset DoS",
      severity: (dict.oracle_nginx_severity || "High") as "Critical" | "High" | "Medium",
      probability: 64,
      description: dict.oracle_nginx_desc || "Resource exhaustion via HTTP/2 stream abuse on unpatched reverse proxies.",
      recommended_runbook: { slug: "nginx-http2-dos-hardening-2026", title: dict.oracle_nginx_runbook || "Nginx HTTP/2 DoS Hardening", clawScore: 94 },
    },
    {
      cve_id: "CVE-2026-2718",
      title: dict.oracle_k8s_title || "Kubernetes RBAC privilege escalation",
      severity: (dict.oracle_k8s_severity || "Medium") as "Critical" | "High" | "Medium",
      probability: 42,
      description: dict.oracle_k8s_desc || "Misconfigured ClusterRoles allow unauthorized workload mutations.",
      recommended_runbook: { slug: "k8s-rbac-audit-2026", title: dict.oracle_k8s_runbook || "K8s RBAC Audit & Lockdown", clawScore: 92 },
    },
  ]

  useEffect(() => {
    if (!inView) return
    const interval = setInterval(() => {
      setFeedIdx((i) => (i + 1) % demoThreats.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [inView, demoThreats.length])

  const containerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!containerRef.current) return
    const observer = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting),
      { threshold: 0.1 }
    )
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  const current = demoThreats[feedIdx]

  return (
    <FeaturePreviewCard
      title="Oracle"
      description="Real-time threat intelligence. Automated risk analysis for your infrastructure."
      link={`${prefix}/features/oracle`}
    >
      <div ref={containerRef} className="transition-all duration-700">
        <div className="space-y-4">
          <div className="bg-black/40 rounded-xl p-4 border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-cyan-400">{current.cve_id}</span>
              <span className={`text-xs px-2 py-1 rounded-full border ${
                current.severity === "Critical" ? "border-red-500/40 text-red-300" :
                current.severity === "High" ? "border-orange-500/40 text-orange-300" :
                "border-yellow-500/40 text-yellow-300"
              }`}>{current.severity}</span>
            </div>
            <h4 className="text-white font-medium mb-2">{current.title}</h4>
            <p className="text-sm text-gray-400 mb-3">{current.description}</p>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-500">{dict.oracle_probability_label || "Probability"}: </span>
                <span className="text-sm font-bold text-white">{current.probability}%</span>
              </div>
              {current.recommended_runbook && (
                <a
                  href={`${prefix}/runbook/${current.recommended_runbook.slug}`}
                  className="text-xs text-cyan-400 hover:text-cyan-300"
                >
                  {current.recommended_runbook.title} →
                </a>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            {demoThreats.map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                  i === feedIdx ? "bg-cyan-500" : "bg-gray-700"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </FeaturePreviewCard>
  )
}