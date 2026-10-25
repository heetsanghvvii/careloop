import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome-stable', args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
await page.locator('button', { hasText: 'Launch Interactive Sandbox Demo' }).first().click();
await page.waitForTimeout(1200);
// Clients tab
await page.locator('nav button', { hasText: 'Clients' }).click();
await page.waitForTimeout(600);
console.log('CLIENTS H:', JSON.stringify(await page.locator('h1, h2').allInnerTexts()));
console.log('CLIENTS BTNS:', JSON.stringify((await page.locator('button').allInnerTexts()).slice(0, 25)));
// open add participant
const add = page.locator('button', { hasText: /add/i }).first();
if (await add.count()) {
  await add.click(); await page.waitForTimeout(500);
  const dlg = page.locator('input, select, textarea');
  console.log('MODAL FIELDS:', JSON.stringify(await page.locator('form input, form select, [role=dialog] input, [role=dialog] select').evaluateAll(els => els.map(e => ({n: e.name, p: e.placeholder, t: e.type})))));
  console.log('MODAL TEXT:', (await page.locator('body').innerText()).slice(0, 400).replace(/\n+/g,' | '));
  await page.keyboard.press('Escape'); await page.waitForTimeout(300);
}
await browser.close();
