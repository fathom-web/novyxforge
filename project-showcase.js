/* NOVYX FORGE — Project Worlds / product showcase
   Factual content is sourced from projects.json. Concept art is always
   labeled and can be replaced with actual, local screenshot assets. */
(() => {
"use strict";
const $=id=>document.getElementById(id);
const el=(tag,cls,t)=>{const node=document.createElement(tag);if(cls)node.className=cls;if(t!==undefined)node.textContent=String(t);return node;};
const add=(parent,...items)=>{parent.append(...items);return parent;};
const validExternal=url=>{try{return /^https:/.test(new URL(url).protocol)}catch(e){return false}};
const validDestination=url=>typeof url==="string"&&(/^#[a-z][a-z0-9-]*$/i.test(url)||/^(\.\/)[a-z0-9/._?=&%-]+$/i.test(url)||validExternal(url));
const nameFromId=id=>id.replace(/-/g," ").toUpperCase();
const labels={spark:"Spark",exploring:"Exploring",building:"Building",released:"Launched","public-ready":"Public Ready"};
const dots=()=>{const d=el("span","preview-dots");for(let i=0;i<3;i++)d.append(el("i"));return d;};
const boxes=(names)=>{
 const b=el("div","preview-cards");
 names.slice(0,6).forEach(n=>b.append(el("span","",n)));
 return b;
};
const bars=()=>{const b=el("div","preview-bars");for(let i=0;i<3;i++)b.append(el("i"));return b;};
function makeScene(type,project){
 const win=el("div","preview-window");
 const top=el("div","preview-top");
 add(top,el("span","",project.name.toUpperCase()),dots());
 const content=el("div","preview-content");
 const title=txt=>content.append(el("div","preview-title",txt));
 if(type==="pitch"){
   title("MATCHDAY / LINE-UP CONCEPT");
   const pitch=el("div","preview-pitch");
   for(let i=0;i<6;i++)pitch.append(el("span","preview-player"));
   content.append(pitch);
 }else if(type==="cosmos"||type==="mystery"||type==="fact"){
   title(type==="fact"?"THE FASCINATION FILES / STORY":"SCIENCE / WONDER / DISCOVERY");
   content.append(el("div","preview-planet"));
 }else if(type==="runes"||type==="journey"||type==="milestones"){
   title("LIFEFORGE / CONCEPT ONLY");
   content.append(el("div","preview-rune",type==="milestones"?"✦":"◇"));
 }else if(["roles","lanes","duo","spark","matchup","clubhouse"].includes(type)){
   title(type==="roles"?"CEREMONY ROLES":type==="lanes"?"CHOOSE YOUR LANE":type==="duo"?"DUO-LANE MATCHUP":type==="spark"?"YOUR NEXT IDEA":type==="matchup"?"COUNTER REVIEW":"TEAM WORKSPACE");
   const m={
     roles:["RTE","PM","PO","SM"],lanes:["BARON","JUNGLE","MID","ADC","SUPPORT"],duo:["ADC","SUPPORT","VS","ADC","SUPPORT"],spark:["IDEA","AUDIENCE","PROBLEM","BUILD"],matchup:["YOUR LANE","OPPONENT","COUNTERS"],clubhouse:["TEAM","MATCHDAY","TRAINING"]
   };
   content.append(boxes(m[type]));
   content.append(bars());
 }else if(["quiz","flashcards","learning","blueprint","prompt","planner","calendar","availability"].includes(type)){
   title({
      quiz:"PRACTICE SESSION",flashcards:"MEMORY / RECALL",learning:"YOUR LEARNING SPACE",
      blueprint:"THE FIRST BLUEPRINT",prompt:"PROMPT WORKSHOP",planner:"PROGRAM INCREMENT",
      calendar:"CEREMONY CALENDAR",availability:"AVAILABILITY OVERVIEW"
   }[type]);
   if(type==="planner"||type==="calendar"){
     for(let i=0;i<3;i++)content.append(boxes(["ITERATION "+(i+1),"SESSION","READY"]));
   }else{
     content.append(boxes(type==="flashcards"?["FRONT","RECALL","FLIP"]:type==="quiz"?["QUESTION","ANSWER A","ANSWER B"]:type==="availability"?["AVAILABLE","ABSENT","PLANNING"]:type==="prompt"?["CONTEXT","MVP","PLAN"]:["OVERVIEW","PRACTICE","PROGRESS"]));
     content.append(bars());
   }
 }else{
   title("INTERFACE STUDY");
   content.append(boxes(["EXPLORE","DESIGN","BUILD"]));
   content.append(bars());
 }
 add(win,top,content);
 return win;
}
function screenshotPath(src){
  return typeof src==="string" && /^\.\/assets\/screenshots\/[a-z0-9/_-]+\.(?:webp|png|jpe?g)$/i.test(src) && !src.includes("..");
}
function createGalleryItem(project,visual,index){
 const figure=el("figure","gallery-item");
 figure.dataset.view=String(index+1).padStart(2,"0");
 const art=el("div","gallery-visual");
 const actual=visual.kind==="screenshot"&&visual.verified===true&&screenshotPath(visual.src);
 const tag=el("span","gallery-kind",actual?"VERIFIED SCREENSHOT":"ILLUSTRATIVE PREVIEW");
 art.append(tag);
 const img=actual;
 if(img){
   const button=el("button","gallery-photo-button");
   button.type="button";button.setAttribute("aria-label","View full screenshot: "+visual.title);
   const image=el("img","gallery-photo");image.loading="lazy";image.decoding="async";image.src=visual.src;image.alt=visual.alt||"Screenshot of "+project.name+": "+visual.title;
   button.append(image);
   image.addEventListener("error",()=>{
     art.classList.add("gallery-missing");
     tag.textContent="SCREENSHOT UNAVAILABLE";
     button.replaceWith(el("p","gallery-error","This screenshot is temporarily unavailable."));
   },{once:true});
   button.addEventListener("click",()=>openLightbox(image.src,image.alt,button));
   art.append(button);
 }else{
   art.append(makeScene(visual.layout||"preview",project));
 }
 const caption=el("figcaption");
 caption.dataset.viewNumber=String(index+1).padStart(2,"0");
 add(caption,el("h3","",visual.title),el("p","",visual.description));
 add(figure,art,caption);
 return figure;
}
let focusReturn=null;
function openLightbox(src,alt,trigger){
 const box=$("lightbox"),image=$("lightbox-image");
 if(!box||!image||typeof box.showModal!=="function")return;
 focusReturn=trigger;
 image.src=src;image.alt=alt;
 box.showModal();
 $("lightbox-close")?.focus({preventScroll:true});
}
function closeLightbox(){
 const box=$("lightbox");
 if(box?.open)box.close();
}
function initLightbox(){
 const box=$("lightbox");
 $("lightbox-close")?.addEventListener("click",closeLightbox);
 box?.addEventListener("click",event=>{if(event.target===box)closeLightbox();});
 box?.addEventListener("close",()=>{
  $("lightbox-image")?.removeAttribute("src");
  if(focusReturn?.isConnected)focusReturn.focus({preventScroll:true});
  focusReturn=null;
 });
}
function buildLink(label,url,style){
 if(!validDestination(url))return null;
 const a=el("a","btn "+(style||"btn-secondary"),label+" ↗");
 a.href=url;
 if(/^https:\/\//.test(url)){a.target="_blank";a.rel="noopener noreferrer";}
 return a;
}
function draw(project,all){
 const profile=project.showcase||{};
 document.body.dataset.world=project.id;
 const number=all.filter(p=>p.world?.portal).findIndex(p=>p.id===project.id);
 const worldLabel=project.id==="spark-lab"?"LAB / 07":number<0?"PROJECT WORLD":String(number+1).padStart(2,"0")+" / 06";
 const hasPublicApp=Boolean(project.links?.visit);
 // The same catalog drives world styling and the shared NOVYX weather engine.
 const atmosphere=project.world?.weather;
 if(atmosphere?.rgb)document.documentElement.style.setProperty("--weather-rgb",atmosphere.rgb);

 document.documentElement.style.setProperty("--accent",project.accent||"#a0deff");
 document.title=project.name+" — Inside NOVYX FORGE";
 const ogTitle=document.querySelector('meta[property="og:title"]');
 if(ogTitle)ogTitle.content=project.name+" — NOVYX FORGE";
 const ogDescription=document.querySelector('meta[property="og:description"]');
 if(ogDescription)ogDescription.content=project.summary||"Discover this project world inside NOVYX FORGE.";
 const canonical=document.querySelector('link[rel="canonical"]');
 if(canonical)canonical.href=new URL("./project.html?project="+encodeURIComponent(project.id),location.href).href;
 const meta=document.querySelector('meta[name="description"]');
 if(meta)meta.content=(project.summary||"")+" | Explore the project, features and interface previews on NOVYX FORGE.";
 $("name").textContent=project.name;$("lead").textContent=profile.lead||project.tagline;
 $("summary").textContent=project.summary||"";
 $("stage").textContent=(labels[project.stage]||"Project")+" / "+project.category;
 $("world").textContent=nameFromId(project.id);
 const summary={world:worldLabel,stage:labels[project.stage]||"Exploring",
  experience:profile.demo?"Interactive sandbox":hasPublicApp?"Open application":"Concept showcase",
  weather:project.world?.weather?.title||"Ambient world"};
 for(const [key,value] of Object.entries(summary)){const field=$("compass-"+key);if(field)field.textContent=value;}
 $("story").textContent=profile.story||project.solution;
 $("audience").textContent=profile.audience||"Everyone curious about this experiment.";
 const top=$("hero-actions");
 const view=buildLink("Explore the interface","#screenshots","btn-primary");if(view)top.append(view);
 const how=buildLink("What it does","#how-it-works","btn-secondary");if(how)top.append(how);
 // Only mount four approved, client-only sample demos. Others remain honest showcases.
 const demoSection=$("try-demo"),demoHost=$("demo-board");
 const hasDemo=Boolean(demoSection&&demoHost&&window.NovyxDemos?.mount?.(project,demoHost));
 if(hasDemo){
   demoSection.hidden=false;
   document.querySelectorAll("[data-chapter-demo]").forEach(a=>a.hidden=false);
   $("demo-intro").textContent=profile.demo?.description||"An interactive sample experience using entirely fictional data.";
   const tryDemo=buildLink("Try interactive demo","#try-demo","btn-secondary");
   if(tryDemo)top.append(tryDemo);
 }else{
   if($("features-section-number"))$("features-section-number").textContent="04 / CAPABILITIES";
   if($("go-further-number"))$("go-further-number").textContent="05 / GO FURTHER";
 }
 // Place the atmosphere control after the primary overview actions.
 if(atmosphere && window.NovyxWeather)window.NovyxWeather.mount(document.querySelector(".hero"),atmosphere);
 const steps=$("steps");
 (profile.steps||[]).forEach(([heading,description],i)=>{
   const card=el("article","step");
   add(card,el("small","",String(i+1).padStart(2,"0")+" / WORKFLOW"),el("h3","",heading),el("p","",description));
   steps.append(card);
 });
 const gallery=$("gallery");
 const images=Array.isArray(profile.screenshots)?profile.screenshots.filter(v=>v&&v.verified===true&&screenshotPath(v.src)).map(v=>({...v,kind:"screenshot"})):[];
 // Verified app captures lead the gallery. Preserve illustrative workflow
 // companions, each clearly labelled, rather than silently replacing all art.
 // Never infer "verified" from a filename or an unreviewed public URL.
 const concepts=(profile.views||[]).map(([title,description,layout])=>({title,description,layout,kind:"concept"}));
 const visuals=[...images,...concepts.slice(0,Math.max(0,3-images.length))].slice(0,3);
 for(const [i,visual] of visuals.entries())gallery.append(createGalleryItem(project,visual,i));
 $("gallery-note").textContent=images.length
   ?images.length+" reviewed real application screenshot"+(images.length===1?"":"s")+
     " · Supporting concepts remain illustrative and are labelled as such. Select a screenshot to enlarge it."
   :"ILLUSTRATIVE INTERFACE CONCEPTS — not screenshots of the live application. Real captures are only published after privacy and accuracy review.";
 const features=$("feature-list");
 (project.features||[]).forEach((feature,i)=>{const li=el("li");li.textContent=feature;features.append(li);});
 $("privacy").textContent=profile.privacy||"Feature availability may change as the project evolves.";
 const tech=$("tech-list");
 (project.tech||[]).forEach(label=>tech.append(el("span","",label)));
 const app=project.links?.visit;
 const action=$("launch-actions");
 const launch=app?buildLink(project.id==="fascination-files"?"Visit Instagram":"Open the application",app,"btn-primary"):null;
 if(launch)action.append(launch);
 if(project.links?.source && validExternal(project.links.source)){
   action.append(buildLink("View source on GitHub",project.links.source,"btn-secondary"));
 }
 if(project.id==="wow-lifeforge"){$("launch-note").textContent="World of Warcraft addon concept. No download is available. Future official addon releases will use CurseForge only.";}
 else if(!app){$("launch-note").textContent="A public application environment has not been verified for this project yet. Explore its development through the available source link.";}
 else{$("launch-note").textContent="The external application opens separately. You can always return here for context, features and project information.";}
 // Feedback stays a public GitHub handoff; no browser-side submission.
 const feedbackHost=$("project-feedback-actions");
 if(feedbackHost&&window.NovyxFeedback?.mount)window.NovyxFeedback.mount(feedbackHost,{id:project.id,name:project.name});
 const items=all.filter(p=>p.id!==project.id).slice(0,3);
 const related=$("related");
 items.forEach(p=>{
   const card=el("a");card.href="./project.html?project="+encodeURIComponent(p.id);
   add(card,el("small","",p.category.toUpperCase()),el("strong","",p.name));
   related.append(card);
 });
 // Expose the completed hero in one paint after all sourced content and
 // primary controls exist. The loading class is JS-only.
 document.documentElement.classList.remove("js-project-loading");
}
async function main(){
 initLightbox();
 const projectId=new URLSearchParams(location.search).get("project");
 if(!projectId||!/^[a-z0-9-]{1,50}$/.test(projectId)){
   $("name").textContent="Project not found";$("summary").textContent="Go back to NOVYX to browse our projects.";document.documentElement.classList.remove("js-project-loading");return;
 }
 try{
   const response=await fetch("./projects.json",{cache:"no-store"});
   if(!response.ok)throw Error("Catalog unavailable");
   const data=await response.json();
   if(!Array.isArray(data.projects))throw Error("Invalid project catalog");
   const project=data.projects.find(p=>p.id===projectId);
   if(!project)throw Error("Project not found");
   draw(project,data.projects);
 }catch(e){
   $("name").textContent="Project unavailable";
   $("summary").textContent="We couldn't load this project right now. Please return to the Forge and try again.";
   const a=buildLink("Back to all projects","./index.html#catalog","btn-primary");
   if(a)$("hero-actions").append(a);
   document.documentElement.classList.remove("js-project-loading");
 }
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",main,{once:true});else main();
})();