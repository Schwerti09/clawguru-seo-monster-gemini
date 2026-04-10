import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from '@/lib/i18n'

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const { lang } = params;
  return {
    title: 'Moltbot Data Loss Prevention: DLP & Data Classification 2024',
    description: 'Data Loss Prevention für Moltbot. DLP-Implementierung, Datenklassifizierung, Endpoint-DLP, Network-DLP und automatisierte Erkennung sensibler Daten.',
    keywords: ['moltbot data loss prevention','dlp','data classification','endpoint dlp','network dlp','sensitive data detection'],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: { title: 'Moltbot Data Loss Prevention 2024', description: 'DLP und Data Classification für Moltbot.', type: 'article', url: `https://clawguru.org/${lang}/moltbot/data-loss-prevention` },
    alternates: buildLocalizedAlternates(lang as Locale, '/moltbot/data-loss-prevention'),
    robots: 'index, follow',
  };
}

export default function MoltbotDlpPage({ params }: { params: { lang: string } }) {
  const { lang } = params;
  if (!SUPPORTED_LOCALES.includes(lang as Locale)) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Trust-Anker</strong>: DLP schützt eigene Daten vor unbeabsichtigter Offenlegung. Keine Angriffswerkzeuge.
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">Moltbot Data Loss Prevention</h1>
        <p className="text-lg text-gray-300 mb-8">43% aller Security-Vorfälle betreffen Datenlecks. DLP mit automatisierter Klassifizierung und Policy-Enforcement ist Pflicht.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Data Classification Matrix</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead><tr className="bg-gray-800 text-white"><th className="p-3 text-left">Klasse</th><th className="p-3 text-left">Beschreibung</th><th className="p-3 text-left">Beispiele</th><th className="p-3 text-left">Schutzmaßnahmen</th></tr></thead>
              <tbody>
                {[
                  ['Confidential', 'Höchste Vertraulichkeit', 'API-Keys, Passwörter, Private Keys', 'Verschlüsselung, Access-Control, DLP-Block'],
                  ['Internal', 'Intern vertraulich', 'Dokumente, E-Mails, Reports', 'Verschlüsselung, Logging, Monitoring'],
                  ['Public', 'Öffentlich', 'Marketing, Blog, Dokumentation', 'Keine besonderen Maßnahmen'],
                ].map(([cls, desc, examples, protection]) => (
                  <tr key={cls} className="border-b hover:bg-gray-800">
                    <td className="p-3 font-medium">{cls}</td>
                    <td className="p-3 text-sm">{desc}</td>
                    <td className="p-3 text-sm">{examples}</td>
                    <td className="p-3 text-sm">{protection}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">DLP Policy Engine</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
            <pre>{`// DLP Policy Engine für Moltbot
const DLP_PATTERNS = {
  api_key: /(?:sk_|pk_|sk-)[a-zA-Z0-9]{20,}/g,
  email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  credit_card: /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3[0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})\b/g,
  ssn: /\b\d{3}-\d{2}-\d{4}\b/g,
};

export function scanForSensitiveData(text) {
  const findings = [];
  
  for (const [type, pattern] of Object.entries(DLP_PATTERNS)) {
    const matches = text.match(pattern);
    if (matches) {
      findings.push({ type, count: matches.length, matches });
    }
  }
  
  return findings;
}

// Middleware für API-Endpoints
export function dlpMiddleware(req, res, next) {
  const body = JSON.stringify(req.body);
  const findings = scanForSensitiveData(body);
  
  if (findings.some(f => f.type === 'api_key')) {
    return res.status(403).json({ error: 'Sensitive data detected' });
  }
  
  next();
}`}</pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Endpoint DLP Integration</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
            <pre>{`// Endpoint DLP Agent für Moltbot
class EndpointDLP {
  constructor() {
    this.policies = new Map();
    this.setupFileWatcher();
  }
  
  setupFileWatcher() {
    const watcher = chokidar.watch('/home/user/Documents', {
      ignored: /(^|[\/\\])\../,
      persistent: true
    });
    
    watcher.on('change', (path) => {
      this.scanFile(path);
    });
  }
  
  async scanFile(filePath) {
    const content = await fs.readFile(filePath, 'utf-8');
    const findings = scanForSensitiveData(content);
    
    if (findings.length > 0) {
      await this.handleDataLeak(filePath, findings);
    }
  }
  
  async handleDataLeak(filePath, findings) {
    // Block Upload, Alert Admin, Log Incident
    await this.blockFileAccess(filePath);
    await this.sendAlert({
      type: 'DLP_VIOLATION',
      file: filePath,
      findings,
      timestamp: new Date().toISOString()
    });
  }
}

// Deployment
const dlp = new EndpointDLP();`}</pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Resources</h2>
          <ul className="list-disc pl-4">
            <li><a href="https://clawguru.org/de/security/data-loss-prevention" target="_blank" rel="noopener noreferrer">Data Loss Prevention (DLP) - Eine umfassende Anleitung</a></li>
            <li><a href="https://clawguru.org/de/security/data-classification" target="_blank" rel="noopener noreferrer">Data Classification - Eine umfassende Anleitung</a></li>
            <li><a href="https://clawguru.org/de/security/endpoint-dlp" target="_blank" rel="noopener noreferrer">Endpoint DLP - Eine umfassende Anleitung</a></li>
          </ul>
        </section>
      </div>
    </div>
  );
}