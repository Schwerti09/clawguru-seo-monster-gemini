import { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Community Resources | ClawBot & MoltBot Downloads & Tools",
  description: "Download Center für ClawBot & MoltBot. Agent Templates, Dev Tools, CLI Utilities, Documentation und Community Ressourcen.",
  openGraph: {
    title: "Community Resources | ClawBot & MoltBot",
    description: "Download Center und Ressourcen für die AI Agent Community",
    url: "https://clawguru.org/resources",
    siteName: "ClawGuru",
    images: [{
      url: "/og-resources.jpg",
      width: 1200,
      height: 630,
      alt: "Community Resources"
    }],
    locale: "de_DE",
    type: "website",
  },
}

const RESOURCE_CATEGORIES = [
  {
    id: "downloads",
    name: "Downloads",
    description: "Agent Downloads, Templates und Binaries",
    icon: "📥",
    count: 24
  },
  {
    id: "tools",
    name: "Dev Tools",
    description: "CLI Tools, Debugging Utilities und Development Kits",
    icon: "🔧",
    count: 18
  },
  {
    id: "templates",
    name: "Templates",
    description: "Agent Templates, Config Files und Deployment Manifests",
    icon: "📋",
    count: 32
  },
  {
    id: "documentation",
    name: "Documentation",
    description: "API Docs, Architecture Guides und Reference Materials",
    icon: "📚",
    count: 45
  },
  {
    id: "community",
    name: "Community",
    description: "Forums, Discord und Community Contributions",
    icon: "👥",
    count: 12
  }
]

const FEATURED_DOWNLOADS = [
  {
    name: "ClawBot Sentinel Pro",
    description: "Enterprise Security Agent mit Advanced Threat Detection",
    version: "v3.2.1",
    size: "245 MB",
    downloads: "5.2K",
    rating: 4.9,
    license: "Commercial",
    platform: ["Linux x64", "Docker", "Kubernetes"],
    type: "Agent Binary",
    features: [
      "Real-time Threat Detection",
      "SIEM Integration", 
      "Automated Response",
      "ML-based Analysis"
    ],
    requirements: [
      "Linux x64 4.15+",
      "8GB RAM minimum",
      "2 CPU cores",
      "Network access"
    ]
  },
  {
    name: "MoltBot OpsMaster",
    description: "Autonomous Infrastructure Management Agent",
    version: "v2.8.0",
    size: "189 MB",
    downloads: "3.1K",
    rating: 4.7,
    license: "MIT",
    platform: ["Linux x64", "Windows", "macOS", "Docker"],
    type: "Agent Binary",
    features: [
      "Infrastructure Automation",
      "Auto-Healing",
      "Cost Optimization",
      "Multi-Cloud Support"
    ],
    requirements: [
      "Any OS with Docker",
      "4GB RAM minimum",
      "2 CPU cores",
      "Cloud API access"
    ]
  },
  {
    name: "ClawBot CLI Tools",
    description: "Command Line Interface für ClawBot Management und Configuration",
    version: "v1.9.0",
    size: "45 MB",
    downloads: "8.7K",
    rating: 4.8,
    license: "Free",
    platform: ["Linux x64", "Windows", "macOS"],
    type: "CLI Tool",
    features: [
      "Agent Management",
      "Configuration CLI",
      "Debug Tools",
      "Batch Operations"
    ],
    requirements: [
      "Node.js 16+",
      "2GB RAM",
      "Network access",
      "Admin permissions"
    ]
  },
  {
    name: "MoltBot Development Kit",
    description: "Complete Development Kit für Custom MoltBot Agents",
    version: "v2.1.0",
    size: "567 MB",
    downloads: "1.2K",
    rating: 4.6,
    license: "MIT",
    platform: ["Linux x64", "Windows", "macOS"],
    type: "Development Kit",
    features: [
      "Agent Framework",
      "Testing Suite",
      "Code Templates",
      "Documentation"
    ],
    requirements: [
      "Node.js 18+",
      "Docker",
      "8GB RAM",
      "IDE with TypeScript"
    ]
  }
]

const DEV_TOOLS = [
  {
    name: "ClawBot Debugger",
    description: "Advanced Debugging Tool für ClawBot Agent Development",
    version: "v1.5.2",
    type: "Debug Tool",
    downloads: "2.1K",
    rating: 4.7,
    features: ["Real-time Debug", "Performance Profiling", "Memory Analysis", "Log Tracing"]
  },
  {
    name: "MoltBot Config Generator",
    description: "GUI Tool für MoltBot Configuration und Template Generation",
    version: "v2.0.1",
    type: "Config Tool",
    downloads: "3.4K",
    rating: 4.5,
    features: ["Visual Config", "Template Wizard", "Validation", "Export Options"]
  },
  {
    name: "Agent Performance Monitor",
    description: "Real-time Performance Monitoring für AI Agents",
    version: "v1.8.0",
    type: "Monitor Tool",
    downloads: "1.8K",
    rating: 4.8,
    features: ["Live Metrics", "Resource Usage", "Alert System", "Historical Data"]
  },
  {
    name: "Integration Test Suite",
    description: "Automated Testing Framework für Agent Integration",
    version: "v3.1.0",
    type: "Testing Tool",
    downloads: "980",
    rating: 4.6,
    features: ["Integration Tests", "Mock Services", "CI/CD Integration", "Report Generation"]
  }
]

const TEMPLATES = [
  {
    name: "Security Agent Template",
    description: "Complete Template für Custom Security Agents",
    category: "Security",
    type: "Agent Template",
    downloads: "1.5K",
    rating: 4.8,
    files: ["agent.py", "config.yaml", "requirements.txt", "README.md"],
    features: ["Threat Detection", "Alert System", "SIEM Integration", "Custom Rules"]
  },
  {
    name: "Kubernetes Deployment Templates",
    description: "Production-ready K8s Deployment Manifests",
    category: "Deployment",
    type: "K8s Templates",
    downloads: "2.3K",
    rating: 4.7,
    files: ["deployment.yaml", "service.yaml", "ingress.yaml", "configmap.yaml"],
    features: ["Auto-scaling", "Health Checks", "Resource Limits", "Rollback"]
  },
  {
    name: "Docker Compose Templates",
    description: "Multi-service Docker Compose Setups",
    category: "Development",
    type: "Docker Templates",
    downloads: "3.1K",
    rating: 4.6,
    files: ["docker-compose.yml", "Dockerfile", ".env.example", "docker-compose.prod.yml"],
    features: ["Multi-service", "Environment Config", "Volume Management", "Networking"]
  },
  {
    name: "CI/CD Pipeline Templates",
    description: "GitHub Actions und GitLab CI Templates",
    category: "CI/CD",
    type: "Pipeline Templates",
    downloads: "1.9K",
    rating: 4.5,
    files: [".github/workflows/ci.yml", ".gitlab-ci.yml", "Dockerfile", "deploy.sh"],
    features: ["Automated Testing", "Docker Build", "Deployment", "Rollback"]
  }
]

interface ResourcesPageProps {
  dict?: any
  locale?: string
}

export default function ResourcesPage({ dict, locale = "de" }: ResourcesPageProps = {}) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
          Community Resources
        </div>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          ClawBot & MoltBot Resource Hub
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Download Center für Agent Binaries, Dev Tools, Templates und Documentation. 
          Alles was du für deine ClawBot & MoltBot Entwicklung brauchst.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="#downloads">Downloads</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="#tools">Dev Tools</Link>
          </Button>
        </div>
      </div>

      {/* Categories Overview */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Ressourcen Kategorien</h2>
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
          {RESOURCE_CATEGORIES.map((category) => (
            <Card key={category.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">{category.icon}</div>
                <h3 className="font-semibold mb-1">{category.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{category.description}</p>
                <Badge variant="secondary">{category.count} Items</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="downloads" className="space-y-8">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="downloads">Downloads</TabsTrigger>
          <TabsTrigger value="tools">Dev Tools</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="docs">Documentation</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
        </TabsList>

        {/* Downloads Tab */}
        <TabsContent value="downloads" id="downloads" className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Agent Downloads</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Offizielle ClawBot & MoltBot Agent Binaries für verschiedene Plattformen.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {FEATURED_DOWNLOADS.map((download, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-xl">{download.name}</CardTitle>
                        <Badge variant="outline">{download.type}</Badge>
                        <Badge variant="secondary">{download.license}</Badge>
                      </div>
                      <CardDescription className="text-base">{download.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>v{download.version}</span>
                    <span>•</span>
                    <span>💾 {download.size}</span>
                    <span>•</span>
                    <span>📥 {download.downloads}</span>
                    <span>•</span>
                    <span>⭐ {download.rating}</span>
                  </div>

                  {/* Platform Support */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Plattformen:</h4>
                    <div className="flex flex-wrap gap-1">
                      {download.platform.map((platform, platformIndex) => (
                        <Badge key={platformIndex} variant="outline" className="text-xs">
                          {platform}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Features:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {download.features.slice(0, 3).map((feature, featureIndex) => (
                        <li key={featureIndex}>• {feature}</li>
                      ))}
                      {download.features.length > 3 && (
                        <li className="text-primary">• +{download.features.length - 3} weitere</li>
                      )}
                    </ul>
                  </div>

                  {/* Requirements */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">System-Voraussetzungen:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {download.requirements.slice(0, 2).map((req, reqIndex) => (
                        <li key={reqIndex}>• {req}</li>
                      ))}
                      {download.requirements.length > 2 && (
                        <li className="text-primary">• +{download.requirements.length - 2} weitere</li>
                      )}
                    </ul>
                  </div>

                  {/* Download Actions */}
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      Download {download.license === "Commercial" ? "Trial" : ""}
                    </Button>
                    <Button variant="outline" size="sm">
                      Docs
                    </Button>
                    <Button variant="outline" size="sm">
                      Changelog
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Dev Tools Tab */}
        <TabsContent value="tools" id="tools" className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Development Tools</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              CLI Tools, Debugging Utilities und Development Kits für die Agent Entwicklung.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {DEV_TOOLS.map((tool, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{tool.name}</CardTitle>
                      <CardDescription className="mt-1">{tool.description}</CardDescription>
                    </div>
                    <Badge variant="secondary">{tool.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>v{tool.version}</span>
                    <span>•</span>
                    <span>📥 {tool.downloads}</span>
                    <span>•</span>
                    <span>⭐ {tool.rating}</span>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Features:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {tool.features.map((feature, featureIndex) => (
                        <li key={featureIndex}>• {feature}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      Download
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

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Agent Templates</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ready-to-use Templates für Custom Agent Development und Deployment.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {TEMPLATES.map((template, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription className="mt-1">{template.description}</CardDescription>
                    </div>
                    <Badge variant="secondary">{template.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Badge variant="outline">{template.type}</Badge>
                    <span>📥 {template.downloads}</span>
                    <span>•</span>
                    <span>⭐ {template.rating}</span>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Enthaltene Dateien:</h4>
                    <div className="flex flex-wrap gap-1">
                      {template.files.map((file, fileIndex) => (
                        <Badge key={fileIndex} variant="outline" className="text-xs">
                          {file}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Features:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {template.features.slice(0, 3).map((feature, featureIndex) => (
                        <li key={featureIndex}>• {feature}</li>
                      ))}
                      {template.features.length > 3 && (
                        <li className="text-primary">• +{template.features.length - 3} weitere</li>
                      )}
                    </ul>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      Preview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Documentation Tab */}
        <TabsContent value="docs" className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Documentation</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Komplette API-Dokumentation, Architecture Guides und Reference Materials.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>📚 API Documentation</CardTitle>
                <CardDescription>Komplette REST API und GraphQL Dokumentation</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">API Docs</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🏗️ Architecture Guides</CardTitle>
                <CardDescription>System Architecture und Design Patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Architecture</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🔧 Reference Materials</CardTitle>
                <CardDescription>Configuration Reference und Best Practices</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Reference</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Community Tab */}
        <TabsContent value="community" className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Community</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Trete der ClawBot & MoltBot Community bei und vernetze dich mit anderen Entwicklern.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>💬 Discord Community</CardTitle>
                <CardDescription>
                  Tritt unserem Discord Server bei für Live-Support und Diskussionen.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="text-sm space-y-2">
                  <li>• 24/7 Community Support</li>
                  <li>• Agent Development Help</li>
                  <li>• Feature Requests</li>
                  <li>• Community Events</li>
                </ul>
                <Button className="w-full">Discord beitreten</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🐙 GitHub Repository</CardTitle>
                <CardDescription>
                  Contribute zu OpenClaw & MoltBot auf GitHub.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="text-sm space-y-2">
                  <li>• Source Code Access</li>
                  <li>• Issue Tracking</li>
                  <li>• Pull Requests</li>
                  <li>• Community Contributions</li>
                </ul>
                <Button className="w-full">GitHub Repository</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* CTA Section */}
      <Alert className="mt-12">
        <AlertDescription className="text-center py-4">
          <div className="text-lg font-semibold mb-2">Fehlt etwas?</div>
          <p className="text-muted-foreground mb-4">
            Hast du Ressourcen oder Tools, die du mit der Community teilen möchtest?
          </p>
          <div className="flex gap-4 justify-center">
            <Button>Ressource einreichen</Button>
            <Button variant="outline">Contribution Guidelines</Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  )
}
