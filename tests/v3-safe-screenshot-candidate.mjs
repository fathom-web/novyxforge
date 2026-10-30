/* NOVYX 3.0 — public safe-app screenshot candidate
 * Source: checked-in Spark Lab standalone app, never a private session.
 * The captured image is staged only in GitHub Actions artifacts.
 * It is NOT automatically approved or published as a verified screenshot.
 */
import {createServer} from "node:http";
import {readFile,mkdir,writeFile} from "node:fs/promises";
import {resolve,sep,extname} from "node:path";
import {fileURLToPath} from "node:url";
import {chromium} from "playwright";
const root=resolve(fileURLToPath(new URL("../",import.meta.url)));
const folder=resolve(root,"qa-safe-app-candidates");
await mkdir(folder,{recursive:true});
const mime={".html":"text/html; charset=utf-8",".css":"text/css; charset=utf-8",".js":"text/javascript; charset=utf-8",".json":"application/json",".png":"image/png",".svg":"image/svg+xml"};
const server=createServer(async(req,res)=>{
 try{const url=new URL(req.url,"http://127.0.0.1");
  const path=resolve(root,"."+url.pathname.replace(/\/$/,"/index.html"));
  if(path!==root&&!path.startsWith(root+sep))throw Error("Invalid path");
  const content=await readFile(path);res.writeHead(200,{"content-type":mime[extname(path)]||"application/octet-stream"});res.end(content);
 }catch(_){res.writeHead(404);res.end("Not Found");}
});
await new Promise(done=>server.listen(0,"127.0.0.1",done));
let browser=null;let report={project:"spark-lab",source:"./spark-lab.html",status:"candidate-awaiting-visual-review",sourceData:"fresh local app with empty input state",publishedAsVerified:false};
try{
 browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
 const context=await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1,reducedMotion:"reduce",storageState:{cookies:[],origins:[]}});
 const page=await context.newPage();
 await page.goto("http://127.0.0.1:"+server.address().port+"/spark-lab.html",{waitUntil:"domcontentloaded",timeout:15000});
 await page.locator("body").waitFor();
 const info=await page.evaluate(()=>{
  const fields=[...document.querySelectorAll('input:not([type="hidden"]),textarea')];
  return {title:document.title,passwordFields:document.querySelectorAll('input[type="password"]').length,
   userEmailFields:document.querySelectorAll('input[type="email"]').length,
   fieldsWithValues:fields.filter(x=>x.value&&x.value.trim()).length,
   documentText:document.body?.innerText?.slice(0,10000)||""};
 });
 if(info.passwordFields||info.userEmailFields||info.fieldsWithValues)throw Error("Potentially sensitive or prefilled form state; screenshot is blocked");
 if(/\b[\w.+-]+@[\w.-]+\.[a-z]{2,}\b/i.test(info.documentText))throw Error("Visible email address found; screenshot blocked");
 await page.screenshot({path:resolve(folder,"spark-lab-live-interface-candidate.png"),fullPage:true,animations:"disabled"});
 report={...report,result:"candidate captured",title:info.title,containsPrefilledFormData:false};
 await context.close();
 console.log("PASS Spark Lab real interface screenshot candidate captured with blank data");
}catch(error){report={...report,result:"blocked",reason:String(error.message||error)};console.error("BLOCKED",report.reason);process.exitCode=1;}
finally{
 if(browser)await browser.close();
 await new Promise(done=>server.close(done));
 await writeFile(resolve(folder,"REVIEW_REQUIRED.json"),JSON.stringify(report,null,2)+"\n");
}