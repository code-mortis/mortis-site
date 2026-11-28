# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Purpose

Static marketing site and documentation for Code Mortis (https://codemortis.dev). It has three parts: the "Review Desk" homepage, a standalone tool comparison page, and Starlight docs for the three products: Mortis Engine (CLI and Python library), the self-hosted Code Mortis App, and the GitHub Action. Built with Astro, Starlight, and the React integration, using Bun as the package manager and runner.

## Commands

```sh
bun install
bun run dev        # astro dev
bun run check      # astro check (type-checks .astro/.ts)
bun run build      # astro build -> dist/
bun run preview    # serve dist/
bun run test       # bun test (tests/site.test.ts)
```

- The tests check the built HTML in `dist/`, not the source. Run `bun run build` before `bun run test`, or they fail or pass against stale output. Run one test with `bun test -t "<name substring>"`.
- The repo has no lint script, no CI workflow, and no deploy config. The output is a static `dist/`.

## Architecture

- `astro.config.mjs` sets up Starlight. The docs sidebar is generated from `src/data/doc-sections.ts`, and Starlight's `Header`, `PageTitle`, `Head` and `ThemeSelect` are replaced by components in `src/components/` (`ThemeSelect` is replaced by `Empty.astro`, which removes it). Code blocks use custom Expressive Code backgrounds (`#2a2a28` dark, `#eaece9` light) that match `src/styles/docs.css`.
- Docs live under `src/content/docs/docs/<section>/<topic>.md(x)`, which is why the path has `docs/docs`. URLs are `/docs/<section>/<topic>/`. To add a topic, create the file and add its slug to `topics` in `doc-sections.ts`. The tests check that every section and topic appears in the sidebar, the `/docs/` directory and the section overview.
- `src/data/doc-bookmarks.ts` maps heading anchors from the old single-page guides (`/docs/cli/`, `/docs/library/`, `/docs/github-action/`) to their new pages. `src/pages/docs/[oldGuide].astro` builds noindex redirect pages from it. If you rename or move a docs heading, update this map. The tests check that every listed anchor still exists at its target.
- Homepage: `src/pages/index.astro` -> `MarketingLayout` -> `src/components/ReviewDesk.astro`, which is built from `src/components/review-desk/*` (section copy is in `content.ts`, client JS in `interactions.ts`). Styles are in `src/styles/review-desk.css` and `landing.css`.
- Comparison: `src/pages/comparison.astro` renders `src/content/comparison.md` (its frontmatter has a `checked` date) together with per-tool data in `src/content/comparison-tools.ts`. `/docs/comparison` redirects to `/comparison/`.
- Static images: product captures in the root `assets/` (outside `src/`) are imported by relative path from docs MDX, for example `../../../../../assets/docs/...`. Brand files are in `public/brand/orange/` (favicons, manifest, `share.png` used as og:image) and `src/assets/orange/` (raven logos).
- `src/layouts/Site.astro` is not imported by any page.

## Conventions and gotchas

- Product claims (CLI flags, versions, Python API names, Action inputs) must match the sibling repos under `../` (`mortis-engine`, plus the Action and App). Check them there before you change the docs. The tests pin some strings that come from the built pages, for example `Mortis Engine 0.1.5` on the comparison page, `mortis review --preview`, `preview_local`, `uv tool install mortis-engine`, and `Trivy 0.76.0 ... 0.76.2` in `action/ci`. If you change one of these, update `tests/site.test.ts` too.
- The tests also pin homepage anchors (`#tour`, `#setup`, `#agents`, `#inside-the-engine`, `#example-finding`, `#install`), the raven logo markup next to the "Code Mortis" text, and the comparison tool ids. Keep these when you restructure.
- `PRODUCT.md` and `DESIGN.md` describe the brand and design system: the charcoal "Night Watch" hero, the orange `#ff7545` signal color, and Inter typography. `.impeccable/` holds config for the impeccable design skill. The owner wants simple, focused changes without overengineering. Keep the existing typography, open rows and shared navigation.
- The site has no blog. Do not add blog links or placeholders back.
- Comparison content uses dated source links and must not be presented as benchmark results.
- Commit messages use Conventional Commits with scopes, for example `docs(action): ...` or `feat(review-desk): ...`.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
