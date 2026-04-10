import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from '@/lib/i18n'

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const { lang } = params;
  return {
    title: 'Moltbot Security Posture Score: Risk Assessment & Metrics 2024',
    description: 'Security Posture Score für Moltbot. Risk Assessment, Security Metrics, Posture Management, Compliance Scoring und Security KPIs.',
    keywords: ['moltbot security posture score','risk assessment','security metrics','posture management','compliance scoring','security kpis'],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: { title: 'Moltbot Security Posture Score 2024', description: 'Security Posture Score für Moltbot.', type: 'article', url: `https://clawguru.org/${lang}/moltbot/security-posture-score` },
    alternates: buildLocalizedAlternates(lang as Locale, '/moltbot/security-posture-score'),
    robots: 'index, follow',
  };
}

export default function MoltbotPostureScorePage({ params }: { params: { lang: string } }) {
  const { lang } = params;
  if (!SUPPORTED_LOCALES.includes(lang as Locale)) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Trust-Anker</strong>: Security Posture Score bewertet eigene Sicherheitslage. Keine Angriffswerkzeuge.
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">Moltbot Security Posture Score</h1>
        <p className="text-lg text-gray-300 mb-8">Ohne Messung keine Verbesserung. Security Posture Scores machen Sicherheitslücken sichtbar und priorisieren Maßnahmen.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Security Posture Score Framework</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead><tr className="bg-gray-800 text-white"><th className="p-3 text-left">Kategorie</th><th className="p-3 text-left">Gewichtung</th><th className="p-3 text-left">Metriken</th><th className="p-3 text-left">Score-Bereich</th></tr></thead>
              <tbody>
                {[
                  ['Infrastructure Security', '25%', 'Patch Level, Configuration, Network', '0-100'],
                  ['Application Security', '30%', 'Code Analysis, Dependencies, Runtime', '0-100'],
                  ['Data Protection', '20%', 'Encryption, Access Control, DLP', '0-100'],
                  ['Compliance', '15%', 'Audits, Documentation, Controls', '0-100'],
                  ['Monitoring', '10%', 'Logging, Alerting, Response', '0-100'],
                ].map(([category, weight, metrics, range]) => (
                  <tr key={category} className="border-b hover:bg-gray-800">
                    <td className="p-3 font-medium">{category}</td>
                    <td className="p-3 text-sm">{weight}</td>
                    <td className="p-3 text-sm">{metrics}</td>
                    <td className="p-3 text-sm">{range}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Score Calculation Engine</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
            <pre>{`// Security Posture Score Engine für Moltbot
class SecurityPostureScorer {
  constructor() {
    this.categories = {
      infrastructure: { weight: 0.25, checks: [] },
      application: { weight: 0.30, checks: [] },
      data: { weight: 0.20, checks: [] },
      compliance: { weight: 0.15, checks: [] },
      monitoring: { weight: 0.10, checks: [] }
    };
    
    this.initializeChecks();
  }
  
  initializeChecks() {
    // Infrastructure Checks
    this.categories.infrastructure.checks = [
      {
        name: 'patch_level',
        weight: 0.4,
        evaluate: () => this.checkPatchLevel()
      },
      {
        name: 'configuration_hardening',
        weight: 0.3,
        evaluate: () => this.checkConfigurationHardening()
      },
      {
        name: 'network_security',
        weight: 0.3,
        evaluate: () => this.checkNetworkSecurity()
      }
    ];
    
    // Application Checks
    this.categories.application.checks = [
      {
        name: 'code_vulnerabilities',
        weight: 0.4,
        evaluate: () => this.checkCodeVulnerabilities()
      },
      {
        name: 'dependency_vulnerabilities',
        weight: 0.3,
        evaluate: () => this.checkDependencyVulnerabilities()
      },
      {
        name: 'runtime_protection',
        weight: 0.3,
        evaluate: () => this.checkRuntimeProtection()
      }
    ];
  }
  
  async calculateScore() {
    const results = {};
    let totalScore = 0;
    
    for (const [categoryName, category] of Object.entries(this.categories)) {
      let categoryScore = 0;
      let categoryWeight = 0;
      
      for (const check of category.checks) {
        const result = await check.evaluate();
        const weightedScore = result.score * check.weight;
        categoryScore += weightedScore;
        categoryWeight += check.weight;
        
        results[categoryName + '_' + check.name] = result;
      }
      
      const normalizedCategoryScore = categoryScore / categoryWeight;
      const weightedCategoryScore = normalizedCategoryScore * category.weight;
      totalScore += weightedCategoryScore;
      
      results[categoryName] = {
        score: normalizedCategoryScore,
        weighted_score: weightedCategoryScore,
        checks: category.checks.length
      };
    }
    
    return {
      overall_score: Math.round(totalScore * 100),
      grade: this.calculateGrade(totalScore),
      categories: results,
      timestamp: new Date().toISOString()
    };
  }
  
  calculateGrade(score) {
    if (score >= 0.9) return 'A+';
    if (score >= 0.85) return 'A';
    if (score >= 0.8) return 'B+';
    if (score >= 0.7) return 'B';
    if (score >= 0.6) return 'C+';
    if (score >= 0.5) return 'C';
    if (score >= 0.4) return 'D';
    return 'F';
  }
  
  async checkPatchLevel() {
    // Check system patch level
    const criticalPatches = await this.getCriticalPatches();
    const installedPatches = await this.getInstalledPatches();
    
    const missingPatches = criticalPatches.filter(patch => 
      !installedPatches.includes(patch.id)
    );
    
    const score = Math.max(0, 1 - (missingPatches.length / criticalPatches.length));
    
    return {
      score,
      details: {
        critical_patches: criticalPatches.length,
        installed_patches: installedPatches.length,
        missing_patches: missingPatches.length
      }
    };
  }
  
  async checkConfigurationHardening() {
    // Check security configurations
    const configs = await this.getSecurityConfigurations();
    const hardenedConfigs = configs.filter(config => config.hardened);
    
    return {
      score: hardenedConfigs.length / configs.length,
      details: {
        total_configs: configs.length,
        hardened_configs: hardenedConfigs.length,
        vulnerable_configs: configs.length - hardenedConfigs.length
      }
    };
  }
  
  async checkNetworkSecurity() {
    // Check network security controls
    const controls = await this.getNetworkControls();
    const activeControls = controls.filter(control => control.active);
    
    return {
      score: activeControls.length / controls.length,
      details: {
        total_controls: controls.length,
        active_controls: activeControls.length,
        missing_controls: controls.length - activeControls.length
      }
    };
  }
}

// Usage Example
const scorer = new SecurityPostureScorer();

async function generateSecurityReport() {
  const score = await scorer.calculateScore();
  
  console.log('Security Posture Score:', score.overall_score);
  console.log('Grade:', score.grade);
  
  // Generate recommendations
  const recommendations = generateRecommendations(score);
  
  return {
    score,
    recommendations,
    generated_at: new Date().toISOString()
  };
}

function generateRecommendations(scoreResult) {
  const recommendations = [];
  
  for (const [category, result] of Object.entries(scoreResult.categories)) {
    if (result.score < 0.7) {
      recommendations.push({
        category,
        priority: result.score < 0.5 ? 'high' : 'medium',
        description: 'Improve ' + category + ' security posture',
        actions: getRecommendedActions(category, result.score)
      });
    }
  }
  
  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
}`}</pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Security KPI Dashboard</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
            <pre>{`// Security KPI Dashboard für Moltbot
class SecurityDashboard {
  constructor() {
    this.metrics = new Map();
    this.alerts = [];
    this.trends = [];
  }
  
  async collectMetrics() {
    const metrics = {
      // Vulnerability Metrics
      critical_vulnerabilities: await this.getCriticalVulnerabilities(),
      high_vulnerabilities: await this.getHighVulnerabilities(),
      patch_coverage: await this.getPatchCoverage(),
      
      // Incident Metrics
      security_incidents: await this.getSecurityIncidents(),
      mean_time_to_detect: await this.getMTTD(),
      mean_time_to_resolve: await this.getMTTR(),
      
      // Compliance Metrics
      compliance_score: await this.getComplianceScore(),
      audit_findings: await this.getAuditFindings(),
      policy_violations: await this.getPolicyViolations(),
      
      // Risk Metrics
      risk_score: await this.calculateRiskScore(),
      exposure_level: await this.getExposureLevel(),
      threat_intelligence: await this.getThreatIntelligence()
    };
    
    return metrics;
  }
  
  generateTrendData(metrics) {
    const trends = [];
    
    // Calculate trends over time
    for (const [key, value] of Object.entries(metrics)) {
      const historical = await this.getHistoricalData(key, 30); // 30 days
      const trend = this.calculateTrend(historical, value);
      
      trends.push({
        metric: key,
        current: value,
        trend: trend.direction,
        change: trend.percentage,
        status: this.getTrendStatus(trend.direction, key)
      });
    }
    
    return trends;
  }
  
  calculateTrend(historical, current) {
    if (historical.length < 2) {
      return { direction: 'stable', percentage: 0 };
    }
    
    const previous = historical[historical.length - 2].value;
    const change = ((current - previous) / previous) * 100;
    
    return {
      direction: change > 5 ? 'increasing' : change < -5 ? 'decreasing' : 'stable',
      percentage: Math.abs(change)
    };
  }
  
  getTrendStatus(direction, metric) {
    // Some metrics should decrease (vulnerabilities, incidents)
    const decreasingMetrics = [
      'critical_vulnerabilities',
      'high_vulnerabilities',
      'security_incidents',
      'mean_time_to_detect',
      'mean_time_to_resolve',
      'audit_findings',
      'policy_violations',
      'risk_score',
      'exposure_level'
    ];
    
    const shouldDecrease = decreasingMetrics.includes(metric);
    
    if (shouldDecrease) {
      return direction === 'decreasing' ? 'good' : 'warning';
    } else {
      return direction === 'increasing' ? 'good' : 'warning';
    }
  }
  
  async generateReport() {
    const metrics = await this.collectMetrics();
    const trends = this.generateTrendData(metrics);
    
    return {
      timestamp: new Date().toISOString(),
      metrics,
      trends,
      summary: this.generateSummary(metrics, trends),
      alerts: this.generateAlerts(metrics, trends)
    };
  }
  
  generateSummary(metrics, trends) {
    const goodTrends = trends.filter(t => t.status === 'good').length;
    const warningTrends = trends.filter(t => t.status === 'warning').length;
    
    return {
      overall_health: goodTrends > warningTrends ? 'good' : 'warning',
      critical_issues: metrics.critical_vulnerabilities > 0,
      compliance_status: metrics.compliance_score > 0.8 ? 'compliant' : 'non-compliant',
      risk_level: metrics.risk_score > 0.7 ? 'high' : metrics.risk_score > 0.4 ? 'medium' : 'low'
    };
  }
}

// API Endpoint
app.get('/api/security/dashboard', async (req, res) => {
  try {
    const dashboard = new SecurityDashboard();
    const report = await dashboard.generateReport();
    
    res.json(report);
  } catch (error) {
    console.error('Dashboard generation failed:', error);
    res.status(500).json({ error: 'Failed to generate dashboard' });
  }
});`}</pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Resources</h2>
          <ul className="list-disc pl-4 space-y-2">
            <li><a href="https://clawguru.org/de/security/risk-assessment" target="_blank" rel="noopener noreferrer">Risk Assessment Guide</a></li>
            <li><a href="https://clawguru.org/de/security/security-metrics" target="_blank" rel="noopener noreferrer">Security Metrics</a></li>
            <li><a href="https://clawguru.org/de/security/compliance-scoring" target="_blank" rel="noopener noreferrer">Compliance Scoring</a></li>
            <li><a href="https://clawguru.org/de/security/security-kpis" target="_blank" rel="noopener noreferrer">Security KPIs</a></li>
          </ul>
        </section>
      </div>
    </div>
  );
}