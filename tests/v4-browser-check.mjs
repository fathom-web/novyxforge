import assert from 'node:assert/strict';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {once} from 'node:events';
import {chromium,firefox,webkit} from 'playwright';
import {startPreview} from '../scripts/preview.mjs';
const server=startPreview(0);await once(server,'listening');
const base='http://127.0.0.1:'+server.address().port;
await mkdir(new URL('../qa-v4/',import.meta.url),{recursive:true});
const catalog=JSON.parse(await readFile(new URL('../projects.json',import.meta.url),'utf8'));
let browser;const report=[],errors=[];
const check=async(name,fn)=>{try{await fn();report.push({name,result:'PASS'});console.log('PASS',name);}catch(e){report.push({name,result:'FAIL',error:String(e)});console.error('FAIL',name,String(e).slice(0,600));}};
const overflow=async page=>assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+2),'Horizontal overflow');
try{
  const engine={chromium,firefox,webkit}[process.env.NOVYX_ENGINE||'chromium'];
  browser=await engine.launch({headless:true,...(process.env.NOVYX_BROWSER_CHANNEL?{channel:process.env.NOVYX_BROWSER_CHANNEL}:{})});
  const ctx=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  // All testing stays local. External fonts and public API are blocked deterministically.
  await ctx.route('**/*',route=>route.request().url().startsWith(base)?route.continue():route.abort());
  const page=await ctx.newPage();page.on('pageerror',e=>errors.push(e.message));
  await check('Atlas: six choices, project-specific connections and keyboard access',async()=>{
    await page.goto(base);await page.locator('[data-atlas-world]').first().waitFor();
    assert.equal(await page.locator('[data-atlas-world]').count(),6);
    for(const p of catalog.projects.filter(x=>x.world.portal)){
      await page.locator('[data-atlas-world="'+p.id+'"]').click();
      await page.waitForFunction(name=>document.querySelector('#atlas-detail h3').textContent===name,p.name);
      assert.equal(await page.locator('[data-atlas-world][aria-pressed=true]').count(),1);
      assert.ok((await page.locator('#atlas-detail').innerText()).includes(p.name));
    }
    await page.locator('[data-atlas-world="studyforge"]').focus();await page.keyboard.press('Enter');
    assert.equal(await page.locator('#atlas-detail h3').innerText(),'StudyForge');
    await page.locator('#world-atlas').screenshot({path:'qa-v4/atlas-desktop.png'});
  });
  await check('Reactor connects to the atlas and returns focus',async()=>{
    await page.locator('#forge-reactor-trigger').click();await page.locator('#forge-reactor-dialog[open]').waitFor();
    await page.locator('#forge-reactor-dialog a[href="#world-atlas"]').click();
    assert.equal(await page.locator('#forge-reactor-dialog[open]').count(),0);assert.ok(page.url().endsWith('#world-atlas'));
  });
  await check('Feedback selects a real project and hands off without submitting',async()=>{
    await page.selectOption('#feedback-project','studyforge');
    const href=await page.locator('#forge-feedback-actions a').first().getAttribute('href');
    const url=new URL(href);assert.equal(url.hostname,'github.com');assert.ok(url.searchParams.get('body').includes('studyforge'));
    assert.ok((await page.locator('#forge-feedback-actions').innerText()).includes('No feedback is sent'));
  });
  await check('Engineering search opens and reveals the exact technical note',async()=>{
    await page.keyboard.press('Control+k');await page.locator('.forge-search-input').fill('SavedVariables');
    await page.locator('#forge-search-results a[href*="decision-"]').first().waitFor();
    await page.locator('#forge-search-results a[href*="decision-"]').first().click();
    await page.waitForURL('**/world-wow-lifeforge.html#decision-*');
    await page.locator('details[open]').first().waitFor();
    assert.equal(await page.locator('#name').innerText(),'WoW LifeForge');
  });
  for(const width of [1440,768,390,360])await check('Seven static worlds at '+width+'px: chapters, controls, navigator and no overflow',async()=>{
    await page.setViewportSize({width,height:900});
    for(const p of catalog.projects){
      await page.goto(base+'/world-'+p.id+'.html');await page.locator('.atmosphere-controls select').first().waitFor();
      assert.equal(await page.locator('#name').innerText(),p.name);
      assert.equal(await page.locator('#engineering details').count(),p.id==='spark-lab'?2:3);
      assert.equal(await page.locator('.world-nav-link[aria-current=page]').count(),1);
      assert.ok((await page.locator('.world-nav-link[aria-current=page]').innerText()).includes(p.name));
      assert.equal(await page.locator('select[aria-label="Fictional atmosphere mode"] option').count(),7);
      await page.selectOption('select[aria-label="Fictional atmosphere mode"]','snow');
      assert.equal(await page.locator('.weather-layer').getAttribute('data-type'),'snow');
      await page.selectOption('select[aria-label="Atmosphere intensity"]','0.4');
      assert.equal(await page.locator('.weather-layer').getAttribute('data-motion'),'static');
      await page.locator('#engineering details summary').first().click();
      await overflow(page);
    }
    await page.goto(base);await page.locator('#world-atlas').scrollIntoViewIfNeeded();await overflow(page);
    if(width===390)await page.locator('#world-atlas').screenshot({path:'qa-v4/atlas-mobile.png'});
  });
  await check('Legacy URLs and standalone tools retain world navigation',async()=>{
    for(const file of ['project.html?project=studyforge','safe-agile.html','spark-lab.html','public-ready.html']){
      await page.goto(base+'/'+file);assert.ok(await page.locator('.world-nav-link').count()>=6);await overflow(page);
    }
  });
  await check('Static worlds survive JavaScript disabled and unavailable JSON',async()=>{
    const plain=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const p=await plain.newPage();
    for(const world of catalog.projects){await p.goto(base+'/world-'+world.id+'.html');assert.equal(await p.locator('#name').innerText(),world.name);assert.ok((await p.locator('#engineering').innerText()).length>1000);await overflow(p);}
    await plain.close();
    await ctx.route('**/*.json',r=>r.abort());
    await page.goto(base+'/world-studyforge.html');assert.equal(await page.locator('#name').innerText(),'StudyForge');assert.ok((await page.locator('#engineering').innerText()).includes('learning'));
    await ctx.unroute('**/*.json');
  });
  await check('Pulse caches public metadata and retains a labeled fallback on rate limits',async()=>{
    let requests=0;
    await ctx.route('https://api.github.com/**',async route=>{
      requests++;const repo=route.request().url().split('/')[5];
      await route.fulfill({json:[{html_url:'https://github.com/fathom-web/'+repo+'/commit/'+'a'.repeat(40),commit:{message:'Synthetic test commit',committer:{date:'2026-10-30T10:00:00Z'}}}]});
    });
    await page.goto(base);await page.locator('#pulse').scrollIntoViewIfNeeded();await page.locator('.pulse-card').first().waitFor();
    assert.equal(requests,4);
    await page.reload();await page.locator('#pulse').scrollIntoViewIfNeeded();await page.locator('.pulse-card').first().waitFor();assert.equal(requests,4);
    assert.ok((await page.locator('#pulse-state').innerText()).includes('cached'));
    await page.evaluate(()=>{for(const key of Object.keys(sessionStorage))if(key.startsWith('novyx.pulse.v4.')){const value=JSON.parse(sessionStorage.getItem(key));value.at=Date.now()-3600000;sessionStorage.setItem(key,JSON.stringify(value));}});
    await ctx.unroute('https://api.github.com/**');await ctx.route('https://api.github.com/**',route=>route.fulfill({status:403,body:'rate limited'}));
    await page.reload();await page.locator('#pulse').scrollIntoViewIfNeeded();await page.locator('.pulse-card').first().waitFor();
    assert.ok((await page.locator('#pulse-state').innerText()).includes('cached'));
    await page.evaluate(()=>sessionStorage.clear());await ctx.unroute('https://api.github.com/**');
  });
  await check('No uncaught browser errors',async()=>assert.deepEqual(errors,[]));
  await page.setViewportSize({width:1440,height:1000});await page.goto(base);await page.screenshot({path:'qa-v4/home-viewport.png',animations:'disabled'});
  await page.goto(base+'/world-wow-lifeforge.html#engineering');await page.locator('#engineering').screenshot({path:'qa-v4/world-engineering.png'});
}finally{await browser?.close();server.close();await writeFile('qa-v4/report.json',JSON.stringify(report,null,2));}
if(report.some(x=>x.result==='FAIL'))process.exitCode=1;
console.log(report.filter(x=>x.result==='PASS').length+' V4 browser checks passed.');
