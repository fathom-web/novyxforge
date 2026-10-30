# NOVYX FORGE 3.0 — THE LIVING UNIVERSE

**Status:** Approved scope / 3.0 Alpha + Increment 2 navigation beta committed to GitHub; browser acceptance and MijnHost production deployment not yet verified.  
**Baseline inspected:** 2026-10-30 · GitHub repository `fathom-web/novyxforge`  
**Release principle:** Ship all ten selected features as one coherent NOVYX 3.0 release, in testable, reversible increments; keep the existing site working.

## Alpha implementation log — 2026-10-30

**Committed to `main`, awaiting live visual acceptance:**

- `projects.json`: central `world` configuration for seven effects (rain, snow, meteors, fog, storm, wind, sunrise); six worlds marked as homepage portals, Spark Lab as tool.
- `index.html`: six actual homepage spheres with a new Wild Rift Counter portal; six project cards including Wild Rift.
- `forge-universe-v3.css`: responsive six-portal positions and distinctive Wild Rift teal/violet wind identity.
- `forge-polish.js`: hovering/focusing the sixth sphere updates central Forge energy.
- `forge-weather.js` + `forge-weather.css`: shared zero-dependency Canvas 2D atmospheric rendering and an On/Off toggle, with visibility pause, capped density, mobile-friendly framerate, persistent opt-out, and reduced-motion fallback. No audio, APIs or full-screen lightning flash.
- `project.html` + `project-showcase.js`: use `projects.json` to attach the appropriate weather to every project showcase.
- `tests/v3-alpha-check.mjs`: standalone Node smoke checks for wiring, project count, links and motion-safety features.

**Still pending for this Alpha:** inspect the *deployed* site at desktop, tablet and mobile sizes; verify FPS, actual appearance, controls and external links. No production rollout or completed QA claimed.

**Not yet built:** World Transitions, World Navigator, Reactor actions, Interactive Demo Mode, Observatory, Evolution Timeline, Forge Feedback and Command Search. Their accepted scope remains unchanged below.

## Increment 2 implementation log — 2026-10-30

**Committed to GitHub `main`; deployed browser acceptance not yet verified.**

- `forge-world-navigation.js`: a shared catalog-driven World Navigator, accessible native `<dialog>` Reactor menu and short filmic portal transitions. Routes remain real links when JavaScript is off or reduced-motion is active. Modified clicks, external links and download links retain browser-default behavior. The arrival overlay expires automatically and stale session state is cleared.
- `forge-world-navigation.css`: sticky, mobile-scrollable world switcher; glass Reactor trigger; native modal; color-coded world gate and reduced-motion styles. Section deep links account for the sticky nav.
- `index.html`: glass Forge core trigger and Reactor menu with **Explore Worlds**, **Forge an Idea** (Spark Lab showcase), **Mission Control** (existing Forge Pipeline).
- `project.html`: persistent World Navigator across the six featured project worlds, plus Spark Lab. Current page is marked with `aria-current="page"`.
- `tests/v3-navigation-check.mjs`: zero-dependency static wiring and accessibility contract checks (run `node tests/v3-navigation-check.mjs` from the repo root).
- Live MijnHost deployment, visual browser tests, native dialog keyboard/focus tests and actual mobile verification are **still required**. This is implemented beta code, not a completed release.

**Next unimplemented increment:** product demos, verified screenshots and richer showcase interactions (Increment 3).

## 1. Product intent

NOVYX is a public-facing independent innovation portfolio, not merely a list of project links. Visitors enter a cinematic central Forge, explore six distinct project portals, experience a project-specific atmosphere, understand each project through a credible showcase, try an optional safe demo, and finally choose to open the real environment, view source, or access a verified release.

**Three non-negotiable user journeys:**

1. **Discover → Understand → Try → Visit:** home sphere → world transition → showcase with weather + story + real screenshots → demo → existing application.
2. **Explore → Follow progress:** Forge Reactor / Observatory / Timeline → evidence-based updates → project status / releases.
3. **Search → Suggest:** global command search → project or idea → feedback entry through a legitimate, moderated GitHub workflow.

**Existing features retained:** dark cinematic homepage, currently animated spheres, Project Explorer, Idea Vault, five-stage Pipeline with Public Ready, GitHub Pulse, Spark Lab, and all existing external project destinations.

## 2. Verified baseline vs. target

| Dimension | Baseline | 3.0 target |
| --- | --- | --- |
| Homepage portals | 5 featured spheres | 6, adding Wild Rift Counter |
| Project catalog | 7 projects including Wild Rift and Spark Lab | Same catalog drives all experiences |
| Showcases | 7 pages, each 3 explicitly illustrative previews | Detailed project stories, verified screenshots and optional safe demos |
| Real screenshot assets | 0 in `showcase.screenshots` | Sanitized real screenshots for launched products |
| Atmosphere | Per-sphere color/animation only | 7 weather presets in a shared engine |
| Pipeline | Spark / Explore / Build / Launch / Public Ready | Retain, improve links to releases and evidence |
| Distribution | Gated `distribution` metadata | No fake buttons; verified templates, downloads and documentation only |
| Activity | Existing GitHub Pulse | Curated, evidence-based Observatory and project timelines |
| Hosting | Static code in GitHub; manual MijnHost FETCH → DEPLOY | Retain static delivery; no mandatory backend |

**Six homepage worlds:** FootballForge, StudyForge, The Fascination Files, SAFe Agile Forge, WoW LifeForge, Wild Rift Counter.  
**Seventh atmospheric experience:** Spark Lab; it is entered from the central Forge Reactor rather than requiring a seventh sphere.

## 3. Full approved feature list and delivery priority

Priority means **implementation order**. Every selected feature is mandatory for the 3.0 release; a lower priority is **not** a scope cancellation.

| ID | Feature | Priority | Key dependencies | Demonstrable acceptance |
| --- | --- | --- | --- | --- |
| NF3-01 | Six-Sphere Universe | P0 | Shared world registry + responsive positions | Wild Rift has an accessible sixth sphere; all six link to their showcase; no overlap on supported screens |
| NF3-02 | Weather Engine | P0 | World registry + atmosphere host | 7 distinct effects render; global/per-page toggle works; safe motion fallback, no strobing, stable FPS |
| NF3-03 | World Transitions | P1 | Portals + weather presets + routing | Clicking/keyboard activating a world opens a brief coherent transition; direct links and modified clicks work normally |
| NF3-04 | World Navigator | P1 | World registry + showcase shell | Every showcase can navigate to all worlds and home, keyboard and mobile friendly |
| NF3-05 | Forge Reactor | P1 | Stable universe layout + Navigator | Central Forge opens accessible actions: Explore Worlds, Forge an Idea, Mission Control |
| NF3-06 | Interactive Demo Mode | P1 | Showcase system + isolated example data | Four meaningful zero-login demos; clearly labeled simulation; no production writes or user information |
| NF3-07 | The Observatory | P2 | Verified project activity schema + GitHub release/commit source | Recent, correctly dated changes and releases; graceful empty/error state; no invented metrics |
| NF3-08 | Evolution Timeline | P2 | Milestone schema + evidence references | Each project shows traceable milestones with planned versus shipped labels |
| NF3-09 | Forge Feedback | P2 | Project IDs + GitHub templates or moderation route | Visitors can suggest improvements and report bugs using a working, clearly described workflow |
| NF3-10 | Command Search | P2 | Public content index + Navigator destinations | Ctrl+K/Cmd+K, keyboard navigation, Escape, mobile entry point, useful results across public projects and ideas |

**Cross-cutting mandatory acceptance:** credible showcase content, real screenshots when legitimately available, mobile usability, accessibility, performance, privacy, security, SEO metadata and release QA.

## 4. Dependency architecture

```text
P0 Foundation: projects.json world metadata + design tokens + test fixture data
   |                  |                            |
   |                  +--> Screenshot pipeline      +--> Evidence/milestone model
   |
   +--> Six-Sphere Universe
   |       |    |
   |       |    +--> World Transitions
   |       +--> Forge Reactor <-- World Navigator
   |
   +--> Shared Weather Engine --> Seven project weather presets --> Transition handoff
   |
   +--> Showcase shell --> Real screenshots --> Interactive Demo Mode
   |
   +--> Evidence/milestone model --> Evolution Timeline --> Observatory
   |                              \________________________/
   +--> Public search index --> Command Search
   +--> Project identifiers + GitHub issue templates --> Forge Feedback

All paths --> Cross-browser QA, reduced motion, mobile, privacy, real links
             --> 3.0 Release Candidate --> MijnHost production deploy
```

**Never bind the live weather animation directly to production app data.** Weather is an independent decorative subsystem activated by a known project identifier.

## 5. Recommended implementation increments

### Increment 0 — Foundation / data contract (P0)

Goal: Avoid ten bespoke scripts hard-coded around `index.html`.

- Add a centralized `worlds` configuration in `projects.json` or a dedicated `worlds.json` with `id`, `accent`, `weather`, `transition`, `status`, `showcase`, and safe destination data. Keep existing public `projects.json` fields backwards compatible.
- Introduce a shared `forge-world-runtime.js` for selecting worlds, motion preference, local atmosphere toggle, routing and lifecycle; avoid duplicating effects in project pages.
- Add a small data validator and CI check for valid project IDs, unique slugs, valid HTTPS links, screenshot presence, recognized weather types, published vs. proposed events, and release fields.
- Prepare a lightweight, repeatable visual smoke test route for 360, 390, 430, 768, 1024, 1440 and 1920px viewports.
- Introduce feature flags so partial alpha work does not break existing production pages.

**Exit gate:** One source of truth; seven valid world configurations; existing homepage and showcases unchanged in behavior.

### Increment 1 — Universe Alpha (P0): six portals + atmosphere

**Six-Sphere Universe:**
- Add the Wild Rift Counter sphere with its own violet-teal/energy-wind identity; link to `project.html?project=wildrift-counter`, not an unverified app URL.
- Rebalance desktop positions and mobile grid. Explicit keyboard focus and screen-reader labels.
- Preserve reactive Forge energy without collisions, clipping or scroll overflow.

**Weather Engine:**
- Use a progressive-enhancement Canvas 2D/CSS approach. One atmospheric layer per currently visible hero; no heavy video/background download needed.
- Weather presets:
  - FootballForge: rain + cool stadium glow;
  - StudyForge: gentle snow/ice crystals;
  - The Fascination Files: meteors + cosmic dust;
  - SAFe Agile Forge: fog + soft emerald light shafts;
  - WoW LifeForge: storm clouds + amber rune sparks **without full-screen strobe flashes**;
  - Wild Rift Counter: swirling wind / teal energy trails;
  - Spark Lab: sunrise beams + sparks.
- Provide an explicit `Atmosphere On / Off` control; store opt-out locally and respect `prefers-reduced-motion`. If reduced motion is requested, default to static atmospheric artwork without repetitive movement.
- Pause `requestAnimationFrame` when document is hidden or hero out of view; scale canvas to viewport, cap pixel ratio and particle count on mobile; keep the layer `pointer-events:none` and behind text.
- Static fallback for no-JS, low performance, disabled canvas.

**Exit gate:** Six unique portals work on desktop and mobile; all seven weather configurations work, including disabled and reduced-motion states; no readability regression.

### Increment 2 — Navigation Beta (P1): travel through the universe

**World Transitions:**
- A short color/particle transition when following an internal world link; visual continuity between sphere hue and destination weather.
- Preserve real `href` as fallback; do not intercept Ctrl/Cmd-click, middle-click, external links or direct URL entry.
- Do not delay navigation under reduced-motion; obey keyboard activation and browser back/forward.

**World Navigator:**
- Consistent project switcher on showcase pages, responsive collapsed control on mobile.
- Accessible current-world indicator, home action and direct links to the other five featured worlds and Spark Lab.

**Forge Reactor:**
- The glass core becomes a properly labeled interactive control (not just an aria-hidden animation).
- Three actions: `Explore Worlds`, `Forge an Idea` (Spark Lab), `Mission Control` (Pipeline/Observatory).
- Keyboard support, focus management, Escape and tap-away dismissal, and screen-reader announcements.

**Exit gate:** User can move from any world to any other without losing navigation context; Reactor works with mouse, touch and keyboard.

### Increment 3 — Product Experience Beta (P1): make projects tangible

**Showcases + real screenshots:**
- Keep story, target audience, features and official application links.
- Add verified screenshots with descriptive alt text, appropriate provenance and consistent aspect ratios. Use sample/anonymized accounts: never capture real children, educational results, emails, credentials, private profiles or tokens.
- `assets/screenshots/<project-id>/` remains the asset source. Optional WebP/AVIF; optimize and lazy-load below fold.
- Illustrative interface art remains clearly labeled until real captures exist; no invented live UI.

**Interactive Demo Mode (four meaningful first-release demos):**
- FootballForge: synthetic player list, absence toggles and lineup/rotation preview.
- StudyForge: an entirely fictional short quiz and flashcard flow.
- Wild Rift Counter: sample lane and opponent selection with explicitly illustrative matchup output; avoid presenting patch-dependent demo suggestions as authoritative live counters.
- SAFe Agile Forge: sample role, PI iterations and ceremony planning with fictional dates/team data.
- Spark Lab: link to the working browser beta as the demo; The Fascination Files: guided content tour; WoW: visually labeled addon concept preview (not a functioning addon).
- Demos run in isolated state and do not call production project APIs/databases or record user data. Include a `Reset demo` action and a `Launch real app` button only when its destination is verified.

**Exit gate:** Four demos work without an account, each resetting cleanly; showcases remain understandable without demos or JavaScript; real screenshots are accurate and sanitized.

### Increment 4 — Living Lab Beta (P2): data, discovery and participation

**Evidence model first:** Introduce a small `activity.json` / `milestones.json` collection keyed by project ID. Each record has type, title, occurred/published date, source URL where relevant, status (`planned`, `in progress`, `shipped`) and whether reviewed. Never equate a commit to a released feature.

**Evolution Timeline:** Project-specific milestones, chronological sequence, source references and previous-version screenshots where available. Separate roadmap forecasts from shipped history.

**The Observatory:** One central feed of reviewed milestones, verified GitHub releases and project status changes; filter by project and event type. Fetch public GitHub data only within safe rate limits; cached/static fallback if GitHub becomes unavailable. No fabricated activity or “live” claims unsupported by source timestamps.

**Forge Feedback:** GitHub Issues/discussions templates for feature suggestion and bug report, prefilled with project name and issue type. Clearly say that a GitHub account is needed and submissions will be publicly visible. Provide no unmoderated, open-write public database in 3.0.

**Command Search:** Search only published NOVYX metadata, ideas, public release notes and documentation. Ctrl+K/Cmd+K plus mobile search trigger; focus trap only while dialog is open, keyboard arrows, Enter, Escape, visible focus, empty states. Keep private app content excluded.

**Exit gate:** Search, Observatory, feedback and timelines work without invented information; all displayed events have a meaningful date and appropriate source/curation indication.

### Increment 5 — 3.0 Release Candidate & production gate

- Cross-browser: current Chrome, Edge, Firefox and Safari, including iOS and Android touch use.
- Screen sizes: 360/390/430px, tablet, 1024/1440/1920 desktop; check sphere layout, weather toggle, contrast and dialog placement.
- Accessibility target: WCAG 2.2 AA patterns; keyboard operation, visible focus, focus return, aria labels, color not only signal, reduced motion, **no strobing**.
- Measured experience targets on representative mobile test profiles: LCP at or below 2.5s, CLS at or below 0.1, INP at or below 200ms. Treat as validation targets, not pre-claimed results.
- Avoid weather/event listeners when offscreen or backgrounded; prevent memory leaks through navigation and resize. Buttons work with canvas off.
- Security/privacy: no operational, child, student or personal data in demo/screenshot bundles; sanitize external URLs; no sensitive secrets in client files.
- SEO: meaningful title/description and social preview per project. The existing dynamic query-based showcase can be retained during alpha, but unique, crawlable static project URLs and server-renderable metadata should be evaluated before 3.0 production.
- GitHub Release/README/tag when QA passes. MijnHost **FETCH → DEPLOY**, actual live smoke test, force-refresh/cache bust, documented rollback commit and asset version.
- Do not claim a project is Public Ready until licensing, approved package and real download/template links are verified.

**Exit gate:** release candidate signed off only after visual browser testing, not merely static code checks.

## 6. Component acceptance tests (Given / When / Then)

- **Sphere:** Given a narrow phone viewport, when six spheres are rendered, then all project labels remain readable, links tappable, and no horizontal page overflow occurs.
- **Weather:** Given reduced-motion preference or the Off toggle, when a user opens any world, then weather stays static/disabled without changing content or blocking navigation.
- **Transitions:** Given keyboard navigation, when Enter opens a world, then its ordinary URL works even if an animation cannot initialize.
- **Reactor:** Given a keyboard-only visitor, when the Forge dialog opens, then focus moves inside, Escape closes it, and focus returns to the trigger.
- **Showcase:** Given a project without real screenshots, then conceptual artwork is labeled illustrative and no fictitious screenshot is presented.
- **Demo:** Given a FootballForge practice squad, when the visitor changes players, then only synthetic local data changes and the live team database is untouched.
- **Observatory:** Given an unavailable GitHub response, then truthful cached or empty content appears, not false current activity.
- **Timeline:** Given a milestone with `planned` status, then it is never visually labeled shipped.
- **Feedback:** Given a feedback action, then it opens a valid prefilled form and explains GitHub sign-in/public visibility.
- **Search:** Given Ctrl+K or mobile search, then users find published project names and can navigate without a mouse.

## 7. Work packages and proposed file boundaries

| New / updated file | Responsibility |
| --- | --- |
| `projects.json` | Backwards-compatible world, demo, screenshot, feedback and milestone references |
| `forge-world-runtime.js` | Active-world selection, preferences, page lifecycle, shared interfaces |
| `forge-universe.css` | Six-sphere desktop/mobile choreography and sixth Wild Rift identity |
| `forge-weather.js` + `forge-weather.css` | Lightweight weather rendering, toggle, reduced-motion and performance policies |
| `forge-transitions.js` | Link handoff and progressive-enhancement transitions |
| `forge-navigation.js` | World Navigator and central Forge Reactor controls |
| `project-showcase.js` + `project-showcase.css` | New world header, real screenshots, demo plug-ins and weather host |
| `forge-demos.js` | Isolated synthetic mini-demo implementations |
| `activity.json` / `milestones.json` | Reviewed release and development history |
| `forge-observatory.js` | Activity feed and Timeline presentation |
| `forge-search.js` | Shared command palette / public index |
| `.github/ISSUE_TEMPLATE/*` | Structured external feedback |
| `tests/*` | Config, UI, link, keyboard, no-motion and responsive smoke tests |
| `README.md` / `ROADMAP_3_0.md` | Product scope and actual implementation progress |

Aim for **small modules** added to the existing HTML/CSS/JS architecture; no compulsory framework migration, paid AI connection or database.

## 8. Priority-based working backlog (build sequence)

1. **NF3-00 — Foundations:** extend and validate the world data model; build shared runtime, demo fixtures and CSS design tokens.
2. **NF3-01 — Six portals:** implement Wild Rift identity, desktop/mobile distribution and routing.
3. **NF3-02 — Atmospheric core:** engine, seven weather presets, toggle, accessibility/performance fallback.
4. **NF3-04 — World Navigator:** navigation data and accessible selector.
5. **NF3-03 — World Transitions:** animations with progressive fallback and browser navigation correctness.
6. **NF3-05 — Forge Reactor:** three interactive actions, focus handling and mobile controls.
7. **NF3-06 — Interactive demos:** showcase refresh, sanitized screenshot workflow, four useful sample-driven demos and concept treatments.
8. **NF3-08 — Evolution Timeline:** event data and visual timeline.
9. **NF3-07 — Observatory:** reuse verified milestone/release data; add filtering and honest offline states.
10. **NF3-09 — Forge Feedback:** prefilled GitHub issue templates and privacy wording.
11. **NF3-10 — Command Search:** keyboard/mobile search over the now-stable content model.
12. **NF3-QA — Release gate:** cross-device validation, SEO, performance, accessibility, security, production deployment and rollback.

This is a **dependency order**, not a time estimate.

## 9. Hard boundaries and risk controls

- **Out of scope for 3.0:** user accounts, paywalls, public comments without moderation, authenticated cross-app access, integrated live AI processing, expensive video-heavy backgrounds, a complex admin CMS or a rewritten application backend.
- **Demo truthfulness:** demos never interact with live FootballForge, StudyForge, SAFe or Wild Rift databases. Never expose user or minor data.
- **Safe effects:** lightning remains an atmospheric glow/rune effect, not a sharp flash.
- **Live app access:** Wild Rift currently has no confirmed `links.visit` URL in the catalog; keep the CTA hidden until verified.
- **WoW:** only CurseForge is an approved distribution/updates route for future addons.
- **Static site controls:** client JS is not an admin permission system. Changes to editorial stages and activity require a trusted content/update workflow.
- **Operational simplicity:** retain GitHub source and manual MijnHost production deployment. Do not claim commits instantly update the live site.
- **Quality:** never trade usability, accessibility or page speed for visual effects.

## 10. Definition of Done: NOVYX 3.0

3.0 is release-ready only when all **ten approved features** meet the acceptance conditions, the six public spheres route to working showcases, all seven atmospheres have usable accessible fallbacks, the real screenshot/story distinction is honest, no demo writes production data, all downloads and external CTAs are verified, responsive/mobile and keyboard flows are tested, and the new build is live through MijnHost.

**Next coding action:** implement **Increment 0**, then **Increment 1**. The first immediately visible 3.0 alpha is the six-sphere universe with the shared weather engine. This document is the approved scope, **not a claim that 3.0 has been implemented**.
