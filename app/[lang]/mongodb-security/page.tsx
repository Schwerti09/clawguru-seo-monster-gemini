import type { Metadata } from "next";
import { SUPPORTED_LOCALES, type Locale, localeAlternates } from "@/lib/i18n";
import { BASE_URL } from "@/lib/config";

export const dynamic = "force-static";
export const revalidate = 86400;

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
      ? "MongoDB Security Hardening 2026 | Enterprise NoSQL Database Security"
      : "MongoDB Security Hardening 2026 | Enterprise NoSQL Database Security",
    description: locale === "de"
      ? "Umfassender MongoDB Security Guide: TLS/SSL, SCRAM, x.509, Field-Level Encryption, Client-Side Encryption, LDAP, Kerberos, Auditing & Compliance."
      : "Comprehensive MongoDB security guide: TLS/SSL, SCRAM, x.509, field-level encryption, client-side encryption, LDAP, Kerberos, auditing & compliance.",
    keywords: [
      "MongoDB security",
      "MongoDB hardening",
      "MongoDB TLS",
      "MongoDB SCRAM",
      "MongoDB x.509",
      "MongoDB encryption",
      "MongoDB field level encryption",
      "MongoDB client side encryption",
      "MongoDB LDAP",
      "MongoDB Kerberos",
      "MongoDB auditing",
      "MongoDB compliance",
      "MongoDB enterprise security",
    ],
    alternates: {
      ...localeAlternates(`/${locale}/mongodb-security`),
    },
    openGraph: {
      title: "MongoDB Security Hardening 2026: Enterprise Database Protection",
      description: "Comprehensive MongoDB security with encryption, authentication, authorization & audit controls.",
      type: "article",
      url: `${BASE_URL}/${locale}/mongodb-security`,
    },
  };
}

export default async function MongoDBSecurityPage({
  params,
}: {
  params: { lang: string };
}) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale)
    ? params.lang
    : "de") as Locale;
  const prefix = `/${locale}`;

  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-400/30 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-sm mb-4">
              <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
              Enterprise NoSQL Security 2026
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              MongoDB Security
            </h1>
            <p className="text-2xl text-green-200 mb-4">
              Comprehensive Database Hardening
            </p>
            <p className="text-xl text-white/80 mb-8">
              TLS/SSL, SCRAM, x.509, Field-Level Encryption, Client-Side Field Level Encryption, LDAP, Kerberos, Auditing & SOC 2/ISO 27001 Compliance
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">TLS 1.3</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Field-Level Encryption</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">CSFLE</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">LDAP</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Kerberos</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">MongoDB Security Architecture Overview</h2>
            <p className="text-slate-700 text-lg mb-6 leading-relaxed">
              MongoDB Enterprise bietet ein mehrschichtiges Sicherheitsmodell: Netzwerkverschlüsselung durch TLS/SSL, starke Authentifizierung über SCRAM-SHA-256 oder x.509-Zertifikate, Autorisierung durch rollenbasierte Zugriffskontrolle (RBAC), und zusätzlich Feld- und dokumentenbasierte Verschlüsselung für sensible Daten. Für Enterprise-Umgebungen unterstützt MongoDB zudem LDAP-Integration und Kerberos-Authentifizierung.
            </p>

            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
                <div className="text-3xl mb-2">🔐</div>
                <h3 className="font-semibold text-green-900 text-sm mb-1">Transport Encryption</h3>
                <p className="text-xs text-green-700">TLS 1.3 für alle Verbindungen</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">
                <div className="text-3xl mb-2">👤</div>
                <h3 className="font-semibold text-blue-900 text-sm mb-1">Authentication</h3>
                <p className="text-xs text-blue-700">SCRAM, x.509, LDAP, Kerberos</p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-5 text-center">
                <div className="text-3xl mb-2">🛡️</div>
                <h3 className="font-semibold text-purple-900 text-sm mb-1">Authorization</h3>
                <p className="text-xs text-purple-700">RBAC mit built-in & custom roles</p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-center">
                <div className="text-3xl mb-2">🔒</div>
                <h3 className="font-semibold text-amber-900 text-sm mb-1">Encryption</h3>
                <p className="text-xs text-amber-700">At-rest & Client-Side Field Level</p>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">TLS/SSL Configuration (mongod.conf)</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# mongod.conf - Comprehensive TLS/SSL Configuration
net:
  port: 27017
  bindIp: 127.0.0.1,10.0.0.10  # Restrict binding
  
  tls:
    mode: requireTLS  # Enforce TLS for all connections
    certificateKeyFile: /etc/ssl/mongodb-server.pem
    certificateKeyFilePassword: $TLS_KEY_PASSWORD  # Via environment variable
    CAFile: /etc/ssl/ca.pem
    clusterFile: /etc/ssl/mongodb-cluster.pem  # For replica set communication
    clusterCAFile: /etc/ssl/ca.pem
    
    # TLS 1.3 only (disable older protocols)
    disabledProtocols: "TLS1_0,TLS1_1,TLS1_2"
    
    # Allow connections without client certificates initially
    # Then transition to requireClientCertificate
    allowConnectionsWithoutCertificates: false
    
    # Certificate validation
    allowInvalidCertificates: false
    allowInvalidHostnames: false
    
    # OCSP stapling (Enterprise)
    ocspEnabled: true

# Alternative: x.509 Certificate Authentication
security:
  authorization: enabled
  clusterAuthMode: x509  # Use certificates for internal auth
  
  # JavaScript execution disabled
  javascriptEnabled: false
  
  # Redact client IP in logs (GDPR compliance)
  redactClientLogData: false
  
  # KMIP for encryption key management (Enterprise)
  kmip:
    serverName: kmip.hsm.internal
    port: 5696
    clientCertificateFile: /etc/ssl/kmip-client.pem
    clientCertificatePassword: $KMIP_PASSWORD
    serverCAFile: /etc/ssl/kmip-ca.pem`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">SCRAM-SHA-256 Authentication Deep Dive</h2>
            <p className="text-slate-700 mb-6">
              SCRAM (Salted Challenge Response Authentication Mechanism) ist die Standard-Authentifizierung in MongoDB 4.0+. Es bietet Schutz vor Passwort-Abhören und Replay-Attacken durch Challenge-Response mit Salting.
            </p>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# Create user with SCRAM-SHA-256 (recommended)
use admin
db.createUser({
  user: "appUser",
  pwd: "ComplexP@ssw0rd123!",
  mechanisms: ["SCRAM-SHA-256"],  # Explicit, not SCRAM-SHA-1
  roles: [
    { role: "readWrite", db: "application" },
    { role: "dbAdmin", db: "application" }
  ],
  passwordDigestor: "server"  # Server hashes password
})

# Create read-only analyst user
use reporting
db.createUser({
  user: "analyst",
  pwd: "An@lyst2026Secure!",
  mechanisms: ["SCRAM-SHA-256"],
  roles: [
    { 
      role: "read", 
      db: "reporting",
      collection: "analytics"  # MongoDB 6.0+ granular permissions
    }
  ]
})

# Verify authentication mechanism
db.runCommand({
  connectionStatus: 1
}).authInfo.authenticatedUsers[0].mechanisms

# Output: [ "SCRAM-SHA-256" ]`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">x.509 Certificate Authentication (Enterprise)</h2>
            <p className="text-slate-700 mb-6">
              x.509-Zertifikate bieten die stärkste Authentifizierung. Keine Passwörter nötig - nur PKI-basierte Identität. Ideal für Service-Accounts und Microservices.
            </p>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# Create x.509 user (certificate subject as username)
use $external
db.createUser({
  user: "CN=app-service,O=Company,OU=Production,L=Berlin,ST=Berlin,C=DE",
  roles: [
    { role: "readWrite", db: "app_production" },
    { role: "read", db: "app_cache" }
  ],
  writeConcern: { w: "majority" }
})

# Connection string with x.509
mongodb://app-server.mongodb.internal:27017/?authMechanism=MONGODB-X509&tls=true&tlsCertificateKeyFile=/certs/app.pem

# Validate certificate chain
openssl verify -CAfile /etc/ssl/ca.pem -untrusted /etc/ssl/intermediate.pem /etc/ssl/client.pem

# Check certificate expiry (monitoring script)
#!/bin/bash
EXPIRY=$(openssl x509 -in /etc/ssl/mongodb-server.pem -noout -enddate | cut -d= -f2)
EXPIRY_EPOCH=$(date -d "$EXPIRY" +%s)
NOW_EPOCH=$(date +%s)
DAYS_UNTIL_EXPIRY=$(( ($EXPIRY_EPOCH - $NOW_EPOCH) / 86400 ))

if [ $DAYS_UNTIL_EXPIRY -lt 30 ]; then
  echo "WARNING: Certificate expires in $DAYS_UNTIL_EXPIRY days"
  # Trigger renewal or alert
fi`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Role-Based Access Control (RBAC) Design</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# Create custom roles for application tiers

# 1. Application Read-Only (for caching layer)
db.createRole({
  role: "appReadOnly",
  privileges: [
    { 
      resource: { db: "app", collection: "" }, 
      actions: ["find", "collStats", "dbHash", "listCollections", "listIndexes"] 
    },
    {
      resource: { db: "app", collection: "system.indexes" },
      actions: ["find"]
    }
  ],
  roles: []
})

# 2. Data Processor (can insert/update but not delete)
db.createRole({
  role: "dataProcessor",
  privileges: [
    { 
      resource: { db: "app", collection: "events" }, 
      actions: ["insert", "update", "find"] 
    },
    {
      resource: { db: "app", collection: "events" },
      actions: ["update"],
      query: { status: { $ne: "archived" } }  # Cannot update archived
    }
  ],
  roles: [{ role: "appReadOnly", db: "app" }]
})

# 3. Backup Operator (Enterprise Ops Manager integration)
db.createRole({
  role: "backupOperator",
  privileges: [
    { resource: { cluster: true }, actions: ["backup", "restore"] },
    { resource: { db: "", collection: "" }, actions: ["find"] },
    { resource: { db: "config", collection: "" }, actions: ["find"] }
  ],
  roles: []
})

# 4. Security Officer (can view users/roles, not data)
db.createRole({
  role: "securityOfficer",
  privileges: [
    { resource: { cluster: true }, actions: ["viewUser", "viewRole", "listDatabases"] },
    { resource: { db: "", collection: "" }, actions: ["collStats"] }
  ],
  roles: []
})

# Grant roles to users
db.grantRolesToUser("app-service", [{ role: "dataProcessor", db: "app" }])`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Field-Level Encryption (FLE) Implementation</h2>
            <p className="text-slate-700 mb-6">
              Feld-Level-Verschlüsselung schützt sensible Daten auch vor Datenbank-Admins. Die Anwendung verschlüsselt vor dem Senden, MongoDB speichert nur Ciphertext.
            </p>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`// Node.js Client-Side Field Level Encryption (CSFLE)
const { MongoClient, ClientEncryption } = require('mongodb');
const { getCredentials } = require('./vault');

async function createEncryptedClient() {
  // Get master key from external HSM/Vault
  const masterKey = await getCredentials('mongodb-master-key');
  
  const keyVaultNamespace = 'encryption.__keyVault';
  const kmsProviders = {
    local: {
      key: Binary.createFromBase64(masterKey, 0)
    }
  };
  
  // Automatic Encryption Schema
  const schema = {
    "bsonType": "object",
    "encryptMetadata": {
      "keyId": [new Binary(Buffer.from(dataKeyId, "base64"), 4)]
    },
    "properties": {
      "ssn": {
        "encrypt": {
          "bsonType": "string",
          "algorithm": "AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic"
        }
      },
      "bloodType": {
        "encrypt": {
          "bsonType": "string",
          "algorithm": "AEAD_AES_256_CBC_HMAC_SHA_512-Random"  // Queryable
        }
      },
      "medicalHistory": {
        "encrypt": {
          "bsonType": "array",
          "algorithm": "AEAD_AES_256_CBC_HMAC_SHA_512-Random"  // Not queryable
        }
      }
    }
  };
  
  const client = new MongoClient(uri, {
    autoEncryption: {
      keyVaultNamespace,
      kmsProviders,
      schemaMap: { 'medical.records': schema },
      // Disable auto encryption for certain operations
      bypassAutoEncryption: false,
      // Extra options for mongocryptd
      extraOptions: {
        mongocryptdSpawnPath: '/usr/bin/mongocryptd',
        mongocryptdBypassSpawnVerification: false
      }
    }
  });
  
  return client;
}

// Query encrypted fields (deterministic encryption only)
const patients = await db.collection('records').find({
  ssn: "123-45-6789"  // Can query because deterministic
}).toArray();

// Cannot query random-encrypted fields directly
// This will NOT work:
// db.collection('records').find({ bloodType: "O+" })  // Error!`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">LDAP & Active Directory Integration</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mongo text-sm text-green-400">
{`# mongod.conf - LDAP Authorization (Enterprise)
security:
  authorization: enabled
  ldap:
    servers: "ldap.company.internal:636"
    bind:
      queryUser: "CN=mongo-service,OU=ServiceAccounts,DC=company,DC=internal"
      queryPassword: $LDAP_PASSWORD
    transportSecurity: tls
    
    # User to Distinguished Name mapping
    userToDNMapping:
      - match: "(.+)"
        ldapQuery: "DC=company,DC=internal??sub?(userPrincipalName={0}@company.internal)"
    
    # Cache for performance
    authz:
      queryTemplate: "{USER}?memberOf?base"
      cache:
        ttl: 300  # 5 minutes
        size: 1000

# Map LDAP groups to MongoDB roles
# Group: CN=MongoDB-ReadOnly,OU=Groups,DC=company,DC=internal
# Maps to: readAnyDatabase@admin

# Group: CN=MongoDB-DBA,OU=Groups,DC=company,DC=internal  
# Maps to: dbAdminAnyDatabase@admin + clusterMonitor@admin`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Auditing & Compliance Logging</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# mongod.conf - Comprehensive Audit Configuration (Enterprise)
auditLog:
  destination: file
  format: JSON  # or BSON for binary
  path: /var/log/mongodb/audit.log
  
  # Filter events by type
  filter: '{
    atype: { $in: ["authCheck", "authenticate", "insert", "update", "delete"] },
    "param.command": { $in: ["find", "insert", "update", "delete", "drop", "createUser"] }
  }'
  
  # HIPAA/SOC 2: Log all access to PHI collections
  filter: '{
    atype: "authCheck",
    "param.ns": { $regex: /^medical\\.patients$/ }
  }'

# Alternative: Send to syslog for SIEM integration
auditLog:
  destination: syslog
  
# Filter specific users (exclude monitoring)
auditLog:
  filter: '{ "user": { $ne: "monitoring-agent" } }'

# Enable system activity auditing
setParameter:
  auditAuthorizationSuccess: true  # Log successful ops too`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Enterprise Deployment: Replica Set Security</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# Replica Set with Full Security Stack
# Primary + 2 Secondaries + Arbiter

# Keyfile for internal authentication (minimum requirement)
# Generate: openssl rand -base64 756 > /etc/mongodb-keyfile
# chmod 400 /etc/mongodb-keyfile
# chown mongod:mongod /etc/mongodb-keyfile

# Primary Node Configuration
storage:
  dbPath: /var/lib/mongodb
  journal:
    enabled: true
  wiredTiger:
    engineConfig:
      cacheSizeGB: 8
      encryptionOptions:
        keyStorage:
          local:
            keyIdentifier: "mongodb-key"
            keyPath: "/etc/mongodb-keyfile"

replication:
  replSetName: "rs0-production"
  
sharding:
  clusterRole: shardsvr

security:
  keyFile: /etc/mongodb-keyfile
  authorization: enabled
  clusterAuthMode: keyFile
  
  # Encryption at Rest (Enterprise)
  enableEncryption: true
  encryptionKeyFile: /etc/mongodb-encryption-key
  
  # KMIP for key management
  kmip:
    serverName: kmip-server.internal
    port: 5696
    serverCAFile: /etc/ssl/kmip-ca.pem
    clientCertificateFile: /etc/ssl/kmip-client.pem

net:
  tls:
    mode: requireTLS
    certificateKeyFile: /etc/ssl/mongodb.pem
    CAFile: /etc/ssl/ca.pem`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Security Checklist: Production Readiness</h2>
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-4">Network Security</h3>
                  {[
                    "TLS 1.3 enforced for all connections",
                    "Certificate validation enabled (no bypass)",
                    "Bind IP restricted to required interfaces",
                    "Firewall rules: 27017 only from app servers",
                    "VPC peering or private endpoints",
                    "No public internet exposure",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0">
                      <span className="w-5 h-5 rounded border-2 border-slate-300 flex items-center justify-center text-xs text-slate-400">☐</span>
                      <span className="text-slate-700 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-4">Access Control</h3>
                  {[
                    "SCRAM-SHA-256 (not SHA-1)",
                    "x.509 for service accounts",
                    "Custom roles (not built-in readWrite)",
                    "Principle of least privilege",
                    "Regular access reviews (quarterly)",
                    "LDAP/AD integration (Enterprise)",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0">
                      <span className="w-5 h-5 rounded border-2 border-slate-300 flex items-center justify-center text-xs text-slate-400">☐</span>
                      <span className="text-slate-700 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-4">Encryption</h3>
                  {[
                    "Encryption at rest (Enterprise)",
                    "Client-Side Field Level Encryption for PII",
                    "Key rotation policy (annual)",
                    "External KMS/HSM integration",
                    "Backup encryption verified",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0">
                      <span className="w-5 h-5 rounded border-2 border-slate-300 flex items-center justify-center text-xs text-slate-400">☐</span>
                      <span className="text-slate-700 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-4">Monitoring & Compliance</h3>
                  {[
                    "Audit logging enabled (Enterprise)",
                    "SIEM integration (Splunk/ELK)",
                    "Failed login alerting",
                    "Privilege escalation monitoring",
                    "SOC 2 Type II evidence collection",
                    "Quarterly security assessments",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0">
                      <span className="w-5 h-5 rounded border-2 border-slate-300 flex items-center justify-center text-xs text-slate-400">☐</span>
                      <span className="text-slate-700 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">MongoDB Enterprise Security Assessment</h2>
            <p className="mb-6 max-w-2xl mx-auto">
              Validieren Sie Ihre MongoDB-Installation gegen Enterprise Security Best Practices und Compliance-Standards.
            </p>
            <a href={`${prefix}/check`} className="inline-block px-6 py-3 bg-white text-green-700 rounded-lg font-semibold hover:bg-slate-100 transition-colors">
              Security Assessment Starten
            </a>
          </section>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: "MongoDB Security Hardening 2026: Enterprise Database Protection",
        description: "Comprehensive guide to MongoDB Enterprise security including TLS 1.3, SCRAM authentication, x.509 certificates, field-level encryption, LDAP integration, and compliance controls.",
        author: { 
          "@type": "Organization", 
          name: "ClawGuru",
          url: BASE_URL 
        },
        publisher: {
          "@type": "Organization",
          name: "ClawGuru",
          logo: {
            "@type": "ImageObject",
            url: `${BASE_URL}/og-image.png`
          }
        },
        datePublished: "2026-03-29",
        dateModified: "2026-03-29",
        about: [
          { "@type": "Thing", name: "MongoDB Security" },
          { "@type": "Thing", name: "NoSQL Database Security" },
          { "@type": "Thing", name: "Database Encryption" }
        ],
        keywords: ["MongoDB", "Database Security", "TLS", "Encryption", "Authentication", "Compliance"],
      })}} />
    </main>
  );
}
