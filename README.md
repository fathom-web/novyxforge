# NOVYX FORGE — Living Innovation Lab

An independent AI & Technology Lab: a cinematic home for projects, ideas and experiments.

## NOVYX FORGE 3.0 — Release Candidate RC1 (2026-10-30)

**LIVE MijnHost verification — 2026-10-30:** The user deployed the latest 3.0 build. An independent [production Chromium + HTTP QA workflow](https://github.com/fathom-web/novyxforge/actions/runs/41058654495) checked the actual `https://novyxforge.com/` domain and passed **11/11 checks (0 failures)**, including HTTPS, current JS/CSS asset versions, six homepage spheres, Reactor, Command Search, Observatory, a FootballForge demo, and 360px/390px mobile layouts. [Live production screenshot artifact](https://github.com/fathom-web/novyxforge/actions/runs/41058654495/artifacts/12977897540) (retained until 2026-11-13). This verifies core production functionality, **not** all seven live app demos, Safari/Firefox, accessibility, performance metrics or approved real app screenshots.



**Code complete and live-deployed; not yet an official tagged 3.0 release.** All ten selected 3.0 features are implemented and [Chromium browser QA passed all 16 checks](https://github.com/fathom-web/novyxforge/actions/runs/41057805696), including desktop and 360/390px phones. The original five-suite [GitHub smoke checks are also passing](https://github.com/fathom-web/novyxforge/actions/runs/41057805528).

The exact current status, successful screenshot artifact, corrected responsive issues and remaining production gates are in **[RELEASE_CANDIDATE_3_0.md](./RELEASE_CANDIDATE_3_0.md)**. MijnHost production is independently live-verified (11/11); reviewed real application screenshots, a full all-project live walkthrough, manual cross-browser/accessibility review and measured production performance remain open. Do **not** mark 3.0 as officially released until those are validated.

## NOVYX FORGE 3.0 — approved roadmap (2026-10-30)

The official, approved 3.0 scope is documented in **[ROADMAP_3_0.md](./ROADMAP_3_0.md)**. It includes all ten selected workstreams: Six-Sphere Universe, seven-weather Weather Engine, World Transitions, World Navigator, Forge Reactor, Interactive Demo Mode, The Observatory, Evolution Timeline, Forge Feedback and Command Search, plus mobile/accessibility/performance/screenshot release gates.

**Current state:** All ten approved NOVYX 3.0 features are committed to GitHub; 16/16 Chromium browser QA checks and all five source contract suites are passing. **Still a release candidate, not an official tagged release:** live MijnHost deploy passed 11/11 smoke checks; approved real app screenshots, full per-project live QA, cross-browser accessibility and measured production performance are not confirmed.

### 3.0 Alpha code and test command

- World configuration: `projects.json` → each project's `world.weather` (the source of truth).
- Six portal layout: `forge-universe-v3.css` plus the existing `index.html` sphere markup.
- Shared weather renderer: `forge-weather.js` + `forge-weather.css`. Runs behind showcase heroes, never as navigation-blocking input. An On/Off toggle remembers preference locally; motion-reduction defaults to static.
- Zero-dependency smoke test: `node tests/v3-alpha-check.mjs`.
- Real device/browser validation, including frame-rate, controls, and responsive layouts, is still required before calling this Alpha released.

### 3.0 Navigation Beta: World Navigator, transitions & Reactor

- `forge-world-navigation.js` + `forge-world-navigation.css`: shared project navigation, a cinematic but optional world-entry transition, and a keyboard-accessible central Forge Reactor menu.
- **Home:** Select the center glass Forge to open `Explore Worlds`, `Forge an Idea` (Spark Lab showcase) or `Mission Control` (Pipeline). The six featured spheres retain ordinary `href` links to their showcase pages.
- **Showcase:** Scrollable sticky World Navigator with six feature worlds and Spark Lab. One click switches projects and weather themes without returning to the homepage.
- Native browser link conventions remain intact: Ctrl/Cmd-click, middle click, external destinations, download links, browser back, and reduced-motion visitors do not depend on transitions.
- Unit-free wiring checks: `node tests/v3-alpha-check.mjs` and `node tests/v3-navigation-check.mjs`.
- **Validation status:** Static HTML/CSS/JS structure checked. Not yet visually tested in a deployed browser or verified on actual phones. Run FETCH → DEPLOY in MijnHost, then test six sphere links, central Reactor dialog, the world strip on each showcase, and changing weather between project pages.

### 3.0 Interactive Demo Beta — four product sandboxes

- `forge-demos.js` + `forge-demo.css` power isolated client-side demos. They **never** contact production application APIs, write to persistent browser storage, collect account data or submit anything externally.
- `FootballForge`: 16 fictional sample positions, available/absent toggles, an illustrative 4–3–3 lineup, empty positions and bench.
- `StudyForge`: four-question sample quiz with feedback and score, plus simple interactive flashcards. Nothing is recorded to a student account.
- `Wild Rift Counter`: selectable Baron/Jungle/Mid (one opposing champion) and ADC/Support (both opposing duo-lane champions). **Only illustrative drafting considerations** are shown; no patch-verified counters or win rates are invented.
- `SAFe Agile Forge`: select RTE, PM, PO or SM and a sample start date to calculate a fictional four-iteration PI planning preview. This is not official or mandatory SAFe ceremony guidance.
- `project.html` shows an extra **Try it yourself** section and hero CTA only for these four approved projects. The Fascination Files, WoW LifeForge and Spark Lab remain normal showcases.
- Screenshots are separate from simulations. The `showcase.screenshots` list must include a real capture, sanitised content, accessible title/alt text, the local `./assets/screenshots/<project-id>/...` path and **`"verified":true`** after review. Otherwise the page keeps visibly labeled *illustrative previews*.
- Test with `node tests/v3-demos-check.mjs`; additionally visually test keyboard and touch, label clarity and reset behavior on real browsers. GitHub commits do not automatically deploy to MijnHost.

### 3.0 The Observatory + Evolution Timeline — reviewed GitHub evidence

- `activity.json` contains **10 curated, dated, source-linked GitHub commits** across the NOVYX platform and several public app repositories, verified against GitHub on 2026-10-30. These are **development commits, not releases or evidence of production deployments**.
- `forge-observatory.js` / `forge-observatory.css` render the evidence. On the homepage, **The Observatory** appears immediately before the existing live `Forge Pulse`. Visitors can filter by project or by Development/Releases.
- Every project showcase has an **Evolution Timeline** driven by the same data. Where there is no reviewed public history (currently The Fascination Files and WoW LifeForge), display an honest empty state.
- The Observatory is a **reviewed editorial snapshot**; Forge Pulse separately fetches the latest public GitHub commits when visible. Never describe Observatory history as a live feed. An empty release tab does not mean GitHub has no releases; it means none has been reviewed/published in `activity.json`.
- To add a development entry, first verify its GitHub commit URL, actual commit timestamp and content. Add an item with `type:"development"`, `status:"committed"`, `reviewed:true`, exact `projectId`, and `source:{type:"github-commit",repository:"fathom-web/<repo>",sha:"<40-character SHA>",url:"https://github.com/fathom-web/<repo>/commit/<SHA>"}`. No claim of deployed features from source changes alone.
- To add a genuine release event, verify that an actual GitHub release was published and add `type:"release"`, `status:"published"`, `source:{type:"github-release",repository:"fathom-web/<repo>",tag:"<actual-tag>",url:"https://github.com/fathom-web/<repo>/releases/tag/<actual-tag>"}` along with the real publication timestamp. Ordinary commits never become releases automatically.
- Static contract test: `node tests/v3-observatory-check.mjs`. In-session simulated DOM checks have covered the 10-event feed, Wild Rift project filter, release empty state, FootballForge timeline and empty WoW timeline. **Actual in-browser visual/device tests remain outstanding.**

### 3.0 Forge Feedback + Command Search — implemented in GitHub

- `forge-feedback.js` and `forge-feedback.css` add a global **Forge Feedback** section plus per-project **Suggest an improvement / Report a bug** actions on all seven project showcases.
- Requests open public GitHub issues in **`fathom-web/novyxforge`**. The repo has GitHub Issues enabled, and `.github/ISSUE_TEMPLATE/feature_request.md` and `bug_report.md` are checked in. Each project link carries a prefilled project label and issue title/body. GitHub may require sign-in and approval before publishing; NOVYX does not submit on behalf of visitors.
- Feedback submissions become **publicly visible** on GitHub. Explicit warnings discourage sharing passwords, private accounts, personal/student data or confidential information. No community database or direct NOVYX server endpoint is introduced.
- `forge-search.js` and `forge-search.css` provide **Command Search** from the desktop header, phone header and keyboard **Ctrl+K / Cmd+K**. Keyboard arrow navigation, Enter, Escape, focus return and an accessible native dialog are supported.
- Search indexes public `projects.json` projects, Idea Vault concepts, curated `activity.json` development history, verified site section links and two public GitHub documentation pages. The index is built locally in the browser; there is **no backend AI, paid search API or query logging**. Untrusted URLs are rejected and all text results are rendered as text nodes, not HTML.
- The search works with a navigation-only fallback if public JSON fails to load. Without JavaScript, search buttons remain links to the Project Catalog.
- Contract test: `node tests/v3-search-feedback-check.mjs`; static and local-runtime checks cover all 7 projects, 3 ideas, 10 reviewed events, data safety and per-project GitHub issue URLs.
- **3.0 source scope:** all ten approved features have initial implementation code. **Not a finished production release:** real verified screenshots, browser/mobile accessibility/performance testing and actual MijnHost deployment validation are outstanding.

**Automated verification (2026-10-30):** [NOVYX 3.0 checks — passing run](https://github.com/fathom-web/novyxforge/actions/runs/41054917934) validated syntax and all five zero-dependency test suites, including Command Search and Forge Feedback. This is **code-level verification**, not a browser accessibility audit or confirmation of MijnHost deployment.

## What's here

- **Five interactive glass spheres:** FootballForge, StudyForge, The Fascination Files, SAFe Agile Forge and WoW LifeForge.
- **Featured project experiences:** holographic previews with accurate status labels.
- **The full project universe:** a searchable, category-filtered catalog with six projects (including Wild Rift Counter).
- **The Idea Vault:** three clearly labeled concepts, not release announcements.
- **Forge Pulse:** a live, read-only view of the latest public commits from selected GitHub repositories, with an honest fallback when GitHub rate-limits or cannot be reached.
- **Inside the Forge / The Open Forge:** the creative process, public source links, and future distribution plans.
- **Project pages:** a reusable `project.html?project=<id>` experience and a dedicated `safe-agile.html` overview.
- **SEO:** canonical URL, metadata, `robots.txt` and `sitemap.xml`.

## Core files

| File | Purpose |
|---|---|
| `index.html` | Main immersive homepage; preserves the original Forge and sphere illustrations |
| `projects.json` | Single editable catalog of projects, stages, links and new ideas |
| `forge-experience.css` | New five-sphere layout, project cards and responsive visual sections |
| `forge-experience.js` | Explorer filters, search, Idea Vault, GitHub Pulse, and reusable project pages |
| `project.html` | Generic dynamic project experience |
| `safe-agile.html` | Dedicated SAFe Agile Forge introduction |

To add a project without creating another hero sphere, add an entry in `projects.json`. The Project Explorer renders it automatically. The six hero spheres are hand-crafted visual highlights, while the catalog is scalable beyond the featured projects.

The `stage` values are `spark`, `exploring`, `building`, `released`, and `public-ready`. Only mark a project as released when its public experience is actually available. The `links.visit` field may be `null` for unfinished apps. Concept data belongs in the `ideas` array.

## SAFe Agile Forge

The sphere and project card link to `./safe-agile.html`, a real page within this repository. The live application source is in [fathom-web/SAFeForge](https://github.com/fathom-web/SAFeForge). Its planned separate hosting address is `safeforge.novyxforge.com`; hosting and HTTPS require independent verification. The prototype is not approved for sensitive or operational Defence data.

## WoW LifeForge and CurseForge

WoW LifeForge is currently an exploratory addon, **not a published download**. Its sphere opens a project detail page. All future official addon downloads and updates will go **only through CurseForge**, not the NOVYX website. The site is a showcase.

## Forge Pulse

The Pulse makes four anonymous read-only requests to GitHub's public REST API, one for each selected nonempty repo, when visitors scroll to the section. It displays commit dates and messages exactly from GitHub, and does not fabricate updates. It may show a fallback on rate limits, unavailable API or network failures. No tokens or backend are needed.

## Cinematic polish / October 2026

The V3 visual layer is split into two additional optional, cache-busted files:
- `forge-polish.css`: viewport-wide hero atmosphere instead of container-clipped gradients, softer central Forge luminosity, refined spheres, constellation cards, cinematic footer, responsive breakpoints and reduced-motion support.
- `forge-polish.js`: keyboard and pointer sphere-focus lighting, optional lightweight cursor halo, restrained card-tilt and section-aware navigation.

The original five orbiting spheres, their project URLs, and central glass Forge SVG remain intact.

**Visual QA after deploying:** check desktop widths around 1440–1920px and phones around 375–430px. Verify ambient light fades smoothly beyond the sphere edges, no colored rectangular panels appear, spheres remain tappable, the large NOVYX heading is visible after the shorter hero, and keyboard focus / reduced-motion are usable. The GitHub static checks do not substitute for this visual review.

## Forge Pipeline and Spark Lab (v2 platform features)

- **Forge Pipeline:** four interactive columns (**Spark → Explore → Build → Launch**) displaying real, manually maintained status from `projects.json`. Use **Everything / Projects / Ideas** to filter. Clicking a project opens its details; clicking an idea takes you to the Idea Vault. Counts are derived from source data; they are not automatic completion percentages, production telemetry, or deployment verification.
- **Status notes:** each project has a `pipelineNote` field for a short, editorial explanation of its present phase. Keep it accurate and update the stage and note together when project status changes.
- **Spark Lab:** `spark-lab.html`, a real browser-only experiment that takes a raw idea, optional audience/problem and suggested platform, then produces a starter brief, template-guided steps and a copyable AI-ready prompt. It can download a JSON brief. It makes **no AI API calls** and performs no server-side processing of entered idea text.
- **Spark Lab classification:** listed as **Build** until the new experience has been visually tested after MijnHost deployment. Do not present it as a production-ready AI assistant.
- **Future Spark Lab 2.0:** add actual AI integration only when an approved secure backend and explicit user consent are in place.

**Adding a new project:** edit `projects.json` (project id, stage, category, summary, `pipelineNote`, optional links); the pipeline and project explorer will both update without copying HTML cards. New ideas belong under `ideas`.

## Sphere worlds and Public Ready stage (2026-10-30)

**Signature project identities**: Five featured spheres now have deliberately differentiated materials, orbit motions and independent accent systems rather than recolored copies: FootballForge (electric cyan/tactical grid), StudyForge (royal violet/crystalline fragments), The Fascination Files (magenta/eclipse), SAFe Agile Forge (emerald/modular nodes) and WoW LifeForge (amber/crimson/runic relic). The original five project destinations remain unchanged. The central Forge reacts to the selected world via `forge-polish.js` and `forge-worlds.css`. These effects remain purely cosmetic and respect reduced-motion settings.

**Pipeline now has five stages**:

1. `spark`: a newly captured idea
2. `exploring`: investigation and validation
3. `building`: a prototype or work in progress
4. `released`: Launch, a functioning published experience
5. `public-ready`: a documented and tested package or GitHub template for third-party use

**Launch is not Public Ready.** A live GitHub Pages app, a public repository or a working prototype is not automatically a redistributable template. The stage is reserved for projects with an explicit `distribution` object in `projects.json` with `type` (`template`, `download` or `both`), an HTTPS `documentationUrl`, a real `license`, and working approved `templateUrl` or `downloadUrl`. The browser checks links for plausible shape and gates the stage, but cannot confirm external repo settings, licensing rights, security or release testing; these remain manual checks. A misconfigured `public-ready` project stays displayed in Launch rather than generating a fake download button.

**GitHub templates**: In the repository's GitHub Settings, enable **Template repository**, verify the URL ending `/generate`, confirm a license and README, then update its public distribution metadata and `stage`. Template creation and release ZIP downloads are two distinct actions; both can be offered only when properly prepared. `public-ready.html` provides an interactive editorial checklist (not an automated approval action).

**Current verified repo state (2026-10-30)**: checked repository metadata; none of the existing examined NOVYX repositories had `is_template=true`. No projects are in Public Ready today and no fictitious download links appear. For future WoW addons, official distribution/updates remain strictly CurseForge; do not offer alternate addon download links via NOVYX.

Files: `forge-worlds.css` (sphere identity + five-column layout), `public-ready.html` (publishing guide), `projects.json` and `forge-experience.js` (gated pipeline actions). No heavy 3D dependencies.

**After deploying**: check 1440px/1920px desktop and 375px/430px mobile; hover/focus each sphere and verify unique light, orbit shapes and readable labels. Validate five pipeline stages and the empty Public Ready message. Test `public-ready.html` checklist, verify no template/download button is visible until an actual package is configured. Source code checks are not a substitute for in-browser regression testing.

## Product showcases and screenshot gallery

All six homepage spheres, all six featured project cards, the Project Explorer, and the Pipeline now route to the **project showcase** first (`project.html?project=<project-id>`). This is intentional: visitors should understand the project before opening the real application.

Each project showcase contains: the problem and audience, the core workflow, capabilities, three cinematic **illustrative interface previews**, an optional gallery of **real screenshots**, and a clearly separated "Open the application"/"Visit Instagram"/source CTA. Actual screenshots have **not** yet been collected from the apps. Illustrative previews are labeled as such; do not present them as real screenshots. Projects without a verified environment do not get invented launch links.

### Add real screenshots

1. Take screenshots of the real application while showing **demo/sample data**. Never expose team player names, student dashboards, personal records, credentials or API secrets.
2. Upload the optimized `.webp`, `.jpg` or `.png` file to `assets/screenshots/<project-id>/` in the NOVYX GitHub repository.
3. In `projects.json` find the project and add entries to `showcase.screenshots`:
   
   ```json
   {"src":"./assets/screenshots/footballforge/dashboard.webp","title":"Team dashboard","description":"The current FootballForge workspace","alt":"FootballForge dashboard shown with fictitious demo data","verified":true}
   ```
4. Set `"verified":true` only after reviewing the real capture for accurate content and privacy. Otherwise the page will continue showing illustrative concept previews.
5. Deploy the updated repo to MijnHost with FETCH → DEPLOY. The real screenshot gallery will automatically replace the illustrative previews for that project, and visitors can enlarge each screenshot.

The showcase pages use `project-showcase.css` and `project-showcase.js` and read the same `projects.json` project metadata. Product URLs remain in `links.visit`, separated from the showcase destinations. The old standalone `safe-agile.html` page still works and now links back to the full showcase.

## Hosting: MijnHost DirectAdmin

NOVYX uses **GitHub for source control and MijnHost for website hosting**. GitHub commits alone do not automatically update the live domain.

1. In DirectAdmin, open the **NOVYX FORGE Git repository** that deploys to the **main domain**.
2. Use **FETCH** to retrieve the new commits, then **DEPLOY**.
3. Verify `index.html`, `projects.json`, `forge-experience.js`, `forge-experience.css`, `project.html` and `safe-agile.html` have all arrived in the same main document root.
4. Test all six spheres including Wild Rift, each project weather effect and the atmosphere toggle, SAFe destination, WoW detail, category filters/search, Idea Vault and GitHub Pulse (including its fallback).
5. Force-refresh the browser. SSL should remain enabled.

Do not deploy the main site into the separate SAFe subdomain directory, or vice versa.

## Quality considerations

- Respect `prefers-reduced-motion` and provide keyboard focus states.
- Use local static JSON for consistent project metadata, escaping all text in the browser.
- Never present mock product previews as screenshots of real software.
- A code/static audit is **not** a substitute for full cross-browser or device testing.
- Public code availability does not imply a specific license for reuse.
