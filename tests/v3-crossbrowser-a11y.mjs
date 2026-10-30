/* NOVYX 3.0 / cross-engine visual & accessibility RC audit
   Tests checked-out static files, no accounts and no production writes.
   Capture screenshots from NOVYX showcases containing only illustrative
   artwork and explicitly fictional sample demo data.
   npm install --no-save playwright@1.56.1 @axe-core/playwright@4.10.2
   npx playwright install --with-deps chromium firefox webkit
   node tests/v3-crossbrowser-a11y.mjs
 */
import {createServer} from "node:http";
import {mkdir,readFile,writeFile} from "node:fs/promises";
import {resolve,sep,extname} from "node:path";
import {fileURLToPath} from "node:url";
import assert from "node:assert/strict";
import {chromium,firefox,webkit} from "playwright";
import AxeBuilder from "@axe-core/playwright";

const root=resolve(fileURLToPath(new URL("../",import.meta.url)));
const captureDir=resolve(root,"qa-world-visuals");
await mkdir(captureDir,{recursive:true});
const contentTypes={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".json":"application/json",".svg":"image/svg+xml",".png":"image/png",".webp":"image/webp",".jpg":"image/jpeg"};
const server=createServer(async(req,res)=>{
 try{
  const pathname=decodeURIComponent(new URL(req.url,"http://127.0.0.1").pathname);
  const target=resolve(root,"."+pathname+(pathname.endsWith("/")?"index.html":""));
  if(target!==root&&!target.startsWith(root+sep))throw Error("Not inside source checkout");
  const body=await readFile(target);
  res.writeHead(200,{"content-type":contentTypes[extname(target)]||"application/octet-stream","cache-control":"no-store"});
  res.end(body);
 }catch(err){res.writeHead(404);res.end("Not found");}
});
await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
const base="http://127.0.0.1:"+server.address().port;
const worlds=["footballforge","studyforge","fascination-files","safeforge","wow-lifeforge","wildrift-counter","spark-lab"];
const weathers=["rain","snow","meteors","fog","storm","wind","sunrise"];
const browsers={chromium,firefox,webkit};
const outcomes=[],violations=[],perfSamples=[];
async function run(name,fn){
 try{await fn();outcomes.push({name,ok:true});console.log("PASS",name);}
 catch(error){outcomes.push({name,ok:false,error:String(error?.message||error).slice(0,1400)});console.error("FAIL",name,String(error?.message||error).slice(0,800));}
}
const overflow=async page=>{
 const dims=await page.evaluate(()=>({page:document.documentElement.scrollWidth,viewport:document.documentElement.clientWidth}));
 assert.ok(dims.page-dims.viewport<=3,"Horizontal overflow "+JSON.stringify(dims));
};
const ready=async(page,id)=>{
 await page.goto(base+"/project.html?project="+id,{waitUntil:"domcontentloaded",timeout:18000});
 await page.locator("body[data-world='"+id+"']").waitFor({timeout:12000});
 await page.locator("#gallery .gallery-item").first().waitFor({timeout:10000});
};
let browserError=null;
try {
 for(const [engine,product] of Object.entries(browsers)){
   let browser=null;
   try {
    browser=await product.launch({headless:true,args:engine==="chromium"?["--no-sandbox","--disable-dev-shm-usage"]:[]});
    const desktop=await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1,reducedMotion:"reduce"});
    const page=await desktop.newPage();
    const faults=[];page.on("pageerror",e=>faults.push(e.message));
    await run(engine+" / homepage portals + reactor + search",async()=>{
      await page.goto(base+"/",{waitUntil:"domcontentloaded"});
      assert.equal(await page.locator("a.sphere-link").count(),6);
      await page.locator("#forge-reactor-trigger").click();
      await page.locator("#forge-reactor-dialog[open]").waitFor();
      await page.keyboard.press("Escape");
      assert.equal(await page.locator("#forge-reactor-dialog[open]").count(),0);
      await page.keyboard.press(engine==="webkit"?"Meta+k":"Control+k");
      await page.locator(".forge-search-dialog[open]").waitFor();
      await page.locator(".forge-search-input").fill("spark");
      await page.locator("#forge-search-results a").first().waitFor();
      await page.keyboard.press("Escape");
      assert.equal(await page.locator(".forge-search-dialog[open]").count(),0);
      await overflow(page);
    });
    for(let i=0;i<worlds.length;i++){
      const id=worlds[i],weather=weathers[i];
      await run(engine+" / polished "+id+" showcase",async()=>{
        await ready(page,id);
        assert.equal(await page.locator("#compass-world").innerText(),id==="spark-lab"?"LAB / 07":String(i+1).padStart(2,"0")+" / 06");
        assert.ok((await page.locator("#compass-stage").innerText()).length>0);
        assert.ok((await page.locator("#compass-experience").innerText()).length>0);
        assert.ok((await page.locator("#compass-weather").innerText()).length>0);
        assert.equal(await page.locator("#gallery .gallery-item").count(),3);
        assert.equal(await page.locator("#gallery .gallery-item:first-child figcaption").getAttribute("data-view-number"),"01");
        assert.equal(await page.locator(".weather-layer").getAttribute("data-type"),weather);
        assert.equal(await page.locator("#world-nav-links a").count(),7);
        assert.equal(await page.locator(".gallery-kind").filter({hasText:"ILLUSTRATIVE PREVIEW"}).count(),3);
        assert.equal(await page.locator('a[data-chapter-demo]').isVisible(),["footballforge","studyforge","wildrift-counter","safeforge"].includes(id));
        await overflow(page);
        if(engine==="chromium"){
          await page.screenshot({path:resolve(captureDir,"world-"+id+"-desktop.png"),fullPage:true,animations:"disabled"});
        }
      });
    }
    await run(engine+" / project keyboard and accessible native screenshot dialog",async()=>{
      // Inject only an isolated test fixture into the local checkout request.
      // No live users, children, credentials or app pages are captured.
      await page.route("**/projects.json",async route=>{
        const catalog=JSON.parse(await readFile(resolve(root,"projects.json"),"utf8"));
        const football=catalog.projects.find(p=>p.id==="footballforge");
        football.showcase.screenshots=[{title:"SANDBOX FIXTURE",description:"1-pixel fictional audit fixture",alt:"Blank test fixture, not a real screenshot",
          verified:true,src:"./assets/screenshots/footballforge/fixture.png"}];
        await route.fulfill({status:200,contentType:"application/json",body:JSON.stringify(catalog)});
      });
      const tiny=Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4//8/AwAI/AL+XKPSAAAAAElFTkSuQmCC","base64");
      await page.route("**/assets/screenshots/footballforge/fixture.png",async route=>{
        await route.fulfill({status:200,contentType:"image/png",body:tiny});
      });
      await ready(page,"footballforge");
      const trigger=page.locator(".gallery-photo-button").first();
      await trigger.focus();
      await trigger.press("Enter");
      await page.locator("#lightbox[open]").waitFor();
      await page.keyboard.press("Escape");
      assert.equal(await page.locator("#lightbox[open]").count(),0);
      assert.equal(await trigger.evaluate(n=>document.activeElement===n),true,"Focus should return to clicked screenshot");
      await page.unroute("**/projects.json");
      await page.unroute("**/assets/screenshots/footballforge/fixture.png");
    });
    await run(engine+" / keyboard and accessibility scan",async()=>{
      await ready(page,"studyforge");
      const result=await new AxeBuilder({page})
        .withTags(["wcag2a","wcag2aa","wcag21a","wcag21aa","wcag22aa"])
        .analyze();
      const impactful=result.violations.filter(v=>v.impact==="serious"||v.impact==="critical");
      for(const v of result.violations)violations.push({engine,id:"studyforge",rule:v.id,impact:v.impact,help:v.help,
        nodes:v.nodes.map(n=>n.target).slice(0,5)});
      assert.equal(impactful.length,0,"Serious/critical accessibility findings: "+JSON.stringify(impactful.map(x=>({id:x.id,impact:x.impact,targets:x.nodes.map(n=>n.target).slice(0,3)}))));
    });
    assert.equal(faults.length,0,engine+" uncaught JS errors: "+faults.join(" | "));
    await desktop.close();
    const small=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,reducedMotion:"reduce",isMobile:true,hasTouch:true});
    const mobile=await small.newPage();
    for(const id of worlds){
      await run(engine+" / 390px mobile "+id,async()=>{
        await ready(mobile,id);
        await overflow(mobile);
        assert.equal(await mobile.locator("#gallery .gallery-item").count(),3);
        assert.equal(await mobile.locator("#compass-weather").isVisible(),true);
        if(engine==="webkit")await mobile.screenshot({path:resolve(captureDir,"world-"+id+"-mobile.png"),fullPage:true,animations:"disabled"});
      });
    }
    await small.close();
   }catch(error){browserError=String(error);console.error("ENGINE ERROR",engine,browserError);}
   finally{if(browser)await browser.close();}
 }
}finally{await new Promise(resolve=>server.close(resolve));}
const report={at:new Date().toISOString(),total:outcomes.length,passed:outcomes.filter(x=>x.ok).length,
 failures:outcomes.filter(x=>!x.ok),accessibilityFindings:violations,browserError};
await writeFile(resolve(captureDir,"rc-crossbrowser-report.json"),JSON.stringify(report,null,2)+"\n");
console.log("FINAL RESULT",report.passed,"/",report.total,"checks passed.",violations.length,"a11y findings");
if(report.failures.length||browserError)process.exitCode=1;
