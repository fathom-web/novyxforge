/**
 * NOVYX FORGE 3.0 — Command Search + Forge Feedback contracts.
 * Run: node tests/v3-search-feedback-check.mjs
 * Static/VM tests using built-in Node only. No external network calls.
 */
import {readFileSync} from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const home=read("index.html"),showcase=read("project.html");
const catalog=JSON.parse(read("projects.json"));
const activity=JSON.parse(read("activity.json"));
const search=read("forge-search.js"),feedback=read("forge-feedback.js");
const css=read("forge-search.css");
const templates=["feature_request.md","bug_report.md"];
for(const n of templates){
 const body=read(".github/ISSUE_TEMPLATE/"+n);
 assert.ok(body.includes("---"),"Missing GitHub issue template header");
 assert.ok(/Project/.test(body),"Template must capture a project");
}
assert.match(read(".github/ISSUE_TEMPLATE/config.yml"),/blank_issues_enabled/);
assert.match(home,/id="forge-feedback"/);
assert.match(showcase,/id="project-feedback-actions"/);
assert.match(showcase,/forge-feedback\.js\?v=\d+/);
assert.match(home,/forge-feedback\.js\?v=\d+/);
for(const page of [home,showcase]){
 assert.match(page,/data-forge-search/);
 assert.match(page,/forge-search\.js\?v=\d+/);
 assert.match(page,/forge-search\.css\?v=\d+/);
}
assert.match(css,/header-search-mobile/);
assert.match(css,/@media\(max-width:900px\)/);
assert.ok(!/localStorage|sessionStorage|indexedDB|WebSocket|XMLHttpRequest/.test(search),"Search should not persist queries");
assert.ok(!/localStorage|sessionStorage|indexedDB|fetch\s*\(/.test(feedback),"Feedback must be a GitHub handoff only");

const makeVM=script=>{
 const window={};
 const document={readyState:"loading",addEventListener:()=>{},getElementById:()=>null};
 const context={window,document,URLSearchParams,Intl,Date};
 vm.runInNewContext(script,context);
 return window;
};
const searchAPI=makeVM(search).NovyxSearchIndex;
assert.ok(searchAPI,"Missing local search API");
const items=searchAPI.buildIndex(catalog,activity);
assert.equal(items.filter(x=>x.kind==="Project").length,7,"Index all seven project worlds");
assert.equal(items.filter(x=>x.kind==="Idea").length,3,"Index Idea Vault");
assert.equal(items.filter(x=>x.kind==="Development").length,activity.items.length,"Index reviewed activity");
assert.ok(items.every(x=>searchAPI.publicHref(x.href)),"Only verified local/GitHub URLs");
const title=searchAPI.rank(items,"wild rift");
assert.equal(title[0].title,"Wild Rift Counter");
const duo=searchAPI.rank(items,"duo lane");
assert.ok(duo.some(x=>x.title==="Wild Rift Counter"));
const ideas=searchAPI.rank(items,"prompt studio");
assert.ok(ideas.some(x=>x.title==="Prompt Studio"));
const timeline=searchAPI.rank(items,"weather engine");
assert.ok(timeline.some(x=>x.kind==="Development"||x.kind==="Documentation"));
const noResults=searchAPI.rank(items,"zzzz-unfindable");
assert.equal(noResults.length,0);
assert.equal(searchAPI.publicHref("javascript:alert(1)"),false,"Block script links");
assert.equal(searchAPI.publicHref("https://example.com/evil"),false,"Block untrusted external domains");

const feedbackAPI=makeVM(feedback).NovyxFeedback;
assert.ok(feedbackAPI);
for(const p of catalog.projects){
 const url=feedbackAPI.linkFor("idea",p);
 const parsed=new URL(url);
 assert.equal(parsed.hostname,"github.com");
 assert.equal(parsed.pathname,"/fathom-web/novyxforge/issues/new");
 assert.equal(parsed.searchParams.get("template"),"feature_request.md");
 assert.ok(parsed.searchParams.get("body").includes(p.name));
 assert.ok(parsed.searchParams.get("title").includes(p.name));
 const bug=feedbackAPI.linkFor("bug",p);
 assert.equal(new URL(bug).searchParams.get("template"),"bug_report.md");
}
assert.ok(feedback.includes("public GitHub issue"));
assert.ok(feedback.includes("GitHub sign-in required"));
console.log("PASS: seven project search records, 3 ideas, reviewed events, safe links, mobile search and public project-prefilled feedback.");
