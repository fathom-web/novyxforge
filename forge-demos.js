/* NOVYX FORGE 3.0 / Interactive Demo Mode.
 * These are isolated, client-only simulations using invented example data.
 * NEVER connect them to FootballForge, StudyForge, SAFe or Riot APIs.
 * No storage, telemetry, audio or production writes.
 */
(() => {
"use strict";
const supported=new Set(["football","study","wildrift","safe"]);
const make=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=String(text);return e};
const add=(node,...children)=>{node.append(...children.filter(Boolean));return node};
const txt=(tag,text,cls="")=>make(tag,cls,text);
const button=(label,cls="demo-button")=>{const b=make("button",cls,label);b.type="button";return b};
const field=(labelText,control)=>{const f=make("label","demo-field");add(f,txt("span",labelText),control);return f};
const select=(options,current,change)=>{
 const s=make("select");for(const [value,label] of options){const o=make("option","",label);o.value=value;s.append(o)}
 s.value=current;s.addEventListener("change",()=>change(s.value));return s;
};
const status=(msg)=>{const p=txt("p",msg,"demo-info");p.setAttribute("role","status");return p};
const caption=t=>txt("div",t,"demo-caption");
function renderShell(root,title,subtitle,onReset){
 root.replaceChildren();
 const toolbar=make("div","demo-toolbar");
 const heading=make("div");
 add(heading,txt("small","NOVYX / INTERACTIVE SANDBOX"),txt("strong",title));
 const reset=button("↺ Reset demo","demo-reset");
 reset.setAttribute("aria-label","Reset "+title+" to its initial sample data");
 reset.addEventListener("click",onReset);
 add(toolbar,heading,reset);
 const layout=make("div","demo-layout");
 const controls=make("div","demo-controls"),preview=make("div","demo-preview");
 layout.append(controls,preview);
 const foot=make("div","demo-foot");
 add(foot,txt("strong","DEMO MODE · "),document.createTextNode(subtitle+" No account, no production app connection and no information is saved."));
 add(root,toolbar,layout,foot);
 return {controls,preview};
}
const fixture=Object.freeze([
 {id:1,label:"Keeper 01",role:"GK"},{id:2,label:"Fullback 02",role:"LB"},
 {id:3,label:"Centre-back 03",role:"LCB"},{id:4,label:"Centre-back 04",role:"RCB"},
 {id:5,label:"Fullback 05",role:"RB"},{id:6,label:"Midfielder 06",role:"LCM"},
 {id:7,label:"Midfielder 07",role:"CM"},{id:8,label:"Midfielder 08",role:"RCM"},
 {id:9,label:"Winger 09",role:"LW"},{id:10,label:"Striker 10",role:"ST"},
 {id:11,label:"Winger 11",role:"RW"},{id:12,label:"Defender 12",role:"LCB"},
 {id:13,label:"Midfielder 13",role:"CM"},{id:14,label:"Forward 14",role:"ST"},
 {id:15,label:"Winger 15",role:"RW"},{id:16,label:"Defender 16",role:"LB"}
]);
const formation=[["LW","ST","RW"],["LCM","CM","RCM"],["LB","LCB","RCB","RB"],["GK"]];
const positions=formation.flat();
function lineup(available){
 const pool=fixture.filter(p=>available.has(p.id)),used=new Set();
 const slots=positions.map(role=>{
   const same=pool.find(p=>p.role===role&&!used.has(p.id));
   const fill=same||pool.find(p=>!used.has(p.id)&&p.role!=="GK")||pool.find(p=>!used.has(p.id));
   if(fill)used.add(fill.id);
   return {role,player:fill||null};
 });
 const bench=pool.filter(p=>!used.has(p.id));
 return {slots,bench,available:pool.length};
}
function football(root){
 const available=new Set(fixture.map(p=>p.id));
 function render(){
  const {controls,preview}=renderShell(root,"FootballForge / Matchday","Fictional roster and example 4–3–3 formation.",reset);
  add(controls,txt("h3","Squad availability","demo-subheading"),
   txt("p","Uncheck a sample player to simulate an absence. The formation and bench update automatically.","demo-hint"));
  const roster=make("div","demo-stack");
  for(const p of fixture){
   const label=make("label","demo-toggle"),input=make("input");
   input.type="checkbox";input.checked=available.has(p.id);input.setAttribute("aria-label",p.label+" available");
   input.addEventListener("change",()=>{input.checked?available.add(p.id):available.delete(p.id);render()});
   add(label,input,txt("span",p.label),txt("em",p.role));roster.append(label);
  }
  controls.append(roster);
  const result=lineup(available),totals=make("div","demo-totals");
  for(const [label,num] of [["AVAILABLE",result.available],["STARTING",result.slots.filter(x=>x.player).length],["BENCH",result.bench.length]]){
   const pill=make("div","demo-total");add(pill,txt("b",num),txt("span",label));totals.append(pill);
  }
  add(preview,totals,txt("h3","Illustrative 4–3–3","demo-subheading"));
  const pitch=make("div","demo-pitch");
  pitch.setAttribute("role","img");pitch.setAttribute("aria-label","Sample formation with "+result.slots.filter(x=>x.player).length+" assigned players");
  const middle=make("div","demo-pitch-middle");
  const pos=make("div","demo-pitch-positions");
  for(const line of formation){
   const row=make("div","demo-pitch-line");
   for(const role of line){
     const entry=result.slots.find(x=>x.role===role);
     const cell=make("div","demo-player"+(role==="GK"?" gk":"")+(entry.player?"":" empty"));
     add(cell,txt("span",role,"demo-player-bubble"),txt("span",entry.player?entry.player.label:"Open position","demo-player-label"));
     row.append(cell);
   }pos.append(row);
  }
  add(pitch,middle,pos);preview.append(pitch);
  const bench=make("div","demo-bench");
  add(bench,txt("strong","BENCH / UNASSIGNED"),txt("span",result.bench.length?result.bench.map(p=>p.label).join(" · "):"No available substitutes"));
  add(preview,bench,status(result.available<11?"Fewer than eleven are available. Open positions remain visible.":"Change attendance to preview an adjusted lineup. The match planner remains a simplified demo."));
 }
 function reset(){available.clear();for(const p of fixture)available.add(p.id);render()}
 render();
}
const questions=Object.freeze([
 {prompt:"Which planet is known as the Red Planet?",choices:["Mercury","Mars","Jupiter","Venus"],answer:1,why:"Mars looks reddish because iron oxide covers much of its surface."},
 {prompt:"What does a thermometer measure?",choices:["Wind speed","Temperature","Sound","Distance"],answer:1,why:"A thermometer measures temperature."},
 {prompt:"Which process allows plants to use sunlight to make sugar?",choices:["Photosynthesis","Evaporation","Condensation","Erosion"],answer:0,why:"Photosynthesis converts light energy into chemical energy."},
 {prompt:"What is the largest ocean on Earth?",choices:["Atlantic","Indian","Arctic","Pacific"],answer:3,why:"The Pacific Ocean is the largest."}
]);
const flashcards=Object.freeze([
 ["What is gravity?","The attraction between objects that have mass."],
 ["What is an ecosystem?","Living things interacting with one another and their surroundings."],
 ["What is a prototype?","An early version made to test a design or idea."]
]);
function study(root){
 let mode="quiz",index=0,answer=null,score=0,card=0,flipped=false;
 function reset(){mode="quiz";index=0;answer=null;score=0;card=0;flipped=false;render()}
 function render(){
  const {controls,preview}=renderShell(root,"StudyForge / Practice Lab","Invented school-level questions and flashcards.",reset);
  add(controls,txt("h3","Choose how to practice","demo-subheading"),
   txt("p","Try a miniature learning journey. Answers and scores stay in this demo only.","demo-hint"));
  const tabs=make("div","demo-chip-row");
  for(const [key,label] of [["quiz","Practice test"],["flash","Flashcards"]]){
    const t=button(label,"demo-chip");t.setAttribute("aria-pressed",String(mode===key));
    t.addEventListener("click",()=>{mode=key;render()});tabs.append(t);
  }controls.append(tabs);
  if(mode==="quiz"){
    const q=questions[index];
    add(controls,caption("QUESTION "+(index+1)+" / "+questions.length),txt("h3",q.prompt,"demo-subheading"));
    const choices=make("div","demo-choices");
    q.choices.forEach((option,i)=>{
      const choice=button("","demo-choice"+(answer===null?"":i===q.answer?" correct":i===answer?" incorrect":""));
      choice.disabled=answer!==null;
      add(choice,txt("span",String.fromCharCode(65+i),"demo-choice-marker"),txt("span",option));
      choice.addEventListener("click",()=>{if(answer!==null)return;answer=i;if(i===q.answer)score++;render()});
      choices.append(choice);
    });controls.append(choices);
    if(answer!==null){controls.append(status((answer===q.answer?"Correct! ":"Not quite. ")+q.why));const next=button(index===questions.length-1?"Show results":"Next question →");next.addEventListener("click",()=>{if(index===questions.length-1){mode="result"}else{index++;answer=null}render()});controls.append(next);}
    add(preview,txt("h3","Your practice session","demo-subheading"));
    const progress=make("div","demo-quiz-progress");
    questions.forEach((_,i)=>progress.append(make("span",i<index||(i===index&&answer!==null)?"done":"")));
    add(preview,progress,txt("div",score+" correct answer"+(score!==1?"s":""),"demo-total"),txt("p","Answer one question at a time. You will see a short explanation before continuing.","demo-info"));
  }else if(mode==="result"){
    const finish=make("div","demo-finish");
    add(finish,txt("strong","Round completed"),txt("p","Score: "+score+" of "+questions.length+". This is sample practice, not a stored student result."));
    const again=button("Try again");again.addEventListener("click",reset);finish.append(again);controls.append(finish);
    add(preview,txt("h3","Practice summary","demo-subheading"),txt("div",Math.round(score/questions.length*100)+"%","demo-total"),txt("p","A full StudyForge session would track learning progress in the actual app. This demonstration never stores results.","demo-info"));
  }else{
    add(controls,txt("h3","Flashcard practice","demo-subheading"),txt("p","Reveal an answer, then continue to the next card.","demo-hint"));
    const flip=button("","demo-flashcard");
    flip.setAttribute("aria-label",flipped?"Show front of card":"Reveal flashcard answer");
    add(flip,txt("span",flipped?"ANSWER":"QUESTION"),txt("strong",flashcards[card][flipped?1:0]));
    flip.addEventListener("click",()=>{flipped=!flipped;render()});controls.append(flip);
    const actions=make("div","demo-flashcard-actions");
    const previous=button("← Previous","demo-button secondary");previous.addEventListener("click",()=>{card=(card+flashcards.length-1)%flashcards.length;flipped=false;render()});
    const next=button("Next →");next.addEventListener("click",()=>{card=(card+1)%flashcards.length;flipped=false;render()});
    actions.append(previous,next);controls.append(actions);
    add(preview,txt("h3","Recall practice","demo-subheading"),txt("p","Card "+(card+1)+" of "+flashcards.length+". Click the card to flip it.","demo-hint"),status("Learning happens through practice and repetition, not through this demo's temporary score."));
  }
 }
 render();
}
const roles=Object.freeze({
  baron:["Garen","Darius","Sett","Fiora"],jungle:["Lee Sin","Vi","Master Yi","Kha'Zix"],
  mid:["Ahri","Lux","Yasuo","Zed"],adc:["Jinx","Ashe","Caitlyn","Ezreal"],
  support:["Leona","Lulu","Nami","Thresh"]
});
const threat=Object.freeze({
 "Garen":"short-range durability","Darius":"extended melee trades","Sett":"close-range control","Fiora":"dueling and side-lane pressure",
 "Lee Sin":"early mobility and ganks","Vi":"targeted engage","Master Yi":"sustained damage","Kha'Zix":"isolated burst",
 "Ahri":"mobility and picks","Lux":"ranged poke and control","Yasuo":"melee mobility","Zed":"assassination pressure",
 "Jinx":"late-game scaling","Ashe":"slows and utility","Caitlyn":"long-range lane pressure","Ezreal":"safe poke and mobility",
 "Leona":"hard engage","Lulu":"protection and amplification","Nami":"healing and control","Thresh":"hooks and displacement"
});
const laneNames=Object.freeze({baron:"Baron lane",jungle:"Jungle",mid:"Mid lane",adc:"ADC",support:"Support"});
function wildrift(root){
 let lane="mid",enemy="Ahri",enemyAdc="Jinx",enemySupport="Leona";
 function reset(){lane="mid";enemy="Ahri";enemyAdc="Jinx";enemySupport="Leona";render()}
 function render(){
   const {controls,preview}=renderShell(root,"Wild Rift Counter / Draft Lab","Illustrative champion selections and strategy archetypes, not a patch-verified counter database.",reset);
   add(controls,txt("h3","Configure a sample draft","demo-subheading"),txt("p","Choose your lane and opposing champion(s). Duo lanes use both enemy ADC and Support.","demo-hint"));
   const laneSelect=select(Object.entries(laneNames),lane,v=>{lane=v;enemy=roles[v][0];render()});
   controls.append(field("Your role",laneSelect));
   const duo=lane==="adc"||lane==="support";
   if(duo){
     controls.append(field("Enemy ADC",select(roles.adc.map(c=>[c,c]),enemyAdc,v=>{enemyAdc=v;render()})));
     controls.append(field("Enemy Support",select(roles.support.map(c=>[c,c]),enemySupport,v=>{enemySupport=v;render()})));
   }else{
     controls.append(field("Lane opponent",select(roles[lane].map(c=>[c,c]),enemy,v=>{enemy=v;render()})));
   }
   add(controls,status("These champions are sample labels. This demonstration does not read current Wild Rift patch, win-rate or champion-counter data."));
   add(preview,txt("h3","Sample matchup considerations","demo-subheading"));
   const list=make("div","demo-results");
   const foes=duo?[enemyAdc,enemySupport]:[enemy];
   const match=make("div","demo-result-card");
   add(match,txt("span",duo?"2-VS-2 EXAMPLE":"1-VS-1 EXAMPLE"),txt("strong",foes.join(" + ")),
     txt("p",foes.map(f=>f+": "+threat[f]+".").join(" ")));list.append(match);
   const approaches=duo?[
      ["Lane priority","Consider the combined poke, sustain and engage potential of both opponents."],
      ["Duo synergy","Look at how your own ADC and support protect or enable one another."],
      ["Escape & vision","Think about wave position, crowd-control risk and the jungle matchup."]
     ]:lane==="jungle"?[
      ["Early pressure","Compare gank paths, objective timings and mobility."],
      ["Team composition","Review whether your team needs frontline, engage or damage."],
      ["Objective control","Consider vision, lane priority and contest tools."]
     ]:[
      ["Range and trading","Consider your opponent's range, sustain and trading pattern."],
      ["Safety & crowd control","Think about escapes, lockdown and ability timing."],
      ["Team composition","Counterpicks also need to work with the rest of your team."]
     ];
   const tips=make("div","demo-result-card");
   add(tips,txt("span","ILLUSTRATIVE DRAFT IDEAS"),txt("strong","What to evaluate"));
   const ol=make("ol");for(const [title,detail] of approaches)ol.append(txt("li",title+" — "+detail));tips.append(ol);list.append(tips);
   preview.append(list);
   preview.append(status("No 'best counter' is claimed here. Live matchup recommendations belong in Wild Rift Counter with versioned, validated patch data."));
 }
 render();
}
const templates=Object.freeze({
 RTE:[["PI Planning kickoff",0,"Align the ART on objectives and the planning cadence."],
      ["ART Sync",4,"Discuss cross-team blockers and dependencies."],
      ["System Demo",11,"Inspect integrated progress with stakeholders."],
      ["Inspect & Adapt",54,"Review outcomes and plan improvements."]],
 PM:[["PI Planning objectives",0,"Present priorities and expected business outcomes."],
     ["ART Sync",7,"Review features, risks and cross-team dependencies."],
     ["Stakeholder checkpoint",21,"Discuss emerging priorities and trade-offs."],
     ["PI outcome review",53,"Reflect on delivered value."]],
 PO:[["Team PI preparation",0,"Review the team backlog and objectives."],
     ["Backlog refinement",7,"Refine stories and clarify upcoming priorities."],
     ["Iteration review",13,"Discuss completed outcomes and feedback."],
     ["PI objective follow-up",41,"Reassess risks and remaining scope."]],
 SM:[["Team planning preparation",0,"Help the team get ready for its PI."],
     ["Team sync",3,"Surface blockers and coordinate daily work."],
     ["Iteration retrospective",13,"Inspect team collaboration and improve."],
     ["Improvement follow-up",27,"Track the experiments selected by the team."]]
});
function parseISO(v){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(v))return null;
 const date=new Date(v+"T12:00:00Z");
 return Number.isNaN(date.getTime())||date.toISOString().slice(0,10)!==v?null:date;
}
function addDays(date,num){const result=new Date(date.getTime());result.setUTCDate(result.getUTCDate()+num);return result}
const dateLabel=d=>new Intl.DateTimeFormat("en-GB",{timeZone:"UTC",day:"numeric",month:"short",year:"numeric"}).format(d);
function safe(root){
 let role="PO",start="2026-11-02";
 function reset(){role="PO";start="2026-11-02";render()}
 function render(){
  const {controls,preview}=renderShell(root,"SAFe Agile Forge / PI Lab","Fictional four-iteration PI example, not a prescribed or production calendar.",reset);
  add(controls,txt("h3","Prepare a sample PI","demo-subheading"),
    txt("p","Choose an ART role and a sample start date. The ceremony preview recalculates instantly.","demo-hint"));
  controls.append(field("Your ART role",select([["RTE","Release Train Engineer"],["PM","Product Manager"],["PO","Product Owner"],["SM","Scrum Master"]],role,v=>{role=v;render()})));
  const date=make("input");date.type="date";date.value=start;
  date.min="2020-01-01";date.max="2040-12-31";
  date.addEventListener("change",()=>{start=date.value;render()});
  controls.append(field("Example PI start date",date));
  add(controls,status("This is a simplified demonstration of planning logic. Dates and ceremony recommendations are illustrative, not official SAFe obligations."));
  add(preview,txt("h3","Sample PI overview","demo-subheading"));
  const valid=parseISO(start);
  if(!valid){preview.append(txt("p","Select a valid date between 2020 and 2040 to create the sample schedule.","demo-empty"));return}
  const iterations=make("div","demo-totals");
  for(let i=1;i<=4;i++){
    const pill=make("div","demo-total");
    add(pill,txt("b","I"+i),txt("span",dateLabel(addDays(valid,(i-1)*14))));iterations.append(pill);
  }preview.append(iterations);
  const sessions=make("div","demo-timeline");
  for(const [name,offset,note] of templates[role]){
    const item=make("article","demo-session");
    const t=make("time","",dateLabel(addDays(valid,offset)));t.dateTime=addDays(valid,offset).toISOString().slice(0,10);
    add(item,t,txt("strong",name),txt("p",note));sessions.append(item);
  }preview.append(sessions);
 }
 render();
}
const demos=Object.freeze({football,study,wildrift,safe});
function mount(project,element){
 if(!project||!element)return false;
 const id=project.showcase?.demo?.id;
 if(!supported.has(id)||typeof demos[id]!=="function")return false;
 element.dataset.demoId=id;demos[id](element);return true;
}
window.NovyxDemos=Object.freeze({mount,supported:Object.freeze([...supported])});
})();