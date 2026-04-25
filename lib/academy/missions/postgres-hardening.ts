// Mission M-007 — "Lock down PostgreSQL before the audit team lands"
//
// Track: Intermediate (Stack Hardening)
// Scenario: hodlberg-db-01 runs Postgres 16 with the default config a hurry-up
// migration left behind: trust auth in pg_hba.conf for the LAN, ssl off,
// every app user is superuser, query logging silent. The infosec audit lands
// in two hours. Tighten the screws — without locking the app out.
//
// Pedagogy:
//   - Reads ARE the lesson: pg_hba.conf scoping, ssl=on, role least-privilege
//     and pg_stat_statements logging are 4 distinct production mistakes the
//     learner *has* to recognize before patching.
//   - Each patch maps to a real Postgres directive; the sim mirrors the
//     authoritative file so muscle memory transfers to a real server.
//   - The connect/audit commands punish skipping steps — psql refuses
//     non-SSL after ssl is on, audit fails until all 4 patches land.

import type { CommandResult, Mission, MissionState } from "../missionEngine"
import { bold, cyan, dim, gold, green, red, resolvePath, yellow } from "../missionEngine"

const PG_HBA_INITIAL = `# /etc/postgresql/16/main/pg_hba.conf
# TYPE  DATABASE        USER            ADDRESS                 METHOD
local   all             postgres                                peer
local   all             all                                     peer
host    all             all             10.0.0.0/8              trust
host    all             all             0.0.0.0/0               md5
`

const PG_CONF_INITIAL = `# /etc/postgresql/16/main/postgresql.conf  (excerpt)
listen_addresses = '*'
port             = 5432
ssl              = off
shared_preload_libraries = ''
log_statement    = 'none'
log_min_duration_statement = -1
`

const ROLES_INITIAL = `# Snapshot of pg_roles (\\du equivalent)
 Role name | Attributes                | Member of
-----------+---------------------------+-----------
 postgres  | Superuser, Create DB, ... | {}
 hodlberg  | Superuser                 | {}
 reporting | Superuser                 | {}
 backups   | Superuser                 | {}
`

const README = `Mission M-007 — PostgreSQL Hardening
=====================================

BRIEF
  hodlberg-db-01 (Postgres 16) was migrated under deadline pressure. The infosec
  audit lands in 2h. Four real production mistakes are sitting in the config:
    - pg_hba allows trust auth for any LAN client
    - ssl is off — connections cross the wire in plaintext
    - every app role is Superuser ("just to make it work")
    - query logging is dark — no slow-query trail, no statements

  Patch all four. Don't break the app.

OBJECTIVES
  1. Inspect pg_hba.conf and identify the trust line
  2. Patch pg_hba — no trust, scram-sha-256 for hosts, SSL required
  3. Enable ssl in postgresql.conf and load pg_stat_statements
  4. Demote app roles from Superuser to least-privilege
  5. Reload Postgres and verify SSL with psql
  6. Run the audit — must come back clean

HINTS
  cat pg_hba.conf
  cat postgresql.conf
  \\du
  patch hba
  patch ssl
  patch logging
  patch roles
  systemctl reload postgresql
  psql --ssl=require -h db -U hodlberg -c "SELECT 1"
  audit run
`

const initialState: MissionState = {
  cwd: "/etc/postgresql/16/main",
  fs: {
    "/etc/postgresql/16/main/README":           { content: README,          mode: "ro" },
    "/etc/postgresql/16/main/pg_hba.conf":      { content: PG_HBA_INITIAL,  mode: "rw" },
    "/etc/postgresql/16/main/postgresql.conf":  { content: PG_CONF_INITIAL, mode: "rw" },
    "/var/lib/postgresql/16/main/roles.snapshot": { content: ROLES_INITIAL, mode: "ro" },
  },
  env: {
    HBA_OK:     "no",
    SSL_OK:     "no",
    LOG_OK:     "no",
    ROLES_OK:   "no",
    RELOADED:   "no",
    PSQL_OK:    "unknown",
  },
  goalsMet: [],
  history: [],
}

const SHORTCUTS: Record<string, string> = {
  "pg_hba.conf":      "/etc/postgresql/16/main/pg_hba.conf",
  "postgresql.conf":  "/etc/postgresql/16/main/postgresql.conf",
  "README":           "/etc/postgresql/16/main/README",
}

function resolveFile(state: MissionState, raw: string): string | undefined {
  const direct = state.fs[resolvePath(state.cwd, raw)] ? resolvePath(state.cwd, raw) : undefined
  if (direct) return direct
  return SHORTCUTS[raw]
}

export const postgresHardeningMission: Mission = {
  slug: "postgres-hardening",
  title: "Lock down Postgres before the audit team lands",
  brief: "Trust auth on the LAN, SSL off, every role superuser, no query log. Fix all four — without breaking the app.",
  prompt: "defender@hodlberg-db-01:/etc/postgresql/16/main$ ",
  welcome:
    bold(cyan("╭─────────────────────────────────────────────╮")) + "\r\n" +
    bold(cyan("│ ")) + bold("MISSION M-007 — POSTGRES HARDENING") + bold(cyan("           │")) + "\r\n" +
    bold(cyan("╰─────────────────────────────────────────────╯")) + "\r\n\r\n" +
    "hodlberg-db-01 · Postgres 16.6 · Debian 12\r\n" +
    dim("Read the brief: ") + cyan("cat README") + dim("  ·  ") + cyan("help") + "\r\n",
  goals: [
    { id: "inspect-hba", label: "Inspect pg_hba.conf",                        hint: "cat pg_hba.conf" },
    { id: "patch-hba",   label: "Remove trust + require SSL on host lines",   hint: "patch hba" },
    { id: "patch-ssl",   label: "Enable ssl in postgresql.conf",              hint: "patch ssl" },
    { id: "patch-log",   label: "Load pg_stat_statements + log slow queries", hint: "patch logging" },
    { id: "patch-roles", label: "Demote app roles from Superuser",            hint: "patch roles" },
    { id: "reload",      label: "Reload Postgres",                            hint: "systemctl reload postgresql" },
    { id: "verify",      label: "Verify SSL with psql --ssl=require",         hint: "psql --ssl=require -h db -U hodlberg -c 'SELECT 1'" },
    { id: "audit",       label: "audit run returns clean",                    hint: "audit run" },
  ],
  success:
    gold("╭─────────────────────────────────────────────╮") + "\r\n" +
    gold("│  🏆  MISSION COMPLETE — POSTGRES HARDENED   │") + "\r\n" +
    gold("╰─────────────────────────────────────────────╯") + "\r\n" +
    dim("Defender XP: ") + green("+180") + dim("   Auth scoped, SSL on, roles least-priv, slow queries logged.") + "\r\n",
  commands: {
    help: () => ({ stdout:
      bold("Commands") + "\r\n  " + cyan("help  ls  cat <f>  pwd  cd  clear  hint  goals  \\du") + "\r\n" +
      "  " + cyan("patch hba | ssl | logging | roles") + "\r\n" +
      "  " + cyan("systemctl reload postgresql") + "\r\n" +
      "  " + cyan("psql --ssl=require -h db -U hodlberg -c '<SQL>'") + "\r\n" +
      "  " + cyan("audit run") + "\r\n",
    }),
    pwd: ({ state }) => ({ stdout: state.cwd }),
    cd: ({ state, args }) => ({ statePatch: { cwd: resolvePath(state.cwd, args[0] ?? "/etc/postgresql/16/main") }, stdout: "" }),
    ls: ({ state }) => ({ stdout: Object.keys(state.fs).filter((p) => p.startsWith(state.cwd)).map((p) => p.replace(state.cwd + "/", "")).join("  ") }),
    cat: ({ state, args }) => {
      if (!args[0]) return { stderr: "cat: missing file" }
      const path = resolveFile(state, args[0])
      if (!path || !state.fs[path]) return { stderr: `cat: ${args[0]}: no such file` }
      const goalMet = path.endsWith("pg_hba.conf") ? "inspect-hba" : undefined
      return { stdout: state.fs[path].content, goalMet }
    },
    "\\du": ({ state }) => ({ stdout: state.fs["/var/lib/postgresql/16/main/roles.snapshot"]?.content ?? "" }),
    patch: ({ state, args }): CommandResult => {
      if (args[0] === "hba") {
        const p = "/etc/postgresql/16/main/pg_hba.conf"
        let c = state.fs[p]?.content ?? ""
        if (!/trust/.test(c) && /hostssl/.test(c)) return { stdout: yellow("already patched"), goalMet: "patch-hba" }
        c = c.replace(/host\s+all\s+all\s+10\.0\.0\.0\/8\s+trust/, "hostssl all             all             10.0.0.0/8              scram-sha-256")
        c = c.replace(/host\s+all\s+all\s+0\.0\.0\.0\/0\s+md5/,    "# host    all             all             0.0.0.0/0               md5  (removed: WAN auth)")
        return {
          stdout: green("pg_hba: removed trust, hostssl + scram-sha-256 for LAN, blocked WAN"),
          statePatch: { fs: { [p]: { content: c, mode: "rw" } }, env: { ...state.env, HBA_OK: "yes" } },
          goalMet: "patch-hba",
        }
      }
      if (args[0] === "ssl") {
        const p = "/etc/postgresql/16/main/postgresql.conf"
        let c = state.fs[p]?.content ?? ""
        if (/^ssl\s*=\s*on/m.test(c)) return { stdout: yellow("already patched"), goalMet: "patch-ssl" }
        c = c.replace(/^ssl\s*=\s*off/m, "ssl              = on\nssl_cert_file    = '/etc/ssl/certs/hodlberg-db.pem'\nssl_key_file     = '/etc/ssl/private/hodlberg-db.key'\nssl_min_protocol_version = 'TLSv1.2'")
        return {
          stdout: green("postgresql.conf: ssl=on, TLSv1.2+, server cert wired"),
          statePatch: { fs: { [p]: { content: c, mode: "rw" } }, env: { ...state.env, SSL_OK: "yes" } },
          goalMet: "patch-ssl",
        }
      }
      if (args[0] === "logging") {
        const p = "/etc/postgresql/16/main/postgresql.conf"
        let c = state.fs[p]?.content ?? ""
        if (/pg_stat_statements/.test(c)) return { stdout: yellow("already patched"), goalMet: "patch-log" }
        c = c.replace(/^shared_preload_libraries\s*=.*$/m, "shared_preload_libraries = 'pg_stat_statements'")
        c = c.replace(/^log_statement\s*=.*$/m,            "log_statement    = 'ddl'")
        c = c.replace(/^log_min_duration_statement\s*=.*$/m, "log_min_duration_statement = 250  # ms — log queries slower than 250ms")
        return {
          stdout: green("postgresql.conf: pg_stat_statements loaded, DDL audited, slow-queries logged > 250ms"),
          statePatch: { fs: { [p]: { content: c, mode: "rw" } }, env: { ...state.env, LOG_OK: "yes" } },
          goalMet: "patch-log",
        }
      }
      if (args[0] === "roles") {
        const p = "/var/lib/postgresql/16/main/roles.snapshot"
        const newContent = ` Role name | Attributes                                  | Member of
-----------+---------------------------------------------+-----------------
 postgres  | Superuser, Create DB, Create role, ...      | {}
 hodlberg  | LOGIN (no superuser)                        | {hodlberg_app}
 reporting | LOGIN (no superuser)                        | {hodlberg_read}
 backups   | LOGIN, REPLICATION (no superuser)           | {}
\r\n` +
          dim("Note: hodlberg now inherits via hodlberg_app (R/W on app schema only).") + "\r\n" +
          dim("      reporting inherits via hodlberg_read (SELECT only). backups uses REPLICATION.")
        return {
          stdout: green("Demoted hodlberg + reporting + backups from Superuser to least-priv groups"),
          statePatch: { fs: { [p]: { content: newContent, mode: "ro" } }, env: { ...state.env, ROLES_OK: "yes" } },
          goalMet: "patch-roles",
        }
      }
      return { stderr: "patch: unknown. Try 'patch hba | ssl | logging | roles'" }
    },
    systemctl: ({ state, args }) => {
      if (args[0] !== "reload" || args[1] !== "postgresql") {
        return { stderr: "systemctl: only 'systemctl reload postgresql' supported here" }
      }
      const ready = state.env.HBA_OK === "yes" && state.env.SSL_OK === "yes" && state.env.LOG_OK === "yes"
      if (!ready) {
        return { stderr: red("postgresql.service: reload aborted — config still has trust auth or ssl=off. Patch first.") }
      }
      return {
        stdout: green("postgresql.service reloaded · pid 1432 · 4 directives changed · 0 errors"),
        statePatch: { env: { ...state.env, RELOADED: "yes" } },
        goalMet: "reload",
      }
    },
    psql: ({ state, args }) => {
      const sslReq = args.some((a) => /--ssl=require/.test(a))
      const cmd = args.join(" ")
      if (state.env.RELOADED !== "yes") {
        return { stderr: red("psql: could not connect — server has stale config. Reload first.") }
      }
      if (!sslReq) {
        return { stderr: red("psql: FATAL: connection requires SSL (server enforces ssl=on). Re-run with --ssl=require.") }
      }
      if (!/SELECT\s+1/i.test(cmd)) {
        return { stdout: dim("(use a 'SELECT 1' probe to verify the round-trip)"), }
      }
      return {
        stdout:
          dim("ssl: on  protocol: TLSv1.3  auth: scram-sha-256\r\n") +
          " ?column?\r\n" +
          "----------\r\n" +
          "        1\r\n" +
          "(1 row)",
        statePatch: { env: { ...state.env, PSQL_OK: "ok" } },
        goalMet: "verify",
      }
    },
    audit: ({ state, args }) => {
      if (args[0] !== "run") return { stderr: "audit: usage: audit run" }
      const checks = [
        { name: "pg_hba — no trust, SSL required",   ok: state.env.HBA_OK === "yes" },
        { name: "ssl = on with TLS ≥ 1.2",            ok: state.env.SSL_OK === "yes" },
        { name: "pg_stat_statements + slow log",      ok: state.env.LOG_OK === "yes" },
        { name: "App roles least-privilege",          ok: state.env.ROLES_OK === "yes" },
        { name: "Server reloaded after patches",      ok: state.env.RELOADED === "yes" },
        { name: "psql probe over SSL succeeded",      ok: state.env.PSQL_OK === "ok" },
      ]
      const lines = checks.map((c) => (c.ok ? green("  ✓ ") + c.name : red("  ✗ ") + c.name))
      const allOk = checks.every((c) => c.ok)
      return {
        stdout:
          bold("Audit — PostgreSQL hardening") + "\r\n" +
          lines.join("\r\n") + "\r\n" +
          (allOk ? green("Result: PASS") : red("Result: FAIL — fix the ✗ items.")),
        goalMet: allOk ? "audit" : undefined,
      }
    },
    hint: ({ state }) => {
      const r = postgresHardeningMission.goals.find((g) => !state.goalsMet.includes(g.id))
      return { stdout: r ? dim("→ ") + yellow(r.label) + dim("  (" + (r.hint ?? "") + ")") : green("All goals met.") }
    },
    goals: ({ state }) => ({ stdout: bold("Goals") + "\r\n" + postgresHardeningMission.goals.map((g) => (state.goalsMet.includes(g.id) ? green("  ✓ ") + dim(g.label) : dim("  · ") + g.label)).join("\r\n") }),
    clear: () => ({ stdout: "\x1b[2J\x1b[H" }),
    exit: () => ({ stdout: dim("— session closed —") }),
  },
  initialState,
}
