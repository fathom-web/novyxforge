/* NOVYX FORGE 3.0 / Command Search
 * Search the public local NOVYX project catalog, ideas, reviewed milestones,
 * and navigation pages. No paid API, cookies, account, analytics or search logs.
 * All search results are plain text and validated hrefs (never injected HTML).
 */
(() => {
 "use strict";
 const $=selector=>document.querySelector(selector);
 const norm=value=>String(value||"").normalize("NFKD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim();
 const publicHref=href=>typeof href==="string"&&
   (/^\.\/(?:index\.html|project\.html)(?:\?[a-z0-9=&%-]+)?(?:#[a-z0-9-]+)?$/i.test(href)||
    /^https:\/\/github\.com\/fathom-web\/[a-z0-9._/-]+$/i.test(href));
 const el=(tag,cls,content)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(content!==undefined)n.textContent=String(content);return n;};
 const base=[
  {id:"path-home",title:"Explore the NOVYX Universe",description:"Six project portals and the central Forge Reactor",kind:"Navigate",href:"./index.html#home",symbol:"✦",keywords:"home spheres reactor explore portals"},
  {id:"path-projects",title:"All Project Worlds",description:"Browse NOVYX projects and their showcases",kind:"Navigate",href:"./index.html#projects",symbol:"◎",keywords:"catalog featured projects portfolio"},
  {id:"path-pipeline",title:"Forge Pipeline",description:"Explore the idea-to-release project lifecycle",kind:"Navigate",href:"./index.html#pipeline",symbol:"↗",keywords:"mission control process stages public ready"},
  {id:"path-observatory",title:"The Observatory",description:"Curated, source-linked development history",kind:"Navigate",href:"./index.html#observatory",symbol:"◉",keywords:"releases verified activity development timeline milestones"},
  {id:"path-pulse",title:"Forge Pulse",description:"Latest raw public GitHub development signals",kind:"Navigate",href:"./index.html#pulse",symbol:"⌁",keywords:"github commits activity"},
  {id:"path-vault",title:"Idea Vault",description:"Explore early concept-stage Forge ideas",kind:"Navigate",href:"./index.html#vault",symbol:"◇",keywords:"concepts prototypes ideas backlog"},
  {id:"path-feedback",title:"Forge Feedback",description:"Suggest an improvement or report an issue",kind:"Navigate",href:"./index.html#forge-feedback",symbol:"✎",keywords:"bug report idea suggest improvement github issue"},
  {id:"path-spark",title:"Spark Lab",description:"Explore the guided idea workshop",kind:"Navigate",href:"./project.html?project=spark-lab",symbol:"✧",keywords:"create prompt workshop innovation"},
  {id:"doc-roadmap",title:"NOVYX FORGE 3.0 Roadmap",description:"Approved scope, milestones and next work packages",kind:"Documentation",href:"https://github.com/fathom-web/novyxforge/blob/main/ROADMAP_3_0.md",symbol:"▤",keywords:"roadmap documentation next build"},
  {id:"doc-readme",title:"NOVYX Source Documentation",description:"Public repository README and deployment notes",kind:"Documentation",href:"https://github.com/fathom-web/novyxforge/blob/main/README.md",symbol:"▤",keywords:"docs github readme deployment"}
 ];
 const allowProject=id=>typeof id==="string"&&/^[a-z0-9-]{1,50}$/.test(id);
 function buildIndex(catalog,activity){
   const output=[...base];
   if(Array.isArray(catalog?.projects)){
     for(const p of catalog.projects){
       if(!p||!allowProject(p.id)||typeof p.name!=="string"||!p.name.trim())continue;
       output.push({id:"project-"+p.id,title:p.name,description:typeof p.summary==="string"?p.summary.slice(0,220):"Explore this project world",
         kind:"Project",href:"./project.html?project="+p.id,symbol:"◈",
         keywords:[p.category,p.tagline,...(Array.isArray(p.features)?p.features.slice(0,12):[])].filter(x=>typeof x==="string").join(" ")});
     }
   }
   if(Array.isArray(catalog?.ideas)){
     for(const idea of catalog.ideas){
       if(!idea||!allowProject(idea.id)||typeof idea.name!=="string")continue;
       output.push({id:"idea-"+idea.id,title:idea.name,description:typeof idea.summary==="string"?idea.summary.slice(0,220):"An early NOVYX concept",
         kind:"Idea",href:"./index.html#vault",symbol:"◇",keywords:"vault early concept experiment innovation"});
     }
   }
   if(Array.isArray(activity?.items)){
     for(const item of activity.items){
       if(!item||item.reviewed!==true||!allowProject(item.projectId)||!/^commit-[0-9a-f]{12}$/.test(item.id)||
           item.type!=="development"||item.status!=="committed"||typeof item.title!=="string"||typeof item.summary!=="string")continue;
       const sha=item.source?.sha,repo=item.source?.repository;
       if(!/^[0-9a-f]{40}$/.test(sha||"")||!/^fathom-web\/[a-zA-Z0-9._-]+$/.test(repo||"")||
         item.source.url!=="https://github.com/"+repo+"/commit/"+sha)continue;
       const href=item.projectId==="novyxforge"?"./index.html#observatory":"./project.html?project="+item.projectId+"#evolution";
       output.push({id:"history-"+item.id,title:item.title,description:item.summary.slice(0,220),
         kind:"Development",href,symbol:"⌁",keywords:item.projectId+" source verified code committed"});
     }
   }
   const seen=new Set();
   return output.filter(item=>{if(seen.has(item.id)||!publicHref(item.href))return false;seen.add(item.id);return true});
 }
 function score(item,query){
   const words=norm(query).split(" ").filter(Boolean);if(!words.length)return 0;
   const title=norm(item.title),key=norm(item.keywords),desc=norm(item.description),kind=norm(item.kind);
   if(!words.every(w=>title.includes(w)||key.includes(w)||desc.includes(w)||kind.includes(w)))return 0;
   let s=0;
   const full=norm(query);
   if(title===full)s+=130;
   else if(title.startsWith(full))s+=85;
   else if(title.includes(full))s+=51;
   if(item.kind==="Project")s+=16;
   if(item.kind==="Navigate")s+=10;
   for(const w of words){if(title.startsWith(w))s+=24;else if(title.includes(w))s+=15;else if(key.includes(w))s+=6;else s+=2;}
   return s;
 }
 function rank(index,query,limit=9){
   const q=norm(query);
   if(!q)return index.filter(x=>["Project","Navigate"].includes(x.kind)).slice(0,limit);
   return index.map(item=>({item,s:score(item,q)})).filter(x=>x.s>0)
     .sort((a,b)=>b.s-a.s||a.item.title.localeCompare(b.item.title)).slice(0,limit).map(x=>x.item);
 }
 // Export pure helpers for transparent, offline smoke tests.
 window.NovyxSearchIndex=Object.freeze({buildIndex,rank,publicHref});
 function mount(){
   const triggers=[...document.querySelectorAll("[data-forge-search]")];
   if(!triggers.length||typeof HTMLDialogElement==="undefined")return;
   const dialog=el("dialog","forge-search-dialog");
   dialog.id="forge-search-dialog";
   dialog.setAttribute("aria-labelledby","forge-search-title");
   const header=el("div","forge-search-head"),headerText=el("div","");
   headerText.append(el("span","forge-search-kicker","NOVYX / COMMAND SEARCH"),
     el("h2","forge-search-title","Search the Universe"));
   headerText.lastElementChild.id="forge-search-title";
   const close=el("button","forge-search-close","×");
   close.type="button";close.setAttribute("aria-label","Close search");
   header.append(headerText,close);
   const wrap=el("div","forge-search-input-box"),glass=el("span","forge-search-icon");
   glass.setAttribute("aria-hidden","true");
   const input=el("input","forge-search-input");
   input.type="search";input.placeholder="Search projects, ideas, milestones…";input.autocomplete="off";
   input.setAttribute("aria-label","Search public NOVYX content");
   input.setAttribute("aria-controls","forge-search-results");
   wrap.append(glass,input);
   const content=el("div","forge-search-body"),status=el("p","forge-search-status");
   status.id="forge-search-status";status.setAttribute("role","status");status.setAttribute("aria-live","polite");
   const list=el("ul","forge-search-results");list.id="forge-search-results";
   content.append(status,list);
   const foot=el("div","forge-search-foot");
   foot.append(el("span","","↑ ↓ navigate · Enter open · Esc close"),el("span","","PUBLIC CONTENT ONLY"));
   dialog.append(header,wrap,content,foot);document.body.append(dialog);
   let index=[...base],loading=false,loaded=false,opener=null;
   const getLinks=()=>[...list.querySelectorAll("a[href]")];
   function render(){
     const query=input.value;
     const matches=rank(index,query);
     list.replaceChildren();
     status.textContent=!query.trim()?"START HERE · "+(loaded?"Search all public Forge content":"Project catalog loading…"):
       matches.length+" "+(matches.length===1?"result":"results")+" for “"+query.slice(0,70)+"”";
     if(!matches.length){
       list.append(el("li","forge-search-empty",loaded?
         "No matches in the public Forge catalog. Try a project name, topic or feature.":
         "Project data is unavailable or still loading. You can still browse the main navigation."));
       return;
     }
     for(const item of matches){
       const li=el("li","forge-search-result"),a=el("a","");
       a.href=item.href;
       const mark=el("span","forge-search-kind",item.symbol);mark.setAttribute("aria-hidden","true");
       const body=el("span","forge-search-content");
       body.append(el("span","forge-search-meta",item.kind),el("strong","",item.title),el("small","",item.description));
       a.append(mark,body,el("span","forge-search-arrow","↗"));
       li.append(a);list.append(li);
       a.addEventListener("click",()=>dialog.close());
     }
   }
   async function load(){
     if(loading||loaded)return;loading=true;
     const jobs=["./projects.json","./activity.json"].map(async path=>{
       const response=await fetch(path,{cache:"no-store"});
       if(!response.ok)throw Error("Search data unavailable");
       return response.json();
     });
     const [catalog,activity]=await Promise.allSettled(jobs);
     index=buildIndex(catalog.status==="fulfilled"?catalog.value:null,
       activity.status==="fulfilled"?activity.value:null);
     loading=false;loaded=true;
     if(dialog.open)render();
   }
   function open(trigger){
     if(dialog.open)return;
     opener=trigger||document.activeElement;
     input.value="";
     dialog.showModal();
     render();
     input.focus({preventScroll:true});
     load().catch(()=>{loaded=true;if(dialog.open)render();});
   }
   function shut(){if(dialog.open)dialog.close()}
   triggers.forEach(trigger=>trigger.addEventListener("click",event=>{
     event.preventDefault();open(trigger);
   }));
   document.addEventListener("keydown",event=>{
     if((event.ctrlKey||event.metaKey)&&!event.altKey&&!event.shiftKey&&event.key.toLowerCase()==="k"){
       event.preventDefault();open(document.activeElement);return;
     }
     if(!dialog.open)return;
     const links=getLinks();
     const indexOf=links.indexOf(document.activeElement);
     if(event.key==="ArrowDown"){
       if(!links.length)return;
       event.preventDefault();
       links[(indexOf+1)%links.length].focus();
     }else if(event.key==="ArrowUp"){
       if(!links.length)return;
       event.preventDefault();
       if(indexOf<=0)input.focus();else links[indexOf-1].focus();
     }else if(event.key==="Enter"&&document.activeElement===input){
       const first=links[0];
       if(first){event.preventDefault();first.click();}
     }
   });
   input.addEventListener("input",render);
   close.addEventListener("click",shut);
   dialog.addEventListener("click",e=>{if(e.target===dialog)shut()});
   dialog.addEventListener("close",()=>{if(opener?.isConnected)opener.focus({preventScroll:true});opener=null;});
   render();
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});
 else mount();
})();