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

The static build is written to `dist/`. Edit the homepage in `src/components/ReviewDesk.astro`, the guides under `src/content/docs/docs/`, and their section order in `src/data/doc-sections.ts`.
