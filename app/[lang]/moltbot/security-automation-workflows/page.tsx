import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from '@/lib/i18n'

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const { lang } = params;
  return {
    title: 'Moltbot Security Automation Workflows: Orchestration & Playbooks 2024',
    description: 'Security Automation für Moltbot. Workflow-Orchestration, Webhook-Integration, Playbook-Automatisierung und Incident Response Automation.',
    keywords: ['moltbot security automation','workflow orchestration','security playbooks','incident response automation','webhook integration'],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: {
      images: ["/og-image.png"], title: 'Moltbot Security Automation Workflows 2024', description: 'Security Automation für Moltbot.', type: 'article', url: `https://clawguru.org/${lang}/moltbot/security-automation-workflows` },
    alternates: buildLocalizedAlternates(lang as Locale, '/moltbot/security-automation-workflows'),
    robots: 'index, follow',
  };
}

export default function MoltbotAutomationPage({ params }: { params: { lang: string } }) {
  const { lang } = params;
  if (!SUPPORTED_LOCALES.includes(lang as Locale)) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Trust-Anker</strong>: Security Automation automatisiert Verteidigungsmaßnahmen. Keine Angriffswerkzeuge.
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">Moltbot Security Automation Workflows</h1>
        <p className="text-lg text-gray-300 mb-8">Manual Security-Response dauert Stunden. Automatisierte Workflows reduzieren Incident-Response-Zeit von Stunden auf Minuten.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Workflow-Engine Architektur</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
            <pre>{`// Moltbot Workflow Engine
class SecurityWorkflow {
  constructor(name, steps) {
    this.name = name;
    this.steps = steps;
    this.context = {};
  }
  
  async execute(trigger) {
    console.log('Starting workflow:', this.name, 'trigger:', trigger.type);
    
    for (const step of this.steps) {
      try {
        await this.executeStep(step, trigger);
      } catch (error) {
        console.error('Step failed:', step.name, error);
        if (step.onFailure) {
          await this.executeStep(step.onFailure, trigger);
        }
        break;
      }
    }
    
    console.log('Workflow completed:', this.name);
  }
  
  async executeStep(step, trigger) {
    console.log('Executing step:', step.name);
    
    switch (step.type) {
      case 'http_request':
        await this.httpRequest(step.config);
        break;
      case 'script':
        await this.executeScript(step.config);
        break;
      case 'webhook':
        await this.sendWebhook(step.config);
        break;
      case 'condition':
        if (!this.evaluateCondition(step.config, trigger)) {
          throw new Error('Condition not met');
        }
        break;
      case 'delay':
        await this.delay(step.config.duration);
        break;
      default:
        throw new Error('Unknown step type: ' + step.type);
    }
  }
}

// Beispiel: Incident Response Workflow
const incidentResponse = new SecurityWorkflow('incident_response', [
  {
    name: 'analyze_threat',
    type: 'script',
    config: { script: 'analyze_threat.py', params: { severity: 'high' } }
  },
  {
    name: 'check_mitigation',
    type: 'condition',
    config: { expression: 'context.threat_score > 8' }
  },
  {
    name: 'block_ip',
    type: 'http_request',
    config: {
      method: 'POST',
      url: 'https://api.firewall/block',
      body: { ip: 'context.source_ip', duration: '1h' }
    }
  },
  {
    name: 'notify_team',
    type: 'webhook',
    config: {
      url: 'https://hooks.slack.com/security',
      message: 'Threat blocked: IP {context.source_ip}'
    }
  }
]);`}</pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Webhook Integration Patterns</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
            <pre>{`// Webhook Handler für Security Events
export async function handleSecurityWebhook(req, res) {
  const event = req.body;
  
  try {
    // Validate webhook signature
    if (!validateWebhookSignature(req)) {
      return res.status(401).json({ error: 'Invalid signature' });
    }
    
    // Route to appropriate workflow
    const workflow = getWorkflowForEvent(event);
    if (workflow) {
      await workflow.execute(event);
    }
    
    res.json({ status: 'processed' });
  } catch (error) {
    console.error('Webhook processing failed:', error);
    res.status(500).json({ error: 'Processing failed' });
  }
}

// Workflow Registry
const WORKFLOW_REGISTRY = {
  'security_alert': incidentResponse,
  'vulnerability_found': vulnerabilityWorkflow,
  'compliance_failure': complianceWorkflow,
  'data_breach': breachWorkflow
};

function getWorkflowForEvent(event) {
  return WORKFLOW_REGISTRY[event.type];
}

// Beispiel: GitHub Security Advisory Webhook
app.post('/api/webhooks/github', handleSecurityWebhook);`}</pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Playbook Templates</h2>
          <div className="space-y-4">
            {[
              {
                name: 'Malware Detection Response',
                trigger: 'antivirus_alert',
                steps: ['Isolate System', 'Collect Artifacts', 'Scan Network', 'Update Signatures'],
                duration: '5-15 min'
              },
              {
                name: 'DDoS Mitigation',
                trigger: 'traffic_spike',
                steps: ['Rate Limiting', 'IP Blocking', 'CDN Activation', 'Traffic Analysis'],
                duration: '2-5 min'
              },
              {
                name: 'Data Breach Response',
                trigger: 'data_exfiltration',
                steps: ['Contain Data', 'Notify Legal', 'Password Reset', 'Forensic Analysis'],
                duration: '30-60 min'
              },
            ].map((template) => (
              <div key={template.name} className="bg-gray-800 p-4 rounded-lg border border-gray-700 border">
                <div className="font-semibold text-lg mb-2">{template.name}</div>
                <div className="text-sm text-gray-300 mb-2">Trigger: {template.trigger} | Duration: {template.duration}</div>
                <div className="flex flex-wrap gap-2">
                  {template.steps.map((step) => (
                    <span key={step} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                      {step}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Resources</h2>
          <div className="space-y-4">
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 border">
              <div className="font-semibold text-lg mb-2">Moltbot Documentation</div>
              <div className="text-sm text-gray-300 mb-2">Learn more about Moltbot and its features.</div>
              <a href="https://moltbot.com/docs" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-200">Visit Documentation</a>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 border">
              <div className="font-semibold text-lg mb-2">Moltbot Community</div>
              <div className="text-sm text-gray-300 mb-2">Join the Moltbot community to connect with other users and get support.</div>
              <a href="https://moltbot.com/community" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-200">Visit Community</a>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 border">
              <div className="font-semibold text-lg mb-2">Moltbot GitHub</div>
              <div className="text-sm text-gray-300 mb-2">Explore Moltbot's open-source code and contribute to the project.</div>
              <a href="https://github.com/moltbot" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-200">Visit GitHub</a>
            </div>
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
            url: "https://clawguru.org/de/moltbot/security-automation-workflows"
          }
        ]) }} />
      </div>
    </div>
  );
}