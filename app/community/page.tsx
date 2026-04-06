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
    name: "ClawBot Security Sentinel",
    description: "Autonomer Security-Agent für 24/7 Threat Detection mit SIEM Integration",
    category: "Security",
    difficulty: "Intermediate",
    downloads: "1.2K",
    rating: 4.7,
    tags: ["security", "monitoring", "siem", "threat-detection"],
    features: [
      "Real-time Threat Detection",
      "Automated Incident Response", 
      "SIEM Integration (Splunk, ELK)",
      "Custom Rule Engine"
    ],
    link: "/securitycheck"
  },
  {
    name: "MoltBot Infrastructure Manager",
    description: "Operations-Agent für Infrastructure Automation und Auto-Healing",
    category: "Operations", 
    difficulty: "Advanced",
    downloads: "890",
    rating: 4.5,
    tags: ["ops", "automation", "infrastructure", "devops"],
    features: [
      "Infrastructure-as-Code",
      "Auto-Healing Systems",
      "Performance Monitoring",
      "Cost Optimization"
    ],
    link: "/solutions/infrastructure"
  },
  {
    name: "ClawBot Compliance Auditor",
    description: "Automated Compliance & Audit Agent für Security Posture Management",
    category: "Compliance",
    difficulty: "Expert",
    downloads: "567",
    rating: 4.8,
    tags: ["compliance", "audit", "security", "reporting"],
    features: [
      "CIS Benchmarks Validation",
      "Automated Reporting",
      "Policy Enforcement",
      "Evidence Collection"
    ],
    link: "/solutions/compliance"
  },
  {
    name: "MoltBot Deployment Engine",
    description: "Zero-Touch Deployment Agent mit GitOps Integration",
    category: "Deployment",
    difficulty: "Intermediate", 
    downloads: "734",
    rating: 4.6,
    tags: ["deployment", "cicd", "gitops", "automation"],
    features: [
      "GitOps Integration",
      "Automated Rollback",
      "Multi-Cloud Support",
      "Blue-Green Deployments"
    ],
    link: "/solutions/deployment"
  }
]

const INTEGRATION_GUIDES = [
  {
    title: "Security Check mit ClawBot",
    description: "Komplette Anleitung für Security Hardening Checks und Compliance",
    difficulty: "Beginner",
    readTime: "10 min",
    category: "Security",
    link: "/securitycheck"
  },
  {
    title: "Runbook Generator Setup",
    description: "Automatisierte Runbook-Erstellung mit AI Integration",
    difficulty: "Intermediate", 
    readTime: "12 min",
    category: "Automation",
    link: "/runbooks"
  },
  {
    title: "Neuro AI Threat Intelligence",
    description: "AI-gestützte Threat Detection und Pattern Recognition",
    difficulty: "Advanced",
    readTime: "15 min", 
    category: "AI/ML",
    link: "/neuro"
  },
  {
    title: "Oracle Security Intelligence",
    description: "Security Oracle für Threat Intelligence Integration",
    difficulty: "Intermediate",
    readTime: "8 min",
    category: "Intelligence",
    link: "/oracle"
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
                    <Button size="sm" className="flex-1" asChild>
                      <Link href={agent.link}>
                        {agent.category === "Security" ? "Security Check" : 
                         agent.category === "Operations" ? "Infrastructure" :
                         agent.category === "Compliance" ? "Compliance" : "Deployment"}
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/docs">Docs</Link>
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
                    <Button size="sm" className="flex-1" asChild>
                      <Link href={guide.link}>Guide starten</Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/docs">Dokumentation</Link>
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
            <h2 className="text-3xl font-bold mb-4">ClawBot & MoltBot Ressourcen</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Offizielle Tools, Dokumentation und Ressourcen für die ClawBot & MoltBot Entwicklung.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>� Security Tools</CardTitle>
                <CardDescription>Security Check Tools und Hardening Utilities</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" asChild>
                  <Link href="/securitycheck">Security Check</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>📚 Runbook Library</CardTitle>
                <CardDescription>AI-generierte Security Runbooks und Best Practices</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" asChild>
                  <Link href="/runbooks">Runbooks</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🧠 Neuro AI Engine</CardTitle>
                <CardDescription>AI-gestützte Threat Intelligence und Pattern Recognition</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" asChild>
                  <Link href="/neuro">Neuro AI</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>🔮 Oracle Intelligence</CardTitle>
                <CardDescription>Security Oracle für Threat Intelligence Integration</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" asChild>
                  <Link href="/oracle">Oracle</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🛡️ Enterprise Solutions</CardTitle>
                <CardDescription>Enterprise-grade Security und Compliance Lösungen</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" asChild>
                  <Link href="/solutions">Solutions</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>📖 Documentation</CardTitle>
                <CardDescription>Komplette API-Dokumentation und Architecture Guides</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" asChild>
                  <Link href="/docs">Docs</Link>
                </Button>
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
                  Entwickle deinen eigenen AI Agent mit unseren Security Tools und Best Practices.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="text-sm space-y-2">
                  <li>• Security Check Framework</li>
                  <li>• AI Integration mit Neuro Engine</li>
                  <li>• Runbook Generator Templates</li>
                  <li>• Oracle Intelligence Integration</li>
                </ul>
                <Button className="w-full" asChild>
                  <Link href="/securitycheck">Agent entwickeln</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>📖 Security Guides erstellen</CardTitle>
                <CardDescription>
                  Teile dein Wissen mit Security Hardening Guides und Best Practices.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="text-sm space-y-2">
                  <li>• Runbook Templates</li>
                  <li>• Security Check Examples</li>
                  <li>• Best Practice Guides</li>
                  <li>• Community Review</li>
                </ul>
                <Button className="w-full" asChild>
                  <Link href="/runbooks">Guide erstellen</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* CTA Section */}
      <div className="text-center mt-16 p-8 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Bereit für autonomes Security Management?</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Starte jetzt mit unseren Security Tools und entdecke die Zukunft der automatisierten Security-Checks.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/securitycheck">Security Check starten</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/runbooks">Runbooks entdecken</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
