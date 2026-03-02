import Image from "next/image"
import Container from "@/components/shared/Container"

export const metadata = {
  title: "Affiliate Assets | ClawGuru",
  description: "Banner und Zertifikat Generator für ClawGuru Affiliates.",
}

export default function AffiliateAssetsPage() {
  const bannerUrl = "/api/affiliate/assets?type=banner&name=ClawGuru%20Partner"
  const certificateUrl = "/api/affiliate/assets?type=certificate&name=ClawGuru%20Partner"

  return (
    <Container>
      <div className="py-16 max-w-4xl mx-auto">
        <div className="mb-2 text-xs uppercase tracking-widest text-gray-500">Affiliate Power</div>
        <h1 className="text-4xl font-black mb-3">Asset Generator</h1>
        <p className="text-gray-400 mb-10">
          Lade Banner oder Zertifikate mit deinem Affiliate-Namen. Perfekt für Websites, Newsletter oder Social Posts.
        </p>
        <p className="text-xs text-gray-500 mb-8">
          Tipp: Halte den Namen möglichst kurz (≤ 48 Zeichen), damit breite Buchstaben nicht abgeschnitten werden.
        </p>

        <div className="space-y-10">
          <section className="rounded-3xl border border-gray-800 bg-black/30 p-6">
            <h2 className="text-2xl font-black mb-4">Banner</h2>
            <Image
              src={bannerUrl}
              alt="ClawGuru affiliate banner"
              width={1200}
              height={628}
              className="rounded-2xl border border-gray-800"
            />
            <div className="mt-4 flex gap-3 flex-wrap">
              <a
                className="px-4 py-2 rounded-xl font-bold text-sm bg-brand-cyan text-black"
                href={bannerUrl}
                target="_blank"
                rel="noreferrer"
              >
                Banner öffnen →
              </a>
              <code className="text-xs text-gray-500 break-all">{bannerUrl}</code>
            </div>
          </section>

          <section className="rounded-3xl border border-gray-800 bg-black/30 p-6">
            <h2 className="text-2xl font-black mb-4">Zertifikat</h2>
            <Image
              src={certificateUrl}
              alt="ClawGuru affiliate certificate"
              width={1200}
              height={850}
              className="rounded-2xl border border-gray-800"
            />
            <div className="mt-4 flex gap-3 flex-wrap">
              <a
                className="px-4 py-2 rounded-xl font-bold text-sm bg-brand-cyan text-black"
                href={certificateUrl}
                target="_blank"
                rel="noreferrer"
              >
                Zertifikat öffnen →
              </a>
              <code className="text-xs text-gray-500 break-all">{certificateUrl}</code>
            </div>
          </section>
        </div>
      </div>
    </Container>
  )
}
