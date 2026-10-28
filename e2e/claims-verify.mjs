import { chromium } from 'playwright';
const browser = await chromium.launch({executablePath:'/usr/bin/google-chrome-stable', headless:true, args:['--no-sandbox','--disable-dev-shm-usage']});
const page = await browser.newPage({viewport:{width:1280,height:800}});
const errs=[]; page.on('pageerror',e=>errs.push(e.message));
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const clickText=async(rx)=>page.evaluate((src)=>{const re=new RegExp(src,'i');const el=[...document.querySelectorAll('button,a,div[role=button],span')].find(e=>re.test(e.innerText||'')&&(e.innerText||'').length<120);if(el){el.click();return (el.innerText||'').trim().slice(0,60)}return null},rx.source);

await page.goto('http://localhost:4173/',{waitUntil:'networkidle'});
await clickText(/early access/i); await sleep(1500);
await page.screenshot({path:'e2e/shots/claims_earlyaccess.png'});
await page.keyboard.press('Escape'); await sleep(400);
await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(e=>/close|✕|×/i.test(e.innerText||e.getAttribute('aria-label')||''));b&&b.click()}); await sleep(500);

await clickText(/Launch Interactive Sandbox/i); await sleep(3000);
await page.screenshot({path:'e2e/shots/claims_sandbox_entry.png'});

const fb=await clickText(/firebase|cloud setup|connect backend/i); await sleep(1500);
await page.screenshot({path:'e2e/shots/claims_firebase_modal.png'});
await page.keyboard.press('Escape'); await sleep(400);
await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(e=>/close|✕|×/i.test(e.innerText||e.getAttribute('aria-label')||''));b&&b.click()}); await sleep(500);

const role=await clickText(/coach|practitioner|demo role/i); await sleep(800);
await page.screenshot({path:'e2e/shots/claims_rolemenu.png'});
const f=await clickText(/founder/i); await sleep(2500);
await page.screenshot({path:'e2e/shots/claims_founder.png'});
await page.evaluate(()=>window.scrollTo(0,document.body.scrollHeight)); await sleep(1200);
await page.screenshot({path:'e2e/shots/claims_founder_bottom.png'});

const p=await clickText(/generate|pitch/i); await sleep(2500);
await page.screenshot({path:'e2e/shots/claims_pitch_presentation.png'});
console.log(JSON.stringify({firebase:fb,role,founder:f,pitch:p,errs},null,1));
await browser.close();
