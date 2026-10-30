import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {execFileSync} from "node:child_process";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const css = readFileSync(new URL("../forge-v31.css", import.meta.url), "utf8");
const js = readFileSync(new URL("../forge-v31.js", import.meta.url), "utf8");
const count = (source, expression) => [...source.matchAll(expression)].length;

assert.equal(count(html, /class="sphere-link (?:left|right|third|fourth|fifth|sixth)"/g), 6, "six existing sphere portals must remain");
for (const slug of ["footballforge","studyforge","fascination-files","safeforge","wow-lifeforge","wildrift-counter"]) {
  assert.ok(html.includes("./project.html?project=" + slug), "missing original world: " + slug);
}
for (const id of ["forge-reactor-trigger","forge-reactor-dialog","site-menu","catalog-grid","pipeline","observatory","pulse","spark-lab","vault","forge-feedback"]) {
  assert.ok(html.includes('id="' + id + '"'), "existing feature missing: " + id);
}
assert.equal(count(html, /class="v31-system-link"/g), 6, "six operations-deck links required");
for (const target of ["pipeline","observatory","pulse","spark-lab","vault","forge-feedback"]) {
  assert.ok(html.includes('class="v31-system-link" href="#' + target + '"'), "operations deck target missing: " + target);
}
assert.equal(count(html, /forge-v31\.css\?v=1/g), 1, "only one versioned v3.1 CSS reference");
assert.equal(count(html, /forge-v31\.js\?v=1/g), 1, "only one versioned v3.1 script reference");
assert.ok(html.indexOf("forge-v31.css") > html.indexOf("forge-search.css"), "visual overrides must load last");
assert.ok(html.includes('id="v31-focus-state"'), "progressive focus readout must exist");
assert.ok(css.includes("@media(max-width:760px)") && css.includes("@media(max-width:560px)"), "responsive design overrides required");
assert.ok(css.includes("prefers-reduced-motion:reduce"), "reduced-motion safety required");
assert.equal(count(css, /\{/g), count(css, /\}/g), "CSS braces must balance");
assert.ok(css.includes(".cards>.project:nth-child(6n+1)"), "asymmetrical product bays required");
assert.ok(js.includes('addEventListener("focus"') && js.includes('addEventListener("blur"'), "keyboard focus instrumentation required");
execFileSync(process.execPath, ["--check", new URL("../forge-v31.js", import.meta.url).pathname], {stdio:"pipe"});
console.log("NOVYX 3.1 design contracts passed (worlds, reactor, systems, mobile, motion, syntax).");
