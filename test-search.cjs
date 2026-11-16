const { chromium } = require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:"msedge"});
 for(const file of ['en.html','index.html']){
  const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const url=process.env.TEST_BASE_URL
   ? new URL(file,process.env.TEST_BASE_URL).href
   : 'file:///'+path.resolve(file).replaceAll('\\','/');
  await page.goto(url);
  assert.equal(await page.locator('#globalSearch').count(),1);
  await page.evaluate(()=>showCard(7));
  const imageLink=page.locator('#profile a[href="assets/cards/card_7.jpg"]');
  assert.equal(await imageLink.count(),1);
  await page.waitForFunction(()=>document.querySelector('#profile img').naturalWidth>0);
  assert.equal(await page.locator('#profile img').getAttribute('src'),'assets/cards/card_7.jpg');
  const relationshipIssues=await page.evaluate(()=>{
   const issues=[];
   for(const card of D.cards.filter(c=>c.related?.length||D.edges.some(e=>e.source===c.id||e.target===c.id))){
    showCard(card.id,false);
    const profile=document.getElementById('profile');
    const links=[...profile.querySelectorAll('.relation button[data-card],.chip[data-card]')];
    const ids=links.map(link=>Number(link.dataset.card));
    const edges=D.edges.filter(e=>e.source===card.id||e.target===card.id);
    const expected=new Set([...(card.related||[]),...edges.map(e=>e.source===card.id?e.target:e.source)]);
    if(ids.length!==expected.size||new Set(ids).size!==expected.size||ids.some(id=>!expected.has(id))){
     issues.push(`Missing or repeated related card on profile ${card.id}`);
    }
    for(const edge of edges){
     const otherId=edge.source===card.id?edge.target:edge.source;
     const relation=profile.querySelector(`.relation button[data-card="${otherId}"]`)?.closest('.relation');
     const matchingSource=[...relation?.querySelectorAll('.relation-details')||[]].some(group=>
      group.textContent.includes(edge.type)&&group.textContent.includes(edge.label)&&
      group.querySelector('a')?.getAttribute('href')===edge.url);
     if(!matchingSource)issues.push(`Missing relationship detail or source: ${card.id} / ${otherId}`);
    }
   }
   return issues;
  });
  assert.deepEqual(relationshipIssues,[]);
  await page.locator('#closeDrawer').click();
  await page.evaluate(()=>showView('method',false));
  assert(await page.locator('#bibliography a[href="assets/cards/card_7.jpg"]').count()>0);
  await page.evaluate(()=>showView('story',false));
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
