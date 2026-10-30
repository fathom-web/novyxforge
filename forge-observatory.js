/* NOVYX FORGE 3.0 / The Observatory + Evolution Timeline
   A curated, source-verifiable development history, not a release tracker
   unless a real, verified release event is explicitly added to activity.json.
   No remote API calls, no user data, no invented milestones.
 */
(() => {
  "use strict";
  const allowedTypes=new Set(["development","release"]);
  const projectScope=new Set(["novyxforge","footballforge","studyforge","fascination-files","safeforge","wow-lifeforge","wildrift-counter","spark-lab"]);
  const $=id=>document.getElementById(id);
  const e=(tag,cls,content)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(content!==undefined)el.textContent=String(content);return el;};
  const add=(parent,...nodes)=>{parent.append(...nodes);return parent;};
  const formatDate=new Intl.DateTimeFormat("en-GB",{timeZone:"UTC",day:"numeric",month:"short",year:"numeric"});
  const isDate=value=>typeof value==="string"&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(value)&&Number.isFinite(Date.parse(value));
  const shaGood=sha=>typeof sha==="string"&&/^[0-9a-f]{40}$/.test(sha);
  const allowSource=item=>{
    const src=item.source;
    const repo=src?.repository;
    if(typeof repo!=="string"||!/^fathom-web\/[a-zA-Z0-9._-]+$/.test(repo))return false;
    if(item.type==="development")
      return src.type==="github-commit"&&shaGood(src.sha)&&
        src.url==="https://github.com/"+repo+"/commit/"+src.sha;
    if(item.type==="release")
      return src.type==="github-release"&&typeof src.tag==="string"&&
        /^[a-zA-Z0-9._-]{1,100}$/.test(src.tag)&&
        src.url==="https://github.com/"+repo+"/releases/tag/"+src.tag;
    return false;
  };
  function valid(raw){
    if(!raw||!Array.isArray(raw.items)||!isDate(raw.updated+"T00:00:00Z"))return null;
    const seen=new Set(),items=[];
    for(const item of raw.items){
      if(!item||item.reviewed!==true||!projectScope.has(item.projectId)||
         !allowedTypes.has(item.type)||!isDate(item.occurredAt)||
         !item.id||typeof item.title!=="string"||!item.title.trim()||
         typeof item.summary!=="string"||!item.summary.trim()||
         !allowSource(item)||seen.has(item.id))continue;
      if(item.type==="development"&&item.status!=="committed")continue;
      // A release is only accepted when a real GitHub release URL is curated.
      // A commit alone is NEVER automatically promoted to a product release.
      if(item.type==="release"&&item.status!=="published")continue;
      if(Date.parse(item.occurredAt)>Date.now()+3600000)continue;
      seen.add(item.id);
      items.push(item);
    }
    items.sort((a,b)=>Date.parse(b.occurredAt)-Date.parse(a.occurredAt));
    return {updated:raw.updated,items};
  }
  const makeDate=item=>{const t=e("time","",formatDate.format(new Date(item.occurredAt)));t.dateTime=item.occurredAt;return t;};
  const evidenceLink=(item,label)=>{
    const a=e("a","",label||"View verified commit ↗");
    a.href=item.source.url;a.target="_blank";a.rel="noopener noreferrer";
    return a;
  };
  const colorOf=(id,projects)=>{
    const rgb=projects.get(id)?.world?.weather?.rgb;
    return /^\d{1,3},\d{1,3},\d{1,3}$/.test(rgb||"")?rgb:"119,202,243";
  };
  const labelOf=(id,projects)=>id==="novyxforge"?"NOVYX FORGE":projects.get(id)?.name||id.replace(/-/g," ");
  const kindOf=item=>item.type==="release"?"Verified release":"Development commit";
  function feedCard(item,projects){
    const article=e("article","obs-entry");
    article.style.setProperty("--event-rgb",colorOf(item.projectId,projects));
    const header=e("div","obs-entry-head");
    header.append(e("span","obs-entry-kind",labelOf(item.projectId,projects)),makeDate(item));
    const source=e("div","obs-entry-source");
    source.append(evidenceLink(item,item.type==="release"?"View verified release ↗":"View verified commit ↗"),e("small","",kindOf(item)+" · Not a deployment"));
    add(article,header,e("h3","",item.title),e("p","",item.summary),source);
    return article;
  }
  const empty=message=>e("p","obs-empty",message);
  function renderObservatory(data,projects){
    const root=$("observatory-feed");
    if(!root)return;
    const count=$("obs-verified-count"),repos=$("obs-project-count"),releases=$("obs-releases-count");
    if(count)count.textContent=String(data.items.length);
    if(repos)repos.textContent=String(new Set(data.items.map(x=>x.projectId)).size);
    if(releases)releases.textContent=String(data.items.filter(x=>x.type==="release").length);
    const updated=$("observatory-reviewed");
    if(updated)updated.textContent="Evidence reviewed · "+formatDate.format(new Date(data.updated+"T00:00:00Z"));
    const select=$("observatory-project");
    if(select){
      const active=select.value;
      select.replaceChildren();
      const all=e("option","","All projects");all.value="all";select.append(all);
      for(const id of ["novyxforge",...projects.keys()]){
        const option=e("option","",labelOf(id,projects));option.value=id;select.append(option);
      }
      select.value=[...select.options].some(o=>o.value===active)?active:"all";
    }
    const filterButtons=[...document.querySelectorAll(".obs-filter[data-filter]")];
    let type="all";
    function rerender(){
      const selected=select?.value||"all";
      const items=data.items.filter(x=>(selected==="all"||x.projectId===selected)&&(type==="all"||x.type===type));
      root.replaceChildren();
      if(items.length){
        for(const item of items)root.append(feedCard(item,projects));
      }else{
        root.append(empty(type==="release"
          ?"No verified releases have been published in this curated history. Code commits do not establish a release."
          :"No reviewed, source-backed development events are recorded for this selection yet."));
      }
      const visible=$("observatory-visible-count");
      if(visible)visible.textContent=String(items.length)+" reviewed "+(items.length===1?"event":"events")+" shown";
    }
    filterButtons.forEach(button=>button.addEventListener("click",()=>{
      type=button.dataset.filter;
      filterButtons.forEach(b=>b.setAttribute("aria-pressed",String(b===button)));
      rerender();
    }));
    select?.addEventListener("change",rerender);
    rerender();
  }
  function renderTimeline(data,projectId){
    const root=$("evolution-feed");
    if(!root)return;
    const entries=data.items.filter(item=>item.projectId===projectId);
    root.replaceChildren();
    if(!entries.length){
      root.append(e("p","evolution-empty","No reviewed, source-backed development milestones have been published for this project yet. Its catalog stage is not a confirmed release history."));
      return;
    }
    for(const item of entries.slice(0,8)){
      const card=e("article","evolution-item");
      const head=e("div","evolution-item-head");
      head.append(makeDate(item),e("span","evolution-status",item.type==="release"?"Release published":"Code committed"));
      add(card,head,e("h3","",item.title),e("p","",item.summary),evidenceLink(item,item.type==="release"?"View the published GitHub release ↗":"Read the GitHub commit ↗"));
      card.lastElementChild.className="evolution-source";
      root.append(card);
    }
    const note=$("evolution-note");
    if(note)note.textContent=entries.length+" verified history "+(entries.length===1?"entry":"entries")+
      " · Source: reviewed public GitHub evidence · Committed code is not proof of a production release.";
  }
  async function load(){
    const home=Boolean($("observatory-feed")),detail=Boolean($("evolution-feed"));
    if(!home&&!detail)return;
    try{
      const requests=[fetch("./activity.json",{cache:"no-store"})];
      if(home)requests.push(fetch("./projects.json",{cache:"no-store"}));
      const response=await Promise.all(requests);
      if(response.some(r=>!r.ok))throw Error("Activity data unavailable");
      const activity=valid(await response[0].json());
      if(!activity)throw Error("Invalid activity data");
      const projects=new Map();
      if(home){
        const catalog=await response[1].json();
        if(!Array.isArray(catalog?.projects))throw Error("Invalid project catalog");
        catalog.projects.forEach(p=>{if(p&&projectScope.has(p.id)&&p.id!=="novyxforge")projects.set(p.id,p)});
        renderObservatory(activity,projects);
      }
      if(detail)renderTimeline(activity,new URLSearchParams(location.search).get("project"));
    }catch(error){
      if(home)$("observatory-feed").replaceChildren(empty("The reviewed activity history is temporarily unavailable. The public GitHub Pulse below can still be used to view repository commits."));
      if(detail)$("evolution-feed").replaceChildren(e("p","evolution-empty","Project history is unavailable right now. Please check GitHub for technical updates."));
      const status=$("observatory-reviewed");if(status)status.textContent="History unavailable";
    }
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",load,{once:true});
  else load();
})();
