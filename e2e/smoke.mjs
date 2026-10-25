import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({executablePath:'/usr/bin/google-chrome-stable', headless:'new', args:['--no-sandbox','--disable-dev-shm-usage']});
const page = await browser.newPage();
await page.setViewport({width:1280,height:800});
const errs=[]; page.on('pageerror',e=>errs.push('PAGEERROR: '+e.message)); page.on('console',m=>{if(m.type()==='error')errs.push('CONSOLE: '+m.text())});
await page.goto('http://localhost:4173/',{waitUntil:'networkidle0',timeout:30000});
await new Promise(r=>setTimeout(r,1500));
const landingText = await page.evaluate(()=>document.body.innerText.length);
await page.screenshot({path:'e2e/shots/smoke_01_landing.png'});
// click Launch Interactive Sandbox Demo
const clicked = await page.evaluate(()=>{const els=[...document.querySelectorAll('button,a')];const t=els.find(e=>/Launch Interactive Sandbox/i.test(e.innerText||''));if(t){t.click();return true}return false});
await new Promise(r=>setTimeout(r,3500));
const state = await page.evaluate(()=>({url:location.href, textlen:document.body.innerText.length, rootlen:document.getElementById('root')?.innerHTML.length??-1, preview:(document.body.innerText||'').slice(0,300)}));
await page.screenshot({path:'e2e/shots/smoke_02_afterlaunch.png'});
console.log(JSON.stringify({landingText, clicked, state, errs},null,1));
await browser.close();
