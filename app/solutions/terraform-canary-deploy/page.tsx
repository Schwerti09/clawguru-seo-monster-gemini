import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"
import { BASE_URL } from "@/lib/config"
import { headers } from "next/headers"
import { DEFAULT_LOCALE, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import type { Metadata } from "next"

export const dynamic = "force-static"
export const revalidate = 86400

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Terraform Canary Deployment 2026 | Zero-Downtime mit Blue-Green",
    description: "Canary Deployments mit Terraform: Traffic-Shaping, Health-Probes, Progressive Rollouts, automatisches Rollback. Kompletter Guide für Zero-Downtime Infrastructure.",
    keywords: ["terraform canary deploy", "terraform blue green", "zero downtime deployment", "infrastructure as code", "terraform traffic splitting"],
    alternates: buildLocalizedAlternates(DEFAULT_LOCALE, "/solutions/terraform-canary-deploy"),
    openGraph: {
      title: "Terraform Canary Deployment Guide 2026",
      description: "Zero-Downtime Deployments mit Terraform: Canary, Blue-Green, automatisches Rollback",
      type: "article",
    },
  }
}

export default async function TerraformCanaryDeployPage() {
  const h = headers()
  const locale = (h.get("x-claw-locale") ?? DEFAULT_LOCALE) as Locale
  const prefix = `/${locale}`

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: "Terraform Canary Deployment Guide 2026",
    url: `${BASE_URL}${prefix}/solutions/terraform-canary-deploy`,
    datePublished: "2026-03-28",
    author: { "@type": "Organization", name: "ClawGuru", url: BASE_URL },
  }

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${BASE_URL}${prefix}` },
      { "@type": "ListItem", position: 2, name: "Solutions", item: `${BASE_URL}${prefix}/solutions` },
      { "@type": "ListItem", position: 3, name: "Terraform Canary", item: `${BASE_URL}${prefix}/solutions/terraform-canary-deploy` },
    ],
  }

  return (
    <Container>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <div className="py-16 max-w-4xl mx-auto">
        <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2">
            <li><a href={prefix} className="hover:text-cyan-400">ClawGuru</a></li>
            <li>/</li>
            <li><a href={`${prefix}/solutions`} className="hover:text-cyan-400">Solutions</a></li>
            <li>/</li>
            <li className="text-gray-300">Terraform Canary</li>
          </ol>
        </nav>

        <h1 className="text-4xl font-black mb-4 text-gray-100">Terraform Canary Deployment 2026</h1>
        <p className="text-lg text-gray-300 mb-8">Zero-Downtime Infrastructure Deployments mit Terraform. Canary, Blue-Green, automatisches Rollback und Observability für sichere Produktions-Updates.</p>

        <div className="mt-12 space-y-12">
          <section>
            <h2 className="text-2xl font-black text-white mb-4">Deployment-Strategien</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl border border-gray-800 bg-black/30">
                <div className="text-cyan-400 font-bold text-lg mb-2">Canary</div>
                <div className="text-sm text-gray-400">Progressiver Rollout: 5% → 25% → 50% → 100%. Frühe Fehlererkennung bei minimaler Impact.</div>
              </div>
              <div className="p-4 rounded-2xl border border-gray-800 bg-black/30">
                <div className="text-cyan-400 font-bold text-lg mb-2">Blue-Green</div>
                <div className="text-sm text-gray-400">Zwei identische Umgebungen. Instant-Switch mit sofortigem Rollback.</div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4">Terraform Implementierung</h2>
            <div className="p-6 rounded-3xl border border-gray-800 bg-black/25">
              <h3 className="text-xl font-bold text-white mb-3">AWS ALB mit Weighted Routing</h3>
              <pre className="mt-4 rounded-2xl border border-gray-800 bg-black/40 p-4 overflow-x-auto text-sm text-gray-300">
{`# Terraform: Canary Traffic Splitting
resource "aws_lb_target_group" "blue" {
  name     = "blue-tg"
  port     = 80
  protocol = "HTTP"
  vpc_id   = aws_vpc.main.id
}

resource "aws_lb_target_group" "green" {
  name     = "green-tg"
  port     = 80
  protocol = "HTTP"
  vpc_id   = aws_vpc.main.id
}

# Weighted Routing (80% Blue, 20% Green)
resource "aws_lb_listener_rule" "canary" {
  listener_arn = aws_lb_listener.https.arn
  priority     = 100

  action {
    type = "forward"
    forward {
      target_group {
        arn    = aws_lb_target_group.blue.arn
        weight = 80
      }
      target_group {
        arn    = aws_lb_target_group.green.arn
        weight = 20
      }
    }
  }
}`}
              </pre>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4">Health Checks & Auto-Rollback</h2>
            <div className="p-6 rounded-3xl border border-gray-800 bg-black/25">
              <ul className="space-y-3 text-gray-300">
                <li>• <strong>HTTP Health Probes:</strong> 200 OK vor Traffic-Shift</li>
                <li>• <strong>Error Rate Monitoring:</strong> Rollback bei &gt; 0.1% 5xx Errors</li>
                <li>• <strong>Latency Gates:</strong> p99 Latenz &lt; 500ms</li>
                <li>• <strong>Prometheus Metrics:</strong> Business KPIs als Gates</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4">Argo Rollouts Integration</h2>
            <div className="p-6 rounded-3xl border border-gray-800 bg-black/25">
              <pre className="rounded-2xl border border-gray-800 bg-black/40 p-4 overflow-x-auto text-sm text-gray-300">
{`# Argo Rollout: Progressive Delivery
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: my-app
spec:
  replicas: 10
  strategy:
    canary:
      steps:
      - setWeight: 10
      - pause: {duration: 2m}
      - setWeight: 25
      - pause: {duration: 5m}
      - analysis:
          templates:
          - templateName: success-rate
      - setWeight: 50
      - pause: {duration: 10m}
      - setWeight: 100`}
              </pre>
            </div>
          </section>
        </div>
      </div>
    </Container>
  )
}
