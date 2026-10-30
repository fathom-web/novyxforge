/* NOVYX 3.0 / Release candidate browser QA.
 * Run: npm install --no-save playwright@1.56.1
 *      npx playwright install chromium
 *      node tests/v3-browser-smoke.mjs
 * This serves the checked-out repository locally and never touches production accounts.
 * Safe screenshots are captured only from NOVYX's public sample-data demo pages.
 */
import assert from "node:assert/strict";
import {createServer} from "node:http";
import {readFile, mkdir} from "node:fs/promises";
import {existsSync} from "node:fs";
import {resolve, extname, sep} from "node:path";
import {fileURLToPath} from "node:url";
import {chromium} from "playwright";

const root=resolve(fileURLToPath(new URL("../",import.meta.url)));
const captures=resolve(root,"qa-screenshots");
await mkdir(captures,{recursive:true});
const types={".html":"text/html; charset=utf-8",".js":"application/javascript; charset=utf-8",".json":"application/json; charset=utf-8",".css":"text/css; charset=utf-8",".svg":"image/svg+xml",".png":"image/png",".webp":"image/webp",".jpg":"image/jpeg",".ico":"image/x-icon"};
const server=createServer(async(req,res)=>{
 try{
  const pathname=decodeURIComponent(new URL(req.url||"/","http://127.0.0.1").pathname);
  const target=resolve(root,"."+pathname+(pathname.endsWith("/")?"index.html":""));
  if(target!==root&&!target.startsWith(root+sep))throw Error("Traversal rejected");
  const body=await readFile(target);
  res.writeHead(200,{"content-type":types[extname(target)]||"application/octet-stream","cache-control":"no-store"});
  res.end(body);
 }catch(_){res.writeHead(404,{"content-type":"text/plain"});res.end("Not found");}
});
await new Promise(ok=>server.listen(0,"127.0.0.1",ok));
const base="http://127.0.0.1:"+server.address().port;
let browser;
const failures=[],checks=[];
async function check(name,task){
 try{await task();checks.push({name,status:"PASS"});console.log("PASS",name);}
 catch(error){const message=String(error?.message||error).slice(0,900);failures.push({name,error:message});console.error("FAIL",name,message);}
}
const waitProject=async(page,name)=>{
 await page.locator("#name").getByText(name,{exact:true}).waitFor({timeout:12000});
};
const screenshot=async(page,name)=>page.screenshot({path:resolve(captures,name+".png"),fullPage:true,animations:"disabled",timeout:10000});
const noOverflow=async page=>{
 const v=await page.evaluate(()=>{
   const scroll=document.documentElement.scrollWidth,client=document.documentElement.clientWidth;
   const suspects=[...document.querySelectorAll("body *")].map(el=>{
      const r=el.getBoundingClientRect();
      return {tag:el.tagName,cl:String(el.className?.baseVal||el.className||"").slice(0,90),
        id:el.id||"",left:Math.round(r.left),right:Math.round(r.right),width:Math.round(r.width)};
   }).filter(r=>(r.right>client+3||r.left< -3)&&r.width>0).sort((a,b)=>b.right-a.right).slice(0,13);
   const nearEdge=[...document.querySelectorAll("body *")].map(el=>{
 const r=el.getBoundingClientRect();
 return {tag:el.tagName,cl:String(el.className?.baseVal||el.className||"").slice(0,60),
   id:el.id||"",left:Math.round(r.left),right:Math.round(r.right),width:Math.round(r.width),
   overflowX:getComputedStyle(el).overflowX};
}).filter(r=>r.right>client+3&&r.right<client+50).slice(0,35);
const named=["body","main",".world-nav",".world-nav-inner",".world-nav-scroll",".world-nav-links",".hero",".weather-layer","#demo-board",".demo-section","#try-demo"].map(selector=>{
 const el=document.querySelector(selector),rect=el?.getBoundingClientRect();
 return el?{selector,left:Math.round(rect.left),right:Math.round(rect.right),width:Math.round(rect.width),scrollWidth:el.scrollWidth,clientWidth:el.clientWidth,overflowX:getComputedStyle(el).overflowX}:null;
}).filter(Boolean);
return {scroll,client,nearEdge,named,suspects};
 });
 assert.ok(v.scroll-v.client<=3,"Horizontal document overflow "+JSON.stringify(v));
};
const allIds=["footballforge","studyforge","fascination-files","safeforge","wow-lifeforge","wildrift-counter","spark-lab"];
const labels=["FootballForge","StudyForge","The Fascination Files","SAFe Agile Forge","WoW LifeForge","Wild Rift Counter","Spark Lab"];
const supportedDemo=new Set(["footballforge","studyforge","safeforge","wildrift-counter"]);
try{
 browser=await chromium.launch({headless:true,args:["--disable-dev-shm-usage","--no-sandbox"]});
 const ctx=await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1,reducedMotion:"reduce"});
 const page=await ctx.newPage();
 const errors=[];
 page.on("pageerror",err=>errors.push(String(err.message).slice(0,300)));
 await check("Desktop homepage: six active world portals",async()=>{
  await page.goto(base+"/",{waitUntil:"domcontentloaded"});
  await page.locator(".sphere-link").first().waitFor();
  assert.equal(await page.locator('.sphere-link[href*="project.html?project="]').count(),6);
  assert.equal(await page.locator('.project.project-wildrift').count(),1);
  // 3.1.1: side labels, orbital spheres and individual portals must not intersect.
  const layout=await page.evaluate(()=>{
    const stage=document.querySelector(".hero .universe").getBoundingClientRect();
    const rect=el=>{const b=el.getBoundingClientRect();return {left:b.left,right:b.right,top:b.top,bottom:b.bottom};};
    const links=[...document.querySelectorAll(".hero .universe .sphere-link")].map(el=>({name:el.className,box:rect(el),orb:rect(el.querySelector(".orb")),title:rect(el.querySelector(".sphere-caption")),display:getComputedStyle(el).display}));
    const overlap=(a,b)=>Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left))*Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top));
    const collisions=[];
    for(let i=0;i<links.length;i++){
      const a=links[i];
      if(a.display!=="grid")collisions.push("non-grid portal: "+a.name);
      if(a.box.left<stage.left-3||a.box.right>stage.right+3)collisions.push("out-of-bounds portal: "+a.name);
      if(overlap(a.orb,a.title)>5)collisions.push("title overlaps sphere: "+a.name);
      for(let j=i+1;j<links.length;j++)if(overlap(a.box,links[j].box)>15)collisions.push("portals overlap: "+a.name+" / "+links[j].name);
    }
    return {collisions,links};
  });
  assert.deepEqual(layout.collisions,[],"3.1.1 portal geometry: "+JSON.stringify(layout));
  // 3.1.2: verify the formerly flat lower homepage uses its new deep-scroll architecture.
  const continuity=await page.evaluate(()=>{
    const main=document.querySelector("main");
    const rail=document.querySelector(".manifesto .principles");
    const first=document.querySelector(".projects .cards>.project:first-child");
    const last=document.querySelector(".projects .cards>.project:last-child");
    const outro=document.querySelector("#final-portal");
    const width=(el)=>el.getBoundingClientRect().width;
    return {
      backdrop:getComputedStyle(main,"::before").backgroundImage,
      railLayout:getComputedStyle(rail).display,
      railColumns:getComputedStyle(rail).gridTemplateColumns.split(" ").length,
      firstWidth:width(first),lastWidth:width(last),
      gridWidth:width(document.querySelector(".projects .cards")),
      systems:document.querySelectorAll(".v312-module").length,
      outroVisible:Boolean(outro&&getComputedStyle(outro).display!=="none"),
      outroLinks:outro?.querySelectorAll('a[href^="#"]').length||0
    };
  });
  assert.match(continuity.backdrop,/gradient/i,"missing continuous canvas");
  assert.equal(continuity.railLayout,"grid");
  assert.equal(continuity.railColumns,4,"desktop process rail must show four connected steps");
  assert.ok(continuity.firstWidth>continuity.gridWidth*.92,"first project needs cinematic full-width bay");
  assert.ok(continuity.lastWidth>continuity.gridWidth*.92,"final project needs a second wide bay");
  assert.equal(continuity.systems,8);
  assert.equal(continuity.outroVisible,true);
  assert.equal(continuity.outroLinks,2);
  await screenshot(page,"home-desktop-1440");
  await noOverflow(page);
 });
 await check("Forge Reactor: accessible modal and six world links",async()=>{
  await page.locator("#forge-reactor-trigger").click();
  await page.locator("#forge-reactor-dialog[open]").waitFor();
  await page.locator("#reactor-choose").click();
  assert.equal(await page.locator("#reactor-worlds a").count(),6);
  await page.keyboard.press("Escape");
  assert.equal(await page.locator("#forge-reactor-dialog[open]").count(),0);
 });
 await check("Global search: Ctrl+K and Wild Rift ranking",async()=>{
  await page.keyboard.press("Control+k");
  await page.locator(".forge-search-dialog[open]").waitFor();
  const input=page.locator(".forge-search-input");
  await input.fill("Wild Rift");
  await page.locator("#forge-search-results a").first().waitFor();
  const result=await page.locator("#forge-search-results a").first().innerText();
  assert.match(result,/Wild Rift Counter/);
  await page.keyboard.press("Escape");
  assert.equal(await page.locator(".forge-search-dialog[open]").count(),0);
 });
 await check("Observatory: reviewed source evidence and release zero state",async()=>{
  await page.locator("#observatory-feed .obs-entry").first().waitFor({timeout:12000});
  assert.equal(await page.locator("#observatory-feed .obs-entry").count(),10);
  await page.locator('.obs-filter[data-filter="release"]').click();
  await page.getByText("No verified releases have been published").waitFor();
  await page.locator('.obs-filter[data-filter="all"]').click();
 });
 await check("All seven showcase pages: identity, weather, navigator, evidence",async()=>{
  for(let i=0;i<allIds.length;i++){
   const id=allIds[i],name=labels[i];
   await page.goto(base+"/project.html?project="+id,{waitUntil:"domcontentloaded"});
   await waitProject(page,name);
   assert.equal(await page.locator(".weather-layer").count(),1,"Weather missing "+id);
   assert.equal(await page.locator("#world-nav-links a").count(),7,"World navigation missing "+id);
   assert.equal(await page.locator(".gallery-item").count(),3,"Gallery missing "+id);
   assert.equal(await page.locator("#evolution-feed > *").count()>0,true,"Timeline missing "+id);
   assert.equal(await page.locator("#project-feedback-actions .feedback-action").count(),2,"Feedback missing "+id);
   const demoVisible=await page.locator("#try-demo").isVisible();
   assert.equal(demoVisible,supportedDemo.has(id),"Demo visibility "+id);
   if(["footballforge","studyforge","wildrift-counter","safeforge"].includes(id))await screenshot(page,"showcase-"+id+"-desktop");
   await noOverflow(page);
  }
 });
 await check("Weather toggle: Off and On changes decorative layer",async()=>{
  await page.goto(base+"/project.html?project=footballforge",{waitUntil:"domcontentloaded"});
  await waitProject(page,"FootballForge");
  const toggle=page.locator(".atmosphere-toggle");
  await toggle.click();assert.equal(await page.locator(".weather-layer").getAttribute("data-enabled"),"false");
  await toggle.click();assert.equal(await page.locator(".weather-layer").getAttribute("data-enabled"),"true");
 });
 await check("Football demo: fictional attendance updates",async()=>{
  const boxes=page.locator("#demo-board .demo-toggle input");
  assert.equal(await boxes.count(),16);
  await boxes.first().uncheck();
  await page.locator("#demo-board .demo-total").filter({hasText:"15"}).first().waitFor();
 });
 await check("StudyForge: sample quiz feedback and flashcard reveal",async()=>{
  await page.goto(base+"/project.html?project=studyforge",{waitUntil:"domcontentloaded"});await waitProject(page,"StudyForge");
  await page.locator("#demo-board .demo-choice").first().click();
  await page.locator("#demo-board p.demo-info[role='status']").first().waitFor();
  await page.getByRole("button",{name:"Flashcards"}).click();
  await page.locator("#demo-board .demo-flashcard").click();
 });
 await check("Wild Rift: ADC lane reveals both opposing champion selectors",async()=>{
  await page.goto(base+"/project.html?project=wildrift-counter",{waitUntil:"domcontentloaded"});await waitProject(page,"Wild Rift Counter");
  await page.locator("#demo-board .demo-controls select").first().selectOption("adc");
  assert.equal(await page.locator("#demo-board .demo-controls select").count(),3);
 });
 await check("SAFe: role change shows four fictional planning events",async()=>{
  await page.goto(base+"/project.html?project=safeforge",{waitUntil:"domcontentloaded"});await waitProject(page,"SAFe Agile Forge");
  await page.locator("#demo-board .demo-controls select").first().selectOption("RTE");
  assert.equal(await page.locator("#demo-board .demo-session").count(),4);
 });
 await check("Feedback link: public GitHub issue prefilled with project name",async()=>{
  const href=await page.locator("#project-feedback-actions .feedback-action").first().getAttribute("href");
  assert.match(href,/^https:\/\/github\.com\/fathom-web\/novyxforge\/issues\/new\?/);
  const url=new URL(href);
  assert.ok(url.searchParams.get("body")?.includes("SAFe Agile Forge"));
 });
 await check("Reduced motion: moving weather is disabled",async()=>{
  assert.equal(await page.locator(".weather-layer").getAttribute("data-motion"),"static");
 });
 assert.equal(errors.length,0,"Browser runtime errors: "+errors.join(" | "));
 await ctx.close();
 for(const width of [390,360]){
  const mobile=await browser.newContext({viewport:{width,height:844},deviceScaleFactor:1,reducedMotion:"reduce",isMobile:true,hasTouch:true});
  const mp=await mobile.newPage();
  await check("Mobile homepage "+width+"px: six worlds, search and no overflow",async()=>{
   await mp.goto(base+"/",{waitUntil:"domcontentloaded"});
   await mp.locator(".sphere-link.sixth").waitFor();
   assert.equal(await mp.locator(".sphere-link").count(),6);
   await noOverflow(mp);
   await mp.locator(".header-search-mobile").click();
   await mp.locator(".forge-search-dialog[open]").waitFor();
   await mp.keyboard.press("Escape");
   await screenshot(mp,"home-mobile-"+width);
  });
  await check("Mobile project "+width+"px: navigator, demo, weather, no overflow",async()=>{
   await mp.goto(base+"/project.html?project=footballforge",{waitUntil:"domcontentloaded"});
   await waitProject(mp,"FootballForge");
   await mp.locator("#world-nav-links a").first().waitFor();
   await mp.locator("#demo-board .demo-toggle input").first().waitFor();
   await screenshot(mp,"footballforge-mobile-"+width);
   await noOverflow(mp);
  });
  await mobile.close();
 }
}finally{
 if(browser)await browser.close();
 await new Promise(ok=>server.close(ok));
}
console.log("Completed checks:",checks.length,"passed and",failures.length,"failed");
if(failures.length){
 console.error("Release gate failed. Review screenshot artifacts and errors:");
 for(const failed of failures)console.error(JSON.stringify(failed));
 process.exitCode=1;
}else console.log("Browser QA complete. Production MijnHost remains a separate release gate.");
