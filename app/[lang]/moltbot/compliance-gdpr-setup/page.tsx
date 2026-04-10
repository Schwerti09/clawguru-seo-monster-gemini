import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from '@/lib/i18n'

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const { lang } = params;
  return {
    title: 'Moltbot GDPR Compliance Setup: Datenschutz Implementation 2024',
    description: 'GDPR-konforme Implementierung für Moltbot. Einwilligungsmanagement, Datenschutzerklärung, Right-to-Erasure, Data Minimization und Verzeichnis von Verarbeitungstätigkeiten (VVT).',
    keywords: ['moltbot gdpr compliance','datenschutz implementation','einwilligungsmanagement','data minimization','right to erasure','vvt'],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: { title: 'Moltbot GDPR Compliance Setup: Datenschutz Implementation 2024', description: 'GDPR-konforme Implementierung für Moltbot.', type: 'article', url: `https://clawguru.org/${lang}/moltbot/compliance-gdpr-setup` },
    alternates: buildLocalizedAlternates(lang as Locale, '/moltbot/compliance-gdpr-setup'),
    robots: 'index, follow',
  };
}

export default function MoltbotGdprCompliancePage({ params }: { params: { lang: string } }) {
  const { lang } = params;
  if (!SUPPORTED_LOCALES.includes(lang as Locale)) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Trust-Anker</strong>: GDPR Compliance dient dem Schutz personenbezogener Daten. Keine Angriffswerkzeuge.
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">Moltbot GDPR Compliance Setup</h1>
        <p className="text-lg text-gray-300 mb-8">Datenschutz by Design für Moltbot — GDPR-konforme Implementierung mit Einwilligungsmanagement, Data Minimization und Betroffenenrechten.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">📋 GDPR Compliance Checkliste</h2>
          <div className="space-y-2">
            {[
              { item: 'Verzeichnis von Verarbeitungstätigkeiten (VVT) erstellt', art: 'Art. 30', done: true },
              { item: 'Datenschutzerklärung aktuell und vollständig', art: 'Art. 13/14', done: true },
              { item: 'Einwilligungsmanagement implementiert', art: 'Art. 7', done: true },
              { item: 'Cookie Banner DSGVO-konform', art: 'Art. 5/6', done: true },
              { item: 'Recht auf Auskunft implementiert', art: 'Art. 15', done: true },
              { item: 'Recht auf Löschung implementiert', art: 'Art. 17', done: true },
              { item: 'Recht auf Datenübertragbarkeit', art: 'Art. 20', done: false },
              { item: 'Data Processing Agreements (DPA) mit Drittanbietern', art: 'Art. 28', done: true },
              { item: 'Datenpanne Prozess (72h Meldepflicht)', art: 'Art. 33', done: true },
              { item: 'Datenschutzfolgenabschätzung (DSFA)', art: 'Art. 35', done: false },
            ].map(({ item, art, done }) => (
              <div key={item} className={`flex items-start gap-3 p-3 rounded-lg ${done ? 'bg-green-900' : 'bg-amber-900'}`}>
                <span className="mt-0.5">{done ? '✅' : '⚠️'}</span>
                <div className="flex-1">
                  <span className="text-sm">{item}</span>
                  <span className="ml-2 text-xs text-gray-400 font-mono">{art}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🔐 Consent Management API</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
            <pre>{`// moltbot/lib/consent-manager.ts
import { db } from './db';

type ConsentPurpose = 'analytics' | 'marketing' | 'functional' | 'necessary';

interface ConsentRecord {
  customerId: string;
  purposes: Record<ConsentPurpose, boolean>;
  consentVersion: string;
  ipAddress: string;
  userAgent: string;
  givenAt: Date;
}

export async function recordConsent(consent: ConsentRecord) {
  await db.query(
    'INSERT INTO consent_log (customer_id, purposes, version, ip, user_agent, given_at) VALUES ($1, $2, $3, $4, $5, $6)',
    [consent.customerId, JSON.stringify(consent.purposes), consent.consentVersion, consent.ipAddress, consent.userAgent, consent.givenAt]
  );
}

export async function checkConsent(customerId: string, purpose: ConsentPurpose) {
  const result = await db.query(
    'SELECT purposes FROM consent_log WHERE customer_id = $1 ORDER BY given_at DESC LIMIT 1',
    [customerId]
  );
  if (!result.rows[0]) return false;
  return result.rows[0].purposes[purpose] === true;
}

export async function withdrawConsent(customerId: string) {
  await db.query(
    'INSERT INTO consent_log (customer_id, purposes, version, ip, user_agent, given_at) VALUES ($1, $2, $3, $4, $5, NOW())',
    [customerId, JSON.stringify({ analytics: false, marketing: false, functional: false, necessary: true }), 'withdrawal', '0.0.0.0', 'system']
  );
}`}</pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🔗 Weiterführende Ressourcen</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="/securitycheck" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🛡️ Security Check</div><div className="text-sm text-gray-300">GDPR Assessment</div></a>
            <a href="/runbooks" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">📚 Compliance Runbooks</div><div className="text-sm text-gray-300">GDPR Implementation</div></a>
            <a href="/oracle" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🔮 Oracle</div><div className="text-sm text-gray-300">Compliance Intelligence</div></a>
            <a href="/solutions" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🏢 Enterprise</div><div className="text-sm text-gray-300">Managed GDPR</div></a>
          </div>
        </section>
      </div>
    </div>
  );
}
