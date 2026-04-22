// Mission M-002 — "Lock down SSH before the bots find you"
// Disable root login + password auth on a fresh Ubuntu box.

import type { Mission, MissionState } from "../missionEngine"
import { bold, cyan, dim, gold, green, resolvePath, yellow } from "../missionEngine"

const SSHD_INITIAL = `# /etc/ssh/sshd_config — fresh install, still dangerous
Port 22
#PermitRootLogin prohibit-password
PermitRootLogin yes
#PasswordAuthentication yes
PasswordAuthentication yes
#PubkeyAuthentication yes
PubkeyAuthentication yes
ChallengeResponseAuthentication no
UsePAM yes
X11Forwarding yes
PrintMotd no
AcceptEnv LANG LC_*
Subsystem sftp /usr/lib/openssh/sftp-server
`

const README = `Mission M-002 — Lock down SSH
==============================

BRIEF
  You just provisioned hodlberg-web-02. sshd is running with root login +
  password auth enabled. Fail2ban isn't yet installed. Bots are already scanning.

OBJECTIVES
  1. Inspect /etc/ssh/sshd_config
  2. Disable root login
  3. Disable password authentication
  4. Validate sshd config
  5. Reload sshd

HINTS
  type  help
  type  patch no-root-login        disables PermitRootLogin
  type  patch no-password-auth     disables PasswordAuthentication
  type  sshd -t                    validate config
  type  systemctl reload ssh       reload daemon
`

const initialState: MissionState = {
  cwd: "/root",
  fs: {
    "/root/README": { content: README, mode: "ro" },
    "/etc/ssh/sshd_config": { content: SSHD_INITIAL, mode: "rw" },
  },
  env: { SSHD_VALID: "unknown", SSHD_RELOADED: "no" },
  goalsMet: [],
  history: [],
}

export const sshHardeningMission: Mission = {
  slug: "ssh-hardening",
  title: "Lock down SSH before the bots find you",
  brief: "Fresh Ubuntu box, sshd still wide open. Disable root login + password auth, reload sshd. The scans are already inbound.",
  prompt: "defender@hodlberg-web-02:~$ ",

  welcome:
    bold(cyan("╭─────────────────────────────────────────────╮")) + "\r\n" +
    bold(cyan("│ ")) + bold("MISSION M-002 — LOCK DOWN SSH") + bold(cyan("               │")) + "\r\n" +
    bold(cyan("╰─────────────────────────────────────────────╯")) + "\r\n" +
    "\r\n" +
    "hodlberg-web-02 · OpenSSH 8.9 · Ubuntu 22.04\r\n" +
    dim("Read the brief: ") + cyan("cat README") + dim("  ·  type ") + cyan("help") + dim(" for commands.") + "\r\n",

  goals: [
    { id: "inspect-sshd",     label: "Inspect sshd_config",           hint: "cat /etc/ssh/sshd_config" },
    { id: "disable-root",     label: "Disable PermitRootLogin",       hint: "patch no-root-login" },
    { id: "disable-password", label: "Disable PasswordAuthentication",hint: "patch no-password-auth" },
    { id: "validate-sshd",    label: "Validate sshd config",          hint: "sshd -t" },
    { id: "reload-sshd",      label: "Reload sshd",                   hint: "systemctl reload ssh" },
  ],

  success:
    gold("╭─────────────────────────────────────────────╮") + "\r\n" +
    gold("│  🏆  MISSION COMPLETE — SSH LOCKED DOWN    │") + "\r\n" +
    gold("╰─────────────────────────────────────────────╯") + "\r\n" +
    dim("Defender XP: ") + green("+140") + dim("   Root login + password auth = disabled. Bots can keep scanning — they won't find a door.") + "\r\n",

  commands: {
    help: () => ({
      stdout:
        bold("Commands") + "\r\n" +
        "  " + cyan("help  ls [path]  pwd  cd <p>  cat <f>  clear  hint  goals") + "\r\n" +
        "  " + cyan("patch no-root-login") + "         disables PermitRootLogin\r\n" +
        "  " + cyan("patch no-password-auth") + "      disables PasswordAuthentication\r\n" +
        "  " + cyan("sshd -t") + "                     validate sshd config\r\n" +
        "  " + cyan("systemctl reload ssh") + "        reload ssh daemon\r\n",
    }),

    pwd: ({ state }) => ({ stdout: state.cwd }),
    cd: ({ state, args }) => ({ statePatch: { cwd: resolvePath(state.cwd, args[0] ?? "/root") }, stdout: "" }),

    ls: ({ state, args }) => {
      const path = args[0] ? resolvePath(state.cwd, args[0]) : state.cwd
      const prefix = path === "/" ? "/" : path + "/"
      const names = new Set<string>()
      for (const full of Object.keys(state.fs)) {
        if (full === path || !full.startsWith(prefix)) continue
        const rest = full.slice(prefix.length)
        const first = rest.split("/")[0]
        if (first) names.add(first)
      }
      return { stdout: Array.from(names).sort().map((n) => cyan(n)).join("  ") }
    },

    cat: ({ state, args }) => {
      if (!args[0]) return { stderr: "cat: missing file operand" }
      const path = resolvePath(state.cwd, args[0])
      const entry = state.fs[path] ?? (args[0] === "README" ? state.fs["/root/README"] : undefined)
      if (!entry) return { stderr: `cat: ${args[0]}: no such file` }
      return {
        stdout: entry.content,
        goalMet: path === "/etc/ssh/sshd_config" ? "inspect-sshd" : undefined,
      }
    },

    patch: ({ state, args }) => {
      const confPath = "/etc/ssh/sshd_config"
      let current = state.fs[confPath]?.content ?? ""
      if (args[0] === "no-root-login") {
        if (/^PermitRootLogin\s+no/m.test(current)) return { stdout: yellow("already set — PermitRootLogin no"), goalMet: "disable-root" }
        current = current.replace(/^PermitRootLogin\s+yes/m, "PermitRootLogin no")
        return {
          statePatch: { fs: { [confPath]: { content: current, mode: "rw" } }, env: { ...state.env, SSHD_VALID: "stale" } },
          stdout: green("PermitRootLogin yes → no"),
          goalMet: "disable-root",
        }
      }
      if (args[0] === "no-password-auth") {
        if (/^PasswordAuthentication\s+no/m.test(current)) return { stdout: yellow("already set — PasswordAuthentication no"), goalMet: "disable-password" }
        current = current.replace(/^PasswordAuthentication\s+yes/m, "PasswordAuthentication no")
        return {
          statePatch: { fs: { [confPath]: { content: current, mode: "rw" } }, env: { ...state.env, SSHD_VALID: "stale" } },
          stdout: green("PasswordAuthentication yes → no") + "\r\n" + dim("Make sure your pubkey is in ~/.ssh/authorized_keys before you reload."),
          goalMet: "disable-password",
        }
      }
      return { stderr: "patch: unknown patch. Try 'patch no-root-login' or 'patch no-password-auth'" }
    },

    sshd: ({ state, args }) => {
      if (args[0] !== "-t") return { stderr: "sshd: only 'sshd -t' is supported in this mission" }
      const conf = state.fs["/etc/ssh/sshd_config"]?.content ?? ""
      const okRoot = /^PermitRootLogin\s+no/m.test(conf)
      const okPw = /^PasswordAuthentication\s+no/m.test(conf)
      if (!okRoot || !okPw) {
        return { stderr: "sshd config still weak — apply both patches first" }
      }
      return {
        statePatch: { env: { ...state.env, SSHD_VALID: "ok" } },
        stdout: green("sshd: configuration file tested successfully"),
        goalMet: "validate-sshd",
      }
    },

    systemctl: ({ state, args }) => {
      if (args[0] !== "reload" || (args[1] !== "ssh" && args[1] !== "sshd")) {
        return { stderr: "systemctl: only 'systemctl reload ssh' is available in this mission" }
      }
      if (state.env.SSHD_VALID !== "ok") return { stderr: "systemctl: refusing to reload — run 'sshd -t' first and make it green" }
      return {
        statePatch: { env: { ...state.env, SSHD_RELOADED: "yes" } },
        stdout: green("● ssh.service reloaded. active connections preserved."),
        goalMet: "reload-sshd",
      }
    },

    hint: ({ state }) => {
      const remaining = sshHardeningMission.goals.find((g) => !state.goalsMet.includes(g.id))
      if (!remaining) return { stdout: green("All goals met.") }
      return { stdout: dim("→ ") + yellow(remaining.label) + dim("  (" + (remaining.hint ?? "") + ")") }
    },

    goals: ({ state }) => ({
      stdout: bold("Goals") + "\r\n" +
        sshHardeningMission.goals.map((g) => {
          const done = state.goalsMet.includes(g.id)
          return (done ? green("  ✓ ") : dim("  · ")) + (done ? dim(g.label) : g.label)
        }).join("\r\n"),
    }),

    clear: () => ({ stdout: "\x1b[2J\x1b[H" }),
    exit: () => ({ stdout: dim("— session closed —") }),
  },

  initialState,
}
