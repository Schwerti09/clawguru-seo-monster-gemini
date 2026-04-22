// Mission Engine — deterministic, data-driven state machine for Academy ∞ missions.
//
// Missions are pure data: a virtual filesystem, a command map, and a list of goals.
// Every command is a pure function of (state, args) → (stdout, state patch, optional
// goal id met). No I/O, no side effects, no backend — runs entirely in the browser.
//
// The engine never mutates; it clones state on every step. Terminal components are
// thin: they render stdout and forward input lines to runCommand().

export interface VirtualFile {
  content: string
  mode?: "rw" | "ro"
}

export interface MissionState {
  cwd: string
  fs: Record<string, VirtualFile>
  env: Record<string, string>
  goalsMet: string[]
  history: string[]
}

export interface Goal {
  id: string
  label: string
  hint?: string
}

export interface CommandContext {
  state: MissionState
  args: string[]
  raw: string
}

export interface CommandResult {
  stdout?: string
  stderr?: string
  statePatch?: Partial<MissionState>
  goalMet?: string
}

export type CommandFn = (ctx: CommandContext) => CommandResult

export interface Mission {
  slug: string
  title: string
  brief: string
  welcome: string
  prompt: string                       // e.g. "defender@hodlberg:~$ "
  initialState: MissionState
  commands: Record<string, CommandFn>
  goals: Goal[]
  success: string                      // printed when all goals met
}

// ─────────────────────────────────────────────────────────────

export interface RunResult {
  output: string                       // multi-line, ANSI-colored
  newState: MissionState
  newGoals: string[]                   // goals met on this step
  done: boolean                        // all goals met
}

export function runCommand(mission: Mission, state: MissionState, line: string): RunResult {
  const trimmed = line.trim()
  const history = [...state.history, trimmed]

  if (!trimmed) {
    return { output: "", newState: { ...state, history }, newGoals: [], done: state.goalsMet.length >= mission.goals.length }
  }

  const [cmd, ...args] = trimmed.split(/\s+/)
  const fn = mission.commands[cmd]
  const ctx: CommandContext = { state: { ...state, history }, args, raw: trimmed }

  if (!fn) {
    return {
      output: red(`command not found: ${cmd}`) + "\r\n" + dim("(try \"help\")"),
      newState: { ...state, history },
      newGoals: [],
      done: false,
    }
  }

  const r = fn(ctx)
  const newGoalsMet = [...state.goalsMet]
  const newGoals: string[] = []
  if (r.goalMet && !newGoalsMet.includes(r.goalMet)) {
    newGoalsMet.push(r.goalMet)
    newGoals.push(r.goalMet)
  }
  const merged: MissionState = {
    ...state,
    ...(r.statePatch ?? {}),
    goalsMet: newGoalsMet,
    history,
    // merge fs / env explicitly so patches can partially update them
    fs: r.statePatch?.fs ? { ...state.fs, ...r.statePatch.fs } : state.fs,
    env: r.statePatch?.env ? { ...state.env, ...r.statePatch.env } : state.env,
  }

  let output = ""
  if (r.stdout) output += r.stdout + (r.stdout.endsWith("\n") ? "" : "\r\n")
  if (r.stderr) output += red(r.stderr) + "\r\n"

  if (newGoals.length > 0) {
    for (const goalId of newGoals) {
      const g = mission.goals.find((x) => x.id === goalId)
      if (g) output += green(`✓ Goal unlocked: ${g.label}`) + "\r\n"
    }
  }

  const done = merged.goalsMet.length >= mission.goals.length
  if (done && !state.goalsMet.length) {
    // just-finished
  }
  if (done && newGoals.length > 0) {
    output += "\r\n" + gold(mission.success) + "\r\n"
  }

  return { output, newState: merged, newGoals, done }
}

// ─── ANSI color helpers ─────────────────────────────────────

export const ansi = {
  reset: "\x1b[0m",
  dim: "\x1b[2m",
  bold: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  gold: "\x1b[38;5;220m",
}

export function red(s: string)   { return `${ansi.red}${s}${ansi.reset}` }
export function green(s: string) { return `${ansi.green}${s}${ansi.reset}` }
export function cyan(s: string)  { return `${ansi.cyan}${s}${ansi.reset}` }
export function dim(s: string)   { return `${ansi.dim}${s}${ansi.reset}` }
export function bold(s: string)  { return `${ansi.bold}${s}${ansi.reset}` }
export function gold(s: string)  { return `${ansi.gold}${s}${ansi.reset}` }
export function yellow(s: string){ return `${ansi.yellow}${s}${ansi.reset}` }

// ─── Path helpers for virtual FS ────────────────────────────

export function resolvePath(cwd: string, path: string): string {
  if (!path) return cwd
  if (path.startsWith("/")) return normalize(path)
  return normalize(cwd === "/" ? `/${path}` : `${cwd}/${path}`)
}

function normalize(p: string): string {
  const parts = p.split("/").filter(Boolean)
  const out: string[] = []
  for (const part of parts) {
    if (part === "." || part === "") continue
    if (part === "..") { out.pop(); continue }
    out.push(part)
  }
  return "/" + out.join("/")
}
