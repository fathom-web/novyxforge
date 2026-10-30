# NOVYX FORGE 3.0 — Release Candidate QA

**Status:** 3.0 deployed to MijnHost and live-smoke-verified / **NOT YET AN OFFICIAL 3.0 RELEASE**  
**Verification date:** 2026-10-30  
**Release candidate:** RC1 (documentation label, **not** a Git tag or public release)  
**Production host:** MijnHost · `https://novyxforge.com/`  
**Source:** `fathom-web/novyxforge` (GitHub `main`)

## Evidence: automated verification passed

**LIVE MijnHost verification — 2026-10-30:** The user deployed the latest 3.0 build. An independent [production Chromium + HTTP QA workflow](https://github.com/fathom-web/novyxforge/actions/runs/41058654495) checked the actual `https://novyxforge.com/` domain and passed **11/11 checks (0 failures)**, including HTTPS, current JS/CSS asset versions, six homepage spheres, Reactor, Command Search, Observatory, a FootballForge demo, and 360px/390px mobile layouts. [Live production screenshot artifact](https://github.com/fathom-web/novyxforge/actions/runs/41058654495/artifacts/12977897540) (retained until 2026-11-13). This verifies core production functionality, **not** all seven live app demos, Safari/Firefox, accessibility, performance metrics or approved real app screenshots.



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

- [x] **Production deployment and assets:** user completed MijnHost FETCH → DEPLOY. Independent GitHub Actions confirmed live homepage, current versioned JS/CSS assets, TLS and successful requests.
- [x] **Core live smoke test:** 11/11 HTTP and Chromium checks passed for homepage, Reactor, Command Search, Observatory and the FootballForge demo, on desktop and 360/390px mobile.
- [ ] **Full live walkthrough:** manually test all seven live showcases, every weather mode, all four demos, World Transitions and public feedback links without submitting GitHub issues.
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

1. **Completed:** source smoke and local-browser workflows passed; the user deployed using MijnHost; actual live domain passed 11/11 independent checks.
2. **Remaining:** manually test every live showcase on desktop and mobile; run supported-browser tests with Safari and Firefox.
3. **Remaining:** review actual rendered screenshots, approved application captures, accessibility and performance measurements.
4. Add and approve real sanitized screenshots where available, then redeploy and re-test.
5. Finish accessibility/performance, supported-browser and SEO QA; record acceptance of each gate.
6. Only then create the final GitHub release/tag and describe **NOVYX FORGE 3.0** as released.

**Next task:** human visual/screenshot review, all-seven-showcase production walkthrough, privacy-safe real application captures and supported-browser/accessibility/performance acceptance. Core production deployment is verified; official release/tag remains open.
