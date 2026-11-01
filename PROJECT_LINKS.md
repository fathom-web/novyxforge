# NOVYX / Project launch buttons

Every public NOVYX project showcase gets a primary launch button **above the fold**, showing the actual destination hostname. The CTA is generated from the existing \`projects.json\` \`links.visit\` value; no new destination is guessed.

- FootballForge → \`fathom-web.github.io/svdiemen/\`
- StudyForge → \`fathom-web.github.io/studyforge/\`
- The Fascination Files → Instagram
- SAFe Agile Forge → \`safeforge.novyxforge.com\` (beta)
- WoW LifeForge → \`wow.novyxforge.com\` (showcase, **not** a verified addon download)
- Spark Lab → local \`spark-lab.html\`
- Wild Rift Counter → no live destination in the source catalog; a *sample demo* and GitHub source are offered instead, not a fabricated live link.

Both the seven generated static \`world-*.html\` pages and the compatible query-string \`project.html?project=...\` render this CTA. The no-JavaScript static pages include working links. The JavaScript enhancement reuses the same catalog values.

To update a destination, edit \`projects.json\` and run \`node scripts/build-worlds.mjs\`; commit the generated pages along with the catalog changes. No need to touch the sphere visuals or change live site deployment settings.

External destinations open in a new tab, while the NOVYX project story remains open. Check the link URL and owner site status before treating a beta as released.
