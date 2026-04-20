/**
 * ClawGuru Certified Security Defender — Foundation Tier
 * Practice Exam Question Bank
 *
 * 15 questions across 5 topic areas. Mirrors structure of the paid Foundation exam
 * (60 questions). Free practice version: a representative slice.
 *
 * Maintenance: every question MUST cite a reference (runbook slug, CVE, CIS
 * benchmark). Update reviewedAt annually.
 */

export type QuestionType = "multiple-choice" | "true-false" | "scenario"

export interface Question {
  id: string
  type: QuestionType
  topic:
    | "linux-hardening"
    | "ssh-security"
    | "firewall"
    | "container-security"
    | "incident-response"
    | "compliance"
    | "monitoring"
  difficulty: "easy" | "medium" | "hard"
  prompt: { de: string; en: string }
  options: { id: string; de: string; en: string }[]
  correctOptionIds: string[]
  explanation: { de: string; en: string }
  reference?: string
}

export const FOUNDATION_EXAM_QUESTIONS: Question[] = [
  {
    id: "f-001",
    type: "multiple-choice",
    topic: "ssh-security",
    difficulty: "easy",
    prompt: {
      de: "Du übernimmst einen neuen Ubuntu-Server. SSH erlaubt aktuell Passwort-Login als root. Was ist die korrekte Reihenfolge zum Absichern?",
      en: "You take over a new Ubuntu server. SSH currently allows password login as root. What's the correct hardening sequence?",
    },
    options: [
      {
        id: "a",
        de: "Root-Login deaktivieren → Server neustarten → Admin-User anlegen",
        en: "Disable root login → reboot server → create admin user",
      },
      {
        id: "b",
        de: "Admin-User mit SSH-Key anlegen → Login testen (2. Terminal offen!) → PermitRootLogin no + PasswordAuthentication no",
        en: "Create admin user with SSH key → test login (keep 2nd terminal open!) → PermitRootLogin no + PasswordAuthentication no",
      },
      {
        id: "c",
        de: "PasswordAuthentication no setzen → sshd neustarten → später Admin-User anlegen",
        en: "Set PasswordAuthentication no → restart sshd → create admin user later",
      },
      {
        id: "d",
        de: "fail2ban installieren reicht aus",
        en: "Installing fail2ban is enough",
      },
    ],
    correctOptionIds: ["b"],
    explanation: {
      de: "Goldene Regel: NIE Zugang wegkonfigurieren bevor der neue Weg verifiziert ist. Admin-User mit Key-Auth anlegen, parallelen SSH-Tab offen halten, dann Passwort-Auth + Root-Login deaktivieren. fail2ban ist gut, ersetzt aber keine Key-Auth.",
      en: "Golden rule: never remove access before the new access is verified. Create admin user with key auth, keep a parallel SSH tab open, then disable password auth + root login. fail2ban is good but doesn't replace key auth.",
    },
    reference: "runbook/ssh-hardening-checklist",
  },
  {
    id: "f-002",
    type: "multiple-choice",
    topic: "ssh-security",
    difficulty: "easy",
    prompt: {
      de: "Welche SSH-Config-Direktive beugt Brute-Force am wirksamsten vor?",
      en: "Which SSH config directive most effectively mitigates brute-force attacks?",
    },
    options: [
      { id: "a", de: "PermitRootLogin no", en: "PermitRootLogin no" },
      { id: "b", de: "PasswordAuthentication no (Key-only)", en: "PasswordAuthentication no (key-only)" },
      { id: "c", de: "MaxAuthTries 3", en: "MaxAuthTries 3" },
      { id: "d", de: "Port 2222 (obscurity)", en: "Port 2222 (obscurity)" },
    ],
    correctOptionIds: ["b"],
    explanation: {
      de: "Key-only Auth eliminiert Brute-Force im Wurzelproblem — es gibt kein Passwort zu brute-forcen. MaxAuthTries hilft bei Connection-Flood, Port-Ändern ist Security-by-Obscurity (kein Schutz).",
      en: "Key-only auth eliminates brute-force at the root — there's no password to brute-force. MaxAuthTries helps with connection flooding; port-changing is security-by-obscurity (no real protection).",
    },
    reference: "runbook/ssh-hardening-checklist",
  },
  {
    id: "f-003",
    type: "multiple-choice",
    topic: "firewall",
    difficulty: "medium",
    prompt: {
      de: "PostgreSQL läuft auf einem Hetzner-VPS und hört auf 0.0.0.0:5432. Was sollte dein erster Fix sein?",
      en: "PostgreSQL runs on a Hetzner VPS listening on 0.0.0.0:5432. What's your first fix?",
    },
    options: [
      { id: "a", de: "pg_hba.conf auf md5 umstellen", en: "Switch pg_hba.conf to md5" },
      {
        id: "b",
        de: "listen_addresses = 'localhost' + Firewall-Rule (ufw deny 5432)",
        en: "listen_addresses = 'localhost' + firewall rule (ufw deny 5432)",
      },
      { id: "c", de: "Starkes Passwort für postgres-User setzen", en: "Set a strong password for postgres user" },
      {
        id: "d",
        de: "SSL-Zertifikat installieren, dann bleiben 0.0.0.0 erlaubt",
        en: "Install SSL certificate, then 0.0.0.0 stays allowed",
      },
    ],
    correctOptionIds: ["b"],
    explanation: {
      de: "Defence in Depth: zuerst Exposure killen (localhost + Firewall), dann Auth härten. Passwörter + SSL helfen gegen authentifizierte Angriffe, schützen aber nicht vor exposed-by-default-CVEs. Tunnels (SSH/Wireguard) für Remote-Zugriff.",
      en: "Defence in depth: kill exposure first (localhost + firewall), then harden auth. Passwords + SSL help against authenticated attacks but don't protect against exposed-by-default CVEs. Use tunnels (SSH/WireGuard) for remote access.",
    },
    reference: "runbook/postgresql-network-hardening",
  },
  {
    id: "f-004",
    type: "true-false",
    topic: "firewall",
    difficulty: "easy",
    prompt: {
      de: "Wenn dein Cloud-Provider Security Groups bietet, ist eine host-lokale Firewall (ufw/nftables) überflüssig.",
      en: "If your cloud provider offers security groups, a host-local firewall (ufw/nftables) is redundant.",
    },
    options: [
      { id: "true", de: "Wahr", en: "True" },
      { id: "false", de: "Falsch", en: "False" },
    ],
    correctOptionIds: ["false"],
    explanation: {
      de: "Falsch. Cloud-SGs schützen die Grenze zur Umgebung, aber bei einem kompromittierten Nachbar-Host im gleichen Subnet (lateral movement) oder bei falsch konfiguriertem SG schützt nur die host-lokale Firewall. Defence in Depth.",
      en: "False. Cloud SGs protect the environment edge, but against a compromised neighbor host in the same subnet (lateral movement) or a misconfigured SG, only the host-local firewall protects. Defence in depth.",
    },
  },
  {
    id: "f-005",
    type: "multiple-choice",
    topic: "container-security",
    difficulty: "medium",
    prompt: {
      de: "Dein Kollege hat einen Container mit `-v /var/run/docker.sock:/var/run/docker.sock` gestartet, damit die App Docker-Commands ausführen kann. Was ist das Risiko?",
      en: "A colleague ran a container with `-v /var/run/docker.sock:/var/run/docker.sock` so the app can run Docker commands. What's the risk?",
    },
    options: [
      {
        id: "a",
        de: "Kein Risiko, Docker-Daemon läuft ja als root — das ist Standard",
        en: "No risk — the Docker daemon runs as root, it's standard",
      },
      {
        id: "b",
        de: "Container-Escape zu Root auf Host ist trivial (docker run -v /:/host)",
        en: "Container-escape to root on host is trivial (docker run -v /:/host)",
      },
      { id: "c", de: "Nur Performance-Impact durch doppelte Layer", en: "Only performance impact via duplicated layers" },
      {
        id: "d",
        de: "Risiko nur wenn der Container mit --privileged läuft",
        en: "Risk only if the container runs with --privileged",
      },
    ],
    correctOptionIds: ["b"],
    explanation: {
      de: "Docker-Socket mounten = Root auf dem Host für wen immer Zugriff auf den Socket hat. Der Container muss NICHT privileged sein — er startet einfach einen neuen Container mit `--volume /:/host` und liest beliebige Files. Alternativen: rootless Docker, BuildKit-Sockets, Docker-API über TLS mit limitiertem Client-Zertifikat.",
      en: "Mounting the Docker socket = root on the host for whoever has socket access. The container does NOT need to be privileged — it just starts a new container with `--volume /:/host` and reads arbitrary files. Alternatives: rootless Docker, BuildKit sockets, Docker API over TLS with a limited client cert.",
    },
    reference: "runbook/docker-socket-alternatives",
  },
  {
    id: "f-006",
    type: "multiple-choice",
    topic: "container-security",
    difficulty: "easy",
    prompt: {
      de: "Welche Dockerfile-Zeile macht das Image am meisten sicherer?",
      en: "Which Dockerfile line makes the image most secure?",
    },
    options: [
      { id: "a", de: "FROM ubuntu:latest", en: "FROM ubuntu:latest" },
      { id: "b", de: "USER 1000:1000 (non-root)", en: "USER 1000:1000 (non-root)" },
      { id: "c", de: "RUN chmod 777 /app", en: "RUN chmod 777 /app" },
      {
        id: "d",
        de: "EXPOSE 0-65535 (alle Ports offen für Flexibilität)",
        en: "EXPOSE 0-65535 (all ports open for flexibility)",
      },
    ],
    correctOptionIds: ["b"],
    explanation: {
      de: "Non-root-User ist der wichtigste einzelne Sicherheits-Win im Container: ohne root hat ein Escape massiv begrenzten Impact. `latest` tag ist Anti-Pattern (nicht reproduzierbar), 777 öffnet Lokaleskalation, EXPOSE aller Ports ist sinnfrei.",
      en: "Non-root user is the single biggest in-container security win: without root, an escape has drastically limited impact. `latest` tag is an anti-pattern (not reproducible), 777 opens local escalation, EXPOSE of all ports is nonsense.",
    },
    reference: "runbook/dockerfile-security-checklist",
  },
  {
    id: "f-007",
    type: "multiple-choice",
    topic: "linux-hardening",
    difficulty: "medium",
    prompt: {
      de: "Welcher Befehl findet alle SUID-Binaries auf einem Linux-System (oft ein Pfad für Privilege-Escalation)?",
      en: "Which command finds all SUID binaries on a Linux system (often a privilege-escalation path)?",
    },
    options: [
      { id: "a", de: "ls -la /usr/bin/*", en: "ls -la /usr/bin/*" },
      { id: "b", de: "find / -perm -4000 -type f 2>/dev/null", en: "find / -perm -4000 -type f 2>/dev/null" },
      { id: "c", de: "chmod -R u-s /", en: "chmod -R u-s /" },
      { id: "d", de: "stat /etc/passwd | grep suid", en: "stat /etc/passwd | grep suid" },
    ],
    correctOptionIds: ["b"],
    explanation: {
      de: "`find / -perm -4000` listet alle Files mit gesetztem Set-UID-Bit. Pentester + Audits nutzen diesen Befehl routinemäßig. `chmod -R u-s /` würde das System zerstören (sudo, passwd etc. brauchen SUID).",
      en: "`find / -perm -4000` lists all files with the SUID bit set. Pentesters + audits use this routinely. `chmod -R u-s /` would break the system (sudo, passwd etc. need SUID).",
    },
    reference: "runbook/linux-privilege-escalation-audit",
  },
  {
    id: "f-008",
    type: "scenario",
    topic: "incident-response",
    difficulty: "hard",
    prompt: {
      de: "2:47 Uhr. Alert: dein Prod-DB-Server hat 847 fehlgeschlagene SSH-Logins in 3 Minuten. fail2ban hat 12 IPs gebannt, aber Logins kommen weiter von neuen IPs. Was ist dein ERSTER Schritt?",
      en: "2:47 AM. Alert: your prod DB server has 847 failed SSH logins in 3 minutes. fail2ban banned 12 IPs but logins keep arriving from new IPs. What's your FIRST step?",
    },
    options: [
      {
        id: "a",
        de: "Root-Passwort wechseln und zurück ins Bett",
        en: "Change root password and go back to bed",
      },
      {
        id: "b",
        de: "sshd komplett stoppen → aus dem Admin-VPN prüfen ob kompromittiert → dann Gegenmaßnahmen",
        en: "Stop sshd entirely → verify compromise from admin VPN → then counter-measures",
      },
      { id: "c", de: "Post auf Twitter machen", en: "Tweet about it" },
      {
        id: "d",
        de: "Port von 22 auf 2222 ändern",
        en: "Change port from 22 to 2222",
      },
    ],
    correctOptionIds: ["b"],
    explanation: {
      de: "Incident-Response-Prinzip: Containment zuerst, Investigation zweites. SSH stoppen verhindert weitere Versuche, Admin-VPN-Zugang erlaubt forensische Analyse. Port-wechseln ist reine Obscurity und hilft nicht gegen automatisierte Scanner. Passwort ändern hilft nur wenn Passwort-Auth überhaupt aktiviert ist (sollte nicht).",
      en: "IR principle: containment first, investigation second. Stopping SSH stops further attempts; admin-VPN access allows forensics. Port-changing is pure obscurity and doesn't help against automated scanners. Changing the password only helps if password auth is even enabled (shouldn't be).",
    },
    reference: "runbook/ssh-bruteforce-incident-response",
  },
  {
    id: "f-009",
    type: "multiple-choice",
    topic: "incident-response",
    difficulty: "medium",
    prompt: {
      de: "Nach einem bestätigten Server-Kompromiss ist welche Aktion am RISKANTESTEN für die Forensik?",
      en: "After a confirmed server compromise, which action is MOST risky for forensics?",
    },
    options: [
      { id: "a", de: "Snapshot der Disk ziehen", en: "Take a disk snapshot" },
      { id: "b", de: "`ps auxf` und `netstat -tulpen` speichern", en: "Save `ps auxf` and `netstat -tulpen`" },
      { id: "c", de: "Server `shutdown -h now`", en: "Server `shutdown -h now`" },
      { id: "d", de: "Network-isolieren (firewall-drop)", en: "Network-isolate (firewall drop)" },
    ],
    correctOptionIds: ["c"],
    explanation: {
      de: "Shutdown killt Memory-Forensik (Prozesse, Netzwerk-Verbindungen, Decrypt-Keys im RAM). Korrekt: Netzwerk isolieren (weiteres Kommando verhindern), Memory-Dump ziehen, DANN disk-snapshot, DANN poweroff. Volatility-Analyse braucht RAM.",
      en: "Shutdown kills memory forensics (processes, network connections, decrypt keys in RAM). Correct: network-isolate (prevents further commands), memory-dump, THEN disk snapshot, THEN poweroff. Volatility analysis needs RAM.",
    },
    reference: "runbook/compromised-server-forensics",
  },
  {
    id: "f-010",
    type: "multiple-choice",
    topic: "compliance",
    difficulty: "medium",
    prompt: {
      de: "Ein Kunde fragt: 'Wo werden unsere Daten gespeichert?' Was ist die korrekte GDPR-konforme Antwort?",
      en: "A customer asks: 'Where is our data stored?' What's the correct GDPR-compliant answer?",
    },
    options: [
      {
        id: "a",
        de: "'In der Cloud' ist ausreichend",
        en: "'In the cloud' is sufficient",
      },
      {
        id: "b",
        de: "Konkrete Region(en), Provider (Art.-28-Auftragsverarbeiter), ggf. Drittland-Transfer + Standardvertragsklauseln",
        en: "Specific region(s), provider (Art. 28 processor), any third-country transfer + standard contractual clauses",
      },
      {
        id: "c",
        de: "Die Info ist ein Geschäftsgeheimnis, kann nicht geteilt werden",
        en: "That info is a trade secret, cannot be shared",
      },
      {
        id: "d",
        de: "Es reicht zu sagen: 'GDPR-konform gespeichert'",
        en: "It's enough to say: 'stored GDPR-compliant'",
      },
    ],
    correctOptionIds: ["b"],
    explanation: {
      de: "Art. 13/14 GDPR: Betroffene haben Recht auf Transparenz über Datenverarbeitung. B2B-Kunden fragen aus Art. 28 AVV-Gründen — konkrete Region + Provider nennen ist Pflicht. Drittland-Transfers (USA) brauchen SCCs + TIA seit Schrems II.",
      en: "Art. 13/14 GDPR: data subjects have a right to transparency. B2B customers ask for Art. 28 DPA reasons — naming the specific region + provider is mandatory. Third-country transfers (US) need SCCs + TIA since Schrems II.",
    },
    reference: "runbook/gdpr-data-location-disclosure",
  },
  {
    id: "f-011",
    type: "multiple-choice",
    topic: "monitoring",
    difficulty: "easy",
    prompt: {
      de: "Welcher Log-Eintrag ist am verdächtigsten?",
      en: "Which log entry is most suspicious?",
    },
    options: [
      { id: "a", de: "GET /index.html 200", en: "GET /index.html 200" },
      {
        id: "b",
        de: "GET /.git/config 200",
        en: "GET /.git/config 200",
      },
      { id: "c", de: "POST /api/login 429", en: "POST /api/login 429" },
      { id: "d", de: "GET /favicon.ico 404", en: "GET /favicon.ico 404" },
    ],
    correctOptionIds: ["b"],
    explanation: {
      de: ".git/config öffentlich zugänglich = Gesamtes Source-Repo potenziell exponiert. Alle bekannten Path-Traversal-Tools scannen dafür. 429 auf Login ist GUT (Rate-Limit funktioniert), 404 auf Favicon ist Rauschen.",
      en: ".git/config publicly accessible = entire source repo potentially exposed. All known path-traversal tools scan for it. 429 on login is GOOD (rate-limit works), 404 on favicon is noise.",
    },
    reference: "runbook/exposed-dotgit-detection",
  },
  {
    id: "f-012",
    type: "true-false",
    topic: "monitoring",
    difficulty: "medium",
    prompt: {
      de: "Log-Forwarding zu einem zentralen SIEM ist nur für Enterprise-Umgebungen sinnvoll.",
      en: "Log forwarding to a central SIEM is only useful for enterprise environments.",
    },
    options: [
      { id: "true", de: "Wahr", en: "True" },
      { id: "false", de: "Falsch", en: "False" },
    ],
    correctOptionIds: ["false"],
    explanation: {
      de: "Falsch. Jedes System mit >1 Server profitiert: lokale Logs auf einem kompromittierten Host kann der Angreifer löschen/ändern. Remote-Log-Forward (selbst zu einem billigen VPS mit Loki/Grafana oder ELK) sichert den Audit-Trail. Auch 2-Server-Homelabs brauchen das.",
      en: "False. Any system with >1 server benefits: local logs on a compromised host can be deleted/modified by the attacker. Remote log forwarding (even to a cheap VPS with Loki/Grafana or ELK) preserves the audit trail. Even 2-server homelabs need it.",
    },
    reference: "runbook/central-log-forwarding-minimal",
  },
  {
    id: "f-013",
    type: "multiple-choice",
    topic: "linux-hardening",
    difficulty: "medium",
    prompt: {
      de: "Welcher Befehl erzwingt automatische Security-Updates auf einem Ubuntu-Server?",
      en: "Which command enforces automatic security updates on an Ubuntu server?",
    },
    options: [
      { id: "a", de: "apt upgrade -y im Cron täglich", en: "apt upgrade -y in daily cron" },
      {
        id: "b",
        de: "unattended-upgrades konfigurieren (nur Security-Repo)",
        en: "configure unattended-upgrades (security repo only)",
      },
      { id: "c", de: "Kein automatischer Update (Stabilität)", en: "No auto-update (stability)" },
      { id: "d", de: "apt install --auto-update", en: "apt install --auto-update" },
    ],
    correctOptionIds: ["b"],
    explanation: {
      de: "`unattended-upgrades` applied **nur** das Security-Repo automatisch — balance aus Stabilität und Patch-Geschwindigkeit. `apt upgrade -y` wäre zu aggressiv (bricht Services bei Major-Updates). 'Kein Auto-Update' bedeutet CVEs bleiben Monate offen — keine Option.",
      en: "`unattended-upgrades` applies **only** the security repo automatically — balance of stability and patch speed. `apt upgrade -y` is too aggressive (breaks services on major updates). 'No auto-update' means CVEs stay open for months — not an option.",
    },
    reference: "runbook/ubuntu-unattended-upgrades",
  },
  {
    id: "f-014",
    type: "multiple-choice",
    topic: "compliance",
    difficulty: "hard",
    prompt: {
      de: "Ein Kunde fragt nach SOC-2-Type-II-Report. Du hast aktuell keinen. Was ist die ehrlichste UND revenue-erhaltende Antwort?",
      en: "A customer asks for a SOC 2 Type II report. You don't have one. What's the most honest AND revenue-preserving answer?",
    },
    options: [
      {
        id: "a",
        de: "Behaupten 'wir haben einen' — später improvisieren",
        en: "Claim 'we have one' — improvise later",
      },
      {
        id: "b",
        de: "Ablehnen: 'wir machen kein SOC 2'",
        en: "Refuse: 'we don't do SOC 2'",
      },
      {
        id: "c",
        de: "Ehrlich sein + Security-Paket mit konkreten Controls präsentieren + Readiness-Audit mit Timeline anbieten",
        en: "Be honest + present a security package with concrete controls + offer a readiness audit with timeline",
      },
      {
        id: "d",
        de: "Einen gefakten Report senden",
        en: "Send a faked report",
      },
    ],
    correctOptionIds: ["c"],
    explanation: {
      de: "Lügen über SOC 2 = Vertragsbruch + Vertrauensverlust wenn entdeckt. Ehrlichkeit kombiniert mit konkreter Dokumentation (Security-Questionnaire-Antworten, Policy-Pack, Architecture-Doc) + klarer Timeline schließt >60% der Enterprise-Deals auch ohne aktuellem Report.",
      en: "Lying about SOC 2 = contract breach + trust destroyed when discovered. Honesty combined with concrete documentation (security questionnaire answers, policy pack, architecture doc) + clear timeline closes >60% of enterprise deals even without a current report.",
    },
    reference: "runbook/soc2-not-yet-ready-sales-response",
  },
  {
    id: "f-015",
    type: "scenario",
    topic: "incident-response",
    difficulty: "medium",
    prompt: {
      de: "Dein Kollege committed versehentlich einen AWS-Access-Key in ein öffentliches GitHub-Repo. Du merkst es nach 4 Minuten. Reihenfolge?",
      en: "A colleague accidentally commits an AWS access key to a public GitHub repo. You notice after 4 minutes. Sequence?",
    },
    options: [
      {
        id: "a",
        de: "Commit löschen → Force-Push → fertig",
        en: "Delete commit → force-push → done",
      },
      {
        id: "b",
        de: "Key in AWS SOFORT deaktivieren → CloudTrail-Logs auf Missbrauch prüfen → Repo-History bereinigen → neuen Key generieren + committen",
        en: "Deactivate key in AWS IMMEDIATELY → check CloudTrail logs for abuse → clean repo history → generate new key + commit",
      },
      {
        id: "c",
        de: "Rotation später, erstmal Repo-History fixen",
        en: "Rotate later, fix repo history first",
      },
      { id: "d", de: "Ignorieren — wird schon nicht gefunden", en: "Ignore — unlikely to be found" },
    ],
    correctOptionIds: ["b"],
    explanation: {
      de: "Bots scannen GitHub in Echtzeit (< 30 Sekunden!) nach AWS-Keys. Key sofort in IAM deaktivieren ist Prio 1, egal was mit dem Repo passiert. CloudTrail-Audit bestimmt Impact. Repo-History bereinigen ist letzter Schritt — der Key ist eh kompromittiert.",
      en: "Bots scan GitHub in real-time (< 30 seconds!) for AWS keys. Deactivating the key in IAM is priority 1, regardless of the repo. CloudTrail audit determines impact. Cleaning repo history is the last step — the key is compromised anyway.",
    },
    reference: "runbook/leaked-aws-credentials-response",
  },
]

export const FOUNDATION_EXAM_CONFIG = {
  tier: "foundation",
  totalQuestions: FOUNDATION_EXAM_QUESTIONS.length,
  durationMinutes: 25,
  passingScorePercent: 70,
  certificateLabel: "ClawGuru Defender Foundation — Practice",
}
