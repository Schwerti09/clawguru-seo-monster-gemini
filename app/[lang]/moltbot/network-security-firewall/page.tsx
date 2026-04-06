---
title: "Moltbot Network Security: Firewall Konfiguration"
description: "Network Security Setup und Firewall Rules für Moltbot. Complete Firewall Configuration mit iptables, UFW und Cloud Security Best Practices."
keywords: ["moltbot network security", "firewall configuration", "iptables", "ufw", "cloud security", "network hardening"]
author: "ClawGuru Security Team"
published: "2024-04-06"
modified: "2024-04-06"
category: "Security"
subcategory: "Moltbot"
language: "de"
locale: "de_DE"
canonical: "https://clawguru.org/de/moltbot/network-security-firewall"
alternates:
  de: "https://clawguru.org/de/moltbot/network-security-firewall"
  en: "https://clawguru.org/en/moltbot/network-security-firewall"
  es: "https://clawguru.org/es/moltbot/network-security-firewall"
  fr: "https://clawguru.org/fr/moltbot/network-security-firewall"
  pt: "https://clawguru.org/pt/moltbot/network-security-firewall"
  it: "https://clawguru.org/it/moltbot/network-security-firewall"
  ru: "https://clawguru.org/ru/moltbot/network-security-firewall"
  zh: "https://clawguru.org/zh/moltbot/network-security-firewall"
  ja: "https://clawguru.org/ja/moltbot/network-security-firewall"
  ko: "https://clawguru.org/ko/moltbot/network-security-firewall"
  ar: "https://clawguru.org/ar/moltbot/network-security-firewall"
  hi: "https://clawguru.org/hi/moltbot/network-security-firewall"
  tr: "https://clawguru.org/tr/moltbot/network-security-firewall"
  pl: "https://clawguru.org/pl/moltbot/network-security-firewall"
  nl: "https://clawguru.org/nl/moltbot/network-security-firewall"
robots: "index, follow"
image: "/og-moltbot-network-security.jpg"
type: "article"
readingTime: 18
difficulty: "Advanced"
prerequisites: ["Moltbot Security Framework", "Linux Administration", "Network Security"]
tags: ["moltbot", "network security", "firewall", "iptables", "ufw", "2024"]
---

# Moltbot Network Security: Firewall Konfiguration

> **"Not a Pentest" Trust-Anker**: Dieser Guide dient ausschließlich zur Konfiguration von Network Security und Firewalls. Keine Angriffswerkzeuge, keine illegalen Aktivitäten.

## 🎯 Executive Summary

Die **Moltbot Network Security** stellt einen umfassenden Ansatz für die Absicherung von Netzwerk-Infrastrukturen dar. In einer Zeit, in der Netzwerk-Angriffe zunehmend sophistication sind, ist robuste Firewall-Konfiguration überlebenswichtig.

**Kernprinzipien:**
- **Defense in Depth** - Mehrschichtige Netzwerk-Sicherheit
- **Principle of Least Privilege** - Minimale Netzwerk-Zugriffe
- **Zero Trust Network** - Kein implizites Vertrauen
- **Continuous Monitoring** - Permanente Netzwerk-Überwachung

---

## 🏗️ Network Security Architecture

### **Security Layer Overview**
```mermaid
graph TB
    A[Internet] --> B[Edge Firewall]
    B --> C[DMZ]
    B --> D[Internal Network]
    
    C --> E[Load Balancer]
    E --> F[Web Servers]
    E --> G[API Servers]
    
    D --> H[Application Servers]
    D --> I[Database Servers]
    D --> J[Monitoring Systems]
    
    B --> K[IDS/IPS]
    K --> L[SIEM]
    
    F --> M[Application Firewall]
    G --> M
    H --> M
    I --> N[Database Firewall]
```

---

## 🔥 UFW Firewall Configuration

### **Basic UFW Setup**
```bash
#!/bin/bash
# UFW Firewall Setup Script for Moltbot

echo "🔥 Setting up UFW Firewall for Moltbot..."

# 1. Reset existing rules
ufw --force reset

# 2. Set default policies
ufw default deny incoming
ufw default deny forward
ufw default allow outgoing

# 3. Allow SSH (with rate limiting)
ufw limit ssh

# 4. Allow HTTP/HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# 5. Allow Moltbot API (restricted to internal networks)
ufw allow from 10.0.0.0/8 to any port 8080
ufw allow from 172.16.0.0/12 to any port 8080
ufw allow from 192.168.0.0/16 to any port 8080

# 6. Allow monitoring and logging
ufw allow from 10.0.0.0/8 to any port 9090  # Prometheus
ufw allow from 10.0.0.0/8 to any port 3000  # Grafana

# 7. Database access (restricted)
ufw allow from 10.0.0.0/8 to any port 5432  # PostgreSQL
ufw allow from 10.0.0.0/8 to any port 6379  # Redis

# 8. Enable logging
ufw logging on

# 9. Enable firewall
ufw --force enable

# 10. Show status
ufw status verbose

echo "✅ UFW Firewall setup completed!"
```

### **Advanced UFW Configuration**
```bash
#!/bin/bash
# Advanced UFW Configuration

# Create custom application profiles
cat > /etc/ufw/applications.d/moltbot-api << 'EOF'
[Moltbot API]
title=Moltbot API Server
description=Firewall rules for Moltbot API
ports=8080/tcp
protocols=tcp
EOF

cat > /etc/ufw/applications.d/moltbot-monitoring << 'EOF'
[Moltbot Monitoring]
title=Moltbot Monitoring Stack
description=Firewall rules for monitoring services
ports=9090/tcp,3000/tcp
protocols=tcp
EOF

cat > /etc/ufw/applications.d/moltbot-database << 'EOF'
[Moltbot Database]
title=Moltbot Database Services
description=Firewall rules for database access
ports=5432/tcp,6379/tcp
protocols=tcp
EOF

# Apply advanced rules
ufw allow from 10.0.0.0/8 to any app Moltbot API
ufw allow from 172.16.0.0/12 to any app Moltbot API
ufw allow from 192.168.0.0/16 to any app Moltbot API

ufw allow from 10.0.0.0/8 to any app Moltbot Monitoring
ufw allow from 10.0.0.0/8 to any app Moltbot Database

# Rate limiting for critical services
ufw limit 8080/tcp comment "Moltbot API Rate Limit"
ufw limit 443/tcp comment "HTTPS Rate Limit"

# Port knocking for SSH (advanced security)
cat > /etc/ufw/before.rules << 'EOF'
# UFW before.rules for port knocking
*raw
:PREROUTING ACCEPT [0:0]
:INPUT ACCEPT [0:0]

# Port knocking sequence
-A PREROUTING -p tcp --dport 1111 -m recent --set --name KNOCK1
-A PREROUTING -p tcp --dport 2222 -m recent --name KNOCK2 --rcheck --seconds 10
-A PREROUTING -p tcp --dport 3333 -m recent --name KNOCK3 --rcheck --seconds 10

# Open SSH if sequence completed
-A PREROUTING -p tcp --dport 22 -m recent --rcheck --seconds 30 --name KNOCK3 -j ACCEPT

COMMIT
EOF

cat > /etc/ufw/after.rules << 'EOF'
# UFW after.rules for additional security
*filter
:INPUT ACCEPT [0:0]
:FORWARD ACCEPT [0:0]
:OUTPUT ACCEPT [0:0]

# Drop invalid packets
-A INPUT -m conntrack --ctstate INVALID -j DROP

# Drop packets with invalid flags
-A INPUT -p tcp --tcp-flags ALL NONE -j DROP
-A INPUT -p tcp --tcp-flags ALL ALL -j DROP
-A INPUT -p tcp --tcp-flags ALL FIN,URG,PSH -j DROP
-A INPUT -p tcp --tcp-flags ALL SYN,RST,ACK,FIN,URG -j DROP

# Protection against SYN floods
-A INPUT -p tcp --syn -m limit --limit 1/s --limit-burst 3 -j ACCEPT
-A INPUT -p tcp --syn -j DROP

# Protection against port scans
-A INPUT -m recent --name portscan --rcheck --seconds 86400 -j DROP
-A INPUT -m recent --name portscan --set -j LOG --log-prefix "Port Scan:"
-A INPUT -m recent --name portscan --set -j DROP

COMMIT
EOF

# Reload UFW with new rules
ufw reload

echo "✅ Advanced UFW configuration completed!"
```

---

## 🛡️ iptables Advanced Configuration

### **Comprehensive iptables Rules**
```bash
#!/bin/bash
# Advanced iptables Configuration for Moltbot

echo "🛡️ Setting up advanced iptables rules..."

# 1. Flush existing rules
iptables -F
iptables -X
iptables -t nat -F
iptables -t nat -X
iptables -t mangle -F
iptables -t mangle -X

# 2. Set default policies
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT

# 3. Allow loopback
iptables -A INPUT -i lo -j ACCEPT
iptables -A OUTPUT -o lo -j ACCEPT

# 4. Allow established and related connections
iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT

# 5. SSH protection with rate limiting
iptables -A INPUT -p tcp --dport 22 -m conntrack --ctstate NEW -m recent --set
iptables -A INPUT -p tcp --dport 22 -m conntrack --ctstate NEW -m recent --update --seconds 60 --hitcount 4 -j DROP
iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# 6. HTTP/HTTPS
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# 7. Moltbot API with advanced protection
iptables -A INPUT -p tcp --dport 8080 -m conntrack --ctstate NEW -m recent --set
iptables -A INPUT -p tcp --dport 8080 -m conntrack --ctstate NEW -m recent --update --seconds 10 --hitcount 20 -j DROP
iptables -A INPUT -p tcp --dport 8080 -s 10.0.0.0/8 -j ACCEPT
iptables -A INPUT -p tcp --dport 8080 -s 172.16.0.0/12 -j ACCEPT
iptables -A INPUT -p tcp --dport 8080 -s 192.168.0.0/16 -j ACCEPT

# 8. Database access (restricted)
iptables -A INPUT -p tcp --dport 5432 -s 10.0.0.0/8 -j ACCEPT  # PostgreSQL
iptables -A INPUT -p tcp --dport 6379 -s 10.0.0.0/8 -j ACCEPT  # Redis

# 9. Monitoring ports (restricted)
iptables -A INPUT -p tcp --dport 9090 -s 10.0.0.0/8 -j ACCEPT  # Prometheus
iptables -A INPUT -p tcp --dport 3000 -s 10.0.0.0/8 -j ACCEPT  # Grafana

# 10. Anti-DDoS protection
iptables -A INPUT -p tcp --dport 80 -m limit --limit 25/minute --limit-burst 100 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -m limit --limit 25/minute --limit-burst 100 -j ACCEPT
iptables -A INPUT -p tcp --dport 8080 -m limit --limit 100/minute --limit-burst 200 -j ACCEPT

# 11. Protection against common attacks
# SYN flood protection
iptables -A INPUT -p tcp --syn -m limit --limit 1/s --limit-burst 3 -j ACCEPT
iptables -A INPUT -p tcp --syn -j DROP

# Fragmented packet protection
iptables -A INPUT -f -j DROP

# XMAS packet protection
iptables -A INPUT -p tcp --tcp-flags ALL ALL -j DROP

# NULL packet protection
iptables -A INPUT -p tcp --tcp-flags ALL NONE -j DROP

# 12. Logging
iptables -A INPUT -m limit --limit 5/min -j LOG --log-prefix "iptables denied: " --log-level 7
iptables -A INPUT -j DROP

# 13. NAT rules for outbound traffic
iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE

# 14. Forwarding rules (if needed)
iptables -A FORWARD -i eth0 -o eth1 -m state --state ESTABLISHED,RELATED -j ACCEPT
iptables -A FORWARD -i eth1 -o eth0 -j ACCEPT

# 15. Save rules
iptables-save > /etc/iptables/rules.v4

echo "✅ Advanced iptables configuration completed!"
```

### **iptables Security Monitoring**
```bash
#!/bin/bash
# iptables Monitoring and Logging

# Create custom chains for monitoring
iptables -N LOGGING
iptables -N RATE_LIMIT

# Logging chain
iptables -A LOGGING -m limit --limit 5/min -j LOG --log-prefix "iptables: " --log-level 4
iptables -A LOGGING -j DROP

# Rate limiting chain
iptables -A RATE_LIMIT -m limit --limit 10/min -j ACCEPT
iptables -A RATE_LIMIT -j LOGGING

# Apply monitoring to critical services
iptables -A INPUT -p tcp --dport 22 -j RATE_LIMIT
iptables -A INPUT -p tcp --dport 8080 -j RATE_LIMIT

# Create logrotate configuration
cat > /etc/logrotate.d/iptables << 'EOF'
/var/log/iptables.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 root root
    postrotate
        /usr/sbin/iptables -Z
    endscript
}
EOF

# Set up rsyslog for iptables logging
cat > /etc/rsyslog.d/iptables.conf << 'EOF
# iptables logging configuration
:msg, contains, "iptables:" /var/log/iptables.log
& ~
EOF

# Restart rsyslog
systemctl restart rsyslog

echo "✅ iptables monitoring setup completed!"
```

---

## ☁️ Cloud Security Configuration

### **AWS Security Groups**
```yaml
# AWS Security Group Configuration for Moltbot
AWSTemplateFormatVersion: '2010-09-09'
Description: 'Moltbot Network Security Configuration'

Parameters:
  VpcId:
    Type: AWS::EC2::VPC::Id
    Description: VPC ID for Moltbot deployment
  
  PublicSubnetIds:
    Type: List<AWS::EC2::Subnet::Id>
    Description: Public subnet IDs
  
  PrivateSubnetIds:
    Type: List<AWS::EC2::Subnet::Id>
    Description: Private subnet IDs

Resources:
  # Load Balancer Security Group
  LoadBalancerSecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupDescription: Security group for load balancer
      VpcId: !Ref VpcId
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 80
          ToPort: 80
          CidrIp: 0.0.0.0/0
        - IpProtocol: tcp
          FromPort: 443
          ToPort: 443
          CidrIp: 0.0.0.0/0
      SecurityGroupEgress:
        - IpProtocol: -1
          CidrIp: 0.0.0.0/0

  # Web Server Security Group
  WebServerSecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupDescription: Security group for web servers
      VpcId: !Ref VpcId
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 80
          ToPort: 80
          SourceSecurityGroupId: !Ref LoadBalancerSecurityGroup
        - IpProtocol: tcp
          FromPort: 443
          ToPort: 443
          SourceSecurityGroupId: !Ref LoadBalancerSecurityGroup
        - IpProtocol: tcp
          FromPort: 22
          ToPort: 22
          CidrIp: 10.0.0.0/8
      SecurityGroupEgress:
        - IpProtocol: -1
          CidrIp: 0.0.0.0/0

  # API Server Security Group
  APIServerSecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupDescription: Security group for API servers
      VpcId: !Ref VpcId
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 8080
          ToPort: 8080
          SourceSecurityGroupId: !Ref LoadBalancerSecurityGroup
        - IpProtocol: tcp
          FromPort: 22
          ToPort: 22
          CidrIp: 10.0.0.0/8
      SecurityGroupEgress:
        - IpProtocol: -1
          CidrIp: 0.0.0.0/0

  # Database Security Group
  DatabaseSecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupDescription: Security group for database servers
      VpcId: !Ref VpcId
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 5432
          ToPort: 5432
          SourceSecurityGroupId: !Ref APIServerSecurityGroup
        - IpProtocol: tcp
          FromPort: 6379
          ToPort: 6379
          SourceSecurityGroupId: !Ref APIServerSecurityGroup
      SecurityGroupEgress:
        - IpProtocol: -1
          CidrIp: 0.0.0.0/0

  # Monitoring Security Group
  MonitoringSecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupDescription: Security group for monitoring
      VpcId: !Ref VpcId
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 9090
          ToPort: 9090
          CidrIp: 10.0.0.0/8
        - IpProtocol: tcp
          FromPort: 3000
          ToPort: 3000
          CidrIp: 10.0.0.0/8
      SecurityGroupEgress:
        - IpProtocol: -1
          CidrIp: 0.0.0.0/0

  # Network ACLs
  PublicNetworkACL:
    Type: AWS::EC2::NetworkAcl
    Properties:
      VpcId: !Ref VpcId
      NetworkAclEntries:
        - Egress: true
          RuleAction: allow
          RuleNumber: 100
          Protocol: -1
          CidrBlock: 0.0.0.0/0
        - Ingress: true
          RuleAction: allow
          RuleNumber: 100
          Protocol: -1
          CidrBlock: 0.0.0.0/0

  PrivateNetworkACL:
    Type: AWS::EC2::NetworkAcl
    Properties:
      VpcId: !Ref VpcId
      NetworkAclEntries:
        - Egress: true
          RuleAction: allow
          RuleNumber: 100
          Protocol: -1
          CidrBlock: 0.0.0.0/0
        - Ingress: true
          RuleAction: allow
          RuleNumber: 100
          Protocol: -1
          CidrBlock: 0.0.0.0/0
```

### **Azure Network Security Groups**
```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "vnetName": {
      "type": "string",
      "metadata": {
        "description": "Name of the virtual network"
      }
    }
  },
  "resources": [
    {
      "type": "Microsoft.Network/virtualNetworks",
      "apiVersion": "2021-02-01",
      "name": "[parameters('vnetName')]",
      "location": "[resourceGroup().location]",
      "properties": {
        "addressSpace": {
          "addressPrefixes": [
            "10.0.0.0/16"
          ]
        },
        "subnets": [
          {
            "name": "web-subnet",
            "properties": {
              "addressPrefix": "10.0.1.0/24",
              "networkSecurityGroup": {
                "id": "[resourceId('Microsoft.Network/networkSecurityGroups', 'web-nsg')]"
              }
            }
          },
          {
            "name": "api-subnet",
            "properties": {
              "addressPrefix": "10.0.2.0/24",
              "networkSecurityGroup": {
                "id": "[resourceId('Microsoft.Network/networkSecurityGroups', 'api-nsg')]"
              }
            }
          },
          {
            "name": "database-subnet",
            "properties": {
              "addressPrefix": "10.0.3.0/24",
              "networkSecurityGroup": {
                "id": "[resourceId('Microsoft.Network/networkSecurityGroups', 'database-nsg')]"
              }
            }
          }
        ]
      }
    },
    {
      "type": "Microsoft.Network/networkSecurityGroups",
      "apiVersion": "2021-02-01",
      "name": "web-nsg",
      "properties": {
        "securityRules": [
          {
            "name": "allow-http",
            "properties": {
              "priority": 100,
              "protocol": "Tcp",
              "sourceAddressPrefix": "*",
              "sourcePortRange": "*",
              "destinationAddressPrefix": "*",
              "destinationPortRange": "80",
              "access": "Allow",
              "direction": "Inbound"
            }
          },
          {
            "name": "allow-https",
            "properties": {
              "priority": 110,
              "protocol": "Tcp",
              "sourceAddressPrefix": "*",
              "sourcePortRange": "*",
              "destinationAddressPrefix": "*",
              "destinationPortRange": "443",
              "access": "Allow",
              "direction": "Inbound"
            }
          },
          {
            "name": "deny-all",
            "properties": {
              "priority": 1000,
              "protocol": "*",
              "sourceAddressPrefix": "*",
              "sourcePortRange": "*",
              "destinationAddressPrefix": "*",
              "destinationPortRange": "*",
              "access": "Deny",
              "direction": "Inbound"
            }
          }
        ]
      }
    }
  ]
}
```

---

## 🔍 Intrusion Detection System

### **Snort Configuration for Moltbot**
```bash
#!/bin/bash
# Snort IDS Setup for Moltbot

echo "🔍 Setting up Snort IDS for Moltbot..."

# 1. Install Snort
apt update && apt install -y snort

# 2. Configure Snort
cat > /etc/snort/snort.conf << 'EOF'
# Snort Configuration for Moltbot

# Network variables
var HOME_NET [10.0.0.0/8,172.16.0.0/12,192.168.0.0/16]
var EXTERNAL_NET !$HOME_NET

# Path to rules
var RULE_PATH /etc/snort/rules

# Classification and references
include $RULE_PATH/classification.config
include $RULE_PATH/reference.config

# Include local rules
include $RULE_PATH/local.rules

# Moltbot specific rules
include $RULE_PATH/moltbot.rules
EOF

# 3. Create Moltbot-specific rules
cat > /etc/snort/rules/moltbot.rules << 'EOF'
# Moltbot Security Rules

# SQL Injection Detection
alert tcp any any -> $HOME_NET 8080 (msg:"SQL Injection Attempt"; content:"union"; nocase; content:"select"; nocase; sid:1000001; rev:1;)

# XSS Detection
alert tcp any any -> $HOME_NET 8080 (msg:"XSS Attempt"; content:"<script>"; nocase; sid:1000002; rev:1;)

# Brute Force Detection
alert tcp any any -> $HOME_NET 8080 (msg:"Brute Force Attack"; threshold:type both, track by_src, count 5, seconds 60; sid:1000003; rev:1;)

# Data Exfiltration Detection
alert tcp $HOME_NET any -> any any (msg:"Potential Data Exfiltration"; content:"SELECT"; nocase; content:"FROM"; nocase; threshold:type both, track by_dst, bytes 1000000, seconds 300; sid:1000004; rev:1;)

# Suspicious User Agent
alert tcp any any -> $HOME_NET 8080 (msg:"Suspicious User Agent"; content:"sqlmap"; nocase; sid:1000005; rev:1;)

# Port Scan Detection
alert tcp any any -> $HOME_NET any (msg:"Port Scan Detected"; detection_filter:track_by_src, count 10, seconds 30; sid:1000006; rev:1;)

# DoS Attack Detection
alert tcp any any -> $HOME_NET 8080 (msg:"DoS Attack"; threshold:type both, track by_src, count 100, seconds 10; sid:1000007; rev:1;)
EOF

# 4. Create Snort startup script
cat > /etc/systemd/system/snort.service << 'EOF'
[Unit]
Description=Snort Intrusion Detection System
After=network.target

[Service]
Type=simple
ExecStart=/usr/sbin/snort -c /etc/snort/snort.conf -i eth0 -D
ExecReload=/bin/kill -HUP $MAINPID
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

# 5. Enable and start Snort
systemctl enable snort
systemctl start snort

echo "✅ Snort IDS setup completed!"
```

---

## 📊 Network Monitoring

### **Prometheus Network Monitoring**
```yaml
# prometheus.yml - Network Monitoring Configuration
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "network_alerts.yml"

scrape_configs:
  - job_name: 'node-exporter'
    static_configs:
      - targets: ['localhost:9100']
    metrics_path: /metrics
    scrape_interval: 5s

  - job_name: 'iptables-exporter'
    static_configs:
      - targets: ['localhost:9118']
    metrics_path: /metrics
    scrape_interval: 10s

  - job_name: 'netdata'
    static_configs:
      - targets: ['localhost:19999']
    metrics_path: /api/v1/allmetrics
    scrape_interval: 5s

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093
```

### **Network Alert Rules**
```yaml
# network_alerts.yml
groups:
  - name: network_security
    rules:
      - alert: HighNetworkTraffic
        expr: rate(node_network_receive_bytes_total[5m]) > 100000000
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: "High network traffic detected"
          description: "Network traffic is {{ $value }} bytes per second"

      - alert: SuspiciousNetworkActivity
        expr: increase(iptables_dropped_packets_total[5m]) > 100
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Suspicious network activity detected"
          description: "Dropped packets: {{ $value }} in the last 5 minutes"

      - alert: PortScanDetected
        expr: increase(port_scan_attempts_total[5m]) > 10
        for: 1m
        labels:
          severity: high
        annotations:
          summary: "Port scan detected"
          description: "Port scan attempts: {{ $value }} in the last 5 minutes"

      - alert: DDoSAttack
        expr: rate(http_requests_total[1m]) > 1000
        for: 30s
        labels:
          severity: critical
        annotations:
          summary: "Potential DDoS attack"
          description: "HTTP requests: {{ $value }} per second"
```

---

## 🔧 Automated Security Scripts

### **Security Audit Script**
```bash
#!/bin/bash
# Network Security Audit Script

echo "🔍 Performing network security audit..."

# 1. Check firewall status
echo "=== Firewall Status ==="
ufw status verbose

# 2. Check open ports
echo "=== Open Ports ==="
netstat -tuln | grep LISTEN

# 3. Check iptables rules
echo "=== iptables Rules ==="
iptables -L -n -v

# 4. Check network interfaces
echo "=== Network Interfaces ==="
ip addr show

# 5. Check routing table
echo "=== Routing Table ==="
ip route show

# 6. Check for suspicious connections
echo "=== Suspicious Connections ==="
netstat -an | grep ESTABLISHED | awk '{print $5}' | sort | uniq -c | sort -nr | head -10

# 7. Check for port scans
echo "=== Recent Port Scans ==="
journalctl -u iptables --since "1 hour ago" | grep "Port Scan"

# 8. Check firewall logs
echo "=== Firewall Logs ==="
journalctl -u ufw --since "1 hour ago" | tail -20

# 9. Check network performance
echo "=== Network Performance ==="
ss -s

# 10. Generate security report
cat > /tmp/network_security_audit_$(date +%Y%m%d).txt << EOF
Network Security Audit Report
Generated: $(date)

=== Firewall Configuration ===
$(ufw status verbose)

=== Open Ports ===
$(netstat -tuln | grep LISTEN)

=== iptables Rules ===
$(iptables -L -n -v)

=== Network Interfaces ===
$(ip addr show)

=== Suspicious Connections ===
$(netstat -an | grep ESTABLISHED | awk '{print $5}' | sort | uniq -c | sort -nr | head -10)

=== Recent Security Events ===
$(journalctl -u ufw --since "1 hour ago" | tail -10)
EOF

echo "✅ Network security audit completed!"
echo "Report saved to: /tmp/network_security_audit_$(date +%Y%m%d).txt"
```

### **Automated Response Script**
```bash
#!/bin/bash
# Automated Security Response Script

# Configuration
BLOCK_DURATION=3600  # 1 hour
ALERT_THRESHOLD=10    # 10 failed attempts
LOG_FILE="/var/log/security_response.log"

# Function to block IP
block_ip() {
    local ip=$1
    local reason=$2
    
    echo "$(date): Blocking IP $ip - Reason: $reason" >> $LOG_FILE
    
    # Add to UFW
    ufw deny from $1
    
    # Add to iptables
    iptables -A INPUT -s $1 -j DROP
    
    # Log the action
    logger "Security: Blocked IP $1 - Reason: $2"
}

# Function to unblock IP
unblock_ip() {
    local ip=$1
    
    echo "$(date): Unblocking IP $ip" >> $LOG_FILE
    
    # Remove from UFW
    ufw delete deny from $1
    
    # Remove from iptables
    iptables -D INPUT -s $1 -j DROP
    
    # Log the action
    logger "Security: Unblocked IP $1"
}

# Function to check for suspicious activity
check_suspicious_activity() {
    # Check for failed SSH attempts
    local failed_ssh=$(journalctl -u ssh --since "1 hour ago" | grep "Failed password" | wc -l)
    
    if [ $failed_ssh -gt $ALERT_THRESHOLD ]; then
        local suspicious_ips=$(journalctl -u ssh --since "1 hour ago" | grep "Failed password" | awk '{print $NF}' | sort | uniq)
        
        for ip in $suspicious_ips; do
            local attempts=$(journalctl -u ssh --since "1 hour ago" | grep "Failed password.*$ip" | wc -l)
            
            if [ $attempts -gt $ALERT_THRESHOLD ]; then
                block_ip $ip "SSH brute force attempt"
            fi
        done
    fi
    
    # Check for web attacks
    local web_attacks=$(journalctl -u nginx --since "1 hour ago" | grep -E "(401|403|429)" | wc -l)
    
    if [ $web_attacks -gt $ALERT_THRESHOLD ]; then
        local suspicious_ips=$(journalctl -u nginx --since "1 hour ago" | grep -E "(401|403|429)" | awk '{print $1}' | sort | uniq)
        
        for ip in $suspicious_ips; do
            local attempts=$(journalctl -u nginx --since "1 hour ago" | grep -E "(401|403|429).*$ip" | wc -l)
            
            if [ $attempts -gt $ALERT_THRESHOLD ]; then
                block_ip $ip "Web attack attempt"
            fi
        done
    fi
}

# Function to schedule IP unblocking
schedule_unblock() {
    local ip=$1
    local duration=$2
    
    echo "$(date): Scheduling unblock for IP $ip in $duration seconds" >> $LOG_FILE
    
    # Schedule unblock using at
    echo "unblock_ip $ip" | at now + $duration seconds 2>/dev/null || {
        # Fallback: use background process
        (sleep $duration && unblock_ip $ip) &
    }
}

# Main execution
check_suspicious_activity

# Check for scheduled unblocks
# This would typically be handled by a cron job or systemd timer

echo "$(date): Security response check completed" >> $LOG_FILE
```

---

## 📋 Implementation Guide

### **Step 1: Basic Setup**
```bash
#!/bin/bash
# Network Security Setup Script

echo "🔧 Setting up Moltbot Network Security..."

# 1. Update system
apt update && apt upgrade -y

# 2. Install required packages
apt install -y ufw iptables-persistent snort prometheus-node-exporter

# 3. Create directories
mkdir -p /etc/moltbot/network-security
mkdir -p /var/log/moltbot/network-security

# 4. Set permissions
chmod 755 /etc/moltbot/network-security
chmod 755 /var/log/moltbot/network-security

# 5. Create configuration files
touch /etc/moltbot/network-security/firewall-rules.conf
touch /etc/moltbot/network-security/monitoring-config.yml
touch /etc/moltbot/network-security/alert-rules.yml

echo "✅ Network security setup completed!"
```

### **Step 2: Service Configuration**
```ini
# /etc/systemd/system/moltbot-network-security.service
[Unit]
Description=Moltbot Network Security Service
After=network.target

[Service]
Type=oneshot
ExecStart=/opt/moltbot/network-security/setup-firewall.sh
ExecStart=/opt/moltbot/network-security/setup-monitoring.sh
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target
```

---

## 🔗 Related Resources

### **Internal Links**
- [Security Check Tool](/securitycheck) - Live Security Validation
- [Moltbot Security Framework](/moltbot/security-framework) - Complete Security Architecture
- [AI Runbooks](/runbooks) - Security Playbooks und Procedures
- [OpenClaw Framework](/openclaw) - Open Source Security Framework
- [Roast My Moltbot](/roast-my-moltbot) - Security Testing Tool
- [Neuro AI Engine](/neuro) - AI-gestützte Threat Detection

### **External Resources**
- [UFW Documentation](https://help.ubuntu.com/community/UFW) - Ubuntu Firewall Guide
- [iptables Tutorial](https://www.netfilter.org/documentation/) - Netfilter Documentation
- [AWS Security Groups](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/security-groups.html) - AWS Security Documentation
- [Azure Network Security](https://docs.microsoft.com/azure/virtual-network/security-overview) - Azure Security Documentation

---

## 🎯 Conclusion

Die **Moltbot Network Security** bietet einen umfassenden Ansatz für die Absicherung von Netzwerk-Infrastrukturen mit fortschrittlichen Firewall-Konfigurationen und automatisierten Response-Mechanismen.

**Key Takeaways:**
1. **Multi-Layer Defense** - Verschiedene Sicherheitsebenen implementieren
2. **Automated Monitoring** - Kontinuierliche Überwachung und Alerting
3. **Rapid Response** - Automatisierte Reaktion auf Security Events
4. **Cloud Integration** - Support für AWS, Azure, GCP
5. **Compliance Ready** - Erfüllung regulatorischer Anforderungen

---

> **🛡️ Ready to secure your network?** Starte mit unserem [Security Check Tool](/securitycheck) für eine umfassende Analyse deiner Network-Security.

> **📚 Need more guidance?** Entdecke unsere [AI Runbooks](/runbooks) für detaillierte Network-Security-Anleitungen.

> **🤝 Join the community?** Werde Teil der [ClawBot Community](/community) und tausche dich mit anderen Security-Experten aus.

---

*Dieser Guide wird monatlich aktualisiert, um die neuesten Network-Security-Best Practices und Threat-Landscape-Veränderungen zu berücksichtigen. Letzte Aktualisierung: April 2024.*
