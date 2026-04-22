// Mission M-001 — "Ship HSTS before the crawler comes"
// Beginner-friendly first mission proving the engine works end-to-end.
//
// Scenario: hodlberg-web-01 serves https but is missing HSTS. A security
// scanner is scheduled to run in 60s. Add Strict-Transport-Security, verify,
// reload nginx.

import type { Mission, MissionState } from "../missionEngine"
import { bold, cyan, dim, gold, green, red, resolvePath, yellow } from "../missionEngine"

const NGINX_CONF_INITIAL = `# /etc/nginx/sites-enabled/hodlberg.conf
server {
    listen 443 ssl http2;
    server_name hodlberg.ag;

    ssl_certificate     /etc/letsencrypt/live/hodlberg.ag/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/hodlberg.ag/privkey.pem;

    # Security headers (INCOMPLETE — this is what you need to fix)
    add_header X-Frame-Options           "DENY"    always;
    add_header X-Content-Type-Options    "nosniff" always;

    location / {
        proxy_pass http://127.0.0.1:3000;
    }
}
`

const README = `Mission M-001 — Ship HSTS
==========================

BRIEF
  You are the defender for Hodlberg AG. A compliance crawler runs in 60s.
  hodlberg.ag must serve Strict-Transport-Security (HSTS) or the audit fails.

OBJECTIVES
  1. Inspect the nginx config.
  2. Add Strict-Transport-Security header.
  3. Verify nginx config is valid.
  4. Reload nginx.

HINTS
  - type  help                 to see commands
  - type  ls /etc/nginx/sites-enabled
  - type  cat <file>           to read
  - type  patch hsts           to apply the HSTS header (guided fix)
  - type  nginx -t             to validate config
  - type  systemctl reload nginx
`

const initialState: MissionState = {
  cwd: "/root",
  fs: {
    "/root/README": { content: README, mode: "ro" },
    "/etc/nginx/sites-enabled/hodlberg.conf": { content: NGINX_CONF_INITIAL, mode: "rw" },
    "/etc/nginx/nginx.conf": { content: "# global config — unchanged for this mission\n", mode: "ro" },
  },
  env: { NGINX_VALID: "unknown", NGINX_RELOADED: "no" },
  goalsMet: [],
  history: [],
}

export const nginxHstsMission: Mission = {
  slug: "nginx-hsts",
  title: "Ship HSTS before the crawler comes",
  brief: "A compliance crawler hits hodlberg.ag in 60s. Add Strict-Transport-Security, verify, reload — without breaking production.",
  prompt: "defender@hodlberg:~$ ",

  welcome:
    bold(cyan("╭─────────────────────────────────────────────╮")) + "\r\n" +
    bold(cyan("│ ")) + bold("MISSION M-001 — SHIP HSTS") + bold(cyan("                   │")) + "\r\n" +
    bold(cyan("╰─────────────────────────────────────────────╯")) + "\r\n" +
    "\r\n" +
    "hodlberg-web-01 · nginx 1.24 · Ubuntu 22.04\r\n" +
    dim("Read the brief: ") + cyan("cat README") + "\r\n" +
    dim("Type ") + cyan("help") + dim(" for commands.\r\n"),

  goals: [
    { id: "read-readme",  label: "Read the mission brief",          hint: "cat README" },
    { id: "inspect-conf", label: "Inspect the vhost config",        hint: "cat /etc/nginx/sites-enabled/hodlberg.conf" },
    { id: "apply-hsts",   label: "Add Strict-Transport-Security",   hint: "patch hsts" },
    { id: "validate",     label: "Validate nginx config",           hint: "nginx -t" },
    { id: "reload",       label: "Reload nginx",                    hint: "systemctl reload nginx" },
  ],

  success:
    gold("╭─────────────────────────────────────────────╮") + "\r\n" +
    gold("│  🏆  MISSION COMPLETE — HSTS SHIPPED       │") + "\r\n" +
    gold("╰─────────────────────────────────────────────╯") + "\r\n" +
    "\r\n" +
    dim("Defender XP:  ") + green("+120") + "\r\n" +
    dim("Time-to-Harden: ") + green("under 60s") + "\r\n" +
    dim("The compliance crawler just got a 200 OK with Strict-Transport-Security. Nice.") + "\r\n",

  commands: {
    help: () => ({
      stdout:
        bold("Available commands:") + "\r\n" +
        "  " + cyan("help") + "                       show this\r\n" +
        "  " + cyan("ls [path]") + "                  list files\r\n" +
        "  " + cyan("pwd") + "                        print working directory\r\n" +
        "  " + cyan("cd <path>") + "                  change directory\r\n" +
        "  " + cyan("cat <file>") + "                 read file\r\n" +
        "  " + cyan("patch hsts") + "                 guided fix — adds HSTS header\r\n" +
        "  " + cyan("nginx -t") + "                   validate nginx config\r\n" +
        "  " + cyan("systemctl reload nginx") + "     reload nginx\r\n" +
        "  " + cyan("hint") + "                       show current objective hint\r\n" +
        "  " + cyan("clear") + "                      clear the screen\r\n" +
        "  " + cyan("goals") + "                      show mission goals\r\n",
    }),

    pwd: ({ state }) => ({ stdout: state.cwd }),

    cd: ({ state, args }) => {
      const target = resolvePath(state.cwd, args[0] ?? "/root")
      return { statePatch: { cwd: target }, stdout: "" }
    },

    ls: ({ state, args }) => {
      const path = args[0] ? resolvePath(state.cwd, args[0]) : state.cwd
      const prefix = path === "/" ? "/" : path + "/"
      const entries = Object.keys(state.fs).filter((p) => p === path || p.startsWith(prefix))
      if (entries.length === 0) return { stderr: `ls: cannot access '${path}': no such directory` }
      const names = new Set<string>()
      for (const full of entries) {
        if (full === path) continue
        const rest = full.slice(prefix.length)
        const first = rest.split("/")[0]
        if (first) names.add(first)
      }
      return { stdout: Array.from(names).sort().map((n) => cyan(n)).join("  ") }
    },

    cat: ({ state, args }) => {
      if (!args[0]) return { stderr: "cat: missing file operand" }
      const path = resolvePath(state.cwd, args[0])
      const entry =
        state.fs[path] ??
        (args[0] === "README" ? state.fs["/root/README"] : undefined) ??
        (args[0] === "hodlberg.conf" ? state.fs["/etc/nginx/sites-enabled/hodlberg.conf"] : undefined)
      if (!entry) return { stderr: `cat: ${args[0]}: no such file` }
      const isReadme = path === "/root/README" || args[0] === "README"
      const isConf = path === "/etc/nginx/sites-enabled/hodlberg.conf"
      return {
        stdout: entry.content,
        goalMet: isReadme ? "read-readme" : isConf ? "inspect-conf" : undefined,
      }
    },

    patch: ({ state, args }) => {
      if (args[0] !== "hsts") return { stderr: "patch: unknown patch. try 'patch hsts'" }
      const confPath = "/etc/nginx/sites-enabled/hodlberg.conf"
      const current = state.fs[confPath]?.content ?? ""
      if (current.includes("Strict-Transport-Security")) {
        return { stdout: yellow("already patched — HSTS header present."), goalMet: "apply-hsts" }
      }
      const patched = current.replace(
        /(add_header X-Content-Type-Options[^\n]+\n)/,
        `$1    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;\n`,
      )
      return {
        statePatch: { fs: { [confPath]: { content: patched, mode: "rw" } }, env: { ...state.env, NGINX_VALID: "stale" } },
        stdout:
          green("Applied patch: Strict-Transport-Security header inserted.") + "\r\n" +
          dim("Config written to " + confPath + "\r\n") +
          dim("Don't forget: ") + cyan("nginx -t") + dim(" then ") + cyan("systemctl reload nginx"),
        goalMet: "apply-hsts",
      }
    },

    nginx: ({ state, args }) => {
      if (args[0] !== "-t") return { stderr: "nginx: only 'nginx -t' is available in this mission" }
      const conf = state.fs["/etc/nginx/sites-enabled/hodlberg.conf"]?.content ?? ""
      const hasHsts = conf.includes("Strict-Transport-Security")
      if (!hasHsts) {
        return {
          statePatch: { env: { ...state.env, NGINX_VALID: "warn" } },
          stdout:
            yellow("nginx: [warn] missing HSTS header on https vhost") + "\r\n" +
            "nginx: configuration file /etc/nginx/nginx.conf test is successful",
        }
      }
      return {
        statePatch: { env: { ...state.env, NGINX_VALID: "ok" } },
        stdout:
          green("nginx: the configuration file /etc/nginx/nginx.conf syntax is ok") + "\r\n" +
          green("nginx: configuration file /etc/nginx/nginx.conf test is successful"),
        goalMet: "validate",
      }
    },

    systemctl: ({ state, args }) => {
      if (args[0] !== "reload" || args[1] !== "nginx") {
        return { stderr: "systemctl: only 'systemctl reload nginx' is available in this mission" }
      }
      if (state.env.NGINX_VALID !== "ok") {
        return { stderr: "systemctl: refusing to reload — run 'nginx -t' first and make sure it returns ok" }
      }
      return {
        statePatch: { env: { ...state.env, NGINX_RELOADED: "yes" } },
        stdout: green("● nginx.service reloaded. workers: 4. zero downtime."),
        goalMet: "reload",
      }
    },

    hint: ({ state }) => {
      const remaining = nginxHstsMission.goals.find((g) => !state.goalsMet.includes(g.id))
      if (!remaining) return { stdout: green("All goals met.") }
      return { stdout: dim("→ ") + yellow(remaining.label) + dim("  (" + (remaining.hint ?? "") + ")") }
    },

    goals: ({ state }) => {
      const lines = nginxHstsMission.goals.map((g) => {
        const done = state.goalsMet.includes(g.id)
        return (done ? green("  ✓ ") : dim("  · ")) + (done ? dim(g.label) : g.label)
      })
      return { stdout: bold("Goals") + "\r\n" + lines.join("\r\n") }
    },

    clear: () => ({ stdout: "\x1b[2J\x1b[H" }),

    exit: () => ({ stdout: dim("— session closed. reopen to retry —") }),
  },

  initialState,
}
