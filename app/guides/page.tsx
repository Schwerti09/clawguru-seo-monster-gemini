import { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Integration Guides | ClawBot & MoltBot Setup Anleitungen",
  description: "Schritt-für-Schritt Integration Guides für ClawBot & MoltBot. Kubernetes, AWS, Docker, CI/CD und mehr. Komplette Setup Anleitungen.",
  openGraph: {
    title: "Integration Guides | ClawBot & MoltBot",
    description: "Komplette Setup Anleitungen für AI Agent Integration",
    url: "https://clawguru.org/guides",
    siteName: "ClawGuru",
    images: [{
      url: "/og-guides.jpg",
      width: 1200,
      height: 630,
      alt: "Integration Guides"
    }],
    locale: "de_DE",
    type: "website",
  },
}

const GUIDE_CATEGORIES = [
  {
    id: "setup",
    name: "Setup & Installation",
    description: "Grundlegende Installation und Konfiguration",
    icon: "🚀",
    count: 8
  },
  {
    id: "kubernetes",
    name: "Kubernetes",
    description: "K8s Deployment und Orchestrierung",
    icon: "☸️",
    count: 6
  },
  {
    id: "cloud",
    name: "Cloud Platforms",
    description: "AWS, Azure, GCP Integration",
    icon: "☁️",
    count: 12
  },
  {
    id: "cicd",
    name: "CI/CD & Deployment",
    description: "Automatisierte Deployment Pipelines",
    icon: "🔄",
    count: 7
  },
  {
    id: "monitoring",
    name: "Monitoring & Observability",
    description: "Monitoring, Logging und Alerting",
    icon: "📊",
    count: 9
  }
]

const FEATURED_GUIDES = [
  {
    title: "ClawBot Sentinel mit Kubernetes integrieren",
    description: "Komplette Anleitung für Deployment von ClawBot Sentinel in Kubernetes-Clustern mit Auto-Scaling und High Availability.",
    difficulty: "Advanced",
    readTime: "25 min",
    category: "Kubernetes",
    author: "Kubernetes Team",
    rating: 4.9,
    views: "3.2K",
    tags: ["kubernetes", "deployment", "clawbot", "sentinel", "ha"],
    prerequisites: [
      "Kubernetes Cluster v1.25+",
      "kubectl CLI",
      "Helm 3.0+",
      "ClawBot Sentinel License"
    ],
    steps: [
      "Voraussetzungen prüfen",
      "Namespace und RBAC konfigurieren", 
      "Helm Chart deployment",
      "Service und Ingress konfigurieren",
      "Monitoring und Logging setup",
      "High Availability konfigurieren",
      "Backup und Recovery testen"
    ],
    codeBlocks: ["helm-values.yaml", "deployment.yaml", "service.yaml", "ingress.yaml"],
    outcomes: [
      "ClawBot Sentinel läuft in K8s",
      "Auto-Scaling konfiguriert",
      "Monitoring integriert",
      "HA Setup getestet"
    ]
  },
  {
    title: "MoltBot OpsMaster für AWS Security Hub",
    description: "Integration von MoltBot OpsMaster mit AWS Security Hub für zentralisierte Security Posture Management und Compliance Reporting.",
    difficulty: "Intermediate",
    readTime: "20 min",
    category: "Cloud Platforms",
    author: "AWS Security Team",
    rating: 4.7,
    views: "2.8K",
    tags: ["aws", "security-hub", "moltbot", "compliance", "monitoring"],
    prerequisites: [
      "AWS Account mit Security Hub",
      "IAM Permissions für Security Hub",
      "MoltBot OpsMaster v2.0+",
      "AWS CLI konfiguriert"
    ],
    steps: [
      "AWS Security Hub konfigurieren",
      "IAM Role für MoltBot erstellen",
      "Security Hub Integration setup",
      "Custom Security Controls definieren",
      "Alerting und Notifications",
      "Compliance Reports konfigurieren",
      "Testing und Validation"
    ],
    codeBlocks: ["iam-role.json", "security-hub-config.json", "moltbot-config.yaml"],
    outcomes: [
      "Security Hub Integration aktiv",
      "Automatische Compliance Checks",
      "Centralized Security Posture",
      "Custom Reporting"
    ]
  },
  {
    title: "OpenClaw + Prometheus Monitoring Setup",
    description: "Komplettes Monitoring Setup für OpenClaw Agents mit Prometheus, Grafana und AlertManager für Production-Ready Observability.",
    difficulty: "Beginner",
    readTime: "15 min",
    category: "Monitoring",
    author: "Monitoring Team",
    rating: 4.8,
    views: "4.1K",
    tags: ["prometheus", "grafana", "monitoring", "openclaw", "observability"],
    prerequisites: [
      "Docker oder Kubernetes",
      "Prometheus Server",
      "Grafana Instance",
      "OpenClaw Agents"
    ],
    steps: [
      "Prometheus konfigurieren",
      "OpenClaw Metrics Export setup",
      "Grafana Dashboards importieren",
      "AlertManager Regeln definieren",
      "Monitoring Targets hinzufügen",
      "Alert Testing und Validation",
      "Production Rollout"
    ],
    codeBlocks: ["prometheus.yml", "grafana-dashboard.json", "alertmanager.yml"],
    outcomes: [
      "Complete Monitoring Stack",
      "Custom Dashboards",
      "Proactive Alerting",
      "Performance Insights"
    ]
  },
  {
    title: "MoltBot CI/CD Pipeline mit GitHub Actions",
    description: "Automatisierte CI/CD Pipeline für MoltBot Deployment mit GitHub Actions, Testing und Automated Rollback.",
    difficulty: "Intermediate",
    readTime: "18 min",
    category: "CI/CD & Deployment",
    author: "DevOps Team",
    rating: 4.6,
    views: "2.5K",
    tags: ["github-actions", "cicd", "moltbot", "deployment", "automation"],
    prerequisites: [
      "GitHub Repository",
      "Docker Registry",
      "Kubernetes oder Docker Host",
      "MoltBot Source Code"
    ],
    steps: [
      "GitHub Actions Workflow erstellen",
      "Build und Test Pipeline",
      "Docker Image Registry setup",
      "Deployment Pipeline konfigurieren",
      "Automated Testing integrieren",
      "Rollback Strategy implementieren",
      "Production Deployment"
    ],
    codeBlocks: ["github-actions.yml", "dockerfile", "deployment-script.sh"],
    outcomes: [
      "Automated CI/CD Pipeline",
      "Zero-Downtime Deployment",
      "Automated Testing",
      "Rollback Safety"
    ]
  }
]

const ALL_GUIDES = [
  // Setup Guides
  {
    title: "ClawBot Quick Start Guide",
    description: "Schneller Einstieg in ClawBot mit Basic Setup und First Run Configuration.",
    difficulty: "Beginner",
    readTime: "10 min",
    category: "Setup & Installation",
    views: "5.2K",
    tags: ["clawbot", "quickstart", "setup", "beginner"]
  },
  {
    title: "MoltBot Installation auf Docker",
    description: "Docker-basierte Installation von MoltBot mit docker-compose und Volume Management.",
    difficulty: "Beginner",
    readTime: "12 min",
    category: "Setup & Installation", 
    views: "3.8K",
    tags: ["moltbot", "docker", "installation", "compose"]
  },
  // Kubernetes Guides
  {
    title: "ClawBot Helm Chart Deployment",
    description: "Helm Chart basiertes Deployment von ClawBot mit Custom Values und Environment Konfiguration.",
    difficulty: "Intermediate",
    readTime: "16 min",
    category: "Kubernetes",
    views: "2.1K",
    tags: ["helm", "kubernetes", "clawbot", "deployment"]
  },
  {
    title: "MoltBot Operator für Kubernetes",
    description: "Custom Kubernetes Operator für MoltBot Management und Lifecycle Automation.",
    difficulty: "Advanced",
    readTime: "22 min",
    category: "Kubernetes",
    views: "1.4K",
    tags: ["operator", "kubernetes", "moltbot", "advanced"]
  },
  // Cloud Platform Guides
  {
    title: "ClawBot für Azure Security Center",
    description: "Integration von ClawBot mit Azure Security Center für Cloud Security Management.",
    difficulty: "Intermediate",
    readTime: "18 min",
    category: "Cloud Platforms",
    views: "1.9K",
    tags: ["azure", "security-center", "clawbot", "cloud"]
  },
  {
    title: "MoltBot Google Cloud Security",
    description: "MoltBot Integration mit Google Cloud Security Command Center und Cloud Asset Inventory.",
    difficulty: "Intermediate",
    readTime: "20 min",
    category: "Cloud Platforms",
    views: "1.6K",
    tags: ["gcp", "security-command-center", "moltbot", "cloud"]
  }
]

interface GuidesPageProps {
  dict?: any
  locale?: string
}

export default function GuidesPage({ dict, locale = "de" }: GuidesPageProps = {}) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
          Integration Guides
        </div>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          ClawBot & MoltBot Integration
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Schritt-für-Schritt Anleitungen für die Integration von ClawBot & MoltBot 
          in deine Infrastruktur. Von Kubernetes bis Cloud Platforms.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg">
            <Link href="#featured">Featured Guides</Link>
          </Button>
          <Button variant="outline" size="lg">
            <Link href="#all">Alle Guides</Link>
          </Button>
        </div>
      </div>

      {/* Categories Overview */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Guide Kategorien</h2>
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
          {GUIDE_CATEGORIES.map((category) => (
            <Card key={category.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">{category.icon}</div>
                <h3 className="font-semibold mb-1">{category.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{category.description}</p>
                <Badge variant="secondary">{category.count} Guides</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Featured Guides */}
      <section id="featured" className="mb-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Featured Integration Guides</h2>
          <p className="text-muted-foreground">
            Die wichtigsten und meistgelesenen Integration Guides aus der Community.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {FEATURED_GUIDES.map((guide, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg">{guide.title}</CardTitle>
                      <Badge variant="outline">{guide.difficulty}</Badge>
                    </div>
                    <CardDescription className="text-base">{guide.description}</CardDescription>
                  </div>
                  <Badge variant="secondary">{guide.category}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Meta Info */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>📖 {guide.readTime}</span>
                  <span>•</span>
                  <span>👁️ {guide.views}</span>
                  <span>•</span>
                  <span>⭐ {guide.rating}</span>
                  <span>•</span>
                  <span>{guide.author}</span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {guide.tags.map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Prerequisites */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Voraussetzungen:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {guide.prerequisites.slice(0, 3).map((prereq, prereqIndex) => (
                      <li key={prereqIndex}>• {prereq}</li>
                    ))}
                    {guide.prerequisites.length > 3 && (
                      <li className="text-primary">• +{guide.prerequisites.length - 3} weitere</li>
                    )}
                  </ul>
                </div>

                {/* Steps Preview */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Schritte ({guide.steps.length}):</h4>
                  <div className="text-sm text-muted-foreground">
                    {guide.steps.slice(0, 2).join(" → ")}
                    {guide.steps.length > 2 && " → ..."}
                  </div>
                </div>

                {/* Code Blocks */}
                <div className="flex gap-1">
                  {guide.codeBlocks.slice(0, 3).map((code, codeIndex) => (
                    <Badge key={codeIndex} variant="outline" className="text-xs">
                      {code}
                    </Badge>
                  ))}
                  {guide.codeBlocks.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{guide.codeBlocks.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    Guide lesen
                  </Button>
                  <Button variant="outline" size="sm">
                    Code
                  </Button>
                  <Button variant="outline" size="sm">
                    Video
                  </Button>
                </div>

                {/* Outcomes */}
                <div className="text-xs text-muted-foreground border-t pt-2">
                  <strong>Ergebnisse:</strong> {guide.outcomes.slice(0, 2).join(", ")}
                  {guide.outcomes.length > 2 && " + mehr"}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* All Guides */}
      <section id="all" className="mb-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Alle Integration Guides</h2>
          <p className="text-muted-foreground">
            Die komplette Sammlung an verfügbaren Integration Guides.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ALL_GUIDES.map((guide, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{guide.title}</CardTitle>
                    <CardDescription className="mt-1">{guide.description}</CardDescription>
                  </div>
                  <Badge variant="secondary">{guide.category}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Badge variant="outline">{guide.difficulty}</Badge>
                  <span>📖 {guide.readTime}</span>
                  <span>•</span>
                  <span>👁️ {guide.views}</span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {guide.tags.map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    Guide lesen
                  </Button>
                  <Button variant="outline" size="sm">
                    Bookmark
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
          <div className="text-lg font-semibold mb-2">Eigener Integration Guide?</div>
          <p className="text-muted-foreground mb-4">
            Teile dein Wissen mit der Community und erstelle einen Integration Guide.
          </p>
          <div className="flex gap-4 justify-center">
            <Button>Guide erstellen</Button>
            <Button variant="outline">Author Guidelines</Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  )
}
