// Mission M-011 — "Your prod cluster's default is allow-everything. Lock it down without breaking the mesh."
//
// Track: Intermediate (Stack Hardening)
// Scenario: hodlberg-prod cluster runs 3 namespaces — `prod`, `dev`, `data`.
// Default Kubernetes networking = every pod can talk to every other pod
// across every namespace. A red-team probe found that a compromised dev
// pod can hit `prod/api-server`'s `/admin` endpoint over the cluster
// network. CIS benchmark gate fails. Lock it down — without breaking the
// production traffic mesh.
//
// Pedagogy:
//   - The lesson is the SEQUENCE: default-deny FIRST, then re-allow exactly
//     the legitimate flows. Inverse order = applies allow rules to a still-
//     open cluster (no-op) and never closes the gap.
//   - Failure trap: applying default-deny without allow rules disconnects
//     legitimate traffic (api-server <- ingress, api-server <- worker).
//     Verify catches both the attacker drop AND the false positives.
//   - K8s-specific: `podSelector: {}` matches all pods in namespace,
//     `namespaceSelector` crosses ns boundaries, ingress-only NetworkPolicy
//     does not block egress (separate concern, mentioned but not gated).

import type { CommandResult, Mission, MissionState } from "../missionEngine"
import { bold, cyan, dim, gold, green, red, resolvePath, yellow } from "../missionEngine"

const TOPOLOGY = `Cluster: hodlberg-prod  ·  k8s 1.30  ·  CNI: Calico

  Namespace   Pod                       Labels                 Listens on
  --------------------------------------------------------------------------
  prod        api-server                app=api,tier=backend   :8080 /api,/admin
  prod        worker                    app=worker,tier=back   ---
  prod        ingress-nginx (DaemonSet) app=ingress            :80, :443
  dev         red-team-probe            app=probe              ---
  dev         dev-api                   app=api,tier=backend   :8080 /api
  data        postgres-primary          app=postgres           :5432
  --------------------------------------------------------------------------

Default behaviour: every pod can talk to every pod across every namespace.
That is K8s out-of-the-box. CIS Benchmark 5.3.2 wants explicit deny + allow.

Known traffic that MUST keep working in prod:
  - prod/ingress-nginx -> prod/api-server :8080
  - prod/worker        -> prod/api-server :8080  (internal calls)
  - prod/api-server    -> data/postgres-primary :5432  (egress; out of scope here)

Known traffic that MUST be blocked:
  - dev/red-team-probe -> prod/api-server :8080  (cross-namespace, no business)
  - dev/dev-api        -> prod/api-server :8080  (env isolation)
`

const POLICY_TEMPLATE = `# Apply with: apply network-policy <name>
# Three policies are stocked in /etc/k8s/policies/:
#
# default-deny.yaml         — namespace-wide ingress deny (CIS 5.3.2)
# allow-ingress-nginx.yaml  — re-allow ingress-nginx -> api-server
# allow-same-namespace.yaml — re-allow prod/worker -> prod/api-server
#
# Order matters. default-deny first, then allow rules. Inverse order leaves
# the cluster wide open until the deny lands.
`

const POLICY_DEFAULT_DENY = `apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-ingress
  namespace: prod
spec:
  podSelector: {}              # match every pod in prod namespace
  policyTypes:
    - Ingress
  # No ingress block at all => deny ALL inbound to every prod pod.
`

const POLICY_ALLOW_INGRESS = `apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-ingress-nginx-to-api
  namespace: prod
spec:
  podSelector:
    matchLabels:
      app: api
      tier: backend
  policyTypes:
    - Ingress
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app: ingress
      ports:
        - protocol: TCP
          port: 8080
`

const POLICY_ALLOW_SAMENS = `apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-prod-internal
  namespace: prod
spec:
  podSelector:
    matchLabels:
      app: api
      tier: backend
  policyTypes:
    - Ingress
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app: worker
      ports:
        - protocol: TCP
          port: 8080
`

const README = `Mission M-011 — K8s NetworkPolicy default-deny
================================================

BRIEF
  hodlberg-prod cluster: every pod can reach every pod across every
  namespace. Red-team probe in 'dev' just hit /admin on prod/api-server
  over the cluster network. CIS benchmark 5.3.2 audit lands tomorrow.

  Lock down ingress to prod. Without breaking ingress-nginx, without
  breaking prod-internal worker -> api-server.

OBJECTIVES
  1. Inspect the topology + identify the unauthorized flow
  2. Probe the current state — confirm dev probe can reach prod/api-server
  3. Apply default-deny ingress NetworkPolicy to prod namespace
  4. Probe again — attacker blocked, but legitimate traffic also dead
  5. Apply allow-ingress-nginx-to-api
  6. Apply allow-prod-internal (worker -> api-server)
  7. Probe — only authorized flows succeed
  8. audit signoff — CIS 5.3.2 satisfied, no false positives

HINTS
  cat topology
  ls /etc/k8s/policies/
  probe <from-pod> <to-pod>:<port>
  apply network-policy default-deny
  apply network-policy allow-ingress-nginx
  apply network-policy allow-same-namespace
  audit signoff

  ⚠ Trap: applying allow rules BEFORE default-deny does nothing
    (cluster still wide open). Default-deny first.
`

const initialState: MissionState = {
  cwd: "/etc/k8s",
  fs: {
    "/etc/k8s/README":                                { content: README,             mode: "ro" },
    "/etc/k8s/topology":                              { content: TOPOLOGY,           mode: "ro" },
    "/etc/k8s/policies/_INDEX":                       { content: POLICY_TEMPLATE,    mode: "ro" },
    "/etc/k8s/policies/default-deny.yaml":            { content: POLICY_DEFAULT_DENY,mode: "ro" },
    "/etc/k8s/policies/allow-ingress-nginx.yaml":     { content: POLICY_ALLOW_INGRESS,mode: "ro" },
    "/etc/k8s/policies/allow-same-namespace.yaml":    { content: POLICY_ALLOW_SAMENS,mode: "ro" },
  },
  env: {
    INSPECTED:        "no",
    PROBED_BEFORE:    "no",
    POLICY_DENY:      "no",
    POLICY_INGRESS:   "no",
    POLICY_SAMENS:    "no",
    PROBED_AFTER:     "no",
  },
  goalsMet: [],
  history: [],
}

const SHORTCUTS: Record<string, string> = {
  "README":   "/etc/k8s/README",
  "topology": "/etc/k8s/topology",
  "default-deny.yaml":            "/etc/k8s/policies/default-deny.yaml",
  "allow-ingress-nginx.yaml":     "/etc/k8s/policies/allow-ingress-nginx.yaml",
  "allow-same-namespace.yaml":    "/etc/k8s/policies/allow-same-namespace.yaml",
}

// Resolve "<source-pod> -> <target-pod>:<port>" against the policy state.
// Returns either { allowed: true, reason } or { allowed: false, reason }.
function evaluateProbe(
  state: MissionState,
  fromPod: string,
  toPod: string,
  port: number,
): { allowed: boolean; reason: string } {
  const denyApplied = state.env.POLICY_DENY === "yes"
  const allowIngress = state.env.POLICY_INGRESS === "yes"
  const allowSameNs = state.env.POLICY_SAMENS === "yes"

  // The mission cares about ingress to prod/api-server :8080.
  const targetIsProdApi = toPod === "prod/api-server" && port === 8080
  if (!targetIsProdApi) {
    // We don't model traffic to other targets — return a friendly stub.
    return { allowed: true, reason: "(out of scope — mission only models prod/api-server :8080)" }
  }

  if (!denyApplied) {
    // K8s default: every pod can hit every pod.
    return { allowed: true, reason: "default K8s policy = allow everything (CIS 5.3.2 violation)" }
  }

  // default-deny is in effect. Now check allow rules.
  if (fromPod === "prod/ingress-nginx") {
    return allowIngress
      ? { allowed: true, reason: "allow-ingress-nginx-to-api matched (label app=ingress)" }
      : { allowed: false, reason: "blocked by default-deny — no allow rule for ingress-nginx yet" }
  }
  if (fromPod === "prod/worker") {
    return allowSameNs
      ? { allowed: true, reason: "allow-prod-internal matched (label app=worker)" }
      : { allowed: false, reason: "blocked by default-deny — no allow rule for worker yet" }
  }
  // Anyone else (red-team-probe, dev-api, anything cross-namespace) is denied.
  return { allowed: false, reason: "blocked by default-deny (no matching allow rule)" }
}

function resolveFile(state: MissionState, raw: string): string | undefined {
  if (!raw) return undefined
  const direct = resolvePath(state.cwd, raw)
  if (state.fs[direct]) return direct
  return SHORTCUTS[raw]
}

export const k8sNetworkpolicyMission: Mission = {
  slug: "k8s-networkpolicy",
  title: "Default-deny the prod namespace without breaking ingress + worker traffic",
  brief: "Cluster-wide allow-everything is K8s default. Red-team probe in dev just reached /admin on prod/api-server. Apply default-deny + targeted allows. Wrong order = service breaks.",
  prompt: "platform@hodlberg-bastion:/etc/k8s$ ",
  welcome:
    bold(red("╭──────────────────────────────────────────────╮")) + "\r\n" +
    bold(red("│ ")) + bold("MISSION M-011 — K8S NETWORKPOLICY DEFAULT-DENY") + bold(red("│")) + "\r\n" +
    bold(red("╰──────────────────────────────────────────────╯")) + "\r\n\r\n" +
    yellow("Red-team finding: ") + "dev/red-team-probe -> prod/api-server:/admin worked. CIS 5.3.2 fails.\r\n" +
    dim("Read the brief: ") + cyan("cat README") + dim("  ·  Topology: ") + cyan("cat topology") + "\r\n",
  goals: [
    { id: "inspect",         label: "Inspect topology + policy templates",                 hint: "cat topology && ls policies/" },
    { id: "probe-before",    label: "Probe — confirm dev probe can hit prod/api-server",   hint: "probe dev/red-team-probe prod/api-server:8080" },
    { id: "apply-deny",      label: "Apply default-deny ingress to prod namespace",        hint: "apply network-policy default-deny" },
    { id: "apply-ingress",   label: "Allow ingress-nginx -> prod/api-server",              hint: "apply network-policy allow-ingress-nginx" },
    { id: "apply-samens",    label: "Allow prod/worker -> prod/api-server (same-ns)",      hint: "apply network-policy allow-same-namespace" },
    { id: "probe-after",     label: "Probe again — only authorized flows succeed",         hint: "probe dev/red-team-probe prod/api-server:8080 && probe prod/ingress-nginx prod/api-server:8080 && probe prod/worker prod/api-server:8080" },
    { id: "audit",           label: "audit signoff — CIS 5.3.2 satisfied",                 hint: "audit signoff" },
  ],
  success:
    gold("╭──────────────────────────────────────────────╮") + "\r\n" +
    gold("│  🏆  MISSION COMPLETE — CLUSTER LOCKED, MESH UP │") + "\r\n" +
    gold("╰──────────────────────────────────────────────╯") + "\r\n" +
    dim("Defender XP: ") + green("+260") + dim("   default-deny + 2 targeted allows. CIS 5.3.2 green. Red-team probe blocked. Worker + ingress unaffected.") + "\r\n",
  commands: {
    help: () => ({ stdout:
      bold("Commands") + "\r\n  " + cyan("help  ls  cat <f>  pwd  cd  clear  hint  goals") + "\r\n" +
      "  " + cyan("probe <from-pod> <to-pod>:<port>") + "\r\n" +
      "  " + cyan("apply network-policy <name>") + "          (default-deny | allow-ingress-nginx | allow-same-namespace)\r\n" +
      "  " + cyan("kubectl get networkpolicies -n prod") + "\r\n" +
      "  " + cyan("audit signoff") + "\r\n",
    }),
    pwd: ({ state }) => ({ stdout: state.cwd }),
    cd: ({ state, args }) => ({ statePatch: { cwd: resolvePath(state.cwd, args[0] ?? "/etc/k8s") }, stdout: "" }),
    ls: ({ state, args }): CommandResult => {
      const dir = args[0] ? resolvePath(state.cwd, args[0]) : state.cwd
      const items = Object.keys(state.fs).filter((p) => p.startsWith(dir.endsWith("/") ? dir : dir + "/")).map((p) => p.replace(dir.endsWith("/") ? dir : dir + "/", "")).filter((p) => !p.includes("/"))
      const sameDir = Object.keys(state.fs).filter((p) => p.startsWith(state.cwd + "/")).map((p) => p.replace(state.cwd + "/", "")).filter((p) => !p.includes("/"))
      const list = (args[0] ? items : sameDir).filter(Boolean)
      return { stdout: list.join("  ") }
    },
    cat: ({ state, args }): CommandResult => {
      if (!args[0]) return { stderr: "cat: missing file" }
      const path = resolveFile(state, args[0])
      if (!path) return { stderr: `cat: ${args[0]}: no such file` }
      const env = { ...state.env }
      if (path.endsWith("/topology")) env.INSPECTED = "yes"
      return {
        stdout: state.fs[path].content,
        statePatch: { env },
        goalMet: env.INSPECTED === "yes" ? "inspect" : undefined,
      }
    },
    probe: ({ state, args }): CommandResult => {
      if (args.length < 2) return { stderr: "probe: usage: probe <from-pod> <to-pod>:<port>" }
      const fromPod = args[0]
      const target = args[1]
      const m = target.match(/^([\w\-\/]+):(\d+)$/)
      if (!m) return { stderr: "probe: <to-pod>:<port> format required (e.g. prod/api-server:8080)" }
      const toPod = m[1]
      const port = Number(m[2])
      const result = evaluateProbe(state, fromPod, toPod, port)
      const env = { ...state.env }
      // Mark before/after-probe goals based on whether default-deny is applied yet.
      let goalMet: string | undefined
      if (!result.allowed && state.env.POLICY_DENY === "no") {
        // shouldn't happen — but defensive
      }
      if (state.env.POLICY_DENY === "no") {
        env.PROBED_BEFORE = "yes"
        if (state.env.PROBED_BEFORE === "no") goalMet = "probe-before"
      } else {
        // After default-deny applied — probe-after goal lights up once you've
        // probed both an attacker (blocked) and a legitimate flow (allowed).
        env.PROBED_AFTER = "yes"
        const seenAttackerBlocked = !result.allowed
        const seenLegitAllowed   = result.allowed && (fromPod === "prod/ingress-nginx" || fromPod === "prod/worker")
        // Mark goal only if we've now seen both classes.
        const historyHasBlocked = state.history.some((h) => h.startsWith("probe ") && (h.includes("dev/red-team-probe") || h.includes("dev/dev-api")))
        const historyHasAllowed = state.history.some((h) => h.startsWith("probe ") && (h.includes("prod/ingress-nginx") || h.includes("prod/worker")))
        if ((seenAttackerBlocked || historyHasBlocked) && (seenLegitAllowed || historyHasAllowed) && state.env.POLICY_INGRESS === "yes" && state.env.POLICY_SAMENS === "yes") {
          goalMet = "probe-after"
        }
      }
      return {
        stdout:
          (result.allowed ? green("✓ ALLOWED  ") : red("✗ BLOCKED  ")) + bold(`${fromPod} -> ${toPod}:${port}`) + "\r\n" +
          dim(`  ${result.reason}`),
        statePatch: { env },
        goalMet,
      }
    },
    apply: ({ state, args }): CommandResult => {
      if (args[0] !== "network-policy" || !args[1]) {
        return { stderr: "apply: usage: apply network-policy <default-deny|allow-ingress-nginx|allow-same-namespace>" }
      }
      const policy = args[1]
      const env = { ...state.env }
      if (policy === "default-deny") {
        if (env.POLICY_DENY === "yes") return { stdout: yellow("default-deny already applied"), goalMet: "apply-deny" }
        env.POLICY_DENY = "yes"
        return {
          stdout:
            green("networkpolicy.networking.k8s.io/default-deny-ingress created") + "\r\n" +
            dim("All ingress to pods in 'prod' is now denied unless an explicit allow rule matches."),
          statePatch: { env },
          goalMet: "apply-deny",
        }
      }
      if (policy === "allow-ingress-nginx") {
        if (env.POLICY_DENY !== "yes") {
          return { stderr: red("apply: this allow rule is harmless without default-deny first — the cluster is still wide open. Apply default-deny before re-opening targeted flows.") }
        }
        if (env.POLICY_INGRESS === "yes") return { stdout: yellow("allow-ingress-nginx already applied"), goalMet: "apply-ingress" }
        env.POLICY_INGRESS = "yes"
        return {
          stdout: green("networkpolicy.networking.k8s.io/allow-ingress-nginx-to-api created"),
          statePatch: { env },
          goalMet: "apply-ingress",
        }
      }
      if (policy === "allow-same-namespace") {
        if (env.POLICY_DENY !== "yes") {
          return { stderr: red("apply: same-namespace allow rule is harmless without default-deny. Apply default-deny first.") }
        }
        if (env.POLICY_SAMENS === "yes") return { stdout: yellow("allow-same-namespace already applied"), goalMet: "apply-samens" }
        env.POLICY_SAMENS = "yes"
        return {
          stdout: green("networkpolicy.networking.k8s.io/allow-prod-internal created"),
          statePatch: { env },
          goalMet: "apply-samens",
        }
      }
      return { stderr: `apply: unknown policy '${policy}'` }
    },
    kubectl: ({ state, args }): CommandResult => {
      if (args[0] === "get" && args[1] === "networkpolicies") {
        const lines: string[] = ["NAMESPACE   NAME                            POD-SELECTOR              AGE"]
        if (state.env.POLICY_DENY === "yes") lines.push("prod        default-deny-ingress            <none>                    1m")
        if (state.env.POLICY_INGRESS === "yes") lines.push("prod        allow-ingress-nginx-to-api      app=api,tier=backend       30s")
        if (state.env.POLICY_SAMENS === "yes") lines.push("prod        allow-prod-internal             app=api,tier=backend       20s")
        if (lines.length === 1) lines.push(dim("(no NetworkPolicy resources in cluster)"))
        return { stdout: lines.join("\r\n") }
      }
      return { stderr: "kubectl: this sim supports 'kubectl get networkpolicies -n prod'" }
    },
    audit: ({ state, args }): CommandResult => {
      if (args[0] !== "signoff") return { stderr: "audit: usage: audit signoff" }
      const checks = [
        { name: "Topology + policy templates inspected",          ok: state.env.INSPECTED === "yes" },
        { name: "Pre-state probe — confirmed CIS 5.3.2 violation",ok: state.env.PROBED_BEFORE === "yes" },
        { name: "default-deny ingress applied to prod",           ok: state.env.POLICY_DENY === "yes" },
        { name: "allow-ingress-nginx-to-api applied",             ok: state.env.POLICY_INGRESS === "yes" },
        { name: "allow-prod-internal (worker) applied",           ok: state.env.POLICY_SAMENS === "yes" },
        { name: "Post-state probes confirm attacker blocked + legitimate traffic restored", ok: state.env.PROBED_AFTER === "yes" },
      ]
      const lines = checks.map((c) => (c.ok ? green("  ✓ ") + c.name : red("  ✗ ") + c.name))
      const allOk = checks.every((c) => c.ok)
      return {
        stdout:
          bold("CIS Benchmark 5.3.2 — sign-off") + "\r\n" +
          lines.join("\r\n") + "\r\n" +
          (allOk
            ? green("Result: PASS — prod namespace is default-deny with explicit allow flows. Document policy IDs.")
            : red("Result: FAIL — fix the ✗ items.")),
        goalMet: allOk ? "audit" : undefined,
      }
    },
    hint: ({ state }) => {
      const r = k8sNetworkpolicyMission.goals.find((g) => !state.goalsMet.includes(g.id))
      return { stdout: r ? dim("→ ") + yellow(r.label) + dim("  (" + (r.hint ?? "") + ")") : green("All goals met.") }
    },
    goals: ({ state }) => ({ stdout: bold("Goals") + "\r\n" + k8sNetworkpolicyMission.goals.map((g) => (state.goalsMet.includes(g.id) ? green("  ✓ ") + dim(g.label) : dim("  · ") + g.label)).join("\r\n") }),
    clear: () => ({ stdout: "\x1b[2J\x1b[H" }),
    exit: () => ({ stdout: dim("— session closed —") }),
  },
  initialState,
}
