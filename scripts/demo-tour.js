const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const BASE = 'https://clawguru.org';

  // Ensure video output directory exists
  const videoDir = path.resolve(__dirname, '../demo-videos');
  try { fs.mkdirSync(videoDir, { recursive: true }); } catch {}

  const browser = await chromium.launch({ headless: false, slowMo: 100 });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: videoDir },
  });
  const page = await context.newPage();

  // Helpers
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  async function showOverlay(text, duration = 2600) {
    await page.evaluate((msg) => {
      const old = document.getElementById('claw-demo-overlay');
      if (old) old.remove();
      const div = document.createElement('div');
      div.id = 'claw-demo-overlay';
      div.textContent = msg;
      div.style.cssText = `
        position:fixed; bottom:28px; left:28px; z-index:99999;
        padding:14px 22px; border-radius:14px;
        color:#a7f3d0; background:linear-gradient(180deg, rgba(2,8,23,0.9), rgba(2,6,23,0.85));
        border:1px solid rgba(16,185,129,0.35);
        box-shadow:0 12px 40px -14px rgba(16,185,129,0.35), inset 0 0 0 1px rgba(34,211,238,0.1);
        font: 600 16px/1.3 system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
        max-width:520px; backdrop-filter: blur(8px);
      `;
      document.body.appendChild(div);
    }, text);
    await page.waitForTimeout(duration);
    await page.evaluate(() => { const el = document.getElementById('claw-demo-overlay'); if (el) el.remove(); });
  }

  async function highlight(selector, ms = 1600) {
    const el = page.locator(selector).first();
    await el.waitFor({ state: 'visible', timeout: 8000 }).catch(() => {});
    await page.evaluate((sel) => {
      const n = document.querySelector(sel);
      if (!n) return;
      const r = document.createElement('div');
      const b = n.getBoundingClientRect();
      r.style.cssText = `
        position:fixed; left:${b.left - 6}px; top:${b.top - 6}px; width:${b.width + 12}px; height:${b.height + 12}px;
        border-radius:14px; border:2px solid rgba(34,211,238,0.65);
        box-shadow:0 0 0 4px rgba(34,211,238,0.15), 0 10px 30px -10px rgba(34,211,238,0.35);
        pointer-events:none; z-index:99998; animation:pulseN 1.2s ease-in-out infinite;
      `;
      r.id = 'claw-demo-highlight';
      const s = document.createElement('style');
      s.innerHTML = `@keyframes pulseN { 0%{opacity:0.2} 50%{opacity:1} 100%{opacity:0.2} }`;
      document.body.appendChild(s);
      document.body.appendChild(r);
    }, selector).catch(() => {});
    await sleep(ms);
    await page.evaluate(() => { const r = document.getElementById('claw-demo-highlight'); if (r) r.remove(); }).catch(() => {});
  }

  async function moveTo(selector) {
    const loc = page.locator(selector).first();
    await loc.waitFor({ state: 'visible', timeout: 10000 });
    const box = await loc.boundingBox();
    if (!box) return;
    const x = box.x + box.width / 2 + rand(-5, 5);
    const y = box.y + box.height / 2 + rand(-4, 4);
    await page.mouse.move(x, y, { steps: rand(25, 35) });
  }

  async function clickByText(name, { role = 'link', timeout = 10000 } = {}) {
    try {
      await page.getByRole(role, { name: new RegExp(name, 'i') }).first().waitFor({ state: 'visible', timeout });
      await page.getByRole(role, { name: new RegExp(name, 'i') }).first().click();
      return true;
    } catch {}
    try { await page.locator(`text=${name}`).first().click({ timeout }); return true; } catch {}
    return false;
  }

  // Start tour
  await page.goto(`${BASE}/de/vorstellung`, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle').catch(() => {});
  await showOverlay('Willkommen bei ClawGuru – kurz zeige ich dir alle Kern-Tools live.', 3200);

  // Highlight primary CTA on Vorstellung
  await highlight('a[href^="#"], a[href*="live"], a');
  await moveTo('a[href^="#"], a[href*="live"], a');
  await sleep(600);

  // 1) Intel
  await showOverlay('Intel: Live-Feed, CVE-Analyzer und Predictive Radar für proaktive Abwehr.', 2600);
  await clickByText('Intel');
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForSelector('text=Predictive', { timeout: 8000 }).catch(() => {});
  await moveTo('canvas, [data-testid*="radar"], .h-72');
  await sleep(900);

  // 2) Oracle
  await showOverlay('Oracle: Wähle einen Scope (z.B. nginx) und starte das Risiko‑Radar.', 2600);
  await clickByText('Oracle');
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(900);
  await clickByText('nginx', { role: 'button', timeout: 2000 }).catch(() => {});
  await clickByText('Predict', { role: 'button', timeout: 6000 }).catch(() => {});
  await moveTo('canvas, [class*=Canvas], svg');
  await sleep(1200);

  // 3) Neuro
  await showOverlay('Neuro: Wähle Stacks (nodejs, nginx, kubernetes) – erhalte kuratierte Empfehlungen.', 2800);
  await clickByText('Neuro');
  await page.waitForLoadState('networkidle').catch(() => {});
  for (const s of ['nodejs', 'nginx', 'kubernetes']) {
    await clickByText(s, { role: 'button', timeout: 2000 }).catch(() => {});
  }
  await sleep(1000);

  // 4) Summon
  await showOverlay('Summon: Wähle „Defense“, beschreibe dein Problem – und erhalte ein ausführbares Fix‑Runbook.', 3000);
  await clickByText('Summon');
  await page.waitForLoadState('networkidle').catch(() => {});
  await clickByText('Defense', { role: 'button', timeout: 3000 }).catch(() => {});
  await page.waitForSelector('textarea', { timeout: 6000 }).catch(() => {});
  await moveTo('textarea');
  await page.fill('textarea', 'Nginx 502 bei Node.js + TLS 1.3 – wie härten?');
  await sleep(600);
  await clickByText('Summon starten', { role: 'button', timeout: 6000 }).catch(() => {});
  await page.waitForTimeout(1800);
  // Show DiagramCard area if present
  await showOverlay('Das Ergebnis enthält Score, Schritte und ein hilfreiches Diagramm.', 2400);
  await moveTo('svg, [class*=Diagram], .h-16');
  await sleep(600);

  // 5) Mycelium
  await showOverlay('Mycelium: Das 3D‑Netz der Bedrohungen – lebendig und interaktiv.', 2600);
  await clickByText('Mycelium');
  await page.waitForLoadState('networkidle').catch(() => {});
  await moveTo('canvas, [data-testid*="mycelium"], .h-72');
  await sleep(1200);

  // 6) Live / Threatmap
  await showOverlay('Live & Threatmap: Realtime‑Überblick über aktuelle Vorfälle.', 2400);
  await clickByText('Live');
  await page.waitForLoadState('networkidle').catch(() => {});
  await sleep(1200);

  // 7) Check
  await showOverlay('Security Check: Finde Risiken deiner Infrastruktur – sofort.', 2400);
  await clickByText('Check');
  await page.waitForLoadState('networkidle').catch(() => {});
  await sleep(1200);

  // 8) Tags + Beispiel‑Tag
  await showOverlay('Tags: Interne Wissens‑Cluster. Lass uns „nginx“ öffnen.', 2600);
  await clickByText('Tags');
  await page.waitForLoadState('networkidle').catch(() => {});
  await sleep(1000);
  // Direct to example tag for reliability
  await page.goto(`${BASE}/de/tag/nginx`, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle').catch(() => {});
  await sleep(1400);

  // 9) Runbook‑Beispiel (Hardening)
  await showOverlay('Runbooks: Tiefe, ausführbare Lösungen. Beispiel: SSH‑Hardening.', 2800);
  await page.goto(`${BASE}/de/runbook/aws-ssh-hardening-2026`, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle').catch(() => {});
  await sleep(2000);

  // Abschluss
  await showOverlay('✅ Demo beendet – jetzt bist du dran! Probiere die Tools selbst aus.', 5200);
  console.log('🎥 Demo fertig – Video in "demo-videos" gespeichert. Browser bleibt offen.');
  // Intentionally do not close the browser
})();
