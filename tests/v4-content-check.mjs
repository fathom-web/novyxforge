import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';
const root=new URL('../',import.meta.url),read=p=>readFileSync(new URL(p,root),'utf8');
const catalog=JSON.parse(read('projects.json')),content=JSON.parse(read('world-content.json'));
const context=vm.createContext({});vm.runInContext(read('forge-content.js'),context);
const C=context.NovyxContent;
assert.equal(C.safeURL('javascript:alert(1)'),false);
assert.equal(C.safeURL('https://github.com.attacker.test/path'),false);
assert.equal(C.safeURL('./world-test.html#decision-1'),true);
assert.equal(C.esc('<img onerror="x">'),'&lt;img onerror=&quot;x&quot;&gt;');
for(const p of catalog.projects){
  const c=content.projects[p.id];assert.ok(c && c.sources.length && c.decisions.length>=2);
  for(const [title,url] of c.sources){assert.ok(title);assert.ok(C.safeURL(url),url);}
  for(const [id,reason] of c.related){assert.ok(catalog.projects.some(x=>x.id===id));assert.ok(reason);}
  const html=read('world-'+p.id+'.html');
  assert.ok(html.includes(C.esc(c.question)));assert.ok(html.includes(C.esc(c.intro)));
  assert.equal((html.match(/rel="canonical"/g)||[]).length,1);
  assert.ok(html.includes('https://novyxforge.com/world-'+p.id+'.html'));
  assert.ok(!html.includes('js-project-loading'));
  assert.ok(!html.includes('Loading project'));
  assert.ok(html.includes('data-prerendered="true"'));
  const heroActions=html.match(/<div class="hero-actions" id="hero-actions">([\\s\\S]*?)<\\/div>/)?.[1]||'';
  if(p.links?.visit){
    assert.ok(heroActions.includes('class="btn btn-primary btn-project-destination"'),p.id+' must have a primary project link');
    assert.ok(heroActions.includes('href="'+p.links.visit+'"'),p.id+' missing catalog destination');
    assert.ok(heroActions.includes('class="project-destination-url"'),p.id+' destination hostname not shown');
  }else{
    assert.ok(!heroActions.includes('btn-project-destination'),p.id+' must not invent a public app');
    assert.ok(heroActions.includes('View source on GitHub'),p.id+' should offer the source instead');
  }
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
  assert.equal(new Set(ids).size,ids.length,'Duplicate IDs in '+p.id);
  for(const match of html.matchAll(/(?:href|src)="(\.\/[^"?#]+)(?:[?#][^"]*)?"/g))assert.ok(existsSync(fileURLToPath(new URL(match[1],root))),p.id+' broken link '+match[1]);
}
const searchContext={window:{},document:{readyState:'loading',addEventListener(){}}};
vm.runInNewContext(read('forge-search.js'),searchContext);
const index=searchContext.window.NovyxSearchIndex.buildIndex(catalog,JSON.parse(read('activity.json')),content);
for(const query of ['SavedVariables','localStorage','updated_at','flashcards'])assert.ok(searchContext.window.NovyxSearchIndex.rank(index,query).length,query);
assert.ok(index.some(x=>x.kind==='Engineering'));assert.equal(index.filter(x=>x.kind==='Demo').length,4);
console.log('PASS V4: seven static worlds, metadata, evidence, connections, local links, safe rendering and engineering/demo search.');

assert.match(read('project-showcase.js'), /btn-primary btn-project-destination/);
assert.match(read('project.html'), /forge-project-links\\.css/);
