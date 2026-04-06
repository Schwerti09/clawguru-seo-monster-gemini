"use client"

import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"

export type ToolRunErrorCode =
  | "unauthorized"
  | "execution_limit"
  | "database_unconfigured"
  | "rate_limited"
  | "invalid_tool"
  | "invalid_json"
  | "db_error"
  | "network"

export type ToolRunResult =
  | { ok: true; executionId: string }
  | { ok: false; message: string; code?: ToolRunErrorCode }

export function mapToolRunErrorCode(code: string | undefined): string {
  switch (code) {
    case "execution_limit":
      return "Monatliches Ausführungslimit erreicht (Explorer)."
    case "unauthorized":
      return "Nicht angemeldet — bitte zuerst kaufen und aktivieren."
    case "database_unconfigured":
      return "Datenbank nicht konfiguriert (ADMIN: DATABASE_URL)."
    case "rate_limited":
      return "Zu viele Anfragen. Bitte kurz warten."
    default:
      return "Ausführung fehlgeschlagen."
  }
}

/** Shared client call for cockpit tool runs (Tools tab + QuickTools). */
export function useDashboardToolRun() {
  const router = useRouter()
  const [runningToolId, setRunningToolId] = useState<string | null>(null)

  const runTool = useCallback(
    async (toolId: string): Promise<ToolRunResult> => {
      setRunningToolId(toolId)
      try {
        const res = await fetch("/api/dashboard/tool-execution", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ toolId }),
          credentials: "include",
        })
        const data = (await res.json().catch(() => ({}))) as {
          ok?: boolean
          error?: string
          execution?: { id?: string }
        }
        if (!res.ok) {
          setRunningToolId(null)
          return {
            ok: false,
            message: mapToolRunErrorCode(data.error),
            code: data.error as ToolRunErrorCode | undefined,
          }
        }
        const id = data.execution?.id
        if (!id) {
          setRunningToolId(null)
          return { ok: false, message: "Antwort ungültig.", code: "db_error" }
        }
        router.refresh()
        setRunningToolId(null)
        return { ok: true, executionId: id }
      } catch {
        setRunningToolId(null)
        return { ok: false, message: "Netzwerkfehler.", code: "network" }
      }
    },
    [router]
  )

  return { runTool, runningToolId }
}
