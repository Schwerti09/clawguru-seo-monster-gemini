// Mission M-006 — "Ship a non-root Dockerfile before it hits staging"
import type { Mission, MissionState } from "../missionEngine"
import { bold, cyan, dim, gold, green, resolvePath, yellow } from "../missionEngine"

const DOCKERFILE_INITIAL = `# /app/Dockerfile — default Node image, runs as root
FROM node:20

WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .

EXPOSE 3000
CMD ["node", "server.js"]
`

const README = `Mission M-006 — Docker: non-root, read-only, signed
====================================================

BRIEF
  Your Dockerfile runs as UID 0 and writes anywhere in the container. A
  minor RCE in dependencies becomes full container takeover. Ship a
  hardened Dockerfile before staging tomorrow.

OBJECTIVES
  1. Inspect the Dockerfile
  2. Add a non-root user and USER directive
  3. Set read-only workdir permissions
  4. Add HEALTHCHECK
  5. Validate with docker build
  6. Scan with Trivy

HINTS
  cat Dockerfile
  patch nonroot
  patch readonly
  patch healthcheck
  docker build .
  trivy image clawguru-api:local
`

const initialState: MissionState = {
  cwd: "/app",
  fs: {
    "/app/README":    { content: README, mode: "ro" },
    "/app/Dockerfile":{ content: DOCKERFILE_INITIAL, mode: "rw" },
  },
  env: { NONROOT: "no", READONLY: "no", HEALTHCHECK: "no", BUILD_OK: "unknown" },
  goalsMet: [],
  history: [],
}

export const dockerNonrootMission: Mission = {
  slug: "docker-nonroot",
  title: "Ship a non-root Dockerfile before it hits staging",
  brief: "Your Dockerfile runs as root + writes anywhere. Harden it: non-root user, read-only rootfs, HEALTHCHECK, scan with Trivy.",
  prompt: "defender@hodlberg-build:/app$ ",
  welcome:
    bold(cyan("╭─────────────────────────────────────────────╮")) + "\r\n" +
    bold(cyan("│ ")) + bold("MISSION M-006 — DOCKER NON-ROOT") + bold(cyan("             │")) + "\r\n" +
    bold(cyan("╰─────────────────────────────────────────────╯")) + "\r\n\r\n" +
    "hodlberg-api · Node 20 · Docker 25.x\r\n" +
    dim("Read the brief: ") + cyan("cat README") + dim("  ·  ") + cyan("help") + "\r\n",
  goals: [
    { id: "inspect", label: "Inspect the Dockerfile",              hint: "cat Dockerfile" },
    { id: "nonroot", label: "Add non-root USER directive",         hint: "patch nonroot" },
    { id: "readonly",label: "Set read-only workdir permissions",   hint: "patch readonly" },
    { id: "health",  label: "Add HEALTHCHECK",                     hint: "patch healthcheck" },
    { id: "build",   label: "Validate with docker build",          hint: "docker build ." },
    { id: "scan",    label: "Trivy scan clean",                    hint: "trivy image clawguru-api:local" },
  ],
  success:
    gold("╭─────────────────────────────────────────────╮") + "\r\n" +
    gold("│  🏆  MISSION COMPLETE — DOCKER HARDENED    │") + "\r\n" +
    gold("╰─────────────────────────────────────────────╯") + "\r\n" +
    dim("Defender XP: ") + green("+150") + dim("   Container UID 1001, read-only root, HEALTHCHECK set, Trivy green.") + "\r\n",
  commands: {
    help: () => ({ stdout:
      bold("Commands") + "\r\n  " + cyan("help  ls  cat <f>  pwd  cd  clear  hint  goals") + "\r\n" +
      "  " + cyan("patch nonroot | readonly | healthcheck") + "\r\n" +
      "  " + cyan("docker build .") + "  ·  " + cyan("trivy image clawguru-api:local") + "\r\n" }),
    pwd: ({ state }) => ({ stdout: state.cwd }),
    cd: ({ state, args }) => ({ statePatch: { cwd: resolvePath(state.cwd, args[0] ?? "/app") }, stdout: "" }),
    ls: ({ state }) => ({ stdout: Object.keys(state.fs).join("  ") }),
    cat: ({ state, args }) => {
      if (!args[0]) return { stderr: "cat: missing file" }
      const path = resolvePath(state.cwd, args[0])
      const entry = state.fs[path] ?? (args[0] === "README" ? state.fs["/app/README"] : undefined) ?? (args[0] === "Dockerfile" ? state.fs["/app/Dockerfile"] : undefined)
      if (!entry) return { stderr: `cat: ${args[0]}: no such file` }
      return { stdout: entry.content, goalMet: path === "/app/Dockerfile" ? "inspect" : undefined }
    },
    patch: ({ state, args }) => {
      const p = "/app/Dockerfile"
      let c = state.fs[p]?.content ?? ""
      if (args[0] === "nonroot") {
        if (/^USER\s+\w/m.test(c)) return { stdout: yellow("already patched"), goalMet: "nonroot" }
        c = c.replace("WORKDIR /app\n", "WORKDIR /app\nRUN addgroup -g 1001 app && adduser -u 1001 -G app -D app && chown -R app:app /app\n")
        c = c.replace('CMD ["node"', 'USER app\nCMD ["node"')
        return { stdout: green("Added UID 1001 app user + USER directive"), statePatch: { fs: { [p]: { content: c, mode: "rw" } }, env: { ...state.env, NONROOT: "yes" } }, goalMet: "nonroot" }
      }
      if (args[0] === "readonly") {
        if (/--read-only|--tmpfs/.test(c)) return { stdout: yellow("already patched"), goalMet: "readonly" }
        c = c.replace("EXPOSE 3000\n", "# Runtime: docker run --read-only --tmpfs /tmp\nEXPOSE 3000\n")
        return { stdout: green("Documented --read-only runtime flag"), statePatch: { fs: { [p]: { content: c, mode: "rw" } }, env: { ...state.env, READONLY: "yes" } }, goalMet: "readonly" }
      }
      if (args[0] === "healthcheck") {
        if (/^HEALTHCHECK/m.test(c)) return { stdout: yellow("already patched"), goalMet: "health" }
        c = c.replace("EXPOSE 3000\n", "EXPOSE 3000\nHEALTHCHECK --interval=30s --timeout=5s CMD wget -qO- http://127.0.0.1:3000/healthz || exit 1\n")
        return { stdout: green("Added HEALTHCHECK"), statePatch: { fs: { [p]: { content: c, mode: "rw" } }, env: { ...state.env, HEALTHCHECK: "yes" } }, goalMet: "health" }
      }
      return { stderr: "patch: unknown. Try 'patch nonroot' / 'patch readonly' / 'patch healthcheck'" }
    },
    docker: ({ state, args }) => {
      if (args[0] !== "build") return { stderr: "docker: only 'docker build .' supported" }
      const c = state.fs["/app/Dockerfile"]?.content ?? ""
      if (!/^USER\s+app/m.test(c)) return { stderr: "docker: build failed — still runs as root" }
      return {
        stdout: green("Successfully built clawguru-api:local"),
        statePatch: { env: { ...state.env, BUILD_OK: "ok" } },
        goalMet: "build",
      }
    },
    trivy: ({ state, args }) => {
      if (args[0] !== "image") return { stderr: "trivy: only 'trivy image <name>' supported" }
      if (state.env.BUILD_OK !== "ok") return { stderr: "trivy: image not built yet" }
      return {
        stdout: green("0 CRITICAL · 0 HIGH · 3 MEDIUM (node-base image, patchable next release)"),
        goalMet: "scan",
      }
    },
    hint: ({ state }) => {
      const r = dockerNonrootMission.goals.find((g) => !state.goalsMet.includes(g.id))
      return { stdout: r ? dim("→ ") + yellow(r.label) + dim("  (" + (r.hint ?? "") + ")") : green("All goals met.") }
    },
    goals: ({ state }) => ({ stdout: bold("Goals") + "\r\n" + dockerNonrootMission.goals.map((g) => (state.goalsMet.includes(g.id) ? green("  ✓ ") + dim(g.label) : dim("  · ") + g.label)).join("\r\n") }),
    clear: () => ({ stdout: "\x1b[2J\x1b[H" }),
    exit: () => ({ stdout: dim("— session closed —") }),
  },
  initialState,
}
