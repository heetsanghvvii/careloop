import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({executablePath:'/usr/bin/google-chrome-stable', headless:'new', args:['--no-sandbox','--disable-dev-shm-usage']});
const page = await browser.newPage();
await page.setViewport({width:1280,height:800});
const errs=[]; page.on('pageerror',e=>errs.push(e.message));
await page.goto('http://localhost:4173/',{waitUntil:'networkidle0'});
await page.evaluate(()=>{const t=[...document.querySelectorAll('button,a')].find(e=>/Launch Interactive Sandbox/i.test(e.innerText||''));t&&t.click()});
await new Promise(r=>setTimeout(r,3000));
const tabs=['Overview','Participants','Programs & Templates','WhatsApp Lab','Analytics','Reminders (Simulated)','Plans & Add-ons'];
const out={};
for(const t of tabs){
  const ok=await page.evaluate((label)=>{const b=[...document.querySelectorAll('button,a,div[role=button]')].find(e=>(e.innerText||'').trim()===label);if(b){b.click();return true}return false},t);
  await new Promise(r=>setTimeout(r,2000));
  const info=await page.evaluate(()=>({text:(document.body.innerText||'').slice(0,400)}));
  out[t]={clicked:ok, preview:info.text.replace(/\n+/g,' | ').slice(0,300)};
  await page.screenshot({path:`e2e/shots/explore_${t.replace(/[^A-Za-z]+/g,'_')}.png`});
}
console.log(JSON.stringify(out,null,1));
console.log('ERRS',errs);
await browser.close();
