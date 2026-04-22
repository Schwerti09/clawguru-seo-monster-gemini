// Mission M-005 — "Misconfig Hunt: fix the top three"
// A Claw Score dropped overnight. Find and fix the 3 flagged issues.

import type { Mission, MissionState } from "../missionEngine"
import { bold, cyan, dim, gold, green, red, resolvePath, yellow } from "../missionEngine"

const REPORT = `ClawGuru Security Scan — hodlberg-web-03
========================================

  SCORE: 58 / 100      GRADE: D      TIME: 2026-04-22T02:14Z

FINDINGS (3 critical, 2 medium, 7 informational)

  [C1]  /etc/nginx/sites-enabled/default
        directory listing enabled (autoindex on)
        impact: path traversal, information disclosure

  [C2]  /var/www/secrets.env
        world-readable (mode 0644)
        impact: credential exposure

  [C3]  /etc/nginx/sites-enabled/default
        server_tokens enabled (version leak in Server header)
        impact: fingerprinting + known-CVE targeting

Run 'fix <C1|C2|C3>' to open the guided fix for each finding.
Run 'rescan' after all 3 are fixed to confirm grade.
`

const NGINX_DEFAULT_INITIAL = `# /etc/nginx/sites-enabled/default
server {
    listen 80 default_server;
    server_name _;

    autoindex on;
    server_tokens on;

    location / {
        root /var/www/html;
    }
}
`

const SECRETS = `DB_PASSWORD=hunter2
STRIPE_KEY=sk_live_redacted_for_training
JWT_SECRET=dev-please-rotate
`

const README = `Mission M-005 — Misconfig Hunt
==============================

BRIEF
  The overnight Claw Score dropped to 58 (D). Three critical findings.
  Find them, fix them, rescan.

OBJECTIVES
  1. Read the scan report
  2. Fix C1 — directory listing
  3. Fix C2 — world-readable secrets
  4. Fix C3 — server tokens / version leak
  5. Rescan and pass (≥ 90)

HINTS
  cat /var/log/claw/latest.report
  fix C1
  fix C2
  fix C3
  rescan
`

const initialState: MissionState = {
  cwd: "/root",
  fs: {
    "/root/README": { content: README, mode: "ro" },
    "/var/log/claw/latest.report": { content: REPORT, mode: "ro" },
    "/etc/nginx/sites-enabled/default": { content: NGINX_DEFAULT_INITIAL, mode: "rw" },
    "/var/www/secrets.env": { content: SECRETS, mode: "rw" },
  },
  env: { C1_FIXED: "no", C2_FIXED: "no", C3_FIXED: "no", SECRETS_MODE: "0644" },
  goalsMet: [],
  history: [],
}

export const misconfigHuntMission: Mission = {
  slug: "misconfig-hunt",
  title: "Misconfig Hunt — fix the top three",
  brief: "Claw Score dropped to D overnight. Three critical findings. Fix them all and rescan to A.",
  prompt: "defender@hodlberg-web-03:~# ",

  welcome:
    bold(cyan("╭─────────────────────────────────────────────╮")) + "\r\n" +
    bold(cyan("│ ")) + bold("MISSION M-005 — MISCONFIG HUNT") + bold(cyan("              │")) + "\r\n" +
    bold(cyan("╰─────────────────────────────────────────────╯")) + "\r\n\r\n" +
    red("SCORE: 58  GRADE: D") + dim("   — three critical findings") + "\r\n" +
    dim("Read: ") + cyan("cat /var/log/claw/latest.report") + dim("  ·  ") + cyan("help") + "\r\n",

  goals: [
    { id: "read-report", label: "Read the scan report", hint: "cat /var/log/claw/latest.report" },
    { id: "fix-c1",      label: "Fix C1 — disable autoindex", hint: "fix C1" },
    { id: "fix-c2",      label: "Fix C2 — secure file permissions", hint: "fix C2" },
    { id: "fix-c3",      label: "Fix C3 — hide server tokens", hint: "fix C3" },
    { id: "rescan",      label: "Rescan and hit grade A", hint: "rescan" },
  ],

  success:
    gold("╭─────────────────────────────────────────────╮") + "\r\n" +
    gold("│  🏆  MISSION COMPLETE — GRADE A            │") + "\r\n" +
    gold("╰─────────────────────────────────────────────╯") + "\r\n" +
    dim("Defender XP: ") + green("+160") + dim("   From D to A in under 4 minutes. That's the job.") + "\r\n",

  commands: {
    help: () => ({
      stdout:
        bold("Commands") + "\r\n  " +
        cyan("help  ls  cat <f>  cd  pwd  clear  hint  goals") + "\r\n" +
        "  " + cyan("fix C1 | C2 | C3") + "   apply guided fix for a finding\r\n" +
        "  " + cyan("rescan") + "            re-run the security scan\r\n",
    }),

    pwd: ({ state }) => ({ stdout: state.cwd }),
    cd: ({ state, args }) => ({ statePatch: { cwd: resolvePath(state.cwd, args[0] ?? "/root") }, stdout: "" }),
    ls: ({ state }) => ({ stdout: Object.keys(state.fs).join("\r\n") }),

    cat: ({ state, args }) => {
      if (!args[0]) return { stderr: "cat: missing file" }
      const path = resolvePath(state.cwd, args[0])
      const entry = state.fs[path] ?? (args[0] === "README" ? state.fs["/root/README"] : undefined)
      if (!entry) return { stderr: `cat: ${args[0]}: no such file` }
      return {
        stdout: entry.content,
        goalMet: path === "/var/log/claw/latest.report" ? "read-report" : undefined,
      }
    },

    fix: ({ state, args }) => {
      const confPath = "/etc/nginx/sites-enabled/default"
      let conf = state.fs[confPath]?.content ?? ""

      if (args[0] === "C1") {
        if (state.env.C1_FIXED === "yes") return { stdout: yellow("already fixed."), goalMet: "fix-c1" }
        conf = conf.replace("autoindex on;", "# autoindex off (hardened)")
        return {
          stdout: green("C1 fixed — autoindex disabled in nginx default vhost"),
          statePatch: { fs: { [confPath]: { content: conf, mode: "rw" } }, env: { ...state.env, C1_FIXED: "yes" } },
          goalMet: "fix-c1",
        }
      }
      if (args[0] === "C2") {
        if (state.env.C2_FIXED === "yes") return { stdout: yellow("already fixed."), goalMet: "fix-c2" }
        return {
          stdout: green("C2 fixed — chmod 600 /var/www/secrets.env  (owner-only)"),
          statePatch: { env: { ...state.env, C2_FIXED: "yes", SECRETS_MODE: "0600" } },
          goalMet: "fix-c2",
        }
      }
      if (args[0] === "C3") {
        if (state.env.C3_FIXED === "yes") return { stdout: yellow("already fixed."), goalMet: "fix-c3" }
        conf = conf.replace("server_tokens on;", "server_tokens off;")
        return {
          stdout: green("C3 fixed — server_tokens off (no version leak)"),
          statePatch: { fs: { [confPath]: { content: conf, mode: "rw" } }, env: { ...state.env, C3_FIXED: "yes" } },
          goalMet: "fix-c3",
        }
      }
      return { stderr: "fix: unknown finding. Try 'fix C1', 'fix C2', or 'fix C3'." }
    },

    rescan: ({ state }) => {
      const fixed = [state.env.C1_FIXED, state.env.C2_FIXED, state.env.C3_FIXED].filter((v) => v === "yes").length
      if (fixed < 3) {
        return { stderr: `rescan: ${fixed}/3 critical findings fixed. Keep going — 'fix C1|C2|C3' is your friend.` }
      }
      return {
        stdout:
          green("ClawGuru Security Scan — hodlberg-web-03") + "\r\n" +
          "==========================================\r\n" +
          bold(green("  SCORE: 94 / 100      GRADE: A")) + "\r\n" +
          "  criticals: 0    mediums: 0    informational: 7\r\n",
        goalMet: "rescan",
      }
    },

    hint: ({ state }) => {
      const r = misconfigHuntMission.goals.find((g) => !state.goalsMet.includes(g.id))
      return { stdout: r ? dim("→ ") + yellow(r.label) + dim("  (" + (r.hint ?? "") + ")") : green("All goals met.") }
    },

    goals: ({ state }) => ({
      stdout: bold("Goals") + "\r\n" + misconfigHuntMission.goals.map((g) => {
        const done = state.goalsMet.includes(g.id)
        return (done ? green("  ✓ ") : dim("  · ")) + (done ? dim(g.label) : g.label)
      }).join("\r\n"),
    }),

    clear: () => ({ stdout: "\x1b[2J\x1b[H" }),
    exit: () => ({ stdout: dim("— session closed —") }),
  },

  initialState,
}
