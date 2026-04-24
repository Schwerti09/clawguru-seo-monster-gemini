import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from '@/lib/i18n'

// Page queries Neon at render time; can't prerender during build.
export const dynamic = "force-dynamic"

export async function generateStaticParams() {
  return []
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {

  const { lang } = params;

  return {

    title: 'Moltbot Identity Governance & IAM: RBAC & Least Privilege 2024',

    description: 'Identity Governance für Moltbot. RBAC-Implementierung, Least Privilege, Privileged Access Management (PAM), Access Reviews und automatisierte Berechtigungsbereinigung.',

    keywords: ['moltbot identity governance','iam rbac','least privilege','privileged access management','access review','user provisioning'],

    authors: [{ name: 'ClawGuru Security Team' }],

    openGraph: {
      images: ["/og-image.png"], title: 'Moltbot Identity Governance & IAM 2024', description: 'IAM und RBAC für Moltbot.', type: 'article', url: `https://clawguru.org/${lang}/moltbot/identity-governance-iam` },

    alternates: buildLocalizedAlternates(lang as Locale, '/moltbot/identity-governance-iam'),

    robots: 'index, follow',

  };

}

export default function MoltbotIamPage({ params }: { params: { lang: string } }) {

  const { lang } = params;

  if (!SUPPORTED_LOCALES.includes(lang as Locale)) notFound();

  return (

    <div className="container mx-auto px-4 py-8">

      <div className="max-w-4xl mx-auto">

        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">

          <strong className="text-amber-100">"Not a Pentest" Trust-Anker</strong>: Identity Governance sichert Zugriffe auf eigene Systeme ab. Keine Angriffswerkzeuge.

        </div>

        <h1 className="text-4xl font-bold mb-4 text-gray-100">Moltbot Identity Governance &amp; IAM</h1>

        <p className="text-lg text-gray-300 mb-8">85% aller Breaches nutzen kompromittierte oder überprivilegierte Identitäten aus. RBAC, Least Privilege und regelmäßige Access Reviews sind Pflicht.</p>

        <section className="mb-10">

          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Role-Based Access Control (RBAC)</h2>

          <p className="text-lg text-gray-300 mb-8">RBAC ist ein Ansatz zur Zugriffssteuerung, bei dem Benutzerrollen und -berechtigungen anhand von Regeln und Richtlinien zugewiesen werden.</p>

          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">

            <pre>{`// RBAC-Implementierung für Moltbot

const ROLE_PERMISSIONS = {

  admin: ['threats:read','threats:write','runbooks:execute','audit:read','users:manage'],

  security_analyst: ['threats:read','threats:write','runbooks:execute','audit:read'],

  developer: ['threats:read','runbooks:execute'],

  auditor: ['threats:read','audit:read'],

  viewer: ['threats:read'],

};

export function hasPermission(role, permission) {

  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;

}

// Beispiel in API-Route:

export async function GET(req) {

  const principal = await parseDashboardPrincipal(req);

  if (!hasPermission(principal.role, 'audit:read')) {

    return Response.json({ error: 'Insufficient permissions' }, { status: 403 });

  }

  // ... rest of handler

`}</pre>

          </div>

          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Least Privilege Implementation</h2>

          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">

            <pre>{`// Least Privilege Middleware für Next.js

function requirePermission(permission) {

  return (role) => {

    if (!hasPermission(role, permission)) {

      throw new Error('Insufficient permissions: ' + permission);

    }

  };

}

// Beispiel: Nur Admins können User-Management aufrufen

app.get('/api/admin/users', 

  authMiddleware, 

  requirePermission('users:manage'), 

  handler

);

// Beispiel: Developer können nur eigene Executions sehen

app.get('/api/executions', 

  authMiddleware, 

  requirePermission('threats:read'), 

  async (req, res) => {

    const principal = await parseDashboardPrincipal(req);

    const executions = await getExecutions(principal.customer_id);

    res.json(executions);

  }

);`}</pre>

          </div>

          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Automated Access Reviews</h2>

          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">

            <pre>{`// Automated Access Review Job (täglich)

async function runAccessReviews() {

  const customers = await dbQuery('SELECT id FROM customers');

  

  for (const customer of customers) {

    const users = await dbQuery(

      'SELECT id, email, role, last_login FROM users WHERE customer_id = $1',

      [customer.id]

    );

    

    for (const user of users) {

      // 90+ Tage inaktiv = Review erforderlich

      const daysInactive = Math.floor((Date.now() - user.last_login) / (1000 * 60 * 60 * 24));

      

      if (daysInactive > 90) {

        await sendAccessReviewEmail(user.email, user.role);

        await logAccessReview(user.id, 'INACTIVE_REVIEW');

      }

    }

  }

}

// Moltbot Job Scheduler

scheduleJob('0 2 * * *', runAccessReviews); // Jeden Tag um 2 Uhr`}</pre>

          </div>

        </section>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "Was ist Moltbot Security?", acceptedAnswer: { "@type": "Answer", text: "Moltbot ist eine Security-Automation-Plattform mit 600+ Executable Runbooks, Live-Score und Compliance-Dashboard f&#xFC;r Self-Hosting-Infrastrukturen." } },
              { "@type": "Question", name: "Ist dieser Guide ein Penetrationstest?", acceptedAnswer: { "@type": "Answer", text: "Nein. Dieser Guide dient ausschlie&#xDF;lich zur Absicherung eigener Systeme. Kein Angriffs-Tool, keine illegalen Aktivit&#xE4;ten." } },
              { "@type": "Question", name: "Wo finde ich zugeh&#xF6;rige Runbooks?", acceptedAnswer: { "@type": "Answer", text: "Alle Runbooks sind unter /runbooks abrufbar. Jeder Befund im Security-Check enth&#xE4;lt einen direkten Link zum passenden Runbook." } }
            ]
          },
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Moltbot Security Guide",
            description: "Executable Security Runbooks und Hardening-Guides f&#xFC;r Moltbot-Infrastrukturen.",
            url: "https://clawguru.org/de/moltbot/identity-governance-iam"
          }
        ]) }} />

      </div>

    </div>

  );

}