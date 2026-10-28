import { chromium } from 'playwright';
const shots = 'e2e/shots/';
const results = [];
const errors = [];
function log(r){ results.push(r); console.log((r.pass?'PASS':'FAIL') + ' | ' + r.persona + ' | ' + r.step + (r.detail?' | '+r.detail:'')); }
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome-stable', args: ['--no-sandbox'] });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
page.on('console', m => { if (m.type()==='error') errors.push(m.text().slice(0,150)); });
page.on('pageerror', e => errors.push('PAGEERROR: '+String(e).slice(0,150)));

async function enterDemo(){
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
  const launch = page.locator('button', { hasText: 'Launch Interactive Sandbox Demo' }).first();
  if (await launch.isVisible().catch(()=>false)) { await launch.click(); await page.waitForTimeout(1200); }
}
async function goTab(label){ await page.locator('nav button', { hasText: new RegExp('^'+label+'$') }).first().click(); await page.waitForTimeout(500); }
async function addPersona(p, assignFirst){
  await goTab('Clients');
  await page.locator('button', { hasText: 'Add Participant' }).first().click();
  await page.waitForTimeout(400);
  await page.locator('input[placeholder="e.g. Alex Morgan"]').fill(p.name);
  await page.locator('input[placeholder="alex@example.com"]').fill(p.email);
  await page.locator('input[placeholder^="+91"]').fill(p.phone);
  const selects = page.locator('form select, [role=dialog] select');
  if (await selects.count() >= 2){
    await selects.nth(0).selectOption({ index: 1 }).catch(()=>{});
    if (assignFirst) await selects.nth(1).selectOption({ index: 1 }).catch(()=>{});
  }
  await page.locator('button[type=submit]').first().click();
  await page.waitForTimeout(800);
}
async function inList(name){
  const body = await page.locator('body').innerText();
  return body.includes(name);
}
async function openDetail(name){
  await page.locator('text='+name).first().click();
  await page.waitForTimeout(800);
  const m = page.locator('.fixed.inset-0.z-50').last();
  const ok = await m.isVisible().catch(()=>false);
  if (!ok) console.log('WARN modal not visible for '+name);
}
async function detailText(){ const m = page.locator('.fixed.inset-0.z-50').last(); if (!(await m.isVisible().catch(()=>false))) return ''; return await m.innerText(); }
async function closeModal(){ await page.keyboard.press('Escape'); await page.waitForTimeout(400); const b = page.locator('button[aria-label="Close"], button:has-text("×"), button:has-text("Close")').first(); if (await b.isVisible().catch(()=>false)) await b.click().catch(()=>{}); await page.waitForTimeout(300); }
async function labCheckin(name, prog){
  await goTab('Message lab');
  const sel = page.locator('select').first();
  const opts = await sel.locator('option').all();
  let val = null;
  for (const o of opts){ const t = await o.innerText(); if (t.includes(name)){ val = await o.getAttribute('value'); break; } }
  if (!val) throw new Error('lab option not found for '+name);
  await sel.selectOption(val);
  await page.waitForTimeout(800);
  const labText = await page.locator('body').innerText();
  const first = name.split(' ')[0];
  const greetOk = labText.includes('Good morning '+first) && labText.includes('Day 1') && (!prog || labText.includes(prog));
  log({persona:name, step:'lab-greeting-consistency', pass: greetOk, detail: greetOk?'':'greeting mismatch'});
  const scrollY = await page.evaluate(() => window.scrollY);
  log({persona:name, step:'lab-no-page-scroll-clip', pass: scrollY < 40, detail:'scrollY='+scrollY});
  await page.locator('button', { hasText: 'Done!' }).first().click();
  await page.waitForTimeout(1800);
}

const personas = [
  { name: 'Aarav Kapoor', email: 'aarav.k@synthetic.test', phone: '+91 98000 10001' },
  { name: 'Meera Iyer', email: 'meera.i@synthetic.test', phone: '+91 98000 10002' },
  { name: 'Rohan Desai', email: 'rohan.d@synthetic.test', phone: '+91 98000 10003' },
  { name: 'Ishita Bose', email: 'ishita.b@synthetic.test', phone: '+91 98000 10004' },
  { name: 'Kabir Malhotra', email: 'kabir.m@synthetic.test', phone: '+91 98000 10005' },
];

// clear synthetic db for a clean run
await page.goto('http://localhost:4173/', { waitUntil: 'domcontentloaded' });
await page.evaluate(() => { Object.keys(localStorage).filter(k=>k.startsWith('careloop')).forEach(k=>localStorage.removeItem(k)); });
await enterDemo();
await page.screenshot({ path: shots+'p0-overview.png' });

// ---- P1: full journey with assignment at enrollment
let p = personas[0];
await addPersona(p, true);
log({persona:p.name, step:'enroll-with-program', pass: await inList(p.name)});
await openDetail(p.name);
let d = await detailText();
log({persona:p.name, step:'detail-assigned-program', pass: !/No Program Currently Assigned/.test(d), detail:(d.match(/21-Day[^\n]*/)||['?'])[0]});
await closeModal();
await labCheckin(p.name);
await goTab('Clients'); await openDetail(p.name); d = await detailText();
const rate1 = (d.match(/(\d+)%/)||[])[1];
log({persona:p.name, step:'checkin-recorded', pass: rate1 !== undefined && rate1 !== '0', detail:'rate='+rate1});
log({persona:p.name, step:'task-title-resolved', pass: !/Task: task-/.test(d) && /Morning Circadian Hydration|Task:/.test(d), detail:(d.match(/Task: [^\n]*/)||['none'])[0]});
log({persona:p.name, step:'note-simulated-qualified', pass: /Simulated WhatsApp reply/.test(d) && !/Via WhatsApp Bot/.test(d)});
await page.screenshot({ path: shots+'p1-detail.png' });
await closeModal();

// ---- P2: enroll unassigned, assign via detail
p = personas[1];
await addPersona(p, false);
log({persona:p.name, step:'enroll-unassigned', pass: await inList(p.name)});
await openDetail(p.name); d = await detailText();
log({persona:p.name, step:'detail-shows-unassigned', pass: /No Program Currently Assigned|Unassigned/i.test(d), detail: (()=>{var i=d.indexOf('CURRENTLY'); return i>=0? d.slice(i,i+160).replace(/\n+/g,' | ') : d.slice(0,160).replace(/\n+/g,' | ')})()});
const chg = page.locator('button', { hasText: /Change Program|Assign Program/i }).first();
if (await chg.isVisible().catch(()=>false)) {
  await chg.click(); await page.waitForTimeout(400);
  const sel = page.locator('select').last();
  await sel.selectOption({ index: 1 }).catch(()=>{});
  const confirm = page.locator('button', { hasText: /Confirm|Assign|Save/i }).first();
  await confirm.click().catch(()=>{}); await page.waitForTimeout(700);
  d = await detailText();
  log({persona:p.name, step:'assign-via-detail', pass: !/No Program Currently Assigned/.test(d)});
} else log({persona:p.name, step:'assign-via-detail', pass:false, detail:'no assign button'});
await page.screenshot({ path: shots+'p2-assigned.png' });
await closeModal();

// ---- P3: form error then correction
p = personas[2];
await goTab('Clients');
await page.locator('button', { hasText: 'Add Participant' }).first().click(); await page.waitForTimeout(400);
await page.locator('input[placeholder="e.g. Alex Morgan"]').fill(p.name);
await page.locator('input[placeholder="alex@example.com"]').fill('not-an-email');
await page.locator('button[type=submit]').first().click(); await page.waitForTimeout(500);
const stillModal = await page.locator('input[placeholder="e.g. Alex Morgan"]').isVisible().catch(()=>false);
log({persona:p.name, step:'invalid-email-blocked', pass: stillModal && !(await inList(p.name+' | '))});
await page.locator('input[placeholder="alex@example.com"]').fill(p.email);
await page.locator('input[placeholder^="+91"]').fill(p.phone);
const selects = page.locator('form select, [role=dialog] select');
if (await selects.count() >= 2){ await selects.nth(0).selectOption({ index: 1 }).catch(()=>{}); await selects.nth(1).selectOption({ index: 1 }).catch(()=>{}); }
await page.locator('button[type=submit]').first().click(); await page.waitForTimeout(800);
log({persona:p.name, step:'corrected-enroll', pass: await inList(p.name)});
await labCheckin(p.name);

// ---- P4: check-in + Progress + at-risk correctness
p = personas[3];
await addPersona(p, true);
log({persona:p.name, step:'enroll-with-program', pass: await inList(p.name)});
await labCheckin(p.name);
await goTab('Progress');
const anText = await page.locator('body').innerText();
log({persona:p.name, step:'progress-renders', pass: /Adherence|Analytics|Completion/i.test(anText)});
await page.screenshot({ path: shots+'p4-progress.png' });
await goTab('Clients');
const needsAttn = page.locator('button', { hasText: /Needs Attention/ });
if (await needsAttn.isVisible().catch(()=>false)) { await needsAttn.click(); await page.waitForTimeout(500); const lt = await page.locator('body').innerText(); log({persona:p.name, step:'day1-not-at-risk', pass: !lt.includes(p.name)}); }
await page.locator('button', { hasText: /^All Statuses|Active Only/ }).first().click().catch(()=>{}); await page.waitForTimeout(300);

// ---- P5: isolation
p = personas[4];
await addPersona(p, true);
log({persona:p.name, step:'enroll-with-program', pass: await inList(p.name)});
await openDetail(p.name); d = await detailText();
const p5rate = (d.match(/(\d+)%/)||[])[1];
log({persona:p.name, step:'fresh-zero-completions', pass: p5rate === '0' || p5rate === undefined, detail:'rate='+p5rate});
await closeModal();
// isolation: P1 detail must show only P1 completions (rate unchanged since earlier)
await openDetail(personas[0].name); d = await detailText();
const p1rate2 = (d.match(/(\d+)%/)||[])[1];
log({persona:'ISOLATION', step:'p1-rate-isolated', pass: p1rate2 === rate1, detail:'before='+rate1+' after='+p1rate2});
await closeModal();

// ---- persistence across reload
await page.reload({ waitUntil: 'networkidle' }); await page.waitForTimeout(1000);
await enterDemo(); await goTab('Clients');
const allPresent = (await Promise.all(personas.map(pp=>inList(pp.name)))).every(Boolean);
log({persona:'ALL', step:'persist-after-reload-list', pass: allPresent});
await openDetail(personas[0].name); d = await detailText();
log({persona:'ALL', step:'persist-after-reload-completions', pass: ((d.match(/(\d+)%/)||[])[1]) === rate1, detail:'rate='+((d.match(/(\d+)%/)||[])[1])});
await page.screenshot({ path: shots+'persist-detail.png' });
await closeModal();

// overview + gym + followups + messagelab shots for video worker
await goTab('Overview'); await page.screenshot({ path: shots+'shell-overview.png' });
await goTab('Gym'); await page.waitForTimeout(600); await page.screenshot({ path: shots+'shell-gym.png' });
await goTab('Follow-ups'); await page.screenshot({ path: shots+'shell-followups.png' });
await goTab('Message lab'); await page.screenshot({ path: shots+'shell-lab.png' });

console.log('SUMMARY:', results.filter(r=>r.pass).length + '/' + results.length + ' passed');
console.log('CONSOLE ERRORS:', JSON.stringify(errors.slice(0,5)));
await browser.close();
