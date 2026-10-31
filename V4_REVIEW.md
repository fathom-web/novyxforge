# NOVYX FORGE 4.0 — The Living Forge

Review candidate on `novyx-v4`. Production deployment is not part of this change.

## What changed

- All six core worlds, plus Spark Lab, have substantial project-specific stories: capabilities, workflow diagrams, expandable engineering decisions, sourced limitations, proposed next questions and explained connections to other worlds.
- `world-content.json` separates the new editorial content from presentation. Sources were read on 31 October 2026. It deliberately excludes account codes, player details and learner data found in public upstream documentation.
- Seven generated `world-<id>.html` pages provide readable content, unique titles/descriptions, canonical and Open Graph URLs, CreativeWork structured data, navigation and evidence links without JavaScript. The original `project.html?project=<id>` URLs continue working.
- The new World Atlas connects the six worlds through their shared ideas, with keyboard-operable choices and direct demo/story links. Sphere focus previews explain the selected project; the Reactor links to the atlas and shows real catalog status on world focus.
- The visual layer retains the six spheres and central reactor, adding warm editorial typography, workflow diagrams, project-colored connections and identity-specific transition treatments. Transition delay is reduced to 160ms; motion can be paused, respects reduced motion and pauses when the page is hidden.
- Command Search groups project, engineering, demonstration, history and idea results. A technical result opens the exact expanded engineering note. No query logging or remote search service is added.
- The seven existing fictional atmospheric presets now have explicit mode and intensity controls. Reduced motion retains a static atmosphere. Canvas work remains visibility-aware with bounded device pixel ratio and particle counts.
- Observatory gains three actual source-history entries from the baseline repository. Project timelines support chronological/reverse-chronological exploration. Proposed work is kept outside completed history.
- Forge Pulse caches minimal public commit metadata for 15 minutes in session storage, uses a five-second timeout and falls back to a labeled cache up to 24 hours old when GitHub is unavailable. Destination URLs are validated. The curated Observatory remains independent of the API.
- Spark Lab is linked from a new experiment shelf. Idea Vault concepts have an expandable explanation and a working handoff to the existing brief workshop. The pipeline still reflects the real curated project stages.
- The standalone SAFe overview, Spark Lab and Public Ready guide gain direct world navigation.
- Static generation and browser QA are repeatable in read-only GitHub Actions workflows; two pre-existing tests now resolve Windows filesystem paths correctly.

## Preserved

Six animated portal illustrations, the interactive Reactor, all existing public project URLs/subdomains, the separate WoW Foundry, four isolated sample demos, catalog filters, source-backed Observatory, pipeline, Idea Vault, Spark Lab brief/copy/export behavior, screenshot privacy gates and GitHub issue feedback.

Feedback gains a homepage project selector and remains an explicit public GitHub handoff with per-project context. GitHub handles authentication and abuse controls; NOVYX never claims to submit or store a message itself. No backend or credentials were introduced.

## Evidence boundaries

The project descriptions distinguish repository implementation from a deployed, accepted product. StudyForge's published library is not an in-app import feature. FootballForge's team access codes are not secure authentication. SAFe exports are explicit handoffs, not live Microsoft 365 integrations. LifeForge and Forge AFK remain unverified game-client builds. Wild Rift examples do not claim patch-current counter statistics.

The Fascination Files' original Instagram profile could not be read during this session. Its description comes from the existing catalog; no individual posts, media, publishing schedule or audience numbers were invented. The new roadmap text is explicitly proposed review work, not a committed delivery schedule.

## Validation

- `node scripts/build-worlds.mjs`: generates seven static pages, the homepage atlas and the sitemap using only Node built-ins.
- `node scripts/check.mjs`: all browser JavaScript syntax checks and ten source/content/security regression suites pass.
- `node tests/v3-browser-smoke.mjs`: 19 existing browser checks passed in installed Chrome, including all seven worlds, the four sample demos, search, Reactor, feedback and 360/390px layouts.
- `node tests/v4-browser-check.mjs`: tests Atlas selection, Reactor-to-Atlas navigation, engineering search/deep links, all seven static worlds at 1440/768/390/360px, weather mode/intensity/reduced motion, legacy routes, standalone navigation, no-JavaScript rendering, JSON failure fallback, Pulse cache/rate-limit behavior and uncaught errors.
- Local captures of the homepage, desktop/phone atlas and engineering content were visually inspected. Screenshots are in ignored `qa-v4/`; the V4 CI workflow publishes review artifacts.
- GitHub V4 CI runs the new browser suite in Chromium, Firefox and WebKit. Consult the PR checks for the result on the current commit. Existing browser/accessibility workflows also remain enabled.

No performance improvement percentage or production Core Web Vitals claim is made. The existing production QA was not a successful verification in this environment; the development site was tested locally.

## Safe preview

1. Check out `novyx-v4` in an isolated directory.
2. Run `node scripts/build-worlds.mjs` and `node scripts/check.mjs`.
3. Run `node scripts/preview.mjs`; open `http://127.0.0.1:4173`.
4. Enter every sphere, use the Atlas, open a technical search result, try the sample demos, change atmosphere settings and test keyboard/Escape navigation. Use `world-studyforge.html` with JavaScript disabled to inspect progressive enhancement.
5. Browser suites need Playwright. For a normal development installation: `npm install --no-save --ignore-scripts playwright@1.56.1`, then `npx playwright install chromium`. On Windows with an existing Chrome installation, set `NOVYX_BROWSER_CHANNEL=chrome`. V4 also accepts `NOVYX_ENGINE=firefox` or `webkit` with that browser installed.

Generated pages are committed for the existing buildless hosting environment. Edit `project.html`, `projects.json`, `world-content.json` or `forge-content.js`, then regenerate; do not edit the generated world files by hand. `forge-v4.css` and `forge-v4.js` are shared presentation/enhancement layers. Keep the older asset layers until a separately reviewed consolidation proves equivalent rendering.

## Remaining verification and production gates

- Real privacy-reviewed screenshots for the six core apps and a curated set of original Fascination Files posts are not available. The existing verified Spark Lab screenshot is preserved; other previews remain labeled illustrations.
- External applications, databases, addon client behavior and subdomain configuration were not exercised. Their documented limitations remain visible.
- Responsive checks use browser emulation, not physical iPad/iPhone testing. Full screen-reader/manual accessibility review and production performance measurement remain release gates.
- No hosting control-panel access was used. Repository workflows do not deploy `novyx-v4`; the existing screenshot-publishing workflow only targets `main` and was not invoked. Out-of-repository DirectAdmin webhook configuration cannot be certified here.
- Before production: review the PR and its CI, validate the approved preview on actual devices, confirm the main site's DirectAdmin branch/document root and the independent WoW subdomain root, then obtain explicit deployment approval. Merge and deployment must be separate, deliberate steps. Do not point production at `novyx-v4` during review.

## Deployment scope

No merge, production deployment, database changes, secrets, dependency migration or writes to another repository. The work is an incremental extension of the original static HTML/CSS/JavaScript architecture.
