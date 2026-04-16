"use client"

import { useState } from "react"
import { Code, Copy, Check, ExternalLink } from "lucide-react"

interface EmbedGeneratorProps {
  score?: number
  stackName?: string
  locale?: string
}

export function EmbedGenerator({ score = 45, stackName = "My Stack", locale = "de" }: EmbedGeneratorProps) {
  const [copied, setCopied] = useState(false)
  const [width, setWidth] = useState(400)
  const [height, setHeight] = useState(300)

  const embedUrl = `https://clawguru.org/embed/roast?id=demo&score=${score}&stack=${encodeURIComponent(stackName)}`
  
  const iframeCode = `<iframe 
  src="${embedUrl}"
  width="${width}" 
  height="${height}"
  frameborder="0"
  style="border: none; border-radius: 16px;"
  title="Roast My Moltbot"
></iframe>`

  const handleCopy = () => {
    navigator.clipboard.writeText(iframeCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="w-full bg-gray-800 rounded-xl border border-gray-700 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-cyan-900/50 rounded-lg flex items-center justify-center">
          <Code className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-100">
            {locale === "de" ? "Embed Generator" : "Embed Generator"}
          </h3>
          <p className="text-xs text-zinc-500">
            {locale === "de" ? "Füge deinen Roast auf deiner Website ein" : "Embed your roast on your website"}
          </p>
        </div>
      </div>

      {/* Preview */}
      <div className="mb-4">
        <p className="text-sm text-zinc-400 mb-2">{locale === "de" ? "Vorschau:" : "Preview:"}</p>
        <div className="bg-gray-900 rounded-lg p-4 flex justify-center">
          <iframe
            src={embedUrl}
            width={Math.min(width, 350)}
            height={Math.min(height, 250)}
            className="border-0 rounded-lg"
            title="Roast Preview"
          />
        </div>
      </div>

      {/* Size Controls */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="text-xs text-zinc-500 block mb-1">Width (px)</label>
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(parseInt(e.target.value) || 400)}
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm text-gray-300"
          />
        </div>
        <div>
          <label className="text-xs text-zinc-500 block mb-1">Height (px)</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(parseInt(e.target.value) || 300)}
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm text-gray-300"
          />
        </div>
      </div>

      {/* Code */}
      <div className="relative">
        <pre className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-xs text-zinc-400 overflow-x-auto">
          {iframeCode}
        </pre>
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 p-2 bg-gray-800 hover:bg-gray-700 rounded transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-zinc-400" />}
        </button>
      </div>

      {/* Direct Link */}
      <a
        href={embedUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 mt-4 text-sm text-cyan-400 hover:text-cyan-300"
      >
        <ExternalLink className="w-4 h-4" />
        {locale === "de" ? "Direktlink öffnen" : "Open direct link"}
      </a>
    </div>
  )
}
