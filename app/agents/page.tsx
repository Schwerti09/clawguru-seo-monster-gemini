import { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

export const metadata: Metadata = {
  title: "AI Agent Showcase | ClawBot & MoltBot Agent Library",
  description: "Entdecke die komplette Sammlung an AI Agents für Security, Operations, Deployment und Monitoring. ClawBot & MoltBot Agent Showcase.",
  openGraph: {
    title: "AI Agent Showcase | ClawBot & MoltBot",
    description: "Die ultimative Sammlung an AI Agents für autonomes Ops-Management",
    url: "https://clawguru.org/agents",
    siteName: "ClawGuru",
    images: [{
      url: "/og-agents.jpg",
      width: 1200,
      height: 630,
      alt: "AI Agent Showcase"
    }],
    locale: "de_DE",
    type: "website",
  },
}

const AGENT_CATEGORIES = [
  {
    id: "security",
    name: "Security Agents",
    description: "Autonome Security-Monitoring und Threat Detection",
    icon: "🛡️",
    count: 12
  },
  {
    id: "operations",
    name: "Operations Agents", 
    description: "Infrastructure Automation und Operations Management",
    icon: "⚙️",
    count: 8
  },
  {
    id: "deployment",
    name: "Deployment Agents",
    description: "Zero-Touch Deployment und CI/CD Automation",
    icon: "🚀",
    count: 6
  },
  {
    id: "monitoring",
    name: "Monitoring Agents",
    description: "Performance Monitoring und Health Checks",
    icon: "📊",
    count: 9
  },
  {
    id: "compliance",
    name: "Compliance Agents",
    description: "Audit, Reporting und Policy Enforcement",
    icon: "📋",
    count: 5
  }
]

const FEATURED_AGENTS = [
  {
    name: "ClawBot Sentinel Pro",
    category: "Security",
    description: "Enterprise-grade Security Agent mit Advanced Threat Detection",
    version: "v3.2.1",
    downloads: "5.2K",
    rating: 4.9,
    author: "ClawGuru Team",
    license: "Commercial",
    tags: ["security", "threat-detection", "siem", "automated-response"],
    features: [
      "Real-time Threat Intelligence",
      "Automated Incident Response",
      "SIEM Integration (Splunk, ELK)",
      "Custom Rule Engine",
      "ML-based Anomaly Detection"
    ],
    integrations: ["AWS Security Hub", "Azure Sentinel", "Google Cloud Security"],
    pricing: "$99/mo",
    highlights: ["🔥 Featured", "⭐ Top Rated", "🏢 Enterprise Ready"]
  },
  {
    name: "MoltBot OpsMaster",
    category: "Operations",
    description: "Autonomous Infrastructure Management und Auto-Healing",
    version: "v2.8.0",
    downloads: "3.1K", 
    rating: 4.7,
    author: "MoltBot Community",
    license: "MIT",
    tags: ["ops", "infrastructure", "auto-healing", "cost-optimization"],
    features: [
      "Infrastructure-as-Code Management",
      "Auto-Healing Systems",
      "Cost Optimization Engine",
      "Performance Monitoring",
      "Multi-Cloud Support"
    ],
    integrations: ["Kubernetes", "Docker", "Terraform", "Ansible"],
    pricing: "Free",
    highlights: ["🆓 Free", "🌟 Community Favorite"]
  },
  {
    name: "ClawBot Auditor",
    category: "Compliance",
    description: "Automated Compliance Audits und Security Posture Management",
    version: "v1.9.3",
    downloads: "2.8K",
    rating: 4.8,
    author: "Security Team",
    license: "Commercial",
    tags: ["compliance", "audit", "security-posture", "reporting"],
    features: [
      "CIS Benchmarks Validation",
      "Automated Evidence Collection",
      "Policy Enforcement",
      "Compliance Reporting",
      "Risk Assessment"
    ],
    integrations: ["AWS Config", "Azure Policy", "Google Cloud Asset Inventory"],
    pricing: "$149/mo",
    highlights: ["🔒 Security Focused", "📊 Reporting Pro"]
  },
  {
    name: "MoltBot Deployer",
    category: "Deployment",
    description: "Zero-Touch Deployment mit Rollback Safety",
    version: "v2.1.0",
    downloads: "1.9K",
    rating: 4.6,
    author: "DevOps Team",
    license: "MIT",
    tags: ["deployment", "cicd", "gitops", "rollback"],
    features: [
      "GitOps Integration",
      "Blue-Green Deployments",
      "Automated Rollback",
      "Multi-Environment Support",
      "Health Check Integration"
    ],
    integrations: ["GitHub Actions", "GitLab CI", "Jenkins", "ArgoCD"],
    pricing: "Free",
    highlights: ["🆓 Free", "🔄 GitOps Ready"]
  }
]

const ALL_AGENTS = [
  // Security Agents
  {
    name: "ClawBot Threat Hunter",
    category: "Security",
    description: "Proactive Threat Hunting mit IOC Detection",
    version: "v1.5.2",
    downloads: "890",
    rating: 4.5,
    license: "MIT",
    tags: ["threat-hunting", "ioc", "forensics"]
  },
  {
    name: "MoltBot Vulnerability Scanner",
    category: "Security", 
    description: "Automated Vulnerability Scanning und Patch Management",
    version: "v2.0.1",
    downloads: "1.2K",
    rating: 4.4,
    license: "Free",
    tags: ["vulnerability", "patching", "security-scan"]
  },
  // Operations Agents
  {
    name: "ClawBot Resource Optimizer",
    category: "Operations",
    description: "Cloud Resource Optimization und Cost Management",
    version: "v1.8.0",
    downloads: "670",
    rating: 4.3,
    license: "MIT",
    tags: ["cost-optimization", "resources", "cloud"]
  },
  {
    name: "MoltBot Backup Manager",
    category: "Operations",
    description: "Automated Backup und Disaster Recovery",
    version: "v1.3.2",
    downloads: "540",
    rating: 4.6,
    license: "Free",
    tags: ["backup", "disaster-recovery", "automation"]
  },
  // Monitoring Agents
  {
    name: "ClawBot Performance Monitor",
    category: "Monitoring",
    description: "Real-time Performance Monitoring und Alerting",
    version: "v2.2.0",
    downloads: "1.1K",
    rating: 4.7,
    license: "MIT",
    tags: ["performance", "monitoring", "alerting"]
  },
  {
    name: "MoltBot Log Analyzer",
    category: "Monitoring",
    description: "AI-powered Log Analysis und Anomaly Detection",
    version: "v1.6.1",
    downloads: "890",
    rating: 4.5,
    license: "Free",
    tags: ["logs", "analysis", "anomaly-detection"]
  }
]

interface AgentsPageProps {
  dict?: any
  locale?: string
}

export default function AgentsPage({ dict, locale = "de" }: AgentsPageProps = {}) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
          AI Agent Showcase
        </div>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          ClawBot & MoltBot Agent Library
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Entdecke die komplette Sammlung an AI Agents für Security, Operations, 
          Deployment und Monitoring. Ready-to-use für deine Infrastruktur.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg">
            <Link href="#featured">Featured Agents</Link>
          </Button>
          <Button variant="outline" size="lg">
            <Link href="#all">Alle Agents</Link>
          </Button>
        </div>
      </div>

      {/* Categories Overview */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Agent Kategorien</h2>
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
          {AGENT_CATEGORIES.map((category) => (
            <Card key={category.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">{category.icon}</div>
                <h3 className="font-semibold mb-1">{category.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{category.description}</p>
                <Badge variant="secondary">{category.count} Agents</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Featured Agents */}
      <section id="featured" className="mb-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Featured Agents</h2>
          <p className="text-muted-foreground">
            Die populärsten und leistungsstärksten AI Agents aus der Community.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {FEATURED_AGENTS.map((agent, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-xl">{agent.name}</CardTitle>
                      <div className="flex gap-1">
                        {agent.highlights?.map((highlight, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {highlight}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <CardDescription className="text-base">{agent.description}</CardDescription>
                  </div>
                  <Badge variant="secondary">{agent.category}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Meta Info */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>v{agent.version}</span>
                  <span>•</span>
                  <span>📥 {agent.downloads}</span>
                  <span>•</span>
                  <span>⭐ {agent.rating}</span>
                  <span>•</span>
                  <span>{agent.license}</span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {agent.tags.map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Features */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Key Features:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {agent.features.slice(0, 3).map((feature, featureIndex) => (
                      <li key={featureIndex}>• {feature}</li>
                    ))}
                    {agent.features.length > 3 && (
                      <li className="text-primary">• +{agent.features.length - 3} weitere Features</li>
                    )}
                  </ul>
                </div>

                {/* Integrations */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Integrations:</h4>
                  <div className="flex flex-wrap gap-1">
                    {agent.integrations.map((integration, integrationIndex) => (
                      <Badge key={integrationIndex} variant="outline" className="text-xs">
                        {integration}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 items-center">
                  <Button size="sm" className="flex-1">
                    {agent.pricing === "Free" ? "Download" : ` ${agent.pricing}`}
                  </Button>
                  <Button variant="outline" size="sm">
                    Docs
                  </Button>
                  <Button variant="outline" size="sm">
                    Demo
                  </Button>
                </div>

                {/* Author */}
                <div className="text-xs text-muted-foreground border-t pt-2">
                  von {agent.author}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* All Agents */}
      <section id="all" className="mb-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Alle Agents</h2>
          <p className="text-muted-foreground">
            Die komplette Sammlung an verfügbaren AI Agents.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ALL_AGENTS.map((agent, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{agent.name}</CardTitle>
                    <CardDescription className="mt-1">{agent.description}</CardDescription>
                  </div>
                  <Badge variant="secondary">{agent.category}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span>v{agent.version}</span>
                  <span>•</span>
                  <span>📥 {agent.downloads}</span>
                  <span>•</span>
                  <span>⭐ {agent.rating}</span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {agent.tags.map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    {agent.license === "Free" ? "Download" : agent.license}
                  </Button>
                  <Button variant="outline" size="sm">
                    Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <Alert className="mt-12">
        <AlertDescription className="text-center py-4">
          <div className="text-lg font-semibold mb-2">Dein eigener AI Agent?</div>
          <p className="text-muted-foreground mb-4">
            Entwickle deinen eigenen ClawBot oder MoltBot Agent und teile ihn mit der Community.
          </p>
          <div className="flex gap-4 justify-center">
            <Button>Agent entwickeln</Button>
            <Button variant="outline">Development Guide</Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  )
}
