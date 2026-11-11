// Drives the Project Vial demo flow against a running dev server and saves real screenshots.
// Usage: npm run dev (port 3000), then: node scripts/capture-vial-demo.js
// Needs Playwright installed globally. Synthetic data only. No network beyond localhost.
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); } catch {
  ({ chromium } = require(path.join(execSync('npm root -g').toString().trim(), 'playwright')));
}

const BASE = process.env.VIAL_BASE || 'http://localhost:3000';
const OUT = path.resolve(process.cwd(), 'team/demo');
fs.mkdirSync(OUT, { recursive: true });

const DOCTOR = `${BASE}/?view=dashboard&tab=labs`;
const PATIENT = `${BASE}/?view=participant`;

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 });
const page = await context.newPage();
page.setDefaultTimeout(10000);

const expectText = async (text) => {
  await page.getByText(text, { exact: false }).first().waitFor({ state: 'visible' });
  console.log(`  ok: "${text}" visible`);
};
const expectAbsent = async (text) => {
  const body = await page.evaluate(() => document.body.innerText);
  if (body.includes(text)) throw new Error(`UNEXPECTED text on screen: "${text}"`);
  console.log(`  ok: "${text}" NOT on screen`);
};
const shot = async (name, opts = {}) => {
  // Sticky headers float mid-page in full-page captures; make them static for the capture only.
  await page.addStyleTag({ content: 'header{position:static !important}' });
  await page.screenshot({ path: path.join(OUT, name), ...opts });
  console.log(`  saved ${name}`);
};
const noHScroll = async (label) => {
  const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (over > 0) throw new Error(`Horizontal scroll at ${label}: ${over}px`);
  console.log(`  ok: no horizontal scroll (${label})`);
};

try {
  await page.goto(BASE);
  await page.evaluate(() => { localStorage.removeItem('careloop_vial_diagnostics_v1'); });

  console.log('1. Doctor creates order');
  await page.goto(DOCTOR);
  await expectText('Lab Tests');
  await expectText('Synthetic demo data. No real lab, no real patient.');
  await page.selectOption('#vial-participant', { label: 'Sarah Chen' });
  await page.getByLabel('HbA1c').check();
  await page.getByLabel('Lipid Profile').check();
  await page.fill('#vial-note', 'Please book home collection this week.');
  await shot('01_doctor_create_order.png', { fullPage: true });
  await page.getByRole('button', { name: 'Create order' }).click();
  await expectText('Order created');
  await page.getByRole('button', { name: 'Lab Tests' }).first().waitFor();
  await expectText('Demo: simulate lab');

  console.log('2. Patient books');
  await page.goto(PATIENT);
  await expectText('Lab tests');
  await expectText('HbA1c, Lipid Profile');
  await page.getByRole('button', { name: 'Book home collection' }).click();
  await page.fill('input[inputmode="numeric"]', '560001');
  await page.getByRole('button', { name: 'Check', exact: true }).click();
  await expectText('Home collection available in Bengaluru');
  await page.locator('input[type=radio]').first().check();
  await expectText('Draft consent, not legally reviewed.');
  await page.getByLabel('I agree to the consent text above').check();
  await shot('02_patient_book.png', { fullPage: true });
  await page.getByRole('button', { name: 'Book home collection' }).last().click();
  await expectText('Home collection 20');

  console.log('3. Doctor simulates collected + report');
  await page.goto(DOCTOR);
  await page.locator('section[aria-label="Lab orders"] button').first().click();
  await page.getByRole('button', { name: 'Sample collected' }).click();
  await expectText('Demo event applied');
  await expectText('Status: Sample collected');
  await page.getByRole('button', { name: 'Report ready' }).click();
  await expectText('Report received. The patient cannot see it yet.');
  await expectText('Release to patient');
  await expectText('Reference range');
  await shot('03_doctor_review_pending.png', { fullPage: true });

  console.log('4. Patient before release: no values');
  await page.goto(PATIENT);
  await expectText('Your doctor is reviewing the report');
  await expectAbsent('Reference range');
  await expectAbsent('mg/dL');
  await expectAbsent('Hemoglobin');
  await shot('04_patient_before_release.png', { fullPage: true });

  console.log('5. Doctor releases, patient sees values');
  await page.goto(DOCTOR);
  await page.locator('section[aria-label="Lab orders"] button').first().click();
  await page.fill('#vial-release-note', 'Reviewed. Let us discuss at your next visit.');
  await page.getByRole('button', { name: 'Release to patient' }).click();
  await expectText('Report released to the patient');
  await page.goto(PATIENT);
  await expectText('Reviewed. Let us discuss at your next visit.');
  await expectText('Reference range');
  await expectText('mg/dL');
  await shot('05_patient_after_release.png', { fullPage: true });

  console.log('6. Mobile 390px');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(PATIENT);
  await expectText('Reviewed. Let us discuss at your next visit.');
  await noHScroll('patient 390');
  await shot('06_patient_mobile_390.png', { fullPage: true });
  await page.goto(DOCTOR);
  await expectText('Lab Tests');
  await page.locator('section[aria-label="Lab orders"] button').first().click();
  await expectText('Demo: simulate lab');
  await noHScroll('doctor 390');
  await shot('07_doctor_mobile_390.png', { fullPage: true });

  console.log('ALL STEPS PASSED');
} catch (e) {
  console.error('FAILED:', e.message);
  await page.screenshot({ path: path.join(OUT, 'FAILED_state.png'), fullPage: true }).catch(() => {});
  process.exitCode = 1;
} finally {
  await browser.close();
}
