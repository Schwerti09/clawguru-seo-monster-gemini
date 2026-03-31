'use server'

export type SecurityRating = 'Kritisch' | 'Verbesserungswürdig' | 'Gut' | 'Sehr sicher'
export type InputType = 'ip' | 'domain' | 'url' | 'unknown'

export interface SecurityRecommendation {
  id: string
  title: string
  description: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  action: string
  tool?: string
  isPremium: boolean
}

export interface SecurityCategoryScore {
  network: number
  auth: number
  config: number
  vulnerabilities: number
}

export interface SecurityCheckResult {
  score: number
  rating: SecurityRating
  input: string
  inputType: InputType
  categories: SecurityCategoryScore
  recommendations: SecurityRecommendation[]
  checkedAt: string
}

function detectInputType(input: string): InputType {
  const trimmed = input.trim().toLowerCase()
  // IP address (v4 or v6 range)
  if (/^\d{1,3}(\.\d{1,3}){3}(\/\d{1,2})?$/.test(trimmed)) return 'ip'
  // URL with scheme
  if (/^https?:\/\//.test(trimmed)) return 'url'
  // Domain-like (has dot, no spaces, no scheme)
  if (/^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9-]+)+$/.test(trimmed)) return 'domain'
  return 'unknown'
}

function getRating(score: number): SecurityRating {
  if (score <= 33) return 'Kritisch'
  if (score <= 59) return 'Verbesserungswürdig'
  if (score <= 84) return 'Gut'
  return 'Sehr sicher'
}

/* ── Realistic demo data pools ── */

const IP_RECS: SecurityRecommendation[] = [
  {
    id: 'cve-2026-1141',
    title: 'CVE-2026-1141 – OpenSSH sofort patchen',
    description: 'Kritische RCE-Lücke in OpenSSH < 9.8. Angreifer können ohne Auth Schadcode ausführen. Patch verfügbar seit 2026-02-14.',
    severity: 'critical',
    action: 'apt upgrade openssh-server && systemctl restart sshd',
    tool: 'ClawGuru Nginx Hardening Runbook',
    isPremium: false
  },
  {
    id: 'port-scan',
    title: 'Offene Ports: 22, 3306, 6379 exponiert',
    description: 'SSH, MySQL und Redis sind direkt aus dem Internet erreichbar. Firewall-Regeln fehlen oder sind zu permissiv.',
    severity: 'high',
    action: 'ufw allow from 10.0.0.0/8 to any port 22 && ufw deny 3306 && ufw deny 6379',
    tool: 'Firewall Hardening Runbook',
    isPremium: false
  },
  {
    id: 'rbac',
    title: 'RBAC überprüfen – Root-Login aktiv',
    description: 'Root-SSH-Login ist aktiviert. Jeder Brute-Force-Angriff zielt direkt auf höchste Rechte.',
    severity: 'high',
    action: 'echo "PermitRootLogin no" >> /etc/ssh/sshd_config && systemctl restart sshd',
    tool: 'SSH Hardening Runbook',
    isPremium: true
  },
  {
    id: 'fail2ban',
    title: 'Fail2ban nicht konfiguriert',
    description: 'Kein Brute-Force-Schutz aktiv. In den letzten 24h wurden 847 Login-Versuche auf Port 22 detektiert.',
    severity: 'high',
    action: 'apt install fail2ban && systemctl enable --now fail2ban',
    tool: 'Intrusion Prevention Runbook',
    isPremium: true
  },
  {
    id: 'tls-config',
    title: 'TLS 1.0/1.1 noch aktiv',
    description: 'Veraltete TLS-Versionen mit bekannten BEAST- und POODLE-Schwachstellen. Nur TLS 1.3 sollte erlaubt sein.',
    severity: 'medium',
    action: 'ssl_protocols TLSv1.3; in nginx.conf setzen',
    tool: 'TLS Hardening Runbook',
    isPremium: true
  },
  {
    id: 'geoip-block',
    title: 'GeoIP-Blocking empfohlen',
    description: '73% des eingehenden Traffics kommt aus Regionen, die nicht in Ihrer Zielliste sind. Reduziert Angriffsfläche erheblich.',
    severity: 'low',
    action: 'Nginx GeoIP-Modul aktivieren und Blocklist konfigurieren',
    tool: 'ClawGuru GeoIP Shield',
    isPremium: true
  }
]

const DOMAIN_RECS: SecurityRecommendation[] = [
  {
    id: 'dnssec',
    title: 'DNSSEC nicht aktiviert',
    description: 'Ihre Domain ist anfällig für DNS-Cache-Poisoning und Hijacking. DNSSEC würde kryptographische Signierung hinzufügen.',
    severity: 'high',
    action: 'DNSSEC in Ihrem DNS-Provider-Panel aktivieren',
    isPremium: false
  },
  {
    id: 'spf-dmarc',
    title: 'SPF/DMARC-Konfiguration lückenhaft',
    description: 'SPF vorhanden, aber DMARC fehlt. E-Mail-Spoofing von Ihrer Domain ist möglich – Phishing-Risiko für Ihre Kunden.',
    severity: 'high',
    action: '_dmarc TXT-Record: "v=DMARC1; p=reject; rua=mailto:dmarc@example.com"',
    tool: 'Email Security Runbook',
    isPremium: false
  },
  {
    id: 'cve-2026-0881',
    title: 'CVE-2026-0881 – Nginx Prototype Pollution',
    description: 'Ihre Nginx-Version ist verwundbar. Angreifer können HTTP-Request-Smuggling durchführen.',
    severity: 'critical',
    action: 'nginx -v && apt upgrade nginx',
    tool: 'ClawGuru Nginx Hardening',
    isPremium: false
  },
  {
    id: 'headers',
    title: 'Security-Header fehlen',
    description: 'Content-Security-Policy, HSTS, X-Frame-Options und Permissions-Policy nicht gesetzt. XSS und Clickjacking möglich.',
    severity: 'medium',
    action: 'Security-Header zu nginx.conf hinzufügen',
    tool: 'HTTP Headers Runbook',
    isPremium: true
  },
  {
    id: 'subdomain-takeover',
    title: 'Subdomain Takeover: 2 Risiko-Records gefunden',
    description: 'Zwei CNAME-Records zeigen auf nicht mehr existierende Cloud-Ressourcen. Angreifer können diese übernehmen.',
    severity: 'high',
    action: 'DNS-Records bereinigen und auf aktive Ressourcen prüfen',
    tool: 'Subdomain Monitor Runbook',
    isPremium: true
  },
  {
    id: 'waf',
    title: 'Kein WAF (Web Application Firewall) detektiert',
    description: 'Ohne WAF sind SQL-Injection, XSS und OWASP Top-10-Angriffe nicht geblockt.',
    severity: 'medium',
    action: 'Cloudflare WAF oder ModSecurity aktivieren',
    tool: 'WAF Deployment Runbook',
    isPremium: true
  }
]

function buildMockResult(input: string, inputType: InputType): SecurityCheckResult {
  // Deterministic but varied seed based on input string
  const seed = input.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const rng = (min: number, max: number, offset = 0) => min + ((seed + offset) % (max - min + 1))

  const score = rng(18, 82)

  const categories: SecurityCategoryScore = {
    network: Math.min(100, rng(10, 90, 1)),
    auth: Math.min(100, rng(15, 85, 2)),
    config: Math.min(100, rng(20, 80, 3)),
    vulnerabilities: Math.min(100, rng(5, 75, 4))
  }

  const pool = inputType === 'ip' ? IP_RECS : DOMAIN_RECS
  // Shuffle deterministically and pick 6
  const shuffled = [...pool].sort((a, b) => (a.id.charCodeAt(0) + seed) % 7 - (b.id.charCodeAt(0) + seed) % 7)
  const recommendations = shuffled.slice(0, 6)

  return {
    score,
    rating: getRating(score),
    input,
    inputType,
    categories,
    recommendations,
    checkedAt: new Date().toISOString()
  }
}

export async function runSecurityCheck(input: string): Promise<SecurityCheckResult> {
  const trimmed = input.trim()
  if (!trimmed) {
    throw new Error('Bitte eine IP, Domain oder URL eingeben.')
  }
  if (trimmed.length > 253) {
    throw new Error('Eingabe zu lang.')
  }

  // Simulate realistic async processing time
  await new Promise(r => setTimeout(r, 1200 + Math.random() * 800))

  const inputType = detectInputType(trimmed)
  return buildMockResult(trimmed, inputType)
}
