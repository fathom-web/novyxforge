/* NOVYX FORGE — The Living Innovation Lab / zero dependencies */
(() => {
  "use strict";
  const ROOT = "./";
  const STAGE_LABELS = {spark:"Spark",exploring:"Exploring",building:"Building",released:"Released"};
  const displayDate = new Intl.DateTimeFormat("en-GB",{day:"numeric",month:"short",year:"numeric"});
  const byId = id => document.getElementById(id);
  const text = (element,value) => {element.textContent = value == null ? "" : String(value);return element};
  const make = (tag,cls,value) => {const e=document.createElement(tag);if(cls)e.className=cls;if(value!==undefined)text(e,value);return e};
  const isSafeProjectId = value => /^[a-z0-9-]{1,60}$/.test(value);
  const detailUrl = project => project.detail || "project.html?project="+encodeURIComponent(project.id);
  const append = (parent,...children) => {children.forEach(c=>parent.append(c));return parent};

  let data=null;
  let filter="all";
  let searchTerm="";

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
    setupPulse();
    const detail=byId("project-detail");
    try{
      const response=await fetch(ROOT+"projects.json",{cache:"no-cache"});
      if(!response.ok)throw new Error("Project data not available");
      const payload=await response.json();
      if(!payload||!Array.isArray(payload.projects)||!Array.isArray(payload.ideas))throw new Error("Invalid catalog");
      data=payload;
      renderCatalog();renderVault();
      if(detail){
        const key=new URLSearchParams(location.search).get("project");
        const match=key&&isSafeProjectId(key)?data.projects.find(p=>p.id===key):null;
        if(match)populateDetail(match);
        else{const el=byId("detail-summary");if(el)text(el,"This project is not in the catalog. Return to NOVYX FORGE to explore our current work.");}
      }
    }catch(error){
      const grid=byId("catalog-grid");
      if(grid){grid.replaceChildren();const note=make("p","catalog-empty","The project explorer is temporarily unavailable. Featured projects above remain accessible.");grid.append(note);}
      const vault=byId("vault-grid");
      if(vault){vault.replaceChildren();vault.append(make("p","catalog-empty","Idea Vault data is unavailable. Try refreshing the page."));}
      if(detail){const el=byId("detail-summary");if(el)text(el,"Project information is temporarily unavailable. Please return to the Forge.");}
    }
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});
  else start();
})();
