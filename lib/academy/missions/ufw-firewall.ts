// Mission M-003 — "Firewall: only what you actually need"
// Deploy UFW on a box that's leaking ports.

import type { Mission, MissionState } from "../missionEngine"
import { bold, cyan, dim, gold, green, resolvePath, yellow } from "../missionEngine"

const NETSTAT = `Active Internet connections (only servers)
tcp   0.0.0.0:22      LISTEN   sshd
tcp   0.0.0.0:80      LISTEN   nginx
tcp   0.0.0.0:443     LISTEN   nginx
tcp   0.0.0.0:5432    LISTEN   postgres
tcp   0.0.0.0:6379    LISTEN   redis-server
tcp   0.0.0.0:9200    LISTEN   elasticsearch
tcp   0.0.0.0:3306    LISTEN   mysqld
`

const README = `Mission M-003 — Firewall UFW
=============================

BRIEF
  hodlberg-db-01 is internet-exposed and listening on seven ports, including
  Postgres, MySQL, Redis and Elasticsearch. None of them belong on the public
  internet. Install UFW, set sensible defaults, expose only SSH, enable.

OBJECTIVES
  1. See what's listening
  2. Set default deny incoming
  3. Allow SSH (22/tcp)
  4. Enable UFW
  5. Verify rules

HINTS
  ss -tln                         list sockets
  ufw default deny incoming
  ufw allow 22/tcp
  ufw enable
  ufw status
`

const initialState: MissionState = {
  cwd: "/root",
  fs: {
    "/root/README":  { content: README, mode: "ro" },
    "/proc/net/tcp": { content: NETSTAT, mode: "ro" },
  },
  env: { UFW_DEFAULT_IN: "allow", UFW_SSH: "no", UFW_ENABLED: "no", SEEN_SOCKETS: "no" },
  goalsMet: [],
  history: [],
}

export const ufwFirewallMission: Mission = {
  slug: "ufw-firewall",
  title: "Firewall: only what you actually need",
  brief: "An exposed DB host listening on seven ports. Configure UFW to allow only SSH, enable, confirm.",
  prompt: "defender@hodlberg-db-01:~# ",

  welcome:
    bold(cyan("╭─────────────────────────────────────────────╮")) + "\r\n" +
    bold(cyan("│ ")) + bold("MISSION M-003 — UFW") + bold(cyan("                         │")) + "\r\n" +
    bold(cyan("╰─────────────────────────────────────────────╯")) + "\r\n\r\n" +
    "hodlberg-db-01 · Ubuntu 22.04 · ufw 0.36\r\n" +
    dim("Read the brief: ") + cyan("cat README") + dim("  ·  ") + cyan("help") + "\r\n",

  goals: [
    { id: "see-sockets",  label: "List listening sockets",         hint: "ss -tln" },
    { id: "default-deny", label: "Default deny incoming",          hint: "ufw default deny incoming" },
    { id: "allow-ssh",    label: "Allow SSH",                       hint: "ufw allow 22/tcp" },
    { id: "enable",       label: "Enable UFW",                      hint: "ufw enable" },
    { id: "status",       label: "Verify with ufw status",          hint: "ufw status" },
  ],

  success:
    gold("╭─────────────────────────────────────────────╮") + "\r\n" +
    gold("│  🏆  MISSION COMPLETE — FIREWALL UP        │") + "\r\n" +
    gold("╰─────────────────────────────────────────────╯") + "\r\n" +
    dim("Defender XP: ") + green("+130") + dim("   Postgres, Redis, MySQL, ES — all invisible from the public internet.") + "\r\n",

  commands: {
    help: () => ({
      stdout:
        bold("Commands") + "\r\n  " +
        cyan("help  ls  cat <f>  cd  pwd  clear  hint  goals") + "\r\n" +
        "  " + cyan("ss -tln") + "                       list listening sockets\r\n" +
        "  " + cyan("ufw default deny incoming") + "     set inbound default\r\n" +
        "  " + cyan("ufw allow 22/tcp") + "              allow SSH\r\n" +
        "  " + cyan("ufw enable") + "                    enable firewall\r\n" +
        "  " + cyan("ufw status") + "                    show rules\r\n",
    }),

    pwd: ({ state }) => ({ stdout: state.cwd }),
    cd: ({ state, args }) => ({ statePatch: { cwd: resolvePath(state.cwd, args[0] ?? "/root") }, stdout: "" }),
    ls: ({ state }) => ({ stdout: Object.keys(state.fs).filter((p) => p.startsWith(state.cwd + "/") || p === state.cwd).join("  ") || dim("(empty)") }),

    cat: ({ state, args }) => {
      if (!args[0]) return { stderr: "cat: missing file" }
      const path = resolvePath(state.cwd, args[0])
      const entry = state.fs[path] ?? (args[0] === "README" ? state.fs["/root/README"] : undefined)
      if (!entry) return { stderr: `cat: ${args[0]}: no such file` }
      return { stdout: entry.content }
    },

    ss: ({ args }) => {
      if (args[0] !== "-tln") return { stderr: "ss: only 'ss -tln' is available" }
      return {
        stdout: NETSTAT,
        statePatch: { env: { SEEN_SOCKETS: "yes" } },
        goalMet: "see-sockets",
      }
    },

    ufw: ({ state, args }) => {
      if (args[0] === "default" && args[1] === "deny" && args[2] === "incoming") {
        return {
          stdout: green("Default incoming policy changed to 'deny'"),
          statePatch: { env: { ...state.env, UFW_DEFAULT_IN: "deny" } },
          goalMet: "default-deny",
        }
      }
      if (args[0] === "allow" && (args[1] === "22/tcp" || args[1] === "22")) {
        return {
          stdout: green("Rules updated: allow 22/tcp"),
          statePatch: { env: { ...state.env, UFW_SSH: "yes" } },
          goalMet: "allow-ssh",
        }
      }
      if (args[0] === "enable") {
        if (state.env.UFW_SSH !== "yes") {
          return { stderr: "ufw: refusing to enable — you'd lock yourself out. Allow SSH first." }
        }
        return {
          stdout: green("Firewall is active and enabled on system startup."),
          statePatch: { env: { ...state.env, UFW_ENABLED: "yes" } },
          goalMet: "enable",
        }
      }
      if (args[0] === "status") {
        if (state.env.UFW_ENABLED !== "yes") return { stdout: yellow("Status: inactive") }
        return {
          stdout:
            bold("Status: active") + "\r\n\r\n" +
            "To                         Action      From\r\n" +
            "--                         ------      ----\r\n" +
            "22/tcp                     ALLOW       Anywhere",
          goalMet: "status",
        }
      }
      return { stderr: "ufw: unknown subcommand. Try 'help'." }
    },

    hint: ({ state }) => {
      const r = ufwFirewallMission.goals.find((g) => !state.goalsMet.includes(g.id))
      return { stdout: r ? dim("→ ") + yellow(r.label) + dim("  (" + (r.hint ?? "") + ")") : green("All goals met.") }
    },

    goals: ({ state }) => ({
      stdout: bold("Goals") + "\r\n" + ufwFirewallMission.goals.map((g) => {
        const done = state.goalsMet.includes(g.id)
        return (done ? green("  ✓ ") : dim("  · ")) + (done ? dim(g.label) : g.label)
      }).join("\r\n"),
    }),

    clear: () => ({ stdout: "\x1b[2J\x1b[H" }),
    exit: () => ({ stdout: dim("— session closed —") }),
  },

  initialState,
}
