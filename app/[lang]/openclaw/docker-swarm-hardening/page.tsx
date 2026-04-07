import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface PageProps { params: { lang: string }; }
const LANGS = ['de','en','es','fr','pt','it','ru','zh','ja','ko','ar','hi','tr','pl','nl'];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = params;
  return {
    title: 'OpenClaw Docker Swarm Hardening: Production Security Guide 2024',
    description: 'Docker Swarm Hardening für OpenClaw. Secrets Management, TLS Encryption, Network Isolation, Image Scanning und Service Mesh Security. Production-ready Swarm Konfiguration.',
    keywords: ['openclaw docker swarm','docker swarm hardening','swarm secrets','docker network isolation','container security production'],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: { title: 'OpenClaw Docker Swarm Hardening 2024', description: 'Docker Swarm Hardening für OpenClaw.', type: 'article', url: `https://clawguru.org/${lang}/openclaw/docker-swarm-hardening` },
    alternates: { canonical: `https://clawguru.org/${lang}/openclaw/docker-swarm-hardening`, languages: Object.fromEntries(LANGS.map(l => [l, `https://clawguru.org/${l}/openclaw/docker-swarm-hardening`])) },
    robots: 'index, follow',
  };
}

export default function OpenClawDockerSwarmPage({ params }: PageProps) {
  const { lang } = params;
  if (!LANGS.includes(lang)) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 text-sm">
          <strong>"Not a Pentest" Trust-Anker</strong>: Docker Swarm Hardening sichert eigene Container-Infrastrukturen ab. Keine Angriffswerkzeuge.
        </div>
        <h1 className="text-4xl font-bold mb-4">OpenClaw Docker Swarm Hardening</h1>
        <p className="text-lg text-gray-600 mb-8">Production-ready Security für Docker Swarm — von Secrets Management über Network Isolation bis hin zu Image Scanning und Runtime Security.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">🐋 Gehärtetes Docker Swarm Compose</h2>
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
          <h2 className="text-2xl font-semibold mb-4">🔒 Swarm Secrets Initialisierung</h2>
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
          <h2 className="text-2xl font-semibold mb-4">🔗 Weiterführende Ressourcen</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="/securitycheck" className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100"><div className="font-semibold text-blue-600">🛡️ Security Check</div><div className="text-sm text-gray-600">Container Check</div></a>
            <a href="/runbooks" className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100"><div className="font-semibold text-blue-600">📚 Docker Runbooks</div><div className="text-sm text-gray-600">Container Guides</div></a>
            <a href="/openclaw" className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100"><div className="font-semibold text-blue-600">🔓 OpenClaw</div><div className="text-sm text-gray-600">Framework</div></a>
            <a href="/solutions" className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100"><div className="font-semibold text-blue-600">🏢 Enterprise</div><div className="text-sm text-gray-600">Managed Swarm</div></a>
          </div>
        </section>
      </div>
    </div>
  );
}
