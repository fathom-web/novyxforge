/* Living Forge: sourced content, connected navigation and controllable motion. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const toggle = $('forge-motion');
  let paused = motion.matches;
  try { paused = paused || localStorage.getItem('novyx.motion.paused') === 'true'; } catch {}
  function syncMotion() {
    document.documentElement.classList.toggle('v4-motion-paused',paused || motion.matches);
    toggle?.setAttribute('aria-pressed',String(paused || motion.matches));
    if(toggle) toggle.textContent = paused || motion.matches ? 'Motion paused' : 'Pause motion';
    document.dispatchEvent(new Event('novyx-motion-change'));
  }
  toggle?.addEventListener('click',()=>{paused=!paused;try{localStorage.setItem('novyx.motion.paused',String(paused));}catch{}syncMotion();});
  motion.addEventListener('change',syncMotion);syncMotion();
  document.addEventListener('visibilitychange',()=>document.documentElement.classList.toggle('v4-page-hidden',document.hidden));

  async function init() {
    const [catalog,content] = await Promise.all(['./projects.json','./world-content.json'].map(async url=>{const r=await fetch(url);if(!r.ok)throw Error('Content unavailable');return r.json();}));
    const C = window.NovyxContent;
    const feedback=$('forge-feedback-actions');
    if(feedback && window.NovyxFeedback){
      const label=document.createElement('label');label.className='timeline-controls';label.textContent='Feedback about ';
      const select=document.createElement('select');select.id='feedback-project';
      for(const p of [{id:'novyxforge',name:'The Forge / general idea'},...catalog.projects]){const option=document.createElement('option');option.value=p.id;option.textContent=p.name;select.append(option);}
      select.addEventListener('change',()=>window.NovyxFeedback.mount(feedback,catalog.projects.find(p=>p.id===select.value)||{id:'novyxforge',name:'NOVYX FORGE'}));
      label.append(select);feedback.before(label);
    }
    const current = document.body.dataset.project || new URLSearchParams(location.search).get('project');
    const project = catalog.projects.find(p=>p.id===current);
    const host = $('engineering');
    if (host && project && !host.dataset.prerendered) host.innerHTML = C.dossier(project,content.projects[current],catalog.projects);
    if(host && location.hash.startsWith('#decision-')) {
      const detail=document.getElementById(location.hash.slice(1));
      if(detail?.tagName==='DETAILS'){detail.open=true;detail.scrollIntoView({behavior:'instant',block:'start'});}
    }
    document.querySelectorAll('[data-atlas-world]').forEach(button=>button.addEventListener('click',()=>{
      const p=catalog.projects.find(p=>p.id===button.dataset.atlasWorld);
      if(!p)return;
      document.querySelectorAll('[data-atlas-world]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
      $('atlas-detail').innerHTML=C.atlasDetail(p,content.projects[p.id],catalog.projects);
      $('atlas-detail').style.setProperty('--world-accent',p.accent);
    }));
    const preview=$('portal-preview');
    for(const sphere of document.querySelectorAll('.universe .sphere-link')){
      const id=new URL(sphere.href).searchParams.get('project');
      const p=catalog.projects.find(p=>p.id===id);
      if(!p||!preview)continue;
      const show=()=>{
        preview.querySelector('strong').textContent=p.name;
        preview.querySelector('p').textContent=content.projects[id].question;
        preview.querySelector('small').textContent=p.pipelineNote;
        preview.style.setProperty('--world-accent',p.accent);
        document.querySelector('.universe').style.setProperty('--selected-world',p.accent);
      };
      sphere.addEventListener('pointerenter',show,{passive:true});sphere.addEventListener('focus',show);
    }
    // The reactor opens this same atlas directly; all destinations remain real anchors.
    const reactor=$('forge-reactor-dialog');
    reactor?.querySelector('[href="#world-atlas"]')?.addEventListener('click',()=>reactor.close());
  }
  init().catch(()=>{
    const host=$('engineering');
    if(host && !host.dataset.prerendered)host.textContent='Engineering notes are unavailable. The source repository links below remain available.';
    const detail=$('atlas-detail');
    if(detail){const p=document.createElement('p');p.textContent='Interactive connections are unavailable. Use the world links below to continue.';detail.append(p);}
  });
})();
