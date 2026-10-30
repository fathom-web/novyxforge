# NOVYX FORGE — Living Innovation Lab

An independent AI & Technology Lab: a cinematic home for projects, ideas and experiments.

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

To add a project without creating another hero sphere, add an entry in `projects.json`. The Project Explorer renders it automatically. The five hero spheres are hand-crafted visual highlights, while the catalog is scalable beyond five projects.

The `stage` values are `spark`, `exploring`, `building`, and `released`. Only mark a project as released when its public experience is actually available. The `links.visit` field may be `null` for unfinished apps. Concept data belongs in the `ideas` array.

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

## Hosting: MijnHost DirectAdmin

NOVYX uses **GitHub for source control and MijnHost for website hosting**. GitHub commits alone do not automatically update the live domain.

1. In DirectAdmin, open the **NOVYX FORGE Git repository** that deploys to the **main domain**.
2. Use **FETCH** to retrieve the new commits, then **DEPLOY**.
3. Verify `index.html`, `projects.json`, `forge-experience.js`, `forge-experience.css`, `project.html` and `safe-agile.html` have all arrived in the same main document root.
4. Test the five spheres, SAFe destination, WoW detail, category filters/search, Idea Vault and GitHub Pulse (including its fallback).
5. Force-refresh the browser. SSL should remain enabled.

Do not deploy the main site into the separate SAFe subdomain directory, or vice versa.

## Quality considerations

- Respect `prefers-reduced-motion` and provide keyboard focus states.
- Use local static JSON for consistent project metadata, escaping all text in the browser.
- Never present mock product previews as screenshots of real software.
- A code/static audit is **not** a substitute for full cross-browser or device testing.
- Public code availability does not imply a specific license for reuse.
