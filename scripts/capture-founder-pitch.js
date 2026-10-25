import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const SCREENSHOTS_DIR = path.resolve(process.cwd(), 'screenshots');
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
  console.log('👑 Capturing visual proof for Founder Command Center & Doctor Pitch Deck Generator...');
  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    '--disable-gpu',
    '--user-data-dir=/tmp/careloop_founder_profile',
    `--remote-debugging-port=${DEBUG_PORT}`,
    'http://localhost:3000/'
  ], { stdio: 'ignore' });

  try {
    const pageWsUrl = await getPageWsUrl();
    const client = new CDPClient(pageWsUrl);
    await client.ready();
    await client.send('Page.enable');
    await client.send('Runtime.enable');

    // 1. Configure Founder session in browser
    console.log('\n📸 1. Capturing Founder Command Center...');
    await client.setViewport(1280, 850);
    await client.send('Page.navigate', { url: 'http://localhost:3000/' });
    await sleep(1000);

    await client.evaluate(`
      localStorage.setItem('careloop_user_session', JSON.stringify({
        uid: 'user_founder_operator',
        email: 'founder@careloop.health',
        displayName: 'Founder & Operator',
        role: 'founder',
        isDemo: true
      }));
      window.location.reload();
    `);
    await sleep(1500);
    await client.screenshot('founder_01_command_center.png');

    // 2. Open Doctor Pitch Generator Modal
    console.log('\n📸 2. Capturing Doctor Pitch Generator Modal...');
    await client.evaluate(`
      const pitchBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Pitch a Doctor') || b.textContent.includes('Pitch New Doctor'));
      if (pitchBtn) pitchBtn.click();
    `);
    await sleep(600);
    await client.screenshot('founder_02_pitch_modal.png');

    // 3. Launch Pitch Deck Presentation
    console.log('\n📸 3. Capturing Tailored Doctor Pitch Deck (Dr. Sneha Kulkarni)...');
    await client.evaluate(`
      const submitBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Launch Hyper-Personalized Pitch Deck'));
      if (submitBtn) submitBtn.click();
    `);
    await sleep(800);
    await client.screenshot('founder_03_doctor_pitch_deck.png');

    // Close presentation modal
    await client.evaluate(`
      const closeBtn = document.querySelector('button[title*="Close"]') || Array.from(document.querySelectorAll('button')).find(b => b.textContent === '✕');
      if (closeBtn) closeBtn.click();
    `);
    await sleep(400);

    // 4. View Multi-Clinic Network Directory
    console.log('\n📸 4. Capturing Multi-Clinic Network Directory...');
    await client.evaluate(`
      const clinicTab = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Clinic Network'));
      if (clinicTab) clinicTab.click();
    `);
    await sleep(600);
    await client.screenshot('founder_04_clinic_network.png');

    client.close();
    console.log('\n🎉 ALL 4 FOUNDER VISUAL PROOF SCREENSHOTS CAPTURED!');
  } finally {
    chromeProc.kill();
  }
}

main().catch(err => {
  console.error('Failed to capture founder screenshots:', err);
  process.exit(1);
});
