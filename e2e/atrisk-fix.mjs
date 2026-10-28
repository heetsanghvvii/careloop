import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({executablePath:'/usr/bin/google-chrome-stable', headless:'new', args:['--no-sandbox','--disable-dev-shm-usage']});
const page = await browser.newPage();
await page.setViewport({width:1280,height:800});
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
await page.goto('http://localhost:4173/',{waitUntil:'networkidle0'});
await page.evaluate(()=>{const t=[...document.querySelectorAll('button,a')].find(e=>/Launch Interactive Sandbox/i.test(e.innerText||''));t&&t.click()});
await sleep(3000);
await page.evaluate(()=>{const b=[...document.querySelectorAll('button,a')].find(e=>(e.innerText||'').trim()==='Participants');b&&b.click()}); await sleep(1500);
await page.evaluate(()=>{const b=[...document.querySelectorAll('button,a')].find(e=>(e.innerText||'').trim()==='Add Participant');b&&b.click()}); await sleep(1000);
await page.evaluate(()=>{
  const set=(ph,val)=>{const e=[...document.querySelectorAll('input')].find(i=>(i.placeholder||'').includes(ph));if(e){const s=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;s.call(e,val);e.dispatchEvent(new Event('input',{bubbles:true}));}};
  set('Alex Morgan','E2E Alpha Rao'); set('alex@example.com','e2e.alpha@example.test');
  const prog=[...document.querySelectorAll('select')].find(s=>[...s.options].some(o=>/21-Day Habit/.test(o.text)));if(prog){const o=[...prog.options].find(o=>/21-Day Habit/.test(o.text));prog.value=o.value;prog.dispatchEvent(new Event('change',{bubbles:true}))}
});
await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(e=>(e.innerText||'').trim()==='Enroll Participant');b&&b.click()}); await sleep(2500);
const res=await page.evaluate(()=>{
  const rows=[...document.querySelectorAll('tr')].map(r=>r.innerText);
  const alpha=rows.find(r=>/E2E Alpha Rao/.test(r))||'';
  const elena=rows.find(r=>/Elena Rostova/.test(r))||'';
  const david=rows.find(r=>/David Miller/.test(r))||'';
  return {alphaAtRisk:/At Risk/.test(alpha), elenaAtRisk:/At Risk/.test(elena), davidAtRisk:/At Risk/.test(david)};
});
await page.screenshot({path:'e2e/shots/fix_atrisk_table.png'});
console.log(JSON.stringify(res));
await browser.close();
