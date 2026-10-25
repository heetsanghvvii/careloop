import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({executablePath:'/usr/bin/google-chrome-stable', headless:'new', args:['--no-sandbox','--disable-dev-shm-usage']});
const page = await browser.newPage();
await page.setViewport({width:1280,height:800});
const errs=[]; page.on('pageerror',e=>errs.push(e.message));
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
const R={};
const clickText=(txt)=>page.evaluate((t)=>{const b=[...document.querySelectorAll('button,a')].find(e=>(e.innerText||'').trim()===t);if(b){b.click();return true}return false},txt);
const clickRe=(re)=>page.evaluate((src)=>{const rx=new RegExp(src,'i');const b=[...document.querySelectorAll('button,a')].find(e=>rx.test(e.innerText||''));if(b){b.click();return true}return false},re);
await page.goto('http://localhost:4173/',{waitUntil:'networkidle0'});
await page.evaluate(()=>{const t=[...document.querySelectorAll('button,a')].find(e=>/Launch Interactive Sandbox/i.test(e.innerText||''));t&&t.click()});
await sleep(3000);
// F3 WhatsApp Lab
await clickText('WhatsApp Lab'); await sleep(2500);
const lab0=await page.evaluate(()=>document.body.innerText);
await page.screenshot({path:'e2e/shots/f3_01_wa_lab.png'});
const labInfo=await page.evaluate(()=>{
  const inputs=[...document.querySelectorAll('input,textarea')].filter(e=>e.offsetParent!==null).map(e=>({tag:e.tagName,ph:e.placeholder||'',type:e.type}));
  const btns=[...document.querySelectorAll('button')].map(b=>(b.innerText||'').trim()).filter(t=>t&&t.length<50).slice(10,26);
  return {inputs,btns,hasModal:/Enroll New Participant/.test(document.body.innerText)};
});
console.log('LAB',JSON.stringify(labInfo));
const typed=await page.evaluate(()=>{
  const inp=[...document.querySelectorAll('input,textarea')].filter(e=>e.offsetParent!==null).pop();
  if(!inp)return false;
  const setter=Object.getOwnPropertyDescriptor(window[inp.tagName==='TEXTAREA'?'HTMLTextAreaElement':'HTMLInputElement'].prototype,'value').set;
  setter.call(inp,"Done with today's walk and protein breakfast");inp.dispatchEvent(new Event('input',{bubbles:true}));return inp.placeholder||inp.tagName;
});
await clickRe('Simulate|Send|Reply|Run'); await sleep(3000);
const lab1=await page.evaluate(()=>document.body.innerText);
await page.screenshot({path:'e2e/shots/f3_02_wa_after.png'});
R.F3={noModal:!labInfo.hasModal,typed:!!typed,changed:lab0!==lab1,pass:!labInfo.hasModal&&!!typed&&lab0!==lab1};
// F4 at-risk + reminders
await clickText('Participants'); await sleep(1500);
await page.evaluate(()=>{const s=[...document.querySelectorAll('select')].find(s=>[...s.options].some(o=>/Needs Attention/.test(o.text)));if(s){const o=[...s.options].find(o=>/Needs Attention/.test(o.text));s.value=o.value;s.dispatchEvent(new Event('change',{bubbles:true}))}});
await sleep(1500);
const riskTxt=await page.evaluate(()=>document.body.innerText);
await page.screenshot({path:'e2e/shots/f4_01_atrisk_filter.png'});
const atRiskRows=(riskTxt.match(/At Risk/g)||[]).length;
await clickText('Reminders (Simulated)'); await sleep(2500);
const rem0=await page.evaluate(()=>document.body.innerText);
const sent=await clickRe('Send|Nudge|Trigger|Simulate');
await sleep(2500);
const rem1=await page.evaluate(()=>document.body.innerText);
await page.screenshot({path:'e2e/shots/f4_02_reminders.png'});
R.F4={atRiskRows,action:sent,changed:rem0!==rem1,pass:atRiskRows>0};
// F5 analytics
await clickText('Analytics'); await sleep(2500);
const ana=await page.evaluate(()=>document.body.innerText);
await page.screenshot({path:'e2e/shots/f5_01_analytics.png'});
R.F5={hasData:/\d+%/.test(ana),pass:/\d+%/.test(ana)};
R.errs=errs;
console.log(JSON.stringify(R,null,1));
await browser.close();
