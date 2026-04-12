import type { Metadata } from "next";
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n";
import { BASE_URL } from "@/lib/config";
import { getCoreSecurityLinks } from "@/lib/core-security-links";
import { t } from "@/lib/article-i18n"

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
      ? "AWS VPC Flow Logs 2026 | Network Traffic Analysis & Security"
      : "AWS VPC Flow Logs 2026 | Network Traffic Analysis & Security",
    description: locale === "de"
      ? "AWS VPC Flow Logs Guide: Athena-Analyse, CloudWatch Insights, S3 Storage, Security Monitoring & Compliance. Network Forensics & Anomalie-Erkennung."
      : "AWS VPC Flow Logs guide: Athena analysis, CloudWatch Insights, S3 storage, security monitoring & compliance. Network forensics & anomaly detection.",
    keywords: [
      "AWS VPC Flow Logs",
      "VPC Flow Logs analysis",
      "AWS network monitoring",
      "AWS Athena flow logs",
      "AWS security monitoring",
      "Network forensics AWS",
      "VPC traffic analysis",
      "AWS compliance logging",
      "Flow logs S3",
      "AWS network security",
    ],
    alternates: buildLocalizedAlternates(locale, "/aws-vpc-flow-logs"),
    openGraph: {
      title: "AWS VPC Flow Logs 2026: Network Security Analysis",
      description: "Analyze AWS VPC Flow Logs with Athena, CloudWatch & Security tools. Complete guide.",
      type: "article",
      url: `${BASE_URL}/${locale}/aws-vpc-flow-logs`,
    },
  };
}

export default function AWSVPCFlowLogsPage({
  params,
}: {
  params: { lang: string };
}) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale)
    ? params.lang
    : "de") as Locale;
  const prefix = `/${locale}`;
  const coreLinks = getCoreSecurityLinks(locale);


  return (
    <main className="min-h-screen bg-gray-800">
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-amber-600 to-yellow-600 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-sm mb-4">
              AWS Network Security 2026
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              AWS VPC Flow Logs
            </h1>
            <p className="text-2xl text-amber-100 mb-4">
              {t(locale, "Netzwerk-Traffic Analyse & Security", "Network Traffic Analysis & Security")}
            </p>
            <p className="text-xl text-white/80 mb-8">
              Athena, CloudWatch Insights, S3, Security Monitoring & Compliance. Network Forensics für AWS.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Athena</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">CloudWatch</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">S3</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Security Lake</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">Was sind VPC Flow Logs?</h2>
            <p className="text-gray-200 text-lg mb-6">
              VPC Flow Logs erfassen Informationen über IP-Datenverkehr in und aus Netzwerkschnittstellen in Ihrer VPC. Nutzen Sie sie für Sicherheitsanalysen, Netzwerk-Fehlerbehebung und Compliance-Monitoring.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-orange-50 border border-orange-700 rounded-xl p-6">
                <h3 className="font-semibold text-orange-900 mb-2">Erfasste Daten</h3>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>• Source/Destination IP</li>
                  <li>• Source/Destination Port</li>
                  <li>• Protocol (TCP/UDP/ICMP)</li>
                  <li>• Packets & Bytes</li>
                  <li>• Start/End Time</li>
                  <li>• Action (ACCEPT/REJECT)</li>
                </ul>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <h3 className="font-semibold text-amber-900 mb-2">Use Cases</h3>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• DDoS Detection</li>
                  <li>• Datenexfiltration</li>
                  <li>• Compliance Auditing</li>
                  <li>• Netzwerk-Troubleshooting</li>
                  <li>• Kosten-Analyse</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">Terraform Setup</h2>
            
            <div className="bg-slate-900 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">VPC Flow Logs mit Athena Integration</h3>
              <pre className="font-mono text-sm text-green-400 overflow-x-auto">
{`# VPC Flow Logs
resource "aws_flow_log" "vpc_flow_logs" {
  vpc_id                   = aws_vpc.main.id
  traffic_type             = "ALL"
  log_destination_type     = "s3"
  log_destination          = aws_s3_bucket.flow_logs.arn
  log_format               = "$\${version} $\${account-id} $\${interface-id} $\${srcaddr} $\${dstaddr} $\${srcport} $\${dstport} $\${protocol} $\${packets} $\${bytes} $\${start} $\${end} $\${action} $\${log-status} $\${vpc-id} $\${subnet-id} $\${instance-id} $\${tcp-flags} $\${type} $\${pkt-srcaddr} $\${pkt-dstaddr}"
  
  destination_options {
    file_format                = "parquet"
    per_hour_partition         = true
    hive_compatible_partitions = true
  }
  
  tags = {
    Name = "vpc-flow-logs"
    Compliance = "SOC2-ISO27001"
  }
}

# S3 Bucket für Flow Logs
resource "aws_s3_bucket" "flow_logs" {
  bucket = "company-vpc-flow-logs-$\${data.aws_caller_identity.current.account_id}"
}

resource "aws_s3_bucket_lifecycle_configuration" "flow_logs" {
  bucket = aws_s3_bucket.flow_logs.id
  
  rule {
    id     = "archive-old-logs"
    status = "Enabled"
    
    transition {
      days          = 30
      storage_class = "STANDARD_IA"
    }
    
    transition {
      days          = 90
      storage_class = "GLACIER"
    }
    
    expiration {
      days = 365
    }
  }
}`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">Athena SQL Queries</h2>
            
            <div className="bg-slate-900 rounded-xl p-6 mb-6">
              <h3 className="text-white font-semibold mb-4">Athena Table Definition</h3>
              <pre className="font-mono text-sm text-green-400">
{`CREATE EXTERNAL TABLE IF NOT EXISTS vpc_flow_logs (
  version int,
  account string,
  interfaceid string,
  sourceaddress string,
  destinationaddress string,
  sourceport int,
  destinationport int,
  protocol int,
  numpackets int,
  numbytes bigint,
  starttime int,
  endtime int,
  action string,
  logstatus string,
  vpcid string,
  subnetid string,
  instanceid string,
  tcpflags int,
  type string,
  pktsrcaddr string,
  pktdstaddr string
)
PARTITIONED BY (region string, date_partition string)
ROW FORMAT SERDE 'org.apache.hadoop.hive.ql.io.parquet.serde.ParquetHiveSerDe'
STORED AS INPUTFORMAT 'org.apache.hadoop.hive.ql.io.parquet.MapredParquetInputFormat'
OUTPUTFORMAT 'org.apache.hadoop.hive.ql.io.parquet.MapredParquetOutputFormat'
LOCATION 's3://company-vpc-flow-logs/AWSLogs/'`}
              </pre>
            </div>

            <div className="bg-slate-900 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Security Analysis Queries</h3>
              <pre className="font-mono text-sm text-green-400">
{`-- Top Talkers (Data Exfiltration Detection)
SELECT 
  sourceaddress,
  destinationaddress,
  destinationport,
  sum(numbytes) as total_bytes,
  count(*) as connection_count
FROM vpc_flow_logs
WHERE date_partition = '2026-03-29'
  AND action = 'ACCEPT'
GROUP BY sourceaddress, destinationaddress, destinationport
HAVING sum(numbytes) > 1000000000  -- > 1GB
ORDER BY total_bytes DESC;

-- Rejected Connections (Port Scan Detection)
SELECT 
  sourceaddress,
  count(distinct destinationport) as unique_ports,
  count(*) as total_attempts
FROM vpc_flow_logs
WHERE date_partition = '2026-03-29'
  AND action = 'REJECT'
GROUP BY sourceaddress
HAVING count(distinct destinationport) > 100
ORDER BY unique_ports DESC;

-- Nacht-Traffic (Ungewöhnliche Zeiten)
SELECT *
FROM vpc_flow_logs
WHERE date_partition = '2026-03-29'
  AND from_unixtime(starttime) BETWEEN '22:00:00' AND '06:00:00'
  AND action = 'ACCEPT'
ORDER BY numbytes DESC;`}
              </pre>
            </div>
          </section>

          <section className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">VPC Flow Logs Analysis</h2>
            <p className="mb-6">Automatisieren Sie Ihre Netzwerk-Security Analyse.</p>
            <a href={coreLinks.check} className="inline-block px-6 py-3 bg-gray-800 text-orange-400 rounded-lg font-semibold">
              Flow Logs Assessment
            </a>
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
        headline: "AWS VPC Flow Logs 2026",
        author: { "@type": "Organization", name: "ClawGuru", url: BASE_URL },
        datePublished: "2026-03-29",
      })}} />
    </main>
  );
}
