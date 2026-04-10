import type { Metadata } from "next";
import { SUPPORTED_LOCALES, type Locale, localeAlternates } from "@/lib/i18n";
import { BASE_URL } from "@/lib/config";
import { getCoreSecurityLinks } from "@/lib/core-security-links";

export const dynamic = "force-static";
export const revalidate = 86400;
export const runtime = "nodejs";

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale)
    ? params.lang
    : "de") as Locale;

  return {
    title: locale === "de" 
      ? "WAF 2027: Web Application Firewall Guide | Cloud & On-Premise"
      : "WAF 2027: Web Application Firewall Guide | Cloud & On-Premise",
    description: locale === "de"
      ? "Umfassender WAF Guide 2027: Cloudflare, AWS WAF, ModSecurity, OWASP CRS. Rule-Sets, DDoS Protection, Bot Management & Zero Day Defense."
      : "Comprehensive WAF Guide 2027: Cloudflare, AWS WAF, ModSecurity, OWASP CRS. Rule-sets, DDoS protection, bot management & zero day defense.",
    keywords: [
      "WAF 2027",
      "Web Application Firewall",
      "Cloudflare WAF",
      "AWS WAF",
      "ModSecurity",
      "OWASP CRS",
      "WAF rules",
      "WAF configuration",
      "DDoS protection",
      "Bot management",
      "WAAP",
      "WAF security",
      "WAF best practices",
    ],
    alternates: {
      ...localeAlternates(`/${locale}/waf-2027`),
    },
    openGraph: {
      title: "WAF 2027: Complete Web Application Firewall Guide",
      description: "Enterprise WAF configuration for Cloudflare, AWS, Azure. DDoS, bot protection, OWASP Top 10 defense.",
      type: "article",
      url: `${BASE_URL}/${locale}/waf-2027`,
    },
  };
}

export default async function WAF2027Page({
  params,
}: {
  params: { lang: string };
}) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale)
    ? params.lang
    : "de") as Locale;
  const prefix = `/${locale}`;
  const coreLinks = getCoreSecurityLinks(locale);

  const isGerman = locale === "de";

  return (
    <main className="min-h-screen bg-gray-800">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-red-600 to-purple-800 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-400/30 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-sm mb-4">
              <span className="w-2 h-2 rounded-full bg-orange-300 animate-pulse" />
              Web Application Security 2027
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              WAF 2027
            </h1>
            <p className="text-2xl text-orange-100 mb-4 font-light">
              {isGerman 
                ? "Web Application Firewall für Enterprise Security"
                : "Web Application Firewall for Enterprise Security"}
            </p>
            <p className="text-xl text-orange-50/80 mb-8">
              {isGerman
                ? "Cloudflare, AWS WAF, ModSecurity & OWASP CRS. Zero Day Defense, Bot Management, API Protection."
                : "Cloudflare, AWS WAF, ModSecurity & OWASP CRS. Zero day defense, bot management, API protection."}
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">OWASP Top 10</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">DDoS Protection</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Bot Management</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Zero Day Rules</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* WAF Overview */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">
              {isGerman ? "Was ist eine WAF 2027?" : "What is a WAF in 2027?"}
            </h2>
            
            <p className="text-gray-200 text-lg mb-6 leading-relaxed">
              {isGerman
                ? "Eine Web Application Firewall (WAF) schützt Webanwendungen vor HTTP-basierten Angriffen. 2027 sind WAFs evolutioniert zu WAAPs (Web Application & API Protection) mit KI-gestützter Bedrohungserkennung, automatischer Zero-Day-Defense und API-spezifischem Schutz."
                : "A Web Application Firewall (WAF) protects web applications from HTTP-based attacks. In 2027, WAFs have evolved into WAAPs (Web Application & API Protection) with AI-powered threat detection, automatic zero-day defense, and API-specific protection."}
            </p>

            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-700 rounded-xl p-5 text-center">
                <div className="text-3xl mb-2">🛡️</div>
                <h3 className="font-semibold text-gray-100 text-sm">Layer 7 Protection</h3>
                <p className="text-xs text-slate-600 mt-1">Application Layer Defense</p>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-700 rounded-xl p-5 text-center">
                <div className="text-3xl mb-2">🤖</div>
                <h3 className="font-semibold text-gray-100 text-sm">Bot Management</h3>
                <p className="text-xs text-slate-600 mt-1">Good vs Bad Bots</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-700 rounded-xl p-5 text-center">
                <div className="text-3xl mb-2">⚡</div>
                <h3 className="font-semibold text-gray-100 text-sm">DDoS Mitigation</h3>
                <p className="text-xs text-slate-600 mt-1">Volumetric Attacks</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-700 rounded-xl p-5 text-center">
                <div className="text-3xl mb-2">🔐</div>
                <h3 className="font-semibold text-gray-100 text-sm">API Protection</h3>
                <p className="text-xs text-slate-600 mt-1">Schema Validation</p>
              </div>
            </div>

            {/* WAF Providers 2027 */}
            <div className="bg-slate-900 rounded-xl p-6 text-slate-300">
              <h3 className="text-white font-semibold mb-4">Top WAF Providers 2027</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-slate-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-orange-400 font-bold">Cloudflare</span>
                    <span className="text-xs bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded">#1</span>
                  </div>
                  <ul className="text-xs space-y-1">
                    <li>• Managed Rulesets</li>
                    <li>• Bot Management</li>
                    <li>• Rate Limiting</li>
                    <li>• DDoS Protection</li>
                  </ul>
                </div>
                <div className="bg-slate-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-yellow-400 font-bold">AWS WAF</span>
                    <span className="text-xs bg-amber-9000/20 text-yellow-300 px-2 py-0.5 rounded">Native</span>
                  </div>
                  <ul className="text-xs space-y-1">
                    <li>• ACL Rules</li>
                    <li>• Managed Rule Groups</li>
                    <li>• Bot Control</li>
                    <li>• ATP Protection</li>
                  </ul>
                </div>
                <div className="bg-slate-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-blue-400 font-bold">ModSecurity</span>
                    <span className="text-xs bg-blue-9000/20 text-blue-300 px-2 py-0.5 rounded">Open</span>
                  </div>
                  <ul className="text-xs space-y-1">
                    <li>• OWASP CRS</li>
                    <li>• Custom Rules</li>
                    <li>• Self-Hosted</li>
                    <li>• Coraza Engine</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* OWASP CRS */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">OWASP Core Rule Set 4.0</h2>
            
            <p className="text-gray-200 mb-6">
              {isGerman
                ? "Das OWASP Core Rule Set (CRS) ist die Industriestandard-Regelsammlung für WAFs. Version 4.0 (2027) enthält verbesserte Regeln für moderne Angriffsmuster."
                : "The OWASP Core Rule Set (CRS) is the industry-standard rule collection for WAFs. Version 4.0 (2027) includes improved rules for modern attack patterns."}
            </p>

            <div className="bg-gray-800 border border-slate-200 rounded-xl overflow-hidden mb-6">
              <div className="bg-slate-100 px-6 py-3 border-b border-slate-200">
                <span className="font-semibold text-gray-200">CRS 4.0 Paranoia Levels</span>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 text-center font-bold text-green-400">PL 1</div>
                    <div className="flex-1 bg-slate-200 rounded-full h-2">
                      <div className="bg-green-9000 h-2 rounded-full" style={{width: "20%"}} />
                    </div>
                    <div className="text-sm text-slate-600">Baseline - Low False Positives</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 text-center font-bold text-yellow-400">PL 2</div>
                    <div className="flex-1 bg-slate-200 rounded-full h-2">
                      <div className="bg-amber-9000 h-2 rounded-full" style={{width: "40%"}} />
                    </div>
                    <div className="text-sm text-slate-600">Enhanced - Balanced Security</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 text-center font-bold text-orange-400">PL 3</div>
                    <div className="flex-1 bg-slate-200 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{width: "60%"}} />
                    </div>
                    <div className="text-sm text-slate-600">High Security - More False Positives</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 text-center font-bold text-red-400">PL 4</div>
                    <div className="flex-1 bg-slate-200 rounded-full h-2">
                      <div className="bg-red-9000 h-2 rounded-full" style={{width: "80%"}} />
                    </div>
                    <div className="text-sm text-slate-600">Maximum Security - High FPs</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <h3 className="text-white font-semibold mb-4">ModSecurity CRS 4.0 Configuration</h3>
              <pre className="font-mono text-sm text-green-400">
{`# crs-setup.conf - OWASP CRS 4.0
SecAction \\
    "id:900000, \\
    phase:1, \\
    nolog, \\
    pass, \\
    t:none, \\
    setvar:tx.paranoia_level=2"

# Enable Core Rules
Include /etc/modsecurity/crs/rules/*.conf

# Custom Exclusions
SecRule REQUEST_URI "@streq /api/webhook" \\
    "id:1000,phase:1,pass,nolog, \\
    ctl:ruleRemoveById=942100"

# Rate Limiting
SecAction \\
    "id:9007000, \\
    phase:1, \\
    nolog, \\
    pass, \\
    t:none, \\
    setvar:'tx.ratelimit_api=100/60'"`}
              </pre>
            </div>
          </section>

          {/* Cloudflare WAF */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">Cloudflare WAF 2027</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-orange-50 border border-orange-700 rounded-xl p-6">
                <h3 className="font-semibold text-orange-900 mb-3">Managed Rulesets</h3>
                <ul className="space-y-2 text-sm text-orange-800">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full" />
                    Cloudflare Managed Rules
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full" />
                    OWASP Core Ruleset
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full" />
                    Exposed Credentials Check
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full" />
                    New Managed Rules (AI-powered)
                  </li>
                </ul>
              </div>
              <div className="bg-red-900 border border-red-700 rounded-xl p-6">
                <h3 className="font-semibold text-red-900 mb-3">Bot Management</h3>
                <ul className="space-y-2 text-sm text-red-300">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-9000 rounded-full" />
                    Static Resource Protection
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-9000 rounded-full" />
                    JavaScript Detections
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-9000 rounded-full" />
                    ML-based Bot Scoring
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-9000 rounded-full" />
                    Browser Integrity Check
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <h3 className="text-white font-semibold mb-4">Cloudflare WAF Custom Rule (Terraform)</h3>
              <pre className="font-mono text-sm text-green-400">
{`resource "cloudflare_ruleset" "waf_custom" {
  zone_id = var.zone_id
  name    = "Custom WAF Rules"
  kind    = "zone"
  phase   = "http_request_firewall_custom"

  rules {
    action      = "block"
    expression  = <<EOF
      (http.request.uri.path contains "/admin" and 
       not ip.src in $office_ips) or
      (http.request.headers["user-agent"] contains "sqlmap")
    EOF
    description = "Block admin access from non-office IPs"
    enabled     = true
  }

  rules {
    action      = "managed_challenge"
    expression  = "cf.bot_management.score lt 30"
    description = "Challenge low-reputation bots"
    enabled     = true
  }
}`}
              </pre>
            </div>
          </section>

          {/* AWS WAF */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">AWS WAF 2027</h2>
            
            <div className="bg-gray-800 border border-slate-200 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-gray-100 mb-4">AWS WAF Key Features 2027</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-100 mb-2">Managed Rule Groups</h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• Core Rule Set (CRS)</li>
                    <li>• Known Bad Inputs</li>
                    <li>• SQLi protection</li>
                    <li>• Linux/Windows OS protection</li>
                    <li>• WordPress/PHP protection</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-100 mb-2">Bot Control & ATP</h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• Targeted Bot Protection</li>
                    <li>• Account Takeover Prevention</li>
                    <li>• Credential Stuffing Defense</li>
                    <li>• Scraping Protection</li>
                    <li>• Carding Protection</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <h3 className="text-white font-semibold mb-4">AWS WAF WebACL (CDK)</h3>
              <pre className="font-mono text-sm text-green-400">
{`const waf = new wafv2.CfnWebACL(this, 'WAF', {
  name: 'production-waf',
  scope: 'REGIONAL',
  defaultAction: { allow: {} },
  
  rules: [
    // AWS Managed Core Rule Set
    {
      name: 'AWSManagedRulesCommonRuleSet',
      priority: 1,
      statement: {
        managedRuleGroupStatement: {
          vendorName: 'AWS',
          name: 'AWSManagedRulesCommonRuleSet',
          ruleActionOverrides: [{
            actionToUse: { count: {} },
            name: 'SizeRestrictions_BODY'
          }]
        }
      },
      overrideAction: { none: {} },
      visibilityConfig: {
        sampledRequestsEnabled: true,
        cloudWatchMetricsEnabled: true,
        metricName: 'AWSManagedRulesCommonRuleSetMetric'
      }
    },
    // Rate Limiting
    {
      name: 'RateLimitRule',
      priority: 2,
      statement: {
        rateBasedStatement: {
          limit: 2000,
          aggregateKeyType: 'IP'
        }
      },
      action: { block: {} },
      visibilityConfig: {
        sampledRequestsEnabled: true,
        cloudWatchMetricsEnabled: true,
        metricName: 'RateLimitRuleMetric'
      }
    }
  ],
  visibilityConfig: {
    sampledRequestsEnabled: true,
    cloudWatchMetricsEnabled: true,
    metricName: 'production-waf-metric'
  }
});`}
              </pre>
            </div>
          </section>

          {/* WAF Checklist */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">WAF 2027 Security Checklist</h2>
            
            <div className="bg-gray-800 border border-slate-200 rounded-xl p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-100 mb-4">Core Protection</h3>
                  {[
                    "OWASP Top 10 rules enabled",
                    "SQL Injection protection active",
                    "XSS protection configured",
                    "Command injection rules",
                    "LFI/RFI protection enabled",
                    "XML/XXE protection",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0">
                      <span className="w-5 h-5 rounded border-2 border-slate-300 flex items-center justify-center text-xs text-slate-400">☐</span>
                      <span className="text-gray-200 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-100 mb-4">Advanced Protection</h3>
                  {[
                    "Rate limiting configured",
                    "Bot management active",
                    "DDoS protection enabled",
                    "API security rules",
                    "Geo-blocking (if needed)",
                    "Custom rules for business logic",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0">
                      <span className="w-5 h-5 rounded border-2 border-slate-300 flex items-center justify-center text-xs text-slate-400">☐</span>
                      <span className="text-gray-200 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">
              {isGerman ? "WAF-Regeln optimieren?" : "Optimize your WAF rules?"}
            </h2>
            <p className="mb-6 max-w-2xl mx-auto">
              {isGerman
                ? "Nutzen Sie ClawGuru für automatisierte WAF-Tuning und Bedrohungs-Monitoring."
                : "Use ClawGuru for automated WAF tuning and threat monitoring."}
            </p>
            <a 
              href={coreLinks.check} 
              className="inline-block px-6 py-3 bg-gray-800 text-orange-700 rounded-lg font-semibold hover:bg-slate-100 transition-colors"
            >
              {isGerman ? "WAF Assessment Starten" : "Start WAF Assessment"}
            </a>
          </section>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: "WAF 2027: Web Application Firewall Guide",
        author: { "@type": "Organization", name: "ClawGuru", url: BASE_URL },
        datePublished: "2026-03-29",
      })}} />
    </main>
  );
}
