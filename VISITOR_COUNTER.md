# NOVYX FORGE — Retro visitor counter

A compact, nostalgic seven-digit visitor counter beside **Search** in the homepage header. Desktop shows **VISITOR #** and the digits; mobile shows the digits after the mobile Search icon.

## Counts, not fabricated numbers

A **visit per browser tab session** on the homepage, starting when this feature goes live. The first homepage view sends POST; reloads in the same tab use GET. The integer total is shared across visitors and persists between requests and restarts. This is **not unique people**, and traffic before activation is not counted. Another tab/browser may count again; automated traffic can also add visits.

The counter stores only a numeric total. It does not store IP addresses, cookies, user agents, fingerprints, or identifiers. The browser uses a sessionStorage flag to avoid recounting refreshes of the same tab.

## Hosting

The production hosting environment must support **PHP** and a writable storage directory. Endpoint: `api/visitor-counter.php`.

By default, it writes `api/.visitor-counter-state.php`, which is ignored by Git. It begins with a PHP exit guard to prevent direct retrieval through correctly configured PHP web hosting.

**Recommended:** Set the `NOVYX_COUNTER_FILE` environment variable to an absolute writable file **outside the document root**, so updating website files cannot reset the counter. If you cannot configure this, preserve `api/.visitor-counter-state.php` across deployments. The state file is never committed.

If storage is not available, the counter shows dashes instead of invented values.

## Validation

- `node tests/visitor-counter-check.mjs`: markup, JavaScript and endpoint contract checks.
- GitHub Actions runs PHP syntax and a GET/POST/GET persistence smoke test.
- After deploying, open homepage in a new tab, reload (count should not increase), open another new tab (should increase), and inspect the desktop/mobile layout.

This is a retro hit counter, **not** an anti-fraud analytics or unique-visitor reporting product.
