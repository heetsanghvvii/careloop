import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const SCREENSHOTS_DIR = path.resolve(process.cwd(), 'screenshots');
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const DEBUG_PORT = 9223; // use separate debug port
const PORT = 3001; // Worktree port

const mode = process.argv.includes('--after') ? 'after' : 'before';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getPageWsUrl() {
  for (let i = 0; i < 25; i++) {
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
  throw new Error('Could not find Chrome page target on port ' + DEBUG_PORT);
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

  async assertTextInPage(expectedSubstring, viewDescription, timeoutMs = 7000) {
    const startTime = Date.now();
    while (Date.now() - startTime < timeoutMs) {
      try {
        const pageText = await this.evaluate(`document.body ? document.body.innerText : ''`);
        if (typeof pageText === 'string' && pageText.toLowerCase().includes(expectedSubstring.toLowerCase())) {
          console.log(`  ✓ Gate Passed [${viewDescription}]: Found "${expectedSubstring}"`);
          return true;
        }
      } catch (err) {
        // Wait and retry
      }
      await sleep(200);
    }
    const currentDom = await this.evaluate(`document.body ? document.body.innerText.slice(0, 500) : 'EMPTY_DOM'`);
    throw new Error(`[ASSERTION FAILED] View "${viewDescription}" did NOT contain required text: "${expectedSubstring}". Current DOM snippet: ${JSON.stringify(currentDom)}`);
  }

  async setViewport(width, height, isMobile = true) {
    await this.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 2,
      mobile: isMobile
    });
    await this.send('Emulation.setVisibleSize', { width, height });
  }

  async screenshot(filename) {
    const res = await this.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    const buffer = Buffer.from(res.data, 'base64');
    const filePath = path.join(SCREENSHOTS_DIR, filename);
    fs.writeFileSync(filePath, buffer);
    const hash = crypto.createHash('sha256').update(buffer).digest('hex').slice(0, 10);
    const sizeKb = (buffer.length / 1024).toFixed(1);
    console.log(`  📸 Saved: ${path.relative(process.cwd(), filePath)} (${sizeKb} KB, hash: ${hash})`);
    return { filename, size: buffer.length, hash };
  }

  close() {
    this.ws.close();
  }
}

async function main() {
  console.log(`🚀 Starting Participant Portal Token Verification Capture (${mode.toUpperCase()})...`);

  const tmpProfileDir = `/tmp/chrome_pp_${Date.now()}`;
  fs.mkdirSync(tmpProfileDir, { recursive: true });

  const chromeProc = spawn(CHROME_PATH, [
    `--remote-debugging-port=${DEBUG_PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    `--user-data-dir=${tmpProfileDir}`
  ]);

  try {
    const wsUrl = await getPageWsUrl();
    const client = new CDPClient(wsUrl);
    await client.ready();

    await client.send('Page.enable');
    await client.send('DOM.enable');
    await client.send('Runtime.enable');

    // Mobile viewport standard (iPhone 14 / modern standard 390x844)
    await client.setViewport(390, 844, true);

    // 1. Daily Checklist Tab
    console.log(`\n[1/3] Capturing Participant Portal: Daily Checklist (${mode})...`);
    await client.send('Page.navigate', { url: `http://localhost:${PORT}/?view=participant` });
    await client.assertTextInPage('Participant Portal', 'Header Title');
    await client.assertTextInPage('Daily Checklist', 'Checklist Tab');
    await sleep(400);
    await client.screenshot(`portal_${mode}_01_checklist.png`);

    // 2. Progress & Streak Tab
    console.log(`\n[2/3] Capturing Participant Portal: Progress & Streak (${mode})...`);
    await client.evaluate(`(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => b.textContent.includes('My Progress & Streak'));
      if (btn) btn.click();
    })()`);
    await client.assertTextInPage('Personal Adherence Overview', 'Progress Tab Header');
    await client.assertTextInPage('Completion Score', 'Metric Card');
    await sleep(400);
    await client.screenshot(`portal_${mode}_02_progress.png`);

    // 3. Check-In Log Tab
    console.log(`\n[3/3] Capturing Participant Portal: Check-In Log (${mode})...`);
    await client.evaluate(`(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => b.textContent.includes('Check-In Log'));
      if (btn) btn.click();
    })()`);
    await client.assertTextInPage('Past Check-In Records', 'Log Tab Header');
    await sleep(400);
    await client.screenshot(`portal_${mode}_03_history.png`);

    client.close();
    console.log(`\n✅ Finished capturing all 3 participant portal surfaces (${mode})!`);
  } finally {
    chromeProc.kill('SIGKILL');
    try {
      fs.rmSync(tmpProfileDir, { recursive: true, force: true });
    } catch {}
  }
}

main().catch(err => {
  console.error('Fatal capture error:', err);
  process.exit(1);
});
