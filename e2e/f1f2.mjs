import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({executablePath:'/usr/bin/google-chrome-stable', headless:'new', args:['--no-sandbox','--disable-dev-shm-usage']});
const page = await browser.newPage();
await page.setViewport({width:1280,height:800});
const errs=[]; page.on('pageerror',e=>errs.push(e.message));
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
const R={};
const clickText=(txt)=>page.evaluate((t)=>{const b=[...document.querySelectorAll('button,a')].find(e=>(e.innerText||'').trim()===t);if(b){b.click();return true}return false},txt);
const bodyHas=(re)=>page.evaluate((src)=>new RegExp(src,'i').test(document.body.innerText||''),re);
await page.goto('http://localhost:4173/',{waitUntil:'networkidle0'});
await page.evaluate(()=>{const t=[...document.querySelectorAll('button,a')].find(e=>/Launch Interactive Sandbox/i.test(e.innerText||''));t&&t.click()});
await sleep(3000);
await clickText('Participants'); await sleep(1500);
// F1: enroll
await clickText('Add Participant'); await sleep(1200);
await page.evaluate(()=>{
  const set=(ph,val)=>{const e=[...document.querySelectorAll('input')].find(i=>(i.placeholder||'').includes(ph));if(e){const s=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;s.call(e,val);e.dispatchEvent(new Event('input',{bubbles:true}));}};
  set('Alex Morgan','E2E Alpha Rao'); set('alex@example.com','e2e.alpha@example.test'); set('98765','+91 90000 11111');
  const sels=[...document.querySelectorAll('select')];const prog=sels.find(s=>[...s.options].some(o=>/21-Day Habit/.test(o.text)));if(prog){const o=[...prog.options].find(o=>/21-Day Habit/.test(o.text));prog.value=o.value;prog.dispatchEvent(new Event('change',{bubbles:true}))}
});
const enrolled=await clickText('Enroll Participant');
await sleep(2500);
const inTable=await bodyHas('E2E Alpha Rao');
const cap=await page.evaluate(()=>{const m=(document.body.innerText||'').match(/\d+\s*\/\s*25/);return m?m[0]:null});
await page.screenshot({path:'e2e/shots/f1_02_in_table.png'});
R.F1={enrolled,inTable,cap,pass:enrolled&&inTable};
// F2: open new client's detail from table
const rowClicked=await page.evaluate(()=>{
  const cell=[...document.querySelectorAll('td,div,span,a,button')].find(e=>(e.innerText||'').trim()==='E2E Alpha Rao');
  if(!cell)return false;
  const row=cell.closest('tr')||cell.parentElement;
  const btn=[...row.querySelectorAll('button,a')][0];
  (btn||cell).click();return true;
});
await sleep(2000);
const detail=await page.evaluate(()=>document.body.innerText.slice(0,700));
await page.screenshot({path:'e2e/shots/f2_01_client_detail.png'});
R.F2={rowClicked,detailHas:/E2E Alpha Rao|Program|Adherence|Check/i.test(detail),preview:detail.slice(0,220),pass:rowClicked};
R.errs=errs;
console.log(JSON.stringify(R,null,1));
await browser.close();
