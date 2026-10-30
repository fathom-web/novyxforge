/* NOVYX 3.1.2 — progressive scroll focus.
   Decorative only. Real content and links work fully without this script. */
(() => {
  "use strict";
  const zones = [...document.querySelectorAll(".manifesto, .projects, .v312-module, .spark-feature, .v312-outro")];
  if (!zones.length || !("IntersectionObserver" in window)) return;
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) entry.target.classList.toggle("v312-current", entry.isIntersecting);
  }, {rootMargin:"-12% 0px -43% 0px", threshold:0});
  for (const zone of zones) observer.observe(zone);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) zones.forEach(zone => zone.classList.remove("v312-current"));
  });
})();
