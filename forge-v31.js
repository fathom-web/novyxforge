/* NOVYX FORGE 3.1: progressive HUD instrumentation.
   Never changes world links, reactor controls, search, weather or navigation. */
(() => {
  "use strict";
  const universe = document.querySelector(".hero .universe");
  const readout = document.getElementById("v31-focus-state");
  if (!universe || !readout) return;

  const worlds = [
    ["left", "FOOTBALLFORGE / SPORT SYSTEM"],
    ["right", "STUDYFORGE / LEARNING SYSTEM"],
    ["third", "FASCINATION FILES / DISCOVERY"],
    ["fourth", "SAFE FORGE / PLANNING SYSTEM"],
    ["fifth", "WOW LIFEFORGE / GAMING"],
    ["sixth", "WILD RIFT / MATCHUP SYSTEM"]
  ];

  const clear = () => {
    readout.textContent = "SELECT A WORLD";
    universe.removeAttribute("data-v31-focus");
  };

  for (const [worldClass, label] of worlds) {
    const link = universe.querySelector(".sphere-link." + worldClass);
    if (!link) continue;
    const focus = () => {
      readout.textContent = label;
      universe.setAttribute("data-v31-focus", worldClass);
    };
    link.addEventListener("pointerenter", focus, {passive: true});
    link.addEventListener("pointerleave", clear, {passive: true});
    link.addEventListener("focus", focus);
    link.addEventListener("blur", clear);
  }

  // Keep the HUD a progressive enhancement: hiding it never hides navigation.
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) clear();
  });
})();
