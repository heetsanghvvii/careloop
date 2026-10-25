import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome-stable', args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
await page.evaluate(() => { Object.keys(localStorage).filter(k=>k.startsWith('careloop')).forEach(k=>localStorage.removeItem(k)); });
const launch = page.locator('button', { hasText: 'Launch Interactive Sandbox Demo' }).first();
if (await launch.isVisible().catch(()=>false)) { await launch.click(); await page.waitForTimeout(1200); }
await page.locator('nav button', { hasText: /^Clients$/ }).first().click(); await page.waitForTimeout(500);
await page.locator('button', { hasText: 'Add Participant' }).first().click(); await page.waitForTimeout(400);
await page.locator('input[placeholder="e.g. Alex Morgan"]').fill('Probe Person');
await page.locator('input[placeholder="alex@example.com"]').fill('probe@synthetic.test');
const selects = page.locator('form select, [role=dialog] select');
if (await selects.count() >= 1) await selects.nth(0).selectOption({ index: 1 }).catch(()=>{});
await page.locator('button[type=submit]').first().click(); await page.waitForTimeout(800);
await page.locator('text=Probe Person').first().click(); await page.waitForTimeout(800);
const m = page.locator('.fixed.inset-0.z-50').last();
const t = await m.innerText().catch(()=>'NO MODAL');
var i=t.indexOf('CURRENTLY'); console.log('SEGMENT:', t.slice(i, i+200).replace(/\n/g,' | '));
await browser.close();
