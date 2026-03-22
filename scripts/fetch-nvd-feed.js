const fs = require('fs')
const path = require('path')

function fmt(d){return new Date(d).toISOString().slice(0,19).replace('T','Z')}
function now(){return new Date()}
function addDays(d,n){const x=new Date(d);x.setDate(x.getDate()+n);return x}

async function fetchJson(url, opts){
  const controller = new AbortController()
  const t = setTimeout(()=>controller.abort(), 12000)
  try{
    const res = await fetch(url, { ...opts, signal: controller.signal })
    if(!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } finally { clearTimeout(t) }
}

function extractEntries(nvd){
  const out = []
  const list = Array.isArray(nvd?.vulnerabilities) ? nvd.vulnerabilities : []
  for(const v of list){
    const c = v?.cve || {}
    const id = c?.id || ''
    const descArr = Array.isArray(c?.descriptions) ? c.descriptions : []
    const description = (descArr.find(d=>d.lang==='en')?.value || descArr[0]?.value || '').trim()
    const title = (c?.titles && c.titles[0]?.title) || description.slice(0, 120)
    const pubs = c?.published ? String(c.published) : ''
    const metrics = v?.cve?.metrics || {}
    let score = 0, severity = 'unknown'
    const v31 = Array.isArray(metrics?.cvssMetricV31) ? metrics.cvssMetricV31[0] : null
    const v30 = Array.isArray(metrics?.cvssMetricV30) ? metrics.cvssMetricV30[0] : null
    const v2 = Array.isArray(metrics?.cvssMetricV2) ? metrics.cvssMetricV2[0] : null
    const pick = v31 || v30 || v2
    if(pick && pick.cvssData){
      score = Number(pick.cvssData.baseScore||0)
      severity = (pick.cvssData.baseSeverity || pick.baseSeverity || '').toString().toLowerCase() || 'unknown'
    } else if (pick){
      score = Number(pick.baseScore||0)
      severity = (pick.baseSeverity||'').toString().toLowerCase() || 'unknown'
    }
    out.push({ id, title, description, score, severity, published: pubs })
  }
  return out
}

async function main(){
  const apiKey = process.env.NVD_API_KEY || ''
  const days = Math.max(1, Number(process.env.NVD_DAYS || 14))
  const end = now()
  const start = addDays(end, -days)
  const pubStart = `${start.getUTCFullYear()}-${String(start.getUTCMonth()+1).padStart(2,'0')}-${String(start.getUTCDate()).padStart(2,'0')}T00:00:00.000` 
  const pubEnd = `${end.getUTCFullYear()}-${String(end.getUTCMonth()+1).padStart(2,'0')}-${String(end.getUTCDate()).padStart(2,'0')}T23:59:59.999`
  const base = 'https://services.nvd.nist.gov/rest/json/cves/2.0'
  const url = `${base}?pubStartDate=${encodeURIComponent(pubStart)}&pubEndDate=${encodeURIComponent(pubEnd)}`

  let data = null
  try{
    const headers = apiKey ? { 'apiKey': apiKey } : undefined
    data = await fetchJson(url, { headers })
  } catch {}

  let entries = []
  if(data){
    entries = extractEntries(data)
  }
  if(!entries || entries.length === 0){
    // Inline fallback: minimal curated set (avoids requiring TS in Node script)
    const seed = [
      {
        id: 'CVE-2024-6387',
        title: 'OpenSSH regreSSHion – Unauthenticated RCE',
        description: "Signal handler race condition in OpenSSH's sshd leads to unauthenticated RCE on glibc Linux.",
        score: 8.1,
        severity: 'critical',
        published: '2024-07-01',
      },
      {
        id: 'CVE-2024-3094',
        title: 'XZ Utils Backdoor – Supply Chain Attack',
        description: 'Malicious backdoor in XZ 5.6.0/5.6.1 enables unauthorized SSH access via systemd.',
        score: 10.0,
        severity: 'critical',
        published: '2024-03-29',
      },
      {
        id: 'CVE-2024-21626',
        title: 'runc Container Escape – Leaky Vessels',
        description: 'File descriptor leak enables container escape to host root across runc-based runtimes.',
        score: 8.6,
        severity: 'high',
        published: '2024-01-31',
      },
      {
        id: 'CVE-2023-44487',
        title: 'HTTP/2 Rapid Reset DDoS Attack',
        description: 'Abuse of stream cancellation overwhelms servers; affects most HTTP/2 implementations.',
        score: 7.5,
        severity: 'high',
        published: '2023-10-10',
      },
    ]
    entries = seed
  }

  const outRel = process.env.CVE_FEED_JSON_OUT || 'public/cve-feed.json'
  const outPath = path.isAbsolute(outRel) ? outRel : path.join(process.cwd(), outRel)
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, JSON.stringify({ updatedAt: new Date().toISOString(), entries }, null, 0), 'utf8')
  console.log(`Wrote ${entries.length} CVEs to ${outPath}`)
}

main()
