import { chromium } from 'playwright';
const browser = await chromium.launch({executablePath:'/usr/bin/google-chrome-stable', headless:true, args:['--no-sandbox','--disable-dev-shm-usage']});
const page = await browser.newPage({viewport:{width:1280,height:800}});
const errs=[]; page.on('pageerror',e=>errs.push(e.message));
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const clickText=async(rx)=>page.evaluate((src)=>{const re=new RegExp(src,'i');const el=[...document.querySelectorAll('button,a,div[role=button],span')].find(e=>re.test(e.innerText||'')&&(e.innerText||'').length<120);if(el){el.click();return (el.innerText||'').trim().slice(0,60)}return null},rx.source);

await page.goto('http://localhost:4173/',{waitUntil:'networkidle'});
await clickText(/Launch Interactive Sandbox/i); await sleep(3000);

// Firebase modal via Demo Sandbox pill
const fb=await clickText(/Demo Sandbox|Live Firebase/i); await sleep(1500);
await page.screenshot({path:'e2e/shots/claims_firebase_modal.png'});
await page.keyboard.press('Escape'); await sleep(400);
await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(e=>/close|✕|×/i.test(e.innerText||e.getAttribute('aria-label')||''));b&&b.click()}); await sleep(600);

// Founder view -> pitch a doctor -> launch deck
await clickText(/Coach Dashboard|Doctor View/i); await sleep(800);
await clickText(/Founder Command/i); await sleep(2500);
await clickText(/Pitch New Doctor|Pitch a Doctor/i); await sleep(1500);
const launch=await clickText(/Launch Hyper-Personalized Pitch Deck/i); await sleep(3000);
await page.screenshot({path:'e2e/shots/claims_pitch_deck_full.png'});
// scroll the presentation to the drop-off panel + footer
await page.evaluate(()=>{const els=[...document.querySelectorAll('*')].filter(e=>/drop-off pattern/i.test(e.textContent||'')&&e.children.length<6);if(els[0])els[0].scrollIntoView({block:'center'})}); await sleep(1000);
await page.screenshot({path:'e2e/shots/claims_pitch_deck_pattern.png'});
await page.evaluate(()=>{const els=[...document.querySelectorAll('*')].filter(e=>/Early Access Validation/i.test(e.textContent||'')&&e.children.length<8);if(els[0])els[0].scrollIntoView({block:'center'})}); await sleep(1000);
await page.screenshot({path:'e2e/shots/claims_pitch_deck_footer.png'});

console.log(JSON.stringify({fb,launch,errs},null,1));
await browser.close();
