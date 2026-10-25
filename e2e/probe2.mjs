import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({executablePath:'/usr/bin/google-chrome-stable', headless:'new', args:['--no-sandbox','--disable-dev-shm-usage']});
const page = await browser.newPage();
await page.setViewport({width:1280,height:800});
await page.goto('http://localhost:4173/',{waitUntil:'networkidle0'});
await page.evaluate(()=>{const t=[...document.querySelectorAll('button,a')].find(e=>/Launch Interactive Sandbox/i.test(e.innerText||''));t&&t.click()});
await new Promise(r=>setTimeout(r,3000));
const clickBtn=(label)=>page.evaluate((l)=>{const b=[...document.querySelectorAll('button,a')].find(e=>(e.innerText||'').trim().toLowerCase()===l.toLowerCase());if(b){b.click();return true}return false},label);
await clickBtn('Participants'); await new Promise(r=>setTimeout(r,1500));
// 1. Add Participant modal
await clickBtn('Add Participant'); await new Promise(r=>setTimeout(r,1500));
const form = await page.evaluate(()=>{
  const inputs=[...document.querySelectorAll('input,select,textarea')].map(e=>({tag:e.tagName,type:e.type,name:e.name,ph:e.placeholder,opts:e.tagName==='SELECT'?[...e.options].map(o=>o.text).slice(0,12):undefined}));
  const btns=[...document.querySelectorAll('button')].map(b=>(b.innerText||'').trim()).filter(t=>t&&t.length<30).slice(-8);
  return {inputs,btns};
});
console.log('FORM',JSON.stringify(form,null,1));
await page.keyboard.press('Escape'); await new Promise(r=>setTimeout(r,500));
await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(e=>/cancel|close/i.test(e.innerText||''));b&&b.click()});
await new Promise(r=>setTimeout(r,500));
// 2. first participant row
await page.evaluate(()=>{const r=[...document.querySelectorAll('tr,div')].find(e=>/Sarah Chen/.test(e.innerText||'')&&e.innerText.length<300);r&&r.click()});
await new Promise(r=>setTimeout(r,2000));
const detail = await page.evaluate(()=>document.body.innerText.slice(0,900));
console.log('DETAIL',detail);
await page.screenshot({path:'e2e/shots/probe_detail.png'});
await browser.close();
