/**
 * NOVYX 3.0 — production read-only verification.
 * Checks the actual public MijnHost site, NOT the checked-out repo.
 * No authenticated access, no writes, no feedback submissions.
 * Usage: npm install --no-save playwright@1.56.1
 *        npx playwright install chromium
 *        node tests/v3-production-check.mjs
 */
import {strict as assert} from "node:assert";
import {mkdir} from "node:fs/promises";
import {resolve} from "node:path";
import {chromium} from "playwright";

const base=(process.env.NOVYX_BASE_URL||"https://novyxforge.com").replace(/\/+$/,"");
const checks=[], failures=[];
const captures=resolve("qa-production-screenshots");
await mkdir(captures,{recursive:true});
async function record(label,fn){
  try {await fn();checks.push(label);console.log("PASS",label);}
  catch(error){failures.push({label,error:String(error?.stack||error).slice(0,1300)});console.error("FAIL",label,String(error?.message||error).slice(0,1100));}
}
const urls=["/","/project.html?project=footballforge","/project.html?project=studyforge",
 "/project.html?project=safeforge","/project.html?project=wildrift-counter"];
const timeout=12000;
const textFetch=async(path)=>{
 const u=base+path;const r=await fetch(u,{redirect:"follow",signal:AbortSignal.timeout(timeout),headers:{"Cache-Control":"no-cache","Accept":"text/html, text/css, application/javascript, */*"}});
 assert.equal(r.status,200,"HTTP "+r.status+" at "+u);
 const s=await r.text();assert.ok(s.length>150,"Unusually short response "+u);
 return {body:s,url:r.url};
};
await record("Production DNS/TLS, homepage response and 3.0 sections",async()=>{
 const {body,url}=await textFetch("/");
 assert.ok(url.startsWith(base+"/"),"Unexpected redirect "+url);
 for(const marker of ['id="forge-reactor-trigger"','id="observatory-feed"','id="forge-feedback"','data-forge-search'])
  assert.ok(body.includes(marker),"Missing deployed marker "+marker);
 assert.equal((body.match(/<a class="sphere-link /g)||[]).length,6,"Unexpected sphere count");
});
await record("Production homepage loads current release-candidate asset revisions",async()=>{
 const {body}=await textFetch("/");
 for(const asset of ["forge-search.js?v=3","forge-universe-v3.css?v=3","forge-world-navigation.js?v=4"]){
  assert.ok(body.includes(asset),"Production HTML does not reference "+asset);
  const {body:src}=await textFetch("/"+asset);
  assert.ok(src.length>600,"Production asset unexpectedly short: "+asset);
 }
});
await record("Production showcase includes weather, demo, feedback and CSS fixes",async()=>{
 const {body}=await textFetch("/project.html?project=footballforge");
 for(const marker of ['id="world-nav-links"','id="try-demo"','id="evolution-feed"',
  'id="project-feedback-actions"','forge-weather.css?v=2','project-showcase.css?v=4'])
  assert.ok(body.includes(marker),"Missing deployed project marker "+marker);
});
let browser=null;
try{
 browser=await chromium.launch({headless:true,args:["--no-sandbox","--disable-dev-shm-usage"]});
 const context=await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1,reducedMotion:"reduce"});
 const page=await context.newPage();
 const pageErrors=[];page.on("pageerror",error=>pageErrors.push(error.message));
 await record("Production desktop homepage, six spheres and zero overflow",async()=>{
  await page.goto(base+"/",{waitUntil:"domcontentloaded",timeout:20000});
  assert.equal(await page.locator("a.sphere-link").count(),6);
  const v=await page.evaluate(()=>[document.documentElement.scrollWidth,document.documentElement.clientWidth]);
  assert.ok(v[0]-v[1]<=3,"Viewport overflow "+v);
  await page.screenshot({path:resolve(captures,"live-home-1440.png"),fullPage:true,animations:"disabled"});
 });
 await record("Production desktop Reactor, Command Search and Observatory",async()=>{
  await page.locator("#forge-reactor-trigger").click();
  await page.locator("#forge-reactor-dialog[open]").waitFor();
  await page.locator("#reactor-choose").click();
  assert.equal(await page.locator("#reactor-worlds a").count(),6);
  await page.keyboard.press("Escape");
  await page.keyboard.press("Control+k");
  await page.locator(".forge-search-dialog[open]").waitFor();
  await page.locator(".forge-search-input").fill("Wild Rift");
  assert.match(await page.locator("#forge-search-results a").first().innerText(),/Wild Rift/i);
  await page.keyboard.press("Escape");
  assert.equal(await page.locator(".forge-search-dialog[open]").count(),0);
  await page.locator("#observatory-feed .obs-entry").first().waitFor();
 });
 await record("Production showcased project and non-destructive demo interaction",async()=>{
  await page.goto(base+"/project.html?project=footballforge",{waitUntil:"domcontentloaded"});
  await page.locator("#name").getByText("FootballForge",{exact:true}).waitFor({timeout:10000});
  await page.locator("#world-nav-links a").first().waitFor();
  assert.equal(await page.locator("#world-nav-links a").count(),7);
  assert.equal(await page.locator(".weather-layer").count(),1);
  assert.equal(await page.locator("#demo-board .demo-toggle input").count(),16);
  await page.locator("#demo-board .demo-toggle input").first().uncheck();
  await page.locator("#demo-board .demo-total").filter({hasText:"15"}).first().waitFor();
  await page.screenshot({path:resolve(captures,"live-footballforge-1440.png"),fullPage:true,animations:"disabled"});
 });
 await record("Production has no uncaught desktop page exceptions",async()=>{
  assert.deepEqual(pageErrors,[]);
 });
 await context.close();
 for(const width of [390,360]){
  const mobile=await browser.newContext({viewport:{width,height:844},deviceScaleFactor:1,reducedMotion:"reduce",isMobile:true,hasTouch:true});
  const mp=await mobile.newPage();
  await record("Production mobile homepage "+width+"px",async()=>{
   await mp.goto(base+"/",{waitUntil:"domcontentloaded",timeout:20000});
   assert.equal(await mp.locator("a.sphere-link").count(),6);
   const v=await mp.evaluate(()=>[document.documentElement.scrollWidth,document.documentElement.clientWidth]);
   assert.ok(v[0]-v[1]<=3,"Mobile homepage overflow "+v);
   await mp.screenshot({path:resolve(captures,"live-home-"+width+".png"),fullPage:true,animations:"disabled"});
  });
  await record("Production mobile FootballForge "+width+"px",async()=>{
   await mp.goto(base+"/project.html?project=footballforge",{waitUntil:"domcontentloaded",timeout:20000});
   await mp.locator("#name").getByText("FootballForge",{exact:true}).waitFor({timeout:10000});
   await mp.locator("#demo-board .demo-toggle input").first().waitFor();
   const v=await mp.evaluate(()=>[document.documentElement.scrollWidth,document.documentElement.clientWidth]);
   assert.ok(v[0]-v[1]<=3,"Mobile project overflow "+v);
   await mp.screenshot({path:resolve(captures,"live-footballforge-"+width+".png"),fullPage:true,animations:"disabled"});
  });
  await mobile.close();
 }
} catch(error){failures.push({label:"Launch production Chromium verification",error:String(error).slice(0,1200)});}
finally {if(browser)await browser.close();}
console.log("PRODUCTION RESULT:",checks.length,"passed,",failures.length,"failed");
for(const failed of failures)console.error("ERROR",JSON.stringify(failed));
if(failures.length)process.exitCode=1;
