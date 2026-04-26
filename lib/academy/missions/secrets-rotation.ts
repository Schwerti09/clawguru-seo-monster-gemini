// Mission M-010 — "API key leaked. Rotate it without breaking a single client."
//
// Track: Intermediate (Stack Hardening)
// Scenario: Slack DM, 14:02. A junior pushed `.env.production` to a public
// Dockerfile layer two days ago. The leaked API key (`sk_live_abc...`) authenticates
// 4 partner integrations + the internal SDK + CI. Your CTO wants the key dead,
// users want zero downtime. The wrong order kills production for everyone.
//
// Pedagogy:
//   - The lesson is the GAP between "rotate the key" and "rotate without
//     breaking traffic". Single-step rotation = guaranteed outage. The
//     correct shape is dual-write → migrate → drain → retire.
//   - Failure traps are wired:
//       * `retire v1` while V1 traffic > 0 → simulates production outage
//       * `deploy` before patching dual-write → revoked-key 401 storm
//   - The simulation walks 4 named clients (api-partner-A, api-partner-B,
//     internal-sdk, github-actions-ci). Each rollout shifts V1→V2 traffic.
//     Defender must observe via `monitor` before pulling the V1 plug.

import type { CommandResult, Mission, MissionState } from "../missionEngine"
import { bold, cyan, dim, gold, green, red, resolvePath, yellow } from "../missionEngine"

const ENV_INITIAL = `# /etc/clawguru/.env.production
# WARNING: This file was leaked in a public Docker layer 2 days ago.
# CTO ticket SEC-1842 requires rotation before EOD. No service interruption.

API_KEY_V1=sk_live_abc123_LEAKED_2026_04_24
# API_KEY_V2 not generated yet
`

const AUTH_INITIAL = `// /app/middleware/auth.js
// Authenticates inbound requests against the single live API key.
// To rotate without downtime, this must accept BOTH V1 and V2 during the
// drain window — single-key auth means a hard cutover (= production outage).

const ACTIVE_KEY = process.env.API_KEY_V1

export function authenticate(req) {
  const presented = req.headers.get("authorization")?.replace(/^Bearer\\s+/i, "")
  if (!presented) return { ok: false, reason: "missing" }
  if (presented !== ACTIVE_KEY) return { ok: false, reason: "invalid", keyVersion: null }
  return { ok: true, keyVersion: "v1" }
}
`

const CLIENTS_INITIAL = `Active integrations using API_KEY_V1:

  Client                     Calls/min   Owner             Migration plan
  -----------------------------------------------------------------------
  api-partner-A              420         partner-team      ticket OPS-441
  api-partner-B              180         partner-team      ticket OPS-442
  internal-sdk               1240        platform-team     auto-redeploy
  github-actions-ci          12          devex-team        secret update
  -----------------------------------------------------------------------
  TOTAL                      1852        --                4 cutovers

Rollout policy: dual-write deployed → migrate clients one at a time →
verify zero V1 traffic for >=10 min → only then retire V1.
`

const README = `Mission M-010 — Secrets Rotation without Downtime
====================================================

BRIEF
  14:02. A junior dev pushed .env.production into a public Dockerfile layer
  two days ago. Your live API key (sk_live_abc123_LEAKED_2026_04_24)
  authenticates 4 production integrations + the internal SDK + CI. CTO
  wants it dead before EOD. Users want zero downtime.

  Single-step rotation = production outage. Do it right.

OBJECTIVES
  1. Inspect the leaked key + the 4 active clients
  2. Generate API_KEY_V2 (without removing V1 yet)
  3. Patch auth middleware to accept BOTH V1 and V2 (dual-write)
  4. Deploy dual-write change
  5. Migrate each client to V2 one at a time
  6. Monitor V1 traffic until it drains to zero
  7. Retire V1 (delete from secrets store)
  8. audit signoff — recovery is real, no outage

HINTS
  cat .env.production
  cat clients
  cat auth.js
  rotate generate              # mints V2, leaves V1 alive
  patch dual-write             # accept both V1 and V2 at the gate
  deploy
  rollout <client>             # move one client to V2
  monitor                      # see live V1/V2 traffic split
  retire v1                    # GATED: only when V1 traffic = 0
  audit signoff

  ⚠ Trap 1: 'retire v1' before traffic drains = simulated outage.
  ⚠ Trap 2: 'deploy' before 'patch dual-write' = mass 401s.
`

const initialState: MissionState = {
  cwd: "/etc/clawguru",
  fs: {
    "/etc/clawguru/README":             { content: README,           mode: "ro" },
    "/etc/clawguru/.env.production":    { content: ENV_INITIAL,      mode: "rw" },
    "/etc/clawguru/clients":            { content: CLIENTS_INITIAL,  mode: "ro" },
    "/app/middleware/auth.js":          { content: AUTH_INITIAL,     mode: "rw" },
  },
  env: {
    INSPECTED_KEY:   "no",
    INSPECTED_CLIENTS:"no",
    V2_GENERATED:    "no",
    DUAL_WRITE:      "no",          // "yes" = patched
    DEPLOYED:        "no",          // "yes" = dual-write live
    // Per-client migration state
    CLIENT_PARTNER_A:"v1",
    CLIENT_PARTNER_B:"v1",
    CLIENT_SDK:      "v1",
    CLIENT_CI:       "v1",
    V1_RETIRED:      "no",
    OUTAGE:          "no",          // sticky failure flag
  },
  goalsMet: [],
  history: [],
}

const SHORTCUTS: Record<string, string> = {
  "README":              "/etc/clawguru/README",
  ".env.production":     "/etc/clawguru/.env.production",
  ".env":                "/etc/clawguru/.env.production",
  "clients":             "/etc/clawguru/clients",
  "auth.js":             "/app/middleware/auth.js",
}

const CLIENT_KEYS: Record<string, "CLIENT_PARTNER_A" | "CLIENT_PARTNER_B" | "CLIENT_SDK" | "CLIENT_CI"> = {
  "api-partner-A":     "CLIENT_PARTNER_A",
  "api-partner-B":     "CLIENT_PARTNER_B",
  "internal-sdk":      "CLIENT_SDK",
  "github-actions-ci": "CLIENT_CI",
}

const CLIENT_RPM: Record<string, number> = {
  "api-partner-A": 420,
  "api-partner-B": 180,
  "internal-sdk":  1240,
  "github-actions-ci": 12,
}

function resolveFile(state: MissionState, raw: string): string | undefined {
  if (!raw) return undefined
  const direct = resolvePath(state.cwd, raw)
  if (state.fs[direct]) return direct
  return SHORTCUTS[raw]
}

function v1TrafficRpm(state: MissionState): number {
  let total = 0
  for (const [client, envKey] of Object.entries(CLIENT_KEYS)) {
    if (state.env[envKey] === "v1") total += CLIENT_RPM[client] ?? 0
  }
  return total
}
function v2TrafficRpm(state: MissionState): number {
  let total = 0
  for (const [client, envKey] of Object.entries(CLIENT_KEYS)) {
    if (state.env[envKey] === "v2") total += CLIENT_RPM[client] ?? 0
  }
  return total
}

export const secretsRotationMission: Mission = {
  slug: "secrets-rotation",
  title: "Rotate the leaked API key without breaking a single client",
  brief: "API key leaked in a public Docker layer. 4 clients depend on it. Wrong order = production outage. Dual-write -> migrate -> drain -> retire.",
  prompt: "oncall@clawguru-control:/etc/clawguru$ ",
  welcome:
    bold(red("╭──────────────────────────────────────────────╮")) + "\r\n" +
    bold(red("│ ")) + bold("MISSION M-010 — SECRETS ROTATION") + bold(red("            │")) + "\r\n" +
    bold(red("╰──────────────────────────────────────────────╯")) + "\r\n\r\n" +
    yellow("CTO: ") + "API key leaked in public Docker layer. Kill it. No outage.\r\n" +
    dim("Read the brief: ") + cyan("cat README") + dim("  ·  Active clients: ") + cyan("cat clients") + "\r\n",
  goals: [
    { id: "inspect-key",     label: "Inspect leaked key + active clients",         hint: "cat .env.production && cat clients" },
    { id: "generate-v2",     label: "Generate API_KEY_V2 (V1 still alive)",        hint: "rotate generate" },
    { id: "dual-write",      label: "Patch auth.js to accept BOTH V1 and V2",      hint: "patch dual-write" },
    { id: "deploy",          label: "Deploy the dual-write change",                hint: "deploy" },
    { id: "migrate",         label: "Migrate all 4 clients to V2",                 hint: "rollout api-partner-A | api-partner-B | internal-sdk | github-actions-ci" },
    { id: "drain",           label: "Verify V1 traffic = 0",                       hint: "monitor" },
    { id: "retire",          label: "Retire V1 key (delete from secrets store)",   hint: "retire v1" },
    { id: "signoff",         label: "audit signoff — zero outage, key revoked",    hint: "audit signoff" },
  ],
  success:
    gold("╭──────────────────────────────────────────────╮") + "\r\n" +
    gold("│  🏆  MISSION COMPLETE — KEY ROTATED, NO OUTAGE │") + "\r\n" +
    gold("╰──────────────────────────────────────────────╯") + "\r\n" +
    dim("Defender XP: ") + green("+240") + dim("   Leaked key revoked. 4 clients migrated. Zero failed requests. CTO: \"clean rotation.\"") + "\r\n",
  commands: {
    help: () => ({ stdout:
      bold("Commands") + "\r\n  " + cyan("help  ls  cat <f>  pwd  cd  clear  hint  goals") + "\r\n" +
      "  " + cyan("rotate generate") + "                     mint V2, leaves V1 alive\r\n" +
      "  " + cyan("patch dual-write") + "                    auth accepts both V1+V2\r\n" +
      "  " + cyan("deploy") + "                              ship the dual-write change\r\n" +
      "  " + cyan("rollout <client>") + "                    move one client to V2\r\n" +
      "  " + cyan("monitor") + "                             live V1/V2 traffic split\r\n" +
      "  " + cyan("retire v1") + "                           GATED on V1 traffic = 0\r\n" +
      "  " + cyan("audit signoff") + "                       recovery audit gate\r\n",
    }),
    pwd: ({ state }) => ({ stdout: state.cwd }),
    cd: ({ state, args }) => ({ statePatch: { cwd: resolvePath(state.cwd, args[0] ?? "/etc/clawguru") }, stdout: "" }),
    ls: ({ state }) => ({ stdout: Object.keys(state.fs).filter((p) => p.startsWith(state.cwd)).map((p) => p.replace(state.cwd + "/", "")).join("  ") }),
    cat: ({ state, args }): CommandResult => {
      if (!args[0]) return { stderr: "cat: missing file" }
      const path = resolveFile(state, args[0])
      if (!path) return { stderr: `cat: ${args[0]}: no such file` }
      const isKey      = path.endsWith(".env.production")
      const isClients  = path.endsWith("/clients")
      const env = { ...state.env }
      if (isKey) env.INSPECTED_KEY = "yes"
      if (isClients) env.INSPECTED_CLIENTS = "yes"
      const bothInspected = env.INSPECTED_KEY === "yes" && env.INSPECTED_CLIENTS === "yes"
      return {
        stdout: state.fs[path].content,
        statePatch: { env },
        goalMet: bothInspected ? "inspect-key" : undefined,
      }
    },
    rotate: ({ state, args }): CommandResult => {
      if (args[0] !== "generate") return { stderr: "rotate: usage: rotate generate" }
      if (state.env.V2_GENERATED === "yes") return { stdout: yellow("V2 already generated"), goalMet: "generate-v2" }
      const p = "/etc/clawguru/.env.production"
      const c = (state.fs[p]?.content ?? "") + "API_KEY_V2=sk_live_xyz789_2026_04_26\n"
      return {
        stdout:
          green("API_KEY_V2 minted ") + dim("(sk_live_xyz789_2026_04_26)") + "\r\n" +
          dim("V1 still alive — safe. Patch dual-write next."),
        statePatch: { fs: { [p]: { content: c, mode: "rw" } }, env: { ...state.env, V2_GENERATED: "yes" } },
        goalMet: "generate-v2",
      }
    },
    patch: ({ state, args }): CommandResult => {
      if (args[0] !== "dual-write") return { stderr: "patch: try 'patch dual-write'" }
      if (state.env.V2_GENERATED !== "yes") {
        return { stderr: red("patch: V2 doesn't exist yet — run 'rotate generate' first") }
      }
      if (state.env.DUAL_WRITE === "yes") return { stdout: yellow("auth already dual-write patched"), goalMet: "dual-write" }
      const p = "/app/middleware/auth.js"
      const newAuth = `// /app/middleware/auth.js
// DUAL-WRITE WINDOW — accept V1 (legacy) AND V2 (new) until V1 traffic = 0.
// Once V1 traffic drains, retire V1 and revert to single-key check on V2.

const KEYS = [process.env.API_KEY_V1, process.env.API_KEY_V2].filter(Boolean)

export function authenticate(req) {
  const presented = req.headers.get("authorization")?.replace(/^Bearer\\s+/i, "")
  if (!presented) return { ok: false, reason: "missing" }
  if (presented === process.env.API_KEY_V2) return { ok: true, keyVersion: "v2" }
  if (presented === process.env.API_KEY_V1) return { ok: true, keyVersion: "v1" }
  return { ok: false, reason: "invalid", keyVersion: null }
}
`
      return {
        stdout: green("auth.js: now accepts BOTH V1 and V2. Tags requests with keyVersion for traffic split metrics."),
        statePatch: { fs: { [p]: { content: newAuth, mode: "rw" } }, env: { ...state.env, DUAL_WRITE: "yes" } },
        goalMet: "dual-write",
      }
    },
    deploy: ({ state }): CommandResult => {
      if (state.env.DUAL_WRITE !== "yes") {
        return {
          stderr: red("deploy: REFUSED — auth.js still single-key. Deploying now would 401 every V2-tagged request that hasn't migrated yet, OR break V1 if you also touched it. Patch dual-write first."),
        }
      }
      if (state.env.DEPLOYED === "yes") return { stdout: yellow("dual-write already deployed · pid 14302"), goalMet: "deploy" }
      return {
        stdout:
          dim("[deploy] auth.js → 14 edge replicas (rolling) ... ") + "ok 23s\r\n" +
          green("Dual-write live. Both V1 and V2 valid. No traffic interrupted.") + "\r\n" +
          dim("Now migrate clients one at a time — see 'rollout <client>'."),
        statePatch: { env: { ...state.env, DEPLOYED: "yes" } },
        goalMet: "deploy",
      }
    },
    rollout: ({ state, args }): CommandResult => {
      const client = args[0]
      if (!client) return { stderr: "rollout: usage: rollout <client>  (try one of " + Object.keys(CLIENT_KEYS).join(", ") + ")" }
      if (state.env.DEPLOYED !== "yes") {
        return { stderr: red("rollout: REFUSED — server still single-key. Deploy dual-write first or this client will hard-401 on next call.") }
      }
      const envKey = CLIENT_KEYS[client]
      if (!envKey) return { stderr: `rollout: unknown client '${client}'. Known: ${Object.keys(CLIENT_KEYS).join(", ")}` }
      if (state.env[envKey] === "v2") return { stdout: yellow(`${client} already on V2`) }
      const newEnv = { ...state.env, [envKey]: "v2" }
      const stillOnV1 = Object.entries(CLIENT_KEYS).filter(([_, k]) => newEnv[k] === "v1").map(([c]) => c)
      const allMigrated = stillOnV1.length === 0
      return {
        stdout:
          dim(`[rollout] ${client}: API_KEY_V1 -> API_KEY_V2 (${CLIENT_RPM[client]} req/min)`) + "\r\n" +
          green(`${client} now on V2. ${stillOnV1.length === 0 ? "All clients migrated." : `${stillOnV1.length} clients still on V1: ${stillOnV1.join(", ")}.`}`),
        statePatch: { env: newEnv },
        goalMet: allMigrated ? "migrate" : undefined,
      }
    },
    monitor: ({ state }): CommandResult => {
      const v1 = v1TrafficRpm(state)
      const v2 = v2TrafficRpm(state)
      const total = v1 + v2
      const v1Pct = total > 0 ? Math.round((v1 / total) * 100) : 0
      const v2Pct = total > 0 ? Math.round((v2 / total) * 100) : 0
      const stillOnV1 = Object.entries(CLIENT_KEYS).filter(([_, k]) => state.env[k] === "v1").map(([c]) => c)
      const drained = v1 === 0 && state.env.DEPLOYED === "yes" && Object.values(CLIENT_KEYS).every((k) => state.env[k] === "v2")
      return {
        stdout:
          bold("Live traffic split (last 60s rolling)") + "\r\n" +
          `  V1: ` + (v1 === 0 ? green(`${v1} req/min  (drained)`) : yellow(`${v1} req/min  (${v1Pct}%)`)) + "\r\n" +
          `  V2: ` + green(`${v2} req/min  (${v2Pct}%)`) + "\r\n" +
          (stillOnV1.length > 0
            ? dim("Clients still on V1: ") + stillOnV1.join(", ")
            : dim("All clients on V2.")),
        goalMet: drained ? "drain" : undefined,
      }
    },
    retire: ({ state, args }): CommandResult => {
      if (args[0] !== "v1") return { stderr: "retire: usage: retire v1" }
      const v1 = v1TrafficRpm(state)
      if (v1 > 0) {
        // Hard outage simulation. Sticky.
        return {
          stderr:
            red("retire: OUTAGE — V1 was still serving ") + bold(`${v1} req/min`) + red(" of live traffic when you killed it.") + "\r\n" +
            red("       4xx storm hit ") + Object.entries(CLIENT_KEYS).filter(([_, k]) => state.env[k] === "v1").map(([c]) => c).join(", ") + red(". CTO is on the phone.") + "\r\n" +
            dim("       Lesson: drain V1 to 0 req/min via 'rollout <client>' + 'monitor', THEN retire."),
          statePatch: { env: { ...state.env, OUTAGE: "yes" } },
        }
      }
      if (state.env.V1_RETIRED === "yes") return { stdout: yellow("V1 already retired") }
      const p = "/etc/clawguru/.env.production"
      const c = (state.fs[p]?.content ?? "")
        .replace(/^API_KEY_V1=.*$/m, "# API_KEY_V1 retired 2026-04-26 (rotated to V2 with zero downtime)")
      return {
        stdout: green("API_KEY_V1 deleted from secrets store. Leaked credential is now dead.") + "\r\n" +
          dim("Next: simplify auth.js back to single-key (V2) in a follow-up PR — not part of this drill."),
        statePatch: { fs: { [p]: { content: c, mode: "rw" } }, env: { ...state.env, V1_RETIRED: "yes" } },
        goalMet: "retire",
      }
    },
    audit: ({ state, args }): CommandResult => {
      if (args[0] !== "signoff") return { stderr: "audit: usage: audit signoff" }
      const checks = [
        { name: "Inspected leaked key + 4 clients",          ok: state.env.INSPECTED_KEY === "yes" && state.env.INSPECTED_CLIENTS === "yes" },
        { name: "API_KEY_V2 generated",                      ok: state.env.V2_GENERATED === "yes" },
        { name: "auth.js dual-write deployed",               ok: state.env.DUAL_WRITE === "yes" && state.env.DEPLOYED === "yes" },
        { name: "All 4 clients migrated to V2",              ok: Object.values(CLIENT_KEYS).every((k) => state.env[k] === "v2") },
        { name: "V1 traffic drained to 0 req/min",           ok: v1TrafficRpm(state) === 0 && state.env.DEPLOYED === "yes" },
        { name: "V1 retired from secrets store",             ok: state.env.V1_RETIRED === "yes" },
        { name: "No simulated outage during rotation",       ok: state.env.OUTAGE !== "yes" },
      ]
      const lines = checks.map((c) => (c.ok ? green("  ✓ ") + c.name : red("  ✗ ") + c.name))
      const allOk = checks.every((c) => c.ok)
      return {
        stdout:
          bold("Rotation sign-off — audit") + "\r\n" +
          lines.join("\r\n") + "\r\n" +
          (allOk
            ? green("Result: PASS — leaked key revoked with zero downtime. Document RTO.")
            : red("Result: FAIL — fix the ✗ items.") +
              (state.env.OUTAGE === "yes" ? "\r\n" + dim("(hint: outage flag is sticky — restart the mission to retry without the OUTAGE blocker.)") : "")),
        goalMet: allOk ? "signoff" : undefined,
      }
    },
    hint: ({ state }) => {
      const r = secretsRotationMission.goals.find((g) => !state.goalsMet.includes(g.id))
      return { stdout: r ? dim("→ ") + yellow(r.label) + dim("  (" + (r.hint ?? "") + ")") : green("All goals met.") }
    },
    goals: ({ state }) => ({ stdout: bold("Goals") + "\r\n" + secretsRotationMission.goals.map((g) => (state.goalsMet.includes(g.id) ? green("  ✓ ") + dim(g.label) : dim("  · ") + g.label)).join("\r\n") }),
    clear: () => ({ stdout: "\x1b[2J\x1b[H" }),
    exit: () => ({ stdout: dim("— session closed —") }),
  },
  initialState,
}
