import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import starlight from "@astrojs/starlight";

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
        { label: "Overview", link: "/docs/" },
        { label: "Python library", link: "/docs/library/" },
        { label: "Command-line interface", link: "/docs/cli/" },
        { label: "How Code Mortis compares", link: "/comparison/" },
        {
          label: "Coming soon",
          items: [
            { slug: "docs/app" },
            { slug: "docs/github-action" },
          ],
        },
      ],
      customCss: ["./src/styles/docs.css"],
      components: {
        Head: "./src/components/DocsHead.astro",
        ThemeProvider: "./src/components/DarkTheme.astro",
        ThemeSelect: "./src/components/Empty.astro",
        Search: "./src/components/Empty.astro",
      },
    }),
  ],
});
