/* NOVYX FORGE 3.0 / Weather Worlds, zero dependencies.
   Only decorative canvas rendering. No API calls, tracking, audio or flashes.
   Hosted on the public showcase hero and configured via projects.json. */
(() => {
"use strict";
const TYPES=new Set(["rain","snow","meteors","fog","storm","wind","sunrise"]);
const media=window.matchMedia("(prefers-reduced-motion: reduce)");
const touch=window.matchMedia("(pointer: coarse)");
const preferenceKey="novyx.atmosphere.enabled.v1";
let saved=true;
try{saved=localStorage.getItem(preferenceKey)!=="false";}catch(e){/* storage may be disabled */}
const instances=new Set();
const rnd=(a,b)=>a+Math.random()*(b-a);
const clamp=(n,lo,hi)=>Math.max(lo,Math.min(hi,n));
function mount(hero,config){
 if(!hero||!config||!TYPES.has(config.type))return null;
 if(hero.querySelector(".weather-layer"))return null;
 const type=config.type, rgb=/^\d{1,3},\d{1,3},\d{1,3}$/.test(config.rgb||"")?config.rgb:"105,188,233";
 const layer=document.createElement("div");
 layer.className="weather-layer";
 layer.setAttribute("aria-hidden","true");
 layer.dataset.type=type;
 layer.style.setProperty("--weather-rgb",rgb);
 const canvas=document.createElement("canvas");
 canvas.setAttribute("aria-hidden","true");
 layer.append(canvas);
 hero.prepend(layer);
 const ctx=canvas.getContext("2d",{alpha:true,desynchronized:true});
 const state={hero,canvas,ctx,layer,type,rgb,particles:[],active:false,visible:true,enabled:saved,motion:!media.matches,width:0,height:0,dpr:1,last:0,raf:0,destroyed:false,frame:0};
 instances.add(state);
 const controls=document.createElement("div");
 controls.className="atmosphere-controls";
 const chip=document.createElement("span");chip.className="atmosphere-chip";
 chip.textContent="World atmosphere · "+(config.title||type);
 const button=document.createElement("button");
 button.className="atmosphere-toggle";button.type="button";
 controls.append(chip,button);
 const target=hero.querySelector(".hero-actions")||hero.querySelector(".hero-copy")||hero;
 target.append(controls); // Actions remain directly before the atmosphere control.
 function syncControls(){
   state.motion=!media.matches;
   layer.dataset.enabled=String(state.enabled);
   layer.dataset.motion=state.motion?"animated":"static";
   button.setAttribute("aria-pressed",String(state.enabled));
   button.textContent=state.enabled?(state.motion?"Atmosphere: On":"Atmosphere: Static"):"Atmosphere: Off";
   button.setAttribute("aria-label",state.enabled?"Turn atmosphere off":"Turn atmosphere on");
   updateAnimation();
 }
 const drawSize=()=>{
   const r=hero.getBoundingClientRect(), mobile=touch.matches||window.innerWidth<800;
   const width=Math.max(1,Math.ceil(r.width+20)),height=Math.max(1,Math.ceil(r.height));
   state.width=width;state.height=height;
   state.dpr=Math.min(window.devicePixelRatio||1,mobile?1.2:1.5);
   if(ctx){
     canvas.width=Math.min(2600,Math.round(width*state.dpr));
     canvas.height=Math.min(1600,Math.round(height*state.dpr));
     ctx.setTransform(state.dpr,0,0,state.dpr,0,0);
   }
   const area=width*height,level=clamp(Number(config.level)||1,.3,1.2);
   const count=Math.round(clamp(area/5400,28,mobile?65:140)*level);
   const n=type==="fog"?Math.min(12,Math.ceil(count/7)):type==="meteors"?Math.min(38,count):count;
   state.particles=Array.from({length:n},()=>newParticle(state,true));
 };
 function newParticle(s,randomY=false){
   const o={x:rnd(0,s.width),y:randomY?rnd(0,s.height):-rnd(4,80),r:rnd(.6,2.6),vx:0,vy:0,opacity:rnd(.22,.76),length:rnd(9,29),t:rnd(0,Math.PI*2)};
   switch(s.type){
    case "rain":o.vx=rnd(-50,-20);o.vy=rnd(390,680);o.r=rnd(.6,1.2);o.length=rnd(13,26);break;
    case "snow":o.vx=rnd(-7,12);o.vy=rnd(15,45);o.r=rnd(1.2,3);break;
    case "meteors":o.vx=rnd(-94,-45);o.vy=rnd(70,150);o.r=rnd(.5,2);o.length=rnd(16,68);break;
    case "fog":o.vx=rnd(5,18);o.vy=rnd(-3,2);o.r=rnd(54,135);o.opacity=rnd(.035,.09);break;
    case "storm":o.vx=rnd(-18,-5);o.vy=rnd(24,64);o.r=rnd(1.1,2.3);o.opacity=rnd(.2,.62);break;
    case "wind":o.vx=rnd(80,230);o.vy=rnd(-25,14);o.length=rnd(18,68);o.r=rnd(.4,1.4);break;
    case "sunrise":o.vx=rnd(-8,8);o.vy=rnd(-52,-17);o.r=rnd(.7,2.2);break;
   }
   return o;
 }
 function frame(now){
   state.raf=0;
   if(!state.active||!ctx||state.destroyed)return;
   const mobile=touch.matches||window.innerWidth<800;
   if(now-state.frame<(mobile?34:20)){state.raf=requestAnimationFrame(frame);return;}
   state.frame=now;
   const dt=clamp((now-(state.last||now))/1000,0,.05);state.last=now;
   const W=state.width,H=state.height;
   ctx.clearRect(0,0,W,H);
   const palette=type==="snow"?"202,189,255":type==="meteors"?"255,142,222":type==="storm"?"255,191,110":type==="sunrise"?"255,212,154":type==="wind"?"109,225,237":state.rgb;
   for(let i=0;i<state.particles.length;i++){
      const p=state.particles[i];p.t+=dt;
      p.x+=p.vx*dt;p.y+=p.vy*dt;
      if(type==="snow")p.x+=Math.sin(p.t*1.2+i)*dt*7;
      if(type==="fog")p.y+=Math.sin(p.t*.43+i)*dt*.9;
      if(p.y>H+70||p.x>W+100||p.x<-120||p.y<-130){
        const fresh=newParticle(state);
        if(type==="wind"){fresh.x=-40;fresh.y=rnd(0,H);}
        if(type==="sunrise"){fresh.y=H+rnd(0,55);}
        if(type==="fog"){fresh.x=-80;fresh.y=rnd(0,H);}
        state.particles[i]=fresh;continue;
      }
      if(type==="fog"){
        const gradient=ctx.createRadialGradient(p.x,p.y,1,p.x,p.y,p.r);
        gradient.addColorStop(0,"rgba("+palette+","+p.opacity+")");
        gradient.addColorStop(1,"rgba("+palette+",0)");
        ctx.fillStyle=gradient;ctx.beginPath();ctx.ellipse(p.x,p.y,p.r,p.r*.43,0,0,Math.PI*2);ctx.fill();
      }else if(["rain","meteors","wind"].includes(type)){
        const alpha=type==="meteors"?p.opacity*.52:p.opacity*.65;
        ctx.strokeStyle="rgba("+palette+","+alpha+")";
        ctx.lineWidth=p.r;
        ctx.beginPath();ctx.moveTo(p.x,p.y);
        const dx=type==="rain"?p.length*.28:type==="wind"?-p.length:-p.length*.75;
        const dy=type==="wind"?p.length*.07:-p.length;
        ctx.lineTo(p.x+dx,p.y+dy);ctx.stroke();
      }else{
        const alpha=type==="storm"?p.opacity*.65:p.opacity;
        ctx.fillStyle="rgba("+palette+","+alpha+")";
        ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();
      }
   }
   state.raf=requestAnimationFrame(frame);
 }
 function updateAnimation(){
   const desired=state.enabled && state.motion && state.visible && !document.hidden && Boolean(ctx);
   if(desired===state.active)return;
   state.active=desired;
   if(desired){state.last=0;state.frame=0;state.raf=requestAnimationFrame(frame);}
   else {if(state.raf)cancelAnimationFrame(state.raf);state.raf=0;if(ctx)ctx.clearRect(0,0,state.width,state.height);}
 }
 button.addEventListener("click",()=>{
   const newValue=!state.enabled;
   try{localStorage.setItem(preferenceKey,String(newValue));}catch(e){/* storage disabled */}
   for(const s of instances){s.enabled=newValue;s.refresh();}
 });
 state.refresh=syncControls;
 const onMotion=()=>{for(const s of instances)s.refresh()};
 media.addEventListener?.("change",onMotion);
 const observer=typeof IntersectionObserver==="function"?new IntersectionObserver(entries=>{state.visible=entries[0]?.isIntersecting??true;updateAnimation();},{threshold:.02}):null;
 observer?.observe(hero);
 const resize=typeof ResizeObserver==="function"?new ResizeObserver(()=>{drawSize();updateAnimation()}):null;
 resize?.observe(hero);
 let resizeFallback;
 if(!resize){resizeFallback=()=>{drawSize();updateAnimation()};window.addEventListener("resize",resizeFallback,{passive:true});}
 const visibility=()=>updateAnimation();
 document.addEventListener("visibilitychange",visibility);
 drawSize();syncControls();
 state.destroy=()=>{
   if(state.destroyed)return;
   state.destroyed=true;state.active=false;
   if(state.raf)cancelAnimationFrame(state.raf);
   observer?.disconnect();resize?.disconnect();
   if(resizeFallback)window.removeEventListener("resize",resizeFallback);
   document.removeEventListener("visibilitychange",visibility);
   media.removeEventListener?.("change",onMotion);
   button.remove();controls.remove();layer.remove();instances.delete(state);
 };
 return state;
}
window.NovyxWeather=Object.freeze({mount,types:[...TYPES]});
})();