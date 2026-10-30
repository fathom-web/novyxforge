# WoW Addon Foundry — NOVYX FORGE

**Intended domain:** https://wow.novyxforge.com/  
**Source:** \`fathom-web/novyxforge/wow/\`  
**Type:** Static HTML / CSS / JavaScript site. No backend, login, database or build step required.

## Hosting on MijnHost

The new site is intentionally separate from the NOVYX FORGE homepage.

1. Create or select the subdomain **\`wow.novyxforge.com\`** (note the **v** in novyx).
2. Set that subdomain's **document root** to a directory containing the contents of the GitHub **\`wow/\`** folder. If your sync tool checks out the whole \`novyxforge\` repository, point the subdomain document root at its \`wow/\` child directory, **not** the repository root.
3. Make sure these files appear side by side in that directory: \`index.html\`, \`site.css\`, \`site.js\`, \`favicon.svg\`, \`robots.txt\`, and \`sitemap.xml\`.
4. Confirm the correct DNS record for the subdomain in your hosting control panel, and enable HTTPS with the hosting provider's valid certificate. Do **not** guess DNS IPs or target hosts.
5. Open \`https://wow.novyxforge.com/\` and test the desktop/mobile navigation and the external GitHub links.

**Alternative:** If the main domain's document root is already a complete checkout of this repository, \`https://novyxforge.com/wow/\` can act as a preview, but it is not a replacement for configuring the requested subdomain.

## Distribution policy

- NOVYX FORGE: marketing, project showcase and development status.
- GitHub: source code, tests and history.
- CurseForge: the only future public download/update channel for addons.
- **Never** link directly to GitHub ZIPs or expose install buttons on the showcase.
- Do not introduce a CurseForge link until a real approved project page exists.

## LifeForge status as of 30 October 2026

- Build 7, **0.8.0-alpha**
- 67 headless Lua tests reported passing in the addon repository
- Native Forever game-client testing **not yet verified**
- No approved/public CurseForge release
- Live screenshots are **not** available. The website's visual example is marked **illustrative concept**.
- User data remains in local WoW SavedVariables; there is no website-based account or character-data sync.

The authoritative source for current status is https://github.com/fathom-web/WoW-LifeForge . Update the copy when verified releases are available; never automate a false "Live" or "Download" state.

## Design

A related NOVYX FORGE sub-brand, with dark technical materials, a gold/amber fantasy accent, CSS-driven reactor artwork and a responsive native-layout proof of concept. No copyrighted Blizzard icons or screenshots are bundled.

## Security and accessibility

- External links use \`rel="noopener noreferrer"\` where they open a new window.
- Mobile menu supports keyboard Escape and \`aria-expanded\`.
- Motion respects \`prefers-reduced-motion\`.
- No third-party scripts, trackers, ads or analytics.
- Contact or feedback features require explicit future design; none are fabricated.

Test locally by serving the repository root using a static HTTP server and opening \`/wow/\`, or by using the existing NOVYX browser QA.
