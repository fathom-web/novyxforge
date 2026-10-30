/* NOVYX FORGE 3.0 / Forge Feedback
   External GitHub issue hand-off. Nothing is submitted from this site.
   GitHub sign-in required and submitted issues are publicly visible.
 */
(() => {
 "use strict";
 const repo="https://github.com/fathom-web/novyxforge/issues/new";
 const VALID=/^[a-z0-9-]{1,50}$/;
 function linkFor(type,project){
   if(type!=="idea"&&type!=="bug")return null;
   const name=typeof project?.name==="string"?project.name.slice(0,100):"NOVYX FORGE";
   const id=typeof project?.id==="string"&&VALID.test(project.id)?project.id:"novyxforge";
   const isIdea=type==="idea";
   const params=new URLSearchParams();
   params.set("template",isIdea?"feature_request.md":"bug_report.md");
   params.set("title",(isIdea?"[Idea] ":"[Bug] ")+name+" — ");
   const text=isIdea?
     "## Project\n"+name+" ("+id+")\n\n## What would you like to improve?\n\n\n## Your idea\n\n\n## Why would this help?\n\n\n## Other context (optional)\n":
     "## Project\n"+name+" ("+id+")\n\n## What happened?\n\n\n## Steps to reproduce\n1. \n2. \n3. \n\n## What did you expect?\n\n\n## Browser and device (optional)\n";
   // GitHub supports title/body URL fields, while the repo templates remain a fallback.
   params.set("body",text+"\nPlease avoid sharing passwords, private accounts, real student data or sensitive information.");
   return repo+"?"+params.toString();
 }
 const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n};
 function action(type,project){
   const label=type==="idea"?"Suggest an improvement":"Report a bug";
   const anchor=el("a","feedback-action");
   anchor.href=linkFor(type,project);
   anchor.target="_blank";
   anchor.rel="noopener noreferrer";
   const badge=el("span","feedback-action-icon",type==="idea"?"✦":"◇");
   badge.setAttribute("aria-hidden","true");
   const wrap=el("span","feedback-action-copy");
   wrap.append(el("strong","",label),
     el("small","",type==="idea"?"Propose a useful new capability":"Help us reproduce a public-facing issue"));
   anchor.append(badge,wrap,el("span","feedback-action-arrow","↗"));
   return anchor;
 }
 function mount(element,project){
   if(!element)return false;
   element.replaceChildren();
   const actions=el("div","feedback-actions");
   actions.append(action("idea",project),action("bug",project));
   const notice=el("p","feedback-notice");
   notice.append(
     el("strong","","GitHub sign-in required. "),
     document.createTextNode("You'll leave NOVYX to review and submit a public GitHub issue. No feedback is sent until you submit it on GitHub. Don't include passwords, private records, personal student data or other sensitive information.")
   );
   element.append(actions,notice);
   return true;
 }
 window.NovyxFeedback=Object.freeze({mount,linkFor});
 const home=document.getElementById("forge-feedback-actions");
 if(home)mount(home,{id:"novyxforge",name:"NOVYX FORGE"});
})();