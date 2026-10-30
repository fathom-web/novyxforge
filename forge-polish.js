/* NOVYX FORGE — signature interaction layer
   Progressive enhancement only. No network calls, dependencies or tracking. */
(() => {
  "use strict";
  const universe=document.querySelector(".hero .universe");
  const reduce=window.matchMedia("(prefers-reduced-motion: reduce)");
  const precise=window.matchMedia("(pointer: fine)");
  const colors={left:"102,209,255",right:"179,132,255",third:"183,137,255",fourth:"109,239,186",fifth:"255,188,109"};

  if(universe){
    const spheres=[...universe.querySelectorAll(".sphere-link")];
    const activate=orb=>{
      spheres.forEach(s=>s.dataset.energy=s===orb?"on":"off");
      universe.dataset.active=orb.classList.contains("left")?"football":orb.classList.contains("right")?"study":orb.classList.contains("third")?"fascination":orb.classList.contains("fourth")?"agile":"wow";
      const token=Object.keys(colors).find(n=>orb.classList.contains(n))||"left";
      universe.style.setProperty("--energy-rgb",colors[token]);
      universe.dataset.focusSphere=token;
    };
    const clear=()=>{
      delete universe.dataset.active;
      delete universe.dataset.focusSphere;
      spheres.forEach(s=>delete s.dataset.energy);
      universe.style.removeProperty("--energy-rgb");
    };
    spheres.forEach(s=>{
      s.addEventListener("pointerenter",()=>activate(s));
      s.addEventListener("focus",()=>activate(s));
      s.addEventListener("pointerleave",()=>{
        const hovered=spheres.find(n=>n.matches(":hover"));
        if(hovered)activate(hovered);
        else if(!spheres.includes(document.activeElement))clear();
      });
      s.addEventListener("blur",()=>{
        const hovered=spheres.find(n=>n.matches(":hover"));
        if(hovered)activate(hovered);else clear();
      });
    });
    universe.addEventListener("pointerleave",()=>{if(!spheres.includes(document.activeElement))clear();});
    document.addEventListener("visibilitychange",()=>{if(document.hidden)clear();});

    if(!reduce.matches && precise.matches){
      const cursor=document.createElement("span");
      cursor.className="novyx-cursor-light";
      cursor.setAttribute("aria-hidden","true");
      universe.prepend(cursor);
      let frame=0;
      let nextX=0,nextY=0;
      const draw=()=>{cursor.style.transform="translate3d("+(nextX-120)+"px,"+(nextY-120)+"px,0)";frame=0;};
      universe.addEventListener("pointermove",event=>{
        const rect=universe.getBoundingClientRect();
        nextX=event.clientX-rect.left;nextY=event.clientY-rect.top;
        cursor.classList.add("visible");
        if(!frame)frame=requestAnimationFrame(draw);
      },{passive:true});
      universe.addEventListener("pointerleave",()=>cursor.classList.remove("visible"),{passive:true});
      reduce.addEventListener?.("change",event=>{if(event.matches){cursor.remove();if(frame)cancelAnimationFrame(frame);}});
    }
  }
  // Refined glass cards lean gently towards the cursor; keyboard and touch
  // users get a fully static, accessible surface.
  if(!reduce.matches && precise.matches){
    document.querySelectorAll(".catalog-tile").forEach(card=>initializeTilt(card));
    const grid=document.getElementById("catalog-grid");
    if(grid){
      grid.addEventListener("pointerover",event=>{
        const card=event.target.closest(".catalog-tile");
        if(card && grid.contains(card))initializeTilt(card);
      },{passive:true});
    }
  }
  function initializeTilt(card){
    if(card.dataset.tiltReady)return;
    card.dataset.tiltReady="true";
    let scheduled=0;
    let pointerX=0,pointerY=0;
    card.addEventListener("pointermove",event=>{
      const rect=card.getBoundingClientRect();
      pointerX=(event.clientX-rect.left)/rect.width-.5;
      pointerY=(event.clientY-rect.top)/rect.height-.5;
      if(!scheduled)scheduled=requestAnimationFrame(()=>{
        card.style.setProperty("--tilt-y",(pointerX*4).toFixed(2)+"deg");
        card.style.setProperty("--tilt-x",(-pointerY*4).toFixed(2)+"deg");
        scheduled=0;
      });
    },{passive:true});
    card.addEventListener("pointerleave",()=>{
      card.style.removeProperty("--tilt-y");
      card.style.removeProperty("--tilt-x");
    },{passive:true});
  }

  // Show where the visitor is in the laboratory.
  if("IntersectionObserver" in window){
    const nav=[...document.querySelectorAll(".navlinks a[href^='#']")];
    const relevant=nav.map(a=>({a,section:document.querySelector(a.getAttribute("href"))})).filter(x=>x.section);
    const spy=new IntersectionObserver(entries=>{
      const matching=entries.filter(e=>e.isIntersecting);
      if(!matching.length)return;
      matching.sort((a,b)=>b.intersectionRatio-a.intersectionRatio);
      const id=matching[0].target.id;
      relevant.forEach(({a})=>{
        if(a.getAttribute("href")==="#"+id)a.setAttribute("aria-current","location");
        else a.removeAttribute("aria-current");
      });
    },{rootMargin:"-24% 0px -60% 0px",threshold:[0,.15,.45]});
    relevant.forEach(({section})=>spy.observe(section));
  }
})();