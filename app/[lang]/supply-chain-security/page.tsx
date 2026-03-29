import type { Metadata } from "next";
import { SUPPORTED_LOCALES, type Locale, localeAlternates } from "@/lib/i18n";
import { BASE_URL } from "@/lib/config";

export const dynamic = "force-static";
export const revalidate = 86400;

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale)
    ? params.lang
    : "de") as Locale;

  return {
    title: locale === "de" 
      ? "Supply Chain Security 2026 | SBOM, SLSA & Provenance"
      : "Supply Chain Security 2026 | SBOM, SLSA & Provenance",
    description: locale === "de"
      ? "Supply Chain Security: SBOM Generation, SLSA Levels, Sigstore Signing & Provenance Verification."
      : "Supply chain security: SBOM generation, SLSA levels, Sigstore signing & provenance verification.",
    keywords: [
      "Supply chain security",
      "SBOM generation",
      "SLSA framework",
      "Software provenance",
      "Sigstore signing",
      "Cosign security",
      "Software supply chain",
      "Artifact signing",
      "Dependency security",
      "Secure software factory",
    ],
    alternates: {
      canonical: `/${locale}/supply-chain-security`,
      ...localeAlternates(`/${locale}/supply-chain-security`),
    },
    openGraph: {
      title: "Supply Chain Security 2026: SBOM & SLSA",
      description: "Secure your software supply chain with SBOM, SLSA, Sigstore & provenance verification.",
      type: "article",
      url: `${BASE_URL}/${locale}/supply-chain-security`,
    },
  };
}

export default async function SupplyChainSecurityPage({
  params,
}: {
  params: { lang: string };
}) {
  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-600 via-orange-600 to-red-700 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Supply Chain Security</h1>
            <p className="text-2xl text-amber-200 mb-4">SBOM, SLSA & Provenance 2026</p>
            <p className="text-xl text-white/80 mb-8">SBOM Generation, SLSA Levels, Sigstore Signing & Provenance Verification</p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">SBOM</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">SLSA</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Sigstore</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Provenance</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Software Supply Chain Security</h2>
            <p className="text-slate-700 text-lg mb-6">
              Supply Chain Attacks nehmen zu. Log4j, SolarWinds, Codecov haben gezeigt: Wir müssen Software-Herkunft verifizieren. SBOM, SLSA und Sigstore sind die Antwort.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <h3 className="font-semibold text-amber-900 mb-2">SBOM</h3>
                <ul className="text-sm text-amber-800 space-y-1">
                  <li>• SPDX Format</li>
                  <li>• CycloneDX</li>
                  <li>• Dependency Tree</li>
                  <li>• License Info</li>
                </ul>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                <h3 className="font-semibold text-orange-900 mb-2">SLSA</h3>
                <ul className="text-sm text-orange-800 space-y-1">
                  <li>• Level 1-4</li>
                  <li>• Provenance</li>
                  <li>• Build Integrity</li>
                  <li>• Source Control</li>
                </ul>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <h3 className="font-semibold text-red-900 mb-2">Sigstore</h3>
                <ul className="text-sm text-red-800 space-y-1">
                  <li>• Cosign</li>
                  <li>• Rekor</li>
                  <li>• Fulcio</li>
                  <li>• Keyless Signing</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">SBOM Generation & Distribution</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# SBOM Generation Tools

## Syft - Generate SBOMs
# Install
curl -sSfL https://raw.githubusercontent.com/anchore/syft/main/install.sh | sh -s -- -b /usr/local/bin

# Generate SBOM for container
syft packages myapp:latest -o spdx-json > sbom.spdx.json
syft packages myapp:latest -o cyclonedx-json > sbom.cyclone.json
syft packages myapp:latest -o syft-json > sbom.syft.json

# Generate for filesystem
syft packages dir:/path/to/project -o spdx-json > sbom.json

# Generate for Git repo
syft packages https://github.com/myorg/myapp -o spdx-json > sbom.json

## Trivy - Generate SBOM
trivy image --format cyclonedx -o sbom.json myapp:latest
trivy filesystem --format spdx-json -o sbom.json /path/to/project

## Docker SBOM (Experimental)
docker sbom myapp:latest --format spdx-json > sbom.json

# SBOM Signing with Cosign
cosign sign-blob sbom.json --bundle sbom.json.cosign.bundle

# Verify SBOM Signature
cosign verify-blob --bundle sbom.json.cosign.bundle sbom.json

## GitHub Actions - SBOM Generation
# .github/workflows/sbom.yml
name: Generate SBOM

on:
  push:
    branches: [main]

jobs:
  sbom:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Generate SBOM with Syft
        uses: anchore/sbom-action@v0
        with:
          image: "myapp:${{ github.sha }}"
          format: spdx-json
          output-file: sbom.spdx.json
      
      - name: Sign SBOM with Cosign
        uses: sigstore/cosign-installer@v3
      - run: |
          cosign sign-blob sbom.spdx.json \
            --output-signature sbom.sig \
            --output-certificate sbom.cert
        env:
          COSIGN_EXPERIMENTAL: 1
      
      - name: Upload to Release
        uses: softprops/action-gh-release@v1
        with:
          files: |
            sbom.spdx.json
            sbom.sig
            sbom.cert

## SBOM Registry Integration
# Push SBOM to OCI Registry
cosign upload blob -f sbom.json ghcr.io/myorg/myapp/sbom:latest

# Download and verify
oras pull ghcr.io/myorg/myapp/sbom:latest`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">SLSA - Supply Chain Levels</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# SLSA Framework Implementation

## SLSA Level 1 - Provenance
# Use GitHub Actions with provenance

# .github/workflows/slsa.yml
name: SLSA Provenance

on:
  push:
    tags:
      - 'v*'

permissions:
  id-token: write
  contents: write
  actions: read

jobs:
  build:
    runs-on: ubuntu-latest
    outputs:
      hashes: ${{ steps.hash.outputs.hashes }}
    steps:
      - uses: actions/checkout@v4
      
      - name: Build Artifact
        run: |
          make build
          echo "artifact=myapp-${{ github.ref_name }}.tar.gz" >> $GITHUB_OUTPUT
      
      - name: Generate Hash
        id: hash
        run: |
          cd dist
          echo "hashes=$(sha256sum *.tar.gz | base64 -w0)" >> $GITHUB_OUTPUT
      
      - name: Upload Artifact
        uses: actions/upload-artifact@v4
        with:
          name: build-artifacts
          path: dist/*.tar.gz

  provenance:
    needs: build
    permissions:
      actions: read
      id-token: write
      contents: write
    uses: slsa-framework/slsa-github-generator/.github/workflows/generator_generic_slsa3.yml@v1.10.0
    with:
      base64-subjects: "${{ needs.build.outputs.hashes }}"
      upload-assets: true

## SLSA Level 3 - Hardened Build
# Use SLSA-compliant builder

jobs:
  build-slsa3:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: read
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Full history for provenance
      
      - name: Hardened Build
        uses: slsa-framework/slsa-github-generator/.github/workflows/builder_go_slsa3.yml@v1.10.0
        with:
          go-version: "1.21"
          config-file: .slsa-goreleaser.yml

# SLSA Provenance Verification
# Download and verify provenance

# Download artifact + provenance
curl -L -o myapp.tar.gz https://github.com/org/repo/releases/download/v1.0.0/myapp.tar.gz
curl -L -o provenance.intoto.jsonl https://github.com/org/repo/releases/download/v1.0.0/myapp.tar.gz.intoto.jsonl

# Verify with slsa-verifier
slsa-verifier verify-artifact \
  --provenance-path provenance.intoto.jsonl \
  --source-uri github.com/org/repo \
  --source-tag v1.0.0 \
  myapp.tar.gz

## SLSA Policy Enforcement (OPA)
# slsa.rego - OPA Policy

package slsa

import future.keywords.if
import future.keywords.in

# Require SLSA Level 2 minimum
allow if {
    input.slsa_level >= 2
}

# Require specific builder
trusted_builders = [
    "https://github.com/slsa-framework/slsa-github-generator/.github/workflows/generator_generic_slsa3.yml@refs/tags/v1.10.0"
]

allow if {
    input.builder.id in trusted_builders
}

# Deny if no provenance
deny["No SLSA provenance found"] {
    not input.provenance
}

# Deny if source is not GitHub
deny["Source must be from GitHub"] {
    not startswith(input.source.uri, "https://github.com/")
}

# Verify in CI
opa eval --data slsa.rego --input provenance.json "data.slsa.allow"`}
              </pre>
            </div>
          </section>

          <section className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Supply Chain Security Assessment</h2>
            <a href="/check" className="inline-block px-6 py-3 bg-white text-amber-600 rounded-lg font-semibold">Assessment Starten</a>
          </section>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: "Supply Chain Security 2026",
        author: { "@type": "Organization", name: "ClawGuru", url: BASE_URL },
        datePublished: "2026-03-29",
      })}} />
    </main>
  );
}
