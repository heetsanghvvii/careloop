import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const SCREENSHOTS_DIR = path.resolve(process.cwd(), 'screenshots');
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const DEBUG_PORT = 9222;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getPageWsUrl() {
  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch(`http://localhost:${DEBUG_PORT}/json`);
      if (res.ok) {
        const list = await res.json();
        const page = list.find(t => t.type === 'page');
        if (page && page.webSocketDebuggerUrl) {
          return page.webSocketDebuggerUrl;
        }
      }
    } catch {}
    await sleep(250);
  }
  throw new Error('Could not find Chrome page target');
}

class CDPClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.id = 1;
    this.callbacks = new Map();
    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.callbacks.has(msg.id)) {
        const { resolve, reject } = this.callbacks.get(msg.id);
        this.callbacks.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };
  }

  async ready() {
    if (this.ws.readyState === WebSocket.OPEN) return;
    return new Promise(resolve => this.ws.onopen = resolve);
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async evaluate(expression) {
    const res = await this.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    return res.result?.value;
  }

  async screenshot(filename) {
    const res = await this.send('Page.captureScreenshot', { format: 'png' });
    const filePath = path.join(SCREENSHOTS_DIR, filename);
    fs.writeFileSync(filePath, Buffer.from(res.data, 'base64'));
    console.log(`✅ Saved: screenshots/${filename} (${(res.data.length * 0.75 / 1024).toFixed(1)} KB)`);
  }

  async setViewport(width, height, isMobile = false) {
    await this.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 2,
      mobile: isMobile
    });
  }

  close() {
    try { this.ws.close(); } catch {}
  }
}

async function main() {
  console.log('🚀 Starting headless Chrome screenshot capture engine...');
  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    '--disable-gpu',
    '--user-data-dir=/tmp/careloop_chrome_profile',
    `--remote-debugging-port=${DEBUG_PORT}`,
    'http://localhost:3000/'
  ], { stdio: 'ignore' });

  try {
    const pageWsUrl = await getPageWsUrl();

    const client = new CDPClient(pageWsUrl);
    await client.ready();
    await client.send('Page.enable');
    await client.send('Runtime.enable');

    // --- 1. MARKETING SITE HERO ---
    console.log('\n📸 1. Capturing Marketing Site Hero...');
    await client.setViewport(1280, 850);
    await client.send('Page.navigate', { url: 'http://localhost:3000/' });
    await sleep(1500);
    await client.screenshot('01_marketing_hero.png');

    // --- 2. PRICING SECTION ---
    console.log('\n📸 2. Capturing Pricing Section (with honesty disclaimers)...');
    await client.evaluate(`
      const pricingEl = document.getElementById('pricing');
      if (pricingEl) pricingEl.scrollIntoView({ behavior: 'instant', block: 'start' });
    `);
    await sleep(600);
    await client.screenshot('02_pricing_section.png');

    // --- 3. PRACTITIONER DASHBOARD ---
    console.log('\n📸 3. Capturing Practitioner Dashboard (Dr. Arjun Patel)...');
    await client.evaluate(`
      // Switch view to practitioner demo
      localStorage.setItem('careloop_user_session', JSON.stringify({
        uid: 'user_arjun_patel',
        email: 'arjun.patel@peakform.health',
        displayName: 'Dr. Arjun Patel',
        role: 'practitioner',
        isDemo: true
      }));
      window.location.reload();
    `);
    await sleep(1500);
    await client.evaluate(`
      // Ensure we are on practitioner dashboard tab
      const dashBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Dashboard'));
      if (dashBtn) dashBtn.click();
    `);
    await sleep(500);
    await client.screenshot('03_practitioner_dashboard.png');

    // --- 4. WHATSAPP LAB SIMULATOR ---
    console.log('\n📸 4. Capturing WhatsApp Lab Simulator...');
    await client.evaluate(`
      const labBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('WhatsApp Lab'));
      if (labBtn) labBtn.click();
    `);
    await sleep(600);
    await client.screenshot('04_whatsapp_lab_simulator.png');

    // --- 5. PARTICIPANT PORTAL AT MOBILE WIDTH ---
    console.log('\n📸 5. Capturing Participant Portal at Mobile Width (390x844)...');
    await client.setViewport(390, 844, true);
    await client.evaluate(`
      localStorage.setItem('careloop_user_session', JSON.stringify({
        uid: 'part_001',
        email: 'sarah.chen@example.com',
        displayName: 'Sarah Chen',
        role: 'participant',
        isDemo: true
      }));
      window.location.reload();
    `);
    await sleep(1500);
    await client.screenshot('05_participant_portal_mobile.png');

    // --- 6. EVERY SLIDE OF EACH OF THE THREE PITCH DECKS ---
    console.log('\n📸 6. Capturing ALL Slides across ALL 3 Pitch Decks...');
    await client.setViewport(1280, 850, false);
    
    // Switch session back to practitioner so we can open pitch deck
    await client.evaluate(`
      localStorage.setItem('careloop_user_session', JSON.stringify({
        uid: 'user_arjun_patel',
        email: 'arjun.patel@peakform.health',
        displayName: 'Dr. Arjun Patel',
        role: 'practitioner',
        isDemo: true
      }));
      window.location.reload();
    `);
    await sleep(1200);

    // Open Pitch Deck Modal
    await client.evaluate(`
      const pitchBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Pitch Deck'));
      if (pitchBtn) pitchBtn.click();
    `);
    await sleep(800);

    const decksConfig = [
      {
        key: 'doctors',
        label: 'Doctors',
        tabName: 'Doctors',
        prefix: 'deck1_doctors',
        slides: [
          'slide1_overview',
          'slide2_problem',
          'slide3_solution',
          'slide4_whatsapp',
          'slide5_pricing',
          'slide6_pilot'
        ]
      },
      {
        key: 'investors',
        label: 'Investors',
        tabName: 'Investors',
        prefix: 'deck2_investors',
        slides: [
          'slide1_thesis',
          'slide2_market',
          'slide3_economics',
          'slide4_positioning',
          'slide5_scalability',
          'slide6_ask'
        ]
      },
      {
        key: 'team',
        label: 'Team',
        tabName: 'Team',
        prefix: 'deck3_team',
        slides: [
          'slide1_culture',
          'slide2_roadmap',
          'slide3_ethics',
          'slide4_join'
        ]
      }
    ];

    for (const deck of decksConfig) {
      console.log(`\n--- Capturing Deck: ${deck.label} (${deck.slides.length} slides) ---`);
      
      // Click deck tab
      await client.evaluate(`
        const tab = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('${deck.tabName}'));
        if (tab) tab.click();
      `);
      await sleep(400);

      for (let sIdx = 0; sIdx < deck.slides.length; sIdx++) {
        const slideName = deck.slides[sIdx];
        
        // Jump to slide by clicking the slide dot / button
        await client.evaluate(`
          const dots = Array.from(document.querySelectorAll('button[title*="Jump to Slide"]'));
          if (dots[${sIdx}]) dots[${sIdx}].click();
        `);
        await sleep(400);

        const filename = `${deck.prefix}_${slideName}.png`;
        await client.screenshot(filename);
      }
    }

    client.close();
    console.log('\n🎉 ALL 21 SCREENSHOTS CAPTURED PERFECTLY!');

  } finally {
    chromeProc.kill();
  }
}

main().catch(err => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
