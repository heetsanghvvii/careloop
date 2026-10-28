import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome-stable', args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
const launch = page.locator('button', { hasText: 'Launch Interactive Sandbox Demo' }).first();
if (await launch.isVisible().catch(()=>false)) { await launch.click(); await page.waitForTimeout(1200); }
await page.locator('nav button', { hasText: /^Clients$/ }).first().click(); await page.waitForTimeout(500);
await page.locator('text=Meera Iyer').first().click(); await page.waitForTimeout(800);
const m = page.locator('.fixed.inset-0.z-50').last();
console.log('MODAL VISIBLE:', await m.isVisible().catch(()=>false));
console.log('MODAL TEXT:', (await m.innerText().catch(()=>'')).slice(0,600).replace(/\n/g,' | '));
await browser.close();
