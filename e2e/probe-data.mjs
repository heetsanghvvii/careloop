import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome-stable', args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
const raw = await page.evaluate(() => { const k = Object.keys(localStorage).find(k=>k.includes('careloop') && k.includes('db')); return k ? localStorage.getItem(k).slice(0, 400) : Object.keys(localStorage).join(','); });
console.log('STORE:', raw);
await browser.close();
