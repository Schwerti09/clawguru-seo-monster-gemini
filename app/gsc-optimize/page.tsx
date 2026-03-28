import type { Metadata } from "next"
import { BASE_URL } from "@/lib/config"

// GSC Quick-Win Keywords Hub
// Targets: 30 high-impression, 0-click keywords from Google Search Console
// Purpose: Funnel traffic from rank 2-50 keywords to internal pages

export const metadata: Metadata = {
  title: "Infrastructure Security, Compliance & Deployment Guides 2026",
  description: "Expert guides for Kubernetes, Docker, Terraform, databases. HIPAA, ISO 27001, PCI-DSS compliance. AWS, GCP, Azure hardening.",
  alternates: { canonical: "/gsc-optimize" },
  keywords: [
    "influxdb hipaa compliance",
    "iso 27001 google cloud",
    "github actions bare metal",
    "rabbitmq audit", 
    "terraform canary deploy",
    "kubernetes iso 27001",
    "docker compliance",
    "grafana hardening",
    "postgresql hipaa",
  ],
}

const keywords = [
  // High-impressions, 0 clicks, position 5-10
  { kw: "influxdb hipaa compliance", impr: 26, pos: 7.7, route: "/solutions", intent: "compliance" },
  { kw: "iso 27001 google cloud", impr: 25, pos: 20.6, route: "/solutions", intent: "compliance" },
  { kw: "github actions bare metal", impr: 24, pos: 29.9, route: "/solutions", intent: "deployment" },
  { kw: "rabbitmq audit", impr: 24, pos: 32.9, route: "/solutions", intent: "security" },
  { kw: "terraform canary deploy", impr: 23, pos: 45.7, route: "/solutions", intent: "deployment" },
  { kw: "kubernetes iso 27001", impr: 6, pos: 15.3, route: "/solutions", intent: "compliance" },
  { kw: "docker compliance", impr: 3, pos: 9.3, route: "/solutions", intent: "compliance" },
  { kw: "grafana hardening", impr: 2, pos: 7.0, route: "/solutions", intent: "security" },
  { kw: "authentik mtls", impr: 10, pos: 6.2, route: "/solutions", intent: "security" },
  { kw: "keycloak hardening", impr: 1, pos: 14.0, route: "/solutions", intent: "security" },
]

const softwareCategories = [
  { name: "Databases", items: ["InfluxDB", "PostgreSQL", "MongoDB", "Cassandra", "TimescaleDB"] },
  { name: "Message Queues", items: ["RabbitMQ", "Kafka", "Redis"] },
  { name: "Monitoring", items: ["Grafana", "Prometheus", "Datadog"] },
  { name: "CI/CD", items: ["GitHub Actions", "Jenkins", "GitLab", "CircleCI"] },
  { name: "IAM & Auth", items: ["Keycloak", "Authentik", "Auth0", "Dex"] },
  { name: "Container & Orchestration", items: ["Docker", "Kubernetes", "Helm"] },
  { name: "IaC & Deployment", items: ["Terraform", "Ansible", "Pulumi"] },
]

const complianceFrameworks = [
  "ISO 27001", "ISO 27017", "HIPAA", "PCI-DSS", "SOC 2", "GDPR", "FEDRAMP",
]

export default function GSCOptimizePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-black mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Infrastructure, Security & Compliance Guides
          </h1>
          <p className="text-xl text-slate-400 mb-6">
            Expert runbooks for Kubernetes, Docker, Terraform, databases, and compliance frameworks
          </p>
          <p className="text-sm text-slate-500">
            Real-world hardening guides | Step-by-step troubleshooting | Production best practices
          </p>
        </div>

        {/* Software Navigation Grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-white">Browse by Technology</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {softwareCategories.map((cat) => (
              <div key={cat.name} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-cyan-500 transition">
                <h3 className="text-lg font-bold text-cyan-400 mb-4">{cat.name}</h3>
                <ul className="space-y-2">
                  {cat.items.map((item) => (
                    <li key={item}>
                      <a href={`/solutions`} className="text-slate-300 hover:text-cyan-300 transition text-sm">
                        → {item} Hardening & Security
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance Frameworks */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-white">Compliance & Auditing</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {complianceFrameworks.map((fw) => (
              <a
                key={fw}
                href="/solutions"
                className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 text-center hover:border-cyan-500 hover:bg-slate-700/50 transition"
              >
                <div className="text-cyan-400 font-bold">{fw}</div>
                <div className="text-xs text-slate-400 mt-1">Compliance Guide</div>
              </a>
            ))}
          </div>
        </div>

        {/* FAQ Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "How do I make InfluxDB HIPAA compliant?",
                  acceptedAnswer: { "@type": "Answer", text: "Follow our step-by-step InfluxDB HIPAA compliance guide covering encryption, audit logging, and access controls." }
                },
                {
                  "@type": "Question",
                  name: "What is ISO 27001 compliance for Google Cloud?",
                  acceptedAnswer: { "@type": "Answer", text: "ISO 27001 is an information security management system. Learn how to achieve it on Google Cloud with our complete guide." }
                },
                {
                  "@type": "Question",
                  name: "How do I deploy with GitHub Actions on bare metal?",
                  acceptedAnswer: { "@type": "Answer", text: "Use self-hosted runners to deploy from GitHub Actions to bare metal. See our runbook for setup, security, and troubleshooting." }
                },
              ],
            }),
          }}
        />

        {/* Quick Stats */}
        <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-500/30 rounded-lg p-8 text-center">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-3xl font-black text-cyan-400">500+</div>
              <div className="text-sm text-slate-400">Expert Guides</div>
            </div>
            <div>
              <div className="text-3xl font-black text-cyan-400">20+</div>
              <div className="text-sm text-slate-400">Cloud Providers</div>
            </div>
            <div>
              <div className="text-3xl font-black text-cyan-400">30+</div>
              <div className="text-sm text-slate-400">Compliance Frameworks</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
