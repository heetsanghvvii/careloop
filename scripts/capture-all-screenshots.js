import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

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
    const target = expectedSubstring.toLowerCase();
    while (Date.now() - startTime < timeoutMs) {
      const pageText = await this.evaluate(`document.body ? document.body.innerText : ''`);
      if (pageText && pageText.toLowerCase().includes(target)) {
        console.log(`  ✓ Gate Passed [${viewDescription}]: Found "${expectedSubstring}"`);
        return true;
      }
      await sleep(150);
    }
    const finalDump = (await this.evaluate(`document.body ? document.body.innerText : ''`)) || '';
    const snippet = finalDump.slice(0, 300).replace(/\s+/g, ' ');
    throw new Error(
      `🚨 QA ASSERTION FAILED: View "${viewDescription}" did NOT render expected string "${expectedSubstring}" within ${timeoutMs}ms!\n` +
      `Current DOM Text Snippet: "${snippet}..."`
    );
  }

  async screenshot(filename) {
    const res = await this.send('Page.captureScreenshot', { format: 'png' });
    const filePath = path.join(SCREENSHOTS_DIR, filename);
    const buffer = Buffer.from(res.data, 'base64');
    fs.writeFileSync(filePath, buffer);
    const hash = crypto.createHash('sha256').update(buffer).digest('hex').slice(0, 10);
    console.log(`  📸 Saved: screenshots/${filename} (${(buffer.length / 1024).toFixed(1)} KB, hash: ${hash})`);
    return { filename, size: buffer.length, hash };
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
  console.log('🚀 Starting Careloop Strict-Assertion Screenshot Engine...');
  const profileDir = `/tmp/careloop_chrome_${Date.now()}`;
  
  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    '--disable-gpu',
    `--user-data-dir=${profileDir}`,
    `--remote-debugging-port=${DEBUG_PORT}`,
    'about:blank'
  ], { stdio: 'ignore' });

  const capturedManifest = [];

  try {
    const pageWsUrl = await getPageWsUrl();
    const client = new CDPClient(pageWsUrl);
    await client.ready();
    await client.send('Page.enable');
    await client.send('Runtime.enable');

    // ==========================================
    // VIEW 1: MARKETING SITE HERO
    // ==========================================
    console.log('\n[1/21] Navigating to Marketing Site Hero...');
    await client.setViewport(1280, 850, false);
    await client.send('Page.navigate', { url: 'http://localhost:3000/?view=website' });
    await client.assertTextInPage("Your program doesn't end when you send the plan.", 'Marketing Hero');
    await sleep(400);
    capturedManifest.push(await client.screenshot('01_marketing_hero.png'));

    // ==========================================
    // VIEW 2: PRICING SECTION
    // ==========================================
    console.log('\n[2/21] Scrolling to Pricing Section...');
    await client.evaluate(`
      const pricingEl = document.getElementById('pricing');
      if (pricingEl) {
        pricingEl.scrollIntoView({ behavior: 'instant', block: 'start' });
      }
    `);
    await client.assertTextInPage('Plans that grow with your program.', 'Pricing Section Headline');
    await client.assertTextInPage('₹1,499', 'Pricing Section Growth Tier');
    await sleep(400);
    capturedManifest.push(await client.screenshot('02_pricing_section.png'));

    // ==========================================
    // VIEW 3: PRACTITIONER DASHBOARD
    // ==========================================
    console.log('\n[3/21] Switching to Practitioner Dashboard (Dr. Trisha / Workspace)...');
    await client.send('Page.navigate', { url: 'http://localhost:3000/?view=dashboard' });
    await client.assertTextInPage('Welcome back,', 'Practitioner Dashboard Welcome Banner');
    await client.assertTextInPage('Active Participants', 'Practitioner Metric Card');
    await sleep(400);
    capturedManifest.push(await client.screenshot('03_practitioner_dashboard.png'));

    // ==========================================
    // VIEW 4: WHATSAPP LAB SIMULATOR
    // ==========================================
    console.log('\n[4/21] Navigating to WhatsApp Lab Simulator...');
    await client.send('Page.navigate', { url: 'http://localhost:3000/?view=whatsapp_lab' });
    await client.assertTextInPage('WhatsApp Bot (simulated demo - live Meta integration not connected)', 'WhatsApp Lab Header');
    await client.assertTextInPage('Participant Under Test', 'WhatsApp Lab Control Panel');
    await sleep(400);
    capturedManifest.push(await client.screenshot('04_whatsapp_lab_simulator.png'));

    // ==========================================
    // VIEW 5: PARTICIPANT PORTAL AT MOBILE WIDTH
    // ==========================================
    console.log('\n[5/21] Navigating to Participant Mobile Portal (390x844)...');
    await client.setViewport(390, 844, true);
    await client.send('Page.navigate', { url: 'http://localhost:3000/?view=participant' });
    await client.assertTextInPage('Participant Portal', 'Mobile Header');
    await client.assertTextInPage('streak', 'Streak Indicator');
    await sleep(400);
    capturedManifest.push(await client.screenshot('05_participant_portal_mobile.png'));

    // ==========================================
    // VIEW 6-21: ALL SLIDES OF ALL THREE PITCH DECKS
    // ==========================================
    console.log('\n[Decks] Preparing Desktop Viewport for Pitch Decks (1280x850)...');
    await client.setViewport(1280, 850, false);

    const decksConfig = [
      {
        key: 'doctors',
        label: 'Deck 1: Doctors & Dietitians',
        tabName: 'Doctors',
        prefix: 'deck1_doctors',
        slides: [
          {
            name: 'slide1_overview',
            headline: 'Careloop: The Adherence Platform',
            detail: 'Turn dietary and lifestyle advice into daily patient follow-through'
          },
          {
            name: 'slide2_problem',
            headline: 'The Silent Drop-Off in Lifestyle Programs',
            detail: 'The Adherence Blindspot'
          },
          {
            name: 'slide3_solution',
            headline: 'Careloop: The Adherence Operating System',
            detail: 'Practitioner Control Room'
          },
          {
            name: 'slide4_whatsapp',
            headline: 'The WhatsApp Strategy: Staged & Safe',
            detail: 'Native Click-to-WhatsApp Deep Links'
          },
          {
            name: 'slide5_pricing',
            headline: 'Predictable Monthly Subscription Tiers',
            detail: 'Starter Tier'
          },
          {
            name: 'slide6_pilot',
            headline: 'Join the Pioneer Practitioner Cohort',
            detail: 'Onboarding 20 forward-thinking dietitians'
          }
        ]
      },
      {
        key: 'investors',
        label: 'Deck 2: Seed Investors',
        tabName: 'Investors',
        prefix: 'deck2_investors',
        slides: [
          {
            name: 'slide1_thesis',
            headline: 'Careloop: B2B Vertical SaaS for Chronic Care',
            detail: '₹1,800 Cr+'
          },
          {
            name: 'slide2_market',
            headline: 'India: The Metabolic Health Capital',
            detail: 'Practitioner Universe'
          },
          {
            name: 'slide3_economics',
            headline: 'High-Margin Subscription Economics',
            detail: 'Modeled CAC: ₹3,200'
          },
          {
            name: 'slide4_positioning',
            headline: 'Defensible Vertical Focus',
            detail: 'Positioned between medical billing systems'
          },
          {
            name: 'slide5_scalability',
            headline: 'Architecture & Privacy Governance',
            detail: 'Lean infrastructure with modern data protection principles'
          },
          {
            name: 'slide6_ask',
            headline: 'Proposed Pre-Seed Round: ₹1.5 Cr ($180K)',
            detail: 'Milestone-driven capital allocation'
          }
        ]
      },
      {
        key: 'team',
        label: 'Deck 3: Team & Culture',
        tabName: 'Team',
        prefix: 'deck3_team',
        slides: [
          {
            name: 'slide1_culture',
            headline: 'Join Careloop: Building Adherence Infrastructure',
            detail: 'Turn Advice into Action'
          },
          {
            name: 'slide2_roadmap',
            headline: 'Our 3-Phase Execution Roadmap',
            detail: 'From standalone habit tracker to complete clinical operating system'
          },
          {
            name: 'slide3_ethics',
            headline: 'Responsible Health Tech Architecture',
            detail: 'Anti-Guilt Philosophy'
          },
          {
            name: 'slide4_join',
            headline: 'Building from Day Zero',
            detail: 'Open Exploratory Roles'
          }
        ]
      }
    ];

    let overallIndex = 5;
    for (const deck of decksConfig) {
      console.log(`\n=== Opening ${deck.label} (${deck.slides.length} slides) ===`);
      
      // Open modal with specific deck
      await client.send('Page.navigate', { url: `http://localhost:3000/?view=website&pitchdeck=true&deck=${deck.key}&slide=0` });
      await client.assertTextInPage('Careloop Pitch Decks', 'Pitch Deck Modal Header');

      for (let sIdx = 0; sIdx < deck.slides.length; sIdx++) {
        overallIndex++;
        const slide = deck.slides[sIdx];
        console.log(`\n[${overallIndex}/21] Navigating to ${deck.key} Slide ${sIdx + 1}: "${slide.headline}"...`);

        // Set slide programmatically and verify
        await client.evaluate(`
          if (window.careloopPitchDeck) {
            window.careloopPitchDeck.setDeck('${deck.key}');
            window.careloopPitchDeck.setSlide(${sIdx});
          }
        `);

        // Strictly assert slide-specific title and detail text
        await client.assertTextInPage(slide.headline, `${deck.key} Slide ${sIdx + 1} Headline`);
        await client.assertTextInPage(slide.detail, `${deck.key} Slide ${sIdx + 1} Detail`);

        await sleep(350);
        const filename = `${deck.prefix}_${slide.name}.png`;
        capturedManifest.push(await client.screenshot(filename));
      }
    }

    client.close();

    // ==========================================
    // RIGOROUS QA UNIQUENESS & INTEGRITY AUDIT
    // ==========================================
    console.log('\n========================================');
    console.log('🔍 FINAL QA UNIQUENESS & INTEGRITY AUDIT');
    console.log('========================================');

    const seenHashes = new Map();
    let duplicatesFound = 0;

    for (const item of capturedManifest) {
      if (seenHashes.has(item.hash)) {
        console.error(`❌ DUPLICATE DETECTED: "${item.filename}" has identical hash ${item.hash} as "${seenHashes.get(item.hash)}"!`);
        duplicatesFound++;
      } else {
        seenHashes.set(item.hash, item.filename);
      }
    }

    if (duplicatesFound > 0) {
      throw new Error(`QA AUDIT FAILED: ${duplicatesFound} duplicate screenshots detected!`);
    }

    console.log(`\n🎉 100% SUCCESS: All ${capturedManifest.length} screenshots are unique, verified, and strictly asserted!`);
    console.log('\nVerified Manifest:');
    capturedManifest.forEach((m, idx) => {
      console.log(`  [${(idx + 1).toString().padStart(2, '0')}] ${m.filename.padEnd(40, ' ')} | ${(m.size / 1024).toFixed(1).padStart(6, ' ')} KB | hash: ${m.hash}`);
    });

  } finally {
    chromeProc.kill();
    try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch {}
  }
}

main().catch(err => {
  console.error('\n🚨 FATAL ERROR:', err.message);
  process.exit(1);
});
