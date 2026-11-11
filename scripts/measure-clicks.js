// Walks six core Careloop flows in a real browser and COUNTS interactions.
// Usage: npm run dev (port 3000), then:
//   PHASE=after node scripts/measure-clicks.js
// PHASE is only a label for output files (before | after). The script feature-detects
// each shortcut: if the shortcut is on screen it uses it, otherwise it walks the long path.
// So the same script measured the app before and after the PM changes.
//
// Counting convention (stated in team/reports/pm-review.md):
//   click  = one tap on a button, link, row, checkbox or radio
//   select = one choice in a native dropdown (costs two physical taps; counted as 1 action)
//   field  = one text field typed into (focusing it is not counted separately)
// Steps marked "setup" or "verify" are NOT counted (demo scaffolding or assertions).
// Synthetic data only. No network beyond localhost. Needs Playwright (not installed by this script).
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); } catch {
  ({ chromium } = require(path.join(execSync('npm root -g').toString().trim(), 'playwright')));
}

const BASE = process.env.CL_BASE || 'http://localhost:3000';
const PHASE = process.env.PHASE || 'after';
const OUT = path.resolve(process.cwd(), 'team/demo/pm');
fs.mkdirSync(OUT, { recursive: true });
const WIDTHS = [[1280, 900], [390, 844]];
const MIN_TARGET = 44;

const browser = await chromium.launch();
const results = [];

function makeActor(page, width) {
  const steps = [];
  const count = { clicks: 0, selects: 0, fields: 0 };
  const small = [];
  const box = async (loc) => loc.evaluate((el) => {
    const t = el.closest('label') || el;
    const r = t.getBoundingClientRect();
    return { w: Math.round(r.width), h: Math.round(r.height) };
  });
  const note = async (kind, loc, label) => {
    await loc.scrollIntoViewIfNeeded();
    const b = await box(loc);
    if (width <= 480 && Math.min(b.w, b.h) < MIN_TARGET) small.push(`${label} (${b.w}x${b.h})`);
    steps.push(`${kind}: ${label} [${b.w}x${b.h}]`);
  };
  return {
    steps, count, small,
    async click(loc, label) { loc = loc.first(); await loc.waitFor({ state: 'visible' }); await note('click', loc, label); await loc.click(); count.clicks++; },
    async check(loc, label) { loc = loc.first(); await loc.waitFor({ state: 'visible' }); await note('click', loc, label); await loc.check(); count.clicks++; },
    async type(loc, value, label) { loc = loc.first(); await loc.waitFor({ state: 'visible' }); await note('field', loc, label); await loc.fill(value); count.fields++; },
    async select(loc, option, label) { loc = loc.first(); await loc.waitFor({ state: 'visible' }); await note('select', loc, label); await loc.selectOption(option); count.selects++; },
    info(text) { steps.push(`(not counted) ${text}`); }
  };
}

const seen = async (loc, ms = 1200) => {
  try { await loc.first().waitFor({ state: 'visible', timeout: ms }); return true; } catch { return false; }
};
const text = (page, t) => page.getByText(t, { exact: false }).first();
const expectText = async (page, t) => { await text(page, t).waitFor({ state: 'visible' }); };
const hScroll = async (page) => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
const shot = async (page, name, opts = {}) => {
  const file = path.join(OUT, `${PHASE}_${name}.png`);
  await page.screenshot({ path: file, ...opts });
};
const tab = (page, name) => page.locator('nav[aria-label="Practice navigation"] button', { hasText: name });

async function newPage(width, height) {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 2, hasTouch: width <= 480 });
  const page = await context.newPage();
  page.setDefaultTimeout(8000);
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  return { context, page, errors };
}

async function runFlow(id, name, width, height, fn, shared) {
  const own = shared || await newPage(width, height);
  const actor = makeActor(own.page, width);
  const row = { id, name, width, status: 'ok' };
  try {
    await fn(own.page, actor, width);
    row.overflowPx = Math.max(0, await hScroll(own.page));
  } catch (e) {
    row.status = 'blocked';
    row.reason = e.message.split('\n')[0];
    await own.page.screenshot({ path: path.join(OUT, `${PHASE}_BLOCKED_${id}_${width}.png`) }).catch(() => {});
  }
  Object.assign(row, actor.count, {
    total: actor.count.clicks + actor.count.selects + actor.count.fields,
    smallTargets: actor.small, steps: actor.steps, pageErrors: own.errors.slice()
  });
  results.push(row);
  console.log(`[${width}] ${id} ${name}: ${row.status} clicks=${row.clicks} selects=${row.selects} fields=${row.fields} total=${row.total}` +
    (row.reason ? ` reason=${row.reason}` : '') + (row.smallTargets.length ? ` under44=${row.smallTargets.length}` : ''));
  if (!shared) await own.context.close();
  return row;
}

// ---------- Flow 1: new doctor, landing page to one programme assigned to one participant ----------
async function flow1(page, a, width) {
  await page.goto(BASE);
  await expectText(page, 'early access');
  await shot(page, `f1_landing_${width}`);
  const navBtn = page.getByRole('button', { name: /Onboard Clinic|Set up my practice/ });
  if (await seen(navBtn, 800)) await a.click(navBtn, 'Landing: onboarding button in the navbar');
  else await a.click(page.getByRole('button', { name: /Doctor Self-Serve Onboarding|Set up my practice/ }), 'Landing: onboarding link in the top strip');
  await expectText(page, 'Practice & Clinician Profile');
  const submit = page.getByRole('button', { name: /Generate My Practice Workspace|Create my workspace/ });
  const submitY = await submit.first().evaluate((el) => Math.round(el.getBoundingClientRect().top + window.scrollY));
  a.info(`onboarding: submit button sits ${submitY}px from the top of the page`);
  await shot(page, `f1_onboarding_${width}`, { fullPage: true });
  await a.type(page.getByPlaceholder('e.g. Dr. Priya Sharma'), 'Dr. Asha Rao', 'Doctor full name');
  await a.type(page.getByPlaceholder('dr.priya@metabolic.health'), 'asha.rao@example.com', 'Professional email');
  await a.type(page.getByPlaceholder('e.g. Sanjeevani Metabolic Clinic'), 'Rao Metabolic Clinic', 'Clinic name');
  await a.type(page.getByPlaceholder('+919876543210'), '+919876500001', 'Clinic WhatsApp number');
  await a.click(submit, 'Onboarding: create workspace');
  await expectText(page, 'Practice overview');
  const modalTitle = page.getByText(/Enroll New Participant|Add a client/);
  if (!(await seen(modalTitle, 1200))) await a.click(page.getByRole('button', { name: '+ Add client' }), 'Overview: + Add client');
  await modalTitle.first().waitFor({ state: 'visible' });
  await a.type(page.getByPlaceholder('e.g. Alex Morgan'), 'Ravi Kumar', 'Participant full name');
  await a.type(page.getByPlaceholder('alex@example.com'), 'ravi.kumar@example.com', 'Participant email');
  const programSelect = page.locator('select').filter({ has: page.locator('option', { hasText: 'Assign Later' }) });
  const firstProgram = await programSelect.locator('option').nth(1).getAttribute('value');
  await a.select(programSelect, firstProgram, 'Initial programme (first real option)');
  await shot(page, `f1_add_client_${width}`);
  await a.click(page.getByRole('button', { name: /Enroll Participant|Add client$/ }), 'Add modal: enrol');
  await page.waitForFunction(() => {
    const d = JSON.parse(localStorage.getItem('careloop_local_data_v1') || '{}');
    return d.participants && d.participants.length === 1 && Boolean(d.participants[0].currentProgramId);
  });
  a.info('verified in localStorage: 1 participant with a programme assigned in the new workspace');
}

// ---------- Flow 2: doctor daily, see who needs follow-up and act on one ----------
async function flow2(page, a, width) {
  await page.goto(`${BASE}/?view=dashboard`);
  await expectText(page, 'Follow-up queue');
  const row = page.locator('.cl-client-row', { hasText: 'David Miller' });
  await row.first().waitFor({ state: 'visible' });
  const y = await row.first().evaluate((el) => Math.round(el.getBoundingClientRect().top));
  a.info(`follow-up queue shows David Miller with 0 clicks; row top is ${y}px from the top of a ${width === 390 ? 844 : 900}px viewport`);
  await shot(page, `f2_overview_${width}`, { fullPage: true });
  const before = await page.evaluate(() => JSON.parse(localStorage.getItem('careloop_local_data_v1')).simulatedReminders.length);
  const quick = page.getByRole('button', { name: /Queue check-in for David Miller/ });
  if (await seen(quick, 800)) {
    await a.click(quick, 'Overview: Queue check-in on David Miller row');
    await expectText(page, 'Undo');
    await shot(page, `f2_overview_after_action_${width}`);
  } else {
    await a.click(row, 'Overview: open David Miller to review');
    await expectText(page, 'Adherence Rate');
    await shot(page, `f2_detail_modal_${width}`);
    await a.click(page.getByRole('button', { name: 'Close', exact: true }), 'Detail modal: Close (no follow-up action in the modal)');
    await a.click(tab(page, 'Follow-ups'), 'Nav: Follow-ups tab');
    await expectText(page, 'Schedule Simulated Prompt');
    const target = page.locator('select').filter({ has: page.locator('option', { hasText: 'David Miller' }) }).first();
    await a.select(target, { label: await target.locator('option', { hasText: 'David Miller' }).first().innerText() }, 'Target participant: David Miller');
    await a.click(page.getByRole('button', { name: 'Queue Simulated Reminder' }), 'Queue Simulated Reminder');
  }
  await page.waitForFunction((n) => JSON.parse(localStorage.getItem('careloop_local_data_v1')).simulatedReminders.length === n + 1, before);
  a.info('verified in localStorage: one simulated reminder queued for David Miller (nothing is really sent)');
}

// ---------- Flow 3: patient daily, all of today's tasks marked done ----------
async function flow3(page, a, width) {
  await page.goto(`${BASE}/?view=participant`);
  await expectText(page, 'Daily Checklist');
  const each = page.getByRole('button', { name: 'Mark Complete' });
  await each.first().waitFor({ state: 'visible' });
  const n = await each.count();
  const y = await each.first().evaluate((el) => Math.round(el.getBoundingClientRect().top + window.scrollY));
  a.info(`${n} tasks today; first "Mark Complete" button is ${y}px down the page`);
  await shot(page, `f3_patient_${width}`, { fullPage: true });
  const all = page.getByRole('button', { name: /Mark all .*done/ });
  if (await seen(all, 800)) {
    await a.click(all, `Mark all ${n} done`);
    await expectText(page, 'Undo');
  } else {
    for (let i = 0; i < n; i++) await a.click(page.getByRole('button', { name: 'Mark Complete' }), `Mark Complete (task ${i + 1} of ${n})`);
  }
  await page.waitForFunction((k) => Array.from(document.querySelectorAll('button')).filter((b) => b.innerText.trim() === 'Completed').length === k, n);
  a.info(`verified on screen: ${n} of ${n} tasks show Completed`);
  await shot(page, `f3_patient_done_${width}`, { fullPage: true });
}

// ---------- Flow 4a: doctor orders a lab test through the Lab Tests tab ----------
async function flow4a(page, a, width) {
  await page.goto(`${BASE}/?view=dashboard`);
  await expectText(page, 'Practice overview');
  await a.click(tab(page, 'Lab Tests'), 'Nav: Lab Tests tab');
  await expectText(page, 'Synthetic demo data. No real lab, no real patient.');
  await a.select(page.locator('#vial-participant'), { label: 'Sarah Chen' }, 'Participant: Sarah Chen');
  await a.check(page.getByLabel('HbA1c'), 'Test: HbA1c');
  await a.check(page.getByLabel('Lipid Profile'), 'Test: Lipid Profile');
  await shot(page, `f4_lab_tab_${width}`, { fullPage: true });
  await a.click(page.getByRole('button', { name: 'Create order' }), 'Create order');
  await expectText(page, 'Order created');
}

// ---------- Flow 4b: doctor orders a lab test while looking at the participant's record ----------
async function flow4b(page, a, width) {
  await page.goto(`${BASE}/?view=dashboard&tab=participants`);
  await page.locator('tr', { hasText: 'Marcus Vance' }).first().waitFor({ state: 'visible' });
  a.info('start: doctor is on the Clients list');
  await a.click(page.locator('tr', { hasText: 'Marcus Vance' }), 'Clients: open Marcus Vance');
  await expectText(page, 'Adherence Rate');
  const quick = page.getByRole('button', { name: 'Order lab test' });
  if (await seen(quick, 800)) {
    await shot(page, `f4_detail_modal_${width}`);
    await a.click(quick, 'Detail modal: Order lab test');
  } else {
    await a.click(page.getByRole('button', { name: 'Close', exact: true }), 'Detail modal: Close (no lab action in the modal)');
    await a.click(tab(page, 'Lab Tests'), 'Nav: Lab Tests tab');
    await a.select(page.locator('#vial-participant'), { label: 'Marcus Vance' }, 'Participant: Marcus Vance');
  }
  await expectText(page, 'Synthetic demo data. No real lab, no real patient.');
  const chosen = await page.locator('#vial-participant').evaluate((el) => el.options[el.selectedIndex].text);
  if (chosen !== 'Marcus Vance') throw new Error(`participant not preselected, got ${chosen}`);
  const ticked = await page.locator('section[aria-label="Create lab order"] input[type=checkbox]:checked').count();
  if (ticked !== 0) throw new Error('hard rule broken: a test was pre-ticked');
  a.info('verified: Marcus Vance is the selected participant and no test is pre-ticked');
  await a.check(page.getByLabel('HbA1c'), 'Test: HbA1c');
  await a.check(page.getByLabel('Lipid Profile'), 'Test: Lipid Profile');
  await shot(page, `f4_lab_from_record_${width}`, { fullPage: true });
  await a.click(page.getByRole('button', { name: 'Create order' }), 'Create order');
  await expectText(page, 'Order created');
}

// ---------- Flow 5: patient books that test ----------
async function flow5(page, a, width, label = 'first booking') {
  await page.goto(`${BASE}/?view=participant`);
  await expectText(page, 'Lab tests');
  await expectText(page, 'Synthetic demo data. No real lab, no real patient.');
  await expectText(page, 'HbA1c');
  const pin = page.locator('input[inputmode="numeric"]');
  if (!(await seen(pin, 1200))) await a.click(page.getByRole('button', { name: 'Book home collection' }), 'Book home collection (opens the form)');
  await pin.first().waitFor({ state: 'visible' });
  const consent = page.getByLabel('I agree to the consent text above');
  const available = text(page, 'Home collection available in');
  if (!(await seen(available, 1500))) {
    await a.type(pin, '560001', 'Pincode');
    if (!(await seen(available, 1500))) await a.click(page.getByRole('button', { name: 'Check', exact: true }), 'Check pincode');
  } else {
    a.info(`pincode was remembered from the last booking (${await pin.first().inputValue()})`);
  }
  await available.waitFor({ state: 'visible' });
  await consent.first().waitFor({ state: 'visible' });
  if (await consent.first().isChecked()) throw new Error('hard rule broken: consent was pre-ticked');
  a.info('verified: consent checkbox is unticked by default');
  await a.check(page.locator('input[type=radio]'), 'Collection slot (first offered)');
  await a.check(consent, 'Consent checkbox');
  await expectText(page, 'Draft consent, not legally reviewed.');
  await shot(page, `f5_booking_${label.replace(/\s+/g, '_')}_${width}`, { fullPage: true });
  await a.click(page.getByRole('button', { name: 'Book home collection' }).last(), 'Book home collection (submit)');
  await expectText(page, 'Home collection 20');
}

// Not counted: demo scaffolding that stands in for the lab.
async function setupReportReady(page) {
  await page.goto(`${BASE}/?view=dashboard&tab=labs`);
  await page.locator('section[aria-label="Lab orders"] button', { hasText: 'Booked' }).first().click();
  await page.getByRole('button', { name: 'Sample collected' }).click();
  await expectText(page, 'Status: Sample collected');
  await page.getByRole('button', { name: 'Report ready' }).click();
  await expectText(page, 'Report received. The patient cannot see it yet.');
}
async function setupSecondOrder(page) {
  await page.goto(`${BASE}/?view=dashboard&tab=labs`);
  await page.selectOption('#vial-participant', { label: 'Sarah Chen' });
  await page.getByLabel('HbA1c').check();
  await page.getByRole('button', { name: 'Create order' }).click();
  await expectText(page, 'Order created');
}

// ---------- Flow 6: doctor reviews and releases a report ----------
async function flow6(page, a, width) {
  await page.goto(`${BASE}/?view=dashboard`);
  await expectText(page, 'Practice overview');
  const quick = page.getByRole('button', { name: /Review lab report for Sarah Chen/ });
  if (await seen(quick, 1500)) {
    await shot(page, `f6_overview_${width}`, { fullPage: true });
    await a.click(quick, 'Overview: Review lab report for Sarah Chen');
  } else {
    await a.click(tab(page, 'Lab Tests'), 'Nav: Lab Tests tab');
    await a.click(page.locator('section[aria-label="Lab orders"] button', { hasText: 'awaiting your review' }), 'Orders list: open the order awaiting review');
  }
  await expectText(page, 'Report received. The patient cannot see it yet.');
  await expectText(page, 'Reference range');
  await shot(page, `f6_review_${width}`, { fullPage: true });
  await a.click(page.getByRole('button', { name: 'Release to patient' }), 'Release to patient');
  await expectText(page, 'Report released to the patient');
  await page.goto(`${BASE}/?view=participant`);
  await expectText(page, 'Reference range');
  a.info('verified: patient portal shows values only after release');
}

for (const [w, h] of WIDTHS) {
  await runFlow('1', 'New doctor: landing to one programme assigned to one participant', w, h, flow1);
  await runFlow('2', 'Doctor daily: see who needs follow-up, act on one', w, h, flow2);
  await runFlow('3', 'Patient daily: all of today\'s tasks done', w, h, flow3);
  await runFlow('4b', 'Doctor orders a lab test from the participant record', w, h, flow4b);
  // Flows 4a, 5, 5b and 6 share one browser context so the order carries through.
  const shared = await newPage(w, h);
  const r4 = await runFlow('4a', 'Doctor orders a lab test (Lab Tests tab)', w, h, flow4a, shared);
  let r5 = { status: 'blocked' };
  if (r4.status === 'ok') r5 = await runFlow('5', 'Patient books that test (first booking)', w, h, (p, a, width) => flow5(p, a, width, 'first booking'), shared);
  else results.push({ id: '5', name: 'Patient books that test', width: w, status: 'blocked', reason: 'flow 4a did not create an order' });
  if (r5.status === 'ok') {
    try {
      await setupReportReady(shared.page);
      await runFlow('6', 'Doctor reviews and releases a report', w, h, flow6, shared);
    } catch (e) { results.push({ id: '6', name: 'Doctor reviews and releases a report', width: w, status: 'blocked', reason: e.message.split('\n')[0] }); }
    try {
      await setupSecondOrder(shared.page);
      await runFlow('5b', 'Patient books a second test (repeat booking)', w, h, (p, a, width) => flow5(p, a, width, 'repeat booking'), shared);
    } catch (e) { results.push({ id: '5b', name: 'Patient books a second test', width: w, status: 'blocked', reason: e.message.split('\n')[0] }); }
  } else {
    results.push({ id: '6', name: 'Doctor reviews and releases a report', width: w, status: 'blocked', reason: 'flow 5 did not book' });
  }
  await shared.context.close();
}

await browser.close();
fs.writeFileSync(path.join(OUT, `clicks-${PHASE}.json`), JSON.stringify(results, null, 2));
console.log(`\nSaved team/demo/pm/clicks-${PHASE}.json`);
if (results.some((r) => r.status !== 'ok')) process.exitCode = 1;
