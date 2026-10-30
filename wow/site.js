/* WoW Addon Foundry — tiny progressive enhancement.
   Navigation and all content remain usable without JavaScript. */
(() => {
  "use strict";
  const button = document.querySelector(".menu-toggle");
  const menu = document.getElementById("navigation");
  if (button && menu) {
    const close = () => {
      menu.classList.remove("open");
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-label", "Open navigation");
    };
    button.addEventListener("click", () => {
      const open = !menu.classList.contains("open");
      menu.classList.toggle("open", open);
      button.setAttribute("aria-expanded", String(open));
      button.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    });
    menu.addEventListener("click", event => {
      if (event.target.closest('a[href^="#"]')) close();
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        const wasOpen = menu.classList.contains("open");
        close();
        if (wasOpen) button.focus();
      }
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 880) close();
    }, {passive: true});
  }
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
