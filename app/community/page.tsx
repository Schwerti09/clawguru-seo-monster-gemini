import { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LEGACY_UI_STRINGS } from "@/lib/i18n"
import Link from "next/link"

export const metadata: Metadata = {
  title: "ClawBot Community | AI Agent Hub für OpenClaw & MoltBot",
  description: "Trete der ClawBot Community bei! AI Agents, Integration Guides, Tutorials und Ressourcen für OpenClaw, MoltBot und autonomes Ops-Management.",
  openGraph: {
    title: "ClawBot Community | AI Agent Hub",
    description: "Die Heimat für OpenClaw & MoltBot AI Agents",
    url: "https://clawguru.org/community",
    siteName: "ClawGuru",
    images: [{
      url: "/og-community.jpg",
      width: 1200,
      height: 630,
      alt: "ClawBot Community Hub"
    }],
    locale: "de_DE",
    type: "website",
  },
}

const COMMUNITY_AGENTS = [
  {
    name: "ClawBot Sentinel",
    description: "Autonomer Security-Agent für 24/7 Threat Detection",
    category: "Security",
    difficulty: "Advanced",
    downloads: "2.5K",
    rating: 4.8,
    tags: ["security", "monitoring", "ai", "autonomous"],
    features: [
      "Real-time Threat Detection",
      "Automated Incident Response", 
      "Integration mit SIEM",
      "Custom Rule Engine"
    ]
  },
  {
    name: "MoltBot OpsMaster",
    description: "Operations-Agent für Infrastructure Automation",
    category: "Operations", 
    difficulty: "Intermediate",
    downloads: "1.8K",
    rating: 4.6,
    tags: ["ops", "automation", "infrastructure", "devops"],
    features: [
      "Infrastructure-as-Code",
      "Auto-Healing Systems",
      "Performance Monitoring",
      "Cost Optimization"
    ]
  },
  {
    name: "ClawBot Auditor",
    description: "Compliance & Audit Agent für Security Posture",
    category: "Compliance",
    difficulty: "Expert",
    downloads: "980",
    rating: 4.9,
    tags: ["compliance", "audit", "security", "reporting"],
    features: [
      "CIS Benchmarks",
      "Automated Reporting",
      "Policy Enforcement",
      "Evidence Collection"
    ]
  },
  {
    name: "MoltBot Deployer",
    description: "Zero-Touch Deployment Agent",
    category: "Deployment",
    difficulty: "Intermediate", 
    downloads: "1.2K",
    rating: 4.5,
    tags: ["deployment", "cicd", "automation", "devops"],
    features: [
      "GitOps Integration",
      "Rollback Safety",
      "Multi-Cloud Support",
      "Blue-Green Deployments"
    ]
  }
]

const INTEGRATION_GUIDES = [
  {
    title: "ClawBot mit Kubernetes integrieren",
    description: "Schritt-für-Schritt Anleitung für ClawBot Deployment in K8s",
    difficulty: "Intermediate",
    readTime: "15 min",
    category: "Kubernetes"
  },
  {
    title: "MoltBot für AWS Security Hub",
    description: "Security Hub Integration mit MoltOps",
    difficulty: "Advanced", 
    readTime: "20 min",
    category: "AWS"
  },
  {
    title: "OpenClaw + Prometheus Monitoring",
    description: "Monitoring Setup für OpenClaw Agents",
    difficulty: "Beginner",
    readTime: "10 min", 
    category: "Monitoring"
  },
  {
    title: "MoltBot CI/CD Pipeline",
    description: "Automatisierte Deployment Pipelines",
    difficulty: "Intermediate",
    readTime: "18 min",
    category: "CI/CD"
  }
]

const COMMUNITY_STATS = [
  { label: "Active Agents", value: "47", change: "+12%" },
  { label: "Community Members", value: "2.3K", change: "+23%" },
  { label: "Downloads", value: "8.7K", change: "+45%" },
  { label: "Integrations", value: "156", change: "+8%" }
]

interface CommunityPageProps {
  dict?: any
  locale?: string
}

export default function CommunityPage({ dict, locale = "de" }: CommunityPageProps = {}) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
          ClawBot Community Hub
        </div>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Die Heimat für AI Agents
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Trete der wachsenden Community von OpenClaw & MoltBot Entwicklern bei. 
          Teile, lerne und baue die nächste Generation autonomer Ops-Agents.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="#agents">Agents entdecken</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="#guides">Integration Guides</Link>
          </Button>
        </div>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {COMMUNITY_STATS.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
              <div className="text-xs text-green-600 mt-1">{stat.change}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="agents" className="space-y-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="agents">AI Agents</TabsTrigger>
          <TabsTrigger value="guides">Integration Guides</TabsTrigger>
          <TabsTrigger value="resources">Ressourcen</TabsTrigger>
          <TabsTrigger value="contribute">Mitmachen</TabsTrigger>
        </TabsList>

        {/* AI Agents Tab */}
        <TabsContent value="agents" id="agents" className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">ClawBot & MoltBot Agents</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Fertige AI Agents für verschiedene Use Cases - von Security Monitoring bis Operations Automation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {COMMUNITY_AGENTS.map((agent, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{agent.name}</CardTitle>
                      <CardDescription className="mt-2">{agent.description}</CardDescription>
                    </div>
                    <Badge variant="secondary">{agent.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Badge variant="outline">{agent.difficulty}</Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <span>⭐ {agent.rating}</span>
                      <span>•</span>
                      <span>📥 {agent.downloads}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {agent.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Features:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {agent.features.map((feature, featureIndex) => (
                        <li key={featureIndex}>• {feature}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      Download Agent
                    </Button>
                    <Button variant="outline" size="sm">
                      Docs
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Integration Guides Tab */}
        <TabsContent value="guides" id="guides" className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Integration Guides</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Schritt-für-Schritt Anleitungen für die Integration von ClawBot & MoltBot in deine Infrastruktur.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {INTEGRATION_GUIDES.map((guide, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{guide.title}</CardTitle>
                      <CardDescription className="mt-2">{guide.description}</CardDescription>
                    </div>
                    <Badge variant="outline">{guide.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Badge variant="secondary">{guide.difficulty}</Badge>
                    <span className="text-sm text-muted-foreground">📖 {guide.readTime}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      Guide lesen
                    </Button>
                    <Button variant="outline" size="sm">
                      Code
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Community Ressourcen</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tools, Templates und Ressourcen für die ClawBot & MoltBot Entwicklung.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>📚 Dokumentation</CardTitle>
                <CardDescription>Komplette API-Dokumentation und Architecture Guides</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Docs öffnen</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🔧 Dev Tools</CardTitle>
                <CardDescription>CLI Tools, Debugging Utilities und Testing Frameworks</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Tools download</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🎯 Templates</CardTitle>
                <CardDescription>Agent Templates, Config Files und Deployment Manifests</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Templates</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Contribute Tab */}
        <TabsContent value="contribute" className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Mitmachen</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Werde Teil der ClawBot Community und trage zur Zukunft autonomer Ops-Agents bei.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>🚀 Agent entwickeln</CardTitle>
                <CardDescription>
                  Entwickle deinen eigenen AI Agent und teile ihn mit der Community.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="text-sm space-y-2">
                  <li>• Agent Development Kit</li>
                  <li>• Testing Framework</li>
                  <li>• Deployment Guidelines</li>
                  <li>• Code Review Process</li>
                </ul>
                <Button className="w-full">Agent entwickeln</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>📖 Guides schreiben</CardTitle>
                <CardDescription>
                  Teile dein Wissen mit Integration Guides und Tutorials.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="text-sm space-y-2">
                  <li>• Guide Templates</li>
                  <li>• Code Examples</li>
                  <li>• Best Practices</li>
                  <li>• Community Review</li>
                </ul>
                <Button className="w-full">Guide schreiben</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* CTA Section */}
      <div className="text-center mt-16 p-8 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Bereit für die Zukunft autonomer Ops?</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Tritt der ClawBot Community bei und baue mit uns die nächste Generation 
          von AI-gestützten Operations-Tools.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg">
            Discord beitreten
          </Button>
          <Button variant="outline" size="lg">
            GitHub Repository
          </Button>
        </div>
      </div>
    </div>
  )
}
