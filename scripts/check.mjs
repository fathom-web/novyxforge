import {execFileSync} from 'node:child_process';
import {readdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const suites=['v3-alpha-check','v3-navigation-check','v3-demos-check','v3-observatory-check','v3-search-feedback-check','v31-design-check','v311-layout-check','v312-continuity-check','wow-hub-check','v4-content-check'];
for(const file of readdirSync(root).filter(x=>x.endsWith('.js')))execFileSync(process.execPath,['--check',file],{cwd:root,stdio:'inherit'});
for(const suite of suites)execFileSync(process.execPath,['tests/'+suite+'.mjs'],{cwd:root,stdio:'inherit'});
console.log('All JavaScript syntax checks and '+suites.length+' contract suites passed.');
