"use client"

import { useState } from "react"

const TEST_KEY = "test_clawguru_demo_key_2024"

const SNIPPETS: Record<string, { label: string; lang: string; code: string }> = {
  curl: {
    label: "cURL",
    lang: "bash",
    code: `curl -s \\
  -H "X-API-Key: ${TEST_KEY}" \\
  "https://clawguru.org/api/v1/check-indicator?indicator=8.8.8.8&type=ip"`,
  },
  python: {
    label: "Python",
    lang: "python",
    code: `import requests

API_KEY = "${TEST_KEY}"
BASE_URL = "https://clawguru.org/api/v1"

def check_indicator(indicator: str, type: str = "auto") -> dict:
    response = requests.get(
        f"{BASE_URL}/check-indicator",
        headers={"X-API-Key": API_KEY},
        params={"indicator": indicator, "type": type},
        timeout=10,
    )
    response.raise_for_status()
    return response.json()

result = check_indicator("8.8.8.8", "ip")
print(result["verdict"], result["risk_score"])`,
  },
  javascript: {
    label: "JavaScript / Node.js",
    lang: "javascript",
    code: `import axios from "axios";

const API_KEY = "${TEST_KEY}";
const BASE_URL = "https://clawguru.org/api/v1";

async function checkIndicator(indicator, type = "auto") {
  const { data } = await axios.get(\`\${BASE_URL}/check-indicator\`, {
    headers: { "X-API-Key": API_KEY },
    params: { indicator, type },
  });
  return data;
}

const result = await checkIndicator("8.8.8.8", "ip");
console.log(result.verdict, result.risk_score);`,
  },
  go: {
    label: "Go",
    lang: "go",
    code: `package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
)

const (
	apiKey  = "${TEST_KEY}"
	baseURL = "https://clawguru.org/api/v1"
)

type CheckResult struct {
	Verdict   string \`json:"verdict"\`
	RiskScore int    \`json:"risk_score"\`
	Message   string \`json:"message"\`
}

func checkIndicator(indicator, indicatorType string) (*CheckResult, error) {
	params := url.Values{}
	params.Set("indicator", indicator)
	params.Set("type", indicatorType)

	req, _ := http.NewRequest("GET", baseURL+"/check-indicator?"+params.Encode(), nil)
	req.Header.Set("X-API-Key", apiKey)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var result CheckResult
	json.NewDecoder(resp.Body).Decode(&result)
	return &result, nil
}

func main() {
	r, err := checkIndicator("8.8.8.8", "ip")
	if err != nil {
		panic(err)
	}
	fmt.Printf("Verdict: %s | Risk Score: %d\\n", r.Verdict, r.RiskScore)
}`,
  },
}

const STATUS_CODES = [
  {
    code: "200",
    name: "OK",
    color: "text-green-400",
    desc: "Request succeeded. Parse the JSON body for `verdict`, `risk_score`, and `tags`.",
    action: "Continue your workflow.",
  },
  {
    code: "400",
    name: "Bad Request",
    color: "text-yellow-400",
    desc: "Missing or invalid parameter (e.g. no `indicator` supplied).",
    action: "Check your query parameters before retrying.",
  },
  {
    code: "401",
    name: "Unauthorized",
    color: "text-orange-400",
    desc: "API key missing or invalid.",
    action: "Pass your key via the `X-API-Key` header or `?api_key=` param.",
  },
  {
    code: "404",
    name: "Not Found",
    color: "text-gray-400",
    desc: "Endpoint path not found.",
    action: "Double-check the URL path (e.g. `/api/v1/check-indicator`).",
  },
  {
    code: "429",
    name: "Too Many Requests",
    color: "text-red-400",
    desc: "Rate limit exceeded. Check the `Retry-After` response header.",
    action: "Implement exponential backoff: wait 2^n seconds between retries (cap at 64 s).",
  },
  {
    code: "500",
    name: "Server Error",
    color: "text-red-500",
    desc: "Unexpected server-side error.",
    action: "Retry once after a short delay. If persistent, contact support.",
  },
]

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  return (
    <button
      onClick={handleCopy}
      className="text-xs px-2 py-1 rounded border border-gray-700 text-gray-400 hover:text-[#00ff9d] hover:border-[#00ff9d] transition-colors"
    >
      {copied ? "✓ Copied" : "Copy"}
    </button>
  )
}

function LiveTester() {
  const [indicator, setIndicator] = useState("8.8.8.8")
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function runTest() {
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch(
        `/api/v1/check-indicator?indicator=${encodeURIComponent(indicator)}&type=auto`,
        { headers: { "X-API-Key": TEST_KEY } }
      )
      const data = await res.json()
      setResult(JSON.stringify(data, null, 2))
    } catch (e) {
      setResult(`Error: ${e}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-xl border border-[#00ff9d]/30 bg-black/60 p-4 space-y-3">
      <div className="text-xs font-bold text-[#00ff9d] uppercase tracking-widest">⚡ Live Tester — Test Mode</div>
      <div className="flex gap-2">
        <input
          type="text"
          value={indicator}
          onChange={(e) => setIndicator(e.target.value)}
          placeholder="IP, domain, or hash…"
          className="flex-1 bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-[#00ff9d]"
        />
        <button
          onClick={runTest}
          disabled={loading}
          className="px-4 py-2 rounded bg-[#00ff9d] text-black text-sm font-bold hover:bg-[#00e58a] transition-colors disabled:opacity-50"
        >
          {loading ? "…" : "Run"}
        </button>
      </div>
      {result && (
        <pre className="text-xs text-[#00ff9d] overflow-x-auto whitespace-pre-wrap">{result}</pre>
      )}
    </div>
  )
}

export default function DeveloperHub() {
  const [activeSnippet, setActiveSnippet] = useState<keyof typeof SNIPPETS>("curl")

  const snippet = SNIPPETS[activeSnippet]

  return (
    <div className="py-16 space-y-20">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-block text-xs uppercase tracking-widest text-[#00ff9d]/80 bg-[#00ff9d]/10 px-3 py-1 rounded-full border border-[#00ff9d]/20">
          Developer Hub
        </div>
        <h1 className="text-4xl md:text-5xl font-black">
          ClawGuru{" "}
          <span className="text-[#00ff9d]">Security API</span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Integrate threat intelligence into your stack in minutes.
          No registration needed — use the{" "}
          <code className="text-[#00ff9d] bg-[#00ff9d]/10 px-1 rounded">test_clawguru_demo_key_2024</code>{" "}
          key to start immediately.
        </p>
      </div>

      {/* ── Quick Start ── */}
      <section className="space-y-6">
        <h2 className="text-2xl font-black">
          <span className="text-[#00b8ff]">Quick Start</span> — 3 Steps
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              step: "01",
              title: "Get your API key",
              body: (
                <>
                  Use{" "}
                  <code className="text-[#00ff9d] bg-[#00ff9d]/10 px-1 rounded text-xs">
                    test_clawguru_demo_key_2024
                  </code>{" "}
                  right now — no signup required. For production, register at{" "}
                  <a href="/dashboard" className="underline text-[#00b8ff]">
                    /dashboard
                  </a>{" "}
                  to get a real key.
                </>
              ),
            },
            {
              step: "02",
              title: "Send your first request",
              body: (
                <>
                  Hit{" "}
                  <code className="text-[#00ff9d] bg-[#00ff9d]/10 px-1 rounded text-xs">
                    GET /api/v1/check-indicator
                  </code>{" "}
                  with your{" "}
                  <code className="text-[#00ff9d] bg-[#00ff9d]/10 px-1 rounded text-xs">
                    X-API-Key
                  </code>{" "}
                  header and an{" "}
                  <code className="text-[#00ff9d] bg-[#00ff9d]/10 px-1 rounded text-xs">
                    indicator
                  </code>{" "}
                  param (IP, domain, or file hash).
                </>
              ),
            },
            {
              step: "03",
              title: "Parse the response",
              body: (
                <>
                  Read{" "}
                  <code className="text-[#00ff9d] bg-[#00ff9d]/10 px-1 rounded text-xs">
                    verdict
                  </code>{" "}
                  ({`"clean" | "suspicious" | "malicious"`}),{" "}
                  <code className="text-[#00ff9d] bg-[#00ff9d]/10 px-1 rounded text-xs">
                    risk_score
                  </code>{" "}
                  (0–99), and{" "}
                  <code className="text-[#00ff9d] bg-[#00ff9d]/10 px-1 rounded text-xs">
                    tags
                  </code>
                  . React accordingly in your pipeline.
                </>
              ),
            },
          ].map(({ step, title, body }) => (
            <div
              key={step}
              className="p-5 rounded-2xl border border-gray-800 bg-gray-900/50 space-y-2 hover:border-[#00b8ff]/40 transition-colors"
            >
              <div className="text-3xl font-black text-[#00b8ff]/30">{step}</div>
              <div className="font-bold text-white">{title}</div>
              <p className="text-sm text-gray-400 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 2-Column: Docs + Code ── */}
      <section className="space-y-6">
        <h2 className="text-2xl font-black">
          <span className="text-[#00b8ff]">Code Snippets</span> — Copy &amp; Paste Ready
        </h2>

        <div className="grid lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-gray-800">
          {/* Left: docs / tabs */}
          <div className="bg-gray-900/80 p-6 space-y-4 border-r border-gray-800">
            <div className="text-xs uppercase tracking-widest text-gray-500">
              Endpoint
            </div>
            <div className="font-mono text-sm bg-black/60 rounded-lg px-4 py-3 text-[#00ff9d] border border-gray-700">
              GET /api/v1/check-indicator
            </div>

            <div className="space-y-2 text-sm text-gray-300">
              <div className="font-semibold text-white">Parameters</div>
              {[
                { name: "indicator", req: true, desc: "IP address, domain, or file hash to check." },
                { name: "type", req: false, desc: "\"ip\" | \"domain\" | \"hash\" | \"auto\" (default)." },
                { name: "api_key", req: false, desc: "Alternative to X-API-Key header." },
              ].map(({ name, req, desc }) => (
                <div key={name} className="flex gap-2">
                  <code className="text-[#00ff9d] bg-[#00ff9d]/10 px-1 rounded shrink-0">{name}</code>
                  {req && (
                    <span className="text-red-400 text-xs shrink-0 self-center">required</span>
                  )}
                  <span className="text-gray-400 text-xs">{desc}</span>
                </div>
              ))}
            </div>

            {/* Language tabs */}
            <div className="pt-4 space-y-1">
              <div className="text-xs uppercase tracking-widest text-gray-500 mb-2">Language</div>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(SNIPPETS) as Array<keyof typeof SNIPPETS>).map((key) => (
                  <button
                    key={key}
                    onClick={() => setActiveSnippet(key)}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      activeSnippet === key
                        ? "bg-[#00ff9d] text-black"
                        : "border border-gray-700 text-gray-400 hover:text-[#00ff9d] hover:border-[#00ff9d]"
                    }`}
                  >
                    {SNIPPETS[key].label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: dark code window */}
          <div className="bg-black/90 flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              <span className="text-xs text-gray-500">{snippet.label}</span>
              <CopyButton text={snippet.code} />
            </div>
            <pre className="flex-1 overflow-x-auto p-5 text-xs text-[#00ff9d] leading-relaxed font-mono">
              {snippet.code}
            </pre>
          </div>
        </div>
      </section>

      {/* ── Live Tester ── */}
      <section className="space-y-6">
        <h2 className="text-2xl font-black">
          <span className="text-[#00b8ff]">Live Test</span> — Hello World in &lt;30 s
        </h2>
        <LiveTester />
      </section>

      {/* ── Error Guide ── */}
      <section className="space-y-6">
        <h2 className="text-2xl font-black">
          <span className="text-[#00b8ff]">Error Handling</span> Guide
        </h2>
        <div className="rounded-2xl border border-gray-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-900/80 text-left text-xs uppercase tracking-widest text-gray-500">
                <th className="px-4 py-3 w-16">Code</th>
                <th className="px-4 py-3 w-36">Name</th>
                <th className="px-4 py-3">What happened</th>
                <th className="px-4 py-3">What to do</th>
              </tr>
            </thead>
            <tbody>
              {STATUS_CODES.map(({ code, name, color, desc, action }, i) => (
                <tr
                  key={code}
                  className={`border-t border-gray-800 ${
                    i % 2 === 0 ? "bg-black/40" : "bg-gray-900/20"
                  }`}
                >
                  <td className={`px-4 py-3 font-mono font-bold ${color}`}>{code}</td>
                  <td className="px-4 py-3 text-gray-300 font-medium">{name}</td>
                  <td className="px-4 py-3 text-gray-400">{desc}</td>
                  <td className="px-4 py-3 text-gray-300">{action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 rounded-xl border border-yellow-500/30 bg-yellow-500/5 text-sm text-yellow-300">
          <strong>Rate limit tip:</strong> On HTTP 429 use exponential backoff:{" "}
          <code className="bg-yellow-500/10 px-1 rounded">wait = min(2^attempt, 64)</code> seconds.
          Read the <code className="bg-yellow-500/10 px-1 rounded">Retry-After</code> header for the exact reset time.
        </div>
      </section>

      {/* ── Postman ── */}
      <section className="space-y-4">
        <h2 className="text-2xl font-black">
          <span className="text-[#00b8ff]">Postman</span> Collection
        </h2>
        <div className="p-6 rounded-2xl border border-gray-800 bg-gray-900/50 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1 space-y-1">
            <div className="font-bold text-white">Import with one click</div>
            <p className="text-sm text-gray-400">
              Click the button below (or use <em>File → Import → Link</em> in Postman) to load the
              ClawGuru API environment with all endpoints, example payloads, and the Test Mode key
              pre-configured.
            </p>
            <code className="block mt-2 text-xs text-[#00ff9d] bg-[#00ff9d]/5 border border-[#00ff9d]/20 rounded px-3 py-2">
              https://clawguru.org/api/postman-collection.json{" "}
              <span className="text-yellow-400">{/* coming soon */}</span>
            </code>
            <p className="text-xs text-yellow-400/70 mt-1">
              ⚠️ Postman collection coming soon — contact us to get early access.
            </p>
          </div>
          <a
            href="https://app.getpostman.com/run-collection/clawguru-api"
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled="true"
            onClick={(e) => e.preventDefault()}
            className="shrink-0 px-5 py-2.5 rounded-lg bg-[#ff6c37]/50 text-white/60 font-bold text-sm cursor-not-allowed select-none"
            title="Coming soon"
          >
            Run in Postman (soon)
          </a>
        </div>
      </section>
    </div>
  )
}
