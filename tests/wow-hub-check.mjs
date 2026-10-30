import assert from "node:assert/strict";
import {readFileSync, existsSync} from "node:fs";
import {execFileSync} from "node:child_process";
import {fileURLToPath} from "node:url";
import {dirname,resolve} from "node:path";
const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const read=path=>readFileSync(resolve(root,path),"utf8");
for(const name of ["index.html","site.css","site.js","favicon.svg","robots.txt","sitemap.xml","README.md"])
  assert.ok(existsSync(resolve(root,"wow",name)),"wow/"+name+" missing");
const html=read("wow/index.html"),css=read("wow/site.css"),js=read("wow/site.js");
const project=JSON.parse(read("projects.json")).projects.find(p=>p.id==="wow-lifeforge");
assert.ok(project,"WoW world missing from main universe");
assert.equal(project.links.visit,"https://wow.novyxforge.com/","central universe must point to new hub");
assert.equal(project.links.source,"https://github.com/fathom-web/WoW-LifeForge");
assert.equal(project.distribution.downloadUrl,null,"no fabricated CurseForge release");
assert.ok(html.includes('rel="canonical" href="https://wow.novyxforge.com/"'));
assert.ok(html.includes("0.8.0-alpha"));
assert.match(html,/not yet been verified|not yet verified|not been validated/i);
assert.ok(html.includes("ILLUSTRATIVE CONCEPT · NOT A CLIENT SCREENSHOT"));
assert.ok(html.includes("67 passing headless Lua tests"));
assert.ok(html.includes("No public CurseForge download"));
assert.ok((html.match(/<a\b/gi)||[]).length >= 10);
assert.equal((html.match(/id="lifeforge"/g)||[]).length,1);
for(const id of ["main","addons","lifeforge","systems","development","questions"])
  assert.ok(html.includes('id="'+id+'"'),"missing hub target "+id);
for(const className of ["hero-art","preview-shell","feature-grid","release-rail","faq-list"])
  assert.ok(html.includes('class="'+className+'"'),"missing module "+className);
assert.equal((css.match(/\{/g)||[]).length,(css.match(/\}/g)||[]).length,"unbalanced CSS");
assert.ok(css.includes("prefers-reduced-motion:reduce"));
assert.ok(css.includes("@media(max-width:620px)"));
assert.ok(js.includes('event.key === "Escape"'));
assert.ok(js.includes('aria-expanded'));
assert.ok(!html.includes('href="https://www.curseforge.com/wow/addons/lifeforge"'),"must not invent a CurseForge link");
assert.ok(!html.includes('href="./download')&&!html.includes("download.zip"),"no website addon downloads");
assert.ok(!html.includes("<iframe"),"never embed third-party game/user data");
for(const href of ["./site.css?v=1","./site.js?v=1","./favicon.svg"])
  assert.ok(html.includes(href),"missing local asset "+href);
for(const match of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g))
  assert.ok(match[0].includes("noopener"),"external new-tab link missing noopener");
execFileSync(process.execPath,["--check",resolve(root,"wow/site.js")],{stdio:"pipe"});
console.log("PASS WoW Addon Foundry: assets, subdomain, access, alpha truthfulness, mobile, and CurseForge-only distribution.");
