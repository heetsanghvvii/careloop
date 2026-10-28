import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({executablePath:'/usr/bin/google-chrome-stable', headless:'new', args:['--no-sandbox','--disable-dev-shm-usage']});
const page = await browser.newPage();
await page.setViewport({width:1280,height:800});
const errs=[]; page.on('pageerror',e=>errs.push(e.message));
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
const R={};
const clickExact=(txt)=>page.evaluate((t)=>{const b=[...document.querySelectorAll('button,a')].find(e=>(e.innerText||'').trim()===t);if(b){b.click();return true}return false},txt);
await page.goto('http://localhost:4173/',{waitUntil:'networkidle0'});
await page.evaluate(()=>{const t=[...document.querySelectorAll('button,a')].find(e=>/Launch Interactive Sandbox/i.test(e.innerText||''));t&&t.click()});
await sleep(3000);
// F3 redo: WhatsApp Lab chat
await clickExact('WhatsApp Lab'); await sleep(2500);
const before=await page.evaluate(()=>document.body.innerText);
const typedOk=await page.evaluate(()=>{
  const inp=[...document.querySelectorAll('input,textarea')].find(e=>(e.placeholder||'').includes("Type 'Done'"));
  if(!inp)return false;
  const s=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;
  s.call(inp,'Done'); inp.dispatchEvent(new Event('input',{bubbles:true})); return true;
});
// find the send control: button with svg near input, or try Enter
const sendInfo=await page.evaluate(()=>{
  const btns=[...document.querySelectorAll('button')].filter(b=>b.offsetParent!==null).map(b=>({t:(b.innerText||'').trim().slice(0,30),aria:b.getAttribute('aria-label')||''}));
  return btns;
});
await page.keyboard.press('Enter'); await sleep(3000);
let after=await page.evaluate(()=>document.body.innerText);
let enterWorked=before!==after;
if(!enterWorked){
  // try clicking last visible button in the chat form area
  await page.evaluate(()=>{const inp=[...document.querySelectorAll('input')].find(e=>(e.placeholder||'').includes("Type 'Done'"));const form=inp&&inp.closest('form,div');const b=form&&[...form.querySelectorAll('button')].pop();b&&b.click()});
  await sleep(2500);
  after=await page.evaluate(()=>document.body.innerText);
}
await page.screenshot({path:'e2e/shots/f3_02_wa_after.png'});
R.F3={typedOk,enterWorked,changed:after!==before,sendButtons:sendInfo.slice(-6),pass:typedOk&&after!==before};
// F4 redo: queue a simulated reminder and simulate a reply
await clickExact('Reminders (Simulated)'); await sleep(2500);
const q0=await page.evaluate(()=>{const m=(document.body.innerText||'').match(/Simulated Message Queue \((\d+)\)/);return m?+m[1]:null});
await clickExact('Queue Simulated Reminder'); await sleep(2500);
const q1=await page.evaluate(()=>{const m=(document.body.innerText||'').match(/Simulated Message Queue \((\d+)\)/);return m?+m[1]:null});
await page.screenshot({path:'e2e/shots/f4_02_reminders.png'});
// simulate a participant "Done" reply on the first queued card
const replyClicked=await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(e=>(e.innerText||'').trim().startsWith('"Done"'));if(b){b.click();return true}return false});
await sleep(2500);
const afterReply=await page.evaluate(()=>document.body.innerText);
await page.screenshot({path:'e2e/shots/f4_03_reply_done.png'});
R.F4={q0,q1,queued:q1!==null&&q0!==null&&q1>q0,replyClicked,replyEffect:/Completed|logged|streak|DONE|recorded/i.test(afterReply),pass:q1>q0&&replyClicked};
R.errs=errs;
console.log(JSON.stringify(R,null,1));
await browser.close();
