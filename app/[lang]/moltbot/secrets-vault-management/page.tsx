import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface PageProps { params: { lang: string }; }
const LANGS = ['de','en','es','fr','pt','it','ru','zh','ja','ko','ar','hi','tr','pl','nl'];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = params;
  return {
    title: 'Moltbot Secrets & Vault Management: HashiCorp Vault Setup 2024',
    description: 'Sicheres Secrets Management für Moltbot mit HashiCorp Vault. Dynamic Secrets, Secret Rotation, Vault Agent Injection und Environment Variable Best Practices.',
    keywords: ['moltbot secrets management','hashicorp vault','dynamic secrets','secret rotation','vault agent','env variables security'],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: { title: 'Moltbot Secrets & Vault Management: HashiCorp Vault Setup 2024', description: 'Sicheres Secrets Management für Moltbot mit HashiCorp Vault.', type: 'article', url: `https://clawguru.org/${lang}/moltbot/secrets-vault-management` },
    alternates: { canonical: `https://clawguru.org/${lang}/moltbot/secrets-vault-management`, languages: Object.fromEntries(LANGS.map(l => [l, `https://clawguru.org/${l}/moltbot/secrets-vault-management`])) },
    robots: 'index, follow',
  };
}

export default function MoltbotSecretsVaultPage({ params }: PageProps) {
  const { lang } = params;
  if (!LANGS.includes(lang)) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 text-sm">
          <strong>"Not a Pentest" Trust-Anker</strong>: Secrets Management schützt kritische Zugangsdaten. Keine Angriffswerkzeuge.
        </div>
        <h1 className="text-4xl font-bold mb-4">Moltbot Secrets &amp; Vault Management</h1>
        <p className="text-lg text-gray-600 mb-8">Keine Hardcoded Secrets mehr — zentrales, rotierendes Secrets Management für Moltbot mit HashiCorp Vault und dynamischen Credentials.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">🔐 Secrets Anti-Patterns (vermeiden!)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <h3 className="font-bold text-red-800 mb-2">❌ NIEMALS SO!</h3>
              <div className="bg-gray-900 text-red-400 p-3 rounded font-mono text-xs">
                <pre>{`// ❌ Hardcoded secrets
const db = new Pool({
  password: 'sup3r_s3cr3t_pw!'
});

// ❌ In Code committed
const API_KEY = 'sk_live_abc123';

// ❌ In .env committed
DATABASE_PASSWORD=mypassword123`}</pre>
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <h3 className="font-bold text-green-800 mb-2">✅ RICHTIG SO!</h3>
              <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-xs">
                <pre>{`// ✅ Aus Environment Variable
const db = new Pool({
  password: process.env.DB_PASSWORD
});

// ✅ Vault-injected zur Runtime
// process.env.API_KEY = vault.read()

// ✅ .env.local (gitignored!)
# .gitignore: .env*.local`}</pre>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">🏛️ HashiCorp Vault Integration</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
            <pre>{`// moltbot/lib/vault-client.ts
import vault from 'node-vault';

const vaultClient = vault({
  apiVersion: 'v1',
  endpoint: process.env.VAULT_ADDR,
  token: process.env.VAULT_TOKEN,
});

// Dynamic Database Credentials (rotieren automatisch!)
export async function getDatabaseCredentials() {
  const { data } = await vaultClient.read('database/creds/moltbot-role');
  return {
    username: data.username,  // Temporärer User (TTL: 1h)
    password: data.password,  // Auto-rotiert
    host: process.env.DB_HOST,
    database: 'moltbot_prod',
  };
}

// Application Secrets mit Lease
export async function getAppSecret(secretPath: string) {
  const { data } = await vaultClient.read('secret/data/' + secretPath);
  return data.data;
}

// Secret Rotation (täglich via Cron)
export async function rotateAppSecrets() {
  await vaultClient.write('sys/rotate');
  console.log('[Vault] Secrets rotiert:', new Date().toISOString());
}`}</pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">🔄 Secrets Rotation Policy</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead><tr className="bg-gray-800 text-white"><th className="p-3 text-left">Secret Type</th><th className="p-3 text-left">Rotation Interval</th><th className="p-3 text-left">Methode</th><th className="p-3 text-left">Automation</th></tr></thead>
              <tbody>
                {[
                  ['DB Passwords', '24 Stunden', 'Vault Dynamic Creds', '✅ Vollautomatisch'],
                  ['API Keys', '90 Tage', 'Key Rotation API', '⚠️ Halb-automatisch'],
                  ['JWT Secret', '30 Tage', 'Vault KV Secret', '✅ Vollautomatisch'],
                  ['SSL Zertifikate', 'Jährlich', "Let's Encrypt", '✅ Vollautomatisch'],
                  ['OAuth Client Secret', '180 Tage', 'Provider API', '⚠️ Manuell'],
                  ['Admin Tokens', '7 Tage', 'Vault TTL', '✅ Vollautomatisch'],
                ].map(([type, interval, method, auto]) => (
                  <tr key={type} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{type}</td>
                    <td className="p-3 font-mono text-xs">{interval}</td>
                    <td className="p-3 text-sm text-gray-600">{method}</td>
                    <td className="p-3 text-sm">{auto}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">🔗 Weiterführende Ressourcen</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="/securitycheck" className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100"><div className="font-semibold text-blue-600">🛡️ Security Check</div><div className="text-sm text-gray-600">Secrets Scan</div></a>
            <a href="/runbooks" className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100"><div className="font-semibold text-blue-600">📚 Vault Runbooks</div><div className="text-sm text-gray-600">Secrets Playbooks</div></a>
            <a href="/openclaw" className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100"><div className="font-semibold text-blue-600">🔓 OpenClaw</div><div className="text-sm text-gray-600">Secrets Framework</div></a>
            <a href="/solutions" className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100"><div className="font-semibold text-blue-600">🏢 Enterprise</div><div className="text-sm text-gray-600">Managed Vault</div></a>
          </div>
        </section>
      </div>
    </div>
  );
}
