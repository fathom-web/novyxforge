/* NOVYX FORGE 3.1.2 — continuity and deep-scroll safety contract */
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {execFileSync} from "node:child_process";
const read=name=>readFileSync(new URL("../"+name,import.meta.url),"utf8");
const html=read("index.html"),css=read("forge-v312.css"),js=read("forge-v312.js");
const occurrences=(s,re)=>[...s.matchAll(re)].length;
assert.equal(occurrences(html,/forge-v312\.css\?v=1/g),1,"versioned continuity CSS must load exactly once");
assert.equal(occurrences(html,/forge-v312\.js\?v=1/g),1,"scroll enhancement must load exactly once");
assert.ok(html.indexOf("forge-v312.css")>html.indexOf("forge-v311.css"),"continuity overrides load last");
assert.equal(occurrences(html,/class="v312-seam"/g),3,"three atmospheric hand-off seams");
assert.equal(occurrences(html,/class="container platform-section v312-module/g),8,"eight existing sections share Systems Deck styling");
assert.equal(occurrences(html,/class="project project-/g),6,"all showcased projects must remain");
assert.equal(occurrences(html,/class="sphere-link (?:left|right|third|fourth|fifth|sixth)"/g),6,"six clickable portals");
for(const section of ["home","about","approach","projects","systems","pipeline","spark-lab","catalog","vault","observatory","pulse","inside","open-forge","forge-feedback","final-portal"])
 assert.ok(html.includes('id="'+section+'"'),"lost navigation target: "+section);
assert.ok(html.includes('id="forge-reactor-dialog"'),"reactor intact");
assert.ok(html.includes('id="forge-reactor-trigger"'),"reactor trigger intact");
assert.ok(html.includes('id="final-portal-heading"'),"outro is accessible and labeled");
assert.ok(html.includes('href="#home">Return to the universe'),"outro provides functional return navigation");
assert.ok(html.includes('href="#projects">Explore the projects'),"outro provides second destination");
assert.equal(occurrences(css,/\{/g),occurrences(css,/\}/g),"balanced CSS");
for(const selector of ["main:before","main:after",".v312-seam",".manifesto .principles:before",
".projects .cards>.project:nth-child(1)",".projects .cards>.project:nth-child(6)",
".v312-module",".v312-outro","@media(max-width:760px)","@media(max-width:420px)",
"@media(prefers-reduced-motion:reduce)"]){
 assert.ok(css.includes(selector),"required design safeguard missing: "+selector);
}
assert.ok(!css.includes("url(http"),"new visuals must not depend on third-party images");
assert.ok(!js.includes("requestAnimationFrame"),"passive observer, no scroll frame loop");
execFileSync(process.execPath,["--check",new URL("../forge-v312.js",import.meta.url).pathname],{stdio:"pipe"});
console.log("PASS NOVYX 3.1.2: continuous backdrop, process rail, hero/showcases, systems deck, mobile, outro, JS syntax");
