# NOVYX FORGE 3.0 — Release Candidate QA

**Status:** 3.0 code-ready / Chromium-browser-tested / **NOT YET PRODUCTION RELEASED**  
**Verification date:** 2026-10-30  
**Release candidate:** RC1 (documentation label, **not** a Git tag or public release)  
**Production host:** MijnHost · `https://novyxforge.com/`  
**Source:** `fathom-web/novyxforge` (GitHub `main`)

## Evidence: automated verification passed

- **Static + integration contracts:** [NOVYX 3.0 checks — passing](https://github.com/fathom-web/novyxforge/actions/runs/41057805528). All five Node-only test suites passed.
- **Real browser:** [NOVYX 3.0 Browser QA — passing](https://github.com/fathom-web/novyxforge/actions/runs/41057805696). **16/16 Chromium checks passed, 0 failed.** Runs against a local static server of the checked-out repository, not the deployed MijnHost website.
- **Browser screenshots:** [Desktop and mobile screenshot artifact](https://github.com/fathom-web/novyxforge/actions/runs/41057805696/artifacts/12977642034) (`novyx-v3-browser-qa-screenshots`, stored for 14 days through 2026-11-13; GitHub sign-in may be needed to download).
- **Checked widths:** Desktop 1440px, mobile 390px and 360px. The browser run uses Chromium; Firefox and Safari remain a separate release gate.
- **Browser tests include:** six homepage spheres, Reactor dialog, Ctrl+K search, Observatory filters, all seven showcases, seven weather types through shared configuration, atmosphere On/Off, four fictional demos (FootballForge, StudyForge, Wild Rift 2v2, SAFe), feedback GitHub URLs, reduced motion, mobile navigation and horizontal-overflow checks.

## Bugs found and resolved during RC1

| Finding | Fix |
| --- | --- |
| Central glass Forge extended past the screen for reduced-motion visitors | Preserve the horizontal centering transform with animation disabled in `forge-universe-v3.css` |
| Weather overlay extended 36px beyond desktop viewport edges | Keep decorative `.weather-layer` inside the hero at all breakpoints in `forge-weather.css` |
| Search modal did not reliably close with Escape under keyboard interaction | Explicit Escape handling in `forge-search.js` |
| Mobile project view had about 9px extra horizontal scroll | Contain decorative showcase overflow within `main` while preserving the standalone scrollable World Navigator in `project-showcase.css` |
| Browser QA could not install on ubuntu-26.04 with pinned Playwright | Pin `ubuntu-24.04` in `.github/workflows/novyx-browser-qa.yml` |

The fixes are implemented and the final run passed all 16 checks.

## Release gates still OPEN — do not call 3.0 launched yet

- [ ] **Production:** in MijnHost, do **FETCH → DEPLOY** of the latest `main` commit. Then hard-refresh and verify production serves new versioned CSS and JS.
- [ ] **Live smoke test:** on `https://novyxforge.com/`, confirm six spheres; click central Forge; navigate to different worlds; use search `Ctrl/Cmd+K`; switch weather On/Off; try all four demos; filter Observatory; open feedback actions to verify GitHub URL without submitting an actual issue.
- [ ] **Real projects screenshots:** `showcase.screenshots` currently contains **zero verified real application captures**. Use fictional/demo-only data and explicit editorial approval. Do not include real children, student results, credentials, private user names or operational data.
- [ ] **Browser/device coverage:** Chrome and Edge on Windows, Safari on iPhone/iPad and macOS, and Firefox; verify keyboard focus, screen reader announcements and contrast.
- [ ] **Measured mobile speed/accessibility:** collect real performance metrics (LCP, CLS, INP) and check WCAG 2.2 AA issues. Current automated tests do not establish those targets.
- [ ] **Visual approval:** review captured CI screenshots and production visuals for clipped text, sphere spacing, disabled motion and demo clarity. Automated geometry and interaction checks are **not** a human design review.
- [ ] **SEO/social:** check canonical URLs, unique metadata/social previews and search indexing for project pages on the actual host.
- [ ] **Rollback:** identify the previous stable GitHub commit and save the host's deployment rollback steps before promoting a tagged final release.

## Honest project-specific publication constraints

- **WoW LifeForge:** currently a concept with no approved downloadable addon. Any actual addon distribution must use CurseForge.
- **The Fascination Files:** no curated public GitHub development history is currently present; do not invent Evolution milestones.
- **Wild Rift Counter:** portfolio catalog has no confirmed public application URL in `links.visit`; its interactive showcase demo is illustrative and does not claim current patch accuracy.
- **Observatory:** reviewed GitHub commits are development evidence, not automatically releases. The curated feed currently has zero verified GitHub release entries.

## Final production release procedure

1. Check both GitHub Action workflows are green on the commit being deployed.
2. Perform MijnHost **FETCH → DEPLOY** and hard-refresh the site.
3. Test desktop + mobile against the **live domain**, not just GitHub's local browser test server.
4. Add and approve real sanitized screenshots where available, then redeploy and re-test.
5. Finish accessibility/performance, supported-browser and SEO QA; record acceptance of each gate.
6. Only then create the final GitHub release/tag and describe **NOVYX FORGE 3.0** as released.

**Next task:** live deployment + visual screenshot review. All ten planned features are source-implemented, and the local Chromium acceptance test now passes; official production acceptance remains open.
