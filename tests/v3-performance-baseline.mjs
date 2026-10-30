/* NOVYX FORGE 3.0 / synthetic mobile performance baseline.
 * Chromium 390px, simulated 4x CPU and network delay; lab metrics only.
 * Reports LCP, CLS, DCL, resource count and bytes without claiming CrUX data.
 */
import {createServer} from "node:http";
import {mkdir,readFile,writeFile} from "node:fs/promises";
import {resolve,extname,sep} from "node:path";
import {fileURLToPath} from "node:url";
import {chromium} from "playwright";

const root=resolve(fileURLToPath(new URL("../",import.meta.url)));
const folder=resolve(root,"qa-performance");
await mkdir(folder,{recursive:true});
const contentTypes={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".json":"application/json",".png":"image/png",".svg":"image/svg+xml"};
const server=createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,"http://127.0.0.1");
  const path=resolve(root,"."+url.pathname.replace(/\/$/,"/index.html"));
  if(path!==root&&!path.startsWith(root+sep))throw Error("Invalid");
  const body=await readFile(path);res.writeHead(200,{"content-type":contentTypes[extname(path)]||"application/octet-stream","cache-control":"no-store"});res.end(body);
 }catch(_){res.writeHead(404);res.end("Not found");}
});
await new Promise(ok=>server.listen(0,"127.0.0.1",ok));
const host="http://127.0.0.1:"+server.address().port;
const pages=["/","/project.html?project=footballforge","/project.html?project=spark-lab","/project.html?project=wildrift-counter"];
let browser=null;const samples=[];
try{
 browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
 const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true});
 const page=await context.newPage();
 const client=await context.newCDPSession(page);
 await client.send("Network.enable");
 await client.send("Network.emulateNetworkConditions",{offline:false,latency:150,
  downloadThroughput:1600*1024/8,uploadThroughput:750*1024/8});
 await client.send("Emulation.setCPUThrottlingRate",{rate:4});
 await page.addInitScript(()=>{
  window.__novyxPerf={lcp:0,cls:0,longTasks:0};
  try{new PerformanceObserver(list=>{
   for(const e of list.getEntries())window.__novyxPerf.lcp=e.startTime;
  }).observe({type:"largest-contentful-paint",buffered:true});}catch(_){}
  try{new PerformanceObserver(list=>{
   for(const e of list.getEntries())if(!e.hadRecentInput)window.__novyxPerf.cls+=e.value;
  }).observe({type:"layout-shift",buffered:true});}catch(_){}
  try{new PerformanceObserver(list=>{
   for(const e of list.getEntries())if(e.duration>50)window.__novyxPerf.longTasks++;
  }).observe({type:"longtask",buffered:true});}catch(_){}
 });
 for(const url of pages){
  const begin=Date.now();
  await page.goto(host+url,{waitUntil:"domcontentloaded",timeout:20000});
  await page.waitForTimeout(1300);
  const metrics=await page.evaluate(()=>{
   const nav=performance.getEntriesByType("navigation")[0];
   const resources=performance.getEntriesByType("resource");
   return {lcpMs:Math.round(window.__novyxPerf?.lcp||0),
    cls:Math.round((window.__novyxPerf?.cls||0)*1000)/1000,
    longTasks:window.__novyxPerf?.longTasks||0,
    dclMs:Math.round(nav?.domContentLoadedEventEnd||0),
    resources:resources.length,
    transferKb:Math.round(resources.reduce((a,e)=>a+(e.transferSize||0),0)/1024),
    totalDurationMs:Math.round(performance.now())};
  });
  samples.push({url,lab:"390px, simulated ~1.6Mbps, 150ms RTT, 4x CPU",...metrics});
  console.log("MOBILE LAB",JSON.stringify(samples.at(-1)));
 }
 await context.close();
}catch(e){console.error("Performance baseline failed",e);process.exitCode=1;}
finally{
 if(browser)await browser.close();
 await new Promise(ok=>server.close(ok));
 await writeFile(resolve(folder,"mobile-lab-baseline.json"),JSON.stringify({
  measuredAt:new Date().toISOString(),method:"Synthetic Playwright Chrome lab. NOT real-user Core Web Vitals.",
  samples
 },null,2)+"\n");
}