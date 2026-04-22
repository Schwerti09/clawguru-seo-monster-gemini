"use client"

import "@xterm/xterm/css/xterm.css"
import { useEffect, useRef, useState } from "react"
import type { Mission, MissionState } from "@/lib/academy/missionEngine"
import { runCommand } from "@/lib/academy/missionEngine"

interface Props {
  mission: Mission
  onStateChange?: (state: MissionState) => void
  onComplete?: () => void
}

// Browser-native Linux sim. Loads xterm.js dynamically (client-only) and wires
// it to the pure mission engine. The terminal is purely view; the engine owns
// truth. This component:
//   - buffers one line of user input
//   - handles backspace + enter
//   - prints command output + mission welcome on mount
//   - notifies parent on state change / completion
export function LiveRangeTerminal({ mission, onStateChange, onComplete }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const termRef = useRef<any>(null)
  const stateRef = useRef<MissionState>(mission.initialState)
  const lineRef = useRef<string>("")
  const completedRef = useRef<boolean>(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let disposed = false
    let fitAddon: any = null

    async function init() {
      const { Terminal } = await import("@xterm/xterm")
      const { FitAddon } = await import("@xterm/addon-fit")

      if (disposed || !containerRef.current) return

      const term = new Terminal({
        fontFamily: '"JetBrains Mono","Fira Code",Menlo,monospace',
        fontSize: 13,
        lineHeight: 1.3,
        cursorBlink: true,
        cursorStyle: "bar",
        convertEol: true,
        theme: {
          background: "#07090c",
          foreground: "#e6edf3",
          cursor: "#6ee7b7",
          cursorAccent: "#07090c",
          selectionBackground: "#334155",
          black: "#0b0f14",
          red: "#ff6b6b",
          green: "#6ee7b7",
          yellow: "#f3c969",
          blue: "#93c5fd",
          magenta: "#c4b5fd",
          cyan: "#7dd3fc",
          white: "#e6edf3",
          brightBlack: "#475569",
          brightRed: "#ff8787",
          brightGreen: "#86efac",
          brightYellow: "#fde68a",
          brightBlue: "#bfdbfe",
          brightMagenta: "#ddd6fe",
          brightCyan: "#bae6fd",
          brightWhite: "#f8fafc",
        },
      })

      fitAddon = new FitAddon()
      term.loadAddon(fitAddon)
      term.open(containerRef.current)
      try { fitAddon.fit() } catch { /* initial layout racey, retry on resize */ }

      term.write(mission.welcome)
      writePrompt(term, mission.prompt)

      term.onData((data: string) => handleInput(term, data))

      termRef.current = term
      setReady(true)
    }

    function handleInput(term: any, data: string) {
      // data can be multi-char (e.g. pasted). Process per-char.
      for (const ch of data) {
        const code = ch.charCodeAt(0)
        if (ch === "\r") {
          // Enter
          term.write("\r\n")
          const line = lineRef.current
          lineRef.current = ""
          const r = runCommand(mission, stateRef.current, line)
          if (r.output) term.write(r.output)
          stateRef.current = r.newState
          onStateChange?.(r.newState)
          if (r.done && !completedRef.current) {
            completedRef.current = true
            onComplete?.()
          }
          writePrompt(term, mission.prompt)
        } else if (code === 127 || ch === "\b") {
          // Backspace
          if (lineRef.current.length > 0) {
            lineRef.current = lineRef.current.slice(0, -1)
            term.write("\b \b")
          }
        } else if (code === 3) {
          // Ctrl-C
          lineRef.current = ""
          term.write("^C\r\n")
          writePrompt(term, mission.prompt)
        } else if (code === 12) {
          // Ctrl-L → clear
          term.write("\x1b[2J\x1b[H")
          writePrompt(term, mission.prompt)
          term.write(lineRef.current)
        } else if (code >= 32 && code < 127) {
          lineRef.current += ch
          term.write(ch)
        }
        // ignore other control sequences for now
      }
    }

    init()

    const onResize = () => {
      try { fitAddon?.fit() } catch { /* ignore */ }
    }
    window.addEventListener("resize", onResize)

    return () => {
      disposed = true
      window.removeEventListener("resize", onResize)
      try { termRef.current?.dispose() } catch { /* ignore */ }
      termRef.current = null
    }
    // mission identity is stable within a page load; we intentionally init once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="relative rounded-xl overflow-hidden border border-white/10 bg-[#07090c] shadow-[0_0_40px_-10px_rgba(16,185,129,0.25)]">
      {/* chrome */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10 bg-black/40">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
        <span className="ml-3 text-xs font-mono text-gray-400 truncate">
          defender@hodlberg · {mission.slug}
        </span>
      </div>
      <div
        ref={containerRef}
        className="h-[480px] p-3"
        aria-label="Mission terminal"
        role="application"
      />
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#07090c]/80 text-xs text-gray-400 font-mono">
          booting range…
        </div>
      )}
    </div>
  )
}

function writePrompt(term: any, prompt: string) {
  // Dim prompt for readability without hiding it
  term.write("\x1b[38;2;110;231;183m" + prompt + "\x1b[0m")
}
