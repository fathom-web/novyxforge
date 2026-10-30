import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const source=readFileSync(new URL("../index.html",import.meta.url),"utf8");
const css=readFileSync(new URL("../forge-v311.css",import.meta.url),"utf8");

assert.equal((source.match(/class="sphere-link (left|right|third|fourth|fifth|sixth)"/g)||[]).length,6);
assert.equal((source.match(/forge-v311\.css\?v=1/g)||[]).length,1);
assert.ok(source.indexOf("forge-v311.css")>source.indexOf("forge-v31.css"),"latest CSS should be last");
assert.equal((source.match(/class="v311-cosmos"/g)||[]).length,1);
assert.ok(source.includes('id="forge-reactor-trigger"'));
assert.ok(source.includes('id="forge-reactor-dialog"'));
for(const id of ["pipeline","observatory","pulse","spark-lab","vault","forge-feedback"])
  assert.ok(source.includes('id="'+id+'"'),"system lost: "+id);
for(const id of ["footballforge","studyforge","fascination-files","safeforge","wow-lifeforge","wildrift-counter"])
  assert.ok(source.includes("./project.html?project="+id),"world link lost: "+id);
assert.equal((css.match(/\{/g)||[]).length,(css.match(/\}/g)||[]).length,"balanced CSS");
for(const rule of [
  ".v311-cosmos", ".hero .universe .sphere-link",
  "grid-template-columns:minmax(0,1fr) 174px",
  "grid-template-columns:174px minmax(0,1fr)",
  "@media(max-width:760px)", "@media(max-width:420px)",
  "@media(prefers-reduced-motion:reduce)"
])assert.ok(css.includes(rule),"3.1.1 stylesheet missing "+rule);
assert.ok(!css.includes("url(http"),"do not depend on third-party background assets");
console.log("PASS NOVYX 3.1.1 layout contracts, world navigation and mobile/accessibility fallbacks");
