/* Shared, escaped rendering for browser enhancement and static world generation. */
((root) => {
  'use strict';
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeURL = value => typeof value === 'string' && (/^https:\/\/(?:github\.com|instagram\.com)\/[\w./?=&%-]+$/.test(value) || /^\.\/(?:world-[a-z0-9-]+|spark-lab|project|index)\.html(?:\?[a-z0-9=&%-]+)?(?:#[a-z0-9-]+)?$/.test(value));
  const worldURL = id => /^[a-z0-9-]+$/.test(id) ? './world-' + id + '.html' : './index.html#projects';
  const link = (title, url) => safeURL(url) ? `<a href="${esc(url)}">${esc(title)} <span aria-hidden="true">↗</span></a>` : esc(title);
  function dossier(project, content, catalog) {
    if (!content) return '';
    return `<div class="v4-section-head"><span class="v4-kicker">BEHIND THE FORGE / ${esc(content.theme)}</span><h2 id="engineering-heading">${esc(content.question)}</h2><p>${esc(content.intro)}</p></div>
      <div class="v4-capabilities">${content.capabilities.map(([title, body], i) => `<article><span class="v4-index">0${i+1}</span><h3>${esc(title)}</h3><p>${esc(body)}</p></article>`).join('')}</div>
      <div class="v4-blueprint"><h3>The workflow, under the surface.</h3><ol aria-label="Project architecture">${content.architecture.map(step=>`<li>${esc(step)}</li>`).join('')}</ol><p>A simplified reading of the documented workflow.</p></div>
      <div class="v4-decisions">${content.decisions.map(([title,body],i)=>`<details id="decision-${i+1}"><summary><span>0${i+1} / ENGINEERING NOTE</span>${esc(title)}</summary><p>${esc(body)}</p></details>`).join('')}</div>
      <div class="v4-horizon" id="horizon"><div><span class="v4-kicker">NEXT QUESTIONS / PROPOSED</span><h3>Where this world could go.</h3><p>Review opportunities, not shipped features or delivery promises.</p></div><ul>${content.next.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>
      <aside class="v4-evidence" id="evidence"><strong>Know what you're exploring.</strong><p>${esc(content.limits)}</p><span class="v4-kicker">SOURCE REVIEW / 31 OCT 2026</span><ul>${content.sources.map(([title,url])=>`<li>${link(title,url)}</li>`).join('')}</ul></aside>
      <div class="v4-connections" id="connections"><span class="v4-kicker">CONNECTED WORLDS / SHARED IDEAS</span><h3>Follow the connection.</h3><div>${content.related.map(([id,reason])=>{const p=catalog.find(p=>p.id===id);return p?`<article>${link(p.name,worldURL(id))}<p>${esc(reason)}</p></article>`:'';}).join('')}</div></div>`;
  }
  function atlas(catalog, content) {
    return `<div class="v4-section-head"><span class="v4-kicker">THE LIVING FORGE / WORLD ATLAS</span><h2 id="atlas-heading">Different worlds.<br><em>Connected by curiosity.</em></h2><p>Find your next discovery through the ideas these projects share. Connections describe a common interest, not a technical integration.</p></div>
      <div class="v4-atlas-layout"><div class="v4-world-list" aria-label="Select a world to explore its connections">${catalog.filter(p=>p.world?.portal).map((p,i)=>`<button type="button" data-atlas-world="${esc(p.id)}" aria-pressed="${i===0}" style="--world-accent:${esc(p.accent)}"><span class="v4-world-dot" aria-hidden="true"></span><span><small>WORLD / 0${i+1}</small>${esc(p.name)}</span><span aria-hidden="true">↗</span></button>`).join('')}</div><div class="v4-atlas-detail" id="atlas-detail" aria-live="polite">${atlasDetail(catalog[0],content.projects[catalog[0].id],catalog)}</div></div>`;
  }
  function atlasDetail(p,c,catalog) {
    return `<span class="v4-kicker">${esc(c.theme)}</span><h3>${esc(p.name)}</h3><p>${esc(c.question)}</p><p>${esc(p.summary)}</p><div class="v4-atlas-actions">${link('Enter this world',worldURL(p.id))}${p.showcase?.demo?link('Try the sample demo',worldURL(p.id)+'#try-demo'):link('Read the story',worldURL(p.id)+'#engineering')}</div><div class="v4-connection-list">${c.related.map(([id,reason])=>`<article>${link(catalog.find(x=>x.id===id)?.name||id,worldURL(id))}<p>${esc(reason)}</p></article>`).join('')}</div>`;
  }
  root.NovyxContent = Object.freeze({esc,safeURL,worldURL,dossier,atlas,atlasDetail});
})(typeof window === 'undefined' ? globalThis : window);
