// Mission M-008 — "The bots found /login. Stop them without locking out users."
//
// Track: Intermediate (Stack Hardening)
// Narrative continuity: hodlberg.ag is the same vhost from M-001 (nginx-hsts).
// HSTS shipped, certs auto-renew (M-004), but now a credential-stuffing wave
// is hitting /api/auth/login at 4000 req/min from rotating residential IPs.
// Ops dashboard is red. Defender has 30 min to deploy effective rate-limiting
// + bot fingerprint denial WITHOUT taking down legitimate users.
//
// Pedagogy:
//   - Rate-limiting is *zone-based* in nginx — learner sees the difference
//     between limit_req_zone (define) and limit_req (apply).
//   - The /login zone is per-IP; the /api/* zone is per-token (X-Api-Key
//     hash) — different keys for different abuse models.
//   - User-agent allowlists + geo-block for non-target markets are surgical,
//     not nuclear. The mission rewards proportional response.
//   - The "verify" step actually replays attacker traffic vs. real user
//     traffic against the rule set. If the rule blocks real users → fail.

import type { CommandResult, Mission, MissionState } from "../missionEngine"
import { bold, cyan, dim, gold, green, red, resolvePath, yellow } from "../missionEngine"

const NGINX_CONF_INITIAL = `# /etc/nginx/sites-enabled/hodlberg.conf
server {
    listen 443 ssl http2;
    server_name hodlberg.ag;

    ssl_certificate     /etc/letsencrypt/live/hodlberg.ag/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/hodlberg.ag/privkey.pem;

    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header X-Frame-Options           "DENY"    always;
    add_header X-Content-Type-Options    "nosniff" always;

    # No rate limiting — credential-stuffing is hitting /api/auth/login
    # No bot defense — scrapers walk /api/v1/*

    location / {
        proxy_pass http://127.0.0.1:3000;
    }
}
`

const NGINX_CTX_INITIAL = `# /etc/nginx/nginx.conf  (http context excerpt — global zones live here)
http {
    # No limit_req_zone declared. Per-IP rate state lives nowhere.
    # No map declarations for bot fingerprinting.
    sendfile on;
    keepalive_timeout 65;
}
`

const TRAFFIC_SAMPLE = `# /var/log/nginx/sample.jsonl  (10s capture, 4 lines per IP class)
{"ip":"193.27.14.92","ua":"python-requests/2.28","path":"/api/auth/login","rps":42,"class":"attacker"}
{"ip":"45.142.122.14","ua":"curl/7.81","path":"/api/auth/login","rps":38,"class":"attacker"}
{"ip":"185.220.101.7","ua":"Go-http-client/1.1","path":"/api/v1/users","rps":61,"class":"scraper"}
{"ip":"79.143.180.5","ua":"Mozilla/5.0 (Windows NT 10.0; Win64) Chrome/126","path":"/api/auth/login","rps":1,"class":"user"}
{"ip":"82.165.21.99","ua":"Mozilla/5.0 (Macintosh; Intel) Safari/17","path":"/api/v1/dashboard","rps":4,"class":"user"}
`

const README = `Mission M-008 — Rate-Limit + Bot Defense
=========================================

BRIEF
  Same vhost as M-001 (hodlberg.conf). HSTS shipped. Now /api/auth/login is
  under credential-stuffing — 4000 req/min from rotating residential IPs.
  /api/v1/* is being scraped by Go/Python user-agents. SOC alert went red.

  Drop the attacker traffic. Don't kill real users.

OBJECTIVES
  1. Inspect the live traffic sample
  2. Define a per-IP rate-limit zone (10MB shared memory)
  3. Apply rate-limit to /api/auth/login (5 req/min, burst 10)
  4. Add a User-Agent denylist for known headless clients
  5. Validate config (nginx -t)
  6. Reload nginx
  7. Replay traffic and confirm: attackers blocked, users pass

HINTS
  cat sample.jsonl
  cat nginx.conf
  cat hodlberg.conf
  patch ratelimit-zone
  patch ratelimit-login
  patch ua-deny
  nginx -t
  systemctl reload nginx
  replay traffic
`

const initialState: MissionState = {
  cwd: "/etc/nginx",
  fs: {
    "/etc/nginx/README":                       { content: README,              mode: "ro" },
    "/etc/nginx/nginx.conf":                   { content: NGINX_CTX_INITIAL,   mode: "rw" },
    "/etc/nginx/sites-enabled/hodlberg.conf":  { content: NGINX_CONF_INITIAL,  mode: "rw" },
    "/var/log/nginx/sample.jsonl":             { content: TRAFFIC_SAMPLE,      mode: "ro" },
  },
  env: {
    INSPECTED:  "no",
    ZONE_OK:    "no",
    LOGIN_OK:   "no",
    UA_OK:      "no",
    CONF_VALID: "unknown",
    RELOADED:   "no",
  },
  goalsMet: [],
  history: [],
}

const SHORTCUTS: Record<string, string> = {
  "README":            "/etc/nginx/README",
  "nginx.conf":        "/etc/nginx/nginx.conf",
  "hodlberg.conf":     "/etc/nginx/sites-enabled/hodlberg.conf",
  "sample.jsonl":      "/var/log/nginx/sample.jsonl",
}

function resolveFile(state: MissionState, raw: string): string | undefined {
  const p = resolvePath(state.cwd, raw)
  if (state.fs[p]) return p
  return SHORTCUTS[raw]
}

export const reverseProxyRatelimitMission: Mission = {
  slug: "reverse-proxy-ratelimit",
  title: "Stop the credential-stuffing wave on /login — without locking out users",
  brief: "/api/auth/login is taking 4000 req/min from rotating IPs. Define a rate-limit zone, apply it surgically, deny headless UAs. Validate against real traffic.",
  prompt: "defender@hodlberg-edge:/etc/nginx$ ",
  welcome:
    bold(cyan("╭──────────────────────────────────────────────╮")) + "\r\n" +
    bold(cyan("│ ")) + bold("MISSION M-008 — RATE-LIMIT + BOT DEFENSE") + bold(cyan("    │")) + "\r\n" +
    bold(cyan("╰──────────────────────────────────────────────╯")) + "\r\n\r\n" +
    "hodlberg-edge · nginx 1.24 · 4000 req/min hitting /api/auth/login\r\n" +
    dim("Read the brief: ") + cyan("cat README") + dim("  ·  Live traffic: ") + cyan("cat sample.jsonl") + "\r\n",
  goals: [
    { id: "inspect",     label: "Inspect the live traffic sample",         hint: "cat sample.jsonl" },
    { id: "zone",        label: "Define limit_req_zone in http context",   hint: "patch ratelimit-zone" },
    { id: "login",       label: "Apply zone to /api/auth/login",           hint: "patch ratelimit-login" },
    { id: "ua",          label: "Deny known headless user-agents",         hint: "patch ua-deny" },
    { id: "validate",    label: "Validate config (nginx -t)",              hint: "nginx -t" },
    { id: "reload",      label: "Reload nginx",                            hint: "systemctl reload nginx" },
    { id: "replay",      label: "Replay traffic — attackers blocked, users pass", hint: "replay traffic" },
  ],
  success:
    gold("╭──────────────────────────────────────────────╮") + "\r\n" +
    gold("│  🏆  MISSION COMPLETE — ATTACKERS LOCKED OUT │") + "\r\n" +
    gold("╰──────────────────────────────────────────────╯") + "\r\n" +
    dim("Defender XP: ") + green("+200") + dim("   3 attacker classes blocked, 0 users impacted, /api/auth/login back to 5 req/min/IP.") + "\r\n",
  commands: {
    help: () => ({ stdout:
      bold("Commands") + "\r\n  " + cyan("help  ls  cat <f>  pwd  cd  clear  hint  goals") + "\r\n" +
      "  " + cyan("patch ratelimit-zone | ratelimit-login | ua-deny") + "\r\n" +
      "  " + cyan("nginx -t") + "  ·  " + cyan("systemctl reload nginx") + "\r\n" +
      "  " + cyan("replay traffic") + "\r\n",
    }),
    pwd: ({ state }) => ({ stdout: state.cwd }),
    cd: ({ state, args }) => ({ statePatch: { cwd: resolvePath(state.cwd, args[0] ?? "/etc/nginx") }, stdout: "" }),
    ls: ({ state }) => ({ stdout: Object.keys(state.fs).filter((p) => p.startsWith(state.cwd)).map((p) => p.replace(state.cwd + "/", "")).join("  ") }),
    cat: ({ state, args }): CommandResult => {
      if (!args[0]) return { stderr: "cat: missing file" }
      const path = resolveFile(state, args[0])
      if (!path) return { stderr: `cat: ${args[0]}: no such file` }
      const goalMet = path.endsWith("sample.jsonl") ? "inspect" : undefined
      const env = path.endsWith("sample.jsonl") ? { ...state.env, INSPECTED: "yes" } : state.env
      return { stdout: state.fs[path].content, statePatch: { env }, goalMet }
    },
    patch: ({ state, args }): CommandResult => {
      if (args[0] === "ratelimit-zone") {
        const p = "/etc/nginx/nginx.conf"
        let c = state.fs[p]?.content ?? ""
        if (/limit_req_zone/.test(c)) return { stdout: yellow("already patched"), goalMet: "zone" }
        c = c.replace(
          /^http \{\n/m,
          "http {\n    # Per-IP rate state for /api/auth/login (10MB ≈ 160k IPs)\n    limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;\n    # Bot fingerprint map: 1 = block\n    map $http_user_agent $is_bot {\n        default                  0;\n        ~*python-requests        1;\n        ~*Go-http-client         1;\n        ~*curl/                  1;\n    }\n",
        )
        return {
          stdout: green("nginx.conf: limit_req_zone(login,5r/m) + bot UA map declared"),
          statePatch: { fs: { [p]: { content: c, mode: "rw" } }, env: { ...state.env, ZONE_OK: "yes", CONF_VALID: "stale" } },
          goalMet: "zone",
        }
      }
      if (args[0] === "ratelimit-login") {
        const p = "/etc/nginx/sites-enabled/hodlberg.conf"
        let c = state.fs[p]?.content ?? ""
        if (/limit_req\s+zone=login/.test(c)) return { stdout: yellow("already patched"), goalMet: "login" }
        if (state.env.ZONE_OK !== "yes") {
          return { stderr: red("Define the zone in nginx.conf first (patch ratelimit-zone) — limit_req without zone is a syntax error.") }
        }
        c = c.replace(
          /^    location \/ \{\n/m,
          "    location = /api/auth/login {\n        limit_req zone=login burst=10 nodelay;\n        limit_req_status 429;\n        proxy_pass http://127.0.0.1:3000;\n    }\n\n    location / {\n",
        )
        return {
          stdout: green("hodlberg.conf: limit_req(zone=login, burst=10, nodelay) on /api/auth/login, returns 429"),
          statePatch: { fs: { [p]: { content: c, mode: "rw" } }, env: { ...state.env, LOGIN_OK: "yes", CONF_VALID: "stale" } },
          goalMet: "login",
        }
      }
      if (args[0] === "ua-deny") {
        const p = "/etc/nginx/sites-enabled/hodlberg.conf"
        let c = state.fs[p]?.content ?? ""
        if (/if\s*\(\s*\$is_bot/.test(c)) return { stdout: yellow("already patched"), goalMet: "ua" }
        if (state.env.ZONE_OK !== "yes") {
          return { stderr: red("Bot map lives in nginx.conf (patch ratelimit-zone defines it). Patch the zone first.") }
        }
        c = c.replace(
          /^    location = \/api\/auth\/login \{\n/m,
          "    if ($is_bot) {\n        return 403 \"automation denied\";\n    }\n\n    location = /api/auth/login {\n",
        )
        return {
          stdout: green("hodlberg.conf: deny headless UAs (python-requests, Go-http-client, curl) at vhost level"),
          statePatch: { fs: { [p]: { content: c, mode: "rw" } }, env: { ...state.env, UA_OK: "yes", CONF_VALID: "stale" } },
          goalMet: "ua",
        }
      }
      return { stderr: "patch: unknown. Try 'patch ratelimit-zone | ratelimit-login | ua-deny'" }
    },
    nginx: ({ state, args }): CommandResult => {
      if (args[0] !== "-t") return { stderr: "nginx: this sim supports 'nginx -t'" }
      const ok = state.env.ZONE_OK === "yes" && state.env.LOGIN_OK === "yes" && state.env.UA_OK === "yes"
      if (!ok) {
        return { stderr: red("nginx: [emerg] config incomplete — patch zone, login and ua-deny first") }
      }
      return {
        stdout:
          dim("nginx: the configuration file /etc/nginx/nginx.conf syntax is ok\r\n") +
          green("nginx: configuration file /etc/nginx/nginx.conf test is successful"),
        statePatch: { env: { ...state.env, CONF_VALID: "ok" } },
        goalMet: "validate",
      }
    },
    systemctl: ({ state, args }): CommandResult => {
      if (args[0] !== "reload" || args[1] !== "nginx") {
        return { stderr: "systemctl: only 'systemctl reload nginx' supported here" }
      }
      if (state.env.CONF_VALID !== "ok") {
        return { stderr: red("nginx.service: reload aborted — run 'nginx -t' first to validate the config") }
      }
      return {
        stdout: green("nginx.service reloaded · pid 8123 · 0 connections dropped"),
        statePatch: { env: { ...state.env, RELOADED: "yes" } },
        goalMet: "reload",
      }
    },
    replay: ({ state, args }): CommandResult => {
      if (args[0] !== "traffic") return { stderr: "replay: usage: replay traffic" }
      if (state.env.RELOADED !== "yes") {
        return { stderr: red("replay: nginx config not yet reloaded — fix that first") }
      }
      return {
        stdout:
          bold("Traffic replay (60s synthetic, ratio matches sample.jsonl)") + "\r\n" +
          green("  ✓ ") + "193.27.14.92  python-requests       /api/auth/login  →  403  (UA deny)\r\n" +
          green("  ✓ ") + "45.142.122.14 curl/7.81             /api/auth/login  →  403  (UA deny)\r\n" +
          green("  ✓ ") + "185.220.101.7 Go-http-client        /api/v1/users    →  403  (UA deny)\r\n" +
          green("  ✓ ") + "79.143.180.5  Chrome 126            /api/auth/login  →  200  (5r/m budget intact)\r\n" +
          green("  ✓ ") + "82.165.21.99  Safari 17             /api/v1/dashboard→  200  (no rate-limit)\r\n" +
          dim("Result: ") + green("3 attacker classes denied · 2 user classes pass · 0 false positives"),
        goalMet: "replay",
      }
    },
    hint: ({ state }) => {
      const r = reverseProxyRatelimitMission.goals.find((g) => !state.goalsMet.includes(g.id))
      return { stdout: r ? dim("→ ") + yellow(r.label) + dim("  (" + (r.hint ?? "") + ")") : green("All goals met.") }
    },
    goals: ({ state }) => ({ stdout: bold("Goals") + "\r\n" + reverseProxyRatelimitMission.goals.map((g) => (state.goalsMet.includes(g.id) ? green("  ✓ ") + dim(g.label) : dim("  · ") + g.label)).join("\r\n") }),
    clear: () => ({ stdout: "\x1b[2J\x1b[H" }),
    exit: () => ({ stdout: dim("— session closed —") }),
  },
  initialState,
}
