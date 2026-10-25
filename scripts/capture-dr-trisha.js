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
  console.log('🩺 Capturing visual proof for Dr. Trisha\'s clinical workflow...');
  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    '--disable-gpu',
    '--user-data-dir=/tmp/careloop_trisha_profile',
    `--remote-debugging-port=${DEBUG_PORT}`,
    'http://localhost:3000/'
  ], { stdio: 'ignore' });

  try {
    const pageWsUrl = await getPageWsUrl();
    const client = new CDPClient(pageWsUrl);
    await client.ready();
    await client.send('Page.enable');
    await client.send('Runtime.enable');

    // 1. Configure Dr. Trisha's workspace in browser localStorage
    console.log('\n📸 1. Capturing Dr. Trisha\'s Clinical Dashboard...');
    await client.setViewport(1280, 850);
    await client.send('Page.navigate', { url: 'http://localhost:3000/' });
    await sleep(1000);

    await client.evaluate(`
      localStorage.setItem('careloop_user_session', JSON.stringify({
        uid: 'user_dr_trisha',
        email: 'dr.trisha@careloop.health',
        displayName: 'Dr. Trisha Sen',
        role: 'practitioner',
        isDemo: true
      }));

      // Update workspace in local database
      const raw = localStorage.getItem('careloop_local_data_v1');
      if (raw) {
        const db = JSON.parse(raw);
        db.workspace = {
          id: 'ws_demo_001',
          name: "Dr. Trisha's Nutrition & Metabolic Clinic",
          practitionerName: 'Dr. Trisha Sen',
          practitionerEmail: 'dr.trisha@careloop.health',
          category: 'Clinical Dietetics & Hormonal Health',
          plan: 'Growth',
          createdAt: new Date().toISOString()
        };
        // Add Ananya Rao
        const exists = db.participants.find(p => p.email === 'ananya.rao@example.com');
        if (!exists) {
          db.participants.unshift({
            id: 'part_ananya',
            workspaceId: 'ws_demo_001',
            name: 'Ananya Rao',
            email: 'ananya.rao@example.com',
            phone: '+91 98765 11223',
            category: 'Hormonal Balance',
            currentProgramTitle: 'PCOS & Insulin Resistance Protocol',
            enrollmentStatus: 'active',
            startDate: new Date().toISOString().split('T')[0],
            currentDay: 2,
            totalDays: 21,
            streakDays: 1,
            completionRate: 75,
            lastActivityDate: new Date().toISOString().split('T')[0],
            lastCheckinNote: 'Logged breakfast protein & 20-min post-lunch walk',
            flaggedAtRisk: false
          });
        }
        localStorage.setItem('careloop_local_data_v1', JSON.stringify(db));
      }
      window.location.reload();
    `);
    await sleep(1500);
    await client.screenshot('dr_trisha_01_dashboard.png');

    // 2. Open Clinic QR Desk Stand for Dr. Trisha
    console.log('\n📸 2. Capturing Dr. Trisha\'s Clinic Desk QR Stand...');
    await client.evaluate(`
      const qrBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Clinic QR'));
      if (qrBtn) qrBtn.click();
    `);
    await sleep(600);
    await client.screenshot('dr_trisha_02_clinic_qr.png');

    // Close QR modal
    await client.evaluate(`
      const closeBtn = document.querySelector('button[title*="Close"]') || Array.from(document.querySelectorAll('button')).find(b => b.textContent === '✕');
      if (closeBtn) closeBtn.click();
    `);
    await sleep(400);

    // 3. WhatsApp Lab for Dr. Trisha & Ananya Rao
    console.log('\n📸 3. Capturing WhatsApp Lab for Dr. Trisha & Ananya...');
    await client.evaluate(`
      const labBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('WhatsApp Lab'));
      if (labBtn) labBtn.click();
    `);
    await sleep(800);
    await client.screenshot('dr_trisha_03_whatsapp_lab.png');

    // 4. Ananya Rao's Mobile Participant Experience (390x844)
    console.log('\n📸 4. Capturing Ananya Rao\'s Mobile Portal...');
    await client.setViewport(390, 844, true);
    await client.evaluate(`
      localStorage.setItem('careloop_user_session', JSON.stringify({
        uid: 'part_ananya',
        email: 'ananya.rao@example.com',
        displayName: 'Ananya Rao',
        role: 'participant',
        isDemo: true
      }));
      window.location.reload();
    `);
    await sleep(1500);
    await client.screenshot('dr_trisha_04_patient_mobile.png');

    client.close();
    console.log('\n🎉 ALL 4 DR. TRISHA VISUAL WORKFLOW SCREENSHOTS CAPTURED!');
  } finally {
    chromeProc.kill();
  }
}

main().catch(err => {
  console.error('Failed to capture Dr. Trisha screenshots:', err);
  process.exit(1);
});
