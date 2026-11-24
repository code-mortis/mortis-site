import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import starlight from "@astrojs/starlight";
import { docSections } from "./src/data/doc-sections.ts";

export default defineConfig({
  site: "https://codemortis.dev",
  redirects: { "/docs/comparison": "/comparison/" },
  integrations: [
    react(),
    starlight({
      title: "Code Mortis",
      favicon: "/brand/orange/favicon.svg",
      logo: {
        dark: "./src/assets/orange/raven-orange-dark.svg",
        light: "./src/assets/orange/raven-orange-light.svg",
        replacesTitle: true,
      },
      description: "Website and documentation for Code Mortis.",
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/code-mortis/mortis-engine",
        },
      ],
      sidebar: [
        { label: "Documentation", slug: "docs" },
        ...docSections.map(({ id, label, topics }) => ({
          label,
          items: [
            { label: "Overview", slug: `docs/${id}` },
            ...topics.map(topic => ({ slug: `docs/${id}/${topic}` })),
          ],
        })),
        { label: "Compare tools", link: "/comparison/" },
      ],
      expressiveCode: {
        themes: ["github-dark", "github-light"],
        useStarlightUiThemeColors: true,
        customizeTheme(theme) {
          // Match the Docs palette when calculating syntax contrast and drawing the frames.
          const background = theme.type === "dark" ? "#2a2a28" : "#eaece9";
          theme.bg = background;
          theme.colors["editor.background"] = background;
          Object.assign(theme.styleOverrides.frames, {
            editorBackground: background,
            editorActiveTabBackground: background,
            terminalBackground: background,
          });
        },
        styleOverrides: {
          borderColor: "var(--sl-color-hairline)",
          borderRadius: "6px",
          focusBorder: "var(--sl-color-accent)",
          frames: { frameBoxShadowCssValue: "none" },
        },
      },
      customCss: ["./src/styles/docs.css"],
      components: {
        Header: "./src/components/DocsHeader.astro",
        PageTitle: "./src/components/DocsTitle.astro",
        Head: "./src/components/DocsHead.astro",
        ThemeSelect: "./src/components/Empty.astro",
      },
    }),
  ],
});
