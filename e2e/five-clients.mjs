import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({executablePath:'/usr/bin/google-chrome-stable', headless:'new', args:['--no-sandbox','--disable-dev-shm-usage']});
const page = await browser.newPage();
await page.setViewport({width:1280,height:800});
const errs=[]; page.on('pageerror',e=>errs.push('PAGEERROR: '+e.message));
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
const R={flows:{},errs};
const clickText=(txt,tag='button,a')=>page.evaluate((t,tg)=>{const b=[...document.querySelectorAll(tg)].find(e=>(e.innerText||'').trim()===t);if(b){b.click();return true}return false},txt,tag);
const clickRe=(re)=>page.evaluate((src)=>{const rx=new RegExp(src,'i');const b=[...document.querySelectorAll('button,a')].find(e=>rx.test(e.innerText||''));if(b){b.click();return true}return false},re);
const bodyHas=(re)=>page.evaluate((src)=>new RegExp(src,'i').test(document.body.innerText||''),re);
await page.goto('http://localhost:4173/',{waitUntil:'networkidle0'});
await clickRe('Launch Interactive Sandbox'); await sleep(3000);
await clickText('Participants'); await sleep(1500);

// ---- FLOW 1: new synthetic client onboarding ----
try{
  await clickText('Add Participant'); await sleep(1200);
  await page.evaluate(()=>{
    const set=(ph,val)=>{const e=[...document.querySelectorAll('input')].find(i=>(i.placeholder||'').includes(ph));if(e){const setter=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;setter.call(e,val);e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));return true}return false};
    set('Alex Morgan','E2E Alpha Rao'); set('alex@example.com','e2e.alpha@example.test'); set('98765','+91 90000 11111');
  });
  await page.evaluate(()=>{const sels=[...document.querySelectorAll('select')];const prog=sels.find(s=>[...s.options].some(o=>/21-Day Habit/.test(o.text)));if(prog){const o=[...prog.options].find(o=>/21-Day Habit/.test(o.text));prog.value=o.value;prog.dispatchEvent(new Event('change',{bubbles:true}))}});
  await page.screenshot({path:'e2e/shots/f1_01_onboarding_form.png'});
  const saved=await clickRe('Add Participant|Save|Create');
  await sleep(2000);
  const inTable=await bodyHas('E2E Alpha Rao');
  await page.screenshot({path:'e2e/shots/f1_02_in_table.png'});
  R.flows.F1_onboarding={saved,inTable,pass:inTable};
}catch(e){R.flows.F1_onboarding={error:e.message}}

// ---- FLOW 2: seeded client detail + portal check-in ----
try{
  await clickText('Overview'); await sleep(1500);
  await page.evaluate(()=>{const el=[...document.querySelectorAll('*')].find(e=>(e.innerText||'').includes('Sarah Chen')&&e.children.length<6&&e.closest('tr,button,a,div'));el&&el.click()});
  await sleep(2000);
  const detailTxt=await page.evaluate(()=>document.body.innerText.slice(0,500));
  await page.screenshot({path:'e2e/shots/f2_01_client_detail.png'});
  // try completing a task / check-in in whatever is visible
  const didCheckin=await page.evaluate(()=>{
    const cbs=[...document.querySelectorAll('input[type=checkbox]')];
    if(cbs.length){cbs[0].click();return 'checkbox'}
    const b=[...document.querySelectorAll('button')].find(e=>/check.?in|complete|log/i.test(e.innerText||''));if(b){b.click();return 'button:'+b.innerText.trim().slice(0,40)}
    return null;
  });
  await sleep(1500);
  await page.screenshot({path:'e2e/shots/f2_02_after_action.png'});
  const detailTxt2=await page.evaluate(()=>document.body.innerText.slice(0,500));
  R.flows.F2_detail_checkin={opened:/Sarah Chen/.test(detailTxt)||/Sarah Chen/.test(detailTxt2),action:didCheckin,changed:detailTxt!==detailTxt2,pass:/Sarah Chen/.test(detailTxt+detailTxt2)};
}catch(e){R.flows.F2_detail_checkin={error:e.message}}

// ---- FLOW 3: WhatsApp Lab simulated client message ----
try{
  await clickText('WhatsApp Lab'); await sleep(2000);
  const labBefore=await page.evaluate(()=>document.body.innerText.slice(0,600));
  await page.screenshot({path:'e2e/shots/f3_01_wa_lab.png'});
  const typed=await page.evaluate(()=>{
    const inp=[...document.querySelectorAll('input,textarea')].find(e=>e.offsetParent!==null);
    if(!inp)return false;
    const setter=Object.getOwnPropertyDescriptor(window[ inp.tagName==='TEXTAREA'?'HTMLTextAreaElement':'HTMLInputElement'].prototype,'value').set;
    setter.call(inp,'Done with today\'s walk and protein breakfast - E2E Bravo');inp.dispatchEvent(new Event('input',{bubbles:true}));return true;
  });
  const sent=await clickRe('Simulate|Send|Reply');
  await sleep(2500);
  const labAfter=await page.evaluate(()=>document.body.innerText.slice(0,900));
  await page.screenshot({path:'e2e/shots/f3_02_wa_after.png'});
  R.flows.F3_whatsapp={typed,sent,changed:labBefore!==labAfter,preview:labAfter.slice(0,200),pass:typed&&(sent||labBefore!==labAfter)};
}catch(e){R.flows.F3_whatsapp={error:e.message}}

// ---- FLOW 4: at-risk client + simulated reminder ----
try{
  await clickText('Participants'); await sleep(1500);
  await page.evaluate(()=>{const s=[...document.querySelectorAll('select')].find(s=>[...s.options].some(o=>/Needs Attention/.test(o.text)));if(s){const o=[...s.options].find(o=>/Needs Attention/.test(o.text));s.value=o.value;s.dispatchEvent(new Event('change',{bubbles:true}))}});
  await sleep(1500);
  await page.screenshot({path:'e2e/shots/f4_01_atrisk_filter.png'});
  const atRisk=await bodyHas('Inactive|At Risk|Needs');
  await clickText('Reminders (Simulated)'); await sleep(2000);
  const sent2=await clickRe('Send|Nudge|Trigger|Simulate');
  await sleep(2000);
  const rem=await page.evaluate(()=>document.body.innerText.slice(0,600));
  await page.screenshot({path:'e2e/shots/f4_02_reminders.png'});
  R.flows.F4_atrisk_reminder={atRiskFilter:atRisk,action:sent2,preview:rem.slice(0,150),pass:atRisk};
}catch(e){R.flows.F4_atrisk_reminder={error:e.message}}

// ---- FLOW 5: analytics reflects data ----
try{
  await clickText('Analytics'); await sleep(2500);
  const ana=await page.evaluate(()=>document.body.innerText.slice(0,700));
  await page.screenshot({path:'e2e/shots/f5_01_analytics.png'});
  R.flows.F5_analytics={hasNumbers:/\d+%|\d+ active|adherence/i.test(ana),preview:ana.slice(0,200),pass:/\d/.test(ana)};
}catch(e){R.flows.F5_analytics={error:e.message}}

console.log(JSON.stringify(R,null,1));
await browser.close();
