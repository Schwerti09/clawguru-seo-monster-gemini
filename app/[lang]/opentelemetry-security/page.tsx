import type { Metadata } from "next";
import { SUPPORTED_LOCALES, type Locale, localeAlternates } from "@/lib/i18n";
import { BASE_URL } from "@/lib/config";
import { getCoreSecurityLinks } from "@/lib/core-security-links";

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
      ? "OpenTelemetry Security 2026 | Observability Security & Collector Hardening"
      : "OpenTelemetry Security 2026 | Observability Security & Collector Hardening",
    description: locale === "de"
      ? "OpenTelemetry Security: Collector mTLS, API Keys, Attribute Sanitization, Sampling & OTLP Security. Enterprise Observability Protection."
      : "OpenTelemetry security: Collector mTLS, API keys, attribute sanitization, sampling & OTLP security. Enterprise observability protection.",
    keywords: [
      "OpenTelemetry security",
      "OTEL security",
      "OTEL Collector security",
      "OpenTelemetry mTLS",
      "OTLP security",
      "Observability security",
      "Telemetry security",
      "OpenTelemetry API keys",
      "Collector hardening",
      "Distributed tracing security",
    ],
    alternates: {
      ...localeAlternates(`/${locale}/opentelemetry-security`),
    },
    openGraph: {
      title: "OpenTelemetry Security 2026: Observability Protection",
      description: "Secure OpenTelemetry with mTLS, API authentication, PII filtering & collector hardening.",
      type: "article",
      url: `${BASE_URL}/${locale}/opentelemetry-security`,
    },
  };
}

export default async function OpenTelemetrySecurityPage({
  params,
}: {
  params: { lang: string };
}) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale;
  const prefix = `/${locale}`;
  const coreLinks = getCoreSecurityLinks(locale);
  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">OpenTelemetry Security</h1>
            <p className="text-2xl text-indigo-200 mb-4">Observability Security 2026</p>
            <p className="text-xl text-white/80 mb-8">Collector mTLS, API Keys, PII Filtering, Sampling & OTLP Security</p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">mTLS</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">OTLP</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">PII Filtering</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">API Keys</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">OTEL Collector Security Architecture</h2>
            <p className="text-slate-700 text-lg mb-6">
              OpenTelemetry Collector ist der zentrale Hub für alle Telemetrie-Daten. Ohne Security könnten sensitive Daten (PII, Credentials) ungeschützt übertragen werden. Sichern Sie OTLP, Exporter und Processor Pipeline.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                <h3 className="font-semibold text-purple-900 mb-2">Receiver Security</h3>
                <ul className="text-sm text-purple-800 space-y-1">
                  <li>• mTLS Authentication</li>
                  <li>• API Key Validation</li>
                  <li>• CORS Configuration</li>
                  <li>• Rate Limiting</li>
                </ul>
              </div>
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
                <h3 className="font-semibold text-indigo-900 mb-2">Data Protection</h3>
                <ul className="text-sm text-indigo-800 space-y-1">
                  <li>• PII Filtering</li>
                  <li>• Attribute Sanitization</li>
                  <li>• Span Masking</li>
                  <li>• Tail-based Sampling</li>
                </ul>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="font-semibold text-blue-900 mb-2">Export Security</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Secure OTLP</li>
                  <li>• Credential Management</li>
                  <li>• Endpoint Validation</li>
                  <li>• Retry/Timeout</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">OTEL Collector mTLS Configuration</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# collector-config.yaml - Secure OTEL Collector

receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
        tls:
          cert_file: /etc/otel/certs/server.crt
          key_file: /etc/otel/certs/server.key
          ca_file: /etc/otel/certs/ca.crt
          client_ca_file: /etc/otel/certs/ca.crt
          min_version: "1.3"  # TLS 1.3 only
          client_auth:
            require: true
            verify: true
      http:
        endpoint: 0.0.0.0:4318
        cors:
          allowed_origins: ["https://app.company.com"]
          allowed_headers: ["*"]
          max_age: 7200
        tls:
          cert_file: /etc/otel/certs/server.crt
          key_file: /etc/otel/certs/server.key
          ca_file: /etc/otel/certs/ca.crt
          min_version: "1.3"

  # Prometheus receiver with scrape config
  prometheus:
    config:
      scrape_configs:
        - job_name: 'kubernetes-pods'
          kubernetes_sd_configs:
            - role: pod
          tls_config:
            ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
            cert_file: /var/run/secrets/kubernetes.io/serviceaccount/token
            insecure_skip_verify: false
          relabel_configs:
            - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
              action: keep
              regex: true

processors:
  # PII Filtering - Critical!
  attributes/filter_pii:
    actions:
      - key: http.request.body
        action: delete  # Never store request bodies
      - key: http.response.body
        action: delete
      - key: password
        action: delete
      - key: token
        action: delete
      - key: authorization
        action: delete
      - key: api_key
        action: delete
      - key: email
        action: hash  # Hash instead of delete for analytics
      - key: user_id
        action: hash
      - key: trace_id
        action: hash

  # Resource attribute sanitization
  resource/sanitize:
    attributes:
      - key: process.command_line
        action: delete  # May contain secrets
      - key: process.command_args
        action: delete
      - key: host.id
        action: hash
      - key: container.id
        action: hash
      - key: k8s.pod.ip
        action: delete  # Internal IPs may be sensitive

  # Batch processing with limits
  batch:
    timeout: 1s
    send_batch_size: 1024
    send_batch_max_size: 2048

  # Memory limit to prevent OOM
  memory_limiter:
    limit_mib: 512
    spike_limit_mib: 128
    check_interval: 5s

  # Tail-based sampling for error analysis
  tail_sampling:
    decision_wait: 10s
    num_traces: 100000
    expected_new_traces_per_sec: 1000
    policies:
      - name: errors
        type: status_code
        status_code: {status_codes: [ERROR]}
      - name: slow_requests
        type: latency
        latency: {threshold_ms: 1000}
      - name: probabilistic
        type: probabilistic
        probabilistic: {sampling_percentage: 10}

exporters:
  otlp/jaeger:
    endpoint: jaeger-collector:4317
    tls:
      cert_file: /etc/otel/certs/client.crt
      key_file: /etc/otel/certs/client.key
      ca_file: /etc/otel/certs/ca.crt
      insecure: false
    headers:
      api-key: \${JAEGER_API_KEY}
    retry_on_failure:
      enabled: true
      initial_interval: 5s
      max_interval: 30s
      max_elapsed_time: 300s

  otlp/tempo:
    endpoint: tempo:4317
    tls:
      insecure: false
      ca_file: /etc/otel/certs/ca.crt
      cert_file: /etc/otel/certs/client.crt
      key_file: /etc/otel/certs/client.key
    headers:
      X-Scope-OrgID: production

  prometheusremotewrite:
    endpoint: https://prometheus:9090/api/v1/write
    tls:
      cert_file: /etc/otel/certs/client.crt
      key_file: /etc/otel/certs/client.key
      ca_file: /etc/otel/certs/ca.crt
    headers:
      Authorization: Bearer \${PROMETHEUS_TOKEN}
    external_labels:
      environment: production
      cluster: eu-west-1

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [memory_limiter, attributes/filter_pii, resource/sanitize, tail_sampling, batch]
      exporters: [otlp/jaeger, otlp/tempo]
    
    metrics:
      receivers: [otlp, prometheus]
      processors: [memory_limiter, batch]
      exporters: [prometheusremotewrite]
    
    logs:
      receivers: [otlp]
      processors: [memory_limiter, attributes/filter_pii, batch]
      exporters: [otlp/tempo]

  telemetry:
    logs:
      level: info
    metrics:
      level: detailed
      address: 0.0.0.0:8888`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Application Instrumentation Security</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# Node.js - Secure OpenTelemetry SDK Configuration

const { NodeSDK } = require('@opentelemetry/sdk-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-grpc');
const { OTLPMetricExporter } = require('@opentelemetry/exporter-metrics-otlp-grpc');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { SimpleSpanProcessor, ParentBasedSampler, TraceIdRatioBasedSampler } = require('@opentelemetry/sdk-trace-node');
const grpc = require('@grpc/grpc-js');
const fs = require('fs');

// mTLS credentials
const credentials = grpc.credentials.createSsl(
  fs.readFileSync('/etc/app/certs/ca.crt'),
  fs.readFileSync('/etc/app/certs/client.key'),
  fs.readFileSync('/etc/app/certs/client.crt')
);

const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'payment-service',
    [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
    [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: 'production',
    // Never include: host.name, process.runtime.version (may leak info)
  }),
  
  traceExporter: new OTLPTraceExporter({
    url: 'https://otel-collector.company.com:4317',
    credentials: credentials,
    metadata: new grpc.Metadata().add('api-key', process.env.OTEL_API_KEY),
    timeoutMillis: 10000,
    
    // Compression
    compression: 'gzip',
  }),
  
  metricExporter: new OTLPMetricExporter({
    url: 'https://otel-collector.company.com:4317',
    credentials: credentials,
    headers: {
      'api-key': process.env.OTEL_API_KEY,
    },
  }),
  
  // Secure sampling - don't trace everything
  sampler: new ParentBasedSampler({
    root: new TraceIdRatioBasedSampler(0.1),  // 10% sampling
  }),
  
  spanProcessor: new SimpleSpanProcessor(),
});

// PII Filtering Custom Processor
class PIISanitizationProcessor {
  onStart(span, parentContext) {
    // Sanitize attributes
    const attributes = span.attributes;
    
    // Delete sensitive attributes
    delete attributes['http.request.body'];
    delete attributes['http.response.body'];
    delete attributes['http.request.header.authorization'];
    delete attributes['http.request.header.cookie'];
    delete attributes['http.request.header.x-api-key'];
    delete attributes['db.statement'];  // May contain PII
    
    // Mask credit card numbers
    if (attributes['http.request.body']) {
      attributes['http.request.body'] = 
        attributes['http.request.body'].replace(/\\d{4}-\\d{4}-\\d{4}-\\d{4}/g, '****-****-****-****');
    }
    
    // Hash user identifiers
    if (attributes['enduser.id']) {
      attributes['enduser.id'] = hash(attributes['enduser.id']);
    }
  }
  
  onEnd(span) {}
  shutdown() { return Promise.resolve(); }
  forceFlush() { return Promise.resolve(); }
}

sdk.addSpanProcessor(new PIISanitizationProcessor());
sdk.start();

// Graceful shutdown
process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('OTEL SDK shut down'))
    .catch(err => console.error('Error shutting down OTEL SDK', err))
    .finally(() => process.exit(0));
});`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Kubernetes OTEL Security</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# otel-collector-daemonset.yaml - Secure K8s Deployment

apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: otel-collector
  namespace: observability
spec:
  selector:
    matchLabels:
      app: otel-collector
  template:
    metadata:
      labels:
        app: otel-collector
    spec:
      serviceAccountName: otel-collector
      securityContext:
        runAsUser: 10001
        runAsGroup: 10001
        fsGroup: 10001
        runAsNonRoot: true
        seccompProfile:
          type: RuntimeDefault
      containers:
      - name: otel-collector
        image: otel/opentelemetry-collector-contrib:0.96.0
        securityContext:
          allowPrivilegeEscalation: false
          readOnlyRootFilesystem: true
          capabilities:
            drop:
            - ALL
        resources:
          limits:
            cpu: "1"
            memory: 1Gi
          requests:
            cpu: 200m
            memory: 400Mi
        volumeMounts:
        - name: config
          mountPath: /conf
        - name: certs
          mountPath: /etc/otel/certs
          readOnly: true
        - name: tmp
          mountPath: /tmp
        args:
        - --config=/conf/collector-config.yaml
        env:
        - name: JAEGER_API_KEY
          valueFrom:
            secretKeyRef:
              name: otel-secrets
              key: jaeger-api-key
        - name: PROMETHEUS_TOKEN
          valueFrom:
            secretKeyRef:
              name: otel-secrets
              key: prometheus-token
      volumes:
      - name: config
        configMap:
          name: otel-collector-config
      - name: certs
        projected:
          sources:
          - secret:
              name: otel-tls
              items:
              - key: tls.crt
                path: server.crt
              - key: tls.key
                path: server.key
              - key: ca.crt
                path: ca.crt
      - name: tmp
        emptyDir: {}

---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: otel-collector
rules:
- apiGroups: [""]
  resources: ["pods", "nodes", "nodes/stats", "nodes/proxy", "services", "endpoints"]
  verbs: ["get", "list", "watch"]
- apiGroups: ["apps"]
  resources: ["replicasets", "deployments"]
  verbs: ["get", "list", "watch"]

---
apiVersion: v1
kind: Secret
metadata:
  name: otel-secrets
  namespace: observability
type: Opaque
data:
  jaeger-api-key: <base64-encoded>
  prometheus-token: <base64-encoded>

---
# Network Policy - Restrict Collector Access
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: otel-collector
  namespace: observability
spec:
  podSelector:
    matchLabels:
      app: otel-collector
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: production
    - namespaceSelector:
        matchLabels:
          name: staging
    ports:
    - protocol: TCP
      port: 4317
    - protocol: TCP
      port: 4318
  egress:
  - to:
    - podSelector:
        matchLabels:
          app: jaeger
    - podSelector:
        matchLabels:
          app: prometheus
    - podSelector:
        matchLabels:
          app: tempo
    ports:
    - protocol: TCP
      port: 4317
    - protocol: TCP
      port: 9090`}
              </pre>
            </div>
          </section>

          <section className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">OpenTelemetry Security Assessment</h2>
            <a href={coreLinks.check} className="inline-block px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold">Assessment Starten</a>
            <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
              <a href={`${prefix}/openclaw-security-check`} className="rounded-lg border border-white/30 px-3 py-2 text-white hover:bg-white/10">OpenClaw Security Hub</a>
              <a href={`${prefix}/ai-agent-security`} className="rounded-lg border border-white/30 px-3 py-2 text-white hover:bg-white/10">AI Agent Security</a>
              <a href={`${prefix}/runbooks/security`} className="rounded-lg border border-white/30 px-3 py-2 text-white hover:bg-white/10">Security Runbooks</a>
              <a href={coreLinks.methodology} className="rounded-lg border border-white/30 px-3 py-2 text-white hover:bg-white/10">Methodology</a>
            </div>

          </section>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: "OpenTelemetry Security 2026",
        author: { "@type": "Organization", name: "ClawGuru", url: BASE_URL },
        datePublished: "2026-03-29",
      })}} />
    </main>
  );
}
