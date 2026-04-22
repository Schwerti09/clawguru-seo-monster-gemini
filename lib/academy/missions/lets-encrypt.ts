// Mission M-004 — "TLS in three commands"
// Issue a Let's Encrypt cert and wire it into nginx.

import type { Mission, MissionState } from "../missionEngine"
import { bold, cyan, dim, gold, green, resolvePath, yellow } from "../missionEngine"

const NGINX_HTTP = `# /etc/nginx/sites-enabled/hodlberg.conf — HTTP-only (insecure)
server {
    listen 80;
    server_name hodlberg.ag www.hodlberg.ag;

    location / {
        proxy_pass http://127.0.0.1:3000;
    }
}
`

const README = `Mission M-004 — TLS in three commands
======================================

BRIEF
  hodlberg.ag serves plaintext HTTP. You have 10 minutes before the press
  demo. Get a Let's Encrypt cert, flip nginx to HTTPS, verify.

OBJECTIVES
  1. Install certbot
  2. Issue a certificate for hodlberg.ag
  3. Patch nginx to listen 443 with the new cert
  4. Validate nginx config
  5. Reload nginx
  6. Verify HTTPS works

HINTS
  apt install certbot python3-certbot-nginx
  certbot certonly --nginx -d hodlberg.ag -d www.hodlberg.ag
  patch enable-tls
  nginx -t
  systemctl reload nginx
  curl -I https://hodlberg.ag
`

const initialState: MissionState = {
  cwd: "/root",
  fs: {
    "/root/README": { content: README, mode: "ro" },
    "/etc/nginx/sites-enabled/hodlberg.conf": { content: NGINX_HTTP, mode: "rw" },
  },
  env: { CERTBOT_INSTALLED: "no", CERT_ISSUED: "no", NGINX_VALID: "unknown", NGINX_RELOADED: "no" },
  goalsMet: [],
  history: [],
}

export const letsEncryptMission: Mission = {
  slug: "lets-encrypt",
  title: "TLS in three commands",
  brief: "hodlberg.ag still serves plaintext HTTP. Press demo in 10 minutes. Issue a cert, flip to HTTPS, verify.",
  prompt: "defender@hodlberg-web-01:~# ",

  welcome:
    bold(cyan("╭─────────────────────────────────────────────╮")) + "\r\n" +
    bold(cyan("│ ")) + bold("MISSION M-004 — LET'S ENCRYPT") + bold(cyan("              │")) + "\r\n" +
    bold(cyan("╰─────────────────────────────────────────────╯")) + "\r\n\r\n" +
    "hodlberg-web-01 · nginx 1.24 · Ubuntu 22.04\r\n" +
    dim("Read the brief: ") + cyan("cat README") + dim("  ·  ") + cyan("help") + "\r\n",

  goals: [
    { id: "install-certbot", label: "Install certbot",                        hint: "apt install certbot python3-certbot-nginx" },
    { id: "issue-cert",      label: "Issue certificate for hodlberg.ag",      hint: "certbot certonly --nginx -d hodlberg.ag -d www.hodlberg.ag" },
    { id: "patch-tls",       label: "Patch nginx to serve 443",               hint: "patch enable-tls" },
    { id: "validate",        label: "Validate nginx config",                  hint: "nginx -t" },
    { id: "reload",          label: "Reload nginx",                           hint: "systemctl reload nginx" },
    { id: "verify",          label: "Verify HTTPS responds",                  hint: "curl -I https://hodlberg.ag" },
  ],

  success:
    gold("╭─────────────────────────────────────────────╮") + "\r\n" +
    gold("│  🏆  MISSION COMPLETE — HTTPS LIVE         │") + "\r\n" +
    gold("╰─────────────────────────────────────────────╯") + "\r\n" +
    dim("Defender XP: ") + green("+150") + dim("   The demo will see a green lock. Good.") + "\r\n",

  commands: {
    help: () => ({
      stdout:
        bold("Commands") + "\r\n  " +
        cyan("help  ls  cat <f>  cd  pwd  clear  hint  goals") + "\r\n" +
        "  " + cyan("apt install certbot python3-certbot-nginx") + "\r\n" +
        "  " + cyan("certbot certonly --nginx -d hodlberg.ag -d www.hodlberg.ag") + "\r\n" +
        "  " + cyan("patch enable-tls") + "          rewrite vhost for 443 + cert\r\n" +
        "  " + cyan("nginx -t") + "                  validate\r\n" +
        "  " + cyan("systemctl reload nginx") + "    reload\r\n" +
        "  " + cyan("curl -I https://hodlberg.ag") + "  verify\r\n",
    }),

    pwd: ({ state }) => ({ stdout: state.cwd }),
    cd: ({ state, args }) => ({ statePatch: { cwd: resolvePath(state.cwd, args[0] ?? "/root") }, stdout: "" }),
    ls: ({ state }) => ({ stdout: Object.keys(state.fs).join("  ") }),

    cat: ({ state, args }) => {
      if (!args[0]) return { stderr: "cat: missing file" }
      const path = resolvePath(state.cwd, args[0])
      const entry = state.fs[path] ?? (args[0] === "README" ? state.fs["/root/README"] : undefined)
      if (!entry) return { stderr: `cat: ${args[0]}: no such file` }
      return { stdout: entry.content }
    },

    apt: ({ state, args }) => {
      if (args[0] !== "install") return { stderr: "apt: only 'apt install ...' is supported" }
      const pkgs = args.slice(1).join(" ")
      if (!pkgs.includes("certbot")) return { stderr: "apt: you want to install certbot here" }
      return {
        stdout: green("Reading package lists... Done") + "\r\n" +
                green("Setting up certbot (2.9.0) ...") + "\r\n" +
                green("Setting up python3-certbot-nginx (2.9.0) ..."),
        statePatch: { env: { ...state.env, CERTBOT_INSTALLED: "yes" } },
        goalMet: "install-certbot",
      }
    },

    certbot: ({ state, args }) => {
      if (args[0] !== "certonly") return { stderr: "certbot: only 'certbot certonly ...' is supported in this mission" }
      if (state.env.CERTBOT_INSTALLED !== "yes") return { stderr: "certbot: command not found — install it first" }
      const all = args.join(" ")
      if (!all.includes("hodlberg.ag")) return { stderr: "certbot: you need -d hodlberg.ag (and ideally -d www.hodlberg.ag)" }
      return {
        stdout:
          green("Successfully received certificate.") + "\r\n" +
          "Certificate is saved at: /etc/letsencrypt/live/hodlberg.ag/fullchain.pem\r\n" +
          "Key is saved at:         /etc/letsencrypt/live/hodlberg.ag/privkey.pem\r\n" +
          "This certificate expires on " + dim("(+90 days)"),
        statePatch: { env: { ...state.env, CERT_ISSUED: "yes" } },
        goalMet: "issue-cert",
      }
    },

    patch: ({ state, args }) => {
      if (args[0] !== "enable-tls") return { stderr: "patch: unknown. try 'patch enable-tls'" }
      if (state.env.CERT_ISSUED !== "yes") return { stderr: "patch: issue the cert first" }
      const confPath = "/etc/nginx/sites-enabled/hodlberg.conf"
      const next = `# /etc/nginx/sites-enabled/hodlberg.conf — TLS enabled
server {
    listen 80;
    server_name hodlberg.ag www.hodlberg.ag;
    return 301 https://$host$request_uri;
}
server {
    listen 443 ssl http2;
    server_name hodlberg.ag www.hodlberg.ag;

    ssl_certificate     /etc/letsencrypt/live/hodlberg.ag/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/hodlberg.ag/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
    }
}
`
      return {
        stdout: green("Rewrote ") + confPath + green(" to listen on 443 and redirect HTTP → HTTPS"),
        statePatch: { fs: { [confPath]: { content: next, mode: "rw" } }, env: { ...state.env, NGINX_VALID: "stale" } },
        goalMet: "patch-tls",
      }
    },

    nginx: ({ state, args }) => {
      if (args[0] !== "-t") return { stderr: "nginx: only 'nginx -t' is available" }
      const conf = state.fs["/etc/nginx/sites-enabled/hodlberg.conf"]?.content ?? ""
      if (!conf.includes("listen 443")) return { stderr: "nginx: config still HTTP-only" }
      return {
        stdout: green("nginx: configuration test is successful"),
        statePatch: { env: { ...state.env, NGINX_VALID: "ok" } },
        goalMet: "validate",
      }
    },

    systemctl: ({ state, args }) => {
      if (args[0] !== "reload" || args[1] !== "nginx") return { stderr: "only 'systemctl reload nginx' supported" }
      if (state.env.NGINX_VALID !== "ok") return { stderr: "systemctl: nginx config not validated — run nginx -t first" }
      return {
        stdout: green("● nginx.service reloaded."),
        statePatch: { env: { ...state.env, NGINX_RELOADED: "yes" } },
        goalMet: "reload",
      }
    },

    curl: ({ state, args }) => {
      if (args[0] !== "-I") return { stderr: "curl: only 'curl -I <url>' is supported" }
      const url = args[1] ?? ""
      if (!url.startsWith("https://")) return { stderr: "curl: use https:// URL to verify TLS" }
      if (state.env.NGINX_RELOADED !== "yes") return { stderr: "curl: connection refused — nginx not reloaded yet" }
      return {
        stdout:
          green("HTTP/2 200 ") + "\r\n" +
          "server: nginx/1.24\r\n" +
          "strict-transport-security: max-age=0\r\n" +
          dim("(HSTS is a separate mission — see M-001)"),
        goalMet: "verify",
      }
    },

    hint: ({ state }) => {
      const r = letsEncryptMission.goals.find((g) => !state.goalsMet.includes(g.id))
      return { stdout: r ? dim("→ ") + yellow(r.label) + dim("  (" + (r.hint ?? "") + ")") : green("All goals met.") }
    },

    goals: ({ state }) => ({
      stdout: bold("Goals") + "\r\n" + letsEncryptMission.goals.map((g) => {
        const done = state.goalsMet.includes(g.id)
        return (done ? green("  ✓ ") : dim("  · ")) + (done ? dim(g.label) : g.label)
      }).join("\r\n"),
    }),

    clear: () => ({ stdout: "\x1b[2J\x1b[H" }),
    exit: () => ({ stdout: dim("— session closed —") }),
  },

  initialState,
}
