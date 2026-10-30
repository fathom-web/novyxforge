/**
 * NOVYX FORGE 3.0 / Demo contracts and DOM simulation tests.
 * Run from repo root: node tests/v3-demos-check.mjs
 * Node built-ins only, no browser, network, credentials, or production fixtures.
 */
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import vm from "node:vm";

const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const code=read("forge-demos.js");
const page=read("project.html");
const showcase=read("project-showcase.js");
const css=read("forge-demo.css");
const catalog=JSON.parse(read("projects.json"));
const demoProjects=["footballforge","studyforge","wildrift-counter","safeforge"];
const demoIds=["football","study","wildrift","safe"];

assert.ok(!/\bfetch\s*\(/.test(code),"Demos must not call a production API");
assert.ok(!/\b(localStorage|sessionStorage|indexedDB|WebSocket|XMLHttpRequest)\b/.test(code),"Demos must not store or transmit data");
assert.equal(catalog.projects.filter(p=>p.showcase?.demo).length,4,"Exactly four live mini-demos");
for(let i=0;i<demoProjects.length;i++){
 const p=catalog.projects.find(p=>p.id===demoProjects[i]);
 assert.equal(p?.showcase?.demo?.id,demoIds[i],"Incorrect demo route");
}
assert.match(page,/id="try-demo"[^>]*\bhidden/,"Other projects must not have an empty demo section");
assert.match(page,/forge-demos\.js\?v=\d+/);
assert.match(page,/forge-demo\.css\?v=\d+/);
assert.match(showcase,/NovyxDemos\?\.mount/,"Showcase must integrate demos");
assert.match(showcase,/v\.verified===true/,"Screenshots must require verification");
assert.match(css,/@media\(max-width:900px\)/,"Demo grid must work on mobile");

class Element {
 constructor(tag="#text",text=""){this.tag=tag;this.children=[];this.className="";this.textContent=text;this.listeners={};this.attributes={};this.dataset={};this.checked=false;this.value="";this.disabled=false;}
 append(...xs){this.children.push(...xs)}
 replaceChildren(...xs){this.children=[...xs]}
 setAttribute(k,v){this.attributes[k]=v}
 addEventListener(k,fn){(this.listeners[k]??=[]).push(fn)}
 fire(k){for(const fn of this.listeners[k]||[])fn()}
}
const document={
 createElement:tag=>new Element(tag),
 createTextNode:text=>new Element("#text",text)
};
const window={};
vm.runInNewContext(code,{window,document,Intl,Date,Set,Object,Math,Number,String});
const api=window.NovyxDemos;
assert.deepEqual([...api.supported],demoIds);
const all=(root,predicate)=>[
 ...(predicate(root)?[root]:[]),
 ...root.children.flatMap(n=>all(n,predicate))
];

function run(id){
 const root=new Element("div");
 assert.equal(api.mount({showcase:{demo:{id}}},root),true,"Could not mount "+id);
 assert.ok(all(root,x=>x.tag==="button").length,"Demo missing interaction buttons: "+id);
 return root;
}
const f=run("football");
const first=all(f,x=>x.tag==="input"&&x.type==="checkbox")[0];
assert.ok(first,"FootballForge attendance checkbox missing");
first.checked=false;first.fire("change");
assert.ok(all(f,x=>x.className==="demo-total").some(x=>x.children.map(y=>y.textContent).join("").includes("15")),"Attendance change did not update squad");

const study=run("study");
const option=all(study,x=>String(x.className).startsWith("demo-choice"))[0];
assert.ok(option);option.fire("click");
assert.ok(all(study,x=>x.tag==="p"&&/Correct|Not quite/.test(x.textContent)).length,"StudyForge answer feedback missing");
const flashTab=all(study,x=>x.tag==="button"&&x.textContent==="Flashcards")[0];
assert.ok(flashTab);flashTab.fire("click");
assert.ok(all(study,x=>x.className==="demo-flashcard").length,"Flashcard interaction missing");

const wild=run("wildrift");
const lane=all(wild,x=>x.tag==="select")[0];
lane.value="adc";lane.fire("change");
assert.equal(all(wild,x=>x.tag==="select").length,3,"ADC + Support demo must support two opponents");

const safe=run("safe");
const role=all(safe,x=>x.tag==="select")[0];role.value="RTE";role.fire("change");
assert.equal(all(safe,x=>x.className==="demo-session").length,4,"SAFe role change should recompute sample events");

const unsupported=new Element("div");
assert.equal(api.mount({showcase:{demo:null}},unsupported),false,"No fake demos for other projects");

console.log("PASS: four isolated demos, interactions, 2v2 draft, verified screenshot gate, mobile layout.");
