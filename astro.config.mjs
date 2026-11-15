import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import starlight from "@astrojs/starlight";

export default defineConfig({
  integrations: [
    react(),
    starlight({
      title: "Code Mortis",
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
        ThemeProvider: "./src/components/DarkTheme.astro",
        ThemeSelect: "./src/components/Empty.astro",
        Search: "./src/components/Empty.astro",
      },
    }),
  ],
});
