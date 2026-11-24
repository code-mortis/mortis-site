# mortis-site

Code Mortis landing page and documentation, built with Astro, React, and Starlight. The documentation index at `/docs/` opens the Engine, App, and Action sections.

```sh
bun install
bun run dev
```

```sh
bun run check
bun run build
bun run preview
```

The static build is written to `dist/`. The homepage and its Review Desk preview share `src/components/ReviewDesk.astro`. During development, open `/mockups/` to compare Field Notes, Review Desk, and Workbench. Edit the guides under `src/content/docs/docs/` and their section order in `src/data/doc-sections.ts`.
