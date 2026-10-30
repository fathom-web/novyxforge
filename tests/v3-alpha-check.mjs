/**
 * NOVYX FORGE 3.0 Alpha — config and wiring smoke checks.
 * Run from repo root: node tests/v3-alpha-check.mjs
 * No npm dependencies or external network calls.
 */
import {readFileSync} from "node:fs";
import assert from "node:assert/strict";
const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const catalog=JSON.parse(read("projects.json"));
const index=read("index.html");
const detail=read("project.html");
const pageScript=read("project-showcase.js");
const engine=read("forge-weather.js");
const universeCss=read("forge-universe-v3.css");
const weatherCss=read("forge-weather.css");
const polish=read("forge-polish.js");
const worlds=["footballforge","studyforge","fascination-files","safeforge","wow-lifeforge","wildrift-counter","spark-lab"];
const presets=["rain","snow","meteors","fog","storm","wind","sunrise"];
assert.equal(catalog.projects.length,7,"Expected seven catalog projects");
assert.deepEqual(catalog.projects.map(p=>p.id),worlds,"World order must match selected experiences");
assert.deepEqual(catalog.projects.map(p=>p.world.weather.type),presets,"One known weather preset per world");
assert.equal(catalog.projects.filter(p=>p.world.portal).length,6,"Six homepage worlds and one Spark Lab tool");
for(const p of catalog.projects){
 assert.match(p.world.weather.rgb,/^\d{1,3},\d{1,3},\d{1,3}$/);
 assert.match(p.accent,/^#[a-f0-9]{6}$/i);
 assert.ok(p.showcase?.views?.length>=3,"Showcase missing "+p.id);
}
const spheres=[...index.matchAll(/<a class="sphere-link (\w+)" href="([^"]+)"/g)];
assert.equal(spheres.length,6,"Six homepage spheres");
assert.deepEqual(spheres.map(x=>x[2]),worlds.slice(0,6).map(id=>"./project.html?project="+id));
assert.equal((index.match(/class="project project-(?:study|football|fascination|agile|wow|wildrift) reveal"/g)||[]).length,6);
assert.match(index,/forge-universe-v3\.css\?v=\d+/,"Universe stylesheet missing");
assert.match(index,/forge-polish\.js\?v=\d+/,"Reactive Forge script missing");
assert.match(detail,/forge-weather\.css\?v=\d+/);
assert.match(detail,/forge-weather\.js\?v=\d+/);
assert.match(pageScript,/NovyxWeather\.mount/);
for(const mode of presets)assert.ok(engine.includes('"'+mode+'"'),"Missing weather engine "+mode);
for(const feature of ["requestAnimationFrame","IntersectionObserver","visibilitychange","prefers-reduced-motion","localStorage","cancelAnimationFrame"])assert.ok(engine.includes(feature),"Missing safety capability "+feature);
assert.match(universeCss,/@media\(max-width:760px\)/);
assert.match(universeCss,/\.sphere-link\.sixth/);
assert.match(weatherCss,/\.atmosphere-toggle/);
assert.match(polish,/sixth:"94,223,231"/);
assert.ok(!engine.includes("AudioContext")&&!engine.includes("fetch("),"Weather engine must be entirely offline and silent");
console.log("PASS: six spheres, seven weather presets, shared catalog wiring, responsive and motion safety.");
