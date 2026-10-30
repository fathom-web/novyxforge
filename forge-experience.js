/* NOVYX FORGE — The Living Innovation Lab / zero dependencies */
(() => {
  "use strict";
  const ROOT = "./";
  const STAGE_LABELS = {spark:"Spark",exploring:"Exploring",building:"Building",released:"Launch","public-ready":"Public Ready"};
  const displayDate = new Intl.DateTimeFormat("en-GB",{day:"numeric",month:"short",year:"numeric"});
  const byId = id => document.getElementById(id);
  const text = (element,value) => {element.textContent = value == null ? "" : String(value);return element};
  const make = (tag,cls,value) => {const e=document.createElement(tag);if(cls)e.className=cls;if(value!==undefined)text(e,value);return e};
  const isSafeProjectId = value => /^[a-z0-9-]{1,60}$/.test(value);
  const detailUrl = project => project.detail || "project.html?project="+encodeURIComponent(project.id);
  const append = (parent,...children) => {children.forEach(c=>parent.append(c));return parent};


  // A live app does not automatically qualify as a reusable public package.
  // Distribution URLs and documentation must be explicitly published.
  const safeHttps=url=>{try{return typeof url==="string"&&new URL(url).protocol==="https:";}catch(e){return false;}};
  function verifiedDistribution(p){
    const d=p.distribution||{};
    const licensed=typeof d.license==="string"&&d.license.trim().length>0;
    const docs=safeHttps(d.documentationUrl);
    const template=(d.type==="template"||d.type==="both")&&/^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/generate\/?$/.test(d.templateUrl||"");
    const download=(d.type==="download"||d.type==="both")&&safeHttps(d.downloadUrl);
    return {ready:licensed&&docs&&(template||download),template,download,docs,d};
  }
  function actualStage(p){return p.stage==="public-ready"&&!verifiedDistribution(p).ready?"released":p.stage;}

  let data=null;
  let filter="all";
  let searchTerm="";
  let pipelineView="all";

  function tile(project){
    const card=make("a","catalog-tile");
    card.href=detailUrl(project);
    card.style.setProperty("--tile-color",project.accent||"#87cfff");
    card.style.setProperty("--tile-glow",project.category==="Gaming"?"rgba(243,173,94,.14)":"rgba(103,168,242,.12)");
    card.setAttribute("aria-label","Explore "+project.name);
    const top=make("div","tile-top");
    const symbol=make("span","tile-symbol",project.symbol||"✦");
    symbol.setAttribute("aria-hidden","true");
    append(top,symbol,make("span","stage-label",STAGE_LABELS[project.stage]||"Project"));
    const heading=make("h3","",project.name);
    const body=make("p","",project.summary);
    const bottom=make("div","tile-bottom");
    append(bottom,make("span","",project.category),make("strong","",""));
    bottom.lastElementChild.textContent="Explore ↗";
    append(card,top,heading,body,bottom);
    return card;
  }
  function renderCatalog(){
    const grid=byId("catalog-grid");
    if(!grid||!data)return;
    const chosen=data.projects.filter(project=>{
      const categoryMatch=filter==="all"||project.category.toLowerCase()===filter;
      const searchBlob=(project.name+" "+project.summary+" "+project.tagline+" "+project.category+" "+project.stage).toLowerCase();
      return categoryMatch&&searchBlob.includes(searchTerm);
    });
    grid.replaceChildren();
    if(chosen.length){chosen.forEach(project=>grid.append(tile(project)));}
    else{grid.append(make("p","catalog-empty","No matching projects yet. Try another category or search term."));}
    const count=byId("catalog-count");
    if(count)text(count,chosen.length+" of "+data.projects.length+" projects");
  }

  // THE FORGE PIPELINE — a curated project/idea lifecycle, not inferred
  // completion percentages or a live deploy status. projects.json is canonical.
  function pipelineItem(item,kind){
    const pub=kind==="project"?verifiedDistribution(item):null;
    const ready=kind==="project"&&actualStage(item)==="public-ready";
    const card=make(ready?"article":"a","pipeline-card"+(ready?" pipeline-distribution-card":""));
    if(!ready)card.href=kind==="idea"?"#vault":detailUrl(item);
    card.style.setProperty("--item-accent",item.accent||"#90cfff");
    card.style.setProperty("--pipeline-halo",kind==="idea"?"rgba(176,133,255,.13)":"rgba(98,159,255,.12)");
    card.setAttribute("aria-label",(ready?"Public package: ":kind==="idea"?"Explore idea: ":"Explore project: ")+item.name);
    const meta=make("div","pipeline-meta");
    const symbol=make("span","pipeline-symbol",item.symbol||"✧");symbol.setAttribute("aria-hidden","true");
    append(meta,make("span","pipeline-type",kind==="idea"?"IDEA / "+item.category:"PROJECT / "+item.category),symbol);
    if(ready)card.append(make("span","pipeline-ready-note","PUBLIC DISTRIBUTION"));
    append(card,meta,make("h3","",item.name),make("p","",kind==="project"?(item.pipelineNote||item.summary):item.summary));
    if(ready){
      const actions=make("div","pipeline-downloads");
      const add=(label,url,secondary)=>{const a=make("a",secondary?"secondary":"",label);a.href=url;a.target="_blank";a.rel="noopener noreferrer";actions.append(a);};
      if(pub.template)add("Use this template ↗",pub.d.templateUrl,false);
      if(pub.download)add("Download release ↗",pub.d.downloadUrl,Boolean(pub.template));
      if(pub.docs)add("Setup & docs ↗",pub.d.documentationUrl,true);
      card.append(actions);
    }else{
      const more=make("div","pipeline-link");
      append(more,make("span","",kind==="idea"?"See it in the Vault":"Explore project"),make("span","","↗"));card.append(more);
    }
    return card;
  }

  function renderPipeline(){
    const columns=[...document.querySelectorAll("[data-pipeline-stage]")];
    if(!columns.length||!data)return;
    const shownProjects=pipelineView!=="ideas"?data.projects:[];
    const shownIdeas=pipelineView!=="projects"?data.ideas:[];
    let total=0;
    columns.forEach(column=>{
      const stage=column.dataset.pipelineStage;
      const items=[
        ...shownProjects.filter(p=>actualStage(p)===stage).map(item=>({item,kind:"project"})),
        ...shownIdeas.filter(p=>p.stage===stage).map(item=>({item,kind:"idea"}))
      ];
      total+=items.length;
      column.replaceChildren();
      if(items.length)items.forEach(({item,kind})=>column.append(pipelineItem(item,kind)));
      else if(stage==="public-ready"){
        const empty=make("div","pipeline-empty");
        empty.append(make("p","","No public download yet. Projects move here after a tested release, documentation and a valid package or GitHub template."));
        const guide=make("a","","Publishing checklist ↗");guide.href="./public-ready.html";empty.append(guide);column.append(empty);
      }else column.append(make("p","pipeline-empty",pipelineView==="projects"?"No projects in this phase yet.":pipelineView==="ideas"?"No ideas in this phase yet.":"Nothing in this phase just yet."));
      const count=byId("pipeline-count-"+stage);
      if(count)text(count,items.length);
    });
    const summary=byId("pipeline-summary");
    if(summary)text(summary,total+" "+(pipelineView==="projects"?"projects":pipelineView==="ideas"?"ideas":"initiatives")+" across five stages");
  }

  function initPipeline(){
    document.querySelectorAll("[data-pipeline-view]").forEach(button=>{
      button.addEventListener("click",()=>{
        pipelineView=button.dataset.pipelineView;
        document.querySelectorAll("[data-pipeline-view]").forEach(other=>other.setAttribute("aria-pressed",String(other===button)));
        renderPipeline();
      });
    });
  }

  function renderVault(){
    const container=byId("vault-grid");
    if(!container||!data)return;
    container.replaceChildren();
    data.ideas.forEach(idea=>{
      const card=make("article","vault-capsule");
      card.style.setProperty("--vault-glow",idea.accent||"#ad91ff");
      append(card,
        make("span","vault-status",STAGE_LABELS[idea.stage]||"Idea"),
        make("h3","",idea.name),
        make("p","",idea.summary),
        make("div","vault-caption",idea.category+" / IN THE VAULT"));
      container.append(card);
    });
    const count=byId("vault-count");
    if(count)text(count,data.ideas.length+" ideas in exploration");
  }
  function initFilters(){
    const all=Array.from(document.querySelectorAll("[data-project-filter]"));
    all.forEach(button=>{
      button.addEventListener("click",()=>{
        filter=button.dataset.projectFilter;
        all.forEach(b=>b.setAttribute("aria-pressed",String(b===button)));
        renderCatalog();
      });
    });
    const search=byId("catalog-search");
    if(search)search.addEventListener("input",()=>{searchTerm=search.value.trim().toLowerCase();renderCatalog();});
  }
  function pulseFallback(message){
    const target=byId("pulse-feed");if(!target)return;
    target.replaceChildren();
    const fallback=make("p","pulse-fallback");
    append(fallback,document.createTextNode(message+" "));
    const a=make("a","","Explore public GitHub activity ↗");
    a.href="https://github.com/fathom-web";a.target="_blank";a.rel="noopener noreferrer";
    append(fallback,a);target.append(fallback);
    const state=byId("pulse-state");if(state)text(state,"Live feed unavailable");
  }
  async function loadPulse(){
    if(!byId("pulse-feed"))return;
    const repos=[
      ["NOVYX FORGE","novyxforge"],
      ["SAFe Agile Forge","SAFeForge"],
      ["StudyForge","studyforge"],
      ["Wild Rift Counter","WildRiftCounter"]
    ];
    const results=await Promise.allSettled(repos.map(async ([name,repo])=>{
      const response=await fetch("https://api.github.com/repos/fathom-web/"+encodeURIComponent(repo)+"/commits?per_page=1",{headers:{"Accept":"application/vnd.github+json"}});
      if(!response.ok)throw new Error("GitHub feed status "+response.status);
      const payload=await response.json();
      if(!Array.isArray(payload)||!payload[0]?.commit?.message||!payload[0]?.html_url)return null;
      const commit=payload[0];
      const date=commit.commit?.committer?.date||commit.commit?.author?.date;
      const stamp=Date.parse(date||"");
      if(!Number.isFinite(stamp))return null;
      return {name,headline:commit.commit.message.split("\n")[0].slice(0,175),url:commit.html_url,date:stamp};
    }));
    const entries=results.filter(r=>r.status==="fulfilled"&&r.value).map(r=>r.value).sort((a,b)=>b.date-a.date).slice(0,4);
    if(!entries.length){pulseFallback("The public GitHub feed could not be loaded right now.");return;}
    const container=byId("pulse-feed");
    container.replaceChildren();
    entries.forEach(entry=>{
      const card=make("article","pulse-card");
      const dot=make("div","pulse-icon","↗");dot.setAttribute("aria-hidden","true");
      const content=make("div","pulse-copy"),meta=make("div","pulse-meta");
      const date=make("time","",displayDate.format(new Date(entry.date)));date.dateTime=new Date(entry.date).toISOString();
      append(meta,make("span","",entry.name),date);
      const link=make("a","","View commit ↗");link.href=entry.url;link.target="_blank";link.rel="noopener noreferrer";
      append(content,meta,make("h3","",entry.headline),link);
      append(card,dot,content);
      container.append(card);
    });
    const status=byId("pulse-state");
    if(status)text(status,"Public GitHub commits · Updated when you open this page");
  }
  function setupPulse(){
    const anchor=byId("pulse");
    if(!anchor)return;
    let started=false;
    const start=()=>{if(started)return;started=true;loadPulse().catch(()=>pulseFallback("Recent activity could not be retrieved."));};
    if("IntersectionObserver" in window){
      const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){observer.disconnect();start();}},{rootMargin:"250px"});
      observer.observe(anchor);
    }else start();
  }
  function populateDetail(project){
    const root=byId("project-detail");
    if(!root)return;
    document.title=project.name+" — NOVYX FORGE";
    const desc=document.querySelector('meta[name="description"]');
    if(desc)desc.content=project.summary;
    const name=byId("detail-name"),label=byId("detail-stage"),subtitle=byId("detail-tagline"),summary=byId("detail-summary");
    if(name)text(name,project.name);
    if(label)text(label,(STAGE_LABELS[project.stage]||"Project")+" / "+project.category);
    if(subtitle)text(subtitle,project.tagline);
    if(summary)text(summary,project.summary);
    root.style.setProperty("--detail-accent",project.accent||"#90dfff");
    const problem=byId("detail-problem"),solution=byId("detail-solution");
    if(problem)text(problem,project.problem);
    if(solution)text(solution,project.solution);
    const features=byId("detail-features");if(features){features.replaceChildren();project.features.forEach(x=>features.append(make("li","",x)));}
    const tech=byId("detail-tech");if(tech){tech.replaceChildren();project.tech.forEach(x=>tech.append(make("span","",x)));}
    const links=byId("detail-actions");
    if(links){
      links.replaceChildren();
      if(project.links.visit){const a=make("a","detail-button primary","Open experience ↗");a.href=project.links.visit;a.rel="noopener noreferrer";a.target="_blank";links.append(a);}
      if(project.links.source && project.id!=="wow-lifeforge"){const a=make("a","detail-button secondary","View source on GitHub ↗");a.href=project.links.source;a.rel="noopener noreferrer";a.target="_blank";links.append(a);}
      if(project.id==="wow-lifeforge"){links.append(make("p","detail-notice","Addon in exploration. If released, official downloads and updates will be available exclusively through CurseForge. No download is available yet."));}
      if(project.id==="wildrift-counter"&&!project.links.visit){links.append(make("p","detail-notice","Prototype source is available; the public app address has not been confirmed."));}
    }
    const next=byId("detail-related");if(next){next.replaceChildren();data.projects.filter(p=>p.id!==project.id).slice(0,3).forEach(p=>next.append(tile(p)));}
  }
  async function start(){
    initFilters();
    initPipeline();
    setupPulse();
    const detail=byId("project-detail");
    try{
      const response=await fetch(ROOT+"projects.json",{cache:"no-cache"});
      if(!response.ok)throw new Error("Project data not available");
      const payload=await response.json();
      if(!payload||!Array.isArray(payload.projects)||!Array.isArray(payload.ideas))throw new Error("Invalid catalog");
      data=payload;
      renderCatalog();renderVault();renderPipeline();
      if(detail){
        const key=new URLSearchParams(location.search).get("project");
        const match=key&&isSafeProjectId(key)?data.projects.find(p=>p.id===key):null;
        if(match)populateDetail(match);
        else{const el=byId("detail-summary");if(el)text(el,"This project is not in the catalog. Return to NOVYX FORGE to explore our current work.");}
      }
    }catch(error){
      const grid=byId("catalog-grid");
      if(grid){grid.replaceChildren();const note=make("p","catalog-empty","The project explorer is temporarily unavailable. Featured projects above remain accessible.");grid.append(note);}
      for(const column of document.querySelectorAll("[data-pipeline-stage]")){
        column.replaceChildren(make("p","pipeline-empty","Pipeline data is temporarily unavailable."));
      }
      const vault=byId("vault-grid");
      if(vault){vault.replaceChildren();vault.append(make("p","catalog-empty","Idea Vault data is unavailable. Try refreshing the page."));}
      if(detail){const el=byId("detail-summary");if(el)text(el,"Project information is temporarily unavailable. Please return to the Forge.");}
    }
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});
  else start();
})();
