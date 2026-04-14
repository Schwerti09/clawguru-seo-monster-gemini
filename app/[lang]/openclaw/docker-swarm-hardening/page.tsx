import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from '@/lib/i18n'

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const { lang } = params;
  return {
    title: 'OpenClaw Docker Swarm Hardening: Production Security Guide 2024',
    description: 'Docker Swarm Hardening für OpenClaw. Secrets Management, TLS Encryption, Network Isolation, Image Scanning und Service Mesh Security. Production-ready Swarm Konfiguration.',
    keywords: ['openclaw docker swarm','docker swarm hardening','swarm secrets','docker network isolation','container security production'],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: {
      images: ["/og-image.png"], title: 'OpenClaw Docker Swarm Hardening 2024', description: 'Docker Swarm Hardening für OpenClaw.', type: 'article', url: `https://clawguru.org/${lang}/openclaw/docker-swarm-hardening` },
    alternates: buildLocalizedAlternates(lang as Locale, '/openclaw/docker-swarm-hardening'),
    robots: 'index, follow',
  };
}

export default function OpenClawDockerSwarmPage({ params }: { params: { lang: string } }) {
  const { lang } = params;
  if (!SUPPORTED_LOCALES.includes(lang as Locale)) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Trust-Anker</strong>: Docker Swarm Hardening sichert eigene Container-Infrastrukturen ab. Keine Angriffswerkzeuge.
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">OpenClaw Docker Swarm Hardening</h1>
        <p className="text-lg text-gray-300 mb-8">Production-ready Security für Docker Swarm — von Secrets Management über Network Isolation bis hin zu Image Scanning und Runtime Security.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🐋 Gehärtetes Docker Swarm Compose</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
            <pre>{`# docker-stack.yml — Gehärtete OpenClaw Produktion
version: '3.9'

services:
  openclaw:
    image: ghcr.io/clawguru/openclaw:latest
    deploy:
      replicas: 3
      update_config:
        parallelism: 1
        delay: 30s
        failure_action: rollback
      restart_policy:
        condition: on-failure
        max_attempts: 3
    secrets:
      - db_password
      - jwt_secret
      - api_key
    networks:
      - frontend
      - backend
    security_opt:
      - no-new-privileges:true
    read_only: true
    tmpfs:
      - /tmp
    user: "1001:1001"  # Non-root user
    environment:
      NODE_ENV: production
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  postgres:
    image: postgres:16-alpine
    networks:
      - backend  # Nur backend, NICHT frontend
    secrets:
      - db_password
    volumes:
      - pgdata:/var/lib/postgresql/data
    deploy:
      placement:
        constraints: [node.role == manager]

networks:
  frontend:
    driver: overlay
    attachable: false
  backend:
    driver: overlay
    internal: true  # Kein Internet-Zugriff

secrets:
  db_password:
    external: true
  jwt_secret:
    external: true
  api_key:
    external: true

volumes:
  pgdata:
    driver: local`}</pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🔒 Swarm Secrets Initialisierung</h2>
          <div className="bg-gray-900 text-blue-400 p-4 rounded-lg font-mono text-sm">
            <pre>{`# Secrets sicher erstellen (niemals in Datei speichern)
echo "$(openssl rand -base64 32)" | docker secret create db_password -
echo "$(openssl rand -base64 64)" | docker secret create jwt_secret -
echo "$(openssl rand -hex 32)" | docker secret create api_key -

# Secrets auflisten (Werte nicht sichtbar)
docker secret ls

# Stack deployen
docker stack deploy -c docker-stack.yml openclaw

# Swarm TLS aktivieren (Standard bei Init)
docker swarm init --advertise-addr ETH0_IP

# Autolock aktivieren (schützt Swarm Keys)
docker swarm update --autolock=true`}</pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🔗 Weiterführende Ressourcen</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="/securitycheck" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🛡️ Security Check</div><div className="text-sm text-gray-300">Container Check</div></a>
            <a href="/runbooks" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">📚 Docker Runbooks</div><div className="text-sm text-gray-300">Container Guides</div></a>
            <a href="/openclaw" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🔓 OpenClaw</div><div className="text-sm text-gray-300">Framework</div></a>
            <a href="/solutions" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🏢 Enterprise</div><div className="text-sm text-gray-300">Managed Swarm</div></a>
          </div>
        </section>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "Ist dieser Guide ein Penetrationstest?", acceptedAnswer: { "@type": "Answer", text: "Nein. Dieser Guide dient ausschlielich zur Absicherung eigener Systeme. Kein Angriffs-Tool, keine illegalen Aktivitten." } },
              { "@type": "Question", name: "Was ist OpenClaw?", acceptedAnswer: { "@type": "Answer", text: "OpenClaw ist das Open-Source Self-Hosting Security Framework von ClawGuru mit Executable Runbooks, Security-Check und Compliance-Dashboard." } },
              { "@type": "Question", name: "Wo finde ich die Runbooks?", acceptedAnswer: { "@type": "Answer", text: "Alle Runbooks sind unter /runbooks abrufbar. Jeder Befund im Security-Check enthlt einen direkten Link zum passenden Runbook." } }
            ]
          },
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "OpenClaw Security Guide",
            description: "Self-Hosted Security Hardening mit OpenClaw Executable Runbooks.",
            url: "https://clawguru.org/de/openclaw"
          },
          {
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "Docker Swarm für OpenClaw absichern",
            description: "Production-ready Docker Swarm Hardening: Secrets, TLS, Network Isolation und Image Scanning.",
            totalTime: "PT90M",
            step: [
              { "@type": "HowToStep", name: "Swarm mit TLS initialisieren", text: "docker swarm init mit --autolock=true. Manager-Token sicher aufbewahren." },
              { "@type": "HowToStep", name: "Docker Secrets einrichten", text: "echo 'mypassword' | docker secret create db_password -. Niemals Secrets als ENV-Variablen in compose-Files." },
              { "@type": "HowToStep", name: "Netzwerk-Isolation konfigurieren", text: "Overlay-Netzwerke pro Service-Gruppe erstellen. --internal Flag für interne Services ohne externen Zugang." },
              { "@type": "HowToStep", name: "Image Scanning aktivieren", text: "Trivy oder Docker Scout vor jedem Deploy ausführen: trivy image myimage:latest --exit-code 1 --severity HIGH,CRITICAL." },
              { "@type": "HowToStep", name: "Runtime-Security konfigurieren", text: "seccomp und AppArmor Profile für Container aktivieren. --cap-drop=ALL, nur benötigte Capabilities explizit hinzufügen." },
            ]
          }
        ]) }} />
      </div>
    </div>
  );
}
