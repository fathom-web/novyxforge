/* NOVYX FORGE 3.0 / Increment 2
 * Single progressive enhancement module for World Navigator,
 * cinematic cross-document World Transitions and the Forge Reactor.
 * All navigation remains ordinary real hrefs when JavaScript is disabled.
 * No external dependencies, tracking, network writes or audio.
 */
(() => {
  "use strict";
  const CATALOG_URL = "./projects.json";
  const TRANSITION_KEY = "novyx.world-transit.v1";
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const worldById = new Map();
  const $ = (selector, root = document) => root.querySelector(selector);
  const create = (tag, cls, value) => {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (value !== undefined) el.textContent = String(value);
    return el;
  };
  const internalWorld = (href) => {
    try {
      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin || !url.pathname.endsWith("/project.html")) return null;
      const id = url.searchParams.get("project");
      return id && /^[a-z0-9-]{1,50}$/.test(id) ? { id, url } : null;
    } catch (_) { return null; }
  };
  const safeColor = rgb => /^\d{1,3},\d{1,3},\d{1,3}$/.test(rgb || "") ? rgb : "111,196,242";
  const fromProject = p => {
    const rgb = safeColor(p.world?.weather?.rgb);
    return { id: p.id, name: p.name, rgb, accent: p.accent || "#8fdfff",
      type: p.world?.weather?.type || "", portal: p.world?.portal === true,
      href: "./project.html?project=" + encodeURIComponent(p.id) };
  };
  const validCatalog = data => Array.isArray(data?.projects) ? data.projects.filter(p =>
    p && /^[a-z0-9-]{1,50}$/.test(p.id) && typeof p.name === "string" && p.world?.weather
  ).map(fromProject) : [];
  const statusEl = document.getElementById("novyx-world-status");
  function announce(msg) { if (statusEl) statusEl.textContent = msg; }
  const gallery = document.getElementById("world-nav-links");

  function makeLink(world, current) {
    const anchor = create("a", "world-nav-link");
    anchor.href = world.href;
    anchor.dataset.worldId = world.id;
    anchor.style.setProperty("--world-rgb", world.rgb);
    anchor.title = "Enter " + world.name;
    const dot = create("span", "world-nav-dot");
    dot.setAttribute("aria-hidden", "true");
    anchor.append(dot, create("span", "world-nav-name", world.name));
    if (world.id === current) {
      anchor.classList.add("is-current");
      anchor.setAttribute("aria-current", "page");
      anchor.title = "Current world: " + world.name;
    }
    return anchor;
  }

  function renderNavigator(worlds) {
    if (!gallery) return;
    const current = new URLSearchParams(location.search).get("project");
    const items = worlds.filter(w => w.portal);
    const spark = worlds.find(w => w.id === "spark-lab");
    gallery.replaceChildren();
    for (const world of items) gallery.append(makeLink(world, current));
    if (spark) {
      const sep = create("span", "world-nav-divider");
      sep.setAttribute("aria-hidden", "true");
      gallery.append(sep, makeLink(spark, current));
    }
    const count = document.getElementById("world-nav-count");
    if (count) count.textContent = items.length + " WORLDS";
  }

  function reactorButton(text, className) {
    const button = create("button", className, text);
    button.type = "button";
    return button;
  }
  function setupReactor(worlds) {
    const trigger = document.getElementById("forge-reactor-trigger");
    const dialog = document.getElementById("forge-reactor-dialog");
    if (!trigger || !dialog || typeof dialog.showModal !== "function") return;
    const choose = $("#reactor-choose", dialog);
    const choices = $("#reactor-worlds", dialog);
    const close = $("#reactor-close", dialog);
    const mission = $("#reactor-mission", dialog);
    const homeLink = $("#reactor-home", dialog);
    if (!choose || !choices || !close || !mission || !homeLink) return;
    const supported = worlds.filter(w => w.portal);
    choices.replaceChildren();
    for (const world of supported) choices.append(makeLink(world, ""));
    choices.setAttribute("aria-label", "Choose a project world");
    const onOpen = () => {
      choose.setAttribute("aria-expanded", "false");
      choices.hidden = true;
      dialog.showModal();
      document.documentElement.classList.add("reactor-is-open");
      choose.focus();
      announce("Forge Reactor opened");
    };
    trigger.addEventListener("click", onOpen);
    close.addEventListener("click", () => dialog.close());
    dialog.addEventListener("close", () => {
      document.documentElement.classList.remove("reactor-is-open");
      trigger.focus({preventScroll:true});
    });
    dialog.addEventListener("click", event => {
      if (event.target === dialog) dialog.close();
    });
    choose.addEventListener("click", () => {
      const expanded = choose.getAttribute("aria-expanded") === "true";
      choose.setAttribute("aria-expanded", String(!expanded));
      choices.hidden = expanded;
      if (!expanded) choices.querySelector("a")?.focus();
    });
    mission.addEventListener("click", () => dialog.close());
    homeLink.addEventListener("click", () => dialog.close());
  }

  let gate = null, leaving = false;
  function openGate(rgb, name, arrival = false) {
    if (!gate) {
      gate = create("div", "world-gate");
      gate.setAttribute("aria-hidden", "true");
      const warp = create("div", "world-gate-warp");
      warp.append(create("span", "world-gate-ring ring-one"),
                  create("span", "world-gate-ring ring-two"),
                  create("span", "world-gate-ring ring-three"));
      const label = create("span", "world-gate-label");
      warp.append(label);
      gate.append(warp);
      document.body.append(gate);
    }
    gate.style.setProperty("--gate-rgb", rgb);
    $(".world-gate-label", gate).textContent = name || "NOVYX WORLD";
    gate.classList.toggle("is-arrival", arrival);
    return gate;
  }

  // Keep normal links as the source of truth. Respect every browser convention.
  document.addEventListener("click", event => {
    if (event.defaultPrevented || event.button !== 0 ||
        event.ctrlKey || event.metaKey || event.shiftKey || event.altKey ||
        motionQuery.matches || leaving || document.visibilityState === "hidden") return;
    const anchor = event.target.closest?.("a[href]");
    if (!anchor || (anchor.target && anchor.target !== "_self") ||
        anchor.hasAttribute("download")) return;
    const world = internalWorld(anchor.href);
    if (!world || !worldById.has(world.id) ||
        world.url.href === location.href) return;
    // Leave URL untouched when no transition can be shown.
    event.preventDefault();
    leaving = true;
    const config = worldById.get(world.id);
    const rgb = safeColor(config.rgb);
    const panel = openGate(rgb, config.name);
    announce("Entering " + config.name);
    try { sessionStorage.setItem(TRANSITION_KEY, JSON.stringify({
      id: world.id, at: Date.now()
    })); } catch (_) { /* private browsing: visual effect still works */ }
    requestAnimationFrame(() => panel.classList.add("is-departing"));
    // The timeout is deliberately short: never strand visitors in an animation.
    window.setTimeout(() => window.location.assign(world.url.href), 380);
  });

  function arrivalGate() {
    if (motionQuery.matches) return;
    let meta = null;
    try {
      const raw = sessionStorage.getItem(TRANSITION_KEY);
      sessionStorage.removeItem(TRANSITION_KEY);
      if (raw) meta = JSON.parse(raw);
    } catch (_) { return; }
    if (!meta || Date.now() - meta.at > 4500 || !worldById.has(meta.id)) return;
    const here = new URLSearchParams(location.search).get("project");
    if (here !== meta.id) return;
    const world = worldById.get(meta.id);
    const panel = openGate(world.rgb, world.name, true);
    panel.classList.add("is-arrived");
    requestAnimationFrame(() => requestAnimationFrame(() => panel.classList.add("is-disappearing")));
    window.setTimeout(() => { panel.remove(); gate = null; }, 650);
  }

  async function init() {
    let worlds = [];
    try {
      const response = await fetch(CATALOG_URL, {cache:"no-store"});
      if (!response.ok) throw new Error("Catalog HTTP error");
      worlds = validCatalog(await response.json());
    } catch (_) {
      announce("Project worlds are temporarily unavailable. Existing project links still work.");
    }
    for (const world of worlds) worldById.set(world.id, world);
    if (worlds.length) {
      renderNavigator(worlds);
      setupReactor(worlds);
      arrivalGate();
    }
    // Ensure the reactor can still open its static actions during catalog outages.
    else {
      const trigger = document.getElementById("forge-reactor-trigger");
      const dialog = document.getElementById("forge-reactor-dialog");
      const close = document.getElementById("reactor-close");
      if (trigger && typeof dialog?.showModal === "function") {
        const choose = document.getElementById("reactor-choose");
        const choices = document.getElementById("reactor-worlds");
        if (choose && choices) {
          choices.hidden = true;
          choose.addEventListener("click", () => {
            dialog.close();
            location.hash = "projects";
          });
        }
        trigger.addEventListener("click", () => {
          dialog.showModal();
          choose?.focus();
        });
        close?.addEventListener("click", () => dialog.close());
        dialog.addEventListener("close", () => trigger.focus());
        dialog.addEventListener("click", e => {if(e.target===dialog)dialog.close();});
      }
      const empty = create("a", "world-nav-link", "← All projects");
      empty.href = "./index.html#projects";
      gallery?.replaceChildren(empty);
    }
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init, {once: true});
  else init();
})();