import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { Shirt, Sticker, ShoppingBag, ExternalLink, Shield } from "lucide-react"
import Link from "next/link"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/merch"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = isDE
    ? "Roast Merch — I Survived the Roast T-Shirts & Stickers | ClawGuru"
    : "Roast Merch — I Survived the Roast T-Shirts & Stickers | ClawGuru"
  const description = isDE
    ? "Offizielles ClawGuru Merch: T-Shirts, Stickers und Accessoires. Print-on-Demand mit Brand Awareness. Keine Mock-Daten."
    : "Official ClawGuru merch: T-shirts, stickers, and accessories. Print-on-demand with brand awareness. No mock data."
  return {
    title,
    description,
    keywords: ["roast merch", "security t-shirts", "clawguru merch", "i survived the roast", "security stickers"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

interface MerchItem {
  id: string
  name: string
  description: string
  price: string
  category: "tshirt" | "sticker" | "accessory"
  imageUrl?: string
  shopUrl?: string
}

const merchItems: MerchItem[] = [
  {
    id: "tshirt-1",
    name: "I Survived the Roast",
    description: "Classic black tee with bold white text. Show the world you survived the security roast.",
    price: "€29.99",
    category: "tshirt",
    shopUrl: "https://shop.spreadshirt.com/clawguru/",
  },
  {
    id: "tshirt-2",
    name: "Elite Stack Only",
    description: "For those who achieved a score of 90+. Premium quality cotton tee.",
    price: "€34.99",
    category: "tshirt",
    shopUrl: "https://shop.spreadshirt.com/clawguru/",
  },
  {
    id: "sticker-1",
    name: "Roast Level: Spicy",
    description: "Sticker pack with roast levels: Mild, Medium, Spicy. Perfect for your laptop.",
    price: "€9.99",
    category: "sticker",
    shopUrl: "https://shop.spreadshirt.com/clawguru/",
  },
  {
    id: "sticker-2",
    name: "Security Shield",
    description: "High-quality vinyl sticker with the ClawGuru security shield logo.",
    price: "€4.99",
    category: "sticker",
    shopUrl: "https://shop.spreadshirt.com/clawguru/",
  },
  {
    id: "accessory-1",
    name: "Security Tote Bag",
    description: "Reusable canvas tote bag. Perfect for carrying your security gear.",
    price: "€19.99",
    category: "accessory",
    shopUrl: "https://shop.spreadshirt.com/clawguru/",
  },
  {
    id: "accessory-2",
    name: "DevOps Mug",
    description: "Ceramic mug with 'I fix broken stacks' text. 11oz capacity.",
    price: "€14.99",
    category: "accessory",
    shopUrl: "https://shop.spreadshirt.com/clawguru/",
  },
]

export default function MerchPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"

  const categoryIcons = {
    tshirt: Shirt,
    sticker: Sticker,
    accessory: ShoppingBag,
  }

  const categoryNames = {
    tshirt: isDE ? "T-Shirts" : "T-Shirts",
    sticker: isDE ? "Sticker" : "Stickers",
    accessory: isDE ? "Accessoires" : "Accessories",
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">
            {isDE ? "Roast Merch — I Survived the Roast" : "Roast Merch — I Survived the Roast"}
          </h1>
          <p className="text-lg text-gray-300 mb-4">
            {isDE
              ? "Offizielles ClawGuru Merch: T-Shirts, Stickers und Accessoires. Print-on-Demand mit Brand Awareness."
              : "Official ClawGuru merch: T-shirts, stickers, and accessories. Print-on-demand with brand awareness."}
          </p>
          <p className="text-sm text-cyan-400 font-medium">
            {isDE ? "→ Alle Produkte sind Print-on-Demand. Kein Lagerbestand." : "→ All products are print-on-demand. No inventory."}
          </p>
        </div>

        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE
            ? "Diese Merchandise dient zur Brand Awareness und Community-Building. Keine Angriffstools."
            : "This merchandise is for brand awareness and community building. No attack tools."}
        </div>

        {/* Merchandise Grid */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Produkte" : "Products"}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {merchItems.map((item) => {
              const Icon = categoryIcons[item.category]
              return (
                <div key={item.id} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="bg-cyan-900 p-3 rounded-lg">
                      <Icon className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-100">{item.name}</h3>
                      <div className="text-xs text-gray-400">{categoryNames[item.category]}</div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-300 mb-4">{item.description}</p>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-cyan-400">{item.price}</span>
                    <div className="bg-gray-900 px-3 py-1 rounded-lg">
                      <span className="text-xs text-gray-400">{isDE ? "Print-on-Demand" : "Print-on-Demand"}</span>
                    </div>
                  </div>

                  {item.shopUrl && (
                    <a
                      href={item.shopUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-semibold text-white text-sm transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      {isDE ? "Im Shop ansehen" : "View in Shop"}
                    </a>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* Categories */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Kategorien" : "Categories"}</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 text-center">
              <Shirt className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
              <h3 className="font-bold text-gray-100 mb-2">{isDE ? "T-Shirts" : "T-Shirts"}</h3>
              <p className="text-sm text-gray-300">{isDE ? "Premium Cotton, 100% Baumwolle" : "Premium Cotton, 100% Cotton"}</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 text-center">
              <Sticker className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
              <h3 className="font-bold text-gray-100 mb-2">{isDE ? "Sticker" : "Stickers"}</h3>
              <p className="text-sm text-gray-300">{isDE ? "Hochwertiges Vinyl, wasserdicht" : "High-quality vinyl, waterproof"}</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 text-center">
              <ShoppingBag className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
              <h3 className="font-bold text-gray-100 mb-2">{isDE ? "Accessoires" : "Accessories"}</h3>
              <p className="text-sm text-gray-300">{isDE ? "Tote Bags, Mugs, mehr" : "Tote bags, mugs, more"}</p>
            </div>
          </div>
        </section>

        {/* Why Merch? */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Warum Merch?" : "Why Merch?"}</h2>
          <div className="space-y-4">
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">{isDE ? "Brand Awareness" : "Brand Awareness"}</h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Zeige deine Zugehörigkeit zur Security-Community und trage ClawGuru in die Welt."
                  : "Show your security community membership and spread ClawGuru to the world."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">{isDE ? "Community Building" : "Community Building"}</h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Verbinde dich mit anderen Security-Enthusiasten auf Conferences und Events."
                  : "Connect with other security enthusiasts at conferences and events."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">{isDE ? "Print-on-Demand" : "Print-on-Demand"}</h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Kein Lagerbestand, keine Verschwendung. Produkte werden erst bei Bestellung produziert."
                  : "No inventory, no waste. Products are only produced when ordered."}
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mb-10">
          <div className="bg-gradient-to-r from-cyan-900/40 to-purple-900/40 border border-cyan-700/50 rounded-xl p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="w-6 h-6 text-cyan-300" />
              <h3 className="text-xl font-bold text-cyan-300">
                {isDE ? "Bereit für Merch?" : "Ready for Merch?"}
              </h3>
            </div>
            <p className="text-sm text-cyan-200/70 mb-4">
              {isDE
                ? "Besuche unseren Shop und finde dein perfektes Security-Merch."
                : "Visit our shop and find your perfect security merch."}
            </p>
            <a
              href="https://shop.spreadshirt.com/clawguru/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-semibold text-white transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
              {isDE ? "Shop besuchen" : "Visit Shop"}
            </a>
          </div>
        </section>

        {/* Further Resources */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Weiterführende Ressourcen" : "Further resources"}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href={`/${locale}/roast-my-moltbot`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{isDE ? "Roast My Moltbot" : "Roast My Moltbot"}</div>
              <div className="text-sm text-gray-300">{isDE ? "Roast starten" : "Start the roast"}</div>
            </Link>
            <Link href={`/${locale}/roast-my-moltbot/hall-of-fame`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{isDE ? "Hall of Fame" : "Hall of Fame"}</div>
              <div className="text-sm text-gray-300">{isDE ? "Elite Stacks" : "Elite stacks"}</div>
            </Link>
            <Link href={`/${locale}/research`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{isDE ? "Research Papers" : "Research Papers"}</div>
              <div className="text-sm text-gray-300">{isDE ? "Academic Insights" : "Academic insights"}</div>
            </Link>
            <Link href={`/${locale}/api-pricing`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{isDE ? "API Pricing" : "API Pricing"}</div>
              <div className="text-sm text-gray-300">{isDE ? "API-Zugang" : "API access"}</div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
