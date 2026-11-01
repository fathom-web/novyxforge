// Dependency-free static publishing. Run after editing catalog, content or project shell.
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=p=>readFileSync(resolve(root,p),'utf8');
const write=(p,s)=>writeFileSync(resolve(root,p),s);
const catalog=JSON.parse(read('projects.json'));
const content=JSON.parse(read('world-content.json'));
const activity=JSON.parse(read('activity.json'));
const context=vm.createContext({});vm.runInContext(read('forge-content.js'),context);
const C=context.NovyxContent,e=C.esc;
const template=read('project.html');
const stage={released:'Available to explore',building:'In development',exploring:'Exploring'};
for(const p of catalog.projects){
  const c=content.projects[p.id];if(!c)throw Error('Missing world content: '+p.id);
  let html=template.replace('<body>',`<body data-project="${e(p.id)}" data-world="${e(p.id)}" style="--accent:${e(p.accent)}">`)
    .replace('<script>document.documentElement.classList.add("js-project-loading")</script>','')
    .replace(/<title>.*?<\/title>/,`<title>${e(p.name)} — The Living Forge</title>`)
    .replace(/(<meta name="description" content=")[^"]*/,`$1${e(p.summary)}`)
    .replace(/(<meta property="og:title" content=")[^"]*/,`$1${e(p.name)} — The Living Forge`)
    .replace(/(<meta property="og:description" content=")[^"]*/,`$1${e(p.summary)}`);
  const url=`https://novyxforge.com/world-${p.id}.html`;
  html=html.replace('</head>',`<link rel="canonical" href="${url}"><meta property="og:url" content="${url}"><script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@type':'CreativeWork',name:p.name,description:p.summary,url,isPartOf:{'@type':'WebSite',name:'NOVYX FORGE',url:'https://novyxforge.com/'}}).replace(/</g,'\\u003c')}</script></head>`);
  const fill=(id,value)=>{const pattern=new RegExp('(<([a-z0-9]+)\\b[^>]*\\bid="'+id+'"[^>]*>)[\\s\\S]*?(<\\/\\2>)');html=html.replace(pattern,(_,start,tag,end)=>start+value+end);};
  for(const [id,value] of Object.entries({name:p.name,lead:p.showcase.lead,summary:p.summary,stage:stage[p.stage]||p.stage,story:p.showcase.story,audience:p.showcase.audience,privacy:p.showcase.privacy,world:c.theme,'compass-world':p.category,'compass-stage':stage[p.stage]||p.stage,'compass-experience':p.showcase.demo?'Sample demo + project story':'Project story','compass-weather':p.world.weather.title,'launch-note':p.pipelineNote}))fill(id,e(value));
  fill('hero-actions',`<a class="btn btn-primary" href="#engineering">Explore the story ↓</a>${p.showcase.demo?'<a class="btn btn-secondary" href="#try-demo">Try the sample demo ↓</a>':''}`);
  fill('steps',p.showcase.steps.map(([title,body],i)=>`<article class="step"><small>0${i+1} / WORKFLOW</small><h3>${e(title)}</h3><p>${e(body)}</p></article>`).join(''));
  fill('feature-list',p.features.map(x=>`<li>${e(x)}</li>`).join(''));
  fill('tech-list',p.tech.map(x=>`<span>${e(x)}</span>`).join(''));
  fill('gallery-note','Illustrative concepts are available with JavaScript. Product screenshots are published only after review.');
  fill('launch-actions',[p.links.visit?`<a class="btn btn-primary" href="${e(p.links.visit)}">${p.id==='wow-lifeforge'?'Open WoW showcase':'Open project destination'} ↗</a>`:'',p.links.source?`<a class="btn btn-secondary" href="${e(p.links.source)}">Source repository ↗</a>`:''].join(''));
  fill('engineering',C.dossier(p,c,catalog.projects));
  html=html.replace('id="engineering"','id="engineering" data-prerendered="true"');
  fill('world-nav-links',catalog.projects.map(x=>`<a class="world-nav-link${x.id===p.id?' is-current':''}" href="${C.worldURL(x.id)}"${x.id===p.id?' aria-current="page"':''}>${e(x.name)}</a>`).join(''));
  fill('related',c.related.map(([id,reason])=>`<a href="${C.worldURL(id)}"><small>${e(reason)}</small><strong>${e(catalog.projects.find(x=>x.id===id).name)}</strong></a>`).join(''));
  const history=activity.items.filter(x=>x.projectId===p.id && x.reviewed);
  fill('evolution-feed',history.length?history.map(x=>`<article class="evolution-item"><time datetime="${e(x.occurredAt)}">${e(x.occurredAt.slice(0,10))}</time><h3>${e(x.title)}</h3><p>${e(x.summary)}</p><a href="${e(x.source.url)}">Read development evidence ↗</a></article>`).join(''):'<p>No reviewed milestones are recorded for this world yet. A catalog stage is not a release history.</p>');
  html=html.replace('<main>','<main id="main-content">');
  html=html.replace('</body>','<noscript><p class="shell">Interactive demos and atmospheric controls need JavaScript. All project stories and world links remain available.</p></noscript></body>');
  write(`world-${p.id}.html`,html);
}
let home=read('index.html');
home=home.replace(/<!-- V4 ATLAS START -->[\s\S]*?<!-- V4 ATLAS END -->/,`<!-- V4 ATLAS START --><section class="container v4-section" id="world-atlas" aria-labelledby="atlas-heading">${C.atlas(catalog.projects,content)}<noscript><p>Explore the worlds directly:</p>${catalog.projects.map(p=>C.link?C.link(p.name,C.worldURL(p.id)):`<p><a href="${C.worldURL(p.id)}">${e(p.name)}</a></p>`).join('')}</noscript></section><!-- V4 ATLAS END -->`);
write('index.html',home);
const pages=['','safe-agile.html','spark-lab.html','public-ready.html',...catalog.projects.map(p=>`world-${p.id}.html`)];
write('sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+pages.map(p=>`  <url><loc>https://novyxforge.com/${p}</loc></url>`).join('\n')+'\n</urlset>\n');
console.log(`Generated ${catalog.projects.length} static worlds, homepage atlas and sitemap.`);
