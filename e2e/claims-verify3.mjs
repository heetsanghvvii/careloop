import { chromium } from 'playwright';
const browser = await chromium.launch({executablePath:'/usr/bin/google-chrome-stable', headless:true, args:['--no-sandbox','--disable-dev-shm-usage']});
const page = await browser.newPage({viewport:{width:1280,height:800}});
const errs=[]; page.on('pageerror',e=>errs.push(e.message));
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const clickText=async(rx)=>page.evaluate((src)=>{const re=new RegExp(src,'i');const el=[...document.querySelectorAll('button,a,div[role=button],span')].find(e=>re.test(e.innerText||'')&&(e.innerText||'').length<120);if(el){el.click();return (el.innerText||'').trim().slice(0,60)}return null},rx.source);

await page.goto('http://localhost:4173/',{waitUntil:'networkidle'});
await clickText(/Launch Interactive Sandbox/i); await sleep(3000);
const r1=await clickText(/Coach Dashboard/i); await sleep(800);
const r2=await clickText(/Founder Command/i); await sleep(2500);
await page.screenshot({path:'e2e/shots/v3_founder.png'});
const r3=await clickText(/Present Deck Live/i); await sleep(3000);
await page.screenshot({path:'e2e/shots/v3_deck_top.png'});
// scroll to follow-through question panel
await page.evaluate(()=>{const els=[...document.querySelectorAll('div')].filter(e=>/^The Follow-Through Question$/i.test((e.textContent||'').trim()));if(els[0])els[0].scrollIntoView({block:'center'})}); await sleep(1000);
await page.screenshot({path:'e2e/shots/v3_deck_question.png'});
// footer with early access validation line
await page.evaluate(()=>{const els=[...document.querySelectorAll('span')].filter(e=>/real pilot costs not established/i.test(e.textContent||''));if(els[0])els[0].scrollIntoView({block:'center'})}); await sleep(1000);
await page.screenshot({path:'e2e/shots/v3_deck_footer.png'});
console.log(JSON.stringify({r1,r2,r3,errs},null,1));
await browser.close();
