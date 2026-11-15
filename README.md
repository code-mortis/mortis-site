# mortis-site

Minimal Code Mortis landing page built with Astro, React, and Starlight. Documentation lives at `/docs/` and intentionally has no body content.

```sh
bun install
bun run dev
```

```sh
bun run check
bun run build
bun run preview
```

The static build is written to `dist/`. Landing content is in `src/pages/index.astro`; the interactive review scope selector is in `src/components/ReviewCommands.tsx`. Add future documentation under `src/content/docs/docs/`.
