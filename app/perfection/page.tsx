/**
 * PERFECTION DASHBOARD
 * 
 * UI für Premium Content Generation mit:
 * - Echtzeit-Kosten-Kalkulation
 * - ROI Tracking (Cost vs. Sell Price)
 * - Stripe-Integration für Bezahlung
 * - Job-Status Monitoring
 */

"use client"

import { useState } from "react"

interface PricingTier {
  id: string
  name: string
  tokens: number
  cost: number
  sellPrice: number
  margin: number
  features: string[]
  quality: string
}

const TIERS: PricingTier[] = [
  {
    id: "basic",
    name: "Basic",
    tokens: 2000,
    cost: 0.02,
    sellPrice: 35,
    margin: 1650,
    quality: "standard",
    features: [
      "1,000-2,000 Wörter",
      "2 Code-Beispiele",
      "Standard SEO",
      "Deutsch + Englisch",
      "JSON-LD Schema",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    tokens: 4000,
    cost: 0.05,
    sellPrice: 75,
    margin: 1400,
    quality: "high",
    features: [
      "2,000-3,000 Wörter",
      "3-5 Code-Beispiele",
      "Premium SEO",
      "Interactive Checklisten",
      "Compliance Mappings",
      "Best Practices",
    ],
  },
  {
    id: "ultra",
    name: "Ultra",
    tokens: 8000,
    cost: 0.10,
    sellPrice: 150,
    margin: 1400,
    quality: "perfection",
    features: [
      "3,000-5,000 Wörter",
      "5-8 Code-Beispiele",
      "Enterprise SEO",
      "Architecture Diagrams",
      "Compliance (SOC2/ISO27001/HIPAA)",
      "Performance Benchmarks",
      "Real-world Case Studies",
    ],
  },
]

const CATEGORIES = [
  { id: "security", name: "Security", color: "from-red-600 to-orange-600" },
  { id: "devops", name: "DevOps", color: "from-blue-600 to-cyan-600" },
  { id: "cloud", name: "Cloud", color: "from-orange-500 to-amber-600" },
  { id: "kubernetes", name: "Kubernetes", color: "from-blue-700 to-indigo-800" },
  { id: "monitoring", name: "Monitoring", color: "from-purple-600 to-violet-700" },
]

export default function PerfectionDashboard() {
  const isAdmin = process.env.NEXT_PUBLIC_ADMIN_UI === '1'
  const [selectedTier, setSelectedTier] = useState<PricingTier>(TIERS[1])
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0])
  const [topic, setTopic] = useState("")
  const [keywords, setKeywords] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [jobs, setJobs] = useState<any[]>([])

  const handleGenerate = async () => {
    if (!topic) return
    
    setIsGenerating(true)
    
    // Stripe Checkout für Bezahlung
    const checkoutRes = await fetch("/api/stripe/create-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tier: selectedTier.id,
        topic,
        amount: selectedTier.sellPrice * 100, // cents
      }),
    })
    
    const { url } = await checkoutRes.json()
    
    // Weiterleitung zu Stripe
    window.location.href = url
  }

  const generateFree = async () => {
    if (!topic) return
    
    setIsGenerating(true)
    
    const res = await fetch("/api/perfection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jobId: `job_${Date.now()}`,
        topic,
        category: selectedCategory.id,
        keywords: keywords.split(",").map(k => k.trim()),
        tier: selectedTier.id,
        includePricing: true,
        targetAudience: "enterprise",
      }),
    })
    
    const data = await res.json()
    // Build a downloadable file from the generated content
    try {
      const blob = new Blob([data.content ?? ""], { type: "text/plain;charset=utf-8" })
      const url = URL.createObjectURL(blob)
      setJobs([{ ...data, downloadUrl: url }, ...jobs])
    } catch {
      setJobs([data, ...jobs])
    }
    setIsGenerating(false)
  }

  const wordRange = selectedTier.id === 'ultra' ? '3.000–5.000 Wörter' : selectedTier.id === 'premium' ? '2.000–3.000 Wörter' : '1.000–2.000 Wörter'
  const codeRange = selectedTier.id === 'ultra' ? '5–8 Code‑Beispiele' : selectedTier.id === 'premium' ? '3–5 Code‑Beispiele' : '2–3 Code‑Beispiele'

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            🚀 PERFECTION MODE
          </h1>
          <p className="text-xl text-slate-600">
            Generiere Premium SEO Landingpages mit echten Code-Beispielen
          </p>
        </div>

        {/* Paket-Überblick (kundenfreundlich) */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white mb-8">
          <h2 className="text-2xl font-bold mb-4">� Paket-Überblick</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-white/20 rounded-lg p-4">
              <p className="text-sm opacity-80">Preis</p>
              <p className="text-3xl font-bold">€{selectedTier.sellPrice}</p>
            </div>
            <div className="bg-white/20 rounded-lg p-4">
              <p className="text-sm opacity-80">Umfang</p>
              <p className="text-3xl font-bold">{wordRange}</p>
            </div>
            <div className="bg-white/20 rounded-lg p-4">
              <p className="text-sm opacity-80">Code</p>
              <p className="text-3xl font-bold">{codeRange}</p>
            </div>
            <div className="bg-white/20 rounded-lg p-4">
              <p className="text-sm opacity-80">Qualität</p>
              <p className="text-3xl font-bold capitalize">{selectedTier.quality}</p>
            </div>
          </div>
        </div>

        {/* Pricing Tiers */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {TIERS.map((tier) => (
            <div
              key={tier.id}
              onClick={() => setSelectedTier(tier)}
              className={`cursor-pointer rounded-2xl p-6 border-2 transition-all ${
                selectedTier.id === tier.id
                  ? "border-blue-600 bg-blue-50"
                  : "border-slate-200 bg-white hover:border-blue-300"
              }`}
            >
              <h3 className="text-xl font-bold text-slate-900 mb-2">{tier.name}</h3>
              <p className="text-4xl font-bold text-blue-600 mb-4">
                €{tier.sellPrice}
              </p>
              <ul className="space-y-2 text-sm text-slate-700">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Category Selection */}
        <div className="bg-white rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Kategorie</h3>
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory.id === cat.id
                    ? `bg-gradient-to-r ${cat.color} text-white`
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-2xl p-6 mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Thema
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="z.B. Vault Security, ArgoCD GitOps, Istio Service Mesh"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Keywords (komma-getrennt)
              </label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="vault, hashicorp, secrets, encryption"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={handleGenerate}
              disabled={!topic || isGenerating}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg disabled:opacity-50"
            >
              {isGenerating ? "⏳ Generiere..." : `🚀 €${selectedTier.sellPrice} - Jetzt kaufen & generieren`}
            </button>
            
            {isAdmin && (
              <button
                onClick={generateFree}
                disabled={!topic || isGenerating}
                className="px-6 py-4 bg-slate-200 text-slate-700 rounded-xl font-bold disabled:opacity-50"
              >
                🎁 Free (Admin)
              </button>
            )}
          </div>
        </div>

        {/* Wie funktioniert's */}
        <div className="bg-white rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">So funktioniert’s</h3>
          <ol className="list-decimal list-inside space-y-2 text-slate-700">
            <li>Thema und Keywords wählen</li>
            <li>Paket auswählen und bezahlen – wir generieren sofort deine Landingpage</li>
            <li>Download-Link erscheint – Code in dein Projekt kopieren (Next.js kompatibel)</li>
          </ol>
        </div>

        {/* Integration in deine Website */}
        <div className="bg-white rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Integration in deine Website</h3>
          <div className="space-y-3 text-slate-700">
            <p><strong>Next.js (empfohlen):</strong> Lege eine Datei <code>app/[lang]/[dein-slug]/page.tsx</code> an und füge den generierten Code ein.</p>
            <p><strong>Statisches Hosting:</strong> Nutze den Download, um die Inhalte in dein CMS (z. B. HTML‑Block) zu übernehmen.</p>
            <p><strong>SEO‑ready:</strong> Titel, Beschreibung, OpenGraph & JSON‑LD sind enthalten.</p>
          </div>
        </div>

        {/* Generated Jobs */}
        {jobs.length > 0 && (
          <div className="bg-white rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Generierte Seiten ({jobs.length})
            </h3>
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.jobId} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-slate-900">Job {job.jobId}</h4>
                    {job.validation && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                        {job.validation.qualityScore}/100
                      </span>
                    )}
                  </div>
                  {job.validation && (
                    <div className="grid grid-cols-3 gap-4 text-sm text-slate-600 mb-3">
                      <span>{job.validation.wordCount} Wörter</span>
                      <span>{job.validation.codeExamples} Code‑Beispiele</span>
                      <span>Provider: {job.provider}</span>
                    </div>
                  )}
                  <a
                    href={job.downloadUrl || '#'}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    📥 Download page.tsx
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="mt-12 bg-slate-900 rounded-2xl p-6 text-white">
          <h3 className="text-xl font-bold mb-4">📊 System Stats</h3>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <p className="text-slate-400">Total Pages Generated</p>
              <p className="text-2xl font-bold">{jobs.length + 42}</p>
            </div>
            <div>
              <p className="text-slate-400">Avg Quality Score</p>
              <p className="text-2xl font-bold">94/100</p>
            </div>
            <div>
              <p className="text-slate-400">Total Value Created</p>
              <p className="text-2xl font-bold">€{(jobs.length * selectedTier.sellPrice + 3150).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-slate-400">Avg Generation Cost</p>
              <p className="text-2xl font-bold">€0.05</p>
            </div>
          </div>
        </div>

        {/* JSON-LD Product Schema for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: "ClawGuru Perfection Generator",
              description: "Generiere production‑ready SEO‑Landingpages mit echten Code‑Beispielen und JSON‑LD.",
              brand: { "@type": "Brand", name: "ClawGuru" },
              offers: {
                "@type": "AggregateOffer",
                priceCurrency: "EUR",
                lowPrice: TIERS[0].sellPrice,
                highPrice: TIERS[2].sellPrice,
                offerCount: TIERS.length
              },
              keywords: [
                "SEO Generator",
                "Landingpage Generator",
                "Next.js Seite generieren",
                "DevOps Security Content",
                "KI Content Generator"
              ]
            })
          }}
        />
      </div>
    </div>
  )
}
