"use client"
// APPROVED REMEDIATION SWARM v3.2 SAFE – Overlord AI
// ApprovedSwarmPanel – Proposed Actions list (Approve / Modify / Reject) + Full Audit Log
// + Compliance Report export. Every action requires explicit human approval.
// Read-only until each action is individually approved.

import { useState, useCallback } from "react"
import type {
  ApprovedSwarmPlan,
  ProposedAction,
  AuditLogEntry,
  ActionApprovalStatus,
} from "@/lib/swarm"

// APPROVED REMEDIATION SWARM v3.2 SAFE – Overlord AI: Severity badge colours
const SEV_BADGE: Record<ProposedAction["severity"], string> = {
  critical: "text-red-400 border-red-500/40 bg-red-500/10",
  high:     "text-orange-400 border-orange-500/40 bg-orange-500/10",
  medium:   "text-yellow-400 border-yellow-500/40 bg-yellow-500/10",
  low:      "text-gray-400 border-gray-600/40 bg-gray-700/10",
}

// APPROVED REMEDIATION SWARM v3.2 SAFE – Overlord AI: Status badge colours
const STATUS_BADGE: Record<ActionApprovalStatus, string> = {
  pending:  "text-cyan-400 border-cyan-500/40 bg-cyan-500/10",
  approved: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10",
  rejected: "text-red-400 border-red-600/40 bg-red-500/10",
  modified: "text-violet-400 border-violet-500/40 bg-violet-500/10",
}

// APPROVED REMEDIATION SWARM v3.2 SAFE – Overlord AI: Audit action labels
const AUDIT_LABELS: Record<AuditLogEntry["action"], string> = {
  plan_created:               "📋 Plan Created",
  action_approved:            "✅ Action Approved",
  action_rejected:            "❌ Action Rejected",
  action_modified:            "✏️ Action Modified",
  kill_switch_activated:      "🛑 Kill-Switch Activated",
  swarm_recalled:             "⏏ Swarm Recalled",
  compliance_report_exported: "📄 Compliance Report Exported",
}

function relTime(ms: number): string {
  const delta = Math.max(0, Date.now() - ms)
  if (delta < 60_000) return `${Math.floor(delta / 1000)}s ago`
  if (delta < 3_600_000) return `${Math.floor(delta / 60_000)}m ago`
  return `${Math.floor(delta / 3_600_000)}h ago`
}

// APPROVED REMEDIATION SWARM v3.2 SAFE – Overlord AI: Single proposed action card
function ActionCard({
  action,
  onApprove,
  onReject,
  onModify,
}: {
  action: ProposedAction
  onApprove: (id: string) => void
  onReject: (id: string) => void
  onModify: (id: string, note: string) => void
}) {
  const [showModify, setShowModify] = useState(false)
  const [note, setNote] = useState("")
  const isPending = action.status === "pending"

  function handleModify() {
    if (!note.trim()) return
    onModify(action.id, note.trim())
    setShowModify(false)
    setNote("")
  }

  return (
    <div className={`rounded-2xl border p-5 transition-all ${
      action.status === "approved" ? "border-emerald-500/30 bg-emerald-500/5" :
      action.status === "rejected" ? "border-red-600/30 bg-red-500/5 opacity-60" :
      action.status === "modified" ? "border-violet-500/30 bg-violet-500/5" :
      "border-gray-800 bg-black/30"
    }`}>
      {/* APPROVED REMEDIATION SWARM v3.2 SAFE – Overlord AI: Header row */}
      <div className="flex flex-wrap items-start gap-2 mb-3">
        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${SEV_BADGE[action.severity]}`}>
          {action.severity}
        </span>
        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${STATUS_BADGE[action.status]}`}>
          {action.status}
        </span>
        <span className="ml-auto text-[10px] font-mono text-gray-600">{action.id}</span>
      </div>

      <div className="font-black text-sm text-gray-100 mb-1">{action.title}</div>
      <p className="text-xs text-gray-400 leading-relaxed mb-3">{action.description}</p>

      {/* APPROVED REMEDIATION SWARM v3.2 SAFE – Overlord AI: Metadata row */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-gray-600 font-mono mb-3">
        <span>🤖 {action.agentId}</span>
        <span>📍 {action.zone}</span>
        <span>🗂 {action.scope}</span>
        <span>📎 {action.artifactRef}</span>
        <span>🕐 {relTime(new Date(action.proposedAt).getTime())}</span>
      </div>

      {/* APPROVED REMEDIATION SWARM v3.2 SAFE – Overlord AI: Modification note if set */}
      {action.modificationNote && (
        <div className="mb-3 rounded-lg border border-violet-500/20 bg-violet-500/5 px-3 py-2 text-xs text-violet-300">
          <span className="font-black">Modification note:</span> {action.modificationNote}
        </div>
      )}

      {/* APPROVED REMEDIATION SWARM v3.2 SAFE – Overlord AI: Approval controls (only when pending) */}
      {isPending && (
        <>
          {!showModify ? (
            <div className="flex flex-wrap gap-2 mt-2">
              <button
                type="button"
                onClick={() => onApprove(action.id)}
                className="px-4 py-1.5 rounded-xl border border-emerald-500/50 bg-emerald-500/10 text-emerald-300 text-xs font-black hover:bg-emerald-500/20 transition-colors"
                aria-label={`Approve action: ${action.title}`}
              >
                ✅ Approve
              </button>
              <button
                type="button"
                onClick={() => setShowModify(true)}
                className="px-4 py-1.5 rounded-xl border border-violet-500/50 bg-violet-500/10 text-violet-300 text-xs font-black hover:bg-violet-500/20 transition-colors"
                aria-label={`Modify action: ${action.title}`}
              >
                ✏️ Modify
              </button>
              <button
                type="button"
                onClick={() => onReject(action.id)}
                className="px-4 py-1.5 rounded-xl border border-red-600/50 bg-red-500/10 text-red-400 text-xs font-black hover:bg-red-500/20 transition-colors"
                aria-label={`Reject action: ${action.title}`}
              >
                ❌ Reject
              </button>
            </div>
          ) : (
            // APPROVED REMEDIATION SWARM v3.2 SAFE – Overlord AI: Inline modify form
            <div className="mt-2 flex flex-col gap-2">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Enter modification note (required)…"
                className="w-full rounded-xl border border-violet-500/30 bg-black/40 px-3 py-2 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-violet-500/60 resize-none"
                rows={2}
                maxLength={280}
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleModify}
                  disabled={!note.trim()}
                  className="px-4 py-1.5 rounded-xl border border-violet-500/50 bg-violet-500/10 text-violet-300 text-xs font-black hover:bg-violet-500/20 disabled:opacity-40 transition-colors"
                >
                  Submit Modification
                </button>
                <button
                  type="button"
                  onClick={() => { setShowModify(false); setNote("") }}
                  className="px-4 py-1.5 rounded-xl border border-gray-700 bg-black/20 text-gray-500 text-xs hover:text-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* APPROVED REMEDIATION SWARM v3.2 SAFE – Overlord AI: Show actioned-by info when resolved */}
      {!isPending && action.actionedBy && (
        <div className="mt-2 text-[11px] font-mono text-gray-600">
          {action.status === "approved" ? "✅" : action.status === "rejected" ? "❌" : "✏️"}{" "}
          {action.actionedBy} · {action.actionedAt ? relTime(new Date(action.actionedAt).getTime()) : ""}
        </div>
      )}
    </div>
  )
}

// APPROVED REMEDIATION SWARM v3.2 SAFE – Overlord AI: Audit log row
function AuditRow({ entry }: { entry: AuditLogEntry }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-gray-800/60 last:border-0">
      <div className="text-[11px] font-mono text-gray-600 shrink-0 w-[90px] pt-0.5">
        {new Date(entry.timestampMs).toLocaleTimeString()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-semibold text-gray-300">{AUDIT_LABELS[entry.action]}</div>
        <div className="text-[11px] text-gray-500 mt-0.5 leading-snug">{entry.detail}</div>
        {entry.targetActionId && (
          <div className="text-[10px] font-mono text-gray-700 mt-0.5">{entry.targetActionId}</div>
        )}
      </div>
      <div className="text-[10px] font-mono text-gray-700 shrink-0">{entry.actor}</div>
    </div>
  )
}

// APPROVED REMEDIATION SWARM v3.2 SAFE – Overlord AI: Progress bar
function ApprovalProgress({ plan }: { plan: ApprovedSwarmPlan }) {
  const pct = plan.totalActions > 0
    ? Math.round(((plan.approvedActions + plan.rejectedActions) / plan.totalActions) * 100)
    : 0
  return (
    <div className="rounded-2xl border border-gray-800 bg-black/25 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">Review Progress</span>
        <span className="text-xs font-mono text-gray-400">{pct}% reviewed</span>
      </div>
      <div className="h-2 rounded-full bg-gray-800 overflow-hidden mb-3">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <div className="text-lg font-black font-mono text-cyan-400">{plan.pendingActions}</div>
          <div className="text-[10px] text-gray-600 uppercase tracking-wide">Pending</div>
        </div>
        <div>
          <div className="text-lg font-black font-mono text-emerald-400">{plan.approvedActions}</div>
          <div className="text-[10px] text-gray-600 uppercase tracking-wide">Approved</div>
        </div>
        <div>
          <div className="text-lg font-black font-mono text-red-400">{plan.rejectedActions}</div>
          <div className="text-[10px] text-gray-600 uppercase tracking-wide">Rejected</div>
        </div>
      </div>
    </div>
  )
}

// APPROVED REMEDIATION SWARM v3.2 SAFE – Overlord AI: Component props
interface Props {
  initialPlan: ApprovedSwarmPlan
}

/**
 * APPROVED REMEDIATION SWARM v3.2 SAFE – Overlord AI
 * Full approval-workflow panel: proposed actions list with per-action
 * Approve / Modify / Reject controls, live audit log, and compliance export.
 * No action executes without explicit human approval.
 */
export default function ApprovedSwarmPanel({ initialPlan }: Props) {
  const [plan, setPlan] = useState<ApprovedSwarmPlan>(initialPlan)
  const [killSwitchActive, setKillSwitchActive] = useState(false)
  const [exportDone, setExportDone] = useState(false)
  const [activeTab, setActiveTab] = useState<"actions" | "audit">("actions")

  // APPROVED REMEDIATION SWARM v3.2 SAFE – Overlord AI: Add an audit entry and update plan counters
  const addAudit = useCallback((entry: Omit<AuditLogEntry, "id">) => {
    setPlan((prev) => ({
      ...prev,
      auditLog: [
        { ...entry, id: `audit-${prev.planId}-${prev.auditLog.length}` },
        ...prev.auditLog,
      ],
    }))
  }, [])

  // APPROVED REMEDIATION SWARM v3.2 SAFE – Overlord AI: Approve a proposed action
  const handleApprove = useCallback((actionId: string) => {
    const now = new Date().toISOString()
    setPlan((prev) => {
      const actions = prev.proposedActions.map((a) =>
        a.id === actionId
          ? { ...a, status: "approved" as ActionApprovalStatus, actionedAt: now, actionedBy: "Security Operator" }
          : a
      )
      const approved = actions.filter((a) => a.status === "approved").length
      const rejected = actions.filter((a) => a.status === "rejected").length
      const pending = actions.filter((a) => a.status === "pending").length
      return { ...prev, proposedActions: actions, approvedActions: approved, rejectedActions: rejected, pendingActions: pending }
    })
    const action = plan.proposedActions.find((a) => a.id === actionId)
    addAudit({
      timestampMs: Date.now(),
      actor: "Security Operator",
      action: "action_approved",
      targetActionId: actionId,
      detail: `Action approved: "${action?.title ?? actionId}"`,
    })
  }, [plan.proposedActions, addAudit])

  // APPROVED REMEDIATION SWARM v3.2 SAFE – Overlord AI: Reject a proposed action
  const handleReject = useCallback((actionId: string) => {
    const now = new Date().toISOString()
    setPlan((prev) => {
      const actions = prev.proposedActions.map((a) =>
        a.id === actionId
          ? { ...a, status: "rejected" as ActionApprovalStatus, actionedAt: now, actionedBy: "Security Operator" }
          : a
      )
      const approved = actions.filter((a) => a.status === "approved").length
      const rejected = actions.filter((a) => a.status === "rejected").length
      const pending = actions.filter((a) => a.status === "pending").length
      return { ...prev, proposedActions: actions, approvedActions: approved, rejectedActions: rejected, pendingActions: pending }
    })
    const action = plan.proposedActions.find((a) => a.id === actionId)
    addAudit({
      timestampMs: Date.now(),
      actor: "Security Operator",
      action: "action_rejected",
      targetActionId: actionId,
      detail: `Action rejected: "${action?.title ?? actionId}"`,
    })
  }, [plan.proposedActions, addAudit])

  // APPROVED REMEDIATION SWARM v3.2 SAFE – Overlord AI: Modify a proposed action with a note
  const handleModify = useCallback((actionId: string, note: string) => {
    const now = new Date().toISOString()
    setPlan((prev) => {
      const actions = prev.proposedActions.map((a) =>
        a.id === actionId
          ? { ...a, status: "modified" as ActionApprovalStatus, modificationNote: note, actionedAt: now, actionedBy: "Security Operator" }
          : a
      )
      const approved = actions.filter((a) => a.status === "approved").length
      const rejected = actions.filter((a) => a.status === "rejected").length
      const pending = actions.filter((a) => a.status === "pending" || a.status === "modified").length
      return { ...prev, proposedActions: actions, approvedActions: approved, rejectedActions: rejected, pendingActions: pending }
    })
    const action = plan.proposedActions.find((a) => a.id === actionId)
    addAudit({
      timestampMs: Date.now(),
      actor: "Security Operator",
      action: "action_modified",
      targetActionId: actionId,
      detail: `Action modified: "${action?.title ?? actionId}" – note: "${note}"`,
    })
  }, [plan.proposedActions, addAudit])

  // APPROVED REMEDIATION SWARM v3.2 SAFE – Overlord AI: Kill-switch – reject all pending
  const handleKillSwitch = useCallback(() => {
    setKillSwitchActive(true)
    const now = new Date().toISOString()
    setPlan((prev) => {
      const actions = prev.proposedActions.map((a) =>
        a.status === "pending"
          ? { ...a, status: "rejected" as ActionApprovalStatus, actionedAt: now, actionedBy: "KILL-SWITCH" }
          : a
      )
      const rejected = actions.filter((a) => a.status === "rejected").length
      return { ...prev, proposedActions: actions, rejectedActions: rejected, pendingActions: 0 }
    })
    addAudit({
      timestampMs: Date.now(),
      actor: "Security Operator",
      action: "kill_switch_activated",
      targetActionId: null,
      detail: "Emergency Kill-Switch activated – all pending actions rejected and swarm halted.",
    })
  }, [addAudit])

  // APPROVED REMEDIATION SWARM v3.2 SAFE – Overlord AI: Export compliance report (simulated)
  const handleExportCompliance = useCallback(() => {
    setExportDone(true)
    addAudit({
      timestampMs: Date.now(),
      actor: "Security Operator",
      action: "compliance_report_exported",
      targetActionId: null,
      detail: `Compliance report exported for plan ${plan.planId} (${plan.totalActions} actions, ${plan.approvedActions} approved).`,
    })
    setTimeout(() => setExportDone(false), 3000)
  }, [addAudit, plan.planId, plan.totalActions, plan.approvedActions])

  const pendingActions = plan.proposedActions.filter((a) => a.status === "pending")
  const resolvedActions = plan.proposedActions.filter((a) => a.status !== "pending")

  return (
    <div className="space-y-5">
      {/* APPROVED REMEDIATION SWARM v3.2 SAFE – Overlord AI: Plan header */}
      <div className="rounded-2xl border border-orange-500/30 bg-gradient-to-b from-orange-500/5 to-transparent p-5">
        <div className="text-xs font-mono text-orange-400/80 tracking-widest mb-2 uppercase">
          APPROVED REMEDIATION SWARM v3.2 SAFE · OVERLORD AI
        </div>
        <div className="flex flex-wrap items-center gap-3 mb-1">
          <span className="text-base font-black text-white">Remediation Plan</span>
          <span className="text-xs font-mono text-gray-500">{plan.planId}</span>
          <span className="ml-auto text-[10px] font-mono px-2 py-0.5 rounded-full border border-cyan-500/40 bg-cyan-500/10 text-cyan-400 uppercase">
            {killSwitchActive ? "🛑 HALTED" : plan.pendingActions > 0 ? "⏳ AWAITING APPROVAL" : "✅ FULLY REVIEWED"}
          </span>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mt-1">
          <span>Scope: <span className="text-gray-300">{plan.scopeLabel}</span></span>
          <span>Target: <span className="text-orange-300">{plan.target.toUpperCase()}</span></span>
          <span>Created: <span className="text-gray-300">{new Date(plan.createdAt).toLocaleString()}</span></span>
          <span>Runbook: <span className="text-cyan-400">{plan.runbookSlug}</span></span>
        </div>
      </div>

      {/* APPROVED REMEDIATION SWARM v3.2 SAFE – Overlord AI: Read-only banner when actions pending */}
      {!killSwitchActive && plan.pendingActions > 0 && (
        <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 px-4 py-3 flex items-center gap-3">
          <span className="text-blue-400 text-base">🔒</span>
          <span className="text-xs text-blue-300">
            <span className="font-black">Read-only mode active.</span> {plan.pendingActions} action{plan.pendingActions !== 1 ? "s" : ""} awaiting explicit human approval.
            No changes will be applied until each action is individually approved.
          </span>
        </div>
      )}

      {/* APPROVED REMEDIATION SWARM v3.2 SAFE – Overlord AI: Kill-switch activated banner */}
      {killSwitchActive && (
        <div className="rounded-xl border border-red-600/40 bg-red-500/10 px-4 py-3 flex items-center gap-3">
          <span className="text-red-400 text-base">🛑</span>
          <span className="text-xs text-red-300 font-black">
            EMERGENCY KILL-SWITCH ACTIVATED – All pending actions rejected. Swarm halted. Full audit log preserved.
          </span>
        </div>
      )}

      {/* APPROVED REMEDIATION SWARM v3.2 SAFE – Overlord AI: Approval progress */}
      <ApprovalProgress plan={plan} />

      {/* APPROVED REMEDIATION SWARM v3.2 SAFE – Overlord AI: Tab bar */}
      <div className="flex gap-1 border-b border-gray-800">
        {(["actions", "audit"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs font-black uppercase tracking-widest transition-colors ${
              activeTab === tab
                ? "text-orange-400 border-b-2 border-orange-400 -mb-px"
                : "text-gray-600 hover:text-gray-400"
            }`}
          >
            {tab === "actions" ? `🐝 Proposed Actions (${plan.proposedActions.length})` : `📋 Audit Log (${plan.auditLog.length})`}
          </button>
        ))}
      </div>

      {/* APPROVED REMEDIATION SWARM v3.2 SAFE – Overlord AI: Proposed Actions tab */}
      {activeTab === "actions" && (
        <div className="space-y-3">
          {pendingActions.length > 0 && (
            <>
              <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">
                ⏳ Pending Approval ({pendingActions.length})
              </div>
              {pendingActions.map((action) => (
                <ActionCard
                  key={action.id}
                  action={action}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onModify={handleModify}
                />
              ))}
            </>
          )}
          {resolvedActions.length > 0 && (
            <>
              <div className="text-xs font-mono text-gray-500 uppercase tracking-widest mt-4">
                ✓ Resolved Actions ({resolvedActions.length})
              </div>
              {resolvedActions.map((action) => (
                <ActionCard
                  key={action.id}
                  action={action}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onModify={handleModify}
                />
              ))}
            </>
          )}
        </div>
      )}

      {/* APPROVED REMEDIATION SWARM v3.2 SAFE – Overlord AI: Audit Log tab */}
      {activeTab === "audit" && (
        <div className="rounded-2xl border border-gray-800 bg-black/25 p-4 max-h-[480px] overflow-y-auto">
          <div className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-3">
            Full Audit Log · {plan.auditLog.length} entries
          </div>
          {plan.auditLog.map((entry) => (
            <AuditRow key={entry.id} entry={entry} />
          ))}
        </div>
      )}

      {/* APPROVED REMEDIATION SWARM v3.2 SAFE – Overlord AI: Control panel */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Kill-switch */}
        <div className="rounded-2xl border border-red-600/20 bg-red-500/5 p-5">
          <div className="text-sm font-black text-red-400 mb-2">🛑 Emergency Kill-Switch</div>
          <p className="text-xs text-gray-400 mb-4 leading-relaxed">
            Immediately reject all pending actions and halt the swarm. The full audit log
            is preserved. This action is irreversible for the current plan.
          </p>
          <button
            type="button"
            onClick={handleKillSwitch}
            disabled={killSwitchActive || plan.pendingActions === 0}
            className="w-full py-2.5 rounded-xl border border-red-600/50 bg-red-500/10 text-red-400 text-sm font-black hover:bg-red-500/15 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {killSwitchActive ? "🛑 Kill-Switch Active" : "Activate Kill-Switch →"}
          </button>
        </div>

        {/* Compliance report */}
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
          <div className="text-sm font-black text-emerald-400 mb-2">📄 Compliance Report</div>
          <p className="text-xs text-gray-400 mb-4 leading-relaxed">
            Export the full audit trail as a compliance report. Includes all proposed
            actions, approval decisions, and timestamps for enterprise audit requirements.
          </p>
          <button
            type="button"
            onClick={handleExportCompliance}
            className="w-full py-2.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 text-sm font-black hover:bg-emerald-500/15 transition-colors"
          >
            {exportDone ? "✅ Exported!" : "Export Compliance Report →"}
          </button>
        </div>
      </div>

      {/* APPROVED REMEDIATION SWARM v3.2 SAFE – Overlord AI: Safety footer */}
      <div className="rounded-xl border border-gray-800 bg-black/20 p-4 text-xs text-gray-500 leading-relaxed">
        <span className="text-gray-400 font-black">Safety-First Architecture:</span> All agents
        operate in strict sandbox mode with least-privilege access. Every proposed action is stored
        as a GitOps PR or Terraform Plan before any approval. No change is applied to infrastructure
        without explicit individual human sign-off. The Emergency Kill-Switch halts all activity
        instantly. Full audit trail exported on demand for compliance and SOC 2 / ISO 27001 evidence.
        · <span className="font-mono">APPROVED REMEDIATION SWARM v3.2 SAFE – Overlord AI</span>
      </div>
    </div>
  )
}
