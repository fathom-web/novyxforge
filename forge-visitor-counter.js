/* Simple nostalgic visitor number: real server-side counts, no fake seed or user profiling. */
(() => {
  'use strict';
  const counters = [...document.querySelectorAll('[data-forge-visit-counter]')];
  if (!counters.length) return;
  const seenKey = 'novyx-visit-counter-v1';
  const render = (count) => {
    const digits = String(count).padStart(7, '0');
    counters.forEach(counter => {
      const display = counter.querySelector('[data-forge-visit-digits]');
      if (!display) return;
      display.replaceChildren(...[...digits].map(character => {
        const digit = document.createElement('span');
        digit.className = 'forge-visit-digit';
        digit.textContent = character;
        return digit;
      }));
      counter.dataset.counterStatus = 'live';
      counter.setAttribute('aria-label', 'Visit number ' + count + ' since this counter was launched');
      counter.classList.remove('is-updated');
      // Trigger the brief mechanical-number animation once new data arrives.
      void counter.offsetWidth;
      counter.classList.add('is-updated');
    });
  };
  const unavailable = () => counters.forEach(counter => {
    counter.dataset.counterStatus = 'offline';
    counter.setAttribute('aria-label', 'Visitor counter temporarily unavailable');
    const display = counter.querySelector('[data-forge-visit-digits]');
    if (display) display.textContent = '— — —';
  });
  (async () => {
    let seen = false;
    try { seen = sessionStorage.getItem(seenKey) === '1'; } catch {}
    const response = await fetch('./api/visitor-counter.php', {
      method: seen ? 'GET' : 'POST',
      credentials: 'same-origin',
      cache: 'no-store',
      headers: { 'Accept': 'application/json' }
    });
    if (!response.ok) throw new Error('Counter not available');
    const result = await response.json();
    if (!Number.isSafeInteger(result.visits) || result.visits < 0) throw new Error('Invalid count');
    if (!seen) {
      try { sessionStorage.setItem(seenKey, '1'); } catch {}
    }
    render(result.visits);
  })().catch(unavailable);
})();
