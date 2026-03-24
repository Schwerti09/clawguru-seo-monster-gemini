const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const BASE = process.env.DEMO_BASE || 'https://clawguru.org';

  // Ensure video output directory exists
  const videoDir = path.resolve(__dirname, '../demo-videos');
  try { fs.mkdirSync(videoDir, { recursive: true }); } catch {}

  const browser = await chromium.launch({ headless: false, slowMo: 120 });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: videoDir },
  });
  const page = await context.newPage();

  // Helpers
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  async function gotoSafe(url) {
    try {
      const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
      if (!resp || resp.status() >= 400) {
        await page.goto(`${BASE}/de`, { waitUntil: 'domcontentloaded' }).catch(() => {});
        await page.waitForLoadState('networkidle').catch(() => {});
      }
    } catch {
      try {
        await page.goto(`${BASE}/de`, { waitUntil: 'domcontentloaded' });
        await page.waitForLoadState('networkidle').catch(() => {});
      } catch {}
    }
  }

  async function waitStable(selector, timeout = 10000) {
    try {
      await page.waitForSelector(selector, { timeout, state: 'visible' });
      await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
      return true;
    } catch { return false }
  }

  async function showOverlay(text, duration = 2200) {
    if (page.isClosed()) return;
    await page.evaluate((msg) => {
      const old = document.getElementById('claw-demo-overlay');
      if (old) old.remove();
      const div = document.createElement('div');
      div.id = 'claw-demo-overlay';
      div.textContent = msg;
      div.style.cssText = `
        position:fixed; bottom:28px; left:28px; z-index:99999;
        padding:14px 22px; border-radius:14px;
        color:#b9f3ff; background:linear-gradient(180deg, rgba(3,7,18,0.9), rgba(2,6,23,0.86));
        border:1px solid rgba(34,211,238,0.45);
        box-shadow:0 18px 44px -16px rgba(34,211,238,0.35), inset 0 0 0 1px rgba(34,211,238,0.15);
        font: 600 15px/1.35 system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
        max-width:520px; backdrop-filter: blur(10px);
        transform: translateY(8px) scale(0.98); opacity:0; animation: cgIn 280ms ease-out forwards;
      `;
      const s = document.createElement('style');
      s.innerHTML = `@keyframes cgIn { to { transform: translateY(0) scale(1); opacity:1 } }`;
      document.body.appendChild(s);
      document.body.appendChild(div);
    }, text);
    await page.waitForTimeout(duration).catch(() => {});
    if (page.isClosed()) return;
    await page.evaluate(() => { const el = document.getElementById('claw-demo-overlay'); if (el) el.remove(); }).catch(() => {});
  }

  async function highlight(selector, ms = 1600) {
    if (page.isClosed()) return;
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
    if (page.isClosed()) return;
    await page.evaluate(() => { const r = document.getElementById('claw-demo-highlight'); if (r) r.remove(); }).catch(() => {});
  }

  async function moveTo(selector) {
    try {
      if (page.isClosed()) return;
      const loc = page.locator(selector).first();
      await loc.waitFor({ state: 'visible', timeout: 12000 });
      const box = await loc.boundingBox().catch(() => null);
      if (!box) {
        // fallback: gentle move near center if no box
        await page.mouse.move(720 + rand(-80, 80), 450 + rand(-60, 60), { steps: rand(28, 36) }).catch(() => {});
        return;
      }
      const x = box.x + box.width / 2 + rand(-5, 5);
      const y = box.y + box.height / 2 + rand(-4, 4);
      await page.mouse.move(x, y, { steps: rand(30, 40) }).catch(() => {});
    } catch {}
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
  await gotoSafe(`${BASE}/de`);
  await showOverlay('Willkommen! In 3 Minuten siehst du alle Kern‑Tools live.');

  // Highlight primary CTA on Vorstellung
  await highlight('a[href^="#"], a[href*="live"], a');
  await moveTo('a[href^="#"], a[href*="live"], a');
  await sleep(800);

  // 1) Intel
  await showOverlay('Intel: Live‑Feed, CVE‑Analyzer und 3D‑Radar.');
  await clickByText('Intel');
  await page.waitForLoadState('networkidle').catch(() => {});
  await waitStable('text=Predictive', 10000);
  await highlight('canvas, [data-testid*="radar"], .h-72', 1200);
  await moveTo('canvas, [data-testid*="radar"], .h-72');
  await sleep(1200);

  // 2) Oracle
  await showOverlay('Oracle: Scope wählen und Risiko‑Radar starten.');
  await clickByText('Oracle');
  await page.waitForLoadState('networkidle').catch(() => {});
  await sleep(900);
  await clickByText('nginx', { role: 'button', timeout: 3000 }).catch(() => {});
  await clickByText('Predict', { role: 'button', timeout: 8000 }).catch(() => {});
  await highlight('canvas, [class*=Canvas], svg', 1200);
  await moveTo('canvas, [class*=Canvas], svg');
  await sleep(1400);

  // 3) Neuro
  await showOverlay('Neuro: Stacks wählen – kuratierte Empfehlungen erhalten.');
  await clickByText('Neuro');
  await page.waitForLoadState('networkidle').catch(() => {});
  for (const s of ['nodejs', 'nginx', 'kubernetes']) {
    await clickByText(s, { role: 'button', timeout: 2000 }).catch(() => {});
  }
  await sleep(1400);

  // 4) Summon
  await showOverlay('Summon: „Defense“ wählen, Problem beschreiben, Fix erhalten.');
  await clickByText('Summon');
  await page.waitForLoadState('networkidle').catch(() => {});
  await clickByText('Defense', { role: 'button', timeout: 3000 }).catch(() => {});
  await page.waitForSelector('textarea', { timeout: 6000 }).catch(() => {});
  await moveTo('textarea');
  try { await page.fill('textarea', 'Nginx 502 bei Node.js + TLS 1.3 – wie härten?'); } catch {}
  await sleep(800);
  await clickByText('Summon starten', { role: 'button', timeout: 8000 }).catch(() => {});
  await sleep(2000);
  await showOverlay('Ergebnis: Score, Schritte und Diagramm.');
  await highlight('svg, [class*=Diagram], .h-16', 1100);
  await moveTo('svg, [class*=Diagram], .h-16');
  await sleep(900);

  // 5) Mycelium
  await showOverlay('Mycelium: Interaktives 3D‑Bedrohungsnetz.');
  await clickByText('Mycelium');
  await page.waitForLoadState('networkidle').catch(() => {});
  await highlight('canvas, [data-testid*="mycelium"], .h-72', 1200);
  await moveTo('canvas, [data-testid*="mycelium"], .h-72');
  await sleep(1500);

  // 6) Live / Threatmap
  await showOverlay('Live & Threatmap: Realtime‑Überblick.');
  await clickByText('Live');
  await page.waitForLoadState('networkidle').catch(() => {});
  await sleep(1400);

  // 7) Check
  await showOverlay('Security Check: Risiken sofort finden.');
  await clickByText('Check');
  await page.waitForLoadState('networkidle').catch(() => {});
  await sleep(1400);

  // 8) Tags + Beispiel‑Tag
  await showOverlay('Tags: Interne Wissens‑Cluster.');
  await clickByText('Tags');
  await page.waitForLoadState('networkidle').catch(() => {});
  await sleep(1200);
  await highlight('a[href*="/tag/"], .grid, .flex.flex-wrap', 1000);
  // Direct to example tag for reliability
  await gotoSafe(`${BASE}/de/tag/nginx`);
  await sleep(1600);

  // 9) Runbook‑Beispiel (Hardening)
  await showOverlay('Runbooks: Tiefe, ausführbare Lösungen.');
  await gotoSafe(`${BASE}/de/provenance/prometheus-rabbitmq-hsts-2030`);
  await sleep(2200);

  // Abschluss
  await showOverlay('✅ Demo beendet – Jetzt selbst testen: Starte dein erstes Summon! ✨', 5400);
  console.log('🎥 Demo fertig – Video in "demo-videos" gespeichert. Browser bleibt offen.');
  // Intentionally do not close the browser
})();
