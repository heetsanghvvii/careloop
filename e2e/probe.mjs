import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({executablePath:'/usr/bin/google-chrome-stable', headless:'new', args:['--no-sandbox','--disable-dev-shm-usage']});
const page = await browser.newPage();
await page.setViewport({width:1280,height:800});
await page.goto('http://localhost:4173/',{waitUntil:'networkidle0'});
await page.evaluate(()=>{const t=[...document.querySelectorAll('button,a')].find(e=>/Launch Interactive Sandbox/i.test(e.innerText||''));t&&t.click()});
await new Promise(r=>setTimeout(r,3000));
const clickTab=async(label)=>page.evaluate((l)=>{const b=[...document.querySelectorAll('button,a')].find(e=>(e.innerText||'').trim()===l);if(b){b.click();return true}return false},label);
await clickTab('Participants');
await new Promise(r=>setTimeout(r,2000));
const list = await page.evaluate(()=>{
  const txt=document.body.innerText;
  const btns=[...document.querySelectorAll('button')].map(b=>(b.innerText||'').trim()).filter(t=>t&&t.length<40);
  return {txt:txt.slice(0,800), btns:btns.slice(0,30)};
});
console.log(JSON.stringify(list,null,1));
await browser.close();
