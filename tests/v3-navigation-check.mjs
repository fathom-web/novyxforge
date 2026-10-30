/**
 * NOVYX 3.0 / Increment 2 static contract tests.
 * Run: node tests/v3-navigation-check.mjs
 * Zero external packages, no network and no app credentials.
 */
import {readFileSync} from "node:fs";
import assert from "node:assert/strict";
const file=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const index=file("index.html"),project=file("project.html");
const js=file("forge-world-navigation.js"),css=file("forge-world-navigation.css");
const catalog=JSON.parse(file("projects.json"));
const portals=catalog.projects.filter(p=>p.world?.portal);
assert.equal(portals.length,6,"Exactly six featured homepage portals");
const count=(s,token)=>s.split(token).length-1;
assert.equal(count(index,'id="forge-reactor-trigger"'),1);
assert.equal(count(index,'id="forge-reactor-dialog"'),1);
assert.equal(count(index,'id="reactor-choose"'),1);
assert.equal(count(index,'id="reactor-worlds"'),1);
assert.equal(count(index,'id="reactor-mission"'),1);
assert.equal(count(index,'id="reactor-close"'),1);
assert.equal(count(project,'id="world-nav-links"'),1);
assert.equal(count(project,'id="world-nav-count"'),1);
assert.ok(index.includes('aria-haspopup="dialog"'),"Accessible reactor trigger");
assert.ok(index.includes('<dialog class="forge-reactor-dialog"'),"Native modal dialog");
assert.ok(index.includes('aria-controls="reactor-worlds"'),"Expandable world choices");
assert.ok(index.includes('href="./project.html?project=spark-lab"'),"Spark Lab linked through showcase");
assert.ok(index.includes('id="reactor-mission" href="#pipeline"'),"Pipeline link must be real");
for(const p of portals){
  assert.ok(index.includes('href="./project.html?project='+p.id+'"'),"Missing sphere "+p.id);
}
for(const page of [index,project]){
 assert.match(page,/forge-world-navigation\.js\?v=\d+/,"Navigation script missing");
 assert.match(page,/forge-world-navigation\.css\?v=\d+/,"Navigation CSS missing");
}
assert.match(js,/event\.ctrlKey \|\| event\.metaKey/,"Modified clicks must pass through");
assert.match(js,/anchor\.hasAttribute\("download"\)/,"Downloads must pass through");
assert.match(js,/document\.visibilityState === "hidden"/,"Do not animate hidden pages");
assert.match(js,/prefers-reduced-motion: reduce/,"Reduced motion safety");
assert.match(js,/window\.location\.assign\(world\.url\.href\)/,"Native URL preserved");
assert.match(js,/sessionStorage\.removeItem\(TRANSITION_KEY\)/,"Transition state cleanup");
assert.match(js,/dialog\.showModal\(\)/,"Accessible modal");
assert.match(js,/trigger\.focus\(\)/,"Return focus to Reactor trigger");
assert.match(css,/\.world-nav-link:focus-visible/,"World navigator keyboard focus");
assert.match(css,/@media\(max-width:760px\)/,"Responsive style");
assert.match(css,/@media\(prefers-reduced-motion:reduce\)/,"Motion fallback");
assert.match(css,/\.world-gate/,"Transition render styles");
console.log("PASS: six world shortcuts, World Navigator, Reactor dialog, transition and accessibility contracts.");
