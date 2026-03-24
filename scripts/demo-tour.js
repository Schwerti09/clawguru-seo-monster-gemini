const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  // Ensure video output directory exists
  const videoDir = path.resolve(__dirname, '../demo-videos');
  try { fs.mkdirSync(videoDir, { recursive: true }); } catch {}

  const browser = await chromium.launch({
    headless: false,
    slowMo: 110,
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: videoDir },
  });

  const page = await context.newPage();

  async function showOverlay(text, duration = 2800) {
    await page.evaluate((msg) => {
      const old = document.getElementById('claw-demo-overlay');
      if (old) old.remove();
      const div = document.createElement('div');
      div.id = 'claw-demo-overlay';
      div.textContent = msg;
      div.style.cssText = `
        position:fixed; bottom:30px; left:30px;
        background:rgba(15,23,42,0.95); color:#67e8f9;
        padding:14px 24px; border-radius:12px;
        font-family:system-ui,sans-serif; font-size:17px; font-weight:500;
        box-shadow:0 10px 30px -10px rgba(103,232,249,0.4);
        z-index:99999; max-width:460px; border:1px solid rgba(103,232,249,0.3);
      `;
      document.body.appendChild(div);
    }, text);

    await page.waitForTimeout(duration);

    await page.evaluate(() => {
      const el = document.getElementById('claw-demo-overlay');
      if (el) el.remove();
    });
  }

  // DEMO
  await page.goto('https://clawguru.org/de/vorstellung');
  await showOverlay('Willkommen bei ClawGuru! Ich zeige dir jetzt alle wichtigen Tools live.', 3200);

  // 1. Intel
  await showOverlay('Starten wir mit Intel – dem Live Threat Intelligence Center.', 2200);
  await page.click('text=Intel');
  await page.waitForTimeout(1500);
  await showOverlay('Hier siehst du den Live Feed, CVE-Analyzer und Predictive Radar.', 2800);

  // 2. Oracle
  await showOverlay('Weiter zum Oracle – Predictive Risk Radar.', 2000);
  await page.click('text=Oracle');
  await page.waitForTimeout(1200);
  await showOverlay('Wähle einen Scope (z.B. nginx, postgres) und lass das Radar berechnen.', 3000);
  await page.click('text=Predict').catch(() => {});

  // 3. Neuro
  await showOverlay('Jetzt Neuro – dein persönlicher Stack-Intelligence-Assistent.', 2200);
  await page.click('text=Neuro');
  await page.waitForTimeout(1500);
  await showOverlay('Wähle deine Stacks (z.B. nodejs, postgres, kubernetes) und lass dir Empfehlungen geben.', 3000);

  // 4. Summon
  await showOverlay('Summon – das KI-gestützte Fix-Tool.', 2200);
  await page.click('text=Summon');
  await page.waitForTimeout(1200);
  await showOverlay('Wähle einen Swarm-Typ (Defense) und beschreibe dein Problem.', 2800);
  await page.fill('textarea', 'Nginx 502 bei Node.js + TLS 1.3 – wie härten?');
  await page.waitForTimeout(800);
  await page.click('text=Summon starten').catch(() => {});

  // 5. Mycelium
  await showOverlay('Mycelium – das lebendige Bedrohungs-Netzwerk.', 2200);
  await page.click('text=Mycelium');
  await page.waitForTimeout(2000);
  await showOverlay('Hier siehst du das 3D-Netzwerk in Echtzeit.', 2800);

  // 6. Live / Threatmap
  await showOverlay('Live Threat Feed & Threatmap.', 2000);
  await page.click('text=Live');
  await page.waitForTimeout(1800);

  // 7. Check
  await showOverlay('Security Check – dein persönlicher Risiko-Scan.', 2200);
  await page.click('text=Check');
  await page.waitForTimeout(1500);

  // 8. Runbooks + Tags
  await showOverlay('Zum Abschluss: Runbooks und Tags.', 2200);
  await page.click('text=Runbooks');
  await page.waitForTimeout(1200);
  await page.click('text=Tags');
  await page.waitForTimeout(2500);

  await showOverlay('✅ Demo beendet. Alle Tools wurden gezeigt. Der Browser bleibt offen – probiere selbst alles aus!', 6000);

  console.log('🎥 Demo fertig – Video wurde in Ordner "demo-videos" gespeichert.');
  // Browser bleibt offen
})();
