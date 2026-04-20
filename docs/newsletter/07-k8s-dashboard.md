---
issue: 7
subject: "Exposed Kubernetes dashboard = cluster admin for everyone"
cta_label: "Audit your K8s exposure"
cta_url: "https://clawguru.org/check"
---

# Exposed Kubernetes dashboard = cluster admin for everyone

Hey,

Tesla learned this lesson in 2018 — attackers found their unauthenticated Kubernetes dashboard, mined crypto on their infra, and stole telemetry data. Seven years later, we still find exposed K8s dashboards **every single week** on customer audits.

## The Risk

The K8s dashboard, when exposed without auth, gives attackers:
- `kubectl`-equivalent access via browser
- ServiceAccount tokens (cluster-admin in worst cases)
- Secrets (API keys, DB creds, TLS certs)
- Ability to exec into any pod
- Ability to deploy crypto miners

All without a single CVE. Just misconfig.

## The Fix (4 steps)

**1. Never expose the dashboard via LoadBalancer or NodePort.** If you did:
```bash
kubectl -n kubernetes-dashboard get svc
# If type is LoadBalancer/NodePort → patch it to ClusterIP
kubectl -n kubernetes-dashboard patch svc kubernetes-dashboard -p '{"spec":{"type":"ClusterIP"}}'
```

**2. Access it only via `kubectl proxy`:**
```bash
kubectl proxy
# then visit http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/
```

**3. Use ServiceAccount tokens with minimal RBAC** — never cluster-admin:
```yaml
apiVersion: v1
kind: ServiceAccount
metadata: { name: dashboard-viewer, namespace: kubernetes-dashboard }
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata: { name: dashboard-viewer }
roleRef: { kind: ClusterRole, name: view, apiGroup: rbac.authorization.k8s.io }
subjects: [{ kind: ServiceAccount, name: dashboard-viewer, namespace: kubernetes-dashboard }]
```

**4. Enable audit logging on the API server.** If someone does sneak in, you'll at least see what they touched.

## The Pro-Tip

Scan from outside with:
```bash
nmap -p 30000-32767 --open <your-node-ip>
```
Any hit on a known dashboard port (8001, 9090, 30000+) = alarm bells.

## Full Kubernetes hardening runbook

CIS Benchmark, NetworkPolicies, admission controllers (Kyverno/OPA), Falco runtime detection:
→ https://clawguru.org/check

— Stay sharp,
ClawGuru

---

*This is the last issue of our evergreen onboarding. Starting tomorrow, you'll receive daily CVE briefs — fresh vulns, fresh fixes, same 400-word format.*
