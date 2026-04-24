import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/ai-agent-secure-communication"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = pick(isDE, "AI Agent Secure Communication: KI-Agenten-Secure-Communication | ClawGuru Moltbot", "AI Agent Secure Communication: AI Agent Secure Communication | ClawGuru Moltbot")
  const description = pick(isDE, "KI-Agenten-Secure-Communication: TLS Encryption, Message Signing, Mutual Authentication und Secure Channel Establishment für KI-Agenten-Kommunikation.", "AI agent secure communication: TLS encryption, message signing, mutual authentication and secure channel establishment for AI agent communication.")
  return {
    title, description,
    keywords: ["ai agent secure communication", "agent tls encryption", "message signing", "mutual authentication", "secure channel", "moltbot communication"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const CONTROLS = [
  { id: "ASC-1", title: "TLS Encryption", desc: "Encrypt all agent communication using TLS 1.3. Use strong cipher suites and proper certificate management.", code: `# Moltbot agent TLS encryption:
tls_encryption:
  enabled: true

  # TLS version:
  version: "TLSv1.3"
  # TLS 1.3 provides improved security and performance
  # Requires: TLS 1.3-compatible clients and servers

  # Cipher suites:
  cipher_suites:
    # Use strong cipher suites only
    # TLS 1.3 cipher suites are predefined and secure
    # No need to configure manually
    # TLS 1.3 removes weak cipher suites

  # Certificate management:
  certificates:
    # Use valid certificates from trusted CA
    # Or use self-signed certificates with pinning
    # Rotate: certificates before expiration
    # Monitor: certificate expiration alerts

  # Certificate pinning:
  pinning:
    # Pin certificates to prevent MITM attacks
    # Store: certificate hash or public key
    # Validate: on every connection
    enabled: true` },
  { id: "ASC-2", title: "Message Signing", desc: "Sign all agent messages to ensure authenticity and integrity. Use digital signatures with strong algorithms.", code: `# Moltbot agent message signing:
message_signing:
  enabled: true

  # Signing algorithm:
  algorithm: "Ed25519"
  # Ed25519 provides strong security and performance
  # Alternative: RSA-4096, ECDSA-P384

  # Key management:
  keys:
    # Generate: unique signing key per agent
    # Store: in secure key store (HSM or KMS)
    # Rotate: periodically (90 days)
    # Backup: securely encrypted backup

  # Signing process:
  signing:
    # Sign: every agent message before sending
    # Include: message hash, timestamp, agent ID
    # Verify: on receipt before processing

  # Key revocation:
  revocation:
    # Revoke: compromised keys immediately
    # Maintain: key revocation list (CRL)
    # Distribute: CRL to all agents` },
  { id: "ASC-3", title: "Mutual Authentication", desc: "Implement mutual TLS (mTLS) for agent communication. Both client and server authenticate each other with certificates.", code: `# Moltbot agent mutual authentication:
mutual_authentication:
  enabled: true

  # Mutual TLS (mTLS):
  mtls:
    enabled: true
    # Both client and server present certificates
    # Client: authenticates server with server certificate
    # Server: authenticates client with client certificate

  # Client certificates:
  client_certs:
    # Issue: unique client certificate per agent
    # Validate: server validates client certificate
    # Revoke: compromised client certificates
    # Rotate: client certificates periodically

  # Server certificates:
  server_certs:
    # Issue: server certificate from trusted CA
    # Validate: client validates server certificate
    # Rotate: server certificates before expiration
    # Monitor: certificate expiration alerts

  # Certificate authorities:
  ca:
    # Use: private CA for internal agent communication
    # Or use: public CA for external agent communication
    # Maintain: CA root certificate securely` },
  { id: "ASC-4", title: "Secure Channel Establishment", desc: "Establish secure channels between agents using key exchange protocols. Use perfect forward secrecy (PFS).", code: `# Moltbot agent secure channel establishment:
secure_channel:
  enabled: true

  # Key exchange protocol:
  key_exchange:
    # Use: ECDHE for key exchange
    # Provides: perfect forward secrecy (PFS)
    # Ephemeral: keys are generated per session
    # Compromise: of long-term keys does not compromise past sessions

  # Session keys:
  session_keys:
    # Generate: unique session key per connection
    # Lifetime: limited session key lifetime (1 hour)
    # Rotate: session keys periodically
    # Derive: from key exchange

  # Channel verification:
  verification:
    # Verify: channel establishment parameters
    # Check: cipher suite, TLS version, certificate
    # Block: weak or insecure parameters
    # Alert: on verification failure` },
]

const FAQ = [
  { q: "What is the difference between TLS encryption and message signing?", a: "TLS encryption protects the confidentiality and integrity of communication in transit. It encrypts the entire communication channel between agents. Message signing provides authenticity and integrity at the message level. Each message is individually signed with the sender's private key, and the signature is verified with the sender's public key. Both are necessary: TLS encryption protects against eavesdropping and tampering in transit. Message signing protects against message forgery and replay attacks. Example: TLS encryption encrypts the TCP stream. Message signing signs each message with Ed25519." },
  { q: "How does mutual TLS (mTLS) differ from standard TLS?", a: "Standard TLS only authenticates the server to the client. The client verifies the server's certificate, but the server does not verify the client. Mutual TLS (mTLS) authenticates both the server and the client. Both parties present certificates, and both verify each other's certificates. mTLS provides stronger security by ensuring that only authorised clients can connect to the server. This is particularly important for agent-to-agent communication, where both parties need to authenticate each other. mTLS requires certificate issuance and management for both clients and servers." },
  { q: "Why is perfect forward secrecy (PFS) important?", a: "Perfect forward secrecy (PFS) ensures that compromise of long-term keys does not compromise past sessions. With PFS, session keys are derived from ephemeral key exchange parameters (e.g., ECDHE). Even if the server's private key is compromised, an attacker cannot decrypt past sessions because the session keys were derived from ephemeral parameters that are discarded after the session. Without PFS, compromise of the server's private key allows decryption of all past sessions. PFS is achieved by using ephemeral key exchange protocols (ECDHE) instead of static key exchange (RSA)." },
  { q: "What are the risks of unencrypted agent communication?", a: "Unencrypted agent communication can lead to: 1) Eavesdropping — attackers can intercept and read agent messages. 2) Tampering — attackers can modify messages in transit. 3) Message forgery — attackers can forge messages from legitimate agents. 4) Replay attacks — attackers can replay old messages to cause unintended actions. 5) Man-in-the-middle (MITM) attacks — attackers can intercept and modify communication. 6) Credential theft — agents may transmit credentials in plaintext. Secure communication (TLS, mTLS, message signing) protects against these risks." },
]

export default function AiAgentSecureCommunicationPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Moltbot", item: `${SITE_URL}/${locale}/moltbot` },
      { "@type": "ListItem", position: 3, name: "AI Agent Secure Communication", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "Agent-Secure-Communication-Guide für eigene KI-Systeme.", "Agent secure communication guide for your own AI systems.")}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Moltbot · Batch 20</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">{pick(isDE, "AI Agent Secure Communication", "AI Agent Secure Communication")}</h1>
        <p className="text-lg text-gray-300 mb-6">
          {pick(isDE, "KI-Agenten ohne Secure Communication können abgehört und manipuliert werden — ohne Verschlüsselung bleiben Nachrichten ungeschützt. Vier Kontrollen: TLS Encryption, Message Signing, Mutual Authentication und Secure Channel Establishment.", "AI agents without secure communication can be eavesdropped on and manipulated — without encryption, messages remain unprotected. Four controls: TLS encryption, message signing, mutual authentication and secure channel establishment.")}
        </p>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "4 Agent-Secure-Communication-Kontrollen", "4 Agent Secure Communication Controls")}</h2>
          <div className="space-y-5">
            {CONTROLS.map((c) => (
              <div key={c.id} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-700">
                  <span className="font-mono text-xs text-cyan-400 bg-gray-900 px-2 py-0.5 rounded">{c.id}</span>
                  <span className="font-bold text-gray-100">{c.title}</span>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-300 mb-3">{c.desc}</p>
                  <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-xs overflow-x-auto"><pre>{c.code}</pre></div>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Häufige Fragen", "Frequently Asked Questions")}</h2>
          <div className="space-y-3">
            {FAQ.map((f, i) => (
              <details key={i} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <summary className="font-semibold text-gray-100 cursor-pointer">{f.q}</summary>
                <p className="mt-3 text-sm text-gray-300 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Weiterführende Ressourcen", "Further Resources")}</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href={`/${locale}/moltbot/ai-agent-communication-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Communication Security</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Channel-Security", "Channel security")}</div>
            </a>
            <a href={`/${locale}/moltbot/llm-data-encryption-in-transit`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Data Encryption in Transit</div>
              <div className="text-sm text-gray-300">{pick(isDE, "TLS-Overview", "TLS overview")}</div>
            </a>
            <a href={`/${locale}/moltbot/llm-data-encryption-at-rest`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Data Encryption at Rest</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Key-Management", "Key management")}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Security</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Communication-Overview", "Communication overview")}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
