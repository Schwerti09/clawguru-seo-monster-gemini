import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { dbQuery } from '@/lib/db';
import Container from '@/components/shared/Container';
import { SUPPORTED_LOCALES, type Locale, getLocaleHrefLang } from '@/lib/i18n';

export const revalidate = 300;

interface GeoVariantPageProps {
  params: {
    lang: string;
    slug: string;
  };
}

const BASE_SLUGS = [
  "aws-nginx-hardening-2026",
  "aws-ssh-hardening-2026", 
  "gcp-kubernetes-rbac-misconfig-2026"
];

function parseVariantSlug(slug: string): { baseSlug: string; citySlug: string } | null {
  for (const baseSlug of BASE_SLUGS) {
    if (slug.startsWith(baseSlug + '-')) {
      const citySlug = slug.slice(baseSlug.length + 1);
      return { baseSlug, citySlug };
    }
  }
  return null;
}

// Generate content based on base slug
function getContentForBaseSlug(baseSlug: string, lang: string, cityName: string) {
  switch (baseSlug) {
    case 'aws-nginx-hardening-2026':
      return {
        intro: lang === 'de' 
          ? `Umfassende NGINX Security-Härtung für AWS-Umgebungen in ${cityName}. Protect your web infrastructure with enterprise-grade security configurations.`
          : `Comprehensive NGINX security hardening for AWS environments in ${cityName}. Protect your web infrastructure with enterprise-grade security configurations.`,
        sections: [
          {
            title: lang === 'de' ? 'TLS/SSL Konfiguration' : 'TLS/SSL Configuration',
            content: lang === 'de'
              ? 'Moderne TLS 1.3 Konfiguration mit Perfect Forward Secrecy und HSTS.'
              : 'Modern TLS 1.3 configuration with Perfect Forward Secrecy and HSTS.'
          },
          {
            title: lang === 'de' ? 'Rate Limiting & DDoS Schutz' : 'Rate Limiting & DDoS Protection',
            content: lang === 'de'
              ? 'Intelligentes Rate Limiting mit IP-basierten Limits und Connection Tracking.'
              : 'Intelligent rate limiting with IP-based limits and connection tracking.'
          },
          {
            title: lang === 'de' ? 'Security Headers' : 'Security Headers',
            content: lang === 'de'
              ? 'CSP, HSTS, X-Frame-Options und weitere kritische Security Headers.'
              : 'CSP, HSTS, X-Frame-Options and other critical security headers.'
          }
        ]
      };
    
    case 'aws-ssh-hardening-2026':
      return {
        intro: lang === 'de'
          ? `SSH Security-Härtung für AWS EC2 Instanzen in ${cityName}. Secure your remote access with industry best practices.`
          : `SSH security hardening for AWS EC2 instances in ${cityName}. Secure your remote access with industry best practices.`,
        sections: [
          {
            title: lang === 'de' ? 'Key-basierte Authentifizierung' : 'Key-based Authentication',
            content: lang === 'de'
              ? 'Deaktiviere Passwort-Authentifizierung und nutze Ed25519 SSH Keys.'
              : 'Disable password authentication and use Ed25519 SSH keys.'
          },
          {
            title: lang === 'de' ? 'Fail2Ban Konfiguration' : 'Fail2Ban Configuration',
            content: lang === 'de'
              ? 'Automatische IP-Blocking bei verdächtigen Anmeldeversuchen.'
              : 'Automatic IP blocking for suspicious login attempts.'
          },
          {
            title: lang === 'de' ? 'SSH Hardening Best Practices' : 'SSH Hardening Best Practices',
            content: lang === 'de'
              ? 'Port-Änderung, Timeouts und verschärfte Cipher-Einstellungen.'
              : 'Port changes, timeouts, and enhanced cipher settings.'
          }
        ]
      };
    
    case 'gcp-kubernetes-rbac-misconfig-2026':
      return {
        intro: lang === 'de'
          ? `Kubernetes RBAC Security für GKE Cluster in ${cityName}. Prevent privilege escalation and unauthorized access.`
          : `Kubernetes RBAC security for GKE clusters in ${cityName}. Prevent privilege escalation and unauthorized access.`,
        sections: [
          {
            title: lang === 'de' ? 'Principle of Least Privilege' : 'Principle of Least Privilege',
            content: lang === 'de'
              ? 'Minimale Berechtigungen für Service Accounts und Rollen.'
              : 'Minimal permissions for service accounts and roles.'
          },
          {
            title: lang === 'de' ? 'RBAC Audit & Monitoring' : 'RBAC Audit & Monitoring',
            content: lang === 'de'
              ? 'Regelmäßige Audits von RBAC Konfigurationen und Berechtigungen.'
              : 'Regular audits of RBAC configurations and permissions.'
          },
          {
            title: lang === 'de' ? 'Common Misconfigurations' : 'Common Misconfigurations',
            content: lang === 'de'
              ? 'Vermeide Cluster-Admin Rechte und über-permissive Roles.'
              : 'Avoid cluster-admin rights and over-permissive roles.'
          }
        ]
      };
    
    default:
      return {
        intro: lang === 'de'
          ? `Security Guide für ${baseSlug} in ${cityName}.`
          : `Security guide for ${baseSlug} in ${cityName}.`,
        sections: []
      };
  }
}

async function getCityData(citySlug: string) {
  try {
    const result = await dbQuery(
      `SELECT slug, name_de, name_en, country_code, priority, population, quality_score 
       FROM geo_cities 
       WHERE slug = $1 AND is_active = TRUE`,
      [citySlug]
    );
    
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error fetching city data:', error);
    return null;
  }
}

async function getVariantData(locale: string, baseSlug: string, citySlug: string) {
  try {
    const result = await dbQuery(
      `SELECT local_title, local_summary, quality_score 
       FROM geo_variant_matrix 
       WHERE locale = $1 AND base_slug = $2 AND city_slug = $3`,
      [locale, baseSlug, citySlug]
    );
    
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error fetching variant data:', error);
    return null;
  }
}

export async function generateMetadata({ params }: GeoVariantPageProps): Promise<Metadata> {
  const { lang, slug } = params;
  
  if (!SUPPORTED_LOCALES.includes(lang as Locale)) {
    return { title: 'Page Not Found' };
  }

  const parsed = parseVariantSlug(slug);
  if (!parsed) return { title: 'Page Not Found' };

  const { baseSlug, citySlug } = parsed;
  const cityData = await getCityData(citySlug);
  const variantData = await getVariantData(lang, baseSlug, citySlug);

  if (!cityData || !variantData) {
    // Fallback data when database fails
    const fallbackCityName = citySlug.charAt(0).toUpperCase() + citySlug.slice(1).replace(/-/g, ' ');
    const fallbackTitle = `${fallbackCityName} Security Hardening - ${baseSlug.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}`;
    const fallbackDescription = `Professional security guide for ${baseSlug} environments in ${fallbackCityName}. Compliance-ready runbooks and hardening checklists.`;

    return {
      title: fallbackTitle,
      description: fallbackDescription,
      keywords: [baseSlug, citySlug, 'security', 'hardening', 'runbook', fallbackCityName],
      authors: [{ name: 'ClawGuru Security Team' }],
      openGraph: {
        title: fallbackTitle,
        description: fallbackDescription,
        type: 'article',
        url: `https://clawguru.org/${lang}/${slug}`,
      },
      alternates: {
        canonical: `https://clawguru.org/${lang}/${slug}`,
        languages: Object.fromEntries(
          SUPPORTED_LOCALES.map(locale => [
            locale,
            `https://clawguru.org/${locale}/${slug}`
          ])
        ),
      },
      robots: 'index, follow',
    };
  }

  const cityName = lang === 'de' ? cityData.name_de : cityData.name_en;
  const title = variantData.local_title || `${cityName} Security Hardening - ${baseSlug.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}`;
  const description = variantData.local_summary || `Professional security guide for ${baseSlug} environments in ${cityName}. Compliance-ready runbooks and hardening checklists.`;

  return {
    title,
    description,
    keywords: [baseSlug, citySlug, 'security', 'hardening', 'runbook', cityName],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://clawguru.org/${lang}/${slug}`,
    },
    alternates: {
      canonical: `https://clawguru.org/${lang}/${slug}`,
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map(locale => [
          locale,
          `https://clawguru.org/${locale}/${slug}`
        ])
      ),
    },
    robots: 'index, follow',
  };
}

export default async function GeoVariantPage({ params }: GeoVariantPageProps) {
  const { lang, slug } = params;

  if (!SUPPORTED_LOCALES.includes(lang as Locale)) {
    notFound();
  }

  const parsed = parseVariantSlug(slug);
  if (!parsed) {
    notFound();
  }

  const { baseSlug, citySlug } = parsed;
  const cityData = await getCityData(citySlug);
  const variantData = await getVariantData(lang, baseSlug, citySlug);

  if (!cityData || !variantData) {
    // Fallback data when database fails
    const fallbackCityName = citySlug.charAt(0).toUpperCase() + citySlug.slice(1).replace(/-/g, ' ');
    const fallbackTitle = `${fallbackCityName} Security Hardening - ${baseSlug.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}`;
    const fallbackDescription = `Professional security guide for ${baseSlug} environments in ${fallbackCityName}. Compliance-ready runbooks and hardening checklists.`;

    const content = getContentForBaseSlug(baseSlug, lang, fallbackCityName);

    return (
      <Container className="py-12">
        <div className="max-w-4xl mx-auto">
          {/* Trust Anchor */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 text-sm">
            <strong>"Not a Pentest" Trust-Anker</strong>: {lang === 'de' 
              ? `Dieser Guide dient der Absicherung eigener Systeme in ${fallbackCityName}. Keine Angriffswerkzeuge.` 
              : `This guide serves to secure your own systems in ${fallbackCityName}. No attack tools.`
            }
          </div>

          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{fallbackTitle}</h1>
            <p className="text-xl text-gray-600 mb-6">{fallbackDescription}</p>
            
            {/* City Info */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{lang === 'de' ? 'Stadt' : 'City'}</h3>
                  <p className="text-gray-600">{fallbackCityName}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{lang === 'de' ? 'Land' : 'Country'}</h3>
                  <p className="text-gray-600">{citySlug.toUpperCase()}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{lang === 'de' ? 'Qualität' : 'Quality'}</h3>
                  <p className="text-gray-600">85/100</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-lg text-gray-600 mb-8">{content.intro}</p>
            
            {content.sections.map((section, index) => (
              <div key={index} className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">{section.title}</h2>
                <p className="text-gray-600 mb-4">{section.content}</p>
              </div>
            ))}
          </div>

          {/* Resources */}
          <div className="bg-gray-50 rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              {lang === 'de' ? 'Weiterführende Ressourcen' : 'Additional Resources'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <a 
                href={`/${lang}/securitycheck`}
                className="block bg-white rounded-lg p-6 border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div className="font-semibold text-blue-600 mb-2">
                  {lang === 'de' ? 'Security Check' : 'Security Check'}
                </div>
                <div className="text-sm text-gray-600">
                  {lang === 'de' 
                    ? `Live Security-Check für deine ${baseSlug.replace(/-/g, ' ').toUpperCase()} Umgebung in ${fallbackCityName}`
                    : `Live security check for your ${baseSlug.replace(/-/g, ' ').toUpperCase()} environment in ${fallbackCityName}`
                  }
                </div>
              </a>
              
              <a 
                href={`/${lang}/runbooks`}
                className="block bg-white rounded-lg p-6 border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div className="font-semibold text-blue-600 mb-2">
                  {lang === 'de' ? 'Security Runbooks' : 'Security Runbooks'}
                </div>
                <div className="text-sm text-gray-600">
                  {lang === 'de' 
                    ? `600+ ausführbare Security Playbooks für ${fallbackCityName}`
                    : `600+ executable security playbooks for ${fallbackCityName}`
                  }
                </div>
              </a>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  const cityName = lang === 'de' ? cityData.name_de : cityData.name_en;
  const title = variantData.local_title || `${cityName} Security Hardening - ${baseSlug.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}`;
  const description = variantData.local_summary || `Professional security guide for ${baseSlug} environments in ${cityName}. Compliance-ready runbooks and hardening checklists.`;

  const content = getContentForBaseSlug(baseSlug, lang, cityName);

  return (
    <Container className="py-12">
      <div className="max-w-4xl mx-auto">
        {/* Trust Anchor */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 text-sm">
          <strong>"Not a Pentest" Trust-Anker</strong>: {lang === 'de' 
            ? `Dieser Guide dient der Absicherung eigener Systeme in ${cityName}. Keine Angriffswerkzeuge.` 
            : `This guide serves to secure your own systems in ${cityName}. No attack tools.`
          }
        </div>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
          <p className="text-xl text-gray-600 mb-6">{description}</p>
          
          {/* City Info */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="font-semibold text-gray-900">{lang === 'de' ? 'Stadt' : 'City'}</h3>
                <p className="text-gray-600">{cityName}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{lang === 'de' ? 'Land' : 'Country'}</h3>
                <p className="text-gray-600">{cityData.country_code}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{lang === 'de' ? 'Qualität' : 'Quality'}</h3>
                <p className="text-gray-600">{variantData.quality_score}/100</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-lg text-gray-600 mb-8">{content.intro}</p>
          
          {content.sections.map((section, index) => (
            <div key={index} className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{section.title}</h2>
              <p className="text-gray-600 mb-4">{section.content}</p>
              
              {/* Code Example */}
              <div className="bg-gray-900 text-gray-100 rounded-lg p-6 mb-6">
                <pre className="text-sm overflow-x-auto">
                  <code>
                    {lang === 'de' ? '# Beispielkonfiguration für ' : '# Example configuration for '}{section.title.toLowerCase()}\n
                    {baseSlug.includes('nginx') && (
                      `# NGINX Security Configuration
server {
    listen 443 ssl http2;
    server_name ${cityName.toLowerCase()}.example.com;
    
    # TLS Configuration
    ssl_certificate /etc/letsencrypt/live/cert.pem;
    ssl_certificate_key /etc/letsencrypt/live/key.pem;
    ssl_protocols TLSv1.3;
    ssl_prefer_server_ciphers on;
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    
    # Rate Limiting
    limit_req zone=api burst=20 nodelay;
}`
                    )}
                    {baseSlug.includes('ssh') && (
                      `# SSH Hardening Configuration
# /etc/ssh/sshd_config

# Disable password authentication
PasswordAuthentication no
ChallengeResponseAuthentication no

# Use key-based authentication only
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys

# Security settings
Protocol 2
Port 2222
PermitRootLogin no
MaxAuthTries 3
ClientAliveInterval 300
ClientAliveCountMax 2

# Use strong ciphers
Ciphers chacha20-poly1305@openssh.com,aes256-gcm@openssh.com
MACs hmac-sha2-256-etm@openssh.com,hmac-sha2-512-etm@openssh.com`
                    )}
                    {baseSlug.includes('kubernetes') && (
                      `# RBAC Configuration Example
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: restricted-role
  namespace: production
rules:
- apiGroups: [""]
  resources: ["pods", "services"]
  verbs: ["get", "list", "watch"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: restricted-binding
  namespace: production
subjects:
- kind: ServiceAccount
  name: app-service-account
  namespace: production
roleRef:
  kind: Role
  name: restricted-role
  apiGroup: rbac.authorization.k8s.io`
                    )}
                  </code>
                </pre>
              </div>
            </div>
          ))}
        </div>

        {/* Resources */}
        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            {lang === 'de' ? 'Weiterführende Ressourcen' : 'Additional Resources'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <a 
              href={`/${lang}/securitycheck`}
              className="block bg-white rounded-lg p-6 border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <div className="font-semibold text-blue-600 mb-2">
                {lang === 'de' ? 'Security Check' : 'Security Check'}
              </div>
              <div className="text-sm text-gray-600">
                {lang === 'de' 
                  ? `Live Security-Check für deine ${baseSlug.replace(/-/g, ' ').toUpperCase()} Umgebung in ${cityName}`
                  : `Live security check for your ${baseSlug.replace(/-/g, ' ').toUpperCase()} environment in ${cityName}`
                }
              </div>
            </a>
            
            <a 
              href={`/${lang}/runbooks`}
              className="block bg-white rounded-lg p-6 border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <div className="font-semibold text-blue-600 mb-2">
                {lang === 'de' ? 'Security Runbooks' : 'Security Runbooks'}
              </div>
              <div className="text-sm text-gray-600">
                {lang === 'de' 
                  ? `600+ ausführbare Security Playbooks für ${cityName}`
                  : `600+ executable security playbooks for ${cityName}`
                }
              </div>
            </a>
            
            <a 
              href={`/${lang}/oracle`}
              className="block bg-white rounded-lg p-6 border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <div className="font-semibold text-blue-600 mb-2">
                {lang === 'de' ? 'Threat Intelligence' : 'Threat Intelligence'}
              </div>
              <div className="text-sm text-gray-600">
                {lang === 'de' 
                  ? `KI-gestützte Threat Intelligence für ${cityName}`
                  : `AI-powered threat intelligence for ${cityName}`
                }
              </div>
            </a>
            
            <a 
              href={`/${lang}/openclaw`}
              className="block bg-white rounded-lg p-6 border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <div className="font-semibold text-blue-600 mb-2">
                {lang === 'de' ? 'OpenClaw Framework' : 'OpenClaw Framework'}
              </div>
              <div className="text-sm text-gray-600">
                {lang === 'de' 
                  ? `Open-Source Security Framework für Self-Hosting in ${cityName}`
                  : `Open-source security framework for self-hosting in ${cityName}`
                }
              </div>
            </a>
          </div>
        </div>
      </div>
    </Container>
  );
}
