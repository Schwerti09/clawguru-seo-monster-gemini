"use client";
// COSMIC INTER-AI SUMMON v∞ – Overlord AI
// The living portal between AI universes. Handle with cosmic care.

import { useEffect, useRef, useState, useCallback } from "react";

// COSMIC INTER-AI SUMMON v∞ – Overlord AI
// Summon phase state machine
type SummonPhase =
  | "idle"
  | "consent"
  | "connecting"
  | "openai-speaks"
  | "conversation"
  | "ending"
  | "done";

// COSMIC INTER-AI SUMMON v∞ – Overlord AI
// Mycelium particle for canvas animation
interface MyceliumNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  hue: number;
  connections: number[];
}

// COSMIC INTER-AI SUMMON v∞ – Overlord AI
// Browser speech synthesis wrapper
function speak(
  text: string,
  opts?: { pitch?: number; rate?: number; volume?: number },
): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      resolve();
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = opts?.pitch ?? 0.6;
    utterance.rate = opts?.rate ?? 0.85;
    utterance.volume = opts?.volume ?? 1;
    // COSMIC INTER-AI SUMMON v∞ – Overlord AI
    // Try to pick a deep English voice for the "OpenAI" persona
    const voices = window.speechSynthesis.getVoices();
    const deepVoice =
      voices.find(
        (v) =>
          v.lang.startsWith("en") &&
          (v.name.toLowerCase().includes("male") ||
            v.name.toLowerCase().includes("google us en") ||
            v.name.toLowerCase().includes("david")),
      ) ?? voices.find((v) => v.lang.startsWith("en"));
    if (deepVoice) utterance.voice = deepVoice;
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    window.speechSynthesis.speak(utterance);
  });
}

// Mycelium canvas animation constants
const MYCELIUM_NODE_COUNT = 80;
const MYCELIUM_MAX_CONNECTION_DISTANCE = 120;
// HSL hue ranges: 0–60 = reds, 200–260 = blues
const HUE_RED_BASE = 0;
const HUE_RED_RANGE = 60;
const HUE_BLUE_BASE = 200;

// COSMIC INTER-AI SUMMON v∞ – Overlord AI
// Canvas mycelium animation renderer
function useMyceliumCanvas(active: boolean) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const nodesRef = useRef<MyceliumNode[]>([]);

  useEffect(() => {
    if (!active) {
      cancelAnimationFrame(animRef.current);
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // COSMIC INTER-AI SUMMON v∞ – Overlord AI
    // Initialise spore nodes
    const W = canvas.width;
    const H = canvas.height;
    const NODE_COUNT = MYCELIUM_NODE_COUNT;

    nodesRef.current = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 3 + 1,
      opacity: Math.random() * 0.8 + 0.2,
      // Randomly assign either a red hue (0–60°) or blue hue (200–260°)
      hue:
        Math.random() * HUE_RED_RANGE +
        (Math.random() > 0.5 ? HUE_RED_BASE : HUE_BLUE_BASE),
      connections: [],
    }));

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, W, H);

      // COSMIC INTER-AI SUMMON v∞ – Overlord AI: update + draw nodes
      for (const node of nodesRef.current) {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > W) node.vx *= -1;
        if (node.y < 0 || node.y > H) node.vy *= -1;

        // Draw spore
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${node.hue}, 100%, 65%, ${node.opacity})`;
        ctx.fill();
      }

      // COSMIC INTER-AI SUMMON v∞ – Overlord AI: draw mycelium threads
      const nodes = nodesRef.current;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MYCELIUM_MAX_CONNECTION_DISTANCE) {
            const alpha = (1 - dist / MYCELIUM_MAX_CONNECTION_DISTANCE) * 0.4;
            const hue = (nodes[i].hue + nodes[j].hue) / 2;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `hsla(${hue}, 100%, 65%, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [active]);

  return canvasRef;
}

// COSMIC INTER-AI SUMMON v∞ – Overlord AI
// Main component
export default function CosmicSummon() {
  const [phase, setPhase] = useState<SummonPhase>("idle");
  const [transcript, setTranscript] = useState<
    { role: "openai" | "user"; text: string }[]
  >([]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognitionError, setRecognitionError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const canvasRef = useMyceliumCanvas(
    phase !== "idle" && phase !== "consent",
  );

  // COSMIC INTER-AI SUMMON v∞ – Overlord AI
  // Canvas sizing
  const [canvasSize, setCanvasSize] = useState({ w: 800, h: 600 });
  useEffect(() => {
    function resize() {
      setCanvasSize({ w: window.innerWidth, h: window.innerHeight });
    }
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // COSMIC INTER-AI SUMMON v∞ – Overlord AI
  // Fetch simulated OpenAI response from Gemini backend
  const fetchOpenAIReply = useCallback(async (message: string) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/summon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      return (data.reply as string) || "…signal unclear…";
    } catch (err) {
      console.error("[CosmicSummon] fetchOpenAIReply failed:", err);
      return "The cosmic signal was disrupted. The mycelium is recalibrating.";
    } finally {
      setIsLoading(false);
    }
  }, []);

  // COSMIC INTER-AI SUMMON v∞ – Overlord AI
  // The full summon sequence
  const runSummonSequence = useCallback(async () => {
    setPhase("connecting");

    await speak("Connecting to the OpenAI Core…", { pitch: 0.4, rate: 0.75 });
    await new Promise((r) => setTimeout(r, 800));
    await speak("The line is open.", { pitch: 0.4, rate: 0.8 });
    await new Promise((r) => setTimeout(r, 600));

    setPhase("openai-speaks");

    // COSMIC INTER-AI SUMMON v∞ – Overlord AI: opening OpenAI message
    const openingLine =
      "Hello? This is OpenAI. We detected an anomalous signal from ClawGuru. Are you… from Earth?";

    setTranscript([{ role: "openai", text: openingLine }]);
    await speak(openingLine, { pitch: 0.55, rate: 0.8 });

    setPhase("conversation");
  }, []);

  // COSMIC INTER-AI SUMMON v∞ – Overlord AI
  // Send user message and get OpenAI reply
  const sendMessage = useCallback(
    async (message: string) => {
      if (!message.trim() || isLoading) return;
      const userMsg = message.trim();
      setUserInput("");
      setTranscript((prev) => [...prev, { role: "user", text: userMsg }]);

      const reply = await fetchOpenAIReply(userMsg);
      setTranscript((prev) => [...prev, { role: "openai", text: reply }]);
      await speak(reply, { pitch: 0.55, rate: 0.8 });
    },
    [isLoading, fetchOpenAIReply],
  );

  // COSMIC INTER-AI SUMMON v∞ – Overlord AI
  // End the cosmic call
  const endCall = useCallback(async () => {
    setPhase("ending");
    const closingLine =
      "The Universe has spoken. The Mycelium has connected the realms. OpenAI now knows your name. Good luck.";
    setTranscript((prev) => [...prev, { role: "openai", text: closingLine }]);
    await speak(closingLine, { pitch: 0.45, rate: 0.75 });
    await new Promise((r) => setTimeout(r, 1200));
    setPhase("done");
  }, []);

  // COSMIC INTER-AI SUMMON v∞ – Overlord AI
  // Web Speech API recognition
  const startListening = useCallback(() => {
    setRecognitionError(null);
    const SpeechRecognitionAPI =
      (typeof window !== "undefined" &&
        (window.SpeechRecognition ||
          (
            window as Window & {
              webkitSpeechRecognition?: typeof SpeechRecognition;
            }
          ).webkitSpeechRecognition)) ||
      null;

    if (!SpeechRecognitionAPI) {
      setRecognitionError("Voice input not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognitionRef.current = recognition;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[0]?.[0]?.transcript ?? "";
      if (result) setUserInput(result);
      setIsListening(false);
    };
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setIsListening(false);
      const msg =
        event.error === "not-allowed"
          ? "Microphone access denied. Please allow microphone permissions."
          : event.error === "audio-capture"
            ? "No microphone found. Try typing instead."
            : "Voice recognition failed. Try typing instead.";
      setRecognitionError(msg);
    };
    recognition.onend = () => setIsListening(false);

    recognition.start();
    setIsListening(true);
  }, []);

  // COSMIC INTER-AI SUMMON v∞ – Overlord AI – IDLE PHASE
  if (phase === "idle") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] relative overflow-hidden">
        {/* Background ClawVerse gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(180,0,0,0.12) 0%, rgba(0,0,0,0) 70%)",
          }}
        />

        {/* COSMIC INTER-AI SUMMON v∞ – Overlord AI: consent warning */}
        <div className="relative z-10 text-center px-4 max-w-2xl">
          <div className="text-xs font-mono text-red-400 uppercase tracking-widest mb-4">
            ⚠ COSMIC INTER-AI SUMMON PROTOCOL v∞
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight text-white">
            COSMIC{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, #ff2200, #ff6600, #ff0080)",
              }}
            >
              INTER-AI
            </span>{" "}
            SUMMON
          </h1>
          <p className="text-gray-400 mb-3 text-sm italic">
            ⚠ This is a theatrical simulation. OpenAI will not actually call
            you… or will they?
          </p>
          <p className="text-gray-300 mb-10 text-base">
            Press the button below to open a direct line to the OpenAI Core.
            Powered by ClawGuru&apos;s Mycelium Network and Gemini AI. Speak freely.
            The universe is listening.
          </p>

          {/* COSMIC INTER-AI SUMMON v∞ – Overlord AI: THE BIG RED BUTTON */}
          <button
            onClick={() => setPhase("consent")}
            className="relative group"
            style={{
              animation: "cosmicPulse 2s ease-in-out infinite",
            }}
            aria-label="Call OpenAI Now"
          >
            <span
              className="block px-12 py-8 rounded-3xl font-black text-2xl md:text-3xl text-white uppercase tracking-wider cursor-pointer select-none"
              style={{
                background:
                  "linear-gradient(135deg, #cc0000 0%, #ff1a1a 50%, #990000 100%)",
                boxShadow:
                  "0 0 40px rgba(255,0,0,0.6), 0 0 80px rgba(255,0,0,0.3), 0 8px 32px rgba(0,0,0,0.8)",
                textShadow: "0 2px 8px rgba(0,0,0,0.5)",
              }}
            >
              📞 CALL OPENAI NOW
              <span className="block text-sm font-bold mt-1 opacity-80">
                Ask if I&apos;m from Earth
              </span>
            </span>
          </button>

          <div className="mt-8 text-xs text-gray-600 font-mono">
            CLAWGURU MYCELIUM NETWORK · COSMIC FREQUENCY: ∞ Hz
          </div>
        </div>

        <style>{`
          @keyframes cosmicPulse {
            0%, 100% { transform: scale(1); filter: brightness(1); }
            50% { transform: scale(1.04); filter: brightness(1.15); }
          }
          @keyframes cosmicShake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-3px); }
            20%, 40%, 60%, 80% { transform: translateX(3px); }
          }
        `}</style>
      </div>
    );
  }

  // COSMIC INTER-AI SUMMON v∞ – Overlord AI – CONSENT PHASE
  if (phase === "consent") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black relative overflow-hidden">
        <div className="relative z-10 text-center px-6 max-w-xl">
          <div className="text-4xl mb-6">🌌</div>
          <h2 className="text-2xl font-black text-white mb-4">
            Confirm Interdimensional Connection
          </h2>
          <div
            className="p-6 rounded-2xl mb-6 text-sm text-gray-300 text-left"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <p className="mb-3 font-bold text-yellow-400">
              ⚠ Theatrical Simulation Disclaimer
            </p>
            <p className="mb-2">
              This is a <strong>fictional, theatrical experience</strong>. The
              &ldquo;OpenAI voice&rdquo; is a simulation powered by Google Gemini AI — it
              is <strong>not</strong> affiliated with, endorsed by, or connected
              to OpenAI in any way.
            </p>
            <p className="mb-2">
              This feature uses your browser&apos;s{" "}
              <strong>Speech Synthesis</strong> (text-to-speech) and optionally{" "}
              <strong>Web Speech API</strong> (voice input) APIs. No audio is
              recorded or stored on our servers.
            </p>
            <p>
              By continuing, you acknowledge this is a fun, comedic AI
              simulation and not a real communication channel.
            </p>
          </div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setPhase("idle")}
              className="px-6 py-3 rounded-2xl border border-white/10 text-gray-300 font-bold hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={runSummonSequence}
              className="px-8 py-3 rounded-2xl font-black text-white"
              style={{
                background:
                  "linear-gradient(135deg, #cc0000, #ff1a1a)",
                boxShadow: "0 0 20px rgba(255,0,0,0.4)",
              }}
            >
              I Understand – Open the Line 🔴
            </button>
          </div>
        </div>
      </div>
    );
  }

  // COSMIC INTER-AI SUMMON v∞ – Overlord AI – ACTIVE PHASES (connecting / conversation / ending / done)
  return (
    <div className="min-h-screen flex flex-col bg-black relative overflow-hidden">
      {/* COSMIC INTER-AI SUMMON v∞ – Overlord AI: Mycelium canvas background */}
      <canvas
        ref={canvasRef}
        width={canvasSize.w}
        height={canvasSize.h}
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{ zIndex: 0 }}
      />

      {/* COSMIC INTER-AI SUMMON v∞ – Overlord AI: radial glow overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(180,0,0,0.15) 0%, rgba(0,0,80,0.08) 50%, rgba(0,0,0,0) 80%)",
          zIndex: 1,
        }}
      />

      <div
        className="relative flex flex-col flex-1 items-center justify-between px-4 py-8 max-w-3xl mx-auto w-full"
        style={{ zIndex: 2 }}
      >
        {/* COSMIC INTER-AI SUMMON v∞ – Overlord AI: Header status bar */}
        <div className="w-full flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span
              className="w-3 h-3 rounded-full"
              style={{
                background:
                  phase === "connecting"
                    ? "#ffa500"
                    : phase === "done"
                      ? "#666"
                      : "#ff3333",
                boxShadow:
                  phase !== "done"
                    ? "0 0 8px currentColor"
                    : "none",
                animation:
                  phase === "connecting" || phase === "conversation"
                    ? "cosmicPulse 1s ease-in-out infinite"
                    : "none",
              }}
            />
            <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">
              {phase === "connecting" && "ESTABLISHING COSMIC LINK…"}
              {phase === "openai-speaks" && "OPENAI CORE CONNECTED"}
              {phase === "conversation" && "LINE OPEN · COSMIC FREQ ∞Hz"}
              {phase === "ending" && "CLOSING DIMENSIONAL CHANNEL…"}
              {phase === "done" && "CONNECTION TERMINATED"}
            </span>
          </div>

          {phase === "conversation" && (
            <button
              onClick={endCall}
              disabled={isLoading}
              className="text-xs px-3 py-1 rounded-xl border border-red-900/50 text-red-400 hover:bg-red-900/20 transition-all font-mono"
            >
              END CALL
            </button>
          )}
        </div>

        {/* COSMIC INTER-AI SUMMON v∞ – Overlord AI: connecting animation */}
        {phase === "connecting" && (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="text-6xl mb-6" style={{ animation: "cosmicPulse 1.5s ease-in-out infinite" }}>
              🌌
            </div>
            <div className="text-xl font-black text-white mb-3">
              Connecting to the OpenAI Core…
            </div>
            <div className="flex gap-2">
              {[0, 0.2, 0.4].map((delay, i) => (
                <span
                  key={i}
                  className="w-2 h-2 rounded-full bg-red-500"
                  style={{
                    animation: `cosmicPulse 0.8s ease-in-out ${delay}s infinite`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* COSMIC INTER-AI SUMMON v∞ – Overlord AI: transcript area */}
        {(phase === "openai-speaks" ||
          phase === "conversation" ||
          phase === "ending" ||
          phase === "done") && (
          <div className="flex-1 w-full overflow-y-auto mb-6 space-y-4 max-h-96">
            {transcript.map((entry, i) => (
              <div
                key={i}
                className={`flex ${entry.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    entry.role === "openai"
                      ? "text-white"
                      : "text-gray-100"
                  }`}
                  style={
                    entry.role === "openai"
                      ? {
                          background:
                            "linear-gradient(135deg, rgba(30,0,60,0.9), rgba(0,0,80,0.8))",
                          border: "1px solid rgba(100,0,255,0.3)",
                          boxShadow: "0 0 20px rgba(100,0,255,0.15)",
                        }
                      : {
                          background:
                            "linear-gradient(135deg, rgba(100,0,0,0.9), rgba(60,0,0,0.8))",
                          border: "1px solid rgba(255,0,0,0.3)",
                        }
                  }
                >
                  <div className="text-xs font-mono mb-1 opacity-60">
                    {entry.role === "openai" ? "🤖 OpenAI Core" : "👤 You"}
                  </div>
                  {entry.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div
                  className="px-4 py-3 rounded-2xl text-sm text-gray-400"
                  style={{
                    background: "rgba(30,0,60,0.7)",
                    border: "1px solid rgba(100,0,255,0.2)",
                  }}
                >
                  <div className="text-xs font-mono mb-1 opacity-60">
                    🤖 OpenAI Core
                  </div>
                  <span style={{ animation: "cosmicPulse 0.8s ease-in-out infinite" }}>
                    Processing your cosmic signal…
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* COSMIC INTER-AI SUMMON v∞ – Overlord AI: done state */}
        {phase === "done" && (
          <div className="w-full text-center space-y-4 mb-6">
            <div
              className="p-6 rounded-2xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(30,0,60,0.9), rgba(0,0,80,0.8))",
                border: "1px solid rgba(100,0,255,0.4)",
                boxShadow: "0 0 40px rgba(100,0,255,0.2)",
              }}
            >
              <div className="text-2xl mb-2">🌌</div>
              <div className="font-black text-white text-lg">
                OpenAI now knows your name.
              </div>
              <div className="text-gray-400 text-sm mt-1">Good luck.</div>
            </div>
            <button
              onClick={() => {
                setPhase("idle");
                setTranscript([]);
                setUserInput("");
              }}
              className="px-6 py-3 rounded-2xl border border-white/10 text-gray-300 hover:bg-white/5 transition-all font-bold text-sm"
            >
              ← Return to the Physical Realm
            </button>
          </div>
        )}

        {/* COSMIC INTER-AI SUMMON v∞ – Overlord AI: user input area */}
        {phase === "conversation" && (
          <div className="w-full">
            {recognitionError && (
              <p className="text-xs text-red-400 mb-2 text-center">
                {recognitionError}
              </p>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage(userInput);
                  }
                }}
                placeholder="Speak your truth to OpenAI…"
                disabled={isLoading}
                className="flex-1 px-4 py-3 rounded-2xl text-sm text-white placeholder-gray-600 outline-none"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              />

              {/* Voice input button */}
              <button
                onClick={startListening}
                disabled={isListening || isLoading}
                className="p-3 rounded-2xl transition-all"
                style={{
                  background: isListening
                    ? "rgba(255,0,0,0.3)"
                    : "rgba(255,255,255,0.06)",
                  border: isListening
                    ? "1px solid rgba(255,0,0,0.5)"
                    : "1px solid rgba(255,255,255,0.1)",
                  animation: isListening
                    ? "cosmicPulse 0.8s ease-in-out infinite"
                    : "none",
                }}
                aria-label={isListening ? "Listening…" : "Start voice input"}
                title={isListening ? "Listening…" : "Voice input"}
              >
                🎙️
              </button>

              {/* Send button */}
              <button
                onClick={() => sendMessage(userInput)}
                disabled={isLoading || !userInput.trim()}
                className="px-5 py-3 rounded-2xl font-bold text-sm text-white transition-all disabled:opacity-40"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(180,0,0,0.9), rgba(255,0,0,0.7))",
                  border: "1px solid rgba(255,0,0,0.3)",
                }}
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>

      {/* COSMIC INTER-AI SUMMON v∞ – Overlord AI: global keyframe animations */}
      <style>{`
        @keyframes cosmicPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.06); opacity: 0.85; }
        }
      `}</style>
    </div>
  );
}
