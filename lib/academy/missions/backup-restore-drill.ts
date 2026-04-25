// Mission M-009 — "Your backup is fiction until you've restored from it under pressure."
//
// Track: Intermediate (Stack Hardening)
// Scenario: 03:14 SRE gets paged — primary postgres is corrupt, query plan is
// returning ERROR: invalid page in block 1842. Replication is also broken
// (lag 6h). The only way out is the nightly backup. The on-call has 25 min
// before the SLA breach kicks in. Do the drill — and prove the backup is
// actually restorable, not just present.
//
// Pedagogy:
//   - The lesson is the GAP between "we have backups" and "we have recovery".
//     Most teams pass the first audit, fail the second.
//   - Steps mirror a real Postgres recovery flow: list, verify, restore to a
//     sidecar, count rows + validate schema, only THEN sign off.
//   - The mission punishes shortcuts: skipping verify or sidecar means the
//     audit gate at the end fails ("you restored to prod without testing").
//   - The "list" command shows TWO backups: a fresh nightly + a 14-day-old
//     legacy. Picking the wrong one fails the row-count check at the end.
//     Real defenders read ls timestamps before they read instructions.

import type { CommandResult, Mission, MissionState } from "../missionEngine"
import { bold, cyan, dim, gold, green, red, resolvePath, yellow } from "../missionEngine"

const BACKUP_LISTING = ` Permissions  Owner          Size      Date          Name
 -rw-------  postgres:dba   18M       2026-04-11    legacy-pre-migration.dump
 -rw-------  postgres:dba   142M      2026-04-25    nightly-2026-04-25-0300.dump
 -rw-------  postgres:dba   141M      2026-04-24    nightly-2026-04-24-0300.dump
 -rw-r--r--  root:root      512       2026-04-25    .last-verify
`

const NIGHTLY_LIST = `archive: nightly-2026-04-25-0300.dump
format: custom (compressed)
schema:
  TABLE  public.users           — owner: hodlberg_app
  TABLE  public.organizations   — owner: hodlberg_app
  TABLE  public.api_keys        — owner: hodlberg_app
  TABLE  public.sessions        — owner: hodlberg_app
  TABLE  public.audit_log       — owner: hodlberg_app
  INDEX  ix_users_email_unique
  INDEX  ix_sessions_user_id
  INDEX  ix_api_keys_org_id
  CONSTRAINT  fk_sessions_user
  CONSTRAINT  fk_api_keys_org
checksums: OK (4923 objects)
`

const LEGACY_LIST = `archive: legacy-pre-migration.dump
format: custom (compressed)
schema:
  TABLE  public.users
  TABLE  public.organizations
  TABLE  public.api_tokens   ← renamed to api_keys in 2026-Q1 migration
checksums: OK (1841 objects)
WARNING: schema is 14 days old, predates the api_tokens → api_keys rename
`

const README = `Mission M-009 — Backup Restore Drill
======================================

BRIEF
  03:14. Primary hodlberg-db-01 corrupt — invalid page in block 1842.
  Replica is 6h lagged (won't help). SLA breach in 25 min. The only path
  back is restoring from the nightly backup.

  The catch: nobody has restored this backup in production. Time to find
  out if "we have backups" actually means "we can recover".

OBJECTIVES
  1. List available backups
  2. Pick the right archive (timestamp matters)
  3. Verify the archive integrity (pg_restore --list)
  4. Spin up a sidecar postgres for the restore test
  5. Restore the backup into the sidecar
  6. Validate: row counts + schema sanity
  7. Sign off the recovery — audit gate must pass

HINTS
  ls /var/backups/postgres/
  pg_restore --list <archive>
  sidecar up
  pg_restore --dbname=sidecar /var/backups/postgres/<archive>
  psql sidecar -c "SELECT count(*) FROM users"
  audit signoff

  ⚠ Pick the WRONG archive (legacy) — schema mismatch will surface in audit.
`

const SIDECAR_SCHEMA_OK = `      table_name    | rowcount
 ------------------+----------
  users            | 14823
  organizations    |   612
  api_keys         |  3104
  sessions         | 22184
  audit_log        | 1.2M
  (5 rows)
`

const SIDECAR_SCHEMA_LEGACY = `      table_name    | rowcount
 ------------------+----------
  users            | 14823
  organizations    |   612
  api_tokens       |  2987   ← table rename predates this column
  (3 rows)

ERROR: relation "sessions" does not exist
ERROR: relation "audit_log" does not exist
`

const initialState: MissionState = {
  cwd: "/var/backups/postgres",
  fs: {
    "/var/backups/postgres/README":                          { content: README,        mode: "ro" },
    "/var/backups/postgres/.listing":                        { content: BACKUP_LISTING,mode: "ro" },
    "/var/backups/postgres/nightly-2026-04-25-0300.dump":    { content: NIGHTLY_LIST,  mode: "ro" },
    "/var/backups/postgres/legacy-pre-migration.dump":       { content: LEGACY_LIST,   mode: "ro" },
  },
  env: {
    LISTED:        "no",
    PICKED:        "",          // "nightly" | "legacy" | "none"
    VERIFIED:      "no",
    SIDECAR:       "down",
    RESTORED:      "no",
    VALIDATED:     "no",        // "ok" | "schema-mismatch" | "no"
  },
  goalsMet: [],
  history: [],
}

const SHORTCUTS: Record<string, string> = {
  "README":                            "/var/backups/postgres/README",
  ".listing":                          "/var/backups/postgres/.listing",
  "nightly-2026-04-25-0300.dump":      "/var/backups/postgres/nightly-2026-04-25-0300.dump",
  "legacy-pre-migration.dump":         "/var/backups/postgres/legacy-pre-migration.dump",
}

function resolveBackup(state: MissionState, raw: string): string | undefined {
  if (!raw) return undefined
  const direct = resolvePath(state.cwd, raw)
  if (state.fs[direct]) return direct
  return SHORTCUTS[raw]
}

export const backupRestoreDrillMission: Mission = {
  slug: "backup-restore-drill",
  title: "Restore the nightly backup before the SLA breach hits",
  brief: "Primary db is corrupt at 03:14. Replica is lagged. Restore from nightly into a sidecar, verify schema + rows, sign off — without restoring directly to prod.",
  prompt: "oncall@hodlberg-bastion:/var/backups/postgres$ ",
  welcome:
    bold(red("╭──────────────────────────────────────────────╮")) + "\r\n" +
    bold(red("│ ")) + bold("MISSION M-009 — BACKUP RESTORE DRILL") + bold(red("        │")) + "\r\n" +
    bold(red("╰──────────────────────────────────────────────╯")) + "\r\n\r\n" +
    yellow("PAGE: ") + "primary postgres corrupt · replica 6h lagged · SLA breach in 25 min\r\n" +
    dim("Read the brief: ") + cyan("cat README") + dim("  ·  Backups: ") + cyan("ls") + "\r\n",
  goals: [
    { id: "list",     label: "List available backups",                       hint: "ls" },
    { id: "verify",   label: "Verify archive integrity (pg_restore --list)", hint: "pg_restore --list nightly-2026-04-25-0300.dump" },
    { id: "sidecar",  label: "Spin up a sidecar postgres for safe restore",  hint: "sidecar up" },
    { id: "restore",  label: "Restore nightly backup into sidecar",          hint: "pg_restore --dbname=sidecar nightly-2026-04-25-0300.dump" },
    { id: "validate", label: "Row counts + schema match expected shape",     hint: "psql sidecar -c 'SELECT count(*) FROM users'" },
    { id: "signoff",  label: "audit signoff — recovery is real",             hint: "audit signoff" },
  ],
  success:
    gold("╭──────────────────────────────────────────────╮") + "\r\n" +
    gold("│  🏆  MISSION COMPLETE — RECOVERY VERIFIED   │") + "\r\n" +
    gold("╰──────────────────────────────────────────────╯") + "\r\n" +
    dim("Defender XP: ") + green("+220") + dim("   The backup is real. You proved it under pressure. SLA: not breached.") + "\r\n",
  commands: {
    help: () => ({ stdout:
      bold("Commands") + "\r\n  " + cyan("help  ls  cat <f>  pwd  cd  clear  hint  goals") + "\r\n" +
      "  " + cyan("pg_restore --list <archive>") + "\r\n" +
      "  " + cyan("sidecar up | down | status") + "\r\n" +
      "  " + cyan("pg_restore --dbname=sidecar <archive>") + "\r\n" +
      "  " + cyan("psql sidecar -c '<SQL>'") + "\r\n" +
      "  " + cyan("audit signoff") + "\r\n",
    }),
    pwd: ({ state }) => ({ stdout: state.cwd }),
    cd: ({ state, args }) => ({ statePatch: { cwd: resolvePath(state.cwd, args[0] ?? "/var/backups/postgres") }, stdout: "" }),
    ls: ({ state }) => ({
      stdout: state.fs["/var/backups/postgres/.listing"]?.content ?? "",
      statePatch: { env: { ...state.env, LISTED: "yes" } },
      goalMet: "list",
    }),
    cat: ({ state, args }): CommandResult => {
      if (!args[0]) return { stderr: "cat: missing file" }
      const path = resolveBackup(state, args[0])
      if (!path) return { stderr: `cat: ${args[0]}: no such file` }
      return { stdout: state.fs[path].content }
    },
    pg_restore: ({ state, args }): CommandResult => {
      // pg_restore --list <archive>  (verify mode, no DB needed)
      if (args[0] === "--list") {
        const target = args[1]
        if (!target) return { stderr: "pg_restore: --list needs an archive path" }
        const path = resolveBackup(state, target)
        if (!path) return { stderr: `pg_restore: ${target}: no such archive` }
        const isLegacy = path.includes("legacy")
        const which = isLegacy ? "legacy" : "nightly"
        return {
          stdout: state.fs[path].content,
          statePatch: { env: { ...state.env, PICKED: which, VERIFIED: "yes" } },
          goalMet: "verify",
        }
      }
      // pg_restore --dbname=sidecar <archive>
      const dbnameArg = args.find((a) => a.startsWith("--dbname="))
      if (!dbnameArg) return { stderr: "pg_restore: --dbname=<target> required for restore" }
      const dbname = dbnameArg.split("=")[1]
      if (dbname === "primary" || dbname === "hodlberg") {
        return { stderr: red("pg_restore: REFUSED — restoring directly to production. Use the sidecar first.") }
      }
      if (dbname !== "sidecar") {
        return { stderr: `pg_restore: unknown dbname '${dbname}'. Try --dbname=sidecar` }
      }
      if (state.env.SIDECAR !== "up") {
        return { stderr: red("pg_restore: connection refused — sidecar postgres is not running. Try 'sidecar up'.") }
      }
      const archive = args.find((a) => /\.dump$/.test(a))
      if (!archive) return { stderr: "pg_restore: archive path required" }
      const path = resolveBackup(state, archive)
      if (!path) return { stderr: `pg_restore: ${archive}: no such archive` }
      const isLegacy = path.includes("legacy")
      const which = isLegacy ? "legacy" : "nightly"
      return {
        stdout:
          dim("[pg_restore] ") + (isLegacy ? "1841" : "4923") + " objects · " + (isLegacy ? "1.7s" : "12.4s") + "\r\n" +
          green("Restored ") + (isLegacy ? "legacy-pre-migration" : "nightly-2026-04-25-0300") + " into sidecar.",
        statePatch: { env: { ...state.env, PICKED: which, RESTORED: "yes" } },
        goalMet: "restore",
      }
    },
    sidecar: ({ state, args }): CommandResult => {
      if (args[0] === "up") {
        if (state.env.SIDECAR === "up") return { stdout: yellow("sidecar already running on :15432"), goalMet: "sidecar" }
        return {
          stdout: green("sidecar postgres :15432 — empty cluster initialized · ready for restore"),
          statePatch: { env: { ...state.env, SIDECAR: "up" } },
          goalMet: "sidecar",
        }
      }
      if (args[0] === "down") {
        return { stdout: dim("sidecar postgres stopped"), statePatch: { env: { ...state.env, SIDECAR: "down" } } }
      }
      if (args[0] === "status") {
        return { stdout: state.env.SIDECAR === "up" ? green("up · :15432") : dim("down") }
      }
      return { stderr: "sidecar: usage: sidecar up | down | status" }
    },
    psql: ({ state, args }): CommandResult => {
      const target = args[0]
      if (target !== "sidecar") {
        return { stderr: red(`psql: ${target}: connect to 'sidecar' for restore validation, not prod`) }
      }
      if (state.env.RESTORED !== "yes") {
        return { stderr: red("psql: sidecar is empty — pg_restore first") }
      }
      const cIdx = args.indexOf("-c")
      if (cIdx < 0 || !args[cIdx + 1]) return { stderr: "psql: needs -c '<SQL>'" }
      const sql = args.slice(cIdx + 1).join(" ").replace(/^['"`]|['"`]$/g, "")
      const which = state.env.PICKED // "nightly" or "legacy"
      if (/SELECT\s+count\(\*\)\s+FROM\s+users/i.test(sql)) {
        return {
          stdout: dim(" count\r\n-------\r\n") + (which === "legacy" ? " 14823" : " 14823") + "\r\n(1 row)",
        }
      }
      if (/\\dt|count\(\*\)|table/i.test(sql)) {
        const out = which === "legacy" ? SIDECAR_SCHEMA_LEGACY : SIDECAR_SCHEMA_OK
        const validated = which === "nightly" ? "ok" : "schema-mismatch"
        return {
          stdout: out,
          statePatch: { env: { ...state.env, VALIDATED: validated } },
          goalMet: which === "nightly" ? "validate" : undefined,
        }
      }
      return { stdout: dim("(use 'SELECT count(*) FROM users' or '\\dt' to validate the restore)") }
    },
    audit: ({ state, args }): CommandResult => {
      if (args[0] !== "signoff") return { stderr: "audit: usage: audit signoff" }
      const checks = [
        { name: "Backup listed and read",                ok: state.env.LISTED === "yes" },
        { name: "Archive integrity verified",            ok: state.env.VERIFIED === "yes" },
        { name: "Sidecar instance brought up",           ok: state.env.SIDECAR === "up" },
        { name: "Restore landed without error",          ok: state.env.RESTORED === "yes" },
        { name: "Schema + row counts validated",         ok: state.env.VALIDATED === "ok" },
        { name: "Picked the current archive (not legacy)", ok: state.env.PICKED === "nightly" },
      ]
      const lines = checks.map((c) => (c.ok ? green("  ✓ ") + c.name : red("  ✗ ") + c.name))
      const allOk = checks.every((c) => c.ok)
      return {
        stdout:
          bold("Recovery sign-off — audit") + "\r\n" +
          lines.join("\r\n") + "\r\n" +
          (allOk
            ? green("Result: PASS — recovery is REAL. Document RTO and close the page.")
            : red("Result: FAIL — fix the ✗ items.") +
              (state.env.PICKED === "legacy" ? "\r\n" + dim("(hint: legacy-pre-migration.dump predates the api_tokens → api_keys rename. Re-pick the nightly archive.)") : "")),
        goalMet: allOk ? "signoff" : undefined,
      }
    },
    hint: ({ state }) => {
      const r = backupRestoreDrillMission.goals.find((g) => !state.goalsMet.includes(g.id))
      return { stdout: r ? dim("→ ") + yellow(r.label) + dim("  (" + (r.hint ?? "") + ")") : green("All goals met.") }
    },
    goals: ({ state }) => ({ stdout: bold("Goals") + "\r\n" + backupRestoreDrillMission.goals.map((g) => (state.goalsMet.includes(g.id) ? green("  ✓ ") + dim(g.label) : dim("  · ") + g.label)).join("\r\n") }),
    clear: () => ({ stdout: "\x1b[2J\x1b[H" }),
    exit: () => ({ stdout: dim("— session closed —") }),
  },
  initialState,
}
