/* NOVYX 3.0 / Observatory & Timeline contracts.
   Run: node tests/v3-observatory-check.mjs
   Zero external dependencies and no network calls.
 */
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import vm from "node:vm";
const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const activity=JSON.parse(read("activity.json")),projects=JSON.parse(read("projects.json"));
const code=read("forge-observatory.js"),home=read("index.html"),showcase=read("project.html");
assert.equal(activity.schemaVersion,1);
assert.equal(activity.updated,"2026-10-30");
assert.ok(activity.items.length>0);
assert.equal(new Set(activity.items.map(x=>x.id)).size,activity.items.length,"Unique evidence ids");
for(const a of activity.items){
 assert.equal(a.reviewed,true,"Only reviewed events");
 assert.equal(a.type,"development","Do not invent releases");
 assert.equal(a.status,"committed","Code does not prove deployment");
 assert.ok(!Number.isNaN(Date.parse(a.occurredAt)));
 assert.match(a.source.sha,/^[0-9a-f]{40}$/);
 assert.equal(a.source.url,"https://github.com/"+a.source.repository+"/commit/"+a.source.sha);
}
assert.ok(home.includes('id="observatory-feed"'));
assert.ok(home.includes('id="observatory-project"'));
assert.ok(showcase.includes('id="evolution-feed"'));
for(const page of [home,showcase]){
 assert.match(page,/forge-observatory\.css\?v=\d+/);
 assert.match(page,/forge-observatory\.js\?v=\d+/);
}
assert.match(code,/Reviewed|reviewed/);
assert.match(code,/GitHub commits must NEVER|commit alone is NEVER/);

class E {
 constructor(tag="",value=""){this.tag=tag;this.textContent=value;this.className="";this.children=[];this.listeners={};
  this.attributes={};this.style={setProperty:()=>{}};this.dataset={};this.value="";}
 append(...nodes){this.children.push(...nodes)}
 replaceChildren(...nodes){this.children=[...nodes]}
 addEventListener(k,fn){(this.listeners[k]??=[]).push(fn)}
 setAttribute(k,v){this.attributes[k]=String(v)}
 get options(){return this.children}
 click(){for(const fn of this.listeners.click||[])fn()}
 change(){for(const fn of this.listeners.change||[])fn()}
}
async function run(page,projectId){
 const ids=page==="home"?["observatory-feed","observatory-project","observatory-reviewed","obs-verified-count",
  "obs-project-count","obs-releases-count","observatory-visible-count"]:["evolution-feed","evolution-note"];
 const elements=Object.fromEntries(ids.map(id=>[id,new E("div")]));
 const filters=["all","development","release"].map(id=>{const x=new E("button");x.dataset.filter=id;return x});
 const document={
  readyState:"loading",getElementById:id=>elements[id],
  createElement:type=>new E(type),
  querySelectorAll:()=>filters,
  addEventListener:(_,handler)=>{document.ready=handler;}
 };
 const localFetch=async url=>({ok:true,json:async()=>url.includes("activity.json")?activity:projects});
 const context={document,location:{search:projectId?"?project="+projectId:""},
  fetch:localFetch,Intl,Date,URLSearchParams};
 vm.runInNewContext(code,context);
 await document.ready();
 return {elements,filters};
}
const main=await run("home");
assert.equal(main.elements["observatory-feed"].children.length,activity.items.length,"All entries visible");
assert.equal(main.elements["obs-releases-count"].textContent,"0","No fake releases");
main.filters[2].click();
assert.equal(main.elements["observatory-feed"].children.length,1,"Release empty state only");
assert.match(main.elements["observatory-feed"].children[0].textContent,/No verified releases/);
main.filters[0].click();
const filter=main.elements["observatory-project"];
filter.value="studyforge";filter.change();
assert.equal(main.elements["observatory-feed"].children.length,1,"StudyForge filtered evidence");
const football=await run("project","footballforge");
assert.ok(football.elements["evolution-feed"].children.length>=1);
const wow=await run("project","wow-lifeforge");
assert.match(wow.elements["evolution-feed"].children[0].textContent,/No reviewed/);
console.log("PASS: reviewed GitHub data, Observatory filters, release-zero state and project Evolution timelines.");
