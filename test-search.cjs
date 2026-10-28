const { chromium } = require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:"msedge"});
 for(const file of ['en.html','index.html']){
  const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const url='file:///'+path.resolve(file).replaceAll('\\','/');await page.goto(url);
  assert.equal(await page.locator('#globalSearch').count(),1);
  for(const [kind,collection] of [['card','cards'],['event','events'],['place','places'],['chapter','narrative']]){
   const title=await page.evaluate(({collection})=>{const x=D[collection][0];return x.fa||x.title},{collection});
   await page.locator('#globalSearch').fill(title);
   const result=page.locator(`[data-search-kind="${kind}"]`).first();await result.waitFor();
   const href=await result.getAttribute('href');await result.click();
   if(kind==='card'||kind==='event')assert.equal(await page.locator('#drawer').isVisible(),true);
   if(kind==='place')assert.equal(await page.locator('#placeResult').isVisible(),true);
   if(kind==='chapter')assert.equal(await page.locator('#story').isVisible(),true);
   await page.goto(url+href);
   if(kind==='place')assert.equal(await page.locator('#placeResult').isVisible(),true);
   if(kind==='chapter')assert.equal(await page.locator('#story').isVisible(),true);
   if(await page.locator('#drawer').isVisible())await page.locator('#closeDrawer').click();
   await page.locator('#globalSearch').scrollIntoViewIfNeeded();
  }
  await page.locator('#globalSearch').fill('<img src=x onerror=alert(1)>');assert.equal(await page.locator('#globalResults article').count(),0);
  await page.locator('#globalClear').click();assert.equal(await page.locator('#globalSearch').inputValue(),'');
  await page.locator('#globalSearch').fill('۱۸۳۹');const persian=await page.locator('#globalResults article').count();
  await page.locator('#globalSearch').fill('1839');assert.equal(await page.locator('#globalResults article').count(),persian);assert(persian>0);
  await page.locator('#globalSearch').fill('Kabul');assert(await page.locator('#globalResults article').count()>0);
  await page.setViewportSize({width:390,height:844});await page.locator('#globalClear').click();
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  await page.screenshot({path:file==='en.html'?'search-en-mobile.png':'search-fa-mobile.png',fullPage:false});
  assert.deepEqual(errors,[]);console.log(file+': cards, events, map locations, chapters, reload links, clear, digits, empty, hostile input, mobile width and runtime checks passed');await page.close();
 }
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});

