# mortis-site

Code Mortis landing page and documentation, built with Astro, React, and Starlight. The documentation index at `/docs/` links to separate Python library and CLI guides.

```sh
bun install
bun run dev
```

```sh
bun run check
bun run build
bun run preview
```

The static build is written to `dist/`. Landing content is in `src/pages/index.astro` and the interactive review scope selector is in `src/components/ReviewCommands.tsx`. Edit the guides under `src/content/docs/docs/` and their sidebar entries in `astro.config.mjs`.
